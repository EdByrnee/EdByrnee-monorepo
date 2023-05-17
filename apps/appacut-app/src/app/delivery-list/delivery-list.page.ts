import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OrdersService } from '../../core/orders';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'shoppr-monorepo-delivery-list',
  templateUrl: './delivery-list.page.html',
  styleUrls: ['./delivery-list.page.scss'],
})
export class DeliveryListPage implements OnInit {
  deliveries$ = this.ordersService.deliveries;

  orderFilter: string;

  constructor(
    private ordersService: OrdersService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {
    this.orderFilter = this.route.snapshot.params['filter'] || 'sales';
  }

  ngOnInit() {
    this.ordersService.getDeliveries().subscribe();
  }

  viewOrder(orderUuid: string) {
    this.navController.navigateForward(`/view-order-driver/${orderUuid}`);
  }
}
