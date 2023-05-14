import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UploadComponent } from './upload-component.component';

@NgModule({
  imports: [IonicModule,CommonModule],
  declarations: [UploadComponent],
  exports: [UploadComponent],
})
export class UploadComponentModule {}
