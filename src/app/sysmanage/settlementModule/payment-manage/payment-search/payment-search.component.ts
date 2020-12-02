import { Component, OnInit } from '@angular/core';
import { localUrls } from "../../../../common/model/localUrls";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import {toDemical} from '../../../../common/validators/validator';
import {HttpClient} from '@angular/common/http';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-payment-search',
  templateUrl: './payment-search.component.html',
  styleUrls: ['./payment-search.component.css']
})
export class PaymentSearchComponent implements OnInit {
  tplModal: NzModalRef;
  // pageSize: number = 30;//条数
  listLoading1: boolean = false;
  listLoading2: boolean = false;
  dataSet1: any = [];
  dataSet2:any = [];
  totalPages1: Number = 1;
  totalPages2:Number =1;
  pageSize1:Number = 30;
  pageSize2: Number = 30;
  selectedList1: Array<any> = [];
  selectedList2: any = [];
  tPaymentModels:Array<any>=[];
  gridOneHeight: string;
  gridTwoHeight: string;
  private searchData:any = {};
  caculateEnameArr: any = [
    { field: 'totalAmount', tipInfo: '已选总金额', tipInfoType: '元', demLength: 2},
    { field: 'payYfAmount', tipInfo: '已付金额', tipInfoType: '元', demLength: 2 },
    { field: 'payAmount', tipInfo: '请款金额', tipInfoType: '元', demLength: 2 },
  ];
  constructor(private http: HttpUtilService,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private  angularHttp: HttpClient,
              private info: UserinfoService
  ) { }

  ngOnInit() {
    //this.getList1({ page: 1, length: this.pageSize1 });
  }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }
  listSearch(data:any){
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.searchData = data;
    this.getList1(data);
  }

  getPageIndex1(page: any): void {
    this.searchData.page = page;
    this.getList1({ ...this.searchData });
    //this.getList1({ page: page, length: this.pageSize1 });
  }

  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.searchData.length = this.pageSize1;
    this.searchData.page = 1;
    this.getList1({ ...this.searchData });
    //this.getList1({ page: 1, length: this.pageSize1 });
  }

  getList1(data: any): void {
    let url = localUrls.paymentSearchListUrl;
    this.listLoading1 = true;
    this.dataSet1 = [];
    this.http.post(url, data).then((res: any) => {

      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data ||[];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  getPageIndex2(page: any): void {
    this.getList2({ page: page, length: this.pageSize2,tPaymentModels:this.tPaymentModels});
  }

  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({ page: 1, length: this.pageSize2,tPaymentModels:this.tPaymentModels });
  }

  getList2(data: any): void {
    console.log("getList2",data)
    let url = localUrls.paymentSearchListUrl2;
    this.listLoading2 = true;
    this.dataSet2 = [];
    this.http.post(url, data).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        // console.log(res.data.data)
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total;
      }
    }, () => {
      this.listLoading2 = false;
    });
  }

  selectData1Fun(data:any):void{
    console.log(data)
    this.selectedList1 = data;
    this.tPaymentModels=[];
    this.dataSet2=[];
    if (this.selectedList1.length === 0) {

    } else {
      for (const value of this.selectedList1) {
        this.tPaymentModels.push({paymentNo:value.paymentNo,settleSubno:value.settleSubno || ''});
      }
      this.getList2({ page: 1, length: this.pageSize2,tPaymentModels:this.tPaymentModels });
    }

  }
  selectData2Fun(data: any): void {
    this.selectedList2 = data;
  }

  btnClick(data: any): void {
    console.log(data);
    switch (data.buttonId) {
      case 'Delete':{
        if(this.selectedList1.length<1){
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选择数据进行操作。'
          });
          this.destroyTplModal();
          return;
        }
        let url = localUrls.paymentSearchDelUrl;
        let param = [];
        console.log(this.selectedList1);

        this.selectedList1.forEach(element => {
          let obj = {};
          obj['paymentNo'] = element.paymentNo;
          param.push(obj);
        });
        this.http.post(url, {tPaymentModels:param}).then((res:any)=>{
          if(res.success){
            this.nz.create('success', '提示信息', '作废成功', { nzDuration: 3000 });
           // this.getList1({ page: 1, length: this.pageSize1 });
            this.searchData.page = 1;
            this.getList1({...this.searchData});
          }
        })
      }
      break;
      case 'kindPrint':{
        if(this.selectedList1.length<1){
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选择数据进行操作。'
          });
          this.destroyTplModal();
          return;
        }
        this.print();
      }
      break;
      case 'Export':{
      this.Export();
      }
        break;
    }
    // if (data.buttonId === 'Delete'){
    //   //作废
    //   if(this.selectedList1.length<1){
    //     this.tplModal = this.nm.warning({
    //       nzTitle: '提示信息',
    //       nzContent: '请选择数据进行操作。'
    //     });
    //     this.destroyTplModal();
    //     return;
    //   }
    //   let url = localUrls.paymentSearchDelUrl;
    //   let param = [];
    //   console.log(this.selectedList1);
    //
    //   this.selectedList1.forEach(element => {
    //     let obj = {};
    //     obj['paymentNo'] = element.paymentNo;
    //     param.push(obj);
    //   });
    //   this.http.post(url, {tPaymentModels:param}).then((res:any)=>{
    //     if(res.success){
    //       this.nz.create('success', '提示信息', '作废成功', { nzDuration: 3000 });
    //       this.getList1({ page: 1, length: this.pageSize1 });
    //     }
    //   })
    // }
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  /**
   * 付款打印
   */
  print(): void {
    const paymentNoList=[];
    this.selectedList1.forEach(
      res=>{
        paymentNoList.push(res.paymentNo);
      }
    );
    // const paymentNo = this.modalValidateForm.get('paymentNo').value;
    // if (!paymentNo) {
    //   this.nz.warning('提示消息', '请付款申请登记后再打印请款单！');
    //   return;
    // }
    this.angularHttp.get(localUrls.payment,
      {
        responseType: 'blob',
        params: {
          paymentNoList: paymentNoList,
          requestUserId: this.info.get('USER').userId,
          requestCompanyId: this.info.get('USER').companyId
        }
      }
    ).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/pdf'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      res => {
        // this.nz.warning('提示消息', '打印请款单失败!');
      }
    );

  }
  Export(){
      let url: any = localUrls.getBillingInformationExport;
      this.angularHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
        let blob = new Blob([res], {type: 'application/xlsx'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `付款申请查询.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

}
