import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, ChatService, ImageService } from '../../services';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesRef') messageContainer: ElementRef;

  private getMessagesSub = null;
  private updateUsersSub = null;

  user = {
    name: '',
    room: 0,
    id: 0,
    img: this.imageService.getImgData(),
    converted: false
  };

  loader = true;
  users = [];
  messages = [];
  message = '';
  incomingMessages = [];
  photo = null;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private imageService: ImageService,
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
        console.log('Connected');
      });
    this.onInitializeConnection();
    this.renderImg();
    this.loader = false;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.updateUserImages();
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

  logout() {
    this.router.navigate(['/login']);
  }

  private renderImg() {
    this.imageService.renderImg(this.user.img)
      .then((event: any) => {
        this.photo = event.target.result;
      })
      .catch(defaultPhoto => {
        this.photo = defaultPhoto;
      });
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
      .subscribe((message) => {
        this.messages.push(message);
        this.getIncomingMessages();
      });
  }

  private onUpdateUsers() {
    this.updateUsersSub = this.chatService.updateUsers()
      .subscribe((userList: Array<any>) => {
        this.users = [...userList];
      });
  }

  private getIncomingMessages() {
    this.incomingMessages = this.messages.filter((message) => message.id !== this.user.id);
  }

  private scrollToBottom() {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  }

  private updateUserImages() {
    for (const user of this.users) {
      if (!user.converted && user.id !== this.user.id) {
        user.img = this.imageService.convertImgFromServer(user.img);
        user.converted = true;
        document.getElementById(`${user.id}`).setAttribute('src', user.img);
      }
    }
  }
}
