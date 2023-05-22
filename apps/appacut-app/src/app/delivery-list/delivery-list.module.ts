import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryListPageRoutingModule } from './delivery-list-routing.module';

import { DeliveryListPage } from './delivery-list.page';
import { GoogleMapsModule } from '@angular/google-maps';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { UserProfilePipe } from '../pipes/user-profile-pipe';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryListPageRoutingModule,
    GoogleMapsModule,
  ],
  declarations: [DeliveryListPage, DateAgoPipe, UserProfilePipe],
})
export class DeliveryListPageModule {}
