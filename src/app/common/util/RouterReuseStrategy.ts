import { Injectable, Injector } from '@angular/core';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global-service.service';
@Injectable()
export class RouterReuseStrategy implements RouteReuseStrategy {
    constructor(private g: GlobalService, private inject: Injector) {
        const userSet =  JSON.parse(localStorage.getItem('USERSET') || '{}');
        this.notDetach = userSet.infoStore;
        g.fontEmitter.subscribe((x: any) => {
            this.notDetach = x.setInfo.infoStore;
            if (!this.notDetach) {
                RouterReuseStrategy.deleteAllRouteSnapshot();
                this.reuseUrl.clear();
            }
        });
        g.reuseRouterEmitter.subscribe((x: any) => {
           this.reuseUrl = x.urls;
        });
    }
    public static handlers: { [key: string]: DetachedRouteHandle } = {};
    // 用一个临时变量记录待删除的路由
    private notDetach: boolean;
    // tslint:disable-next-line: member-ordering
    private static waitDelete: string;
    private reuseUrl: Set<string> = new Set<string>();
    readonly reg = /^\S{1,}\?\S{1,}=\S{1,}$/;
    /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断 */
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        if (route.routeConfig.loadChildren || route.data.noReuse) { return false; }
        if (!route.routeConfig.loadChildren && !route.routeConfig.component) { return false; }
        if (this.reg.test(this.getRouteUrl(route))) { return false; }
        if ( ( this.getRouteUrl(route).indexOf('/system/') > -1 ) && this.notDetach) {
            return true;
        }
        return false;
    }

    /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
    public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const url = this.inject.get(ActivatedRoute).snapshot['_routerState'].url;
        if (url.indexOf('/system/') === -1) {
           RouterReuseStrategy.deleteAllRouteSnapshot();
           this.reuseUrl.clear();
           return;
        }
        if (RouterReuseStrategy.waitDelete && RouterReuseStrategy.waitDelete === this.getRouteUrl(route)) {
            // 如果待删除是当前路由则不存储快照
            RouterReuseStrategy.waitDelete = null;
            return;
        }
        // debugger;
        if (route.routeConfig.loadChildren || route.data.noReuse) { return; }
        if (!route.routeConfig.loadChildren && !route.routeConfig.component) { return; }
        RouterReuseStrategy.handlers[this.getRouteUrl(route)] = handle;
    }

    /** 若 path 在缓存中有的都认为允许还原路由 */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        if (route.routeConfig.loadChildren || route.data.noReuse) { return false; }
        if (!route.routeConfig.loadChildren && !route.routeConfig.component) { return false; }
        return !!route.routeConfig && !!RouterReuseStrategy.handlers[this.getRouteUrl(route)]
    }

    /** 从缓存中获取快照，若无则返回nul */
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) { return null; }
        if (route.routeConfig.loadChildren || route.data.noReuse) { return null; }
        if (!route.routeConfig.loadChildren && !route.routeConfig.component) { return null; }
        return RouterReuseStrategy.handlers[this.getRouteUrl(route)];
    }

    /** 进入路由触发，判断是否同一路由 */
    // 解决不同的参数也会认为是同一个路由，导致会将之前的路由拿出来复用
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig &&
            JSON.stringify(future.params) === JSON.stringify(curr.params);
    }
    // 解决不同的主路由会存在相同名称的子路由
    private getRouteUrl(route: ActivatedRouteSnapshot) {
      return route['_routerState'].url;
    }
    // tslint:disable-next-line: member-ordering
    public static deleteRouteSnapshot(name: string): void {
        const url = name.slice(0,1) === '/' ? name : `/${name}`;
        if (RouterReuseStrategy.handlers[url]) {
            delete RouterReuseStrategy.handlers[url];
        } else {
            RouterReuseStrategy.waitDelete = url;
        }
    }
    // tslint:disable-next-line: member-ordering
    public static deleteAllRouteSnapshot(): void {
        RouterReuseStrategy.handlers = {};
    }
}