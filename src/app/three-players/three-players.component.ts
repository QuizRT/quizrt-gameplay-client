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
  arr : any = [] ;
  connection1:any;
  no_of_players:number=1;
  username: any= new Date().getTime();
  users_found:boolean=false;
  counter:number=10;
  questionCounter:number=0;
  currentQuestion:any;
  questions:any=[];
  score:number=0;
  score1=[0,0];
  gameOver:boolean=false;
  start:boolean=false;
  shouldDisplayQuestions:boolean=false;
  max1:number=0;
  connection: any;
  constructor(private http: HttpClient ) { }

  ngOnInit() {

   this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .build();

    this.connection.start().
        then(() => console.log('connection established'))
        .catch((err) => console.log("Error::: ", err));

    this.connection.on('users',(username1:string)=>{
        // console.log(username1 +" connected");

      if(this.username!=username1){
          this.arr.push(username1);
          this.no_of_players++;
          if(this.arr.length>0) alert
          ('Player '+ this.no_of_players+' wants to play');
        }
    })

    this.connection.on('receive', (username:string, score:number) => {
       if(username==this.arr[0]){
          this.score1[0]=score;
        }
       else if(username==this.arr[1]){
         this.score1[1]=score;
        }
      // console.log(username, score, "this is the message form the server")
     });

    this.connection.on('counter',(counter1:number,questionCounter:number)=> {
        this.counter=counter1;
        if (this.counter <= 0) {
           if (this.users_found==true){ 
          //  this.nextQuestion();
            if(questionCounter>=7){
            // console.log("Game Over");
              this.gameOver=true;
              this.max1= Math.max(this.score1[0],this.score1[1],this.score);
            }
           }
         }
     });

    this.connection.on('questions',(question:string)=>{
      this.currentQuestion=JSON.parse(question);
      }
    );

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
  sleep(){
    if(this.no_of_players==3 ) {
      alert('3 players joined');
      this.users_found=true;
    }
    this.connection1.send("OnConnectedAsync",this.username);
  }
  //endGame(){
    //   this.connection.send("OnDisconnectedAsync",this.username);
    //   // this.gameOver=true;
    // }

  showQuestions()
  {

    this.start=true;
    // console.log('called showQuestions');
    this.http.get('http://172.23.238.164:8080/api/quizrt/question').subscribe((res: any) => {
    this.questions = res;
    this.currentQuestion = this.questions[Math.floor((Math.random() * 100) + 1)];
    var cq=JSON.stringify(this.currentQuestion);
    // console.log(JSON.stringify(this.currentQuestion));
    // if(this.arr.length>1 && this.letsplay===0)
    // this.connection1.send("sendQuestions",cq);
    // this.shouldDisplayQuestions = true;
    // this.gameClock();
    // console.log(this.questions[0].options);

    });
  }
  // nextQuestion(){
  //   this.questionCounter++;
  //   this.currentQuestion = this.questions[Math.floor((Math.random() * 100) + 1)];
  //   var cq=JSON.stringify(this.currentQuestion);
  //   // if(this.arr.length>1 && this.letsplay===0)
  //     this.connection1.send("sendQuestions",cq);
  //     this.resetTimer();
  //  }

  // resetTimer(){
  //   this.counter=10;
  //   this.connection1.send("StartClock",this.counter,this.questionCounter);
  // }

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

