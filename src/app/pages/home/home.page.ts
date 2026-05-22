import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WarrantyService } from '../../services/warranty.service';
import { Warranty, getWarrantyStatus, getRemainingLabel } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnDestroy {

  warranties: Warranty[] = [];
  filteredWarranties: Warranty[] = [];
  searchQuery = '';
  activeCount = 0;
  riskCount   = 0;

  private sub: Subscription;

  constructor(
    private warrantyService: WarrantyService,
    private router: Router,
  ) {
    // Subscrever a alterações em tempo real
    this.sub = this.warrantyService.warranties$.subscribe(list => {
      this.warranties         = list;
      this.filteredWarranties = [...list];
      this.activeCount        = this.warrantyService.getActiveCount();
      this.riskCount          = this.warrantyService.getRiskCount();
    });
  }

  /** Atualiza dados ao entrar na página */
  ionViewWillEnter() {
    this.warrantyService.warranties$.next(this.warrantyService.getWarranties());
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  /** Filtra garantias pelo texto de pesquisa */
  onSearch() {
    const q = this.searchQuery.toLowerCase();
    this.filteredWarranties = this.warranties.filter(w =>
      w.productName.toLowerCase().includes(q) ||
      (w.brand?.toLowerCase().includes(q) ?? false)
    );
  }

  /** Navega para detalhe da garantia, passando o ID como parâmetro (Req. 5) */
  openWarranty(id: string) {
    this.router.navigate(['/warranty-detail', id]);
  }

  getStatus(expiryDate: string): string { return getWarrantyStatus(expiryDate); }

  getStatusLabel(expiryDate: string): string {
    const s = getWarrantyStatus(expiryDate);
    return s === 'active' ? 'ATIVA' : s === 'risk' ? 'EM RISCO' : 'EXPIRADA';
  }

  getRemainingLabel(d: string): string { return getRemainingLabel(d); }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
  }

  getCategoryIcon(catId: string): string {
    return this.warrantyService.getCategory(catId)?.icon || 'cube-outline';
  }
}
