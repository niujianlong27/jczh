import {Component, OnInit, ViewChild, TemplateRef, EventEmitter} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService, TransferCanMove} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {format} from 'date-fns';
import {urls} from '../../../../common/model/url';
import {of} from 'rxjs/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utils} from '../../../sea/common/utils';
import {UploadFiles} from '../../../../common/services/upload-files';
import {isNumber} from 'util';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-prebid',
  templateUrl: './prebid.component.html',
  styleUrls: ['./prebid.component.css']
})
export class PrebidComponent implements OnInit {
  @ViewChild('confirmTitle') confirmTitle: TemplateRef<any>;
  @ViewChild('confirmContent') confirmContent: TemplateRef<any>;
  @ViewChild('confirmFooter') confirmFooter: TemplateRef<any>;

  @ViewChild('modalContent') content;
  @ViewChild('modalFooter') footer;
  // 页面grid
  gridOneHeight: string;
  gridTwoHeight: string;
  tableHeight = '500px';
  tableWidth = '100%';
  isMutli: boolean = true;
  // 主表单
  dataSet: Array<any> = []; // 表格数据
  searchParam: Array<any> = []; //搜索数据缓存
  listLoading: boolean = true; // 主列表加载状态
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  selectData1: Array<any> = []; // 主列表选择
  totalpage2: number = 0;
  pageSize2: number = 30;
  data2PageTmp: any = {length: 30}; // 货盘明细页码数据缓存
  nextLoading: boolean = false;
  data1: any[] = [];
  data2: any[] = [];
  form: FormGroup;
  modalIsVisible: boolean = false;  // 发布弹框显示标记
  ownerCarriers: Array<any> = []; // 当前展示承运商
  bidCarriers: Array<any> = []; // 当前选中承运商
  tenderPallet: any = {};  // 当前预招标单关联货盘列表
  modalTitle: string;
  settleTypeArr: any[] = [{name: '含税', value: 'JSFS10'}, {name: '不含税', value: 'JSFS20'}];
  calculationArr: any[] = [{name: '参考价', value: '10'}, {name: '拦标价', value: '20'}];
  bidPriceType: string = '10';
  issueBidType: string = '10';
  bidCompanyUser: Array<any> = [];//投标人数据
  searchData: any = {};//存储查询条件
  btnDisabled: any = {
    Result: false,//查看详情
    Withdraw: false,//撤回记录
    Select: false,//评标
    Afresh: false,//重新发标
    Failure: false,//流标
    Update: false,//修改
    TenderStatus:false,// 招标成功
  };
  allColumsArr = [
    {colCname: '汇总单号', colEname: 'aggregateNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '25%'},
    {colCname: '流向', colEname: 'flowDesc', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '40%'},
    {colCname: '尺寸规格', colEname: 'specifications', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '20%'},
    {colCname: '品名', colEname: 'productName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '10%'},

  ];
  accordingFlow: string;
  accordingName: string;

  // 明细相关
  // 货盘明细
  dataSetPallet: Array<any> = [];
  defaultTenderParam: any = {
    bidTimeStart: new Date(),
    oneTime: 10,
    twoTime: 20,
    delay: 5,
    maxNo: 3,
    settleType: 'JSFS10',
    markedPriceTaxNo: 0,
    calculation: 'JJJS10',
  };

  index: number;
  confimCon: string;
  confirmRef: NzModalRef;
  modalRef: NzModalRef;
  @ViewChild('pubishTitle') pubishTitle: TemplateRef<any>;
  @ViewChild('pubishContent') pubishContent: TemplateRef<any>;
  @ViewChild('pubishFooter') pubishFooter: TemplateRef<any>;


  private modal: NzModalRef; // 弹窗创建
  private modalCancel = new EventEmitter(); // 弹窗取消
  private nzWidth = '70%';
  list: any;
  buttonId: string;  // 点击按钮的ID
  type: string;      //报价类型 FBFS10,FBFS20 按均价，FBFS30流向，FBFS40品名
  radioValue: string = '10'; // 发布竞价 选择绑定值
  modalForm: any = {orderBids: [], itemAggregates: {}}; //弹窗表单
  companyUserModelList: Array<any> = [];
  unitArray: Array<any> = []; // 价格静态数据
  taxArray: Array<any> = []; // 税静态数据
  lists: string;

  tempTenderBidNo: string;
  showChildList: boolean = false; // 弹窗是否展示子列表
  trSelectedShow: boolean = false; // 弹窗列表点击选中
  modalListLoading: boolean = false; //弹窗主表单载入状态
  nzSelectedIndex = 0; // 查看投标结果tab激活序号

  tenderDataSet: Array<any> = []; //投标详情
  tenderChildDataSet: Array<any> = []; //投标子列表

  detailListLoading: boolean = false; // 查看竞价详情 加载状态
  confirmLoading: boolean = false;
  separatePublishInfo: any[] = [];//分别发布弹窗列表信息
  palletFlowList: any[] = [];//分别发布弹窗列表信息
  palletProductList: any[] = [];//分别发布弹窗列表信息

  // 发布竞价 传参
  parmas: any = {
    classification: 'flow',
    tOrderTenderItemAggregateModels: []
  };

  columsArr = []; // 自定义列表
  canClick: boolean = false;
  historyIsVisible: boolean = false;
  afresh: boolean = false;
  bidHistory: Array<any> = [];
  bidHistoryAll: Array<any> = [];
  queryHistoryLoading: boolean = false;
  selectedIndex: number = 0;
  selectedIndex1: number = 0;
  bidFlag: boolean = false;
  bidderCompany: Array<any> = [];
  modelSelectList: Array<any> = [];
  page: number = 1;
  businessType: any;
  loadStandardArr: Array<any> = [];

// 品名流向
  classificationReserve: Array<any> = []; //按流向
  classificationData: Array<any> = []; //按流向
  classificationData1: Array<any> = []; //按流向
  classificationData2: Array<any> = []; // 按品名
  constructor(private http: HttpUtilService,
              private modalService: NzModalService,
              private nzModal: NzModalService,
              private msg: NzMessageService,
              private fb: FormBuilder,
              private ngHttp: HttpClient,
              private notification: NzNotificationService,
              private upload: UploadFiles,
              private nzMess: NzNotificationService,) {

    this.form = this.fb.group({
      markedPriceTaxNo: [null, [Validators.required]],
      calculation: [null, [Validators.required]],
      settleType: [null, [Validators.required]],
      bidTimeStart: [null, [Validators.required]],
      oneTime: [null, [Validators.required]],
      twoTime: [null, [Validators.required]],
      delay: [null, [Validators.required]],
      maxNo: [null, [Validators.required]],
      remark: [null, []],
    });
  }

  ngOnInit() {
    this.listMainSearch({page: 1, length: this.pageSize});
    this.modalCancel.subscribe(
      res => {
        this.modal.destroy();
      }
    );
    this.getStatic(this.unitArray, 'JJJS');
    this.getStatic(this.taxArray, 'JSFS');
    this.getStatic(this.loadStandardArr, 'LOADTYPE');

  }

  btnClick(data: any) {
    this.buttonId = data.buttonId;
    this.columsArr = [];
    switch (this.buttonId) {
      case 'Result': { // 查看评标历史
        this.openHistoryModal();
      }
        break;
      case 'TenderStatus': { // 招标成功
        this.TenderStatus();
      }
        break;

      case 'Withdraw': {
        this.delete();
      }
        break;
      case 'Select': {  // 评标
        this.openHistoryModal();
      }
        break;
      case 'Afresh': { // 重新发标
        this.publishTender();
      }
        break;
      case 'Failure': { // 流标
        this.failure();
      }
        break;
      case 'Update': {
        this.publishTender();
      }
        break;
      case 'ExportResult': {
        this.ExportResult(); // 导出投标结果
      }
        break;

      case 'Export': {
        this.btnExport();
      }
        break;
    }
  }

  // 搜索
  listMainSearch(data: any): void {
    this.searchData = data;
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListMainSearch(data);
  }


//主列表信息查询
  getListMainSearch(data: any): void {
    let url = urls.getTenderListForConsignor;
    this.searchParam = data;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total || 0;
          this.selectData1 = [];
        }
        this.listLoading = false;
      }
    );
  }

  /**
   * 查询货盘信息
   */
  getPallet() {
    let params: any = {list: [], classification: ''};
    this.http.post(urls.getTenderByTenderNo, {tenderNo: this.selectData1[0].tenderNo}).then((res: any) => {

      if (res.success) {
        this.tenderPallet = res.data.data;
        this.businessType = res.data.data.tPalletModels[0].businessType;
        this.getCompanyUserBid(this.tenderPallet.tTenderBidderModels);//查询投标人
        this.classificationReserve = this.tenderPallet.aggregateModelList;

        this.tenderPallet.tTenderBidderModels.forEach((z, index2) => {
          this.tenderPallet.tTenderBidderModels[index2].companyId = this.tenderPallet.tTenderBidderModels[index2].bidderCompanyId;
        });
        this.modalForm.companyUserModelList = this.tenderPallet.tTenderBidderModels;
        //console.log(this.modalForm.companyUserModelList);
        this.modalForm.executionTimeStart = this.tenderPallet.executionTimeStart;
        this.modalForm.executionTimeEnd = this.tenderPallet.executionTimeEnd;
        this.modalForm.bidTimeStart = this.tenderPallet.bidTimeStart;
        this.modalForm.bidTimeEnd = this.tenderPallet.bidTimeEnd;
        if (this.selectData1[0].issueType === 'FBFS30') {
          this.bidPriceType = '10';
          this.modalForm.settleType = this.tenderPallet.aggregateModelList[0].settleType;
          this.modalForm.remark = this.tenderPallet.remark;
          if (this.tenderPallet.aggregateModelList[0].referencePriceTaxNo) {
            this.modalForm.price = this.tenderPallet.aggregateModelList[0].referencePriceTaxNo;
            this.modalForm.calculation = '10';
          } else if (this.tenderPallet.aggregateModelList[0].markedPriceTaxNo) {
            this.modalForm.price = this.tenderPallet.aggregateModelList[0].markedPriceTaxNo;
            this.modalForm.calculation = '20';
          }
          if (this.buttonId === 'Afresh') {
            if (this.tenderPallet.aggregateModelList[0].markedPriceTaxNo) {
              this.modalForm.price = Number(this.tenderPallet.aggregateModelList[0].markedPriceTaxNo) - Number(this.tenderPallet.aggregateModelList[0].markedPriceTaxNo) * 0.01;
            }
          }
        } else if (this.selectData1[0].issueType === 'FBFS40' || this.selectData1[0].issueType === 'FBFS50' || this.selectData1[0].issueType === 'FBFS70') {
          this.modalForm.remark = this.tenderPallet.remark; // 捆包发布
          this.bidPriceType = '20';
          if (this.selectData1[0].issueType === 'FBFS40') {
            params.classification = 'flow';
            this.selectedIndex1 = 0;
          } else if (this.selectData1[0].issueType === 'FBFS50') {
            params.classification = 'product';
            this.selectedIndex1 = 1;
          } else {
            params.classification = 'specifications';
            this.selectedIndex1 = 2;
          }
          if (this.buttonId === 'Afresh') {
            this.classificationReserve.forEach((item: any) => {
              if (item.markedPriceTaxNo) {
                item.markedPriceTaxNo = Number(item.markedPriceTaxNo) - Number(item.markedPriceTaxNo) * 0.01;
              }
            });
          }
        }
        else if (this.selectData1[0].issueType === 'FBFS10' || this.selectData1[0].issueType === 'FBFS20' || this.selectData1[0].issueType === 'FBFS60') {
          console.log(this.selectData1[0].issueType);
          if (this.selectData1[0].issueType === 'FBFS10') {  // 分别发布
            params.classification = 'flow';
            this.selectedIndex1 = 0;
          } else if (this.selectData1[0].issueType === 'FBFS20') {
            params.classification = 'product';
            this.selectedIndex1 = 1;
          } else {
            params.classification = 'specifications';
            this.selectedIndex1 = 2;
          }
          if (this.buttonId === 'Afresh') {
            this.classificationReserve.forEach((item: any) => {
              if (item.markedPriceTaxNo) {
                item.markedPriceTaxNo = Number(item.markedPriceTaxNo) - Number(item.markedPriceTaxNo) * 0.01;
              }
            });
          }
        }
        this.tenderPallet.tPalletModels.forEach(
          res => {
            params.list.push({palletNo: res.palletNo});
          }
        );
        this.classification(params);
      }
    });

  }

  confirm() {
    this.issueResult();
  }

  cancelClose() {
    this.confirmRef.destroy();
  }

  TenderStatus(){
    if (!this.selectData1 || this.selectData1.length == 0) {
      this.nzMess.warning('提示信息', '请至少选择一条数据进行招标成功！');
      return;
    }
    this.modalService.confirm({
      nzTitle: '提示信息',
      nzContent: '是否确定对选中预招标单信息进行招标成功',
      nzOnOk: () => this.TenderStatusData(),
    });
  }
  TenderStatusData(){
    let params = {tTenderModels:[]};
   params.tTenderModels = this.selectData1.map( item => {
     return{ tenderNo:item.tenderNo,
         companyId:item.companyId}
    });
    let url = urls.setTenderStatus;
    this.http.post(url,params).then( res => {
      if (res.success){
        this.nzMess.success('提示信息', res.data.data);
        this.getListMainSearch(this.searchData);
      }

    })
  }
  evaluation() {

    if (!this.modelSelectList || this.modelSelectList.length == 0) {
      this.nzMess.warning('提示信息', '请选择数据进行评标！');
      return;
    }
    let copydata = Utils.deepCopy(this.modelSelectList);
    if (this.modelSelectList.length > 1) {
      let isTrue = false;
      let addNum = 0;
      for (let i = 0; i < this.modelSelectList.length; i++) {
        if (!this.modelSelectList[i].distributionRatio && this.modelSelectList[i].distributionRatio != 0) {
          this.nzMess.warning('提示信息', '请填写分配比例！');
          isTrue = true;
          break;
        }
        if (!(/(^[1-9]\d*$)/.test(this.modelSelectList[i].distributionRatio)) || Number(this.modelSelectList[i].distributionRatio) > 100) {
          this.nzMess.warning('提示信息', '分配比例请输入不大于100的正整数');
          isTrue = true;
          break;
        }
      }
      if (isTrue) {
        return;
      }

      let obj: any = {};
      copydata.forEach(
        res => {
          if (!obj[res.aggregateNo]) {
            obj[res.aggregateNo] = [
             res.distributionRatio
            ];
          } else {
            obj[res.aggregateNo] = [
              ...obj[res.aggregateNo],
                res.distributionRatio
            ]
          }
        }
      );
      for(let i in obj){
        let num = obj[i].reduce( (a,b) => {
          return Number(a) + Number(b);
        });
        if (num != 100){
          this.nzMess.warning('提示信息', '各汇总单分配比例之和需等于100%');
          isTrue = true;
          break;
        }
      }
      if (isTrue) {
        return;
      }
    }
    this.confirmLoading = true;
    this.winningPrebid();
  }

  confirmPublish(id: string) { //确认发布
    const obj = this.validatorFun();
    this.issueResult();
  }

  private validatorFun() {

    let arr = [];
    if (this.buttonId === 'issue') {
      arr = this.separatePublishInfo;
    } else {
      this.issueBidType == '10' && (arr = this.palletFlowList);
      this.issueBidType == '20' && (arr = this.palletProductList);
    }

    let ente = arr.some((x) => !x.settleType || !x.calculation || !x.price);
    if (this.bidPriceType == '10' && this.buttonId === 'issues') {
      console.log(isNumber(this.modalForm.price), this.modalForm.price);
      if (!this.modalForm.calculation || !this.modalForm.price) {
        return {type: false, mess: '请填写参考运价'};
      }
      if (!this.modalForm.settleType) {
        return {type: false, mess: '请选择是否含税'};
      }
    } else {
      if (ente) {
        return {type: false, mess: '请填写招标定价'};
      }
    }

    if (!this.modalForm.companyUserModelList[0]) {
      return {type: false, mess: '请选择投标人'};
    }
    if (!this.modalForm.executionTimeStart || !this.modalForm.executionTimeEnd) {
      return {type: false, mess: '请选择业务执行时间'};
    }
    if (!this.modalForm.bidTimeStart || !this.modalForm.bidTimeEnd) {
      return {type: false, mess: '请选择投标时间'};
    }
    return {type: true};
  }

  issueResult() { //分别发布调用接口
    let params: any = {aggregateModelList: [], tTenderBidderModels: []};
    params.executionTimeStart = format(this.modalForm.executionTimeStart, 'YYYY-MM-DD') + ' 00:00:00';
    params.executionTimeEnd = format(this.modalForm.executionTimeEnd, 'YYYY-MM-DD') + ' 23:59:59';
    params.bidTimeStart = format(this.modalForm.bidTimeStart, 'YYYY-MM-DD HH:mm');
    params.bidTimeEnd = format(this.modalForm.bidTimeEnd, 'YYYY-MM-DD HH:mm');
    this.modalForm.companyUserModelList.map((x: any) => {
      let o: any = {};
      o.bidderCompanyId = x.companyId;
      params.tTenderBidderModels.push(o);
    });
    if (this.selectData1[0].issueType === 'FBFS10' || this.selectData1[0].issueType === 'FBFS20' || this.selectData1[0].issueType === 'FBFS60') {
      params.aggregateModelList = Utils.deepCopy(this.classificationData);
      params.aggregateModelList.map((x: any) => {
        x.referencePriceTaxNo = x.calculation === '10' ? x.price : undefined;
        x.markedPriceTaxNo = x.calculation === '20' ? x.price : undefined;
      });
    } else {
      if (this.bidPriceType == '10') {
        params.remark = this.modalForm.remark;
        params.aggregateModelList = Utils.deepCopy(this.classificationData);
        params.aggregateModelList[0].settleType = this.modalForm.settleType;
        params.aggregateModelList[0].referencePriceTaxNo = this.modalForm.calculation === '10' ? this.modalForm.price : undefined;
        params.aggregateModelList[0].markedPriceTaxNo = this.modalForm.calculation === '20' ? this.modalForm.price : undefined;
      } else {
        params.remark = this.modalForm.remark;
        params.aggregateModelList = Utils.deepCopy(this.classificationData);
        params.aggregateModelList.map((x: any) => {
          x.referencePriceTaxNo = x.calculation === '10' ? x.price : undefined;
          x.markedPriceTaxNo = x.calculation === '20' ? x.price : undefined;
        });
      }
    }
    params.tenderNo = this.selectData1[0].tenderNo;
    this.confirmLoading = true;
    let url = this.buttonId == 'Update' ? urls.updateTender : urls.updateTenderToAgain;
    if (this.buttonId == 'Afresh') {
      params.addMinute = this.modalForm.addMinute;
    }

    this.http.post(url, params).then((res: any) => {
      this.confirmLoading = false;
      if (res.data.code == 100) {
        if (this.buttonId == 'Update') {
          this.nzMess.create('success', '提示信息', '修改成功！');
        } else {
          this.nzMess.create('success', '提示信息', '重新发标成功！');
        }
        this.getListMainSearch(this.searchData);
        this.modalRef.destroy();
      }
    });
  }

  /**
   * 打开出价历史弹框
   * @param bidFlag 是否选择承运商标记
   */
  openHistoryModal(bidFlag?: boolean) {
    if (!this.selectData1 || this.selectData1.length != 1) {
      this.msg.error('请选择一条预招标信息！');
      return;
    }
    this.bidFlag = bidFlag;
    this.selectedIndex = 0;
    this.historyIsVisible = true;
    this.queryHistoryLoading = true;
    this.buttonId == 'Select' && !this.selectedIndex && (this.canClick = true);
    this.changeColumsArr();
    this.getHistory();
  }
  //
  // modelSelect(data: any) { //评标弹框选择
  //   this.modelSelectList = data;
  // }

  changeColumsArr() {  // 自定义表头
    this.columsArr = [
      {colCname: '投标时间', colEname: 'bidderTime', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '170'},
      {colCname: '投标公司', colEname: 'companyName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '150'},
      {colCname: '联系方式', colEname: 'companyPhone', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '130'},
      {colCname: '运力（吨）', colEname: 'capacity', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
      // {colCname: '载重方式', colEname: 'loadStandard', visible: 'XSBJ20', edit: 'BJBJ20', type: 'string', width: '130'},
      {colCname: '载重方式', colEname: 'loadStandardName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '200'},
      {colCname: '车次', colEname: 'totalTrainNum', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
      {colCname: '吨公里单价', colEname: 'pricePerTonKilometre', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '130'},

    ];

    if (this.selectData1[0].issueType === 'FBFS40' || this.selectData1[0].issueType === 'FBFS10') {

      // this.columsArr.push({colCname: '装点', colEname: 'flowNameStart', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '170'},
      //   {colCname: '卸点', colEname: 'flowNameEnd', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '170'});

    } else if (this.selectData1[0].issueType === 'FBFS20' || this.selectData1[0].issueType === 'FBFS50') {

      // this.columsArr.push({colCname: '品名', colEname: 'productName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '160'},
      // );
    } else if (this.selectData1[0].issueType === 'FBFS60' || this.selectData1[0].issueType === 'FBFS70') {

      this.columsArr.push(
        // {colCname: '装点', colEname: 'flowNameStart', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '170'},
        // {colCname: '卸点', colEname: 'flowNameEnd', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '170'},
        // {colCname: '品名', colEname: 'productName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '160'},
        // {colCname: '尺寸规格', colEname: 'specifications', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
      );
    }
    if (this.selectData1[0].hiredType === '10') {

      this.columsArr.push({
        colCname: '投标价（元）', colEname: 'offerPriceTaxNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '130', format: '2'
      });
    } else {
      this.columsArr.push({
        colCname: '投标价（元/吨）', colEname: 'offerPriceTaxNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '130', format: '2'
      });
    }
    if (this.buttonId == 'Result' && !this.selectedIndex) {
      // this.columsArr.push({colCname: '是否中标', colEname: 'status', visible: 'XSBJ20', edit: 'BJBJ20', type: 'string', width: '120'});
      this.columsArr.push({colCname: '是否中标', colEname: 'statusName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'});

    }
    if (this.buttonId == 'Select' && !this.selectedIndex) {
      this.columsArr.push({
        colCname: '分配比例（%）',
        colEname: 'distributionRatio',
        visible: 'XSBJ10',
        edit: 'BJBJ10',
        type: 'number',
        width: '130'
      });
    } else {
      this.columsArr.push({
        colCname: '分配比例（%）',
        colEname: 'distributionRatio',
        visible: 'XSBJ10',
        edit: 'BJBJ20',
        type: 'string',
        width: '130'
      });

    }

  }

  /**
   * 查询预招标出价信息
   */
  getHistory(): void {
    this.changeColumsArr();
    this.canClick = (this.buttonId == 'Select' && !this.selectedIndex) ? true : false;
    const url = this.selectedIndex ? urls.getBidRecordInfoByTenderNo : urls.getBidInfoByTenderNo;
    this.queryHistoryLoading = true;
    this.http.post(url, {tenderNo: this.selectData1[0].tenderNo}).then(
      (res: any) => {
        if (res.success) {
          let arr = [];
          res.data.data.forEach(item => {
            item.expand = true;
            item.allChecked = false;
            item.indeterminate = false;
            item.tBidModelsThree.forEach(data => {
              data.docUrlsList = this.upload.getFileList(data.docUrls);
              data.bidder = `${data.bidderCompanyName}-${data.bidderName}`;
              data.offerPrice = data.offerPriceTax ? data.offerPriceTax : data.offerPriceTaxNo;
              if (data.status) {
                (data.status == 5) && (data.statusName = '未开始');
                (data.status == 10) && (data.statusName = '投标中');
                (data.status == 20) && (data.statusName = '已出价');
                (data.status == 30) && (data.statusName = '待评标');
                (data.status == 40) && (data.statusName = '成功中标');
                (data.status == 50) && (data.statusName = '未中标');
                (data.status == 60) && (data.statusName = '流标');
                (data.status == 90) && (data.statusName = '无效');
              }
              this.loadStandardArr.forEach(load => {
                data.loadStandard == load.value && (data.loadStandardName = load.remark);
              });
              // arr.push({
              //   ...data,
              //   loadStandard: data.loadStandard,
              //   offerPriceTaxNo: data.offerPriceTaxNo,
              //   capacity: data.capacity,
              //   distributionRatio: data.distributionRatio || '',
              //   loadStandardName: data.loadStandardName,
              //   totalTrainNum: data.totalTrainNum
              // });

            });
          });
          this.bidHistoryAll = res.data.data;
          this.refreshStatus();

          this.bidderCompany = Utils.distinct(this.bidHistoryAll.map(item => item.bidderCompanyName)).map(item => {
            return {text: item, value: item,};
          });

          //调整-开始
          var transferStation = [];
          for (var i = 0; i < this.bidHistoryAll.length; i++) {
            var objectw = this.bidHistoryAll[i];
            var flaga = new Boolean(true);
            for (var j = 0; j < transferStation.length; j++) {
              var objectz = transferStation[j];
              if (objectz.companyName == objectw.companyName) {
                flaga = new Boolean(false);
              }
            }
            if (flaga.valueOf()) {
              this.bidHistoryAll[i].selectBool = '1';
              transferStation.push(this.bidHistoryAll[i]);
            } else {
              transferStation.push(this.bidHistoryAll[i]);
            }
          }
          this.bidHistory = transferStation;
        }
        this.queryHistoryLoading = false;
      }
    );
  }

  ExportResult() {  // 导出投标结果

    if (!this.selectData1 || this.selectData1.length == 0) {
      this.msg.error('请选择数据后进行导出操作！');
      return;
    }
    let tenderNos = [];
    this.selectData1.forEach(
      res => {
        tenderNos.push(res.tenderNo);
      }
    );
    const url = urls.tenderResultExport;
    let params = {tenderNos: tenderNos};
    this.ngHttp.post(url, params, {responseType: 'blob'}).subscribe((res: any) => {
      const blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `汽运评标管理.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 筛选出价人
   * @param bidders
   */
  bidderFilter(bidders: string[]) {
    if (!bidders || bidders.length == 0) {
      this.bidHistory = this.bidHistoryAll;
    } else {
      this.bidHistory = this.bidHistoryAll.filter(item => bidders.some(bider => item.bidderCompanyName === bider));
    }
  }


  /**
   * 排序
   * @param sortType
   * @param sortKey
   * @param dataType
   */
  sort(sortType: string, sortKey: string, dataType?: 'string' | 'number') {
    if (sortType === 'ascend') {
      this.bidHistory = this.bidHistory.sort((a, b) => Utils.compareFn(a[sortKey], b[sortKey], dataType));
    } else if (sortType === 'descend') {
      this.bidHistory = this.bidHistory.sort((a, b) => Utils.compareFn(b[sortKey], a[sortKey], dataType));
    }
  }

  /**
   * 预招标选择承运商
   * @param bid
   */
  winningPrebid() {
    let params: any = {tBidModels: []};
    let obj: any = {};
    this.modelSelectList.forEach(
      res => {
        params.tBidModels.push(
          {
            bidderCompanyId: res.bidderCompanyId,
            distributionRatio: res.distributionRatio,
            aggregateNo: res.aggregateNo,
            loadStandard: res.loadStandard
          }
        );
      }
    );
    params.tenderNo = this.selectData1[0].tenderNo;
    this.http.post(urls.updateTenderToSure, params).then(
      (res: any) => {
        this.confirmLoading = false;
        if (res.success) {
          this.notification.success('提示信息', '评标成功');
          this.historyIsVisible = false;
          this.getListMainSearch(this.searchData);
        }
      }
    );
  }


  /**
   * 重新发标
   * @param name
   */
  publishTender() {
    if (this.buttonId === 'Afresh') {
      this.afresh = true;
    } else {
      this.afresh = false;
    }
    ;
    this.classificationData = [];
    this.classificationData1 = [];
    this.classificationData2 = [];
    this.modalForm = {};//重置
    this.modalForm.companyUserModelList = []; //重置
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
    }
    this.getPallet();

    this.modalTitle = `发布招标  > ${this.buttonId == 'Update' ? '修改' : '重新发布'}`;
    this.modalRef = this.nzModal.create({
      nzTitle: this.pubishTitle,
      nzContent: this.pubishContent,
      nzFooter: this.pubishFooter,
      nzMaskClosable: false,
      nzWidth: '70%'
    });
  }

  /**
   * 导出
   */
  btnExport(): void {

    this.nzModal.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认导出？',
      nzOnOk: () => this.exportRequest()
    });
  }

  exportRequest() {

    let url: any = urls.tenderExport;
    return this.ngHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `评标报表.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 按品名/按流向查询汇总
   */
  classification(param: any): void {
    if (this.buttonId === 'Afresh') {
      param.issueType = this.selectData1[0].issueType;
    } else {
      if (this.selectData1[0].issueType === 'FBFS10' || this.selectData1[0].issueType === 'FBFS20' || this.selectData1[0].issueType === 'FBFS60') {
        if (param.classification == 'product') {
          param.issueType = 'FBFS20';
        } else if (param.classification == 'flow') {
          param.issueType = 'FBFS10';
        } else if (param.classification == 'specifications') {
          param.issueType = 'FBFS60';
        }
      } else if (this.selectData1[0].issueType === 'FBFS30' || this.selectData1[0].issueType === 'FBFS40' || this.selectData1[0].issueType === 'FBFS50' || this.selectData1[0].issueType === 'FBFS70') {
        if (this.bidPriceType == '10') {
          param.issueType = 'FBFS30';
        } else {
          if (param.classification == 'flow') {
            param.issueType = 'FBFS40';
          } else if (param.classification == 'product') {
            param.issueType = 'FBFS50';
          } else if (param.classification == 'specifications') {
            param.issueType = 'FBFS70';
          }
        }

      }
    }
    this.http.post(urls.classification, param).then(
      res => {
        if (res.success) {
          this.classificationData = res.data.data || [];
          this.classificationData.forEach((x, index) => {
            this.classificationReserve.forEach((z, index1) => {
              if (this.classificationReserve[index1].palletItemNos === this.classificationData[index].palletItemNos) {
                this.classificationData[index].settleType = this.classificationReserve[index1].settleType;
                if (this.classificationReserve[index1].referencePriceTaxNo) {
                  this.classificationData[index].calculation = '10';
                  this.classificationData[index].price = Number(this.classificationReserve[index1].referencePriceTaxNo).toFixed(2);
                } else if (this.classificationReserve[index1].markedPriceTaxNo) {
                  this.classificationData[index].calculation = '20';
                  this.classificationData[index].price = Number(this.classificationReserve[index1].markedPriceTaxNo).toFixed(2);
                }

              }
            });
          });
        }
      }
    );
  }


  /**
   * 按品名/按流向当前激活 tab 面板的序列号变更回调函数
   * @param data
   */
  selectedIndexChange(data: number) {
    console.log(data);
    const param = {classification: '', publishType: '', list: []};
    data == 0 && (param.classification = 'flow');
    data == 1 && (param.classification = 'product');
    data == 2 && (param.classification = 'specifications');
    param.publishType = this.buttonId === 'issue' ? 'respectively' : 'binding';
    this.tenderPallet.tPalletModels.forEach(
      res => {
        param.list.push({palletNo: res.palletNo});
      }
    );
    this.classification(param);
  }


  // 货盘明细
  getListPallet(data: any): void {
  }


  // 子列表
  getChildResult(data: any): void {
    this.http.post(urls.recordDetail, {prebidNumber: data.prebidNumber}).then(
      (res: any) => {
        this.tenderChildDataSet = res.data.data || [];
      }
    );
  }

  //勾选
  selectData(data: any) {
    let temp = false, tempIssues = false;
    if (data.length == 0) {
      this.btnDisabled.Result = true;//查看详情
      this.btnDisabled.Withdraw = true;//撤回记录
      this.btnDisabled.Select = true;//评标
      this.btnDisabled.Afresh = true;//重新发标
      this.btnDisabled.Failure = true;//流标
      this.btnDisabled.Update = true;//修改
      this.btnDisabled.TenderStatus = true;//招标成功

    } else if (data.length == 1) {
      this.btnDisabled.Result = false;//查看详情
      this.btnDisabled.Select = false;//评标
      this.btnDisabled.Afresh = false;//重新发标
      this.btnDisabled.Update = false;//修改
      this.btnDisabled.Withdraw = false;//撤回记录
      this.btnDisabled.Failure = false;//流标
      this.btnDisabled.TenderStatus = false;//招标成功
    } else {
      this.btnDisabled.Result = true;//查看详情
      this.btnDisabled.Select = true;//评标
      this.btnDisabled.Afresh = true;//重新发标
      this.btnDisabled.Update = true;//修改
      this.btnDisabled.Withdraw = false;//撤回记录
      this.btnDisabled.Failure = false;//流标
      this.btnDisabled.TenderStatus = false;//招标成功

    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].status === '5') {
        this.btnDisabled.Result = true;//查看详情
        //this.btnDisabled.Withdraw = false;//撤回记录
        this.btnDisabled.Select = true;//评标
        this.btnDisabled.Afresh = true;//重新发标
        this.btnDisabled.Failure = true;//流标
        this.btnDisabled.TenderStatus = true;//招标成功

      } else if (data[i].status === '10') {
        this.btnDisabled.Select = true;//评标
        this.btnDisabled.Afresh = true;//重新发标
        this.btnDisabled.Update = true;//修改
        this.btnDisabled.TenderStatus = true;//招标成功

      } else if (data[i].status === '20') {
        this.btnDisabled.Withdraw = true;//撤回记录
        this.btnDisabled.Select = true;//评标
        this.btnDisabled.Afresh = true;//重新发标
        this.btnDisabled.Update = true;//修改
        this.btnDisabled.TenderStatus = true;//招标成功

      } else if (data[i].status === '30') {
        //this.btnDisabled.Result = true;//查看详情
        this.btnDisabled.Withdraw = true;//撤回记录
        this.btnDisabled.Update = true;//修改
      } else if (data[i].status === '40') {
        this.btnDisabled.Withdraw = true;//撤回记录
        this.btnDisabled.Select = true;//评标
        this.btnDisabled.Afresh = true;//重新发标
        this.btnDisabled.Failure = true;//流标
        this.btnDisabled.Update = true;//修改
        this.btnDisabled.TenderStatus = true;//招标成功

      } else if (data[i].status === '60') {
        this.btnDisabled.Withdraw = true;//撤回记录
        this.btnDisabled.Select = true;//评标
        this.btnDisabled.Afresh = true;//重新发标
        this.btnDisabled.Failure = true;//流标
        this.btnDisabled.Update = true;//修改
        this.btnDisabled.TenderStatus = true;//招标成功

      }
      if (data[i].tenderNum !== '1') {
        this.btnDisabled.Withdraw = true;//撤回记录
        this.btnDisabled.Afresh = true;//重新发标
      }
    }

    tempIssues = data.some((x: any) => (x.companyId !== data[0].companyId) || (x.transType !== data[0].transType));

    this.selectData1 = data;
    if (this.selectData1.length !== 0) {
      let param: any = {list: []};
      this.selectData1.forEach(
        res => {
          param.list.push({tenderNo: res.tenderNo, companyId: res.consignorCompanyId});
        }
      );
      this.getNextList(param);
    } else {
      this.dataSetPallet = [];
    }

  }

  getNextList(param: any) {
    param.page = this.page;
    param.length = param.length || this.pageSize2; //最好有
    param.list[0].companyId = this.selectData1[0].consignorCompanyId;
    this.data2PageTmp = param;
    this.nextLoading = true;

    this.http.post(urls.getPalletItemAggregateByTenderNos, param).then((x: any) => {
      this.nextLoading = false;
      if (x.success) {
        this.dataSetPallet = x.data.data.data || [];
        this.totalpage2 = x.data.data.total;
      }
    });
  }

  /**
   * 撤销、流标
   */
  delete() {
    if (this.selectData1.length == 0) {
      this.msg.error('请至少选中一条预招标单数据撤销');
      return;
    }

    this.modalService.confirm({
      nzTitle: '<i>是否确定撤回选中预招标单信息?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.deleteList(),
    });
  }

  failure() {
    if (this.selectData1.length == 0) {
      this.msg.error('请至少选中一条预招标单数据流标');
      return;
    }

    this.modalService.confirm({
      nzTitle: '<i>是否确定流标选中预招标单信息?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.deleteList(),
    });
  }

  /**
   * 批量撤销/流标
   */
  deleteList() {
    const tenderNos = [];
    let url = this.buttonId === 'Failure' ? urls.updateTenderToFailed : urls.updateTenderToRepeal;
    this.selectData1.forEach(
      res => {
        tenderNos.push(res.tenderNo);
      }
    );
    this.http.post(url, {tenderNos: tenderNos}).then(
      (res: any) => {
        if (res.success) {
          this.modalCancel.emit();
          if (this.buttonId === 'Failure') {
            this.notification.success('提示消息', '流标成功!');
          } else if (this.buttonId === 'Withdraw') {
            this.notification.success('提示消息', '撤回成功!');
          }
          this.listMainSearch(this.searchParam);
        }
      }
    );
  }

  /**
   * 捆绑发布radio更改事件
   * @param param
   */
  radioChange(param: any) {
    const params = {classification: '', publishType: 'binding', list: []};
    if (param === '20') {
      params.classification = 'flow';
      this.tenderPallet.tPalletModels.forEach(
        res => {
          params.list.push({palletNo: res.palletNo});
        }
      );
      this.classification(params);
    } else if (param === '10') {
      this.tenderPallet.tPalletModels.forEach(
        res => {
          params.list.push({palletNo: res.palletNo});
        }
      );
      this.classification(params);
    }
  }


  // 弹窗list点击事件
  listClick(data: any) {
    if (this.type === 'FBFS10' || this.type === 'FBFS20') {
      return;
    }
    if (data.tenderBidNo === this.tempTenderBidNo) {
      data.showChildren = !data.showChildren;
    } else {
      this.dataSet.forEach(element => {
        element.showChildren = false;
      });
      data.showChildren = true;
    }
    if (data.showChildren) {
      this.showChildList = true;  //控制子列表是否显示
      this.trSelectedShow = true;
      this.getChildResult(data);
    } else {
      this.showChildList = false;
      this.trSelectedShow = false;
    }
    this.tempTenderBidNo = data.tenderBidNo;
  }


  // 穿梭框搜索查询
  dataFilter(inputValue: string, item: any): boolean {
    return item.companyName.indexOf(inputValue) > -1;
  }

  getCompanyUserBid(data: any) {
    this.bidCompanyUser = [];
    let params: any = {
      businessModuleId: this.businessType,
    };
    this.http.post(urls.getBidderCompany, params).then((x: any) => {
      if (x.success) {
        this.bidCompanyUser = x.data.data || [];
        this.bidCompanyUser.map((x: any) => {
          x.stringName = x.name + (x.mobile && `(${x.mobile})` || '') + (x.companyName && `--${x.companyName}` || '');
        });

        this.bidCompanyUser.forEach((x, index) => {
          data.forEach((z, index1) => {
            if (data[index1].bidderCompanyId === this.bidCompanyUser[index].companyId) {
              this.bidCompanyUser[index].direction = 'right';
            }
          });
          this.bidCompanyUser = [...this.bidCompanyUser];

        });


      }
    });
  }

  //穿梭框数据改变
  selectedBider(data: any) {
    if (data.to === 'right') {
      this.modalForm.companyUserModelList = [...this.modalForm.companyUserModelList, ...data.list];
    } else {
      data.list.map((x: any) => {
        this.modalForm.companyUserModelList = this.modalForm.companyUserModelList.filter((a: any) => a.companyId != x.companyId);
      });
    }
  }

  /**
   * 货盘明细页码点击事件
   * @param param
   */
  pageIndexEmit(param: any) {
    this.page = param;
    let tmp = this.data2PageTmp;
    tmp.page = param;
    this.getNextList(tmp);
  }

  /**
   * 货盘明细条数点击事件
   * @param param
   */
  pageSizeEmit(param: any) {
    let tmp = this.data2PageTmp;
    tmp.length = param;
    this.pageSize2 = param;
    this.selectData1.length !== 0 ? this.getNextList(tmp) : null;
  }

  cancel() {
    this.modalCancel.emit();
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data || []);
        }
      }
    );
  }

  listMainClick(data: any) {  //点击主列表向获取捆包、货盘明细
    this.getListPallet({pretenderNo: data.pretenderNo});
  }

  disabledDate = (current: Date): boolean => {
    return (current.getTime() <= new Date().getTime() - 24 * 60 * 60 * 1000);
  };

  disabledStartDate = (startValue: Date): boolean => {   //时间判断结束大于开始
    if (!startValue || !this.modalForm.executionTimeEnd) {
      return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000);
    }
    if (typeof this.modalForm.executionTimeEnd === 'string') {
      let data = new Date(Date.parse(this.modalForm.executionTimeEnd));
      this.modalForm.executionTimeEnd = data;
    }
    return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000) || (startValue.getTime() > this.modalForm.executionTimeEnd.getTime());

  };
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.modalForm.executionTimeStart) {
      return false;
    }
    if (typeof this.modalForm.executionTimeStart === 'string') {
      let data = new Date(Date.parse(this.modalForm.executionTimeStart));
      this.modalForm.executionTimeStart = data;
    }
    return endValue.getTime() <= this.modalForm.executionTimeStart.getTime();
  };

  bidStartDate = (startValue: Date): boolean => {   //时间判断结束大于开始
    if (!startValue || !this.modalForm.bidTimeEnd) {
      return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000);
    }
    if (typeof this.modalForm.bidTimeEnd === 'string') {
      let data = new Date(Date.parse(this.modalForm.bidTimeEnd));
      this.modalForm.bidTimeEnd = data;
    }
    return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000) || (startValue.getTime() > this.modalForm.bidTimeEnd.getTime());

  };
  bidEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.modalForm.bidTimeStart) {
      return false;
    }
    if (typeof this.modalForm.bidTimeStart === 'string') {
      let data = new Date(Date.parse(this.modalForm.bidTimeStart));
      this.modalForm.bidTimeStart = data;
    }
    return endValue.getTime() <= this.modalForm.bidTimeStart.getTime();
  };

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

  // colDrag 列拖拽
  coldrag(data: any) {
    let tableWidth = parseFloat(this.tableWidth);
    const currentWidth = parseFloat(this.columsArr[data.index].width);
    tableWidth = tableWidth - currentWidth;
    this.tableWidth = `${tableWidth + data.nex}px`;
    this.columsArr[data.index].width = `${data.nex}px`;
  }

  tBidModelsThree: any;

  checkAll(value: boolean,data): void {
    this.bidHistoryAll.forEach( item => {
      if(item.aggregateNo == data.aggregateNo){
        item.tBidModelsThree = item.tBidModelsThree ? item.tBidModelsThree : [];
        item.tBidModelsThree.forEach(data => {
          if (!data.disabled) {
            data.checked = value;
          }
        });
      }
    });
    this.refreshStatus();
  }

  // 选择逻辑
  refreshStatus(data?: any): void {
    let currentChecked: boolean;
    if (data && !this.isMutli) {
      currentChecked = data.checked;
    }
    this.bidHistoryAll.forEach( item => {
    item.tBidModelsThree.map((y: any) => !this.isMutli && (y.checked = false))
    });
    if (data && !this.isMutli) {
      data.checked = currentChecked; // 单选情况下设置checked;
    }
    this.allCheckBoxStyle();
    this.modelSelectList = [];
    this.bidHistoryAll.forEach( item => {
      let arr = item.tBidModelsThree.filter((x: any) => x.checked);
      this.modelSelectList = this.modelSelectList.concat(arr);
    })

  }

  private allCheckBoxStyle() {

    this.bidHistoryAll.forEach( item => {
      const dataArr = item.tBidModelsThree.filter(value => !value.disabled);
      const allChecked = dataArr[0] ? dataArr.every(value => value.checked === true) : false;
      const allUnChecked = dataArr.every(value => !value.checked);
      item.allChecked = allChecked;
      item.indeterminate = (!allChecked) && (!allUnChecked);

    })

  }

}
