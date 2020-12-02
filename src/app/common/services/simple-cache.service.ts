import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimpleCacheService {
  private keys:Set<string> = new Set<string>();
  private store:Map<string,any> = new Map<string,any>();

  public seaTopNavEventEmitter: EventEmitter<any>;
  public seaCompanyTypeEventEmitter: EventEmitter<any>;
  public menuAuthMap: any = null;
  private MENU_AUTH_LOCAL = 'MENU_AUTH_LOCAL';

  constructor() { 
    /** 海运头部水平菜单传递*/
    this.seaTopNavEventEmitter = new EventEmitter();
    // 海运公司类型
    this.seaCompanyTypeEventEmitter = new EventEmitter();
  }
  // 通知海运水平菜单渲染
  notifySeaTopNav(data: Array<any>){
    this.seaTopNavEventEmitter.emit(data);

    this.menuAuthMap = {};
    var that = this;
    if(data){
      data.forEach((modu: Array<any>) => {
        if (modu && modu['subModuleMenuList']){
          modu['subModuleMenuList'].forEach((sub: Array<any>) => {
            if (sub && sub['menuList']){
              sub['menuList'].forEach((m: any) => {
                if (m && m['formUrl']){
                  that.menuAuthMap[m['formUrl']] = true;
                }
              });
            }
          });
        }
      });
      this.setLocal(this.MENU_AUTH_LOCAL, JSON.stringify(this.menuAuthMap));
    }
  }

  /**
   * 
   * @param path 菜单授权拦截
   */
  isAuthedMenuPath(path){
    if ('/system' === path || '/system/dashboard' === path){
      return true;
    }
    const auth = this.menuAuthMap || this.getLocal(this.MENU_AUTH_LOCAL);
    if (auth){
      if (path != null && path.length > 0 && path.substring(0, 1)=='/'){
        return auth[path.substring(1)];
      }else{
        return auth[path];
      }
    }
    return true;
  }

 /**
  * 存储
  *  */
   set(key:string,data:any):boolean{ //先删在改
     if(this.has(key)){
        //throw new Error('key is exist!');
     } else {
      this.keys.add(key);
     }
     this.store.set(key, data);
     return true;
   }
   get(key:string):any{
     return this.store.get(key);
   }
   remove(key:string):boolean{
      this.keys.delete(key);
      this.store.delete(key);
      return true;
   }
   clear(){
     this.keys.clear();
     this.store.clear();
   }
   has(key:string){
     return this.keys.has(key) || this.store.has(key);
   }
  /**
    * localStorage存储
  */
  setLocal(key: string, data: any): boolean {
    localStorage.setItem(key, data);
    return true;
  }
  getLocal(key: string): any {
    const loc = localStorage.getItem(key);
    if(typeof loc === 'object' ){
      return loc;
    }
    return JSON.parse(loc || 'null');
  }
  clearLocal(key: string): boolean {
    localStorage.removeItem(key);
    return true;
  }
  clearAuthLocal(): boolean {
    localStorage.removeItem(this.MENU_AUTH_LOCAL);
    return true;
  }
  clearAllLocal(): boolean {
    localStorage.clear();
    return true;
  }
}
