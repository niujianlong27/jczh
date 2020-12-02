import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-register',
  templateUrl: './home-register.component.html',
  styleUrls: ['./home-register.component.css']
})
export class HomeRegisterComponent implements OnInit {

  constructor( private router: Router,
  ) { }

  ngOnInit() {
  }
  register(data){
    this.router.navigate(['home-register-form'],{queryParams:{'registerType':data}});

  }
}
