import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetLocalDeliveryRadiusPageRoutingModule } from './set-local-delivery-radius-routing.module';

import { SetLocalDeliveryRadiusPage } from './set-local-delivery-radius.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetLocalDeliveryRadiusPageRoutingModule,
    ReactiveFormsModule,
    GoogleMapsModule
  ],
  declarations: [SetLocalDeliveryRadiusPage],
})
export class SetLocalDeliveryRadiusPageModule {}
