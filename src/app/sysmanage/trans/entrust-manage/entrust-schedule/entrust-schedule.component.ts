import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '@util/utils';
import {TRANS_URLS} from '@model/trans-urls';
import {urls} from '@model/url';
import {addMinutes, differenceInMinutes, format, addDays} from 'date-fns';
import {UserinfoService} from '@service/userinfo-service.service';
import {Router} from '@angular/router';
import {CommonService} from '@service/common.service';
// @ts-ignore
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-entrust-schedule',
  templateUrl: './entrust-schedule.component.html',
  styleUrls: ['./entrust-schedule.component.css'],
  providers: [
    XlsxService
  ]

})
export class EntrustScheduleComponent implements OnInit {
  constructor(
    private nzModal: NzModalService,
    private http: HttpUtilService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private nz: NzNotificationService,
    private xlsx: XlsxService,
    private nzMess: NzMessageService,
    private info: UserinfoService,
    private router: Router,
    private cm: CommonService,
  ) {
  }

  recordTitleList: any = [];
  modalRef: NzModalRef;
  modalRef1: NzModalRef;
  dataSet: any = [];   // 查询到的结果集
  dataSet2: any = [];  // 车队信息
  dataSet3: any = [];  // 司机信息  公司下 所有的司机
  itemData: any = [];  // 子表信息
  dataSetUpdateWeight: any = [];  // 重量
  updatadata: any = []; // 获取的值在759行    // 选中的数据
  updatadata2: any = [];  //  勾选车队的数据
  updatadata3: any = [];  // 勾选司机的数据
  tempSearchParam: any;   // 查询的参数
  pageSize1: any = 30;   // 查询用
  totalPage: any;     // 查询用
  listLoading1: any;  // 查询 loading
  isCheck = false;
  loading: boolean;
  loading1: boolean;
  dataSet4: any;    // 司机   有车队  + 关注该板块的司机
  itemUpdatedata: Array<any> = [];//勾选的明细数据
  productDisable: boolean = false;
  inUpdateButton: boolean = false;
  //  删除提示用
  deleteVisible: any = false; // 删除弹框 是否可见
  modalTitle2: any;
  deleteCon: any;
  // 到此为止

  modalForm: any = {};   // 前端模态框里的数据
  tplModal: NzModalRef;
  tplModal1: NzModalRef; // 提示信息
  modalTitle: any;   // 模态框标题

  // 导入文件功能
  importFile: any;
  implistLoading = false;
  inputShow = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  // 到此为止

  chooseTime: any;
  radiovalue: any;    // 选项
  remark: any;    // 备注
  remark1: any;
  fleet: any;   // 车队
  driver: any;   // 车辆
  vehicleNo: any; // 车牌号
  mobile: any; // 手机
  isMutli = false;
  showPagination = false;
  validate: any = {validateOpt: 'inpValue', validateCon: '请选择卸点'};  // 验证信息
  localCompanyId: any = this.info.APPINFO.USER.companyId;
  // 获取地址相关
  findSet: any = {
    formId: 'consigneeCompanyId_pop',
    name: '详细地址',
    parameter: 'locationName',
    parameterSend: 'locationId',
    url: 'selectConsigneeCompanyId',
    'insertType': 'address',
    paramsSend: 'customerId'
  };// input-pop相关
  //收货单位获取相关
  findSetConsigeeCompanyId:any={
    formId:'form_bank_tan',name:'收货单位',parameter:'companyName',url:'getUserBusinessModuleIdV2'
  }
  customerId: any;   // 委托人id
  inputModalModel: any;  //
  inputModalModelConsigeeCompany:any
  title: any = '';
  // 页面grid
  // leftWidth: string = '49.5%';
  // lineWidth: string = '49.5%';
  // rightWidth: string = '49.5%';
  // display: string = 'block';
  // rightShow: boolean = false;
  gridOneHeight: string;
  gridTwoHeight: string;
  tempInfo: any = {};
  searchData: any = {}; // 存储查询条件
  bidPriceType = '10';    // 竞价类型
  taxInclusive = '10';    // 是否含税
  unitPrice = '10';
  listOfSelectedValue: string[] = [];
  carriageOfSelectedValue: string[] = [];
  bidderCompanyList: Array<any> = []; // 承运人数据存放---下拉加载用
  bidderCompanyListStorage: Array<any> = []; // 承运人数据
  driverListStorage: Array<any> = []; // 司机总数据存放---下拉加载用
  driverList: Array<any> = []; // 司机数据
  driverType: string;    // 司机类型
  consignorCompanyArr: Array<any> = [];   // 收货公司
  startPointArr: Array<any> = [];    //  装点数组
  startPointArr1: any = [];     //  装点数组克隆
  provinceArr: Array<any> = [];  //  省份 数组
  cityArr: Array<any> = [];   // 城市数组
  areaArr: Array<any> = []; // 地区数组
  dataSetAdd: any = [];    // 竞价委托 查询结果
  updatedataAdd: any = [];   // 明细数据
  productArr: any = [];
  flowIdArr: any = []; // 运输方式
  consigneeCompanyIdArr: any = []; // 收货单位
  businessModuleIdArr: any = []; // 业务板块
  ownerIdArr: any = [];
  continuityTypeArr: any = [];
  bidderDataArr: any = [];
  isVisible = false; // 修改重量弹窗
  isTenderNO = false;
  tendNo: any;
  tenderNoArr: any = [];
  flag = false;
  continueTimeArr: any[] = [
    {name: '自定义', value: '0'},
    {name: '10分钟', value: '10'},
    {name: '15分钟', value: '15'},
    {name: '20分钟', value: '20'},
    {name: '30分钟', value: '30'}];
  //   循环抢单持续时间数组
  circulationRobContinueTimeArr: Array<any> = [
    {name: '自定义', value: '0'},
    {name: '一天', value: '1440'},
    {name: '三天', value: '4320'},
    {name: '五天', value: '7200'},
    {name: '十五天', value: '21600'}];
  @ViewChild('recordTitle') recordTitle: TemplateRef<any>;
  @ViewChild('recordContent') recordContent: TemplateRef<any>;
  @ViewChild('recordFooter') recordFooter: TemplateRef<any>;

  @ViewChild('recordTitle1') recordTitle1: TemplateRef<any>;
  @ViewChild('recordContent1') recordContent1: TemplateRef<any>;
  @ViewChild('recordFooter1') recordFooter1: TemplateRef<any>;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  @ViewChild('tplTitle1') tplTitle1;
  @ViewChild('tplContentSHF') tplContentSHF;
  @ViewChild('tplContent1') tplContent1;
  @ViewChild('tplFooter1') tplFooter1;
  @ViewChild('tplTitle2') tplTitle2;
  @ViewChild('tplContent2') tplContent2;
  @ViewChild('tplFooter2') tplFooter2;
  @ViewChild('tplTitle5') tplTitle5;
  @ViewChild('tplContent5') tplContent5;
  @ViewChild('tplContentSHFAdd') tplContentSHFAdd;
  @ViewChild('tplFooter5') tplFooter5;
  @ViewChild('tplCDGCheader') tplCDGCheader;
  @ViewChild('tplCDGCbody') tplCDGCbody;
  @ViewChild('tplCDGCfooter') tplCDGCfooter;
  @ViewChild('tplAddheader') tplAddheader;
  @ViewChild('tplAddbody') tplAddbody;
  @ViewChild('tplAddfooter') tplAddfooter;
  @ViewChild('productName') productName: ElementRef;
  @ViewChild('vehicleNo1') vehicleNo1: ElementRef;
  @ViewChild('productName2') productName2: ElementRef;
  @ViewChild('vehicleNo2') vehicleNo2: ElementRef;
  @ViewChild('vehicleNo3') vehicleNo3: ElementRef;
  @ViewChild('tplTitle9') tplTitle9;
  @ViewChild('tplContent9') tplContent9;
  @ViewChild('tplFooter9') tplFooter9;
  @ViewChild('tplTitle99') tplTitle99;
  @ViewChild('tplContent99') tplContent99;
  @ViewChild('tplFooter99') tplFooter99;
  productName1: any;
  validateForm: FormGroup;
  validateForm1: FormGroup;
  validateFormAdd: FormGroup;
  price: any; //获取网站价格
  unit_price: any;
  web_price: any;
  recommend_price;
  flowDirectionArr: any = [];
  endPointDriver = false;
  // 导入文件模态框
  modalFormData: Array<any> = [
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请导入文件', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请导入文件', require: true, hidden: true,
      validators: {
        require: true,
        pattern: false
      }
    },
  ];
  controlArray: Array<any> = [
    {
      cName: '托运人', eName: 'consignorCompanyId', type: 'select', require: false, disabled: true, validateCon: '请选择托运人',
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '装点详细地址', eName: 'startPoint', type: 'select1  ', require: true, disabled: false, validateCon: '',
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      cName: '卸点省市区', eName: 'endPoint', type: 'select2', require: true, disabled: false, validateCon: '',
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      cName: '业务时间', eName: '', type: 'date', require: true, disabled: false, validateCon: '请选择业务时间',
      validators: {
        require: true,
        pattern: false,
      }
    },
  ];
  private buttonId: any;
  buttonId1: any;
  private columnsArr: any = [];

  pageCarriageSize = 30;
  totalCarriagePage = 0;
  pageDriverSize = 30;
  totalDriverPage = 0;
  carriageSeletedList: Array<any> = [];
  driverSeletedList: Array<any> = [];
  bidderSearchTmp: any;
  driverSearchTmp: any;
  searchCarriageValue: string;
  searchDriverValue: string;
  isChange = false;
  carTeamArr: Array<any> = [];
  carTeamCode: any;
  styleType: any;
  defaultBusinessModuleId: any;
  receivablePrice: any;
  btnUpdata = false;
  shouldPayPrice: any;       // 应付金额
  caculateEnameArr: any = [
    {field: 'allWeight', tipInfo: '已选总重量', tipInfoType: '吨', demLength: 3},
    {field: 'totalWeight', tipInfo: '已选待委托重量', tipInfoType: '吨', demLength: 3},
  ];
  businessNature: any;   // 业务性质
  businessNatureArr: any = [];
  loadDate: any;

  platerData: any;

  ifWeightPrice = false;
  weightPrice: any;

  /*
  *   初始化
  */
  ngOnInit() {


    this.searchList({page: 1, length: this.pageSize1});
    this.modalForm.executionTimeStart = new Date();
    this.modalForm.executionTimeEnd = addMinutes(this.modalForm.executionTimeStart, 10);
    /*const endDate = addMinutes("2019-05-14 12:59", 10);
    console.log(format(endDate, 'YYYY-MM-DD HH:mm'));
    const test = differenceInMinutes("2019-05-14 12:59", "2019-05-14 12:20");
    console.log(test);*/
    //  获取收货人列表
    this.getStatic(this.consignorCompanyArr, 'CYTYR');
    // 获取装点列表
    this.getStatic(this.startPointArr, 'CYZCD');
    //  获取地址信息
    this.getAddressData({level: 'DZDJ10'});
    //  查询  货物种类
    this.http.post(urls.selectProdNew, {}).then(
      (res: any) => {
        console.log(res);
        if (res.success) {
          const arr = [];
          res.data.data.forEach(item => {
            arr.push({name: item.prodKindPriceOut, value: item.prodKindPriceOut});
          });
          this.productArr = [...arr];
          console.log(this.productArr);
        }
      }
    );

    // 查询运输方式
    this.http.post(urls.selectFlowId, {}).then(
      (res: any) => {
        console.log(res);
        if (res.success) {
          const arr = [];
          console.log(res);
          res.data.data.forEach(item => {
            arr.push({name: item.flowName, value: item.flowId});
          });
          this.flowIdArr = [...arr];

        }
      }
    );


    this.http.post(urls.getUserBusinessModuleId, {}).then(
      (res: any) => {
        console.log(res);
        if (res.success) {
          const arr = [];
          console.log(res);
          res.data.data.forEach(item => {
            arr.push({name: item.segmentName, value: item.segmentId});
            if (item.isDefault === '1') {
              this.defaultBusinessModuleId = item.segmentId;
            }
          });
          this.businessModuleIdArr = [...arr];

        }
      }
    );

    // 获取收货单位数组
    this.http.post(urls.selectCompany, {}).then(
      (res: any) => {
        console.log(res);
        if (res.success) {
          const arr = [];
          console.log(res);
          res.data.data.forEach(item => {
            arr.push({name: item.companyName, value: item.companyId});
          });
          this.ownerIdArr = [...arr];
          this.consigneeCompanyIdArr = [...arr];

        }
      }
    );
    this.getStatic1(this.continuityTypeArr, 'LXX');


    // console.log(this.info.get('USER').companyId, 'companyId');
    this.getPlaterData();
  }

// 配列   委托调度/修改

  /*
  *   配列 配品名和总重量
  * */
  colName(data: any) {
    const productName = data.filter(x => x.colEname === 'productName');
    productName[0].tdTemplate = this.productName;
    data.forEach(item => {
      if (item.colEname === 'productName' || item.colEname === 'totalWeight') {
        item.required = true;
      }
    });
    console.log(data);
  }

  //  委托调度  新增  配列 底部 品种 参考用量等
  colName54(data: any) {
    const productName = data.filter(x => x.colEname === 'productName');
    productName[0].tdTemplate = this.productName2;
    data.forEach(item => {
      if (item.colEname === 'productName' || item.colEname === 'totalWeight') {
        item.required = true;
      }
    });
    console.log(data);
  }

  //   抢单持续时间
  duration(data: any, type?: string) {
    if (this.modalForm.continueTime != '0') {
      this.inputShow = false;
    }

    if (this.modalForm.executionTimeStart == null) {
      this.modalForm.executionTimeStart = null;
    } else {
      if (this.buttonId === 'circulationRob') {
        switch (type) {
          case 'select': {
            const endDate = addMinutes(this.modalForm.executionTimeStart, data);
            this.modalForm.executionTimeEnd = endDate;
          }
            break;
          case 'input': {
            const endDate = addMinutes(this.modalForm.executionTimeStart, data * 1440);
            this.modalForm.executionTimeEnd = endDate;
          }
            break;
        }

      } else {
        const endDate = addMinutes(this.modalForm.executionTimeStart, data);
        this.modalForm.executionTimeEnd = endDate;
      }

    }
// console.log(this.modalForm.continueTimeNew);
    if (this.modalForm.continueTime == '0' && !this.modalForm.continueTimeNew) {
      this.modalForm.executionTimeEnd = null;
    }
  }

  getTime(data: any) {
    if (this.buttonId === 'circulationRob') {
      this.inputShow = true;
      this.modalForm.continueTime = '0';
      // console.log(format(data, 'YYYY-MM-DD HH:mm'));
      const test = differenceInCalendarDays(format(data, 'YYYY-MM-DD HH:mm'), this.modalForm.executionTimeStart);
      this.modalForm.continueTimeNew = test.toString();
    } else {
      this.inputShow = true;
      this.modalForm.continueTime = '0';
      // console.log(format(data, 'YYYY-MM-DD HH:mm'));
      const test = differenceInMinutes(format(data, 'YYYY-MM-DD HH:mm'), this.modalForm.executionTimeStart);
      this.modalForm.continueTimeNew = test.toString();
    }

    if (data == null || this.modalForm.executionTimeStart == null) {
      this.modalForm.continueTimeNew = '';
    }
  }


  //    获取并验证起始时间
  getStartTime(data: any) {
    // this.inputShow = true;
    // this.modalForm.continueTime = '0'
    /*const test = differenceInMinutes(this.modalForm.executionTimeEnd,format(data, 'YYYY-MM-DD HH:mm'));
    this.modalForm.continueTimeNew = test.toString()*/
    /*console.log(this.modalForm.continueTime)
    console.log(this.modalForm.continueTimeNew)*/
    if (this.buttonId === 'circulationRob') {
      const endDate1 = addDays(format(data, 'YYYY-MM-DD HH:mm'), this.modalForm.continueTime != '0' ? this.modalForm.continueTime : this.modalForm.continueTimeNew);
      this.modalForm.executionTimeEnd = endDate1;
    } else {
      const endDate1 = addMinutes(format(data, 'YYYY-MM-DD HH:mm'), this.modalForm.continueTime != '0' ? this.modalForm.continueTime : this.modalForm.continueTimeNew);
      this.modalForm.executionTimeEnd = endDate1;
    }

    if (data == null || this.modalForm.executionTimeEnd == null) {
      this.modalForm.continueTimeNew = '';
      this.modalForm.executionTimeEnd = null;
    }

  }

  //   承运人 判断是竞价 还是 抢单
  selectChange(data: any) {
    // console.log(data)
    if (!data) {
      this.bidPriceType = undefined;
    }
  }

  //   司机  判断是竞价 还是 抢单
  changeDriver(data: any) {
    console.log(data);
    if (!data) {
      this.driverType = undefined;
    } else {
      this.driverType = '10';
    }
  }

  changeEndPointDriver(data:any){
    if(data){
      this.getDriverData({},this.itemUpdatedata[0].endCityName)
    }else{
      this.getDriverData()
    }
  }

  //    竞价委托  全部承运人/部分承运人
  carriageChuange(data: any) {
    // console.log(data)
    if (data == '10') {
      this.carriageOfSelectedValue = [];
    }
    this.getBidderCompany();
  }

  //   竞价委托   全部司机/部分司机
  driverChuange(data: any) {
    // console.log(data)
    if (data == '10') {
      this.listOfSelectedValue = [];
    }
    if(this.endPointDriver){

      this.getDriverData({},this.itemUpdatedata[0].endCityName);
    }else{
      this.getDriverData();
    }
  }


  /*
  *     查询列表
  */
  searchList(data: any) {
    this.searchData = data;
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }

  /*
  *    调用查询接口
  */
  getList1(data: any) {
    const url = TRANS_URLS.getEntrust;
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total;
        this.itemData = [];
      }
    });
  }


  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data: any): void {
    this.columnsArr = data;
  }

  /*
  *    按钮点击事件
  */

  btnCLick(data: any) {
    console.log(data);
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Import':
        this.btnImport();
        break;
      case 'Directional':
        this.btnDirectionalChoide();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Driver':
        this.btnDriver();
        break;
      case 'OrderBid': // 竞价委托
        this.btnEntrust();
        break;
      case 'Rob': // 抢单委托
        this.btnEntrust();
        break;
      case 'DriverGrab': // 司机抢单
        this.btnEntrust();
        break;
      case 'Add':
        this.btnAdd();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'UpdateWeight':
        this.btnUpdateWeight();
        break;
      case 'AddSchedule':
        this.btnAddSchedule();
        break;
      case 'circulationRob': // 循环抢单
        this.btnCirculationRob();
        break;
      case 'AutoCargo': //循环抢单
        this.btnAutoCargo();
        break;
      default:
        break;
    }
  }

  //   使用招投标结果
  tenderNo() {
    let flag = false;
    this.updatadata.forEach(item => {
      if (item.tenderNo) {
        flag = true;
      }
    });
    return flag;
  }


  /*
  * 弹窗取消
  */
  handleCancelUpdate() {
    this.isVisible = false;
    this.dataSetUpdateWeight = [];
  }

  /*
  *   修改重量
  */
  btnUpdateWeight() {
    if (this.updatadata.length !== 1) {
      this.nzMess.error('请只勾选一条委托信息');
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST40'], '勾选数据已取消，不可再修改重量')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST50'], '勾选数据已强制完成，不可再修改重量')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'orderSourceId', ['WTLY20', 'WTLY30', 'WTLY40', 'WTLY50', 'WTLY60'], '勾选数据不可修改重量 请重新勾选')) {
      return;
    }
    this.dataSetUpdateWeight = this.itemUpdatedata;
    this.dataSetUpdateWeight.forEach(item => {
      item.allWeight = Number(item.totalWeight) + Number(item.transWeight);
    });
    this.isVisible = true;
  }

  /**
   * 点击循环抢单
   */
  btnCirculationRob(): void {

    if (!this.updatadata || this.updatadata.length < 1 || (!this.itemUpdatedata || this.itemUpdatedata.length !== 1)) {
      if (this.buttonId === 'DriverGrab') {
        this.nzMess.error('请选择一条委托记录或至少一条明细！');
      } else {
        this.nzMess.error('循环抢单只能选择一条委托明细！');
      }
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST40'], '勾选数据已取消，不可再做循环抢单')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST50'], '勾选数据已强制完成，不可再做循环抢单')) {
      return;
    }
    if (this.tenderNo()) {
      this.nzMess.error('含有招标单号的委托只能进行定向委托');
      return;
    }
    if (this.equalStartPoint()) {
      return;
    }

    if (this.businessModuleIdIsEmpty()) {
      this.nzMess.error('选择的明细，业务板块不能为空！');
      return;
    }

    if (this.pointIsEmpty()) {
      this.nzMess.error('选择的明细，起点/终点名字不能为空！');
      return;
    }

    if (this.itemUpdatedata[0].startPoint === '') {
      this.nzMess.error('请维护装点');
      return;
    }
    if (this.itemUpdatedata[0].endPoint === '') {
      this.nzMess.error('请维护卸点');
      return;
    }


    if (this.isInputWeight()) {
      // this.nzMess.error('请给每条明细数据输入重量和件数')
      return;
    }

    /*if (this.equalBusinessModuleId()) {
      this.nzMess.error('选择业务模式相同的数据');
      return;
    }*/

    if (this.equalConsignorCompanyIdRoot()) {
      this.nzMess.error('选择主表来源公司相同的数据');
      return;
    }
    if (this.equalItemBusinessModuleId()) {
      this.nzMess.error('选择明细表业务模式相同的数据');
      return;
    }
    this.getStyleType(this.updatadata[0].businessModuleId);
    this.getDriverData(); // 查询司机
    this.inputShow = false;
    this.modalForm = {};
    this.tempInfo = {};

    this.tempInfo.driverPrice = true;
    this.bidPriceType = undefined;
    this.driverType = '10';

    this.carriageOfSelectedValue = [];
    this.listOfSelectedValue = [];
    this.tempInfo.lowerPriceTax = 0;
    this.modalForm.continueTime = '1440';
    this.taxInclusive = '10';
    this.unitPrice = '10';
    this.modalForm.executionTimeStart = new Date(new Date(new Date().toLocaleDateString()).getTime());
    this.modalForm.executionTimeEnd = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);

    this.modalTitle = `委托调度  > 循环抢单`;

    this.title = `流向：${this.itemUpdatedata[0].startLocationName}->${this.itemUpdatedata[0].endLocationName}  重量：${this.sumItemInputWeight()} `;
    window.setTimeout(() => {
      this.modalRef = this.nzModal.create({
        nzTitle: this.recordTitle,
        nzContent: this.recordContent,
        nzFooter: this.recordFooter,
        nzMaskClosable: false,
        nzWidth: '75%',
        nzStyle: {top: '0px'}
      });
    });

    this.modalRef.afterClose.subscribe(
      () => {
        this.carriageSeletedList = [];
        this.driverSeletedList = [];
        this.bidderSearchTmp = {};
        this.driverSearchTmp = {};
        this.searchCarriageValue = '';
        this.searchDriverValue = '';
      }
    );
  }

  /*
  * 修改重量弹窗确认按钮
  */
  handleOk() {
    for (let i = 0; i < this.dataSetUpdateWeight.length; i++) {
      if (!this.dataSetUpdateWeight[i].allWeight) {
        this.nz.error('提示信息', '请填写总重量!');
        return;
      }
      if (Number(this.dataSetUpdateWeight[i].allWeight) < Number(this.dataSetUpdateWeight[i].transWeight)) {
        this.nz.error('提示信息', '修改总重量不能小于调度重量，请重新输入！');
        return;
      }
      if (this.dataSetUpdateWeight[i].allWeight && this.dataSetUpdateWeight[i].allWeight.length > 18) {
        this.nz.error('提示信息', '输入总重量最多可以输入18位');
        return;
      }
    }
    const url = TRANS_URLS.updateWeight;
    let param: any = {};
    param = this.updatadata[0];
    param.tOrderItemModels = this.dataSetUpdateWeight;
    param.tOrderItemModels.forEach(item => {
      item.totalWeight = item.allWeight;
    });
    this.http.post(url, param).then(res => {
      if (res.success) {
        this.nz.create('success', '提示信息', '修改成功', {nzDuration: 3000});
        this.isVisible = false;
        this.dataSetUpdateWeight = [];
        this.searchList(this.tempSearchParam);
        this.itemUpdatedata = [];
        this.updatadata = [];
      }
    });
  }

  /*
  * 修改
  */
  btnUpdate() {
    if (this.updatadata.length !== 1) {
      this.nzMess.error('请勾选一条委托！');
      return;
    }
    if (this.updatadata[0].companyId != this.info.APPINFO.USER.companyId) {
      this.nzMess.error('该数据不可修改');
      return;
    }
    if (this.updatadata[0].status != 'ETST10' || this.itemData.filter(x => x.transWeight != 0).length > 0) {
      this.nzMess.error('所选委托单存在已调度数据，无法修改，请重新选择！');
      return;
    }
    this.btnUpdata = true;
    this.getStyleType(this.updatadata[0].businessModuleId);
    window.setTimeout(() => {
      if (this.styleType === 'CDC000000888') {
        this.validateForm1 = this.fb.group({
          consignorCompanyId: [null],
          startPoint: [null, [Validators.required]],
          flowId: [null, [Validators.required]],
          provinceId: [null, [Validators.required]],
          cityId: [null, [Validators.required]],
          consigneeCompanyId: [null, [Validators.required]],
          districtId: [null],
          businessTime: [null, [Validators.required]],
          pickNo: [null],
          continuityType: [null],
          businessModuleId: [null, [Validators.required]],
          endPoint: [null, [Validators.required]],
          mainProductListNo: [null],
        });
        this.validateForm1.reset();

        this.modalTitle = '委托调度 > 修改';
        this.tplModal1 = this.nm.create({
          nzTitle: this.tplTitle5,
          nzContent: this.tplContent5,
          nzFooter: this.tplFooter5,
          nzWidth: '50%',
          nzMaskClosable: false,
          nzClosable: false,
        });
        this.flag = true;
        const url = TRANS_URLS.selectEntrust;
        let param: any;
        param = this.updatadata[0];
        this.http.post(url, param).then(res => {
          if (res.success) {
            console.log(res);
            this.validateForm1.get('consignorCompanyId').setValue(res.data.data.consignorCompanyId);
            this.validateForm1.get('startPoint').setValue(res.data.data.tOrderItemModels[0].startPoint);
            this.validateForm1.get('provinceId').setValue(res.data.data.tOrderItemModels[0].endProvinceCode);
            this.validateForm1.get('cityId').setValue(res.data.data.tOrderItemModels[0].endCityCode);
            this.validateForm1.get('districtId').setValue(res.data.data.tOrderItemModels[0].endDistrictCode);
            this.validateForm1.get('businessTime').setValue(res.data.data.businessTime);
            this.validateForm1.get('flowId').setValue(res.data.data.flowId);
            this.validateForm1.get('pickNo').setValue(res.data.data.pickNo);
            // this.validateForm1.get('consigneeCompanyId').setValue(res.data.data.consigneeCompanyId);
            this.validateForm1.get('mainProductListNo').setValue(res.data.data.mainProductListNo);
            let consigeeCompanyID :any={selData:[]};
            consigeeCompanyID .selData.push({companyId:res.data.data.consigneeCompanyId,companyName:res.data.data.companyName})
            this.inpEmitConsigeeComanyId(consigeeCompanyID)
            console.log(111);
            this.validateForm1.get('continuityType').setValue(res.data.data.tOrderItemModels[0].continuityType);
            this.validateForm1.get('businessModuleId').setValue(res.data.data.businessModuleId);
            this.validateForm1.get('endPoint').setValue(res.data.data.tOrderItemModels[0].endPoint);
            this.dataSetAdd = res.data.data.tOrderItemModels;
            this.inputModalModel = res.data.data.tOrderItemModels[0].endLocationName;
            this.inputModalModelConsigeeCompany = res.data.data.consigneeCompanyName;
            this.dataSetAdd = [...this.dataSetAdd];
            this.customerId = res.data.data.consigneeCompanyId;
            console.log(this.validateForm1.getRawValue());
          }
        });
      } else if (this.styleType === 'SHC000000882') {
        this.validateForm1 = this.fb.group({
          consignorCompanyId: [null],
          startPoint: [null, [Validators.required]],
          flowId: [null, [Validators.required]],
          provinceId: [null, [Validators.required]],
          cityId: [null, [Validators.required]],
          consigneeCompanyId: [null, [Validators.required]],
          districtId: [null],
          businessTime: [null, [Validators.required]],
          pickNo: [null],
          continuityType: [null],
          businessModuleId: [null, [Validators.required]],
          endPoint: [null, [Validators.required]],
          mainProductListNo: [null],
        });
        this.validateForm1.reset();

        this.modalTitle = '委托调度 > 修改';
        this.tplModal1 = this.nm.create({
          nzTitle: this.tplTitle5,
          nzContent: this.tplContentSHFAdd,
          nzFooter: this.tplFooter5,
          nzWidth: '50%',
          nzMaskClosable: false,
          nzClosable: false,
        });
        this.flag = true;
        const url = TRANS_URLS.selectEntrust;
        let param: any;
        param = this.updatadata[0];
        this.http.post(url, param).then(res => {
          if (res.success) {
            console.log(res);
            this.validateForm1.get('consignorCompanyId').setValue(res.data.data.consignorCompanyId);
            this.validateForm1.get('startPoint').setValue(res.data.data.tOrderItemModels[0].startPoint);
            this.validateForm1.get('provinceId').setValue(res.data.data.tOrderItemModels[0].endProvinceCode);
            this.validateForm1.get('cityId').setValue(res.data.data.tOrderItemModels[0].endCityCode);
            this.validateForm1.get('districtId').setValue(res.data.data.tOrderItemModels[0].endDistrictCode);
            this.validateForm1.get('businessTime').setValue(res.data.data.businessTime);
            this.validateForm1.get('flowId').setValue(res.data.data.flowId);
            this.validateForm1.get('pickNo').setValue(res.data.data.pickNo);
            // this.validateForm1.get('consigneeCompanyId').setValue(res.data.data.consigneeCompanyId);
            let consigeeCompanyID :any={selData:[]};
            consigeeCompanyID .selData.push({companyId:res.data.data.consigneeCompanyId,companyName:res.data.data.companyName})
            this.inpEmitConsigeeComanyId(consigeeCompanyID)
            console.log(111);
            this.validateForm1.get('continuityType').setValue(res.data.data.tOrderItemModels[0].continuityType);
            this.validateForm1.get('businessModuleId').setValue(res.data.data.businessModuleId);
            this.validateForm1.get('endPoint').setValue(res.data.data.tOrderItemModels[0].endPoint);
            this.dataSetAdd = res.data.data.tOrderItemModels;
            this.inputModalModel = res.data.data.tOrderItemModels[0].endLocationName;
            this.inputModalModelConsigeeCompany = res.data.data.consigneeCompanyName;
            this.dataSetAdd = [...this.dataSetAdd];
            this.customerId = res.data.data.consigneeCompanyId;
            console.log(this.validateForm1.getRawValue());
          }
        });
      } else if (this.styleType === 'RGC000000882') {
        this.validateForm1 = this.fb.group({
          consignorCompanyId: [null],
          startPoint: [null, [Validators.required]],
          flowId: [null, [Validators.required]],
          provinceId: [null, [Validators.required]],
          cityId: [null, [Validators.required]],
          districtId: [null],
          businessTime: [null, [Validators.required]],
          pickNo: [null],
          continuityType: [null],
          businessModuleId: [null, [Validators.required]],
          endPoint: [null],
          mainProductListNo: [null],
        });
        this.validateForm1.reset();
        // if (this.updatadata[0].totalWeight !== this.updatadata[0].allWeight) {
        //   this.tplModal = this.nm.warning({
        //     nzTitle: '提示信息',
        //     nzContent: '所选委托单存在已调度数据，无法修改，请重新选择！'
        //   });
        // }
        this.modalTitle = '委托调度 > 修改';
        this.tplModal1 = this.nm.create({
          nzTitle: this.tplTitle9,
          nzContent: this.tplContent9,
          nzFooter: this.tplFooter9,
          nzWidth: '50%',
          nzMaskClosable: false,
          nzClosable: false,
        });
        this.flag = true;
        const url = TRANS_URLS.selectEntrust;
        let param: any;
        param = this.updatadata[0];
        this.http.post(url, param).then(res => {
          if (res.success) {
            console.log(res);
            this.validateForm1.get('consignorCompanyId').setValue(res.data.data.consignorCompanyId);
            this.validateForm1.get('startPoint').setValue(res.data.data.tOrderItemModels[0].startPoint);
            this.validateForm1.get('provinceId').setValue(res.data.data.tOrderItemModels[0].endProvinceCode);
            this.validateForm1.get('cityId').setValue(res.data.data.tOrderItemModels[0].endCityCode);
            this.validateForm1.get('districtId').setValue(res.data.data.tOrderItemModels[0].endDistrictCode);
            this.validateForm1.get('businessTime').setValue(res.data.data.businessTime);
            this.validateForm1.get('flowId').setValue(res.data.data.flowId);
            this.validateForm1.get('pickNo').setValue(res.data.data.pickNo);
            // this.validateForm1.get('consigneeCompanyId').setValue(res.data.data.consigneeCompanyId);
            console.log(111);

            this.validateForm1.get('continuityType').setValue(res.data.data.tOrderItemModels[0].continuityType);
            this.validateForm1.get('businessModuleId').setValue(res.data.data.businessModuleId);
            this.dataSetAdd = res.data.data.tOrderItemModels;
            this.inputModalModel = res.data.data.tOrderItemModels[0].endLocationName;
            this.dataSetAdd = [...this.dataSetAdd];
            this.customerId = res.data.data.consigneeCompanyId;
            console.log(this.validateForm1.getRawValue());
          }
        });
      }
    }, 1000);
    // this.modalTitle = '委托调度 > 修改';
    // this.tplModal = this.nm.create({
    //   nzTitle: this.tplTitle5,
    //   nzContent: this.tplContent5,
    //   nzFooter: this.tplFooter5,
    //   nzWidth: '50%',
    //   nzMaskClosable: false,
    //   nzClosable: false,
    // });

  }

  /*
  *   新增界面明细按钮
  */
  btnCLick1(data: any) {
    this.buttonId1 = data.buttonId;
    switch (this.buttonId1) {
      case 'Additem':
        this.btnAddItem();
        break;
      case 'Deleteitem':
        this.btnDeleteItem();
        break;
      default:
        break;
    }
  }

  /*
  * 新增明细
  */
  btnAddItem() {
    this.dataSetAdd.push({checked: true, productName: this.productArr[0].value});
    this.dataSetAdd = [...this.dataSetAdd];
    this.updatedataAdd = this.dataSetAdd.filter(item => item.checked);
  }

  /*
  *   删除明细
  */
  btnDeleteItem() {
    if (this.dataSetAdd.filter(item => item.checked).length == 0) {
      this.nzMess.warning('请至少选择一条委托信息');
      return;
    }
    let deleteIndex = 0;
    this.dataSetAdd.forEach(item => item.checked ? this.dataSetAdd.splice(deleteIndex, 1) : deleteIndex++);
    this.dataSetAdd = this.dataSetAdd.filter(item => !item.checked);

    let arr: any = [];
    Object.assign(arr, this.dataSetAdd);
    arr = arr.filter(item => item.checked);
    // this.selectedLength = arr.length;
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

  /*
  *   新增
  */
  btnAdd() {

    if (this.defaultBusinessModuleId == undefined) {
      this.nzMess.error('请给用户配置默认业务板块');
      return;
    }
    this.getStyleType(this.defaultBusinessModuleId);
    window.setTimeout(() => {
      console.log(this.styleType);
      if (this.styleType === 'CDC000000888') {
        this.validateForm1 = this.fb.group({
          consignorCompanyId: [null],
          startPoint: [null, [Validators.required]],
          flowId: [null, [Validators.required]],
          provinceId: [null, [Validators.required]],
          cityId: [null, [Validators.required]],
          consigneeCompanyId: [null, [Validators.required]],
          districtId: [null],
          businessTime: [null, [Validators.required]],
          pickNo: [null],
          continuityType: [null],
          businessModuleId: [null, [Validators.required]],
          endPoint: [null, [Validators.required]],
          mainProductListNo: [null],

        });
        this.inputModalModel = null;
        this.validateForm1.reset();
        this.validateForm1.get('provinceId').reset({value: null, disabled: false});
        this.validateForm1.get('cityId').reset({value: null, disabled: true});
        this.validateForm1.get('districtId').reset({value: null, disabled: true});
        this.dataSetAdd = [];
        this.modalTitle = '委托调度 > 新增';
        this.tplModal1 = this.nm.create({
          nzTitle: this.tplTitle5,
          nzContent: this.tplContent5,
          nzFooter: this.tplFooter5,
          nzWidth: '50%',
          nzMaskClosable: false,
          nzClosable: false,
        });
        this.startPointArr1 = this.selectZCD(this.startPointArr, this.consignorCompanyArr[0].value);
        this.validateForm1.get('consignorCompanyId').setValue(this.consignorCompanyArr[0].value);
        this.validateForm1.get('startPoint').setValue(this.startPointArr1[0] && this.startPointArr1[0].value || '');
        // this.validateForm1.get('consigneeCompanyId').setValue(this.consigneeCompanyIdArr[0].value);
        this.validateForm1.get('flowId').setValue(this.flowIdArr[0].value);
        // this.modelchangeConsigneeCompanyId(this.consigneeCompanyIdArr[0].value);
        this.validateForm1.get('businessTime').setValue(this.getLocalTime());
        this.validateForm1.get('businessModuleId').setValue(this.defaultBusinessModuleId);
        this.validateForm1.get('continuityType').setValue('LXX10');
        this.dataSetAdd.push({checked: true, productName: this.productArr[0].value});
        this.dataSetAdd = [...this.dataSetAdd];
        this.updatedataAdd = this.dataSetAdd.filter(item => item.checked);
        return;
      } else if (this.styleType === 'SHC000000882') {
        this.validateForm1 = this.fb.group({
          consignorCompanyId: [null],
          startPoint: [null, [Validators.required]],
          flowId: [null, [Validators.required]],
          provinceId: [null, [Validators.required]],
          cityId: [null, [Validators.required]],
          consigneeCompanyId: [null, [Validators.required]],
          districtId: [null],
          businessTime: [null, [Validators.required]],
          pickNo: [null],
          continuityType: [null],
          businessModuleId: [null, [Validators.required]],
          endPoint: [null, [Validators.required]],
          mainProductListNo: [null],

        });
        this.inputModalModel = null;
        this.validateForm1.reset();
        this.validateForm1.get('provinceId').reset({value: null, disabled: false});
        this.validateForm1.get('cityId').reset({value: null, disabled: true});
        this.validateForm1.get('districtId').reset({value: null, disabled: true});
        this.dataSetAdd = [];
        this.modalTitle = '委托调度 > 新增';
        this.tplModal1 = this.nm.create({
          nzTitle: this.tplTitle5,
          nzContent: this.tplContentSHFAdd,
          nzFooter: this.tplFooter5,
          nzWidth: '50%',
          nzMaskClosable: false,
          nzClosable: false,
        });
        this.startPointArr1 = this.selectZCD(this.startPointArr, this.consignorCompanyArr[0].value);
        this.validateForm1.get('consignorCompanyId').setValue(this.consignorCompanyArr[0].value);
        this.validateForm1.get('startPoint').setValue(this.startPointArr1[0] && this.startPointArr1[0].value || '');
        this.validateForm1.get('consigneeCompanyId').setValue(this.consigneeCompanyIdArr[0].value);
        this.validateForm1.get('flowId').setValue(this.flowIdArr[0].value);
        this.modelchangeConsigneeCompanyId(this.consigneeCompanyIdArr[0].value);
        this.validateForm1.get('businessTime').setValue(this.getLocalTime());
        this.validateForm1.get('businessModuleId').setValue(this.defaultBusinessModuleId);
        this.validateForm1.get('continuityType').setValue('LXX10');
        this.dataSetAdd.push({checked: true, productName: this.productArr[0].value});
        this.dataSetAdd = [...this.dataSetAdd];
        this.updatedataAdd = this.dataSetAdd.filter(item => item.checked);
        return;
      } else if (this.styleType === 'RGC000000882') {
        this.validateForm1 = this.fb.group({
          consignorCompanyId: [null],
          startPoint: [null, [Validators.required]],
          flowId: [null, [Validators.required]],
          provinceId: [null, [Validators.required]],
          cityId: [null, [Validators.required]],
          consigneeCompanyId: [null],
          districtId: [null],
          businessTime: [null, [Validators.required]],
          pickNo: [null],
          continuityType: [null],
          businessModuleId: [null, [Validators.required]],
          mainProductListNo: [null],

        });
        this.inputModalModel = null;
        this.validateForm1.reset();
        this.validateForm1.get('provinceId').reset({value: null, disabled: false});
        this.validateForm1.get('cityId').reset({value: null, disabled: true});
        this.validateForm1.get('districtId').reset({value: null, disabled: true});
        this.dataSetAdd = [];
        this.modalTitle = '委托调度 > 新增';
        this.tplModal1 = this.nm.create({
          nzTitle: this.tplTitle9,
          nzContent: this.tplContent9,
          nzFooter: this.tplFooter9,
          nzWidth: '50%',
          nzMaskClosable: false,
          nzClosable: false,
        });
        this.startPointArr1 = this.selectZCD(this.startPointArr, this.consignorCompanyArr[0].value);
        this.validateForm1.get('consignorCompanyId').setValue(this.consignorCompanyArr[0].value);
        this.validateForm1.get('startPoint').setValue(this.startPointArr1[0] && this.startPointArr1[0].value || '');
        this.validateForm1.get('flowId').setValue(this.flowIdArr[0].value);
        this.showPagination = false;
        // this.modelchangeConsigneeCompanyId(this.consigneeCompanyIdArr[0].value);
        this.validateForm1.get('businessTime').setValue(this.getLocalTime());
        this.validateForm1.get('businessModuleId').setValue(this.defaultBusinessModuleId);
        this.validateForm1.get('continuityType').setValue('LXX10');
        this.dataSetAdd.push({checked: true, productName: this.productArr[0].value});
        this.dataSetAdd = [...this.dataSetAdd];
        this.updatedataAdd = this.dataSetAdd.filter(item => item.checked);
        return;
      }
    }, 1000);
  }

  businessModelChangeAdd(data: any) {
    if (this.btnUpdata) {
      this.btnUpdata = false;
      return;
    }
    if (this.buttonId === 'Update') {
      this.modalTitle = '委托调度 > 修改';
    } else {
      this.modalTitle = '委托调度 > 新增';
    }
    this.http.post(urls.getStyleValue, {segmentId: data, setCode: 'formType'}).then(res => {
      console.log(res);
      if (res.success) {
        const style = res.data.data[0] && res.data.data[0].value || 'RGC000000882';
        if (this.styleType !== style) {
          this.styleType = style;
          this.tplModal.destroy();
          window.setTimeout(() => {
            if (this.styleType === 'CDC000000888' ) {

              this.tplModal1 = this.nm.create({
                nzTitle: this.tplTitle5,
                nzContent: this.tplContent5,
                nzFooter: this.tplFooter5,
                nzWidth: '50%',
                nzMaskClosable: false,
                nzClosable: false,
              });
            } else if (this.styleType === 'SHC000000882') {

              this.tplModal1 = this.nm.create({
                nzTitle: this.tplTitle5,
                nzContent: this.tplContentSHFAdd,
                nzFooter: this.tplFooter5,
                nzWidth: '50%',
                nzMaskClosable: false,
                nzClosable: false,
              });
            }else if(this.styleType==='RGC000000882'){
              this.tplModal1 = this.nm.create({
                nzTitle: this.tplTitle9,
                nzContent: this.tplContent9,
                nzFooter: this.tplFooter9,
                nzWidth: '50%',
                nzMaskClosable: false,
                nzClosable: false,
              });
            }
          }, 1000);
        }
      }
    });
  }


  //   查询业务板块
  getStyleType(data: any) {
    this.http.post(urls.getStyleValue, {segmentId: data, setCode: 'formType'}).then(res => {
      console.log(res);
      if (res.success) {
        const style = res.data.data[0] && res.data.data[0].value || 'RGC000000882';
        this.styleType = style;
      }
    });
  }

  getLocalTime() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1)
      : nowDate.getMonth() + 1;
    const day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate
      .getDate();
    const dateStr1: string = year + '-' + month + '-' + day;
    return dateStr1;
  }

  /*
  *     车辆调度
  */
  btnDriver() {
    if (!this.ifMutli()) {
      this.isMutli = true;
    } else {
      this.isMutli = false;
    }
    if (!this.updatadata || this.updatadata.length < 1 || (!this.itemUpdatedata || this.itemUpdatedata.length < 1)) {
      this.nzMess.error('请选择一条委托记录！');
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST40'], '勾选数据已取消，不可再做车辆调度')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST50'], '勾选数据已强制完成，不可再做车辆调度')) {
      return;
    }
    // if (this.tenderNo()) {
    //   this.nzMess.error('含有招标单号的委托只能进行定向委托');
    //   return;
    // }
    if (this.equalStartPoint()) {
      return;
    }
    if (this.isInputWeight()) {
      // this.nzMess.error('请给每条明细数据输入重量和件数')
      return;
    }


    const param: any = {
      companyId: this.updatadata[0].consignorCompanyIdRoot,
      platerCompanyId: this.info.APPINFO.USER.companyId,
    };

    this.http.post(urls.selectDriverData, param).then(res => {
      if (res.success) {
        this.dataSet4 = res.data.data;
      }
    });
    window.setTimeout(() => {
      if (this.itemUpdatedata[0].businessModuleId === '020') {
        console.log(this.updatadata[0]);
        this.getCarTeam();
        this.modalTitle = '委托调度 > 车辆调度';
        this.tplModal = this.nm.create({
          nzTitle: this.tplTitle99,
          nzContent: this.tplContent99,
          nzFooter: this.tplFooter99,
          nzWidth: '40%',
          nzMaskClosable: false,
          nzClosable: false,
        });
        return;
      } else {
        this.modalTitle = '委托调度 > 车辆调度';
        this.tplModal = this.nm.create({
          nzTitle: this.tplTitle2,
          nzContent: this.tplContent2,
          nzFooter: this.tplFooter2,
          nzWidth: '40%',
          nzMaskClosable: false,
          nzClosable: false,
        });

      }
    }, 1000);
    this.getStyleType(this.updatadata[0].businessModuleId);
    // let url = TRANS_URLS.getDriver;
    // this.loading1 = true;
    // let param: any = {companyId: this.info.APPINFO.USER.companyId, authStatus: 'RZZT90'};//获取对应车队的车辆
    // this.http.post(url, param).then((res: any) => {
    //   if (res.success) {
    //     this.dataSet4 = res.data.data.data;
    //     // @ts-ignore
    //     setTimeout(this.loadFalse(), 3000);
    //   }
    // });


  }

  /*
  *  终止加载
  */
  loadFalse() {
    this.loading1 = false;
  }

  // 查询承运人
  getBidderCompany(data = {bidderCompanyName: ''}) {
    this.bidderCompanyList = [];
    const params: any = {
      ...data,
      businessModuleId: this.itemUpdatedata[0].businessModuleId,
    };
    this.bidderSearchTmp = params;
    // console.log(params)
    this.http.post(urls.getBidderCompanyData, params).then((res: any) => {
      if (res.success) {
        this.bidderCompanyListStorage = res.data.data || [];
        this.totalCarriagePage = res.data.data.total;
        if (this.bidderCompanyListStorage.length > 0) {
          this.bidderCompanyList = [...this.bidderCompanyListStorage];
        }
        // if (this.carriageSeletedList.length !== 0) {
        //   this.carriageSeletedList.forEach(
        //     value => {
        //       this.bidderCompanyList.forEach(
        //         value1 => {
        //           if (value === value1.companyId) {
        //             value1.checked = true;
        //           }
        //         }
        //       );
        //     }
        //   );
        // }
      }
    });
  }

  // 查询司机
  getDriverData(data = {},endPoint?:any) {
    this.driverList = [];
    const params: any = {
      ...data,
      // platerCompanyId: 'C000002001',
      platerCompanyId: this.platerData,
      businessModuleId: this.itemUpdatedata[0].businessModuleId,
      companyId: this.updatadata[0].consignorCompanyIdRoot || this.itemUpdatedata[0].consignorCompanyIdRoot,
      endCityName:endPoint
    };
    // console.log(params)
    if (!params.platerCompanyId) {
      // console.log(944)
      // this.nzMess.warning('公司静态数据无单车车队');
    }
    this.driverSearchTmp = params;
    let url = '';
    console.log(this.styleType)
   if((this.buttonId==='circulationRob'||this.buttonId==='DriverGrab')&&endPoint){
      url = urls.selectUserIdbyLocationId
    }else{
      url = urls.selectUserId;
    }
    this.http.post(url, params).then((res: any) => {
      if (res.success) {
        this.driverListStorage = res.data.data && res.data.data.data || [];
        this.totalDriverPage = res.data.data.total;
        this.driverList = [...this.driverListStorage];
        if (url === urls.selectUserId||url ===urls.selectUserIdbyLocationId) {
          this.driverListStorage.forEach(
            value => value.name = value.name + `(${value.mobile})`
          );
        }
        // if (this.driverListStorage.length > 0) {
        //   this.driverList = [...this.driverList, ...this.driverListStorage.slice(0, 10)];
        // }
        // this.driverList = res.data.data || [];

        // if (this.driverSeletedList.length !== 0) {
        //   this.driverSeletedList.forEach(
        //     value => {
        //       this.driverList.forEach(
        //         value1 => {
        //           if (value === value1.userId) {
        //             value1.checked = true;
        //           }
        //         }
        //       );
        //     }
        //   );
        // }
      }
    });
  }

  getPlaterData() {
    const url = urls.getTStaticCompany;
    const params: any = {
      valueSetCode: 'DCCD'
    };
    this.http.post(url, params).then((res: any) => {
      if (res.success) {
        console.log(res);
        if (res.data.data.length != 0) {
          this.platerData = res.data.data[0].value;
          console.log(this.platerData);
        }

      }
    });
  }

  // 委托司机/承运人下拉输入框搜索
  onSearch(value: string, status: number) {
    if (value) {
      if (!status) {
        this.bidderCompanyList = this.bidderCompanyListStorage;
      } else {
        this.driverList = this.driverListStorage;
      }
    } else {
      if (!status) {
        this.bidderCompanyList = [];
        this.bidderCompanyList = [...this.bidderCompanyList, ...this.bidderCompanyListStorage.slice(0, 10)];
      } else {
        this.driverList = [];
        this.driverList = [...this.driverList, ...this.driverListStorage.slice(0, 10)];
      }
    }
  }

  // 委托司机/承运人下拉加载更多
  loadMore(status) {
    let length: any = 0;
    if (!status) {
      length = this.bidderCompanyList.length;
      this.bidderCompanyList = [...this.bidderCompanyList, ...this.bidderCompanyListStorage.slice(length, length + 10)];
    } else {
      length = this.driverList.length;
      this.driverList = [...this.driverList, ...this.driverListStorage.slice(length, length + 10)];
    }
  }

  // 选择司机
  isNotSelected(value, flag): boolean {
    if (flag === 'carriage') {
      return this.carriageOfSelectedValue.indexOf(value) === -1;
    } else {
      return this.listOfSelectedValue.indexOf(value) === -1;
    }

  }

  delectDriver(role, index) {
    if (role === 'driver') {
      this.listOfSelectedValue.splice(index, 1);
    } else {
      this.carriageOfSelectedValue.splice(index, 1);
    }
    // $scope.valueObj.carrier.name.splice($.inArray(e,$scope.valueObj.carrier.name), 1);
  }

  // 竞价/抢单/司机抢单（司机抢单只可选择一条委托记录）
  btnEntrust() {

    if (!this.updatadata || this.updatadata.length < 1 || (!this.itemUpdatedata || this.itemUpdatedata.length < 1)) {
      if (this.buttonId === 'DriverGrab') {
        // console.log(this.buttonId)
        this.nzMess.error('请选择一条委托记录或至少一条明细！');
      } else {
        this.nzMess.error('请选择一条或者多条委托记录和明细！');
      }
      return;
    }
    if (this.updatadata.length > 1 && this.buttonId === 'DriverGrab') {
      this.nzMess.error('只可选择一条委托记录！');
      return;
    }
    if (this.updatadata.length && this.buttonId === 'OrderBid') {
      console.log('1122');
      console.log(this.updatadata);
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST40'], '勾选数据已取消，不可再做操作')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST50'], '勾选数据已强制完成，不可再做操作')) {
      return;
    }
    if (this.tenderNo()) {
      this.nzMess.error('含有招标单号的委托只能进行定向委托');
      return;
    }

    if (this.pointIsEmpty()) {
      this.nzMess.error('选择的明细，起点/终点名字不能为空！');
      return;
    }

    if (this.businessModuleIdIsEmpty()) {
      this.nzMess.error('选择的明细，业务板块不能为空！');
      return;
    }


    console.log(this.updatadata);
    console.log(this.itemUpdatedata);
    console.log(this.itemUpdatedata[0].endPoint);
    console.log(this.buttonId);
    // if( this.itemUpdatedata[0].transWeight  === '0.000') {
    //     console.log(222)
    //     this.nzMess.error('请维护装点');
    //     return;
    //   }

    if (this.itemUpdatedata[0].startPoint === '') {
      this.nzMess.error('请维护装点');
      return;
    }
    if (this.itemUpdatedata[0].endPoint === '') {
      this.nzMess.error('请维护卸点');
      return;
    }

    if (this.isInputWeight()) {
      // this.nzMess.error('请给每条明细数据输入重量和件数')
      return;
    }

    /*if (this.equalBusinessModuleId()) {
      this.nzMess.error('选择业务模式相同的数据');
      return;
    }*/
    if (this.equalConsignorCompanyIdRoot()) {
      this.nzMess.error('选择来源公司相同的数据');
      return;
    }
    if (this.equalItemBusinessModuleId()) {
      this.nzMess.error('选择明细表业务模式相同的数据');
      return;
    }
    this.getStyleType(this.updatadata[0].businessModuleId);
    this.getDriverData(); // 查询司机
    this.inputShow = false;
    this.modalForm = {};
    this.tempInfo = {};
    if (this.buttonId !== 'DriverGrab') {
      this.getBidderCompany(); // 查询承运人
      this.tempInfo.carriiagePrice = true;
      this.bidPriceType = '10';
      this.driverType = undefined;
    } else {
      this.tempInfo.driverPrice = true;
      this.bidPriceType = undefined;
      this.driverType = '10';
    }
    this.carriageOfSelectedValue = [];
    this.listOfSelectedValue = [];
    this.tempInfo.lowerPriceTax = 0;
    this.modalForm.continueTime = '10';
    this.taxInclusive = '10';
    this.unitPrice = '10';
    this.modalForm.executionTimeStart = new Date();
    this.recordTitleList = [];
    this.modalForm.executionTimeEnd = addMinutes(this.modalForm.executionTimeStart, 10);
    if (this.buttonId === 'OrderBid') {
      this.modalTitle = `委托调度  > 竞价委托`;
      this.modalRef = this.nzModal.create({
        nzTitle: this.recordTitle,
        nzContent: this.recordContent,
        nzFooter: this.recordFooter,
        nzMaskClosable: false,
        nzWidth: '1200px',
        nzStyle: {top: '0px'}
      });
      this.itemUpdatedata.forEach(item => {
        let orderNoList: any = [];
        this.recordTitleList.forEach(item1 => {
          if (orderNoList.indexOf(item1.orderNo)) {
            orderNoList.push(item1.orderNo);
          }
        });
        if (orderNoList.indexOf(item.orderNo) < 0) {
          this.recordTitleList.push(item);
          this.recordTitleList.forEach(item2 => {
            item2.inputWeight1 = item2.inputWeight;
          });
        } else {
          this.recordTitleList.forEach(item1 => {
            if (item1.orderNo === item.orderNo) {
              item1.inputWeight1 = this.isNotANumber(Number(item1.inputWeight1)) + this.isNotANumber(Number(item.inputWeight));
            }
          });
        }
      });
      this.modalRef.afterClose.subscribe(
        () => {
          this.carriageSeletedList = [];
          this.driverSeletedList = [];
          this.bidderSearchTmp = {};
          this.driverSearchTmp = {};
          this.searchCarriageValue = '';
          this.searchDriverValue = '';
        }
      );
    } else if (this.buttonId === 'Rob' && this.styleType === 'RGC000000882') {
      this.modalTitle = `委托调度  > 抢单委托`;
      this.modalRef = this.nzModal.create({
        nzTitle: this.recordTitle1,
        nzContent: this.recordContent1,
        nzFooter: this.recordFooter1,
        nzMaskClosable: false,
        nzWidth: '1200px',
        nzStyle: {top: '0px'}
      });

      this.itemUpdatedata.forEach(item => {
        let orderNoList: any = [];
        this.recordTitleList.forEach(item1 => {
          if (orderNoList.indexOf(item1.orderNo)) {
            orderNoList.push(item1.orderNo);
          }
        });
        if (orderNoList.indexOf(item.orderNo) < 0) {
          this.recordTitleList.push(item);
          this.recordTitleList.forEach(item2 => {
            item2.inputWeight1 = item2.inputWeight;
          });
        } else {
          this.recordTitleList.forEach(item1 => {
            if (item1.orderNo === item.orderNo) {
              item1.inputWeight1 = this.isNotANumber(Number(item1.inputWeight1)) + this.isNotANumber(Number(item.inputWeight));
            }
          });
        }
      });
      this.modalRef.afterClose.subscribe(
        () => {
          this.carriageSeletedList = [];
          this.driverSeletedList = [];
          this.bidderSearchTmp = {};
          this.driverSearchTmp = {};
          this.searchCarriageValue = '';
          this.searchDriverValue = '';
        }
      );

      return;
    } else if (this.styleType !== 'RGC000000882' && this.buttonId === 'Rob') {
      this.modalTitle = `委托调度  > 抢单委托`;
      this.loadDate = new Date();
      this.modalRef = this.nzModal.create({
        nzTitle: this.recordTitle,
        nzContent: this.recordContent,
        nzFooter: this.recordFooter,
        nzMaskClosable: false,
        nzWidth: '1200px',
        nzStyle: {top: '0px'}
      });
      this.modalRef.afterClose.subscribe(
        () => {
          this.carriageSeletedList = [];
          this.driverSeletedList = [];
          this.bidderSearchTmp = {};
          this.driverSearchTmp = {};
          this.searchCarriageValue = '';
          this.searchDriverValue = '';
        }
      );
    } else {
      this.modalTitle = `委托调度  > 司机抢单`;
      this.modalRef = this.nzModal.create({
        nzTitle: this.recordTitle,
        nzContent: this.recordContent,
        nzFooter: this.recordFooter,
        nzMaskClosable: false,
        nzWidth: '1200px',
        nzStyle: {top: '0px'}
      });
      this.modalRef.afterClose.subscribe(
        () => {
          this.carriageSeletedList = [];
          this.driverSeletedList = [];
          this.bidderSearchTmp = {};
          this.driverSearchTmp = {};
          this.searchCarriageValue = '';
          this.searchDriverValue = '';
        }
      );
    }


    // this.title = `流向：${this.itemUpdatedata[0].startLocationName}->${this.itemUpdatedata[0].endLocationName}  重量：${this.sumItemInputWeight()} `;

    console.log(this.styleType);
  }

  /**
   * 竞价委托
   * @param id
   * @param type 区分分别发布，捆包发布
   */
  confirmPublish(id: string, type?: any) {
    if (type && type === 10) {
      if (this.equalStartPoint()) {
        return;
      }
    }
    this.issueResult(type);
  }

  /**
   * 竞价调用接口
   * @param type 区分分别发布，捆包发布
   */
  issueResult(type?: any) {
    // console.log(type)
    // console.log(this.modalForm.executionTimeStart);
    const params: any = {carrierList: [], driverList: [], orderList: []};
    // let tOrderModelList = this.updatadata;
    const tOrderModelList = [] = this.updatadata;
    if (this.modalForm.executionTimeStart == null) {
      this.nzMess.error('请选择开始时间！');
      return;
    }
    if (this.modalForm.executionTimeEnd == null) {
      this.nzMess.error('请选择结束时间！');
      return;
    }

    /*if (value >= 999999999) { this.modalRef = this.nzModal.create({
        nzTitle: this.recordTitle,
        nzContent: this.recordContent,
        nzFooter: this.recordFooter,
        nzMaskClosable: false,
        nzWidth: '1200px',
        nzStyle: {top: '0px'}
      });
      this.modalRef.afterClose.subscribe(
        () => {
          this.carriageSeletedList = [];
          this.driverSeletedList = [];
          this.bidderSearchTmp = {};
          this.driverSearchTmp = {};
          this.searchCarriageValue = '';
          this.searchDriverValue = '';
        }
      );
      this.nzMess.error('价格不可超过999999999(9位)');
      return;
    }*/
    console.log(this.itemUpdatedata);
    // this.itemUpdatedata.forEach(value => {
    //     // if(value.inputWeight * ceilingPriceTax){
    //     //
    //     // }
    // });
    if (this.buttonId == 'OrderBid') {
      params.tenderTimeStart = format(this.modalForm.executionTimeStart, 'YYYY-MM-DD HH:mm');
      params.tenderTimeEnd = format(this.modalForm.executionTimeEnd, 'YYYY-MM-DD HH:mm');
    } else {
      params.robbedTimeStart = format(this.modalForm.executionTimeStart, 'YYYY-MM-DD HH:mm');
      params.robbedTimeEnd = format(this.modalForm.executionTimeEnd, 'YYYY-MM-DD HH:mm');
      params.hiredType = this.unitPrice == '10' ? '20' : '10';

    }
    // this.carriageOfSelectedValue.forEach(
    //   (res, index) => {
    //     this.bidderCompanyListStorage.forEach(
    //       (item, index1) => {
    //         if (res == item.companyName) {
    //           if (!params.carrierList[index]) {
    //             params.carrierList[index] = {};
    //           }
    //           if (this.buttonId == 'OrderBid') {
    //             params.carrierList[index].bidderCompanyId = item.companyId;
    //           } else {
    //             params.carrierList[index].robberCompanyId = item.companyId;
    //           }
    //
    //         }
    //       });
    //   });
    this.carriageSeletedList.forEach(
      value => {
        if (this.buttonId == 'OrderBid') {
          params.carrierList.push({bidderCompanyId: value});
        } else {
          params.carrierList.push({robberCompanyId: value});
        }
      }
    );
    console.log(this.listOfSelectedValue);
    // this.listOfSelectedValue.forEach(
    //   (res, index) => {
    //     this.driverListStorage.forEach(
    //       // this.driverList.forEach(
    //       (item, index1) => {
    //         if (res == item.name) {
    //           if (!params.driverList[index]) {
    //             params.driverList[index] = {};
    //           }
    //           if (this.buttonId == 'OrderBid') {
    //             params.driverList[index].bidderName = item.name;
    //             params.driverList[index].bidderId = item.userId;
    //           } else {
    //             params.driverList[index].robberName = item.name;
    //             params.driverList[index].robberCompanyId = item.userId;
    //           }
    //         }
    //       });
    //   });

    this.driverSeletedList.forEach(
      value => {
        if (this.buttonId == 'OrderBid') {
          params.driverList.push({bidderId: value.userId});
        } else {
          params.driverList.push({robberCompanyId: value.userId,robberCompanyPhone:value.mobile});
        }
      }
    );
    // params.orderList
    // console.log(tOrderModelList);
    // console.log(this.itemUpdatedata);
    if (this.buttonId == 'OrderBid') {// 竞价委托传参
      for (let i = 0; i < tOrderModelList.length; i++) {
        /*if (!tOrderModelList[i]) {
          tOrderModelList[i] = {};
          tOrderModelList[i].tOrderItemModels = [];
        }*/
        /*if(!tOrderModelList[i].tOrderItemModels){
          tOrderModelList[i].tOrderItemModels=[];
        }*/
        // if(i==0){
        tOrderModelList[i].tOrderItemModels = [];
        // }
        this.itemUpdatedata.forEach((element: any) => {
          if (tOrderModelList[i].orderNo == element.orderNo) {
            tOrderModelList[i].tOrderItemModels.push(element);
          }
        });
        // console.log(tOrderModelList)
        if (!params.orderList[i]) {
          params.orderList[i] = {};
        }
        params.orderList[i].tOrderItemModels = tOrderModelList[i].tOrderItemModels;
        params.orderList[i].companyId = tOrderModelList[i].companyId;
        params.orderList[i].orderNo = tOrderModelList[i].orderNo;
      }
      params.orderList = params.orderList.filter(item => item.tOrderItemModels.length != 0);
      // console.log(params.orderList)
      /*params.orderList.forEach(item=>{
        if(item.tOrderItemModels.length == 0){
          params.orderList.splice(item,1);
        }
      })*/
    } else {
      params.orderList = this.itemUpdatedata;
    }
    if (this.tempInfo.carriiagePrice) {
      params.carrierType = '10';
    } else {
      params.carrierType = '20';
    }
    if (this.tempInfo.driverPrice) {
      params.driverType = '10';
    } else {
      params.driverType = '20';
    }
    params.carrierSplit = this.bidPriceType;
    params.driverSplit = this.driverType;
    params.settleType = this.taxInclusive;
    params.remark = this.modalForm.remark;
    if (this.buttonId === 'OrderBid') {// 竞价委托传参
      if (this.taxInclusive === '10') {
        params.lowerPriceTax = this.tempInfo.lowerPriceTax;
        params.ceilingPriceTax = this.tempInfo.ceilingPriceTax;
      } else {
        params.lowerPriceTaxNo = this.tempInfo.lowerPriceTax;
        params.ceilingPriceTaxNo = this.tempInfo.ceilingPriceTax;
      }
    } else {
      if (this.unitPrice === '10') {
        params.offerPrice = this.tempInfo.unitPrice;
      } else {
        params.offerPrice = this.tempInfo.include;
      }

    }
    if (this.buttonId === 'circulationRob') {
      if (!this.modalForm.totalTrainNum) {
        this.nzMess.error('请填写车次！');

        return;
      }
      console.log(params.offerPrice);
      if (this.styleType !== 'SHC000000882' && !params.offerPrice) {
        this.nzMess.error('请填写金额！');
        return;
      }
      params.totalTrainNum = this.modalForm.totalTrainNum;

    }
    if (type) {
      params.createType = type;
    }
    /*params.tenderNo = this.updatadata2[0].tenderNo;
    params.carrierType = this.updatadata2[0].tenderNo;*/
    console.log(params);
    if (this.buttonId == 'OrderBid') {   // 竞价委托
      if (params.ceilingPriceTax >= 999999999) {
        // this.nzMess.error('价格不可超过999999999(9位)');
        return;
      }
    } else if (this.buttonId === 'DriverGrab') {     // 司机抢单
      if (params.offerPrice >= 999999999) {
        // this.nzMess.error('价格不可超过999999999(9位)');
        return;
      }
    } else if (this.buttonId === 'circulationRob') {   // 循环抢单
      if (params.offerPrice >= 999999999) {
        // this.nzMess.error('价格不可超过999999999(9位)');
        return;
      }
    } else {   // 抢单委托
      if (params.offerPrice >= 999999999) {
        // this.nzMess.error('价格不可超过999999999(9位)');
        return;
      }
    }

    if (this.buttonId == 'OrderBid') {   // 竞价委托
      this.itemUpdatedata.forEach(value => {
        this.weightPrice = value.inputWeight * params.ceilingPriceTax;
        if (this.weightPrice > 999999999999) {
          this.ifWeightPrice = true;
        }
      });
    } else if (this.buttonId === 'DriverGrab') {  // 司机抢单
      this.itemUpdatedata.forEach(value => {
        this.weightPrice = value.inputWeight * params.offerPrice;
        if (this.weightPrice > 999999999999) {
          this.ifWeightPrice = true;
        }
      });
    } else if (this.buttonId === 'circulationRob') {   // 循环抢单
      this.itemUpdatedata.forEach(value => {
        this.weightPrice = value.inputWeight * params.offerPrice;
        if (this.weightPrice > 999999999999) {
          this.ifWeightPrice = true;
        }
      });
    } else {   // 抢单委托
      this.itemUpdatedata.forEach(value => {
        this.weightPrice = value.inputWeight * params.offerPrice;
        if (this.weightPrice > 999999999999) {
          this.ifWeightPrice = true;
        }
      });
    }
    if (this.ifWeightPrice) {
      this.nzMess.error('明细重量与价格乘积不得超过999999999999（12位）');
      this.ifWeightPrice = false;
      return;
    }
    this.implistLoading = true;
    let url = '';
    if (this.buttonId == 'OrderBid') {
      url = urls.insertJjTender;
    } else if (this.buttonId === 'DriverGrab') {
      url = urls.insertDriverGrab;
    } else if (this.buttonId === 'circulationRob') {
      url = urls.insertCirculationTrobbed;
    } else {
      url = urls.insertTrobbed;
    }
    console.log(url, 777);
    // console.log(params)
    // console.log(this.itemUpdatedata)

    if (this.buttonId === 'Rob' && this.styleType === 'CDC000000888') {
      if (this.loadDate === null) {
        this.nzMess.error('请选择装车时间!');
        return;
      }
      params.loadDate = Utils.dateFormat(this.loadDate, 'yyyy-MM-dd');
    }
    // let url = this.buttonId == 'OrderBid'?urls.insertJjTender:urls.insertTrobbed;
    this.http.post(url, params).then((res: any) => {
      this.implistLoading = false;
      console.log(params, res, 999);
      if (res.data.code == 100) {
        console.log(222);
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.itemData = [];
        this.updatadata = [];
        this.recordTitleList = [];
        // this.updatadata2=[];
        // this.updatadata3=[];
        // this.tplModal.destroy();
        // this.nzMess.create('success', '提示信息', '竞价委托成功！');
        this.recordTitleList = [];
        this.getList1(this.searchData);
        // this.confirmRef.destroy();
        this.modalRef.destroy();
      }
    });
  }

  cancel() {
    this.modalRef.destroy();
    this.endPointDriver = false
    this.recordTitleList = [];
  }

  /**
   *导入按钮
   */
  btnImport() {
    this.modalTitle = '委托调度 > 导入';
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      const validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false,

    });


  }

  /**
   * 选择excel
   */
  selectFile() {
    this.fileInput.nativeElement.click();
  }

  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    // console.log(this.importFile);
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});

  }

  /**
   * 导入弹窗确定
   */
  importConfirm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === 'INVALID') {
      return;
    }
    if (!Utils.isExcel(this.importFile.name)) {
      this.nzMess.remove();
      this.nzMess.error('格式不正确！');
      return;
    }
    let _data;
    const dataList: any = [];
    this.implistLoading = true;

    this.xlsx.import(this.importFile, true).then((data: any) => {

      const keys = Object.keys(data);
      // _data.push( data[keys[i]]);

      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error('未读取到sheet页！读取数据Excel失败！');
        this.implistLoading = false;
        return;
      }
      const headArr: any = _data && _data[0] || [];


      // this.removeEmpty(_data).then(this.excelFilter(_data));
      // console.log(_data);
      dataList.push(_data);
      _data = [];

      // console.log(dataList);
      this.excelFilter(dataList);
    });


  }

  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let flag = true;
    if (head.length != receiptHead.length) {
      flag = false;
    }
    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        // console.log(item)
        flag = false;
      }
    });
    if (!flag) {

      this.implistLoading = false;
    }
    return flag;
  }

  excelFilter(data: any) {
    let url;
    const param: any = {deliveryNoticeListJson: []};
    const eNameHeader: any = [];
    data[1].map((item, index) => {
        if (this.patchEname(item)) {
          eNameHeader.push({field: this.patchEname(item), index: index});
        }
      }
    );
    for (let i = 2; i < data.length; i++) {
      const temp: any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index];
      });
      param.deliveryNoticeListJson.push(temp);
    }

    this.implistLoading = true;
    //   console.log(param);
    //  console.log(param.deliveryNoticeListJson);
    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      if (res.success) {
        this.tplModal.destroy();
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});

        // this.listSearch({ page: 1, length: this.pageSize1 });
      }
    });
  }

  /***
   * 根据Excel中文表头匹配页面列表表头
   */
  patchEname(cName: any) {
    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() == cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  }

  /*
  *  去空
  */

  removeEmpty(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].length < 1) {
        data.splice(i, 1);
        i = i - 1;

      }
    }
    return data;
  }

  /*
  *       定向委托
  */

  btnDirectional() {
    this.isMutli = !this.ifMutli();
    if (!this.updatadata || this.updatadata.length < 1 || (!this.itemUpdatedata || this.itemUpdatedata.length < 1)) {
      this.nzMess.error('请选择一条委托记录和委托明细');
      return;
    }
    // if(this.isTender()){
    //   return;
    // }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST40'], '勾选数据已取消，不可再做定向委托')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST50'], '勾选数据已强制完成，不可再做定向委托')) {
      return;
    }

    if (this.equalStartPoint()) {
      return;
    }
    if (this.isInputWeight()) {
      // this.nzMess.error('请给每条明细数据输入重量和件数')
      return;
    }
    if (this.styleType === 'SHC000000882') {
      this.radiovalue = 'toFleet';
      this.modelChange('toFleet');
    }
    this.title = `流向：${this.itemUpdatedata[0].startLocationName}->${this.itemUpdatedata[0].endLocationName}  重量：${Number(this.sumItemInputWeight()).toFixed(3)} `;
    this.modalTitle = '委托调度 > 定向委托';
    if (this.styleType === 'SHC000000882') {
      this.tplModal = this.nm.create({
        nzTitle: this.tplTitle1,
        nzContent: this.tplContentSHF,
        nzFooter: this.tplFooter1,
        nzWidth: '40%',
        nzMaskClosable: false,
        nzClosable: false,
      });
    } else {
      this.tplModal = this.nm.create({
        nzTitle: this.tplTitle1,
        nzContent: this.tplCDGCbody,
        nzFooter: this.tplFooter1,
        nzWidth: '75%',
        nzMaskClosable: false,
        nzClosable: false,
      });
      this.isCheck = false;
      this.radiovalue = 'toFleet';
      this.modelChange({});
      this.getStatic1(this.businessNatureArr, 'YWXZ');
      this.businessNature = 'YWXZ10';
      if (this.updatadata[0].tenderNo) {
        const arr = this.updatadata[0].tenderNo.split(',');
        const arr1: any = [];
        arr.forEach(item => {
          arr1.push({name: item, value: item});
        });
        this.tenderNoArr = arr1;
        this.tendNo = arr[0];
        window.setTimeout(()=>{
          this.radioChange1();
        },2000)


      }
    }


    // if(this.updatadata[0].tenderNo){
    //   this.radiovalue = 'toFleet'
    //   this.modelChange({})
    //   this.radioChange()
    //   this.isCheck = true
    // }
  }

  // /*
  // *  获得中标车队
  // */
  // getFleetTender(){
  //   let url = TRANS_URLS.getFleetTender;
  //   this.loading = true;
  //   let param: any = {consignorCompanyId:this.localCompanyId,tenderNos:[this.updatadata[0].tenderNo]};
  //   this.http.post(url, param).then((res: any) => {
  //     if (res.success) {
  //       console.log(res);
  //       for(let i = 0;i<res.data.data.length;i++){
  //         this.dataSet2.push({companyId:res.data.data[i].bidderCompanyId,companyName:res.data.data[i].bidderCompanyName,bidRatio:(res.data.data[i].distributionRatio)/100,entrustedWeight:this.sumItemInputWeight()*((res.data.data[i].distributionRatio)/100),settleType:'JSFS20',unitPrice:res.data.data[i].bidPriceTaxNo,priceStatus:"ps"+res.data.data[i].hiredType})
  //       }
  //
  //       // this.dataSet2 = res.data.data.data;
  //       this.loading = false;
  //     }
  //   });
  // }
  /*
  * 判断是否同为招标数据
  */
  isTender() {
    let flag = false;
    for (let i = 1; i < this.updatadata.length; i++) {
      if (this.updatadata[i].tenderNo != this.updatadata[i - 1].tenderNo) {
        this.nzMess.error('勾选数据有不同的招标单号，请重新勾选！');
        flag = true;
        return flag;
      }
      if (this.updatadata[i].businessModuleId != this.updatadata[i - 1].businessModuleId) {
        this.nzMess.error('勾选数据有不同的业务板块，请重新勾选！');
        flag = true;
        return flag;
      }

    }
    return flag;
  }

  /*
  *判断起始地和终点是统一
  */


  /**
   * 判断起始点
   */
  equalStartPointCDGC() {
    let flag: boolean = false;

    for (let i: number = 1; i < this.itemUpdatedata.length; i++) {
      if (this.itemUpdatedata[i].startLocationName != this.itemUpdatedata[i - 1].startLocationName) {
        this.nzMess.error('勾选数据存在不同的起始点,请重新勾选');
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**
   * 判断起始点
   */
  equalStartPoint() {
    let flag = false;
    this.itemUpdatedata.forEach(item => {
      if (item.endPoint == undefined || item.endPoint == null || item.endPoint == '') {
        this.nzMess.error('请填写目的地!');
        flag = true;
        return flag;
      }
    });
    for (let i = 1; i < this.itemUpdatedata.length; i++) {
      if (this.itemUpdatedata[i].startLocationName != this.itemUpdatedata[i - 1].startLocationName || this.itemUpdatedata[i].endLocationName != this.itemUpdatedata[i - 1].endLocationName) {
        this.nzMess.error('勾选数据存在不同的起始点或者终点,请重新勾选');
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**
   * 判断起点终点是否为空
   */
  pointIsEmpty(): boolean {
    return this.itemUpdatedata.some(
      value => !value.startLocationName || !value.endLocationName
    );
  }

  /**
   * 判断业务板块
   */
  /*equalBusinessModuleId(): boolean {
    if (this.updatadata.length === 1) {
      return false;
    }
    let map: Map<string, string> = this.updatadata.reduce(
      (acc, cur) => {
        let list = acc.get(cur.businessModuleId);
        if (!list) {
          list = [];
          acc.set(cur.businessModuleId, list);
        }
        list.push(cur);
        return acc;
      }, new Map<string, string>()
    );
    return Array.from(map.entries()).some(
      value => value[1].length === 1
    );
  }*/

  /*
   *  判断主表的来源公司是否一致
   */
  equalConsignorCompanyIdRoot(): boolean {
    if (this.updatadata.length === 1) {
      return false;
    }
    const map: Map<string, string> = this.updatadata.reduce(
      (acc, cur) => {
        let list = acc.get(cur.consignorCompanyIdRoot);
        if (!list) {
          list = [];
          acc.set(cur.consignorCompanyIdRoot, list);
        }
        list.push(cur);
        return acc;
      }, new Map<string, string>()
    );
    return Array.from(map.entries()).some(
      value => value[1].length === 1
    );
  }

  /*
   *  判断子表的业务板块是否一致
   */
  equalItemBusinessModuleId(): boolean {
    console.log(this.itemUpdatedata);
    if (this.itemUpdatedata.length === 1) {
      return false;
    }
    const map: Map<string, string> = this.itemUpdatedata.reduce(
      (acc, cur) => {
        let list = acc.get(cur.businessModuleId);
        if (!list) {
          list = [];
          acc.set(cur.businessModuleId, list);
        }
        list.push(cur);
        return acc;
      }, new Map<string, string>()
    );
    return Array.from(map.entries()).some(
      value => value[1].length === 1
    );
  }

  /*
  *  是否可以多选
  */

  ifMutli(): boolean {
    let flag = false;
    if (this.itemUpdatedata.length > 1) {
      flag = true;
    }

    return flag;
  }

  /*
  *     判断是否输入重量和件数
  */

  isInputWeight() {
    let flag = false;
    let count: number;
    let msg: string;
    this.itemUpdatedata.forEach((item: any) => {
      if (item.inputWeight == undefined) {
        flag = true;
        // this.nzMess.error('请给每条明细数据输入重量和件数')
        count = 1;
        return;
      }
      if (item.inputWeight == 0) {
        flag = true;
        count = 2;
        return;
      }
      if (this.isInput()) {
        flag = true;
        // this.nzMess.error('输入的数据有误，请重新输入！')
        count = 0;
        return;
      }
      if (Number(item.totalWeight) < Number(item.inputWeight)) {
        flag = true;
        count = 3;
        return;
      }
    });
    if (count == 0) {
      this.nzMess.error('输入的重量之和大于总重量，请重新输入！');
    } else if (count == 1) {
      this.nzMess.error('请给每条明细数据输入重量');
    } else if (count == 2) {
      this.nzMess.error('输入重量不能为0');
    } else if (count == 3) {
      this.nzMess.error('输入重量大于明细的重量，请重新输入！');
    }

    return flag;
  }

  /*
  *  判断输入数据是否正确
  */
  isInput() {

    let flag = false;
    let sum: any = 0;
    let arr: any = [];
    // console.log(this.itemUpdatedata)
    this.updatadata.forEach((item: any) => {

      arr = this.itemUpdatedata.filter(item1 => item1.orderNo == item.orderNo);
      arr.forEach((item2: any) => {
        sum += Number(item2.inputWeight);

      });

      if (sum.toFixed(3) > Number(item.totalWeight)) {
        flag = true;
        sum = 0;
        return;
      } else {
        sum = 0;
        return;
      }
    });

    return flag;
  }

  /*
  *  删除
  */
  btnDelete() {
    // if (this.updatadata.length !== 0 && this.itemUpdatedata.length !== 0) {
    //   this.nzMess.error('所选委托单存在已调度数据，无法删除，请重新选择！');
    //   return;
    // }
    if (this.updatadata.filter(x => x.companyId != this.info.APPINFO.USER.companyId).length != 0) {
      this.nzMess.error('勾选数据不可删除');
      return;
    }
    if (this.updatadata[0].status != 'ETST10' || this.itemData.filter(x => x.transWeight != 0).length > 0) {
      this.nzMess.error('所选委托单存在已调度数据，无法删除，请重新选择！');
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST20', 'ETST30', 'ETST40', 'ETST70'], '勾选数据存在已调度数据 请重新勾选')) {
      return;
    }

    this.deleteVisible = true;
    this.modalTitle2 = '提示信息';
    this.deleteCon = '是否确定删除？';
  }


  sumIschangedWeight() {
    let sum = 0;
    this.dataSet4.forEach(item => {
      if (item.isChange) {
        sum += this.isNotANumber(item.entrustedWeight);
      }
    });
    return sum;
  }


  modelChange3(data: any) {
    console.log(data);
    if (data.header.colEname == 'entrustedWeight') {
      this.dataSet4.forEach(item => {
        if (data.data.userId == item.userId) {
          item.isChange = true;
        }
      });
    }
    if (data.val == 0 || data.val == '' || data.val == undefined || data.val == null) {
      this.dataSet4.forEach(item => {
        if (data.data.userId == item.userId) {
          item.isChange = false;
        }
      });
    }

  }

  /*
  *    主列表勾选
  */
  updataDataResult(data: any) {
    if (data.length == 0) {
      this.itemData = [];
      this.updatadata = [];
      this.itemUpdatedata = [];
    } else {
      this.updatadata = data; // 主列表的值
      if (this.updatadata.length > 0) {
        this.getItem();
      } else {
        this.updatadata = [];
      }
    }
    // console.log(111111);
  }

  /*
  *  子表勾选
  */
  itemUpdateData(data: any) {
    let flag = false;
    let count = 0;
    if (data.length > this.itemUpdatedata.length) {
      flag = true;
    }
    if (flag) {
      data.forEach(item1 => {
        this.updatadata.forEach(item => {
          if (item.orderNo == item1.orderNo) {
            count++;
          }
        });
        if (count == 0) {
          this.dataSet.forEach(item2 => {
            if (item2.orderNo == item1.orderNo) {
              item2.checked = true;
            }
          });
        }
        count = 0;
      });
      this.updatadata = this.dataSet.filter(item3 => item3.checked);
    } else {
      this.updatadata.forEach(item => {
        data.forEach(item1 => {

          if (item.orderNo == item1.orderNo) {
            count++;
          }
        });
        if (count == 0) {
          item.checked = false;
        }
        count = 0;
      });
      this.updatadata = this.dataSet.filter(item3 => item3.checked);
      //     this.dataSet = [...this.dataSet];
    }
    this.itemUpdatedata = data;
  }

  /*
  *   车队勾选
  */

  updataDataResult2(data: any) {
    this.updatadata2 = data;
    if (data.length == 0) {
      this.dataSet2.forEach((item: any) => {
        item.bidRatio = null;
        item.entrustedWeight = null;
        item.remark = null;
        item.settleType = null;
        item.unitPrice = null;
        item.priceStatus = null;
      });
    }
    console.log(this.dataSet2);
    this.dataSet2.forEach((item: any) => {
      for (let i = 0; i < this.updatadata2.length; i++) {
        if (item.companyName == this.updatadata2[i].companyName) {
          item.bidRatio = 1 / this.updatadata2.length;
          item.priceStatus = 'ps10';
          item.entrustedWeight = this.sumItemInputWeight() * item.bidRatio;
          return;
        } else {
          item.bidRatio = null;
          item.entrustedWeight = null;
          item.remark = null;
          item.settleType = null;
          item.unitPrice = null;
          item.priceStatus = null;
        }
      }

    });
    this.isCheck = false;
    // this.dataSet2=[...this.dataSet2];

  }


  /*
  *   得出输入重量的和
  */

  sumItemInputWeight() {
    let sum = 0;
    this.itemUpdatedata.forEach((item: any) => {
      sum += Number(item.inputWeight);
    });
    return sum;
  }

  /*
  *   司机列表勾选
  */

  updataDataResult3(data: any) {
    this.updatadata3 = data;
    if (data.length == 0) {
      this.dataSet4.forEach((item: any) => {
        if (!item.isChange) {
          item.bidRatio = null;
          item.entrustedWeight = null;
          item.settleType = null;
          item.unitPrice = null;
          item.priceStatus = null;
        }
      });
    }
    if (this.styleType !== 'SHC000000882') {
      console.log(this.dataSet4);
      this.dataSet4.forEach((item: any) => {
        for (let i = 0; i < this.updatadata3.length; i++) {
          if (item.name == this.updatadata3[i].name) {
            item.bidRatio = 1 / this.updatadata3.length;
            item.entrustedWeight = this.sumItemInputWeight() * item.bidRatio;
            // item.entrustedWeight = item.truckWeight
            // let count: number = this.sumItemInputWeight();
            // // item.entrustedWeight = this.sumItemInputWeight() * item.bidRatio;
            // if (!item.isChange) {
            //   item.bidRatio = 1 / this.updatadata3.filter(x => !x.isChange).length;
            //   this.updatadata3.filter(x => x.isChange).forEach(item1 => {
            //     count = count - item1.entrustedWeight;
            //   });
            //   item.entrustedWeight = count * item.bidRatio;
            // }
            return;
          } else {
            if (!item.isChange) {
              item.bidRatio = null;
              item.entrustedWeight = null;
            }
          }
        }

      });
    } else {
      this.dataSet4.forEach((item: any) => {
        for (let i = 0; i < this.updatadata3.length; i++) {
          if (item.name == this.updatadata3[i].name) {
            // item.bidRatio = 1 / this.updatadata3.length;
            item.entrustedWeight = 32;
            // item.entrustedWeight = item.truckWeight
            // let count: number = this.sumItemInputWeight();
            // // item.entrustedWeight = this.sumItemInputWeight() * item.bidRatio;
            // if (!item.isChange) {
            //   item.bidRatio = 1 / this.updatadata3.filter(x => !x.isChange).length;
            //   this.updatadata3.filter(x => x.isChange).forEach(item1 => {
            //     count = count - item1.entrustedWeight;
            //   });
            //   item.entrustedWeight = count * item.bidRatio;
            // }
            return;
          } else {
            if (!item.isChange) {
              item.bidRatio = null;
              item.entrustedWeight = null;
            }
          }
        }

      });
    }

    // this.dataSet4=[...this.dataSet4];
  }

  /*
  *   车辆调度司机勾选
  */
  updataDataResult4(data: any) {
    this.updatadata3 = data;
    if (data.length == 0) {
      this.dataSet3.forEach((item: any) => {
        item.bidRatio = null;
        item.entrustedWeight = null;
        item.settleType = null;
        item.unitPrice = null;
        item.priceStatus = null;
      });
    }
    console.log(this.dataSet3);
    this.dataSet3.forEach((item: any) => {
      for (let i = 0; i < this.updatadata3.length; i++) {
        if (item.name == this.updatadata3[i].name) {
          // item.bidRatio = 1/this.updatadata3.length;
          // item.entrustedWeight = this.sumItemInputWeight()*item.bidRatio;
          item.priceStatus = 'ps10';
          item.entrustedWeight = item.truckWeight;
          return;
        } else {
          item.bidRatio = null;
          item.entrustedWeight = null;
          item.settleType = null;
          item.unitPrice = null;
          item.priceStatus = null;
        }
      }

    });
    // this.dataSet3=[...this.dataSet3];
  }

  /*
  *    获得子表信息
  */

  getItem() {
    const url = TRANS_URLS.getEntrustItem;
    const arr = this.updatadata.map(item => {
      return {
        orderNo: item.orderNo,
        companyId: item.companyId,
        totalWeight: item.totalWeight,
        totalSheet: item.totalSheet,
      };
    });
    const param: any = {};
    param.tOrders = arr;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.itemData = res.data.data;
        this.itemData.forEach((item: any) => {
          item.checked = true;
          item.inputWeight = item.totalWeight;
          item.numberOfInput = item.totalSheet;
        });
        this.itemUpdatedata = this.itemData.filter(item => item.checked);
      }
    });
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.searchList(this.tempSearchParam);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.searchList(this.tempSearchParam);
  }

  /*
  *   委托到车队或者车辆
  */
  modelChange(data: any) {
    if (this.radiovalue == 'toFleet') {
      this.getFleet();
      this.dataSet3 = [];
      this.updatadata3 = [];
    } else {
      this.getDriver();
      this.dataSet2 = [];
      this.updatadata2 = [];
    }
  }

  /*
  *  得到所有车队信息
  */
  getFleet() {
    const url = TRANS_URLS.getPlateCompanyName;
    this.loading = true;
    const param: any = {businessModuleId: this.updatadata[0].businessModuleId};
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);

        this.dataSet2 = res.data.data.data;
        this.loading = false;
      }
    });
  }

  /*
  *  得到所有车辆信息
  */

  getDriver() {
    const url = TRANS_URLS.getDriver;
    this.loading1 = true;
    const param: any = {companyId: 'C000000001', authStatus: 'RZZT90'}; // 可以获取所有车辆
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.dataSet3 = res.data.data.data;
        this.loading1 = false;
      }
    });
  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    if (this.inUpdateButton || this.buttonId === 'Add' || this.buttonId === 'Update') {
      this.tplModal1.destroy();
      this.inUpdateButton = false;
      this.buttonId = 'Directional';
    } else {
      this.tplModal.destroy();
      this.isCheck = false;
      this.radiovalue = null;
      this.updatadata2 = [];
      this.updatadata3 = [];
      this.dataSet2 = [];
      this.dataSet3 = [];
      this.dataSet4 = [];
      this.fleet = null;
      this.driver = null;
      this.remark = null;
      this.mobile = null;
      this.vehicleNo = null;
      this.tenderNoArr = [];
      this.tendNo = null;
      this.inputModalModel = null;
      this.bidderDataArr = [];
      this.receivablePrice = undefined;
      this.businessNatureArr = [];
      this.productDisable = false;
      this.recordTitleList = [];
    }

    // this.validateForm1.reset();
  }

  /**
   * 弹窗取消
   */
  handleCance() {
    this.tplModal.destroy();

  }

  /*
  *   弹窗确认
  */
  importConfirm1() {
    // if (this.updatadata.length != 1 && this.updatadata2.length !== 1 && this.updatadata3.length !== 1) {
    //   this.nzMess.error('请只选择一个车队信息！');
    //   return;
    // }
    // if (this.isFilling()) {
    //   this.nzMess.error('请输入金额');
    //   return;
    // }
    console.log(222222);
    this.implistLoading = true;
    if (this.radiovalue == 'toFleet') {

      this.fleetOk();
    } else {
      this.driverOk();
    }

  }

  isFilling() {
    let flag = false;
    this.updatadata2.forEach(item => {
      if (item.priceStatus != undefined && item.unitPrice == undefined) {
        flag = true;
        return;
      }
    });
    this.updatadata3.forEach(item1 => {
      if (item1.priceStatus != undefined && item1.unitPrice == undefined) {
        flag = true;
        return;
      }
    });
    return flag;
  }


  /*
  *    车辆调度弹窗确认
  */
  // importConfirm2(){
  //   if(!this.updatadata3  || this.updatadata3.length < 1){
  //     this.nzMess.error("请勾选一个车辆")
  //     return;
  //   }
  //   let url  = TRANS_URLS.saveSchedule;
  //   let param:any={}
  //   // param.tOrderItemModels = this.itemUpdatedata;
  //   // param.tTenderPriceModelList = this.updatadata3;
  //   param.tOrderModelList  = []=this.updatadata;
  //   for(let i:number =0;i<param.tOrderModelList.length;i++){
  //     if(i==0){
  //       param.tOrderModelList[i].tOrderItemModels=[];
  //     }
  //     this.itemUpdatedata.forEach((element:any)=>{
  //       if(param.tOrderModelList[i].orderNo == element.orderNo){
  //         param.tOrderModelList[i].tOrderItemModels.push(element);
  //       }
  //     })
  //     param.tOrderModelList[i].remark=this.remark;
  //   }
  //   console.log(111111)
  //   param.tTenderPriceModelList = this.updatadata3;
  //   this.implistLoading = true;
  //   this.http.post(url,param).then((res:any)=>{
  //     if(res.success){
  //       console.log(res)
  //       this.nz.create('success', '提示信息', res.data.data.data, {nzDuration: 3000});

  //       this.tplModal.destroy();
  //       this.getList1(this.tempSearchParam);
  //       this.dataSet4=[];
  //       this.updatadata3=[];
  //       this.updatadata=[];
  //       this.itemUpdatedata=[]
  //       this.remark = null;
  //     }
  //     this.implistLoading = false;
  //   })
  // }

  /*
  *    车辆调度弹窗确认(重新调整)
  */
  importConfirm2() {
    if (!this.updatadata3 || this.updatadata3.length < 1) {
      this.nzMess.error('请勾选一个车辆');
      return;
    }
    if (this.sumDriver1()) {
      return;
    }
    if (this.remark1 && this.remark1.length > 255) {
      this.implistLoading = false;
      this.nzMess.error('备注最大长度为255');
      return;
    }
    const url = TRANS_URLS.insertDriverOfFleet;
    const param: any = {};
    // param.tOrderItemModels = this.itemUpdatedata;
    // param.tTenderPriceModelList = this.updatadata3;
    param.tOrderModelList = [] = this.updatadata;
    for (let i = 0; i < param.tOrderModelList.length; i++) {
      param.tOrderModelList[i].tOrderItemModels = [];
      this.itemUpdatedata.forEach((element: any) => {
        if (param.tOrderModelList[i].orderNo == element.orderNo) {
          param.tOrderModelList[i].tOrderItemModels.push(element);
        }
      });
      param.tOrderModelList[i].remark = this.remark1;
    }
    if (this.updatadata[0].businessModuleId === '025') {
      this.carTeamArr.filter(x => x.value2 === this.carTeamCode);
      param.carrierCompanyName = this.carTeamCode;
      param.carrierCompanyId = this.carTeamArr[0].value;
    }

    // this.updatadata3.forEach( item => {
    //   item.carrierCompanyName = this.carTeamCode;
    // });
    param.tTenderPriceModelList = this.updatadata3;
    this.implistLoading = true;
    this.http.post(url, param).then((res: any) => {
      console.log(param);
      if (res.success) {
        console.log(res);
        this.nz.create('success', '提示信息', res.data.data.msg, {nzDuration: 3000});

        this.tplModal.destroy();
        this.getList1(this.tempSearchParam);
        this.dataSet4 = [];
        this.updatadata3 = [];
        this.updatadata = [];
        this.itemUpdatedata = [];
        this.remark = null;
        this.mobile = null;
        this.vehicleNo = null;
        this.driver = null;
        this.recordTitleList = [];
      }
      this.implistLoading = false;
    });
  }


  /*
  *   车队调度确定
  */

  fleetOk() {
    if (this.updatadata2.length < 1) {
      this.implistLoading = false;
      this.nzMess.error('请勾选车队!');
      return;
    }
    if (this.sumFleet()) {
      this.implistLoading = false;
      return;
    }
    // if (this.isChange && this.updatadata[0].tenderNo) {
    //   this.nzMess.error('招标数据修改后必须填写备注，请填写备注！');
    //   return;
    // }
    this.implistLoading = true;
    const url = TRANS_URLS.saveEntrust;
    const param: any = {};
    // param.tOrderItemModels = this.itemUpdatedata;
    //     param.tTenderPriceModelList = this.updatadata2;
    param.tOrderModelList = [] = this.updatadata;
    // param.tOrderModelList.forEach((item:any)=>{
    //   this.itemUpdatedata.forEach((element:any)=>{
    //     if(item.orderNo = element.orderNo){
    //       item.tOrderItemModels =[];
    //       item.tOrderItemModels.push(element);
    //     }
    //   })
    // })
    for (let i = 0; i < param.tOrderModelList.length; i++) {
      param.tOrderModelList[i].tOrderItemModels = [];
      this.itemUpdatedata.forEach((element: any) => {
        if (param.tOrderModelList[i].orderNo == element.orderNo) {
          param.tOrderModelList[i].tOrderItemModels.push(element);
        }
      });
      param.tOrderModelList[i].remark = this.remark;
    }
    param.tTenderPriceModelList = this.updatadata2;

    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.nz.create('success', '提示信息', res.data.data.data, {nzDuration: 3000});
        this.tplModal.destroy();
        this.isCheck = false;
        this.itemData = [];
        this.radiovalue = null;
        this.updatadata2 = [];
        this.updatadata3 = [];
        this.dataSet2 = [];
        this.dataSet3 = [];
        this.fleet = null;
        this.driver = null;
        this.updatadata = [];
        this.itemUpdatedata = [];
        this.remark = null;
        this.getList1(this.tempSearchParam);
      }
      this.implistLoading = false;
    });
  }

  isToFleet() {

  }


  /*verifyCeilingPrice(data:any){
    this.tempInfo.ceilingPriceTax = Number(data).toFixed(3);
  }*/
  verifyLowerPrice(data: any) {
    this.tempInfo.lowerPriceTax = Number(data).toFixed(3);
  }

  verifyPrice(data: any) {
    if (this.unitPrice == '10') {
      this.tempInfo.unitPrice = Number(data).toFixed(3);
    } else {
      this.tempInfo.include = Number(data).toFixed(3);
    }
  }


  /*
  *车辆调度确认
  */


  driverOk() {
    console.log(this.updatadata3);
    if (!this.updatadata3 || this.updatadata3.length < 1) {
      this.nzMess.error('请勾选一个车辆');
      this.implistLoading = false;
      return;
    }
    if (this.sumDriver()) {
      this.implistLoading = false;
      return;
    }
    this.implistLoading = true;
    const url = TRANS_URLS.saveSchedule;
    const param: any = {};
    // param.tOrderItemModels = this.itemUpdatedata;
    // param.tTenderPriceModelList = this.updatadata3;
    param.tOrderModelList = [] = this.updatadata;
    for (let i = 0; i < param.tOrderModelList.length; i++) {
      param.tOrderModelList[i].tOrderItemModels = [];
      this.itemUpdatedata.forEach((element: any) => {
        if (param.tOrderModelList[i].orderNo == element.orderNo) {
          param.tOrderModelList[i].tOrderItemModels.push(element);
        }
      });
      param.tOrderModelList[i].remark = this.remark;
    }
    console.log(1653);
    console.log(this.updatadata3);
    param.tTenderPriceModelList = this.updatadata3;
    param.tTenderPriceModelList.forEach(item => {
      item.companyId = 'C000000001';
    });
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.nz.create('success', '提示信息', res.data.data.data, {nzDuration: 6000});
        this.tplModal.destroy();
        this.isCheck = false;
        this.radiovalue = null;
        this.updatadata2 = [];
        this.updatadata3 = [];
        this.dataSet2 = [];
        this.itemData = [];
        this.dataSet3 = [];
        this.fleet = null;
        this.driver = null;
        this.updatadata = [];
        this.itemUpdatedata = [];
        this.remark = null;
        this.getList1(this.tempSearchParam);
      }
      this.implistLoading = false;
    });
  }

  /*
  *   判断输入的委托比例之和是否为1
  */

  sumFleet() {
    let sum = 0;
    let sumWeight = 0;
    let sumItemWeight = 0;
    let flag = false;
    this.updatadata2.forEach((item: any) => {
      sum += Number(item.bidRatio);
      sumWeight += Number(item.entrustedWeight);
    });
    this.itemUpdatedata.forEach((item: any) => {
      sumItemWeight += Number(item.inputWeight);
    });
    console.log(sumWeight);
    console.log(sumItemWeight);
    if (sum != 1) {
      flag = true;
      this.nzMess.error('请确认输入的委托比例之和为100%');
    }
    if (sumWeight > sumItemWeight) {
      flag = true;
      this.nzMess.error('重量大于输入重量，请重新输入');
    }
    this.updatadata2.forEach(item => {
      if (item.entrustedWeight == null) {
        flag = true;
        this.nzMess.error('请填写重量');
      }
      if (item.unitPrice == undefined && item.priceStatus == null) {
        flag = true;
        this.nzMess.error('请填写金额和价格状态');
      }
    });
    return flag;
  }

  /*
*   判断输入的委托比例之和是否为1
*/

  sumDriver() {
    let sum = 0;
    let flag = false;
    let sumItemWeight = 0;
    let sumWeight = 0;
    this.updatadata3.forEach((item: any) => {
      sum += item.bidRatio;
      sumWeight += Number(item.entrustedWeight);
    });
    this.itemUpdatedata.forEach((item: any) => {
      sumItemWeight += Number(item.inputWeight);
    });
    console.log(sum);
    if (sumWeight > sumItemWeight) {
      flag = true;
      this.nzMess.error('重量大于输入重量，请重新输入');
    }
    this.updatadata3.forEach(item => {
      if (item.entrustedWeight == null) {
        flag = true;
        this.nzMess.error('请填写重量');
      }
      if (item.unitPrice == undefined && item.priceStatus == null) {
        flag = true;
        this.nzMess.error('请填写金额和价格状态');
      }
    });
    if (!this.isMutli && this.updatadata3[0].entrustedWeight != sumItemWeight) {
      flag = true;
      this.nzMess.error(`输入重量之和${sumItemWeight}T不等于重量${this.isNotANumber(this.updatadata3[0].entrustedWeight)}T，请分批调度`);
    }
    return flag;
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

  sumDriver1() {
    const sum = 0;
    let flag = false;
    let sumItemWeight = 0;
    let sumWeight = 0;
    this.updatadata3.forEach((item: any) => {
      sumWeight += Number(item.entrustedWeight);
    });
    this.itemUpdatedata.forEach((item: any) => {
      sumItemWeight += Number(item.inputWeight);
    });
    if (sumWeight > sumItemWeight) {
      flag = true;
      this.nzMess.error('重量大于输入重量，请重新输入');
    }
    this.updatadata3.forEach(item => {
      if (item.entrustedWeight == null) {
        flag = true;
        this.nzMess.error('请填写重量');
        return;
      }
    });
    if (!this.isMutli && this.updatadata3[0].entrustedWeight != sumItemWeight) {
      flag = true;
      this.nzMess.error(`输入重量之和${sumItemWeight}T不等于重量${this.updatadata3[0].entrustedWeight}T，请分批调度`);
    }
    return flag;
  }

  /**
   * 提示弹窗自动销毁
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  /*
  *   是否使用招投标结果
  */
  radioChange() {
    console.log(this.isCheck);
    if (this.updatadata[0].tenderNo == undefined || this.updatadata[0].tenderNo == null || this.updatadata[0].tenderNo == '') {
      if (this.isCheck == false) {
        this.nzMess.error('该数据没有招标结果，不可使用！');
      }
      return;
    }

    if (this.isCheck === true) {
      return;
    }
    // let url = TRANS_URLS.useBidResult;
    // let param: any = {};
    // param.tOrderItemModels = this.itemUpdatedata;
    // this.http.post(url, param).then((res: any) => {
    //   if (res.success) {
    //     console.log(res);
    //
    //     res.data.data.data.forEach((item: any) => {
    //       for (let i: number = 0; i < this.dataSet2.length; i++) {
    //         console.log(11);
    //         if (item.bidderCompanyId == this.dataSet2[i].companyId) {
    //           //this.dataSet2 = this.dataSet2.filter(item2 =>item2.companyId !== this.dataSet2[i].companyId);
    //           this.dataSet2.splice(i, 1);
    //         }
    //       }
    //     });
    //     this.dataSet2 = [...res.data.data.data, ...this.dataSet2];
    //     console.log(this.dataSet2);
    //   }
    // });
    const url = TRANS_URLS.getFleetTender;
    this.loading = true;
    const param: any = {consignorCompanyId: this.localCompanyId, tenderNos: [this.updatadata[0].tenderNo]};
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        const arr: any = [];
        console.log(res);
        res.data.data.forEach((item: any) => {
          for (let i = 0; i < this.dataSet2.length; i++) {
            if (item.bidderCompanyId == this.dataSet2[i].companyId) {
              // this.dataSet2 = this.dataSet2.filter(item2 =>item2.companyId !== this.dataSet2[i].companyId);
              arr.push(this.dataSet2[i]);
            }
          }
        });
        arr.forEach(item1 => {
          const index = this.dataSet2.indexOf(item1);
          if (index > -1) {
            this.dataSet2.splice(index, 1);
          }
        });
        this.dataSet2.forEach(item3 => {
          item3.checked = false;
          item3.entrustedWeight = undefined;
          item3.unitPrice = undefined;
        });
        const arr1: any = [];
        for (let i = 0; i < res.data.data.length; i++) {

          arr1.unshift({
            companyId: res.data.data[i].bidderCompanyId,
            companyName: res.data.data[i].bidderCompanyName,
            bidRatio: (res.data.data[i].distributionRatio) / 100,
            entrustedWeight: this.sumItemInputWeight() * ((res.data.data[i].distributionRatio) / 100),
            settleType: 'JSFS20',
            unitPrice: res.data.data[i].bidPriceTaxNo,
            agreementPrice: res.data.data[i].bidPriceTaxNo,
            priceStatus: 'ps' + res.data.data[i].hiredType,
          });

        }

        // this.dataSet2 = res.data.data.data;
        if (this.updatadata2.length == 1) {
          // this.dataSet2=[...this.dataSet2];
          const param: any = {
            companyId: this.updatadata[0].consignorCompanyIdRoot,
            platerCompanyId: this.updatadata2[0].companyId,
          };
          this.http.post(urls.selectDriverData, param).then(res => {
            console.log(res);
            if (res.success) {
              this.dataSet3 = res.data.data;
            }
          });
        }
        this.dataSet2 = [...arr1, ...this.dataSet2];
        this.loading = false;
      }

      this.updatadata2 = this.dataSet2.filter(x => x.checked);
    });
  }

  /*
  *   查询车队
  */

  selectFleet() {
    let itemStr: any;
    let arr: any = [];
    const arr1: any = [];
    // this.dataSet2.forEach((item: any) => {
    //   let param: any = {};
    //   param.companyName = item.companyName;
    //   arr1.push(param);
    // });
    this.dataSet2.forEach((item: any) => {
      itemStr = JSON.stringify(item);
      if (itemStr.indexOf(this.fleet) >= 0) {
        arr.push(item);

        this.dataSet2 = this.dataSet2.filter(item1 => item1.companyName !== item.companyName);

        return;
      }
    });

    this.dataSet2 = [...arr, ...this.dataSet2];
    arr = [];
  }


  /*
  *  查询车辆
  */

  selectDriver() {
    let itemStr: any;
    let arr: any = [];
    const arr1: any = [];
    // this.dataSet3.forEach((item: any) => {
    //   let param: any = {};
    //   param.name = item.name;
    //   param.vehicleNo = item.vehicleNo;
    //   param.vehicleKind = item.vehicleKind;
    //   param.mobile = item.mobile;
    //   param.userId = item.userId;
    //   arr1.push(param);
    // });
    this.dataSet3.forEach((item: any) => {
      itemStr = JSON.stringify(item);
      if (itemStr.indexOf(this.driver) > 0 || itemStr.indexOf(this.vehicleNo) > 0 || itemStr.indexOf(this.mobile) > 0) {
        arr.push(item);

        this.dataSet3 = this.dataSet3.filter(item1 => (item1.name !== item.name) || (item1.vehicleNo !== item.vehicleNo) || (item1.mobile !== item.mobile));

        return;
      }
    });
    this.dataSet3 = [...arr, ...this.dataSet3];
    arr = [];
    console.log(this.dataSet3);
  }

  /*
  *   查询司机车牌
  */


  selectDriver2() {

    let itemStr: any;
    let arr: any = [];
    const arr1: any = [];
    // this.dataSet4.forEach((item: any) => {
    //   let param: any = {};
    //   param.name = item.name;
    //   param.vehicleNo = item.vehicleNo;
    //   param.vehicleKind = item.vehicleKind;
    //   param.mobile = item.mobile;
    //   param.userId = item.userId;
    //   arr1.push(param);
    // });
    this.dataSet4.forEach((item: any) => {
      itemStr = JSON.stringify(item);
      if (itemStr.indexOf(this.driver) > 0 || itemStr.indexOf(this.vehicleNo) > 0 || itemStr.indexOf(this.mobile) > 0) {
        arr.push(item);

        this.dataSet4 = this.dataSet4.filter(item1 => (item1.name !== item.name) || (item1.vehicleNo !== item.vehicleNo) || (item1.mobile !== item.mobile));

        return;
      }
    });
    this.dataSet4 = [...arr, ...this.dataSet4];
    arr = [];
  }

  /*
  *  车队列表修改委托比例和重量
  */
  modelChange1(data: any) {
    this.isCheck = false;
    if (data.header.colEname == 'entrustedWeight') {
      this.dataSet2.forEach(item => {
        if (item.companyId == data.data.companyId) {
          item.bidRatio = data.val / this.sumItemInputWeight();
        }
      });
    }
    if (data.header.colEname == 'bidRatio') {
      this.dataSet2.forEach(item => {
        if (item.companyId == data.data.companyId) {
          item.entrustedWeight = data.val * this.sumItemInputWeight();
        }
      });
    }
    if (data.header.colEname == 'priceStatus') {
      this.dataSet2.forEach(item => {
        if (item.companyId == data.data.companyId) {
          if (this.updatadata[0].tenderNo) {
            if (data.data.priceStatus === 'ps20') {
              item.unitPrice = this.isNotANumber(Number(item.unitPrice)) * this.isNotANumber(Number(item.entrustedWeight));
              item.agreementPrice = this.isNotANumber(Number(item.agreementPrice)) * this.isNotANumber(Number(item.entrustedWeight));
              item.unitReceivePrice = this.isNotANumber(Number(item.unitReceivePrice)) * this.isNotANumber(Number(item.entrustedWeight));
            } else {
              item.unitPrice = this.isNotANumber(Number(item.unitPrice)) / this.isNotANumber(Number(item.entrustedWeight));
              item.agreementPrice = this.isNotANumber(Number(item.agreementPrice)) / this.isNotANumber(Number(item.entrustedWeight));
              item.unitReceivePrice = this.isNotANumber(Number(item.unitReceivePrice)) / this.isNotANumber(Number(item.entrustedWeight));
            }
          } else {
            debugger
            if (data.data.priceStatus === 'ps20') {
              item.unitPrice = this.isNotANumber(Number(item.unitPrice)) * this.isNotANumber(Number(item.entrustedWeight));
              item.unitReceivePrice = this.isNotANumber(this.isNotANumber(Number(item.unitReceivePrice)) / this.isNotANumber(Number(item.entrustedWeight)));
              if(item.unitPrice==0||item.unitPrice ==NaN){
                item.unitPrice=undefined
              }
              if(item.unitReceivePrice==0||item.unitReceivePrice ==NaN){
                item.unitReceivePrice=undefined
              }
            } else {
              item.unitPrice = this.isNotANumber(this.isNotANumber(Number(item.unitPrice)) / this.isNotANumber(Number(item.entrustedWeight)));
              item.unitReceivePrice = this.isNotANumber(Number(item.unitReceivePrice)) * this.isNotANumber(Number(item.entrustedWeight));
              if(item.unitPrice==0||item.unitPrice ==NaN){
                item.unitPrice=undefined
              }
              if(item.unitReceivePrice==0||item.unitReceivePrice ==NaN){
                item.unitReceivePrice=undefined
              }
            }
          }
        }
      });
    }

  }

  disabledStartDate = (startValue: Date): boolean => {   // 时间判断结束大于开始
    if (!startValue || !this.modalForm.executionTimeEnd) {
      return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000);
    }
    if (typeof this.modalForm.executionTimeEnd === 'string') {
      const data = new Date(Date.parse(this.modalForm.executionTimeEnd));
      this.modalForm.executionTimeEnd = data;
    }
    return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000) || (startValue.getTime() > this.modalForm.executionTimeEnd.getTime());

  };
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.modalForm.executionTimeStart) {
      return false;
    }
    if (typeof this.modalForm.executionTimeStart === 'string') {
      const data = new Date(Date.parse(this.modalForm.executionTimeStart));
      this.modalForm.executionTimeStart = data;
    }
    return endValue.getTime() <= this.modalForm.executionTimeStart.getTime();
  };

  /*
  *  删除弹窗
  */
  modalConfirmResult(data: any) {
    if (data.type == 'ok') {
      if (!this.updatadata || this.updatadata.length < 1) {
        this.nzMess.error('请勾选一条委托记录');
        return;
      }
      const url = TRANS_URLS.deleteEntrust;
      const param = this.updatadata;
      this.http.post(url, param).then((res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '删除成功', {nzDuration: 3000});
          this.searchList(this.tempSearchParam);
          this.updatadata = [];
          this.itemData = [];
          this.deleteVisible = false;
        }
      });
    } else {
      this.deleteVisible = false;
    }
  }


  // /**
  //  * 右grid
  //  */
  // rightShowFun() {
  //   this.rightShow = !this.rightShow;
  //   if (this.rightShow) {
  //     this.leftWidth = '99%';
  //     this.lineWidth = '99%';
  //     this.rightWidth = '0%';
  //     this.display = 'none';
  //   } else {
  //     this.leftWidth = '49.5%';
  //     this.lineWidth = '49.5%';
  //     this.rightWidth = '49.5%';
  //     this.display = 'block';
  //   }
  // }
  // /**
  //  * 右grid控制
  //  * @param data
  //  */
  // gridLineFun(data: number) {
  //   console.log(data);
  //   const w = data < 1 ? data : 0.96;
  //
  //   this.leftWidth = `${w * 100}%`;
  //   this.lineWidth = `${w * 100}%`;
  //   this.rightWidth = `${99 - w * 100}%`;
  //   this.display = 'block';
  //
  // }
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.companyStatic, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        console.log(res.data.data.data);
        if (res.success) {
          res.data.data.data.forEach(item => {
            data.push(item);
          });
        }
      }
    );
  }

  // 获取省市区
  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.validateForm1.get('cityId').reset({value: null, disabled: false});
          this.validateForm1.get('districtId').reset({value: null, disabled: true});
        }
      }
        break;
      case 'DZDJ20': {
        if (value) {
          this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.validateForm1.get('districtId').reset({value: null, disabled: false});
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value});
        }
      }
        break;
    }
  }

  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ10': {
              this.provinceArr = res.data.data;
              // this.provinceArr = res.data.data;
            }
              break;
            case 'DZDJ20': {
              this.cityArr = res.data.data;
              // this.cityArr = res.data.data;
            }
              break;
            case 'DZDJ30': {
              this.areaArr = res.data.data;
              // this.areaArr = res.data.data;
            }
              break;
          }
        }
      }
    );
  }

  updateData(data: any) {
    this.updatedataAdd = data;
  }

  importConfirm3() {
    console.log(this.validateForm1);
    console.log(this.validateForm1.get('endPoint'));

    for (const i in this.validateForm1.controls) {
      this.validateForm1.controls[i].markAsDirty();
      this.validateForm1.controls[i].updateValueAndValidity();
    }
    // debugger;
    console.log(this.showPagination);
    if (this.showPagination) {
      return;
    }
    if (this.validateForm1.status == 'INVALID') {
      return;
    }
    if (this.validateForm1.get('pickNo').value && this.validateForm1.get('pickNo').value.length > 20) {
      this.nzMess.error('发货通知单限制20个字符，请重新输入！');
      return;
    }
    if (this.dataSetAdd.length < 1) {
      this.nzMess.error('请至少添加一条明细');
      return;
    }
    if (this.isfillingWeight()) {
      return;
    }
//////
//       debugger;
    this.implistLoading = true;
    let url;
    if (this.buttonId == 'Add') {
      url = TRANS_URLS.AddEntrust;
    } else {
      url = TRANS_URLS.updateEntrust;
    }
    let param: any = {};
    param = this.validateForm1.getRawValue();
    param.businessTime = param.businessTime && param.businessTime instanceof Date ? Utils.dateFormat(param.businessTime, 'yyyy-MM-dd') : param.businessTime || '';
    param.tOrderItemModels = this.dataSetAdd;
    if (this.buttonId == 'Update') {
      param.orderNo = this.updatadata[0].orderNo;
    }

    if (param.provinceId === null || param.cityId === null || param.districtId === null) {
      this.nzMess.error('请选择卸点');
      this.implistLoading = false;
      return;
    }
    // if (!param.businessModuleId) {
    //   this.nzMess.error('请选择业务板块');
    //   return;
    // }
    console.log(param);

    param.tOrderItemModels.forEach(item1 => {

      item1.endPoint = param.endPoint;
      this.consignorCompanyArr.forEach(item => {
        if (param.consignorCompanyId == item.value) {
          param.consignorCompanyName = item.name;
        }
      });
      this.startPointArr.forEach(item => {
        if (param.startPoint == item.value) {
          param.startLocationName = item.name;
          item1.startPoint = item.value;
          item1.startLocationName = item.name;
        }
      });
      this.provinceArr.forEach(item => {
        if (param.provinceId == item.code) {
          param.provinceName = item.name;
          item1.endProvinceCode = item.code;
          item1.provinceName = item.name;
        }
      });
      this.cityArr.forEach(item => {
        if (param.cityId == item.code) {
          param.cityName = item.name;
          item1.endCityCode = item.code;
          item1.cityName = item.name;
        }
      });
      this.areaArr.forEach(item => {
        if (param.districtId == item.code) {
          param.districtName = item.name;
          item1.endDistrictCode = item.code;
          item1.districtName = item.name;
        } else if (param.districtId == null) {
          param.districtName = null;
          item1.endDistrictCode = null;
          item1.districtName = null;
        }
      });
      this.businessModuleIdArr.forEach(item => {
        if (param.businessModuleId == item.value) {
          item1.businessModuleId = item.value;
        }
      });
      this.continuityTypeArr.forEach(item => {
        if (param.continuityType == item.value) {
          item1.continuityType = item.value;
        }
      });
      this.ownerIdArr.forEach(item => {
        if (param.ownerId == item.value) {
          item1.ownerId = item.value;
        }
      });

    });

    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);
        if (this.inUpdateButton) {
          this.updatadata[0].consigneeCompanyId = this.validateForm1.get('consigneeCompanyId').value;
          console.log(this.validateForm1.get('endPoint').value);
          this.itemData.forEach(item => {
            item.endPoint = this.validateForm1.get('endPoint').value;
            item.endLocationName = this.inputModalModel;
          });
          this.itemUpdatedata = this.itemData.filter(x => x.checked);
          console.log(this.itemUpdatedata);
          this.title = `流向：${this.itemUpdatedata[0].startLocationName}->${this.itemUpdatedata[0].endLocationName}  重量：${Number(this.sumItemInputWeight()).toFixed(3)} `;
          this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
          this.tplModal1.destroy();
          this.dataSetAdd = [];
          this.implistLoading = false;
          this.inUpdateButton = false;
          this.buttonId = 'Directional';
          this.http.post(urls.getPriceByLocationId, {
            locationId: this.itemUpdatedata[0].endPoint,
            businessModuleId: this.updatadata[0].businessModuleId
          }).then(res => {
            if (res.success) {
              console.log(res);

              this.receivablePrice = res.data.data[0] && res.data.data[0].totalPrice || undefined;
              if (this.updatadata[0].businessModuleId == '025') {


                const priceParam: any = {};
                priceParam.company_id = this.info.APPINFO.USER.companyId;
                priceParam.start_province_name = this.itemUpdatedata[0].startProvinceName;
                priceParam.start_city_name = this.itemUpdatedata[0].startCityName;
                priceParam.start_area_name = this.itemUpdatedata[0].startDistrictName;
                priceParam.end_province_name = this.itemUpdatedata[0].endProvinceName;
                priceParam.end_city_name = this.itemUpdatedata[0].endCityName;
                priceParam.end_area_name = this.itemUpdatedata[0].endDistrictName || '';
                priceParam.product_name = this.itemUpdatedata[0].productName;
                priceParam.price = this.receivablePrice || '';
                this.http.post(TRANS_URLS.getOutPrice, priceParam).then(res => {
                  console.log(res);
                  let web_price = '';
                  let recommend_price = '';
                  let price = '';
                  if (res.data.data.web_price == '') {
                    web_price = '--';
                    this.web_price = '';
                  } else {
                    web_price = Number(res.data.data.web_price).toFixed(2);
                  }
                  if (res.data.data.recommend_price == '') {
                    recommend_price = '--';
                    this.recommend_price = '';
                  } else {
                    recommend_price = Number(res.data.data.recommend_price).toFixed(2);
                  }
                  if (priceParam.price == '') {
                    price = '--';
                    this.unit_price = '';
                  } else {
                    price = Number(priceParam.price).toFixed(2);
                  }
                  this.price = `推荐价${recommend_price}元/吨  （基准价：${price} 元/吨，其他平台价：${web_price} 元/吨）`;
                });

              }
            }
          });
          // 111111
          this.http.post(urls.getShouldPayPrice, {
            locationId: this.itemUpdatedata[0].endPoint,
            businessModuleId: this.updatadata[0].businessModuleId
          }).then(res => {
            if (res.success) {
              this.shouldPayPrice = res.data.data[0] && res.data.data[0].totalPrice || undefined;
            }
          });
        } else {
          this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
          this.tplModal1.destroy();
          this.dataSetAdd = [];
          this.searchList(this.tempSearchParam);

          this.updatadata = [];
        }

        this.implistLoading = false;
      }
      this.implistLoading = false;
    });
  }

  isfillingWeight() {
    let count = 0;
    let flag = false;
    this.dataSetAdd.forEach(item => {
      console.log(item);
      if (item.totalWeight == '' || item.productName == '') {
        flag = true;
        count = 1;
        return;
      }
      if (item.totalWeight == undefined || item.productName == undefined) {
        flag = true;
        count = 1;
        return;
      }
      if (item.totalWeight <= 0) {
        flag = true;
        count = 2;
        return;
      }
      if (item.specDesc != undefined && item.specDesc.length > 20) {
        flag = true;
        count = 3;
        return;
      }
      if (item.remark != undefined && item.remark.length > 30) {
        flag = true;
        count = 4;
        return;
      }
      if (item.totalWeight.length > 18) {
        flag = true;
        count = 5;
        return;
      }
      if (item.warehouseOutNo != undefined && item.warehouseOutNo.length > 20) {
        flag = true;
        count = 6;
        return;
      }
    });
    if (flag) {
      if (count == 1) {
        this.nzMess.error('请填写表中参考运量和品种');
      }
      if (count == 2) {
        this.nzMess.error('参考运量填写错误，应大于0，请重新填写！');
      }
      if (count == 3) {
        this.nzMess.error('规格限制20个字，请重新输入！');
      }
      if (count == 4) {
        this.nzMess.error('备注限制30个字，请重新输入！');
      }
      if (count == 5) {
        this.nzMess.error('参考运量限制14位，请重新输入！');
      }
      if (count == 6) {
        this.nzMess.error('出库仓库号限制20个字，请重新输入！');
      }
    }
    return flag;
  }

  modelChange2(data: any) {
    console.log(data);
  }

  /**
   * 抢单单价/包车价不可超过9位
   * @param value
   */
  inputNumberChange(value: Number) {
    if (value >= 999999999) {
      this.nzMess.error('价格不可超过999999999(9位)');
      return;
    }
  }

  /**
   *竞价，抢单含税价格上限不超过9位
   * @param value
   */
  ceilingPriceTaxChange(value: Number) {
    if (value >= 999999999) {
      this.nzMess.error('价格不可超过999999999(9位)');
      return;
    }
  }

  // 获取静态数据
  getStatic1(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  /*
  * 常用托运人的选择
  */
  TYRChange(data: any) {
    // console.log(data)
    this.startPointArr1 = this.selectZCD(this.startPointArr, data);
    this.validateForm1.get('startPoint').setValue(this.startPointArr1[0] && this.startPointArr1[0].value || undefined);
  }

  /*
  *  查询常用装车点
  */
  selectZCD(data1: Array<any>, code: any): Array<any> {
    const arr: Array<any> = [];
    for (let i = 0; i < data1.length; i++) {
      if (data1[i].relatedCode == undefined) {
        continue;
      }
      if (data1[i].relatedCode == code) {
        arr.push(data1[i]);
      }
    }
    return arr;
  }

  modelChangeVehicleNo(data: any, data1: any) {
    data1.vehicleNoList.forEach(item1 => {
      if (item1.vehicleNo == data) {
        data1.truckWeight = item1.truckWeight;
        data1.vehicleKind = item1.vehicleKind;
        data1.checked = true;
      }

    });
    if (data1.vehicleNoList.filter(x => x.vehicleNo == data).length == 0) {
      data1.truckWeight = null;
      data1.vehicleKind = null;
      data1.checked = true;
    }
    this.dataSet4.forEach(item => {
      if (data1.userId !== item.userId) {
        item.checked = false;
      }
    });
    this.updatadata3 = this.dataSet4.filter(x => x.checked);
    if ([data].length == 0) {
      this.dataSet4.forEach((item: any) => {
        if (!item.isChange) {
          item.bidRatio = null;
          item.entrustedWeight = null;
          item.settleType = null;
          item.unitPrice = null;
          item.priceStatus = null;
        }
      });
    }

    console.log(this.dataSet4);
    this.dataSet4.forEach((item: any) => {
      for (let i = 0; i < this.updatadata3.length; i++) {
        if (item.name == this.updatadata3[i].name) {
          item.bidRatio = 1 / this.updatadata3.length;
          item.entrustedWeight = this.sumItemInputWeight() * item.bidRatio;
          // item.entrustedWeight = item.truckWeight
          // let count: number = this.sumItemInputWeight();
          // // item.entrustedWeight = this.sumItemInputWeight() * item.bidRatio;
          // if (!item.isChange) {
          //   item.bidRatio = 1 / this.updatadata3.filter(x => !x.isChange).length;
          //   this.updatadata3.filter(x => x.isChange).forEach(item1 => {
          //     count = count - item1.entrustedWeight;
          //   });
          //   item.entrustedWeight = count * item.bidRatio;
          // }
          return;
        } else {
          if (!item.isChange) {
            item.bidRatio = null;
            item.entrustedWeight = null;
          }
        }
      }

    });
  }

  modelChangeVehicleNo1(data: any, data1: any) {
    // this.dataSet3.forEach(item=>{})
    //   data1.vehicleNoList.forEach(item1 => {
    //     if (item1.vehicleNo == data) {
    //       data1.truckWeight = item1.truckWeight;
    //       data1.vehicleKind = item1.vehicleKind;
    //       data1.checked = true
    //     }
    //   });
    //   this.dataSet3.forEach(item=>{
    //     if(data1!==item){
    //       item.checked = false
    //     }
    //   })
    //   this.updatadata3 = this.dataSet3.filter(x=>x.checked);
    let banList :any = this.isBlackList([data1]);
    window.setTimeout(()=>{

      data1.vehicleNoList.forEach(item1 => {
        if (item1.vehicleNo == data) {
          data1.truckWeight = item1.truckWeight;
          data1.vehicleKind = item1.vehicleKind;
          data1.checked = true;
        }

      });
      if (data1.vehicleNoList.filter(x => x.vehicleNo == data).length == 0) {
        data1.truckWeight = null;
        data1.vehicleKind = null;
        data1.checked = true;
      }
      this.dataSet3.forEach(item => {
        if (data1.userId !== item.userId) {
          item.checked = false;
        }
      });
      this.updatadata3 = this.dataSet3.filter(x => x.checked);
      if ([data1].length == 0) {
        this.dataSet3.forEach((item: any) => {
          item.bidRatio = null;
          item.entrustedWeight = null;
          item.settleType = null;
          item.unitPrice = null;
          item.priceStatus = null;
        });
      }

      // console.log(this.dataSet4);
      this.dataSet3.forEach((item: any) => {
        for (let i = 0; i < this.updatadata3.length; i++) {
          if (item.name == this.updatadata3[i].name) {
            item.bidRatio = 1 / this.updatadata3.length;
            // item.entrustedWeight = this.sumItemInputWeight()*item.bidRatio;
            // item.entrustedWeight = item.truckWeight
            item.entrustedWeight = this.updatadata2[0].entrustedWeight * item.bidRatio;
            return;
          } else {
            item.bidRatio = null;
            item.entrustedWeight = null;
          }
        }

      });
      banList.forEach(item=>{
        if(item.userId){
          if(data1.userId===item.userId){
            data1.checked = false;
            this.nz.warning('提示信息','该司机在黑名单中无法调度，请选择其他司机')
          }
        }else if(item.auditVehicleNo){
          if(data===item.auditVehicleNo){
            data=undefined;
            data1.vehicleNo=undefined;
            this.nz.warning('提示信息','该车牌未审核无法调度，请选择其他车牌')
          }
        }else if(item.vehicleNo){
          if(data===item.vehicleNo){
            data=undefined;
            data1.vehicleNo=undefined;
            this.nz.warning('提示信息','该车牌在黑名单中无法调度，请选择其他车牌')
          }
        }
      })
    },500)

  }

  colName1(data: any) {
    const vehicleNo = data.filter(x => x.colEname === 'vehicleNo');
    vehicleNo[0].tdTemplate = this.vehicleNo3;
  }

  colName2(data: any) {
    const vehicleNo = data.filter(x => x.colEname === 'vehicleNo');
    vehicleNo[0].tdTemplate = this.vehicleNo1;
  }

  colName3(data: any) {
    const vehicleNo = data.filter(x => x.colEname === 'vehicleNo');
    vehicleNo[0].tdTemplate = this.vehicleNo2;
  }

  /**
   * 承运人选择
   * @param param
   */
  updateCarriageDataResult(param: Array<any>) {
    param.forEach(
      value => {
        if (value.checked) {
          if (!this.carriageSeletedList.some(value1 => value.companyId === value1)) {
            this.carriageSeletedList.push(value.companyId);
          }
        } else {
          this.carriageSeletedList = this.carriageSeletedList.filter(
            value1 => value1 !== value.companyId
          );
        }
      }
    );
  }

  /**
   * 司机选择
   * @param param
   */
  updateDriverDataResult(param: Array<any>) {
    let banList :any = this.isBlackList(param);
    window.setTimeout(()=>{
      banList.forEach(item=>{
        if(item.userId){
          param.forEach(item1=>{
            if(item1.userId===item.userId){
              item1.checked = false;
              this.nz.warning('提示信息','该司机在黑名单中无法调度，请选择其他司机')
              param.splice(param.indexOf(item1),1);
            }
          })
        }
      })
      this.driverSeletedList = param;
    },500)

  }

  pageIndexCarriageEmit(param: number) {
    // this.getBidderCompany({...this.bidderSearchTmp, page: param});
  }

  pageSizeCarriageEmit(param: number) {
    this.pageCarriageSize = param;
    // this.getBidderCompany({...this.bidderSearchTmp, page: 1, length: this.pageCarriageSize});
  }

  pageIndexDriverEmit(param: number) {
    // this.getDriverData({...this.driverSearchTmp, page: param});
  }

  pageSizeDriverEmit(param: number) {
    // this.pageDriverSize = param;
    // this.getDriverData({...this.driverSearchTmp, page: 1, length: this.pageDriverSize});
  }

  search(param: string) {
    switch (param) {
      case 'carriageSearch': {
        this.bidderCompanyList = this.bidderCompanyListStorage.filter(
          value => value.companyName && value.companyName.indexOf(this.searchCarriageValue) !== -1
        );

      }
        break;
      case 'driverSearch': {
        this.driverList = this.driverListStorage.filter(
          value => value.name && value.name.indexOf(this.searchDriverValue) !== -1
        );
      }
        break;
    }
  }

  reset(param: string) {
    switch (param) {
      case 'carriageSearch': {
        this.searchCarriageValue = '';
        this.getBidderCompany({...this.bidderSearchTmp, bidderCompanyName: this.searchCarriageValue});
      }
        break;
      case 'driverSearch': {
        this.searchCarriageValue = '';
        this.getDriverData({...this.driverSearchTmp, name: this.searchDriverValue});
      }
        break;
    }

  }

  /*
  *   当数据为成都管厂时定向委托车队勾选数据
  */
  updataDataResult5(data: any) {
    this.updatadata2 = data;
    this.dataSet2.forEach((item: any) => {
      for (let i = 0; i < this.updatadata2.length; i++) {
        if (item.companyName == this.updatadata2[i].companyName) {
          item.bidRatio = 1 / this.updatadata2.length;

          item.entrustedWeight = this.sumItemInputWeight() * item.bidRatio;
          item.unitReceivePrice = this.shouldPayPrice;
          if (item.agreementPrice) {
            item.unitPrice = item.agreementPrice;
          } else if (this.receivablePrice) {
            item.unitPrice = this.receivablePrice;
            item.priceStatus = 'ps10';
          }else{
            item.priceStatus = 'ps10';

          }

          return;
        } else {
          if (item.agreementPrice) {

          } else {
            item.bidRatio = null;
            item.entrustedWeight = null;
            item.remark = null;
            item.settleType = null;
            item.unitPrice = null;
            item.priceStatus = null;
          }
        }
      }

    });
    this.bidderDataArr.forEach(item => {
      if (data[0].companyId == item.bidderCompanyId) {
        return;
      } else {
        this.isCheck = false;
      }
    });


    console.log(this.updatadata);
    if (data.length == 1) {
      // this.dataSet2=[...this.dataSet2];
      const param: any = {
        companyId: this.updatadata[0].consignorCompanyIdRoot,
        platerCompanyId: data[0].companyId,
      };
      this.http.post(urls.selectDriverData, param).then(res => {
        console.log(res);
        if (res.success) {
          this.dataSet3 = res.data.data;
        }
      });
    } else {
      this.dataSet3 = [];
      this.updatadata3 = [];
    }

  }

  /*
*   当数据为成都管厂时定向委托司机勾选数据
*/
  updataDataResult6(data: any) {
    let banList :any = this.isBlackList(data);
    window.setTimeout(()=>{
      console.log(banList)
      banList.forEach(item=>{
        if(item.userId){
          data.forEach(item1=>{
            if(item1.userId===item.userId){
              item1.checked = false;
              this.nz.warning('提示信息','该司机在黑名单中无法调度，请选择其他司机')
              data.splice(data.indexOf(item1),1);
            }
          })
        }else if(item.auditVehicleNo) {
          data.forEach(item1=>{
            if(item1.vehicleNo===item.auditVehicleNo){
              item1.vehicleNo = undefined;
              this.nz.warning('提示信息','该车牌未审核无法调度，请选择其他车牌')
            }
          })
        }else if(item.vehicleNo){
          data.forEach(item1=>{
            if(item1.vehicleNo===item.vehicleNo){
              item1.vehicleNo = undefined;
              this.nz.warning('提示信息','该车牌在黑名单中无法调度，请选择其他车牌')
            }
          })
        }
      })

      this.updatadata3 = data;
      console.log(this.updatadata3)
      if (data.length == 0) {
        this.dataSet3.forEach((item: any) => {
          item.bidRatio = null;
          item.entrustedWeight = null;
          item.settleType = null;
          item.unitPrice = null;
          item.priceStatus = null;
        });
      }

      // console.log(this.dataSet4);
      this.dataSet3.forEach((item: any) => {
        for (let i = 0; i < this.updatadata3.length; i++) {
          if (item.name == this.updatadata3[i].name) {
            item.bidRatio = 1 / this.updatadata3.length;
            // item.entrustedWeight = this.sumItemInputWeight()*item.bidRatio;
            // item.entrustedWeight = item.truckWeight
            item.entrustedWeight = this.updatadata2[0].entrustedWeight * item.bidRatio;
            return;
          } else {
            item.bidRatio = null;
            item.entrustedWeight = null;
          }
        }

      });
    },500)


    // this.dataSet4=[...this.dataSet4];
  }

  /*
  *  成都管厂定向委托确定
  */
  importConfirmCDGC() {
    if (this.updatadata2.length === 0) {
      this.nz.error('提示信息', '请选择一个车队');
      return;
    }
    if (this.updatadata3.length > 0) {
      this.driverOKCDGC();
    } else {
      this.fleetOKCDGC();
    }
  }

  /*
  *   成都管厂定向委托
  */
  btnDirectionalNew() {

    this.isMutli = !this.ifMutli();
    if (!this.updatadata || this.updatadata.length < 1 || (!this.itemUpdatedata || this.itemUpdatedata.length < 1)) {
      this.nzMess.error('请选择一条委托记录和委托明细');
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST40'], '勾选数据已取消，不可再做定向委托')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata, 'status', ['ETST50'], '勾选数据已强制完成，不可再做定向委托')) {
      return;
    }
    if (this.isTender()) {
      return;
    }
    if (this.updatadata.filter(x => x.tenderNo).length > 0) {
      this.isTenderNO = true;
    } else {
      this.isTenderNO = false;
    }
    if (this.equalStartPointCDGC()) {
      return;
    }
    /*if(this.equalBusinessModuleId()){
      this.nz.error('提示信息','勾选的数据业务板块并不一致，请重新勾选');
      return;
    }*/
    if (this.equalItemBusinessModuleId()) {
      this.nz.error('提示信息', '勾选的数据业务板块并不一致，请重新勾选');
      return;
    }
    if (this.isInputWeight()) {
      // this.nzMess.error('请给每条明细数据输入重量和件数')
      return;
    }
    this.loadDate = new Date();
    this.title = `流向：${this.itemUpdatedata[0].startLocationName}->${this.itemUpdatedata[0].endLocationName}  重量：${Number(this.sumItemInputWeight()).toFixed(3)} `;
    this.modalTitle = '委托调度 > 定向委托';
    this.tplModal = this.nm.create({
      nzTitle: this.tplCDGCheader,
      nzContent: this.tplCDGCbody,
      nzFooter: this.tplCDGCfooter,
      nzWidth: '75%',
      nzMaskClosable: false,
      nzClosable: false,
    });
    this.isCheck = false;
    this.radiovalue = 'toFleet';
    this.modelChange({});
    this.getStatic1(this.businessNatureArr, 'YWXZ');
    this.businessNature = 'YWXZ10';
    if (this.updatadata[0].tenderNo) {
      const arr = this.updatadata[0].tenderNo.split(',');
      const arr1: any = [];
      arr.forEach(item => {
        arr1.push({name: item, value: item});
      });
      this.tenderNoArr = arr1;
      this.tendNo = arr[0];
      window.setTimeout(()=>{
        this.radioChange1();
      },2000)


    } else if (this.updatadata[0].businessModuleId !== '002'&&this.itemUpdatedata[0].endPoint!="") {
      this.http.post(urls.getPriceByLocationId, {
        locationId: this.itemUpdatedata[0].endPoint,
        businessModuleId: this.updatadata[0].businessModuleId
      }).then(res => {
        if (res.success) {
          console.log(res);

          this.receivablePrice = res.data.data[0] && res.data.data[0].totalPrice || undefined;
          if (this.updatadata[0].businessModuleId == '025') {


            const priceParam: any = {};
            priceParam.company_id = this.info.APPINFO.USER.companyId;
            priceParam.start_province_name = this.itemUpdatedata[0].startProvinceName;
            priceParam.start_city_name = this.itemUpdatedata[0].startCityName;
            priceParam.start_area_name = this.itemUpdatedata[0].startDistrictName;
            priceParam.end_province_name = this.itemUpdatedata[0].endProvinceName;
            priceParam.end_city_name = this.itemUpdatedata[0].endCityName;
            priceParam.end_area_name = this.itemUpdatedata[0].endDistrictName || '';
            priceParam.product_name = this.itemUpdatedata[0].productName;
            priceParam.price = this.receivablePrice || '';
            this.http.post(TRANS_URLS.getOutPrice, priceParam).then(res => {
              console.log(res);
              let web_price = '';
              let recommend_price = '';
              let price = '';
              if (res.data.data.web_price == '') {
                web_price = '--';
                this.web_price = '';
              } else {
                web_price = Number(res.data.data.web_price).toFixed(2);
              }
              if (res.data.data.recommend_price == '') {
                recommend_price = '--';
                this.recommend_price = '';
              } else {
                recommend_price = Number(res.data.data.recommend_price).toFixed(2);
              }
              if (priceParam.price == '') {
                price = '--';
                this.unit_price = '';
              } else {
                price = Number(priceParam.price).toFixed(2);
              }
              this.price = `推荐价${recommend_price}元/吨  （基准价：${price} 元/吨，其他平台价：${web_price} 元/吨）`;
            });

          }
        }
      });
      // 111111
      this.http.post(urls.getShouldPayPrice, {
        locationId: this.itemUpdatedata[0].endPoint,
        businessModuleId: this.updatadata[0].businessModuleId
      }).then(res => {
        if (res.success) {
          this.shouldPayPrice = res.data.data[0] && res.data.data[0].totalPrice || undefined;
        }
      });
    }


  }

  /*
  *   判断定向委托为成都管厂还是日照钢铁
  */
  btnDirectionalChoide() {

    if (!this.updatadata || this.updatadata.length < 1 || (!this.itemUpdatedata || this.itemUpdatedata.length < 1)) {
      this.nzMess.error('请选择一条委托记录和委托明细');
      return;
    }
    this.getStyleType(this.updatadata[0].businessModuleId);
    console.log(this.styleType);
    window.setTimeout(() => {
      if (this.styleType === 'RGC000000882') {
        this.btnDirectional();
      } else if (this.styleType === 'CDC000000888') {
        this.btnDirectionalNew();
      } else if (this.styleType === 'SHC000000882') {
        this.btnDirectional();
      }
    }, 1000);
    // if (this.updatadata[0].consignorCompanyIdRoot === 'C000000888') {
    //   this.btnDirectionalNew();
    // } else {
    //   this.btnDirectional();
    // }
  }

  /*
  *     成都管厂定向委托到司机
  */
  driverOKCDGC() {
    if (this.isEndPointEqual()) {
      return;
    }

    if (this.updatadata2[0].agreementPrice !== this.updatadata2[0].unitPrice && this.updatadata[0].tenderNo && !this.remark && this.isTenderNO) {
      this.nzMess.error('招标数据修改后必须填写备注，请填写备注！');
      return;
    }
    if (this.isDriverWeight()) {
      this.implistLoading = false;
      return;
    }

    if (Number(this.sumDriverWeight()) !== this.updatadata2[0].entrustedWeight) {
      this.implistLoading = false;
      this.nzMess.error('司机输入总重量不等于车队重量，请重新输入！');
      return;
    }
    if (this.isUnitPrice()) {
      this.implistLoading = false;
      this.nzMess.error('单价长度不可超过12位');
      return;
    }
    if (!this.loadDate) {
      this.nzMess.error('请选择装车时间!');
      return;
    }

    this.implistLoading = true;
    const url = TRANS_URLS.saveSchedule;
    const param: any = {};
    // param.tOrderItemModels = this.itemUpdatedata;
    // param.tTenderPriceModelList = this.updatadata3;
    param.tOrderModelList = [] = this.updatadata;
    for (let i = 0; i < param.tOrderModelList.length; i++) {
      param.tOrderModelList[i].businessNature = this.businessNature;
      param.tOrderModelList[i].tOrderItemModels = [];
      this.itemUpdatedata.forEach((element: any) => {
        if (param.tOrderModelList[i].orderNo == element.orderNo) {
          param.tOrderModelList[i].tOrderItemModels.push(element);
        }
      });
      param.tOrderModelList[i].remark = this.remark;
    }
    param.tTenderPriceModelList = this.updatadata3;
    param.tTenderPriceModelList.forEach(item => {
      item.unitPrice = this.updatadata2[0].unitPrice;
      item.consignorCompanyId = this.updatadata2[0].companyId;
      item.companyId = this.updatadata2[0].companyId;
      item.settleType = 'JSFS20';
      item.priceStatus = this.updatadata2[0].priceStatus;
      item.unitReceivePrice = this.updatadata2[0].unitReceivePrice;
    });

    param.loadDate = Utils.dateFormat(this.loadDate, 'yyyy-MM-dd');

    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.nz.create('success', '提示信息', res.data.data.data, {nzDuration: 6000});
        this.tplModal.destroy();
        this.isCheck = false;
        this.radiovalue = null;
        this.updatadata2 = [];
        this.updatadata3 = [];
        this.dataSet2 = [];
        this.itemData = [];
        this.dataSet3 = [];
        this.fleet = null;
        this.driver = null;
        this.updatadata = [];
        this.itemUpdatedata = [];
        this.remark = null;
        this.tendNo = null;
        this.bidderDataArr = [];
        this.tenderNoArr = [];
        this.receivablePrice = undefined;
        this.businessNatureArr = [];
        this.getList1(this.tempSearchParam);
      }
      this.implistLoading = false;
    });
    let param1: any = {};
    if (this.updatadata[0].businessModuleId === '025') {
      param1.company_id = this.info.APPINFO.USER.companyId;
      param1.order_no = this.updatadata[0].orderNo;
      param1.result_price = this.updatadata2[0].unitPrice;
      param1.unit_price = this.unit_price;
      param1.web_price = this.unit_price;
      param1.recommend_price = this.recommend_price;
      this.http.post(TRANS_URLS.logOutPrice, param1);
    }
  }

  /*
   *    成都管厂定向委托到司机判断
  */
  isDriverWeight() {
    let flag: any = false;
    let count = 0;
    for (let i = 0; i < this.updatadata3.length; i++) {
      if (!this.updatadata3[i].entrustedWeight) {
        flag = true;
        count = 1;
        break;
      }
      if (this.updatadata3[i].entrustedWeight < 0) {
        flag = true;
        count = 2;
        break;
      }
    }
    if (count == 1) {
      this.nzMess.error('请给每一条司机信息填写重量');
    } else if (count == 2) {
      this.nzMess.error('输入重量不能小于0');
    }
    return flag;
  }

  /*
  *   司机总重量求和
  */
  sumDriverWeight() {
    let sum: any = 0;
    this.updatadata3.forEach(item => {
      sum += this.isNotANumber(item.entrustedWeight);
    });
    return sum;
  }

  /*
  *   成都管厂定向委托到车队
  */
  fleetOKCDGC() {
    if (this.sumFleet()) {
      this.implistLoading = false;
      return;
    }

    if (this.isEndPointEqual()) {
      return;
    }
    if (this.updatadata2[0].agreementPrice !== this.updatadata2[0].unitPrice && this.updatadata[0].tenderNo && !this.remark && this.isTenderNO) {
      this.nzMess.error('招标数据修改后必须填写备注，请填写备注！');
      return;
    }
    if (this.isUnitPrice()) {
      this.implistLoading = false;
      this.nzMess.error('单价长度不可超过12位');
      return;
    }
    if (this.remark && this.remark.length > 255) {
      this.implistLoading = false;
      this.nzMess.error('备注最大长度为255');
      return;
    }

    if (!this.loadDate) {
      this.nzMess.error('请选择装车时间!');
      return;
    }
    this.implistLoading = true;
    const url = TRANS_URLS.saveEntrust;
    const param: any = {};
    // param.tOrderItemModels = this.itemUpdatedata;
    //     param.tTenderPriceModelList = this.updatadata2;
    param.tOrderModelList = [] = this.updatadata;
    // param.tOrderModelList.forEach((item:any)=>{
    //   this.itemUpdatedata.forEach((element:any)=>{
    //     if(item.orderNo = element.orderNo){
    //       item.tOrderItemModels =[];
    //       item.tOrderItemModels.push(element);
    //     }
    //   })
    // })
    for (let i = 0; i < param.tOrderModelList.length; i++) {
      param.tOrderModelList[i].tOrderItemModels = [];
      param.tOrderModelList[i].businessNature = this.businessNature;
      this.itemUpdatedata.forEach((element: any) => {
        if (param.tOrderModelList[i].orderNo == element.orderNo) {
          param.tOrderModelList[i].tOrderItemModels.push(element);
        }
      });
      param.tOrderModelList[i].remark = this.remark;

    }
    param.tTenderPriceModelList = this.updatadata2;
    param.tTenderPriceModelList.forEach(item => {
      item.settleType = 'JSFS10';
    });
    param.loadDate = Utils.dateFormat(this.loadDate, 'yyyy-MM-dd');

    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.nz.create('success', '提示信息', res.data.data.data, {nzDuration: 3000});
        this.tplModal.destroy();
        this.isCheck = false;
        this.itemData = [];
        this.radiovalue = null;
        this.updatadata2 = [];
        this.updatadata3 = [];
        this.dataSet2 = [];
        this.dataSet3 = [];
        this.fleet = null;
        this.driver = null;
        this.tendNo = null;
        this.bidderDataArr = [];
        this.tenderNoArr = [];
        this.updatadata = [];
        this.itemUpdatedata = [];
        this.remark = null;
        this.receivablePrice = undefined;
        this.businessNatureArr = [];
        this.getList1(this.tempSearchParam);
      }
      this.implistLoading = false;
    });
    let param1: any = {};
    if (this.updatadata[0].businessModuleId === '025') {
      param1.company_id = this.info.APPINFO.USER.companyId;
      param1.order_no = this.updatadata[0].orderNo;
      param1.result_price = this.updatadata2[0].unitPrice;
      param1.unit_price = this.unit_price;
      param1.web_price = this.unit_price;
      param1.recommend_price = this.recommend_price;
      this.http.post(TRANS_URLS.logOutPrice, param1);
    }
  }

  isEndPointEqual() {
    let flag: boolean = false;
    this.itemUpdatedata.forEach(item => {
      if (item.endPoint == undefined || item.endPoint == null || item.endPoint == '') {
        this.nzMess.error('请填写目的地!');
        flag = true;
      }
    });
    return flag;
  }

  /*
  *  选择框获取数据
  */
  inpEmit(data: any) {
    console.log(data);
    if (data.inpValidate === 'INVALID') {
      console.log('change');
      this.showPagination = true;
      return;
    } else {
      this.showPagination = false;
    }
    if (data.selData.length === 0) {

    } else {
      this.validateForm1.get('provinceId').setValue(data.selData[0].provinceCode);
      this.validateForm1.get('cityId').setValue(data.selData[0].cityCode);
      this.validateForm1.get('districtId').setValue(data.selData[0].districtCode);
      this.validateForm1.get('endPoint').setValue(data.selData[0].locationId);
      this.inputModalModel = data.selData[0].locationName;
    }
  }

  /*
  *  收货单位选取返回
  */
  inpEmitConsigeeComanyId(data:any){
    console.log(data.selData[0].companyId)
    this.customerId = data.selData[0].companyId;
    console.log(this.validateForm1)
    if(this.inUpdateButton){
      this.validateForm1.get('consigneeCompanyId').reset({value: data.selData[0].companyId, disabled: true})
    }else{

      this.validateForm1.get('consigneeCompanyId').setValue(data.selData[0].companyId);
    }
    const param = {customerId: this.customerId, isDefault: '10'};
    this.http.post(urls.selectConsigneeCompanyId, param).then(res => {
      console.log(res);
      if (res.success) {
        if (res.data.data.data.length != 0) {
          if (this.buttonId === 'Update' && this.flag) {
            this.flag = false;
          } else {
            this.showPagination = false;
            this.validateForm1.get('provinceId').setValue(res.data.data.data[0].provinceCode);
            this.validateForm1.get('cityId').setValue(res.data.data.data[0].cityCode);
            this.validateForm1.get('districtId').setValue(res.data.data.data[0].districtCode);
            this.validateForm1.get('endPoint').setValue(res.data.data.data[0].locationId);
            this.inputModalModel = res.data.data.data[0].locationName;

          }
        } else {
          console.log('change');
          this.showPagination = true;
          this.validateForm1.get('provinceId').setValue(null);
          this.validateForm1.get('cityId').setValue(null);
          this.validateForm1.get('districtId').setValue(null);
          this.validateForm1.get('endPoint').setValue(null);
          this.inputModalModel = null;
          this.nzMess.warning('暂无默认详细地址,请在详细地址中新增默认地址');
        }
      }
    });
  }

  /*
  *   原收货单位选取（废弃）
  */
  modelchangeConsigneeCompanyId(data: any) {
    console.log(21222);
    console.log(data);
    this.customerId = data;
    const param = {customerId: this.customerId, isDefault: '10'};
    this.http.post(urls.selectConsigneeCompanyId, param).then(res => {
      console.log(res);
      if (res.success) {
        if (res.data.data.data.length != 0) {
          if (this.buttonId === 'Update' && this.flag) {
            this.flag = false;
          } else {
            this.showPagination = false;
            this.validateForm1.get('provinceId').setValue(res.data.data.data[0].provinceCode);
            this.validateForm1.get('cityId').setValue(res.data.data.data[0].cityCode);
            this.validateForm1.get('districtId').setValue(res.data.data.data[0].districtCode);
            this.validateForm1.get('endPoint').setValue(res.data.data.data[0].locationId);
            this.inputModalModel = res.data.data.data[0].locationName;

          }
        } else {
          console.log('change');
          this.showPagination = true;
          this.validateForm1.get('provinceId').setValue(null);
          this.validateForm1.get('cityId').setValue(null);
          this.validateForm1.get('districtId').setValue(null);
          this.validateForm1.get('endPoint').setValue(null);
          this.inputModalModel = null;
          this.nzMess.warning('暂无默认详细地址,请在详细地址中新增默认地址');
        }
      }
    });


  }

  isUnitPrice() {
    let flag = false;
    this.updatadata2.forEach(item => {
      if (item.unitPrice && Number(item.unitPrice.length) > 12) {
        flag = true;
      }
    });
    return flag;
  }

  /**
   * 按键事件
   */
  keydown(param: any, type: string) {
    if (param.code === 'Enter' || param.code === 'NumpadEnter') {
      this.search(type);
    }
    // switch (type) {
    //   case 'carriageSearch': {
    //     if (param.code === 'Enter') {
    //       this.search('carriageSearch');
    //     }
    //   }
    //     break;
    //   case 'driverSearch': {
    //     if (param.code === 'Enter') {
    //       this.search('driverSearch');
    //     }
    //   }
    //     break;
    // }
  }

  modelChangeAdd(data: any, data1: any) {
    console.log(this.dataSet3);
    let flag = false;
    data1.vehicleNoList.forEach(item1 => {
      if (item1.vehicleNo == data) {
        data1.truckWeight = item1.truckWeight;
        data1.vehicleKind = item1.vehicleKind;
        flag = true;
      }
    });
    if (!flag) {
      data1.truckWeight = null;
      data1.vehicleKind = null;
    }
    data1.vehicleNo = data;
  }

  open1(data: any) {
    data.open = true;
  }

  businiessModuleIdChange(data: any) {
    if (this.validateFormAdd.get('consignorCompanyId').value == null || data == null) {
      return;
    }
    const url = TRANS_URLS.getPlateCompanyName;
    this.loading = true;
    const param: any = {businessModuleId: data};
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);

        this.dataSet2 = res.data.data.data;
        this.loading = false;
        this.dataSet3 = [];
      }
    });
  }

  updataDataResult7(data: any) {
    this.updatadata2 = data;
    if (this.updatadata2.length === 0) {
      this.dataSet3 = [];
    }
    if (this.updatadata2.length === 1) {
      this.loading1 = true;
      this.http.post(urls.selectDriverData, {
        platerCompanyId: this.updatadata2[0].companyId,
        companyId: this.validateFormAdd.get('consignorCompanyId').value
      }).then(res => {
        console.log(res);
        if (res.success) {
          this.dataSet3 = res.data.data;
        }
        this.loading1 = false;
      });
    }
  }

  updataDataResult8(data: any) {
    this.updatadata3 = data;
  }

  btnAddSchedule() {
    this.validateFormAdd = this.fb.group({
      consignorCompanyId: [null],
      startPoint: [null, [Validators.required]],
      provinceId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      districtId: [null],
      businessTime: [null, [Validators.required]],
      businessModuleId: [null, [Validators.required]],
    });
    this.validateFormAdd.reset();
    this.validateFormAdd.get('cityId').reset({value: null, disabled: true});
    this.validateFormAdd.get('districtId').reset({value: null, disabled: true});
    this.modalTitle = '委托调度 > 新增调度单';
    this.tplModal = this.nm.create({
      nzTitle: this.tplAddheader,
      nzContent: this.tplAddbody,
      nzFooter: this.tplAddfooter,
      nzWidth: '80%',
      nzMaskClosable: false,
      nzClosable: false,
    });
    this.validateFormAdd.get('consignorCompanyId').setValue(this.consignorCompanyArr[0].value);
    this.TYRChange(this.consignorCompanyArr[0] && this.consignorCompanyArr[0].value || undefined);
    this.validateFormAdd.get('startPoint').setValue(this.startPointArr1[0].value);
    this.validateFormAdd.get('businessTime').setValue(this.getLocalTime());
    this.validateFormAdd.get('businessModuleId').setValue(this.businessModuleIdArr[0].value);
    this.businiessModuleIdChange(this.businessModuleIdArr[0].value);

  }


  importConfirm4() {
    for (const i in this.validateFormAdd.controls) {
      this.validateFormAdd.controls[i].markAsDirty();
      this.validateFormAdd.controls[i].updateValueAndValidity();
    }
    if (this.validateFormAdd.status == 'INVALID') {
      return;
    }
    if (this.updatadata2.length != 1) {
      this.nzMess.error('请勾选一个车队');
      return;
    }
    if (this.cm.canOperate(this.updatadata2, 'settleType', ['', undefined, null], '请给勾选车队选择是否含税')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata2, 'priceStatus', ['', undefined, null], '请给勾选车队选择价格状态')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata2, 'unitPrice', ['', undefined, null], '请给勾选车队填写金额')) {
      return;
    }
    if (this.updatadata2[0].unitPrice.length > 18) {
      this.nzMess.error('金额最多输入12位');
      return;
    }

    if (this.updatadata3.length != 1) {
      this.nzMess.error('请勾选一个司机');
      return;
    }
    if (this.dataSetAdd.length < 1) {
      this.nzMess.error('请至少添加一条明细');
      return;
    }
    if (this.isfillingWeight()) {
      return;
    }
    this.implistLoading = true;
    const url = TRANS_URLS.consignorCompanyAddSchedule;
    let param: any = {};
    param = this.validateFormAdd.getRawValue();
    param.remark = this.remark;
    param.planDriver = {};
    console.log(this.updatadata3);
    param.planDriver.driverName = this.updatadata3[0].name;
    param.planDriver.driverId = this.updatadata3[0].userId;
    param.planDriver.vehicleNo = this.updatadata3[0].vehicleNo;
    param.planDriver.mobile = this.updatadata3[0].mobile;
    param.planDriver.planWeight = this.updatadata3[0].entrustedWeight;
    param.businessTime = param.businessTime && param.businessTime instanceof Date ? Utils.dateFormat(param.businessTime, 'yyyy-MM-dd') : param.businessTime || '';
    param.tOrderItemModels = this.dataSetAdd;
    param.tTenderPriceModel = this.updatadata2[0];
    param.tOrderItemModels.forEach(item1 => {


      this.consignorCompanyArr.forEach(item => {
        if (param.consignorCompanyId == item.value) {
          param.consignorCompanyName = item.name;
        }
      });
      this.startPointArr.forEach(item => {
        if (param.startPoint == item.value) {
          param.startLocationName = item.name;
          item1.startPoint = item.value;
          item1.startLocationName = item.name;
        }
      });
      this.provinceArr.forEach(item => {
        if (param.provinceId == item.code) {
          param.provinceName = item.name;
          item1.endProvinceCode = item.code;
          item1.provinceName = item.name;
        }
      });
      this.cityArr.forEach(item => {
        if (param.cityId == item.code) {
          param.cityName = item.name;
          item1.endCityCode = item.code;
          item1.cityName = item.name;
        }
      });
      this.areaArr.forEach(item => {
        if (param.districtId == item.code) {
          param.districtName = item.name;
          item1.endDistrictCode = item.code;
          item1.districtName = item.name;
        } else if (param.districtId == null) {
          param.districtName = null;
          item1.endDistrictCode = null;
          item1.districtName = null;
        }
      });
    });
    console.log(param);
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.tplModal.destroy();
        this.dataSetAdd = [];
        this.updatadata2 = [];
        this.updatadata3 = [];
        this.searchList(this.tempSearchParam);
        this.implistLoading = false;
      }
    });
  }

  // 获取省市区
  addressChange1(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.validateFormAdd.get('cityId').reset({value: null, disabled: false});
          this.validateFormAdd.get('districtId').reset({value: null, disabled: true});
        }
      }
        break;
      case 'DZDJ20': {
        if (value) {
          this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.validateFormAdd.get('districtId').reset({value: null, disabled: false});
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value});
        }
      }
        break;
    }
  }

  /**
   * 判断子委托单是否存在业务板块
   */
  businessModuleIdIsEmpty(): boolean {
    return this.itemUpdatedata.some(value => !value.businessModuleId);
  }

  /*
  *   是否使用招投标结果
  */
  radioChange1() {
    if (this.updatadata[0].tenderNo == undefined || this.updatadata[0].tenderNo == null || this.updatadata[0].tenderNo == '') {
      if (this.isCheck == false) {
        this.nzMess.error('该数据没有招标结果，不可使用！');
      }
      return;
    }
    if (this.tendNo == undefined || this.tendNo == null || this.tendNo == '') {
      if (this.isCheck == false) {
        this.nzMess.error('请选择招标单号');
      }
      return;
    }
    if (this.isCheck === true) {
      return;
    }
    this.isCheck = true
    // let url = TRANS_URLS.useBidResult;
    // let param: any = {};
    // param.tOrderItemModels = this.itemUpdatedata;
    // this.http.post(url, param).then((res: any) => {
    //   if (res.success) {
    //     console.log(res);
    //
    //     res.data.data.data.forEach((item: any) => {
    //       for (let i: number = 0; i < this.dataSet2.length; i++) {
    //         console.log(11);
    //         if (item.bidderCompanyId == this.dataSet2[i].companyId) {
    //           //this.dataSet2 = this.dataSet2.filter(item2 =>item2.companyId !== this.dataSet2[i].companyId);
    //           this.dataSet2.splice(i, 1);
    //         }
    //       }
    //     });
    //     this.dataSet2 = [...res.data.data.data, ...this.dataSet2];
    //     console.log(this.dataSet2);
    //   }
    // });
    const url = TRANS_URLS.getFleetTender;
    this.loading = true;
    const param: any = {consignorCompanyId: this.localCompanyId, tenderNos: [this.tendNo]};
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.bidderDataArr = res.data.data;
        const arr: any = [];
        console.log(res);
        res.data.data.forEach((item: any) => {
          for (let i = 0; i < this.dataSet2.length; i++) {
            if (item.bidderCompanyId == this.dataSet2[i].companyId) {
              // this.dataSet2 = this.dataSet2.filter(item2 =>item2.companyId !== this.dataSet2[i].companyId);
              arr.push(this.dataSet2[i]);
            }
          }
        });
        arr.forEach(item1 => {
          const index = this.dataSet2.indexOf(item1);
          if (index > -1) {
            this.dataSet2.splice(index, 1);
          }
        });
        this.dataSet2.forEach(item3 => {
          item3.checked = false;
          item3.entrustedWeight = undefined;
          item3.unitPrice = undefined;
        });
        const arr1: any = [];
        for (let i = 0; i < res.data.data.length; i++) {

          arr1.unshift({
            companyId: res.data.data[i].bidderCompanyId,
            companyName: res.data.data[i].bidderCompanyName,
            bidRatio: (res.data.data[i].distributionRatio) / 100,
            entrustedWeight: this.sumItemInputWeight() * ((res.data.data[i].distributionRatio) / 100),
            settleType: 'JSFS20',
            unitPrice: res.data.data[i].bidPriceTaxNo,
            agreementPrice: res.data.data[i].bidPriceTaxNo,
            priceStatus: 'ps' + res.data.data[i].hiredType,
          });

        }

        // this.dataSet2 = res.data.data.data;
        if (this.updatadata2.length == 1) {
          // this.dataSet2=[...this.dataSet2];
          const param: any = {
            companyId: this.updatadata[0].consignorCompanyIdRoot,
            platerCompanyId: this.updatadata2[0].companyId,
          };
          this.http.post(urls.selectDriverData, param).then(res => {
            console.log(res);
            if (res.success) {
              this.dataSet3 = res.data.data;
            }
          });
        }
        this.dataSet2 = [...arr1, ...this.dataSet2];
        this.loading = false;
      }

      this.updatadata2 = this.dataSet2.filter(x => x.checked);
    });
  }

  tenderNoChange(data: any) {
    console.log(data);
    if (data == null) {
      return;
    }
    const url = TRANS_URLS.getFleetTender;
    this.loading = true;
    const param: any = {consignorCompanyId: this.localCompanyId, tenderNos: [this.tendNo]};
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        const arr: any = [];
        console.log(res);
        res.data.data.forEach((item: any) => {
          for (let i = 0; i < this.dataSet2.length; i++) {
            if (item.bidderCompanyId == this.dataSet2[i].companyId) {
              // this.dataSet2 = this.dataSet2.filter(item2 =>item2.companyId !== this.dataSet2[i].companyId);
              arr.push(this.dataSet2[i]);
            }
          }
        });
        arr.forEach(item1 => {
          const index = this.dataSet2.indexOf(item1);
          if (index > -1) {
            this.dataSet2.splice(index, 1);
          }
        });
        this.dataSet2.forEach(item3 => {
          item3.checked = false;
          item3.entrustedWeight = undefined;
          item3.unitPrice = undefined;
        });
        const arr1: any = [];
        for (let i = 0; i < res.data.data.length; i++) {

          arr1.unshift({
            companyId: res.data.data[i].bidderCompanyId,
            companyName: res.data.data[i].bidderCompanyName,
            bidRatio: (res.data.data[i].distributionRatio) / 100,
            entrustedWeight: this.sumItemInputWeight() * ((res.data.data[i].distributionRatio) / 100),
            settleType: 'JSFS20',
            unitPrice: res.data.data[i].bidPriceTaxNo,
            agreementPrice: res.data.data[i].bidPriceTaxNo,
            priceStatus: 'ps' + res.data.data[i].hiredType,
          });

        }

        // this.dataSet2 = res.data.data.data;
        if (this.updatadata2.length == 1) {
          // this.dataSet2=[...this.dataSet2];
          const param: any = {
            companyId: this.updatadata[0].consignorCompanyIdRoot,
            platerCompanyId: this.updatadata2[0].companyId,
          };
          this.http.post(urls.selectDriverData, param).then(res => {
            console.log(res);
            if (res.success) {
              this.dataSet3 = res.data.data;
            }
          });
        }
        this.dataSet2 = [...arr1, ...this.dataSet2];
        this.loading = false;
      }

      this.updatadata2 = this.dataSet2.filter(x => x.checked);
    });
    this.isCheck = true;
  }

  getCarTeam() {
    const url = TRANS_URLS.getCarTeam;
    const param = {
      companyId: this.info.APPINFO.USER.companyId,
      valueSetCode: 'CYCD',
      relatedCode: this.updatadata[0].consignorCompanyIdRoot,
    };
    this.http.post(url, param).then(res => {
      console.log(param);
      console.log(res);
      if (res.success) {
        console.log(res);
        this.carTeamArr = res.data.data;
      }
    });
  }


  /*
  *  定向委托内修改地址
  */
  updateAddress() {
    this.validateForm1 = this.fb.group({
      consignorCompanyId: [null],
      startPoint: [null, [Validators.required]],
      flowId: [null, [Validators.required]],
      provinceId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      consigneeCompanyId: [null, [Validators.required]],
      districtId: [null],
      businessTime: [null, [Validators.required]],
      pickNo: [null],
      continuityType: [null],
      businessModuleId: [null, [Validators.required]],
      endPoint: [null, [Validators.required]],
    });
    if (this.updatadata.length > 1) {
      this.nz.warning('提示信息', '多条委托同时下发不允许修改!');
      return;
    }

    if (this.updatadata[0].status !== 'ETST10') {
      this.nz.warning('提示信息', '已调度数据不可修改');
      return;
    }
    this.buttonId = 'Update';
    this.inUpdateButton = true;
    this.productDisable = true;
    this.btnUpdata = true;
    this.getStyleType(this.updatadata[0].businessModuleId);
    window.setTimeout(() => {
      if (this.styleType === 'CDC000000888' || this.styleType === 'RGC000000882') {
        this.modalTitle = '委托调度 > 修改';
        this.tplModal1 = this.nm.create({
          nzTitle: this.tplTitle5,
          nzContent: this.tplContent5,
          nzFooter: this.tplFooter5,
          nzWidth: '50%',
          nzMaskClosable: false,
          nzClosable: false,
        });
        this.flag = true;
        let url = TRANS_URLS.selectEntrust;
        let param: any;
        param = this.updatadata[0];
        this.http.post(url, param).then(res => {
          if (res.success) {
            console.log(res);
            this.validateForm1.get('consignorCompanyId').reset({value: res.data.data.consignorCompanyId, disabled: true});
            this.validateForm1.get('startPoint').reset({value: res.data.data.tOrderItemModels[0].startPoint, disabled: true});
            this.validateForm1.get('provinceId').setValue(res.data.data.tOrderItemModels[0].endProvinceCode);
            this.validateForm1.get('cityId').setValue(res.data.data.tOrderItemModels[0].endCityCode);
            this.validateForm1.get('districtId').setValue(res.data.data.tOrderItemModels[0].endDistrictCode);
            this.validateForm1.get('businessTime').reset({value: res.data.data.businessTime, disabled: true});
            this.validateForm1.get('flowId').setValue(res.data.data.flowId);
            this.validateForm1.get('pickNo').reset({value: res.data.data.pickNo, disabled: true});
            // this.validateForm1.get('consigneeCompanyId').setValue(res.data.data.consigneeCompanyId);
            let consigeeCompanyID :any={selData:[]};
            consigeeCompanyID .selData.push({companyId:res.data.data.consigneeCompanyId,companyName:res.data.data.companyName})
            this.inpEmitConsigeeComanyId(consigeeCompanyID)
            console.log(111);
            this.validateForm1.get('continuityType').setValue(res.data.data.tOrderItemModels[0].continuityType);
            this.validateForm1.get('businessModuleId').reset({value: res.data.data.businessModuleId, disabled: true});
            this.validateForm1.get('endPoint').setValue(res.data.data.tOrderItemModels[0].endPoint);
            this.dataSetAdd = res.data.data.tOrderItemModels;
            this.dataSetAdd.forEach(item => {
              item.editstate = 0;
            });
            this.inputModalModel = res.data.data.tOrderItemModels[0].endLocationName;
            this.inputModalModelConsigeeCompany = res.data.data.consigneeCompanyName;
            this.dataSetAdd = [...this.dataSetAdd];
            this.customerId = res.data.data.consigneeCompanyId;
            console.log(this.validateForm1.getRawValue());
          }
        });
      } else if (this.styleType === 'SHC000000882') {
        this.modalTitle = '委托调度 > 修改';
        this.tplModal1 = this.nm.create({
          nzTitle: this.tplTitle5,
          nzContent: this.tplContentSHFAdd,
          nzFooter: this.tplFooter5,
          nzWidth: '50%',
          nzMaskClosable: false,
          nzClosable: false,
        });
        this.flag = true;
        let url = TRANS_URLS.selectEntrust;
        let param: any;
        param = this.updatadata[0];
        this.http.post(url, param).then(res => {
          if (res.success) {
            console.log(res);
            this.validateForm1.get('consignorCompanyId').reset({value: res.data.data.consignorCompanyId, disabled: true});
            this.validateForm1.get('startPoint').setValue(res.data.data.tOrderItemModels[0].startPoint);
            this.validateForm1.get('provinceId').setValue(res.data.data.tOrderItemModels[0].endProvinceCode);
            this.validateForm1.get('cityId').setValue(res.data.data.tOrderItemModels[0].endCityCode);
            this.validateForm1.get('districtId').setValue(res.data.data.tOrderItemModels[0].endDistrictCode);
            this.validateForm1.get('businessTime').reset({value: res.data.data.businessTime, disabled: true});
            this.validateForm1.get('flowId').setValue(res.data.data.flowId);
            // this.validateForm1.get('consigneeCompanyId').reset({value: res.data.data.consigneeCompanyId, disabled: true});
            let consigeeCompanyID :any={selData:[]};
            consigeeCompanyID .selData.push({companyId:res.data.data.consigneeCompanyId,companyName:res.data.data.companyName})
            this.inpEmitConsigeeComanyId(consigeeCompanyID)
            console.log(111);
            this.validateForm1.get('continuityType').setValue(res.data.data.tOrderItemModels[0].continuityType);
            this.validateForm1.get('businessModuleId').reset({value: res.data.data.businessModuleId, disabled: true});
            this.validateForm1.get('endPoint').setValue(res.data.data.tOrderItemModels[0].endPoint);
            this.dataSetAdd = res.data.data.tOrderItemModels;
            this.dataSetAdd.forEach(item => {
              item.editstate = 0;
            });
            this.inputModalModel = res.data.data.tOrderItemModels[0].endLocationName;
            this.inputModalModelConsigeeCompany = res.data.data.consigneeCompanyName
            this.dataSetAdd = [...this.dataSetAdd];
            this.customerId = res.data.data.consigneeCompanyId;
            console.log(this.validateForm1.getRawValue());
          }
        });
      }
    }, 1000);

  }


  btnAutoCargo() {
    if (this.updatadata.length <= 0) {
      this.nz.warning('提示信息', '请勾选委托信息！');
      return;
    }
    if (this.canOperate(this.updatadata, 'status', ['ETST10'], '只有初始状态的数据才能进行自动分货！')) {
      return;
    }
    let url = TRANS_URLS.AutoCargo;
    let param: any = {orderNoList: []};
    this.updatadata.forEach(item => {
      param.orderNoList.push(item.orderNo);
    });
    this.http.post(url, param).then(res => {
      console.log(res);
      if (res.success) {
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.getList1(this.tempSearchParam);
      }
    });
  }

  canOperate(list: Array<any>, option: string, statusArr: Array<any>, tipInfo: string): boolean {
    let flag = false;
    list.forEach((item) => {
      if (statusArr.indexOf(item[option]) < 0) {
        flag = true;
      }
    });
    if (flag) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: tipInfo
      });
      // window.setTimeout(() => {
      //   this.tplModal.destroy();
      // }, 1500);
    }
    return flag;
  }

  isBlackList(data:any){
    let url = urls.checkBlackList;
    let param :any={};
    let banList:any=[]
    param.tBlackListModels = data
    this.http.post(url,param).then(res=>{
       if(res.success){
         console.log(res)
          res.data.data.forEach(item=>{
              if(item.userId||item.vehicleNo||item.auditVehicleNo){
                banList.push(item)
              }
          })

       }
    })
    return banList
  }
}
