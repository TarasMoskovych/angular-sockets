import { Router } from '@angular/router';

import { ChatService } from '../../services/chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  message: string;
  data: Array<any> = [];

  private getMessages;

  constructor(private chatService: ChatService, private router: Router) {
  }

  ngOnInit() {
    this.chatService.connect();
    this.onGetMessages();
  }

  ngOnDestroy() {
    console.log('on destroy');
    this.getMessages.unsubscribe();
  }

  onGetMessages() {
    this.getMessages = this.chatService
      .getMessages()
      .subscribe((message: string) => {
        console.log(message);
        this.data.push(message);
      });
  }

  onSendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
