import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewMessageThreadPageRoutingModule } from './view-message-thread-routing.module';

import { ViewMessageThreadPage } from './view-message-thread.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewMessageThreadPageRoutingModule,
  ],
  declarations: [ViewMessageThreadPage],
})
export class ViewMessageThreadPageModule {}
