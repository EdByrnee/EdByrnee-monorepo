import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GalleryPhoto } from '@capacitor/camera';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { IUserProfile } from '@shoppr-monorepo/api-interfaces';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth';
import { UploadComponent } from '../_components/upload-component/upload-component.component';

@Component({
  selector: 'shoppr-monorepo-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  changesMade = false;
  photosEdited = false;

  newImages: any[] = [];

  currentUser: IUserProfile | null = null;

  @ViewChild('upload', { static: false }) uploadComponent: UploadComponent;

  public currentUser$: Observable<IUserProfile | null> =
    this.authService.currentUser$;

  public currentUserForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.email]),
    website: new FormControl('', [Validators.required]),
    bio: new FormControl('', [Validators.required]),
    story: new FormControl('', [Validators.required]),
  });

  public profileCompleteMode = false;

  constructor(
    public authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.currentUser$.subscribe((user) => {
      if (!user) return;

      this.currentUser = user;
      this.newImages = user.userPhotos?.map((photo) => {
        return {
          uuid: photo.uuid,
          webPath: photo.photo_url,
        } as any;
      }) as GalleryPhoto[];

      this.currentUserForm.patchValue({
        username: user?.username,
        name: user?.name,
        website: user?.website,
        bio: user?.bio,
        story: user?.story,
      });

      this.currentUserForm.controls['username'].disable();

      this.currentUserForm.valueChanges.subscribe((changes) => {
        // If changes are made, enable the save button
        this.changesMade = true;
      });
    });
  }

  photosEditedChange(event: any) {
    this.photosEdited = event;
  }

  getUpdatedValues(): Partial<IUserProfile> {
    const updatedValues = this.currentUserForm.value;
    return updatedValues as Partial<IUserProfile>;
  }

  async saveChanges() {
    const imageUuidsToRemove: string[] =
      this.currentUser?.userPhotos
        .filter((photo) => {
          return !this.newImages.find((newImage) => {
            return newImage.uuid === photo.uuid;
          });
        })
        .map((photo) => {
          return photo.uuid;
        }) || [];

    const imageBlobs = [];
    const newImages = this.newImages.filter((newImage) => {
      return !this.currentUser?.userPhotos.find((photo) => {
        return photo.uuid === newImage.uuid;
      });
    });
    for (const photo of newImages) {
      imageBlobs.push(await this.authService.readFileAsBlob(photo.webPath));
    }

    const loading = await this.loadingController.create({
      message: 'Updating Profile...',
    });
    await loading.present();

    this.authService
      .updateCurrentUserProfile(
        this.getUpdatedValues(),
        imageUuidsToRemove,
        imageBlobs
      )
      .subscribe(
        async (ok) => {
          if (ok.type === 4) {
            await loading.dismiss();
            const toast = await this.toastController.create({
              message: 'Your profile has been updated.',
              duration: 2000,
              color: 'success',
            });
            await toast.present();

            this.uploadComponent.setPhotosEdited(false);
            this.authService.getCurrentUser().subscribe();
          }
        },
        async (error) => {
          await loading.dismiss();
          const toast = await this.toastController.create({
            message:
              'There was an error updating your profile. Please try again.',
            duration: 2000,
            color: 'danger',
          });
          await toast.present();
        }
      );
  }

  // saveChanges() {
  //   this.authService
  //     .updateCurrentUserProfile(this.getUpdatedValues())
  //     .subscribe(
  //       async (ok) => {
  //         const alert = await this.alertController.create({
  //           header: 'Profile Updated',
  //           message: 'Your profile has been updated.',
  //           buttons: ['OK'],
  //         });
  //         await alert.present();
  //       },
  //       async (error) => {
  //         const alert = await this.alertController.create({
  //           header: 'Profile Update Error',
  //           message:
  //             'There was an error updating your profile. Please try again.',
  //           buttons: ['OK'],
  //         });
  //         await alert.present();
  //       }
  //     );
  // }

  ngOnInit() {}
}
