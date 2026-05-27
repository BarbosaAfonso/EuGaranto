import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false, // ✅ Força o Angular a tratá-lo no formato tradicional
})
export class ForgotPasswordPage implements OnInit {
  step: 1 | 2 = 1;
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  emailError = '';
  passwordError = '';
  verifiedEmail = '';

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      newPassword:     ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    this.emailForm.valueChanges.subscribe(() => this.emailError = '');
    this.passwordForm.valueChanges.subscribe(() => this.passwordError = '');
  }

  verifyEmail() {
    if (this.emailForm.invalid) return;

    const email = this.emailForm.value.email;

    if (this.authService.emailExists(email)) {
      this.verifiedEmail = email;
      this.step = 2;
    } else {
      this.emailError = 'Não existe nenhuma conta com este email.';
    }
  }

  confirmReset() {
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.passwordError = 'As palavras-passe não coincidem.';
      return;
    }

    this.authService.updatePassword(this.verifiedEmail, newPassword);
    this.modalCtrl.dismiss({ success: true });
  }

  cancel() {
    this.modalCtrl.dismiss({ success: false });
  }
}