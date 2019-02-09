import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { ChatService } from './services';
import { AppComponent } from './app.component';
import { ChatComponent, LoginComponent, ErrorHandlerComponent, LoaderComponent } from './components';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    ErrorHandlerComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
