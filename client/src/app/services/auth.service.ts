import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import { ChatService } from './../chat/services/chat.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  constructor(private charService: ChatService) { }

  login(): Observable<boolean> {
    return of(true)
      .pipe(
        delay(1000),
        tap(val => this.isLoggedIn = val)
      );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.charService.disconnect();
  }
}
