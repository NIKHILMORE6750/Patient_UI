import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  patients = signal<Patient[]>([]);
  loading = signal(true);
  error = signal('');

  total = computed(() => this.patients().length);

  // Patients registered this calendar year (by date of birth proxy is wrong;
  // we approximate "recently added" using the list order from the API).
  recent = computed(() => this.patients().slice(-5).reverse());

  // Simple age distribution for a lightweight chart.
  ageBuckets = computed(() => {
    const buckets = { '0-17': 0, '18-39': 0, '40-64': 0, '65+': 0 };
    const now = new Date();
    for (const p of this.patients()) {
      const age = now.getFullYear() - new Date(p.dateOfBirth).getFullYear();
      if (age < 18) buckets['0-17']++;
      else if (age < 40) buckets['18-39']++;
      else if (age < 65) buckets['40-64']++;
      else buckets['65+']++;
    }
    return Object.entries(buckets).map(([label, count]) => ({ label, count }));
  });

  maxBucket = computed(() =>
    Math.max(1, ...this.ageBuckets().map((b) => b.count))
  );

  // Colours for each age band slice (matches legend order).
  readonly sliceColors = ['#0d9488', '#5eead4', '#0b7d73', '#99f6e4'];

  // Build SVG pie slices from the age buckets.
  pieSlices = computed(() => {
    const data = this.ageBuckets();
    const totalCount = data.reduce((s, b) => s + b.count, 0);
    if (totalCount === 0) return [];
    let startAngle = 0;
    const cx = 100, cy = 100, r = 90;
    return data.map((b, i) => {
      const fraction = b.count / totalCount;
      const endAngle = startAngle + fraction * 2 * Math.PI;
      // Coordinates on the circle
      const x1 = cx + r * Math.sin(startAngle);
      const y1 = cy - r * Math.cos(startAngle);
      const x2 = cx + r * Math.sin(endAngle);
      const y2 = cy - r * Math.cos(endAngle);
      const largeArc = fraction > 0.5 ? 1 : 0;
      // Full circle guard (single non-zero slice)
      const path = fraction >= 0.9999
        ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      startAngle = endAngle;
      return {
        path,
        color: this.sliceColors[i % this.sliceColors.length],
        label: b.label,
        count: b.count,
        percent: Math.round(fraction * 100)
      };
    });
  });

  userName = '';
  appointmentCount = signal(0);

  constructor(
    private patientApi: PatientService,
    private appointmentApi: AppointmentService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userName = this.auth.displayName();
    this.patientApi.getAll().subscribe({
      next: (data) => {
        this.patients.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load patients. Is the backend running?');
        this.loading.set(false);
      }
    });
    this.appointmentApi.getAll().subscribe({
      next: (a) => this.appointmentCount.set(a.length),
      error: () => {}
    });
  }

  barHeight(count: number): string {
    return `${(count / this.maxBucket()) * 100}%`;
  }
}
