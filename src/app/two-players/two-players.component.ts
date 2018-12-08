import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@aspnet/signalr';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { LoginComponent } from "../login/login.component";
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
export class Options {
  optionName: string;
  isCorrect: boolean;
}
@Component({
  selector: 'app-two-players',
  templateUrl: './two-players.component.html',
  styleUrls: ['./two-players.component.css']
})

export class TwoPlayersComponent implements OnInit {
  counter = 10;
  score = 0;
  questionCounter = 0;
  currentQuestion: any;
  start = false;
  gameOver = false;
  username:  string;
  connection: any;
  currentUser: any;
  otherUser: any;
  otherUserScore = 0;
  answered = false;
  topic = '';
  TopicSelected = false;
  waiting = false;
  groupname: string;
  options: string[];
  notify: any;
  noOpponentsFound:boolean =  false;
  gameplay:boolean=false;
  opponentsFound:boolean = false;


  constructor(public cookieService:CookieService, private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    // this.waiting = true;
    const token = this.cookieService.get('UserLoginAPItoken');
    const jwtData = token.split('.')[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);
    this.username = decodedJwtData.Name;
    // this.username = "Nishant";
    this.route.paramMap.subscribe(params => { this.topic = params.get('id'); });
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://172.23.238.164:7000/gameplayhub')
      .build();

      this.connection.start()
      .then(() => {
        console.log('Connection Established...');
        this.waiting = true;
        this.connection.send('Init', this.username, this.topic, 2);
      })
      .catch((err) => console.log('Error::: ', err));


    this.connection.on('QuestionsReceived', (message: any) => {
      console.log('received questions');
      this.opponentsFound = true;
      this.start = true;
      this.answered = false;
      this.waiting = false;
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
      this.waiting = false;
      this.gameplay = true;
      this.start = false;
      this.noOpponentsFound = true;
      this.gameOver = false;
      console.log('users not found..');
    });

    this.connection.on('StartClock', () => {
      this.counter = 10;
      const intervalMain = setInterval(() => {
        this.counter -= 1;
        if (this.counter <= 0) {

          clearInterval(intervalMain);
        }
      }, 1000);
    });

    this.connection.on('GetScore', (username: string, score: number) => {
      if (this.username != username) {
        this.otherUser = username;
        this.otherUserScore = score;
      } else {
        this.score = score;
      }
    });

    this.connection.on('GameOver', () => {
      this.gameOver = true;
    });

  }

  Home(){
      window.location.href = 'http://172.23.238.164:7000/social/';
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

  Route() {
    this.router.navigate([`/play/${this.topic}/single-player`])
  }

  scoreCalculator(optionsobject: any) {
    this.connection.send('CalculateScore', this.groupname, this.username, optionsobject, this.currentQuestion, this.counter);
  }

  // openSnackBar(message: string, action: number) {
  //   this.snackBar.open("Hi", "JustChecking", {
  //     duration: 2000,
  //   });
  // }

}

