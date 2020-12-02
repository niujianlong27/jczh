import { Injectable, EventEmitter, TemplateRef, Renderer2 } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
 /*服务弹窗*/
 interface ModalOption {
  width?: string;
  tplTitle?: TemplateRef<any>;
  tplContent?: TemplateRef<any>;
  tplFooter?: TemplateRef<any>;
  maskClosable?: boolean;
  closable?: boolean;
}
 /*服务弹窗*/

@Injectable({
  providedIn: 'root'
})

export class GlobalService {
  public valueEventEmitter: EventEmitter<any>;
  public userInfoEventEmitter: EventEmitter<any>;
 // public titleEventEmitter: EventEmitter<any>;
  public fromIdEventEmitter: EventEmitter<string>;
  public findButtonEmitter: EventEmitter<any>;
  public pageNumEmitter: EventEmitter<any>;
  public fontEmitter: EventEmitter<any>;
  public checkBoxEmitter: EventEmitter<any>;
  public findChangeEmitter: EventEmitter<any>;
  public colChangeEmitter: EventEmitter<any>;
  public loginSwitchCompanyEmitter: EventEmitter<any>;
  public tableSelectedChangeEmitter: EventEmitter<any>;
  public reuseRouterEmitter: EventEmitter<any>;
  public tableGridIdToSearchForm: EventEmitter<any>;
  public routerEvent: EventEmitter<any>;
  public socketEvent: EventEmitter<any>;
  public searchReload: EventEmitter<any>;
  public msgReadEvent: EventEmitter<any>;
  public tipNavUpdate: EventEmitter<any>;
  constructor(private  nzModal: NzModalService) {
     /** 参数传递*/
      this.valueEventEmitter = new EventEmitter();
       /** 用户参数传递*/
       this.userInfoEventEmitter = new EventEmitter();
       /** 页面标题*/
     //  this.titleEventEmitter = new EventEmitter();
       /** formId传递*/
       this.fromIdEventEmitter = new EventEmitter();
       /** 查询按钮权限*/
       this.findButtonEmitter = new EventEmitter();
        /** 页面页码和条数变动*/
        this.pageNumEmitter = new EventEmitter();
        /** 字体设置变动*/
        this.fontEmitter = new EventEmitter<any>();
        /** 搜索框前选择框是否显示*/
        this.checkBoxEmitter = new EventEmitter<any>();
        /** 搜索框动态*/
        this.findChangeEmitter = new EventEmitter();
        /** 表头动态*/
        this.colChangeEmitter = new EventEmitter();
        /** 登陆切换服务公司 */
        this.loginSwitchCompanyEmitter = new EventEmitter<any>();
        /** 表格选中全选更改*/
        this.tableSelectedChangeEmitter = new EventEmitter();
        /** reuseRouter*/
        this.reuseRouterEmitter = new EventEmitter<any>();
        /** tableGridIdToSearchForm*/
        this.tableGridIdToSearchForm = new EventEmitter<any>();
        /** 路由变化*/
        this.routerEvent = new EventEmitter<any>();
        /** socket启动*/
        this.socketEvent = new EventEmitter<any>();
        /** table数据更新*/
        this.searchReload = new EventEmitter<any>();
        /** 消息已读，刷新header上消息徽章 */
        this.msgReadEvent = new EventEmitter<any>();
        /** 页面tab更新 */
        this.tipNavUpdate = new EventEmitter<any>();
   }
   // 公用信息弹窗
   ref: NzModalRef;
   public modalOpen(data: any) {
     if (data.type !== 'info' && data.type !== 'warning' && data.type !== 'success' && data.type !== 'error') {
       return;
     }
    this.ref = this.nzModal[data.type]({
      nzTitle: data.title,
      nzContent: data.content
    });
    // window.setTimeout(() => {
    //   this.ref.destroy();
    // }, 1500);
   }
   // 公用服务弹窗

   public createModal(modalOPtion: ModalOption): NzModalRef { // 创建弹窗
    const modalRef: NzModalRef =  this.nzModal.create({
          nzTitle: modalOPtion.tplTitle,
          nzContent: modalOPtion.tplContent,
          nzFooter: modalOPtion.tplFooter,
          nzWidth: modalOPtion.width || 520,
          nzMaskClosable: modalOPtion.maskClosable || true,
          nzClosable: modalOPtion.closable || true
        });
      return modalRef;
   }
   public destoryModal(ref: NzModalRef, timeout: number = 1500) { // 销毁
     window.setTimeout(() => {
       ref.destroy();
     }, timeout);
   }

     /**loadStyleTheme */
     public loadStyleTheme(val: string, rend: Renderer2) {
        const colorlink = document.querySelector('head .colorlink');
        const head = document.querySelector('head') as HTMLHeadElement;
        const colorStyle =  rend.createElement('link') as HTMLLinkElement;
        if (val) {
          rend.addClass(colorStyle, 'colorlink');
          rend.setAttribute(colorStyle, 'rel', 'stylesheet');
          rend.setAttribute(colorStyle, 'type', 'text/css');
          rend.setAttribute(colorStyle, 'href', `./assets/theme/${val}.css`);
          rend.appendChild(head, colorStyle);
        }
        // tslint:disable-next-line: no-unused-expression
        colorlink && rend.removeChild(head, colorlink);
      }

}
