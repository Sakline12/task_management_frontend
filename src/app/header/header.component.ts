import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  // myform!: FormGroup;
  data: any;
  user: any;
  first_name: any;
  last_name: any;
  image: any;
  project: any;
  // selectedItem: string;
  selectedItem: any;
  // data:any;
  form: any;
  is_authenticated = false;
  constructor(private dataService: DataService, private router: Router) {
    if (this.dataService.isAuthenticated()) {
      //this.router.navigate(['/']);
      this.is_authenticated = true;
      console.log(this.is_authenticated);
    }
  }

  selectMenuItem(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue) {
      this.router.navigateByUrl(selectedValue);
    }
  }

  ngOnInit(): void {
    if (this.is_authenticated) {
      this.dataService.getProfile().subscribe((res: any) => {
        this.user = res;
        this.first_name = this.user.data[0].first_name;
        this.last_name = this.user.data[0].last_name;
        this.image = this.user.data[0].image;
        // console.log(this.image);
        // console.log(this.user);
      });
    }
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
          localStorage.removeItem('token');
          localStorage.removeItem('tms_user');
          // this.router.navigate(['/login']);
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });

          Swal.fire('Logout!', 'user logout', 'success');
        });
      }
    });
  }

  getHeadClass(): string {
    let styeClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styeClass = 'head-trimed';
    } else {
      styeClass = 'head-md-screen';
    }
    return styeClass;
  }
}
