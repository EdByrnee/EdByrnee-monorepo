import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IDrop, IUserProfile } from '@shoppr-monorepo/api-interfaces';
import { of } from 'rxjs';
import { AuthService } from '../../core/auth';
import { DropsService } from '../../core/drops';
import { MapsService } from '../../core/maps.service';
import { DropViewPageModule } from './drop-view.module';

import { DropViewPage } from './drop-view.page';
import {
  createCircleSpy,
  createMapConstructorSpy,
  createMapSpy,
} from './fake-map-utils';

export const DEFAULT_OPTIONS: google.maps.MapOptions = {
  center: { lat: 37.421995, lng: -122.084092 },
  zoom: 17,
  // Note: the type conversion here isn't necessary for our CI, but it resolves a g3 failure.
  mapTypeId: 'roadmap' as unknown as google.maps.MapTypeId,
};

export const CIRCLE_OPTIONS: google.maps.CircleOptions = {
  center: { lat: 37.421995, lng: -122.084092 },
  radius: 100,
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
};

describe('DropViewPage', () => {
  let component: DropViewPage;
  let fixture: ComponentFixture<DropViewPage>;

  const mockDrop: IDrop = {
    uuid: 'id',
    name: 'Ed Byrne',
    description: 'description',
    price: 1,
    qty_available: 1,
    size: 'size',
    ingredients: 'ingredients',
    age_restricted: true,
    shipping: 'shipping',
    collection: 'collection',
    makerUuid: 'makerUuid',
    localDeliveryEnabled: true,
    nationalDeliveryEnabled: true,
    collectionEnabled: true,
    allergens: 'Nuts',
  };

  const mockUserProfile: IUserProfile = {
    uuid: 'id',
    name: 'name',
    username: 'username',
    maker: true,
    email: 'email',
    photoUrl: 'http://drop-view.com/photoUrl',
    bio: 'bio',
    website: 'website',
    createdAt: 'website',
    lastSignIn: new Date(),
    activeDropCount: 1,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MapsService,
          useValue: {
            geocode: () => {
              return Promise.resolve({ lat: 0, lng: 0 });
            },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => {
                  return '123';
                },
              },
            },
          },
        },
        {
          provide: DropsService,
          useValue: {
            getDrop: (id: string) => {
              return of(mockDrop);
            },
          },
        },
        {
          provide: AuthService,
          useValue: {
            getUserProfile: () => {
              return of(mockUserProfile);
            },
          },
        },
      ],
      declarations: [DropViewPage],
      imports: [IonicModule.forRoot(), DropViewPageModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DropViewPage);
    component = fixture.componentInstance;

    const mapSpy = createMapSpy(DEFAULT_OPTIONS);
    const mapConstructorSpy = createMapConstructorSpy(mapSpy);
    const circleSpy = createCircleSpy(CIRCLE_OPTIONS);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('after OnNgInit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('should always display', () => {
      it('should display photo slides', () => {
        const photoSlidesElement =
          fixture.nativeElement.querySelector('.photo-slides');
        expect(photoSlidesElement).toBeTruthy();
      });

      it('should display national, local and collection chips', () => {
        const nationalChipElement = fixture.nativeElement.querySelector(
          '.national-delivery-chip'
        );
        const localChipElement = fixture.nativeElement.querySelector(
          '.local-delivery-chip'
        );
        const collectionChipElement =
          fixture.nativeElement.querySelector('.collection-chip');
        expect(nationalChipElement).toBeTruthy();
        expect(localChipElement).toBeTruthy();
        expect(collectionChipElement).toBeTruthy();
      });

      it('should display drop name and description', () => {
        const nameElement = fixture.nativeElement.querySelector('.drop-name');
        const descriptionElement =
          fixture.nativeElement.querySelector('.drop-description');
        expect(nameElement.textContent).toEqual(mockDrop.name);
        expect(descriptionElement.textContent).toEqual(mockDrop.description);
      });

      it('should display the makers name, bio, avatar and location', () => {
        const makerNameElement =
          fixture.nativeElement.querySelector('.maker-name');
        const makerBioElement =
          fixture.nativeElement.querySelector('.maker-bio');
        const makerAvatarElement =
          fixture.nativeElement.querySelector('.maker-avatar-img');
        const makerLocationElement =
          fixture.nativeElement.querySelector('.maker-location');
        expect(makerNameElement.textContent).toEqual(
          'Made by ' + mockUserProfile.name
        );
        expect(makerBioElement.textContent).toEqual(mockUserProfile.bio);
        expect(makerAvatarElement.src).toEqual(mockUserProfile.photoUrl);
        expect(makerLocationElement.textContent).toEqual('Made in Liverpool');
      });

      it('should display allegen info (title, info/ disclaimer)', () => {
        const allegenTitleElement =
          fixture.nativeElement.querySelector('.allegen-title');
        const allegenInfoElement =
          fixture.nativeElement.querySelector('.allegen-info');
        const allegenDisclaimerElement = fixture.nativeElement.querySelector(
          '.allegen-disclaimer'
        );
        expect(allegenTitleElement.textContent).toEqual('Allergens');
        expect(allegenInfoElement.textContent).toEqual('Nuts');
        expect(allegenDisclaimerElement.textContent).toEqual(
          ` All food sold on Local Shelf may contain traces of nuts, gluten, eggs, milk, soya, sesame, celery, mustard, fish, crustaceans, molluscs, lupin, sulphites, peanuts, and other allergens. For more specific allergn information  please contact the maker`
        );
      });

      it('should display ingredients (title, info)', () => {
        const ingredientsTitleElement =
          fixture.nativeElement.querySelector('.ingredients-title');
        const ingredientsInfoElement =
          fixture.nativeElement.querySelector('.ingredients-info');
        expect(ingredientsTitleElement.textContent).toEqual('Ingredients');
        expect(ingredientsInfoElement.textContent).toEqual(
          mockDrop.ingredients
        );
      });

      it('should display price and buy now button', () => {
        const priceElement =
          fixture.nativeElement.querySelector('.footer-price');
        const buyNowButton =
          fixture.nativeElement.querySelector('.buy-now-button');
        expect(priceElement.textContent).toEqual('£1.00');
        expect(buyNowButton.textContent).toEqual(' Buy Now ');
      });
    });

    describe('loadData', () => {
      it('should load all data (drop/userProfile)', () => {
        expect(component.drop).toEqual(mockDrop);
      });

      it('should set loading to false', () => {
        expect(component.loading).toBeFalse();
      });
    });

    describe('when drop has LOCAL_DELIVERY enabled', () => {
      it('should display a local delivery map', () => {
        // Arrange
        component.drop.localDeliveryEnabled = true;
        // Assume
        // Act
        const mapElement = fixture.nativeElement.querySelector(
          '.local-delivery-map'
        );
        // Assert
        expect(mapElement).toBeTruthy();
      });

      it('should have built all of the map settings, BEFORE the app is shown', () => {
        // Arrange
        component.drop.localDeliveryEnabled = true;
        // Assume
        // Act
        const mapElement = fixture.nativeElement.querySelector(
          '.local-delivery-map'
        );
        // Assert
        expect(mapElement).toBeTruthy();
      });
    });

    // describe('when drop has LOCAL_DELIVERY disabled', () => {
    //   it('should NOT display a local delivery map', () => {
    //     // Arrange
    //     component.drop.localDeliveryEnabled = false;
    //     // Assume
    //     // Act
    //     fixture.detectChanges();
    //     const mapElement = fixture.nativeElement.querySelector(
    //       '.local-delivery-map'
    //     );
    //     // Assert
    //     expect(mapElement).toBeFalsy();
    //   });
    // });
  });
});
