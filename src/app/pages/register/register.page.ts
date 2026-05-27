import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; // ✅ Importa o serviço

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  nome: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService // ✅ Injeta o serviço aqui no construtor
  ) { }

  ngOnInit() {}

  async criarConta() {
    if (!this.nome.trim() || !this.email.trim() || !this.password.trim()) {
      await this.mostrarAlerta('Campos Incompletos', 'Por favor, preenche todos os campos antes de continuar.');
      return;
    }

    if (!this.email.includes('@') || !this.email.includes('.')) {
      await this.mostrarAlerta('Email Inválido', 'Por favor, introduz um endereço de email válido.');
      return;
    }

    if (this.password.length < 6) {
      await this.mostrarAlerta('Palavra-passe Fraca', 'A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    // ✅ Tenta registar o utilizador no localStorage através do serviço
    const sucesso = this.authService.register({
      nome: this.nome,
      email: this.email,
      password: this.password
    });

    if (!sucesso) {
      await this.mostrarAlerta('Erro no Registo', 'Este endereço de email já está a ser utilizado por outra conta.');
      return;
    }

    // Se passar (sucesso = true):
    const alert = await this.alertController.create({
      header: 'Sucesso!',
      message: 'A tua conta foi criada com sucesso. Já podes entrar na aplicação.',
      buttons: [
        {
          text: 'Entrar',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  // Função auxiliar que já tinhas no teu código para exibir alertas
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}