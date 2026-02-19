
// common imports
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-contact-us',
  imports: [FormsModule, RouterModule],
  templateUrl: './contact-us.html',
  styleUrls: ['contact-us.css'],
})

export class ContactUsComponent  {
    model = {
    subject: '',
    email: '',
    message: ''
  };

  emailSuggestion: string | null = null;

  private commonDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com'
  ];

  success = false;

  constructor(private router: Router, private http: HttpClient) {}

  submit() {
    console.log("MODEL:", this.model);
    this.http.post(
      'https://de6z90hmxf.execute-api.us-west-2.amazonaws.com/Prod/contact',
      this.model
    ).subscribe({
      next: () => this.success = true,
      error: () => alert('Failed to send message')
    });
    this.success = true;
    this.router.navigate(['/contact-us-landing'], { state: { action: this.model.subject } });
  }

  onEmailChange(value: string) {
    console.log("INPUT:", value);
    this.emailSuggestion = this.getSuggestion(value);
  }

  private getSuggestion(email: string): string | null {
    console.log("Start:", email);
    if (!email || !email.includes('@')) return null;
    console.log("Start:", email);
    const [localPart, domain] = email.split('@');
    console.log("domain:", domain);
    if (!domain) return null;

    let closestDomain: string | null = null;
    let smallestDistance = 99;

    for (const common of this.commonDomains) {
      const distance = this.levenshtein(domain, common);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestDomain = common;
      }
    }

    console.log("Start:", email);

    if (smallestDistance <= 2 && closestDomain !== domain) {
      return `${localPart}@${closestDomain}`;
    }

    return null;
  }

  private levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  applySuggestion() {
    console.log("applySuggestion",this.emailSuggestion);
    if (this.emailSuggestion) {
      this.model.email = this.emailSuggestion;
      this.emailSuggestion = null;
    }
  }

}



