import { PatientReport } from '../models/patient.model';

// Builds the report body as readable plain text.
export function reportToText(r: PatientReport): string {
  const line = (label: string, val: string) => `${label}: ${val || '-'}`;
  return [
    'MERIDIAN HOSPITAL — PATIENT MEDICAL REPORT',
    '==========================================',
    '',
    line('Patient', r.patientName),
    line('Attending Physician', r.doctorName),
    line('Department', r.department),
    line('Visit Type', r.visitType),
    line('Date', r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'),
    '',
    'CHIEF COMPLAINT',
    r.chiefComplaint || '-',
    '',
    'HISTORY OF PRESENT ILLNESS',
    r.historyOfIllness || '-',
    '',
    'EXAMINATION FINDINGS',
    r.examinationFindings || '-',
    '',
    'DIAGNOSIS',
    r.diagnosis || '-',
    '',
    'MEDICATIONS PRESCRIBED',
    r.medications || '-',
    '',
    'TREATMENT PLAN & ADVICE',
    r.treatmentPlan || '-',
    '',
    'FOLLOW-UP',
    r.followUp || '-',
    '',
    '------------------------------------------',
    'Confidential medical record'
  ].join('\n');
}

// Builds a styled HTML document for the report.
export function reportToHtml(r: PatientReport): string {
  const row = (label: string, val: string) =>
    `<tr><th>${label}</th><td>${escapeHtml(val) || '-'}</td></tr>`;
  const block = (title: string, val: string) =>
    `<h3>${title}</h3><p>${escapeHtml(val) || '-'}</p>`;
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Patient Report — ${escapeHtml(r.patientName)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #16201f; max-width: 760px; margin: 2rem auto; padding: 0 1.5rem; }
  h1 { color: #0b7d73; border-bottom: 3px solid #0d9488; padding-bottom: 0.5rem; }
  h3 { color: #0b7d73; margin: 1.4rem 0 0.3rem; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
  th, td { border: 1px solid #d7dbda; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.92rem; }
  th { background: #e6f4f1; width: 32%; }
  p { font-size: 0.92rem; line-height: 1.5; white-space: pre-wrap; }
  .foot { margin-top: 2rem; font-size: 0.78rem; color: #5c6664; border-top: 1px solid #d7dbda; padding-top: 0.75rem; }
</style></head>
<body>
  <h1>Meridian Hospital — Patient Medical Report</h1>
  <table>
    ${row('Patient', r.patientName)}
    ${row('Attending Physician', r.doctorName)}
    ${row('Department', r.department)}
    ${row('Visit Type', r.visitType)}
    ${row('Date', r.createdAt ? new Date(r.createdAt).toLocaleString() : '-')}
  </table>
  ${block('Chief Complaint', r.chiefComplaint)}
  ${block('History of Present Illness', r.historyOfIllness)}
  ${block('Examination Findings', r.examinationFindings)}
  ${block('Diagnosis', r.diagnosis)}
  ${block('Medications Prescribed', r.medications)}
  ${block('Treatment Plan & Advice', r.treatmentPlan)}
  ${block('Follow-up', r.followUp)}
  <p class="foot">Confidential medical record · Generated from Meridian Patient Portal</p>
</body></html>`;
}

// Triggers a browser download of given content.
export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Opens a print dialog with the HTML report (user can "Save as PDF").
export function printReport(r: PatientReport): void {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(reportToHtml(r));
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

function escapeHtml(s: string): string {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
