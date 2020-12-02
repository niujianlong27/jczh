import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '../../../../common/util/utils';
import {UserinfoService} from "../../../../common/services/userinfo-service.service";
import {Utils as SeaUtils} from '../../../sea/common/utils';

@Component({
  selector: 'app-bulkcargo-out-add',
  templateUrl: './bulkcargo-out-add.component.html',
  styleUrls: ['./bulkcargo-out-add.component.css']
})
export class BulkcargoOutAddComponent implements OnInit {
  validateForm: FormGroup;
  customerName: string; //客户名称
  customerCode: string;//客户id
  operTeam: string;
  operTeamCode: string;
  shipNo: string;
  boatBatchNum: string;
  wsName: string;
  wsArea: string;
  dataFlag: boolean = false;      //false为‘添加’，true为‘修改’功能
  formId: any = 'form_shstock_out_add';
  btnStatus: any;
  inpValidate: any;
  boatinpValidate: any;
  wsShowExplainFlag: boolean = false;
  teamInpValidate: any;
  wsInpValidate: any;
  showExplainFlag: boolean = false;
  teamShowExplainFlag: boolean = false;
  boatShowExplainFlag: boolean = false;

  totalWeight: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number = 0;
  pageSize1: number = 30;
  selectedList1: any = [];
  userHeader: any;
  deleteList: Array<any> = [];
  private rowid: string;
  outWsNo: any;
  outWsTime: any;
  searchList: Array<any> = []; //查询条件缓存
  lab: number = 3; //表单lable布局
  inp: number = 5; //表单input布局
  detailList: any = [];
  popTableData: any = [];

  btnDisable: any = {};
  tplModal: NzModalRef;
  state: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private appInfo: UserinfoService, private router: Router, private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService) {
  }

  /**
   * 初始化方法
   */
  ngOnInit() {
    let nowDate = new Date();
    let loginName = this.appInfo.APPINFO.USER.loginName;
    this.route.queryParams.subscribe(x => {
      this.state = x.state;
    });
    if (this.state == 'Record') {
      this.lab = 2;
      this.inp = 4;
      this.formId = 'form_shstock_out_add_record';
      this.listSearch({page: 1, length: this.pageSize1});
    }
    this.validateForm = this.state == 'Record' ? this.fb.group({
      customerCode: ['', [Validators.required]],
      customerName: ['', []],
      outWsNo: ['', []],
      boatBatchNum: ['', []],
      operUser: ['', [Validators.required]],
      orderNo: ['', []],
      operTime: [nowDate, [Validators.required]],
      outWsTime: [nowDate, [Validators.required]],
      wsName: ['', []],
      // productName: ['', []],
      // weight: ['', []],
      // spec: ['', []],
      wsArea: ['', []],
      // vehicleNo: ['', []],
      shipNo: ['', []],
      tallyman: ['', []],
      remark: ['', []],
      totalWeight: [null, []],
      totalPackageNum: [null, []]
    }): this.fb.group({
      customerCode: ['', [Validators.required]],
      customerName: ['', []],
      outWsNo: ['', []],
      boatBatchNum: ['', []],
      operUser: ['', [Validators.required]],
      orderNo: ['', []],
      operTime: [nowDate, [Validators.required]],
      outWsTime: [nowDate, [Validators.required]],
      wsName: ['', []],
      productName: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      spec: ['', [Validators.required]],
      wsArea: ['', []],
      vehicleNo: ['', []],
      shipNo: ['', []],
      tallyman: ['', []],
      remark: ['', []],
      totalWeight: [null, []],
      totalPackageNum: [null, []]
    });
    this.validateForm.get('operUser').setValue(loginName);

    this.btnStatus = JSON.parse(sessionStorage.getItem("btnStatus")); //当前的按钮状态新增、修改
    let status;
    this.route.queryParams.subscribe(x => {
      status = x.status;
    });
    let topInfo = JSON.parse(sessionStorage.getItem("stockBulkOutTopInfo") || "{}"); //获取顶部的输入信息
    if (status == 'update') { //获取该出库单号的物资明细
      this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
      this.dataSet1 = [...this.detailList];
    }
    this.rowid = topInfo.rowid;

    this.validateForm.patchValue(topInfo);
    this.customerName = topInfo.customerName || '';
    this.customerCode = topInfo.customerCode || topInfo.customerId || '';
    this.boatBatchNum = topInfo.boatBatchNum || '';
    this.shipNo = topInfo.shipNo || '';
    this.wsArea = topInfo.wsArea || '';
    this.wsName = topInfo.wsName || '';
    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || []; //从库存里导入的明细
    this.dataSet1 = [...this.dataSet1, ..._dataSet];  //从session中带入导入的库存信息到列表中
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  getList1(data: any): void {
    data['inOrOut'] = 'GBLX20';
    data['status'] = 'GBSY00';
    let url = stockUrl.getPageByOut;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    let url = stockUrl.selectStockBulkInDetailOut;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total || 0;

        this.dataSet1.forEach((item) => {

          this.popTableData.push(
            {
              wsLocation: {
                name: item.wsLocation,
                value: ''
              },
              consigneeName: {
                name: item.consigneeName,
                value: item.consigneeCode
              }
            }
          )
        })
      }
    })

  }

  /**
   * 删除列表明细
   * @param data
   * @param i
   */
  delete(data: any, i: number) {
    // this.dataSet1.splice(i, 1);
    // this.dataSet1 = [...this.dataSet1];
    // this.selectedList1 = [...this.dataSet1];
    // this.theorySheetNumber();
    // this.theoryWeightNumber();
  }


  /**
   * 数据弹框组件内容发生改变时触发的方法
   * @param data
   */
  inpEmit(data: any) {

    this.inpValidate = data.inpValidate;
    this.validateForm.get('customerCode').setValue(data.inpValue);
    this.validateForm.get('customerName').setValue(data.inpName);
  }


  // //数据弹框组件内容发生改变时触发的方法
  // teamInpEmit(data: any) {
  //   this.teamShowExplainFlag = false;
  //   this.teamInpValidate = data.inpValidate;
  //   this.validateForm.get('operTeam').setValue(data.inpName);
  //   this.validateForm.get('operTeamCode').setValue(data.inpValue);
  //
  // }

  //数据弹框组件内容发生改变时触发的方法
  boatinpEmit(data: any) {
    this.boatShowExplainFlag = false;
    this.boatinpValidate = data.inpValidate;
    this.validateForm.get('shipNo').setValue(data.inpValue);
    this.validateForm.get('boatBatchNum').setValue(data.inpName);
    this.searchData(this.searchList, data.inpValue)
  }

  wsinpEmit(data: any) {
    this.wsShowExplainFlag = false;
    this.wsInpValidate = data.inpValidate;
    this.validateForm.get('wsArea').setValue(data.inpValue);
    this.validateForm.get('wsName').setValue(data.inpName);
  }

  getUserHeader(data: any): void {
    this.userHeader = data;
  }

  /**
   * 新增明细
   * @param data
   */
  btnAdd(data: any): void {
    //sessionStorage存储顶部维护信息
    // let obj: any = {};
    // obj = Utils.deepCopy(this.validateForm.value);
    // obj.status = this.btnStatus;
    // obj.rowid = this.rowid;
    // obj.outWsTime = obj.outWsTime && obj.outWsTime instanceof Date ? Utils.dateFormat(obj.outWsTime, 'yyyy-MM-dd HH:mm:ss') : obj.outWsTime || '';
    // sessionStorage.setItem("stockBulkOutTopInfo", JSON.stringify(obj));
    // sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
    // this.router.navigate(['/system/shStock/shstockAddDetail'], {queryParams: {from: 'stockOut'}});
  }


  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId === 'Add') {
      // this.btnAdd(data);
    }
    if (data.buttonId === 'save') {

      this.btnSave(data);
    }
    if (data.buttonId === 'cancel') {
      this.router.navigate(['/system/shStock/bulkcargoOut']);
    }
  }


  /**
   * 保存
   * @param data
   */
  btnSave(data: any): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.inpValidate != 'VALID') {
      this.showExplainFlag = true;
    }
    if (this.wsInpValidate != 'VALID') {
      this.wsShowExplainFlag = true;
    }
    if (this.boatinpValidate != 'VALID') {
      this.boatShowExplainFlag = true;
    }
    if (this.boatinpValidate != 'VALID' || this.inpValidate != 'VALID' || this.wsInpValidate != 'VALID') {
      return;
    }
    if (this.state == 'record') {
      if (this.selectedList1.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请添加明细后操作！'
        });
        this.destroyTplModal();
        return;
      }
      for (let i = 0; i < this.dataSet1.length; i++) {
        if (!this.dataSet1[i].productName) {
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '品名不能为空！'
          });
          this.destroyTplModal();
          return;
        }
      }
    }

    if (this.validateForm.status == 'INVALID') {
      return
    }
    let url = this.btnStatus.status == 'Add' ? stockUrl.insertStockBulkOut : stockUrl.updateStockBulkOut;
    let param: any;
    if (this.btnStatus.status == 'Add' && this.state == 'Record') {
      let obj = this.validateForm.getRawValue();
      obj.outWsTime = SeaUtils.format(obj.outWsTime, 's');
      obj.operTime = SeaUtils.format(obj.operTime, 's');
      url = stockUrl.insertStockBulkOutList;
      param = {shStockOuts: '', rowid: ''};
      this.selectedList1.forEach(item => {
        item['isBulkCargo'] = 'ISSH10';
        item['weight'] = item.outWeight;
        item['wsName'] = obj.wsName;
        item['wsArea'] = obj.wsArea;
      });
      let arr = [];
      obj.totalWeight = this.selectedList1.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
      arr = this.selectedList1.map(item => {
        return {shStockOutDetails: [item], ...obj, vehicleNo: item.vehicleNo, endInspectionDate: item.endInspectionDate}
      });
      param.shStockOuts = arr;
    } else {
      param = this.validateForm.getRawValue();
      param.shStockOutDetails = [{}];
      param.rowid = this.rowid;
      param.totalWeight = 0;
      param.totalPackageNum = 0;
      param.shStockOutDetails.forEach(item => {
        item['isBulkCargo'] = 'ISSH10';
        item.wsName = param.wsName;
        item.wsArea = param.wsArea;
        item.orderNo = param.orderNo;
        item.productName = param.productName;
        item.spec = param.spec;
        item.weight = param.weight;
        item.vehicleNo = param.vehicleNo
      });
      param.totalWeight = this.selectedList1.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
      param.totalPackageNum = this.selectedList1.map(item => item.packageNum).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
      param.outWsTime = SeaUtils.format(param.outWsTime, 's');
      param.operTime = SeaUtils.format(param.operTime, 's');
    }
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/shStock/bulkcargoOut'])
        }
      }
    );
  }

  searchData(data: any, value?: any) {
    this.searchList = data;
    if (this.state == 'Record' && value) {
      data.forEach(item => {
        if (item.parameter == 'supplyUnit') {
          item.query = '包含';
          item.value1 = value
        }
      })

    }
  }

  select(data: any) {
    this.selectedList1 = data;
  }


  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
  };

  /**
   * 计算理论重量
   */
  theoryWeightNumber() {
    var totalWeight = 0;
    for (let i = 0; i < this.dataSet1.length; i++) {
      totalWeight += Number(this.dataSet1[i].weight)
    }
    this.validateForm.get("totalWeight").setValue(totalWeight);
  }

  /**
   * 计算理论件数
   */
  theorySheetNumber() {
    let totalPackageNum = 0;
    for (let i = 0; i < this.dataSet1.length; i++) {
      totalPackageNum += Number(this.dataSet1[i].packageNum)
    }
    this.validateForm.get("totalPackageNum").setValue(totalPackageNum);
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
