import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectDropPageRoutingModule } from './select-drop-routing.module';

import { SelectDropPage } from './select-drop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectDropPageRoutingModule,
  ],
  declarations: [SelectDropPage],
})
export class SelectDropPageModule {}
