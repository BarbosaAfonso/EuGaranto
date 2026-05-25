import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Alert, Warranty, getWarrantyDate, getWarrantyTitle } from '../../models/models';
import { WarrantyService } from '../../services/warranty.service';

@Component({
  standalone: false,
  selector: 'app-alert-new',
  templateUrl: './alert-new.page.html',
  styleUrls: ['./alert-new.page.scss'],
})
export class AlertNewPage implements OnInit {
  currentStep = 1;

  warrantyId = '';
  productName = '';
  warranty?: Warranty;

  quickDayOptions = [7, 30, 60];
  daysBefore = 30;
  customMessage = '';
  pushEnabled = true;
  emailEnabled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private warrantyService: WarrantyService,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.warrantyId = this.route.snapshot.paramMap.get('warrantyId') || '';
    this.warranty = this.warrantyService.getWarranty(this.warrantyId);
    this.productName = this.warranty ? getWarrantyTitle(this.warranty) : '';
  }

  selectDays(days: number) {
    this.daysBefore = days;
  }

  getTriggerDate(): string {
    if (!this.warranty) return '';

    const expiry = new Date(getWarrantyDate(this.warranty));
    expiry.setDate(expiry.getDate() - this.daysBefore);
    return expiry.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getMessagePreview(): string {
    return this.customMessage.trim() || `Lembrar garantia de ${this.productName}`;
  }

  getSummaryChannels(): string {
    const channels: string[] = [];

    if (this.pushEnabled) {
      channels.push('Push');
    }

    if (this.emailEnabled) {
      channels.push('Email');
    }

    return channels.length ? channels.join(' e ') : 'Sem canais ativos';
  }

  nextStep() {
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  async cancelOrBack(): Promise<void> {
    if (this.currentStep > 1) {
      this.prevStep();
      return;
    }

    await this.router.navigate(['/warranty-detail', this.warrantyId]);
  }

  async saveAlert() {
    if (!this.warranty) {
      return;
    }

    const expiry = new Date(getWarrantyDate(this.warranty));
    const triggerDate = new Date(expiry);
    triggerDate.setDate(triggerDate.getDate() - this.daysBefore);

    const alert: Alert = {
      id: this.warrantyService.generateId(),
      warrantyId: this.warrantyId,
      productName: this.productName,
      daysBefore: this.daysBefore,
      triggerDate: triggerDate.toISOString().split('T')[0],
      message: this.getMessagePreview(),
      notifyPush: this.pushEnabled,
      notifyEmail: this.emailEnabled,
      enabled: true,
      isNew: true,
    };

    await this.warrantyService.saveAlert(alert);

    const toast = await this.toast.create({
      message: 'Alerta guardado com sucesso.',
      duration: 2000,
      color: 'success',
      position: 'top',
    });

    await toast.present();
    await this.router.navigate(['/warranty-detail', this.warrantyId]);
  }
}
