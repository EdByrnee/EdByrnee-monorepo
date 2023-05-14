import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewDropPage } from './new-drop.page';

const routes: Routes = [
  {
    path: ':dropUuid',
    component: NewDropPage
  },
  {
    path: '',
    component: NewDropPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewDropPageRoutingModule {}
