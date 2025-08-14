import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  private auth: AuthService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    const secureEndpoints = ['http://localhost:8080/api/orders'];

    if (secureEndpoints.some((url) => req.urlWithParams.includes(url))) {
      await this.auth.getAccessTokenSilently().forEach((token) => {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      });
    }

    return await lastValueFrom(next.handle(req));
  }
}
