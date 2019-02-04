import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { ChatService } from '../../services/chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private getMessagesSub = null;

  private user = {
    name: '',
    room: 0,
    id: 0
  };

  users = new Array(5).fill('Test');
  messages = [];
  message = '';

  constructor(
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getRouteParameters();
    this.initializeConnection();

    this.chatService.connect();
  }

  ngOnDestroy() {
    console.log('on destroy');

    if (this.getMessagesSub !== null) {
      this.getMessagesSub.unsubscribe();
    }
  }

  getRouteParameters() {
    const queryParams = this.route.snapshot.queryParamMap;

    this.user.name = queryParams.get('name');
    this.user.room = +queryParams.get('room');
  }

  initializeConnection() {
    this.chatService.join(this.user, data => {
      if (typeof data === 'string') {
        console.error(data);
      } else {
        this.user.id = data.id;
        console.log(this.user);
        this.onReceiveMessage();
      }
    });
  }

  onReceiveMessage() {
    this.getMessagesSub = this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
  }

  onSendMessage() {
    const message = this.message.trim();
    const data = {
      text: message,
      name: this.user.name,
      id: this.user.id
    };

    if (message.length !== 0) {
      this.chatService.sendMessage(data, err => {
        err ? console.error(err) : this.message = '';
      });
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
