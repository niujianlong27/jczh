import { Component, OnInit } from '@angular/core';
import { localUrls } from "../../../../common/model/localUrls";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'app-payment-audit',
  templateUrl: './payment-audit.component.html',
  styleUrls: ['./payment-audit.component.css']
})
export class PaymentAuditComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  listLoading2: boolean = false;
  dataSet1: any = [];
  dataSet2: any = [];
  totalPages1: Number = 1;
  totalPages2: Number = 1;
  pageSize1: Number = 30;
  pageSize2: Number = 30;
  selectedList1: any = [];
  selectedList2: any = [];
  tPaymentModels:Array<any>=[];
  gridOneHeight: string;
  gridTwoHeight: string;
  private searchData:any = {};
  caculateEnameArr: any = [
    { field: 'totalAmount', tipInfo: '已选总金额', tipInfoType: '元', demLength: 2 },
    { field: 'payYfAmount', tipInfo: '已付金额', tipInfoType: '元', demLength: 2 },
    { field: 'payAmount', tipInfo: '请款金额', tipInfoType: '元', demLength: 2 },
  ];

  constructor( private nm: NzModalService, private nz: NzNotificationService, private httpServive: HttpUtilService) { }

  ngOnInit() {
   // this.getList1({ page: 1, length: this.pageSize1 });
  }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }
  listSearch(data:any) {
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.searchData = data;
    this.getList1(data);
  }

  getPageIndex1(page: any): void {
   // this.getList1({ page: page, length: this.pageSize1 });
    this.searchData.page = page;
    this.getList1(this.searchData)
  }

  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.searchData.page = 1;
    this.searchData.length = this.pageSize1;
    this.getList1(this.searchData);
   // this.getList1({ page: 1, length: this.pageSize1 });
  }

  getList1(data: any): void {
    let url = localUrls.paymentAuditRecordUrl;
    this.listLoading1 = true;
    this.dataSet1 = [];
    this.httpServive.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;
      }
    })
  }

  getPageIndex2(page: any): void {
    this.getList2({ page: page, length: this.pageSize2,tPaymentModels:this.tPaymentModels });
  }

  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({ page: 1, length: this.pageSize2,tPaymentModels:this.tPaymentModels });
  }

  getList2(data: any): void {
    let url = localUrls.paymentAuditDetailUrl;
    this.listLoading2 = true;
    this.dataSet2 = [];
    this.httpServive.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading2 = false;
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
      }
    })
  }

  selectData1Fun(data: any): void {
    this.selectedList1 = data;
    this.tPaymentModels=[];
    this.dataSet2=[];
    if (this.selectedList1.length === 0) {

    } else {
      for (const value of this.selectedList1) {
        this.tPaymentModels.push({paymentNo:value.paymentNo});
      }
      this.getList2({ page: 1, length: this.pageSize2,tPaymentModels:this.tPaymentModels });
    }
  }
  selectData2Fun(data: any): void {
    this.selectedList2 = data;
  }



  btnClick(data: any): void {
    console.log(data);
    if(this.selectedList1.length<1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }
    if(data.buttonId === 'review'|| data.buttonId ==='repeal'){
        let url = data.buttonId === 'review' ? localUrls.paymentAuditChecklUrl : localUrls.paymentAuditDeleteUrl;//审核   撤销审核
        let successTip = data.buttonId === 'review' ? '审核成功' : '撤销审核成功';
        let param =[];
        this.selectedList1.forEach(element => {
          let obj ={};
          obj['paymentNo'] = element.paymentNo;
          obj['rowid'] = element.rowid;
          param.push(obj);
        });
        this.httpServive.post(url,{tPaymentModels:param}).then((res:any)=>{
          if(res.success){
            this.nz.create('success', '提示信息', successTip, { nzDuration: 3000 });
           // this.getList1({ page: 1, length: this.pageSize1 });
            this.searchData.page = 1;
            this.getList1(this.searchData)
            this.selectedList1=[];

          }
        })
    }

  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };
}

