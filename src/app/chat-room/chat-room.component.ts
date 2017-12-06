import { Component, OnInit, Input } from '@angular/core';
import { Chat } from '../Chat';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  @Input() chat: Chat;
  message: string;


  constructor() { }

  ngOnInit() {
  }

  send():void{
    this.chat.messages.unshift(this.message);
    this.message = '';
  }

}
