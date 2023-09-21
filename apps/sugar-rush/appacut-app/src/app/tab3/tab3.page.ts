import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { tap } from 'rxjs';
import { AuthService } from '../../core/auth';
import { InvisibleReCaptchaComponent } from 'ngx-captcha';
import { FormBuilder } from '@angular/forms';
import { FormGroup, AbstractControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ViewChild } from '@angular/core';
import { UpdateService } from '../../core/update.service';

@Component({
  selector: 'shoppr-monorepo-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  emailForm: FormGroup;
  otpForm: FormGroup;

  recaptchaSiteKey = environment.recaptchaSiteKey;

  @ViewChild('captchaElem') captchaElem: InvisibleReCaptchaComponent;

  currentVersion$ = this.updateService.currentVersion$;
  binaryVersion = this.updateService.binaryVersion;

  otpSent = false;

  constructor(
    private navControl: NavController,
    public authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private updateService: UpdateService
  ) {
    this.emailForm = this.formBuilder.group({
      mobile_number: [
        '7588175278',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      recaptcha: ['', Validators.required],
    });
    this.otpForm = this.formBuilder.group({
      otp_code: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
    });
  }

  isAuthed$ = this.authService.isAuthed$.pipe(
    tap((value) => {
      console.log('isAuthed$', value);
    })
  );
  public currentUser$ = this.authService.currentUser$;

  async ngOnInit() {
    this.route.fragment.subscribe(async (fragmentUpdate: string | null) => {
      if (fragmentUpdate) await this.login(fragmentUpdate);
    });
    this.authService.getCurrentUser().subscribe();
  }

  async contactSupport() {
    window.open(
      'mailto:' +
        'support@localshelf.market' +
        '?subject=' +
        'LocalShelf Support' +
        '&body=' +
        'Hi, I have a question about LocalShelf.'
    );
  }

  handleSuccess(token: string): void {
    this.getRecaptcha()?.setValue(token);
    this.getRecaptcha()?.updateValueAndValidity();
  }

  handleReady(): void {
    this.captchaElem.execute();
  }

  private getRecaptcha(): AbstractControl | null {
    return this.emailForm.get('recaptcha');
  }

  async login(fragmentUpdate: string | null) {
    const loginToken = fragmentUpdate;
    if (loginToken) {
      const fullPageLoggingInLoader = await this.loadingController.create({
        message: 'Logging in...',
        duration: 15000,
      });

      await fullPageLoggingInLoader.present();

      this.authService.setTokenAndUpdateCurrentUser(loginToken).subscribe(
        (ok) => {
          this.navControl.navigateRoot('/tabs/tab1');
          fullPageLoggingInLoader.dismiss();
        },
        (err) => {
          fullPageLoggingInLoader.dismiss();
        }
      );
    }
  }

  goToNewDrop() {
    this.navControl.navigateForward('/new-drop');
  }
  goToEditProfile() {
    this.navControl.navigateForward('/profile-edit');
  }

  goOrders() {
    this.navControl.navigateForward('list-orders');
  }

  async signOut() {
    const alert = await this.alertController.create({
      header: 'Are you sure you wish to log out?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {},
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    if (role === 'confirm') this.authService.logout(true);
  }

  goSell() {
    this.navControl.navigateForward('/new-drop');
  }

  requestOTP() {
    this.authService
      .requestOtp(this.emailForm.controls['mobile_number'].value)
      .subscribe();
    this.otpSent = true;
  }

  loginViaOtp() {
    const otp_code = this.otpForm.controls['otp_code'].value;

    this.authService.loginViaOtp(otp_code).subscribe(
      (ok: any) => {
        const access_token = ok.access_token;

        this.authService
          .setTokenAndUpdateCurrentUser(access_token)
          .subscribe((ok) => {
            this.navControl.navigateRoot('/tabs/tab1');
          });
      },
      async (err) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Invalid OTP',
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  async goToDriverInventory() {
    this.navControl.navigateForward('/driver-inventory');
  }

  async requestMagicLink() {
    const email = this.emailForm.controls['email'].value;
    const pleaseWait = await this.loadingController.create({
      message: 'Please wait...',
      duration: 15000,
    });
    await pleaseWait.present();

    this.authService.requestMagicLink(email).subscribe(
      async (res: any) => {
        await pleaseWait.dismiss();
        console.log(res);
        const alert = await this.alertController.create({
          header: 'Please check your email.',
          subHeader:
            'You should recieve a magic link to login. Check your junk email folder if you do not see it.',
          buttons: ['OK'],
        });
        alert.present();
      },
      async (err: any) => {
        await pleaseWait.dismiss();
        console.log(err);
        const toast = await this.toastController.create({
          message: 'There was an unknown error. Please try again later.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      }
    );
  }

  holidayMode() {
    alert('This feature is coming soon! Stay tuned for updates.');
  }

  changePassword(password: any) {
    return this.authService.changePassword(password).subscribe();
  }

  async manuallySetToken() {
    const loginToken = prompt('Enter Token', '');
    if (loginToken) {
      const fullPageLoggingInLoader = await this.loadingController.create({
        message: 'Logging in...',
        duration: 15000,
      });

      await fullPageLoggingInLoader.present();

      this.authService.setTokenAndUpdateCurrentUser(loginToken).subscribe(
        (ok) => {
          this.navControl.navigateRoot('/tabs/tab1');
          fullPageLoggingInLoader.dismiss();
        },
        (err) => {
          fullPageLoggingInLoader.dismiss();
        }
      );
    }
  }

  sendResetPasswordEmail(email: any) {
    this.authService.requestPasswordReset(email).subscribe(
      (res) => {
        console.log(res);
        this.toastController
          .create({
            message: 'Please check your email.',
            duration: 2000,
          })
          .then((toast) => {
            toast.present();
          });
      },
      (err) => {
        console.log(err);
        this.toastController
          .create({
            message: 'There was an unknown error.',
            duration: 2000,
          })
          .then((toast) => {
            toast.present();
          });
      }
    );
  }

  goToPurchaseHistory() {
    this.navControl.navigateForward(['/list-orders', 'purchases']);
  }
  goToSalesHistory() {
    this.navControl.navigateForward(['/list-orders', 'sales']);
  }
  goToMaker(uuid: string) {
    this.navControl.navigateForward(['view-maker', uuid]);
  }
}
