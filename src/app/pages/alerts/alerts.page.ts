import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Warranty, getWarrantyTitle } from '../../models/models';
import { WarrantyService } from '../../services/warranty.service';

interface WarrantyAlertItem {
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
  alertWarranties: WarrantyAlertItem[] = [];

  private sub?: Subscription;

  constructor(private warrantyService: WarrantyService) {}

  ngOnInit(): void {
    this.sub = this.warrantyService.warranties$.subscribe(warranties => {
      this.alertWarranties = this.getFilteredAndSortedWarranties(warranties);
    });
  }

  ionViewWillEnter(): void {
    this.warrantyService.warranties$.next(this.warrantyService.getWarranties());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getTitle(warranty: Warranty): string {
    return getWarrantyTitle(warranty);
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
    return item.warranty.id;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private getFilteredAndSortedWarranties(warranties: Warranty[]): WarrantyAlertItem[] {
    return warranties
      .map(warranty => ({
        warranty,
        daysRemaining: this.getDaysRemaining(warranty.endDate),
      }))
      .filter(item => item.daysRemaining <= 30)
      .sort((first, second) => {
        const firstExpired = first.daysRemaining < 0;
        const secondExpired = second.daysRemaining < 0;

        if (firstExpired && !secondExpired) return -1;
        if (!firstExpired && secondExpired) return 1;
        if (firstExpired && secondExpired) return second.daysRemaining - first.daysRemaining;

        return first.daysRemaining - second.daysRemaining;
      });
  }
}
