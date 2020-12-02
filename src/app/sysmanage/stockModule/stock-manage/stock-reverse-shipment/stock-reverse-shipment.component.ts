import {Component, OnInit} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from "@angular/router";

@Component({
  selector: 'app-stock-reverse-shipment',
  templateUrl: './stock-reverse-shipment.component.html',
  styleUrls: ['./stock-reverse-shipment.component.css']
})
export class StockReverseShipmentComponent implements OnInit {
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
  selectedList1: any = [];
  selectedList2: any = [];
  moveWsId: any;
  updateData: any = [];
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  tempSearchParam: any;
  x: any;
  ArrList: any = [];

  constructor(private router: Router, private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    //清除相关session
    sessionStorage.setItem("stockOut", ""); //新增或修改的明细重置
    sessionStorage.setItem("stockReverseTopInfo", ""); //修改时的缓存数据重置
    sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Add'})); //当前的按钮状态，默认新增
    sessionStorage.setItem("detailList", "[]");  //明细缓存
    this.getList1({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList1(data: any): void {
    let url = stockUrl.selectReshipment;
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
   * 获取明细列表
   * @param data
   */
  getList2(data: any, save?: any) {
    let url = stockUrl.selectReshipmentDetail;
    this.dataSet2 = [];
    this.listLoading2 = true;
    // Object.assign(data,this.updateData[0]);
    this.http.post(url, data).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
        if (save) {
          sessionStorage.setItem('detailList', JSON.stringify(this.dataSet2)); //选中明细的原有明细
          sessionStorage.setItem('stockReverseTopInfo', JSON.stringify(save)); //选中的数据带入顶部维护信息显示
          sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Update'})); //当前的按钮状态
          this.router.navigate(['/system/stock/stockReverseShipmentAdd'], {queryParams: {status: 'update'}});

        }
      }
    })
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {

    if (data.buttonId !== 'Add' && this.updateData.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作'
      });
      this.destroyTplModal();
      return;
    }
    switch (data.buttonId) {
      case 'Add':
        this.router.navigate(['/system/stock/stockReverseShipmentAdd']);
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      default:
        break;
    }
  }

  btnDelete() {  //删除
    this.deleteVisible = true;
    this.modalTitle = '提示信息';
    this.deleteCon = "是否确定删除？";
  }

  btnUpdate() { //修改
    if (this.updateData.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }
    this.getList2({page: 1, length: this.pageSize2, reshipmentDetails: [this.ArrList[0]]}, this.updateData[0]);
  }


  /**
   * 列表选中数据发生变化
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
    this.ArrList = this.updateData.map(item => {
      return {reshipmentNo: item.reshipmentNo}
    });
    this.getList2({page: 1, length: this.pageSize2, reshipmentDetails: this.ArrList});
    this.totalWeight = this.updateData.map(item => item.totalWeight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalBranchNum = this.updateData.map(item => item.totalBranchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.updateData.map(item => item.totalPackageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);

  }

  /**
   * 主列表点击
   * @param data
   */
  listClick(data: any): void {
    // this.getList2({page: 1, length: this.pageSize2});

  }

  /**
   * 明细列表当前页码改变
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2, reshipmentDetails: this.ArrList});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2, reshipmentDetails: this.ArrList});
  }

  /**
   * 弹窗关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {
      let param = {stockReverseShipmentModels: []};
      param.stockReverseShipmentModels = [...this.updateData];
      let url = stockUrl.deleteReshipment;
      this.http.post(url, param).then(
        (res: any) => {
          if (res.success) {
            this.nz.success('提示消息', '删除成功！');
            this.getList1({page: 1, length: this.pageSize1});
            this.deleteVisible = false;
          }
        }
      )
    } else {
      this.deleteVisible = false;
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

  //左右上下分栏
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

//数字NAN修改为0
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }


}
