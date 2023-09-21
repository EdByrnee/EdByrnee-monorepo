import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewDropCollectionAddressPage } from './new-drop-collection-address.page';

describe('NewDropCollectionAddressPage', () => {
  let component: NewDropCollectionAddressPage;
  let fixture: ComponentFixture<NewDropCollectionAddressPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewDropCollectionAddressPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NewDropCollectionAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
