import { Injectable } from '@angular/core';
import { Deploy } from 'cordova-plugin-ionic';
import {
  AlertController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsService } from './analytics';
import { App } from '@capacitor/app';
import { ConfigService } from './config';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  updating$ = new BehaviorSubject<boolean>(false);
  currentVersion$ = new BehaviorSubject<string>('1.0.10');

  public binaryVersion = '';

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private analyticsService: AnalyticsService,
    private platform: Platform,
    private navController: NavController,
    private configService: ConfigService
  ) {
    App.getInfo().then((info) => {
      this.binaryVersion = info.version;
    });
  }

  private setUpdating(value: boolean) {
    this.updating$.next(value);
  }

  async downloadUpdate() {
    const currentVersion = await Deploy.getCurrentVersion();
    console.log(`Current version: ${currentVersion}`);
    const update = await Deploy.checkForUpdate();
    if (update.available) {
      this.setUpdating(true);
      await Deploy.downloadUpdate((progress: any) => {
        console.log(progress);
      });
      await Deploy.extractUpdate((progress: any) => {
        console.log(progress);
      });
      this.setUpdating(false);
      const alert = await this.alertController.create({
        header: 'Your app will now Re-load',
        message: 'We need to re-load your app to apply the latest updates.',
        buttons: [
          {
            text: 'Later',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            },
          },
          {
            text: 'Refresh',
            cssClass: 'primary',
            handler: this.reloadApp,
          },
        ],
      });
      alert.present();
    } else {
      console.log(`No updates available.`);
    }
  }

  async reloadApp() {
    Deploy.reloadApp();
    const versionNumber = this.currentVersion$.value;
    this.analyticsService.setUserProperty({
      name: 'version',
      value: versionNumber,
    });
    this.analyticsService.logEvent({
      name: 'apply_update',
      params: {
        version: versionNumber,
      },
    });
  }

  async forceBinaryUpdate() {
    this.navController.navigateRoot('/update-app');
  }

  async compareVersions(a: string, b: string) {
    if (a === b) {
      return 0;
    }
    const a_components = a.split('.');
    const b_components = b.split('.');
    const len = Math.min(a_components.length, b_components.length);
    for (let i = 0; i < len; i++) {
      if (parseInt(a_components[i]) > parseInt(b_components[i])) {
        return 1;
      }
      if (parseInt(a_components[i]) < parseInt(b_components[i])) {
        return -1;
      }
    }
    if (a_components.length > b_components.length) {
      return 1;
    }
    if (a_components.length < b_components.length) {
      return -1;
    }
    return 0;
  }

  async checkForBinaryUpdate() {
    this.configService.remoteConfig$.subscribe(async (config: any) => {

      const minBinary = config['minBinary'];
      if (!minBinary) return;

      console.log(`minBinary: ${minBinary}`);
      const currentBinary = this.binaryVersion || '1.0.10';
      console.log(`currentBinary: ${currentBinary}`);

      const needsUpdate = await this.compareVersions(currentBinary, minBinary);
      console.log(`needsUpdate: ${needsUpdate}`);

      if (needsUpdate === -1) {
        console.log(`Forcing binary update...`);
        this.forceBinaryUpdate();
      }
    });
    this.configService.getMobileAppConfig().subscribe();
  }
}
