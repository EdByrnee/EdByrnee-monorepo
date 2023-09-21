import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectDropPage } from './select-drop.page';

const routes: Routes = [
  {
    path: '',
    component: SelectDropPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectDropPageRoutingModule {}
