import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SupabaseAuth } from 'src/app/services/supabase-auth';
import { addIcons } from 'ionicons';
import { logOut } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class HomePage {

  auth = inject(SupabaseAuth);
  private router = inject(Router);

  async logout() {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

}

addIcons({ 'log-out': logOut });