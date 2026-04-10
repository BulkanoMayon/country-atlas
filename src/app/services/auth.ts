import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'country_atlas_users';
  private currentUserKey = 'country_atlas_current_user';

  register(username: string, email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();

    const existingUser = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        message: 'Email already registered.'
      };
    }

    const newUser = {
      username,
      email,
      password
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    return {
      success: true,
      message: 'Account created successfully.'
    };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();

    const foundUser = users.find(
      (u: any) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: 'Invalid email or password.'
      };
    }

    localStorage.setItem(this.currentUserKey, JSON.stringify(foundUser));

    return {
      success: true,
      message: 'Login successful.'
    };
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }

  getCurrentUser(): any | null {
    const current = localStorage.getItem(this.currentUserKey);
    return current ? JSON.parse(current) : null;
  }

  private getUsers(): any[] {
    const raw = localStorage.getItem(this.usersKey);
    return raw ? JSON.parse(raw) : [];
  }
}