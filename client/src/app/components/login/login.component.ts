import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onEnterChat(form: NgForm) {
    this.router.navigate(['/chat'], {
      queryParams: {
        name: form.value.name, room: form.value.room
      }
    });
  }
}
