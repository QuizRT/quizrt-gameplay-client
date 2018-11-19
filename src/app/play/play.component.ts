import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  breakpoint:number;
  play:boolean=false;
  constructor() { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 786) ? 1 : 4;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 786) ? 1 : 4;
  }

  openDialog(){
    this.play=!this.play;
  }

}
