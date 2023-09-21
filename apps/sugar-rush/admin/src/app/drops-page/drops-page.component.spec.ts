import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropsPageComponent } from './drops-page.component';

describe('DropsPageComponent', () => {
  let component: DropsPageComponent;
  let fixture: ComponentFixture<DropsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
