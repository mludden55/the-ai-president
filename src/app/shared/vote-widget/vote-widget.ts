import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-vote-widget',
  imports: [CommonModule],
  templateUrl: './vote-widget.html',
  styleUrls: ['./vote-widget.css']
})
export class VoteWidgetComponent {
  @Input() questionId!: string;
  @Input() disabled = false;
  @Input() initialValue?: number;

  @Input() userVote?: number;
  @Output() voteSelected = new EventEmitter<number>();

  @Output() voted = new EventEmitter<number>();

  selected?: number;

  ngOnInit() {
    this.selected = this.initialValue;
  }

  vote(value: number) {
    if (this.disabled) return;
    this.selected = value;
    //this.voteSelected.emit(value);
    this.disabled = true;
    this.voted.emit(value);
    
  }
}
