import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { DropsService } from '../../core/drops';
import { SetLocalDeliveryRadiusPage } from '../set-local-delivery-radius/set-local-delivery-radius.page';

@Component({
  selector: 'shoppr-monorepo-new-drop-logistics',
  templateUrl: './new-drop-logistics.page.html',
  styleUrls: ['./new-drop-logistics.page.scss'],
})
export class NewDropLogisticsPage implements OnInit {
  localDeliveryForm: FormGroup;
  nationalDeliveryForm: FormGroup;
  collectionForm: FormGroup;

  localDeliveryFormEnabled = this.dropService.localDeliveryForm.enabled;
  nationalDeliveryFormEnabled = this.dropService.nationalDeliveryForm.enabled;
  collectionFormEnabled = this.dropService.collectionForm.enabled;

  constructor(
    public dropService: DropsService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private navController: NavController
  ) {
    this.localDeliveryForm = this.dropService.localDeliveryForm;
    this.nationalDeliveryForm = this.dropService.nationalDeliveryForm;
    this.collectionForm = this.dropService.collectionForm;
  }
  toggleLocalDelivery() {
    if (this.localDeliveryForm.enabled){
      // Set all localDeliveryFormValues to false
      // this.localDeliveryForm.patchValue({
      //   localDeliveryCost: null,
      //   localDeliveryGuidelines: null,
      //   localDeliveryLat: null,
      //   localDeliveryLng: null,
      //   localDeliveryRadius: null,
      // })
      this.localDeliveryForm.disable();
    }
    else {
      this.localDeliveryForm.enable();
    }
  }
  toggleNationalDelivery() {
    if (this.nationalDeliveryForm.enabled) this.nationalDeliveryForm.disable();
    else this.nationalDeliveryForm.enable();
  }
  toggleCollectionForm() {
    if (this.collectionForm.enabled) this.collectionForm.disable();
    else this.collectionForm.enable();
  }

  addCollectionAddress(){
    this.navController.navigateForward('/new-drop-collection-address');
  }

  ngOnInit() {}
  buy() {}

  async goToSetLocalDeliveryArea(){
    // this.navController.navigateForward('/set-local-delivery-radius');
    const modal = await this.modalController.create({
      component: SetLocalDeliveryRadiusPage,
    });
    await modal.present();
  }

  save(){
    this.navController.pop();
  }
}
