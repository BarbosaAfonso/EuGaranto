import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.loginForm.valueChanges.subscribe(() => this.loginError = '');
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.loginError = '';

    const { email, password } = this.loginForm.value;

    setTimeout(() => {
      const success = this.authService.login(email, password);
      if (success) {
        this.router.navigate(['/tabs']);
      } else {
        this.loginError = 'Email ou palavra-passe incorretos. Tenta novamente.';
      }
      this.loading = false;
    }, 800);
  }

  // ✅ Abre o modal de recuperação de palavra-passe
  async openForgotPassword() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordPage,
      cssClass: 'forgot-password-modal'
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.success) {
      // Mostra feedback ao utilizador após reset com sucesso
      this.loginError = ''; 
    }
  }

  loginWithGoogle() {
    console.log('Botão do Google clicado');
  }

  // ✅ Navega para a nova página de registo criada pelo Ionic CLI
  goToRegister() {
    this.router.navigate(['/register']);
  }
}