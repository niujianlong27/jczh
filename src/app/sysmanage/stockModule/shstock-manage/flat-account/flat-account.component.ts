import {Component, OnInit} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from "../../../../common/services/userinfo-service.service";
import {logger} from "codelyzer/util/logger";
import {temporaryAllocator} from "@angular/compiler/src/render3/view/util";

@Component({
  selector: 'app-flat-account',
  templateUrl: './flat-account.component.html',
  styleUrls: ['./flat-account.component.css']
})
export class FlatAccountComponent implements OnInit {

  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  updateData: any = [];//选中的数据
  totalPages1: number = 0;
  pageSize1: number = 30;
  selectedList1: any = [];
  totalWeight: number = 0; //总重量
  totalPackageNum: number = 0;  //总件数
  totalBranchNum: number = 0;   //总支数
  temGetListData: any;//查询条件缓存
  modalTitle: string;
  deleteCon: string;
  deleteVisible: boolean = false;
  tempSearchParam:any;

  constructor(private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService, private appInfo: UserinfoService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.temGetListData = data;
    this.getList1(data);
  }

  getList1(data: any): void {
    let url = stockUrl.selectBulkInfoAlatAccount;
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  getPageIndex1(page: any): void {
    let queryParameterList = this.tempSearchParam.queryParameterList;
    this.getList1({page: page, length: this.pageSize1,queryParameterList});
  }

  getPageSize1(pageSize: any): void {
    let queryParameterList = this.tempSearchParam.queryParameterList;
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1,queryParameterList});
  }


  btnClick(data: any): void {
    if (this.updateData.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      return;
    }
    switch (data.buttonId) {
      case 'Revoke':
        this.revoke();
        break;

    }
  }

  revoke() {
    if (this.updateData.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据后操作！'
      });
      return;
    }
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确定撤销平账？";
  }

  modalConfirmResult(data) {
    if (data.type == 'ok') {
      let url = stockUrl.cancelFlatAccount;
      let data = {};
      data['rowid'] = this.updateData[0].rowid;
      console.log(this.updateData);
      this.http.post(url, data).then((res: any) => {
        this.deleteVisible = false;
        if (res.success) {
          this.nz.create('success', '提示信息', '撤销平账成功', {nzDuration: 3000});
        }
      })
    }
  }

  /**
   * 当前数据选中状态改变触发的方法
   * @param data
   */
  selectData(data: any) {
    this.updateData = data;
    //   this.totalWeight = this.updateData.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    //   this.totalBranchNum = this.updateData.map(item => item.branchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    //   this.totalPackageNum = this.updateData.map(item => item.packageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }


  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // },1500);
  };

  /*
*    数字NAN修改为0
*/
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }
}
