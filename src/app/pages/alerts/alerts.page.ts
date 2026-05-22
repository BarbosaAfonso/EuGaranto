import { Component } from '@angular/core';
import { WarrantyService } from '../../services/warranty.service';
import { Alert } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
})
export class AlertsPage {

  alerts: Alert[] = [];

  constructor(private warrantyService: WarrantyService) {}

  ionViewWillEnter() { this.alerts = this.warrantyService.getAlerts(); }

  async toggleAlert(alert: Alert) { await this.warrantyService.toggleAlert(alert.id); }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
