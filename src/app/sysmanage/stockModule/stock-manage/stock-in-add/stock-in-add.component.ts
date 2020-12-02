import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '../../../../common/util/utils';
import {UserinfoService} from "../../../../common/services/userinfo-service.service";

/**
 * Title: stock-in-add.component.ts
 * Description: 入库新增页面
 * Created: pengzitong 2019/1/24
 * Modified:
 */
@Component({
  selector: 'app-stock-in-add',
  templateUrl: './stock-in-add.component.html',
  styleUrls: ['./stock-in-add.component.css']
})
export class StockInAddComponent implements OnInit {
  validateForm: FormGroup;
  customerName: string; //客户名称
  customerCode: string;//客户id
  operTeam:string;

  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能

  status: any;
  inpValidate: any;
  teamInpValidate:any;
  showExplainFlag: boolean = false;
  teamShowExplainFlag: boolean = false;
  totalWeight: number = 0;

  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number;
  pageSize1: number = 30;
  selectedList1: any = [];
  userHeader: any;
  deleteList: Array<any> = [];

  private rowid: string;

  // 代码错误，无法打包发布，修改代码
  inWsNo: any;
  inWsTime: any;

  popData: any = {
    wsLocation: {},
    consigneeName: {}
  }

  popTableData: any = [];

  btnDisable: any = {};
  tplModal: NzModalRef;
  nowDate:any;

  constructor(private fb: FormBuilder, private appInfo: UserinfoService, private router: Router, private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService) {
  }

  /**
   * 初始化方法
   */
  ngOnInit() {
    this.nowDate = new Date();
    let loginName = this.appInfo.APPINFO.USER.loginName;
    this.validateForm = this.fb.group({
      customerCode: ['', [Validators.required]],
      customerName: ['', []],
      inWsNo: ['', []],
      operUser: ['', [Validators.required]],
      operTeam: ['', [Validators.required]],
      operTime: [this.nowDate, [Validators.required]],
      inWsTime: [this.nowDate, [Validators.required]],
      travelno: ['', []],
      tallyman: ['', []],
      craneOper: ['', []],
      remark: ['', []]
    });
    let topInfo = JSON.parse(sessionStorage.getItem('stockIn') || '{}');
    this.status = topInfo.status;
    if (topInfo.status == 'Update') {
      this.popData.wsLocation.name = topInfo.stockInDetailList && topInfo.stockInDetailList[0] ? topInfo.stockInDetailList[0].wsLocation || '' : '';
      this.popData.consigneeName.name = topInfo.stockInDetailList && topInfo.stockInDetailList[0] ? topInfo.stockInDetailList[0].consigneeName || '' : '';
      this.validateForm.patchValue(topInfo);
      this.customerName = topInfo.customerName;
      this.customerCode = topInfo.customerCode;
      this.operTeam = topInfo.operTeam;
      this.getList({page: 1, length: this.pageSize1, inWsId: topInfo.inWsNo});
    }
    this.validateForm.get('operUser').setValue(loginName);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    let url = stockUrl.selectStockInDetail;
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
    this.dataSet1.splice(i, 1);
    this.dataSet1 = [...this.dataSet1];
  }


  /**
   * 数据弹框组件内容发生改变时触发的方法
   */
  inpEmit(data: any) {
    this.showExplainFlag = false;
    this.inpValidate = data.inpValidate;
    this.validateForm.get('customerCode').setValue(data.inpValue);
    this.validateForm.get('customerName').setValue(data.inpName);
  }

  teamInpEmit(data:any){
    this.teamShowExplainFlag = false;
    this.teamInpValidate = data.inpValidate;
    this.validateForm.get('operTeam').setValue(data.inpName);
  }

  /**
   * 数据弹框组件内容发生改变时触发的方法
   * @param data
   */
  inpEmitDetail(data: any): void {
    if (data.eName === 'consigneeName') {
      this.dataSet1[data.index].consigneeName = data.inpName;
      this.dataSet1[data.index].consigneeCode = data.inpValue;
    } else if (data.eName === 'wsLocation') {

      this.dataSet1[data.index].wsLocation = data.inpName;
      this.dataSet1[data.index].wsLocationId = data.selData[0] && data.selData[0].rowid || '';
      this.dataSet1[data.index].wsArea = data.selData[0] && data.selData[0].areaName || '';
      this.dataSet1[data.index].wsName = data.selData[0] && data.selData[0].stockName || '';
    }
  }


  getUserHeader(data: any): void {
    this.userHeader = data;
  }

  /**
   * 新增明细
   * @param data
   */
  btnAdd(data: any): void {
    this.dataSet1.unshift({});
    this.popTableData.unshift(
      {
        wsLocation: {
          name: '',
          value: ''
        },
        consigneeName: {
          name: '',
          value: ''
        }
      }
    );

    this.userHeader.map((item) => {
      this.dataSet1[0][item.colEname] = '';
    });
    this.dataSet1 = [...this.dataSet1];

    // this.dataSet1[0].EDIT = true;
    // this.addData.push(this.dataSet[0]);
  }


  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any): void {
    if (data.buttonId === 'Add') {
      this.btnAdd(data);
    }
    if (data.buttonId === 'save') {

      this.btnSave(data);
    }
    if (data.buttonId === 'cancel') {
      this.router.navigate(['/system/stock/stockIn']);
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
    if (this.teamInpValidate != 'VALID') {
      this.teamShowExplainFlag = true;
    }
    if (this.inpValidate != 'VALID') {
      this.showExplainFlag = true;
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    if (this.validateForm.status == 'INVALID' || this.inpValidate != 'VALID' || this.teamInpValidate != 'VALID') {
      return;
    }
    if (this.dataSet1.length < 1) {
      this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请添加明细后操作,品名不能为空'
      });
      return;
    }
    for (let i = 0; i < this.dataSet1.length; i++) {
      if (!this.dataSet1[i].productName) {
        this.nm.info({
          nzTitle: '提示信息',
          nzContent: '品名不能为空！'
        });
        return;
      }
    }

    let url = this.status == 'Add' ? stockUrl.insertStockIn : stockUrl.updateStockInAndDetail;
    let param: any = {stockInDetailList: '', rowid: ''};
    param = this.validateForm.getRawValue();
    param.stockInDetailList = this.dataSet1;
    param.rowid = this.rowid;
    param.inWsTime = param.inWsTime && param.inWsTime instanceof Date ? Utils.dateFormat(param.inWsTime, 'yyyy-MM-dd HH:mm:ss') : param.inWsTime || '';
    param.operTime = param.operTime && param.operTime instanceof Date ? Utils.dateFormat(param.operTime, 'yyyy-MM-dd HH:mm:ss') : param.operTime || '';
    this.btnDisable = {'save': true};
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/stock/stockIn'])
        }
      }
    );
  }


  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
  };
}
