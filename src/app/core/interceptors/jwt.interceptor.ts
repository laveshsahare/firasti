import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly loadingService: LoadingService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const authRequest = token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

    this.loadingService.show();
    return next.handle(authRequest).pipe(finalize(() => this.loadingService.hide()));
  }
}
