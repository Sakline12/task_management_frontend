import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from './_services/authentication.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';

@Injectable()
export class AuthInterceptorServiceService implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Reset the timer for inactivity
    this.resetTimer();

    // Attach event listeners for mouse and keyboard events
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('mousedown', this.resetTimer.bind(this));
    window.addEventListener('keypress', this.resetTimer.bind(this));
    window.addEventListener('touchmove', this.resetTimer.bind(this));

    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // this.authService.logout(window.location.hostname).subscribe();
          Cookie.delete('.BBTMS.Cookie');
          localStorage.removeItem('token');
          localStorage.removeItem('tms_user');
          //this.router.navigate(['/login']);
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
          // window.location.reload();
        }
        return throwError(error);
      })
    );
  }

  resetTimer() {

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      Cookie.delete('.BBTMS.Cookie');
      localStorage.removeItem('token');
      localStorage.removeItem('tms_user');
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }, 300000);
  }

  private timer: any;
}
