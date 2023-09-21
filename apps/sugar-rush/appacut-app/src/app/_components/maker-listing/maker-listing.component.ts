import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  DropStatus,
  IDrop,
  IUserProfile,
} from '@shoppr-monorepo/api-interfaces';

@Component({
  selector: 'shoppr-monorepo-maker-listing',
  templateUrl: './maker-listing.component.html',
  styleUrls: ['./maker-listing.component.scss'],
})
export class MakerListingComponent implements OnInit {
  constructor(private navCtrl: NavController) {}

  @Input() maker: IUserProfile;

  ngOnInit(): void {}

  viewMaker(uuid: string) {
    this.navCtrl.navigateForward(`/view-maker/${uuid}`);
  }
}
