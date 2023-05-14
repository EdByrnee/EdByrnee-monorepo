import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewMakerPage } from './view-maker.page';

const routes: Routes = [
  {
    path: '',
    component: ViewMakerPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewMakerPageRoutingModule {}
