import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  // Quick-fill demo accounts for the three roles
  demos = [
    { label: 'Admin', email: 'testuser@test.com' },
    { label: 'Doctor', email: 'doctor@test.com' },
    { label: 'Patient', email: 'patient@test.com' }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  fill(email: string): void {
    this.email = email;
    this.password = 'password123';
  }

  submit(): void {
    this.error.set('');
    this.loading.set(true);
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.status === 401
            ? 'Those credentials were not recognised. Check the email and password.'
            : 'Could not reach the server. Make sure the gateway is running on port 4004.'
        );
      }
    });
  }
}
