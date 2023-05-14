import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponentModule } from '../_components/upload-component/upload-component.module';

import { ProfileEditPage } from './profile-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileEditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileEditPageRoutingModule {}
