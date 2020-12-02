/*
 * @Title: ship-demand-add.component
 * @Description: 船舶需求新增跳转页面
 * @Created: zhaozeping
 * @Modified:
 */

import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from "@angular/router";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {portUrl} from '../../../../common/model/portUrl'
import {Utils} from '../../../../common/util/utils';


@Component({
  selector: 'app-ship-demand-add',
  templateUrl: './ship-demand-add.component.html',
  styleUrls: ['./ship-demand-add.component.css']
})
export class ShipDemandAddComponent implements OnInit {

  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 1;
  pageSize1:Number = 30;

  formGroup:FormGroup;

  status:any;
  buttonId:any;
  rowid:any;
  inpValidate:any;
  showExplainFlag:boolean=false;
  tplModal:any;
  demandNo:any;


  userHeader:any;

  constructor(private http:HttpUtilService,private fb:FormBuilder,private router:Router,private nm:NzModalService,private nz: NzNotificationService,) { }
  /**
   *  初始化
   *
   */
  ngOnInit() {
    this.formGroup = this.fb.group({
      arrivalProt: ['',[]],
      reqDate:['',[]],
      weight:['',[]],
      remark:['',[]],
    });
    let topInfo = JSON.parse(sessionStorage.getItem('shipDemand')||'{}');
    this.status = topInfo.status;

    if(topInfo.status == 'Update'){
      this.formGroup.patchValue(topInfo);
      this.getList({page: 1, length: this.pageSize1,demandId:topInfo.demandNo});
      this.rowid=topInfo.rowid;
      this.demandNo=topInfo.demandNo;
      console.log(topInfo.demandNo);
  }
}

  /**
   * 查询明细
   */
  getList(data:any){
    let url=portUrl.shipDemandDetailGetList;//接口
    this.listLoading1 = true;

    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;
      }}
    )}
  /**
   *  按钮触发事件
   */
  btnClick(data:any){
    this.buttonId=data.buttonId;
    switch(this.buttonId){
      case'Add':
        this.btnAdd(data);
        break;
      case'Save':
        this.btnSave(data);
        break;
      case'Cancle':
        this.router.navigate(['/system/planManage/shipDemand']);
        break;
      default:
        break;
    }
  }
  /**
   *  新增明细按钮
   */
  btnAdd(data:any){
    this.dataSet1.unshift({});
    this.userHeader.map((item)=>{
      this.dataSet1[0][item.colEname] = '';
    });
    this.dataSet1 = [...this.dataSet1]
  }

  /**
   * :保存按钮
   */
  btnSave(data:any){
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
    let url = this.status=="Add"?portUrl.shipDemandAdd:portUrl.shipDemandDetailUpdate;//接口

    let param:any = {tBoatReqDetailModels: '',rowid:'',demandNo:''};

    param = this.formGroup.getRawValue();
    param.tBoatReqDetailModels =  this.dataSet1;
    param.rowid = this.rowid;
    param.demandNo=this.demandNo;
    param.reqDate = param.reqDate instanceof Date ? Utils.dateFormat(param.reqDate,'yyyy-MM-dd HH:mm:ss') : param.reqDate || '';


    if (this.formGroup.status == 'INVALID' ) {
      return;
    }
    if(this.dataSet1.length < 1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请添加明细后操作！'
      });
      this.destroyTplModal();
      return;
    }
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success','提示信息','保存成功',{nzDuration:3000});
          this.router.navigate(['/system/planManage/shipDemand']);
        }
      }
    );
    // this.router.navigate(['/system/planManage/shipDemand']);
  }


  /**
   * 删除按钮
   */
  delete(data:any,i:number){
    this.dataSet1.splice(i,1);
    this.dataSet1 = [...this.dataSet1];
  }

  /**
   *  获取
   */
  getUserHeader(data:any){
    this.userHeader = data;
  }
  /**
   *  消除弹窗
   */
  destroyTplModal(){
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }
}
