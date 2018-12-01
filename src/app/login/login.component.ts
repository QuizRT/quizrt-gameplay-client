import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../home-page/home-page.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    public dialogConfig: MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData)
     { }

    closeDialog1(): void{
    this.dialogConfig.close();
  // ngOnInit() {
  // }
}
}