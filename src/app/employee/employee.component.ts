import { Component,OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from '../service/data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from '../models/register.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  modalRef?: BsModalRef;
  cform!: FormGroup;
  date1: Date = new Date();
  uploadform!: FormGroup;
  submitted = false;
  data: any;
  DesignationList: any[] = [];
  DepartmentList: any[] = [];
  designation_id!: boolean;
  DesignationName!: string;
  files: any;
  register = new Register();
  userList: any;
  use: any;
  image: any;
  first_name: any;
  formData: any;
  public error = null;
  userUpdate = {
    id: null,
    first_name: null,
    last_name: null,
    email: null,
    address: null,
    phone: null,
    department_id: null,
    designation_id: null,
    type: null,
    isActive: null,
    image: null,
  };
  constructor(
    private modalService: BsModalService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}
  createForm() {
    this.cform = this.formBuilder.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [null],
      phone: [null],
      department_id: [null],
      designation_id: [null],
      type: [null],
      isActive: [null],
      image: [null],
    });
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit(): void {
    this.getProject();
    this.createForm();
    this.dataService.designationList().subscribe((data: any) => {
      this.DesignationList = data.data;
      //console.log(this.DesignationList);
    });
    this.dataService.departmentList().subscribe((data: any) => {
      this.DepartmentList = data.data;
      //console.log(this.DepartmentList);
    });
    // this.dataService.userList().subscribe((data: any) => {
    //   this.userList = data.data;
    //   console.log(data);
    // });
    // this.form = new FormGroup({
    //   image: new FormControl(),
    //   phone: new FormControl(),
    //   email: new FormControl()
    // });
    this.uploadform = new FormGroup({
      first_name: new FormControl(),
      last_name: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      address: new FormControl(),
      department_id: new FormControl(),
      designation_id: new FormControl(),
      type: new FormControl(),
      isActive: new FormControl(),
    });
  }
  deleteUser(id: any) {
    Swal.fire({
      title: 'are you sure',
      text: 'delete',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'yes',
      cancelButtonText: 'no',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteUser(id).subscribe((res) => {
          this.data = res;
          Swal.fire('Deleted!', 'user deleted', 'success');
          this.getProject();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Canceled', 'not deleted', 'error');
      }
    });
  }

  getProject() {
    this.dataService.userList().subscribe((data: any) => {
      this.userList = data.data.reverse();
      console.log(this.userList);
    });
  }
  searchText = '';
  uploadImage(event: any) {
    this.files = event.target.files[0];
    console.log(this.files);
  }

  get f() {
    return this.cform.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.cform.invalid) {
      return;
    }
    console.log(this.cform.value.first_name);
    const formData = new FormData();
    formData.append('image', this.files, this.files.name);
    formData.append('first_name', this.cform.value.first_name);
    formData.append('last_name', this.cform.value.last_name);
    formData.append('email', this.cform.value.email);
    formData.append('password', this.cform.value.password);
    formData.append('address', this.cform.value.address);
    formData.append('phone', this.cform.value.phone);
    formData.append('department_id', this.cform.value.department_id);
    formData.append('designation_id', this.cform.value.designation_id);
    formData.append('type', this.cform.value.type);
    formData.append('isActive', this.cform.value.isActive);
    this.dataService.addUser(formData).subscribe(
      (res) => {
        this.data = res;
        this.getProject();
        this.modalService.hide();
        this.cform.reset();
        this.toastr.success(
          JSON.stringify(this.data.message),
          JSON.stringify(this.data.code),
          {
            timeOut: 2000,
            progressBar: true,
          }
        );
      },
      (err) => {
        console.log(err);

        if (err.status && err.error.message) {
          this.toastr.error(
            JSON.stringify(err.error.message),
            JSON.stringify(err.status),
            {
              timeOut: 2000,
              progressBar: false,
            }
          );
        } else {
          this.toastr.error('An error occurred', 'Error', {
            timeOut: 2000,
            progressBar: false,
          });
        }
      }
    );
  }

  edit(use: {
    id: null;
    first_name: null;
    last_name: null;
    email: null;
    address: null;
    phone: null;
    department_id: null;
    designation_id: null;
    type: null;
    isActive: null;
    image: null;
  }) {
    this.userUpdate = use;
  }
  on_Submit() {
    this.dataService.updateUser(this.userUpdate).subscribe((res) => {
      this.data = res;
      this.modalService.hide();
      this.getProject();
            Swal.fire({
              icon: 'success',
              title: 'User Updated!',
              text: 'The user has been successfully updated.',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
            });
    });
  }
}
