import { Component, OnInit } from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {stockUrl} from '../../../../common/model/stockUrl';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {portUrl} from '../../../../common/model/portUrl';

/**
 * Title: day-deliver.component.ts
 * Description: 次日发运页面
 * Created: pengzitong 2019/1/28
 * Modified:
 */
@Component({
  selector: 'app-day-deliver',
  templateUrl: './day-deliver.component.html',
  styleUrls: ['./day-deliver.component.css']
})
export class DayDeliverComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 0;
  pageSize1:Number = 30;
  selectedList1: any = [];
  constructor(private http: HttpUtilService) { }

  /**
   * 初始化
   */
  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  /**
   * 获取列表
   * @param data
   */
  getList1(data: any): void {
    let url = portUrl.shipStowageList;
    this.listLoading1 = true;

    this.http.post(url, data).then((res: any) => {

      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data ||[];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({ page: page, length: this.pageSize1 });
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */

  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({ page: 1, length: this.pageSize1 });
  }

}
