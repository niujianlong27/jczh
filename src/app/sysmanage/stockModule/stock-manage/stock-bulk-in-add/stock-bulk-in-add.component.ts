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

@Component({
  selector: 'app-stock-bulk-in-add',
  templateUrl: './stock-bulk-in-add.component.html',
  styleUrls: ['./stock-bulk-in-add.component.css']
})
export class StockBulkInAddComponent implements OnInit {

  validateForm: FormGroup;
  customerName: string; //客户名称
  customerCode: string;//客户id
  operTeam: string; //班组名称
  operTeamCode: string;
  status: any;
  inpValidate: any;
  teamInpValidate: any;
  showExplainFlag: boolean = false;
  teamShowExplainFlag: boolean = false;
  totalWeight: number = 0;
  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: number = 0;
  pageSize1: number = 30;
  selectedList1: any = [];
  userHeader: any;
  deleteList: Array<any> = [];
  private rowid: string;
  inWsNo: any;
  inWsTime: any;
  popData: any = {
    wsLocation: {},
    consigneeName: {}
  };

  popTableData: any = [];

  btnDisable: any = {};
  tplModal: NzModalRef;

  constructor(private fb: FormBuilder, private appInfo: UserinfoService, private router: Router, private http: HttpUtilService, private nz: NzNotificationService, private nm: NzModalService) {
  }

  /**
   * 初始化方法
   */
  ngOnInit() {
    let nowDate = new Date();
    let loginName = this.appInfo.APPINFO.USER.loginName;
    this.validateForm = this.fb.group({
      customerCode: ['', [Validators.required]],
      customerName: ['', []],
      inWsNo: ['', []],
      operUser: ['', [Validators.required]],
      operTeam: ['', [Validators.required]],
      operTeamCode: ['', [Validators.required]],
      operTime: [nowDate, [Validators.required]],
      inWsTime: [nowDate, [Validators.required]],
      travelno: ['', []],
      tallyman: ['', []],
      craneOper: ['', []],
      remark: ['', []],
      totalWeight: [null, []],
      totalPackageNum: [null, []]
    });
    let topInfo = JSON.parse(sessionStorage.getItem('stockBulkIn') || '{}');

    this.status = topInfo.status;
    if (topInfo.status == 'Update') {
      this.popData.wsLocation.name = topInfo.stockInDetailList && topInfo.stockInDetailList[0] ? topInfo.stockInDetailList[0].wsLocation || '' : '';
      this.popData.consigneeName.name = topInfo.stockInDetailList && topInfo.stockInDetailList[0] ? topInfo.stockInDetailList[0].consigneeName || '' : '';
      this.validateForm.patchValue(topInfo);
      this.customerName = topInfo.customerName || '';
      this.customerCode = topInfo.customerCode || '';
      this.operTeam = topInfo.operTeam || '';
      this.operTeamCode = topInfo.operTeamCode || '';
      this.rowid = topInfo.rowid;
      this.getList({page: 1, length: this.pageSize1, shStockIns: [{inWsNo: topInfo.inWsNo}]});
    }
    this.validateForm.get('operUser').setValue(loginName);

  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    let url = stockUrl.selectStockBulkInDetail;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.dataSet1.forEach(item => {
          item.inputDisabled = {productName: true}
        })
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

  //删除列表明细
  delete(data: any, i: number) {
    this.dataSet1.splice(i, 1);
    this.dataSet1 = [...this.dataSet1];
    this.theorySheetNumber();
    this.theoryWeightNumber();
  }

  //数据弹框组件内容发生改变时触发的方法
  inpEmit(data: any) {
    this.showExplainFlag = false;
    this.inpValidate = data.inpValidate;
    this.validateForm.get('customerCode').setValue(data.inpValue);
    this.validateForm.get('customerName').setValue(data.inpName);
  }

  //数据弹框组件内容发生改变时触发的方法
  teamInpEmit(data: any) {
    this.teamShowExplainFlag = false;
    this.teamInpValidate = data.inpValidate;
    this.validateForm.get('operTeamCode').setValue(data.inpValue);
    this.validateForm.get('operTeam').setValue(data.inpName);
  }

  //数据弹框组件内容发生改变时触发的方法
  inpEmitDetail(data: any): void {

    if (data.eName === 'consigneeName') {
      this.dataSet1[data.index].consigneeName = data.inpName;
      this.dataSet1[data.index].consigneeCode = data.inpValue;
    } else if (data.eName === 'wsLocation') {
      this.dataSet1[data.index].wsLocation = data.inpName;
      this.dataSet1[data.index].wsLocationId = data.selData[0] && data.selData[0].rowid || '';
      this.dataSet1[data.index].wsArea = data.selData[0] && data.selData[0].areaName || '';
      this.dataSet1[data.index].wsName = data.selData[0] && data.selData[0].stockName || '';
      // // 弹框选择操作
      // if (Array.isArray(data.selData)) {
      //   this.dataSet1[data.index].wsLocation = data.inpName;
      //   this.dataSet1[data.index].wsLocationId = data.selData[0] && data.selData[0].rowid || '';
      //   this.dataSet1[data.index].wsArea = data.selData[0] && data.selData[0].areaName || '';
      //   this.dataSet1[data.index].wsName = data.selData[0] && data.selData[0].stockName || '';
      // } else {
      //   // grid中input的chang操作
      //   this.dataSet1[data.index].wsArea = '';
      //   this.dataSet1[data.index].wsLocation = '';
      //   this.dataSet1[data.index].wsLocationId = '';
      // }

    } else if (data.header.colEname === 'weight') {
      this.theoryWeightNumber();
    } else if (data.header.colEname === 'packageNum') {
      this.theorySheetNumber();
    }

  }

  getUserHeader(data: any): void {
    this.userHeader = data;
  }

  //新增明细
  btnAdd(data: any): void {
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
    this.dataSet1 = [{}, ...this.dataSet1]
  }

  //按钮点击
  btnClick(data: any): void {
    if (data.buttonId === 'Add') {
      this.btnAdd(data);
    }
    if (data.buttonId === 'save') {
      this.btnSave(data);
    }
    if (data.buttonId === 'Copy') {
      this.copyAddPack();
    }
    if (data.buttonId === 'cancel') {
      this.router.navigate(['/system/stock/stockBulkIn']);
    }
  }

  /**
   * 复制新增
   */
  copyAddPack() {
    if (this.dataSet1.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请至少添加一条明细后操作！'
      });
      return;
    }
    this.dataSet1.forEach((item,index) => {
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
      this.dataSet1 = [...this.dataSet1, {...item}];
    });
  }

  //保存
  btnSave(data: any): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.inpValidate != 'VALID') {
      this.showExplainFlag = true;
    }
    if (this.teamInpValidate != 'VALID') {
      this.teamShowExplainFlag = true;
    }
    if (this.validateForm.status == 'INVALID' || this.inpValidate != 'VALID' || this.teamInpValidate != 'VALID') {
      return;
    }
    if (this.dataSet1.length < 1) {
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

    let url = this.status == 'Add' ? stockUrl.insertStockBulkIn : stockUrl.updateStockBulkIn;
    let param: any = {stockInDetailList: '', rowid: ''};
    param = this.validateForm.getRawValue();
    param.shStockInDetails = this.dataSet1;
    param.rowid = this.rowid;
    param.inWsTime = param.inWsTime && param.inWsTime instanceof Date ? Utils.dateFormat(param.inWsTime, 'yyyy-MM-dd HH:mm:ss') : param.inWsTime || '';
    param.operTime = param.operTime && param.operTime instanceof Date ? Utils.dateFormat(param.operTime, 'yyyy-MM-dd HH:mm:ss') : param.operTime || '';
    this.btnDisable = {'save': true};
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/stock/stockBulkIn'])
        }
      }
    );
  }

  //提示弹窗自动关闭
  destroyTplModal(): void {
    // window.setTimeout(() => {
    //   this.tplModal.destroy();
    // }, 1500);
  };

  //计算理论重量
  theoryWeightNumber() {
    let totalWeight = 0;
    for (let i = 0; i < this.dataSet1.length; i++) {
      totalWeight += Number(this.dataSet1[i].weight)
    }
    this.validateForm.get("totalWeight").setValue(totalWeight);
  }

  //计算理论件数
  theorySheetNumber() {
    let totalPackageNum = 0;
    for (let i = 0; i < this.dataSet1.length; i++) {
      totalPackageNum += Number(this.dataSet1[i].packageNum)
    }
    this.validateForm.get("totalPackageNum").setValue(totalPackageNum);
  }

}

