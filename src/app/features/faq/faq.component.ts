import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { Faq } from '../../core/models/patient.model';

@Component({
  selector: 'app-faq', standalone: true, imports: [CommonModule],
  templateUrl: './faq.component.html', styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
  items = signal<Faq[]>([]);
  open = signal<number | null>(0);
  constructor(private content: ContentService) {}
  ngOnInit(): void { this.content.faqs().subscribe({ next: (f) => this.items.set(f) }); }
  toggle(i: number): void { this.open.set(this.open() === i ? null : i); }
}
