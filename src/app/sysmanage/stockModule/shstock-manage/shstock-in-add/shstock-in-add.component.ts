import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {stockUrl} from 'src/app/common/model/stockUrl';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '../../../../common/util/utils';
import {UserinfoService} from "../../../../common/services/userinfo-service.service";

@Component({
  selector: 'app-shstock-in-add',
  templateUrl: './shstock-in-add.component.html',
  styleUrls: ['./shstock-in-add.component.css']
})
export class ShstockInAddComponent implements OnInit {
  validateForm: FormGroup;
  customerName: string; //客户名称
  customerCode: string;//客户id
  operTeam: string; //班组名称
  operTeamCode: string;
  shipNo: string;
  boatBatchNum: string;
  wsName: string;
  wsArea: string;
  status: any;
  formId = 'form_shstock_in_add';
  state: any;
  inpValidate: any;//pop搜索框是否选择的状态
  wsInpValidate: any;
  boatinpValidate: any;
  teamInpValidate: any;
  showExplainFlag: boolean = false;   //根据pop搜索框是否选择 显示提示信息
  wsShowExplainFlag: boolean = false;
  teamShowExplainFlag: boolean = false;
  boatShowExplainFlag: boolean = false;
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
  searchList: Array<any> = []; //查询条件缓存
  lab: number = 3; //表单lable布局
  inp: number = 5; //表单input布局
  inWsTime: any;
  popTableData: any = [];

  btnDisable: any = {};
  tplModal: NzModalRef;

  constructor(private fb: FormBuilder,
              private appInfo: UserinfoService,
              private router: Router,
              private http: HttpUtilService,
              private route: ActivatedRoute,
              private nz: NzNotificationService,
              private nm: NzModalService) {
  }

  /**
   * 初始化方法
   */
  ngOnInit() {

    let nowDate = new Date();
    let loginName = this.appInfo.APPINFO.USER.loginName;
    this.route.queryParams.subscribe(x => {
      this.state = x.state;
    });
    if (this.state == 'Record') {
      this.lab = 2;
      this.inp = 4;
      this.formId = 'form_shstock_in_add_record';
      this.listSearch({page: 1, length: this.pageSize1});
    }
    this.validateForm = this.state == 'Record' ? this.fb.group({
      customerCode: ['', [Validators.required]],
      customerName: ['', []],
      inWsNo: ['', []],
      operUser: ['', [Validators.required]],
      // productName: ['', []],
      // weight: ['', []],
      // spec: ['', []],
      boatBatchNum: ['', []],
      operTime: [nowDate, [Validators.required]],
      inWsTime: [nowDate, [Validators.required]],
      wsName: ['', []],
      wsArea: ['', []],
      // vehicleNo: ['', []],
      shipNo: ['', []],
      orderNo: ['', []],
      tallyman: ['', []],
      remark: ['', []],
      totalWeight: [null, []],
      totalPackageNum: [null, []]
    }) : this.fb.group({
      customerCode: ['', [Validators.required]],
      customerName: ['', []],
      inWsNo: ['', []],
      operUser: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      spec: ['', [Validators.required]],
      boatBatchNum: ['', []],
      operTime: [nowDate, [Validators.required]],
      inWsTime: [nowDate, [Validators.required]],
      wsName: ['', []],
      wsArea: ['', []],
      vehicleNo: ['', []],
      shipNo: ['', []],
      orderNo: ['', []],
      tallyman: ['', []],
      remark: ['', []],
      totalWeight: [null, []],
      totalPackageNum: [null, []]
    });
    let topInfo = JSON.parse(sessionStorage.getItem('stockBulkIn') || '{}');
    this.status = topInfo.status;
    if (topInfo.status == 'Update') {
      this.validateForm.patchValue(topInfo);
      this.customerName = topInfo.customerName || '';
      this.customerCode = topInfo.customerCode || '';
      this.boatBatchNum = topInfo.boatBatchNum || '';
      this.shipNo = topInfo.shipNo || '';
      this.wsArea = topInfo.wsArea || '';
      this.wsName = topInfo.wsName || '';
      this.rowid = topInfo.rowid;
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
        });
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
        });
      }
    })
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  getList1(data: any): void {
    data['inOrOut'] = 'GBLX10';
    data['status'] = 'GBSY00';
    let url = stockUrl.weighinggetPage;
    this.listLoading1 = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPages1 = res.data.data && res.data.data.total;
      }
    })
  }

  // //删除列表明细
  // delete(data: any, i: number) {
  //   this.dataSet1.splice(i, 1);
  //   this.dataSet1 = [...this.dataSet1];
  //   this.totalPages1 = this.dataSet1.length;
  //   this.selectedList1 = [...this.dataSet1];
  //   this.theorySheetNumber();
  //   this.theoryWeightNumber();
  // }

  //数据弹框组件内容发生改变时触发的方法
  inpEmit(data: any) {
    this.showExplainFlag = false;
    this.inpValidate = data.inpValidate;
    this.validateForm.get('customerCode').setValue(data.inpValue);
    this.validateForm.get('customerName').setValue(data.inpName);
  }

  //数据弹框组件内容发生改变时触发的方法
  boatinpEmit(data: any) {
    this.boatShowExplainFlag = false;
    this.boatinpValidate = data.inpValidate;
    this.validateForm.get('shipNo').setValue(data.inpValue);
    this.validateForm.get('boatBatchNum').setValue(data.inpName);
    this.searchData(this.searchList, data.inpValue)


  }

  searchData(data: any, value?: any) {
    this.searchList = data;
    if (this.state == 'Record' && value) {
      data.forEach(item => {
        if (item.parameter == 'supplyUnit') {
          item.query = '包含';
          item.value1 = value
        }
      })

    }
  }

  //数据弹框组件内容发生改变时触发的方法
  // teamInpEmit(data: any) {
  //   this.teamShowExplainFlag = false;
  //   this.teamInpValidate = data.inpValidate;
  //   this.validateForm.get('operTeamCode').setValue(data.inpValue);
  //   this.validateForm.get('operTeam').setValue(data.inpName);
  // }

  wsinpEmit(data: any) {
    this.wsShowExplainFlag = false;
    // !data.inpName && (this.wsShowExplainFlag = true);
    this.wsInpValidate = data.inpValidate;
    this.validateForm.get('wsArea').setValue(data.inpValue);
    this.validateForm.get('wsName').setValue(data.inpName);
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
    this.dataSet1 = [{}, ...this.dataSet1];
    this.selectedList1 = [...this.dataSet1];
    this.totalPages1 = this.dataSet1.length;
  }

  //按钮点击
  btnClick(data: any): void {
    if (data.buttonId === 'Add') {
      // this.btnAdd(data);
    }
    if (data.buttonId === 'save') {
      this.btnSave(data);
    }
    if (data.buttonId === 'Copy') {
      this.copyAddPack();
    }
    if (data.buttonId === 'cancel') {
      this.router.navigate(['/system/shStock/shstockIn']);
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
    this.dataSet1.forEach((item, index) => {
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
    if (this.wsInpValidate != 'VALID') {
      this.wsShowExplainFlag = true;
    }
    if (this.boatinpValidate != 'VALID') {
      this.boatShowExplainFlag = true;
    }
    if (this.boatinpValidate != 'VALID' || this.inpValidate != 'VALID' ||  this.wsInpValidate != 'VALID') {
      return;
    }
    // if (this.wsInpValidate != 'VALID' && this.state == 'Record') {
    //   return
    // }
    if (this.state == 'Record') {
      if (this.selectedList1.length < 1) {
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
    }
    if (this.validateForm.status == 'INVALID') {
      return
    }
    let url = this.status == 'Add' ? stockUrl.insertStockBulkIn : stockUrl.updateStockBulkIn;
    let param: any;
    if (this.status == 'Add' && this.state == 'Record') {
      let obj = this.validateForm.getRawValue();
      obj.inWsTime = obj.inWsTime && obj.inWsTime instanceof Date ? Utils.dateFormat(obj.inWsTime, 'yyyy-MM-dd HH:mm:ss') : obj.inWsTime || '';
      obj.operTime = obj.operTime && obj.operTime instanceof Date ? Utils.dateFormat(obj.operTime, 'yyyy-MM-dd HH:mm:ss') : obj.operTime || '';
      url = stockUrl.insertStockBulkInList;
      param = {shStockIns: '', rowid: ''};
      this.selectedList1.forEach(item => {
        item['weight'] = item.netweight;
        item['isBulkCargo'] = 'ISSH10';
        item['wsName'] = obj.wsName;
        item['wsArea'] = obj.wsArea;
        item['orderNo'] = obj.orderNo;
      });
      let arr = [];
      obj.totalWeight = this.selectedList1.map(item => item.weight).reduce((acc, cur) => Number(this.isNotANumber(acc)) + Number(this.isNotANumber(cur)), 0);
      arr = this.selectedList1.map(item => {
        return {shStockInDetails: [item], ...obj, vehicleNo: item.vehicleNo, endInspectionDate: item.endInspectionDate}
      });
      param.shStockIns = arr;
    } else {
      param = this.validateForm.getRawValue();
      param.shStockInDetails = [{}];
      param.rowid = this.rowid;
      param.totalWeight = param.weight;
      param.inWsTime = param.inWsTime && param.inWsTime instanceof Date ? Utils.dateFormat(param.inWsTime, 'yyyy-MM-dd HH:mm:ss') : param.inWsTime || '';
      param.operTime = param.operTime && param.operTime instanceof Date ? Utils.dateFormat(param.operTime, 'yyyy-MM-dd HH:mm:ss') : param.operTime || '';
      param.shStockInDetails.forEach(item => {
        item['isBulkCargo'] = 'ISSH10';
        item.wsName = param.wsName;
        item.wsArea = param.wsArea;
        item.orderNo = param.orderNo;
        item.productName = param.productName;
        item.spec = param.spec;
        item.weight = param.weight;
        item.vehicleNo = param.vehicleNo

      });
    }
    this.http.post(url, param).then(
      (res: any) => {
        this.btnDisable = {};
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
          this.router.navigate(['/system/shStock/shstockIn'])
        }
      }
    );
  }

  select(data: any) {
    this.selectedList1 = data;
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

  /*
*    数字NAN修改为0
*/
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }

}
