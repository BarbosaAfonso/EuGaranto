import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Warranty, getWarrantyTitle } from '../../models/models';
import { WarrantyService } from '../../services/warranty.service';

interface WarrantyGroup {
  category: string;
  items: Warranty[];
}

@Component({
  standalone: false,
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {
  availableCategories = ['Sala de Estar', 'Cozinha', 'Quarto', 'Escritório', 'Outros'];
  groupedWarranties: WarrantyGroup[] = [];
  selectedIds: string[] = [];

  private sub?: Subscription;

  constructor(
    private warrantyService: WarrantyService,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.sub = this.warrantyService.warranties$.subscribe(warranties => {
      this.groupWarrantiesByCategory(warranties);
      this.selectedIds = this.selectedIds.filter(id => warranties.some(warranty => warranty.id === id));
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

  isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  toggleSelection(id: string): void {
    this.selectedIds = this.isSelected(id)
      ? this.selectedIds.filter(selectedId => selectedId !== id)
      : [...this.selectedIds, id];
  }

  async moveSelectedItems(): Promise<void> {
    if (!this.selectedIds.length) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Mover garantias',
      message: 'Escolha a categoria de destino para os itens selecionados.',
      inputs: this.availableCategories.map(category => ({
        type: 'radio',
        label: category,
        value: category,
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Mover',
          handler: (category: string) => {
            if (!category) {
              return false;
            }

            void this.applyCategoryMove(category);
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  trackByCategory(_: number, group: WarrantyGroup): string {
    return group.category;
  }

  trackByWarranty(_: number, warranty: Warranty): string {
    return warranty.id;
  }

  private async applyCategoryMove(category: string): Promise<void> {
    await this.warrantyService.updateWarrantiesCategory(this.selectedIds, category);
    this.selectedIds = [];
  }

  private groupWarrantiesByCategory(warranties: Warranty[]): void {
    const serviceCategories = this.warrantyService.getCategories().map(category => category.name);
    const warrantyCategories = warranties.map(warranty => this.normalizeCategory(warranty.category));
    const categories = [...new Set([...this.availableCategories, ...serviceCategories, ...warrantyCategories])];

    this.availableCategories = categories;
    this.groupedWarranties = categories.map(category => ({
      category,
      items: warranties.filter(warranty => this.normalizeCategory(warranty.category) === category),
    }));
  }

  private normalizeCategory(category?: string): string {
    return category?.trim() || 'Outros';
  }
}
