import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {Utils} from "../../../../common/util/utils";
import {NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from "../../../../common/services/userinfo-service.service";

/**
 * Title: stock-out-add.component.ts
 * Description: 出库新增页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-out-add',
  templateUrl: './stock-out-add.component.html',
  styleUrls: ['./stock-out-add.component.css']
})
export class StockOutAddComponent implements OnInit {
  validateForm: FormGroup;
  inpData: any = {};
  customerCode: string;
  totalWeight: number = 0;
  totalPackageNum: number = 0;
  totalBranchNum: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number ;
  pageSize1: number = 30;
  selectedList1: any = [];
  userHeader: any;
  stockInfoModels: Array<any> = [];
  insertList: Array<any> = [];
  updateList: Array<any> = [];
  deleteList: Array<any> = [];
  customerName: any;
  customerId: any;
  detailList: any = [];
  customerNameData: any = {};//客户名称
  btnStatus: any;
  showExplainFlag: boolean = false;
  private rowid: string;
  teamInpValidate: any;
  teamShowExplainFlag: boolean = false;
  operTeam:string;
  outWsNo: any;
  outWsTime: any;
  btnDisable: any = {};

  constructor(private fb: FormBuilder, private appInfo: UserinfoService, private router: Router, private http: HttpUtilService, private nz: NzNotificationService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    let nowDate= new Date();
    let loginName =  this.appInfo.APPINFO.USER.loginName;
    this.validateForm = this.fb.group({
      customerCode: ['', [Validators.required]],
      customerName: ['', []],
      outWsNo: ['', []],
      berth:['', []],
      driverId:['', []],
      vehicleNo:['', []],
      operUser: ['', [Validators.required]],
      operTeam: ['', [Validators.required]],
      operTime: [nowDate, [Validators.required]],
      outWsTime: [nowDate, [Validators.required]],
      travelno: ['', []],
      tallyman: ['', []],
      craneOper: ['', []],
      remark: ['', []]
    });
    this.validateForm.get('operUser').setValue(loginName);

    this.btnStatus = JSON.parse(sessionStorage.getItem("btnStatus")); //当前的按钮状态新增、修改
    if (this.btnStatus.status == 'Update') { //获取该单号的物资明细
      this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
      this.dataSet1 = [...this.detailList];
    }
    //从session中带入顶部维护信息
    let topInfo = JSON.parse(sessionStorage.getItem("stockOutTopInfo") || "{}");
    this.validateForm.patchValue(topInfo);
    this.customerName = topInfo.customerName || '';
    this.operTeam = topInfo.operTeam || '';
    this.customerId = topInfo.customerCode || topInfo.customerId || '';
    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || []; //从库存里导入的明细
    this.dataSet1 = [...this.dataSet1, ..._dataSet];  //从session中带入导入的库存信息到列表中

    let obj = {};
    let arr = [];
    this.dataSet1.map(item => {
      if (!item.packNo || item.packNo == '') {
        arr.push(item);
      } else {
        if (!obj[item.packNo]) {
          arr.push(item);
          obj[item.packNo] = true;
        }
      }
    });
    this.dataSet1 = arr;
  }

  /**
   * 删除
   * @param data
   * @param i
   */

  delete(data: any, i: number) {
    this.detailList.forEach((item, index) => {
      if (item.rowid == this.dataSet1[i].rowid) {
        this.detailList.splice(index, 1);
      }
    });
    this.dataSet1.splice(i, 1);
    sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));

    sessionStorage.setItem('detailList', JSON.stringify(this.detailList));

    this.dataSet1 = [...this.dataSet1];
  };

  /**
   * 数据弹窗内容变化
   * @param data
   */
  inpEmit(data: any) {
    this.inpData = data;
    this.validateForm.get('customerCode').setValue(data.inpValue);
    this.validateForm.get('customerName').setValue(data.inpName);
  }

  //数据弹框组件内容发生改变时触发的方法
  teamInpEmit(data: any) {
    this.teamShowExplainFlag = false;
    this.teamInpValidate = data.inpValidate;
    this.validateForm.get('operTeam').setValue(data.inpName);
  }

    /**
   * 数据弹窗内容变化
   * @param data
   */
  inpEmitDetail(data: any): void {
    if (data.eName === 'consigneeName') {
      this.dataSet1[data.index].consigneeName = data.inpName;
      this.dataSet1[data.index].consigneeCode = data.inpValue;
    }
  }

  /**
   * 表头
   * @param data
   */
  getUserHeader(data: any): void {
    this.userHeader = data;
  }

  /**
   * 保存
   */
  btnSave(): void {
    if (!this.validateForm.value.customerCode || this.validateForm.value.customerCode == "") {
      this.showExplainFlag = true;
    }
    if (this.teamInpValidate != 'VALID') {
      this.teamShowExplainFlag = true;
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    let url = this.btnStatus == 'Add' ? stockUrl.insertStockOut : stockUrl.updateStockOutAndDetail;
    let param: any = {stockOutDetailList: '', rowid: ''};
    param = this.validateForm.getRawValue();
    param.stockOutDetailList = this.dataSet1;
    param.rowid = this.rowid;
    param.outWsTime = param.outWsTime && Utils.dateFormat(new Date(param.outWsTime), 'yyyy-MM-dd HH:mm:ss');
    param.operTime = param.operTime && param.operTime instanceof Date ? Utils.dateFormat(param.operTime, 'yyyy-MM-dd HH:mm:ss') : param.operTime || '';

    this.btnDisable = {'Save': true};
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          // this.router.navigate(['/system/stock/stockOut']);
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/stock/stockOut']);
        }
      }
    );
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId === 'Add') {

      sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
      this.router.navigate(['/system/stock/stockAddDetail'], {queryParams: {from: 'stock_out'}});

      //sessionStorage存储顶部维护信息
      let obj: any = {};
      obj = Utils.deepCopy(this.validateForm.value);
      obj.status = this.btnStatus;
      obj.outWsTime = obj.outWsTime && obj.outWsTime instanceof Date ? Utils.dateFormat(obj.outWsTime, 'yyyy-MM-dd HH:mm:ss') : obj.outWsTime || '';

      sessionStorage.setItem("stockOutTopInfo", JSON.stringify(obj));

    }
    if (data.buttonId === 'save') {
      this.btnSave();
    }
    if (data.buttonId === 'cancel') {
      this.router.navigate(['/system/stock/stockOut']);
    }
  }

}

