import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthguardGuard } from './authguard.guard';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { UserTaskComponent } from './user-task/user-task.component';
import { RoleGuard } from './guard.guard';
import { UserProjectsComponent } from './user-projects/user-projects.component';
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthguardGuard],
    // data: {
    //   expectedRole: ['Employee', 'Admin'],
    // },
  }, //canActivate: [AuthguardGuard]
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthguardGuard, RoleGuard],
    data: {
      expectedRole: 'Admin',
    },
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [AuthguardGuard, RoleGuard],
    data: {
      expectedRole: 'Admin',
    },
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [AuthguardGuard, RoleGuard],
    data: {
      expectedRole: 'Admin',
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthguardGuard],
  },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthguardGuard] },
  {
    path: 'projectEdit/:project_id',
    component: ProjectEditComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'projectDetails/:pdetails_id',
    component: ProjectDetailsComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'taskDetails/:tdetails_id',
    component: TaskDetailsComponent,
    canActivate: [AuthguardGuard],
    // data: {
    //   expectedRole: 'Admin',
    // },
  },
  {
    path: 'forgotPassword',
    component: ForgotpasswordComponent,
  },
  {
    path: 'task',
    component: UserTaskComponent,
    canActivate: [AuthguardGuard, RoleGuard],
    data: {
      expectedRole: 'Employee',
    },
  },
  {
    path: 'userProjects',
    component: UserProjectsComponent,
    canActivate: [AuthguardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
