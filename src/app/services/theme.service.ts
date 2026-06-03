import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'eugaranto_dark_mode';
  private darkMode = false;

  init(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.darkMode = saved === 'true';
    this.applyTheme();
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  // ✅ Define explicitamente o modo (claro/escuro)
  setDarkMode(enabled: boolean): void {
    this.darkMode = enabled;
    localStorage.setItem(this.STORAGE_KEY, String(enabled));
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle('ion-palette-dark', this.darkMode);
    document.body.classList.toggle('ion-palette-dark', this.darkMode);
  }
}