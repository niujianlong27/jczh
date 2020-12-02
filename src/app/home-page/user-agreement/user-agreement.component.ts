import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.css']
})
export class UserAgreementComponent implements OnInit {
  type:any;
  registerType:any;
  constructor(private router: Router,
              private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.type = queryParams.type;
      this.registerType =queryParams.registerType
    });
    console.log(this.registerType);

  }

  read(){
    console.log(this.registerType);
    this.type == 'update' &&   this.router.navigate(['update-register'],{queryParams:{'read':'userAgreement','registerType':this.registerType}});
    this.type == 'register' &&   this.router.navigate(['home-register-form'],{queryParams:{'read':'userAgreement','registerType':this.registerType}});
    }

}
