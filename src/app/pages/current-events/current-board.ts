import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai';
import { ChangeDetectorRef } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Topic } from '../../data/topics';
import { TopicContextService } from '../../services/topic-context.service';

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
  topics11to20: Topic[] = [];

  shareLink1 = `Based on recent news coverage, legislative activity, and public opinion data from the past 3-12 months, what political or policy issues have emerged as major public concerns in the United States?
    Focus on current or evolving issues rather than long-standing debates. Do not include the following topics: Gun Control, Climate Change, Healthcare Access, Criminal Justice Reform, Infrastructure Investment, Immigration Reform, Paid Family Leave, Voting Rights, Minimum Wage Increase, Prescription Drug Pricing.
    Provide 6-10 concise items with brief explanations.
    Return the response as a numbered list only.`;
  shareLink1Display = `Based on recent news coverage, legislative activity, and public opinion data from the past 3-12 months, what political or policy issues have emerged as major public concerns in the United States?
    Focus on current or evolving issues rather than long-standing debates.`;  
  // Do not include the following topics: Gun Control, Climate Change, Healthcare Access, Criminal Justice Reform, Infrastructure Investment, Immigration Reform, Paid Family Leave, Voting Rights, Minimum Wage Increase, Prescription Drug Pricing   
  linkCopied:  { [key: number]: boolean } = {};

  constructor(
    private ai: AiService,
    private cdr: ChangeDetectorRef,
    private topicService: TopicContextService
  ) {}

  ngOnInit(): void {
    this.topics11to20 = [];
    this.topics11to20 = this.topicService.getTopicsRange(10, 20);
  }  

  copyToClipboard(linkToCopy: string, linkId: number) {
    const plainText = linkToCopy;
    const htmlContent = linkToCopy;

    const onSuccess = () => {
      this.linkCopied[linkId] = true;
      this.cdr.detectChanges(); // 👈 MUST be here
      setTimeout(() => {
        this.linkCopied[linkId] = false;
        this.cdr.detectChanges(); // 👈 and here
      }, 2000);
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
