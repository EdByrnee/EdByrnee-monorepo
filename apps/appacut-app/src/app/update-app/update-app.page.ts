import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'shoppr-monorepo-update-app',
  templateUrl: './update-app.page.html',
  styleUrls: ['./update-app.page.scss'],
})
export class UpdateAppPage implements OnInit {
  platformType = 'web';

  constructor(
    private platform: Platform,
    private navController: NavController
    ) {
    // web, ios, android
    if (this.platform.is('ios')) {
      this.platformType = 'ios';
    }
    if (this.platform.is('android')) {
      this.platformType = 'android';
    }
  }

  ngOnInit() {}

  goToUpdate() {
    if (this.platformType === 'web') {
      window.open('https://localshelf.market/', '_blank');
    }
    if (this.platformType === 'android') {
      window.location.href =
        'https://play.google.com/store/apps/details?id=com.appacut.appacut';
    }
    if (this.platformType === 'ios') {
      window.location.href =
        'https://apps.apple.com/gb/app/local-shelf/id1667084964';
    }
  }

  goToHome(){
    this.navController.navigateRoot('/tabs/tab1');
  }
}
