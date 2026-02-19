import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  /*getVote(topicId: string, qIndex: number): number | null {
    const v = sessionStorage.getItem(this.key(topicId, qIndex));
    return v ? Number(v) : null;
  }
  

  hasVoted(topicId: string, qIndex: number): boolean {
    return this.getVote(topicId, qIndex) !== null;
  }
  */

  getUserVotes(
    tableName: string,
    topicId: string
  ): Observable<Record<number, number>> {

    console.log('getUserVotes:', tableName, ":", topicId);

    const params = new HttpParams()
      .set('tableName', tableName)
      .set('topicId', topicId);

    return this.http.get<Record<number, number>>(
      `https://de6z90hmxf.execute-api.us-west-2.amazonaws.com/Prod/topic/${topicId}/votes/user`,
      { params }
    );
  }



  saveVote(tableName: string, topicId: string, qIndex: number, value: number): Observable<any> {
    console.log("SavingVote:", tableName, topicId, ":", qIndex, ":", value);
    return this.http.post(
      'https://de6z90hmxf.execute-api.us-west-2.amazonaws.com/Prod/vote',
      { tableName, topicId, questionIndex: qIndex, value }
    );
  }


  getVoteStats(tableName: string, topicId: string, qIndex: number): Observable<VoteStats> {
    //console.log("GETVOTESTATS", tableName, ":", topicId,":", qIndex);
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
