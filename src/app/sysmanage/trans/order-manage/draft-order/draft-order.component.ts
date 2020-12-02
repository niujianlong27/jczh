import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {Router} from '@angular/router';
import { NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-draft-order',
  templateUrl: './draft-order.component.html',
  styleUrls: ['./draft-order.component.css']
})
export class DraftOrderComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading1: boolean = false;

  totalPages1: Number = 0;
  pageSize1: Number = 30;
  buttonId: any;
  selectedOrderData: Array<any> = [];
  tempSearchParam: any = {};
  orderData: Array<any> = [];
  itemData: Array<any> = [];
  packData: Array<any> = [];
  total: number = 0;
  totalWeight: number = 0;
  totalSheet: number = 0;
  totalPrice: number = 0;
  returnMsg: any;
  deleteCon:string;
  modalTitle:string;
  isVisible: boolean = false;
  deleteVisible: boolean = false;
  status :string;
  isResetFilter: boolean;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  caculateEnameArr1: any = [
    {field: 'totalSheet', tipInfo: '已选件数', tipInfoType: '件', demLength: 3},
    {field: 'totalWeight', tipInfo: '已选重量', tipInfoType: '吨', demLength: 3},
    {field: 'totalPrice', tipInfo: '已选金额', tipInfoType: '元', demLength: 3},
  ];


  gridOneHeight: string;
  gridTwoHeight: string;

  businessModuleArr: Array<any> = [];

  constructor(
    private http: HttpUtilService,
    private nz: NzNotificationService,
    private nm: NzModalService,
    private router: Router,
    private  angularHttp: HttpClient
  ) {
  }

  /*
  *    初始化
  */
  ngOnInit() {

  }

  /*
  *    查询
  */
  listSearch(data: any,flag = null) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data,flag);
  }

  /*
  *         调用查询接口
  */
  getList1(data: any,flag = null): void {
    let url = TRANS_URLS.selectDraftOrder;
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        if(flag === 'effect'){
          this.isResetFilter = true;
          window.setTimeout(() => {
            this.isResetFilter = false;
          },2000)
        }
        this.orderData = res.data.data && res.data.data.data;
        this.total = res.data.data && res.data.data.total;
        this.orderData.forEach((item, index) => item.rowIndex = index + 1);
        this.itemData = [];
      }
    });
  }

  /*
  *    按钮
  */

  btnClick(data: any) {
    this.buttonId = data.buttonId;
    if (this.buttonId != 'Add' && this.buttonId != 'Import' && this.buttonId != 'Export') {
      if (this.selectedOrderData.length < 1) {
        let tplModal: NzModalRef;
        tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        });
        this.destroyTplModal(tplModal);
        return;
      }
    }
    switch (this.buttonId) {
      case 'Add':
        this.router.navigate(['/system/trans/order-manage/order-add']);
        break;
      case 'Update':
        this.btnUpdate(this.selectedOrderData);
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Match':
        this.btnMatch();
        break;
      case 'Effect':
        this.btnEffect();
        break;
      case 'Integrated':
        this.btnIntegrated();
        break;
      case 'Export':
        this.btnExport();
        break;
      case 'Merge':
        this.merge();
        break;
      default:
        break;
    }
  }

  /*
  *   生效
  */
  btnEffect() {
    let url = TRANS_URLS.effectDraftOrder;
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return item.orderNo;
    });
    param.orderNoList = arr;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', res.data.msg, {nzDuration: 3000});
        this.listSearch(this.tempSearchParam,"effect");
        this.selectedOrderData = [];
        this.itemData = [];
      } else {
        if (res.data && res.data.code === 109) {
           this.nm.confirm({
             nzTitle: '提示信息',
             nzContent: res.data.msg,
             nzOnOk: () => new Promise((resolve, reject) => {
               this.http.post(url, {...param, remark: true}).then((response: any) => {
                 if (response.success) {
                    this.nz.create('success', '提示信息', response.data.msg, {nzDuration: 3000});
                    this.listSearch(this.tempSearchParam, "effect");
                    this.selectedOrderData = [];
                    this.itemData = [];
                    resolve();
                 } else {
                    reject();
                 }
               })
             })
           })
        }
      }
    });
  }

  /*
 *   一票制
 */
  btnIntegrated() {
    let url = TRANS_URLS.integratedOrder;
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return item.orderNo;
    });
    param.orderNoList = arr;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '修改成功', {nzDuration: 3000});
        this.selectedOrderData = [];
        this.itemData = [];
        this.listSearch(this.tempSearchParam);
        // this.destroyTplModal();
      }
    });


  }

  /*
  *   修改
  */
  btnUpdate(data: any) {
    this.router.navigate(['/system/trans/order-manage/order-add'], {
      queryParams: {
        'operateType': 'update',
        'orderNo': this.selectedOrderData [0].orderNo
      }
    });
  }

  /*
  *    删除
  */
  btnDelete() {
    this.deleteVisible = true;
    this.modalTitle ='提示信息';
    this.deleteCon = '是否确认删除？';
    this.status = 'delete';
  }

  modalConfirmResult(data){
    if (data.type == 'ok'  && this.status == 'delete') {
        let url = TRANS_URLS.DELETE_ORDER;
        let param: any = {};
        param = this.selectedOrderData;
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
            this.listSearch(this.tempSearchParam);
            this.selectedOrderData = [];
            this.deleteVisible = false;
          }
        });
    }else {
      this.deleteVisible = false;
    }
  }

// 合同合并
  merge() {
    if (this.selectedOrderData.length < 2) {
      let tplModal: NzModalRef;
      tplModal = this.nm.warning({
      nzTitle: '提示信息',
      nzContent: '请选择多条数据后操作！'
    });
    this.destroyTplModal(tplModal);
    return;
  }

    let istrue: boolean;
    for (var i = 1; i < this.selectedOrderData.length; i++) {
      istrue = this.selectedOrderData[i].consignorCompanyId != this.selectedOrderData[0].consignorCompanyId ||
        this.selectedOrderData[i].detailAddress != this.selectedOrderData[0].detailAddress;
      if (istrue) {
        let tplModal: NzModalRef;
        tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '收货地址和收货单位必须保持一致才能合并合同！'
        });
        this.destroyTplModal(tplModal);
        return;
      }
    }
    let url = TRANS_URLS.mergeOrder;
    let param: any = {tOrders: []};
    param.tOrders = this.selectedOrderData.map(item => {
      return {orderNo: item.orderNo}
    });
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '合并成功', {nzDuration: 3000});
        this.listSearch(this.tempSearchParam);
        this.selectedOrderData = [];
      }
    });
  }

  /*
  *   价格匹配
  */

  btnMatch() {
    let url = TRANS_URLS.matchDraftOrder;
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return item.orderNo;
    });
    param.orderNoList = arr;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {

        //this.nz.create('success','提示信息',res.data.data,{nzDuration:3000});
        //  this.listSearch(this.tempSearchParam);
        this.selectedOrderData = [];
        this.returnMsg = res.data.data;
        //this.isVisible = true;
        this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: res.data.data
          }
        );
        this.listSearch(this.tempSearchParam);
      }
    });
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 选中数据
   * @param data
   */
  selectedOrder(data: any) {
    this.selectedOrderData = data;

    this.totalWeight = this.selectedOrderData.map(item => item.totalWeight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalSheet = this.selectedOrderData.map(item => item.totalSheet).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    this.totalPrice = this.selectedOrderData.map(item => item.totalPrice).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
    if (this.selectedOrderData.length > 0) {
      this.queryItem();
      this.queryPack();
    } else {
      this.itemData = [];
      this.packData = [];
    }
  }

  /**
   * 行点击事件
   * @param data
   */
  rowCilcked(data: any) {
    this.orderData.forEach(item => {
      if (item.rowIndex === data.rowIndex) {
        item.checked = !item.checked;
      }
    });
    this.selectedOrder(this.orderData.filter(item => item.checked));
  }

  /**
   * 根据委托查询委托明细信息
   */
  queryItem() {

    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return {
        orderNo: item.orderNo,
        companyId: item.companyId
      };
    });
    param.tOrders = arr;

    this.http.post(TRANS_URLS.SELECT_ORDERITEM_BY_ORDER, param).then(
      (res: any) => {
        if (res.success) {
          this.itemData = res.data.data;
        }
      }
    );
  }

  /**
   * 根据委托查询委托捆包信息
   */
  queryPack() {
    let param: any = {};
    let arr = this.selectedOrderData.map(item => {
      return {
        orderNo: item.orderNo,
        companyId: item.companyId
      };
    });
    param.tOrders = arr;
    this.http.post(TRANS_URLS.SELECT_ORDERPACK_BY_ORDER, param).then(
      (res: any) => {
        if (res.success) {
          this.packData = res.data.data;
        }
      }
    );
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(tplModal): void {
    window.setTimeout(() => {
      tplModal.destroy();
    }, 2000);
  };

  /*
  *   把NaN变为0
  */
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }


  /*
  *    导出按钮
  */
  btnExport() {
    let url: any = TRANS_URLS.exportDraftOrder;
    this.angularHttp.post(url, this.tempSearchParam, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/pdf'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `合同生成.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /*
  *     价格匹配错误信息弹窗确定按钮
  */
  handleOk() {
      this.listSearch(this.tempSearchParam);
      this.isVisible = false;
  }


  /*
  *    价格匹配错误信息取消按钮
  */
  handleCancel() {
    this.listSearch(this.tempSearchParam);
    this.isVisible = false;
  }


  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

}
