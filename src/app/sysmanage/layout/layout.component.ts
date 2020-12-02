import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { HttpUtilService } from '../../common/services/http-util.service';
import { urls } from '../../common/model/url';
import { UserinfoService } from '../../common/services/userinfo-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { from } from 'rxjs';
import {map, concatAll, filter, takeWhile} from 'rxjs/operators';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { SimpleCacheService } from '@service/simple-cache.service';
import { RouterReuseStrategy } from '@util/RouterReuseStrategy';
import { GlobalService }from '@service/global-service.service';
import { ChatService } from '../../common/services/chat.service';
import { messageUrl } from '../../common/model/messageUrl';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [ ChatService ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  readonly pageTitle:string = '汇好运';
  readonly homePage: any = {resourceName:'系统主页',formUrl: 'system/dashboard',icon:'./assets/img/home-icon.svg'};
  private urlsSet:Set<string> = new Set<string>();
  info:any = {};
  //  parentId:string;
  formId:string;
  mainShow:boolean = false;
  leftNavShow:boolean = false;
  // tipTtitle:string;
  navModuleArr = [];//模块导航
  leftNavArr = [];//左侧导航
  tipNavArr = [];//标签导航
  selectMenuUrl:string;
  // li_num:number;//二级菜单index
  collapsed:boolean = true;
  barShow:boolean = false;
  seaCompanyType = '';
  urlChange:boolean = false;
  parentId:number | string;
  childrenId:number | string;
  formUrlArr: Array<any> = [];
  @ViewChild(PerfectScrollbarDirective) scrollDirective? : PerfectScrollbarDirective;
  // 自定义通知框
  @ViewChild('nnTemplate') nnTemplate: TemplateRef<any>;
  connection: any;  // socket
  notificationData: Object = {};
  private isAlive: boolean = true;
  public loading: boolean = true;
  //isActive = false; // 判断是否test环境
  isTest = false; // 判断是否test环境
  constructor(private http: HttpUtilService, private userinfo: UserinfoService, private titleServe: Title, private glo: GlobalService,
              private router: Router, private cookie: CookieService, private modal: NzModalService, private simpleCache: SimpleCacheService,
              private chatService: ChatService, private nn: NzNotificationService) {

  }

  ngOnInit(): void {
    RouterReuseStrategy.deleteAllRouteSnapshot();
    this.info = this.userinfo.APPINFO.USER;
    this.getNavList(this.info.userId);
    this.selectMenuUrl = this.urlFormat(this.router.url); // 获取当前的路径
    this.formId = this.userinfo.APPINFO.formId;
    this.routerEvent();
    this.seaCompanyType = this.info.seaCompanyType;
    this.simpleCache.seaCompanyTypeEventEmitter.subscribe((val: any) => {// 触发
      // 海运公司类型
      this.seaCompanyType = val;
    }
    );
    // this.isTest = environment.baseUrl === 'http://192.168.1.20:8040/system/' || 'https://uat.jczh56.com/api/system/' ? true : false;
    this.isTest = environment.baseUrl === 'http://192.168.1.20:8040/system/' ? true : false;
    const userId = this.userinfo.get('USER').userId;
    const companyId = this.userinfo.get('USER').companyId;
    if (userId && this.isTest) {
      // 启动socket
      this.connection = this.chatService.getMessages(userId, companyId).subscribe(message => {
        // console.log(message);
        this.notificationData = message;
        this.nn.template(this.nnTemplate, {nzDuration: 0, nzData: this.notificationData});
      });
    }
    // tab手动新增
    this.glo.tipNavUpdate.pipe(
      takeWhile(() => this.isAlive)
    ).subscribe((res: any) => {
      this.selectMenuUrl = res.formUrl;
      if (res.formId) {
        this.formId = res.formId;
      }
      const bool = this.tipNavArr.some((x: any) => x.formUrl === res.formUrl);
      if (!bool) {
        this.tipNavArr = [...this.tipNavArr, res];
      }
    });
  }

  navModuleSelect(i: any): void { // 导航模块事件
    this.leftNavArr = [];
    this.leftNavArr = i.subModuleMenuList;
    this.leftNavShow = true;
  }

  // 消除
  private urlFormat(url: string): string {
    return url.startsWith('/') ? url.substring(1) : url;
  }

  // 左侧导航栏
  selectLeftNavFun(data: any): void {
    const oldUrl = this.selectMenuUrl;
    this.selectMenuUrl = data.currentUrl; // && data.currentUrl.trim();
    this.selectMenuUrl ? this.router.navigate([this.selectMenuUrl]).then((ok) => {
      if (!ok) {
        this.selectMenuUrl = oldUrl;
      }
      this.urlsSet.add(this.selectMenuUrl);
      this.glo.reuseRouterEmitter.emit({urls: this.urlsSet});
    }) : this.modal.error({
      nzTitle: '导航错误',
      nzContent: '网页路径地址未定义！'
    });
  }

  // tip导航
  selectTipNavFun(data: any) {
    const oldUrl = this.selectMenuUrl;
    this.selectMenuUrl = data.formUrl;
    this.formId = data.formId;
    this.router.navigate([this.selectMenuUrl]).then((ok) => {
      if (!ok) {
        this.selectMenuUrl = oldUrl;
      }
      this.urlsSet.add(this.selectMenuUrl);
      this.glo.reuseRouterEmitter.emit({urls: this.urlsSet});
    });
  }

  // tip导航删除
  deleteTipNav(data: any) {
    let deleteUrl: any[];
    if (data.act) {
      let len: number;
      deleteUrl = this.tipNavArr.splice(data.index, 1);
      len = this.tipNavArr.length;
      len !== 0 ? this.router.navigate([this.tipNavArr[len - 1].formUrl]) : this.router.navigate(['system/dashboard']);
    } else {
      deleteUrl = this.tipNavArr.splice(data.index, 1);
    }
    this.tipNavArr = [...this.tipNavArr];
    this.urlsSet.delete(deleteUrl[0].formUrl);
    this.glo.reuseRouterEmitter.emit({urls: this.urlsSet});
    RouterReuseStrategy.deleteRouteSnapshot(deleteUrl[0].formUrl);
  }

  // 左侧菜单伸缩
  leftNavCollapsed(data: boolean): void {
    this.collapsed = data;
  }

  // 获取导航
  getNavList(userId: string): void {
    this.http.post(urls.userMenus, {userId: userId}).then(
      (res: any) => {
        if (res.success) {
          this.navModuleArr = res.data.data;  // 获取导航模块1
          // 通知处理海运头部水平菜单
          this.simpleCache.notifySeaTopNav(this.navModuleArr);
          this.navFilterFun(this.navModuleArr);
        }
        window.setTimeout(() => {
          this.loading = false;
        }, 1500)
      }
    );
  }

  // routerEvent
  private routerEvent() {
    this.router.events.pipe(
      takeWhile(() => this.isAlive)
    ).subscribe( (event: any) => {
      if (event instanceof NavigationStart) {
        this.barShow = true;
      }
      if (event instanceof NavigationCancel) {
        this.barShow = false;
      }
      if (event instanceof NavigationEnd) {
        window.setTimeout(() => {
          this.barShow = false;
        }, 1000);

        const sys = event.url.startsWith('/system/');
        if (sys) {

          (window as any).$FUNSELF && (window as any).$FUNSELF(`${this.info.userId}-${this.info.companyId}`);
          this.selectMenuUrl = this.urlFormat(event.urlAfterRedirects); // 存在重定向问题 暂不考虑带参数和额外的URL情况的一些问题
          this.navFilterFun(this.navModuleArr);
          this.urlChange = !this.urlChange;
          this.scrollDirective.scrollToTop();
        }
        this.glo.routerEvent.emit({isSys: sys, formId: this.formId});
      }
    });
  }
  // 导航变化

  navFilterFun(list: any) {
    let currentNavObj: any;
    this.filterList(list);
    if (this.router.isActive('system/dashboard', true)) {
      this.formId = null;
      this.parentId = null;
      this.childrenId = null;
      const isHad = this.tipNavArr.some(x => x.formUrl.includes(this.homePage.formUrl));
      if (!isHad) {
        this.tipNavArr = [...this.tipNavArr, this.homePage];
      }
      this.titleServe.setTitle(`${this.pageTitle}-${this.homePage.resourceName}`);
      return;
    }
    from(list).pipe(
      map( (x: any) => Array.isArray(x.subModuleMenuList) ? x.subModuleMenuList : [] ),
      concatAll(),
      map( (x: any) => Array.isArray(x.menuList) ? x.menuList : [] ),
      concatAll(),
      filter( (x: any) => {
        const url = x.formUrl && x.formUrl.startsWith('/') ? x.formUrl.slice(1) : x.formUrl;
        const curUrl = this.selectMenuUrl && this.selectMenuUrl.startsWith('/') ? this.selectMenuUrl.slice(1) : this.selectMenuUrl;
        return url === curUrl;
      })
    ).subscribe(
      x => {
        currentNavObj = x;
        this.userinfo.set('formId', x.formId);
        this.cookie.set('formId', x.formId);
        this.formId = x.formId;
        this.titleServe.setTitle(`${this.pageTitle}-${x.resourceName}`);
        const isHad = this.tipNavArr.some((y: any) => {
          const formUrl = y.formUrl.startsWith('/') ? y.formUrl.slice(1) : y.formUrl;
          const currentUrl = this.selectMenuUrl.startsWith('/') ? this.selectMenuUrl.slice(1) : this.selectMenuUrl;
          return formUrl === currentUrl;
        });
        if (!isHad) {
          this.tipNavArr = [...this.tipNavArr, x];
          localStorage.setItem('TEMPNAV', JSON.stringify(x));
        }
      }
    );
    if (!this.tipNavArr[0] && localStorage.getItem('TEMPNAV')) {
      this.tipNavArr = [JSON.parse(localStorage.getItem('TEMPNAV'))];
      this.formId = this.tipNavArr[0].formId;
      currentNavObj = this.tipNavArr[0];
    }
    this.childrenId = currentNavObj && currentNavObj.parentId;
    const navArr = list.filter((x: any) => Array.isArray(x.subModuleMenuList) && x.subModuleMenuList.some((y: any) => y.resourceId === this.childrenId));
    this.parentId = Array.isArray(navArr) && navArr[0] && navArr[0].resourceId;
  }

  // 过滤导航
  filterList(list: any) {
    const arr = from(list).pipe(
      map( (x: any) => Array.isArray(x.subModuleMenuList) ? x.subModuleMenuList : [] ),
      concatAll(),
      map( (x: any) => Array.isArray(x.menuList) ? x.menuList : []),
      concatAll()
    ).subscribe(
      x => {
        this.formUrlArr.push(x);
      }
    );
    this.simpleCache.setLocal('formUrlArr', JSON.stringify(this.formUrlArr));
  }


  formIdValidate(msg) {
    const formUrlArr = this.formUrlArr; // 获取form_url数组
    const formUrlItem = formUrlArr.filter( x => x.formId === msg.webFormid); // 与当前消息匹配form_url
    if (formUrlItem[0]) {
      msg.formUrl = formUrlItem[0].formUrl;
      return true;
    } else {
      return false;
    }
  }

  /**
   * 消息已读操作
   * @param notification 通知框对象
   * @param data 消息数据
   * @param status 消息框操作：1-跳转业务页，2-跳转全部消息页，3-消息已读确认
   */
  msgRead(notification: any, data: any, status: Number) {
    console.log(data);
    const messageId  = data.code;
    // const formUrlArr = this.formUrlArr; // 获取form_url数组
    // const formUrlItem = formUrlArr.filter( x => x.formId === data.webFormid); // 与当前消息匹配form_url
    if (status === 2 ) {
      // this.msg.error('消息ID为空');
      this.router.navigate(['/system/message/messageView']).then(() => {
        notification.close();
      });
      return;
    }
    const params = {url: '', data: {messageModelList: []}, method: 'POST'};
    params.data.messageModelList.push({'messageId': messageId, 'receiveTime': 1});
    params.url = messageUrl.messageRead;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          // this.nn.success('提示消息', '消息已读成功！');
          if (data.formUrl && status === 1) {
            this.router.navigate([data.formUrl]);
          }
          notification.close();
          this.glo.msgReadEvent.emit();
        } else {
          this.nn.error('提示消息', '消息已读失败！');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.isAlive = false;
    if (this.isTest) {
      this.chatService.socketEnd();
    }
  }
}
