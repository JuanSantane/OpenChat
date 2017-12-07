import { Component, OnInit } from '@angular/core';
import { Chat } from '../Chat';
import { EventlogService } from '../eventlog.service';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  selectedChat: Chat;

  constructor(private eventLog: EventlogService, public messenger: MessengerService) { }

  ngOnInit() {
  }

  onChatSelected(chat: Chat): void{
    this.selectedChat = chat;
    this.eventLog.appendLog(`Chat room selected: ${chat.id}=${chat.name}`);
  }

}
