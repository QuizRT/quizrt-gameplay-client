import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../home-page/home-page.component';
import { PlayerService } from '../player.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  Name:string;
  Email:string;
  Password:string;
  constructor(
    public dialogConfig: MatDialogRef<SignupComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service: PlayerService
  ) { }

  ngOnInit() {
  }

  closeDialog1(): void{
    this.dialogConfig.close();
}

closeDialog2(): void{
  this.service.PostUser(this.Name,this.Email, this.Password);
  // console.log("signup successful");
  this.closeDialog1();
}


}
