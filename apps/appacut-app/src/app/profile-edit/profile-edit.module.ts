import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileEditPageRoutingModule } from './profile-edit-routing.module';

import { ProfileEditPage } from './profile-edit.page';
import { UploadComponentModule } from '../_components/upload-component/upload-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileEditPageRoutingModule,
    ReactiveFormsModule,
    UploadComponentModule
  ],
  declarations: [ProfileEditPage],
})
export class ProfileEditPageModule {}
