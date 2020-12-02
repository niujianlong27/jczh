import {Component, OnInit} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from "@angular/router";
import {CommonService} from '../../../../common/services/common.service';

/**
 * Title: stock-transfer.component.ts
 * Description: 调港维护页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.css']
})
export class StockTransferComponent implements OnInit {
  gridOneHeight: string;
  gridTwoHeight: string;

  totalWeight: number = 0; //总重量
  totalPackageNum: number = 0;  //总件数
  totalBranchNum: number = 0;   //总支数

  tplModal: NzModalRef;
  listLoading1: boolean = false;
  listLoading2: boolean = false;
  dataSet1: any = [];
  dataSet2: any = [];
  totalPages1: number;
  totalPages2: number;
  pageSize1: number = 30;
  pageSize2: number = 30;
  selectedTransferNo: any;
  ArrList: any = [];
  selectData1: any = [];
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  deleteList = [];//需要删除的数据
  stockIn: any;
  tempSearchParam: any;
  x: any;

  constructor(private router: Router, private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private cm: CommonService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    sessionStorage.setItem("stockOut", "");
    sessionStorage.setItem("stockTransferTopInfo", JSON.stringify({status: 'Add'}));
    sessionStorage.setItem("detailList", "[]");
    this.listSearch({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList1(data: any): void {
    let url = stockUrl.selectStockTransfer;
    this.listLoading1 = true;
    this.dataSet1 = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;
      }
    })
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  /**
   * 明细列表当前页码改变
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2, stockTransferDetails: this.ArrList});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2, stockTransferDetails: this.ArrList});
  }

  /**
   * 获取明细列表
   * @param data
   * @param saveData
   */
  getList2(data: any, saveData?: any): void {
    let url = stockUrl.selectStockTransferDetail;
    this.listLoading2 = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
        if (saveData) {
          sessionStorage.setItem('detailList', JSON.stringify(this.dataSet2)); //选中明细的原有明细
          this.router.navigate(['/system/stock/stockTransferAdd']);
          sessionStorage.setItem('stockTransferTopInfo', JSON.stringify(saveData)); //选中的数据带入顶部维护信息显示
        }
      }
    })
  }

  /**
   * 选中数据变化
   * @param data
   */
  selectData(data: any) {
    this.selectData1 = data;
    this.ArrList = this.selectData1.map(item => {
      return {transferId: item.transferNo}
    });
    this.getList2({page: 1, length: this.pageSize2, stockTransferDetails: this.ArrList});
    this.totalWeight = this.selectData1.map(item => item.totalWeight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalBranchNum = this.selectData1.map(item => item.totalBranchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.selectData1.map(item => item.totalPackageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);

  }

  /**
   *
   * @param data
   */
  listClick(data: any): void {
    this.dataSet2 = [];
    this.selectedTransferNo = data.transferNo;
    // this.getList2({ page: 1, length: this.pageSize2,transferId:this.selectedTransferNo});

  }

  /**
   * 确认
   */
  audit(): void {
    if (this.cm.canOperate(this.selectData1, "status", ["DYZT10"], "存在已确认数据，不能进行确认操作！")) {
      return
    }
    let param: any = [];
    this.selectData1.forEach(item => {
      param.push(item);
    });
    this.http.post(stockUrl.auditTransferStatus, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '状态确认成功', {nzDuration: 3000});
        this.listSearch(this.tempSearchParam);
      }
    })
  }

  /**
   * 取消确认
   */
  cancel(): void {
    if (this.cm.canOperate(this.selectData1, "status", ["DYZT00", "DYZT20"], "存在新增或取消确认数据，不能进行取消确认操作！")) {
      return
    }
    let param: any = [];
    this.selectData1.forEach(item => {
      param.push({
        transferNo: item.transferNo,
        rowid: item.rowid,
        status2: item.status2
      });
    });
    this.http.post(stockUrl.cancelTransferStatus, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '取消状态确认成功', {nzDuration: 3000});
        this.listSearch(this.tempSearchParam);
      }
    })
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId !== 'Add') {
      let list = this.dataSet1.filter((x: any) => x.checked);
      if (list.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        this.destroyTplModal();
        return;
      }
    }
    if (data.buttonId === 'Add') {
      // sessionStorage.setItem('stockTransfer','');
      this.router.navigate(['/system/stock/stockTransferAdd']);
    } else if (data.buttonId === 'Audit') {
      this.audit();
    } else if (data.buttonId === 'Cancel') {
      this.cancel();
    }
    if (data.buttonId === 'Update') {
      let list = this.dataSet1.filter((x: any) => x.checked);
      if (list.length > 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择一条数据进行修改！'
        });
        this.destroyTplModal();
        return;
      }
      console.log(JSON.stringify(list[0]), '');
      if (this.cm.canOperate(this.selectData1, "status", ["DYZT10"], "该数据已确认，不能进行修改操作！")) {
        return
      }
      ;
      // 修改时获取列表明细信息存入session后带入修改页
      list[0].status = 'Update';
      this.getList2({page: 1, length: this.pageSize2, stockTransferDetails: [this.ArrList[0]]}, list[0]);
    }

    if (data.buttonId === 'Delete') {
      let list = this.dataSet1.filter((x: any) => x.checked);
      if (this.cm.canOperate(list, "status", ["DYZT10"], "存在已确认数据，不能进行删除操作！")) {
        return
      }
      ;
      this.deleteVisible = true;
      this.modalTitle = '提示信息';
      this.deleteCon = "是否确定删除？";
      this.deleteList = list;
    }

  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
  };

  /**
   * 弹窗关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {
      let deleteUrl = stockUrl.deleteStockTransfer;
      let param = {stockTransferModels: []};
      param.stockTransferModels = [...this.selectData1]
      this.http.post(deleteUrl, param).then(
        (res: any) => {
          this.deleteVisible = false;
          if (res.success) {
            this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
            this.getList1(this.tempSearchParam);
          }
        }
      )
    } else {
      this.deleteVisible = false;
    }
  }

  //左右上下分栏
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

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
