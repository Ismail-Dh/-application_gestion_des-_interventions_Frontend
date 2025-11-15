import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogApp } from '../admin/dashborad-admin/dashborad-admin.component';
@Injectable({
  providedIn: 'root'
})
export class LogService {
private apiUrl = 'http://localhost:8082/api/logs';
  constructor(private http: HttpClient) { }
  getLogs(): Observable<LogApp[]> {
  return this.http.get<LogApp[]>(this.apiUrl); 
}

}
