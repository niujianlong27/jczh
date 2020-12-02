import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';

@Component({
  selector: 'app-synerr',
  templateUrl: './synerr.component.html',
  styleUrls: ['./synerr.component.css']
})
export class SynerrComponent implements OnInit {
  dataSet:any=[]
  tempSearchParam:any
  loading:any
  pageSize1:any = 30
  totalPage:any
  updatedata:any=[]

  constructor( private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,) { }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1})
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url = RGDISPURL.SELECTERROR;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;

      }
    })
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  updateDataResult(data: any) {
    this.updatedata = data;
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }

  btnclick(data:any){

  }
}
