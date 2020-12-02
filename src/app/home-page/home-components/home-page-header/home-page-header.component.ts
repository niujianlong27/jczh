import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserinfoService } from 'src/app/common/services/userinfo-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home-page-header',
  templateUrl: './home-page-header.component.html',
  styleUrls: ['./home-page-header.component.css']
})
export class HomePageHeaderComponent implements OnInit {

  constructor(
    public router: Router,
    private info: UserinfoService,
    private cookie: CookieService,
    ) { }

  //liActiveIndex: number;
  userInfo: any; /*登录成功传值*/

  ngOnInit() {
    // let url = window.location.href;
    // console.log(url);
    // if (url.indexOf('home-page-login') > 0) {
    //   this.liActiveIndex = 3;
    // } else if (url.indexOf('home-page-about') > 0) {
    //   this.liActiveIndex = 2;
    // } else if (url.indexOf('home-page-app') > 0) {
    //   this.liActiveIndex = 1;
    // } else {
    //   this.liActiveIndex = 0;
    // }
    console.log(this.router);
    this.userInfo = this.info.get('USER') || {};
  }

  homePage() {
    this.router.navigate(['/']);
  }
  //点击“下载”，跳转下载页面
  downLoad() {
    this.router.navigate(['home-page-app']);
  }
  //点击车源信息
  cars(){
    this.router.navigate(['home-page-cars']);
  }
  //点击“企业文化”，跳转该页面
  culture() {
    this.router.navigate(['home-page-culture']);
  }

  //点击“关于我们”，跳转该页面
  about() {
  this.router.navigate(['home-page-about']);
  }
  //点击“登录”，跳转该页面
  login() {
    this.router.navigate(['login']);
  }

  //点击“货源信息”，跳转该页面
  goods() {
    this.router.navigate(['home-page-goods']);
  }

  loginOut(e: MouseEvent) {
    this.cookie.deleteAll();
    this.info.set('USER', {});
    this.userInfo = {};
 }

}
