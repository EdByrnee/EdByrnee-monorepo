import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewDropImportantInfoPageRoutingModule } from './new-drop-important-info-routing.module';

import { NewDropImportantInfoPage } from './new-drop-important-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewDropImportantInfoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewDropImportantInfoPage],
})
export class NewDropImportantInfoPageModule {}
