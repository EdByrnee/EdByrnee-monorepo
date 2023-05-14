import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewBasketPageRoutingModule } from './view-basket-routing.module';

import { ViewBasketPage } from './view-basket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ViewBasketPageRoutingModule,
  ],
  declarations: [ViewBasketPage],
})
export class ViewBasketPageModule {}
