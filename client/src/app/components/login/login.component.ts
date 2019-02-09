import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, ImageService } from './../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  loader = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private imageService: ImageService) {
  }

  onUpload(event) {
    this.imageService.storeImg(event.target.files[0]);
  }

  onEnterChat(form: NgForm) {
    this.loader = true;
    this.authService.login().toPromise()
      .then(() => {
        this.router.navigate(['/chat'], {
          queryParams: {
            name: form.value.name, room: form.value.room
          }
        });
      })
      .finally(() => {
        this.loader = false;
      });
  }
}
