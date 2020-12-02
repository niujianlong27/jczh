import { Component, OnInit } from '@angular/core';
import {portUrl} from "../../../../common/model/portUrl";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from "../../../../common/services/userinfo-service.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-ship-berthing-departure-plan',
  templateUrl: './ship-berthing-departure-plan.component.html',
  styleUrls: ['./ship-berthing-departure-plan.component.css']
})
export class ShipBerthingDeparturePlanComponent implements OnInit {

  tplModal: NzModalRef;
  listLoading: boolean = false;
  dataSet: any = [];
  updateData: any = [];//选中的数据
  totalPages: number = 0;
  pageSize: number = 30;
  selectedList: any = [];
  temGetListData:any;//查询条件缓存

  constructor(private http: HttpUtilService,
              private nz: NzNotificationService,
              private nm: NzModalService,
              private appInfo: UserinfoService,
              private ngHttp: HttpClient,) {
  }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize });
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.temGetListData = data;
    this.getList1(data);
  }

  getList1(data: any): void {
    let url = portUrl.selectshipData;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total;
      }
    })
  }

  btnClick(data: any): void {
    switch (data.buttonId) {
      case 'Export':
        this.export();
        break;
      default:
        break;
    }
  }

  /**
   * 当前数据选中状态改变触发的方法
   * @param data
   */
  selectData(data: any) {
    this.updateData = data;
  }

  export(){  //导出
    let url: any = portUrl.berth;
    this.ngHttp.post(url, this.temGetListData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `昼夜船舶靠离港计划.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
