import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private subjectDisplaySource = new BehaviorSubject<string>('Default Subject'); 
  subjectDisplay$ = this.subjectDisplaySource.asObservable(); 

  updateSubjectDisplay(newValue: string) {
    this.subjectDisplaySource.next(newValue); 
  }
}
