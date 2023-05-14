import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, GalleryPhoto } from '@capacitor/camera';
@Component({
  selector: 'shoppr-monorepo-upload-component',
  templateUrl: './upload-component.html',
  styleUrls: ['./upload-component.component.scss'],
})
export class UploadComponent implements OnInit {
  @Input() newImages: any[] = [];
  @Output() newImagesChange = new EventEmitter<any[]>();

  @Input() photosEdited = false;
  @Output() photosEditedChange = new EventEmitter<boolean>();

  @Input() minPhotosRequired = 0;

  get photoFormValid() {
    if (this.newImages && this.newImages.length > 0) return true;
    return false;
  }

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {}

  public setNewImages(images: any[]) {
    this.newImages = images;
    this.newImagesChange.emit(this.newImages);
  }

  public setPhotosEdited(photosEdited: boolean) {
    this.photosEdited = photosEdited;
    this.photosEditedChange.emit(this.photosEdited);
  }


  ngOnInit(): void {}

  async removePhoto(index: number) {
    const confirm = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this photo?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.newImages.splice(index, 1);
            this.setPhotosEdited(true);
          },
        },
      ],
    });
    await confirm.present();
  }

  async addPhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
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

  async loadPhotosFromLibrary() {
    console.log('Requesting photo upload from browser api');
    try {
      const imagesToUpload = await Camera.pickImages({
        quality: 80,
        limit: 5,
        width: 1200,
        height: 1200,
      });
      const photos: GalleryPhoto[] = imagesToUpload.photos;

      this.setNewImages(this.newImages.concat(photos));

      this.setPhotosEdited(true);

    } catch (err) {
      console.log(err);
    }
  }
}
