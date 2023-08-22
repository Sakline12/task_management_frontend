import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from '../service/data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  myform!: FormGroup;
  submitted = false;
  data: any;
  DesignationList: any[] = [];
  DepartmentList: any[] = [];
  designation_id!: boolean;
  DesignationName!: string;
  files: any;
  first_name: any;
  department_id: any;
  user: any;
  last_name: any;
  address: any;
  email: any;
  phone: any;
  image: any;
  imageFile: any;
  public error = null;

  constructor(
    private modalService: BsModalService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.designationList().subscribe((data: any) => {
      this.DesignationList = data.data;
    });
    this.dataService.departmentList().subscribe((data: any) => {
      this.DepartmentList = data.data;
    });

    this.myform = new FormGroup({
      first_name: new FormControl(),
      last_name: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      address: new FormControl(),
      department_id: new FormControl(),
      designation_id: new FormControl(),
      type: new FormControl(),
      isActive: new FormControl(),
      image: new FormControl(),
      file: new FormControl(),
    });

    this.getProfile();
  }

  on_Submit() {
    const formData = new FormData();
    if (this.files != null) {
      formData.append('first_name', this.user.data[0].first_name);
      formData.append('last_name', this.user.data[0].last_name);
      formData.append('email', this.user.data[0].email);
      formData.append('phone', this.user.data[0].phone);
      formData.append('department_id', this.user.data[0].department_id);
      formData.append('designation_id', this.user.data[0].designation_id);
      formData.append('address', this.user.data[0].address);
      formData.append('type', this.user.data[0].type);
      formData.append('isActive', this.user.data[0].isActive);
      formData.append('image', this.files, this.files.name);
    } else {
      formData.append('first_name', this.user.data[0].first_name);
      formData.append('last_name', this.user.data[0].last_name);
      formData.append('email', this.user.data[0].email);
      formData.append('phone', this.user.data[0].phone);
      formData.append('department_id', this.user.data[0].department_id);
      formData.append('designation_id', this.user.data[0].designation_id);
      formData.append('address', this.user.data[0].address);
      formData.append('type', this.user.data[0].type);
      formData.append('isActive', this.user.data[0].isActive);
    }
    console.log(formData);
    // this.dataService.updateProfile(this.myform.value).subscribe((res) => {
    this.dataService
      .updateProfile(this.files != null ? formData : this.myform.value)
      .subscribe((res) => {
        this.data = res;
        this.getProfile();
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been successfully updated.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });

                    window.location.reload();

      });
  }

  getProfile() {
    this.dataService.getProfile().subscribe((res: any) => {
      this.user = res;

      this.myform.patchValue({
        first_name: this.user.data[0].first_name,
        last_name: this.user.data[0].last_name,
        email: this.user.data[0].email,
        phone: this.user.data[0].phone,
        department_id: this.user.data[0].department_id,
        designation_id: this.user.data[0].designation_id,
        address: this.user.data[0].address,
        type: this.user.data[0].type,
        isActive: this.user.data[0].isActive,
        image: this.imageFile,
      });
      this.image = this.user.data[0].image;
    });
  }

  imageUpload(event: any) {
    // console.log('logs: ', event.target.files);
    this.files = event.target.files[0];
    console.log(this.files);
    const formData = new FormData();
    // formData.append('file', this.files, this.files.name);
    this.imageFile = formData.append('image', this.files, this.files.name);
  }
}
