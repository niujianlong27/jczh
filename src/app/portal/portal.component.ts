import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserinfoService } from 'src/app/common/services/userinfo-service.service';
import { HttpUtilService } from 'src/app/common/services/http-util.service';
import { urls } from 'src/app/common/model/url';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit {
  constructor(
    private info: UserinfoService,
    private http: HttpUtilService,
    private cookie: CookieService,
    //登录模块
    private fb: FormBuilder,
  ) { }

  form: FormGroup;//登录-form表单定义dashboardInfo:any;//登录成功传值
  userInfo:any;//登录成功传值

  ngOnInit(): void {
    this.userInfo = this.info.get('USER') || {};
  }

  loginSuccess(userInfo: any){
    this.userInfo = userInfo;
    console.dir(userInfo);
  }
  loginOut(e:MouseEvent){
    this.cookie.deleteAll();
    this.info.set('USER', {});
    this.userInfo ={};
 }
}
