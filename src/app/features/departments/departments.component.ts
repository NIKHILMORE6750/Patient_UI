import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { DoctorService } from '../../core/services/doctor.service';
import { Department, Branch, Doctor } from '../../core/models/patient.model';

@Component({
  selector: 'app-departments', standalone: true, imports: [CommonModule],
  templateUrl: './departments.component.html', styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  items = signal<Department[]>([]);
  branches = signal<Branch[]>([]);
  doctors = signal<Doctor[]>([]);
  selected = signal<Department | null>(null);

  constructor(private content: ContentService, private docApi: DoctorService) {}

  ngOnInit(): void {
    this.content.departments().subscribe({ next: (d) => this.items.set(d) });
    this.content.branches().subscribe({ next: (b) => this.branches.set(b) });
    this.docApi.getAll().subscribe({ next: (d) => this.doctors.set(d) });
  }

  open(d: Department): void {
    this.selected.set(this.selected()?.name === d.name ? null : d);
  }

  // Beds available for the selected department across all branches.
  bedsFor(name: string): { branch: string; beds: number }[] {
    const out: { branch: string; beds: number }[] = [];
    for (const b of this.branches()) {
      const match = b.departments.find((x) => x.department === name);
      if (match) out.push({ branch: b.name, beds: match.beds });
    }
    return out;
  }

  totalBeds(name: string): number {
    return this.bedsFor(name).reduce((s, x) => s + x.beds, 0);
  }

  doctorsFor(name: string): Doctor[] {
    return this.doctors().filter(
      (d) => d.department?.toLowerCase() === name.toLowerCase()
    );
  }
}
