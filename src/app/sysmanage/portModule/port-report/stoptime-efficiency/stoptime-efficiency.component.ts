import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from "../../../../common/services/userinfo-service.service";
import {HttpClient} from "@angular/common/http";
import {portUrl} from "../../../../common/model/portUrl";

@Component({
  selector: 'app-stoptime-efficiency',
  templateUrl: './stoptime-efficiency.component.html',
  styleUrls: ['./stoptime-efficiency.component.css']
})
export class StoptimeEfficiencyComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading: boolean = false;
  dataSet: any = [];
  totalPages: number = 0;
  pageSize: number = 30;
  selectedList: any = [];//选中的数据
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
    this.getList(data);
  }

  getList(data: any): void {
    let url = portUrl.selectcollectEfficient;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
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
    this.selectedList = data;
  }

  export(){  //导出
    let url: any = portUrl.shutDownStatistics;
    this.ngHttp.post(url, this.temGetListData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `停时数据统计.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

  }

}
