import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ErrorLoggerService {
  client: any;

  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  private hideFormSubject = new BehaviorSubject<boolean>(false);

  error$ = this.errorMessageSubject.asObservable();
  hideForm$ = this.hideFormSubject.asObservable();


  showError(message: string) {
    this.errorMessageSubject.next(message);
    this.hideFormSubject.next(true); // Trigger hiding the form
  }

  clearError() {
    this.errorMessageSubject.next(null);
    this.hideFormSubject.next(false); // Re-enable form display
  }

  async logError(log: {
    query: string;
    loginId: string;
    template: string;
    error: any;
  }) {
    const errorMessage = log.error?.message || 'Unknown error';
    const stackTrace = log.error?.stack || '';

    const input = {
      timestamp: new Date().toISOString(),
      query: log.query,
      loginId: log.loginId,
      template: log.template,
      errorMessage,
      stackTrace,
    };

    if (!this.client) {
      console.warn('GraphQL client not ready. Skipping error log.');
      return;
    }

    /*try {
      await this.client.graphql({
        query: createErrorLog,
        variables: {
          input: {
            timestamp: new Date().toISOString(),
            query: log.query,
            loginId: log.loginId,
            template: log.template,
            errorMessage,
            stackTrace
          }
        }
      });
    } catch (loggingError) {
      console.error('Failed to log error to database:', loggingError);
    }
      */
  }
}
