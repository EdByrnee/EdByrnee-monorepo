import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonContent, NavController, ToastController } from '@ionic/angular';
import { IMessageThread } from '@shoppr-monorepo/api-interfaces';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../core/auth';
import { MessageService } from '../../core/messages';

@Component({
  selector: 'shoppr-monorepo-view-message-thread',
  templateUrl: './view-message-thread.page.html',
  styleUrls: ['./view-message-thread.page.scss'],
})
export class ViewMessageThreadPage implements OnInit {
  partnerUuid: string;
  message = '';

  loading = false;

  @ViewChild(IonContent, { static: false }) content: IonContent;

  currentUser$ = this.authService.currentUser$;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private alertController: AlertController,
    public authService: AuthService,
    private navController: NavController,
    private toastController: ToastController
  ) {
    this.partnerUuid = this.route.snapshot.paramMap.get('partnerUuid') || '';
  }

  messageThread$: Observable<any> = this.messageService.messageThreads.pipe(
    map((threads) => {
      const returnValue =
        threads.find((thread: IMessageThread) => {
          if (
            thread.participant1UserUuid === this.partnerUuid ||
            thread.participant2UserUuid === this.partnerUuid
          ) {
            return true;
          } else return false;
        }) || [];

      console.log(returnValue);
      return returnValue;
    })
  );

  ngOnInit() {
    this.messageService.getMessageThreads().subscribe();
  }

  viewMaker(uuid: string){
    this.navController.navigateForward(['view-maker', uuid]);
  }

  loadData(event?: any) {
    if (!event) this.loading = true;
    this.authService.getSuggestedMakers().subscribe();
    this.messageService.getMessageThreads().subscribe(
      (ok) => {
        if (!event) this.loading = false;
        console.log(ok);
        if (event) event.target.complete();
      },
      async (err) => {
        if (!event) this.loading = false;
        console.log(err);
        if (event) event.target.complete();
        const errorToast = await this.toastController.create({
          message: `There was an error. Please try again later.`,
          duration: 2000,
          color: 'danger',
        });
        errorToast.present();
      }
    );
  }

  ionViewDidEnter() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(()=>{
      this.content.scrollToBottom(500);
    },200)
  }

  sendMessage() {
    const recepientUserUuid = this.partnerUuid;
    this.messageService.sendMessage(this.message, recepientUserUuid).subscribe(
      (res) => {
        this.message = '';
        console.log('scrolling to bottom...');
        this.scrollToBottom();
      },
      (err) => {
        console.log(err);
        this.alertController.create({
          header: 'Error',
          message: 'There was an error sending your message',
          buttons: ['OK'],
        });
      }
    );
  }
}
