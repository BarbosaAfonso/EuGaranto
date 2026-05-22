import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarrantyDetailPage } from './warranty-detail.page';

describe('WarrantyDetailPage', () => {
  let component: WarrantyDetailPage;
  let fixture: ComponentFixture<WarrantyDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
