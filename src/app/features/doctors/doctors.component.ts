import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../core/services/doctor.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { PatientService } from '../../core/services/patient.service';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { Doctor, DoctorRequest, Patient, DoctorReview } from '../../core/models/patient.model';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
  doctors = signal<Doctor[]>([]);
  patients = signal<Patient[]>([]);
  loading = signal(true);
  search = signal('');
  toast = signal('');

  // doctor add/edit modal
  editOpen = signal(false);
  editingId = signal<string | null>(null);
  saving = signal(false);
  form: DoctorRequest = this.blankDoctor();

  // booking modal (patient)
  bookOpen = signal(false);
  bookDoctor = signal<Doctor | null>(null);
  bookPatientId = '';
  bookTime = '';
  bookReason = '';
  booking = signal(false);

  // reviews
  reviews = signal<Record<string, DoctorReview[]>>({});
  reviewOpen = signal<string | null>(null);
  reviewerName = '';
  reviewRating = 5;
  reviewComment = '';
  reviewStars = [1, 2, 3, 4, 5];

  // excel
  importing = signal(false);

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.doctors();
    return this.doctors().filter(
      (d) => d.name.toLowerCase().includes(q) ||
             d.speciality.toLowerCase().includes(q) ||
             d.department?.toLowerCase().includes(q)
    );
  });

  constructor(
    private docApi: DoctorService,
    private apptApi: AppointmentService,
    private patientApi: PatientService,
    private reviewApi: ReviewService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
    if (this.auth.isPatient() || this.auth.isAdmin()) {
      this.patientApi.getAll().subscribe({ next: (p) => this.patients.set(p) });
    }
  }

  load(): void {
    this.loading.set(true);
    this.docApi.getAll().subscribe({
      next: (d) => {
        this.doctors.set(d);
        this.loading.set(false);
        d.forEach((doc) => this.loadReviews(doc.id));
      },
      error: () => this.loading.set(false)
    });
  }

  loadReviews(doctorId: string): void {
    this.reviewApi.getByDoctor(doctorId).subscribe({
      next: (rs) => this.reviews.update((m) => ({ ...m, [doctorId]: rs }))
    });
  }

  reviewsFor(id: string): DoctorReview[] { return this.reviews()[id] ?? []; }
  avgRating(id: string): number {
    const rs = this.reviewsFor(id);
    if (!rs.length) return 0;
    return Math.round((rs.reduce((s, r) => s + r.rating, 0) / rs.length) * 10) / 10;
  }
  starString(n: number): string { return '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n); }

  // A doctor may edit only the record whose email matches their login.
  isOwnProfile(d: Doctor): boolean {
    return this.auth.isDoctor() &&
      d.email?.toLowerCase() === this.auth.getUserEmail().toLowerCase();
  }

  // ---- admin: add/edit ----
  openAdd(): void {
    this.editingId.set(null);
    this.form = this.blankDoctor();
    this.editOpen.set(true);
  }
  openEdit(d: Doctor): void {
    this.editingId.set(d.id);
    this.form = { ...d };
    this.editOpen.set(true);
  }
  saveDoctor(): void {
    this.saving.set(true);
    const id = this.editingId();
    const req = id ? this.docApi.update(id, this.form) : this.docApi.create(this.form);
    req.subscribe({
      next: () => { this.saving.set(false); this.editOpen.set(false); this.load(); },
      error: () => { this.saving.set(false); }
    });
  }
  removeDoctor(d: Doctor): void {
    if (!confirm(`Remove Dr. ${d.name}?`)) return;
    this.docApi.delete(d.id).subscribe({ next: () => this.load() });
  }

  // ---- admin: excel ----
  onImportFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.importing.set(true);
    this.docApi.importExcel(file).subscribe({
      next: (res) => {
        this.importing.set(false);
        this.toast.set(`${res.added} doctor(s) imported from Excel.`);
        setTimeout(() => this.toast.set(''), 4000);
        this.load();
        input.value = '';
      },
      error: () => {
        this.importing.set(false);
        this.toast.set('Could not import that file. Check the column format.');
        setTimeout(() => this.toast.set(''), 4000);
        input.value = '';
      }
    });
  }
  exportExcel(): void {
    this.docApi.exportExcel().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'doctors.xlsx'; a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  // ---- reviews ----
  openReview(id: string): void {
    this.reviewOpen.set(this.reviewOpen() === id ? null : id);
    this.reviewerName = this.auth.isAuthenticated() ? this.auth.displayName() : '';
    this.reviewRating = 5;
    this.reviewComment = '';
  }
  submitReview(doctorId: string): void {
    this.reviewApi.create({
      doctorId,
      reviewerName: this.reviewerName || 'Anonymous',
      rating: this.reviewRating,
      comment: this.reviewComment
    }).subscribe({
      next: () => {
        this.reviewComment = '';
        this.reviewOpen.set(null);
        this.loadReviews(doctorId);
      }
    });
  }

  // ---- patient: book ----
  openBook(d: Doctor): void {
    this.bookDoctor.set(d);
    this.bookPatientId = this.patients()[0]?.id ?? '';
    this.bookTime = '';
    this.bookReason = '';
    this.bookOpen.set(true);
  }
  confirmBook(): void {
    const d = this.bookDoctor();
    if (!d) return;
    this.booking.set(true);
    this.apptApi.book({
      patientId: this.bookPatientId,
      doctorId: d.id,
      appointmentTime: this.bookTime,
      reason: this.bookReason
    }).subscribe({
      next: () => {
        this.booking.set(false);
        this.bookOpen.set(false);
        this.toast.set(`Appointment booked with Dr. ${d.name}.`);
        setTimeout(() => this.toast.set(''), 4000);
      },
      error: () => { this.booking.set(false); }
    });
  }

  private blankDoctor(): DoctorRequest {
    return { name: '', email: '', speciality: '', qualification: '', contact: '',
             country: 'India', address: '', homeService: false, availability: '', department: '' };
  }
}
