import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) {
  }

  onEnterChat(form: NgForm) {
    this.router.navigate(['/chat'], {
      queryParams: {
        name: form.value.name, room: form.value.room
      }
    });
  }
}
