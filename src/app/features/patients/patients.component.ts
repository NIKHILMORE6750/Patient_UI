import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../core/services/patient.service';
import { Patient, PatientRequest } from '../../core/models/patient.model';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  patients = signal<Patient[]>([]);
  loading = signal(true);
  search = signal('');

  // Modal state
  modalOpen = signal(false);
  editingId = signal<string | null>(null);
  saving = signal(false);
  formError = signal('');

  // Form fields
  form: PatientRequest = this.blank();

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.patients();
    return this.patients().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
    );
  });

  constructor(private api: PatientService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (data) => {
        this.patients.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form = this.blank();
    this.formError.set('');
    this.modalOpen.set(true);
  }

  openEdit(p: Patient): void {
    this.editingId.set(p.id);
    this.form = {
      name: p.name,
      email: p.email,
      address: p.address,
      dateOfBirth: p.dateOfBirth
    };
    this.formError.set('');
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }

  save(): void {
    this.saving.set(true);
    this.formError.set('');
    const id = this.editingId();

    const payload: PatientRequest = { ...this.form };
    if (!id) {
      // registeredDate is required on create only.
      payload.registeredDate = new Date().toISOString().split('T')[0];
    }

    const req = id
      ? this.api.update(id, payload)
      : this.api.create(payload);

    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(
          err.status === 400
            ? 'Please check the fields. Email must be valid and unique.'
            : 'Could not save. Please try again.'
        );
      }
    });
  }

  remove(p: Patient): void {
    if (!confirm(`Delete ${p.name}? This cannot be undone.`)) return;
    this.api.delete(p.id).subscribe({
      next: () => this.load()
    });
  }

  private blank(): PatientRequest {
    return { name: '', email: '', address: '', dateOfBirth: '' };
  }
}
