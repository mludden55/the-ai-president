import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-contact-us-landing',
  templateUrl: './contact-us-landing.html',
  styleUrls: ['contact-us.css']
})

export class ContactUsLandingComponent {
  action: string = '';
  
  constructor(private route: ActivatedRoute) { }
  
  message: string | null = '';
  async ngOnInit() {  
    const state = history.state;
    if (state && state.action) {
      this.action = state.action;
    }
  }
}
