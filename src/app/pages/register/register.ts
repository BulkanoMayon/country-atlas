import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  username = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Please complete all fields.';
      return;
    }

    const result = this.authService.register(
      this.username.trim(),
      this.email.trim(),
      this.password
    );

    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    this.successMessage = result.message;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
}