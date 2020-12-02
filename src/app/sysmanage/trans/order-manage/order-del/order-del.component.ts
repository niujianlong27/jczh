import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {TRANS_URLS} from '@model/trans-urls';
import {urls} from '@model/url';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-order-del',
  templateUrl: './order-del.component.html',
  styleUrls: ['./order-del.component.css']
})
export class OrderDelComponent implements OnInit {

  pageSize: number = 30; //条数
  dataSet: Array<any> = []; //列表数据
  totalPage: number = 0; //数据总数
  listLoading: boolean = false; //list加载
  searchData: any; // 搜索数据

  constructor(private http: HttpUtilService,
              private angularHttp: HttpClient,
  ) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    this.listLoading = true; //list加载
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = param;
    this.getListSearch(param);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    this.http.post(TRANS_URLS.getDelOrderPage, data).then(
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
      case 'Export':
        this.export();
        break;
    }
  }

  export() {
    let url: any = TRANS_URLS.exportScrapRecords;
    this.angularHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/xlsx'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `合同作废记录.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }


}
