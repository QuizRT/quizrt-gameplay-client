import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@aspnet/signalr';
import {delay} from 'q';
// import { Howl} from 'howler';


@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.css']
})
export class SinglePlayerComponent implements OnInit {
  counter = 10;
  score = 0;
  questionCounter = 0;
  currentQuestion: any;
  start = false;
  gameOver = false;
  connection: any;
  topic = '';
  TopicSelected = false;
  username: string = new Date().getTime().toString();
  groupname: string;
  options: string[];
  answered = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/gameplayhub')
      .build();

    this.connection.start()
      .then(() => console.log('connection established'))
      .catch((err) => console.log('Error::: ', err));

    this.connection.on('QuestionsReceived', (message: any) => {
      this.start = true;
      console.log("questions came");
      this.currentQuestion = message;
      this.options = [
        this.currentQuestion.correctOption,
        this.currentQuestion.otherOptionsList[0].option,
        this.currentQuestion.otherOptionsList[1].option,
        this.currentQuestion.otherOptionsList[2].option
      ];
      this.options = this.shuffle(this.options);
    });

    this.connection.on('GetScore',(username:string,score:number)=>
    {
      this.username = username;
      this.score = score

    });

    this.connection.on('StartClock',() => {
      this.counter = 10;
      const intervalMain = setInterval(() => {
        this.counter = this.counter - 0.1;
        if (this.counter <= 1) {

          clearInterval(intervalMain);
        }
      }, 100);
    });

    this.connection.on('ProvideGroupId',(groupname:string)=>{
      this.groupname = groupname;
    })

    this.connection.on('GameOver', () => {
      console.log("came to game over");
      this.gameOver = true;
    });


  }

  sleep() {
    this.TopicSelected = true;
    this.connection.send('Init', this.username, this.topic, 1);
  }

  scoreCalculator(option: any) {
    this.connection.send('CalculateScore', this.groupname, this.username, option, this.currentQuestion, this.counter);
  }



  shuffle(options : any) {
    var currentIndex = options.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = options[currentIndex];
      options[currentIndex] = options[randomIndex];
      options[randomIndex] = temporaryValue;
    }

    return options;
  }

}
