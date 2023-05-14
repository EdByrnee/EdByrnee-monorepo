import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewDropImportantInfoPage } from './new-drop-important-info.page';

describe('NewDropImportantInfoPage', () => {
  let component: NewDropImportantInfoPage;
  let fixture: ComponentFixture<NewDropImportantInfoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewDropImportantInfoPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NewDropImportantInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
