import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignToDriverPageRoutingModule } from './assign-to-driver-routing.module';

import { AssignToDriverPage } from './assign-to-driver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignToDriverPageRoutingModule,
  ],
  declarations: [AssignToDriverPage],
})
export class AssignToDriverPageModule {}
