import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { domain, clientId } from '../../auth_config.json';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AuthInterceptorService } from './services/auth-interceptor.service';

export const environment = {
  production: false,
  auth: {
    domain,
    clientId,
    authorizationParams: {
      redirect_uri: 'http://localhost:4200/login/callback',
      audience: 'http://localhost:8080',
    },
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase',
    ],
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAuth0({
      ...environment.auth,
      httpInterceptor: environment.httpInterceptor,
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
};
