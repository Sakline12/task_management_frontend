import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from '../service/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  date1: Date = new Date();

  public form = {
    project_id: null,
    name: null,
    description: null,
    end_date: null,
  };
  public error = null;
  modalRef?: BsModalRef;
  ProjectList: any;
  chosenObj: any;
  TaskList: any;
  ts: any;
  data: any;

  taskUpdate = {
    user_id: null,
    project_id: null, //[null,Validators.required]
    name: null,
    description: null,

    end_date: null,
    start_date: null,
    status: null,
  };

  constructor(
    private modalService: BsModalService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit(): void {
    this.getTask();
    this.dataService.projectList().subscribe((data: any) => {
      this.ProjectList = data.data;
      //console.log(data);
      this.getTask();
    });
  }

  getTask() {
    this.dataService.taskLists().subscribe((data: any) => {
      this.TaskList = data.data.reverse();
      console.log(data);
    });
  }
  searchText = '';

  deleteTask(id: any) {
    Swal.fire({
      title: 'are you sure',
      text: 'delete',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'yes',
      cancelButtonText: 'no',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteTask(id).subscribe((res) => {
          this.data = res;
          Swal.fire('Deleted!', 'user deleted', 'success');
          this.getTask();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Canceled', 'not deleted', 'error');
      }
    });
  }

  onSubmit(): void {
    //console.log(this.form);
    this.dataService.createTask(this.form).subscribe(
      (res) => {
        this.data = res;
        this.getTask();
        this.modalService.hide();
        this.toastr.success(
          JSON.stringify(this.data.message),
          JSON.stringify(this.data.code),
          {
            timeOut: 2000,
            progressBar: true,
          }
        );
        this.resetForm();
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
          this.toastr.error('Task already exists', 'Error', {
            timeOut: 2000,
            progressBar: false,
          });
        }
      }
    );
  }

  edit(ts: {
    user_id: null;
    project_id: null; //[null,Validators.required]
    name: null;
    description: null;

    end_date: null;
    start_date: null;
    status: null;
  }) {
    this.taskUpdate = ts;
  }
  on_Submit() {
    // console.log(this.myform.value);
    this.dataService.updateTask(this.taskUpdate).subscribe((res) => {
      this.data = res;
      this.modalService.hide();
      Swal.fire({
        icon: 'success',
        title: 'Task Updated!',
        text: 'This task has been successfully updated.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    });
  }

  resetForm(): void {
    this.form = {
      project_id: null,
      name: null,
      description: null,
      end_date: null,
    };
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Initiate':
        return 'status-initiating';
      case 'Pending':
        return 'status-pending';
      case 'Onhold':
        return 'status-onhold';
      case 'Completed':
        return 'green';
      default:
        return '';
    }
  }
}
