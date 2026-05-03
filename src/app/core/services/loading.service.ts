import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly activeRequests = new BehaviorSubject(0);
  readonly loading$ = this.activeRequests.asObservable();

  show(): void {
    this.activeRequests.next(this.activeRequests.value + 1);
  }

  hide(): void {
    this.activeRequests.next(Math.max(0, this.activeRequests.value - 1));
  }
}
