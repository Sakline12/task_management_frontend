import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { navbarData, navbarData2, navbarData3, navbarData4, navbarData5, navbarData6, navbarData7, navbarData8,  } from './nav-data';
import { CookieService } from 'ngx-cookie-service';
import { RoleGuard } from '../guard.guard';
import { DataService } from '../service/data.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';





interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [animate('1000ms', keyframes([]))]),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  type: any;
  expectedRole: string;
  is_authenticated = false;
  form: any;
  data: any;
  constructor(
    private cookieService: CookieService,
    private RoleGuard: RoleGuard,
    private dataService: DataService,
    private router: Router,

  ) {
    if (this.dataService.isAuthenticated()) {
      this.is_authenticated = true;
      // console.log('True')
    }
    this.expectedRole = 'Admin';
  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  navData2 = navbarData2;
  navData3 = navbarData3;
  navData4 = navbarData4;
  navData5 = navbarData5;
  navData6 = navbarData6;
  navData7 = navbarData7;
  navData8 = navbarData8;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.canActivate();
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  canActivate() {
    this.type = localStorage.getItem('tms_user');
    // console.log(this.type);
    return true;
  }

  onSubmit() {
    Swal.fire({
      title: 'are you sure',
      text: 'Logout',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'yes',
      cancelButtonText: 'no',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.logOut(this.form).subscribe((res) => {
          this.data = res;
          Cookie.delete('.BBTMS.Cookie');
          localStorage.removeItem('tms_user');
          localStorage.removeItem('token');
          // this.router.navigate(['/login']);
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });

          Swal.fire('Logout!', 'user logout', 'success');
        });
      }
    });
  }
}
