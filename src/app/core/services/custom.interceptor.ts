import { TransferState } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, mergeMap, of, switchMap, throwError } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  constructor(private storage: StorageMap) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('users/login') || req.url.includes('users/forget')) {
      return next.handle(req);
    }
    return this.storage.get('oToken').pipe(
      mergeMap((user: any): Observable<HttpEvent<any>> => {
        if (user) {
          return next.handle(this.addToken(req, user));
        }
        return next.handle(req);
      })
    )
  }

  private addToken(request: HttpRequest<any>, token: any) {
    const clone: HttpRequest<any> = request.clone({
      setHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
    return clone;
  }
}
