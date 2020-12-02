import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from "../../../../common/util/utils";

/**
 * Title: stock-move-add.component.ts
 * Description: 移库新增页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-move-add',
  templateUrl: './stock-move-add.component.html',
  styleUrls: ['./stock-move-add.component.css']
})
export class StockMoveAddComponent implements OnInit {
  validateForm: FormGroup;

  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
  inpData: any = {};
  customerCode: string;
  totalWeight: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number ;
  pageSize1: number = 30;
  selectedList1: any = [];
  userHeader: any;
  deleteList: Array<any> = [];

  private rowid: string;
  btnStatus: any;

  moveWsNo: any;
  moveWsTime: any;

  popTableData: any = [];


  btnDisable: any = {};

  constructor(private fb: FormBuilder, private router: Router, private nm: NzModalService, private http: HttpUtilService,
              private nz: NzNotificationService, private routerInfo: ActivatedRoute, private ngZone: NgZone) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    let nowDate= new Date();
    this.validateForm = this.fb.group({
      moveWsNo: ['', []],
      moveWsTime: [nowDate, [Validators.required]],
      remark: ['', []]
    });

    //从session中带入顶部维护信息
    let topInfo = JSON.parse(sessionStorage.getItem("stockMoveTopInfo") || "{}");
    this.btnStatus = topInfo.status;

    this.validateForm.patchValue(topInfo);

    //从session中带入导入的库存信息到列表中
    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || []
    this.dataSet1 = [...this.dataSet1, ..._dataSet];

    this.dataSet1.forEach((item) => {
      this.popTableData.push(
        {
          newWsLocation: {
            name: item.newWsLocation,
            value: item.newWsLocationId
          }
        }
      )
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
    this.dataSet1.splice(i, 1);
    sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));

    this.dataSet1 = [...this.dataSet1];
  }

  /**
   *
   * @param data
   */
  inpEmitDetail(data: any): void {
    if (data.eName === 'newWsLocation') {
      console.log(data.selData);
      this.dataSet1[data.index].newWsLocation = data.inpName;
      this.dataSet1[data.index].newWsLocationId = data.inpValue ? true : false;

    }
  };

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
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    let url = stockUrl.insertStockMove;
    let param: any = {stockMoveDetailList: '', rowid: ''};

    param = this.validateForm.getRawValue();
    console.log(param);
    param.stockMoveDetailList = this.dataSet1;
    param.rowid = this.rowid;
    param.moveWsTime = param.moveWsTime && param.moveWsTime instanceof Date ? Utils.dateFormat(param.moveWsTime, 'yyyy-MM-dd HH:mm:ss') : param.moveWsTime || '';

    if (this.validateForm.status == 'INVALID') {
      return;
    }

    if (this.dataSet1.length < 1) {
      this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请导入明细后操作'
      });
      return;
    }
    for (let i = 0; i < this.dataSet1.length; i++) {
      if (!this.dataSet1[i].newWsLocationId) {
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请选择新储位，且不支持手动填写！'
        });
        return;
      }
    }

    this.btnDisable = {'save': true};
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          // this.router.navigate(['/system/stock/stockIn']);
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          // setTimeout(() => {
          //   this.router.navigate(['/system/stock/stockMove']);
          // } ,1500)
          this.router.navigate(['/system/stock/stockMove']);
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
      this.validateForm.value.rowid = this.rowid;
      let obj = Utils.deepCopy(this.validateForm.value);
      obj.moveWsTime = obj.moveWsTime && obj.moveWsTime instanceof Date ? Utils.dateFormat(obj.moveWsTime, 'yyyy-MM-dd HH:mm:ss') : obj.moveWsTime || '';

      sessionStorage.setItem("stockMoveTopInfo", JSON.stringify(obj));
      sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
      this.router.navigate(['/system/stock/stockAddDetail'], {queryParams: {from: 'stock_move'}});
    }
    if (data.buttonId === 'save') {
      this.btnSave();
    }
    if (data.buttonId === 'cancel') {
      this.router.navigate(['/system/stock/stockMove']);
    }
  }

}
