import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuth {
  private supabase: SupabaseClient;
  private _session$ = new BehaviorSubject<Session | null>(null);
  /** Sesión actual (observable) */
  session$ = this._session$.asObservable();
  /** Conveniencia: si hay sesión activa */
  isLoggedIn$ = this.session$.pipe(map(s => !!s));

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    this.init();
  }

  private async init() {
    const { data } = await this.supabase.auth.getSession();
    this._session$.next(data.session ?? null);

    this.supabase.auth.onAuthStateChange((_evt, session) => {
      this._session$.next(session);
    });
  }

  /** Login con email/clave */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  /** Logout */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  /** Obtener la sesión (para guard/arranque) */
  async getCurrentSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session ?? null;
  }
}
