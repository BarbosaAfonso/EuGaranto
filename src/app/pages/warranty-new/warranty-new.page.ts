import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Category, Warranty } from '../../models/models';
import { WarrantyService } from '../../services/warranty.service';

@Component({
  standalone: false,
  selector: 'app-warranty-new',
  templateUrl: './warranty-new.page.html',
  styleUrls: ['./warranty-new.page.scss'],
})
export class WarrantyNewPage implements OnInit {
  isPhotoTaken = false;
  capturedImage: string | undefined;
  warrantyForm!: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private warrantyService: WarrantyService,
  ) {}

  ngOnInit(): void {
    this.categories = this.warrantyService.getCategories();
    this.warrantyForm = this.fb.group({
      productName: ['', Validators.required],
      purchaseDate: ['', Validators.required],
      duration: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  async takePhoto(): Promise<void> {
    const result = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

    if (!result.dataUrl) {
      return;
    }

    const simulatedCategory =
      this.categories.find(category => category.name.toLowerCase().includes('sala'))?.name ??
      this.categories[0]?.name ??
      'Sala';

    this.capturedImage = result.dataUrl;
    this.isPhotoTaken = true;
    this.warrantyForm.patchValue({
      productName: 'Smart TV Samsung',
      purchaseDate: new Date().toISOString().split('T')[0],
      duration: '3 anos',
      category: simulatedCategory,
    });
  }

  async onSubmit(): Promise<void> {
    if (this.warrantyForm.invalid) {
      this.warrantyForm.markAllAsTouched();
      return;
    }

    const formValue = this.warrantyForm.getRawValue();
    const warrantyMonths = this.parseDurationToMonths(formValue.duration);
    const expiryDate = this.warrantyService.calcExpiryDate(formValue.purchaseDate, warrantyMonths);
    const selectedCategory = this.categories.find(category => category.name === formValue.category);

    const warranty: Warranty = {
      id: `war-${Date.now()}`,
      title: formValue.productName,
      productName: formValue.productName,
      purchaseDate: formValue.purchaseDate,
      endDate: expiryDate,
      status: 'ATIVA',
      category: formValue.category,
      warrantyMonths,
      expiryDate,
      categoryId: selectedCategory?.id,
      capturedImage: this.capturedImage,
      invoicePhotoUrl: this.capturedImage,
      createdAt: new Date().toISOString(),
    };

    await this.warrantyService.addWarranty(warranty);
    await this.router.navigate(['/tabs/home']);
  }

  private parseDurationToMonths(duration: string): number {
    const parsedYears = Number.parseInt(duration, 10);
    return Number.isNaN(parsedYears) ? 36 : parsedYears * 12;
  }
}
