// import { Injectable } from '@angular/core';

// import { environment } from '../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class OldMapsService {
//   myLong = -2.9013152;
//   myLat = 53.4242581;

//   constructor() {}

//   async createMap(mapRef: any) {
//     const newMap = await GoogleMap.create({
//       id: 'my-cool-map',
//       element: mapRef.nativeElement,
//       apiKey: environment.apiKey,
//       config: {
//         center: {
//           lat: this.myLat,
//           lng: this.myLong,
//         },
//         zoom: 11,
//       },
//     });

//     const collectionAddress = await newMap.addMarker({
//       coordinate: {
//         lat: this.myLat,
//         lng: this.myLong,
//       },
//     });

//     const map: any = newMap;

//     const cityCircle = new google.maps.Circle({
//       strokeColor: '#FF0000',
//       strokeOpacity: 0.8,
//       strokeWeight: 2,
//       fillColor: '#FF0000',
//       fillOpacity: 0.35,
//       map,
//       center: {
//         lat: this.myLat,
//         lng: this.myLong,
//       },
//       radius: 1000,
//     });
//   }
// }
