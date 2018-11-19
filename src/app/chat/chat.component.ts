import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  constructor() { }
  username:any = new Date().getTime();
  connection1:any;

  ngOnInit() {
    const divMessages1: HTMLDivElement = document.querySelector('#divMessages1');
    const tbMessage1: HTMLInputElement = document.querySelector('#tbMessage1');
    const btnSend1: HTMLButtonElement = document.querySelector('#btnSend1');
    let arr: any=[];



    // let message:string;


    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .build();
      connection.start().then(() => console.log('connection established')).catch((err) => console.log("Error::: ", err));
      this.connection1=connection;
      // connection.on("users",(username1:string)=> {
      //   if(username1!=this.username)
      //   {
      //     arr.push(username1);
      //     console.log(username1+ " connected");

      //   }
      // });
      connection.on('messageReceived',(username:string, message:string)=>{
        let m1 = document.createElement('div');
        console.log(username+ " messaged "+message);
        m1.innerHTML =
          `<div class='message__author'>${username}</div><div>${message}</div>`;

        divMessages1.appendChild(m1);
      // divMessages1.scrollTop = divMessages1.scrollHeight;
    });

    tbMessage1.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        send1();
      }
    });

    btnSend1.addEventListener('click', send1);




  function send1(){
    console.log(this.username +" : "+ tbMessage1.value);
      connection.send("newMessage", this.username, tbMessage1.value)
      .then(() => tbMessage1.value="");

  }
}



}
