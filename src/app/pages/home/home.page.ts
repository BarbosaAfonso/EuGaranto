import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Warranty, getWarrantyStatus, getWarrantyTitle } from '../../models/models';
import { WarrantyService } from '../../services/warranty.service';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  warranties: Warranty[] = [];
  filteredWarranties: Warranty[] = [];
  searchQuery = '';
  activeCount = 0;
  expiringSoonCount = 0;

  private sub?: Subscription;

  constructor(
    private warrantyService: WarrantyService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.sub = this.warrantyService.warranties$.subscribe(warranties => {
      this.warranties = warranties;
      this.applyFilter();
      this.activeCount = this.warrantyService.getActiveCount();
      this.expiringSoonCount = this.warrantyService.getExpiringSoonCount();
    });
  }

  ionViewWillEnter() {
    this.warrantyService.warranties$.next(this.warrantyService.getWarranties());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onSearch() {
    this.applyFilter();
  }

  goToDetail(id: string) {
    this.router.navigate(['/warranty-detail', id]);
  }

  getTitle(warranty: Warranty): string {
    return getWarrantyTitle(warranty);
  }

  getStatusClass(warranty: Warranty): string {
    return getWarrantyStatus(warranty);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private applyFilter() {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredWarranties = [...this.warranties];
      return;
    }

    this.filteredWarranties = this.warranties.filter(warranty =>
      this.getTitle(warranty).toLowerCase().includes(query) ||
      warranty.category.toLowerCase().includes(query)
    );
  }
}
