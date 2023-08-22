import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CanvasJS } from '@canvasjs/angular-charts';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  id: any;
  data: any;
  task: any;
  project: any;
  TaskList: any;
  modalRef?: BsModalRef;
  error: any;
  submitted = false;
  endDate: any;
  created_by: any;
  supervisor: any;
  status: any;
  emp: any;
  name: any;
  client_id: any;
  description: any;
  remarks: any;
  assign_ids: any[] = [];
  last_name: any;
  first_name: any;
  myform!: FormGroup;
  myformContent!: FormGroup;
  CheckIds = null;
  type: any;
  public form: any;
  public userList: any[] = [];
  chartOptions: any;
  onItemSelect: any;
  tt: any;
  chartContainer: any;
  item: any;
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
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit(): void {
    this.getTask();
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('pdetails_id'));
    // console.log(this.id);
    this.form = {
      user_ids: this.assign_ids,
      date: this.validateDateTimeFormat(new Date()),
      project_id: this.id,
    };

    this.dataService.userList().subscribe((data: any) => {
      this.userList = data.data.map((val: any) => {
        return {
          id: val.id,
          text: val.last_name,
          imageUrl: 'http://localhost:8000/profile/' + val.image,
        };
      });
      // console.log(this.userList);
    });
    this.getTaskList();
    this.canActivate();
    this.generateChart();
  }
  getTaskList() {
    this.dataService.taskList(this.id).subscribe((data: any) => {
      this.TaskList = data.data.task.reverse();
      console.log(this.TaskList);
      this.getTask();
    });
  }

  getTask() {
    this.dataService.detailsProject(this.id).subscribe((data: any) => {
      if (data && data.data) {
        this.project = data;
        console.log(this.project);
        this.client_id = this.client_id;
        this.name = this.project.data.name;
        this.endDate = this.project.data.end_date;
        this.supervisor = this.project.data.supervisor;
        this.remarks = this.project.data.remarks;
        this.client_id = this.project.data.client_id;
        this.created_by = this.project.data.user.name;
        this.status = this.project.data.status;
        this.description = this.project.data.description;
        this.assign_ids = this.project.data.project_assign.map(
          (assign: any) => assign.user
        );
        this.last_name = this.project.data.user.last_name;
        this.first_name = this.project.data.user.first_name;
        this.myformContent = new FormGroup({
          end_date: new FormControl(this.project.data.end_date),
          created_by: new FormControl(this.project.data.created_by),
        });
      }
    });
  }
  onSubmit(): void {
    console.log(this.CheckIds);
    this.form.user_ids = this.CheckIds;
    console.log(this.form);
    this.dataService.projectAssigned(this.form).subscribe(
      (res) => {
        this.data = res;
        this.modalService.hide();
        this.getTask();
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
  on_Submit(): void {
    this.dataService.createTask(this.form).subscribe(
      (res) => {
        this.data = res;
        this.getTaskList();
        this.modalService.hide();

        this.toastr.success(
          JSON.stringify(this.data.message),
          JSON.stringify(this.data.code),
          {
            timeOut: 2000,
            progressBar: true,
          }
        );
        this.form.name = null;
        this.form.description = null;
        this.form.end_date = null;
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
          this.toastr.error('Task already created', 'Error', {
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
        title: 'Tasks',
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
        interval: 1,
        tickColor: '#FFE6E8',
        lineColor: '#C19A6B',
        // background: '#800000',
      },
      axisY: {
        title: 'Status',
        labelFormatter: function (e: { value: number }) {
          if (e.value === 0) {
            return 'Initiate';
          } else if (e.value === 1) {
            return 'Ongoing';
          } else if (e.value === 2) {
            return 'Onhold';
          } else if (e.value === 3) {
            return 'Pending';
          } else if (e.value === 4) {
            return 'Finished';
          } else {
            return '';
          }
        },
        minimum: 0,
        maximum: 4,
        interval: 1,
        tickColor: '#800000',
        lineColor: '#033E3E',
      },
      data: [
        {
          type: 'line',
          dataPoints: [],
          markerColor: '#2C3539',
          lineColor: '#8A9A5B',
        },
      ],
    };

    this.dataService.projectLinechart(this.id).subscribe(
      (data: any) => {
        this.tt = data.data.map((item: any) => ({
          status: item.task.status,
          name:item.task.name,
          duration_weeks: item.task.duration_weeks,
        }));
        console.log(this.tt);

        this.tt.forEach((item: any) => {
          const week = item.duration_weeks;
          const name = item.name;
          const status = this.getStatusValue(item.status);
          console.log(week);
          console.log(status);
          console.log(name);
          this.chartOptions.data[0].dataPoints.push(
            { x: week, y: status }
          );
        });


        // const status = this.getStatusValue(data.task.status);

        // console.log(data.duration_weeks);

        // const week = data.duration_weeks;
        // const status = this.getStatusValue(data.task.status);

        // this.chartOptions.data[0].dataPoints.push(
        //   { x: 7, y: 0 },
        //   { x: week, y: status }
        // );

        this.renderChart();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  renderChart() {
    let chart = new CanvasJS.Chart('chartContainer', this.chartOptions);
    chart.render();
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
}
