import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText, IonList, IonItem, IonLabel, IonButton, IonSpinner, IonInput, IonIcon, IonFabButton, IonFabList, IonFab } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SupabaseAuth } from 'src/app/services/supabase-auth';
import { addIcons } from 'ionicons';
import { eye, eyeOff, person, personCircle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonFab, IonFabList, IonFabButton, IonIcon, IonText, IonContent, IonButton, IonSpinner, IonHeader, IonTitle, IonToolbar, CommonModule, IonList, IonItem, IonLabel, IonInput, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(SupabaseAuth);
  private location = inject(Location);
  showPassword = false;


  loading = signal(false);
  errorMsg = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    // Si ya hay sesión, entrar directo
    this.auth.getCurrentSession().then(s => {
      if (s) this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    });
  }

  showError(control: 'email' | 'password', errorName: string) {
    const c = this.form.get(control);
    return !!(c && c.touched && c.errors?.[errorName]);
  }

  async onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set(null);
    const { email, password } = this.form.getRawValue();
    try {
      await this.auth.signIn(email, password);
      // Solo navega si no estás ya en la ruta destino
      if (this.location.path() !== '/tabs/tab1') {
        await this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      }
    } catch (err: any) {
      this.errorMsg.set(err?.message ?? 'No se pudo iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }
  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  quickFill(email: string, password: string) {
    this.form.patchValue({ email, password });
    this.form.markAllAsTouched();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}

addIcons({
  'eye': eye,
  'eye-off': eyeOff,
  'person': person,
  'person-circle': personCircle
});