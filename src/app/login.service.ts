import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class LoginService {
  private userLoggedIn: boolean;
  constructor(private cookieService) {
    const token = this.cookieService.get('UserLoginAPIToken');
    if (token) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
  }

  isLoggedIn(): Observable<boolean> {
    return of(this.userLoggedIn);
  }
}
