import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OrdersService } from '../../core/orders';
import { ActivatedRoute } from '@angular/router';
import { MapsService } from '../../core/maps.service';

@Component({
  selector: 'shoppr-monorepo-delivery-list',
  templateUrl: './delivery-list.page.html',
  styleUrls: ['./delivery-list.page.scss'],
})
export class DeliveryListPage implements OnInit {
  deliveries$ = this.ordersService.deliveries;

  orderFilter: string;

  deliveryMapOptions: any = {
    center: {
      lat: 53.4242,
      lng: 2.8989
    },
    zoom: 8,
    gestureHandling: 'none',
    isFractionalZoomEnabled: true,
  }

  constructor(
    private ordersService: OrdersService,
    private navController: NavController,
    private route: ActivatedRoute,
    private mappingService: MapsService
  ) {
    this.orderFilter = this.route.snapshot.params['filter'] || 'sales';
    this.buildCollectionMapOptions();
  }

  ngOnInit() {
    this.ordersService.getDeliveries().subscribe(async (ok)=>{
      this.ordersService.updateDeliveriesWithDistance();
    });

  }

  viewOrder(orderUuid: string) {
    this.navController.navigateForward(`/view-order-driver/${orderUuid}`);
  }

  async buildCollectionMapOptions() {
    this.deliveryMapOptions = await this.mappingService.buildMapOptions();
  }
}
