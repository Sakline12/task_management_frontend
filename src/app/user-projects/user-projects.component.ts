import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from '../service/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.scss']
})
export class UserProjectsComponent implements OnInit {
  // selectedValue!: string;
  // selectedItems: any[] = [];

  date1 : Date = new Date();
  submitted = false;
  cell: any;
  row:any;
  data: any;
  ClientList: any[] = [];
  modalRef?: BsModalRef;
  token:any;
  ProjectList:any;
  emp:any;
  project: any;
  id: any;
  projectName: any;
  lastName: any;
  myform!: FormGroup;
  status:any;

  // selectedStatus: string = '';
  public form = {
    id:null,
    client_id: null, //[null,Validators.required]
    name: null,
    description: null,
    remarks: null,
    supervisor: null,
    end_date:null,
    start_date:null,
    status:null,
    user_id:null,
  };

  projectUpdate = {
    id:null,
    client_id: null, //[null,Validators.required]
    name: null,
    description: null,
    remarks: null,
    supervisor: null,
    end_date:null,
    start_date:null,
    status:null,
    user_id:null,
  }
  public error = null;
  closeModalEvent: any;
  //route: any;
  constructor(private modalService: BsModalService,  private dataService: DataService, private formBuilder: FormBuilder,
    private router: Router,private toastr:ToastrService,private route: ActivatedRoute,) {}
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
    this.getProject();
    this.dataService.clientList().subscribe((data: any) => {
      this.ClientList = data.data;
      //console.log(this.ClientList);
    });

    // this.dataService.projectList().subscribe((data: any) => {
    //   this.ProjectList = data.data;
    //   // console.log(this.ProjectList);
    // });
    // this.getProjects();
  //   const routeParams = this.route.snapshot.paramMap;
  //   this.id = Number(routeParams.get('project_id'));
  //   console.log(this.id);
  //   this.dataService.updateProject(this.id).subscribe(
  //   (res) => {
  //   this.project = res;
  // }
  // )

  }

  getProject(){
    this.dataService.userProjectList().subscribe((data: any) => {
      this.ProjectList = data.data.reverse();

      // console.log(this.ProjectList);

    });

  }
  //  getProjectList(){
  //   if (this.selectedStatus) {
  //     return this.emp.filter((emp: { status: string; }) => emp.status === this.selectedStatus);
  //   } else {
  //     return this.emp;
  //   }
  // }
  searchText = '';
  // getProjects(){
  //   this.dataService.projectList().subscribe( res =>{
  //     //console.log(res);
  //     this.projects = res;
  //   });
  // }
  deleteProject(id: any){
    Swal.fire({
      title:'are you sure',
      text: 'delete',
      icon: 'warning',
      showCancelButton:true,
      confirmButtonText:'yes',
      cancelButtonText:'no'
    }).then((result)=>{
      if(result.isConfirmed){
        this.dataService.deleteProject(id).subscribe(res=>{
          this.data = res;
          Swal.fire(
            'Deleted!',
            'user deleted',
            'success',
           )
           this.getProject()
        })

        }else if (result.dismiss === Swal.DismissReason.cancel){

          Swal.fire(
            'Canceled',
            'not deleted',
            'error'
          )
        }
    })
  }

  onSubmit(): void {
    this.dataService.projectCreate(this.form).subscribe( res=>{
      this.data = res;
      this.getProject();
      this.modalService.hide();
      this.myform.reset();

      this.toastr.success(JSON.stringify(this.data.message),JSON.stringify(this.data.code),{
        timeOut: 2000,
        progressBar: true
      });
    },err =>{
      console.log(err)

      this.toastr.error(err.error.message, err.error.message,{
        timeOut: 2000,
        progressBar: true
      });


    }
    );
      //data => this.handleResponse(data)



    // this.dataService.updateProject(this.form).subscribe(
    //   data => this.handleResponse(data)
    // );
    // this.dataService.updateProject(this.form).subscribe(
    //   data => this.handleResponse(data)
    //   );
  }


  handleError(error:any): void {
    this.error = error.error;
  }
  handleResponse(data:any) {
    console.log(data.data);
    // this.router.navigateByUrl('/projects');

  }
  edit(emp: {
      id: null; client_id: null; //[null,Validators.required]
      name: null; description: null; remarks: null; supervisor: null; end_date: null; start_date: null; status: null; user_id: null;
    }){
    this.projectUpdate = emp;
  }
  on_Submit() {
    // console.log(this.myform.value);
    this.dataService.updateProject(this.projectUpdate).subscribe(res=>{
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

    getStatusClass(status: string): string {
      switch (status) {
        case 'Initiate':
          return 'status-initiating'
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
