import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private STORAGE_KEY = 'utilizadores_eugaranto';
  private CURRENT_USER_KEY = 'current_user_eugaranto'; // ✅

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const defaultUsers = [
        { nome: 'Alberto', email: 'alberto@exemplo.com', password: 'alberto123' }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }

  private getStorageUsers(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveStorageUsers(users: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  emailExists(email: string): boolean {
    const users = this.getStorageUsers();
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  register(newUser: any): boolean {
    if (this.emailExists(newUser.email)) {
      return false;
    }
    const users = this.getStorageUsers();
    users.push(newUser);
    this.saveStorageUsers(users);
    return true;
  }

  // ✅ Guarda o utilizador atual no localStorage ao fazer login
  login(email: string, password: string): boolean {
    const users = this.getStorageUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  // ✅ Devolve o utilizador atualmente autenticado
  getCurrentUser(): any {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  // ✅ Remove o utilizador atual ao fazer logout
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

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