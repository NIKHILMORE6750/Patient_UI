import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppointmentService } from '../../core/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';
import { Appointment } from '../../core/models/patient.model';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  loading = signal(true);

  constructor(private api: AppointmentService, public auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (a) => { this.appointments.set(a); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  cancel(a: Appointment): void {
    if (!confirm(`Cancel appointment with Dr. ${a.doctorName}?`)) return;
    this.api.cancel(a.id).subscribe({ next: () => this.load() });
  }

  complete(a: Appointment): void {
    this.api.updateStatus(a.id, 'COMPLETED').subscribe({ next: () => this.load() });
  }

  statusClass(s: string): string {
    return 'pill ' + (s || '').toLowerCase();
  }
}
