import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import {urls} from '../../../../common/model/url';

@Component({
  selector: 'app-parasetting',
  templateUrl: './parasetting.component.html',
  styleUrls: ['./parasetting.component.css']
})
export class ParasettingComponent implements OnInit {
  isChang1:boolean = false;
  validateForm1:FormGroup;
  validateForm:FormGroup;
  implistLoading:any
  implistLoading1:any
  isChange:boolean = false;
  dealTypeArr:any = []
  dealType:any;

  constructor(
    private fb:FormBuilder,
    private http: HttpUtilService,
    private nm:NzModalService,
    private nzMess:NzMessageService,
    private nz:NzNotificationService,
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
    this.getStatic(this.dealTypeArr,"disp.dealType")
    this.selectSchedule();
    this.selectJGWL();

  }
  selectSchedule(){
    this.http.post(RGDISPURL.selectScheduleParameter,{}).then(res=>{
      if(res.success){
        console.log(res)
        this.validateForm.patchValue(res.data.data);
        this.dealType = res.data.data.dealType;
      }
    })
  }
  selectJGWL(){
    this.http.post(RGDISPURL.selectJGWLParameter,{}).then(res=>{
      if(res.success){
        console.log(res)
        this.validateForm1.patchValue(res.data.data);
      }
    })
  }

  importConfirm3(){
    let param:any={};
    param= this.validateForm.getRawValue()
    this.http.post(RGDISPURL.updateScheduleParameter,param).then(res=>{
      if(res.success){
        this.nz.success("提示信息",res.data.data)
        this.selectSchedule();
      }
    })
  }

  importConfirm1(){
    let param:any={};
    param= this.validateForm1.getRawValue()
    this.http.post(RGDISPURL.updateJGWLParameter,param).then(res=>{
      if(res.success){
        this.nz.success("提示信息",res.data.data)
        this.selectJGWL();
      }
    })
  }
  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }


  modelChange(data:any){
    this.dealType = data;
  }
}
