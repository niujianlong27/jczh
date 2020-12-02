import { Component, OnInit } from '@angular/core';
import { urls } from '../../../../common/model/url';
import { HttpUtilService } from '../../../../common/services/http-util.service';
@Component({
  selector: 'app-waybill-settlement',
  templateUrl: './waybill-settlement.component.html',
  styleUrls: ['./waybill-settlement.component.css']
})
export class WaybillSettlementComponent implements OnInit {
  listLoading:boolean = false;
  dataSet:any[] = [];
  totalPages:Number = 1;
  constructor(private http: HttpUtilService) { }

  ngOnInit() {
    //this.getList({page:1,length:30});
  }
  listSearch(param:any){
    this.getList(param);
  }
 getList(params:any){
   this.listLoading = true;
   this.dataSet = [];
   this.http.post(urls.waybillSettlement,params).then( (res:any) => {
     if(res.success){
       console.log(res);
       this.listLoading = false;
       this.dataSet = res.data.data&&res.data.data.data||[];
       this.totalPages = res.data.data && res.data.data.total||0;
       
     }
   })
 }
}
