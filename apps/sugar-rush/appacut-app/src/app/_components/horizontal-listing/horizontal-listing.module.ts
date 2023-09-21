import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HorizontalListingComponent } from './horizontal-listing.component';

@NgModule({
  imports: [IonicModule,CommonModule],
  declarations: [HorizontalListingComponent],
  exports: [HorizontalListingComponent],
})
export class HorizontalListingComponentModule {}
