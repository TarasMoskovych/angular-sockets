import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

export class ChatService {
  // private url = 'http://localhost:3000';
  private url = 'https://angular-sockets.herokuapp.com';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  public initializeConnection(reject) {
    if (!this.socket.connected) {
      this.socket = io(this.url);
    }

    this.socket.on('connect_error', () => {
      this.socket.disconnect();
      reject();
    });
  }

  public sendMessage(data: any, callback) {
    this.socket.emit('message:receive', data, callback);
  }

  public join(data: any, callback) {
    this.socket.emit('join', data, callback);
  }

  public updateUsers = () => {
    return Observable.create(observer => {
      this.socket.on('users:update', userList => {
        observer.next(userList);
      });
    });
  }

  public getMessages = () => {
    return Observable.create(observer => {
      this.socket.on('message:send', message => {
        observer.next(message);
      });
    });
  }

  public disconnect() {
    this.socket.disconnect();
  }
}
