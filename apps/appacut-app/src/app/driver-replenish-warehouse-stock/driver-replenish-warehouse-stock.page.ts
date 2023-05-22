import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ICreateDropItem, IDrop } from '@shoppr-monorepo/api-interfaces';
import { DropsService } from '../../core/drops';
import * as uuid from 'uuid';

@Component({
  selector: 'shoppr-monorepo-driver-replenish-warehouse-stock',
  templateUrl: './driver-replenish-warehouse-stock.page.html',
  styleUrls: ['./driver-replenish-warehouse-stock.page.scss'],
})
export class DriverReplenishWarehouseStockPage implements OnInit {
  drop: IDrop;

  quantity = 1;

  expirationDate: string;

  constructor(
    private modalController: ModalController,
    private dropService: DropsService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  confirm() {
    // Generate
    const newDropItems: ICreateDropItem[] | any[] = [];

    for (let i = 0; i < this.quantity; i++) {
      newDropItems.push({
        uuid: uuid.v4(),
        expirationDate: this.expirationDate
      });
    }

    this.dropService.replenishWareshouseStock(this.drop.uuid, newDropItems).subscribe(async (ok)=>{

      const alert = await this.alertController.create({
        header: 'Success Replenishing Warehouse Stock',
        message: 'Perfect !',
        buttons: ['OK'],
      });
      await alert.present();

    }, async (err)=>{

      const alert = await this.alertController.create({
        header: 'Error Replenishing Warehouse Stock',
        message: err.error.message,
        buttons: ['OK'],
      });
      await alert.present();

    });
    this.dismiss();
  }
}
