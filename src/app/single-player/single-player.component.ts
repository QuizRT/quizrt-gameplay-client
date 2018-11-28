import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@aspnet/signalr';
// import { Howl} from 'howler';
@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.css']
})
export class SinglePlayerComponent implements OnInit {
  counter:number = 10;
  questions = [ ];
  score:number=0;
  questionCounter = 0;
  currentQuestion : any;
  start:boolean=false;
  isClickedOnce:boolean=false;
  gameOver = false;
  connection:any;
  topic:string="xyz";
  username:number= new Date().getTime();

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5001/gameplayhub')
    .build();

    this.connection.start()
        .then(() => console.log('connection established'))
        .catch((err) => console.log("Error::: ", err));

    this.connection.on("SendQuestions",(response: any)=>
    {
      this.currentQuestion = response;

    });

  }


  showQuestions()
  {
    this.start=true;
    this.connection.send("OnConnectedAsync",this.username, this.topic, 1);
  }

scoreCalculator(optionsobject: any){
    if(optionsobject.isCorrect==true)
  {
    this.score+=this.counter*2;
  }
  else{
    this.score+=0;
  }
 }
}
