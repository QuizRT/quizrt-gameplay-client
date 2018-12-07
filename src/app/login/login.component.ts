import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../home-page/home-page.component';
import { PlayerService } from '../player.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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
    public dialogConfig: MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service: PlayerService,
    private cookieService: CookieService
  ) { }

  CheckValidation(): void {
    this.service.GetUser(this.email, this.password).subscribe((result: any) => {
      // let token = parseJwt(result);
      const token = this.cookieService.get('UserLoginAPItoken');
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      const userId = decodedJwtData.UserID;
      this.fullName = decodedJwtData.Name;
      const email = decodedJwtData.Email;
      console.log(userId + '  ' + this.fullName + '  ' + email);
      window.location.href = 'http://172.23.238.164:7000/social/';
    }, (err) => { this.Message(); });
  }
  closeDialog1(): void {
    this.dialogConfig.close();
  }

  Message() {
    alert('Incorrect Credentials... Try Again..');
  }
}
