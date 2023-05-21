import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackOrderPage } from './pack-order.page';

const routes: Routes = [
  {
    path: '',
    component: PackOrderPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackOrderPageRoutingModule {}
