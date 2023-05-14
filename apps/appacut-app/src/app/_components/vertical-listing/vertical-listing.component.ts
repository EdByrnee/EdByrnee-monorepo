import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IDrop } from '@shoppr-monorepo/api-interfaces';

@Component({
  selector: 'shoppr-monorepo-vertical-listing',
  templateUrl: './vertical-listing.component.html',
  styleUrls: ['./vertical-listing.component.scss'],
})
export class VerticalListingComponent implements OnInit {
  @Input() drop: IDrop;
  constructor(private navController: NavController) {}

  ngOnInit(): void {}

  get isSoldOut(){
    return this.drop.qty_available < 1;
  }

  viewDrop(id: string) {
    this.navController.navigateForward(`drop-view/${id}`);
  }
}
