import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryNewPage } from './category-new.page';

describe('CategoryNewPage', () => {
  let component: CategoryNewPage;
  let fixture: ComponentFixture<CategoryNewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
