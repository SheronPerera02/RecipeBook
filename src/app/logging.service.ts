import {Injectable} from '@angular/core';


export class LoggingService {
  lastLog: string;

  logMessage(message: string): void {
    console.log(message);
    console.log(this.lastLog);
    this.lastLog = message;
  }

}
