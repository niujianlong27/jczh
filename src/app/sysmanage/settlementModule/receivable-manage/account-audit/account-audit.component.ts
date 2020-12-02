import { Component, OnInit } from '@angular/core';
import { localUrls } from '../../../../common/model/localUrls';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-account-audit',
  templateUrl: './account-audit.component.html',
  styleUrls: ['./account-audit.component.css']
})
export class AccountAuditComponent implements OnInit {
  isMutli:boolean = true;
  totalPages:Number = 1;
  pageSize: number = 100;//条数
  listLoading:boolean = false;
  dataSet:any = [];
  detailsData: any[] = [];
  detailLoading: boolean = false;
  private searchData:any = {};
  selectListData: any[] = [];
  checkPassLoading: boolean;
  cancelReview: boolean;
  cancelApply: boolean;
  constructor(private http: HttpUtilService, private nz: NzNotificationService) { }

  ngOnInit() {
   // this.listSearch({ page: 1, length: this.pageSize });
  }

  listSearch(data:any):void{
    data.page = data.page || 1; 
    data.length = data.length || this.pageSize; 
    this.searchData = data;
    this.getList(data);
  }

  getList(data:any):void{
    let url = localUrls.accountAuditListUrl;
    this.listLoading = true;
    this.dataSet = [];
    this.detailsData = [];
    this.selectListData = [];
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data&&res.data.data.data || [];
        this.totalPages = res.data.data&&res.data.data.total;
      } 
    })
  }
  selectData(data:any){
    this.selectListData = data;
    this.detailsData = [];
    if(data[0]){
       this.getDetails(data);
    }
  }
  private getDetails(data:any){
    const tFlatfeeItemModelList = data.map((x:any) => ({flatfeeId: x.flatfeeId}));
    this.detailLoading = true;
     this.http.post(localUrls.selectFlatfeeItem,{tFlatfeeItemModelList: tFlatfeeItemModelList}).then(
       (res:any) => {
         this.detailLoading = false;
         if(res.success){
           this.detailsData = res.data.data && res.data.data.data || [];
         }
       }
     )
  }
  btnClick(data:any):void{
    if (data.buttonId === "check_pass"){ //审核通过按钮
      this.checkPassFun(1);
    } else if (data.buttonId === 'cancel_review') {//撤销审核按钮
    this.checkPassFun(2);
    } else if (data.buttonId ==='cancel_apply'){//撤销申请按钮
    this.checkPassFun(3);
    }
  }
  private checkPassFun(flag: number){
    let url: string;
    const tFlatfeeItemList = this.detailsData.map((x:any) => ({flatfeeId: x.flatfeeId,settleReportNo: x.settleReportNo, feeAmount: x.feeAmount}));
    const tFlatfeeModelList = this.selectListData.map((x:any) => ({flatfeeId: x.flatfeeId}));
    if(flag === 1){
      this.checkPassLoading = true;
      url = localUrls.manualFlatAccountExamine;
    } else if( flag === 2){
      this.cancelReview = true;
      url = localUrls.manualFlatAccountRevoke;
    }else if(flag === 3){
      this.cancelApply = true;
      url = localUrls.manualFlatAccountDelete;
    }
    
    this.http.post(url,{tFlatfeeItemList: tFlatfeeItemList, tFlatfeeModelList: tFlatfeeModelList}).then(
      (res:any) => {
        this.checkPassLoading = false;
        this.cancelReview = false;
        this.cancelApply = false;
        if(res.success){
          this.nz.create('success', '提示信息', res.data.msg, { nzDuration: 3000 });
          this.searchData.page = 1;
          this.getList(this.searchData);
        }
      }
    )
  }
}
