import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { ModalController } from '@ionic/angular';
import { SetLocationPage } from '../app/set-location/set-location.page';
import { Preferences } from '@capacitor/preferences';
import { LoginModalPage } from '../app/login-modal/login-modal.page';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController
  ) {}

  postcodeModal: HTMLIonModalElement;

  public initAppRouting() {
    this.authService.isAuthed$.subscribe((isAuthed: boolean) => {
      if (isAuthed) {
        this.authService.getCurrentUser().subscribe();
      }
    });
  }

  public async initTabsRouting() {
    if (!this.isPostcodeSet()) this.requestPostcode();
  }

  private async requestPostcode() {
    const requestPostcodeModal = await this.modalCtrl.create({
      component: SetLocationPage,
      swipeToClose: true,
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
    });
    await requestPostcodeModal.present();
    this.postcodeModal = requestPostcodeModal;
  }

  private isPostcodeSet() {
    return this.authService.getPostcode();
  }

  async isSplashComplete() {
    const result = (await Preferences.get({ key: 'skipSplash' })).value;
    return result ? true : false;
  }

  async requestLogin() {
    const requestLoginModal: HTMLIonModalElement = await this.modalCtrl.create({
      component: LoginModalPage,
      swipeToClose: true,
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
    });
    await requestLoginModal.present();
    this.postcodeModal = requestLoginModal;
  }

  setPostcodeModalBreakpoint(breakpoint: number) {
    this.postcodeModal.setCurrentBreakpoint(breakpoint);
  }

  setLoginModalBreakpoint(breakpoint: number) {
    this.postcodeModal.setCurrentBreakpoint(breakpoint);
  }
}
