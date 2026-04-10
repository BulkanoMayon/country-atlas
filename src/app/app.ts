import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get currentUsername(): string {
    return this.auth.getCurrentUser()?.username || '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}