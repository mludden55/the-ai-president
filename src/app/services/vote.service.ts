import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

interface Distribution {
  [rating: number]: number;
}

interface VoteStats {
  count: number;
  sum: number;
  distribution: Distribution;
}

@Injectable({ providedIn: 'root' })
export class VoteService {
  private sessionId = this.getSessionId();

  assignedRanks: number[] = [];
  constructor(private http: HttpClient) {}

  private getSessionId(): string {
    let id = sessionStorage.getItem('sessionId');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('sessionId', id);
    }
    return id;
  }

  private key(topicId: string, qIndex: number) {
    return `vote:${topicId}:${qIndex}`;
  }

  getUserVotes(
    tableName: string,
    topicId: string
  ): Observable<Record<number, number>> {

    const params = new HttpParams()
      .set('tableName', tableName)
      .set('topicId', topicId);
    return this.http.get<Record<number, number>>(
      `https://de6z90hmxf.execute-api.us-west-2.amazonaws.com/Prod/topic/${topicId}/votes/user`,
      { params }
    );
  }

  findVoteByValue(
    userVotes: Record<number, number>,
    value: number
  ): number | undefined {
    for (const key in userVotes) {
      if (Number(userVotes[key]) === Number(value)) {
        return Number(key);
      }
    }
    return undefined;
  }

  saveVote(tableName: string, topicId: string, qIndex: number, value: number | undefined, assignedRanks: any, userVotes: any) {
    if (value != null){
      if (assignedRanks.includes(value)) {
        const existingIndex2 = this.findVoteByValue(userVotes,value);

        if(existingIndex2 === null || existingIndex2 === undefined){
          return this.http.post(
            'https://de6z90hmxf.execute-api.us-west-2.amazonaws.com/Prod/vote',
            { tableName, topicId, questionIndex: qIndex, value }
          );          
        }
        else{
          return of(existingIndex2);
        }
      }
    }  
    return this.http.post(
      'https://de6z90hmxf.execute-api.us-west-2.amazonaws.com/Prod/vote',
      { tableName, topicId, questionIndex: qIndex, value }
    );
  }

  removeVote(tableName: string, topicId: string, qIndex: number) {
    // 1️⃣ Clear vote case
    if (qIndex === undefined) {
      return of(null);
    }

    // Send to backend
    return this.http.post(
      'https://de6z90hmxf.execute-api.us-west-2.amazonaws.com/Prod/removeVote',
      { tableName, topicId, questionIndex: qIndex }
    );
  }


  getVoteStats(tableName: string, topicId: string, qIndex: number): Observable<VoteStats> {
    return this.http.get<VoteStats>(
      `https://de6z90hmxf.execute-api.us-west-2.amazonaws.com/Prod/topic/${topicId}/question/${qIndex}/stats`,
      {
        params: {
          tableName,
          topicId,
          questionIndex: qIndex
        }
      }
    );
  }
}
