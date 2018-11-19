import { Component, OnInit } from '@angular/core';
// import { PlayerService } from '../player.service';
export interface Country {
  value: string;
  viewValue: string;
 }
// export interface Players{
//  name:string;
//   email:string;
//   password:string;
//   country:string;
//   no_of_games:number;
//   no_of_followers:number;
//   no_of_following:number;
// }
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})



export class PlayersComponent implements OnInit {

  // countries:string[]=["India", "Pakistan", "Afghanistan"];
  constructor() { }
  country: Country[] = [
    {value: '0', viewValue: 'India'},
    {value: '1', viewValue: 'Pak'},
    {value: '2', viewValue: 'Nepal'}
  ];

  // player: Players={
  //           name:this.player.name,
  //           country:this.player.country,
  //           email:this.player.email,
  //           password:this.player.password,
  //           no_of_games:0,
  //           no_of_followers:0,
  //           no_of_following:0,
  // }


  // emailFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.email,
  // ]);

  // matcher = new MyErrorStateMatcher();
  emailPattern= "^[a-z0-9._%+-]+@[a-z0-9,-]+\.[a-z]{2,4}$";
  ngOnInit() {
  }

  // onSubmit(){

  //   this.service.PostData(this.player);


  // }
  // onClear() {
  //   this.service.form.reset();
  //   this.service.initializeFormGroup();
  //   this.notificationService.success(':: Submitted successfully');
  // }
}
