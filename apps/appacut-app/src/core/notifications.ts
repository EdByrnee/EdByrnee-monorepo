import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  PushNotifications,
  PermissionStatus,
} from '@capacitor/push-notifications';
import { NativeSettings, IOSSettings } from 'capacitor-native-settings';
import { Platform } from '@ionic/angular';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Device, DeviceInfo } from '@capacitor/device';
import { MessageService } from './messages';
import { IMessageThread, INewMessage, IMessage } from '@shoppr-monorepo/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  api = environment.api;

  public permissionStatus$ = new BehaviorSubject<PermissionState>('prompt');

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private messagesService: MessageService
  ) {
    this.init();
    this.getToken();
  }

  async init() {
    FirebaseMessaging.subscribeToTopic({
      topic: 'all',
    });
    this.registerFCMToken();
    FirebaseMessaging.addListener('notificationReceived', (event) => {
      const notificationData: { message: IMessage } = event.notification.data as any;
      const notificationMessage: INewMessage = {
        uuid: notificationData.message.uuid,
        messageBody: notificationData.message.message,
        recepientUuid: notificationData.message.recepientUuid,
      };
      this.messagesService.addMessageToDataStore(
        notificationMessage.recepientUuid,
        notificationMessage
      );
    });
  }

  async getToken() {
    const token = await FirebaseMessaging.getToken();
    // console.log(`Here is the firebase messaging token: ${token}`);
    // console.log(token);
    // prompt('token', token.token);
    return token;
  }

  public async isNotificationsEnabled() {}

  public async requestPermissions() {
    this.refreshPermissionStatus();

    if (this.permissionStatus$.value === 'prompt') {
      this.requestPermissionsFromUser();
    }

    if (this.permissionStatus$.value === 'denied') {
      this.manuallyPromptPermissions();
    }
  }

  public async refreshPermissionStatus() {
    // If platform is not web
    if (this.platform.is('desktop')) {
      console.log('platform is desktop');
      this.permissionStatus$.next('prompt');
      return;
    }
    console.log('platform is not desktop');
    const permStatus: PermissionStatus =
      await FirebaseMessaging.checkPermissions();
    this.permissionStatus$.next(permStatus.receive as any);
  }

  private async requestPermissionsFromUser() {
    if (this.platform.is('desktop')) {
      this.permissionStatus$.next('granted');
      return;
    }
    const result = await FirebaseMessaging.requestPermissions();
    this.permissionStatus$.next(result.receive as any);
    if (this.permissionStatus$.value === 'granted') {
      // Subscribe to push notifications
      FirebaseMessaging.subscribeToTopic({
        topic: 'all',
      });
      this.registerFCMToken();
    }
  }

  private manuallyPromptPermissions() {
    // Use for when notifications have already been denied
    // Open settings using capacitor
    NativeSettings.openIOS({
      option: IOSSettings.App,
    });
  }

  async registerFCMToken() {
    // Register token with server+
    const token = await FirebaseMessaging.getToken();
    const deviceUuid: string = (await Device.getId()).uuid;

    return this.http
      .post(this.api + '/api/messages/register-fcm-token', {
        token: token.token,
        deviceUuid: deviceUuid,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
