import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category, Warranty, getRemainingLabel } from '../../models/models';
import { WarrantyService } from '../../services/warranty.service';

@Component({
  standalone: false,
  selector: 'app-warranty-new',
  templateUrl: './warranty-new.page.html',
  styleUrls: ['./warranty-new.page.scss'],
})
export class WarrantyNewPage implements OnInit {
  currentStep = 1;

  invoicePhoto?: string;
  storagePhoto?: string;

  storageLabel = '';
  storageLocation = '';

  savedWarranty?: Warranty;
  warrantyForm: FormGroup;
  categories: Category[] = [];

  @ViewChild('invoiceInput') invoiceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('storageInput') storageInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private warrantyService: WarrantyService,
    private router: Router,
  ) {
    this.warrantyForm = this.fb.group({
      productName: ['Smart TV Samsung 55"', Validators.required],
      purchaseDate: [new Date().toISOString().split('T')[0], Validators.required],
      warrantyMonths: ['36', Validators.required],
      categoryId: ['cat2', Validators.required],
    });
  }

  ngOnInit() {
    this.categories = this.warrantyService.getCategories();
  }

  captureInvoice() {
    this.invoiceInput.nativeElement.click();
  }

  onInvoiceFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.invoicePhoto = reader.result as string;
        this.currentStep = 2;
      };
      reader.readAsDataURL(file);
    } else {
      this.currentStep = 2;
    }
  }

  captureStorage() {
    this.storageInput.nativeElement.click();
  }

  onStorageFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.storagePhoto = reader.result as string;
        this.currentStep = 4;
      };
      reader.readAsDataURL(file);
    } else {
      this.currentStep = 4;
    }
  }

  nextStep() {
    if (this.currentStep < 5) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  async saveWarranty() {
    const formValue = this.warrantyForm.value;
    const expiryDate = this.warrantyService.calcExpiryDate(formValue.purchaseDate, Number(formValue.warrantyMonths));
    const categoryName = this.warrantyService.getCategory(formValue.categoryId)?.name || 'Sem categoria';

    const warranty: Warranty = {
      id: this.warrantyService.generateId(),
      title: formValue.productName,
      productName: formValue.productName,
      purchaseDate: formValue.purchaseDate,
      endDate: expiryDate,
      status: 'ATIVA',
      category: categoryName,
      warrantyMonths: Number(formValue.warrantyMonths),
      expiryDate,
      categoryId: formValue.categoryId,
      invoicePhotoUrl: this.invoicePhoto,
      storagePhotoUrl: this.storagePhoto,
      storageLabel: this.storageLabel || undefined,
      storageLocation: this.storageLocation || undefined,
      createdAt: new Date().toISOString(),
    };

    await this.warrantyService.saveWarranty(warranty);
    this.savedWarranty = warranty;
    this.currentStep = 5;
  }

  finish() {
    this.router.navigate(['/tabs/home'], { replaceUrl: true });
  }

  getRemainingLabel(date: string): string {
    return getRemainingLabel(date);
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
