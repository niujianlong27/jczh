import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { urls } from '../../../../common/model/url';
@Component({
  selector: 'app-flat-account-order',
  templateUrl: './flat-account-order.component.html',
  styleUrls: ['./flat-account-order.component.css']
})
export class FlatAccountOrderComponent implements OnInit {
  
  constructor(private http: HttpClient, private modal: NzModalService, private message: NzMessageService) { }
   orderLoading: boolean = false;
   settleLoading: boolean = false;
   totalPage: number = 0;
   orderData: any[] = [];
   settleData: any[] = [];
   searchData: any = {};
   selectOrderData:any[] = [];
   modalObj: any = {
     visible: false,
     title: null,
     model:null,
     loading: false
   }
  ngOnInit() {
   // this.getOrder({page:1,length:100});
  }
  search(data:any){
    this.searchData = data;
    this.getOrder(data);
  }
  btnClick(data:any){
    switch(data.buttonId){
      case 'AutomaticAccount':
       this.modal.confirm({
                nzTitle: `提示信息`,
                nzContent: `确定将选中的数据进行${data.buttonName}？`,
                nzOnOk: () => new Promise((resolve,reject) => this.automaticAccount(resolve,reject))
              })
        break;
      case 'ManualAccount':
        this.modalObj.title = `客户平账 > ${data.buttonName}`;
        this.modalObj.visible = true;
        break;
      default:
        break;
    }
  }
  private automaticAccount(resolve:any,reject:any){
      const tOrderModelList = this.selectOrderData.map(x => ({orderNo: x.orderNo}));
      this.http.post(urls.flatAccount,{tOrderModelList: tOrderModelList}).subscribe(
        (res:any) => {
          if(res.code === 100){
            this.getOrder(this.searchData);
            resolve(res);
            this.message.success(res.msg);
          }else{
            reject(res);
          }
        }
      )
  }
  manualAccount(){
    let feeAmount: number = 0;
    const tFlatfeeItemList = this.selectOrderData.map(x => {
       const amount = Number(x.payPrice || 0) - Number(x.allocationAmount);
       feeAmount += amount;
      return {
        settleReportNo: x.orderNo,
        feeAmount: amount
      }
    })
    this.modalObj.loading = true;
    this.http.post(urls.manualFlatAccount,{reason: this.modalObj.model, feeAmount: feeAmount, tFlatfeeItemList: tFlatfeeItemList}).subscribe(
      (res:any) => {
        this.modalObj.loading = false;
        if(res.code === 100){
           this.modalObj.visible = false;
           this.getOrder(this.searchData);
           this.message.success(res.msg);
        }
      }
    )
  }
  private getOrder(params = {}){
    this.orderLoading = true;
   return this.http.post(urls.flatAccountOrder,params).subscribe(
      (res:any) => {
        this.orderLoading = false;
        if(res.code === 100){
           this.selectOrderData = [];
           this.settleData = [];
           this.orderData = res.data.data;
           this.totalPage = res.data.total;
        }
      }
    )
  }
  private getSettle(params = {}){
   this.settleLoading = true;
   this.http.post(urls.flatAccountSettleRecI,params).subscribe(
     (res:any) => {
       this.settleLoading = false;
       if(res.code === 100){
         this.settleData = res.data.data;
       }
     }
   )
  }
  selectOrder(data:any){
    this.selectOrderData = data;
    this.settleData = [];
    if(!data[0]) return;
    const tSettleRecItemModelList = data.map(x => ({orderNo: x.orderNo}));
    this.getSettle({tSettleRecItemModelList: tSettleRecItemModelList});
  }
}
