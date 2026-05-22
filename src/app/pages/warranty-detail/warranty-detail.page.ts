import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert, Warranty, getRemainingLabel, getWarrantyDate, getWarrantyStatus, getWarrantyTitle } from '../../models/models';
import { WarrantyService } from '../../services/warranty.service';

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
    private route: ActivatedRoute,
    private router: Router,
    private warrantyService: WarrantyService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.warranty = this.warrantyService.getWarranty(id);
    this.alerts = this.warrantyService.getAlertsForWarranty(id);
    this.coveragePercent = this.warranty
      ? this.warrantyService.getCoveragePercent(this.warranty.purchaseDate, getWarrantyDate(this.warranty))
      : 0;
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.alerts = this.warrantyService.getAlertsForWarranty(id);
  }

  getStatusClass(): string {
    return this.warranty ? getWarrantyStatus(this.warranty) : 'active';
  }

  getStatusText(): string {
    return this.warranty
      ? `GARANTIA ${this.getStatusClass() === 'active' ? 'ATIVA' : 'EM RISCO'} · ${getRemainingLabel(this.warranty)}`
      : '';
  }

  getCategoryName(): string {
    if (!this.warranty) return '';
    return this.warranty.category || this.warrantyService.getCategory(this.warranty.categoryId || '')?.name || '';
  }

  getWarrantyTitle(): string {
    return this.warranty ? getWarrantyTitle(this.warranty) : '';
  }

  getWarrantyEndDate(): string {
    return this.warranty ? getWarrantyDate(this.warranty) : '';
  }

  async toggleAlert(alert: Alert) {
    await this.warrantyService.toggleAlert(alert.id);
  }

  addAlert() {
    this.router.navigate(['/alert-new', this.warranty?.id]);
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
