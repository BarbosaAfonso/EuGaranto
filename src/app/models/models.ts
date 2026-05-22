export interface Warranty {
  id: string;
  productName: string;
  brand?: string;
  purchaseDate: string;        // ISO string
  warrantyMonths: number;
  expiryDate: string;          // ISO string calculado
  categoryId: string;
  value?: number;
  storagePhotoUrl?: string;    // base64 da foto do local
  invoicePhotoUrl?: string;    // base64 da fatura
  storageLabel?: string;       // ex: "Pasta de Faturas"
  storageLocation?: string;    // ex: "Escritório · Gaveta 1"
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;                // nome do ion-icon
  color: string;               // hex
  itemCount?: number;
}

export interface Alert {
  id: string;
  warrantyId: string;
  productName: string;
  daysBefore: number;
  triggerDate: string;         // ISO string
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

export function getWarrantyStatus(expiryDate: string): WarrantyStatus {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
  if (diffDays < 0)  return 'expired';
  if (diffDays < 60) return 'risk';
  return 'active';
}

export function getRemainingLabel(expiryDate: string): string {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
  if (diffDays < 0) return 'Expirada';
  if (diffDays < 30) return `${diffDays} dias restantes`;
  const months = Math.floor(diffDays / 30);
  const years  = Math.floor(months / 12);
  const remM   = months % 12;
  if (years > 0 && remM > 0) return `${years}a ${remM}m restantes`;
  if (years > 0)             return `${years}a restantes`;
  return `${months}m restantes`;
}
