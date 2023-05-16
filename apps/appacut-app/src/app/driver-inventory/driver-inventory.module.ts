import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverInventoryPageRoutingModule } from './driver-inventory-routing.module';

import { DriverInventoryPage } from './driver-inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverInventoryPageRoutingModule,
  ],
  declarations: [DriverInventoryPage],
})
export class DriverInventoryPageModule {}
