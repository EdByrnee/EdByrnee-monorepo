import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverReplenishWarehouseStockPage } from './driver-replenish-warehouse-stock.page';

const routes: Routes = [
  {
    path: '',
    component: DriverReplenishWarehouseStockPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverReplenishWarehouseStockPageRoutingModule {}
