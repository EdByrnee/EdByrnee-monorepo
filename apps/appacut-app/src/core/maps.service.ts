import { Injectable } from '@angular/core';
import { IDrop } from '@shoppr-monorepo/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  liverpoolLng = -2.9013152;
  liverpoolLat = 53.4242581;

  constructor() {}

  getDemoMapOptions(): any {
    return {
      center: {
        lat: this.liverpoolLat,
        lng: this.liverpoolLng,
      },
      zoom: 14,
    };
  }

  getDemoLatLng(): any {
    return {
      lat: this.liverpoolLat,
      lng: this.liverpoolLng,
    };
  }

  geocode(postcode: string): Promise<google.maps.GeocoderResponse> {
    return new google.maps.Geocoder().geocode({ address: postcode });
  }

  // THIS IS SIMPLE
  calculateZoom(radius: number, lat: number, lng: number): number {
    radius = radius / 1000;
    const metersPerPx =
      (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, 15);
    const zoom = Math.log(40000 / radius / metersPerPx) / Math.LN2;
    return zoom * 0.985;
  }

  buildCollectionMapPin(collectionMapOptions: any): any {
    return {
      position: {
        lat: collectionMapOptions.center.lat,
        lng: collectionMapOptions.center.lng,
      },
      title: 'Collection Point',
    };
  }

  async buildCollectionMapOptions(drop: IDrop): Promise<any> {
    const latLng: any = await this.geocode(
      drop.collectionAddressPostcode || ''
    ).then((response: any) => {
      return response.results[0].geometry.location;
    });

    return {
      center: {
        lat: latLng.lat(),
        lng: latLng.lng(),
      },
      zoom: 14,
    };
  }

  buildLocalDeliveryCircle(drop: IDrop): any {
    return {
      center: {
        lat: drop.localDeliveryLat || 0,
        lng: drop.localDeliveryLng || 0,
      },
      radius: drop.localDeliveryRadius || 0,
      strokeColor: '#FF0000',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.25,
    };
  }


  buildMapOptions(drop: IDrop): any {
    return {
      center: {
        lat: drop.localDeliveryLat || 0,
        lng: drop.localDeliveryLng || 0,
      },
      zoom: this.calculateZoom(
        drop.localDeliveryRadius || 0,
        drop.localDeliveryLat || 0,
        drop.localDeliveryLng || 0
      ),
      gestureHandling: 'none',
      isFractionalZoomEnabled: true
    };
  }
}
