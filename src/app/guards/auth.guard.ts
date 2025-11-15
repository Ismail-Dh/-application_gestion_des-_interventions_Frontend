import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirection correcte avec UrlTree
    return inject(Router).createUrlTree(['/login']);
  }
  return true;
};