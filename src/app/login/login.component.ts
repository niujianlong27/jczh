/*
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { urls } from '@model/url';
import { HttpUtilService } from '@service/http-util.service';
import { GlobalService } from '@service/global-service.service';
import { UserinfoService } from '@service/userinfo-service.service';
import { CacheService } from '@service/cache.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { TRANS_URLS } from '@model/trans-urls';
import { NzMessageService } from 'ng-zorro-antd';
import {Utils} from '@util/utils';
import { SeaUserInfoService } from '../sysmanage/sea/common/sea-user-info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  logining = false;
  pswModalOpen = false;
  pswInfo: any = {};
  list: any[] = [];
  modalVisible = false;
  private loginInfo: any;
  constructor(private fb: FormBuilder , private router: Router, private http: HttpUtilService, private info: UserinfoService,
      private globalEmit: GlobalService, private cookie: CookieService, private msg: NzMessageService, private cache: CacheService,
      private seaUserInfo: SeaUserInfoService) { }
  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }

    if (this.validateForm.status === 'INVALID' || this.logining) { // 不合格式
      return;
    }
    this.logining = true;
    this.list = [];
    this.loginFun({loginName: this.validateForm.value.userName, password: this.validateForm.value.password,
      loginTime: Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')});
  }
  private loginFun(params: any, flag?: any){
    this.http.post(urls.login, { ...params, url: window.location.href }).then(
      (res: any) => {
        if (res.success) {
            if (Array.isArray(res.data.data) && res.data.data[0] && !res.data.data[0].token) {
              this.modalVisible = true;
            }
           // if(!this.modalVisible && res.data.code !== 120 ) {
            if (!this.modalVisible) {
              let loginData: any[];
              if (!flag) {
                 loginData = res.data.data;
              } else {
                const token = res.data.data[0].token;
                loginData = res.data.data.filter((x: any) => x.companyId === flag.companyId);
                loginData[0].token = token;
                loginData[0].remark = res.data.data[0].remark;  // remark true拥有全部的业务板块， false 没有拥有全部 放在公司数组第一个
              }
              this.cookie.set('INFO', JSON.stringify(loginData[0]), new Date(Date.parse(new Date().toString()) + 7200000), '/'); // 默认第一个公司
              this.info.set('USER', loginData[0] || {});
              this.getUserSet({}, res.data.code);

              // 设置海运相关用户信息
              this.seaUserInfo.setSeaUserInfo();
            }
            if (res.data.code === 120) {
              // tslint:disable-next-line: no-unused-expression
              !this.modalVisible && this.initalPsw(res.data.data[0]);
              // if(!this.modalVisible){
              //   // 设置海运相关用户信息
              //   this.seaUserInfo.setSeaUserInfo();
              // }
            }
          this.list = this.filterCompany(res.data.data);
          // localStorage.setItem('SWITCHCOMPANYINFO',JSON.stringify(this.list));
          this.cache.setLocal('SWITCHCOMPANYINFO', this.list);
          if (res.data.data.length > 1) {
            // tslint:disable-next-line: no-unused-expression
            this.cache.get('login-select-company') && this.cache.remove('login-select-company');
            this.cache.set('login-select-company', true);
          }
        } else {
          this.logining = false;
        }
      }
    );
  }
  pswModalResult(val: boolean) {
    if (val) {
      this.pswModalOpen = false;
      this.getUserSet();
    }
  }
  ngOnInit(): void {
    this.info.set('USER',{});
    this.cookie.deleteAll('/');
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ]
    });
  }
  modalOk(data: any) {
     this.modalVisible = false;
     this.loginFun({
       loginName: this.validateForm.value.userName,
       password: this.validateForm.value.password,
       loginTime: Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'),
       companyId: data.companyId,
       requestCompanyType: data.companyType}, data);
  }
  modalClose(){
    // tslint:disable-next-line: no-unused-expression
    this.modalVisible && (this.logining = false);
    this.modalVisible = false;
  }
  private initalPsw(data: any) {
    this.loginInfo = data;
   // this.info.set('USER',this.loginInfo || {});
    this.pswInfo = {'name': data.name, 'userId': data.userId};
   // this.cookie.set('INFO',JSON.stringify(this.loginInfo),new Date(Date.parse(new Date().toString())+7200000));
    this.pswModalOpen = true;
  }
  // getUserSet 获取用户自定义设置
  getUserSet(param = {}, code = null) {
     this.http.post(urls.getUserSet, param).then((res: any) => {
      let setInfo: any = {};
          if (res.success) {
             setInfo = JSON.parse(res.data.data && res.data.data[0] && res.data.data[0].userSet || '{}');
            // localStorage.setItem('USERSET',JSON.stringify(setInfo));
          }
          window.setTimeout(() => {
            this.cache.setLocal('USERSET', setInfo);
            this.globalEmit.fontEmitter.emit({setInfo: setInfo});
            if (code !== 120) {
              this.router.navigate(['system/dashboard']).then(
                () => { this.logining = false; }
              ); // 默认页面
            }
          }, 300);
    });
  }
 filterCompany(data: any[]) {
   const result = [];
   data.map( (i: any) => {
      const o: any = {};
          o.companyId = i.companyId;
          o.companyName = i.companyName;
          o.companyStatus = i.companyStatus;
          o.companyType = i.companyType;
          result.push(o);
   });
   return result;
 }
  
   // 竞价单开始前十分钟提醒，长轮询
  openTenderRemind(): void {
    this.http.post(TRANS_URLS.OPEN_TENDER_REMIND, {}).then((res: any) => {
      if (res.success) {
        this.msg.success(res.data);
        this.openTenderRemind();
      }
    });
  }

}
*/

/**
 * 这个文件作废 2020-04-20
 */
import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {HttpUtilService} from 'src/app/common/services/http-util.service';
import {UserinfoService} from 'src/app/common/services/userinfo-service.service';
import {GlobalService} from 'src/app/common/services/global-service.service';
import {SeaUserInfoService} from 'src/app/sysmanage/sea/common/sea-user-info.service';
import {urls} from 'src/app/common/model/url';
import {Utils} from '@util/utils';
import {CacheService} from '@service/cache.service';
import {NzMessageService} from 'ng-zorro-antd';
import * as SparkMd5 from 'spark-md5';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home-page-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent implements OnInit {
  //选择公司弹框
  modalVisible: boolean = false;
  list: any[] = [];
  logining: boolean = false;
  pswInfo: any = {};
  private loginInfo: any;
  pswModalOpen: boolean = false;
  checked = true;
  isVisible: boolean = false;  // 弹框显示
  selectCompanyId:any;

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
    private cache: CacheService,
    private msg: NzMessageService,
    private angularHttp: HttpClient,
  ) {
  }

  form: FormGroup;//登录-form表单定义
  loginLoading: boolean = false;//加载按钮
  // userInfo: any;//登录成功传值

  //初始化
  ngOnInit(): void {
    this.info.set('USER', {});
    this.cookie.deleteAll();
    sessionStorage.setItem('updateRegister', '');
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
      remember: new FormControl(true)

    });
    // 拿到用户信息,并给登录框设置初始值
    // this.form.patchValue({loginName: userInfo.name});
  }


  //登录
  private loginFun(params: any, flag?: any) {
    console.log('登录方法');
    this.loginLoading = true;
    this.list = [];
    this.http.post(urls.login, {
      ...params,
      url: window.location.href
    }).then(
      (res: any) => {
        this.loginLoading = false;
        if (res.success) {
          if (res.data.msg == '该公司审核失败') {
            this.isVisible = true;
            return;
          }
          if (Array.isArray(res.data.data) && res.data.data[0] && !res.data.data[0].token) {
            this.modalVisible = true;
          }
          if (!this.modalVisible && res.data.code !== 120) {
            let loginData: any[];
            if (!flag) {
              loginData = res.data.data;
            } else {
              const token = res.data.data[0].token;
              loginData = res.data.data.filter((x: any) => x.companyId === flag.companyId);
              loginData[0].token = token;
            }
            this.cookie.set('INFO', JSON.stringify(loginData[0]), new Date(Date.parse(new Date().toString()) + 7200000));//默认第一个公司
            this.info.set('USER', loginData[0] || {});
            this.getUserSet();
            // 设置海运相关用户信息
            this.seaUserInfo.setSeaUserInfo();
          }

          if (res.data.code == 120) {
            !this.modalVisible && this.initalPsw(res.data.data[0]);
            if (!this.modalVisible) {
              // 设置海运相关用户信息
              this.seaUserInfo.setSeaUserInfo();
            }
          }

          this.list = this.filterCompany(res.data.data);
          localStorage.setItem('SWITCHCOMPANYINFO', JSON.stringify(this.list));
          if (res.data.data.length > 1) {
            this.cache.get('login-select-company') && this.cache.remove('login-select-company');
            this.cache.set('login-select-company', true);
          }

        } else {
          this.logining = false;
        }
      }
    );
  }

  //页面跳转//getUserSet 获取用户自定义设置
  getUserSet(param = {}) {
    this.http.post(urls.getUserSet, param).then((res: any) => {
      if (res.success) {
        let setInfo = JSON.parse(res.data.data && res.data.data[0] && res.data.data[0].userSet || '{}');
        localStorage.setItem('USERSET', JSON.stringify(setInfo));
        this.globalEmit.fontEmitter.emit({setInfo: setInfo});
      }
      window.setTimeout(() => {
        this.router.navigate(['system/dashboard']).then(
          () => {
            this.loginLoading = false;
          }
        ); //默认页面
      }, 300);
    });
  }

  //进入平台
  loginInter() {
    this.loginLoading = true;//加载
    this.getUserSet();
    this.loginLoading = false;//停止加载
  }

  // 3.0登录方法
  submitFormV3(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.status === 'INVALID' || this.logining) { //不合格式
      return;
    }
    this.logining = true;
    this.list = [];
    this.loginFun({
      loginName: this.form.value.loginName, password: this.form.value.password,
      loginTime: Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
    });
  }

  pswModalResult(val: boolean) {
    if (val) {
      this.pswModalOpen = false;
      this.getUserSet();
    }
  }


  /*选择公司*/
  modalClose() {
    this.modalVisible && (this.logining = false);
    this.modalVisible = false;
    this.loginLoading = false;

  }

  filterCompany(data: any[]) {
    let result = [];
    data.map((i: any) => {
      let o: any = {};
      o.companyId = i.companyId;
      o.companyName = i.companyName;
      o.companyStatus = i.companyStatus;
      o.companyType = i.companyType;
      o.userType = i.userType;
      result.push(o);
    });
    return result;
  }

  private initalPsw(data: any) {
    this.loginInfo = data;
    this.info.set('USER', this.loginInfo || {});
    this.pswInfo = {'name': data.name, 'userId': data.userId};
    this.cookie.set('INFO', JSON.stringify(this.loginInfo), new Date(Date.parse(new Date().toString()) + 7200000));
    this.pswModalOpen = true;
  }

  modalOk(data: any) {
    this.modalVisible = false;
    if (data.companyType == 'PTGS30' && data.userType == 'YHJS20') {
      this.isVisible = true;
      return;
    }
    this.selectCompanyId = data.companyId;
    this.loginFun({
      loginName: this.form.value.loginName,
      password: this.form.value.password,
      loginTime: Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      companyId: data.companyId,
      requestCompanyType: data.companyType
    }, data);
  }


  //2.0登录方法
  submitFormV2(data: any) {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.status === 'INVALID' || this.logining) { //不合格式
      return;
    }
    this.logining = true;
    this.loginFunV2({
      loginNameOrMobile: this.form.value.loginName, password: SparkMd5.hash(this.form.value.password),
      loginTime: Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
    });


  }

  private loginFunV2(params: any, flag?: any) {
    this.loginLoading = true;

    this.http.post(urls.loginV2, params).then(
      (res: any) => {

        if (res.success) {
          if (Array.isArray(res.data.data) && res.data.data[0] && !res.data.data[0].token) {
            this.modalVisible = true;
          }

          if (!this.modalVisible && res.data.code !== 120) {
            let loginData: any[];
            if (!flag) {
              loginData = res.data.data;
            } else {
              const token = res.data.data[0].token;
              loginData = res.data.data.filter((x: any) => x.companyId === flag.companyId);
              loginData[0].token = token;
            }
            localStorage.setItem('we', JSON.stringify(res.data.data));
            console.log(localStorage.getItem);
            //2.0页面跳转
            window.location.href = `http://localhost:5000/#/app/account/myAccount?u=${this.form.value.loginName},${SparkMd5.hash(this.form.value.password)}`;
            // 设置海运相关用户信息
            // this.seaUserInfo.setSeaUserInfo();
          }

          if (res.data.code == 120) {
            !this.modalVisible && this.initalPsw(res.data.data[0]);
            if (!this.modalVisible) {
              // 设置海运相关用户信息
              // this.seaUserInfo.setSeaUserInfo();
            }
          }
        } else {
          this.logining = false;
        }

      }
    );
  }

  //1.0登录方法
  submitFormV1() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.status === 'INVALID' || this.logining) { //不合格式
      return;
    }
    this.logining = true;
    //this.list = [];
    this.loginFunV1({
      loginName: this.form.get('loginName').value,
      password: this.form.get('password').value,
      url: window.location.href,
      loginTime: Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
    });
  }

  loginFunV1(params: any, flag?: any) {
    this.loginLoading = true;
    this.angularHttp.post(urls.loginHZD, params).subscribe(
      (res: any) => {
        this.loginLoading = false;
        this.logining = false;
        if (res.code === 100) {
          if (res.msg == '该公司审核失败') {
            this.isVisible = true;
            return;
          }
          const data = res.data[0];
          const date = new Date();
          const origin = window.location.origin;
          let str = encodeURI(`source=JCZH${date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate() + '' + date.getHours()}&loginName=${data.loginName}&companyName=${data.companyName}&name=${data.name}&mobile=${data.mobile}&token=${data.token}&companyId=${data.companyId}&userId=${data.userId}&mark=${data.mark}&companyStatus=${data.companyStatus}&companyType=${data.companyType}&status=${data.status}&userType=${data.userType}&userCompanyType=${data.userCompanyType}`);
          window.location.href = origin + '/vector/#/sys/personInfo?' + str;
          localStorage.setItem('_info', JSON.stringify(res.data[0]));
        }


      }
    );
  }

  selectLogin(): void {
    this.selectCompanyId = '';
    switch (this.selectedIndex) {
      case 0: {
        this.logining = false;
        this.submitFormV3();
      }
        break;
      case 1: {
        this.logining = false;
        this.submitFormV1();
      }
        break;
      default: {
      }
        break;
    }
  }

  register() {
    this.router.navigate(['home-register']);

  }

  update() {
    this.router.navigate(['forget-password']);

  }

  selectedIndex: any = 0;

  SelectedIndexChange(data) {
    this.selectedIndex = data;
  }

  handleOk(): void {
    let registerType = this.selectedIndex == 0 ? 'transport' : 'shipper';
    this.isVisible = false;
    this.router.navigate(['update-register'], {queryParams: {'registerType': registerType}});
    sessionStorage.setItem('updateRegister', JSON.stringify({
      loginName: this.form.value.loginName,
      password: this.form.value.password,
      companyId:this.selectCompanyId
    }));
  }

  handleCancel() {
    this.isVisible = false;
    this.logining = false;
  }

}
