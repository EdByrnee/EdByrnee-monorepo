import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'update-app',
    loadChildren: () =>
      import('./update-app/update-app.module').then(
        (m) => m.UpdateAppPageModule
      ),
  },
  {
    path: 'pack-order',
    loadChildren: () =>
      import('./pack-order/pack-order.module').then(
        (m) => m.PackOrderPageModule
      ),
  },
  {
    path: 'assign-to-driver',
    loadChildren: () =>
      import('./assign-to-driver/assign-to-driver.module').then(
        (m) => m.AssignToDriverPageModule
      ),
  },

  {
    path: 'driver-replenish-warehouse-stock',
    loadChildren: () =>
      import(
        './driver-replenish-warehouse-stock/driver-replenish-warehouse-stock.module'
      ).then((m) => m.DriverReplenishWarehouseStockPageModule),
  },
  {
    path: 'complete-profile',
    loadChildren: () =>
      import('./complete-profile/complete-profile.module').then(
        (m) => m.CompleteProfilePageModule
      ),
  },
  {
    path: 'select-drop',
    loadChildren: () =>
      import('./select-drop/select-drop.module').then(
        (m) => m.SelectDropPageModule
      ),
  },
  {
    path: 'driver-inventory',
    loadChildren: () =>
      import('./driver-inventory/driver-inventory.module').then(
        (m) => m.DriverInventoryPageModule
      ),
  },
  {
    path: 'delivery-list',
    loadChildren: () =>
      import('./delivery-list/delivery-list.module').then(
        (m) => m.DeliveryListPageModule
      ),
  },
  {
    path: 'list-orders',
    loadChildren: () =>
      import('./list-orders/list-orders.module').then(
        (m) => m.ListOrdersPageModule
      ),
  },
  {
    path: 'view-basket',
    loadChildren: () =>
      import('./view-basket/view-basket.module').then(
        (m) => m.ViewBasketPageModule
      ),
  },

  {
    path: 'list-orders',
    loadChildren: () =>
      import('./list-orders/list-orders.module').then(
        (m) => m.ListOrdersPageModule
      ),
  },

  {
    path: 'login-modal',
    loadChildren: () =>
      import('./login-modal/login-modal.module').then(
        (m) => m.LoginModalPageModule
      ),
  },
  {
    path: 'set-local-delivery-radius',
    loadChildren: () =>
      import(
        './set-local-delivery-radius/set-local-delivery-radius.module'
      ).then((m) => m.SetLocalDeliveryRadiusPageModule),
  },

  {
    path: 'checkout',
    loadChildren: () =>
      import('./checkout/checkout.module').then((m) => m.CheckoutPageModule),
  },
  {
    path: 'view-order-driver',
    loadChildren: () =>
      import('./view-order-driver/view-order.module').then(
        (m) => m.ViewOrderPageModule
      ),
  },
  {
    path: 'list-orders',
    loadChildren: () =>
      import('./list-orders/list-orders.module').then(
        (m) => m.ListOrdersPageModule
      ),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'splash',
    loadChildren: () =>
      import('./splash/splash.module').then((m) => m.SplashPageModule),
  },
  {
    path: 'new-drop-collection-address',
    loadChildren: () =>
      import(
        './new-drop-collection-address/new-drop-collection-address.module'
      ).then((m) => m.NewDropCollectionAddressPageModule),
  },
  {
    path: 'view-message-thread',
    loadChildren: () =>
      import('./view-message-thread/view-message-thread.module').then(
        (m) => m.ViewMessageThreadPageModule
      ),
  },
  {
    path: 'new-drop-important-info',
    loadChildren: () =>
      import('./new-drop-important-info/new-drop-important-info.module').then(
        (m) => m.NewDropImportantInfoPageModule
      ),
  },
  {
    path: 'new-drop-logistics',
    loadChildren: () =>
      import('./new-drop-logistics/new-drop-logistics.module').then(
        (m) => m.NewDropLogisticsPageModule
      ),
  },
  {
    path: 'signup-signin',
    loadChildren: () =>
      import('./signup-signin/signup-signin.module').then(
        (m) => m.SignupSigninPageModule
      ),
  },
  {
    path: 'set-location',
    loadChildren: () =>
      import('./set-location/set-location.module').then(
        (m) => m.SetLocationPageModule
      ),
  },
  {
    path: 'choose-delivery',
    loadChildren: () =>
      import('./choose-delivery/choose-delivery.module').then(
        (m) => m.ChooseDeliveryPageModule
      ),
  },
  {
    path: 'drop-view',
    loadChildren: () =>
      import('./drop-view/drop-view.module').then((m) => m.DropViewPageModule),
  },
  {
    path: 'profile-edit',
    loadChildren: () =>
      import('./profile-edit/profile-edit.module').then(
        (m) => m.ProfileEditPageModule
      ),
  },
  {
    path: 'chat-view',
    loadChildren: () =>
      import('./chat-view/chat-view.module').then((m) => m.ChatViewPageModule),
  },
  {
    path: 'view-maker/:id',
    loadChildren: () =>
      import('./view-maker/view-maker.module').then(
        (m) => m.ViewMakerPageModule
      ),
  },
  {
    path: 'new-drop',
    loadChildren: () =>
      import('./new-drop/new-drop.module').then((m) => m.NewDropPageModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: '',
    // canActivate: [TutorialGuard],
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
