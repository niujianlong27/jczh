import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { RouterReuseStrategy } from '@util/RouterReuseStrategy';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NzModalModule,  NzNotificationModule} from 'ng-zorro-antd';
import { BaseInterceptorService } from '@service/base-interceptor.service';
import { CookieService } from 'ngx-cookie-service';

import { QRCodeModule } from 'angular2-qrcode';
/** 配置 angular i18n **/
import zh from '@angular/common/locales/zh';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ApploadComponent } from './appload/appload.component';
import {V1InterceptorService} from '@service/v1-interceptor.service';

// import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
registerLocaleData(zh);

/*const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = { //滚动条公用配置
  useBothWheelAxes: true
};*/

@NgModule({
  declarations: [
   AppComponent,
   PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    /** 导入 ng-zorro-antd 模块 **/
    NzModalModule,
    NzNotificationModule,
    BrowserAnimationsModule,
    QRCodeModule,
 //   FooterModule,
  //  PerfectScrollbarModule,
  ],
  providers: [
    CookieService,
    [
      {provide: HTTP_INTERCEPTORS, useClass: BaseInterceptorService, multi: true}, // 拦截器
      // {provide: HTTP_INTERCEPTORS, useClass: V1InterceptorService, multi: true} // 水运请求头处理
      ],
    [{provide: RouteReuseStrategy, useClass: RouterReuseStrategy }]
  /*  {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
