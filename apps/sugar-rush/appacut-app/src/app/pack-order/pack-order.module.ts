import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackOrderPageRoutingModule } from './pack-order-routing.module';

import { PackOrderPage } from './pack-order.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PackOrderPageRoutingModule],
  declarations: [PackOrderPage],
})
export class PackOrderPageModule {}
