import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Allows only signed-in Doctors (and Admins, who can do everything).
export const doctorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) { router.navigate(['/login']); return false; }
  if (auth.isDoctor() || auth.isAdmin()) { return true; }
  router.navigate(['/dashboard']);
  return false;
};
