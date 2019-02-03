import {  Observable } from 'rxjs';
import * as io from 'socket.io-client';

export class ChatService {
    private url = 'http://localhost:3000';
    private socket;

    constructor() {
      this.socket = io(this.url);
    }

    public connect() {
      this.socket.on('connect', () => {
        console.log('connected');
      });
    }

    public sendMessage(message: any) {
      this.socket.emit('createMessage', message);
    }

    public getMessages = () => {
      return Observable.create((observer) => {
          this.socket.on('newMessage', (message) => {
              observer.next(message);
          });
      });
    }
}
