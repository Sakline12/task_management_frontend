import { HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthguardGuard implements CanActivate {
  constructor(private router: Router) {}
  req: any;
  token: any;
  canActivate() {
    this.token = localStorage.getItem('token');

    // this.req = this.req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${this.token.token}`, // Or whatever the property you have, if any.
    //     'Content-Type': 'application/json'
    //   }
    //  });

    if (this.token) {
      return true;
    } else {
      // alert('You are not authorized');
      this.router.navigate(['login']);
    }
    return true;
  }
}
