import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupSigninPage } from './signup-signin.page';

const routes: Routes = [
  {
    path: '',
    component: SignupSigninPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupSigninPageRoutingModule {}
