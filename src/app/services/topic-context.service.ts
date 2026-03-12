import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Topic, TOPICS } from '../data/topics';

export interface CurrentTopicState extends Topic {
  subTopic: string;
}

@Injectable({ providedIn: 'root' })
export class TopicContextService {

  private topicSubject = new BehaviorSubject<CurrentTopicState | null>(null);
  topic$ = this.topicSubject.asObservable();

  // Keep local reference
  private topics: Topic[] = TOPICS;

  setTopic(topic: Topic | null, subTopic: string) {
    if (!topic) {
      this.topicSubject.next(null);
      return;
    }
    this.topicSubject.next({
      ...topic,
      subTopic
    });
  }

  currentTopic(): CurrentTopicState | null {
    return this.topicSubject.value;
  }

  clearTopic() {
    this.topicSubject.next(null);
  }

  // ✅ New method
  getTopics(): Topic[] {
    return this.topics;
  }

  // Optional: subset method (topics 11–20)
  getTopicsRange(start: number, end: number): Topic[] {
    return this.topics.slice(start, end);
  }
}