import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WarrantyService } from '../../services/warranty.service';
import { Category, Warranty, getRemainingLabel } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-warranty-new',
  templateUrl: './warranty-new.page.html',
  styleUrls: ['./warranty-new.page.scss'],
})
export class WarrantyNewPage implements OnInit {

  /** Passo atual do wizard (1 = fatura, 2 = dados, 3 = foto local, 4 = info local, 5 = sucesso) */
  currentStep = 1;

  invoicePhoto?: string;   // base64 da fatura
  storagePhoto?: string;   // base64 do local de arrumação

  storageLabel    = '';
  storageLocation = '';

  savedWarranty?: Warranty;

  /** Formulário reativo dos dados da garantia (Req. adicional 6) */
  warrantyForm: FormGroup;
  categories: Category[] = [];

  @ViewChild('invoiceInput') invoiceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('storageInput') storageInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private warrantyService: WarrantyService,
    private router: Router,
  ) {
    // Valores pré-preenchidos simulando OCR
    this.warrantyForm = this.fb.group({
      productName:    ['Smart TV Samsung 55"', Validators.required],
      purchaseDate:   [new Date().toISOString().split('T')[0], Validators.required],
      warrantyMonths: ['36', Validators.required],
      categoryId:     ['cat2', Validators.required],
    });
  }

  ngOnInit() {
    this.categories = this.warrantyService.getCategories();
  }

  /** Aciona o input de ficheiro para captura da fatura */
  captureInvoice() { this.invoiceInput.nativeElement.click(); }

  /** Processa a imagem da fatura selecionada */
  onInvoiceFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.invoicePhoto = reader.result as string;
        this.currentStep  = 2; // avançar para formulário
      };
      reader.readAsDataURL(file);
    } else {
      this.currentStep = 2;
    }
  }

  /** Aciona o input de ficheiro para captura do local de arrumação */
  captureStorage() { this.storageInput.nativeElement.click(); }

  /** Processa a imagem do local de arrumação selecionada */
  onStorageFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.storagePhoto = reader.result as string;
        this.currentStep  = 4; // avançar para info do local
      };
      reader.readAsDataURL(file);
    } else {
      this.currentStep = 4;
    }
  }

  nextStep() { if (this.currentStep < 5) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  goBack() { this.router.navigate(['/tabs/home']); }

  /** Guarda a garantia no Ionic Storage */
  async saveWarranty() {
    const v = this.warrantyForm.value;
    const warranty: Warranty = {
      id:              this.warrantyService.generateId(),
      productName:     v.productName,
      purchaseDate:    v.purchaseDate,
      warrantyMonths:  Number(v.warrantyMonths),
      expiryDate:      this.warrantyService.calcExpiryDate(v.purchaseDate, Number(v.warrantyMonths)),
      categoryId:      v.categoryId,
      invoicePhotoUrl: this.invoicePhoto,
      storagePhotoUrl: this.storagePhoto,
      storageLabel:    this.storageLabel   || undefined,
      storageLocation: this.storageLocation || undefined,
      createdAt:       new Date().toISOString(),
    };
    await this.warrantyService.saveWarranty(warranty);
    this.savedWarranty = warranty;
    this.currentStep   = 5;
  }

  finish() { this.router.navigate(['/tabs/home'], { replaceUrl: true }); }

  getRemainingLabel(d: string): string { return getRemainingLabel(d); }

  formatDate(d: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
