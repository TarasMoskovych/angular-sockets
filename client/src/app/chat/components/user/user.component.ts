import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  @Input() user;
  @Input() userId;
  @Input() photo;

  constructor() { }

  ngOnInit() {
  }

}
