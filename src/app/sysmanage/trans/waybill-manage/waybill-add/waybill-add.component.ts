import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {format as dateformat} from 'date-fns';
import {SelectService, SelectComponent} from '../../../../components/simple-page/simple-page-form.module';
import {TRANS_URLS, SYS_URLS} from '../../../../common/model/trans-urls';
import {ActivatedRoute, Router} from '@angular/router';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {urls} from '../../../../common/model/url';

@Component({
  selector: 'app-waybill-add',
  templateUrl: './waybill-add.component.html',
  styleUrls: ['./waybill-add.component.css'],
})

export class WaybillAddComponent implements OnInit {

  formId: string = 'form_waybill_reg';

  waybill: any = {loadDate: new Date(), status: true, isBicycleSettle: null};
  driver: any = {};

  initRowData = {newRow: true, checked: true};
  packData: Array<any> = [{...this.initRowData}];
  driverData: Array<any> = [];
  btnClick: boolean = false;
  payTypeList: Array<any> = [];
  flowidList: Array<any> = [];
  tplModal: any = {};
  modalDataSet: any = [];  //弹框数据
  modalUpdateData: any = []; //勾选弹框数据
  isVisible: boolean = false;  //显示弹框
  modalPageSize: any = 30;
  modalListLoading: boolean = false;
  modalTotalPages: any = 0;
  modalTempSearchParam: any = {};
  pageSource: string;
  @ViewChild('consignor_select') select: SelectComponent;

  businessTypeApi = {
    url: SYS_URLS.SELECT_BUSI_SEGMENT,
    fieldKey: {text: 'segmentName', value: 'segmentId'},
  };

  flowApi = {
    url: SYS_URLS.SELECT_COMPANY_FLOW,
    fieldKey: {text: 'flowName', value: 'flowId'},
  };

  driverDataSource: Array<any> = [];
  dirverFieldKey = {text: 'employeeId', value: 'userId'};

  operateType: string = 'add';

  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private selectService: SelectService,
              private route: ActivatedRoute,
              private router: Router,
              private appInfo: UserinfoService,
              private nzModal: NzModalService,
  ) {

  }

  ngOnInit() {

    // 如果是修改，根据运单号加载该运单数据
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams.operateType) {
        if (queryParams.operateType === 'update') {
          this.operateType = 'update';
          this.pageSource = queryParams.source;
          this.loadData(queryParams.waybillNo);
        }
      }
    });
    // 加载司机工号下拉数据源
    this.selectService.getValue(SYS_URLS.SELECT_DRIVER, {}).then((res: any) => {
      if (res.success) {
        this.driverDataSource = res.data.data.data;
      }
    });
    let arr: any = [];
    Object.assign(arr, this.packData);
    arr = arr.filter(item => item.checked);
    // this.selectedLength = arr.length;
    this.getStatic(this.payTypeList, 'YWXZ');
    this.getFlowId(this.flowidList);
    this.businessTypeApi['param'] = {companyId: this.appInfo.APPINFO.USER.companyId};
    this.waybill.businessType = '009';
    this.waybill.flowId = '10';
    this.waybill.startLocationName = '日照钢铁';
    this.waybill.startPoint = 'P0000261';
  }

  // 基准公里数显示：小数点后三位
  formatterStand = (value: number) => value ? `${Number(value).toFixed(3)}` : '';

  columns(data: any[]) {
    const col = data.filter(x => x.colEname === 'prePackWeight');
    const prePackSheet = data.filter(x => x.colEname === 'prePackSheet');
    col[0] && (col[0].notAbs = true);
    prePackSheet[0] && (prePackSheet[0].notAbs = true);
  }

  // 静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  // 获取运输方式
  getFlowId(data: Array<any>): void {
    this.http.post(SYS_URLS.SELECT_COMPANY_FLOW, {}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data);
        }
      }
    );
  }

  //按钮
  btnClickFun(button: any) {
    switch (button.buttonId) {
      case 'insert':
        if (this.operateType === 'update') {
          this.update();
        } else if (this.operateType == 'add') {
          this.insert();
        }
        break;
      case 'Use':
        this.use();
        break;
      case 'delete':
        this.deletePack();
        break;
      case 'addBales':
        this.addNewPack();
        break;
      case 'copyBales':
        this.copyAddPack();
        break;
      case 'Return':
        this.cancel();
        break;
      default:
        this.msg.error('按钮未绑定方法');
    }
  }

  /**
   * 加载运单主表、捆包表、司机表数据
   * @param waybillNo
   */
  loadData(waybillNo: string) {
    if (!waybillNo) {
      this.msg.error('系统错误！运单号为空！');
    }
    this.query(waybillNo); // 查询运单信息
  }

  /**
   * 运单查询
   */
  query(waybillNo: string) {
    this.http.post(TRANS_URLS.GET_WAYBILL, {waybillNo: waybillNo}).then(
      (res: any) => {
        if (res.success) {
          this.waybill = res.data.data || {};
          if (!this.waybill.loadDate) {
            this.waybill.loadDate = null;
          }
          this.waybill.businessNature = this.waybill.businessNature ? this.waybill.businessNature : 'YWXZ10';
          this.waybill.flowId = this.waybill.flowId ? this.waybill.flowId : '10';
          this.waybill.isSettleBoolean = this.waybill.isSettle === 'JSBJ10';
          if (this.waybill.weight === '大载') {
            this.waybill.weight = 'ZZBJ10';
          } else if (this.waybill.weight === '标载') {
            this.waybill.weight = 'ZZBJ20';
          }
          this.packData = this.waybill.waybillPackList;
          this.packData.forEach((item, index) => item.rowIndex = index + 1);

          this.driverData = this.waybill.waybillDriverList;
          this.driverData.forEach((item, index) => item.rowIndex = index + 1);

          let arr1: any = [];
          Object.assign(arr1, this.driverData);
          arr1 = arr1.filter(item => item.checked);

          let arr: any = [];
          Object.assign(arr, this.packData);
          arr = arr.filter(item => item.checked);
        }
      }
    );
  }

  /**
   * 新增保存
   */
  insert() {
    this.handleData();
    if (this.waybill.loadDate == '1970-01-01 08:00:00') {
      this.msg.error('请选择重新选择装载时间');
      return;
    }
    if (!this.validateWaybill() || !this.validatePack()) {
      return;
    }
    this.btnClick = true;
    this.http.post(TRANS_URLS.INSERT_WAYBILL, {
      ...this.waybill,
      isSettle: this.waybill.isSettleBoolean ? 'JSBJ10' : 'JSBJ20'
    }).then((res: any) => {
      this.btnClick = false;
      if (res.success) {
        this.msg.success('保存成功');
        //保存成功跳转到查询页面
        this.router.navigate(['/system/trans/waybill-manage/waybill-new'], {queryParams: {}});
      }
    });
  }

  /**
   * 修改保存
   */
  update() {
    this.handleData();
    if (this.waybill.loadDate == '1970-01-01 08:00:00') {
      this.msg.error('请选择重新选择装载时间');
      return;
    }
    if (!this.validateWaybill() || !this.validatePack()) {
      return;
    }
    this.btnClick = true;
    this.http.post(TRANS_URLS.UPDATE_WAYBILL, {
      ...this.waybill, isSettle: this.waybill.isSettleBoolean ? 'JSBJ10' : 'JSBJ20'
    }).then((res: any) => {
      this.btnClick = false;
      if (res.success) {
        // 保存成功将新行标记置为false
        this.packData.forEach(item => item.newRow = false);
        this.driverData.forEach(item => item.newRow = false);
        this.msg.success('修改成功');
        //保存成功跳转到查询页面
        let url = '';
        if (this.pageSource === 'new') {
          url = '/system/trans/waybill-manage/waybill-new';
        } else if (this.pageSource === 'waybillBook') {
          url = '/system/trans/waybill-manage/waybillBook';
        } else if (this.pageSource === 'ledger') {
          url = '/system/trans/waybill-manage/waybillLedger';
        } else {
          url = '/system/trans/waybill-manage/waybill';
        }
        this.router.navigate([url], {queryParams: {}});

      }
    });
  }


  /**
   * 提交后台前处理数据
   */
  handleData() {
    this.waybill.loadDate = this.waybill.loadDate && dateformat(this.waybill.loadDate, 'YYYY-MM-DD HH:mm:ss');
    this.packData.forEach(item => item.outstockDate ? item.outstockDate = dateformat(item.outstockDate, 'YYYY-MM-DD HH:mm:ss') : item.outstockDate = '');
    this.waybill.waybillPackList = this.packData;
    this.waybill.waybillDriverList = this.driverData;
  }

  /**
   *
   */
  validateWaybill(): boolean {
    const validateArray = [
      {ename: 'loadDate', cname: '装载时间'},
      {ename: 'consignorCompanyId', cname: '客户名称'},
      {ename: 'carrierCompanyId', cname: '运输车队'},
      {ename: 'startPoint', cname: '装货地'},
      {ename: 'endPoint', cname: '收货地址'},
      {ename: 'flowId', cname: '运输方式'},
      {ename: 'businessNature', cname: '业务性质'},
      {ename: 'businessType', cname: '业务板块'},
      {ename: 'mainProductListNo', cname: '主装车清单号'},
    ];
    const msg = validateArray.filter(item => !this.waybill[item.ename]).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`运单主信息"${msg}"字段不能为空！`);
      return false;
    }
    if (this.waybill.waybillPackList.length == 0) {
      this.msg.error(`捆包明细不能为空！`);
      return;
    }

    return true;
  }

  /**
   * 司机信息验证
   */
  validateDriver(): boolean {
    const validateArray = [
      // {ename: 'userId', cname: '用户ID'},
      // { ename: 'employeeId', cname: '工号' },
      // { ename: 'driverName', cname: '驾驶员' },
      // { ename: 'vehicleNo', cname: '车船号' },
      // { ename: 'tripNo', cname: '趟次' },
    ];
    const msg = validateArray.filter(item => !this.driver[item.ename]).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`司机信息"${msg}"字段不能为空！`);
      return false;
    }
    return true;
  }

  /**
   * 捆包信息验证
   */
  validatePack(): boolean {
    const validateArray = [
      {ename: 'prePackWeight', cname: '重量', validator: 'number'},
      {ename: 'prePackSheet', cname: '件数', validator: 'number'},
    ];

    let errArr = validateArray.filter(f => this.packData.some(item => !item[f.ename]));
    if (errArr.length > 0) {
      this.msg.error(`捆包信息"${errArr.map(item => item.cname).join(',')}"不能为空！`);
      return false;
    }
    errArr = validateArray.filter(f => f.validator === 'number').filter(f => this.packData.some(item => isNaN(item[f.ename])));
    if (errArr.length > 0) {
      this.msg.error(`捆包信息"${errArr.map(item => item.cname).join(',')}"必须为数字！`);
      return false;
    }

    return true;
  }

  /**
   * 取消（取消修改，并跳转到查询界面）
   */
  cancel() {
    let url = '';
    if (this.pageSource === 'new') {
      url = '/system/trans/waybill-manage/waybill-new';
    } else if (this.pageSource === 'waybillBook') {
      url = '/system/trans/waybill-manage/waybillBook';
    } else if (this.pageSource === 'ledger') {
      url = '/system/trans/waybill-manage/waybillLedger';
    } else {
      url = '/system/trans/waybill-manage/waybill';
    }
    this.router.navigate([url], {queryParams: {}});
  }

  /**
   * 新增空行
   */
  addNewPack() {
    const rowIndex = this.packData.length == 0 ? 1 : this.packData[this.packData.length - 1].rowIndex;
    this.packData = [...this.packData, {...this.initRowData, rowIndex: rowIndex}];
    let arr: any = [];
    Object.assign(arr, this.packData);
    arr = arr.filter(item => item.checked);
    // this.selectedLength = arr.length;
  }

  updateDataResult(data: any) {
    //   this.selectedLength = data.length;
  }

  updateData(data: any) {
    //   this.DselectedLength = data.length;
  }

  /**
   * 复制新增
   */
  copyAddPack() {
    const selectedData = this.packData.filter(item => item.checked);
    if (selectedData.length == 0) {
      this.msg.warning('请至少选择一条捆包信息');
      return;
    }
    const rowIndex = this.packData.length == 0 ? 1 : this.packData[this.packData.length - 1].rowIndex;
    selectedData.forEach((item, index) => {
      this.packData = [...this.packData, {...item, ...this.initRowData, rowIndex: (rowIndex + index + 1)}];
    });

    let arr: any = [];
    Object.assign(arr, this.packData);
    arr = arr.filter(item => item.checked);
    // this.selectedLength = arr.length;
  }

  /**
   * 删除运单捆包信息
   */
  deletePack() {
    // 如果是新增行数据，直接在界面删除
    if (this.packData.filter(item => item.checked).length == 0) {
      this.msg.warning('请至少选择一条捆包信息');
      return;
    }

    this.packData = this.packData.filter(item => !item.checked);
    let arr: any = [];
    Object.assign(arr, this.packData);
    arr = arr.filter(item => item.checked);
    //  this.selectedLength = arr.length;
  }

  /**
   * 根据选择工号带回的userId查找用户相关信息，并设置到driver中
   * @param userId
   */
  setDriverInfo(userId: string) {
    if (userId) {
      const user = this.driverDataSource.filter(item => item.userId === userId)[0];
      this.driver.employeeId = user.employeeId;
      this.driver.driverId = user.userId;
      this.driver.driverName = user.name;
      this.driver.vehicleNo = user.vehicleNo;
    }
  }

  /**
   * 趟次输入框Enter键触发方法，将录入司机信息显示到grid中，并清空司机录入相关输入框
   */
  addDriver() {
    if (!this.validateDriver()) {
      return;
    }
    const rowIndex = this.driverData.length == 0 ? 1 : this.driverData[this.driverData.length - 1].rowIndex;
    this.driverData = [{...this.initRowData, ...this.driver, rowIndex: rowIndex}, ...this.driverData];

    this.driver = {};
    // this.driverData = this.driverData.filter(item => item.checked);

    let arr: any = [];
    Object.assign(arr, this.driverData);
    arr = arr.filter(item => item.checked);
    // this.DselectedLength = arr.length;

  }

  /**
   * 删除运单司机信息
   */
  deleteDriver() {
    // 如果是新增行数据，直接在界面删除
    if (this.driverData.filter(item => item.checked).length == 0) {
      this.msg.warning('请至少选择一条司机信息');
      return;
    }

    this.driverData = this.driverData.filter(item => !item.checked);
    let arr: any = [];
    Object.assign(arr, this.driverData);
    arr = arr.filter(item => item.checked);
    //  this.DselectedLength = arr.length;
  }

  /**
   * 公司弹框设置公司ID
   * @param data
   * @param fieldName
   */
  setPopSelectedValueId(data: any, fieldName: string) {
    this.waybill[fieldName] = data.inpValue;
  }

  dcjsInputModal(data: any) {
    this.waybill.settleCompanyId = data.inpValue;
  }

  use() {  //使用合同
    this.isVisible = true;
    this.modalListSearch({});
  }

  /**
   * 查询
   * @param data
   */
  modalListSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.modalPageSize;
    this.getModalList(data);
  }


  /**
   * 获取弹窗列表
   * @param data
   */
  getModalList(data: any): void {
    let url = TRANS_URLS.getWaybill;
    this.modalTempSearchParam = data;
    this.modalDataSet = [];
    this.modalListLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.modalListLoading = false;
      if (res.success) {
        this.modalDataSet = res.data.data && res.data.data.data || [];
        this.modalTotalPages = res.data.data && res.data.data.total;

      }
    });
  }


  //弹窗取消

  nzOnCancel() {
    this.isVisible = false;
    this.modalDataSet = [];
  }


  /**
   * 弹窗选中数据发生变化
   * @param data
   */
  modalUpdateDatafun(data: any) {
    this.modalUpdateData = data;
  }


  // 弹窗按钮点击
  modalBtnClick(data: any) {

    switch (data.buttonId) {
      case 'Use':
        this.BtnUse();
        break;
      case 'Cancel':
        this.nzOnCancel();
        break;
      default:
        break;
    }
  }

  BtnUse() {
    if (!this.modalUpdateData || !this.modalUpdateData[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }

    if (this.modalUpdateData[0].businessNatureName == '自提') {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '结算方式为自提方式，不能使用！'
      });
      return;
    }
    if (this.modalUpdateData[0].transStatusName == '运输完成') {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '运输状态为完成，不能使用！'
      });
      return;
    }
    let url = TRANS_URLS.GET_ORDER;
    let param: any = {orderNo: this.modalUpdateData[0].orderNo};
    this.http.post(url, param).then((res: any) => {

      if (res.success) {
        this.waybill = res.data.data;
        this.waybill.carrierCompanyId = '';
        this.waybill.carrierCompanyName = '';
        this.waybill.startLocationName = '日照钢铁';
        this.waybill.startPoint = 'P0000261';
        this.waybill.consignorCompanyName = this.modalUpdateData[0].consignorCompanyName;
        this.waybill.consignorCompanyId = this.modalUpdateData[0].consignorCompanyId;
        // this.waybill.startLocationName = this.waybill.tOrderItemModels[0].startAddress;
        this.waybill.startPoint = this.waybill.tOrderItemModels[0].startPoint;
        this.waybill.endLocationName = this.modalUpdateData[0].detailAddressName;
        this.waybill.endPoint = this.modalUpdateData[0].detailAddress;
        this.waybill.endPoint = res.data.data.detailAddress;
        this.waybill.isSettleBoolean = true;
        this.waybill.businessType = '009';
        this.waybill.loadDate = new Date();

        this.packData = this.waybill.tOrderItemModels ? this.waybill.tOrderItemModels : [];
        let packIndex = 1;

        this.packData.forEach((item, index) => {
          item.rowIndex = index + 1;
          item.tOrderPackModels && item.tOrderPackModels.forEach(pack => {
            pack.rowIndex = index + 1;
          });
        });
        let arr: any = [];
        Object.assign(arr, this.packData);
        arr = arr.filter(item => item.checked);
        //  this.selectedLength = arr.length;
        for (let i: number = 0; i < this.packData.length; i++) {
          this.packData[i].prePackSheet = this.waybill.tOrderItemModels[i].totalSheet;
          this.packData[i].prePackWeight = this.waybill.tOrderItemModels[i].totalWeight;
          this.packData[i].productType = this.waybill.tOrderItemModels[i].productName;
        }
        this.isVisible = false;
      }
    });
  }

}
