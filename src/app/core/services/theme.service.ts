import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'pms_theme';
type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initial());

  private initial(): Theme {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    if (saved) return saved;
    // fall back to the user's OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  // Call once at app start to apply the saved theme
  init(): void {
    this.apply(this.theme());
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem(THEME_KEY, next);
    this.apply(next);
  }

  private apply(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}