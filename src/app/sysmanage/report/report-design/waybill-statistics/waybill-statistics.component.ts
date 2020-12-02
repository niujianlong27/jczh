import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {localUrls} from "../../../../common/model/localUrls";
import {HttpUtilService} from "../../../../common/services/http-util.service";

@Component({
  selector: 'app-waybill-statistics',
  templateUrl: './waybill-statistics.component.html',
  styleUrls: ['./waybill-statistics.component.css']
})
export class WaybillStatisticsComponent implements OnInit {
  dataSet: any = [];
  pageSize1: any;
  listLoading1: any
  tempSearchParam: any
  totalPage: any;
  totalWeight: number = 0;
  totalNumber: number = 0;
  totalRcvTransFee: number = 0;
  totalTransFee: number = 0;
  totalRcvUnitPrice: number = 0;
  constructor(
    private http: HttpUtilService,
    private  angularHttp: HttpClient
  ) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});
  }

  listSearch(data: any) {
    this.getList(data);
  }

  getList(data: any) {
    let url: any = localUrls.getTWaybillModel;
    this.listLoading1 = true;
    this.tempSearchParam = data
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || [];
        this.totalWeight = 0;
        this.totalNumber = 0;
        this.totalRcvTransFee = 0;
        this.totalTransFee = 0;
        this.totalRcvUnitPrice = 0;
      }
    })
  }
  selectData(data:any){
    this.totalWeight = data.map((c:any) => c.preTotalWeight || '0').reduce((x:string, y:number) => Number(x) + Number(y),0);
    this.totalNumber = data.map((c:any) => c.preTotalSheet || '0').reduce((x:string, y:number) => Number(x) + Number(y),0);
    this.totalRcvTransFee = data.map((c:any) => c.rcvTransFee || '0').reduce((x:string, y:number) => Number(x) + Number(y),0);
    this.totalTransFee = data.map((c:any) => c.transFee || '0').reduce((x:string, y:number) => Number(x) + Number(y),0);
    this.totalRcvUnitPrice = data.map((c:any) => c.rcvUnitPrice || '0').reduce((x:string, y:number) => Number(x) + Number(y),0);
  }
  btnClick(data: any) {
    this.btnExport()
  }

  btnExport() {
    let url: any = localUrls.exportWaybill
    this.angularHttp.post(url, this.tempSearchParam, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/pdf'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单信息统计.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 当前页码发生改变
   */
  getPageIndex1(page: any) {
    this.getList({page: page, length: this.pageSize1});

  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any) {
    this.pageSize1 = pageSize;
    this.getList({page: 1, length: this.pageSize1});

  }
}
