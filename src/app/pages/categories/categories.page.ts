import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
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
  availableCategories = [
    'Eletrodomésticos',
    'Ferramentas',
    'Imagem e Som',
    'Informática',
    'Telemóveis',
    'Outros',
  ];
  groupedWarranties: WarrantyGroup[] = [];
  selectedIds: string[] = [];
  expandedCategories: Set<string> = new Set();

  private readonly compartmentKeywords = [
    'Cozinha', 'Escritório', 'Quarto', 'Sala de Estar',
    'Casa de Banho', 'Garagem', 'Arrecadação', 'Lavandaria', 'Marquise',
  ];

  private readonly categoryAliases: { [key: string]: string } = {
    'eletrodomesticos': 'Eletrodomésticos',
    'grandes eletrodomesticos': 'Eletrodomésticos',
    'pequenos eletrodomesticos': 'Eletrodomésticos',
    'informatica': 'Informática',
    'informatica & pc': 'Informática',
    'telemoveis': 'Telemóveis',
    'imagem e som': 'Imagem e Som',
    'ferramentas': 'Ferramentas',
    'outros': 'Outros',
  };

  private sub?: Subscription;

  constructor(
    private warrantyService: WarrantyService,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([
      this.warrantyService.warranties$,
      this.warrantyService.categories$,
    ]).subscribe(([warranties]) => {
      this.groupWarrantiesByCategory(warranties);
      this.selectedIds = this.selectedIds.filter(id => warranties.some(w => w.id === id));
    });
  }

  ionViewWillEnter(): void {
    this.warrantyService.warranties$.next(this.warrantyService.getWarranties());
    this.warrantyService.categories$.next(this.warrantyService.getCategories());
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
      ? this.selectedIds.filter(sid => sid !== id)
      : [...this.selectedIds, id];
  }

  toggleCategory(category: string): void {
    if (this.expandedCategories.has(category)) {
      this.expandedCategories.delete(category);
    } else {
      this.expandedCategories.add(category);
    }
  }

  isExpanded(category: string): boolean {
    return this.expandedCategories.has(category);
  }

  goToDetail(id: string): void {
    this.router.navigate(['/warranty-detail', id]);
  }

  async moveSelectedItems(): Promise<void> {
    if (!this.selectedIds.length) return;

    const alert = await this.alertController.create({
      header: 'Mover garantias',
      message: 'Escolha a categoria de destino para os itens selecionados.',
      inputs: this.availableCategories.map(category => ({
        type: 'radio',
        label: category,
        value: category,
      })),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Mover',
          handler: (category: string) => {
            if (!category) return false;
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

  private isCompartment(name: string): boolean {
    return this.compartmentKeywords.some(room => name.toLowerCase().includes(room.toLowerCase()));
  }

  private normalizeCategory(category?: string): string {
    const raw = category?.trim();
    if (!raw) return 'Outros';

    const key = raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return this.categoryAliases[key] ?? raw;
  }

  private groupWarrantiesByCategory(warranties: Warranty[]): void {
    const allNames = [
      ...this.availableCategories,
      ...this.warrantyService.getCategories().map(c => c.name),
      ...warranties.map(w => w.category ?? ''),
    ].map(name => this.normalizeCategory(name));

    const categories = [...new Set(allNames)]
      .filter(name => !this.isCompartment(name));

    categories.sort((a, b) => a.localeCompare(b, 'pt'));

    this.groupedWarranties = categories.map(category => ({
      category,
      items: warranties.filter(w => this.normalizeCategory(w.category) === category),
    }));

    this.groupedWarranties.forEach(group => {
      if (group.items.length > 0) {
        this.expandedCategories.add(group.category);
      }
    });
  }
}