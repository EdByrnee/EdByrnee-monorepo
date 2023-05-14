import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Camera, GalleryPhoto } from '@capacitor/camera';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropsService } from '../../core/drops';
import * as uuid from 'uuid';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../core/auth';
import { IDrop } from '@shoppr-monorepo/api-interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'shoppr-monorepo-new-drop',
  templateUrl: './new-drop.page.html',
  styleUrls: ['./new-drop.page.scss'],
})
export class NewDropPage implements OnInit {
  originalImageUuids: string[] = [];
  photosEdited = false;
  editDrop = false;
  drop: IDrop;

  isDisabledForNonMakers = false;

  newImages: any[] = [];

  basicInfoForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    price: new FormControl<number | null>(null, Validators.required),
    qty_available: new FormControl<number | null>(null, Validators.required),
  });

  get photoFormValid() {
    if (this.newImages.length > 0) return true;
    return false;
  }

  get isEverythingValid() {
    return (
      this.newImages.length > 0 &&
      this.basicInfoForm.valid &&
      this.importantInfoForm.valid &&
      this.isAllEnabledDeliveryFormsValidAndOneEnabled
    );
  }

  get isAnythingDirty() {
    return (
      this.basicInfoForm.dirty ||
      this.importantInfoForm.dirty ||
      this.localDeliveryForm.dirty ||
      this.nationalDeliveryForm.dirty ||
      this.collectionForm.dirty ||
      this.checkIfEnabledFormAreDirty()
    );
  }

  importantInfoForm: FormGroup;

  public localDeliveryForm: FormGroup;
  public nationalDeliveryForm: FormGroup;
  public collectionForm: FormGroup;

  public currentUser$ = this.authService.currentUser$;

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private acitonSheetController: ActionSheetController,
    private dropService: DropsService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.importantInfoForm = this.dropService.importantInfoForm;
    this.localDeliveryForm = this.dropService.localDeliveryForm;
    this.nationalDeliveryForm = this.dropService.nationalDeliveryForm;
    this.collectionForm = this.dropService.collectionForm;

    const dropUuid = this.route.snapshot.paramMap.get('dropUuid');

    if (dropUuid) {
      this.dropService.getDrop(dropUuid).subscribe((drop) => {
        this.drop = drop;
        this.loadDrop();
      });
      this.editDrop = true;
    }
  }

  get isAllEnabledDeliveryFormsValidAndOneEnabled() {
    // You need at least one valid form
    if (
      !this.localDeliveryForm.valid &&
      !this.nationalDeliveryForm.valid &&
      !this.collectionForm.valid
    )
      return false;

    // And if anything is enabled, it needs to be valid
    if (this.localDeliveryForm.enabled && !this.localDeliveryForm.valid)
      return false;
    if (this.nationalDeliveryForm.enabled && !this.nationalDeliveryForm.valid)
      return false;
    if (this.collectionForm.enabled && !this.collectionForm.valid) return false;
    return true;
  }

  checkIfEnabledFormAreDirty() {
    if (!this.drop) return false;
    if (this.localDeliveryForm.enabled !== this.drop.localDeliveryEnabled)
      return true;
    if (this.nationalDeliveryForm.enabled !== this.drop.nationalDeliveryEnabled)
      return true;
    if (this.collectionForm.enabled !== this.drop.collectionEnabled)
      return true;
    else return false;
  }

  loadDrop() {
    this.newImages = this.drop?.photos?.map((photo) => {
      return {
        uuid: photo.uuid,
        webPath: photo.photo_url,
      } as any;
    }) as GalleryPhoto[];

    this.originalImageUuids = this.newImages.map((image) => image.uuid);

    this.basicInfoForm.patchValue({
      name: this.drop.name,
      description: this.drop.description,
      price: this.drop.price,
      qty_available: this.drop.qty_available,
    });

    this.importantInfoForm.patchValue({
      ingredients: this.drop.ingredients,
      allergens: this.drop.allergens,
      age_restricted: this.drop.age_restricted,
      food_authgranted: true,
    });

    this.localDeliveryForm.patchValue({
      localDeliveryCost: this.drop.localDeliveryCost,
      localDeliveryGuidelines: this.drop.localDeliveryGuidelines,
      localDeliveryLat: this.drop.localDeliveryLat,
      localDeliveryLng: this.drop.localDeliveryLng,
      localDeliveryRadius: this.drop.localDeliveryRadius,
    });
    if (this.drop.localDeliveryEnabled) {
      this.localDeliveryForm.enable();
    }

    this.nationalDeliveryForm.patchValue({
      nationalDeliveryCost: this.drop.nationalDeliveryCost,
      nationalDeliveryGuidelines: this.drop.nationalDeliveryGuidelines,
    });
    if (this.drop.nationalDeliveryEnabled) {
      this.nationalDeliveryForm.enable();
    }

    this.collectionForm.patchValue({
      collectionGuidelines: this.drop.collectionGuidelines,
      collectionAddressLine1: this.drop.collectionAddressLine1,
      collectionAddressLine2: this.drop.collectionAddressLine2,
      collectionAddressCity: this.drop.collectionAddressCity,
      collectionAddressPostcode: this.drop.collectionAddressPostcode,
    });
    if (this.drop.collectionEnabled) {
      this.collectionForm.enable();
    }
  }

  ngOnInit() {}

  postNow() {}

  applyForMaker() {}

  cancelPost() {
    this.navController.pop();
  }

  goToImportantInfo() {
    this.navController.navigateForward('/new-drop-important-info');
  }

  goToLogistics() {
    this.navController.navigateForward('/new-drop-logistics');
  }

  async readFileAsBlob(path: string) {
    const response = await fetch(path);
    const blob = await response.blob();
    return blob;
  }

  async convertFilePathsToBlobs(paths: string[]) {
    const blobs: Blob[] = [];
    for (const path of paths) {
      const blob = await this.readFileAsBlob(path);
      blobs.push(blob);
    }
    return blobs;
  }

  async submitDrop() {
    const loading = await this.loadingCtrl.create({
      message: 'Submitting Drop...',
      duration: 20000,
    });

    await loading.present();

    let newDrop: any = this.basicInfoForm.value;
    newDrop = Object.assign(newDrop, this.importantInfoForm.value);
    newDrop.uuid = uuid.v4();

    if (this.localDeliveryForm.enabled) {
      newDrop.localDeliveryEnabled = true;
      console.log(`Local Delivery form values are}`);
      console.log(this.localDeliveryForm.value);
      newDrop = Object.assign(newDrop, this.localDeliveryForm.value);
      console.log(`New Drop is`);
      console.log(newDrop);
    }

    if (this.nationalDeliveryForm.enabled) {
      newDrop.nationalDeliveryEnabled = true;
      newDrop = Object.assign(newDrop, this.nationalDeliveryForm.value);
    }

    if (this.collectionForm.enabled) {
      newDrop.collectionEnabled = true;
      newDrop = Object.assign(newDrop, this.collectionForm.value);
    }

    const photoBlobs: Blob[] = await this.convertFilePathsToBlobs(
      this.newImages.map((image) => image.webPath)
    );

    let uploading: HTMLIonLoadingElement;

    this.dropService.createDrop(newDrop, photoBlobs).subscribe(
      async (event) => {
        // if (event.type === HttpEventType.DownloadProgress) {
        // await loading.dismiss();
        // uploading = await this.loadingCtrl.create({
        //   message: 'Uploading Images...',
        //   duration: 3000,
        // });
        // await uploading.present();
        // }
        if (event.type === HttpEventType.Response) {
          await loading.dismiss();
          this.handleSubmittedDrop(newDrop.uuid);
        }
      },
      (err) => {
        console.log(err);
        loading.dismiss();
        this.handleSubmittedDropError();
      }
    );
  }

  getDirtyValues(form: FormGroup) {
    const dirtyValues: any = {};

    Object.keys(form.controls).forEach((key) => {
      const currentControl = form.controls[key];

      if (currentControl.dirty) {
        dirtyValues[key] = currentControl.value;
      }
    });

    return dirtyValues;
  }

  async updateDrop() {
    const loading = await this.loadingCtrl.create({
      message: 'Updating Drop...',
      duration: 20000,
    });

    await loading.present();

    let newDrop: any = this.basicInfoForm.value;
    newDrop = Object.assign(newDrop, this.importantInfoForm.value);

    if (this.localDeliveryForm.enabled) {
      newDrop.localDeliveryEnabled = true;
      console.log(`Local Delivery form values are}`);
      console.log(this.localDeliveryForm.value);
      newDrop = Object.assign(newDrop, this.localDeliveryForm.value);
      console.log(`New Drop is`);
      console.log(newDrop);
    } else {
      newDrop.localDeliveryEnabled = false;
    }

    if (this.nationalDeliveryForm.enabled) {
      newDrop.nationalDeliveryEnabled = true;
      newDrop = Object.assign(newDrop, this.nationalDeliveryForm.value);
    } else {
      newDrop.nationalDeliveryEnabled = false;
    }

    if (this.collectionForm.enabled) {
      newDrop.collectionEnabled = true;
      newDrop = Object.assign(newDrop, this.collectionForm.value);
    } else {
      newDrop.collectionEnabled = false;
    }

    const newImageUuids = this.newImages.map((image) => image.uuid);
    const imageUuidsToRemove = this.originalImageUuids.filter(
      (uuid) => !newImageUuids.includes(uuid)
    );

    const newImages = this.newImages.filter(
      (image) => !this.originalImageUuids.includes(image.uuid)
    );

    const photoBlobs: Blob[] = await this.convertFilePathsToBlobs(
      newImages.map((image) => image.webPath)
    );

    newDrop.imageUuidsToRemove = imageUuidsToRemove;

    this.dropService.updateDrop(newDrop, this.drop.uuid, photoBlobs).subscribe(
      async (response) => {
        if (response.type === 4) {
          const msg = await this.toastController.create({
            header: 'Success updating your drop',
            buttons: ['OK'],
            color: 'success',
            duration: 3000,
            position: 'top',
          });

          this.navController.navigateRoot(`/tabs/tab3`);

          await loading.dismiss();
          await msg.present();
          this.clearForms();
        }
      },
      async (err) => {
        const msg = await this.toastController.create({
          header: 'Unkown error. Please try again later.',
          color: 'danger',
          buttons: ['OK'],
          duration: 3000,
          position: 'top',
        });

        await loading.dismiss();
        await msg.present();
      }
    );
  }

  clearForms() {
    this.basicInfoForm.reset();
    this.importantInfoForm.reset();
    this.localDeliveryForm.reset();
    this.nationalDeliveryForm.reset();
    this.collectionForm.reset();
    this.newImages = [];
  }

  async handleSubmittedDrop(uuid: string) {
    const msg = await this.toastController.create({
      header: 'Success listing your drop',
      // subHeader: 'Important message',
      message: 'You will now be redirected to your drop',
      buttons: ['OK'],
      duration: 3000,
    });

    this.clearForms();

    await msg.present();
    await this.navController.navigateRoot('/tabs/tab1');
    await this.navController.navigateForward('/drop-view/' + uuid);
  }

  async handleSubmittedDropError() {
    const alert = await this.alertController.create({
      header: 'Error listing your drop',
      // subHeader: 'Important message',
      message: 'Please try again',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
