import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { WarrantyService } from '../../services/warranty.service';
import { Alert, Warranty } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-alert-new',
  templateUrl: './alert-new.page.html',
  styleUrls: ['./alert-new.page.scss'],
})
export class AlertNewPage implements OnInit {

  /**
   * CORREÇÃO HEURÍSTICA #3: wizard começa sempre no passo 1,
   * e o indicador de passo está sempre visível.
   */
  currentStep = 1;

  warrantyId  = '';
  productName = '';
  warranty?: Warranty;

  /** Opções rápidas de antecedência em dias */
  dayOptions  = [7, 14, 30, 60, 90];
  selectedDays = 60;

  alertMessage = '';
  notifyPush   = true;
  notifyEmail  = false;

  constructor(
    private route: ActivatedRoute,    // Req. 4 — ActivatedRoute
    private router: Router,
    private warrantyService: WarrantyService,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    /** Req. 5 — ler parâmetro :warrantyId da rota */
    this.warrantyId  = this.route.snapshot.paramMap.get('warrantyId') || '';
    this.warranty    = this.warrantyService.getWarranty(this.warrantyId);
    this.productName = this.warranty?.productName || '';
  }

  selectDays(d: number) { this.selectedDays = d; }

  /** Calcula a data de disparo: data de expiração - dias de antecedência */
  getTriggerDate(): string {
    if (!this.warranty) return '';
    const expiry = new Date(this.warranty.expiryDate);
    expiry.setDate(expiry.getDate() - this.selectedDays);
    return expiry.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  nextStep() { if (this.currentStep < 3) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  /** Guarda o alerta no Ionic Storage */
  async saveAlert() {
    const expiry    = new Date(this.warranty!.expiryDate);
    const triggerDate = new Date(expiry);
    triggerDate.setDate(triggerDate.getDate() - this.selectedDays);

    const alert: Alert = {
      id:          this.warrantyService.generateId(),
      warrantyId:  this.warrantyId,
      productName: this.productName,
      daysBefore:  this.selectedDays,
      triggerDate: triggerDate.toISOString().split('T')[0],
      message:     this.alertMessage || 'Alerta de garantia',
      notifyPush:  this.notifyPush,
      notifyEmail: this.notifyEmail,
      enabled:     true,
      isNew:       true,
    };

    await this.warrantyService.saveAlert(alert);

    const t = await this.toast.create({
      message: '✅ Alerta guardado com sucesso!',
      duration: 2000, color: 'success', position: 'top',
    });
    await t.present();
    this.router.navigate(['/warranty-detail', this.warrantyId]);
  }
}
