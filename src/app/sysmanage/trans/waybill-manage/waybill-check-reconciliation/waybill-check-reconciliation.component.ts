import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-waybill-check-reconciliation',
  templateUrl: './waybill-check-reconciliation.component.html',
  styleUrls: ['./waybill-check-reconciliation.component.css']
})
export class WaybillCheckReconciliationComponent implements OnInit {
  dataSet: Array<any> = [];
  listLoading: boolean = false;
  totalPage: number;
  pageSize: number = 30;
  buttonId: string;
  searchParam: any = {};
  selectedData: Array<any> = [];

  constructor(private http: HttpUtilService, private angularHttp: HttpClient) {
  }

  ngOnInit() {
  }

  /**
   * 查询事件
   */
  listSearch(param: any) {
    param.page = param.page || 1;
    param.length = param.length || this.pageSize;
    this.searchParam = param;
    this.listLoading = true;
    this.getListSearch(param);
  }

  /**
   * 查询数据获取
   * @param param
   */
  getListSearch(param: any) {
    this.http.post(TRANS_URLS.waybillPackCheck, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.selectedData = [];
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  /**
   * 按钮点击
   * @param param
   */
  btnClick(param: any) {
    this.buttonId = param.type.buttonId;
    switch (this.buttonId) {
      case 'Out':
        this.export();
        break;
    }
  }

  /**
   * 导出
   */
  export(): void {
    this.angularHttp.post(TRANS_URLS.waybillPackCheckexportList, this.searchParam, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单核对对账.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });
  }

  /**
   * 选中数据
   * @param param
   */
  updateDataResult(param: any) {
    this.selectedData = param;
  }
}
