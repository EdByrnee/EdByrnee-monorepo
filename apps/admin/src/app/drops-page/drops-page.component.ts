import { Component } from '@angular/core';
import { IDrop } from '@shoppr-monorepo/api-interfaces';
import { map } from 'rxjs';
import { DelliDropsService } from '../delli-drops.service';

@Component({
  selector: 'shoppr-monorepo-drops-page',
  templateUrl: './drops-page.component.html',
  styleUrls: ['./drops-page.component.scss'],
})
export class DropsPageComponent {
  displayedColumns = [
    'name',
    'stock',
    'likes',
    'sales',
    'price',
    'total_sales',
    'collectionAvailable',
    'localDeliveryAvailable',
    'nationalDeliveryAvailable',
  ];

  drops$ = this.delliDrops.drops$.asObservable();

  delliDropScrapeLogs$ = this.delliDrops.delliDropScrapeLogs$.asObservable();

  viewDelliDropScrapeLogs = false;

  totalSales: number;

  minQty = null;

  deliveryOptions = null;
  deliveryOptionsList = [
    { name: 'Collection', value: 'collectionAvailable' },
    { name: 'Local Delivery', value: 'localDeliveryAvailable' },
    { name: 'National Delivery', value: 'nationalDeliveryAvailable' },
  ]

  constructor(private delliDrops: DelliDropsService) {}

  ngOnInit(): void {
    this.delliDrops.getDelliDrops().subscribe((drops: any[]) => {
      this.totalSales = drops.reduce(
        (acc, drop) => acc + drop.sales * (drop.price / 100),
        0
      );
    });
    this.delliDrops.getDelliDropScrapeLogs().subscribe();
  }

  announceSortChange(event: any) {
    // Sort
    this.drops$ = this.drops$.pipe(
      map((drops: any[]) => {
        return drops.sort((a, b) => {
          if (event.direction === 'asc') {
            return a[event.active] - b[event.active];
          } else {
            return b[event.active] - a[event.active];
          }
        });
      })
    );
  }

  applyFilter() {
    this.drops$ = this.delliDrops.drops$.pipe(
      map((drops: any[]) => {
        if (this.minQty) {
          drops = drops.filter((drop) => {
            return drop.stock >= (this.minQty || 0);
          });
        }

        return drops;
      })
    );
  }

  editDrop(drop: any) {
    console.log(`edit drop ${drop.name}`);
  }

  deleteDrop(drop: any) {
    console.log(`delete drop ${drop.name}`);
  }
}
