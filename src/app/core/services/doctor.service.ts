import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Doctor, DoctorRequest } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly url = `${environment.apiBaseUrl}/api/doctors`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Doctor[]> { return this.http.get<Doctor[]>(this.url); }
  create(d: DoctorRequest): Observable<Doctor> { return this.http.post<Doctor>(this.url, d); }
  update(id: string, d: DoctorRequest): Observable<Doctor> { return this.http.put<Doctor>(`${this.url}/${id}`, d); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  // Upload an .xlsx file of doctors; returns how many were added.
  importExcel(file: File): Observable<{ added: number }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ added: number }>(`${this.url}/import`, form);
  }

  // Download the current doctor list as an .xlsx file.
  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.url}/export`, { responseType: 'blob' });
  }
}
