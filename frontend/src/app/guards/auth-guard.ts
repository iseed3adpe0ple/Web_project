import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getStorageItem } from '../utils/storage';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (getStorageItem('access')) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
