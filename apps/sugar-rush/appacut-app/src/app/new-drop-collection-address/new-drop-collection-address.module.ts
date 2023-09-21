import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewDropCollectionAddressPageRoutingModule } from './new-drop-collection-address-routing.module';

import { NewDropCollectionAddressPage } from './new-drop-collection-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewDropCollectionAddressPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewDropCollectionAddressPage],
})
export class NewDropCollectionAddressPageModule {}
