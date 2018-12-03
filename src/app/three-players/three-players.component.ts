import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';
import { ControlContainer } from '@angular/forms';
import { throwToolbarMixedModesError } from '@angular/material';
import { delay } from 'q';

class Options {
  optionName: string;
  isCorrect: boolean;
}
@Component({
  selector: 'app-three-players',
  templateUrl: './three-players.component.html',
  styleUrls: ['./three-players.component.css']
})

export class ThreePlayersComponent implements OnInit {
  username: any = new Date().getTime();
  currentQuestion: any;
  start = false;
  gameOver = false;
  connection: any;
  counter = 0;
  score = 0;
  topic = 'topic';
  Waiting = false;
  groupname: string;
  TopicSelected = false;
  questionCounter = 0;
  options: Options[];
  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/gameplayhub')
      .build();

    this.connection.start().
      then(() => console.log('connection established'))
      .catch((err) => console.log('Error::: ', err));

    this.connection.on('ClockStarted', (tick: boolean) => {
      this.gameClock();
    });

    this.connection.on('QuestionsReceived', (message: any) => {
      this.start = true;
      this.currentQuestion = message;
      this.options = [
        { 'optionName': this.currentQuestion.correctOption, 'isCorrect': true },
        { 'optionName': this.currentQuestion.otherOptionsList[0].option, 'isCorrect': false },
        { 'optionName': this.currentQuestion.otherOptionsList[1].option, 'isCorrect': false },
        { 'optionName': this.currentQuestion.otherOptionsList[2].option, 'isCorrect': false }
      ];

    });

    this.connection.on('GetTicks', (counter: number) => {
      this.counter = counter;
    });

    this.connection.on('GetScore', (username: string, score: number) => {
      // this.otherUser=username;
      // this.otherUserScore=score;
    });

    this.connection.on('SendToGroup', (start: number) => {
      if (start == 3) {
        console.log(this.username + ' becomes admin');
        this.connection.send('StartClock', this.groupname);
      }
    });

    this.connection.on('usersConnected', (groupName: string) => {
      this.groupname = groupName;
      if (this.groupname == null) {
        this.start = false;
        this.gameOver = true;
      } else {
        this.connection.send('AddToGroup', this.username, this.groupname, 3);
      }
    });

    this.connection.on('GameOver', () => {
      this.gameOver = true;
    });


  }
  sleep() {
    this.TopicSelected = true;
    this.Waiting = true;
    // console.log(this.username + " chose " + this.topic);
    this.connection.send('OnConnectedAsync', this.username, this.topic, 3);
  }

  gameClock() {
    this.connection.send('SendQuestions', this.groupname);
    const intervalMain = setInterval(() => {
      this.counter--;
      this.connection.send('SendTicks', this.groupname, this.counter);
      if (this.counter <= 0) {
        this.connection.send('SendQuestions', this.groupname);
        this.counter = 10;
        this.questionCounter++;
        if (this.questionCounter > 7) {
          this.gameOver = true;
          this.connection.send('GameOver', this.groupname);
          clearInterval(intervalMain);
        }
      }
    }, 1000);

  }

  scoreCalculator(optionsobject: any) {
    if (optionsobject.isCorrect == true) {
      this.score += this.counter * 2;
    } else {
      this.score += 0;
    }
    this.connection.send('SendScore', this.username, this.score);
  }

}

