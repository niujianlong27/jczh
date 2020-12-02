import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpUtilService } from 'src/app/common/services/http-util.service';
import { UserinfoService } from 'src/app/common/services/userinfo-service.service';
import { GlobalService } from 'src/app/common/services/global-service.service';
import { SeaUserInfoService } from 'src/app/sysmanage/sea/common/sea-user-info.service';
import { urls } from 'src/app/common/model/url';

@Component({
  selector: 'app-portal-login',
  templateUrl: './portal-login.component.html',
  styleUrls: ['./portal-login.component.css']
})
export class PortalLoginComponent implements OnInit {

  //定义在子组件;实质性执行在目的方
  @Output() loginSuccessEvent = new EventEmitter<any>();//(事件):子组件告诉父组件,触发事件
  //定义在子组件;实质性执行在目的方
  @Input() userInfo: any;

  constructor(
    // private appInfo: UserinfoService, //设置默认值
    private http: HttpUtilService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private info: UserinfoService,
    private globalEmit: GlobalService,
    private router: Router,
    private seaUserInfo: SeaUserInfoService,
  ) {
  }

  form: FormGroup;//登录-form表单定义
  loginLoading: boolean = false;//加载按钮
  // userInfo: any;//登录成功传值

  //初始化
  ngOnInit() {
    
    // this.userInfo = this.info.get('USER');
    // if (!this.userInfo.loginName) {
    //   this.userInfo = null;//退出时,将{}转化为null值
    // }
    //console.log(this.userInfo)

    // const userInfo = this.appInfo.APPINFO.USER;//初始值设置
    // console.dir(userInfo);//初始值设置
    this.form = this.fb.group({
      loginName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    // 拿到用户信息,并给登录框设置初始值
    // this.form.patchValue({loginName: userInfo.name});
  }

  //登录方法
  login(): void {
    //校验
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    //如果不合格,返回
    if (this.form.invalid) return;

    this.loginLoading = true;

    // todo 调用后台
    this.http.post(urls.login, this.form.value).then(//接口:urls.login
      (res: any) => {
        if (res.success) {

          this.userInfo = res.data.data[0];//把账号赋值给userInfo

          this.cookie.set('INFO', JSON.stringify(this.userInfo), new Date(Date.parse(new Date().toString()) + 7200000));//默认第一个公司
          this.info.set('USER', this.userInfo || {});
          //this.getUserSet();

          console.log('login success!')

          // 设置海运相关用户信息
          this.seaUserInfo.setSeaUserInfo();
          // 子组件将值传递给父组件
          this.loginSuccessEvent.emit(this.userInfo);

        } else if (res.data.code == 120) {
          this.userInfo = res.data.data[0];
          this.info.set('USER',this.userInfo);
          this.cookie.set('INFO', JSON.stringify(this.userInfo), new Date(Date.parse(new Date().toString()) + 7200000));
          // 设置海运相关用户信息
          this.seaUserInfo.setSeaUserInfo();

          console.log('login success!')

           // 子组件将值传递给父组件
          this.loginSuccessEvent.emit(this.userInfo);
        }
        this.loginLoading = false;

      });
  }

  //页面跳转
  getUserSet(param = {}) {
    this.http.post(urls.getUserSet, param).then((res: any) => {
      if (res.success) {
        let setInfo = JSON.parse(res.data.data && res.data.data[0] && res.data.data[0].userSet || '{}');
        localStorage.setItem('USERSET', JSON.stringify(setInfo));
        this.globalEmit.fontEmitter.emit({ setInfo: setInfo });
      }
      console.log("页面跳转成功!")
      this.router.navigate(['system/dashboard']).then(
        () => { this.loginLoading = false; }
      ); //默认页面
    })
  }

  //进入平台
  loginInter() {
    this.loginLoading = true;//加载
    this.getUserSet();
    this.loginLoading = false;//停止加载
  }

  //注册方法
  register() {

  }


}
