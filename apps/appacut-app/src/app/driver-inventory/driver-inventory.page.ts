import { Component, OnInit } from '@angular/core';
import { IDrop, IDropItem } from '@shoppr-monorepo/api-interfaces';
import { DropsService } from '../../core/drops';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { DriverReplenishWarehouseStockPageModule } from '../driver-replenish-warehouse-stock/driver-replenish-warehouse-stock.module';
import { DriverReplenishWarehouseStockPage } from '../driver-replenish-warehouse-stock/driver-replenish-warehouse-stock.page';
import { DropItemsService } from '../../core/drop-items';

@Component({
  selector: 'shoppr-monorepo-driver-inventory',
  templateUrl: './driver-inventory.page.html',
  styleUrls: ['./driver-inventory.page.scss'],
})
export class DriverInventoryPage implements OnInit {

  allDrops$: Observable<IDrop[]> = this.dropsService.allDrops$;

  currentUserDropItems$: Observable<IDropItem[]> = this.dropItemsService.currentUserDropItems$;

  selectedDrop:IDrop | null  = null;

  constructor(
    private dropsService: DropsService,
    private dropItemsService: DropItemsService,
    private modalController: ModalController
    ) {}

  ngOnInit() {
    console.log(`Loading all drops...`)
    this.dropsService.getDrops().subscribe(drops=>{
      this.selectedDrop = drops[0];
    });
    this.dropItemsService.getDropItemsForCurrentUser().subscribe();
  }

  addDriverInventory() {
    const driverWarehouseWareshouseStockModal = this.modalController.create({
      component: DriverReplenishWarehouseStockPageModule
    });
    driverWarehouseWareshouseStockModal.then((modal) => modal.present());
  }

  replenishStock() {
    const driverWarehouseWareshouseStockModal = this.modalController.create({
      component: DriverReplenishWarehouseStockPage,
      componentProps: {
        drop: this.selectedDrop
      }
    });
    driverWarehouseWareshouseStockModal.then((modal) => modal.present());
  }
}
