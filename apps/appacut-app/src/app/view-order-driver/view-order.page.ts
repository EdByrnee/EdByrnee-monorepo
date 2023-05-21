import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import {
  IMultiOrder,
  IOrder,
  OrderStatus,
} from '@shoppr-monorepo/api-interfaces';
import { AuthService } from '../../core/auth';
import { OrdersService } from '../../core/orders';
import { DropItemsService } from '../../core/drop-items';
@Component({
  selector: 'shoppr-monorepo-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {
  uuid: string;

  order: IMultiOrder;

  loading = true;
  error = false;

  currentUserUuid: string;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrdersService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private dropItemService: DropItemsService,
    private navController: NavController
  ) {
    this.uuid = this.route.snapshot.paramMap.get('id') || '';
    this.currentUserUuid = this.authService.currentUser$.value?.uuid || '';
  }

  ngOnInit() {
    this.orderService.getOrder(this.uuid).subscribe(
      (order) => {
        this.order = order;
        this.loading = false;
      },
      (err) => {
        this.error = true;
        this.loading = false;
      }
    );

    this.dropItemService.getDropItemsForCurrentUser().subscribe((ok) => {
      // Populate IDrop with atHand here so show how many of a given item are currently availabel to a dliver
    });
  }

  async confirmDelivery() {
    /* Confirm Release /*/
    const confirmRelease = await this.alertController.create({
      header: 'Confrim Delivery',
      message: `Are you outside the house ready to pack the order?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.orderService.confirmDelivery(this.uuid).subscribe(
              async (ok: any) => {
                /* Success Message /*/
                const toastController = await this.toastController.create({
                  message: 'Delivery confirmed',
                  duration: 2000,
                  color: 'success',
                });
                await toastController.present();

                /* close modal */
                this.navController.back();
              },
              async (err: any) => {
                /* Error Message /*/
                console.log(err);
                const toastController = await this.toastController.create({
                  message: 'Error, please try again later',
                  duration: 2000,
                  color: 'danger',
                });
                await toastController.present();
              }
            );
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await confirmRelease.present();
  }

  async releaseOrderFromDriver() {
    /* Confirm Release /*/
    const confirmRelease = await this.alertController.create({
      header: 'Release Delivery',
      message: `Are you sure you want to release this delivery?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.orderService.releaseDriver(this.uuid).subscribe(
              async (ok: any) => {
                /* Success Message /*/
                const toastController = await this.toastController.create({
                  message: 'Delivery released',
                  duration: 2000,
                  color: 'success',
                });
                await toastController.present();
                /* close modal */
                this.navController.back();
              },
              async (err: any) => {
                /* Error Message /*/
                console.log(err);
                const toastController = await this.toastController.create({
                  message: 'Error, please try again later',
                  duration: 2000,
                  color: 'danger',
                });
                await toastController.present();
              }
            );
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await confirmRelease.present();
  }

  async assignDriver() {
    const confirmUpdate = await this.alertController.create({
      header: 'Take Delivery',
      message: `Are you sure you want to assign this deliery to yourself?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.orderService.assignDriver(this.uuid).subscribe(
              async (ok) => {
                /* Success Message /*/
                const toastController = await this.toastController.create({
                  message: 'Delivery assigned to you',
                  duration: 2000,
                  color: 'success',
                });
                await toastController.present();
                /* close modal */
                this.navController.back();
              },
              async (err) => {
                /* Error Message /*/
                console.log(err);
                const toastController = await this.toastController.create({
                  message: 'Error, please try again later',
                  duration: 2000,
                  color: 'danger',
                });
                await toastController.present();
              }
            );
          },
        },
      ],
    });

    await confirmUpdate.present();
  }

  async completeOrderUpdate(status: OrderStatus) {
    const loading = await this.alertController.create({
      header: 'Updating Order',
      message: 'Please wait...',
      backdropDismiss: false,
    });

    await loading.present();

    this.orderService.updateOrderStatus(this.uuid, status).subscribe(
      async (ok) => {
        this.order.order_status = status;
        await loading.dismiss();
      },
      async (err) => {
        await loading.dismiss();
        const toastController = await this.toastController.create({
          message: 'Error, please try again later',
          duration: 2000,
          color: 'danger',
        });
        await toastController.present();
      }
    );
  }
}
