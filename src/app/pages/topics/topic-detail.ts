import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';

import { TOPICS, Topic } from '../../data/topics';
import { TopicContextService } from '../../services/topic-context.service';
import { AiService } from '../../core/services/ai';
import { VoteWidgetComponent } from '../../shared/vote-widget/vote-widget';
import { VoteService } from '../../services/vote.service';
import { VoteStats } from '../../models/vote.stats.model';

import { of, forkJoin, firstValueFrom } from 'rxjs';
import { map, } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Solution {
  text: string;
  stats?: VoteStats;
  userVote?: number;
  disabled: boolean;
  initialValue?: number;
}

const STATE_NAME_MAP: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
};

@Component({
  standalone: true,
  selector: 'app-topic-detail',
  imports: [CommonModule, MarkdownModule, VoteWidgetComponent, RouterModule],
  templateUrl: './topic-detail.html',
  styleUrls: ['./topic-detail.css']
})
export class TopicDetailComponent {
  tableName = "LowHanging";
  topic?: Topic;
  topicPreface = '';
  questionAsked?: string;
  stateAsked?: string;
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
  fromPage: string | null = null;
  currentEnv = environment.name;

  constructor(
    private route: ActivatedRoute,
    private ai: AiService,
    private cdr: ChangeDetectorRef,
    private votes: VoteService,
    private topicContext: TopicContextService
  )  { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.fromPage = this.route.snapshot.queryParamMap.get('from');
    
    switch (this.fromPage) {  
      case 'low-hanging-fruit':
        this.tableName = 'LowHanging';
        this.topicPreface = 'low-';
        break;
      case 'current-board':
        this.tableName = 'CurrentBoard';
        this.topicPreface = 'current-';
        break;
      case 'state-board':
        this.tableName = 'StateBoard';
        break;
      case 'politicians':
        this.tableName = 'Politicians';
        break;
      default:
        this.tableName = 'LowHanging';
        break;
    } 
    
    if(this.currentEnv === "development"){
      this.tableName = this.tableName + "_test";
    }


    if (!id) {
      console.error('Missing topic id in route');
      return;
    }

    console.log("IDDDDD", id);
    this.topic = id.startsWith('state-')
      ? this.setStateTopic(id)
      : TOPICS.find(t => t.id === id);

    if (!this.topic) {
      console.error('Topic not found for id:', id);
      return;
    }
    if(this.topicPreface){
      this
    }

    this.topicContext.setTopic(this.topic);
    this.loadSolutions(this.topic);
  }

  loadSolutions(topic: Topic): void {
    this.loadingSolutions = true;
    this.solutions = [];
    console.log("topic.id",topic.id);
    switch (true) {  
      case topic.id.startsWith('state-'):
        this.stateAsked = STATE_NAME_MAP[topic.id.slice('state-'.length).toUpperCase()];
        this.questionAsked = `What are the top policy and quality-of-life concerns for residents in the state of ${this.stateAsked}? 
          Focus on issues that consistently appear in public opinion surveys, state policy debates, and demographic trends. 
          Provide 6-10 concise concerns with brief explanations for each.`;
        break;

      case topic.id.startsWith('politicians'):
        this.questionAsked = `As of ${this.currentYear}, identify up to 5 current elected officials who publicly support ${topic.title}.
        ${topic.description}
        For each official, return:
        Name
        Office (including state or district, if applicable)
        Type of policy mechanism supported (e.g., carbon tax, cap-and-trade)
        Brief summary of their position (max 3 sentences)
        1=3 reputable source links explaining their stance
        Exclude former officials, candidates, and advocacy groups.`
        break;

      default:
        this.questionAsked = `Provide 8-10 practical, policy-oriented solutions to address: ${topic.title}`;
        break;
    }  

    this.ai.ask(this.currentEnv, this.tableName, this.topicPreface + topic.id, this.questionAsked).subscribe({      
      next: res => {
        //console.log("res.response", res.response);
        const parsed = this.parseNumberedList(res.response);
        //const parsed = res.response;
        this.solutionTitle = parsed.title;
        //this.solutions = parsed.items;
        this.solutions = parsed.items.map(item => ({
          text: item,
          disabled: false,
          initialValue: undefined,
        }));
        this.loadingSolutions = false;
        this.afterSolutionsLoaded(topic.id);
      },
      error: () => {
        console.log("Unable to retrieve solutions at this time.");
        this.solutionTitle = '';
        this.solutions = [];
        this.solutionsError = 'Unable to retrieve solutions at this time.';
      }
    });
  }

  async afterSolutionsLoaded(topicId: string) {
    // 1. Load stats

    const statRequests = this.solutions.map((_, qIndex) =>
      this.votes.getVoteStats(this.tableName, this.topicPreface + topicId, qIndex).pipe(
        map(stats => ({ qIndex, stats })),
        catchError(() => of({ qIndex, stats: null }))
      )
    );

    //console.log("statRequests",statRequests);

    forkJoin(statRequests).subscribe(results => {
      results.forEach(({ qIndex, stats }) => {
        if (stats) {
          this.solutions[qIndex].stats = stats;
        }
      });
      this.cdr.detectChanges();
    });

    // 2. Load user votes (separate)
    const userVotes = await firstValueFrom(
      this.votes.getUserVotes(this.tableName, this.topicPreface + topicId)
    );
    //console.log("userVotes",userVotes);
    this.solutions.forEach((solution, qIndex) => {
      const vote = userVotes[qIndex];

      if (vote !== undefined) {
        solution.userVote = vote;
        solution.initialValue = vote;
        solution.disabled = true;
      } else {
        solution.disabled = false;
      }
    });

    this.cdr.detectChanges();
  }

  private parseNumberedList(
    input: string | string[]
  ): {
    title: string;
    items: string[];
  } {
    //console.log('parseNumberedList:', input);

    const NUMBERED_LINE = /^\s*\d+[\.\)\:\-]\s*/;

    const normalizeItem = (line: string) =>
      line
        .replace(NUMBERED_LINE, '')              // strip number
        .replace(/^\*\*(.*?)\*\*:\s*/, '$1: ')
        .replace(/\*\*/g, '')
        .trim();

    // CASE 1: Cached response
    if (Array.isArray(input)) {
      return {
        title: 'Proposed Solutions',
        items: input.map(normalizeItem).filter(Boolean)
      };
    }

    // CASE 2: Raw text
    const lines = input
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    let title = '';
    const items: string[] = [];

    for (const line of lines) {
      if (NUMBERED_LINE.test(line)) {
        items.push(normalizeItem(line));
      } else if (!title) {
        // First non-numbered line becomes title
        title = line.replace(/\*\*/g, '').trim();
      }
    }

    console.log("title",title);

    return {
      title: title || 'Proposed Solutions',
      items
    };
  }

  closeAnswer() {
    this.activeQuestionId = null;
  }

  async onVote(tableValue: string, topicId: string, qIndex: number, value: number) {
    console.log('VOTING:', tableValue, topicId, qIndex, value);

    // 1️⃣ Save vote and WAIT
    await firstValueFrom(
      this.votes.saveVote(tableValue, this.topicPreface + topicId, qIndex, value)
    );
    this.cdr.detectChanges();
  
    // 2️⃣ Reload stats for ALL questions
    forkJoin(
      this.solutions.map((_, index) =>
        this.votes.getVoteStats(this.tableName, this.topicPreface + topicId, index).pipe(
          catchError(err => {
            console.warn(`Stats failed for question ${index}`, err);
            return of({ count: 0, sum: 0, avg: 0, distribution: {} });
          })
        )
      )
    ).subscribe(statsArray => {
      statsArray.forEach((stats, index) => {
        this.solutions[index].stats = stats;
      });
      this.cdr.detectChanges();

    });
    this.cdr.detectChanges();
  }

  /*hasVoted(topicId: string, qIndex: number) {
    return this.votes.hasVoted(this.topicPreface + topicId, qIndex);
  }

  getVote(topicId: string, qIndex: number) {
    return this.votes.getVote(this.topicPreface + topicId, qIndex);
  } */

  getStateName(abbreviation: string): string {
    return STATE_NAME_MAP[abbreviation.toUpperCase()] ?? 'Unknown State';
  }  

  private setStateTopic(id: string): Topic {
    const stateCode = id.replace('state-', '').toUpperCase();
    const stateName = this.getStateName(stateCode);

    return {
      id,
      title: `${stateName} Policy Issues`,
      description: `Key policy challenges and opportunities specific to ${stateName}.`
    };
  }  

  getDistributionCount(solution: any, value: number): number {
    return solution.stats?.distribution?.[value] ?? 0;
  }

  getAverage(index: number): number {
    const stats = this.solutions[index].stats;
    if (!stats || !stats.count) {
      return 0;
    }

    return Math.round((stats.sum / stats.count) * 100) / 100;
  }

  getTitleFromDescription(text: string): string {
    const index = text.indexOf(':');

    return index === -1
      ? text.trim()
      : text.substring(0, index).trim();
  }

  getPoliticianSlug(text: string): string {
    return 'politician-' + this.getTitleFromDescription(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  ngOnDestroy() {
    this.topicContext.setTopic(null); // clean up when leaving page
  }  
}
