import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  constructor(private router: Router) {}

  logout() {
    console.log('Sessão terminada');
    this.router.navigate(['/login']);
  }
}
