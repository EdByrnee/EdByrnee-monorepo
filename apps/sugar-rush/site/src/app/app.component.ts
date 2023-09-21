import { Component } from '@angular/core';

@Component({
  selector: 'shoppr-monorepo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'site';

  goIos() {
    alert('iPhone app coming soon');
    // Go to app store on new tab
    // window.open(
    //   'https://apps.apple.com/gb/app/local-shelf/id1667084964',
    //   '_blank'
    // );
  }

  goAndroid() {
    alert('Android app coming soon');
    // window.open(
    //   'https://play.google.com/store/apps/details?id=market.localshelf',
    //   '_blank'
    // );
  }
}
