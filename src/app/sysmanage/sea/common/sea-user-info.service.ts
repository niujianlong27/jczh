import { Injectable } from '@angular/core';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { SEA_URLS } from '../../../common/model/sea-urls';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
import { CookieService } from 'ngx-cookie-service';
import { SimpleCacheService } from '../../../common/services/simple-cache.service';
@Injectable({
  providedIn: 'root'
})
export class SeaUserInfoService{

  constructor(private http: HttpUtilService, private simpleCache: SimpleCacheService,
    private appInfo: UserinfoService, private cookie: CookieService) {

  }

  setSeaUserInfo() {
    // return this.http.post(SEA_URLS.getUserBizScope, {}).then(
    //   (res: any) => {
    //     const seaInfo = {seaCompanyType: null, seaUserBizScope: null};
    //     if (res.success) {
    //       seaInfo.seaCompanyType = res.data.data.companyType;
    //       seaInfo.seaUserBizScope = res.data.data.bizScope;
    //       setTimeout(() => {
    //         this.simpleCache.seaCompanyTypeEventEmitter.emit(seaInfo.seaCompanyType);
    //       }, 1000);
    //     }
    //     const info = Object.assign(this.appInfo.get('USER'), seaInfo);
    //     this.appInfo.set('USER', info);
    //     this.cookie.set('INFO',JSON.stringify(info),new Date(Date.parse(new Date().toString())+7200000));
    //   });
  }

}


