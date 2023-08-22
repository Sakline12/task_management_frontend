import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = (route.data as { expectedRole: string })[
      'expectedRole'
    ];

    const cookieValue = this.cookieService.get('.BBTMS.Cookie');
    console.log(cookieValue);
    if (!cookieValue) {
      this.router.navigate(['/login']);
      return false;
    }

    let cookieData;
    try {
      cookieData = JSON.parse(cookieValue);
    } catch (error) {
      console.error('Error parsing cookie data:', error);
      return false;
    }

    const userRole = cookieData?.type;
    console.log(cookieValue);

    if (userRole === expectedRole) {
      return true; // Allow access if user role matches the expected role
    } else {
      this.router.navigate(['/unauthorized']);
      return false; // Deny access if user role does not match the expected role
    }
  }
}
