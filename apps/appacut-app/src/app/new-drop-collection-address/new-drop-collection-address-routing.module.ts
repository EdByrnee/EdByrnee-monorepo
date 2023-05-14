import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewDropCollectionAddressPage } from './new-drop-collection-address.page';

const routes: Routes = [
  {
    path: '',
    component: NewDropCollectionAddressPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewDropCollectionAddressPageRoutingModule {}
