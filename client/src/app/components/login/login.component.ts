import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private router: Router,
    private authService: AuthService) {
  }

  onEnterChat(form: NgForm) {
    this.authService.login().toPromise()
      .then(() => {
        this.router.navigate(['/chat'], {
          queryParams: {
            name: form.value.name, room: form.value.room
          }
        });
      });
  }
}
