import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private http: HttpClient) { }

  get(url?: any, obj?: any) {
    let params = new HttpParams();
    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params = params.append(key, obj[key]);
        }
      }
    }

  return this.http.get<any>(environment.apiUrl + url, { params }).pipe(
      map(res => {
        return res;
      })
    );
  }

  post(url?: any, params?: any) {
    return this.http.post<any>(environment.apiUrl + url, params).pipe(
      map(res => {
        return res;
      })
    );
  }

  put(url?: any, params?: any) {
    return this.http.put<any>(environment.apiUrl + url, params).pipe(
      map(res => {
        return res;
      })
    );
  }

  delete(url?: any){
    return this.http.delete(environment.apiUrl + url).pipe(
      map(res => {
        return res;
      })
    );
  }

  // postMultipart(url?: any, params?: any) {
  //   return this.http.post<any>(environment.apiUrl + url, params, {headers: {'Content-Type': undefined }}).pipe(
  //     map(res => {
  //       return res;
  //     })
  //   );
  // }


  generateUrl(url?: any): string {
    return environment.apiUrl + url;
  }


  downloadFile(url: string, obj?: any): any {
    let params = new HttpParams();

    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params = params.append(key, obj[key]);
        }
      }
    }
    return this.http.get(environment.apiUrl + url, { responseType: 'blob', params })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }


  downloadMaterialFile(url: string): any {
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }

  external_get(url?: any, obj?: any) {
    let params = new HttpParams();
    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params = params.append(key, obj[key]);
        }
      }
    }

    return this.http.get<any>(url, { params }).pipe(
      map(res => {
        return res;
      })
    );
  }

  exparnal_post(url?: any, params?: any) {
    return this.http.post<any>(url, params).pipe(
      map(res => {
        return res;
      })
    );
  }

  downloadCertificateFile(url: string, obj?: any) {
    let params = new HttpParams();

    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params = params.append(key, obj[key]);
        }
      }
    }
    return this.http.get(environment.apiUrl + url, { responseType: 'blob', params })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }

}
