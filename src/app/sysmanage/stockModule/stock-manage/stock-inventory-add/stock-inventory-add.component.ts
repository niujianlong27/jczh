import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {Utils} from "../../../../common/util/utils";
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';

/**
 * Title: stock-inventory-add.component.ts
 * Description: 盘库新增页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-inventory-add',
  templateUrl: './stock-inventory-add.component.html',
  styleUrls: ['./stock-inventory-add.component.css']
})
export class StockInventoryAddComponent implements OnInit {
  validateForm: FormGroup;
  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
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
  private rowid: string;
  inventoryNo: any;
  inventoryTime: any;
  detailList: any = [];
  btnStatus: any;
  popTableData: any = [];
  btnDisable: any = {};

  constructor(private fb: FormBuilder, private router: Router, private http: HttpUtilService,
              private nz: NzNotificationService, private routerInfo: ActivatedRoute, private nm: NzModalService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    let nowDate= new Date();
    this.validateForm = this.fb.group({
      inventoryNo: ['', []],
      inventoryTime: [nowDate, [Validators.required]],
      remark: ['', []]
    });

    //从session中带入顶部维护信息
    let topInfo = JSON.parse(sessionStorage.getItem("stockInventoryTopInfo") || "{}");
    this.btnStatus = topInfo.status;
    this.validateForm.patchValue(topInfo);

    if (topInfo) {
      this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
      this.dataSet1 = [...this.detailList];

      console.log(this.dataSet1, JSON.parse(sessionStorage.getItem('detailList')));
      // this.getList2({ page: 1, length: this.pageSize1,transferId:topInfo.transferNo });
    }


    //从session中带入导入的库存信息到列表中
    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || [];
    this.dataSet1 = [...this.dataSet1, ..._dataSet];
    // this.dataSet1.forEach( item => {
    //   item.newConsigneeCode2 = this.customerId1;
    //   item.newConsigneeName2 = this.customerName1;
    //   item.newConsigneeAaddress2 = topInfo.newConsigneeAddress2 || '';
    //   item.newDestination = topInfo.newDestination || '';
    // });
    this.dataSet1.forEach((item) => {
      this.popTableData.push(
        {
          inventoryLocation: {
            name: item.inventoryLocation,
            value: item.inventoryLocation ? true : false
          }
        }
      )
      item.inventoryWeight = item.weight;
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
  inpEmitDetail(data: any): void {
    if (data.eName === 'inventoryLocation') {
      this.dataSet1[data.index].inventoryLocation = data.inpName;
      this.dataSet1[data.index].inventoryLocationId = data.inpValue ? true : false;

    }
  }

  /**
   * 表头
   * @param data
   */
  getUserHeader(data: any): void {
    this.userHeader = data;
  }

  /***
   * 保存
   */
  btnSave(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    if (this.dataSet1.length < 1) {
      this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请导入明细后操作'
      })
      return;
    }

    for (let i = 0; i < this.dataSet1.length; i++) {

      console.log(this.dataSet1[i].inventoryLocationId);
      if (!this.dataSet1[i].inventoryLocationId) {
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请选择新储位，且不支持手动填写！'
        });
        return;
      }
      if (!this.dataSet1[i].inventoryWeight) {
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请填写盘库重量！'
        });
        return;
      }
    }


    let url = this.btnStatus == 'Add' ? stockUrl.insertStockInventory : stockUrl.updateStockInventoryAndDetail;

    let param = {stockInventoryDetailList: [], rowid: ''};
    param = this.validateForm.getRawValue();
    param.stockInventoryDetailList = Utils.deepCopy(this.dataSet1);
    param.stockInventoryDetailList.forEach(item => {
      if (!item.inventoryLocationId) {
        item.inventoryLocation = '';
      }
    })
    param.rowid = this.rowid;

    this.btnDisable = {'save': true};
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/stock/stockInventory']);
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
      // console.log(this.dataSet1);
      // sessionStorage.setItem("STOCKOUTADD",JSON.stringify(this.validateForm.value))
      sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
      this.router.navigate(['/system/stock/stockAddDetail'], {queryParams: {from: 'stock_inventory'}});

      //sessionStorage存储顶部维护信息
      let obj: any = {};
      obj = Utils.deepCopy(this.validateForm.value);
      obj.inventoryTime = obj.inventoryTime && obj.inventoryTime instanceof Date ? Utils.dateFormat(obj.inventoryTime, 'yyyy-MM-dd HH:mm:ss') : obj.inventoryTime || '';
      obj.status = this.btnStatus;
      sessionStorage.setItem("stockInventoryTopInfo", JSON.stringify(obj));
    }

    if (data.buttonId === 'save') {
      this.btnSave();
    }

    if (data.buttonId === 'cancel') {
      this.router.navigate(['/system/stock/stockInventory']);
    }

  }


}
