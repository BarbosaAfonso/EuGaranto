import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WarrantyService } from '../../services/warranty.service';
import { Category } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {

  categories: Category[] = [];
  totalWarranties = 0;

  /** CORREÇÃO HEURÍSTICA #6: banner só aparece APÓS a ação */
  showBanner  = false;
  bannerMsg   = '';

  constructor(
    private warrantyService: WarrantyService,
    private router: Router,
  ) {}

  ionViewWillEnter() {
    this.categories     = this.warrantyService.getCategories();
    this.totalWarranties = this.warrantyService.getWarranties().length;

    // Feedback de ação recente (ex: categoria criada)
    const state = history.state;
    if (state?.successMsg) {
      this.bannerMsg  = state.successMsg;
      this.showBanner = true;
      setTimeout(() => this.showBanner = false, 3000);
    }
  }

  getItemCount(catId: string): number {
    return this.warrantyService.getCategoryItemCount(catId);
  }

  openCategory(cat: Category) {
    /** Req. 5 — passar categoria como estado de navegação */
    this.router.navigate(['/tabs/categories'], {
      state: { selectedCat: cat }
    });
  }

  newCategory() { this.router.navigate(['/category-new']); }
}
