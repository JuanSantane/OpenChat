import { Component, OnInit, Input } from '@angular/core';
import { EventlogService } from '../eventlog.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  url = 'localhost';
  port = 9009;
  path = '/mqtt';
 
  constructor(private eventLog: EventlogService) { }

  ngOnInit() { }

  save(): void {
    this.eventLog.appendLog(
      `Mqtt setting changed: ${this.url}:${this.port}${this.path}`);
  }

}
