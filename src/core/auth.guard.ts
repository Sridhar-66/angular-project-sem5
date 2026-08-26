import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';

/** Factory: creates a guard that allows only the specified role */
export function roleGuard(allowedRole: UserRole): CanActivateFn {
  return async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    // Wait until session is bootstrapped
    if (auth.loading()) {
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (!auth.loading()) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });
    }

    if (!auth.isAuthenticated) {
      router.navigate(['/login']);
      return false;
    }

    const role = auth.currentRole;
    if (role !== allowedRole) {
      // Redirect to their correct dashboard instead of a blank 403
      if (role) auth.navigateToDashboard(role);
      else router.navigate(['/login']);
      return false;
    }

    return true;
  };
}

/** Guard for the /login and /signup routes — redirect logged-in users to dashboard */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.loading()) {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!auth.loading()) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  if (auth.isAuthenticated && auth.currentRole) {
    auth.navigateToDashboard(auth.currentRole);
    return false;
  }
  return true;
};
