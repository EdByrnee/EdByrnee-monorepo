import { Component } from '@angular/core';
import { AuthService } from '../../core/auth';
import { RoutingService } from '../../core/routing.service';
import { UpdateService } from '../../core/update.service';

@Component({
  selector: 'shoppr-monorepo-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  isAuthed$ = this.authService.isAuthed$;
  updating$ = this.updateService.updating$;

  constructor(
    private authService: AuthService,
    private routingService: RoutingService,
    private updateService: UpdateService
  ) {
  }

  ionViewWillEnter() {
    this.routingService.initTabsRouting();
  }
}
