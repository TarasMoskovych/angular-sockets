import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.less']
})
export class SendMessageComponent implements OnInit {
  @Output() sendMessage: EventEmitter<string> = new EventEmitter<string>();
  message = '';

  constructor() { }

  ngOnInit() {
  }

  onSendMessage() {
    if (this.message.trim().length !== 0) {
      this.sendMessage.emit(this.message);
    }

    this.message = '';
  }
}
