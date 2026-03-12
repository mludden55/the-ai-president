import { Component, Input, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
 import { AiService } from '../services/ai';
 import { environment } from '../../environments/environment';

 interface QuestionItem {
  question: string;
  questionShort: string;
}

@Component({
  standalone: true,
  selector: 'question-widget',
  templateUrl: 'question-widget.html',
  styleUrl: 'question-widget.css',
})
export class StoryWidgetComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef, private ai: AiService
  ) {}
  @Input() questionId!: number;

  currentEnv = environment.name;
  questionText!: string;
  questionShort!: string;
  answer!: string | null;

  answers: { [key: number]: string } = {};
  questionAsked: { [key: number]: string } = {};
  buttonText: { [key: number]: string } = {};
  linkCopied:  { [key: number]: boolean } = {};
  activeQuestionId: string | null = null;

  loadingQuestions: { [key: number]: boolean } = {};
  showPatienceMessage: { [key: number]: boolean } = {};
  private patienceTimer: { [key: number]: any } = {};

  private questionBank: QuestionItem[] = [];


  ngOnInit() {
    // use 0-9 for story related questions
    this.questionBank[0] = {} as QuestionItem;
    this.questionBank[0].question =
      "In about 100 words, explain artificial intelligence in simple terms. Describe how AI uses existing data to find patterns and summarize general voter preferences, rather than making decisions about specific individuals.";
    this.questionBank[0].questionShort = "ai-explained";

    this.questionBank[1] = {} as QuestionItem;
    this.questionBank[1].question =
      "Can you briefly explain the interaction between states and the U.S. Government in regards to voters and voter registration?";
    this.questionBank[1].questionShort = "state-voting";

    this.questionBank[2] = {} as QuestionItem;
    this.questionBank[2].question =
      "What percentage of the United States population agrees that gerrymandering should not be allowed?";
    this.questionBank[2].questionShort = "gerrymander";

    this.questionBank[3] = {} as QuestionItem;
    this.questionBank[3].question =
      "Can you create a picture of each of the 50 states broken into 10 evenly spaced areas based on population?";
    this.questionBank[3].questionShort = "state-spaced";

    `What political or policy issues show broad agreement among the U.S. public across polls and surveys, but have seen limited or stalled legislative action?
  List up to 10 issues and briefly explain the public consensus and the policy gap for each.`;

    // use 10-20 for
    this.questionBank[10] = {} as QuestionItem;
    this.questionBank[10].question =
      "Can you create a picture of each of the 50 states broken into 10 evenly spaced areas based on population?";
    this.questionBank[10].questionShort = "state-spaced";

    // now assign question for this widget
    const data = this.questionBank[this.questionId];
    this.buttonText[this.questionId] = "Click To See Claude Reply";

    if (!data) {
      console.error('Invalid questionId:', this.questionId);
      return;
    }

    this.questionText = data.question;
    this.questionShort = data.questionShort;
  }

  ask(topic: string, question: string, questionId: number) {
    this.loadingQuestions[questionId] = true;

    this.patienceTimer[questionId] = setTimeout(() => {
      if (this.loadingQuestions[questionId]) {
        this.showPatienceMessage[questionId] = true;
        this.cdr.markForCheck();   // required for OnPush
      }
    }, 3000);
    
    if(this.buttonText[questionId]==="Click To Close Claude Reply"){
      this.loadingQuestions[questionId] = false;
      this.showPatienceMessage[questionId] = false;
      this.answers[questionId] = "";
      this.buttonText[questionId] = "Click To See Claude Reply";
    }
    else{      
      this.ai.ask(this.currentEnv, 'story', topic, question).subscribe({
      next: res => {
        this.answers[questionId] = res.response;
        this.loadingQuestions[questionId] = false;
        this.showPatienceMessage[questionId] = false;
        this.buttonText[questionId] = "Click To Close Claude Reply";

        this.cdr.detectChanges();
      },
      error: () => {
        this.answers[questionId] = 'An error occurred while contacting Claude.';
        this.loadingQuestions[questionId] = false;
        this.showPatienceMessage[questionId] = false;

        this.cdr.detectChanges();
      }
      });
    } 
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