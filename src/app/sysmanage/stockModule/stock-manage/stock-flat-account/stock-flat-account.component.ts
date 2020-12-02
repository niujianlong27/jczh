import { Component, OnInit } from '@angular/core';
import { stockUrl } from "../../../../common/model/stockUrl";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import {toDemical} from '../../../../common/validators/validator';
import {UserinfoService} from "../../../../common/services/userinfo-service.service";

@Component({
  selector: 'app-stock-flat-account',
  templateUrl: './stock-flat-account.component.html',
  styleUrls: ['./stock-flat-account.component.css']
})
export class StockFlatAccountComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  updateData:any = [];//选中的数据
  totalPages1: number = 0;
  pageSize1:number = 30;
  selectedList1: any = [];
  constructor(private http: HttpUtilService,private nm: NzModalService,private appInfo: UserinfoService) { }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  getList1(data: any): void {
    let url = stockUrl.selectInfoAlatAccount;
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
    console.log(data)
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

