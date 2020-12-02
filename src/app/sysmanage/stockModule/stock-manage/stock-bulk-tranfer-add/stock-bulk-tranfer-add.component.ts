import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {Utils} from "../../../../common/util/utils";
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-stock-bulk-tranfer-add',
  templateUrl: './stock-bulk-tranfer-add.component.html',
  styleUrls: ['./stock-bulk-tranfer-add.component.css']
})
export class StockBulkTranferAddComponent implements OnInit {

  validateForm: FormGroup;
  customerName: any;//原收货单位名称
  customerId: any;//原收货单位id
  customerName1: any;//收货单位名称
  customerId1: any;//收货单位id
  inpData: any = {};
  customerNameData: any = {};  //原收货单位
  customerNameData1: any = {}; //收货单位
  totalWeight: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number;
  pageSize1: number = 30;
  detailList: any = [];
  private rowid: string;
  btnStatus: any;
  showExplainFlag1: boolean = false;
  showExplainFlag2: boolean = false;
  inpValidate1: any;
  inpValidate2: any;
  popData: any = {
    wsLocation: {}
  };
  btnDisable: any = {};

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private http: HttpUtilService, private nz: NzNotificationService,
              private nm: NzModalService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    let nowDate = new Date();
    this.validateForm = this.fb.group({
      transferNo: ['', []],
      transferTime: [nowDate, [Validators.required]],
      remark: ['', []],
      newConsigneeAddress2: ['', [Validators.required]],
      newDestination: ['', [Validators.required]],

    });

    this.btnStatus = JSON.parse(sessionStorage.getItem("btnStatus")); //当前的按钮状态新增、修改
    //从session中带入顶部维护信息
    let topInfo = JSON.parse(sessionStorage.getItem("stockBulkTransferTopInfo") || "{}");
    this.validateForm.patchValue(topInfo);
    this.customerName = topInfo.oldConsigneeName || topInfo.customerName || '';
    this.customerId = topInfo.oldConsigneeCode || topInfo.customerId || '';

    this.customerName1 = topInfo.newConsigneeName2 || topInfo.customerName1 || '';
    this.customerId1 = topInfo.newConsigneeCode2 || topInfo.customerId1 || '';

    this.customerNameData = {
      inpName: this.customerName,
      inpValue: this.customerId
    };
    this.customerNameData1 = {
      inpName: this.customerName1,
      inpValue: this.customerId1
    };
    let status;
    this.route.queryParams.subscribe(x => {
      status = x.status;

    });
    if (status == 'update') { //修改时获取该倒运单号的物资明细
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
  }

  delete(data: any, i: number) {   //删除
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

  btnClick(data: any): void {   //按钮点击

    switch (data.buttonId) {
      case 'Add':
        if (!this.customerNameData.inpValue || this.customerNameData.inpValue == "") {
          this.nm.info({
            nzTitle: '提示信息',
            nzContent: '请选择原收货单位后操作！'
          })
          return;
        }
        //sessionStorage存储顶部维护信息
        this.validateForm.value.rowid = this.rowid;
        let obj: any = {};
        obj = Utils.deepCopy(this.validateForm.value);
        obj.customerName = this.customerNameData.inpName || '';
        obj.customerId = this.customerNameData.inpValue || '';
        obj.customerName1 = this.customerNameData1.inpName || '';
        obj.customerId1 = this.customerNameData1.inpValue || '';
        obj.transferTime = obj.transferTime && obj.transferTime instanceof Date ? Utils.dateFormat(obj.transferTime, 'yyyy-MM-dd HH:mm:ss') : obj.transferTime || '';

        sessionStorage.setItem("stockBulkTransferTopInfo", JSON.stringify(obj));
        sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
        this.router.navigate(['/system/stock/stockBulkAddDetail'], {queryParams: {from: 'stock_bulk_transfer'}});
        break;
      case 'Cancel':
        this.router.navigate(['/system/stock/stockBulkTransfer']);
        break;
      case 'Save':
        this.btnSave();
        break;
      default:
        break;
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

    if (this.inpValidate2 != 'VALID') {
      this.showExplainFlag2 = true;
    }

    if (this.validateForm.status == 'INVALID' || this.inpValidate1 != 'VALID' || this.inpValidate2 != 'VALID') {
      return;
    }

    if (this.dataSet1.length < 1) {
      this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请导入明细后操作！'
      });
      return;
    }

    let url = this.btnStatus.status == 'Add' ? stockUrl.insertShStockTransfer : stockUrl.updateShReshipment;
    let param: any = {};
    param = this.validateForm.getRawValue();
    param.stockTransferDetailList = this.dataSet1;
    param['stockTransferDetailList'].forEach(item => {
      item.oldConsigneeName = item.consigneeName;
      item.oldConsigneeCode = item.consigneeCode;
    });
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
          this.router.navigate(['/system/stock/stockBulkTransfer']);
        }
      }
    );
  }
}
