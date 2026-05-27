import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private STORAGE_KEY = 'utilizadores_eugaranto';

  constructor() {
    // Cria um utilizador padrão de teste caso o localStorage esteja vazio
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const defaultUsers = [
        { nome: 'Alberto', email: 'alberto@exemplo.com', password: 'alberto123' }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }

  // Método auxiliar para ir buscar a lista atual do localStorage
  private getStorageUsers(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Método auxiliar para guardar a lista atualizada no localStorage
  private saveStorageUsers(users: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  // 1. Verificar se o e-mail já existe (usado no Registo e no ForgotPassword)
  emailExists(email: string): boolean {
    const users = this.getStorageUsers();
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // 2. Registar um novo utilizador
  register(newUser: any): boolean {
    if (this.emailExists(newUser.email)) {
      return false; // Email já cadastrado
    }
    const users = this.getStorageUsers();
    users.push(newUser);
    this.saveStorageUsers(users);
    return true;
  }

  // 3. Validar as credenciais no Login
  login(email: string, password: string): boolean {
    const users = this.getStorageUsers();
    return users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  }

  // 4. Atualizar a palavra-passe (usado no ForgotPassword)
  updatePassword(email: string, newPassword: string): boolean {
    const users = this.getStorageUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (index !== -1) {
      users[index].password = newPassword;
      this.saveStorageUsers(users);
      return true;
    }
    return false;
  }
}