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
  questionCounter = 0;
  // shouldDisplayQuestions = false;
  currentQuestion : any;
  users_found:boolean=false;
  start:boolean=false;
  gameOver = false;
  username = new Date().getTime();
  connection:any;
  client_found: number=1;
  currentUser: any;
  otherUser: any;
  otherUserScore: number=0;
  op: any;
  isDisabled:boolean=false;
  topic: string = "topic";
  TopicSelected: boolean = false;
  Waiting: boolean = false;
  groupname:string;
  constructor(private http: HttpClient) { }

  ngOnInit() {

      this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/gameplayhub')
      .build();

      this.connection.start()
        .then(() => console.log('connection established'))
        .catch((err) => console.log("Error::: ", err));


    this.connection.on("ClockStarted",(tick: boolean)=> {
        this.gameClock();
    });

    this.connection.on("QuestionsReceived",(message:any)=> {
      this.start=true;
      this.currentQuestion = message;
    });

    this.connection.on("GetTicks",(counter:number)=> {
      this.counter=counter;
    });

    this.connection.on("GetScore",(username:string, score:number)=> {
      this.otherUser=username;
      this.otherUserScore=score;
    })

    this.connection.on("SendToGroup", (start:number)=>
    {
      if(start == 2)
      {
        console.log(this.username + " becomes admin");
        this.connection.send("StartClock", this.groupname);
      }
    });

    this.connection.on("usersConnected", (groupName:string)=>
    {
      this.groupname = groupName;
      if(this.groupname==null)
      {
        this.start =false;
        this.gameOver = true;
      }
      else
      {
        this.connection.send("AddToGroup", this.username, this.groupname, 2);
      }
    });

  }
  sleep(){
    this.TopicSelected = true;
    this.Waiting = true;
    // console.log(this.username + " chose " + this.topic);
    this.connection.send("OnConnectedAsync",this.username, this.topic, 2);
}

  gameClock(){
      this.connection.send("SendQuestions",this.groupname);
      const intervalMain = setInterval(() => {
        this.connection.send("SendTicks",this.groupname,this.counter--);
      if (this.counter < 0) {
        this.connection.send("SendQuestions", this.groupname);
        this.counter=10;
        this.questionCounter++;
        if(this.questionCounter>=7)
        {
          this.gameOver=true;
          clearInterval(intervalMain);
        }
      }
    }, 1000);

  }

  scoreCalculator(optionsobject:any){
  if(optionsobject.isCorrect==true){
    this.score+=this.counter*2;
  }
  else{
    this.score+=0;
  }
  this.connection.send("SendScore",this.username, this.score);
}

}

