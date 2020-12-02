import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UserinfoService } from '@service/userinfo-service.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-switch-company',
  templateUrl: './switch-company.component.html',
  styleUrls: ['./switch-company.component.css']
})
export class SwitchCompanyComponent implements OnInit {
  result: any = {};
  visible = false;
  selected: boolean[] = [];
  public listData: any[] = [];
  private constData: any[] = [];
  public value: string;
  @Input() set modalVisible(val: boolean) {
     this.visible = val;
     this.selected = [];
     this.value = '';
  }
  get modalVisible() {
    return this.visible;
  }
  @Input() isLogin = false;
  @Input() set data(val: any[]) {
    this.listData = [...(val || [])];
    this.constData = [...(val || [])];
  }
  @Output() modalClose = new EventEmitter<boolean>();
  @Output() modalResult = new EventEmitter<any>();
  constructor(private mess: NzMessageService, private info: UserinfoService) { }

  ngOnInit() {
    if (!this.isLogin) {
      this.result = {
        companyId: this.info.get('USER').companyId,
        companyType: this.info.get('USER').companyType,
        companyStatus: this.info.get('USER').companyStatus,
        companyName: this.info.get('USER').companyName};
    }
  }
  public confirm() {
    if (!this.value) {
      this.listData = [...(this.constData || [])];
    } else {
      this.listData = (this.constData || []).filter((x: any) => x.companyName.includes(this.value));
    }
  }
  public keydown() {
    this.confirm();
  }
  public reset() {
    this.value = '';
    this.listData = [...(this.constData || [])];
  }
  selectCompant(data: any, index: number) {
    this.selected = [];
    this.selected[index] = true;
    this.result = {};
    this.result = data;
  }
  handleCancel() {
     this.visible = false;
  }
  handleOk() {
      if (!this.result.companyId) {
         this.mess.error('请选择要切换的公司');
         return;
      }
      this.visible = false;
      if ((this.result.companyId !== this.info.get('USER').companyId) || this.isLogin) {
        this.modalResult.emit(this.result);
      }
  }
  afterClose() {
    this.modalClose.emit(false);
  }
}
