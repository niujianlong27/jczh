import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home-page-culture',
  templateUrl: './home-page-culture.component.html',
  styleUrls: ['./home-page-culture.component.css']
})
export class HomePageCultureComponent implements OnInit {

  constructor(
    private titleEmit: Title
  ) { }

  ngOnInit() {
    this.titleEmit.setTitle('汇好运-企业文化');
  }

}
