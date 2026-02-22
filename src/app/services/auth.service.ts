import { Injectable, inject, NgZone } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private router = inject(Router);
    private ngZone = inject(NgZone);

    private userSubject = new BehaviorSubject<User | null>(null);
    public user$ = this.userSubject.asObservable().pipe(shareReplay(1));

    private initializedSubject = new BehaviorSubject<boolean>(false);
    public isInitialized$ = this.initializedSubject.asObservable();

    constructor() {
        // Écouter l'état de connexion de manière fiable
        onAuthStateChanged(this.auth, (user) => {
            this.userSubject.next(user);
            if (!this.initializedSubject.value) {
                this.initializedSubject.next(true);
            }
        });
    }

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result = await signInWithPopup(this.auth, provider);
            if (result.user) {
                this.ngZone.run(() => {
                    this.router.navigate(['/admin-lmye']);
                });
            }
        } catch (error) {
            console.error('Erreur Login:', error);
            throw error;
        }
    }

    async logout() {
        await signOut(this.auth);
        this.ngZone.run(() => {
            this.router.navigate(['/']);
        });
    }

    get currentUser(): User | null {
        return this.auth.currentUser;
    }
}
