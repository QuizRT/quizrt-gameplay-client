import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../home-page/home-page.component';
import { PlayerService } from '../player.service';

export class User {

}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  name: string;
  email: string;
  password: string;

  constructor(
    private service: PlayerService
  ) { }

  ngOnInit() { }

  closeDialog2(): void {
    this.service.PostUser(this.name, this.email, this.password);
    // console.log("signup successful");
  }
}
