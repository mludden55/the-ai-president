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
  topics1to10: Topic[] = [];

  shareLink1 = `What political or policy issues show broad agreement among the U.S. public across polls and surveys, but have seen limited or stalled legislative action?
  List up to 10 issues and briefly explain the public consensus and the policy gap for each.`;


  constructor(
    private ai: AiService,
    private cdr: ChangeDetectorRef,
    private topicService: TopicContextService
  ) {}

  ngOnInit(): void {
    this.topics1to10 = [];
    this.topics1to10 = this.topicService.getTopicsRange(0, 10);
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

  formatDescription(text: string): string {
    return text
      .replace(/\*?Public Consensus:\*?/g, 
        '<p class="consensus-label">Public Consensus</p><p class="question-text">')
      .replace(/\*?Policy Gap:\*?/g, 
        '</p><p class="gap-label">Policy Gap</p><p class="question-text">')
      + '</p>';
  }

  closeAnswer() {
    this.activeQuestionId = null;
  }
}
