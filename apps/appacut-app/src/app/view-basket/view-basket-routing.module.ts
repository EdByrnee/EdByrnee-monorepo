import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBasketPage } from './view-basket.page';

const routes: Routes = [
  {
    path: '',
    component: ViewBasketPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewBasketPageRoutingModule {}
