import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {urls} from "../../../../common/model/url";
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TRANS_URLS} from '@model/trans-urls';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-order-settlement',
  templateUrl: './order-settlement.component.html',
  styleUrls: ['./order-settlement.component.css']
})
export class OrderSettlementComponent implements OnInit {

  listLoading: boolean = false;
  dataSet: any[] = [];
  totalPages: number;
  pageSize: number = 30;//条数
  totalWeightWaybill: any;
  tplModal: NzModalRef;
  // validateForm1: FormGroup;
  selectedOrderData: Array<any> = [];
  tempSearchParam: any = {};
  implistLoading: boolean = false;

  constructor(private http: HttpUtilService,
              private fb: FormBuilder,
              private nm: NzModalService,
              private nzMess: NzMessageService,
              private nz: NzNotificationService,
              private ngHttp: HttpClient,
  ) {
  }

  ngOnInit() {
    // this.listSearch({page:1,length:30});
  }

  listSearch(param: any) {
    param.page = param.page || 1;
    param.length = param.length || this.pageSize;
    this.getList(param);
  }

  //查询
  getList(params: any) {
    this.listLoading = true;
    this.dataSet = [];
    this.tempSearchParam = params;
    this.http.post(urls.getOrdersSettleInfo, params).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total || 0;
      }
    })
  }

  //按钮事件
  btnclick(data) {
    switch (data.type.buttonId) {
      case "saleClose" :
        this.btnSaleClose();
        break;
      case "export" :
        this.export();
        break;
    }
  }

  select(data) {
    this.selectedOrderData = data;
  }

  /*
  *   销售结案
  */
  btnSaleClose() {
    if (!this.selectedOrderData || this.selectedOrderData.length < 1) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      return;
    }
      this.saleCloseMore();
  }

  /*
  *    勾选多条数据的销售结案
  */
  saleCloseMore() {
    let url = TRANS_URLS.saleClosemore;
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return item.orderNo;
    });
    param.orderNoList = arr;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 6000});
        this.getList(this.tempSearchParam);
        // this.destroyTplModal();
        this.selectedOrderData = [];
      }
    });
  }

  export(){
    let url: any = urls.getOrdersExport;
    this.ngHttp.post(url, this.tempSearchParam, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `合同信息跟踪.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };


}
