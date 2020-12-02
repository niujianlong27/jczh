import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {contractUrl} from '../../../../common/model/contractUrl';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-sales-stock',
  templateUrl: './sales-stock.component.html',
  styleUrls: ['./sales-stock.component.css']
})
export class SalesStockComponent implements OnInit {

  dataSet: any =[]
  totalPage: any = 0
  pageSize1: any = 30;
  loading:boolean = false;
  tempSearchParam:any
  validateForm: FormGroup;
  page:any

  constructor(private http: HttpUtilService,
              private fb: FormBuilder,) { }

  /*
  *  初始化
  */
  ngOnInit() {
    this.validateForm = this.fb.group({
      itemid: [null],
    });
    this.listSearch({page:1,length:30})
  }

  /*
  *   查询
  */

  listSearch(data1:any){
    data1.length = this.pageSize1||30;
    data1.page = this.page||1
    // data.itemid = this.validateForm.get("itemid").value||null
    this.getList1(data1);
  }

  /*
  *  调用查询接口
  */
  getList1(data:any){
    let url = contractUrl.getSalesStock
    this.tempSearchParam = data
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        console.log(res)
        this.dataSet = res.data.data && res.data.data.list || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
      }
    })
  }



  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize
    this.tempSearchParam.page = 1
    this.listSearch(this.tempSearchParam)
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.page = page
    this.tempSearchParam.page = page
    this.listSearch(this.tempSearchParam)
  }

}
