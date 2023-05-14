import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryToggleComponentComponent } from './gallery-toggle-component.component';

describe('GalleryToggleComponentComponent', () => {
  let component: GalleryToggleComponentComponent;
  let fixture: ComponentFixture<GalleryToggleComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalleryToggleComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryToggleComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
