// Mirrors the backend DTOs.

export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT';

// ---- Patient ----
export interface Patient {
  id: string;
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
}

export interface PatientRequest {
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
  registeredDate?: string;
}

// ---- Auth ----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: Role;
  email: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'DOCTOR' | 'PATIENT';
  name?: string;
  country?: string;
  address?: string;
}

// ---- Doctor ----
export interface Doctor {
  id: string;
  name: string;
  email: string;
  speciality: string;
  qualification: string;
  contact: string;
  country: string;
  address: string;
  homeService: boolean;
  availability: string;
  department: string;
}

export interface DoctorRequest {
  name: string;
  email: string;
  speciality: string;
  qualification: string;
  contact: string;
  country: string;
  address: string;
  homeService: boolean;
  availability: string;
  department: string;
}

// ---- Appointment ----
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  appointmentTime: string;
  status: string;
  reason: string;
}

export interface AppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentTime: string;
  reason: string;
}

// ---- Feedback ----
export interface Feedback {
  id: string;
  patientName: string;
  rating: number;
  message: string;
  createdAt: string;
}

export interface FeedbackRequest {
  patientName: string;
  rating: number;
  message: string;
}

// ---- Public content ----
export interface Department { name: string; description: string; }
export interface ContactInfo {
  emergency: string; ambulance: string; bloodBank: string;
  boardLine: string; hospitalEmail: string; address: string;
}
export interface Faq { q: string; a: string; }
export interface NewsItem { title: string; date: string; summary: string; }

// ---- Patient report ----
export interface PatientReport {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  department: string;
  visitType: string;
  chiefComplaint: string;
  historyOfIllness: string;
  examinationFindings: string;
  diagnosis: string;
  medications: string;
  treatmentPlan: string;
  followUp: string;
  createdAt: string;
}

export interface PatientReportRequest {
  patientId: string;
  doctorName: string;
  department: string;
  visitType: string;
  chiefComplaint: string;
  historyOfIllness: string;
  examinationFindings: string;
  diagnosis: string;
  medications: string;
  treatmentPlan: string;
  followUp: string;
}

// ---- Doctor reviews ----
export interface DoctorReview {
  id: string;
  doctorId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
export interface DoctorReviewRequest {
  doctorId: string;
  reviewerName: string;
  rating: number;
  comment: string;
}

// ---- Branches (About page) ----
export interface BranchDept { department: string; beds: number; }
export interface Branch {
  name: string;
  address: string;
  phone: string;
  departments: BranchDept[];
}
