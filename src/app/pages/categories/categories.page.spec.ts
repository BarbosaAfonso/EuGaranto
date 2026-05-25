import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CategoriesPage } from './categories.page';
import { WarrantyService } from '../../services/warranty.service';

describe('CategoriesPage', () => {
  let component: CategoriesPage;
  let fixture: ComponentFixture<CategoriesPage>;

  const warrantyServiceMock = {
    warranties$: new BehaviorSubject([]),
    getWarranties: jasmine.createSpy('getWarranties').and.returnValue([]),
    getCategories: jasmine.createSpy('getCategories').and.returnValue([]),
    updateWarrantiesCategory: jasmine.createSpy('updateWarrantiesCategory').and.resolveTo(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: WarrantyService, useValue: warrantyServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
