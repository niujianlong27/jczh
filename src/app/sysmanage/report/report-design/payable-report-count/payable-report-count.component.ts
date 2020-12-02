import {Component, OnInit} from '@angular/core';
import {localUrls} from '../../../../common/model/localUrls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {HttpClient} from '@angular/common/http';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-payable-report-count',
  templateUrl: './payable-report-count.component.html',
  styleUrls: ['./payable-report-count.component.css']
})
export class PayableReportCountComponent implements OnInit {

  constructor(private http: HttpUtilService, private angularHttp: HttpClient) {
  }

  data: any = [];
  totalPage: number = 0;
  searchData: any;
  loading: boolean = false;

  ngOnInit() {
    this.getList({length: 30, page: 1});
  }

  listSearch(data: any) {
    this.searchData = data;
    this.getList(data);
  }

  btnClick(data: any) {
    switch (data.type.buttonId) {
      case 'Export':
        this.export();
        break;
      default:
        break;
    }
  }

  export() {

    this.angularHttp.post(localUrls.payreportExportSettleReport, this.searchData, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `应付结算报表统计${Utils.dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );

    // this.http.post(localUrls.payreportExportSettleReport, {}).then((res: any) => {
    //   if (res.success) {
    //     window.open(res.data.data);
    //   }
    // });
  }

  getList(param = {}) {
    this.loading = true;
    this.http.post(localUrls.payreportSelectSettleReport7, param).then(
      (res: any) => {
        this.loading = false;
        if (res.success) {
          this.data = res.data.data && res.data.data.data || [];
          this.totalPage = res.data.data.total;
        }
      }
    );
  }
}
