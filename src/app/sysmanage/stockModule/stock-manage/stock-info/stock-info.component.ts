import { Component, OnInit } from '@angular/core';
import { stockUrl } from "../../../../common/model/stockUrl";
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { toDemical } from '../../../../common/validators/validator';
import { UserinfoService } from "../../../../common/services/userinfo-service.service";

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.css']
})
export class StockInfoComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;
  dataSet1: any = [];
  updateData: any = [];//选中的数据
  totalPages1: Number = 1;
  pageSize1: Number = 30;
  selectedList1: any = [];
  totalWeight: number = 0; //总重量
  totalPackageNum: number = 0;  //总件数
  totalBranchNum: number = 0;   //总支数
  temGetListData:any;//查询条件缓存

  constructor(private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService, private appInfo: UserinfoService) {
  }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.temGetListData = data;
    this.getList1(data);
  }

  getList1(data: any): void {
    let url = stockUrl.selectStockInfo;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }
  btnClick(data: any): void {
    if (data.buttonId !== 'Add') {
      if (this.updateData.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        return;
      }
    }

    switch (data.buttonId) {
      case 'acc':
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
    this.totalWeight = this.updateData.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalBranchNum = this.updateData.map(item => item.branchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.updateData.map(item => item.packageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  acc() {
    if (this.updateData.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    if (this.updateData[0].weight == 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '当前数据重量为0，无法平账，请检查！'
      });
      return;
    }
    let loginName = this.appInfo.APPINFO.USER.loginName;
    let url = stockUrl.stockInfoAlatAccount;
    let param = { stockInfos: [] };
    this.updateData.forEach(elem => {
      param.stockInfos.push({ rowid: elem['rowid'], flatAccountCode: loginName, weight: elem['weight'] })
    });
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '平账成功', { nzDuration: 3000 });
          this.getList1(this.temGetListData);
        }
      }
    )
    // this.listSearch({ page: 1, length: this.pageSize1 });
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
