import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';
import { ControlContainer } from '@angular/forms';
import { throwToolbarMixedModesError } from '@angular/material';
import { delay } from 'q';

@Component({
  selector: 'app-three-players',
  templateUrl: './three-players.component.html',
  styleUrls: ['./three-players.component.css']
})

export class ThreePlayersComponent implements OnInit {
  username: any= new Date().getTime();
  currentQuestion:any;
  start:boolean=false;
  connection: any;
  counter:number = 0;
  score:number = 0;
  topic:string = "politics";
  constructor(private http: HttpClient ) { }

  ngOnInit() {

   this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .build();

    this.connection.start().
        then(() => console.log('connection established'))
        .catch((err) => console.log("Error::: ", err));

    this.connection.on("ClockStarted",(tick: number)=>{
      this.counter=tick;
      });
    this.connection.on("SendQuestions",(message:any)=>{
      this.start=true;
      this.currentQuestion = message;
      this.connection.send("StartClock");
      }
      );
  }
  sleep()
  {
    this.connection.send("OnConnectedAsync",this.username,this.topic,3);
  }


  scoreCalculator(optionsobject:any){
    if(optionsobject.isCorrect==true)
    {
      this.score+=this.counter*2;
    }
    else
    {
      this.score+=0;
    }
    this.connection.send("sendScore", this.username, this.score);
  }
}

