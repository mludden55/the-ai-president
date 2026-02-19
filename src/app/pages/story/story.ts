import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../core/services/ai';
import { ChangeDetectorRef } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-story',
  templateUrl: './story.html',
  styleUrl: './story.css',
  imports: [CommonModule, MarkdownModule]
})
export class StoryComponent {
  answer = '';
  loading = false;
  showAnswer = false;
  activeQuestionId: string | null = null;

  answers: { [key: number]: string } = {};
  loadingQuestions: { [key: number]: boolean } = {};
  currentEnv = environment.name;

  shareLink1 = `In about 100 words, explain artificial intelligence in simple terms. Describe how AI uses existing data to find patterns and summarize general voter preferences, rather than making decisions about specific individuals.`;
  shareLink2 = `Can you briefly explain the interaction between states and the U.S. Government in regards to voters and voter registration?`;
  shareLink3 = `What percentage of the United States population agrees that gerrymandering should not be allowed`;
  shareLink4 = `Can you create a picture of each of the 50 states broken into 10 evenly spaced areas based on population?`;
  buttonText: { [key: number]: string } = {};

  linkCopied:  { [key: number]: boolean } = {};

  constructor(
    private ai: AiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    for (let i = 1; i <= 4; i++) {
      this.buttonText[i] = "Click To See ChatGPT Reply";
    }
  }

  ask(topic: string, question: string, questionId: number) {
    if(this.buttonText[questionId]==="Click To Close ChatGPT Reply"){
      this.loadingQuestions[questionId] = false;
      this.answers[questionId] = "";
      this.buttonText[questionId] = "Click To See ChatGPT Reply";
    }
    else{
      this.buttonText[questionId] = "Click To Close ChatGPT Reply";
        this.ai.ask(this.currentEnv, 'story', topic, question).subscribe({
        next: res => {
          this.answers[questionId] = res.response;
          this.loadingQuestions[questionId] = false;

          this.cdr.detectChanges();
        },
        error: () => {
          this.answers[questionId] = 'An error occurred while contacting ChatGPT.';
          this.loadingQuestions[questionId] = false;

          this.cdr.detectChanges();
        }
      });
    }  


  }

  formatToList(text: string): string {

    const parts = text.split(/(?=\d+\.\s)/);

    if (parts.length <= 1) return text;

    const intro = parts.shift(); // text before list

    const listItems = parts.map(item =>
      item.replace(/^\d+\.\s*/, '')
    );

    return `
      ${intro}
      <ol>
        ${listItems.map(i => `<li>${i}</li>`).join('')}
      </ol>
    `;
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

}
