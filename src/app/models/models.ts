export interface Warranty {
  id: string;
  title: string;
  purchaseDate: string;
  endDate: string;
  status: 'ATIVA' | 'EM RISCO' | 'EXPIRADA';
  category: string;
  productName?: string;
  brand?: string;
  warrantyMonths?: number;
  expiryDate?: string;
  categoryId?: string;
  value?: number;
  storagePhotoUrl?: string;
  invoicePhotoUrl?: string;
  capturedImage?: string;
  storageLabel?: string;
  storageLocation?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount?: number;
}

export interface Alert {
  id: string;
  warrantyId: string;
  productName: string;
  daysBefore: number;
  triggerDate: string;
  message: string;
  notifyPush: boolean;
  notifyEmail: boolean;
  enabled: boolean;
  isNew?: boolean;
}

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

export type WarrantyStatus = 'active' | 'risk' | 'expired';

export function getWarrantyDate(warrantyOrDate: Warranty | string): string {
  if (typeof warrantyOrDate === 'string') return warrantyOrDate;
  return warrantyOrDate.endDate || warrantyOrDate.expiryDate || warrantyOrDate.purchaseDate;
}

export function getWarrantyTitle(warranty: Warranty): string {
  return warranty.title || warranty.productName || 'Garantia sem nome';
}

export function getWarrantyStatus(warrantyOrDate: Warranty | string): WarrantyStatus {
  if (typeof warrantyOrDate !== 'string') {
    if (warrantyOrDate.status === 'ATIVA') return 'active';
    if (warrantyOrDate.status === 'EM RISCO') return 'risk';
    if (warrantyOrDate.status === 'EXPIRADA') return 'expired';
  }

  const expiryDate = getWarrantyDate(warrantyOrDate);
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays < 60) return 'risk';
  return 'active';
}

export function getRemainingLabel(warrantyOrDate: Warranty | string): string {
  const expiryDate = getWarrantyDate(warrantyOrDate);
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
  if (diffDays < 0) return 'Expirada';
  if (diffDays < 30) return `${diffDays} dias restantes`;
  const months = Math.floor(diffDays / 30);
  const years = Math.floor(months / 12);
  const remM = months % 12;
  if (years > 0 && remM > 0) return `${years}a ${remM}m restantes`;
  if (years > 0) return `${years}a restantes`;
  return `${months}m restantes`;
}
