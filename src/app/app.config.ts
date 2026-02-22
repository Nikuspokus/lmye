import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, ROUTER_CONFIGURATION } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled'
    })),
    {
      provide: ROUTER_CONFIGURATION,
      useValue: { scrollOffset: [0, 92] }
    },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
