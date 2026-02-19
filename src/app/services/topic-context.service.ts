import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Topic } from '../data/topics';

@Injectable({ providedIn: 'root' })
export class TopicContextService {
  private topicSubject = new BehaviorSubject<Topic | null>(null);

  topic$ = this.topicSubject.asObservable();

  setTopic(topic: Topic | null) {
    this.topicSubject.next(topic);
  }

  clearTopic() {
    this.topicSubject.next(null);
  }
}
