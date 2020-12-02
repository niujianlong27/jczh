import { Component, OnInit } from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {RGDISPURL} from '@model/rgDispUrl';

@Component({
  selector: 'app-tdpark',
  templateUrl: './tdpark.component.html',
  styleUrls: ['./tdpark.component.css']
})
export class TdparkComponent implements OnInit {
  tabs: Array<any> = [];
  dataSet: any = [];
  listLoading = false;
  pageSize1: any = 30;
  totalPage: any;
  tempSearchParam: any;
  index: any;
  status = '^(disp_queueDetailStatus_20|disp_queueDetailStatus_23|disp_queueDetailStatus_35)';
  // 计算排队时长定时器
  interval: any;
  tplModal: NzModalRef; // 操作成功后弹窗属性
  UpdateArr: Array<any> = [];
  buttonArr: any[] = [];
  tabsArr: any[] = [];
  statusString = '';

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService) {}

  ngOnInit() {
    this.getallCodest();
    this.listSearch({page: 1, length: this.pageSize1});
    this.interval = setInterval(() => {
      this.setQueueingTime();
    }, 1000 * 60);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    this.UpdateArr = [];
    const url = RGDISPURL.getRecordsJgwl;
    const url1 = RGDISPURL.getStatsJgwl;
    this.listLoading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = (res.data.data && res.data.data.data) || [];
        this.setQueueingTime();
        this.totalPage = (res.data.data && res.data.data.total) || 0;
      }
    });
    const sum = 0;
    this.tabs.forEach((item) => {
      item.itemCount = 0;
    });
    this.http.post(url1, { status: this.status, parkCode: 'disp.park_4' }).then((res) => {
      if (res.success) {
        this.tabs[0].itemCount = 0;
        res.data.data.forEach((item) => {
          for (let i = 1; i < this.tabs.length; i++) {
            if (item.status === this.tabs[i].itemCode) {
              this.tabs[i].itemCount = item.ct;
              this.tabs[0].itemCount += item.ct;
            }
          }
        });
      }
    });
  }

  // 获取表头
  getallCodest(): void {
    const tab: any = {};
    tab.itemCname = '全部';
    tab.itemCode = '^(disp_queueDetailStatus_20|disp_queueDetailStatus_23|disp_queueDetailStatus_35)';
    tab.itemCount = 0;
    tab.buttonId = 'All';
    tab.formId = 'form_rgDisp_tdpark0';
    this.tabs.push(tab);
    this.tabs.push({
      itemCname: '已取号',
      itemCode: 'disp_queueDetailStatus_20',
      itemCount: 0,
      formId: 'form_rgDisp_tdpark1'
    });
    this.tabs.push({
      itemCname: '确认进场',
      itemCode: 'disp_queueDetailStatus_23',
      itemCount: 0,
      formId: 'form_rgDisp_tdpark2'
    });
    this.tabs.push({
      itemCname: '待入厂',
      itemCode: 'disp_queueDetailStatus_35',
      itemCount: 0,
      formId: 'form_rgDisp_tdpark3'
    });
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    data.status = this.status;
    data.parkCode = 'disp.park_4';
    this.getList1(data);
  }

  delete(data: any) {
    if (this.UpdateArr.length === 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后修改'
      });
      return;
    }
    if (this.UpdateArr[0].status !== 'disp_queueDetailStatus_20') {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '只有已取号的车辆才可以确认进场'
      });
      return;
    }
    this.http.post(RGDISPURL.updateStatsJgwl, data).then((res) => {
      if (res.success) {
        this.nz.success('提示信息', res.data.data);
        this.getList1(this.tempSearchParam);
      }
    });
  }

  nzSelect(data: any) {
    this.tempSearchParam.status = data;
    this.getList1(this.tempSearchParam);
    this.status = data;
  }

  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);
  }

  // 计算排队时长
  setQueueingTime() {
    const curDateTime = new Date().getTime();
    this.dataSet.map((item) => {
      if (item.queueStartTime) {
        const queueingTime = curDateTime - new Date(item.queueStartTime.replace(/-/g, '/')).getTime();
        const hours = Math.trunc(queueingTime / (1000 * 60 * 60));
        const minutes = Math.trunc((queueingTime % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) {
          item.queueingTime = hours + '小时' + minutes + '分';
        } else if (minutes >= 0) {
          item.queueingTime = minutes + '分';
        }

      }
      if (item.recReviseTime) {
        const inboundTime = curDateTime - new Date(item.recReviseTime.replace(/-/g, '/')).getTime();
        item.inboundTime = Math.trunc(inboundTime / (1000 * 60)) + '分';
      }

    });
  }


  btnClick(data: any) {
    switch (data.buttonId) {
      case 'Confirm':
        this.delete(this.UpdateArr[0]);
        break;
    }
  }

  updateDataResult(data: any) {
    this.UpdateArr = data;
  }

}
