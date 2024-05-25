import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TaskI } from '../interfaces/taskInterface';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  apiUrl: string = environment.apiUrl;
  // token = localStorage.getItem('token');
  // headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + this.token);
  constructor(private http: HttpClient) { }

  list(status: string): Observable<HttpResponse<any>>  {
    return this.http.get<any>(`${this.apiUrl}/tasks/status/${status}`, {  observe: 'response' });
  }

  create(data: object): Observable<HttpResponse<TaskI>> {
    return this.http.post<TaskI>(`${this.apiUrl}/tasks`, data, { observe: 'response' });
  }

  detail(id: string): Observable<HttpResponse<TaskI>> {
    return this.http.get<TaskI>(`${this.apiUrl}/tasks/${id}`, {observe: 'response'});
  }

  update(data:object, id:string): Observable<HttpResponse<TaskI>> {
    return this.http.put<TaskI>(`${this.apiUrl}/tasks/${id}`, data, {observe: 'response'});
  }

  remove(id: string): Observable<HttpResponse<TaskI>> {
    return this.http.delete<TaskI>(`${this.apiUrl}/tasks/${id}`, { observe: 'response' });
  }
}
