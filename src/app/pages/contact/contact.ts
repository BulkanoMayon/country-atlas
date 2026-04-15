import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  name = '';
  email = '';
  subject = '';
  message = '';

  errorMessage = '';
  successMessage = '';

  submitForm(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim() || !this.email.trim() || !this.subject.trim() || !this.message.trim()) {
      this.errorMessage = 'Please complete all fields before sending your message.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.successMessage = 'Your message has been submitted successfully.';

    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
  }
}