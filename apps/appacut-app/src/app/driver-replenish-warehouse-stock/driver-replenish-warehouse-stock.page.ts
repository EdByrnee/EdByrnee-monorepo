import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IDrop } from '@shoppr-monorepo/api-interfaces';
import { DropsService } from '../../core/drops';

@Component({
  selector: 'shoppr-monorepo-driver-replenish-warehouse-stock',
  templateUrl: './driver-replenish-warehouse-stock.page.html',
  styleUrls: ['./driver-replenish-warehouse-stock.page.scss'],
})
export class DriverReplenishWarehouseStockPage implements OnInit {

  drop: IDrop;

  quantity = 1;
  
  constructor(
    private modalController: ModalController,
    private dropService: DropsService
    ) {}

  ngOnInit() {}

  dismiss(){
    this.modalController.dismiss();
  }

  confirm(){
    this.dropService.replenishStock(this.drop.uuid, this.quantity);
    this.dismiss();
  }
}
