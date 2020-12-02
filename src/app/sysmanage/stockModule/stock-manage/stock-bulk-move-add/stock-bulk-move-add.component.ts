import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from "../../../../common/util/utils";

@Component({
  selector: 'app-stock-bulk-move-add',
  templateUrl: './stock-bulk-move-add.component.html',
  styleUrls: ['./stock-bulk-move-add.component.css']
})
export class StockBulkMoveAddComponent implements OnInit {

  validateForm: FormGroup;
  inpData: any = {};
  customerCode: string;
  totalWeight: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];  //列表数据
  totalPages1: Number = 1;
  pageSize1: Number = 30;
  private rowid: string;
  btnStatus: any;
  popTableData: any = [];
  detailList:any = [];
  btnDisable: any = {};
  operTeam:string;
  operTeamCode:string;
  teamShowExplainFlag:boolean =false;
  teamInpValidate:string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private nm: NzModalService, private http: HttpUtilService,
              private nz: NzNotificationService, private routerInfo: ActivatedRoute, private ngZone: NgZone) {
  }

  /**
   * 初始化
   */
  ngOnInit() {
    let nowDate = new Date();
    this.validateForm = this.fb.group({
      moveWsNo: [null, []],
      moveWsTime: [nowDate, [Validators.required]],
      operUser: ['', [Validators.required]],
      operTeamCode:['', [Validators.required]],
      operTeam: ['', [Validators.required]],
      operTime: [nowDate, [Validators.required]],
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
    let topInfo = JSON.parse(sessionStorage.getItem("stockBulkMoveTopInfo") || "{}");
    this.validateForm.patchValue(topInfo);

    //从session中带入导入的库存信息到列表中
    let _dataSet = JSON.parse(sessionStorage.getItem('stockOut') || "{}").stockOutDetailList || []
    this.dataSet1 = [...this.dataSet1, ..._dataSet];
    this.operTeam = topInfo.operTeam || '';
    this.operTeamCode = topInfo.operTeamCode || '';

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

  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    switch (data.buttonId) {
      case 'Add':
        let obj = {};
        obj = Utils.deepCopy(this.validateForm.value);
        obj['moveWsTime'] = obj['moveWsTime'] && obj['moveWsTime'] instanceof Date ? Utils.dateFormat(obj['moveWsTime'], 'yyyy-MM-dd HH:mm:ss') : obj['moveWsTime'] || '';
        obj['operTime'] = obj['operTime'] && obj['operTime'] instanceof Date ? Utils.dateFormat(obj['operTime'], 'yyyy-MM-dd HH:mm:ss') : obj['operTime'] || '';
        sessionStorage.setItem("stockBulkMoveTopInfo", JSON.stringify(obj));
        sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
        this.router.navigate(['/system/stock/stockBulkAddDetail'], {queryParams: {from: 'stock_bulk_move'}});
        break;
      case 'cancel':
        this.router.navigate(['/system/stock/stockBulkMove']);
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
    sessionStorage.setItem('stockOut', JSON.stringify({stockOutDetailList: this.dataSet1}));
    this.dataSet1 = [...this.dataSet1];
  }

  /**
   *
   * @param data
   */
  inpEmitDetail(data: any): void {
    if (data.eName === 'newWsLocation') {
      this.dataSet1[data.index].newWsLocation = data.inpName;
      this.dataSet1[data.index].newWsLocationId = data.inpValue ? true : false;
      this.dataSet1[data.index].newWsArea = data.selData[0].areaName;

    }
  };
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
    if (this.teamInpValidate != 'VALID') {
      this.teamShowExplainFlag = true;
    }
    if (this.validateForm.status == 'INVALID'|| this.teamInpValidate != 'VALID') {
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
    let url = this.btnStatus.status == 'Add' ? stockUrl.insertShStockMove : stockUrl.updateShStockMove;
    let param: any = {shStockMoveDetails: [], rowid: ''};
    param = this.validateForm.getRawValue();
    param.shStockMoveDetails = this.dataSet1;
    param.rowid = this.rowid;
    param.moveWsTime = param.moveWsTime && param.moveWsTime instanceof Date ? Utils.dateFormat(param.moveWsTime, 'yyyy-MM-dd HH:mm:ss') : param.moveWsTime || '';
    param.operTime = param.operTime && param.operTime instanceof Date ? Utils.dateFormat(param.operTime, 'yyyy-MM-dd HH:mm:ss') : param.operTime || '';

    this.btnDisable = {'save': true};
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/stock/stockBulkMove']);
        }
      }
    );

  }
  //数据弹框组件内容发生改变时触发的方法
  teamInpEmit(data: any) {
    this.teamShowExplainFlag = false;
    this.teamInpValidate = data.inpValidate;
    this.validateForm.get('operTeam').setValue(data.inpName);
    this.validateForm.get('operTeamCode').setValue(data.inpValue);
  }
}
