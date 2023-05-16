import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverInventoryPage } from './driver-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: DriverInventoryPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverInventoryPageRoutingModule {}
