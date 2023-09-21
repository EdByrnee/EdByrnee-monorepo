import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OrdersService } from '../../core/orders';

@Component({
  selector: 'shoppr-monorepo-list-orders',
  templateUrl: './list-orders.page.html',
  styleUrls: ['./list-orders.page.scss'],
})
export class ListOrdersPage implements OnInit {
  myOrders$ = this.ordersService.myOrders;

  orderFilter: string;

  constructor(
    private ordersService: OrdersService,
    private navController: NavController,
    private route: ActivatedRoute
  ) {
    this.orderFilter = this.route.snapshot.params['filter'];
  }

  ionViewDidEnter(): void {
    this.loadData();
  }

  loadData() {
    this.ordersService.getOrdersForUser().subscribe();
  }

  ngOnInit() {}

  viewOrder(orderUuid: string) {
    this.navController.navigateForward(`/view-order-driver/${orderUuid}`);
  }

  openSupport() {}
}
