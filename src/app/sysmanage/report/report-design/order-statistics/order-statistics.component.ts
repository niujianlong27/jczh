import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {HttpClient} from '@angular/common/http';
import {localUrls} from '../../../../common/model/localUrls';

@Component({
  selector: 'app-order-statistics',
  templateUrl: './order-statistics.component.html',
  styleUrls: ['./order-statistics.component.css']
})
export class OrderStatisticsComponent implements OnInit {
   dataSet:any=[];
  pageSize1:any;
  listLoading1:any
  tempSearchParam:any
  totalPage:any;
  constructor(
    private http: HttpUtilService,
    private  angularHttp: HttpClient
  ) { }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });
  }
  listSearch(data:any){
    this.getList(data);
  }
  getList(data:any){
    let url :any = localUrls.selectOrder;
    this.listLoading1 = true;
    this.tempSearchParam = data
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        console.log(res)
        this.dataSet = res.data.data&&res.data.data.data ||[];
        this.totalPage = res.data.data&&res.data.data.total||[];
      }
    })
  }
  btnClick(data:any){
    this.btnExport()
  }
  btnExport(){
    let url: any =  localUrls.exportOrder
    // url =`http://192.168.123.101:9034/report/previewTransContract?orderNo=${this.selectedOrderData[0].orderNo}`;
    this.angularHttp.post(url, this.tempSearchParam,{responseType: 'blob'}).subscribe((res: any) => {
      // console.log(`requestCompanyId=${this.selectedOrderData[0].companyD}`);
      // console.log(`file size : ${res.size}`);
      var blob = new Blob([res], {type: 'application/pdf'});
      var objectUrl = URL.createObjectURL(blob);
      // console.log(objectUrl);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `合同报表.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 当前页码发生改变
   */
  getPageIndex1(page:any){
    this.getList({ page: page, length: this.pageSize1 });

  }
  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize:any){
    this.pageSize1 = pageSize;
    this.getList({ page: 1, length: this.pageSize1 });
  }
}
