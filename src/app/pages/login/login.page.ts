import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    // Cria a estrutura do formulário que o HTML está à espera
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      console.log('Dados do login:', this.loginForm.value);
      
      // Simula um tempo de loading e navega para a Home
      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/tabs']); // Navega para as tuas tabs
      }, 1000);
    }
  }

  loginWithGoogle() {
    console.log('Botão do Google clicado');
  }
}