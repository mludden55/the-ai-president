import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AskResponse {
  topic: string;
  response: string;
  cached: boolean;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  
  private apiUrl = 'https://de6z90hmxf.execute-api.us-west-2.amazonaws.com/Prod/ask';

  constructor(private http: HttpClient) {}

  ask(environment: string, board: string, topic: string, question: string): Observable<AskResponse> {    
    console.log("Asking Claude:", question);
    return this.http.post<AskResponse>(this.apiUrl, {
      environment,
      topic,
      question,
      board
    });    
  }
}

