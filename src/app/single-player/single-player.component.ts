import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@aspnet/signalr';
// import { Howl} from 'howler';

class Options {
  optionName: string;
  isCorrect: boolean;
}
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
  topic = 'topic';
  TopicSelected = false;
  username: number = new Date().getTime();
  groupname: string;
  options: Options[];
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
      this.currentQuestion = message;
      this.options = [
        { 'optionName': this.currentQuestion.correctOption, 'isCorrect': true },
        { 'optionName': this.currentQuestion.otherOptionsList[0].option, 'isCorrect': false },
        { 'optionName': this.currentQuestion.otherOptionsList[1].option, 'isCorrect': false },
        { 'optionName': this.currentQuestion.otherOptionsList[2].option, 'isCorrect': false }
      ];
      this.options = this.shuffle(this.options);
    });
    this.connection.on('SendToGroup', (start: number) => {
      this.start = true;
      this.gameClock();
    });


    this.connection.on('usersConnected', (groupId: string) => {
      this.groupname = groupId;
      this.connection.send('AddToGroup', this.username, this.groupname, 2);
    });

  }

  sleep() {
    this.TopicSelected = true;
    this.connection.send('OnConnectedAsync', this.username, this.topic, 1);
  }

  gameClock() {
    this.connection.send('SendQuestions', this.groupname);
    const intervalMain = setInterval(() => {
      this.counter--;
      if (this.counter <= 0 || this.answered === true) {
        this.answered = false;
        this.connection.send('SendQuestions', this.groupname);
        this.counter = 10;
        this.questionCounter++;
        if (this.questionCounter >= 7) {
          this.gameOver = true;
          console.log("reached here");
          clearInterval(intervalMain);
        }
      }
    }, 1000);

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
    if (optionsobject.isCorrect == true) {
      this.score += this.counter * 2;
    } else {
      this.score += 0;
    }
  }
}
