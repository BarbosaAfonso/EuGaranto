import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Alert, Warranty, getRemainingLabel, getWarrantyDate, getWarrantyStatus } from '../../models/models';
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
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.loadWarrantyDetails();
  }

  ionViewWillEnter(): void {
    this.loadWarrantyDetails();
  }

  getStatusClass(): string {
    return this.warranty ? getWarrantyStatus(this.warranty) : 'active';
  }

  getStatusText(): string {
    if (!this.warranty) {
      return '';
    }

    const statusLabel = this.getStatusClass() === 'active' ? 'ATIVA' : this.getStatusClass() === 'risk' ? 'EM RISCO' : 'EXPIRADA';
    return `GARANTIA ${statusLabel} · ${getRemainingLabel(this.warranty)}`;
  }

  getWarrantyEndDate(): string {
    return this.warranty ? getWarrantyDate(this.warranty) : '';
  }

  async toggleAlert(alert: Alert): Promise<void> {
    await this.warrantyService.toggleAlert(alert.id);
  }

  addAlert(): void {
    this.router.navigate(['/alert-new', this.warranty?.id]);
  }

  async verFatura(): Promise<void> {
    if (!this.warranty?.capturedImage) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Talão/Fatura',
      message: `<img src="${this.warranty.capturedImage}" alt="Talão ou fatura" style="width:100%;border-radius:12px;object-fit:cover;" />`,
      buttons: ['Fechar'],
      cssClass: 'invoice-preview-alert',
    });

    await alert.present();
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  private loadWarrantyDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.warranty = undefined;
      this.alerts = [];
      this.coveragePercent = 0;
      return;
    }

    this.warranty = this.warrantyService.getWarrantyById(id);
    this.alerts = this.warrantyService.getAlertsForWarranty(id);
    this.coveragePercent = this.warranty
      ? this.warrantyService.getCoveragePercent(this.warranty.purchaseDate, getWarrantyDate(this.warranty))
      : 0;
  }
}
