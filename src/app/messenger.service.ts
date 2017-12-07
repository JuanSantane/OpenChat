import { Injectable, OnInit } from '@angular/core';
import { Chat } from './Chat';
import { Observable } from 'rxjs/Observable';
import {
  MqttMessage,
  MqttModule,
  MqttService,
  MqttServiceOptions
} from 'ngx-mqtt';
import { EventlogService } from './eventlog.service';
import { ConnectionEvent } from './connectionEvent';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ChatMessage } from './chatMessage';
import { MqttClient } from 'mqtt';
import { IClientOptions } from 'mqtt/types/lib/client-options';

export const MQTT_SERVICE_OPTIONS: MqttServiceOptions = {
  hostname: 'm14.cloudmqtt.com',
  port: 30049,
  connectOnCreate: false,
  username: 'ufjjyhzj',
  password: 'nRqQ6glDGNnI',
  protocol: 'wss',
  rejectUnauthorized: false,
  clientId: 'clientId-dfsdf',
  keepalive: 60,
  clean: true
};

export function mqttServiceFactory() {
  return new MqttService(MQTT_SERVICE_OPTIONS);
}


@Injectable()
export class MessengerService {
  //var a:MqttServiceOptions;
  connectionEventMsg$: Observable<MqttMessage>;
  private chatRoomsMap: Map<number, Chat> = new Map();
  public chatRooms: Chat[] = [];
  mqtt: MqttService;
  
  hostname = 'm14.cloudmqtt.com';
  port = 30049;
  username: 'ufjjyhzj';
  password: 'nRqQ6glDGNnI';

  myDisplayName: string = `user_${Math.floor(Math.random() * 99) + 1}`;
  myChatName: string = `general`;
  myChatId: number = 0;
  suscribed: boolean = false;


  constructor(
    private _mqttService: MqttService,
    private eventLog: EventlogService
  ) {
  }

  public configureConnection(): void {
    MQTT_SERVICE_OPTIONS.hostname = this.hostname;
    MQTT_SERVICE_OPTIONS.port = this.port;
    MQTT_SERVICE_OPTIONS.username = this.username;
    MQTT_SERVICE_OPTIONS.password = this.password;    
  }
  

  public reconnect(): void {
    try {
      this._mqttService.disconnect();      
    } catch (e) {
      console.log(e);
    }

    this._mqttService.onError.subscribe(evt => console.log(`mqtt on error: ${evt}`))
    this._mqttService.onClose.subscribe(evt => console.log(`mqtt on close: ${evt}`))
    this._mqttService.onConnect.subscribe(evt => console.log(`mqtt on connect: ${evt}`))
    this._mqttService.onReconnect.subscribe(evt => console.log(`mqtt on reconnect: ${evt}`))
    this._mqttService.onSuback.subscribe(evt => console.log(`mqtt on suback: ${evt}`))

    this._mqttService.connect(MQTT_SERVICE_OPTIONS);

    if(!this.suscribed){
      this.suscribeToTopics();
    }
  }

  suscribeToTopics(): void {    

    this._mqttService.observe('connectionEvent/').subscribe((message: MqttMessage) => {
      try {
        var connectionEvent: ConnectionEvent = JSON.parse(
          message.payload.toString()
        );
        if (connectionEvent.alive && this.chatRoomsMap.get(connectionEvent.chatId) === undefined) {
          var chat: Chat = {
            id: connectionEvent.chatId,
            messages: [],
            name: connectionEvent.chatName
          };
          this.chatRoomsMap.set(connectionEvent.chatId, chat);
          this.chatRooms.push(chat);
        } else {
          this.chatRoomsMap.delete(connectionEvent.chatId);
          var chatIndex = this.chatRooms.findIndex((chat:Chat, index:number, array: Chat[]) => {
            return chat.id === connectionEvent.chatId;
           });
           if(chatIndex  !== -1){
             this.chatRooms.splice(chatIndex,1);
           }
        }
      } catch (error) {
        this.eventLog.appendLog(`received message from connectionEvent/ topic could not be proccessed: ${message.payload.toString()}`);
      }

    });

    this._mqttService.observe('chat/+/').subscribe((message: MqttMessage) => {
      try {
        var chatMessage: ChatMessage = JSON.parse(
          message.payload.toString()
        );

        var chat = this.chatRoomsMap.get(chatMessage.chatId);
        if (chat === undefined) {
          chat = {
            id: chatMessage.chatId,
            messages: [],
            name: chatMessage.chatName
          };
          this.chatRoomsMap.set(chat.id, chat);
          this.chatRooms.push(chat);
        }
        chat.messages.unshift(`${chatMessage.sender}: ${chatMessage.msg}`);
      } catch (error) {
        this.eventLog.appendLog(`received message from chat/+/ topic could not be proccessed: ${message.payload.toString()}`);
      }

    });

    this.suscribed = true;
  }

  public register(): void {
    this._mqttService.unsafePublish(
      "connectionEvent/",
      JSON.stringify({
        alive: true,
        chatName: this.myChatName,
        chatId: this.myChatId
      }),
      { qos: 0, retain: false });
  }

  public send(message: ChatMessage): void {
    var chat = this.chatRoomsMap.get(message.chatId);
    if (chat !== undefined) {
      this._mqttService.unsafePublish(
        `chat/${chat.id}/`,
        JSON.stringify({
          sender: message.sender,
          chatId: chat.id,
          chatName: chat.name,
          msg: message.msg,
        }),
        { qos: 0, retain: false });
    }

  }

  private unsafePublish(topic: string, message: string): void {
    this.eventLog.appendLog(`message sent: ${topic}: ${message}`);
    this._mqttService.unsafePublish(topic, message, { qos: 0, retain: false });
  }

}
