import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Register } from '../models/register.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  submitted = false;
  data: any;
  DesignationList: any[] = [];
  DepartmentList: any[] = [];
  designation_id!: boolean;
  DesignationName!: string;
  files: any;
  register = new Register();

  constructor(private formBuilder: FormBuilder, private dataService: DataService,
    private toastr: ToastrService,private router: Router) { }

  createForm() {
    this.form = this.formBuilder.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [null, Validators.required],
      phone: [null, Validators.required],
      department_id: [null],
      designation_id: [null],
      type: [null, Validators.required],
      isActive: [null, Validators.required],
      image: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.createForm();
    this.dataService.designationList().subscribe((data: any) => {
      this.DesignationList = data.data;
      console.log(this.DesignationList);
    });
    this.dataService.departmentList().subscribe((data: any) => {
      this.DepartmentList = data.data;
      console.log(this.DepartmentList);
    });

  }

  uploadImage(event: any) {
    this.files = event.target.files[0];
    console.log(this.files);
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append("image", this.files, this.files.name);
    formData.append("first_name", this.form.value.first_name);
    formData.append("last_name", this.form.value.last_name);
    formData.append("email", this.form.value.email);
    formData.append("password", this.form.value.password);
    formData.append("address", this.form.value.address);
    formData.append("phone", this.form.value.phone);
    formData.append("department_id", this.form.value.department_id);
    formData.append("designation_id", this.form.value.designation_id);
    formData.append("type", this.form.value.type);
    formData.append("isActive", this.form.value.isActive);
    
    this.dataService.registerUser(formData).subscribe(res => {
      this.data = res;
       //console.log(res);
       
      if(this.data.status === 1){
        this.toastr.success(JSON.stringify(this.data.message),JSON.stringify(this.data.code),{
          timeOut: 2000,
          progressBar: true
        });
      }else{
        this.toastr.error(JSON.stringify(this.data.message),JSON.stringify(this.data.code),{
          timeOut: 2000,
          progressBar: true
        });
      }
      this.router.navigate(['/login']);
    });

  }

}
