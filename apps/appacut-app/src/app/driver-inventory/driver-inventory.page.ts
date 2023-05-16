import { Component, OnInit } from '@angular/core';
import { IDrop } from '@shoppr-monorepo/api-interfaces';
import { DropsService } from '../../core/drops';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { SelectDropPage } from '../select-drop/select-drop.page';
import { DriverReplenishWarehouseStockPageModule } from '../driver-replenish-warehouse-stock/driver-replenish-warehouse-stock.module';
import { DriverReplenishWarehouseStockPage } from '../driver-replenish-warehouse-stock/driver-replenish-warehouse-stock.page';

@Component({
  selector: 'shoppr-monorepo-driver-inventory',
  templateUrl: './driver-inventory.page.html',
  styleUrls: ['./driver-inventory.page.scss'],
})
export class DriverInventoryPage implements OnInit {
  allDrops$: Observable<IDrop[]> = this.dropsService.allDrops$;

  constructor(
    private dropsService: DropsService,
    private modalController: ModalController
    ) {}

  ngOnInit() {
    console.log(`Loading all drops...`)
    this.dropsService.getDrops().subscribe();
  }

  addDriverInventory() {
    const driverWarehouseWareshouseStockModal = this.modalController.create({
      component: DriverReplenishWarehouseStockPageModule
    });
    driverWarehouseWareshouseStockModal.then((modal) => modal.present());
  }

  replenishStock() {
    const driverWarehouseWareshouseStockModal = this.modalController.create({
      component: DriverReplenishWarehouseStockPage
    });
    driverWarehouseWareshouseStockModal.then((modal) => modal.present());
  }

  async replenishStock2() {
    const selectDropModal = await this.modalController.create({
      component: SelectDropPage,
    });
    await selectDropModal.present();
  }
}
