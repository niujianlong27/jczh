import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {any} from 'codelyzer/util/function';
import {Router} from '@angular/router';
import {UserinfoService} from '@service/userinfo-service.service';
import {FormBuilder} from '@angular/forms';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@service/common.service';
import {stockUrl} from '@model/stockUrl';

@Component({
  selector: 'app-goods-test',
  templateUrl: './goods-test.component.html',
  styleUrls: ['./goods-test.component.css']
})
export class GoodsTestComponent implements OnInit {
  updatedata: any = [];
  dataSet: any = [];
  pageSize: any = 30;
  tempSearchParam: any;
  totalPage: any;
  loading: boolean = false;
  moduleLoading: boolean = false;
  visible: boolean = false;
  width: any = '500px';
  inputModalSearchValue: any;

  dataSet2: any = [];

  constructor(private router: Router, private appInfo: UserinfoService, private fb: FormBuilder, private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private cm: CommonService) {
  }

  ngOnInit() {
    this.listSearch({});
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }
  

  getList(data: any) {
    let url = stockUrl.getProductConfig;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
      }
    });
  }

  btnclick(data: any) {
    switch (data.buttonId) {
      case 'Update':
        this.btnUpdate();
        break;
      default:
        break;
    }
  }


  btnUpdate() {
    this.visible = true;
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex(page: any): void {
    this.tempSearchParam.page = page;
    this.listSearch(this.tempSearchParam);
  }


  updateDataResult(data: any) {
    this.updatedata = data;
  }

  handleOk() {

  }

  handleCancel() {

  }

  keyUp(data: any) {

  }

  updateDataResult2(data: any) {

  }
}
