import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { WarrantyService } from '../../services/warranty.service';
import { Category } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-category-new',
  templateUrl: './category-new.page.html',
  styleUrls: ['./category-new.page.scss'],
})
export class CategoryNewPage {

  /** Formulário reativo para criação de categoria (Req. adicional 6) */
  categoryForm: FormGroup;

  selectedIcon  = 'restaurant-outline';
  selectedColor = '#1B6B3A';

  iconOptions = [
    'restaurant-outline', 'tv-outline', 'car-outline', 'shirt-outline',
    'hammer-outline', 'briefcase-outline', 'paw-outline', 'add-outline',
  ];

  colorOptions = ['#1B6B3A', '#E8540A', '#D32F2F', '#1565C0', '#6A1B9A', '#212121', '#E91E8C'];

  constructor(
    private fb: FormBuilder,
    private warrantyService: WarrantyService,
    private router: Router,
    private toast: ToastController,
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  selectIcon(icon: string)   { this.selectedIcon  = icon;  }
  selectColor(color: string) { this.selectedColor = color; }

  /** Cria e guarda a nova categoria */
  async createCategory() {
    if (this.categoryForm.invalid) return;

    const category: Category = {
      id:    this.warrantyService.generateId(),
      name:  this.categoryForm.get('name')!.value,
      icon:  this.selectedIcon,
      color: this.selectedColor,
    };

    await this.warrantyService.saveCategory(category);

    const t = await this.toast.create({
      message: `✅ Categoria "${category.name}" criada!`,
      duration: 2000, color: 'success', position: 'top',
    });
    await t.present();

    // Navegar com estado para mostrar banner (CORREÇÃO HEURÍSTICA #6)
    this.router.navigate(['/tabs/categories'], {
      replaceUrl: true,
      state: { successMsg: `Categoria "${category.name}" criada com sucesso!` }
    });
  }
}
