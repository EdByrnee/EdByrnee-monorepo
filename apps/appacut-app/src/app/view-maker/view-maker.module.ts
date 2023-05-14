import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewMakerPageRoutingModule } from './view-maker-routing.module';

import { ViewMakerPage } from './view-maker.page';
import { GalleryToggleComponentComponent } from './gallery-toggle-component/gallery-toggle-component.component';
import { HandWrittenPageModule } from '../hand-written/hand-written.module';
import { HorizontalListingComponentModule } from '../_components/horizontal-listing/horizontal-listing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ViewMakerPageRoutingModule, HorizontalListingComponentModule, HandWrittenPageModule],
  declarations: [
    ViewMakerPage,
    GalleryToggleComponentComponent,
  ],
})
export class ViewMakerPageModule {}
