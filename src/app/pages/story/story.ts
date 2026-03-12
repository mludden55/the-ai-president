import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai';
import { ChangeDetectorRef } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../../../environments/environment';
import { StoryWidgetComponent } from '../../shared/question-widget';

@Component({
  standalone: true,
  selector: 'app-story',
  templateUrl: './story.html',
  styleUrl: './story.css',
  imports: [CommonModule, MarkdownModule, StoryWidgetComponent]
})
export class StoryComponent {
  currentEnv = environment.name;
  answer = '';
  loading = false;
  showAnswer = false;
  activeQuestionId: string | null = null;

  answers: { [key: number]: string } = {};
  loadingQuestions: { [key: number]: boolean } = {};
  showPatienceMessage: { [key: number]: boolean } = {};
  private patienceTimer: { [key: number]: any } = {};

  storyQuestions: { [key: number]: string } = {}; 


  buttonText: { [key: number]: string } = {};

  linkCopied:  { [key: number]: boolean } = {};

  constructor(
    private ai: AiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    for (let i = 1; i <= 4; i++) {
      this.buttonText[i] = "Ask Claude";
    }

    this.storyQuestions[0] = `In about 100 words, explain artificial intelligence in simple terms. Describe how AI uses existing data to find patterns and summarize general voter preferences, rather than making decisions about specific individuals.`;
    this.storyQuestions[1] = `Can you briefly explain the interaction between states and the U.S. Government in regards to voters and voter registration?`;
    this.storyQuestions[2] = `What percentage of the United States population agrees that gerrymandering should not be allowed`;
    this.storyQuestions[3] = `Can you create a picture of each of the 50 states broken into 10 evenly spaced areas based on population?`;
  }

  insertLineBreakBeforeNumberedPoints(text: string): string {
    return text.replace(
      /(?<!\n)(?<!\d)(\b\d+\.\s)/g,
      '\n$1'
    );
  }

  closeAnswer() {
    this.activeQuestionId = null;
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

}
