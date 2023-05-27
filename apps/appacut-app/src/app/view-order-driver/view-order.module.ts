import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewOrderPageRoutingModule } from './view-order-routing.module';

import { ViewOrderPage } from './view-order.page';
import { OrderTrackingComponent } from '../order-tracking/order-tracking.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ViewOrderPageRoutingModule, SharedModule],
  declarations: [ViewOrderPage, OrderTrackingComponent],
})
export class ViewOrderPageModule {}
