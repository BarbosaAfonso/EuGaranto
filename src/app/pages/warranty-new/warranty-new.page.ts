import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  allCategoryNames: string[] = [];

  isEditMode = false;
  editingWarrantyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private warrantyService: WarrantyService,
  ) {}

  ngOnInit(): void {
    this.warrantyForm = this.fb.group({
      productName:  ['', Validators.required],
      purchaseDate: ['', Validators.required],
      duration:     ['', Validators.required],
      category:     ['', Validators.required],
    });

    this.loadAllCategories();

    this.editingWarrantyId = this.route.snapshot.queryParamMap.get('id');
    if (this.editingWarrantyId) {
      this.isEditMode = true;
      this.loadWarrantyForEdit(this.editingWarrantyId);
    }
  }

  ionViewWillEnter(): void {
    this.loadAllCategories();
  }

  // ✅ Inclui categorias padrão + seed + garantias existentes
  private loadAllCategories(): void {
    this.categories = this.warrantyService.getCategories();

    const defaultNames  = ['Cozinha', 'Escritório', 'Outros', 'Quarto', 'Sala de Estar'];
    const seedNames     = this.categories.map(c => c.name);
    const warrantyNames = this.warrantyService.getWarranties()
      .map(w => w.category?.trim())
      .filter((c): c is string => !!c);

    this.allCategoryNames = [...new Set([...defaultNames, ...seedNames, ...warrantyNames])].sort((a, b) =>
      a.localeCompare(b, 'pt')
    );
  }

  async takePhoto(): Promise<void> {
    const result = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

    if (!result.dataUrl) return;

    const simulatedCategory = this.allCategoryNames[0] ?? 'Outros';

    this.capturedImage = result.dataUrl;
    this.isPhotoTaken = true;

    if (!this.isEditMode) {
      this.warrantyForm.patchValue({
        productName:  'Smart TV Samsung',
        purchaseDate: new Date().toISOString().split('T')[0],
        duration:     '3 anos',
        category:     simulatedCategory,
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.warrantyForm.invalid) {
      this.warrantyForm.markAllAsTouched();
      return;
    }

    const formValue = this.warrantyForm.getRawValue();
    const warrantyMonths = this.parseDurationToMonths(formValue.duration);
    const expiryDate = this.warrantyService.calcExpiryDate(formValue.purchaseDate, warrantyMonths);
    const selectedCategory = this.categories.find(c => c.name === formValue.category);

    if (this.isEditMode && this.editingWarrantyId) {
      const existing = this.warrantyService.getWarrantyById(this.editingWarrantyId);
      const updated: Warranty = {
        ...existing!,
        title:           formValue.productName,
        productName:     formValue.productName,
        purchaseDate:    formValue.purchaseDate,
        endDate:         expiryDate,
        expiryDate:      expiryDate,
        category:        formValue.category,
        categoryId:      selectedCategory?.id,
        warrantyMonths,
        capturedImage:   this.capturedImage ?? existing?.capturedImage,
        invoicePhotoUrl: this.capturedImage ?? existing?.invoicePhotoUrl,
      };
      await this.warrantyService.saveWarranty(updated);
      await this.router.navigate(['/warranty-detail', this.editingWarrantyId]);
    } else {
      const warranty: Warranty = {
        id:              `war-${Date.now()}`,
        title:           formValue.productName,
        productName:     formValue.productName,
        purchaseDate:    formValue.purchaseDate,
        endDate:         expiryDate,
        status:          'ATIVA',
        category:        formValue.category,
        warrantyMonths,
        expiryDate,
        categoryId:      selectedCategory?.id,
        capturedImage:   this.capturedImage,
        invoicePhotoUrl: this.capturedImage,
        createdAt:       new Date().toISOString(),
      };
      await this.warrantyService.addWarranty(warranty);
      await this.router.navigate(['/tabs/home']);
    }
  }

  private loadWarrantyForEdit(id: string): void {
    const warranty = this.warrantyService.getWarrantyById(id);
    if (!warranty) return;

    const months = warranty.warrantyMonths ?? 12;
    const years  = Math.round(months / 12);

    this.warrantyForm.patchValue({
      productName:  warranty.productName || warranty.title,
      purchaseDate: warranty.purchaseDate,
      duration:     `${years} anos`,
      category:     warranty.category,
    });

    this.capturedImage = warranty.capturedImage;
    this.isPhotoTaken  = !!warranty.capturedImage;
  }

  private parseDurationToMonths(duration: string): number {
    const parsed = Number.parseInt(duration, 10);
    return Number.isNaN(parsed) ? 36 : parsed * 12;
  }
}