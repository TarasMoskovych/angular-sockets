import { Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, ImageService } from '../services';
import { ChatService } from './services/chat.service';

declare const M;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
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
  searchStr = '';

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getRouteParameters();
    this.chatService.initializeConnection(() => {
      this.router.navigate(['/error']);
    });
    this.onInitializeConnection();
    this.renderImg();
  }

  ngAfterViewInit() {
    this.reinitMaterialize();
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

  sendMessage(message: string) {
    const data = {
      text: message,
      name: this.user.name,
      id: this.user.id
    };

    this.chatService.sendMessage(data, err => {
      err ? console.error(err) : this.message = '';
    });
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
        this.onReceiveMessages();
        this.onUpdateUsers();
        this.loader = false;
      }
    });
  }

  private onReceiveMessages() {
    this.getMessagesSub = this.chatService.getMessages()
      .subscribe(message => {
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
        if (!user.img || user.img === null) {
          user.img = this.imageService.getDefaultImg();
        } else {
          user.img = this.imageService.convertImgFromServer(user.img);
        }
        user.converted = true;
        document.getElementById(`${user.id}`).setAttribute('src', user.img);
        this.reinitMaterialize();
      }
    }
  }

  private reinitMaterialize() {
    setTimeout(() => {
      M.AutoInit();
    }, 1000);
  }
}
