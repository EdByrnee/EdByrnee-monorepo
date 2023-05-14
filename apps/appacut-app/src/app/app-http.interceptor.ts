import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from '../core/auth';

@Injectable()
export class AuthorizationHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return from(this.authService.getAccessToken()).pipe(
      mergeMap((accessToken: string | null) => {
        let modifiedReq: HttpRequest<unknown>;
        if (accessToken) {          
          modifiedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
          });
        } else {
          modifiedReq = req;
        }
        return next.handle(modifiedReq);
      }),
      catchError((err) => {
        if (err.status === 401) {
          this.authService.logout();
        }
        return throwError(err);
      })
    );
  }
}
