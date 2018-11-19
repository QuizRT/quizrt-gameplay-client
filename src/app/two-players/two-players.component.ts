import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@aspnet/signalr';
import { ControlContainer } from '@angular/forms';
import { throwToolbarMixedModesError } from '@angular/material';
import { delay } from 'q';
@Component({
  selector: 'app-two-players',
  templateUrl: './two-players.component.html',
  styleUrls: ['./two-players.component.css']
})
export class TwoPlayersComponent implements OnInit {

  counter:number = 10;
  questions = [ ];
  score:number=0;
  questionCounter = 1;
  // shouldDisplayQuestions = false;
  currentQuestion : any;
  users_found:boolean=false;
  start:boolean=false;
  gameOver = false;
  username = new Date().getTime();
  connection:any;
  client_found: number=1;
  currentUser: any;
  forignuser: any;
  forignUserScore: number=0;
  op: any;
  isDisabled:boolean=false;
  group_id:string="hard_code";
  constructor(private http: HttpClient) { }

  ngOnInit() {


      this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://172.23.238.164:8082/chathub')
      .build();

      this.connection.start()
        .then(() => console.log('connection established'))
        .catch((err) => console.log("Error::: ", err));

      this.connection.on('users', (received_user: any) => {

          if(this.username != received_user) {
          this.client_found++;
          alert('Player 2 wants to play');
          this.forignuser=received_user;
          // this.connection.send("AddToGroup",received_user,this.group_id);
        }
      })
    this.connection.on('receive', (username:string, score:number) => {

      this.forignUserScore = score;
     this.forignuser = username;
      });

    this.connection.on('game',(gameOver:boolean)=>{
    this.gameOver=gameOver;
    });

  this.connection.on("usersDisconnect",(username:string)=> {

    alert(username+" decides to quit.Finishing game...");
    this.gameOver=true;

  });

  this.connection.on("Send",(username:string, group_id:string)=> {
    console.log(username +" is in "+ group_id);
  })

  this.connection.on('counter',(counter1:number, question:number)=> {
      // console.log(this.username+" is triggereing "+counter1);
      this.counter=counter1;
      if (this.counter <= 0) {
        this.isDisabled=false;
        if(this.users_found===true){

          this.nextQuestion();
        if(this.questionCounter>7)
        {
          this.gameOver=true;
          this.connection.send("gameOver",this.gameOver);
        }
      }
      }
    });

    this.connection.on('questionsToMulti',(question:any)=>{

      this.start=true;
      // console.log(question);
          this.currentQuestion=question;

    }
    )




  }
  sleep(){
    if(this.client_found==2 ) {

      alert('2 players joined');
      this.users_found=true;
    }
    this.connection.send("OnConnectedAsync",this.username);
    this.connection.send("AddToGroup", this.username, this.group_id);

  }

  endGame(){
    this.connection.send("OnDisconnectedAsync",this.username);
    // this.gameOver=true;
  }
  showQuestions()
  {

    this.start=true;
    // var cq=JSON.stringify(this.currentQuestion);
    this.connection.send("SendQuestionsToMulti",this.group_id);
    this.gameClock();


  }

  gameClock() {
  this.connection.send("StartClock",this.counter,this.questionCounter);
}

nextQuestion(){

    this.questionCounter++;
    this.connection.send("SendQuestionsToMulti",this.group_id);
    this.resetTimer();
 }




resetTimer(){

  this.counter=10;
  this.connection.send("StartClock",this.counter,this.questionCounter);
}

scoreCalculator(optionsobject:any){
  if(optionsobject.isCorrect==true)
  {
    // console.log("correct answer");
    this.score+=this.counter*2;
  }
  else{
    this.score+=0;
  }

  this.connection.send("sendScore", this.username, this.score);


}



}

