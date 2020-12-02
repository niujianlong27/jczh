import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {localUrls} from '../../../../common/model/localUrls';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-check-account',
  templateUrl: './check-account.component.html',
  styleUrls: ['./check-account.component.css']
})
export class CheckAccountComponent implements OnInit {

  dataSet: Array<any> = []; // 主列表
  pageSize: number = 30; // 每页数量
  totalPage: number = 0; //数据总数
  listLoading: boolean = true; //加载状态
  searchData: any; //搜索缓存

  constructor(private http: HttpUtilService,
              private angularHttp: HttpClient,
  ) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});
  }

  /**
   * 搜索时间
   * @param {any} data
   */
  listSearch(data: any) {
    this.listLoading = true; //list加载
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.getListSearch(data);
  }

  /**
   * 列表查询数据获取
   * @param {any} data
   */
  getListSearch(data: any): void {
    const params = {url: localUrls.getPaymentAccoutResultList, data: data || {}, method: 'POST'};
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }


  btnclick(data) {
    switch (data.type.buttonId) {
      case 'export':
        this.export(); //导出
        break;
    }
  }

  export() {

    let url: any = localUrls.exportPayAccountResult;
    this.angularHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/xlsx'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `日对账查询.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

}
