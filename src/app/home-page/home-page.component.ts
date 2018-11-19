import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {PlayersComponent} from '../players/players.component';
import {LoginComponent} from '../login/login.component';
import {AuthService, GoogleLoginProvider} from 'angular-6-social-login';

export interface DialogData {
  name: string;
  country:string;
  password:string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent {
name: string;
country:string;
password: string;
  constructor(private dialog: MatDialog, private socialAuthService: AuthService){ }

public socialSignIn(socialPlatform: string){
  let socialPlatformProvider;
  if(socialPlatform== "google"){
    socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
  }
  this.socialAuthService.signIn(socialPlatformProvider).then(
    (userData)=> {console.log(socialPlatform +" sign in data: ", userData);}
  );
}

openDialog(): void {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.width = "40%";
  this.dialog.open(PlayersComponent,dialogConfig);
}

openDialog1():void {
  const dialogConfig=new MatDialogConfig();
  dialogConfig.disableClose=false;
  dialogConfig.autoFocus = true;
  dialogConfig.width = "40%";
  this.dialog.open(LoginComponent,dialogConfig);
}

// onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }

}
