import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Auth, getRedirectResult } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <h2>Connexion Administration</h2>
      <button (click)="login()" class="btn btn-primary">
         Se connecter avec Google
      </button>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
      gap: 2rem;
    }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    const auth = inject(Auth);

    // Gérer le résultat de la redirection (plus robuste pour Firebase)
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        this.router.navigate(['/admin-lmye']);
      }
    }).catch((error) => {
      console.error('Erreur retour redirect', error);
    });

    // Écouter l'état au cas où (persistance auto)
    this.authService.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/admin-lmye']);
      }
    });
  }

  async login() {
    try {
      await this.authService.loginWithGoogle();
    } catch (error: any) {
      console.error('Login error', error);
      alert(`Erreur de connexion : ${error.code || error.message || 'Erreur inconnue'}`);
    }
  }
}
