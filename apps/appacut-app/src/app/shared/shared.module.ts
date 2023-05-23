import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { UserProfilePipe } from './pipes/user-profile-pipe';

@NgModule({
  declarations: [DateAgoPipe, UserProfilePipe],
  imports: [CommonModule],
  exports: [DateAgoPipe, UserProfilePipe],
})
export class SharedModule {}
