import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { VerticalListingComponent } from '../_components/vertical-listing/vertical-listing.component';
import { HorizontalListingComponentModule } from '../_components/horizontal-listing/horizontal-listing.module';
import { MakerListingComponentModule } from '../_components/maker-listing/maker-listing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    HorizontalListingComponentModule,
    MakerListingComponentModule
  ],
  declarations: [Tab1Page, VerticalListingComponent],
})
export class Tab1PageModule {}
