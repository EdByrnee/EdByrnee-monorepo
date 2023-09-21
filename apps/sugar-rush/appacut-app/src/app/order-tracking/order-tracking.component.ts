import { Component, Input } from '@angular/core';
import { IMultiOrder } from '@shoppr-monorepo/api-interfaces';

@Component({
  selector: 'shoppr-monorepo-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
})
export class OrderTrackingComponent {

  @Input() order: IMultiOrder;

}
