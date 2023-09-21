import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetLocalDeliveryRadiusPage } from './set-local-delivery-radius.page';

const routes: Routes = [
  {
    path: '',
    component: SetLocalDeliveryRadiusPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetLocalDeliveryRadiusPageRoutingModule {}
