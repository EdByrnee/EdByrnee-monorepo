import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'shoppr-monorepo-driver-replenish-warehouse-stock',
  templateUrl: './driver-replenish-warehouse-stock.page.html',
  styleUrls: ['./driver-replenish-warehouse-stock.page.scss'],
})
export class DriverReplenishWarehouseStockPage implements OnInit {

  quantity = 1;
  
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss(){
    this.modalController.dismiss();
  }

  confirm(){
    
  }
}
