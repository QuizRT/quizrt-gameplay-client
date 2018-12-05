import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../home-page/home-page.component';
import { PlayerService } from '../player.service';
import { Router } from '@angular/router';
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
    private router : Router
    )
     { }

    CheckValidation(): void{
      this.service.GetUser(this.email, this.password).subscribe((result:any)=>
      {
        //this.token = JSON.parse(result);
        window.location.href = "http://172.23.238.164:7000/social";
        // this.token = result;
        console.log(result);
        this.AfterLogin();
      },(err)=> {this.Message();})
}
  CloseDialog1():void{
    this.dialogConfig.close();
  }

  AfterLogin() {
    console.log("-----token----" +this.token);

  }
  Message()  {
    alert("Incorrect Credentials... Try Again..");
  }
}
