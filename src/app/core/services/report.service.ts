import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PatientReport, PatientReportRequest } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly url = `${environment.apiBaseUrl}/api/reports`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<PatientReport[]> { return this.http.get<PatientReport[]>(this.url); }
  getByPatient(patientId: string): Observable<PatientReport[]> {
    return this.http.get<PatientReport[]>(`${this.url}?patientId=${patientId}`);
  }
  create(r: PatientReportRequest): Observable<PatientReport> {
    return this.http.post<PatientReport>(this.url, r);
  }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
