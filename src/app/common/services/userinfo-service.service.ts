import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from './global-service.service';
import { CacheService } from '../services/cache.service';
@Injectable({
  providedIn: 'root'
})
export class UserinfoService {
  public APPINFO: any = {USER:{},formId:'',SELECTCOMPANY:{},buttonId:''};
  constructor(public cookie: CookieService, public globalEmit: GlobalService, private cache: CacheService) {
    /** 登录用户信息*/
     const formId = this.cookie.get('formId');
    // const SELECTCOMPANY = JSON.parse(this.cookie.get('SELECTCOMPANY')||'{}');
     const USERINFO =  JSON.parse(this.cookie.get('INFO') || '{}');
     USERINFO && this.set('USER',USERINFO);
     formId && this.set('formId',formId);
   //  SELECTCOMPANY && this.set('SELECTCOMPANY',SELECTCOMPANY);
   }
   public set(key:'USER'|'formId'|'buttonId',value:any){
       this.APPINFO[key] = value;
   }
   public get(key:'USER'|'formId'|'buttonId'){
      return this.APPINFO[key];
   }
}
