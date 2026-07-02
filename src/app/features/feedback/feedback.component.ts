import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FeedbackService } from '../../core/services/feedback.service';
import { AuthService } from '../../core/services/auth.service';
import { Feedback } from '../../core/models/patient.model';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit {
  list = signal<Feedback[]>([]);
  loading = signal(true);
  name = '';
  rating = 5;
  message = '';
  saving = signal(false);
  done = signal(false);
  stars = [1, 2, 3, 4, 5];

  constructor(private api: FeedbackService, public auth: AuthService) {}

  // Only a signed-in patient may submit feedback.
  get canSubmit(): boolean {
    return this.auth.isAuthenticated() && this.auth.isPatient();
  }
  // Only an admin may delete feedback.
  get canDelete(): boolean {
    return this.auth.isAuthenticated() && this.auth.isAdmin();
  }

  ngOnInit(): void {
    if (this.canSubmit) { this.name = this.auth.displayName(); }
    this.load();
  }

  load(): void {
    this.api.getAll().subscribe({
      next: (f) => { this.list.set(f); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  submit(): void {
    this.saving.set(true);
    this.api.create({ patientName: this.name, rating: this.rating, message: this.message })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.done.set(true);
          this.message = ''; this.rating = 5;
          this.load();
          setTimeout(() => this.done.set(false), 4000);
        },
        error: () => this.saving.set(false)
      });
  }

  remove(f: Feedback): void {
    if (!confirm(`Delete feedback from ${f.patientName}?`)) return;
    this.api.delete(f.id).subscribe({ next: () => this.load() });
  }

  starString(n: number): string {
    return '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);
  }
}
