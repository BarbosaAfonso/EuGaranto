import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WarrantyService } from '../../services/warranty.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  /** Formulário reativo de autenticação (Req. adicional 6) */
  loginForm: FormGroup;
  showPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private warrantyService: WarrantyService,
  ) {
    this.loginForm = this.fb.group({
      email:    ['alberto@exemplo.pt', [Validators.required, Validators.email]],
      password: ['albertopassword',    [Validators.required, Validators.minLength(6)]],
    });
  }

  /** Alterna visibilidade da palavra-passe */
  togglePassword() { this.showPassword = !this.showPassword; }

  /** Processa submissão do formulário de login */
  async onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    await new Promise(r => setTimeout(r, 700)); // simular autenticação
    await this.warrantyService.init();
    this.loading = false;
    this.router.navigate(['/tabs/home'], { replaceUrl: true });
  }

  /** Login com Google (simulado) */
  async loginWithGoogle() {
    this.loading = true;
    await new Promise(r => setTimeout(r, 500));
    await this.warrantyService.init();
    this.loading = false;
    this.router.navigate(['/tabs/home'], { replaceUrl: true });
  }
}
