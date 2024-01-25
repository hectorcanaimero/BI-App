import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Observable, Subject } from 'rxjs';
const url: string = environment.url;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public report = new Subject<any>();
  constructor(
    private http: HttpClient,
  ) { }

  setReport(value: any): any {
    return this.report.next(value);
  }

  getReport(): Observable<any> {
    return this.report.asObservable();
  }

  getData(query: string, options?: any): Observable<any> {
    return this.http.get<any>(`${url}/${query}`, options);
  }

  postData(query: string, data: any, options?: any): Observable<any> {
    return this.http.post<any>(`${url}/${query}`, data, options);
  }

  patchData(query: string, data: any, options?: any): Observable<any> {
    return this.http.patch<any>(`${url}/${query}`, data, options);
  }

  delete(query: string, options?: any): Observable<any> {
    return this.http.delete(`${url}/${query}`, options);
  }
}
