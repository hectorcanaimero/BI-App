import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private storage: StorageMap,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.storage.get('oToken').pipe(
      map((token: any): boolean => {
        if (token) return true;
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }),
      catchError((): Observable<boolean>  => {
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }
}
