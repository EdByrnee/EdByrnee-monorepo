import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DriverReplenishWarehouseStockPage } from './driver-replenish-warehouse-stock.page';

describe('DriverReplenishWarehouseStockPage', () => {
  let component: DriverReplenishWarehouseStockPage;
  let fixture: ComponentFixture<DriverReplenishWarehouseStockPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DriverReplenishWarehouseStockPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverReplenishWarehouseStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
