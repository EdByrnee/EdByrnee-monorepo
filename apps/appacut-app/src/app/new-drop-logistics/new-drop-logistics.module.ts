import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewDropLogisticsPageRoutingModule } from './new-drop-logistics-routing.module';
import { NgxStripeModule } from 'ngx-stripe';
import { NewDropLogisticsPage } from './new-drop-logistics.page';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewDropLogisticsPageRoutingModule,
    ReactiveFormsModule,
    NgxStripeModule,
  ],
  declarations: [NewDropLogisticsPage],
})
export class NewDropLogisticsPageModule {}
