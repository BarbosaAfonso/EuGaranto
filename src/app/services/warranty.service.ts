import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Warranty, Category, Alert, getWarrantyStatus } from '../models/models';

/** Chaves de armazenamento no Ionic Storage */
const KEYS = {
  WARRANTIES: 'eg_warranties',
  CATEGORIES: 'eg_categories',
  ALERTS:     'eg_alerts',
  SEEDED:     'eg_seeded',
};

@Injectable({ providedIn: 'root' })
export class WarrantyService {

  // Cache em memória
  private warranties: Warranty[] = [];
  private categories: Category[] = [];
  private alerts: Alert[] = [];

  // Subjects reativos para subscrição nos componentes
  warranties$ = new BehaviorSubject<Warranty[]>([]);
  categories$ = new BehaviorSubject<Category[]>([]);
  alerts$     = new BehaviorSubject<Alert[]>([]);

  private _storage: Storage | null = null;
  private initialized = false;

  constructor(
    private storage: Storage,
    private http: HttpClient,
  ) {}

  /**
   * Inicializa o Ionic Storage e carrega dados.
   * Na primeira execução, lê do ficheiro JSON (seed.json).
   * Nas execuções seguintes, lê do Storage.
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    this._storage = await this.storage.create();
    const seeded = await this._storage.get(KEYS.SEEDED);

    if (!seeded) {
      // Primeira execução: carregar dados do ficheiro JSON (Req. 10)
      const seed = await firstValueFrom(
        this.http.get<{ warranties: Warranty[]; categories: Category[]; alerts: Alert[] }>(
          'assets/data/seed.json'
        )
      );
      this.warranties = seed.warranties;
      this.categories = seed.categories;
      this.alerts     = seed.alerts || [];

      await this._storage.set(KEYS.WARRANTIES, this.warranties);
      await this._storage.set(KEYS.CATEGORIES, this.categories);
      await this._storage.set(KEYS.ALERTS,     this.alerts);
      await this._storage.set(KEYS.SEEDED,     true);
    } else {
      // Execuções seguintes: carregar do Ionic Storage (Req. 9)
      this.warranties = (await this._storage.get(KEYS.WARRANTIES)) || [];
      this.categories = (await this._storage.get(KEYS.CATEGORIES)) || [];
      this.alerts     = (await this._storage.get(KEYS.ALERTS))     || [];
    }

    this.warranties$.next([...this.warranties]);
    this.categories$.next([...this.categories]);
    this.alerts$.next([...this.alerts]);
    this.initialized = true;
  }

  // ─── Warranties ────────────────────────────────────────────

  /** Retorna todas as garantias (cópia do array) */
  getWarranties(): Warranty[] { return [...this.warranties]; }

  /** Retorna uma garantia pelo ID */
  getWarranty(id: string): Warranty | undefined {
    return this.warranties.find(w => w.id === id);
  }

  /** Guarda (cria ou atualiza) uma garantia */
  async saveWarranty(w: Warranty): Promise<void> {
    const idx = this.warranties.findIndex(x => x.id === w.id);
    idx >= 0 ? this.warranties.splice(idx, 1, w) : this.warranties.push(w);
    await this._storage!.set(KEYS.WARRANTIES, this.warranties);
    this.warranties$.next([...this.warranties]);
  }

  /** Remove uma garantia pelo ID */
  async deleteWarranty(id: string): Promise<void> {
    this.warranties = this.warranties.filter(w => w.id !== id);
    await this._storage!.set(KEYS.WARRANTIES, this.warranties);
    this.warranties$.next([...this.warranties]);
  }

  /** Número de garantias com estado "ativa" */
  getActiveCount(): number {
    return this.warranties.filter(w => getWarrantyStatus(w.expiryDate) === 'active').length;
  }

  /** Número de garantias em risco ou expiradas */
  getRiskCount(): number {
    return this.warranties.filter(w => getWarrantyStatus(w.expiryDate) !== 'active').length;
  }

  // ─── Categories ────────────────────────────────────────────

  /** Retorna todas as categorias */
  getCategories(): Category[] { return [...this.categories]; }

  /** Retorna uma categoria pelo ID */
  getCategory(id: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  /** Guarda (cria ou atualiza) uma categoria */
  async saveCategory(c: Category): Promise<void> {
    const idx = this.categories.findIndex(x => x.id === c.id);
    idx >= 0 ? this.categories.splice(idx, 1, c) : this.categories.push(c);
    await this._storage!.set(KEYS.CATEGORIES, this.categories);
    this.categories$.next([...this.categories]);
  }

  /** Remove uma categoria pelo ID */
  async deleteCategory(id: string): Promise<void> {
    this.categories = this.categories.filter(c => c.id !== id);
    await this._storage!.set(KEYS.CATEGORIES, this.categories);
    this.categories$.next([...this.categories]);
  }

  /** Número de garantias associadas a uma categoria */
  getCategoryItemCount(catId: string): number {
    return this.warranties.filter(w => w.categoryId === catId).length;
  }

  /** Move uma garantia para outra categoria */
  async moveWarrantyToCategory(warrantyId: string, categoryId: string): Promise<void> {
    const w = this.warranties.find(x => x.id === warrantyId);
    if (w) {
      w.categoryId = categoryId;
      await this._storage!.set(KEYS.WARRANTIES, this.warranties);
      this.warranties$.next([...this.warranties]);
    }
  }

  // ─── Alerts ────────────────────────────────────────────────

  /** Retorna todos os alertas */
  getAlerts(): Alert[] { return [...this.alerts]; }

  /** Retorna alertas de uma garantia específica */
  getAlertsForWarranty(warrantyId: string): Alert[] {
    return this.alerts.filter(a => a.warrantyId === warrantyId);
  }

  /** Guarda (cria ou atualiza) um alerta */
  async saveAlert(a: Alert): Promise<void> {
    const idx = this.alerts.findIndex(x => x.id === a.id);
    idx >= 0 ? this.alerts.splice(idx, 1, a) : this.alerts.push(a);
    await this._storage!.set(KEYS.ALERTS, this.alerts);
    this.alerts$.next([...this.alerts]);
  }

  /** Remove um alerta pelo ID */
  async deleteAlert(id: string): Promise<void> {
    this.alerts = this.alerts.filter(a => a.id !== id);
    await this._storage!.set(KEYS.ALERTS, this.alerts);
    this.alerts$.next([...this.alerts]);
  }

  /** Ativa/desativa um alerta */
  async toggleAlert(id: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.enabled = !alert.enabled;
      await this._storage!.set(KEYS.ALERTS, this.alerts);
      this.alerts$.next([...this.alerts]);
    }
  }

  // ─── Helpers ───────────────────────────────────────────────

  /** Gera um ID único */
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  /** Calcula data de expiração a partir da data de compra + meses de garantia */
  calcExpiryDate(purchaseDate: string, months: number): string {
    const d = new Date(purchaseDate);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  }

  /** Calcula percentagem de cobertura (tempo decorrido / tempo total) */
  getCoveragePercent(purchaseDate: string, expiryDate: string): number {
    const start = new Date(purchaseDate).getTime();
    const end   = new Date(expiryDate).getTime();
    const now   = Date.now();
    return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
  }
}
