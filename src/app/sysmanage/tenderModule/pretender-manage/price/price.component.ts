import { Component, OnInit } from '@angular/core';
import {urls} from '../../../../common/model/url';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {UploadFiles} from '../../../../common/services/upload-files';


@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {
  /**----------------发布错误解决------------------- */
  btnDisabled: any = {};  
  selectData(data: any){}
  btnClick(data: any){}
  listClick(data: any){}
  /**---------------------发布错误解决------------------------ */

  loading: boolean = false;
  // 主列表页码数据
  totalpage: number = 0;
  pageSize: number = 30;
  selectData1: Array<any> = []; // 主列表选择
  searchData: any = {};//存储查询条件
  dataList: any[] = [];

  constructor(private nzModal: NzModalService,
              private router: Router,
              private http: HttpUtilService,
              private nzMess: NzNotificationService,
              private upload: UploadFiles) {
  }


  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
  }



  listSearch(data: any) {
    this.searchData = data;
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.getList(this.searchData);
  }

  getList(params: any) {
    this.loading = true;
    this.http.post(urls.getTenderPriceList, params).then((x: any) => {
      this.loading = false;
      //console.log(x);
      if (x.success) {
        this.dataList = x.data.data && x.data.data.data || [];
        this.totalpage = x.data.data.total;
        this.selectData1 = [];
      }
    });
  }



  getNextList(param: any) {
    param.page = param.page || 1; //最好有
    this.http.post(urls.getPalletItemByPalletNos, param).then((x: any) => {

    });
  }

}
