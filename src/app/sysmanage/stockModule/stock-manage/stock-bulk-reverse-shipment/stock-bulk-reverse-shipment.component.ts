import {Component, OnInit} from '@angular/core';
import {stockUrl} from "../../../../common/model/stockUrl";
import {HttpUtilService} from "../../../../common/services/http-util.service";
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from "@angular/router";

@Component({
  selector: 'app-stock-bulk-reverse-shipment',
  templateUrl: './stock-bulk-reverse-shipment.component.html',
  styleUrls: ['./stock-bulk-reverse-shipment.component.css']
})
export class StockBulkReverseShipmentComponent implements OnInit {
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
  ArrList:any = [];
  totalPages1: number;
  totalPages2: number;
  pageSize1: number = 30;
  pageSize2: number = 30;
  updateData: any = [];
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;
  deleteCon: string;
  tempSearchParam: any;
  clickData:any= {};
  x: any;

  constructor(private router: Router, private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    //清除相关session
    sessionStorage.setItem("stockOut", ""); //新增或修改的明细重置
    sessionStorage.setItem("stockBulkReverseTopInfo", ""); //修改时的缓存数据重置
    sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Add'})); //当前的按钮状态，默认新增
    sessionStorage.setItem("detailList", "[]");  //明细缓存
    this.getList1({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表数据
   * @param data
   */
  getList1(data: any): void {
    let url = stockUrl.selectShReshipment;
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
    let url = stockUrl.selectShReshipmentDetail;
    this.dataSet2 = [];
    this.listLoading2 = true;
    console.log(data);
    this.http.post(url, data).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || 0;
        if (save) {
          sessionStorage.setItem('detailList', JSON.stringify(this.dataSet2)); //选中明细的原有明细
          sessionStorage.setItem('stockBulkReverseTopInfo', JSON.stringify(save)); //选中的数据带入顶部维护信息显示
          sessionStorage.setItem("btnStatus", JSON.stringify({status: 'Update'})); //当前的按钮状态
          this.router.navigate(['/system/stock/stockBulkReverseShipmentAdd'],{queryParams:{status:'update'}});

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
        this.router.navigate(['/system/stock/stockBulkReverseShipmentAdd']);
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
    this.getList2({page: 1, length: this.pageSize2,shReshipments:[this.ArrList[0]]}, this.updateData[0]);
}


  /**
   * 列表选中数据发生变化
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
    this.ArrList = this.updateData.map( item => {
      return {reshipmentNo: item.reshipmentNo}
    });
    this.getList2({page: 1, length: this.pageSize2, shReshipments:this.ArrList});

    this.totalWeight = this.updateData.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalBranchNum = this.updateData.map(item => item.branchNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPackageNum = this.updateData.map(item => item.packageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
  }

  /**
   * 主列表点击
   * @param data
   */
  listClick(data: any): void {
    this.clickData = {...data};
    // this.getList2({page: 1, length: this.pageSize2,... data});

  }

  /**
   * 主列表当前页码改变
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }

  /**
   * 主列表每页展示条数改变
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
    this.getList2({page: page, length: this.pageSize2,shReshipments:this.ArrList});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2,shReshipments:this.ArrList});
  }

  /**
   * 弹窗关闭
   * @param data
   */
  modalConfirmResult(data: any): void {
    if (data.type == 'ok') {
      let url = stockUrl.deleteShReshipment;
      let params = {shReshipments: []};
      params.shReshipments = this.updateData.map(item => {
        return {rowid:item.rowid}
      });
      this.http.post(url, params).then(
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
