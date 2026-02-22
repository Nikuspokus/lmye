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
      
      @if ((authService.isInitialized$ | async) === false) {
        <div class="status-box">
          Vérification de la session...
        </div>
      }

      @if (authService.isInitialized$ | async) {
        <button (click)="login()" class="btn btn-primary" [disabled]="isLoading">
           {{ isLoading ? 'Connexion en cours...' : 'Se connecter avec Google' }}
        </button>
        @if (error) {
          <p class="error-msg">{{ error }}</p>
        }
      }
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
    .status-box { padding: 1rem; color: #666; font-style: italic; }
    .error-msg { color: #ff4d4d; font-weight: 600; margin-top: 1rem; }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isLoading = false;
  error: string | null = null;

  constructor() {
    // Rediriger si une session est déjà active
    this.authService.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/admin-lmye']);
      }
    });
  }

  async login() {
    this.isLoading = true;
    this.error = null;
    try {
      await this.authService.loginWithGoogle();
      // Le AuthService gère la navigation après succès
    } catch (error: unknown) {
      this.isLoading = false;
      this.error = "Échec de la connexion. Veuillez réessayer.";
      console.error('Login error:', error);
    }
  }
}
