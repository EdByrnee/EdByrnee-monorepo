import { Component } from '@angular/core';
import { DelliDropsService } from './delli-drops.service';

@Component({
  selector: 'shoppr-monorepo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  drops$ = this.delliDrops.drops$;

  constructor(private delliDrops: DelliDropsService) {}
  title = 'admin';
}
