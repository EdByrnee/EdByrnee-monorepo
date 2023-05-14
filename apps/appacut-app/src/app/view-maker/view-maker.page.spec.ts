import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IDrop, IUserProfile } from '@shoppr-monorepo/api-interfaces';
import { of } from 'rxjs';
import { AuthService } from '../../core/auth';
import { DropsService } from '../../core/drops';
import { MessageService } from '../../core/messages';

import { ViewMakerPage } from './view-maker.page';

const mockUserProfile: IUserProfile = {
  uuid: 'id',
  name: 'name',
  username: 'username',
  maker: true,
  email: 'email',
  photoUrl: 'photoUrl',
  bio: 'bio',
  website: 'website',
  createdAt: 'website',
  lastSignIn: new Date(),
  activeDropCount: 1,
};

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

describe('ViewMakerPage', () => {
  let component: ViewMakerPage;
  let fixture: ComponentFixture<ViewMakerPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'id',
              },
            },
          },
        },
        {
          provide: AuthService,
          useValue: {
            getUserProfile: () => {
              return of(mockUserProfile);
            },
            currentUser$: of(mockUserProfile),
          },
        },
        {
          provide: DropsService,
          useValue: {
            getDropsByMaker: () => {
              return of([mockDrop]);
            },
          },
        },
        {
          provide: MessageService,
          useValue: {
            openMessageThread: () => {},
          },
        },
      ],
      declarations: [ViewMakerPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMakerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should always display bio', () => {
    // Arrange
    const bio = fixture.nativeElement.querySelector('.bio');
    // Assume
    // Act
    // Assert
    expect(bio).toBeTruthy();
  });

  describe('when user is a maker', () => {
    it('should display stats', () => {
      // Arrange
      const stats = fixture.nativeElement.querySelectorAll('.stat');
      // Assume
      // Act
      // Assert
      expect(stats.length).toEqual(3);
    });

    it('should not show story', () => {
      // Arrange
      const story = fixture.nativeElement.querySelector('.story');
      // Assume
      // Act
      // Assert
      expect(story).toBeTruthy();
    });

    it('should not show drops', () => {
      // Arrange
      const story = fixture.nativeElement.querySelector('.story');
      // Assume
      // Act
      // Assert
      expect(story).toBeTruthy();
    });
  });
});
