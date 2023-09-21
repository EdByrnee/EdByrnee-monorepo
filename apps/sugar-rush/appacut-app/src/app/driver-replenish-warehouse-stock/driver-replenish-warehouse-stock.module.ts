import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverReplenishWarehouseStockPageRoutingModule } from './driver-replenish-warehouse-stock-routing.module';

import { DriverReplenishWarehouseStockPage } from './driver-replenish-warehouse-stock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverReplenishWarehouseStockPageRoutingModule,
  ],
  declarations: [DriverReplenishWarehouseStockPage],
})
export class DriverReplenishWarehouseStockPageModule {}
