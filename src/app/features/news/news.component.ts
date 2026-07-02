import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { NewsItem } from '../../core/models/patient.model';

@Component({
  selector: 'app-news', standalone: true, imports: [CommonModule],
  templateUrl: './news.component.html', styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  items = signal<NewsItem[]>([]);
  constructor(private content: ContentService) {}
  ngOnInit(): void { this.content.news().subscribe({ next: (n) => this.items.set(n) }); }
}
