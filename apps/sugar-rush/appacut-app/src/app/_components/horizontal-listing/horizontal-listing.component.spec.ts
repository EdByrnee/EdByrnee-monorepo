import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalListingComponent } from './horizontal-listing.component';

describe('HorizontalListingComponent', () => {
  let component: HorizontalListingComponent;
  let fixture: ComponentFixture<HorizontalListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorizontalListingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
