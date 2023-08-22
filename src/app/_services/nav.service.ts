import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { navItems } from '../_nav';

@Injectable()
export class NavService {

    public navItems = navItems;
    public currentUser: any = {};

    constructor(private authService: AuthenticationService,) {
        this.currentUser = this.authService.currentUserDetails.value;
    }

    ngOnInit(): void {
        // this.navSrv$ = this.navSrv.ready.subscribe((navItems)=>{
        //      this.navItems = navItems;
        // });    

        this.checkPermission();

     }

     checkPermission(){
        console.log(this.navItems)
     }

}