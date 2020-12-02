
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@service/common.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '@model/url';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit {
  dataSet: any = [];
  totalPage: any;
  loading: boolean = false;
  tempSearchParam: any;
  pageSize1: number = 100;
  buttonId: any;
  selectList: any = [];

  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private fb: FormBuilder,
              private cm: CommonService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});
  }

  listSearch(data: any) {
    this.getList1(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url =urls.getUserforStatistics;
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

  btnClick(data: any) {
  }

  selectDate(data) {
    this.selectList = data;
  }
}
