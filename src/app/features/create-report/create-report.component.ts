import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../core/services/patient.service';
import { ReportService } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';
import { Patient, PatientReportRequest } from '../../core/models/patient.model';

@Component({
  selector: 'app-create-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.css'
})
export class CreateReportComponent implements OnInit {
  patients = signal<Patient[]>([]);
  saving = signal(false);
  done = signal(false);
  error = signal('');

  form: PatientReportRequest = this.blank();

  constructor(
    private patientApi: PatientService,
    private reportApi: ReportService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.form.doctorName = this.auth.getUserEmail();
    this.patientApi.getAll().subscribe({ next: (p) => this.patients.set(p) });
  }

  submit(): void {
    this.error.set('');
    this.saving.set(true);
    this.reportApi.create(this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.done.set(true);
        const doctor = this.form.doctorName;
        this.form = this.blank();
        this.form.doctorName = doctor;
        setTimeout(() => this.done.set(false), 4000);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Could not save the report. Check the backend is running.');
      }
    });
  }

  private blank(): PatientReportRequest {
    return {
      patientId: '', doctorName: '', department: '', visitType: 'OPD',
      chiefComplaint: '', historyOfIllness: '', examinationFindings: '',
      diagnosis: '', medications: '', treatmentPlan: '', followUp: ''
    };
  }
}
