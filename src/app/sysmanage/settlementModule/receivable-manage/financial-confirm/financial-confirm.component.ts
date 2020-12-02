import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../common/services/global-service.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { urls } from '../../../../common/model/url';
import { HttpUtilService } from '../../../../common/services/http-util.service';
@Component({
  selector: 'app-financial-confirm',
  templateUrl: './financial-confirm.component.html',
  styleUrls: ['./financial-confirm.component.css']
})
export class FinancialConfirmComponent implements OnInit {
   dataSet:any[] = [];
   totalNum: number;
   isLoading:boolean = true;
   visible:boolean = false;
   title:string;
   modalCon:string;
   btnEvent: string;
   selectData:any[];
   private searchData: any = {};
  constructor(private http: HttpUtilService,private glo: GlobalService, private nz: NzNotificationService) { }

  ngOnInit() {
   // this.getList({page:1,length:30});
  }
  listSearch(param:any){
    this.searchData = param;
   this.getList(param);
  }
  getList(param:any){
    this.isLoading = true;
    this.dataSet = [];
    this.http.post(urls.financialConfirm,param).then((res:any)=>{
      this.isLoading = false;
      if(res.success){
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalNum = res.data.data && res.data.data.total || 0;
      }
    })
  }
  btnClick(data:any){
    console.log(data);
      this.selectData = [];
     if(!data.data[0]){
       this.glo.modalOpen({type:"warning",title:"提示信息",content:"请选择数据进行操作"});
       return;
     }
     if(data.type.buttonId === 'ReceiptConfirm'){
       this.visible = true;
       this.title = "提示信息";
       this.modalCon = "确定要将选中的数据进行收款确认？";
       this.btnEvent = data.type.buttonId;
       this.selectData = data.data;
     }
     if(data.type.buttonId === 'ReceiptCancel'){
      this.visible = true;
      this.title = "提示信息";
      this.modalCon = "确定要将选中的数据进行取消确认？";
      this.btnEvent = data.type.buttonId;
      this.selectData = data.data;
    }
  }
  modalResult(flag:any){
    let param = [];
    // 如果settleRecNo缺失 status为true
    const status =  this.selectData.some((data:any)=>{
      let obj:any = {};
      obj.settleRecNo = data.settleRecNo;
      // obj.rowid = data.rowid;
      param.push(obj);
      return !data.settleRecNo
    });
    if (status) {
      this.nz.warning('提示消息','请选择有收款单号数据进行操作！');
      return;
    }
    if(flag.type === 'ok'){
      this.btnEvent === "ReceiptConfirm"?this.updateFinancialConfirmation(param):null;
      this.btnEvent === "ReceiptCancel"?this.updateCancelConfirmation(param):null;
    }else{
      this.visible = false;
    }
  }
  updateFinancialConfirmation(param:any){
    this.http.post(urls.updateFinancialConfirmation,{tSettleRecModels:param}).then((res:any) => {
      if(res.success){
        this.visible = false;
       // this.getList({page:1,length:30});
        this.searchData.page = 1;
        this.getList(this.searchData);
        this.nz.create('success','提示信息','收款确认成功',{nzDuration:3000});
      }
    })
  }
  updateCancelConfirmation(param:any) {
    console.log(121);
    this.http.post(urls.updateCancelConfirmation,{tSettleRecModels:param}).then( (res:any) => {
      if(res.success){
        this.visible = false;
        //this.getList({page:1,length:30});
        this.searchData.page = 1;
        this.getList(this.searchData);
        this.nz.create('success','提示信息','取消确认成功',{nzDuration:3000});
      }
    })
  }
}
