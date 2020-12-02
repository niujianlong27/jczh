import {Component, OnInit} from '@angular/core';
import {localUrls} from '../../../../common/model/localUrls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {urls} from '../../../../common/model/url';
import {HttpClient} from '@angular/common/http';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-rcv-report-count',
  templateUrl: './rcv-report-count.component.html',
  styleUrls: ['./rcv-report-count.component.css']
})
export class RcvReportCountComponent implements OnInit {
  totalPage: any;
  dataSet: any[] = [];
  searchData: any = {}; //搜索条件缓存
  loading: boolean = false;

  constructor(private http: HttpUtilService, private angularHttp: HttpClient) {
  }

  ngOnInit() {
    this.getList({length: 30, page: 1});
  }

  listSearch(data: any) {
    this.searchData = data;
    this.getList(data);
  }

  getList(param = {}) {
    this.loading = true;
    this.totalPage = 0;
    this.http.post(localUrls.selectSettleReport7, param).then((res: any) => {
      this.loading = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data.total;
      }
    });
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

    this.angularHttp.post(localUrls.exportSettleReport, this.searchData, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `应收结算报表${Utils.dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );

    // this.http.post(localUrls.exportSettleReport,{}).then((x:any)=>{
    //   if(x.success){
    //      window.open(x.data.data);
    //   }
    // })
  }

}
