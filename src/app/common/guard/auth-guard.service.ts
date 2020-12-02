import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SimpleCacheService } from '../../common/services/simple-cache.service';
import { NzModalService } from 'ng-zorro-antd';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private cookie: CookieService, private simpleCache: SimpleCacheService,
    private modalService: NzModalService) {  }
   checkLogin(url:string): boolean {
      sessionStorage.setItem('redirectUrl', url);
      if(this.cookie.get('INFO') && this.simpleCache.isAuthedMenuPath(url)){
        return true;
      }
      this.cookie.deleteAll();
      this.router.navigate(['login']);//未登录情况
      return false;
   }
   canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }
  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    return this.checkLogin(url);
  }
  canDeactivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }
}
