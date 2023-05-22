import { Component, OnInit } from '@angular/core';
import { IDrop, IDropItem } from '@shoppr-monorepo/api-interfaces';
import { DropsService } from '../../core/drops';
import { Observable } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
import { DriverReplenishWarehouseStockPage } from '../driver-replenish-warehouse-stock/driver-replenish-warehouse-stock.page';
import { DropItemsService } from '../../core/drop-items';
import { AssignToDriverPage } from '../assign-to-driver/assign-to-driver.page';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'shoppr-monorepo-driver-inventory',
  templateUrl: './driver-inventory.page.html',
  styleUrls: ['./driver-inventory.page.scss'],
})
export class DriverInventoryPage implements OnInit {
  allDrops$: Observable<IDrop[]> = this.dropsService.allDrops$;

  currentUserDropItems$: Observable<IDropItem[]> =
    this.dropItemsService.currentUserDropItems$;

  selectedDrop: IDrop | null = null;
  selectedDropItem: IDropItem | null = null;

  constructor(
    private dropsService: DropsService,
    private dropItemsService: DropItemsService,
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log(`Loading all drops...`);
    this.dropsService.getDrops().subscribe((drops) => {});
    this.dropItemsService.getDropItemsForCurrentUser().subscribe();
  }

  selectDrop(drop: IDrop) {
    /* highlight a drop within the accordion */
    if (this.selectedDrop === drop) {
      this.selectedDrop = null;
      return;
    } else {
      this.selectedDrop = drop;
    }
  }

  selectDropItem(dropItem: IDropItem) {
    /* highlight a drop within the accordion */
    if (this.selectedDropItem === dropItem) {
      this.selectedDropItem = null;
      return;
    } else {
      this.selectedDropItem = dropItem;
    }
  }

  async addDriverInventory() {
    // const driverWarehouseWareshouseStockModal = this.modalController.create({
    //   component: AssignToDriverPage,
    // });
    // driverWarehouseWareshouseStockModal.then((modal) => modal.present());
    /* Confirm and assign to self */
    const confirm = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to assign this item to yourself?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log(`Cancelled`);
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            const currentUserUuid = this.authService.currentUser$.value
              ?.uuid as string;
            this.dropsService
              .updateItemDropLocation(
                this.selectedDropItem?.uuid as string,
                currentUserUuid,
                true
              )
              .subscribe(
                async (ok) => {
                  const alertController = await this.alertController.create({
                    header: 'Success',
                    message: 'This item has been assigned to you.',
                    buttons: ['OK'],
                  });

                  await alertController.present();
                },
                async (err) => {
                  const alertController = await this.alertController.create({
                    header: 'Error',
                    message:
                      'There was an error assigning this item to yourself. Please try again.',
                    buttons: ['OK'],
                  });

                  await alertController.present();
                }
              );
          },
        },
      ],
    });

    await confirm.present();
  }

  replenishStock() {
    const driverWarehouseWareshouseStockModal = this.modalController.create({
      component: DriverReplenishWarehouseStockPage,
      componentProps: {
        drop: this.selectedDrop,
      },
    });
    driverWarehouseWareshouseStockModal.then((modal) => modal.present());
  }
}
