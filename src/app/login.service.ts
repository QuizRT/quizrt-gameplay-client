import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class LoginService {
  constructor() {

  }

  isLoggedIn(): Observable<boolean> {
    return of(true);
  }
}
