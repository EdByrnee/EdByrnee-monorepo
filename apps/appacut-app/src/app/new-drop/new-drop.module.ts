import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewDropPageRoutingModule } from './new-drop-routing.module';

import { NewDropPage } from './new-drop.page';
import { UploadComponentModule } from '../_components/upload-component/upload-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewDropPageRoutingModule,
    ReactiveFormsModule,
    UploadComponentModule
  ],
  declarations: [NewDropPage],
})
export class NewDropPageModule {}
