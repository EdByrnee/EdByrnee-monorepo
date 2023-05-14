import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewMessageThreadPage } from './view-message-thread.page';

const routes: Routes = [
  {
    path: ':partnerUuid',
    component: ViewMessageThreadPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewMessageThreadPageRoutingModule {}
