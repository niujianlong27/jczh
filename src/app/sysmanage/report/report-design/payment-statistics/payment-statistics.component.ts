import { Component, OnInit } from '@angular/core';
import { localUrls } from '../../../../common/model/localUrls';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import {HttpClient} from '@angular/common/http';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-payment-statistics',
  templateUrl: './payment-statistics.component.html',
  styleUrls: ['./payment-statistics.component.css']
})
export class PaymentStatisticsComponent implements OnInit {
  data:any = [];
  totalPage:number = 0;
  searchData:any;
  loading:boolean = false;
  constructor(private http: HttpUtilService, private angularHttp: HttpClient) { }

  ngOnInit() {
    this.getList({length:30,page:1});
  }
  listSearch(data:any){
    this.searchData = data;
    this.getList(data);
  }
  btnClick(data:any){
    switch (data.type.buttonId){
        case 'Export':
        this.export();
        break;
        default:
        break;
    }
  }
  export(){

    this.angularHttp.post(localUrls.paymentStatistics, this.searchData, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `付款信息统计报表${Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );

    // this.http.post(localUrls.paymentStatistics,{}).then((res:any)=>{
    //   if(res.success){
    //      window.open(res.data.data);
    //   }
    // })
  }

  getList(param = {}){
    this.loading = true;
     this.http.post(localUrls.selectReportForm,param).then(
       (res:any) => {
        this.loading = false;
          if(res.success){
           this.data = res.data.data && res.data.data.data || [];
           this.totalPage = res.data.data.total;
          }
       }
     )
  }
}
