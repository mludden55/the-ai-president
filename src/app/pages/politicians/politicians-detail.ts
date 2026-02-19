import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';

import { TOPICS, Topic } from '../../data/topics';
import { TopicContextService } from '../../services/topic-context.service';
import { AiService } from '../../core/services/ai';

import { environment } from '../../../environments/environment';

export interface Solution {
  text: string;
  disabled: boolean;
  initialValue?: number;
}

@Component({
  standalone: true,
  selector: 'app-politician-detail',
  imports: [CommonModule, MarkdownModule, RouterModule],
  templateUrl: './politicians-detail.html',
  styleUrls: ['./politicians-detail.css']
})
export class PoliticianDetailComponent {
  tableName = "Politician";
  politician?: Topic;
  questionAsked?: string;
  topic?: Topic;
  topicIn: string | null = null;
  currentEnv = environment.name;

  currentYear = new Date().getFullYear();

  answer = '';
  //loading = false;
  activeQuestion: string | null = null;
  activeQuestionId: number | null = null;

  solutionTitle = '';
  solutions: Solution[] = [];
  loadingSolutions = false;
  solutionsError ='';
  ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private route: ActivatedRoute,
    private ai: AiService,
    private cdr: ChangeDetectorRef,
    private topicContext: TopicContextService
  )  { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    //const fromPage = this.route.snapshot.queryParamMap.get('from');
    this.topicIn = this.route.snapshot.queryParamMap.get('topic');

    this.tableName = 'Politician';

    if (!id) {
      console.error('Missing politician id in route');
      return;
    }

    this.politician = id.startsWith('politician-')
      ? this.setStateTopic(id)
      : TOPICS.find(t => t.id === id);

    if (!this.politician) {
      console.error('Politician not found for id:', id);
      return;
    }

    this.topicContext.setTopic(this.politician);
    this.loadSolutions(this.politician);
  }


  loadSolutions(politician: Topic): void {
    console.log("LOADPOL:", politician);
    this.loadingSolutions = true;
    this.solutions = [];

    //  this.questionAsked = `As of ${this.currentYear},
    /*this.questionAsked = `Can you identify up to 5 current elected officials who publicly support the policy issue of: ` + this.getTitleFromDescription(politician.id) +
        `.
        For each official, return:
        Name
        Office (including state or district, if applicable)
        Type of policy mechanism supported (e.g., carbon tax, cap-and-trade)
        Brief summary of their position (max 3 sentences)
        1=3 reputable source links explaining their stance
        Exclude former officials, candidates, and advocacy groups.`;*/ 

    this.questionAsked = `Can you identify up to 5 current elected officials who publicly support ` + this.getTitleFromDescription(politician.id).replaceAll('-', ' ') + ` in relation to ` + this.topicIn  + `. For each official, return:
    - Name
    - Office and jurisdiction
    - Brief position summary (max 3 sentences)
    - 1-3 reputable source links confirming their stance`; 

    console.log("ASKING",this.questionAsked);

    this.ai.ask(this.currentEnv, this.tableName, politician.id, this.questionAsked, ).subscribe({      
      next: res => {
        console.log("res.response", res.response);
        const parsed = this.parseResponse(res.response);
        //const parsed = res.response;
        this.solutionTitle = parsed.title;
        //this.solutions = parsed.items;
        this.solutions = parsed.items.map(item => ({
          text: item,
          disabled: false,
          initialValue: undefined,
        }));
        this.loadingSolutions = false;
        this.afterSolutionsLoaded(politician.id);
      },
      error: () => {
        console.log("Unable to retrieve solutions at this time.");
        this.solutionTitle = '';
        this.solutions = [];
        this.solutionsError = 'Unable to retrieve solutions at this time.';
      }
    });
  }

  async afterSolutionsLoaded(politicianId: string) {
    // 1. Load stats



    this.cdr.detectChanges();
  }

  private parseResponse(
    input: unknown
  ): {
    title: string;
    items: string[];
  } {
    // Case 1: already structured (your current response)
    console.log("PARSING:", typeof input, ":", input);
    if (
      typeof input === 'object' &&
      input !== null &&
      'items' in input &&
      Array.isArray((input as any).items)
    ) {
      return {
        title: 'Response',
        items: (input as any).items
      };
    }

    // Case 2: raw string
    if (typeof input === 'string') {
      return {
        title: 'Response',
        items: input.split('\n').map(l => l.trim()).filter(Boolean)
      };
    }

    // Case 3: array of strings
    if (Array.isArray(input)) {
      return {
        title: 'Response',
        items: input.map(String)
      };
    }

    console.warn('Unexpected AI response format:', input);
    return {
      title: 'Response',
      items: []
    };
  }

  closeAnswer() {
    this.activeQuestionId = null;
  }

  private setStateTopic(id: string): Topic {
    const stateCode = id.replace('politician-', '').toUpperCase();


    return {
      id,
      title: `Politician Support`,
      description: `Politicians that champion specific causes.`
    };
  }  

  getDistributionCount(solution: any, value: number): number {
    return solution.stats?.distribution?.[value] ?? 0;
  }

  isNumbered(text: string): boolean {
    return /^\s*\d+[\.\)\:\-]/.test(text);
  }

  getTitleFromDescription(text: string): string {
    const index = text.indexOf('-');

    return index === -1
      ? text.trim()
      : text.substring(index + 1).trim();
  }

  ngOnDestroy() {
    this.topicContext.setTopic(null); // clean up when leaving page
  }  
}
