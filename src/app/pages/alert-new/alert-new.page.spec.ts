import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertNewPage } from './alert-new.page';

describe('AlertNewPage', () => {
  let component: AlertNewPage;
  let fixture: ComponentFixture<AlertNewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
