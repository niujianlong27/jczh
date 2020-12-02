import {Component, OnInit} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from "@angular/router";
import {CommonService} from '../../../../common/services/common.service';

@Component({
  selector: 'app-stock-bulk-transfer',
  templateUrl: './stock-bulk-transfer.component.html',
  styleUrls: ['./stock-bulk-transfer.component.css']
})
export class StockBulkTransferComponent implements OnInit {

  // 页面grid 左右分栏
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  rightShow: boolean = false;

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
  selectData1: any= [];
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  deleteList = [];//需要删除的数据
  stockIn: any;
  tempSearchParam: any;
  clickData:any={};
  x: any;

  constructor(private router: Router, private http: HttpUtilService,
              private nm: NzModalService, private nz: NzNotificationService,
              private cm: CommonService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    sessionStorage.setItem("stockOut", ""); //新增或修改的明细重置
    sessionStorage.setItem("stockBulkTransferTopInfo", ""); //修改时的缓存数据重置
    sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Add'})); //当前的按钮状态，默认新增
    sessionStorage.setItem("detailList", "[]");  //明细缓存
    this.listSearch({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList1(data: any): void {
    let url = stockUrl.selectShStockTransfer;
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
   * 主列表当前页码改变
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }

  /**
   * 主列表每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }

  /**
   * 明细列表当前页码改变
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2,...this.clickData});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2,...this.clickData});
  }

  /**
   * 获取明细列表
   * @param data
   * @param saveData
   */
  getList2(data: any, saveData?: any): void {
    let url = stockUrl.selectShStockTransferDetail;
    this.listLoading2 = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
        if (saveData) {
          sessionStorage.setItem('detailList', JSON.stringify(this.dataSet2)); //选中明细的原有明细
          sessionStorage.setItem('stockBulkTransferTopInfo', JSON.stringify(saveData)); //选中的数据带入顶部维护信息显示
          sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Update'})); //当前的按钮状态
          this.router.navigate(['/system/stock/stockBulkTransferAdd'], {queryParams: {status: 'update'}});
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
    this.totalWeight = this.selectData1.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalBranchNum = this.selectData1.map(item => item.branchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.selectData1.map(item => item.packageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  /**
   *
   * @param data
   */
  listClick(data: any): void {
    this.clickData = data;
    this.getList2({page: 1, length: this.pageSize2,...data})
  }

  /**
   * 确认
   */
  audit(): void {
    if (this.cm.canOperate(this.selectData1, "status", ["10"], "存在已确认数据，不能进行确认操作！")) {
      return
    }
    let param: any = [...this.selectData1];
    this.http.post(stockUrl.auditShTransferStatus, param).then((res: any) => {
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
    if (this.cm.canOperate(this.selectData1, "status", ["00", "20"], "存在新增或取消确认数据，不能进行取消确认操作！")) {
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
    this.http.post(stockUrl.cancelShTransferStatus, param).then((res: any) => {
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

    if (data.buttonId !== 'Add' && this.selectData1.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作'
      });
      this.destroyTplModal();
      return;
    }
    switch (data.buttonId) {
      case 'Add':
        this.router.navigate(['/system/stock/stockBulkTransferAdd']);
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Audit':
        this.audit();
        break;
      case 'Cancel':
        this.cancel();
        break;
      default:
        break;
    }

  }

  btnUpdate() { //修改
    if (this.selectData1.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    if (this.cm.canOperate(this.selectData1, "status", ["10"], "该数据已确认，不能进行修改操作！")) {
      return
    }
    this.getList2({page: 1, length: this.pageSize2,...this.selectData1[0]}, this.selectData1[0]);
  }

  btnDelete() {  //删除
    if (this.cm.canOperate(this.selectData1, "status", ["10"], "存在已确认数据，不能进行删除操作！")) {
      return
    }
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确定删除？";
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
      let deleteUrl = stockUrl.deleteShStockTransfer;
      let params = {stockBulkTransferModels: []};
      params.stockBulkTransferModels = [...this.selectData1];
      this.http.post(deleteUrl,params).then(
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

  /**
   * 右grid控制
   * @param data
   */
  gridLineFun(data: number) {
    const w = data < 1 ? data : 0.96;

    this.leftWidth = `${w * 100}%`;
    this.lineWidth = `${w * 100}%`;
    this.rightWidth = `${99 - w * 100}%`;
    this.display = 'block';

  }

  /**
   * 右grid
   */
  rightShowFun() {
    this.rightShow = !this.rightShow;
    if (this.rightShow) {
      this.leftWidth = '99%';
      this.lineWidth = '99%';
      this.rightWidth = '0%';
      this.display = 'none';
    } else {
      this.leftWidth = '49.5%';
      this.lineWidth = '49.5%';
      this.rightWidth = '49.5%';
      this.display = 'block';
    }
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
