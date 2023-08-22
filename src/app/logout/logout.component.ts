import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../service/data.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  data: any;
  form: any;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}
  ngOnInit(): void {}

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
          localStorage.clear();
          // localStorage.removeItem('type');
          this.router.navigate(['/login']);

          Swal.fire('Logout!', 'user logout', 'success');
        });
      }
    });
  }
}
