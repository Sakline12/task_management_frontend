import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotpasswordComponent {
  form: FormGroup;

  constructor(
    private dataService: DataService,
    private router: Router,
    private Token: TokenService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.dataService.resetPassword(this.form.value).subscribe(
      (res) => {
        console.log('Done');
        this.router.navigate(['/login']);
      }
      // data => this.handleResponse(data)

      // error => this.handleError(error)
    );
  }
}
