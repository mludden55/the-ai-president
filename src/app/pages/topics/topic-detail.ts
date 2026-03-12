import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';

import { TOPICS, Topic } from '../../data/topics';
import { TopicContextService } from '../../services/topic-context.service';
import { AiService } from '../../services/ai';
import { VoteWidgetComponent } from '../../shared/vote-widget/vote-widget';
import { VoteService } from '../../services/vote.service';
import { VoteStats } from '../../models/vote.stats.model';

import { of, forkJoin, firstValueFrom } from 'rxjs';
import { map, } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog';

import { MatDialogRef } from '@angular/material/dialog';

export interface Solution {
  number: string;
  title: string;
  text: string;
  stats?: VoteStats;
  userVote?: number;
  initialValue?: number;
}

const STATE_NAME_MAP: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas',
  KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
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
  activeQuestion: string | null = null;
  activeQuestionId: number | null = null;
  solutionTitle = '';
  solutions: Solution[] = [];
  linkCopied:  { [key: number]: boolean } = {};

  loadingSolutions = false;
  showLoadError = false;
  showPatienceMessage = false;
  private patienceTimer: any;

  ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  fromPage: string | null = null;
  currentEnv = environment.name;
  assignedRanks: number[] = [];
  userVotes: { [key: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private ai: AiService,
    private cdr: ChangeDetectorRef,
    private votes: VoteService,
    private topicContext: TopicContextService,
    private dialog: MatDialog
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

    this.topic = id.startsWith('state-')
      ? this.setStateTopic(id)
      : TOPICS.find(t => t.id === id);

    if (!this.topic) {
      console.error('Topic not found for id:', id);
      return;
    }

    this.topicContext.setTopic(this.topic, 'solutions');
    this.loadSolutions(this.topic);
  }

  async loadSolutions(topic: Topic) {
    this.loadingSolutions = true;
    this.showLoadError = false;
    this.showPatienceMessage = false;
    this.solutions = [];

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
    
    // Start 3-second timer
    this.patienceTimer = setTimeout(() => {
      if (this.loadingSolutions) {
        this.showPatienceMessage = true; 
        this.cdr.markForCheck();   // required for OnPush
      }
    }, 3000);

    this.ai.ask(this.currentEnv, this.tableName, this.topicPreface + topic.id, this.questionAsked).subscribe({      
    next: res => {
      let parsed: { title: string; items: string[] };

      if (res.cached) {
        // return value that is saved in db
        parsed = this.parseNumberedList(res.response as string);
      } else {
        /*if (typeof res.response === 'string') {
          throw new Error('Expected structured response when not cached');
        }
          */
        // return value from Claude
        parsed = this.parseNumberedList(res.response as string);
      }

      this.solutionTitle = parsed.title;
      this.solutions = parsed.items.map(item => {
        const [titleLine, ...rest] = item.split('\n');
        const match = titleLine.match(/^(\d+)\.\s*(.*)/)!;

        return {
          number: match[1],
          title: match[2].trim(),
          text: rest.join('\n').trim(),
          initialValue: undefined
        };
      });

      this.loadingSolutions = false;
      this.showPatienceMessage = false;
      this.afterSolutionsLoaded(topic.id);
    },
      error: () => {
        console.log("Unable to retrieve solutions at this time.");
        this.showLoadError = true;
        this.solutionTitle = '';
        this.solutions = [];
        this.cdr.markForCheck();
      }
    });
  }

  async afterSolutionsLoaded(topicId: string) {
    try {

      // 1. Load stats
      const statRequests = this.solutions.map((_, qIndex) =>
        this.votes.getVoteStats(this.tableName, this.topicPreface + topicId, qIndex).pipe(
          map(stats => ({ qIndex, stats })),
          catchError(err => {
            console.error('Vote stats error for index', qIndex, err);
            return of({ qIndex, stats: null });
          })
        )
      );

      forkJoin(statRequests).pipe(
        catchError(err => {
          console.error('forkJoin stats error', err);
          return of([]);
        })
      ).subscribe({
        next: (results: any[]) => {
          results.forEach(({ qIndex, stats }) => {
            if (stats) {
              this.solutions[qIndex].stats = stats;
            }
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Subscription error loading stats', err);
        }
      });

      // 2. Load user votes
      try {
        this.userVotes = await firstValueFrom(
          this.votes.getUserVotes(this.tableName, this.topicPreface + topicId).pipe(
            catchError(err => {
              console.error('getUserVotes error', err);
              return of({});
            })
          )
        );
      } catch (err) {
        console.error('Error awaiting user votes', err);
        this.userVotes = {};
      }

      // 3. Apply user votes
      this.solutions.forEach((solution, qIndex) => {
        const vote = this.userVotes?.[qIndex];

        if (vote !== undefined) {
          this.assignedRanks.push(vote);
          solution.userVote = vote;
          solution.initialValue = vote;
        }
      });

      this.cdr.detectChanges();

    } catch (err) {
      console.error('afterSolutionsLoaded fatal error', err);
    }
  }

  private parseNumberedList(
    input: string | string[]
  ): {
    title: string;
    items: string[];
  } {
    
    const NUMBERED_LINE = /^\s*\d+[\.\)\:\-]\s*/;
    
    const normalizeItem = (line: string) =>
      line
        .replace(/^\*\*(.*?)\*\*:\s*/, '$1: ')
        .replace(/\*\*/g, '')
        .replace(/"/g, "'")
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
        title = line.replace(/\*\*/g, '').trim();
      } else {
        //console.log("PUSHING:", title, ":", line);
        items.push(normalizeItem(`${title}\n${line}`));
      }
    }

    return {
      title: title || 'Proposed Solutions',
      items
    };
  }

  confirmReassign(): MatDialogRef<ConfirmDialogComponent, boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: 'That rating score is already assigned. Reassign it?'
      }
    });
  }

  isValidNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
  }

  deleteByIndex(index: number) {
    if (index >= 0 && index < this.assignedRanks.length) {
      this.assignedRanks.splice(index, 1);
    }
  }

  async onVote(tableName: string, topicId: string, qIndex: number, value: number | undefined) {
    try {
      // if a vote has already been made with this value it will return a number to be handled later
      const appliedVote = await firstValueFrom(
        this.votes.saveVote(tableName, this.topicPreface + topicId, qIndex, value, this.assignedRanks, this.userVotes)
      );

      // set the new vote
      if(qIndex != null && value != null){
        this.userVotes[qIndex] = value;
      } 

      // push value to numbers that have already been assigned
      if (value != null){
        this.assignedRanks.push(value);
      }

      // if the vote has already been assigned to a different selction ask if they want to clear
      if (this.isValidNumber(appliedVote)) {
        // prompt
        const dialogRef = await firstValueFrom(
          this.confirmReassign().afterClosed()
        );

        // if they select no then return without saving the vote
        if (dialogRef !== true) {
          delete this.userVotes[appliedVote];
          this.afterSolutionsLoaded(topicId);
          return;
        }

        // if they select yes, then remove the vote
        await firstValueFrom(
          this.votes.removeVote(tableName, this.topicPreface + topicId, appliedVote)
        );

        // now delete the vote from userVotes
        delete this.userVotes[appliedVote];

        // remove the value from list of assigned values
        if (appliedVote != null) {
          if (appliedVote >= 0 && appliedVote < this.assignedRanks.length) {
            this.assignedRanks.splice(appliedVote, 1);
          }
        }

        // now add the value to new vote
        await firstValueFrom(
          this.votes.saveVote(tableName, this.topicPreface + topicId, qIndex, value, this.assignedRanks, this.votes)
        );

        this.afterSolutionsLoaded(topicId);

        return;
      }

      // Otherwise, vote applied successfully
      this.solutions[qIndex].userVote = value;

      // Reload stats for all questions if needed
      this.afterSolutionsLoaded(topicId);

    } catch (err) {
      console.error('Vote failed', err);
    }
  }

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
  
  ngOnDestroy() {
    this.topicContext.setTopic(null,''); // clean up when leaving page
  }  
}
