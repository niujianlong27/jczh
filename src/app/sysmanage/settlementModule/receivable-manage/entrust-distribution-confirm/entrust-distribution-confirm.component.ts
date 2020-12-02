import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { urls } from '../../../../common/model/url';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-entrust-distribution-confirm',
  templateUrl: './entrust-distribution-confirm.component.html',
  styleUrls: ['./entrust-distribution-confirm.component.css']
})
export class EntrustDistributionConfirmComponent implements OnInit {
  listData:any[] = [];
  loading:boolean = false;
  selectData:any[] = [];
  private searchParam:any = {};
  private modalRef: NzModalRef;
  private modalLoading:boolean = false;
  totalPage: number ;//数据总条数
  pageSize: number = 30;//条数
  //tempSearchParam:any = {};

  //数据总数
  constructor(private http: HttpUtilService,
              private angularHttp: HttpClient,
              private modal:NzModalService, private nz: NzNotificationService) { }

  ngOnInit() {
  }
  listSearch(param:any){
    this.searchParam = param;
    this.listDataFun(this.searchParam);
  }
  listDataFun(param:any = {}){
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.loading = true;
    this.http.post(urls.selectOrderConfirmInfo,param).then((res:any)=>{
      this.loading = false;
      if(res.success){
        this.listData = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data.total;
      }
    })
  }
  selectDataFun(data:any[]){
    this.selectData = [];
    this.selectData = data;
  }
  btnClick(data:any){
    switch(data.type.buttonId){
      case 'cancel':
        this.modalRef = this.modal.create({
          nzTitle:'取消确认提示',
          nzContent:'<p class="f-b text-center m-re">是否对选中的数据进行取消确认?</p>',
          nzOkLoading:this.modalLoading,
          nzOnOk:()=>{
            this.cancelFun();
            return false;
          }
        })
        break;
      case 'confirm':
        this.modalRef = this.modal.create({
          nzTitle:'确认提示',
          nzContent:'<p class="f-b text-center m-re">是否对选中的数据进行确认?</p>',
          nzOnOk:()=>{
            this.confirmFun();
            return false;
          }
        })
        break;
      case 'Export':
        this.export();
        break;
      case 'Refund':
        this.modalRef = this.modal.create({
          nzTitle:'确认提示',
          nzContent:`<p class="f-b text-center m-re">是否对选中的数据进行${data.type.buttonName}?</p>`,
          nzOnOk:()=>{
            this.refund();
            return false;
          }
        })
      default:
        break;
    }
  }
  private refund(){
    const orderNoList = this.selectData.map(x => x.orderNo);
    const params = {orderNoList: orderNoList};
    this.angularHttp.post(urls.confirmOrderRefund,params).subscribe((res:any) => {
      if(res.code === 100){
        this.listDataFun(this.searchParam);
        this.modalRef.destroy();
        this.nz.create('success','提示信息',res.msg,{nzDuration:3000});
      }
    })
  }
  confirmFun(){
    let param = {tOrders:[]};
    this.selectData.map((x:any)=>{
      let o:any = {};
      o.orderNo = x.orderNo;
      param.tOrders.push(o);
    })
    this.http.post(urls.confirm,param).then((x:any)=>{
      if(x.success){
        this.listDataFun(this.searchParam);
        this.modalRef.destroy();
        this.nz.create('success','提示信息','确认成功',{nzDuration:3000});
      }
    })
  }
  cancelFun(){
    let param = {tOrders:[]};
    this.selectData.map((x:any)=>{
      let o:any = {};
      o.orderNo = x.orderNo;
      param.tOrders.push(o);
    })
    this.http.post(urls.cancelConfirm,param).then((x:any)=>{
      if(x.success){
        this.listDataFun(this.searchParam);
        this.modalRef.destroy();
        this.nz.create('success','提示信息','取消确认成功',{nzDuration:3000});
      }
    })
  }

  export(){
    let url: any = urls.orderConfirmExport;
    this.angularHttp.post(url, this.searchParam, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/xlsx'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `合同配款确认.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

}
