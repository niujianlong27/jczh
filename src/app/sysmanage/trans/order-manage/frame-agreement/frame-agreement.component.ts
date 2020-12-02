import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {localUrls} from '@model/localUrls';
import {TRANS_URLS} from '@model/trans-urls';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-frame-agreement',
  templateUrl: './frame-agreement.component.html',
  styleUrls: ['./frame-agreement.component.css']
})
export class FrameAgreementComponent implements OnInit {
  // 页面grid
  gridOneHeight: string;
  gridTwoHeight: string;
  searchData: any = {}; // 查询条件缓存
  isMutli: boolean = true;
  listData: Array<any> = [];
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  selectedData: Array<any> = [];

  childData: Array<any> = [];
  childIsMutli: boolean = true;
  childSelectDate: Array<any> = [];
  childLoading: boolean = false;
  childPageSize: number = 30;
  childTotal: number = 0;

  constructor(private http: HttpUtilService,
              private router: Router,
              private nm: NzModalService,
              private fb: FormBuilder,
              private ngHttp: HttpClient,
              private msg: NzMessageService,
              private nn: NzNotificationService) {
  }

  ngOnInit() {
    this.query({page: 1, length: this.pageSize});
  }

  query(param) {
    this.loading = true;
    param.page = param.page || 1;
    param.length = param.length || this.pageSize;
    this.getList(param);
  }

  getList(data) {
    this.childData = [];
    this.childPageSize = 30;
    this.childTotal = 0;
    this.searchData = {...data};
    this.http.post(TRANS_URLS.selectRecord, data).then(
      (res: any) => {
        this.loading = false;
        if (res.success) {
          this.listData = res.data.data.data;
          this.total = res.data.data.total;
        }
      }
    );
  }


  btnClick(data) {
    switch (data.buttonId) {
      case 'Add' :
        this.Add();
        break;
      case 'Delete' :
        this.delete();
        break;
      case 'Export' :
        this.export();
        break;
      case 'Update' :
        this.update();
        break;
      case 'print' :
        this.print();
        break;
      case 'Download' :
        this.Download();
        break;
      case 'Stop' :
        this.Stop();
        break;
    }
  }

  Add() {
    this.router.navigate(['/system/trans/order-manage/outlineAgreement'], {
      queryParams: {
        'operateType': 'Add',
      }
    });
  }

  delete() {
    if (!this.selectedData || this.selectedData.length == 0) {
      this.nm.warning(
        {
          nzTitle: '提示消息',
          nzContent: '请选择数据后操作！',
        });
      return;
    }

    this.nm.confirm({
      nzTitle: '框架协议管理 > 删除',
      nzContent: '<p class="m-re">是否要将选中的数据删除?</p>',
      nzOnOk: () => new Promise((resolve, reject) => {
        let params = {tOutlineAgreementModels: []};
        params.tOutlineAgreementModels = this.selectedData.map(item => {
          return {orderNo: item.orderNo};
        });
        this.http.post(TRANS_URLS.deleteRecord, params).then((res: any) => {
          if (res.success) {
            resolve();
            this.msg.success(res.data.data, {nzDuration: 3000});
            this.query(this.searchData);
          } else {
            reject();
          }
        });
      })
    });

  }

  export() {
    let url = TRANS_URLS.outlineexport;
    this.ngHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `框架协议管理.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  print() {

    if (!this.selectedData || this.selectedData.length !== 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据后操作！'
      });
      return;
    }
    let url: any = TRANS_URLS.outlineAgreementPdf + `?orderNo=${this.selectedData[0].orderNo}&requestCompanyId=${this.selectedData[0].companyId}`;
    this.ngHttp.get(url, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/pdf'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }


  Download() {
    if (!this.selectedData || this.selectedData.length !== 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据后操作！'
      });
      return;
    }
    let url: any = TRANS_URLS.outlineAgreementPdf + `?orderNo=${this.selectedData[0].orderNo}&requestCompanyId=${this.selectedData[0].companyId}`;
    this.ngHttp.get(url, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/pdf'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `框架协议管理下载.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }


  update() {
    if (!this.selectedData || this.selectedData.length !== 1) {
      this.nm.warning(
        {
          nzTitle: '提示消息',
          nzContent: '请选择一条数据操作！',
        });
      return;
    }
    if(this.selectedData[0].status == 'ZT20'){
      this.nn.warning('提示信息','当前数据状态为有效，不能修改！');
      return;
    }
    this.router.navigate(['/system/trans/order-manage/outlineAgreement'], {
      queryParams: {
        'operateType': 'Update',
        'orderNo': this.selectedData[0].orderNo,
      }
    });
  }


  selected(data) {
    this.selectedData = data;
    this.selectedData[0] && this.listSearch2({page: 1, length: this.childPageSize});
  }

  listSearch2(data: any) { //查询
    data.page = data.page || 1;
    data.length = data.length || this.childPageSize;
    this.childSelectDate = [];
    this.childData = [];
    this.childQuey(data);
  }

  childQuey(data) {
    this.childLoading = true;
    let itemModels = this.selectedData.map(item => {
      return {
        orderNo: item.orderNo,
      };
    });
    let params = {...data, tOutlineAgreementItemModels: itemModels};
    this.http.post(TRANS_URLS.selectItemRecord, params).then((res: any) => {
      this.childLoading = false;
      if (res.success) {
        this.childData = res.data.data && res.data.data.data || [];
        this.childTotal = res.data.data && res.data.data.total || 0;
      }
    });
  }


  //上下、左右布局
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

  Stop() { //终止
    if (!this.selectedData || this.selectedData.length < 1) {
      this.nm.warning(
        {
          nzTitle: '提示消息',
          nzContent: '请选择数据后操作！',
        });
      return;
    }
    let url = TRANS_URLS.updateStatus;
    this.nm.confirm({
      nzTitle: '框架协议管理 > 终止',
      nzContent: '<p class="m-re">是否将选中的数据进行终止操作?</p>',
      nzOnOk: () => new Promise((resolve, reject) => {
        let params = {tOutlineAgreementModels: []};
        params.tOutlineAgreementModels = this.selectedData.map(item => {
          return {orderNo: item.orderNo};
        });
        this.http.post(url, params).then((res: any) => {
          if (res.success) {
            resolve();
            this.msg.success(res.data.data);
            this.query(this.searchData);
          } else {
            reject();
          }
        });
      })
    });
  }


}


