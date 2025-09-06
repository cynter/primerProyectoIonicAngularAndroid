import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText, IonButton, IonInput, IonList, IonItem, IonLabel, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { SupabaseAuth } from 'src/app/services/supabase-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonText, IonContent, IonButton, IonHeader, IonTitle, IonToolbar,
    CommonModule, IonList, IonItem, IonLabel, IonInput, IonIcon,
    FormsModule, ReactiveFormsModule]
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(SupabaseAuth);

  loading = signal(false);
  errorMsg = signal<string | null>(null);
  showPassword = false;
  showPassword2 = false;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required]]
  }, { validators: [passwordsMatchValidator] });

  showError(control: 'email' | 'password' | 'password2', errorName: string) {
    const c = this.form.get(control);
    return !!(c && c.touched && c.errors?.[errorName]);
  }

  showFormError(errorName: string) {
    return !!(this.form.touched && this.form.errors?.[errorName]);
  }

  async onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set(null);
    const { email, password } = this.form.getRawValue();
    try {
      await this.auth.signUp(email, password);
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (err: any) {
      this.errorMsg.set(err?.message ?? 'No se pudo registrar');
    } finally {
      this.loading.set(false);
    }
  }

  // Acceso rápido
  quickFill(email: string, password: string) {
    this.form.patchValue({ email, password, password2: password });
    this.form.markAllAsTouched();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  togglePassword2() {
    this.showPassword2 = !this.showPassword2;
  }
}

// Validador para que las contraseñas coincidan
function passwordsMatchValidator(group: any) {
  const pass = group.get('password')?.value;
  const pass2 = group.get('password2')?.value;
  return pass === pass2 ? null : { passwordMismatch: true };
}
