import { Routes } from '@angular/router';
import { StoryComponent } from './pages/story/story';
import { LowHangingFruitComponent } from './pages/low-hanging-fruit/low-hanging-fruit';
import { StateBoardComponent } from './pages/state-board/state-board';
import { CurrentBoard } from './pages/current-events/current-board';
//import { TopicsComponent } from './pages/topics/topics';
import { TopicDetailComponent } from './pages/topics/topic-detail';
import { PoliticianDetailComponent } from './pages/politicians/politicians-detail';
import { ContactUsComponent } from './pages/contact-us/contact-us';
import { ContactUsLandingComponent } from './pages/contact-us/contact-us-landing';
import { DonateComponent } from './pages/donate/donate.component';

export const routes: Routes = [
  { path: '', redirectTo: 'story', pathMatch: 'full' },
  { path: 'story', component: StoryComponent },
  { path: 'low-hanging-fruit', component: LowHangingFruitComponent, data: { section: 'low-hanging-fruit' } },
  { path: 'state-board', component: StateBoardComponent, data: { section: 'state-board' } },
  { path: 'current-events', component: CurrentBoard, data: { section: 'current-board' } },
  { path: 'topic/:id', component: TopicDetailComponent, data: { section: 'topic' } },
  { path: 'politician/:id', component: PoliticianDetailComponent, data: { section: 'topic' } },
  { path: 'contact-us', component: ContactUsComponent, data: { section: 'contact-us' } },
  { path: 'contact-us-landing', component: ContactUsLandingComponent, data: { section: 'contact-us-landing' } },
  { path: 'donate', component: DonateComponent, data: { section: 'donate' } },
  //{ path: '', redirectTo: 'state-board', pathMatch: 'full' }
];
