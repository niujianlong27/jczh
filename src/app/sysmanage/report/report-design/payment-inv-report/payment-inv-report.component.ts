import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {localUrls} from '../../../../common/model/localUrls';
import {HttpClient} from '@angular/common/http';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-payment-inv-report',
  templateUrl: './payment-inv-report.component.html',
  styleUrls: ['./payment-inv-report.component.css']
})
export class PaymentInvReportComponent implements OnInit {

  constructor(private http: HttpUtilService, private angularHttp: HttpClient) {
  }

  data: Array<any> = [];
  totalPage: number = 0;
  searchData: any = {};
  loading: boolean = false;

  ngOnInit() {
    this.getList({length: 30, page: 1});
  }

  /**
   * 列表查询点击
   * @param data
   */
  listSearch(data: any) {
    this.searchData = data;
    this.getList(data);
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {
    switch (data.type.buttonId) {
      case 'Export':
        this.export();
        break;
      default:
        break;
    }
  }

  /**
   * 导出
   */
  export() {

    this.angularHttp.post(localUrls.exportInvReport, this.searchData, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `收票信息统计报表${Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );

    // this.http.post(localUrls.exportInvReport, this.searchData).then((res: any) => {
    //   if (res.success) {
    //     window.open(res.data.data);
    //   }
    // });

  }

  /**
   * 列表查询
   * @param param
   */
  getList(param = {}) {
    this.loading = true;
    this.http.post(localUrls.selectInvReport, param).then(
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
