import { Component, OnInit } from '@angular/core';
import { localUrls } from "../../.././../common/model/localUrls";
import { HttpUtilService } from "../../../../common/services/http-util.service";

@Component({
  selector: 'app-payment-oil',
  templateUrl: './payment-oil.component.html',
  styleUrls: ['./payment-oil.component.css']
})
export class PaymentOilComponent implements OnInit {
  isMutli: boolean = true;
  listLoading:boolean = false;
  dataSet: any = [];
  totalPages: Number = 1;
  pageSize:number = 30;
  private searchData: any = {};
  constructor(private http: HttpUtilService) { }

  ngOnInit() {
 //   this.listSearch({page:1,length:this.pageSize});
  }

  listSearch(data: any): void {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.searchData = data;
    this.getList(data);
  }

  getList(data: any): void {
    let url = localUrls.payOilListUrl;
    this.listLoading  = true;
    this.dataSet = [];
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading =false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total || 0;
      }
    })
  }

  btnClick(data: any): void {

  }
}
