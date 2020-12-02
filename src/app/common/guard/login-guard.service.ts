/**已登录的情况下不能在返回登录页 */
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService  implements CanActivate {

  constructor(private router:Router,private cookie:CookieService) { }
    checkLogin(url): boolean {
      if(this.cookie.get('INFO')){
           if(this.router.url == '/' || this.router.url == '' ){
              this.router.navigate(['/system']); //默认页面
           }

           return false; //已登录的情况下不能在登进登录页

         } else {

           return true;
           
         }
       }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }
}
