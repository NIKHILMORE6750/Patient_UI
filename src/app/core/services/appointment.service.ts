import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment, AppointmentRequest } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly url = `${environment.apiBaseUrl}/api/appointments`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Appointment[]> { return this.http.get<Appointment[]>(this.url); }
  book(a: AppointmentRequest): Observable<Appointment> { return this.http.post<Appointment>(this.url, a); }
  cancel(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  updateStatus(id: string, status: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.url}/${id}/status?status=${status}`, {});
  }
}
