import { Component, OnInit } from '@angular/core';
import { IDrop } from '@shoppr-monorepo/api-interfaces';
import { DropsService } from '../../core/drops';
import { Observable } from 'rxjs';

@Component({
  selector: 'shoppr-monorepo-driver-inventory',
  templateUrl: './driver-inventory.page.html',
  styleUrls: ['./driver-inventory.page.scss'],
})
export class DriverInventoryPage implements OnInit {
  allDrops$: Observable<IDrop[]> = this.dropsService.allDrops$;

  constructor(private dropsService: DropsService) {}

  ngOnInit() {}

  addDriverInventory() {}

  editDriverInventory() {}
}
