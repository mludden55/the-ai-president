import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';

import { TOPICS, Topic } from '../../data/topics';
import { TopicContextService } from '../../services/topic-context.service';
import { AiService } from '../../services/ai';

import { environment } from '../../../environments/environment';

export interface Solution {
  text: string;
  disabled: boolean;
  initialValue?: number;
}

export interface AiPerson {
  number: number;
  name: string;
  office?: string;
  position?: string;
  sources: string[];
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
  topicIn?: string | null = null;
  currentEnv = environment.name;

  currentYear = new Date().getFullYear();

  answer = '';
  //loading = false;
  activeQuestion: string | null = null;
  activeQuestionId: number | null = null;

  solutionTitle = '';
  solutions: Solution[] = [];
  loadingSolutions = false;
  showPatienceMessage = false;
  private patienceTimer: any;
  formattedHtml: any;
  leaders: AiPerson[] = [];


  solutionsError ='';
  ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private route: ActivatedRoute,
    private ai: AiService,
    private cdr: ChangeDetectorRef,
    private topicContext: TopicContextService
  )  { }

  ngOnInit(): void {
    const state = history.state;
    const topicId = state.topic;

    this.tableName = 'Politician';

    this.politician = state.solution.startsWith('politician-')
      ? this.setStateTopic(state.solution)
      : TOPICS.find(t => t.id === state.solution);

    this.topic = TOPICS.find(t => t.title === state.topic);

    if(this.topic){
      this.topicContext.setTopic(this.topic, 'politician support'); 
    }    
    
    if(this.politician){
      this.loadSolutions(this.politician, state.topic, state.solutionTitle);
    }
    
  }


  loadSolutions(politician: Topic, topic: string, title: string): void {
    this.loadingSolutions = true;
    this.showPatienceMessage = false;
    this.solutions = [];

    this.questionAsked = `Can you identify up to 5 current elected officials who publicly support ` + title + ` in relation to ` + topic  + `. For each official, return:
    - Name
    - Office and jurisdiction
    - Brief position summary (max 3 sentences)
    - 1-3 reputable source links confirming their stance`; 

    // Start 3-second timer
    this.patienceTimer = setTimeout(() => {
      if (this.loadingSolutions) {
        this.showPatienceMessage = true;
        this.cdr.markForCheck();   // required for OnPush
      }
    }, 3000);

    this.ai.ask(this.currentEnv, this.tableName, 'politician-' + title, this.questionAsked, ).subscribe({      
      next: res => {

      // Parse AI response
      const parsed = this.parseAiLeaders(res.response);

      // Title
      this.solutionTitle = parsed.title;

      // Structured leader data
      this.leaders = parsed.leaders;

      // Render HTML
      this.formattedHtml = this.renderLeadersHtml(parsed.leaders);

      this.loadingSolutions = false;
      this.showPatienceMessage = false;

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

  private parseAiLeaders(text: string): {
    title: string;
    leaders: AiPerson[];
  } {

    const leaders: AiPerson[] = [];

    // split by numbered sections
    const entries = text.split(/\n(?=\d+\.\s)/);

    for (const entry of entries) {

      const numberMatch = entry.match(/^(\d+)\.\s*(.+)/);
      if (!numberMatch) continue;

      const number = Number(numberMatch[1]);
      const name = numberMatch[2].split('\n')[0].trim();

      const officeMatch = entry.match(/Office:\s*([\s\S]*?)(?=-\s*Position(?: Summary)?:|\nSources:|$)/i);
      const positionMatch = entry.match(/-?\s*Position(?: Summary)?:\s*([\s\S]*?)(?=-?\s*Sources:|$)/i);

      const sources: string[] = [];
      const sourceRegex = /https?:\/\/[^\s)]+/g;
      let m;

      while ((m = sourceRegex.exec(entry)) !== null) {
        sources.push(m[0]);
      }

      leaders.push({
        number,
        name,
        office: officeMatch?.[1]?.trim(),
        position: positionMatch?.[1]?.trim(),
        sources
      });
    }

    return {
      title: "Leaders",
      leaders
    };
  }

  private renderLeadersHtml(leaders: AiPerson[]): string {

    return leaders.map(p => `
      <div class="leader-block">
        <strong>${p.number}. ${p.name}</strong><br>

        ${p.office ? `<br><strong><em>Office:</em></strong> ${p.office}<br>` : ''}

        ${p.position ? `<br><strong><em>Position:</em></strong><br>
        &nbsp;&nbsp;&nbsp;&nbsp;${p.position}<br>` : ''}

        ${p.sources.length ? `
          <br><strong><em>Sources:</em></strong><br>
          ${p.sources.map(s => `&nbsp;&nbsp;&nbsp;&nbsp;<a href="${s}" target="_blank">${s}</a>`).join('<br>')}
        ` : ''}
      </div>
    `).join('<br>');
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

  formatPoliticianText(text: string): string {
    if (!text) return '';

    let formatted = text.replace(/\r\n/g, '\n');

    // Bold the first line (number + name)
    formatted = formatted.replace(
      /^(\d+\.\s+[^\n]+)/,
      '<strong>$1</strong>'
    );

    // Bold section labels and add spacing
formatted = formatted
  .replace(/\*\*/g, '')                    // remove markdown bold
  .replace(/https:\s*\/\//g, 'https://')   // fix broken URLs
  .replace(/- Office:/g, '<br><strong>Office:</strong> ')
  .replace(/- -Office:/g, '<strong>Office:</strong> ')
  .replace(/- – Governor of/g, '<strong>Office:</strong> Governor of ')
  .replace(/Position Summary:/g, '<br><br><strong>Position:</strong> ')
  .replace(/- Position Summary:/g, '<br><strong>Position:</strong> ')
  .replace(/-Position Summary:/g, '<br><br><strong>Position:</strong> ')
  .replace(/Sources:/g, '<br><br><strong>Sources:</strong>')
  .replace(/- Sources:/g, '<br><strong>Sources:</strong><br>')
  .replace(/-Sources:/g, '<br><br><strong>Sources:</strong>')
  .replace(/- https?:\/\//g, '<br>- https://')
  .replace(/(<br>\s*){2,}/g, '<br>');

    // Ensure space after colon if missing
    formatted = formatted.replace(/:\S/g, m => m[0] + ' ' + m[1]);

    // Put each source on its own line
    formatted = formatted.replace(/- https?:\/\//g, '<br>- https://');
    formatted = formatted.replace(/\*\*- https?:\/\//g, '<br>- https://');

    // add line break after last item
    formatted = formatted.replace(/^- (.*)$/gm, '- $1<br><br>');

    return formatted.trim();
  }

  ngOnDestroy() {
    this.topicContext.setTopic(null,''); // clean up when leaving page
  }  
}
