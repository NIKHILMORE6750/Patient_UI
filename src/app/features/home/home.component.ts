import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { AuthService } from '../../core/services/auth.service';
import {
  Department, ContactInfo, Faq, NewsItem, Feedback
} from '../../core/models/patient.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  departments = signal<Department[]>([]);
  contact = signal<ContactInfo | null>(null);
  faqs = signal<Faq[]>([]);
  news = signal<NewsItem[]>([]);
  languages = signal<string[]>([]);
  stories = signal<Feedback[]>([]);
  openFaq = signal<number | null>(0);

  constructor(
    private content: ContentService,
    private feedback: FeedbackService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.content.departments().subscribe({ next: (d) => this.departments.set(d) });
    this.content.contact().subscribe({ next: (c) => this.contact.set(c) });
    this.content.faqs().subscribe({ next: (f) => this.faqs.set(f) });
    this.content.news().subscribe({ next: (n) => this.news.set(n) });
    this.content.languages().subscribe({ next: (l) => this.languages.set(l) });
    this.feedback.getAll().subscribe({ next: (s) => this.stories.set(s.slice(0, 3)) });
  }

  toggleFaq(i: number): void {
    this.openFaq.set(this.openFaq() === i ? null : i);
  }

  starString(n: number): string {
    return '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);
  }
}
