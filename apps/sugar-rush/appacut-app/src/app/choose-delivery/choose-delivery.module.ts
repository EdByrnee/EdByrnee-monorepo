import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseDeliveryPageRoutingModule } from './choose-delivery-routing.module';

import { ChooseDeliveryPage } from './choose-delivery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseDeliveryPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ChooseDeliveryPage],
})
export class ChooseDeliveryPageModule {}
