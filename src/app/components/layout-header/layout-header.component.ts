/*模块导航组件*/
import {Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { urls } from '@model/url';
import { UserinfoService } from '@service/userinfo-service.service';
import { GlobalService } from '@service/global-service.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Utils} from '@util/utils';
import { SeaUserInfoService } from '../../sysmanage/sea/common/sea-user-info.service';
import { CacheService } from '@service/cache.service';
import { messageUrl } from '@model/messageUrl';
import { ChatService } from '@service/chat.service';
import { environment } from '@env/environment';
@Component({
  selector: 'layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.css']
})
export class LayoutHeaderComponent implements OnInit {
  visible: boolean;
  themeArr: Array<any> = [{name: '黑色', value: 'block'}, {name: '亮色', value: 'light'}, {name: '默认', value: ''}];
  fontArr: any[] = [{name: '宋体', value: 'song'}, {name: '仿宋', value: 'imitationSong'}, {name: '黑体', value: 'blockFont'}, {name: '默认', value: ''}];
  themeVal = 'light';
  settingData = {
    font: 'song',
    checkBoxVisible: true,
    themeVal: 'light',
    gridLine: false,
    menuCol: true,
    infoStore: false,
    moreGridShow: true,
  }; // 用户设置数据
  fullScreenInfo: any = {title: '全屏', isFull: false};
  pswModalOpen = false;
  modalVisible = false;
  modalData: any[] = [];
  mesCount: number;
  isTest = false; // 判断是否test环境
  @Input() info: any;


  constructor(private cookie: CookieService,
              private router: Router,
              private http: HttpClient,
              private user: UserinfoService,
              private cache: CacheService,
              private glo: GlobalService,
              private mess: NzMessageService,
              private seaUserInfoService: SeaUserInfoService,
              private chatService: ChatService) {
      glo.msgReadEvent.subscribe((data: any) => {
        this.getUnReadMeg();
      });
    }

  ngOnInit() {
    this.isTest = environment.baseUrl === 'http://192.168.1.20:8040/system/' ? true : false;
    // 判断是否测试库
    if (this.isTest) {
      this.getUnReadMeg();
    }
  }
  openSet() {
   // let setInfo = JSON.parse(localStorage.getItem('USERSET')||'{}');
     const setInfo = this.cache.getLocal('USERSET') || {};
     this.settingData.font = setInfo.font || '';
     this.settingData.checkBoxVisible = setInfo.checkBoxVisible === undefined ? false : setInfo.checkBoxVisible;
     this.settingData.themeVal = setInfo.themeVal || '';
     this.settingData.gridLine = setInfo.gridLine === undefined ? false : setInfo.gridLine;
     this.settingData.menuCol = setInfo.menuCol === undefined ? true : setInfo.menuCol;
     this.settingData.infoStore = setInfo.infoStore === undefined ? false : setInfo.infoStore;
     this.settingData.moreGridShow = setInfo.moreGridShow === undefined ? true : setInfo.moreGridShow; // 默认上下
     this.visible = !this.visible;

  }
  setClose() {
    this.visible = false;
  }
  userSetConfirm() {
    const userId = this.user.APPINFO.USER.userId;
    const userSet = JSON.stringify(this.settingData);
     this.http.post(urls.updateUserSet, {userId: userId, userSet: userSet}).subscribe((res: any) => {
       if (res.code === 100) {
          // localStorage.setItem('USERSET',userSet);
          this.cache.setLocal('USERSET', this.settingData);
          this.glo.checkBoxEmitter.emit({checkBox: this.settingData.checkBoxVisible});
          this.glo.fontEmitter.emit({setInfo: this.settingData});
          this.mess.remove();
          this.mess.success('设置成功！');
          this.visible = false;
       }
     });
  }
  loginOut(e: MouseEvent) {
     e.stopPropagation();
     e.preventDefault();
     this.http.post(urls.loginOut, {exitTime: Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')}).subscribe(
      (res: any) => {
        this.cache.clearAllLocal();
        this.cookie.deleteAll('/');
        const url = res.msg;
        if (url) {
          window.location.href = url;
        } else {
          this.router.navigate(['/login']);
        }
        // this.router.navigate([ url || '/login']).then(() => {
        //   if (this.isTest) {
        //     this.chatService.socketEnd();
        //   }
        // });
        if (this.isTest) {
              this.chatService.socketEnd();
            }
      }
    );
  }
  isFullScreen(val: boolean) {
     this.fullScreenInfo = val ? {title: '退出全屏', isFull: val} : {title: '全屏', isFull: val};
  }


  passwordChange(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.pswModalOpen = true;
  }
  pswModalResult(val: boolean) {
    if (val) {
      this.pswModalOpen = false;
    }
  }
  pswModalCancel() {
    this.pswModalOpen = false;
  }

  companySelect(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    //  const data = JSON.parse(localStorage.getItem('SWITCHCOMPANYINFO') || '[]');
      const data = this.cache.getLocal('SWITCHCOMPANYINFO') || [];
      this.modalData = data;
      this.modalVisible = true;


  }
  modalClose() {
    this.modalVisible = false;
  }
  modalResult(data: any) {
   // this.info.companyName = data.companyName;
    this.chooseCompany({
      requestCompanyName: data.companyName,
      requestCompanyId: data.companyId,
      requestCompanyType: data.companyType,
      exitTime: Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      loginTime: Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
    });
  }
  private chooseCompany(param: any) {
    const requestCompanyId = param.requestCompanyId;
    this.http.post(urls.switchingCompany, param).subscribe((res: any) => {
      if (res.code === 100) {
        const arr = res.data.filter((x: any) => x.companyId === requestCompanyId);
         arr[0].token =  res.data[0].token;
         arr[0].remark = res.data[0].remark; // remark true拥有全部的业务板块， false 没有拥有全部 放在公司数组第一个
        this.user.set('USER', arr[0]);
        this.cookie.set('INFO', JSON.stringify(arr[0]), new Date(Date.parse(new Date().toString()) + 7200000), '/');
        window.setTimeout(() => {
          this.router.navigate(['system/dashboard']).then(() => {
            //  切换公司，查询海运相关信息
            this.seaUserInfoService.setSeaUserInfo();
            window.setTimeout(() => {
              window.location.reload();
            }, 50);
          });
        });
      }
    });
}
  toPortal() {
    this.router.navigate(['/']);
  }
  /**
   * 获取未读消息总数
   */
  getUnReadMeg(): void {
    this.http.post(messageUrl.messageUnRead, {}).subscribe((res: any) => {
      if (res.code == 100) {
        this.mesCount = 0;
        if (res.data) {
          this.mesCount = res.data;
        }
      }
    });
  }
}
