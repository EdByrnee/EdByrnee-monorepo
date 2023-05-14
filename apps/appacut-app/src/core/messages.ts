import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
// import uuid
import * as uuid from 'uuid';
import { IMessageThread, INewMessage } from '@shoppr-monorepo/api-interfaces';
import { AuthService } from './auth';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public api = environment.api;

  public _messageThreads: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  public get messageThreads(): Observable<any[]> {
    return this._messageThreads.asObservable();
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public navController: NavController
  ) {}

  getMessageThreads(): Observable<IMessageThread[]> {
    return this.http.get<any[]>(this.api + '/api/messages/threads').pipe(
      tap((threads: IMessageThread[]) => {
        threads = threads.map((thread: IMessageThread) => {
          const threadCopy = JSON.parse(JSON.stringify(thread));
          return threadCopy;
        });
        this._messageThreads.next(threads);
      })
    );
  }

  openMessageThread(sendToUserUuid: string) {
    const newMessageThread: IMessageThread = {
      uuid: uuid.v4(),
      participant1UserUuid: this.authService.currentUser$.value?.uuid || '',
      participant2UserUuid: sendToUserUuid,
      messages: [],
      threadLatestRead: false,
      threadLatestMessageAt: '',
    };

    const currentMessageThreads: IMessageThread[] = JSON.parse(
      JSON.stringify(this._messageThreads.value)
    );

    // Check if message thread already exists
    const threadExists = currentMessageThreads.find(
      (thread: IMessageThread) => {
        // If participent1UserUuid or participent2UserUuid is the same as the recepientUuid
        return (
          thread.participant1UserUuid === sendToUserUuid ||
          thread.participant2UserUuid === sendToUserUuid
        );
      }
    );

    if (!threadExists) {
      currentMessageThreads.push(newMessageThread);
      this._messageThreads.next(currentMessageThreads);
    }

    this.navController.navigateForward(
      `/view-message-thread/${sendToUserUuid}`
    );
  }

  sendMessage(message: string, recepientUuid: string): Observable<any> {
    const newMessageBody: INewMessage = {
      uuid: uuid.v4(),
      messageBody: message,
      recepientUuid,
    };

    return this.http.post<any>(this.api + '/api/messages', newMessageBody).pipe(
      tap((res) => {
        this.addMessageToDataStore(message, newMessageBody);
      })
    );
  }

  addMessageToDataStore(recepientUuid: string, newMessageBody: INewMessage) {
    const senderUuid = this.authService.currentUser$.value?.uuid || '';

    // Make deep copy of current message threads
    const currentMessageThreads: IMessageThread[] = JSON.parse(
      JSON.stringify(this._messageThreads.value)
    );
    const thread = currentMessageThreads.find((thread: IMessageThread) => {
      // If participent1UserUuid or participent2UserUuid is the same as the recepientUuid
      return (
        thread.participant1UserUuid === recepientUuid ||
        thread.participant2UserUuid === recepientUuid
      );
    });

    const newMessage = {
      uuid: newMessageBody.uuid,
      message: newMessageBody.messageBody,
      senderUuid: senderUuid,
      recepientUuid: recepientUuid,
      messageThreadId: thread?.id,
      sender: true,
      createdAt: String(new Date()),
      updatedAt: String(new Date()),
    };

    if (thread) {
      thread.messages.push(newMessage);
      this._messageThreads.next(currentMessageThreads);
    } else {
      const newThread: IMessageThread = {
        uuid: uuid.v4(),
        participant1UserUuid: senderUuid,
        participant2UserUuid: recepientUuid,
        messages: [newMessage],
        threadLatestRead: false,
        threadLatestMessageAt: '',
      };
      currentMessageThreads.push(newThread);
      this._messageThreads.next(currentMessageThreads);
    }
  }
}
