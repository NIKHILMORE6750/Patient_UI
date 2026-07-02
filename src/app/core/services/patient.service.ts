import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patient, PatientRequest } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  // Routed through the gateway; JWT is attached by the auth interceptor.
  private readonly url = `${environment.apiBaseUrl}/api/patients`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.url);
  }

  create(patient: PatientRequest): Observable<Patient> {
    return this.http.post<Patient>(this.url, patient);
  }

  update(id: string, patient: PatientRequest): Observable<Patient> {
    return this.http.put<Patient>(`${this.url}/${id}`, patient);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
