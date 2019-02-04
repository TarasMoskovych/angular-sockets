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

    public sendMessage(data: any, callback) {
      this.socket.emit('message:receive', data, callback);
    }

    public join(data: any, callback) {
      this.socket.emit('join', data, callback);
    }

    public updateUsers = () => {
      return Observable.create((observer) => {
          this.socket.on('users:update', userList => {
              observer.next(userList);
          });
      });
    }

    public getMessages = () => {
      return Observable.create((observer) => {
          this.socket.on('message:send', message => {
              observer.next(message);
          });
      });
    }
}
