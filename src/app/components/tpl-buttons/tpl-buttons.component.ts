import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { UserinfoService } from '@service/userinfo-service.service';
import { urls } from '@model/url';
import { HttpUtilService } from '@service/http-util.service';
import { TplButtonsService } from './tpl-buttons.service';
import { ContainerHeightService } from '@service/container-height.service';
@Component({
  selector: 'tpl-buttons',
  templateUrl: './tpl-buttons.component.html',
  styleUrls: ['./tpl-buttons.component.css']
})
export class TplButtonsComponent implements OnInit {
  buttonArr: any[]; // 接收的按钮数据
  searchFormHidden = false;
  private tempFormId: string;
  @Input() formId: string; // 优先级高
  @Input() gridId: string; //
  @Input() btnDisable: any = {}; // 禁用 对应的buttonId
  @Input() btnHiden: any = {}; // 隐藏 对应的buttonId
  @Input() btnLoading: any = {}; // buttong loading
  @Input() innerDisable: boolean; // 组件内部会有disabled 设置true可以去掉

  @Output() btnClick = new EventEmitter<any>(); // 按钮点击事件
  @Output() btnSearch = new EventEmitter<boolean>(); // 查询按钮
  @Output() btnDataReturn = new EventEmitter<any>(); // 按钮返回
  constructor(private http: HttpUtilService, private info: UserinfoService, private tplbtnService: TplButtonsService,
    private conHeight: ContainerHeightService, private el: ElementRef) {

   }

  ngOnInit() {
    this.tempFormId = this.formId || this.info.APPINFO.formId;
    this.getUserButton({formId:  this.tempFormId, gridId: this.gridId, userId: this.info.APPINFO.USER.userId});
  }
  buttonClick(data: any) {
    this.info.set('buttonId', data.buttonId);
    this.btnClick.emit(data);
    (window as any).$FUNSELF && (window as any).$FUNSELF('',data.buttonName);
   /* data.buttonId !== 'Find' && this.btnClick.emit(data);//按钮点击事件触发
    data.buttonId === 'Find' && this.tplbtnService.formSearch.emit({formId:this.formId});*/
  }
  /*resetForm(){
     this.tplbtnService.formReset.emit({formId:this.formId});
  }*/
  getUserButton(data: any): void { // 获取用户按钮
    this.http.post(urls.button, data).then((res: any) => { // 获取按钮
      if (res.success) {
        this.buttonArr = res.data.data;
        const find = this.buttonArr.filter((item: any) => item.buttonId === 'Find');
        this.tplbtnService.btnFind.emit({find: find, formId: this.tempFormId});
        this.btnDataReturn.emit(this.buttonArr);
      }
      window.setTimeout(() => {
        const btnEl = this.el.nativeElement.querySelector('div.btn-box');
        const h = btnEl ? btnEl.offsetHeight : 0;
        this.conHeight.primaryButtonHeight.emit({formId: this.tempFormId, height: h});
      }, 50);
    });
  }
  collaspedSearch() { // 查询的按钮
    this.searchFormHidden = !this.searchFormHidden;
    this.btnSearch.emit(this.searchFormHidden); // 查询按钮事件
    this.tplbtnService.collaspedSearch.emit({formId: this.tempFormId, searchFormHidden: this.searchFormHidden});
  }
}
