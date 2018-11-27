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
  forignuser: any;
  forignUserScore: number=0;
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
      console.log("came to clock ");
      if(tick == true)
      {
        while(this.counter>=0 && this.questionCounter<7)
        {
          delay(1000);
          this.counter--;
          if(this.counter<0)
          {
            this.counter = 10;
            this.questionCounter++;
            // this.connection.send("SendQuestions",this.groupname);

          }
        }
        if(this.questionCounter===7)
        {
          this.gameOver = true;
        }

      }
    });

    this.connection.on("QuestionsReceived",(message:any)=> {
      this.start=true;
      this.currentQuestion = message;
      // this.connection.send("StartClock",this.groupname);
    });

    this.connection.on("SendToGroup", (start:boolean)=>
    {
      console.log("connected to group");
      if(start == true)
      {
        console.log(" came to group ");
        this.connection.send("SendQuestions",this.groupname);
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
        this.connection.send("AddToGroup", this.username, this.groupname);
      }
    });

  }
  sleep(){
    this.TopicSelected = true;
    this.Waiting = true;
    // console.log(this.username + " chose " + this.topic);
    this.connection.send("OnConnectedAsync",this.username, this.topic, 2);
}

  scoreCalculator(optionsobject:any){
  if(optionsobject.isCorrect==true){
    this.score+=this.counter*2;
  }
  else{
    this.score+=0;
  }
}

}

