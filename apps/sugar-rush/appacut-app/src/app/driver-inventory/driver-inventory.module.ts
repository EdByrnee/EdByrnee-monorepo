import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverInventoryPageRoutingModule } from './driver-inventory-routing.module';

import { DriverInventoryPage } from './driver-inventory.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverInventoryPageRoutingModule,
    SharedModule
  ],
  declarations: [DriverInventoryPage],
})
export class DriverInventoryPageModule {}
