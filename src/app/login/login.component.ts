import { Component, OnInit, Inject } from '@angular/core';
import { PlayerService } from '../player.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as jwtDecode from 'jwt-decode';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string;
  password: string;
  token: any;
  fullName: string;
  constructor(
    private service: PlayerService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  CheckValidation(): void {
    this.service.GetUser(this.email, this.password).subscribe((result: any) => {
      // let token = parseJwt(result);
      console.log("Successfully Logged IN");
      this.cookieService.set('UserLoginAPIToken', result.token);
      console.log(this.cookieService.get('UserLoginAPIToken'));
      const decodedJwtData = jwtDecode(result.token);
      this.fullName = decodedJwtData.Name;

      window.location.href = environment.socialFrontend;
    }, (err) => { this.Message(); });
  }

  navigateToSignupPage() {
    console.log("Singup clicked");
    this.router.navigate(['/signup']);
  }

  Message() {
    alert('Incorrect Credentials... Try Again..');
  }
}
