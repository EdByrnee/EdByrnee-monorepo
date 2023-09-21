import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalListingComponent } from './vertical-listing.component';

describe('VerticalListingComponent', () => {
  let component: VerticalListingComponent;
  let fixture: ComponentFixture<VerticalListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerticalListingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
