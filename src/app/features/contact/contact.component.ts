import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { ContactInfo } from '../../core/models/patient.model';

@Component({
  selector: 'app-contact', standalone: true, imports: [CommonModule],
  templateUrl: './contact.component.html', styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  c = signal<ContactInfo | null>(null);
  constructor(private content: ContentService) {}
  ngOnInit(): void { this.content.contact().subscribe({ next: (v) => this.c.set(v) }); }
}
