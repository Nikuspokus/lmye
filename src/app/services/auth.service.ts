import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { traceUntilFirst } from '@angular/fire/performance';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private auth: Auth = inject(Auth);
    user$: Observable<User | null> = authState(this.auth);

    constructor() { }

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(this.auth, provider);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    }

    async logout() {
        await signOut(this.auth);
    }

    get isLoggedIn(): Observable<boolean> {
        return this.user$.pipe(map(user => !!user));
    }
}
