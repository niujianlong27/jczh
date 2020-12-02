import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef} from "ng-zorro-antd";
import {stockUrl} from "../../../../common/model/stockUrl";

@Component({
  selector: 'app-stock-bulk-user-info',
  templateUrl: './stock-bulk-user-info.component.html',
  styleUrls: ['./stock-bulk-user-info.component.css']
})
export class StockBulkUserInfoComponent implements OnInit {

  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number = 0;
  pageSize1:number = 30;
  selectedList1: any = [];
  constructor(private http: HttpUtilService) { }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  getList1(data: any): void {
    let url = stockUrl.shStockgetPage;
    this.listLoading1 = true;

    this.http.post(url, data).then((res: any) => {

      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data ||[];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  listSearch(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  getPageIndex1(page: any): void {
    this.getList1({ page: page, length: this.pageSize1 });
  }

  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({ page: 1, length: this.pageSize1 });
  }

}
