import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { EventsComponent } from './events/events.component';
import { ChatsComponent } from './chats/chats.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { EventlogService } from './eventlog.service';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  MqttMessage,
  MqttModule,
  MqttService
} from 'ngx-mqtt';
import { MessengerService, mqttServiceFactory } from './messenger.service';


@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    EventsComponent,
    ChatsComponent,
    ChatRoomComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MqttModule.forRoot({ 
      provide: MqttService,
      useFactory: mqttServiceFactory
    })
  ],
  providers: [EventlogService,MessengerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
