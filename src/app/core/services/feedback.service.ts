import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Feedback, FeedbackRequest } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly url = `${environment.apiBaseUrl}/api/feedback`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Feedback[]> { return this.http.get<Feedback[]>(this.url); }
  create(f: FeedbackRequest): Observable<Feedback> { return this.http.post<Feedback>(this.url, f); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
