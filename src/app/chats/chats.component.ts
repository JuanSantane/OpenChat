import { Component, OnInit } from '@angular/core';
import { Chat } from '../Chat';
import { EventlogService } from '../eventlog.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  chats: Chat[] = [
    { id: 0, name: 'general', messages: ['a','b'] },
    { id: 1, name: 'room1', messages: [] },
    { id: 2, name: 'room2', messages: [] }
  ];

  selectedChat: Chat;

  constructor(private eventLog: EventlogService) { }

  ngOnInit() {
  }

  onChatSelected(chat: Chat): void{
    this.selectedChat = chat;
    this.eventLog.appendLog(`Chat room selected: ${chat.id}=${chat.name}`);
  }

}
