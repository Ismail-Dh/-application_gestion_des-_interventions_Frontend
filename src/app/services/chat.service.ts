
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:8085/api/chat';

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<{ answer: string }> {
    return this.http.post<{ answer: string }>(this.apiUrl, { question });
  }
}
