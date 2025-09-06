import { AfterViewInit, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Animation, AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-dynamic',
  templateUrl: './splash-dynamic.page.html',
  styleUrls: ['./splash-dynamic.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class SplashDynamicPage implements AfterViewInit {

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
    private ngZone: NgZone
  ) { }

  private playAndWait(anim: Animation): Promise<void> {
    return new Promise(resolve => {
      anim.onFinish(() => resolve(), { oneTimeCallback: true });
      anim.play();
    });
  }

  async ngAfterViewInit() {
    // Logo: zoom + fade (transición 1)
    const logoEl = document.querySelector('#logo') as HTMLElement;
    const topEl = document.querySelector('#topText') as HTMLElement;
    const bottomEl = document.querySelector('#bottomText') as HTMLElement;

    const logoAnim: Animation = this.animationCtrl.create()
      .addElement(logoEl)
      .duration(1100)
      .easing('cubic-bezier(0.2, 0.9, 0.2, 1)')
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(3.00)' },
        { offset: 0.6, opacity: '1', transform: 'scale(0.5)' },
        { offset: 1, opacity: '1', transform: 'scale(1.00)' },
      ]);

    // Top: slide-down + blur out (transición 2)
    const topAnim: Animation = this.animationCtrl.create()
      .addElement(topEl)
      .duration(900)
      .easing('cubic-bezier(0.15, 0.85, 0.2, 1.1)')
      .keyframes([
        { offset: 0, opacity: '0', transform: 'translateY(-40px)', filter: 'blur(6px)' },
        { offset: 1, opacity: '1', transform: 'translateY(0)', filter: 'blur(0px)' },
      ]);

    // Bottom: slide-up + blur out (transición 3)
    const bottomAnim: Animation = this.animationCtrl.create()
      .addElement(bottomEl)
      .duration(800)
      .easing('cubic-bezier(0.25, 0.8, 0.25, 1)')
      .keyframes([
        { offset: 0, opacity: '0', transform: 'translateY(40px)', filter: 'blur(6px)' },
        { offset: 1, opacity: '1', transform: 'translateY(0)', filter: 'blur(0px)' },
      ]);

    // Secuencia estricta: logo -> (100ms gap) -> nombre -> (100ms gap) -> curso
    await this.playAndWait(logoAnim);
    await new Promise(r => setTimeout(r, 100));

    await this.playAndWait(topAnim);
    await new Promise(r => setTimeout(r, 100));

    await this.playAndWait(bottomAnim);

    // pequeño hold y navegar a Home
    setTimeout(() => {
      this.ngZone.run(() => this.router.navigateByUrl('/login', { replaceUrl: true }));
    }, 150);
  }

}
