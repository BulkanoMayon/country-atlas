import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'country_atlas_users';
  private currentUserKey = 'country_atlas_current_user';

  constructor() {
    this.ensureDefaultAdmin();
  }

  // addmin accc
  private ensureDefaultAdmin(): void {
    const users = this.getUsers();

    const adminExists = users.some(
      (u: any) => u.email === 'HowSweet@it.com'
    );

    if (!adminExists) {
      users.push({
        username: 'NJ',
        email: 'HowSweet@it.com',
        password: '123'
      });

      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  }

  register(username: string, email: string, password: string) {
    const users = this.getUsers();

    const exists = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return { success: false, message: 'Email already registered.' };
    }

    users.push({ username, email, password });
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    return { success: true, message: 'Account created.' };
  }

  login(email: string, password: string) {
    const users = this.getUsers();

    const user = users.find(
      (u: any) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials.' };
    }

    localStorage.setItem(this.currentUserKey, JSON.stringify(user));

    return { success: true, message: 'Login successful.' };
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }

  getCurrentUser(): any {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  private getUsers(): any[] {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }
}