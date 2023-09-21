import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DropViewPageRoutingModule } from './drop-view-routing.module';

import { DropViewPage } from './drop-view.page';

import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, IonicModule, DropViewPageRoutingModule, GoogleMapsModule],
  declarations: [DropViewPage],
})
export class DropViewPageModule {}
