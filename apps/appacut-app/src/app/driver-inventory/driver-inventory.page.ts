import { Component, OnInit } from '@angular/core';
import { IDrop } from '@shoppr-monorepo/api-interfaces';
import { DropsService } from '../../core/drops';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { SelectDropPage } from '../select-drop/select-drop.page';

@Component({
  selector: 'shoppr-monorepo-driver-inventory',
  templateUrl: './driver-inventory.page.html',
  styleUrls: ['./driver-inventory.page.scss'],
})
export class DriverInventoryPage implements OnInit {
  allDrops$: Observable<IDrop[]> = this.dropsService.allDrops$;

  constructor(
    private dropsService: DropsService,
    private modalController: ModalController
    ) {}

  ngOnInit() {
    console.log(`Loading all drops...`)
    this.dropsService.getDrops().subscribe();
  }

  addDriverInventory() {}

  editDriverInventory() {}

  async replenishStock() {
    const selectDropModal = await this.modalController.create({
      component: SelectDropPage,
    });
    await selectDropModal.present();
  }
}
