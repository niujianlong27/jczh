import { Component, OnInit } from '@angular/core';
import {portUrl} from "../../../../common/model/portUrl";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from "../../../../common/services/userinfo-service.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-vehicle-shortage',
  templateUrl: './vehicle-shortage.component.html',
  styleUrls: ['./vehicle-shortage.component.css']
})
export class VehicleShortageComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  updateData: any = [];//选中的数据
  totalPages1: number = 0;
  pageSize1: number = 30;
  selectedList1: any = [];
  temGetListData:any;//查询条件缓存

  constructor(private http: HttpUtilService,
              private nz: NzNotificationService,
              private nm: NzModalService,
              private appInfo: UserinfoService,
              private ngHttp: HttpClient,) {
  }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.temGetListData = data;
    this.getList1(data);
  }

  getList1(data: any): void {
    let url = portUrl.selectwithoutCar;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data && res.data.data|| [];
        this.totalPages1 = res.data && res.data.total;
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
      let url: any = portUrl.withoutCar;
      this.ngHttp.post(url, this.temGetListData, {responseType: 'blob'}).subscribe((res: any) => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `车辆不足停工统计.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }

}
