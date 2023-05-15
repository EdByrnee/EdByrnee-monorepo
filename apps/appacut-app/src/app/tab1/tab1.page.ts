import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import {
  IDrop,
  IDropFeed,
  IUserProfile,
} from '@shoppr-monorepo/api-interfaces';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../core/auth';
import { DropsService } from '../../core/drops';
import { SetLocationPage } from '../set-location/set-location.page';
import { ViewBasketPage } from '../view-basket/view-basket.page';
import { BasketService } from '../../core/basket.service';

@Component({
  selector: 'shoppr-monorepo-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  constructor(
    private navController: NavController,
    private dropService: DropsService,
    public authService: AuthService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private basketService: BasketService
  ) {}

  public showLaunchingSoon = true;

  public loading = true;

  public dropFeed$: Observable<IDropFeed[]> = this.dropService.dropFeed$;
  public suggestedMakers$: Observable<IUserProfile[]> =
    this.authService.suggestedMakers$;

  public isAuthed$ = this.authService.isAuthed$;

  public showMakers = true;

  public searching = false;

  public searchResults: any[];

  public postcode$: Observable<string | null> = this.authService.postcode$;

  public basketTotal$: Observable<number> = this.basketService.basketTotal$;

  public firstHalfOfPostcode$: Observable<string | null> = this.postcode$.pipe(
    map((postcode) => {
      if (postcode) {
        return postcode.split(' ')[0];
      }
      return null;
    })
  );

  cancelSearchIfBlank($event: any) {
    if ($event.target.value === '') {
      this.searching = false;
    }
  }

  async onClickBasket(){
    const modal = await this.modalCtrl.create({
      component: ViewBasketPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  search($event: any) {
    const value = $event.target.value;
    if (value === 'DEMO_MODE_ON') {
      this.authService.setDemoMode(true);
      return;
    }
    if (value === 'DEMO_MODE_OFF') {
      this.authService.setDemoMode(false);
      return;
    }
    this.dropService.searchDrops(value).subscribe((res: IDrop[]) => {
      this.searchResults = res.map(
        (drop: IDrop) => {
          return {
            uuid: drop.uuid,
            photoUrl: drop.photos ? drop.photos[0].photo_url : null,
            title: drop.name,
            subTitle: drop.description,
          };
        },
        (err: any) => {
          console.log(err);
        }
      );
    });
  }

  viewDrop(id: string) {
    this.navController.navigateForward(`drop-view/${id}`);
  }

  startBooking() {
    this.navController.navigateForward('/set-collection');
  }

  editBooking() {
    this.navController.navigateForward('/edit-booking');
  }

  continueAuth() {
    this.navController.navigateForward('auth');
  }

  goToViewMaker(id: string) {
    this.navController.navigateForward('view-maker/' + id);
  }

  viewAllMakers() {
    throw new Error('Not implemented');
  }

  ionViewDidEnter(): void {
    this.loadData();
  }

  loadData(event?: any) {
    if (!event) this.loading = true;
    this.authService.getSuggestedMakers().subscribe();
    this.dropService.getDropFeed().subscribe(
      (ok) => {
        if (!event) this.loading = false;
        console.log(ok);
        if (event) event.target.complete();
      },
      async (err) => {
        if (!event) this.loading = false;
        console.log(err);
        if (event) event.target.complete();
        const errorToast = await this.toastController.create({
          message: `There was an error. Please try again later.`,
          duration: 2000,
          color: 'danger',
        });
        errorToast.present();
      }
    );
  }

  async onSetLocation() {
    // If we need to select a delivery option, then present this modal to the user
    const modal = await this.modalCtrl.create({
      component: SetLocationPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    // if (role === 'confirm') {
    //   this.message = `Hello, ${data}!`;
    // }
  }
}
