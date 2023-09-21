import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DropStatus, IDrop } from '@shoppr-monorepo/api-interfaces';

@Component({
  selector: 'shoppr-monorepo-horizontal-listing',
  templateUrl: './horizontal-listing.component.html',
  styleUrls: ['./horizontal-listing.component.scss'],
})
export class HorizontalListingComponent implements OnInit {

  @Input() displayStatus = false;

  _drop: IDrop;

  isActive: boolean;

  status: DropStatus;

  isSoldOut: boolean;

  @Input() set drop(d: IDrop){
    this._drop = d;
    this.status = d.status;
    this.isActive = this.status === 'ACTIVE_LISTING';
    this.isSoldOut = this._drop.qty_available < 1;
  }
  constructor(private navController: NavController) {}

  ngOnInit(): void {}

  viewDrop(id: string) {
    this.navController.navigateForward(`drop-view/${id}`);
  }
}
