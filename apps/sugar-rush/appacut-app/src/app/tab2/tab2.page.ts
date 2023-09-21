import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IMessageThread } from '@shoppr-monorepo/api-interfaces';
import { AuthService } from '../../core/auth';
import { MessageService } from '../../core/messages';
import { NotificationService } from '../../core/notifications';

@Component({
  selector: 'shoppr-monorepo-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  messageThreads$ = this.messageService.messageThreads;

  permissionStatus$ = this.notificationService.permissionStatus$;

  requestPermissions() {
    this.notificationService.requestPermissions();
  }

  constructor(
    private navController: NavController,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ionViewWillEnter() {
    this.notificationService.refreshPermissionStatus();
  }

  ngOnInit() {
    this.loadData();
    this.notificationService.getToken();
  }

  loadData(event?: any) {
    this.messageService.getMessageThreads().subscribe(
      (ok) => {
        console.log(ok);
        if (event) event.target.complete();
      },
      (err) => {
        console.log(err);
        if (event) event.target.complete();
      }
    );
  }

  private getParticipantUuid(mt: IMessageThread): string {
    const userUuid = this.authService.currentUser$.value?.uuid;
    if (mt.participant1UserUuid === userUuid) {
      return mt.participant2UserUuid;
    } else {
      return mt.participant1UserUuid;
    }
  }

  goToMessageThread(mt: IMessageThread) {
    console.log(mt);
    const otherUserUuid = this.getParticipantUuid(mt);
    console.log(otherUserUuid);
    this.navController.navigateForward(['view-message-thread', otherUserUuid]);
  }
}
