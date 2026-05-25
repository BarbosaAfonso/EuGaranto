import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AlertsPage } from './alerts.page';
import { WarrantyService } from '../../services/warranty.service';

describe('AlertsPage', () => {
  let component: AlertsPage;
  let fixture: ComponentFixture<AlertsPage>;

  const warrantyServiceMock = {
    warranties$: new BehaviorSubject([]),
    getWarranties: jasmine.createSpy('getWarranties').and.returnValue([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: WarrantyService, useValue: warrantyServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
