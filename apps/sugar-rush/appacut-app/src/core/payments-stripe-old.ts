// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../environments/environment';
// import Stripe from 'stripe';

// @Injectable({
//   providedIn: 'root',
// })
// export class PaymentService {
//   environment;
//   stripe = new Stripe(environment.stripeSecretKey, {
//     apiVersion: '2022-11-15',
//   });

//   constructor(private http: HttpClient) {
//     this.environment = environment;
//   }

// private setupRequestButton(){
//     setTimeout(() => {
//       this.paymentRequestButton.paymentRequest.on(
//         'shippingaddresschange',
//         (event: PaymentRequestShippingAddressEvent) => {
//           console.log('Calling update with...');
//           const updateWith = event.updateWith;
//           this.paymentRequestShippingAddressEvent = event;
//           const shippingAddress = event.shippingAddress;

//           if (shippingAddress.country !== 'GB') {
//             const updates: PaymentRequestUpdateDetails = {
//               status: 'fail',
//             };
//             updateWith(updates);
//           } else {
//             const status: PaymentRequestUpdateDetailsStatus = 'success';
//             const updates: PaymentRequestUpdateDetails = {
//               status: status,
//               shippingOptions: [
//                 {
//                   id: 'free',
//                   label: 'Free Shipping',
//                   detail: 'Arrives in 5 to 7 days',
//                   amount: 0,
//                 },
//               ],
//             };
//             updateWith(updates);
//           }
//         }
//       );

//       this.paymentRequestButton.paymentRequest.on(
//         'token',
//         (completeEvent: PaymentRequestTokenEvent) => {
//           console.log(`Here is the delivery address`);
//           console.log(this.paymentRequestShippingAddressEvent.shippingAddress);

//           const newOrder: ICreateOrder = this.order;
//           newOrder.deliveryAddressLine1 = this
//             .paymentRequestShippingAddressEvent.shippingAddress.addressLine
//             ? this.paymentRequestShippingAddressEvent.shippingAddress
//                 .addressLine[0]
//             : '';
//           newOrder.deliveryAddressLine2 = this
//             .paymentRequestShippingAddressEvent.shippingAddress.addressLine
//             ? this.paymentRequestShippingAddressEvent.shippingAddress
//                 .addressLine[1]
//             : '';
//           newOrder.deliveryAddressCity =
//             this.paymentRequestShippingAddressEvent.shippingAddress.city || '';
//           newOrder.deliveryAddressPostcode =
//             this.paymentRequestShippingAddressEvent.shippingAddress
//               .postalCode || '';
//           newOrder.deliveryAddressCountry =
//             this.paymentRequestShippingAddressEvent.shippingAddress.country ||
//             '';

//           newOrder.deliveryAddressLine1 = 'demo address line 1';

//           this.buyNow(newOrder, completeEvent);
//           this.complete();
//         }
//       );
//     }, 3500);
//   }
// }
