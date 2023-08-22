import { Component, OnInit, TemplateRef } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  data: any;
  token: any;
  type: any;

  modalRef?: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    private authService: AuthService
  ) {
    if (this.dataService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef?.hide();
  }

  forgetPassword() {
    const formData = {
      email: this.form.value.email,
    };
    this.dataService.forgotPassword(formData).subscribe((data) => {
      this.forgotResponse(data);
      this.closeModal();
    });
  }

  forgotResponse(data: any) {
    // this.Token.handle(data?.data?.token);
    this.router.navigateByUrl('/forgotPassword');
  }

  loginForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loginForm();
  }

  get f() {
    return this.form.controls;
  }

  reloadPage() {
    window.location.reload(), 2000;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();

    formData.append('email', this.form.value.email);
    formData.append('password', this.form.value.password);

    let params = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.dataService.login(params).subscribe((res) => {
      this.data = res;
      if (this.data.status === 400) {
        this.toastr.error('Unauthorized request found', 'Error!', {
          timeOut: 3000,
        });
        return;
      } else if (this.data.status === 401) {
        this.toastr.error('Invalid Email Or Password', 'Error!', {
          timeOut: 3000,
        });
        return;
      } else if (this.data.status === 409) {
        this.toastr.error('Invalid Email Or Password', 'Error!', {
          timeOut: 3000,
        });
        return;
      }

      this.token = this.data.data.token;
      this.type = this.data.data.type;
      localStorage.setItem('token', this.token);
      localStorage.setItem('tms_user', this.type);
      this.toastr.success(
        JSON.stringify(this.data.message),
        JSON.stringify(this.data.code),
        {
          timeOut: 2000,
          progressBar: true,
        }
      );
      this.router.navigate(['']);
      this.authService.login();
      // this.router.navigate(['/projects']);
      // if(this.data.status === 1){

      // this.toastr.success(JSON.stringify(this.data.message), JSON.stringify(this.data.code),{
      //   timeOut: 2000,
      //   progressBar: true
      // });
      // }else if (this.data.status === 0){
      //   this.toastr.error(JSON.stringify(this.data.message), JSON.stringify(this.data.code),{
      //     timeOut: 2000,
      //     progressBar: true
      //   });

      // }

      // }
    });
  }

}
