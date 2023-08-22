import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from '../service/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.scss'],
})
export class UserTaskComponent {
  date1: Date = new Date();
  TaskList: any;
  ts: any;
  searchText: any;
  modalRef?: BsModalRef;
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

  ngOnInit(): void {
    this.getMyTask();
  }

  getMyTask() {
    this.dataService.getUserTask().subscribe((data: any) => {
      this.TaskList = data.data.reverse();
      console.log(this.TaskList);
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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
    this.dataService.updateTask(this.taskUpdate).subscribe((res) => {
      this.data = res;
      this.modalService.hide();
            Swal.fire({
              icon: 'success',
              title: 'Task Updated!',
              text: 'Task has been successfully updated.',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
            });
    });
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
