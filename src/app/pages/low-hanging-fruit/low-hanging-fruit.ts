import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../core/services/ai';
import { ChangeDetectorRef } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-low-hanging-fruit',
  templateUrl: './low-hanging-fruit.html',
  styleUrl: './low-hanging-fruit.css',
  imports: [CommonModule, MarkdownModule, RouterModule]
})
export class LowHangingFruitComponent {
  answer = '';
  loading = false;
  showAnswer = false;
  activeQuestionId: string | null = null;
  currentEnv = environment.name;
  linkCopied:  { [key: number]: boolean } = {};

  shareLink1 = `What political or policy issues show broad agreement among the U.S. public across polls and surveys, but have seen limited or stalled legislative action?
  List up to 10 issues and briefly explain the public consensus and the policy gap for each.`;


  constructor(
    private ai: AiService,
    private cdr: ChangeDetectorRef
  ) {}

  /*ask(topic: string, question: string, questionId: string) {
    console.log("BeginAsk:", question);
    this.loading = true;
    this.answer = '';
    this.showAnswer = true;
    this.activeQuestionId = questionId;
    const topicComplete = 'low-' + topic;
    console.log("this.currentEnv",this.currentEnv);
    console.log("topicComplete",topicComplete);
    console.log("question",question);
    this.ai.ask(this.currentEnv, 'Low', topicComplete, question ).subscribe({
      next: res => {
        this.answer = res.response;
        this.loading = false;
        this.cdr.detectChanges();
        //console.log("Ask1", this.answer);
      },
      error: () => {
        this.answer = 'An error occurred while contacting ChatGPT.';
        this.loading = false;
        this.cdr.detectChanges();
        //console.log("Ask2", this.answer);
      }
    });
    console.log("EndAsk", this.answer);
  }
    */
  copyToClipboard(linkToCopy: string, linkId: number) {
    const plainText = linkToCopy;
    const htmlContent = linkToCopy;

    const onSuccess = () => {
      this.linkCopied[linkId] = true;
      this.cdr.detectChanges(); // 👈 MUST be here
      console.log('XXX');
      setTimeout(() => {
        this.linkCopied[linkId] = false;
        this.cdr.detectChanges(); // 👈 and here
        console.log('YYY');
      }, 2000);

      console.log('Copied to clipboard!');
    };

    if (navigator.clipboard && window.ClipboardItem) {
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

      const clipboardItem = new ClipboardItem({
        'text/plain': textBlob,
        'text/html': htmlBlob
      });

      navigator.clipboard.write([clipboardItem])
        .then(onSuccess)
        .catch(err => console.error('Failed to copy text:', err));
    } else {
      navigator.clipboard.writeText(plainText)
        .then(onSuccess)
        .catch(err => console.error('Failed to copy text:', err));
    }
  }
  closeAnswer() {
    this.activeQuestionId = null;
  }
}
