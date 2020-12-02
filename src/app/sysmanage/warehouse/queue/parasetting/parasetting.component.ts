import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { WAREHOUSEURL } from '../../../../common/model/warehouseUrl';
import { urls } from '../../../../common/model/url';


@Component({
  selector: 'app-parasetting',
  templateUrl: './parasetting.component.html',
  styleUrls: ['./parasetting.component.css']
})
export class ParasettingComponent implements OnInit {

  isChang1 = false;
  validateForm1: FormGroup;
  validateForm: FormGroup;
  implistLoading: any;
  isChange = false;
  dealTypeArr: any = [];
  dealType: any;
  private tplModal: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpUtilService,
    private nm: NzModalService,
    private nzMess: NzMessageService,
    private nz: NzNotificationService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      noticeMinute: [null],
      noticeCount: [null],
      noticeInterval: [null],
      dealType: [null],
      dealValue: [null],
      dealCount: [null],
      supportContact: [null],
    });
    this.validateForm1 = this.fb.group({
      confirmMinute: [null],
      confirmTimeoutCount: [null],
      confirmTimeoutInterval: [null],
      unconfirmedRequeue: [null],
    });
    // this.getStatic(this.dealTypeArr,"disp.dealType")
    this.http.post(WAREHOUSEURL.GETALLCODESETS, { codesetCode: 'product_disp.dealType' }).then(res => {
      // console.log(res);
      if (res.success) {
        res.data.data.forEach((item: { itemCname: string; itemCode: string; }) => {
          const data = { name: '', value: '' };
          data.name = item.itemCname;
          data.value = item.itemCode;
          this.dealTypeArr.push(data);
        });
      }
      console.log(this.dealTypeArr + '11111111');
    });
     this.selectSchedule();
     // this.selectJGWL();*/

  }
    selectSchedule(){
      this.http.post(WAREHOUSEURL.GETPARAMETER,{}).then(res=>{
        if(res.success){
          console.log(res)
          this.validateForm.patchValue(res.data.data);
          this.dealType = res.data.data.dealType;
        }
      })
    }
  /*  selectJGWL(){
      this.http.post(WAREHOUSEURL.selectJGWLParameter,{}).then(res=>{
        if(res.success){
          console.log(res)
          this.validateForm1.patchValue(res.data.data);
        }
      })
    }*/

  importConfirm3() {
    let param: any = {};
    param = this.validateForm.getRawValue();
    // console.log(param);
    if (param.noticeMinute.length > 4 ) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '您输入的进厂最大时长超长,请重新输入'
      });
      return;
    }
    if (param.noticeCount.length > 3) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '您输入的间隔时间超长，请重新输入'
      });
      return;
    }
    if (param.noticeInterval.length > 5) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '您输入的提醒次数超长，请重新输入'
      });
      return;
    }
    if (param.dealType === 'product_disp_dealType_addMinutes' && param.noticeInterval.length > 3) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '您输入的提醒间隔超长，请重新输入'
      });
      return;
    }
    if (param.dealType === 'product_disp_dealType_addMinutes' && param.dealCount.length > 3) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '您输入的顺延次数超长，请重新输入'
      });
      return;
    }
    if (param.dealType === 'product_disp_dealType_addMinutes' && param.dealValue.length > 3) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '您输入的顺延时长超长，请重新输入'
      });
      return;
    }
    this.http.post(WAREHOUSEURL.SETPARAMETER, param).then(res => {
      if (res.success) {
        this.nz.success('提示信息', res.data.data);
        this.selectSchedule();
        console.log(res);
      }
    });
  }

  /*  importConfirm1(){
      let param:any={};
      param= this.validateForm1.getRawValue()
      this.http.post(WAREHOUSEURL.updateJGWLParameter,param).then(res=>{
        if(res.success){
          this.nz.success("提示信息",res.data.data)
          this.selectJGWL();
        }
      })
    }*/
  // 获取静态数据



  modelChange(data: any) {
    this.dealType = data;
  }
}
