import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { Branch } from '../../core/models/patient.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  branches = signal<Branch[]>([]);
  loading = signal(true);

  constructor(private content: ContentService) {}

  ngOnInit(): void {
    this.content.branches().subscribe({
      next: (b) => { this.branches.set(b); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  totalBeds(b: Branch): number {
    return b.departments.reduce((sum, d) => sum + d.beds, 0);
  }
}
