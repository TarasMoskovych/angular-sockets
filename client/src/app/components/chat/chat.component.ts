import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesRef') messageContainer: ElementRef;

  private getMessagesSub = null;
  private updateUsersSub = null;
  private user = {
    name: '',
    room: 0,
    id: 0
  };

  loader = true;
  users = [];
  messages = [];
  message = '';

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getRouteParameters();

    this.chatService.initializeConnection(
      () => {
        this.router.navigate(['/error']);
      },
      () => {
        this.loader = false;
      });
    this.onInitializeConnection();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    if (this.getMessagesSub !== null) {
      this.getMessagesSub.unsubscribe();
    }

    if (this.updateUsersSub !== null) {
      this.updateUsersSub.unsubscribe();
    }

    this.authService.logout();
  }

  private getRouteParameters() {
    const queryParams = this.route.snapshot.queryParamMap;

    this.user.name = queryParams.get('name');
    this.user.room = +queryParams.get('room');
  }

  private onInitializeConnection() {
    this.chatService.join(this.user, data => {
      if (typeof data === 'string') {
        console.error(data);
      } else {
        this.user.id = data.id;
        this.onReceiveMessage();
        this.onUpdateUsers();
      }
    });
  }

  private onReceiveMessage() {
    this.getMessagesSub = this.chatService.getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
  }

  private onUpdateUsers() {
    this.updateUsersSub = this.chatService.updateUsers()
      .subscribe((userList: Array<any>) => {
        this.users = [...userList];
      });
  }

  private scrollToBottom() {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
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
