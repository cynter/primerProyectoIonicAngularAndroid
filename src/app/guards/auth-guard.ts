import { CanActivateFn, Router } from '@angular/router';
import { SupabaseAuth } from '../services/supabase-auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(SupabaseAuth);
  const router = inject(Router);
  const session = await auth.getCurrentSession();
  return session ? true : router.createUrlTree(['/login']);
};
