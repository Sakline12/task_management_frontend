import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent {

  project: any;
  id: any;
  projectName: any;
  lastName: any;
  myform!: FormGroup;
  submitted = false;
  data: any;
  ClientList: any[] = [];
  
  public form = {
    id:null,
    client_id: null, //[null,Validators.required]
    user_id:null,
    name: null,
    description: null,
    status:null,
    remarks: null,
    supervisor: null,
    start_date:null,
    end_date:null
  };
  public error = null;
  


  constructor(private route: ActivatedRoute,private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('project_id'));
    console.log(this.id);
    this.dataService.updateProject(this.id).subscribe(
    (res) => {
    this.project = res;
  }
  )
    // this.projectName = this.project.project.name;
    //     this.lastName = this.task.user.last_name;
    // this.myform = new FormGroup({
    //       // id: new FormControl(this.project.id),
    //       // client: new FormControl(this.project.client),
    //       // user_id: new FormControl(this.project.user_id),
    //       // name: new FormControl(this.project.name),
    //       // description: new FormControl(this.project.description),
    //       // status: new FormControl(this.project.status),
    //       // supervisor: new FormControl(this.project.supervisor),
    //       // remarks: new FormControl(this.project.remarks),
    //       // start_date: new FormControl(this.project.start_date),
    //       // end_date: new FormControl(this.project.end_date)
    //     });
     
    this.dataService.clientList().subscribe((data: any) => {
      this.ClientList = data.data;
      console.log(this.ClientList);
    });
  }

  onSubmit() {
    // console.log(this.myform.value);
    this.dataService.updateProject(this.form).subscribe(
      data => this.handleResponse(data)
      );
      // (project) => {
      // //   console.log('data update successfully');
      // //   this.router.navigateByUrl('/projects');
      // // }

    
  }
  handleError(error:any): void {
    this.error = error.error;
  }
  handleResponse(data:any) {
    console.log(data.data);
    this.router.navigateByUrl('/projects');
  }
}
