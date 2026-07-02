import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  role: 'PATIENT' | 'DOCTOR' = 'PATIENT';
  name = '';
  email = '';
  password = '';
  country = 'India';
  address = '';
  loading = signal(false);
  error = signal('');

  countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'];

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error.set('');
    this.loading.set(true);
    this.auth.register({
      email: this.email,
      password: this.password,
      role: this.role,
      name: this.name,
      country: this.country,
      address: this.address
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.status === 409
            ? 'An account with this email already exists. Try signing in instead.'
            : 'Could not register. Make sure the gateway is running on port 4004.'
        );
      }
    });
  }
}
