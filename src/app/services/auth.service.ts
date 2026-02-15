import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private auth: Auth = inject(Auth);

    // Un Subject pour suivre si l'initialisation (dont le redirect) est terminée
    private isInitializedContent = new BehaviorSubject<boolean>(false);
    isInitialized$ = this.isInitializedContent.asObservable();

    user$: Observable<User | null> = authState(this.auth).pipe(
        shareReplay(1)
    );

    constructor() {
        // Gérer le résultat du redirect dès l'init du service
        getRedirectResult(this.auth).then((result) => {
            if (result) {
                console.log('Redirect result processed successfully');
            }
            this.isInitializedContent.next(true);
        }).catch((error) => {
            console.error('Error processing redirect result', error);
            this.isInitializedContent.next(true);
        });
    }

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithRedirect(this.auth, provider);
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
