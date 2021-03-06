import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import { environment } from '../../environments/environment';

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
  noOpponentsFound: boolean =  false;
  gameplay: boolean=false;
  opponentsFound: boolean = false;


  constructor(public cookieService:CookieService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.otherUser = "...";
    const token = this.cookieService.get('UserLoginAPIToken');
    const decodedJwtData = jwtDecode(token);
    this.username = decodedJwtData.Name;
    this.route.paramMap.subscribe(params => { this.topic = params.get('id'); });
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://172.23.238.164:7000/gameplayhub')
      .build();

    this.connection.start()
    .then(() => {
      this.waiting = true;
      console.log('Connection Established...');
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
      const intervalMain = setInterval(() => {
        this.counter -= 1;
        if (this.counter <= 0) {
          this.counter = 10;
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
    window.location.href = environment.socialFrontend;
  }

  EndGame(){
    this.gameOver = true;
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
}

