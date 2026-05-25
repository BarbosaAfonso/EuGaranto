import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage-angular';
import { WarrantyService } from './warranty.service';

describe('WarrantyService', () => {
  let service: WarrantyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IonicStorageModule.forRoot()],
    });
    service = TestBed.inject(WarrantyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
