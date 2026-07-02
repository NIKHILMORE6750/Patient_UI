import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Department, ContactInfo, Faq, NewsItem, Branch } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly url = `${environment.apiBaseUrl}/api/public`;
  constructor(private http: HttpClient) {}

  departments(): Observable<Department[]> { return this.http.get<Department[]>(`${this.url}/departments`); }
  contact(): Observable<ContactInfo> { return this.http.get<ContactInfo>(`${this.url}/contact`); }
  faqs(): Observable<Faq[]> { return this.http.get<Faq[]>(`${this.url}/faqs`); }
  news(): Observable<NewsItem[]> { return this.http.get<NewsItem[]>(`${this.url}/news`); }
  languages(): Observable<string[]> { return this.http.get<string[]>(`${this.url}/languages`); }
  branches(): Observable<Branch[]> { return this.http.get<Branch[]>(`${this.url}/branches`); }
}
