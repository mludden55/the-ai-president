import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopicContextService } from './services/topic-context.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Signal } from '@angular/core';
import { CurrentTopicState } from './services/topic-context.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('aipresident');

  isLowHangingFruitActive = false;
  isStateBoardActive = false;
  isContactUsActive = false;
  isContactUsLandingActive = false;
  isCurrentEventsActive = false;
  isDonateActive = false;

  // ✅ Now matches mapped output
  currentTopic!: Signal<CurrentTopicState | null>;

  constructor(
    private topicContext: TopicContextService,
    private router: Router
  )
  {
    this.currentTopic = toSignal(this.topicContext.topic$, { initialValue: null });
    this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      window.scrollTo(0, 0);
    }
  });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const route = this.router.routerState.root.firstChild;
        const section = route?.snapshot.data['section'];

        // Reset all flags first (important)
        this.resetActiveFlags();

        const state = history.state;

        if (section !== 'topic') {
          this.isLowHangingFruitActive = section === 'low-hanging-fruit';
          this.isStateBoardActive = section === 'state-board';
          this.isCurrentEventsActive = section === 'current-board';
          this.isContactUsActive = section === 'contact-us';
          this.isContactUsLandingActive = section === 'contact-us-landing';
          this.isDonateActive = section === 'donate';
          return;
        }

        // section === 'topic' → derive from query param
        let from = '';

        if (state?.from) {
          from = state.from;
        } else {
          from = route?.snapshot.queryParamMap.get('from') ?? '';
        }
        
        this.isLowHangingFruitActive = from === 'low-hanging-fruit';
        this.isStateBoardActive = from === 'state-board';
        this.isCurrentEventsActive = from === 'current-board';
        this.isContactUsActive = from === 'contact-us';
        this.isContactUsLandingActive = from === 'contact-us-landing';
        this.isDonateActive = from === 'donate';
      });
  }

  private resetActiveFlags() {
    this.isLowHangingFruitActive = false;
    this.isStateBoardActive = false;
    this.isCurrentEventsActive = false;
    this.isContactUsActive = false;
    this.isDonateActive = false;
  }

}
