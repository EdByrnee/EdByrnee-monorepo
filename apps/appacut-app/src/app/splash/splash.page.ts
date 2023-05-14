import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'shoppr-monorepo-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  public logo = '';

  constructor(private navController: NavController) {}

  ngOnInit() {
  }

  async goTabs() {
    await Preferences.set({ key: 'skipSplash', value: 'true' });
    this.navController.navigateRoot('/tabs');
  }
}
