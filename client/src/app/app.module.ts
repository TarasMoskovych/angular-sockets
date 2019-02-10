import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent, LoginComponent, ErrorHandlerComponent, LoaderComponent } from './components';
import { FilterPipe } from './pipes/filter.pipe';
import { ChatModule } from './chat/chat.module';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    ErrorHandlerComponent,
    LoaderComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ChatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
