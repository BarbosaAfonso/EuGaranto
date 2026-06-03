import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  privacyModalOpen = false;
  passwordForm: FormGroup;
  passwordMessage = '';
  passwordError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword:     ['', [Validators.required, Validators.minLength(6)]],
      newPassword:     ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
    this.passwordForm.valueChanges.subscribe(() => {
      this.passwordMessage = '';
      this.passwordError = '';
    });
  }

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

  onThemeChange(event: any): void {
    const enabled = event.detail.checked;
    this.themeService.setDarkMode(enabled);
    this.isDarkMode = enabled;
  }

  goToNotifications() {
    this.router.navigate(['/configuracao-notificacoes']);
  }

  goToHelp() {
    this.router.navigate(['/ajuda']);
  }

  openPrivacyModal() {
    this.privacyModalOpen = true;
  }

  closePrivacyModal() {
    this.privacyModalOpen = false;
    this.passwordForm.reset();
    this.passwordMessage = '';
    this.passwordError = '';
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (!user || !this.authService.login(user.email, oldPassword)) {
      this.passwordError = 'A palavra-passe antiga nao esta correta.';
      return;
    }

    if (newPassword !== confirmPassword) {
      this.passwordError = 'A nova palavra-passe e a confirmacao nao coincidem.';
      return;
    }

    this.authService.updatePassword(user.email, newPassword);
    this.passwordMessage = 'Palavra-passe alterada com sucesso.';
    this.passwordForm.reset();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}