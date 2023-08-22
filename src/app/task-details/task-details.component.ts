import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit {
  loading: boolean = false;
  sending: boolean = false;
  public form: any;
  task: any;
  id: any;
  file_id: any;
  drpUserList!: FormGroup;
  myform!: FormGroup;
  myformContent!: FormGroup;
  endDate: any;
  created_by: any;
  status: any;
  description: any;
  assign_ids: any[] = [];
  last_name: any;
  first_name: any;
  modalRef?: BsModalRef;
  UserList: any[] = [];
  TaskList: any;
  ts: any;
  data: any;
  user_ids: any[] = [];

  CheckIds = null;
  comment_box = null;
  commentform!: FormGroup;
  commentList: any;
  fileExtension: any;
  uploadform!: FormGroup;
  files: any;
  file: any;
  taskttachment: any;
  imageList: any;
  name: any;
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  type: any;
  chartOptions: any;

  iconList = [
    // array of icon class list based on type
    { type: 'xlsx', icon: 'fa fa-file-excel-o' },
    { type: 'pdf', icon: 'fa fa-file-pdf-o' },
    { type: 'jpg', icon: 'fa fa-file-image-o' },
  ];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    defaultOpen: true,
    idField: 'id',
    textField: 'text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableCheckAll: true,
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private formbuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  createForm() {
    this.form = this.formbuilder.group({
      file: [null],
      task_id: [null],
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
    this.createForm();
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('tdetails_id'));

    console.log(this.id);

    this.form = {
      user_ids: this.assign_ids,
      date: this.validateDateTimeFormat(new Date()),
      task_id: this.id,
    };

    this.commentform = new FormGroup({
      task_id: new FormControl(this.id),
      // user_ids: new FormControl(this.assign_ids),
      comment_box: new FormControl(),
      date: new FormControl(this.validateDateTimeFormat(new Date())),
    });

    this.uploadform = new FormGroup({
      file: new FormControl(),
    });

    this.dataService.userList().subscribe((data: any) => {
      this.UserList = data.data.map((val: any) => {
        return {
          id: val.id,
          text: val.last_name,
          imageUrl: 'http://localhost:8000/profile/' + val.image,
        };
      });
      console.log(this.UserList);
    });

    this.get_taskDetails();
    this.get_image();
    this.get_commentList();
    this.canActivate();
    this.generateChart();
  }

  get_taskDetails() {
    this.dataService.task_details(this.id).subscribe((res: any) => {
      this.task = res;
      console.log(this.task);
      this.name = this.task.data.name;
      this.endDate = this.task.data.end_date;
      this.created_by = this.task.data.user.name;
      this.status = this.task.data.status;
      this.description = this.task.data.description;
      this.assign_ids = this.task.data.task_assign.map(
        (assign: any) => assign.user
      );
      this.last_name = this.task.data.user.last_name;
      this.first_name = this.task.data.user.first_name;

      this.myform = new FormGroup({
        end_date: new FormControl(this.task.data.end_date),
        created_by: new FormControl(this.task.data.created_by),
      });
    });
  }

  get_image() {
    this.dataService.task_for_images(this.id).subscribe(
      (data: any) => {
        this.imageList = data.data.reverse();
        console.log(data);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  get_commentList() {
    this.dataService.task_for_comments(this.id).subscribe((data: any) => {
      this.commentList = data.data.reverse();
      console.log(data);
    });
  }

  onSubmit(): void {
    console.log(this.CheckIds);
    this.form.user_ids = this.CheckIds;
    console.log(this.form);
    this.dataService.assign_task(this.form).subscribe(
      (res) => {
        this.data = res;
        this.get_taskDetails();
        this.modalService.hide();
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
          this.toastr.error('Please select one or more', 'Error', {
            timeOut: 2000,
            progressBar: false,
          });
        }
      }
    );
  }

  validateDateTimeFormat(value: Date) {
    return moment(value).format('YYYY-MM-DD');
  }

  create_comment(): void {
    this.sending = true;

    console.log(this.commentform.getRawValue());
    this.dataService.create_a_comment(this.commentform.getRawValue()).subscribe(
      (res) => {
        this.data = res;
        this.get_commentList();
        this.commentform.get('comment_box')?.setValue('');
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

    setTimeout(() => {
      this.sending = false;
    }, 2000);
  }

  create_file(): void {
    this.loading = true;

    const formData = new FormData();
    formData.append('file', this.files, this.files.name);
    formData.append('task_id', this.id);

    // console.log(this.uploadform.getRawValue());
    this.dataService.upload_a_image(formData).subscribe((res) => {
      this.data = res;
      console.log(this.data);
      this.get_image();
      this.uploadform.reset();
      this.toastr.success(
        JSON.stringify(this.data.message),
        JSON.stringify(this.data.code),
        {
          timeOut: 2000,
          progressBar: true,
        }
      );
    });

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  imageUpload(event: any) {
    // console.log('logs: ', event.target.files);
    this.files = event.target.files[0];
    console.log(this.files);
  }

  openImageWindow(imageUrl: string) {
    window.open(imageUrl, '_blank', 'height=600,width=800');
  }

  delete_a_comment(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.delete_a_comment(id).subscribe((res) => {
          this.data = res;
          Swal.fire('Deleted!', 'Comment Deleted', 'success');
          this.get_commentList();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Canceled', 'Not deleted', 'error');
      }
    });
  }

  delete_a_file(file_id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.delete_a_file(file_id).subscribe((res) => {
          this.data = res;
          Swal.fire('Deleted!', 'Image deleted', 'success');
          this.get_image();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Canceled', 'Not deleted', 'error');
      }
    });
  }

  canActivate() {
    this.type = localStorage.getItem('tms_user');
    console.log(this.type);
    return true;
  }

  generateChart() {
    this.chartOptions = {
      animationEnabled: true,
      theme: 'light2',
      title: {
        text: 'Weekly Task Data!',
      },
      axisX: {
        title: 'Weeks',
        labelFormatter: function (e: { value: number }) {
          if (e.value === 7) {
            return 'Week1';
          } else if (e.value === 14) {
            return 'Week2';
          } else if (e.value === 21) {
            return 'Week3';
          } else if (e.value === 28) {
            return 'Week4';
          } else if (e.value === 35) {
            return 'Week5';
          } else if (e.value === 42) {
            return 'Week6';
          } else if (e.value === 49) {
            return 'Week7';
          } else {
            return '';
          }
        },
        minimum: 7,
        maximum: 50,
        interval: 7,
        tickColor: '#A52A2A',
        lineColor: '#A52A2A',
      },
      axisY: {
        title: 'Status',
        labelFormatter: function (e: { value: number }) {
          switch (e.value) {
            case 0:
              return 'Initiate';
            case 1:
              return 'Ongoing';
            case 2:
              return 'Onhold';
            case 3:
              return 'Pending';
            case 4:
              return 'Finished';
            default:
              return '';
          }
        },
        minimum: 0,
        maximum: 4,
        interval: 1,
        tickColor: '#FF00FF',
        lineColor: '#FF00FF',
      },
      data: [
        {
          type: 'line',
          dataPoints: [],
          markerSize: 8,
          markerColor: '#000000',
          lineColor: '#ADD8E6',
        },
      ],
    };

    this.dataService.taskLinechart(this.id).subscribe(
      (data: any) => {
        console.log(data.task.status);
        console.log(data.duration_weeks);

        const week = data.duration_weeks;
        const status = this.getStatusValue(data.task.status);

        this.chartOptions.data[0].dataPoints.push(
          { x: 7, y: 0 },
          { x: week, y: status }
        );

        this.renderChart();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getStatusValue(status: string): number {
    switch (status) {
      case 'Initiate':
        return 0;
      case 'Ongoing':
        return 1;
      case 'Onhold':
        return 2;
      case 'Pending':
        return 3;
      case 'Finished':
        return 4;
      default:
        return 0;
    }
  }

  renderChart() {
    let chart = new CanvasJS.Chart('chartContainer', this.chartOptions);
    chart.render();
  }
}
