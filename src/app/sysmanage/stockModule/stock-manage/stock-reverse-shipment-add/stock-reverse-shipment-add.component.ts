import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from "../../../../common/util/utils";

@Component({
  selector: 'app-stock-reverse-shipment-add',
  templateUrl: './stock-reverse-shipment-add.component.html',
  styleUrls: ['./stock-reverse-shipment-add.component.css']
})
export class StockReverseShipmentAddComponent implements OnInit {

  validateForm: FormGroup;
  inpData: any = {};
  customerCode: string;
  totalWeight: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];  //列表数据
  totalPages1: number ;
  pageSize1: number = 30;
  selectedList1: any = [];
  userHeader: any;
  deleteList: Array<any> = [];
  private rowid: string;
  btnStatus: any;
  btnDisable: any = {};
  detailList: any = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private nm: NzModalService, private http: HttpUtilService,
              private nz: NzNotificationService, private routerInfo: ActivatedRoute, private ngZone: NgZone) {
  }


  ngOnInit() {  //初始化
    let nowDate= new Date();
    this.validateForm = this.fb.group({
      reshipmentNo: [null, []],
      reshipmentTime: [nowDate, [Validators.required]],
      remark: [null, []],
      berthageName: [null, []],
      travelno: [null, []],
    });
    this.btnStatus = JSON.parse(sessionStorage.getItem("btnStatus")); //当前的按钮状态新增、修改
    if (this.btnStatus.status == 'Update') { //获取该倒运单号的物资明细
      this.detailList = JSON.parse(sessionStorage.getItem('detailList')) || [];
      this.dataSet1 = [...this.detailList];
    }
    let topInfo = JSON.parse(sessionStorage.getItem("stockReverseTopInfo") || "{}"); //获取顶部的输入信息
    this.validateForm.patchValue(topInfo);

    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || []; //从库存里导入的明细
    this.dataSet1 = [...this.dataSet1, ..._dataSet];  //从session中带入导入的库存信息到列表中
    let obj = {};
    let arr = [];

    this.dataSet1.map(item => {  //通过捆包号去重
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
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    switch (data.buttonId) {
      case 'Add':
        this.validateForm.value.rowid = this.rowid;
        let obj = Utils.deepCopy(this.validateForm.value);
        obj.reshipmentTime = obj.reshipmentTime && obj.reshipmentTime instanceof Date ? Utils.dateFormat(obj.reshipmentTime, 'yyyy-MM-dd HH:mm:ss') : obj.reshipmentTime || '';
        sessionStorage.setItem("stockReverseTopInfo", JSON.stringify(obj)); //对当前输入框内容进行缓存
        sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1})); //当前明细缓存

        this.router.navigate(['/system/stock/stockAddDetail'], {queryParams: {from: 'stock_reverse'}});
        break;
      case 'cancel':
        this.router.navigate(['/system/stock/stockReverseShipment']);
        break;
      case 'save':
        this.btnSave();
        break;
      default:
        break;
    }
  }

  /**
   * 删除
   * @param data
   * @param i
   */
  delete(data: any, i: number) {
    this.dataSet1.splice(i, 1);
    this.detailList.forEach((item, index) => {  //删除原有的明细
      if (item.rowid == this.dataSet1[i].rowid) {
        this.detailList.splice(index, 1);
      }
    });
    sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
    sessionStorage.setItem('detailList', JSON.stringify(this.detailList));
    this.dataSet1 = [...this.dataSet1];
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
      });
      return;
    }
    for (let i = 0; i < this.dataSet1.length; i++) {
      if (!this.dataSet1[i].shipId && this.dataSet1[i].travelno && this.dataSet1[i].berthageName) {
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '船号、车牌号、泊位不能为空！'
        });
        return;
      }

      let url = this.btnStatus.status == 'Add' ? stockUrl.insertReshipment : stockUrl.updateReshipment;
      let msg = this.btnStatus.status == 'Add' ? '新增成功' : '修改成功';
      let param: any = {reshipmentDetailList: [], rowid: ''};
      param = this.validateForm.getRawValue();
      param.reshipmentDetailList = this.dataSet1;
      param.rowid = this.rowid;
      param.reshipmentTime = param.reshipmentTime && param.reshipmentTime instanceof Date ? Utils.dateFormat(param.reshipmentTime, 'yyyy-MM-dd HH:mm:ss') : param.reshipmentTime || '';
      this.btnDisable = {'save': true};
      this.http.post(url, param).then((res: any) => {
          this.btnDisable = {};
          if (res.success) {
            if (this.btnStatus.status == 'Update') {
              msg = res.data.data;
            }
            this.nz.create('success', '提示信息', msg, {nzDuration: 3000});
            this.router.navigate(['/system/stock/stockReverseShipment']);
          }
        }
      );

    }

  }
}
