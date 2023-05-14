import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewDropLogisticsPage } from './new-drop-logistics.page';

const routes: Routes = [
  {
    path: '',
    component: NewDropLogisticsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewDropLogisticsPageRoutingModule {}
