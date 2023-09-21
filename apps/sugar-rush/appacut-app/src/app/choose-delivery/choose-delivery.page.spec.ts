import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseDeliveryPage } from './choose-delivery.page';

describe('ChooseDeliveryPage', () => {
  let component: ChooseDeliveryPage;
  let fixture: ComponentFixture<ChooseDeliveryPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseDeliveryPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseDeliveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
