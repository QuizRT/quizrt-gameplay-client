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

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.connection = new signalR.HubConnectionBuilder()
    .withUrl('http://172.23.238.164:8082/chathub')
    .build();

    this.connection.start()
        .then(() => console.log('connection established'))
        .catch((err) => console.log("Error::: ", err));

    this.connection.on("questions",(response: any)=>
    {this.currentQuestion = response;
    });

    this.connection.on("ReceiveMessage1",(i:number)=> {
      console.log(i + " lets see if it changes");
    });


    this.connection.send("SendMessageToCaller","Hi");
  }


  showQuestions()
  {
    this.start=true;
    // this.http.get('http://172.23.238.164:8080/api/quizrt/question').subscribe((res:any) => {
    // this.questions = res;
    // this.currentQuestion = this.questions[Math.floor((Math.random() * 800) + 1)];
    this.connection.send("SendQuestions");
    this.gameClock();

    // });
  }

  gameClock() {
    const intervalMain = setInterval(() => {
    this.counter--;
    if (this.counter <= 0) {
      this.nextQuestion();}
      if(this.questionCounter>6)
      {
        clearInterval(intervalMain);
        this.gameOver=true;
      }

  }, 1000);
}

nextQuestion(){
  this.questionCounter++;
  this.connection.send("SendQuestions");
  // this.currentQuestion = this.questions[Math.floor((Math.random() * 800) + 1)];
  this.resetTimer();
}

resetTimer(){
this.counter=10;

}

scoreCalculator(optionsobject: any){
    if(optionsobject.isCorrect==true)
  {
    this.score+=this.counter*2;
  }
  else{
    this.score+=0;
  }
  console.log("came here")
 this.nextQuestion();
 }
}
