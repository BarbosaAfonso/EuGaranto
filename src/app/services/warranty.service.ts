import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Alert, Category, Warranty, getWarrantyStatus } from '../models/models';

@Injectable({ providedIn: 'root' })
export class WarrantyService {
  private readonly warrantiesStorageKey  = 'warranties';
  private readonly alertsStorageKey      = 'alerts';
  private readonly categoriesStorageKey  = 'categories'; // ✅ novo
  private warranties:  Warranty[]  = [];
  private categories:  Category[]  = [];
  private alerts:      Alert[]     = [];
  private initialized = false;

  warranties$  = new BehaviorSubject<Warranty[]>([]);
  categories$  = new BehaviorSubject<Category[]>([]);
  alerts$      = new BehaviorSubject<Alert[]>([]);

  constructor(
    private http: HttpClient,
    private storage: Storage,
  ) {}

  async init(): Promise<void> {
    if (this.initialized) return;

    await this.storage.create();

    const storedWarranties  = await this.storage.get(this.warrantiesStorageKey);
    const storedAlerts      = await this.storage.get(this.alertsStorageKey);
    const storedCategories  = await this.storage.get(this.categoriesStorageKey); // ✅
    const seed = await firstValueFrom(
      this.http.get<{ categories: Category[]; alerts: Alert[] }>('assets/data/seed.json')
    );

    let warranties: Warranty[] = [];
    if (Array.isArray(storedWarranties)) {
      warranties = storedWarranties;
    } else {
      warranties = await firstValueFrom(
        this.http.get<Warranty[]>('assets/data/warranties.json')
      );
      await this.storage.set(this.warrantiesStorageKey, warranties);
    }

    // ✅ Usa categorias do storage se existirem, senão usa as do seed
    if (Array.isArray(storedCategories) && storedCategories.length > 0) {
      this.categories = storedCategories;
    } else {
      this.categories = seed.categories || [];
      await this.storage.set(this.categoriesStorageKey, this.categories);
    }

    this.alerts     = Array.isArray(storedAlerts) ? storedAlerts : (seed.alerts || []);
    this.warranties = warranties.map(warranty => this.normalizeWarranty(warranty));

    if (!Array.isArray(storedAlerts)) {
      await this.persistAlerts();
    }

    this.warranties$.next([...this.warranties]);
    this.categories$.next([...this.categories]);
    this.alerts$.next([...this.alerts]);
    this.initialized = true;
  }

  getWarranties(): Warranty[] {
    return [...this.warranties];
  }

  getWarranty(id: string): Warranty | undefined {
    return this.warranties.find(warranty => warranty.id === id);
  }

  getWarrantyById(id: string): Warranty | undefined {
    return this.getWarranty(id);
  }

  async saveWarranty(warranty: Warranty): Promise<void> {
    const normalized = this.normalizeWarranty(warranty);
    const index = this.warranties.findIndex(item => item.id === normalized.id);
    if (index >= 0) {
      this.warranties.splice(index, 1, normalized);
    } else {
      this.warranties.push(normalized);
    }
    await this.persistWarranties();
    this.warranties$.next([...this.warranties]);
  }

  async addWarranty(warranty: Warranty): Promise<void> {
    const normalized = this.normalizeWarranty(warranty);
    this.warranties = [...this.warranties, normalized];
    await this.persistWarranties();
    this.warranties$.next([...this.warranties]);
  }

  async deleteWarranty(id: string): Promise<void> {
    this.warranties = this.warranties.filter(warranty => warranty.id !== id);
    await this.persistWarranties();
    this.warranties$.next([...this.warranties]);
  }

  getActiveCount(): number {
    return this.warranties.filter(warranty => getWarrantyStatus(warranty) === 'active').length;
  }

  getExpiringSoonCount(): number {
    return this.warranties.filter(warranty => getWarrantyStatus(warranty) === 'risk').length;
  }

  getRiskCount(): number {
    return this.getExpiringSoonCount();
  }

  getCategories(): Category[] {
    return [...this.categories];
  }

  getCategory(id: string): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  async saveCategory(category: Category): Promise<void> {
    const index = this.categories.findIndex(item => item.id === category.id);
    if (index >= 0) {
      this.categories.splice(index, 1, category);
    } else {
      this.categories.push(category);
    }
    await this.persistCategories(); // ✅ persiste no storage
    this.categories$.next([...this.categories]);
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories = this.categories.filter(category => category.id !== id);
    await this.persistCategories(); // ✅ persiste no storage
    this.categories$.next([...this.categories]);
  }

  getCategoryItemCount(catId: string): number {
    return this.warranties.filter(warranty => warranty.categoryId === catId).length;
  }

  async moveWarrantyToCategory(warrantyId: string, categoryId: string): Promise<void> {
    const warranty = this.warranties.find(item => item.id === warrantyId);
    if (!warranty) return;
    warranty.categoryId = categoryId;
    warranty.category   = this.getCategory(categoryId)?.name || warranty.category;
    await this.persistWarranties();
    this.warranties$.next([...this.warranties]);
  }

  async updateWarrantiesCategory(ids: string[], newCategory: string): Promise<void> {
    if (!ids.length) return;

    const selectedIds = new Set(ids);
    const categoryId  = this.findCategoryIdByName(newCategory) || undefined;
    let hasChanges    = false;

    this.warranties = this.warranties.map(warranty => {
      if (!selectedIds.has(warranty.id)) return warranty;
      hasChanges = true;
      return { ...warranty, category: newCategory, categoryId };
    });

    if (!hasChanges) return;

    await this.persistWarranties();
    this.warranties$.next([...this.warranties]);
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  getAlertsForWarranty(warrantyId: string): Alert[] {
    return this.alerts.filter(alert => alert.warrantyId === warrantyId);
  }

  async saveAlert(alert: Alert): Promise<void> {
    const index = this.alerts.findIndex(item => item.id === alert.id);
    if (index >= 0) {
      this.alerts.splice(index, 1, alert);
    } else {
      this.alerts.push(alert);
    }
    await this.persistAlerts();
    this.alerts$.next([...this.alerts]);
  }

  async deleteAlert(id: string): Promise<void> {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    await this.persistAlerts();
    this.alerts$.next([...this.alerts]);
  }

  async toggleAlert(id: string): Promise<void> {
    const alert = this.alerts.find(item => item.id === id);
    if (!alert) return;
    alert.enabled = !alert.enabled;
    await this.persistAlerts();
    this.alerts$.next([...this.alerts]);
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  calcExpiryDate(purchaseDate: string, months: number): string {
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  }

  getCoveragePercent(purchaseDate: string, expiryDate: string): number {
    const start = new Date(purchaseDate).getTime();
    const end   = new Date(expiryDate).getTime();
    const now   = Date.now();
    return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
  }

  private normalizeWarranty(warranty: Warranty): Warranty {
    const purchaseDate  = warranty.purchaseDate;
    const endDate       = warranty.endDate || warranty.expiryDate || purchaseDate;
    const category      = warranty.category || this.getCategory(warranty.categoryId || '')?.name || 'Sem categoria';
    const categoryId    = warranty.categoryId || this.findCategoryIdByName(category);
    const title         = warranty.title || warranty.productName || 'Garantia sem nome';
    const status        = this.mapStatus(warranty.status, endDate);

    return {
      ...warranty,
      title,
      productName:     warranty.productName || title,
      purchaseDate,
      endDate,
      expiryDate:      endDate,
      status,
      category,
      categoryId,
      capturedImage:   warranty.capturedImage || warranty.invoicePhotoUrl,
      invoicePhotoUrl: warranty.invoicePhotoUrl || warranty.capturedImage,
      warrantyMonths:  warranty.warrantyMonths ?? this.getWarrantyMonths(purchaseDate, endDate),
      createdAt:       warranty.createdAt || new Date().toISOString(),
    };
  }

  private mapStatus(status: Warranty['status'] | undefined, endDate: string): Warranty['status'] {
    if (status === 'ATIVA' || status === 'EM RISCO' || status === 'EXPIRADA') return status;
    const computedStatus = getWarrantyStatus(endDate);
    if (computedStatus === 'active') return 'ATIVA';
    if (computedStatus === 'risk')   return 'EM RISCO';
    return 'EXPIRADA';
  }

  private findCategoryIdByName(categoryName: string): string {
    return this.categories.find(category => category.name === categoryName)?.id || '';
  }

  private getWarrantyMonths(purchaseDate: string, endDate: string): number {
    const start = new Date(purchaseDate);
    const end   = new Date(endDate);
    return Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
  }

  private async persistWarranties(): Promise<void> {
    await this.storage.set(this.warrantiesStorageKey, this.warranties);
  }

  // ✅ novo método de persistência
  private async persistCategories(): Promise<void> {
    await this.storage.set(this.categoriesStorageKey, this.categories);
  }

  private async persistAlerts(): Promise<void> {
    await this.storage.set(this.alertsStorageKey, this.alerts);
  }
}