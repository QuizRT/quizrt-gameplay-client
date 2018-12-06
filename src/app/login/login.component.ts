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

  email:string;
  password:string;
  token:any;
  constructor(
    public dialogConfig: MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service: PlayerService,
    private cookieService: CookieService
    )
     { }

    CheckValidation(): void{
      this.service.GetUser(this.email, this.password).subscribe((result:any)=>
      {
        // let token = parseJwt(result);
        let token = this.cookieService.get("UserLoginAPItoken");
        let jwtData = token.split('.')[1];
        let decodedJwtJsonData = window.atob(jwtData);
        let decodedJwtData = JSON.parse(decodedJwtJsonData);
        let userId = decodedJwtData.UserID;
        let fullName = decodedJwtData.Name;
        let email = decodedJwtData.Email;
         // this.cookieService.set(userId, fullName);
        console.log(userId+"  "+fullName+"  "+email);
        // window.location.href = "http://172.23.238.164:7000/social/";
        // console.log(result);
        this.AfterLogin();
      },(err)=> {this.Message();})
}
  closeDialog1(): void{
    this.dialogConfig.close();
  }

  AfterLogin() {
    console.log("-----token----");

  }
  Message()  {
    alert("Incorrect Credentials... Try Again..");
  }
}
