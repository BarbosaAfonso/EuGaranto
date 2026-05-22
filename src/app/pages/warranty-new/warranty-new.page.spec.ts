import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarrantyNewPage } from './warranty-new.page';

describe('WarrantyNewPage', () => {
  let component: WarrantyNewPage;
  let fixture: ComponentFixture<WarrantyNewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
