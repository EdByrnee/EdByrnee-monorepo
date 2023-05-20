import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
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
    private dropItemService: DropItemsService
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

  async updateOrderStatus(status: OrderStatus) {
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
            this.completeOrderUpdate(status);
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
