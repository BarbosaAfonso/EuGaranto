import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WarrantyService } from '../../services/warranty.service';
import { Warranty, Alert, getWarrantyStatus, getRemainingLabel } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-warranty-detail',
  templateUrl: './warranty-detail.page.html',
  styleUrls: ['./warranty-detail.page.scss'],
})
export class WarrantyDetailPage implements OnInit {

  warranty?: Warranty;
  alerts: Alert[] = [];
  coveragePercent = 0;

  constructor(
    private route: ActivatedRoute,   // Req. 4 — ActivatedRoute
    private router: Router,
    private warrantyService: WarrantyService,
  ) {}

  ngOnInit() {
    /** Req. 5 — ler parâmetro :id da rota */
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.warranty       = this.warrantyService.getWarranty(id);
      this.alerts         = this.warrantyService.getAlertsForWarranty(id);
      this.coveragePercent = this.warranty
        ? this.warrantyService.getCoveragePercent(this.warranty.purchaseDate, this.warranty.expiryDate)
        : 0;
    }
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.alerts = this.warrantyService.getAlertsForWarranty(id);
  }

  getStatusClass(): string { return this.warranty ? getWarrantyStatus(this.warranty.expiryDate) : 'active'; }

  getStatusText(): string {
    return this.warranty
      ? `GARANTIA ${this.getStatusClass() === 'active' ? 'ATIVA' : 'EM RISCO'} · ${getRemainingLabel(this.warranty.expiryDate)}`
      : '';
  }

  getCategoryName(): string {
    return this.warranty ? (this.warrantyService.getCategory(this.warranty.categoryId)?.name || '') : '';
  }

  async toggleAlert(alert: Alert) { await this.warrantyService.toggleAlert(alert.id); }

  /** Navega para criação de alerta, passando o warrantyId como parâmetro (Req. 5) */
  addAlert() { this.router.navigate(['/alert-new', this.warranty?.id]); }

  formatDate(d: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
