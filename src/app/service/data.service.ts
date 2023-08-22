import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  httpClient: any;
  token: any;
  expiretoken: any;
  RegisterUser = new BehaviorSubject(null);

  isAuthincate: boolean = false;
  public currentUserDetails: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private http: HttpClient) {
    if (Cookie.check('.BBTMS.Cookie'))
      this.currentUserDetails = new BehaviorSubject<any>(
        JSON.parse(Cookie.get('.BBTMS.Cookie'))
      );
  }

  public get currentUserValue(): any {
    return Cookie.check('.BBTMS.Cookie') ? this.currentUserDetails.value : null;
  }

  public isAuthenticated(): boolean {
    return Cookie.check('.BBTMS.Cookie');
  }

  registerUser(data: any) {
    const headers = new HttpHeaders();
    return this.http.post(environment.apiUrl + '/api/register', data, {
      headers: headers,
    });
  }

  login(params: any) {
    return this.http.post<any>(environment.apiUrl + '/api/login', params).pipe(
      map((data) => {
        if (data.status) {
          let response = data.data;
          const user = {
            email: params.email,
            phone: response.phone,
            designation: response.designation,
            department: response.department,
            address: response.address,
            full_name: response.first_name + ' ' + response.last_name,
            type: response.type,
            token: response.token,
            image: response.image,
            expiretoken: response.expiretoken,
          };
          // let expireDate = new Date('2030-07-19');
          Cookie.set(
            '.BBTMS.Cookie',
            JSON.stringify(user),
            this.expiretoken,
            '/',
            window.location.hostname,
            false
          );
          this.currentUserDetails.next(user);

          return data;
        } else {
          return data;
        }
      }),
      catchError((err) => {
        return of(err);
      })
    );

    //return this.http.post(environment.apiUrl + '/api/login', data);
  }

  designationList() {
    return this.http.get(environment.apiUrl + '/api/list-designation');
  }

  departmentList() {
    return this.http.get(environment.apiUrl + '/api/list-department');
  }

  projectCreate(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(environment.apiUrl + '/api/create-project', data, {
      headers: headers,
    });
  }

  clientList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.get(environment.apiUrl + '/api/list-clients', {
      headers: headers,
    });
  }
  projectList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/list-projects', {
      headers: headers,
    });
  }
  deleteProject(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(environment.apiUrl + '/api/delete-project/' + id, {
      headers: headers,
    });
  }
  updateProject(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(environment.apiUrl + '/api/update-project', data, {
      headers: headers,
    });
  }
  addUser(data: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.post(environment.apiUrl + '/api/user-create', data, {
      headers: headers,
    });
  }
  userList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/user-list', {
      headers: headers,
    });
  }
  deleteUser(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(environment.apiUrl + `/api/user-delete/` + id, {
      headers: headers,
    });
  }
  //project details page

  detailsProject(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    // return this.http.get(environment.apiUrl+'/api/project_with_projectAssign_and_user',data,{
    //   headers: headers
    // });
    return this.http.get(
      environment.apiUrl + `/api/project-with-taskassign-and-user/` + id,
      {
        headers: headers,
      }
    );
  }
  projectAssigned(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(environment.apiUrl + '/api/assigned-project', data, {
      headers: headers,
    });
  }
  createTask(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(environment.apiUrl + '/api/create-task', data, {
      headers: headers,
    });
  }
  taskList(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(
      environment.apiUrl + '/api/task-for-specific-project/' + id,
      {
        headers: headers,
      }
    );
  }
  uploadFile(id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/create-file/' + id, {
      headers: headers,
    });
  }

  //Task Details
  taskLists() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/list-tasks', {
      headers: headers,
    });
  }
  deleteTask(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(environment.apiUrl + '/api/delete-task/' + id, {
      headers: headers,
    });
  }
  updateTask(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(environment.apiUrl + '/api/update-task', data, {
      headers: headers,
    });
  }
  task_details(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    // return this.http.get(environment.apiUrl+'/api/project_with_projectAssign_and_user',data,{
    //   headers: headers
    // });
    return this.http.get(
      environment.apiUrl + `/api/task-with-taskassign-and-user/` + id,
      {
        headers: headers,
      }
    );
  }
  task_for_images(task_id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.get(
      environment.apiUrl + `/api/images-for-task/` + task_id,
      {
        headers: headers,
      }
    );
  }
  task_for_comments(task_id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.get(
      environment.apiUrl + `/api/comments-for-task/` + task_id,
      {
        headers: headers,
      }
    );
  }
  assign_task(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.post(environment.apiUrl + `/api/assigned-task`, data, {
      headers: headers,
    });
  }

  create_a_comment(data: any) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.post(environment.apiUrl + `/api/create-comment`, data, {
      headers: headers,
    });
  }
  upload_a_image(data: any) {
    const headers = new HttpHeaders({
      // 'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.post(environment.apiUrl + `/api/create-file`, data, {
      headers: headers,
    });
  }
  delete_a_comment(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.delete(environment.apiUrl + `/api/delete-comment/` + id, {
      headers: headers,
    });
  }
  delete_a_file(file_id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.delete(
      environment.apiUrl + `/api/delete-file/` + file_id,
      {
        headers: headers,
      }
    );
  }
  updateUser(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(environment.apiUrl + '/api/User-update', data, {
      headers: headers,
    });
  }
  updateProfile(data: any) {
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(environment.apiUrl + '/api/profile-update', data, {
      headers: headers,
    });
  }
  getProfile() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/profile', {
      headers: headers,
    });
  }

  logOut(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(environment.apiUrl + '/api/logout', data, {
      headers: headers,
    });
  }
  //DashBoard
  taskCount() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/count-task', {
      headers: headers,
    });
  }
  todaysTask() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/today-task', {
      headers: headers,
    });
  }
  allProjects() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/calculate-task', {
      headers: headers,
    });
  }

  create_a_event(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(environment.apiUrl + '/api/event-create', data, {
      headers: headers,
    });
  }

  eventList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/list-of-event', {
      headers: headers,
    });
  }
  deleteEvent(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.delete(environment.apiUrl + `/api/event-delete/` + id, {
      headers: headers,
    });
  }

  forgotPassword(data: any) {
    return this.http.post(
      environment.apiUrl + '/api/password/forgot-password',
      data
    );
  }

  resetPassword(data: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${localStorage.getItem('token')}`,
    // });

    return this.http.post(environment.apiUrl + `/api/password/reset`, data);
  }

  getUserTask() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/user-tasks', {
      headers: headers,
    });
  }

  userProjectList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(environment.apiUrl + '/api/assigned-my-project', {
      headers: headers,
    });
  }

  taskLinechart(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.get(environment.apiUrl + `/api/task-line-chart/` + id, {
      headers: headers,
    });
  }

  projectLinechart(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.get(environment.apiUrl + `/api/project-line-chart/` + id, {
      headers: headers,
    });
  }
}
