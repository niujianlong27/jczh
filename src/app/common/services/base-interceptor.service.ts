/** 请求拦截器 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { UserinfoService } from '../services/userinfo-service.service';
import { CacheService } from '../services/cache.service';
@Injectable()
export class BaseInterceptorService implements HttpInterceptor {
  readonly source:string = 'DLLX10';
  private isModalShow:boolean = false;
  private getInfo = (flag:string) => this.info.APPINFO.USER[flag];
  constructor(private router:Router, private cookie:CookieService, private info: UserinfoService, private modal: NzModalService, private cache: CacheService) { }
  intercept(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>> {
    let clonedReq:any;
    if (this.info.APPINFO.USER.userId && (req.method == 'POST' || req.method == 'post')) {
      if (req.body instanceof Object) {
        if (!req.body.requestCompanyId) req.body.requestCompanyId = this.getInfo('companyId');
        if (!req.body.requestCompanyName) req.body.requestCompanyName = this.getInfo('companyName');
        if (!req.body.requestUserId) req.body.requestUserId = this.getInfo('userId');
        if (!req.body.requestCompanyType) req.body.requestCompanyType = this.getInfo('companyType');
        // if(!req.body['requestUserSegmentId']) req.body['requestUserSegmentId'] = this.getInfo('segmentId');
        if (!req.body.requestUserSegmentId) req.body.requestUserSegmentId = this.getInfo('segmentId');
        // 海运所需字段
        if (!req.body.requestSeaCompanyType) req.body.requestSeaCompanyType = this.getInfo('seaCompanyType');
        if (!req.body.requestSeaUserBizScope) req.body.requestSeaUserBizScope = this.getInfo('seaUserBizScope');
      }
      if (Array.isArray(req.body)) {
        req.body.forEach((item) => {
          if (!item.requestCompanyId) item.requestCompanyId = this.getInfo('companyId');
          if (!item.requestCompanyName) item.requestCompanyName = this.getInfo('companyName');
          if (!item.requestUserId) item.requestUserId = this.getInfo('userId');
          if (!item.requestCompanyType) item.requestCompanyType = this.getInfo('companyType');
          // if(!item['requestUserSegmentId']) item['requestUserSegmentId'] = this.getInfo('segmentId');
          if (!req.body.requestUserSegmentId) req.body.requestUserSegmentId = this.getInfo('segmentId');
          // 海运所需字段
          if (!item.requestSeaCompanyType) item.requestSeaCompanyType = this.getInfo('seaCompanyType');
          if (!item.requestSeaUserBizScope) item.requestSeaUserBizScope = this.getInfo('seaUserBizScope');
        });
      }
    }
    if (this.getInfo('token')) {
      clonedReq = req.clone({
        setHeaders: {
          source: this.source,
          token: this.getInfo('token'),
          companyid: this.getInfo('companyId'),
          userid: this.getInfo('userId'),
          formid: this.info.APPINFO.formId,
          buttonid: this.info.APPINFO.buttonId
        }
      });
    } else {
      clonedReq = req.clone({
        setHeaders: { source: this.source }
      });
    }
    return next
      .handle(clonedReq).pipe(
        tap(
          event => this.handError(event, req),
          error => this.handError(error)
        )
      );
  }

  private handError(data:any, req?: any) {
    if (data instanceof HttpResponse && data.status === 200) {
      if (data.body.code && data.body.code !== 100 && data.body.code !== 120 && data.body.code !== 109 && data.body.code !== '100') {
        window.setTimeout(() => {
          if (!this.isModalShow && ((req.body && !req.body.$modalShow) || !req.body)) {
            this.isModalShow = true;
            this.modal.error({
              nzTitle: '信息提示',
              nzContent: data.body.msg || '未知错误'
            }).afterClose.subscribe(() => {
              this.isModalShow = false;
            });
          }
        });
      }
    }

    if (data instanceof HttpErrorResponse && data.status !== 200) {
      const errorStatus = {
        400: '错误的请求。由于语法错误，该请求无法完成。',
        401: '未经授权。服务器拒绝响应。',
        403: '已禁止。服务器拒绝响应。',
        404: '未找到。无法找到请求的位置。',
        405: '方法不被允许。使用该位置不支持的请求方法进行了请求。',
        406: '不可接受。服务器只生成客户端不接受的响应。',
        407: '需要代理身份验证。客户端必须先使用代理对自身进行身份验证。',
        408: '请求超时。等待请求的服务器超时。',
        409: '冲突。由于请求中的冲突，无法完成该请求。',
        410: '过期。请求页不再可用。',
        411: '长度必需。未定义“内容长度”。',
        412: '前提条件不满足。请求中给定的前提条件由服务器评估为 false。',
        413: '请求实体太大。服务器不会接受请求，因为请求实体太大。',
        414: '请求 URI 太长。服务器不会接受该请求，因为 URL 太长。',
        415: '不支持的媒体类型。服务器不会接受该请求，因为媒体类型不受支持。',
        416: 'HTTP 状态代码 {0}',
        500: '内部服务器错误。',
        501: '未实现。服务器不识别该请求方法，或者服务器没有能力完成请求。',
        503: '服务不可用。服务器当前不可用(过载或故障)。'
      };
      const reLoginCode = [102, 103, 104, 105, 106, 107, 108, 109];
      window.setTimeout(() => {
        if (!this.isModalShow) {
          this.isModalShow = true;
          this.modal.error({
            nzTitle: '信息提示',
            nzContent: data && data.error && data.error.msg || (data.status && errorStatus[data.status] || '请求出错')
          }).afterClose.subscribe(() => {
            this.isModalShow = false;
          });
        }
      });
      if ((data && data.error && reLoginCode.includes(data.error.code)) || data.status === 401) {
        this.cookie.deleteAll('/');
        this.router.navigate(['login']);
      }
    }
  }
}
