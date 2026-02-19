import { Component } from '@angular/core';
import { AiService } from '../../core/services/ai';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

interface StateOption {
  code: string;
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-state-board',
  templateUrl: './state-board.html',
  styleUrl: './state-board.css',
  imports: [CommonModule, MarkdownModule, RouterModule]
})


export class StateBoardComponent{
  constructor(
    private router: Router,
    private ai: AiService,
    private cdr: ChangeDetectorRef
  ) {}
  states: StateOption[] = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ];

  answer = '';
  loading = false;
  showAnswer = false;
  activeQuestionId: string | null = null;
  currentEnv = environment.name;

  onStateSelected(stateCode: string): void {
    if (!stateCode) return;

    // Map state → topic slug
    const slug = this.mapStateToTopic(stateCode);

    this.router.navigate(['/topic', slug], {
      queryParams: { from: 'state-board' }
    });
  }

  mapStateToTopic(stateCode: string): string {
    const map: Record<string, string> = {
      AL: 'state-al',
      AK: 'state-ak',
      AZ: 'state-az',
      AR: 'state-ar',
      CA: 'state-ca',
      CO: 'state-co',
      CT: 'state-ct',
      DE: 'state-de',
      FL: 'state-fl',
      GA: 'state-ga',
      HI: 'state-hi',
      ID: 'state-id',
      IL: 'state-il',
      IN: 'state-in',
      IA: 'state-ia',
      KS: 'state-ks',
      KY: 'state-ky',
      LA: 'state-la',
      ME: 'state-me',
      MD: 'state-md',
      MA: 'state-ma',
      MI: 'state-mi',
      MN: 'state-mn',
      MS: 'state-ms',
      MO: 'state-mo',
      MT: 'state-mt',
      NE: 'state-ne',
      NV: 'state-nv',
      NH: 'state-nh',
      NJ: 'state-nj',
      NM: 'state-nm',
      NY: 'state-ny',
      NC: 'state-nc',
      ND: 'state-nd',
      OH: 'state-oh',
      OK: 'state-ok',
      OR: 'state-or',
      PA: 'state-pa',
      RI: 'state-ri',
      SC: 'state-sc',
      SD: 'state-sd',
      TN: 'state-tn',
      TX: 'state-tx',
      UT: 'state-ut',
      VT: 'state-vt',
      VA: 'state-va',
      WA: 'state-wa',
      WV: 'state-wv',
      WI: 'state-wi',
      WY: 'state-wy'
    };

    return map[stateCode] ?? 'state-tx';
  }


  /*ask(topic: string, question: string, questionId: string) {
    console.log("BeginAsk:", question);
    this.loading = true;
    this.answer = '';
    this.showAnswer = true;
    this.activeQuestionId = questionId;

    this.ai.ask(this.currentEnv, topic, question, 'BIG').subscribe({
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

  closeAnswer() {
    this.activeQuestionId = null;
  }
}
