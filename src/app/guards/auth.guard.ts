import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap, filter, switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isInitialized$.pipe(
        filter(initialized => initialized),
        switchMap(() => authService.user$),
        take(1),
        map(user => {
            if (!user) {
                router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }
            return true;
        })
    );
};
