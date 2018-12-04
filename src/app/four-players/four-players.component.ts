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
  selector: 'app-four-players',
  templateUrl: './four-players.component.html',
  styleUrls: ['./four-players.component.css']
})

export class FourPlayersComponent implements OnInit {
  counter = 10;
  score = 0;
  questionCounter = 0;
  currentQuestion: any;
  start = false;
  gameOver = false;
  username = new Date().getTime().toString();
  connection: any;
  currentUser: any;
  otherUser: any;
  otherUserScore = 0;
  isDisabled = false;
  topic = 'topic';
  TopicSelected = false;
  Waiting = false;
  groupname: string;
  options: Options[];
  notify: any;
  constructor(private http: HttpClient ) { }

  ngOnInit() {

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .build();

      this.connection.start().
       then(() => console.log('connection established')).
        catch((err) => console.log('Error::: ', err));

        this.connection.on('QuestionsReceived', (message: any) => {
          console.log("received questions");
          this.start = true;
          this.currentQuestion = message;
          this.options = [
            { 'optionName': this.currentQuestion.correctOption, 'isCorrect': true },
            { 'optionName': this.currentQuestion.otherOptionsList[0].option, 'isCorrect': false },
            { 'optionName': this.currentQuestion.otherOptionsList[1].option, 'isCorrect': false },
            { 'optionName': this.currentQuestion.otherOptionsList[2].option, 'isCorrect': false }
          ];
          this.options = this.shuffle(this.options);

        });

        this.connection.on('ProvideGroupId',(groupname:string) =>
        {
          console.log(groupname);
          this.groupname = groupname;
        })

        this.connection.on('NoOpponentsFound',() =>
        {
          console.log("users not found..");
        })

        this.connection.on('StartClock',() => {
          const intervalMain = setInterval(() => {
            this.counter--;
            if (this.counter <= 0) {
              this.counter = 10;
              clearInterval(intervalMain);
            }
          }, 1000);
        });

        this.connection.on('GetScore', (username: string, score: number) => {
          if(this.username != username)
          {
            // this.otherUser = username;
            // this.otherUserScore = score;
          }
          else {
            this.score = score;
          }
        });

        this.connection.on('GameOver', () => {
          this.gameOver = true;
        });
    }
    sleep() {
      this.TopicSelected = true;
      this.Waiting = true;
      this.connection.send('Init', this.username, this.topic, 4);

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

    scoreCalculator(optionsobject: any) {
      this.connection.send('CalculateScore', this.groupname, this.username, optionsobject, this.counter);
    }



}
