import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {Utils} from "../../../../common/util/utils";
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';

/**
 * Title: stock-transfer-add.component.ts
 * Description: 调港维护新增
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-transfer-add',
  templateUrl: './stock-transfer-add.component.html',
  styleUrls: ['./stock-transfer-add.component.css']
})
export class StockTransferAddComponent implements OnInit {
  validateForm: FormGroup;
  customerName: any;//原收货单位名称
  customerId: any;//原收货单位id
  customerName1: any;//收货单位名称
  customerId1: any;//收货单位id
  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
  inpData: any = {};
  customerNameData: any = {};  //原收货单位
  customerNameData1: any = {}; //收货单位
  totalWeight: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number ;
  pageSize1: number = 30;
  selectedList1: any = [];
  userHeader: any;
  detailList: any = [];
  private rowid: string;
  btnStatus: any;

  showExplainFlag1: boolean = false;
  inpValidate1: any;
  inpValidate2: any;
  transferNo: any;
  transferTime: any;

  popData: any = {
    wsLocation: {}
  };

  btnDisable: any = {};

  constructor(private fb: FormBuilder, private router: Router, private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    let nowDate= new Date();
    this.validateForm = this.fb.group({
      transferNo: ['', []],
      transferTime: [nowDate, [Validators.required]],
      remark: ['', []],
      newConsigneeAddress2: ['', []],
      newDestination: ['', []],

    });

    //从session中带入顶部维护信息
    let topInfo = JSON.parse(sessionStorage.getItem("stockTransferTopInfo") || "{}");
    this.btnStatus = topInfo.status;
    this.validateForm.patchValue(topInfo);
    this.customerName = topInfo.oldConsigneeName || topInfo.customerName || '';
    this.customerId = topInfo.oldConsigneeCode || topInfo.customerId || '';

    this.customerName1 = topInfo.newConsigneeName2 || topInfo.customerName1 || '';
    this.customerId1 = topInfo.newConsigneeCode2 || topInfo.customerId1 || '';

    this.customerNameData = {
      inpName: this.customerName,
      inpValue: this.customerId
    }

    this.customerNameData1 = {
      inpName: this.customerName1,
      inpValue: this.customerId1
    }


    if (topInfo) {
      this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
      this.dataSet1 = [...this.detailList];
    }

    //从session中带入导入的库存信息到列表中
    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || [];
    this.dataSet1 = [...this.dataSet1, ..._dataSet];
    this.dataSet1.forEach(item => {
      item.newConsigneeCode2 = this.customerId1;
      item.newConsigneeName2 = this.customerName1;
      item.newConsigneeAaddress2 = topInfo.newConsigneeAddress2 || '';
      item.newDestination = topInfo.newDestination || '';
      item.oldDestination = item.destination || '';
      item.oldConsigneeName = item.consigneeName || '';
      item.oldConsigneeAddress = item.consigneeAddress || '';

    });

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

  // getList2(data: any): void {
  //   let url = stockUrl.selectStockTransferDetail;
  //   this.listLoading1 = true;
  //   this.http.post(url, data).then((res: any) => {
  //     this.listLoading1 = false;
  //     if (res.success) {
  //       // this.dataSet1 = res.data.data && res.data.data.data || [];
  //       this.totalPages1 = res.data.data && res.data.data.total || 0;
  //       this.dataSet1 = [...res.data.data && res.data.data.data || [],...this.dataSet1];
  //       let obj = {};
  //       let arr = [];
  //       this.dataSet1.map(item => {
  //         if(!item.rowid || item.rowid == ''){
  //           arr.push(item);
  //         }else{
  //           if(!obj[item.rowid]){
  //             arr.push(item);
  //             obj[item.rowid] = true;
  //           }
  //         }
  //       });
  //       this.dataSet1 = arr;
  //     }
  //   })
  // }

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
  }

  /**
   * 数据弹窗内容变化
   * @param data
   */
  inpEmit(data: any) {
    //原收货单位
    this.inpValidate1 = data.inpValidate;
    this.customerNameData = data;
  }

  /**
   * 数据弹窗内容变化
   * @param data
   */
  inpEmit1(data: any) {
    //收货单位
    this.inpValidate2 = data.inpValidate;
    this.customerNameData1 = data;
    if (data.inpName) {
      this.dataSet1.forEach(item => {
        item.newConsigneeName2 = data.inpName;
      })
    }

  }

  /**
   * 数据弹窗内容变化
   * @param data
   */
  inpEmitDetail(data: any): void {
    if (data.eName === 'wsLocation') {
      this.dataSet1[data.index].wsLocation = data.inpName;
      this.dataSet1[data.index].wsLocationId = data.selData[0].rowid || '';
      this.dataSet1[data.index].wsArea = data.selData[0].areaName || '';
      this.dataSet1[data.index].wsName = data.selData[0].stockName || '';
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
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId === 'Add') {
      if (!this.customerNameData.inpValue || this.customerNameData.inpValue == "") {
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请选择原收货单位后操作！'
        })
        return;
      }
      sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
      this.router.navigate(['/system/stock/stockAddDetail'], {queryParams: {from: 'stock_transfer'}});

      //sessionStorage存储顶部维护信息
      let obj: any = {};
      obj = Utils.deepCopy(this.validateForm.value);
      obj.customerName = this.customerNameData.inpName || '';
      obj.customerId = this.customerNameData.inpValue || '';
      obj.customerName1 = this.customerNameData1.inpName || '';
      obj.customerId1 = this.customerNameData1.inpValue || '';
      obj.status = this.btnStatus;
      obj.transferTime = obj.transferTime && obj.transferTime instanceof Date ? Utils.dateFormat(obj.transferTime, 'yyyy-MM-dd HH:mm:ss') : obj.transferTime || '';
      sessionStorage.setItem("stockTransferTopInfo", JSON.stringify(obj));
    }
    if (data.buttonId === 'Save') {
      this.btnSave();
    }
    if (data.buttonId === 'Cancel') {
      this.router.navigate(['/system/stock/stockTransfer']);
    }
  }

  /**
   * 保存
   */
  btnSave(): void {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.inpValidate1 != 'VALID') {
      this.showExplainFlag1 = true;
    }

    if (this.validateForm.status == 'INVALID' || this.inpValidate1 != 'VALID' || this.inpValidate2 != 'VALID') {
      return;
    }

    if (this.dataSet1.length < 1) {
      this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请导入明细后操作！'
      })
      return;
    }

    let url = this.btnStatus == 'Add' ? stockUrl.insertStockTransfer : stockUrl.updateStockTransfer;
    let param: any = {};
    param = this.validateForm.getRawValue();
    param.stockTransferDetailList = this.dataSet1;
    param.stockTransferDetailList.forEach(item => {
      item.oldConsigneeName = item.consigneeName;
      item.oldConsigneeCode = item.consigneeCode;
    })
    param.rowid = this.rowid;
    param.transferTime = param.transferTime && param.transferTime instanceof Date ? Utils.dateFormat(param.transferTime, 'yyyy-MM-dd HH:mm:ss') : param.transferTime || '';
    param.oldConsigneeName = this.customerNameData.inpName || '';
    param.oldConsigneeCode = this.customerNameData.inpValue || '';
    param.newConsigneeName2 = this.customerNameData1.inpName || '';
    param.newConsigneeCode2 = this.customerNameData1.inpValue || '';

    this.btnDisable = {'Save': true};
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/stock/stockTransfer']);
        }
      }
    );
  }
  onBlur(type){
    this.validateForm.value.newDestination = this.validateForm.value.newDestination.trim();
    this.validateForm.value.newConsigneeAddress2 = this.validateForm.value.newConsigneeAddress2.trim();
    if (this.validateForm.value.newDestination && type == 1) {
      this.dataSet1.forEach(item => {
        item.newDestination = this.validateForm.value.newDestination
      })
    }
    if (this.validateForm.value.newConsigneeAddress2 && type == 2) {
      this.dataSet1.forEach(item => {
        item.newConsigneeAddress2 = this.validateForm.value.newConsigneeAddress2
      })
    }
  }
}

