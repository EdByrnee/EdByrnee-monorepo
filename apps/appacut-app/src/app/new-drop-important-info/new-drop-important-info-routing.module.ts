import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewDropImportantInfoPage } from './new-drop-important-info.page';

const routes: Routes = [
  {
    path: '',
    component: NewDropImportantInfoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewDropImportantInfoPageRoutingModule {}
