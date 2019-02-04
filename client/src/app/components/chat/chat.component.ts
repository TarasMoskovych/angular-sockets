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
  private getMessagesSub: any;

  private name: string;
  private room: number;

  users = new Array(5).fill('Test');
  messages = [];
  message = '';

  constructor(
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute ) {
  }

  ngOnInit() {
    this.chatService.connect();
    this.getRouteParameters();
    this.initializeConnection();
  }

  ngOnDestroy() {
    console.log('on destroy');
    this.getMessagesSub.unsubscribe();
  }

  getRouteParameters() {
    const queryParams = this.route.snapshot.queryParamMap;

    this.name = queryParams.get('name');
    this.room = +queryParams.get('room');
  }

  initializeConnection() {
    this.getMessagesSub = this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
  }

  onSendMessage() {
    const message = this.message.trim();
    const data = {
      text: message
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
