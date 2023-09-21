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

  async getDistanceBetweenCurrentLocationAndPostcode(postcode: string){
    const currentLocation = await this.getCurrentLocation();

    const geoCode: any = (await this.geocode(postcode));

    const distance = await this.getDistanceBetweenTwoPoints(
      currentLocation.lat,
      currentLocation.lng,
      geoCode.results[0].geometry.location.lat(),
      geoCode.results[0].geometry.location.lng()
    );
    console.log(`Distance: ${distance}`)
    return distance;
  }

  async getDistanceBetweenTwoPoints(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): Promise<number> {
    const origin = new google.maps.LatLng(lat1, lng1);
    const destination = new google.maps.LatLng(lat2, lng2);

    const service = new google.maps.DistanceMatrixService();
    const distanceMatrix = await service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    });

    return distanceMatrix.rows[0].elements[0].distance.value;
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

  getCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async buildMapOptions(): Promise<any> {
    const currentLocation = await this.getCurrentLocation();

    return {
      center: {
        lat: currentLocation.lat || 0,
        lng: currentLocation.lng || 0,
      },
      zoom: 11,
      gestureHandling: 'none',
      isFractionalZoomEnabled: true,
    };
  }
}
