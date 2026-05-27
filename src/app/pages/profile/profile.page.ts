import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ionViewWillEnter() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nome;
      this.userEmail = user.email;
      // Gera as iniciais a partir do nome (ex: "João Silva" → "JS")
      this.userInitials = user.nome
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}