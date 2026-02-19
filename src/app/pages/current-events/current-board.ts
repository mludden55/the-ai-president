import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../core/services/ai';
import { ChangeDetectorRef } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-current-board',
  templateUrl: './current-board.html',
  standalone: true,
  styleUrl: './current-board.css',
  imports: [CommonModule, MarkdownModule, RouterModule]  
})
export class CurrentBoard {
  answer = '';
  loading = false;
  showAnswer = false;
  activeQuestionId: string | null = null;
  currentEnv = environment.name;

  shareLink1 = `Based on recent news coverage, legislative activity, and public opinion data from the past 3-12 months, what political or policy issues have emerged as major public concerns in the United States?
    Focus on current or evolving issues rather than long-standing debates.
    Provide 6-10 concise items with brief explanations.
    Return the response as a numbered list only.`;
  linkCopied:  { [key: number]: boolean } = {};

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
    const topicComplete = 'current-' + topic;

    this.ai.ask(this.currentEnv, topicComplete, question, 'BIG').subscribe({
      next: res => {
        this.answer = res.response;
        this.loading = false;
        this.cdr.detectChanges();
        console.log("Ask1", this.answer);
      },
      error: () => {
        this.answer = 'An error occurred while contacting ChatGPT.';
        this.loading = false;
        this.cdr.detectChanges();
        console.log("Ask2", this.answer);
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
