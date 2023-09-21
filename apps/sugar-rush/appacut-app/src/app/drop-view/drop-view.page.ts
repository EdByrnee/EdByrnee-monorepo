import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonModal,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import {
  DropStatus,
  IDrop,
  IUserProfile,
} from '@shoppr-monorepo/api-interfaces';
import { Observable, map } from 'rxjs';
import { DropsService } from '../../core/drops';
import { ChooseDeliveryPage } from '../choose-delivery/choose-delivery.page';
import { AuthService } from '../../core/auth';
import { MapsService } from '../../core/maps.service';
import { AnalyticsService } from '../../core/analytics';
import { BasketService, IBasketItem } from '../../core/basket.service';
import { ViewBasketPage } from '../view-basket/view-basket.page';

@Component({
  selector: 'shoppr-monorepo-drop-view',
  templateUrl: './drop-view.page.html',
  styleUrls: ['./drop-view.page.scss'],
})
export class DropViewPage implements OnInit {
  id: string;

  @ViewChild(IonModal, { static: false }) modal: any;

  drop$: Observable<IDrop>;
  drop: IDrop;
  loading = true;

  getMaker$: Observable<any>;

  userProfile$: Observable<IUserProfile>;

  currentUser$: Observable<IUserProfile | null> = this.authService.currentUser$;

  public basketTotal$: Observable<number> = this.basketService.basketTotal$;

  basket$: Observable<IBasketItem[]> = this.basketService.basket$;

  qty_of_item_in_basket$: Observable<number> = this.basket$.pipe(
    map((basket) => {
      const item = basket.find((i) => i.drop.uuid === this.drop.uuid);
      if (item) {
        return item.qty;
      } else {
        return 0;
      }
    })
  );

  localDeliveryMapOptions: any;
  localDeliveryCircleOptions: any;

  collectionMapOptions: any;
  collectionMapPin: any;

  showCollectionMap = false;
  showLocalDeliveryMap = false;

  constructor(
    private router: ActivatedRoute,
    private modalCtrl: ModalController,
    private dropsService: DropsService,
    private navController: NavController,
    public authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private alertController: AlertController,
    private toastController: ToastController,
    private analyticsService: AnalyticsService,
    private mappingService: MapsService,
    private basketService: BasketService,
    private toastContoller: ToastController
  ) {
    this.id = this.router.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {}

  async onClickBasket() {
    const modal = await this.modalCtrl.create({
      component: ViewBasketPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  async addToBasket() {
    this.basketService.addToBasket(this.drop);
    const alert = await this.toastContoller.create({
      header: 'Added to basket',
      position: 'top',
      duration: 2000,
      buttons: [
        {
          text: 'View Basket',
          handler: () => {
            this.onClickBasket();
          },
        },
      ],
    });
    await alert.present();
  }

  removeFromBasket() {
    this.basketService.removeFromBasket(this.drop);
  }

  ionViewWillEnter() {
    this.analyticsService.logEvent({
      name: 'drop_view',
      params: {
        drop_id: this.id,
      },
    });
    this.loadData();
  }

  async updateDrop() {
    await this.navController.navigateForward(`/new-drop/${this.drop.uuid}`);
  }

  async updateStatus(status: DropStatus) {
    const confirm = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to change the status of this drop?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.loading = true;
            this.dropsService.updateStatus(this.drop.uuid, status).subscribe(
              () => {
                this.loadData();
                this.loading = false;
              },
              async (err) => {
                console.log(err);
                this.loading = false;
                const toast = await this.toastController.create({
                  message: 'Unknown error. Please try again later.',
                  duration: 2000,
                  color: 'danger',
                });
                await toast.present();
              }
            );
          },
        },
      ],
    });
    await confirm.present();
  }

  async loadData() {
    this.loading = true;
    this.dropsService.getDrop(this.id).subscribe(async (drop: IDrop) => {
      // Set data
      this.userProfile$ = this.authService.getUserProfile(drop.makerUuid);
      this.drop = drop;

      // Finish up
      this.loading = false;
    });
  }

  async buildCollectionMapOptions(drop: IDrop) {
    {
      try {
        this.showCollectionMap = false;
        this.collectionMapOptions =
          await this.mappingService.buildCollectionMapOptions(drop);
        this.collectionMapPin = this.mappingService.buildCollectionMapPin(
          this.collectionMapOptions
        );
        this.showCollectionMap = true;
      } catch (err) {
        console.log(err);
        this.showCollectionMap = false;
      }
    }
  }

  goToMaker() {
    this.navController.navigateForward(['view-maker', this.drop.makerUuid]);
  }

  async buyNow() {
    // If we need to select a delivery option, then present this modal to the user
    const modal = await this.modalCtrl.create({
      component: ChooseDeliveryPage,
      componentProps: {
        id: 'choose-delivery',
        dropUuid: this.id,
        makerUuid: this.drop.makerUuid,
        drop: this.drop,
      },
    });
    await modal.present();
  }
}
