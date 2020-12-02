import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {Utils} from "../../../../common/util/utils";
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-stock-bulk-inventory-add',
  templateUrl: './stock-bulk-inventory-add.component.html',
  styleUrls: ['./stock-bulk-inventory-add.component.css']
})
export class StockBulkInventoryAddComponent implements OnInit {

  validateForm: FormGroup;

  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
  totalWeight: number = 0;
  totalPackageNum: number = 0;
  totalBranchNum: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 1;
  pageSize1: Number = 30;
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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private http: HttpUtilService,
              private nz: NzNotificationService, private routerInfo: ActivatedRoute, private nm: NzModalService) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    let nowDate = new Date();
    this.validateForm = this.fb.group({
      inventoryNo: ['', []],
      inventoryTime: [nowDate, [Validators.required]],
      remark: ['', []]
    });

    this.btnStatus = JSON.parse(sessionStorage.getItem("btnStatus")); //当前的按钮状态新增、修改
    let status;
    this.route.queryParams.subscribe(x => {
      status = x.status;

    });
    if (status == 'update') { //获取该倒运单号的物资明细
      this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
      this.dataSet1 = [...this.detailList];
    }
    //从session中带入顶部维护信息
    let topInfo = JSON.parse(sessionStorage.getItem("stockBulkInventoryTopInfo") || "{}");
    this.validateForm.patchValue(topInfo);

    //从session中带入导入的库存信息到列表中
    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || []
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
    });
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
      if (!this.dataSet1[i].inventoryLocationId) {
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请选择新储位，且不支持手动填写！'
        })
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

    let url = this.btnStatus.status == 'Add' ? stockUrl.insertShStockInventory : stockUrl.updateShStockInventory;
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
          this.router.navigate(['/system/stock/stockBulkInventory']);
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
      //sessionStorage存储顶部维护信息
      let obj: any = {};
      obj = Utils.deepCopy(this.validateForm.value);
      obj.inventoryTime = obj.inventoryTime && obj.inventoryTime instanceof Date ? Utils.dateFormat(obj.inventoryTime, 'yyyy-MM-dd HH:mm:ss') : obj.inventoryTime || '';
      sessionStorage.setItem("stockBulkInventoryTopInfo", JSON.stringify(obj));
      sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
      this.router.navigate(['/system/stock/stockBulkAddDetail'], {queryParams: {from: 'stock_bulk_inventory'}});
    }

    if (data.buttonId === 'save') {
      this.btnSave();
    }

    if (data.buttonId === 'cancel') {
      this.router.navigate(['/system/stock/stockBulkInventory']);
    }

  }

}
