import { Component, OnInit, ViewChild } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LoginComponent } from "../login/login.component";
import { CookieService } from 'ngx-cookie-service';
// class Options {
//   optionName: string;
//   isCorrect: boolean;
// }
@Component({
  selector: 'app-three-players',
  templateUrl: './three-players.component.html',
  styleUrls: ['./three-players.component.css']
})

export class ThreePlayersComponent implements OnInit {
  username: string;
  currentQuestion: any;
  start = false;
  gameOver = false;
  connection: any;
  counter = 10;
  score = 0;
  topic = 'topic';
  Waiting = false;
  groupname: string;
  TopicSelected = false;
  questionCounter = 0;
  options: string[];
  answered:boolean = false;
  constructor(private route: ActivatedRoute, private cookieService: CookieService) { }

  ngOnInit() {
    const token = this.cookieService.get('UserLoginAPItoken');
    const jwtData = token.split('.')[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);
    this.username = decodedJwtData.Name;
    this.route.paramMap.subscribe(params => { this.topic = params.get('id'); });
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://172.23.238.164:7000/gameplayhub')
      .build();



      this.connection.on('QuestionsReceived', (message: any) => {
        console.log('received questions');
        this.start = true;
        this.answered  = false;
        this.currentQuestion = message;
        this.options = [
          this.currentQuestion.correctOption,
          this.currentQuestion.otherOptionsList[0].option,
          this.currentQuestion.otherOptionsList[1].option,
          this.currentQuestion.otherOptionsList[2].option
        ];
        this.options = this.shuffle(this.options);

      });

      this.connection.on('ProvideGroupId', (groupname: string) => {
        console.log(groupname);
        this.groupname = groupname;
      });

      this.connection.on('NoOpponentsFound', () => {
        console.log('users not found..');
      });

      this.connection.on('StartClock', () => {
        this.counter = 10;
        const intervalMain = setInterval(() => {
          this.counter-=0.1;
          if (this.counter <= 0.1) {

            clearInterval(intervalMain);
          }
        }, 100);
      });

      this.connection.on('GetScore', (username: string, score: number) => {
        if (this.username != username) {
          // this.otherUser = username;
          // this.otherUserScore = score;
        } else {
          this.score = score;
        }
      });

      this.connection.on('GameOver', () => {
        this.gameOver = true;

      });

  }
  sleep() {
    this.connection.start().
    then(() => {console.log('connection established');
    this.TopicSelected = true;
    this.Waiting = true;
    this.connection.send('Init', this.username, this.topic, 3); })
    .catch((err) => console.log('Error::: ', err));


  }


  shuffle(options: any) {
    let currentIndex = options.length, temporaryValue, randomIndex;

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

  scoreCalculator(optionsobject: any) {
    this.connection.send('CalculateScore', this.groupname, this.username, optionsobject, this.currentQuestion, this.counter);
  }


}

