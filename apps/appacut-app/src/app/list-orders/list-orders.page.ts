import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IOrder } from '@shoppr-monorepo/api-interfaces';
import { map, Observable } from 'rxjs';
import { OrdersService } from '../../core/orders';


@Component({
  selector: 'shoppr-monorepo-list-orders',
  templateUrl: './list-orders.page.html',
  styleUrls: ['./list-orders.page.scss'],
})

export class ListOrdersPage implements OnInit {
  purchases$: Observable<IOrder[]> = this.ordersService.purchases;
  sales$: Observable<IOrder[]> = this.ordersService.sales;

  openSales$;
  closedSales$;


  orderFilter: string;

  constructor(private ordersService: OrdersService,
      private navController: NavController,
      private route: ActivatedRoute)
       {
      this.orderFilter = this.route.snapshot.params['filter'];
      this.openSales$ = this.sales$.pipe(map(sales => sales.filter(sale => sale.order_status === 'OPEN')));
      this.closedSales$ = this.sales$.pipe(map(sales => sales.filter(sale => sale.order_status === 'CLOSED')));
    }

  ngOnInit() {
    this.ordersService.getOrders().subscribe();
  }

  viewOrder(orderUuid: string){
    this.navController.navigateForward(`/view-order/${orderUuid}`);
  }
}
