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
  selector: 'app-loadameter-add',
  templateUrl: './loadameter-add.component.html',
  styleUrls: ['./loadameter-add.component.css']
})
export class LoadameterAddComponent implements OnInit {

  formId1: string = 'scale_load_management';

  loadameter: any = {firstTime: new Date(), secondTime: new Date()};
  driver: any = {};

  initRowData = {newRow: true, checked: true};
  packData: Array<any> = [{...this.initRowData}];
  // driverData: Array<any> = [];
  btnClick: boolean = false;
  payTypeList: Array<any> = [];
  // selectedLength: any = 0;
//  DselectedLength: any = 0;
  tplModal: any = {};
  modalDataSet: any = [];  // 弹框数据
  modalUpdateData: any = []; // 勾选弹框数据
  isVisible: boolean = false;  // 显示弹框
  modalPageSize: any = 30;
  modalListLoading: boolean = false;
  modalTotalPages: any = 0;
  modalTempSearchParam: any = {};
  isSave: boolean = false;
  modelselectedLength: any = 0;
  pageSource: string;
  selectedPackData: Array<any> = [];
  selectedDriverData: Array<any> = [];
  @ViewChild('consignor_select') select: SelectComponent;

  businessTypeApi = {
    url: SYS_URLS.SELECT_BUSI_SEGMENT,
    fieldKey: {text: 'segmentName', value: 'segmentId'},
  };
  // flowApi = {
  //   url: SYS_URLS.SELECT_COMPANY_FLOW,
  //   fieldKey: {text: 'flowName', value: 'flowId'},
  // }

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

    // 如果是修改，根据主表关联唯一键加载该运单数据
    this.route.queryParams.subscribe(queryParams => {
       // console.log(74);
       console.log(queryParams);
      if (queryParams && queryParams.operateType) {
        if (queryParams.operateType === 'update') {
          // console.log(78)
          this.operateType = 'update';
          // this.pageSource = queryParams.source;

          // this.loadData(queryParams.uniId);
          // queryParams.page=1;
          // queryParams.length= this.modalPageSize;
          this.loadData(queryParams);
        }
      }
    });
    let arr: any = [];
    Object.assign(arr, this.packData);
    arr = arr.filter(item => item.checked);
    this.businessTypeApi['param'] = {companyId: this.appInfo.APPINFO.USER.companyId};
    this.loadameter.businessType = '001';
    this.getStatic(this.payTypeList, 'DCJS');
    console.log(this.businessTypeApi);
  }

  columns(data: any[]) {
    const col = data.filter(x => x.colEname === "weight");
    const prePackSheet = data.filter(x => x.colEname === "sheet");
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
  // 按钮
  btnClickFun(button: any) {
    switch (button.buttonId) {
      case "Add":  // 保存
        if (this.operateType === 'update') {
          this.update();
        } else if (this.operateType == 'add') {
          this.insert();
        }
        break;
      case "delete":  // 删除
        this.deletePack();
        break;
      case "addBales":  // 新增
        this.addNewPack();
        break;
      case "copyBales":  // 复制
        this.copyAddPack();
        break;
      case "Return":   // 返回
        this.cancel();
        break;
      default:
        this.msg.error('按钮未绑定方法');
    }
  }

  /**
   * 加载运单主表、捆包表、司机表数据
   * @param
   */
  // loadData(uniId: string) {
  //   if (!uniId) {
  //     this.msg.error("系统错误！运单号为空！");
  //   }
  //   this.query(uniId); // 查询运单信息
  // }
  loadData(queryParams) {
    if (!queryParams.uniId) {
       this.msg.error("系统错误！运单号为空！");
     }
     this.query(queryParams); // 查询运单信息
  }
   meterData: Array<any> = [];
   dataParam: any;
   dataParam1:Array<any> = [];
  /**
   * 运单查询
   */
  // query(uniId: string) {
   query(queryParams) {
    console.log(151);
    /*queryParams.page=1;
    queryParams.length= this.modalPageSize;
    console.log(queryParams)
    this.dataParam={...queryParams}
    console.log(this.dataParam)*/
    this.dataParam1.push({...queryParams});
    this.dataParam1.forEach(val => {
      val.page = 1;
      val.length = this.modalPageSize;
    });
    console.log(this.dataParam1);
    this.dataParam = this.dataParam1[0];
    /*let param : any {
    {page: 1, length: this.pageSize}
    }*/
    this.http.post(urls.getListScaleLoadManagement, this.dataParam).then(
      (res: any) => {
        if (res.success) {
          console.log(res);
          this.meterData = res.data.data.data;
          this.loadameter = res.data.data.data[0] ;
          this.loadameter.businessType = res.data.data.data[0].segmentId;
          this.loadameter.consignorCompanyName = res.data.data.data[0].customerName;
          console.log(this.loadameter);
          console.log(this.meterData);
          // if (!this.loadameter.firstTime){
          //   this.loadameter.firstTime = null;
          // }

          // this.packData = this.loadameter.tScaleLoadManagementModels;
          // console.log(this.packData)
          // this.packData.forEach((item, index) => item.rowIndex = index + 1);
          // let arr: any = [];
          // Object.assign(arr, this.packData);
          // arr = arr.filter(item => item.checked);
          const dataLoadameter = [];
          this.meterData.forEach(
            res => {
              dataLoadameter.push({uniId: res.uniId});
            }
          );
          console.log(dataLoadameter);

          this.http.post(urls.getListScaleLoadManagementSon, {tScaleLoadManagementModels: dataLoadameter}).then(
            (res: any) => {
              if (res.success) {
                console.log(res);
                this.packData = res.data.data.data;
                console.log(this.packData);
                this.packData.forEach((item, index) => item.rowIndex = index + 1);
                let arr: any = [];
                Object.assign(arr, this.packData);
                arr = arr.filter(item => item.checked);
              }
            }
          );
        }
      }
    );

    // this.http.post(urls.getListScaleLoadManagementSon, {tScaleLoadManagementModels: dataLoadameter}).then(
    //   (res: any) => {
    //     if (res.success) {
    //       console.log(res)
    //
    //       this.packData = this.loadameter.tScaleLoadManagementModels;
    //       console.log(this.packData)
    //       this.packData.forEach((item, index) => item.rowIndex = index + 1);
    //       let arr: any = [];
    //       Object.assign(arr, this.packData);
    //       arr = arr.filter(item => item.checked);
    //     }
    //   }
    // );
  }

  /**
   * 保存
   */
  insert() {
    console.log(199);
    this.handleData();
    // if (!this.validateLoadameter() || !this.validatePack()) {
    //   return;
    // }
    if (!this.validateLoadameter() || !this.validatePack()) {
      return;
    }
    console.log(207);
    this.btnClick = true;
    console.log(this.loadameter);
    this.loadameter.customerName = this.loadameter.consignorCompanyName;
    this.http.post(urls.insertScaleLoadManagement, {...this.loadameter}).then((res: any) => {
      this.btnClick = false;
      if (res.success) {
        console.log(212);
        this.query(this.dataParam);
        this.msg.success('保存成功');
        // 保存成功跳转到查询页面
        this.router.navigate(['/system/trans/waybill-manage/loadameter'], {queryParams: {
            'operateType': 'insert',
          }});
      }
    });
  }

  /**
   * 修改保存
   */
  update() {
    console.log(198);
    this.handleData();
    // if (!this.validateLoadameter() || !this.validatePack()) {
    //   return;
    // }
    if (!this.validateLoadameter() || !this.validatePack() ) {
      return;
    }
    this.btnClick = true;
    // console.log(this.loadameter)
    this.http.post(urls.updateScaleLoadManagement, {...this.loadameter}).then((res: any) => {
      this.btnClick = false;
      if (res.success) {
        this.packData.forEach(item => item.newRow = false);
        this.msg.success('修改成功');
        // this.query(this.dataParam);
        // 保存成功跳转到查询页面
        const url =  '/system/trans/waybill-manage/loadameter';
        this.router.navigate([url], {queryParams: {
            'operateType': 'update',
          }});
        // this.query(this.dataParam);
      }
    });
  }


  /**
   * 提交后台前处理数据
   */
  handleData() {
    console.log(252)
    console.log(this.loadameter)
    this.loadameter.firstTime = dateformat(this.loadameter.firstTime, 'YYYY-MM-DD HH:mm:ss');
    this.loadameter.secondTime = dateformat(this.loadameter.secondTime, 'YYYY-MM-DD HH:mm:ss');
    //  this.packData.forEach(item => item.outstockDate ?
    //  item.outstockDate = dateformat(item.outstockDate, 'YYYY-MM-DD HH:mm:ss') : item.outstockDate = '');
    this.loadameter.tScaleLoadManagementModels = this.packData;

    // this.waybill.waybillDriverList = this.driverData;
    // this.waybill.status = this.waybill.statusBoolean ? 'YDZT30' : 'YDZT10';
    // this.waybill.isBicycleSettle = this.waybill.isSettleBoolean ? 'PT10' : 'PT20';
  }

  /**
   *   必填项字段控制
   */
  validateLoadameter(): boolean {
    const validateArray = [
      {ename: 'plateNum', cname: '车牌号'},
      {ename: 'firstWeight', cname: '一次称重重量'},
      {ename: 'inoutMark', cname: '进出场标记'},
      {ename: 'validMark', cname: '有效标记'},
      {ename: 'salesNum', cname: '地磅编号'},
      // {ename: 'carrierCompanyId', cname: '运输车队'},
      // {ename: 'startPoint', cname: '装货地'},
      // {ename: 'endPoint', cname: '收货地址'},
      // {ename: 'flowId', cname: '运输方式'},
      // {ename: 'businessType', cname: '业务板块'},
      // {ename: 'mainProductListNo', cname: '主装车清单号'},
      // {ename: 'isBicycleSettle', cname: '支付方式'},
    ];
    const msg = validateArray.filter(item => !this.loadameter[item.ename]).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`主表信息"${msg}"字段不能为空！`);
      return false;
    }
    console.log(this.loadameter.tScaleLoadManagementModels)
    if (this.loadameter.tScaleLoadManagementModels.length == 0) {
      this.msg.error(`捆包明细不能为空！`);
      return;
    }
    return true;
  }

  /**
   * 捆包信息验证（必填项字段控制）
   */
  validatePack(): boolean {
    /*
    * 捆包重量件数限制
    * */
    const validateArray = [
      {ename: 'weight', cname: '重量', validator: 'number'},
      {ename: 'sheet', cname: '件数', validator: 'number'},
    ];

    let errArr = validateArray.filter(f => this.packData.some(item => !item[f.ename]));
    if (errArr.length > 0) {
      this.msg.error(`捆包信息"${errArr.map(item => item.cname).join(",")}"不能为空！`);
      return false;
    }
    errArr = validateArray.filter(f => f.validator === 'number').filter(f => this.packData.some(item => isNaN(item[f.ename])));
    // if (errArr.length > 0) {
    //   this.msg.error(`捆包信息"${errArr.map(item => item.cname).join(",")}"必须为数字！`);
    //   return false;
    // }
    return true;
  }

  /**
   * 取消（取消修改，并跳转到查询界面）
   */
  cancel() {
    const url = '/system/trans/waybill-manage/loadameter';
    this.router.navigate([url], {queryParams: {}});
  }

  /**
   * 新增空行
   */
  addNewPack() {
    console.log(324);
    const rowIndex = this.packData.length == 0 ? 1 : this.packData[this.packData.length - 1].rowIndex;
    this.packData = [...this.packData, {...this.initRowData, rowIndex: rowIndex}];
    let arr: any = [];
    Object.assign(arr, this.packData);
    arr = arr.filter(item => item.checked);
  }

  updateDataResult(data: any) {
  }

  /**
   * 复制新增
   */
  copyAddPack() {
    const selectedData = this.packData.filter(item => item.checked);
    if (selectedData.length === 0) {
      this.msg.warning('请至少选择一条捆包信息');
      return;
    }
    const rowIndex = this.packData.length === 0 ? 1 : this.packData[this.packData.length - 1].rowIndex;
    selectedData.forEach((item, index) => {
      const i = {...item};
      i.rowid = undefined;
      this.packData = [...this.packData, {...i, ...this.initRowData, rowIndex: (rowIndex + index + 1)}];
    });

    let arr: any = [];
    Object.assign(arr, this.packData);
    arr = arr.filter(item => item.checked);
  }

  /**
   * 删除运单捆包信息
   */
  deletePack() {
    // 如果是新增行数据，直接在界面删除
    if (this.packData.filter(item => item.checked).length === 0) {
      this.msg.warning('请至少选择一条捆包信息');
      return;
    }
    this.packData = this.packData.filter(item => !item.checked);
    let arr: any = [];
    Object.assign(arr, this.packData);
    arr = arr.filter(item => item.checked);
  }

  /**
   * 公司弹框设置公司ID
   * @param data
   * @param fieldName
   */
  setPopSelectedValueId(data: any, fieldName: string) {
    this.loadameter[fieldName] = data.inpValue;
  }
  dcjsInputModal(data: any) {
    this.loadameter.settleCompanyId = data.inpValue;
  }


}

