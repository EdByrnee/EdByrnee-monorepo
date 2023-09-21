import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerListingComponent } from './maker-listing.component';

describe('HorizontalListingComponent', () => {
  let component: MakerListingComponent;
  let fixture: ComponentFixture<MakerListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MakerListingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MakerListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
