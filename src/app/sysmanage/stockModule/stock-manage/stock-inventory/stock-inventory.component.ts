import {Component, OnInit} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from "@angular/router";
import {CommonService} from '../../../../common/services/common.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';

/**
 * Title: stock-inventory.component.ts
 * Description: 盘库维护页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.component.html',
  styleUrls: ['./stock-inventory.component.css']
})
export class StockInventoryComponent implements OnInit {

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
  inventoryId: number = 0;
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  stockInventory: any;
  tempSearchParam: any;
  updateData: any = [];
  status:string;
  ArrList:any = [];

  constructor(private router: Router, private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private cm: CommonService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    sessionStorage.setItem("stockOut", "");
    sessionStorage.setItem("stockInventoryTopInfo", JSON.stringify({status: 'Add'}));
    sessionStorage.setItem("detailList", "[]");
    this.getList1({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表
   * @param data
   */
  getList1(data: any): void {
    let url = stockUrl.selectStockInventory;
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
      sessionStorage.setItem('stockInventory', '');
      this.router.navigate(['system/stock/stockInventoryAdd']);
      sessionStorage.setItem('stockInventoryStatus', 'add');
    } else if (data.buttonId === 'Audit') {
      this.Audit();
    } else if (data.buttonId === 'Cancel') {
      this.Cancel();
    } else if (data.buttonId === 'Update') {
      if (this.updateData.length > 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择一条数据进行修改！'
        });
        this.destroyTplModal();
        return;
      }
      if (this.cm.canOperate(this.updateData, "status", ["PKZT10"], "该数据已确认，不能进行修改操作！")) {
        return
      }
      this.updateData[0].status = 'Update';
      this.getList2({page: 1, length: this.pageSize2, stockInventoryDetails: [this.ArrList[0]]}, this.updateData[0]);
    } else if (data.buttonId === 'Delete') {
      if (this.cm.canOperate(this.updateData, "status", ["PKZT10"], "存在已确认数据，不能进行删除操作！")) {
        return
      }
      this.status = 'delete';
      this.deleteVisible = true;
      this.modalTitle = '提示信息';
      this.deleteCon = "是否确定删除？";
    }

  }

  /**
   * 主列表选中数据变化
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
    this.ArrList = this.updateData.map( item => {
      return {inventoryId: item.inventoryNo}
    });
    this.getList2({page: 1, length: this.pageSize2, stockInventoryDetails: this.ArrList});

    this.totalWeight = this.updateData.map(item => item.totalWeight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalBranchNum = this.updateData.map(item => item.totalBranchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.updateData.map(item => item.totalPackageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  /**
   * 获取明细列表
   * @param data
   * @param saveData
   */
  getList2(data: any, saveData?: any): void {
    let url = stockUrl.selectStockInventoryDetail;
    this.listLoading2 = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
        if (saveData) {
          sessionStorage.setItem('detailList', JSON.stringify(this.dataSet2)); //选中明细的原有明细
          this.router.navigate(['/system/stock/stockInventoryAdd']);
          sessionStorage.setItem('stockInventoryTopInfo', JSON.stringify(saveData)); //选中的数据带入顶部维护信息显示
        }
      }
    })
  }

  /**
   * 主列表点击
   * @param data
   */
  listClick(data: any): void {
    this.dataSet2 = [];
    this.inventoryId = data.inventoryNo;
    // this.getList2({page: 1, length: this.pageSize2, inventoryId: this.inventoryId});

  }

  /**
   * 确认
   * @constructor
   */
  Audit(): void {
    if (this.cm.canOperate(this.updateData, "status", ["PKZT10"], "存在已确认数据，不能进行确认操作！")) {
      return
    }
    let url = stockUrl.auditInventoryStatus;
    let param: any = [];
    this.updateData.forEach((item) => {
      param.push({
        rowid: item.rowid,
        inventoryNo: item.inventoryNo,
        status: item.status
      });
    });
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.deleteVisible = false;
        this.nz.success('提示消息', '状态确认成功！');
        this.listSearch(this.tempSearchParam);
      }
    })
    // this.status = 'audit';
    // this.deleteVisible = true;
    // this.modalTitle = '提示信息';
    // this.deleteCon = "是否确认？";

  }

  /**
   * 取消确认
   * @constructor
   */
  Cancel(): void {
    if (this.cm.canOperate(this.updateData, "status", ["PKZT00", "PKZT20"], "存在新增或取消确认数据，不能进行取消确认操作！")) {
      return
    }
    let url = stockUrl.cancelInventoryStatus;
    let param: any = [];
    this.updateData.forEach((item) => {
      param.push({
        rowid: item.rowid,
        inventoryNo: item.inventoryNo,
        status: item.status
      });
    });

    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.success('提示消息', '取消确认成功！');
        this.listSearch(this.tempSearchParam);
      }
    })
  }
  /**
   * 弹窗关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok' && this.status == 'delete'){
      let deleteUrl = stockUrl.deleteStockInventoryAndDetail;
      let param = {stockInventoryModels:[]};
      param.stockInventoryModels = [...this.updateData];
      this.http.post(deleteUrl, param).then(
        (res: any) => {
          if (res.success) {
            this.deleteVisible = false;
            this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
            this.getList1(this.tempSearchParam);
          }
        }
      )
    } else if(data.type == 'ok' && this.status == 'audit') {
      let url = stockUrl.auditInventoryStatus;
      let param: any = [];
      this.updateData.forEach((item) => {
        param.push({
          rowid: item.rowid,
          inventoryNo: item.inventoryNo,
          status: item.status
        });
      });
      this.http.post(url, param).then((res: any) => {
        if (res.success) {
          this.deleteVisible = false;
          this.nz.success('提示消息', '状态确认成功！');
          this.listSearch(this.tempSearchParam);
        }
      })
    }else {
      this.deleteVisible = false;
    }
  }

  /**
   * 明细列表当前页码改变
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2, stockInventoryDetails: this.ArrList});
  }

  /**
   * 明细列表每页展示数据改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2,stockInventoryDetails: this.ArrList});
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
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
  //左右上下分栏
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }
}
