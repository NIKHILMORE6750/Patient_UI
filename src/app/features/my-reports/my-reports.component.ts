import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportService } from '../../core/services/report.service';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { PatientReport, Patient } from '../../core/models/patient.model';
import {
  reportToText, reportToHtml, downloadFile, printReport
} from '../../core/util/report-download';

@Component({
  selector: 'app-my-reports',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-reports.component.html',
  styleUrl: './my-reports.component.css'
})
export class MyReportsComponent implements OnInit {
  reports = signal<PatientReport[]>([]);
  loading = signal(true);
  notice = signal('');

  constructor(
    private reportApi: ReportService,
    private patientApi: PatientService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // Match the logged-in patient to their patient record by email,
    // then load only their reports.
    const email = this.auth.getUserEmail().toLowerCase();
    this.patientApi.getAll().subscribe({
      next: (patients: Patient[]) => {
        const me = patients.find((p) => p.email?.toLowerCase() === email);
        if (!me) {
          this.loading.set(false);
          this.notice.set('No patient record is linked to your account yet. ' +
            'Ask the front desk to register you as a patient with this email.');
          return;
        }
        this.reportApi.getByPatient(me.id).subscribe({
          next: (r) => { this.reports.set(r); this.loading.set(false); },
          error: () => { this.loading.set(false); this.notice.set('Could not load your reports.'); }
        });
      },
      error: () => { this.loading.set(false); this.notice.set('Could not load your records.'); }
    });
  }

  downloadHtml(r: PatientReport): void {
    downloadFile(`report-${r.patientName}.html`, reportToHtml(r), 'text/html');
  }
  downloadText(r: PatientReport): void {
    downloadFile(`report-${r.patientName}.txt`, reportToText(r), 'text/plain');
  }
  downloadDoc(r: PatientReport): void {
    // A .doc that Word opens — HTML content with a .doc extension.
    downloadFile(`report-${r.patientName}.doc`, reportToHtml(r), 'application/msword');
  }
  printPdf(r: PatientReport): void {
    printReport(r);
  }
}
