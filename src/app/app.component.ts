import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

interface ChatMsg { from: 'bot' | 'user'; text: string; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  showScrollTop = signal(false);

  // True when the current page is login or register (used to hide some nav links)
  onAuthPage = signal(false);

  // simple scripted FAQ chatbot
  chatOpen = signal(false);
  chatInput = '';
  chat = signal<ChatMsg[]>([
    { from: 'bot', text: 'Hi! Ask me about appointments, emergency numbers, home visits, or languages.' }
  ]);

  constructor(public auth: AuthService, public theme: ThemeService, private router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        this.onAuthPage.set(url.startsWith('/login') || url.startsWith('/register'));
      });
  }

  ngOnInit(): void { this.theme.init(); }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showScrollTop.set(window.scrollY > 400);
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  sendChat(): void {
    const q = this.chatInput.trim();
    if (!q) return;
    this.chat.update((c) => [...c, { from: 'user', text: q }]);
    this.chatInput = '';
    const a = this.answer(q.toLowerCase());
    setTimeout(() => this.chat.update((c) => [...c, { from: 'bot', text: a }]), 300);
  }

  private answer(q: string): string {
    if (q.includes('appoint') || q.includes('book'))
      return 'Sign in as a patient, open Doctors, and tap Book on any doctor.';
    if (q.includes('emergency') || q.includes('ambulance'))
      return 'Emergency: 102, Ambulance: 108 — available 24/7.';
    if (q.includes('home'))
      return 'Doctors offering home visits show a "Home service" badge on the Doctors page.';
    if (q.includes('language'))
      return 'We assist in English, Hindi, and Marathi.';
    if (q.includes('subsidy') || q.includes('government'))
      return 'Eligible patients can apply for state health-scheme subsidies at the front desk.';
    if (q.includes('hello') || q.includes('hi'))
      return 'Hello! How can I help — appointments, emergency numbers, or departments?';
    return 'I can help with appointments, emergency numbers, home visits, languages, and subsidies. Try asking about one of those.';
  }
}
