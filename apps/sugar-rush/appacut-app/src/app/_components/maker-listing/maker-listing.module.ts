import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MakerListingComponent } from './maker-listing.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [MakerListingComponent],
  exports: [MakerListingComponent],
})
export class MakerListingComponentModule {}
