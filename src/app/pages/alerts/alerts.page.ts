import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Alert, Warranty, getWarrantyDate, getWarrantyTitle } from '../../models/models';
import { WarrantyService } from '../../services/warranty.service';

interface WarrantyAlertItem {
  alert: Alert;
  warranty: Warranty;
  daysRemaining: number;
}

@Component({
  standalone: false,
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
})
export class AlertsPage implements OnInit, OnDestroy {
  alertasOriginais: WarrantyAlertItem[] = [];
  alertasFiltrados: WarrantyAlertItem[] = [];

  private sub?: Subscription;

  constructor(private warrantyService: WarrantyService) {}

  ngOnInit(): void {
    this.sub = combineLatest([
      this.warrantyService.alerts$,
      this.warrantyService.warranties$,
    ]).subscribe(([alerts, warranties]) => {
      this.alertasOriginais = this.getSortedAlerts(alerts, warranties);
      this.alertasFiltrados = [...this.alertasOriginais];
    });
  }

  ionViewWillEnter(): void {
    this.warrantyService.warranties$.next(this.warrantyService.getWarranties());
    this.warrantyService.alerts$.next(this.warrantyService.getAlerts());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getTitle(warranty: Warranty): string {
    return getWarrantyTitle(warranty);
  }

  pesquisarAlertas(event: CustomEvent): void {
    const termoPesquisa = String(event.detail?.value || '').trim().toLowerCase();

    if (!termoPesquisa) {
      this.alertasFiltrados = [...this.alertasOriginais];
      return;
    }

    this.alertasFiltrados = this.alertasOriginais.filter(item => {
      const nomeAparelho = this.getTitle(item.warranty).toLowerCase();
      const nomeAlerta = item.alert.productName.toLowerCase();

      return nomeAparelho.includes(termoPesquisa) || nomeAlerta.includes(termoPesquisa);
    });
  }

  getDaysRemaining(endDate: string): number {
    const today = new Date();
    const expiryDate = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  getBadgeColor(daysRemaining: number): 'danger' | 'warning' {
    return daysRemaining <= 7 ? 'danger' : 'warning';
  }

  getBadgeText(daysRemaining: number): string {
    if (daysRemaining < 0) {
      return `Expirou há ${Math.abs(daysRemaining)} dia(s)`;
    }

    return `Resta(m) ${daysRemaining} dia(s)`;
  }

  trackByWarranty(_: number, item: WarrantyAlertItem): string {
    return item.alert.id;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private getSortedAlerts(alerts: Alert[], warranties: Warranty[]): WarrantyAlertItem[] {
    return alerts
      .map(alert => {
        const warranty = warranties.find(item => item.id === alert.warrantyId);
        if (!warranty) return undefined;

        return {
          alert,
          warranty,
          daysRemaining: this.getDaysRemaining(getWarrantyDate(warranty)),
        };
      })
      .filter((item): item is WarrantyAlertItem => !!item)
      .sort((first, second) => {
        const firstExpiry = new Date(getWarrantyDate(first.warranty));
        const secondExpiry = new Date(getWarrantyDate(second.warranty));

        return firstExpiry.getTime() - secondExpiry.getTime();
      });
  }
}
