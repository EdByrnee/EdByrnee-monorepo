import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, GalleryPhoto } from '@capacitor/camera';
import {
  ActionSheetController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { IUserProfile } from '@shoppr-monorepo/api-interfaces';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { AnalyticsService } from './analytics';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.api;

  public isAuthed$ = new BehaviorSubject<boolean>(false);
  public token = localStorage.getItem('access_token');

  public suggestedMakers$: BehaviorSubject<IUserProfile[]> =
    new BehaviorSubject<IUserProfile[]>([]);

  public currentUser$: BehaviorSubject<IUserProfile | null> =
    new BehaviorSubject<IUserProfile | null>(null);

  public postcode$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(this.getPostcode());

  public demoMode$ = new BehaviorSubject<boolean>(true);

  constructor(
    private navController: NavController,
    private http: HttpClient,
    private acitonSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private analyticsService: AnalyticsService
  ) {
    const isAuthed = this.isTokenSet();
    this.isAuthed$.next(isAuthed);
  }

  setDemoMode(value: boolean) {
    this.demoMode$.next(value);
  }

  private isTokenSet(): boolean {
    return (
      localStorage.getItem('access_token') !== null &&
      localStorage.getItem('access_token') !== undefined &&
      localStorage.getItem('access_token') !== 'null'
    );
  }

  requestOtp(mobile_number: string) {
    return this.http
      .post(this.apiUrl + '/api/auth/request-otp', {
        mobile_number,
      })
      .pipe(
        tap((ok: any) => {
          // Save otp token to local storage
          console.log('otp_token', ok.otp_token)
          localStorage.setItem('otp_token', ok.otp_token);
        })
      );
  }

  loginViaOtp(otp_code: string) {
    const body = {
      otp_code,
      otp_token: localStorage.getItem('otp_token'),
    };

    return this.http.post(this.apiUrl + '/api/auth/verify-otp', body);
  }

  requestMagicLink(email: string) {
    this.analyticsService.logEvent({
      name: 'request_magic_link',
      params: {
        email: email,
      },
    });
    return this.http.post(this.apiUrl + '/api/auth/magic-link', { email });
  }

  setPostcode(postcode: string) {
    localStorage.setItem('postcode', postcode);
    this.postcode$.next(postcode);
    this.analyticsService.logEvent({
      name: 'set_postcode',
      params: {},
    });
    if (this.isAuthed$.value === true) {
      this.updateCurrentUserProfile(
        { lastSetPostcode: postcode },
        [],
        []
      ).subscribe();
    }
  }

  getPostcode() {
    return localStorage.getItem('postcode');
  }

  // updateCurrentUserProfile(userProfileUpdates: Partial<IUserProfile>) {
  //   return this.http
  //     .patch(this.apiUrl + '/api/auth/users/profile', userProfileUpdates)
  //     .pipe(
  //       tap((ok: any) => {
  //         // Update the current user
  //         const updatedProfile = {
  //           ...this.currentUser$.value,
  //           ...userProfileUpdates,
  //         };
  //         this.currentUser$.next(updatedProfile as IUserProfile);
  //       })
  //     );
  // }

  updateCurrentUserProfile(
    userProfileUpdates: Partial<IUserProfile>,
    imageUuidsToRemove: string[],
    newPhotos: Blob[]
  ): Observable<any> {
    // Attach the photo array to the create drop request
    const formData = new FormData();
    formData.append('userProfileUpdates', JSON.stringify(userProfileUpdates));
    formData.append('imageUuidsToRemove', JSON.stringify(imageUuidsToRemove));
    for (let i = 0; i < newPhotos.length; i++) {
      formData.append('photos', newPhotos[i]);
    }

    // Create and send the request
    console.log(`Loggin formData`);
    console.log(formData);
    const req = new HttpRequest(
      'PATCH',
      this.apiUrl + '/api/auth/users/profile',
      formData,
      {
        // reportProgress: true,
      }
    );
    return this.http.request(req).pipe(
      tap((ok: any) => {
        // Update the current user
        const updatedProfile = {
          ...this.currentUser$.value,
          ...userProfileUpdates,
        };
        userProfileUpdates.userPhotos = userProfileUpdates.userPhotos?.filter(
          (photo) => {
            // Delete if in imageUuidsToRemove
            return !imageUuidsToRemove.includes(photo.uuid);
          }
        );

        // Add new photos
        const newUserPhotos = newPhotos.map((photo) => {
          const generatedPhoto = {
            uuid: 'updateThisWithRealData',
            photo_url: 'updateThisWithRealData',
          };
          return generatedPhoto;
        });

        updatedProfile.userPhotos =
          userProfileUpdates.userPhotos?.concat(newUserPhotos);

        this.currentUser$.next(updatedProfile as IUserProfile);
      })
    );
  }

  setTokenAndUpdateCurrentUser(loginToken: string) {
    localStorage.setItem('access_token', loginToken);

    return this.getCurrentUser().pipe(
      tap((ok) => {
        this.isAuthed$.next(true);
        this.analyticsService.setUser({
          email: this.currentUser$.value?.email,
          id: this.currentUser$.value?.uuid,
        });
        this.analyticsService.logEvent({
          name: 'login',
          params: {},
        });

        // If the user has set a postcode, update their profile
        // As this might have been set before they logged in
        const currentPostcode = this.postcode$.value;
        if (currentPostcode) {
          this.updateCurrentUserProfile(
            {
              lastSetPostcode: currentPostcode,
            },
            [],
            []
          ).subscribe();
        }
      }),
      catchError(async (err) => {
        this.logout();
        const errorMessage = await this.toastController.create({
          message: 'There was an error logging in. Please try again.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        });
        errorMessage.present();
      })
    );
  }

  async logout(clearPostcode: boolean = false) {
    this.navController.navigateRoot('/tabs/tab3');
    if (clearPostcode) localStorage.clear();
    this.isAuthed$.next(false);
    this.analyticsService.logEvent({
      name: 'logout',
      params: {},
    });

    const loginNotice = await this.toastController.create({
      message: 'Please login to continue',
      duration: 3000,
      position: 'bottom',
      color: 'primary',
    });

    await loginNotice.present();

    // localStorage.removeItem('access_token');
  }

  public async getAccessToken(): Promise<string | null> {
    return Promise.resolve(localStorage.getItem('access_token'));
  }

  changePassword(password: string) {
    return this.http.post(this.apiUrl + '/auth/reset-password', {
      password,
    });
  }

  getSuggestedMakers() {
    return this.http
      .get<IUserProfile[]>(this.apiUrl + '/api/auth/makers/suggested')
      .pipe(
        tap((res) => {
          this.suggestedMakers$.next(res);
        })
      );
  }

  getCurrentUser() {
    return this.http
      .get<IUserProfile>(this.apiUrl + '/api/auth/users/profile')
      .pipe(
        tap((user: IUserProfile) => {
          this.currentUser$.next(user);
          if (!user.username) {
            this.navController.navigateRoot('/complete-profile');
          }
        })
      );
  }

  getUserProfile(userUuid: string) {
    return this.http.get<IUserProfile>(
      this.apiUrl + '/api/auth/users/' + userUuid + '/profile'
    );
  }

  signIn(email: string, password: string) {
    return this.http
      .post<any>(this.apiUrl + '/api/auth/login', {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
        })
      );
  }

  requestPasswordReset(email: string) {
    return this.http.post<any>(this.apiUrl + '/api/auth/password-reset-email', {
      email,
    });
  }

  uploadProfilePicture(file: Blob) {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post(this.apiUrl + '/api/auth/profile-photo', formData);
  }

  async showChangeProfilePhotoActions() {
    const actionSheet = await this.acitonSheetController.create({
      header: 'New Profile Photo',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.loadPhotosFromLibrary();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async readFileAsBlob(path: string): Promise<Blob> {
    const response = await fetch(path);
    const blob = await response.blob();
    return blob;
  }

  async loadPhotosFromLibrary() {
    const imagesToUpload = await Camera.pickImages({
      quality: 80,
      limit: 1,
      width: 1200,
      height: 1200,
    });
    const photos: GalleryPhoto[] = imagesToUpload.photos;

    // Show loading
    const loading = await this.loadingController.create({
      message: 'Uploading...',
    });
    await loading.present();
    this.uploadProfilePicture(
      await this.readFileAsBlob(photos[0].webPath)
    ).subscribe(
      async (res) => {
        console.log(res);
        loading.dismiss();

        // Show success message
        const successMsg = await this.toastController.create({
          message: 'Profile photo updated. Reloading.',
          color: 'success',
        });

        await successMsg.present();
        this.getCurrentUser().subscribe(async (ok) => {
          await successMsg.dismiss();
          const successMsg2 = await this.toastController.create({
            message: 'Profile photo updated.',
            duration: 2000,
            color: 'success',
          });

          await successMsg2.present();
        });
      },
      async (err) => {
        // Show user success message with icon
        const errorMsg = await this.toastController.create({
          message: 'Error uploading photo',
          duration: 2000,
          color: 'danger',
        });

        await errorMsg.present();

        loading.dismiss();
      }
    );
  }

  checkPostcode(postcode: string) {
    return this.http.get('https://api.postcodes.io/postcodes/' + postcode);
  }

  getFirstPartOfPostcode() {
    return this.getPostcode()?.split(' ')[0];
  }
}
