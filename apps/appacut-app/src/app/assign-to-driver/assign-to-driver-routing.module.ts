import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignToDriverPage } from './assign-to-driver.page';

const routes: Routes = [
  {
    path: '',
    component: AssignToDriverPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignToDriverPageRoutingModule {}
