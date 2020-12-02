//import { Component, OnInit } from '@angular/core';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TRANS_URLS} from '@model/trans-urls';
import {urls} from '@model/url';
// import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {HttpUtilService} from '@service/http-util.service';
import {format, addMinutes, differenceInMinutes} from 'date-fns';

@Component({
  selector: 'app-grad-entrusted',
  templateUrl: './grad-entrusted.component.html',
  styleUrls: ['./grad-entrusted.component.css']
})
export class GradEntrustedComponent implements OnInit {

  dataSet: any;
  dataSet2: any;
  dataSet3: any;
  itemData: any;
  updatadata: any = [];
  updatadata2: any = [];
  updatadata3: any = [];
  tempSearchParam: any;
  pageSize1: any = 30;
  totalPage: any;
  listLoading1: any;
  isCheck: boolean = false;
  loading: boolean;
  loading1: boolean;
  dataSet4: any;
  itemUpdatedata: any;

  tplModal: NzModalRef;
  modalTitle: any;
  importFile: any;
  implistLoading: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  logistics: any;
  chooseTime: any;
  radiovalue: any;    //选项
  remark: any;    //备注
  fleet: any;   //车队
  driver: any;   //车辆
  showPagination: boolean = false;
  // 页面grid
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  rightShow: boolean = false;
  private buttonId: any;
  private columnsArr: any = [];
  data2PageTmp: any = {length: 30}; // 货盘明细页码数据缓存
  btnDis: any = {bid: true, result: true};
  data2: any[] = [];
  pageSize2: number = 30;
  totalpage2: number = 0;
  nextLoading: boolean = false;
  getBidInfo: any = {};//竞价数据
  tempInfo: any = {};
  modalForm: any = {};
  taxInclusive: string = '10';
  bidPriceType: string = '10';
  driverType: string;
  bidderCompanyList: Array<any> = [];//承运人数据
  driverList: Array<any> = [];//司机数据
  carriageOfSelectedValue: string[] = [];
  listOfSelectedValue: string[] = [];
  modalRef: NzModalRef;

  constructor(
    private http: HttpUtilService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private nz: NzNotificationService,
    private xlsx: XlsxService,
    private nzMess: NzMessageService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    this.searchList({page: 1, length: this.pageSize1});
  }

  /*
    *     查询列表
    */
  searchList(data: any) {
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }

  /*
  *    调用查询接口
  */
  getList1(data: any) {
    let url = urls.getPalletList;
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total;
      }
    });
  }


  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data: any): void {
    this.columnsArr = data;
  }

  /*
  *    按钮点击事件
  */

  btnCLick(data: any) {
    this.buttonId = data.buttonId;

    /*switch (this.buttonId) {
      case 'Import':
        this.btnImport();
        break;
      case 'Directional':
        this.btnDirectional();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Driver':
        this.btnDriver();
        break;

      default:
        break;
    }*/
  }

  /*
*    主列表勾选
*/
  updataDataResult(data: any) {
    if (data.length == 0) {
      this.itemData = [];
    } else {
      this.updatadata = data;
      if (this.updatadata.length > 0) {
        this.getItem();
      } else {
        this.updatadata = [];
      }
    }
    // console.log(111111);
  }

  itemUpdateData(data: any) {
    this.itemUpdatedata = data;
  }

  /*
  *   子列表勾选
  */

  updataDataResult2(data: any) {
    this.updatadata2 = data;
    this.dataSet2.forEach((item: any) => {
      for (let i: number = 0; i < this.updatadata2.length; i++) {
        if (item.companyId == this.updatadata2[i].companyId) {
          item.bidRatio = 1 / this.updatadata2.length;
          item.entrustedWeight = this.sumItemInputWeight() * item.bidRatio;
          return;
        } else {
          item.bidRatio = null;
          item.entrustedWeight = null;
        }
      }

    });
    this.dataSet2 = [...this.dataSet2];
  }

  /*
*    获得子表信息
*/

  getItem() {
    let url = TRANS_URLS.getEntrustItem;
    let arr = this.updatadata.map(item => {
      return {
        orderNo: item.orderNo,
        companyId: item.companyId
      };
    });
    let param: any = {};
    param.tOrders = arr;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.itemData = res.data.data;
        this.itemData.forEach((item: any) => {
          this.updatadata.forEach((element: any) => {
            if (item.orderNo == element.orderNo) {
              //          item.inputWeight = element.totalWeight/
            }
          });
        });
      }
    });
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.searchList(this.tempSearchParam);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.searchList(this.tempSearchParam);
  }

  /*
*   得出输入重量的和
*/

  sumItemInputWeight() {
    let sum: number = 0;
    this.itemUpdatedata.forEach((item: any) => {
      sum += item.inputWeight;
    });
    return sum;
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

  selectData1: any[] = [];

  selectData(data: any) {
    //console.log(data);
    this.selectData1 = data;
    if (this.selectData1.length == 1) {
      if (this.selectData1[0].tenderStatus == 'JJZZ10') {
        this.btnDis.Select = true;
        this.btnDis.Detail = true;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = false;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ20') {
        this.btnDis.Select = true;
        this.btnDis.Detail = false;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = false;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ30') {
        this.btnDis.Select = true;
        this.btnDis.Detail = false;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = true;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ40') {
        this.btnDis.Select = false;
        this.btnDis.Detail = true;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = true;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ50') {
        this.btnDis.Select = true;
        this.btnDis.Detail = false;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = true;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ60') {
        this.btnDis.Select = true;
        this.btnDis.Detail = false;
        this.btnDis.Binding = false;
        this.btnDis.WithDraw = true;
      }
      if (this.selectData1[0].retenderType == '1') {
        this.btnDis.Binding = true;
      }
    } else {
      this.btnDis.Select = true;
      this.btnDis.Detail = true;
      this.btnDis.Binding = true;

      this.selectData1.forEach(
        item => {
          //console.log(item)
          if (item.tenderStatus == 'JJZZ10' || item.tenderStatus == 'JJZZ20') {
            this.btnDis.WithDraw = false;
          } else {
            this.btnDis.WithDraw = true;
          }
        });

    }
    if (this.selectData1.length !== 0) {
      let param: any = {jjTenderItemModels: []};
      //param.consignorCompanyId = this.selectData1[0].consignorCompanyId;
      this.selectData1.forEach(
        res => {
          param.jjTenderItemModels.push({tenderNo: res.tenderNo, companyId: this.selectData1[0].companyId});
        }
      );
      this.getNextList(param);
    } else {
      this.data2 = [];
    }
  }

  getNextList(param: any) {
    param.page = 1; //最好有
    param.length = param.length || this.pageSize2; //最好有
    param.consignorCompanyId = this.selectData1[0].companyId;
    this.data2PageTmp = param;
    this.nextLoading = true;
    this.http.post(urls.getJJTenderItemByTenderNos, param).then((x: any) => {
      this.nextLoading = false;
      if (x.success) {
        this.data2 = x.data.data.data || [];
        this.totalpage2 = x.data.data.total;
        // this.data2 = x.data.data && x.data.data.palletModelList && x.data.data.palletModelList[0] && x.data.data.palletModelList[0].palletItemModelList || [];
      }
    });
  }

  getbiddingadata() {
    this.getBidInfo = {};
    let params: any = {};
    this.http.post(urls.getBidInfo, {
      requestCompanyId: this.selectData1[0].companyId,
      tenderNo: this.selectData1[0].tenderNo
    }).then((res: any) => {
      //console.log(res);
      if (res.success) {
        this.getBidInfo = res.data.data || [];
        this.getBidInfo.carrierType == '10' ? this.tempInfo.carriiagePrice = true : this.tempInfo.carriiagePrice = false;
        this.getBidInfo.driverType == '10' ? this.tempInfo.driverPrice = true : this.tempInfo.driverPrice = false;
        this.tempInfo.carrierSplit = this.getBidInfo.bidPriceType;
        this.tempInfo.driverSplit = this.getBidInfo.driverType;
        this.taxInclusive = this.getBidInfo.settleType;
        if (this.getBidInfo.settleType == '10') {
          this.tempInfo.lowerPriceTax = this.getBidInfo.lowerPriceTax;
          this.tempInfo.ceilingPriceTax = this.getBidInfo.ceilingPriceTax;
        } else {
          this.tempInfo.lowerPriceTax = this.getBidInfo.lowerPriceTaxNo;
          this.tempInfo.ceilingPriceTax = this.getBidInfo.ceilingPriceTaxNo;
        }
        this.modalForm.continueTime = '10';
        this.modalForm.executionTimeStart = new Date();
        this.modalForm.executionTimeEnd = addMinutes(this.modalForm.executionTimeStart, 10);
        this.modalForm.remark = this.getBidInfo.remark;
        this.bidPriceType = this.getBidInfo.carrierSplit;
        this.driverType = this.getBidInfo.driverSplit;
        if (this.getBidInfo.carrierList) {
          this.getBidInfo.carrierList.forEach(
            (res, index) => {
              this.bidderCompanyList.forEach(
                (item, index1) => {
                  if (res.bidderCompanyId == item.companyId) {
                    console.log(1234);
                    this.carriageOfSelectedValue[index] = item.companyName;
                  }
                });
            });
        }
        if (this.getBidInfo.driverList) {
          this.getBidInfo.driverList.forEach(
            (res, index) => {
              this.driverList.forEach(
                (item, index1) => {
                  if (res.bidderId == item.userId) {
                    this.listOfSelectedValue[index] = item.name;
                  }
                });
            });
        }
      }
    });
  }

  /**
   * 选择司机
   * @param name
   */
  isNotSelected(value, flag): boolean {
    if (flag === 'carriage') {
      return this.carriageOfSelectedValue.indexOf(value) === -1;
    } else {
      return this.listOfSelectedValue.indexOf(value) === -1;
    }

  }

  delectDriver(role, index) {
    if (role === 'driver') {
      this.listOfSelectedValue.splice(index, 1);
    } else {
      this.carriageOfSelectedValue.splice(index, 1);
    }
    // $scope.valueObj.carrier.name.splice($.inArray(e,$scope.valueObj.carrier.name), 1);
  }

  /**
   * 重新竞价
   * @param name
   */
  afreshBidding() {
    this.modalForm = {};//重置
    this.modalForm.companyUserModelList = []; //重置
    if (!this.selectData1[0]) {
      this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.carriageOfSelectedValue = [];
    this.listOfSelectedValue = [];
    this.getbiddingadata();//查询货盘信息
    /*this.getBidderCompany();//查询承运人
    this.getDriver();//查询司机*/

    this.modalTitle = `评定竞价  > 重新竞价`;
    // this.modalRef = this.nm.create({
    //   nzTitle: this.recordTitle,
    //   nzContent: this.recordContent,
    //   nzWrapClassName: 'recordBox',
    //   nzFooter: this.recordFooter,
    //   nzWidth: '55%'
    // });
  }

  /**
   * 查询承运人
   * @param name
   */
  getBidderCompany() {
    this.bidderCompanyList = [];
    let params: any = {};
    this.http.post(urls.getBidderCompanyData, {bidderCompanyName: ''}).then((res: any) => {
      if (res.success) {
        this.bidderCompanyList = res.data.data || [];
      }
    });
  }

  /**
   * 查询司机
   * @param name
   */
  getDriver() {
    this.driverList = [];
    let params: any = {};
    this.http.post(urls.getDriver, {name: ''}).then((res: any) => {
      if (res.success) {
        this.driverList = res.data.data || [];
      }
    });
  }

  delete() {
    if (this.selectData1.length == 0) {
      this.nzMess.error('请至少选中一条预招标单数据撤销');
      return;
    }

    this.modalService.confirm({
      nzTitle: '<i>是否确定撤回选中竞价单信息?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.deleteList(),
    });
  }

  deleteList() {
  }

  selectChange(data: any) {
    //console.log(data)
    if (!data) {
      this.bidPriceType = undefined;
    }
  }

  changeDriver(data: any) {
    //console.log(data)
    if (!data) {
      this.driverType = undefined;
    }
  }

}
