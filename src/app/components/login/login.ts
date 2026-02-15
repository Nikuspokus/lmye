import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    // Rediriger automatiquement si déjà connecté (utile après le redirect)
    this.authService.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/admin-lmye']);
      }
    });
  }

  async login() {
    try {
      await this.authService.loginWithGoogle();
      // Avec signInWithRedirect, le code suivant n'est pas exécuté car le navigateur change de page
    } catch (error: any) {
      console.error('Login error', error);
      alert(`Erreur de connexion : ${error.code || error.message || 'Erreur inconnue'}`);
    }
  }
}
