import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../service/data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  token: any;
  userData: any;
  model!: NgbDateStruct;
  date!: { year: number; month: number };
  name: any;
  width: any;
  total_task: any;
  complete_task: any;
  incompleted_task: any;
  overdue_task: any;
  TaskList: any;
  end_date: any;
  pdetails_id: any;
  projectDetails: any;
  ProjectCount: any;
  project: any;
  emp: any;
  countTask: any;
  task: any;
  type: any;
  // name: any;
  // modalRef?: BsModalRef;
  data: any;
  eventList: any;
  ts: any;
  description: any;
  modalRef?: BsModalRef;
  id: any;
  public form = {
    event_name: null,
    start: null,
    end: null,
    status: null,
  };
  // route: any;

  selectToday() {
    this.model = this.calendar.getToday();
  }
  constructor(
    private calendar: NgbCalendar,
    private dataService: DataService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // const routeParams = this.route.snapshot.paramMap;
    // this.id = Number(routeParams.get('pdetails_id'));
    //   const id = this.route.snapshot.params['pdetails_id'];
    // // Using params observable approach
    // this.route.params.subscribe(params => {
    //   const id = params['pdetails_id'];
    // });

    this.width = 25;
    this.token = localStorage.getItem('token');
    // console.log(this.token);
    this.count_task();
    this.today_task();
    this.all_projects();
    this.get_event();
    this.canActivate();
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.refreshPage();
      }
    });
  }
  // navigateToProject(id: number) {
  //   this.router.navigate(['/projectDetails', id]);
  //   // console.log(this.id);
  // }
  count_task() {
    this.dataService.taskCount().subscribe((res: any) => {
      this.task = res.data;
      console.log(this.task);
      this.total_task = this.task['Total task'];
      this.complete_task = this.task['Complete task'];
      this.incompleted_task = this.task['In-completed task'];
      this.overdue_task = this.task['Overdue task'];
    });
  }
  today_task() {
    this.dataService.todaysTask().subscribe((data: any) => {
      this.TaskList = data.data;
    });
  }
  all_projects() {
    this.dataService.allProjects().subscribe((res: any) => {
      this.ProjectCount = res.data.reverse();
      console.log(this.ProjectCount);
      this.name = this.ProjectCount['name'];
    });
  }
  getProgressColor(percentage: number): string {
    const startColor = '255, 0, 0'; // Starting color (red)
    const red = Math.round((100 - percentage) * (255 / 100)).toString();
    const green = Math.round(percentage * (255 / 100)).toString();
    return `background: linear-gradient(to right, rgba(${startColor}, 0.75), rgba(${red}, ${green}, 0, 0.75))`;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  onSubmit() {
    console.log(this.form);
    this.dataService.create_a_event(this.form).subscribe(
      (res) => {
        this.data = res;
        // this.getTask();
        // this.resetForm();
        this.modalService.hide();
        this.get_event();
        this.resetForm();
        this.toastr.success(
          JSON.stringify(this.data.message),
          JSON.stringify(this.data.code),
          {
            timeOut: 2000,
            progressBar: true,
          }
        );
        // Add this line to reset the form fields
      }
      // (error) => {
      //   this.handleError(error);
      //   // this.resetForm(); // Add this line to reset the form fields in case of error
      // }
    );
  }
  get_event() {
    this.dataService.eventList().subscribe((data: any) => {
      this.eventList = data.data.reverse();
      console.log(data);
    });
  }

  formatTime(time: string): string {
    const [hoursStr, minutes] = time.split(':');
    let hours = Number(hoursStr);
    let period = 'AM';

    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    }

    return `${hours}:${minutes}${period}`;
  }
  delete_a_event(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteEvent(id).subscribe((res) => {
          this.data = res;
          this.get_event();
          Swal.fire('Deleted!', 'Comment Deleted', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Canceled', 'Not deleted', 'error');
      }
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
      case 'Online':
        return 'status-online';
      case 'Offline':
        return 'status-offline';
      default:
        return '';
    }
  }

  refreshPage() {
    // Reload the current route to refresh the page
    location.reload();
  }

  canActivate() {
    this.type = localStorage.getItem('tms_user');
    console.log(this.type);
    return true;
  }

  resetForm(): void {
    this.form = {
      event_name: null,
      start: null,
      end: null,
      status: null,
    };
  }
}
