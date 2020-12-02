import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleCacheService } from '../../common/services/simple-cache.service';
import { UserinfoService } from '../../common/services/userinfo-service.service';
import { GlobalService } from '../../common/services/global-service.service';
@Component({
    selector: 'app-top-nav',
    template: `
    <ul nz-menu *ngIf="seaMenuModule" [nzMode]="'horizontal'" 
    [ngStyle]="{'background-color': themeVal == 'block' ? '#333' : themeVal == 'light'?'rgb(243, 209, 209)':'#094f7b','line-height': '49px'}">
      <li nz-submenu *ngFor="let sub of seaMenuModule.subModuleMenuList; let i = index">
        <span title style="color:white;"><i nz-icon type="{{iconsArr[i]}}"></i>{{sub.resourceName}}</span>
        <ul *ngIf="sub.resourceName!=='基础信息' || !basicInfoModule">
          <li nz-menu-item *ngFor="let m of sub.menuList" (click)="jumpNav(m.formUrl)">{{m.resourceName}}</li>
        </ul>
        <ul *ngIf="sub.resourceName=='基础信息'  && basicInfoModule">
          <li nz-menu-item *ngFor="let m of sub.menuList" (click)="jumpNav(m.formUrl)">{{m.resourceName}}</li>
          <li nz-submenu *ngFor="let sub2 of basicInfoModule.subModuleMenuList; let i = index">
            <span title>{{sub2.resourceName}}</span>
                <ul>
                  <li nz-menu-item *ngFor="let m of sub2.menuList" (click)="jumpNav(m.formUrl)">{{m.resourceName}}</li>
                </ul>
           </li>
        </ul>
      </li>
      <li nz-submenu *ngIf="seaMenuModule && systemMenuModule">
        <span title style="color:white;"><i nz-icon type="setting"></i>系统</span>
        <ul>
          <li nz-submenu *ngFor="let sub of systemMenuModule.subModuleMenuList; let i = index">
            <span title>{{sub.resourceName}}</span>
                <ul>
                  <li nz-menu-item *ngFor="let m of sub.menuList" (click)="jumpNav(m.formUrl)">{{m.resourceName}}</li>
                </ul>
           </li>
        </ul>
      </li>
    </ul>`
})
export class TopNavComponent implements OnInit, AfterViewChecked {
    seaMenuModule: any = null;
    systemMenuModule: any = null;
    basicInfoModule:any = null;
    iconsArr: Array<any> = ['appstore', 'mail', 'desktop', 'bars', 'setting', 'setting']; // 顺序图标
    themeVal: any = '';
    constructor(private glo: GlobalService, private router: Router, private simpleCache: SimpleCacheService,
        private cd: ChangeDetectorRef, private userinfo: UserinfoService, ) {
    }
    ngOnInit(): void {
        const userSet = JSON.parse(localStorage.getItem('USERSET') || '{}');
        this.themeVal = userSet.themeVal;
        this.simpleCache.seaTopNavEventEmitter.subscribe((val: Array<any>) => {// 触发
            setTimeout(() => {
                this.processTopMenu(val);
            }, 50);
        });
        this.glo.fontEmitter.subscribe((val: any) => {// 触发
            // 主题
            this.themeVal = val.setInfo.themeVal;
        });
    }
    // 处理菜单
    processTopMenu(val: Array<any>){
        if ((this.userinfo.APPINFO.USER.userType === 'YHJS20' || this.userinfo.APPINFO.USER.userType === 'YHJS10')
          && this.userinfo.APPINFO.USER.companyType ==='GSLX10'){
            this.seaMenuModule = null;
            this.systemMenuModule = null;
            return;
        }
        // 筛选海运菜单
        this.seaMenuModule = val.find((item) => item['resourceName'] === '海运');
        // 基础资料
        this.basicInfoModule = val.find((item) => item['resourceName'] === '基础资料');
        // 筛选系统菜单
        this.systemMenuModule = val.find((item) => item['resourceName'] === '系统' || item['resourceName'] === '系统管理');
    }
    ngAfterViewChecked() {
        this.cd.detectChanges();
    }
    /**
     *
     * @param url 菜单跳转
     */
    jumpNav(url) {
        this.router.navigate([url]);
    }
}
