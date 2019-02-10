import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService } from './services/chat.service';
import { SearchComponent, UserComponent, SendMessageComponent } from './components';

@NgModule({
  declarations: [SearchComponent, UserComponent, SendMessageComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [ChatService],
  exports: [SearchComponent, UserComponent, SendMessageComponent]
})
export class ChatModule { }
