import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DoctorReview, DoctorReviewRequest } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly url = `${environment.apiBaseUrl}/api/reviews`;
  constructor(private http: HttpClient) {}

  getByDoctor(doctorId: string): Observable<DoctorReview[]> {
    return this.http.get<DoctorReview[]>(`${this.url}?doctorId=${doctorId}`);
  }
  getAll(): Observable<DoctorReview[]> { return this.http.get<DoctorReview[]>(this.url); }
  create(r: DoctorReviewRequest): Observable<DoctorReview> {
    return this.http.post<DoctorReview>(this.url, r);
  }
}
