import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from "ng-zorro-antd";
import {stockUrl} from "../../../../common/model/stockUrl";

@Component({
  selector: 'app-shstock-info',
  templateUrl: './shstock-info.component.html',
  styleUrls: ['./shstock-info.component.css']
})
export class ShstockInfoComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  updateData:any = [];//选中的数据
  totalPages1: number = 0
  pageSize1:number = 30;
  selectedList1: any = [];
  tempSearchParam:any;
  constructor(private http: HttpUtilService,private nm: NzModalService, private nn: NzNotificationService,) { }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  getList1(data: any): void {
    let url = stockUrl.selectShStockInfo;
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data ||[];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  listSearch(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  getPageIndex1(page: any): void {
    let queryParameterList = this.tempSearchParam.queryParameterList;
    this.getList1({ page: page, length: this.pageSize1,queryParameterList });
  }

  getPageSize1(pageSize: any): void {
    let queryParameterList = this.tempSearchParam.queryParameterList;
    this.pageSize1 = pageSize;
    this.getList1({ page: 1, length: this.pageSize1,queryParameterList });
  }

  btnClick(data: any): void {
    if (data.buttonId !== 'Add') {
      let list = this.dataSet1.filter((x: any) => x.checked);
      if (list.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        return;
      }
    }

    switch (data.buttonId) {
      case 'Acc':
        this.acc();
        break;

      default:
        break;
    }
  }

  /**
   * 当前数据选中状态改变触发的方法
   * @param data
   */
  selectData(data: any) {
    this.updateData = data;
  }

  acc(){
    if (this.updateData.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    if(this.updateData[0].weight==0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '该条数据重量已经为0，无需平账'
      });
      this.destroyTplModal();
      return;
    }
    //let loginName =  this.appInfo.APPINFO.USER.loginName;
    let url = stockUrl.stockBulkInfoAlatAccount;
    let param = {shStockInfos:[]};
    this.updateData.forEach(elem => {
      param.shStockInfos.push({rowid: elem['rowid'],weight:elem['weight']})
    });
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.nn.create('success', '提示信息', '平账成功', {nzDuration: 3000});
        }
      }
    )
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
  };
}
