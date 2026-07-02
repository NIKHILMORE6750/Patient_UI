import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { doctorGuard } from './core/guards/doctor.guard';
import { patientGuard } from './core/guards/patient.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Public pages
  { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent) },
  { path: 'departments', loadComponent: () => import('./features/departments/departments.component').then(m => m.DepartmentsComponent) },
  { path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'faq', loadComponent: () => import('./features/faq/faq.component').then(m => m.FaqComponent) },
  { path: 'news', loadComponent: () => import('./features/news/news.component').then(m => m.NewsComponent) },
  { path: 'feedback', loadComponent: () => import('./features/feedback/feedback.component').then(m => m.FeedbackComponent) },

  // Protected pages
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'patients', canActivate: [adminGuard], loadComponent: () => import('./features/patients/patients.component').then(m => m.PatientsComponent) },
  { path: 'doctors', canActivate: [authGuard], loadComponent: () => import('./features/doctors/doctors.component').then(m => m.DoctorsComponent) },
  { path: 'appointments', canActivate: [authGuard], loadComponent: () => import('./features/appointments/appointments.component').then(m => m.AppointmentsComponent) },
  { path: 'create-report', canActivate: [doctorGuard], loadComponent: () => import('./features/create-report/create-report.component').then(m => m.CreateReportComponent) },
  { path: 'my-reports', canActivate: [patientGuard], loadComponent: () => import('./features/my-reports/my-reports.component').then(m => m.MyReportsComponent) },

  { path: '**', redirectTo: 'home' }
];
