import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  userName = '';
  userEmail = '';
  userInitials = '';
  isDarkMode = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ionViewWillEnter() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nome;
      this.userEmail = user.email;
      this.userInitials = user.nome
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }

    this.isDarkMode = this.themeService.isDarkMode();
  }

  // ✅ Recebe o evento do toggle e aplica o modo
  onThemeChange(event: any): void {
    const enabled = event.detail.checked;
    this.themeService.setDarkMode(enabled);
    this.isDarkMode = enabled;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}