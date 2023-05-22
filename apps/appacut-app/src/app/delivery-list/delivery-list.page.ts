import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OrdersService } from '../../core/orders';
import { ActivatedRoute } from '@angular/router';
import { MapsService } from '../../core/maps.service';
import { IMultiOrder } from '@shoppr-monorepo/api-interfaces';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from '../../environments/environment';

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
      lng: 2.8989,
    },
    zoom: 8,
    gestureHandling: 'none',
    isFractionalZoomEnabled: true,
  };

  loading = true;

  constructor(
    private ordersService: OrdersService,
    private navController: NavController,
    private route: ActivatedRoute,
    private mappingService: MapsService
  ) {
    this.orderFilter = this.route.snapshot.params['filter'] || 'sales';
  }

  ngOnInit() {
    this.loadAllData();
  }

  async loadAllData() {
    this.loading = true;
    this.ordersService
      .getDeliveries()
      .subscribe(async (deliveries: IMultiOrder[]) => {
        this.ordersService.updateDeliveriesWithDistance();

        const mapRef = document.getElementById('map');
        const currentLocation = await this.mappingService.getCurrentLocation();

        const newMap = await GoogleMap.create({
          id: 'my-map', // Unique identifier for this map instance
          element: mapRef as any, // reference to the capacitor-google-map element
          apiKey: environment.apiKey, // Your Google Maps API Key
          config: {
            center: {
              lat: currentLocation.lat || 0,
              lng: currentLocation.lng || 0,
            },
            zoom: 12,
            // gestureHandling: 'none',
            isFractionalZoomEnabled: true,
          },
        });

        await newMap.addMarker({
          coordinate: {
            lat: currentLocation.lat || 0,
            lng: currentLocation.lng || 0,
          },
          tintColor: {
            r: 0,
            g: 0,
            b: 255,
            a: 1,
          },
          iconUrl: '/assets/maps/hb.png',
        });

        for (const delivery of deliveries) {
          const markerId = await newMap.addMarker({
            coordinate: {
              lat: delivery.deliveryLat as number,
              lng: delivery.deliveryLng as number,
            },
          });
        }
        this.loading = false;
      });
    // setTimeout(() => {
    //   this.loadAllData();
    // }, 30000);
  }

  viewOrder(orderUuid: string) {
    this.navController.navigateForward(`/view-order-driver/${orderUuid}`);
  }
}
