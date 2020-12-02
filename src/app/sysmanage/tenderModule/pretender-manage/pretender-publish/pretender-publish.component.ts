import {Component, OnInit, ViewChild, TemplateRef, ElementRef} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';

import {format} from 'date-fns';
import {HttpUtilService} from '@service/http-util.service';
import {urls} from '@model/url';
import {Utils} from '@util/utils';
import {isNumber} from 'util';
import {GlobalService} from '@service/global-service.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {UserinfoService} from '@service/userinfo-service.service';

@Component({
  selector: 'app-pretender-publish',
  templateUrl: './pretender-publish.component.html',
  styleUrls: ['./pretender-publish.component.css']
})
export class PretenderPublishComponent implements OnInit {
  @ViewChild('pubishTitle') pubishTitle: TemplateRef<any>;
  @ViewChild('pubishContent') pubishContent: TemplateRef<any>;
  @ViewChild('pubishFooter') pubishFooter: TemplateRef<any>;
  @ViewChild('confirmTitle') confirmTitle: TemplateRef<any>;
  @ViewChild('confirmContent') confirmContent: TemplateRef<any>;
  @ViewChild('confirmFooter') confirmFooter: TemplateRef<any>;
  loading: boolean = false;
  // 主列表页码数据
  totalpage: number = 0;
  pageSize: number = 30;
  // 子列表货盘明细页码数据
  totalpage2: number = 0;
  pageSize2: number = 30;
  nextLoading: boolean = false;
  modalTitle: string;
  bidPriceType: string = '10';
  issueBidType: string = '10';
  buttonId: string;
  confimCon: string;
  data1: any[] = [];
  data2: any[] = [];
  data3: any[] = [];
  selectData1: Array<any> = []; // 主列表选择
  searchData: any = {};//存储查询条件
  data2PageTmp: any = {length: 30}; // 货盘明细页码数据缓存
  confirmRef: NzModalRef;
  modalRef: NzModalRef;
  modalForm: any = {companyUserModelList: []};//弹窗数据
  confirmLoading: boolean = false;
  bidCompanyUser: Array<any> = [];//投标人数据
  // bidCompanyUserTemp: Array<any> = [];//投标人数据
  separatePublishInfo: any[] = [];//分别发布弹窗列表信息
  palletFlowList: any[] = [];//分别发布弹窗列表信息
  palletProductList: any[] = [];//分别发布弹窗列表信息
  settleTypeArr: any[] = [{name: '含税', value: 'JSFS10'}, {name: '不含税', value: 'JSFS20'}];
  calculationArr: any[] = [{name: '参考价', value: '10'}, {name: '拦标价', value: '20'}];
  btnDisabled: any = {
    copy: true,
    update: true,
    delete: true,
    issues: true,
    preview: true,
    issue: true,
  };
  extraParam: any;

  // 品名流向
  classificationData: Array<any> = [];
  classificationData1: Array<any> = []; //按流向
  classificationData2: Array<any> = []; // 按品名

  modalFormDataImport: Array<any> = [
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
  docUrlsList = [];
  previewImage = '';
  previewVisible = false;
  private importFile: any;
  private tplModal: NzModalRef;
  implistLoading1: boolean;
  @ViewChild('tplTitle1') tplTitle1;
  @ViewChild('tplContent1') tplContent1;
  @ViewChild('tplFooter1') tplFooter1;
  validateForm: FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef;
  private old_data: any;
  private columnsArr: any = [];

  constructor(private nzModal: NzModalService,
              private router: Router,
              private http: HttpUtilService,
              private nzMess: NzNotificationService,
              private global: GlobalService,
              private fb: FormBuilder,
              private nzMessage: NzMessageService,
              private xlsx: XlsxService,
              private info: UserinfoService,
  ) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    this.global.searchReload.subscribe((x: any) => {
      if (x.target === 'pretenderPalletAdd') {
        this.listSearch({...this.searchData});
      }
    });
  }

  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.getList(this.searchData);
  }

  getList(params: any) {
    this.loading = true;
    this.http.post(urls.getPalletList, params).then((x: any) => {
      this.loading = false;
      if (x.success) {
        this.data2 = [];
        this.data3 = [];
        this.data1 = x.data.data && x.data.data.data || [];
        this.totalpage = x.data.data.total;
        this.selectData1 = [];
      }
    });
  }

  getWeightContainer(): void {
    this.extraParam = {};
    this.http.post(urls.getWeightContainer, {palletModelList: this.selectData1}).then(
      (res: any) => {
        if (res.success) {
          this.extraParam = res.data.data || {};
        }
      }
    );
  }

  getNextList(param: any) {
    param.page = 1; //最好有
    param.length = param.length || this.pageSize2; //最好有
    this.data2PageTmp = param;
    this.nextLoading = true;
    this.http.post(urls.getPalletItemByPalletNos, param).then((x: any) => {
      this.nextLoading = false;
      if (x.success) {
        this.data2 = x.data.data.data || [];
        this.totalpage2 = x.data.data.total;
      }
    });
  }

  btnClick(data: any) {
    this.buttonId = data.type.buttonId;
    switch (this.buttonId) {
      case 'issue':
        this.issue(data.type.buttonName);
        break;
      case 'issues': {
        this.issues(data.type.buttonName);
      }
        break;
      case 'copy':
        this.copyUpdate(this.buttonId);
        break;
      case 'Update':
        this.copyUpdate(this.buttonId);
        break;
      case 'import':
        this.import();
        break;
      case 'Delete':
        this.delete();
        break;
      case 'preview':
        // this.pdfPreview();
        break;
      default:
        this.nzMess.warning('提示消息', '按钮未定义!');
        break;
    }

  }

  pdfPreview() {
    let arr = [];
    let url: string;
    this.selectData1.map((x: any) => {
      arr.push({palletNo: x.palletNo});
    });
    url = `http://192.168.8.193:2006/report/preview2`;
    this.http.get(url, {params: new HttpParams().append('palletModelList', JSON.stringify(arr))}).then((res: any) => {
      if (res) {
        window.open(url);
      }
    });
  }

  selectData(data: any) {
    let temp = false, tempIssues = false;
    this.btnDisabled = {
      copy: true,
      delete: true,
      update: true,
      issue: true,
      issues: true,
      preview: true
    };
    data[0] && (this.btnDisabled.preview = false);
    if (data.length === 1) {
      this.btnDisabled.copy = false;
      this.btnDisabled.update = data[0].palletStatus !== 'HPZT10'; //状态初始化
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].palletStatus !== 'HPZT10') {
        temp = true;
        break;
      }
    }

    tempIssues = data.some((x: any) => (x.companyId !== data[0].companyId) || (x.transType !== data[0].transType));

    if (data[0] && !temp) {
      this.btnDisabled.delete = false;
      this.btnDisabled.issue = false;
      !tempIssues && (this.btnDisabled.issues = false);
    }
    this.selectData1 = data;

    if (this.selectData1.length !== 0) {
      const tPalletNos = [];
      this.selectData1.forEach(
        res => {
          tPalletNos.push({palletNo: res.palletNo});
        }
      );
      this.getNextList({tPalletNos: tPalletNos});
    } else {
      this.data2 = [];
    }

  }

  copyUpdate(id: string) {
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.router.navigate(['system/pretender/pretenderPalletAdd'], {
      queryParams: {
        palletNo: this.selectData1[0].palletNo,
        btnId: id,
        type: 1
      }
    });
  }

  /**
   * 分别发布
   * @param name
   */
  issue(name: string) {
    let params: any = {classification: '', list: []};
    this.classificationData = [];
    this.classificationData1 = [];
    this.classificationData2 = [];

    this.modalForm = {};//重置
    this.modalForm.settleType = 'JSFS20';
    this.modalForm.calculation = '10';
    this.modalForm.companyUserModelList = []; //重置
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      // return;
    }
    params.classification = 'flow';
    this.selectData1.forEach(
      res => {
        params.list.push({palletNo: res.palletNo});
      }
    );
    this.getCompanyUserBid();//查询投标人
    this.classification(params);
    this.modalTitle = `发布招标  > ${name}`;
    this.modalRef = this.nzModal.create({
      nzTitle: this.pubishTitle,
      nzContent: this.pubishContent,
      nzFooter: this.pubishFooter,
      nzWidth: '70%'
    });
  }

  /**
   * 捆绑发布
   * @param buttonName
   */
  issues(name: string) {
    this.bidPriceType = '10';
    let params: any = {classification: '', list: []};
    this.classificationData = [];
    this.classificationData1 = [];
    this.classificationData2 = [];
    this.modalForm = {};//重置
    this.modalForm.settleType = 'JSFS20';
    this.modalForm.calculation = '10';
    this.modalForm.companyUserModelList = []; //重置
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      // return;
    }
    this.selectData1.forEach(
      res => {
        params.list.push({palletNo: res.palletNo});
      }
    );
    this.getCompanyUserBid();//查询投标人
    this.classification(params);
    this.modalTitle = `发布招标  > ${name}`;
    this.modalRef = this.nzModal.create({
      nzTitle: this.pubishTitle,
      nzContent: this.pubishContent,
      nzFooter: this.pubishFooter,
      nzWidth: '70%'
    });
  }

  delete() {
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.confimCon = '确定删除该条记录？';
    this.confirmRef = this.nzModal.create({
      nzTitle: this.confirmTitle,
      nzContent: this.confirmContent,
      nzFooter: this.confirmFooter
    });
  }

  listDelete() {
    let params = {tPalletNos: []};
    this.selectData1.map((x: any) => {
      let o: any = {};
      o.palletNo = x.palletNo;
      params.tPalletNos.push(o);
    });
    this.confirmLoading = true;
    this.http.post(urls.deletePalletAndItem, params).then((x: any) => {
      this.confirmLoading = false;
      if (x.success) {
        this.getList(this.searchData);
        this.nzMess.create('success', '提示信息', '删除成功！');
        this.confirmRef.destroy();
      }
    });
  }

  confirm() {
    this.buttonId === 'Delete' && this.listDelete();
    this.buttonId === 'issue' && this.issueResult('issue');
    this.buttonId === 'issues' && this.issueResult('issues');
  }

  cancel() {
    this.confirmRef.destroy();
  }

  confirmPublish(id: string) { //确认发布
    const obj = this.validatorFun();
    if (!obj.type) {
      this.nzMess.remove();
      this.nzMess.create('error', '提示信息', obj.mess);
      return;
    }
    this.buttonId === 'issue' && this.issueResult('issue'); // 分别发布
    this.buttonId === 'issues' && this.issueResult('issues'); // 捆包发布
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
    if (!this.modalForm['executionTimeStart'] || !this.modalForm['executionTimeEnd']) {
      return {type: false, mess: '请选择业务执行时间'};
    }
    if (!this.modalForm['bidTimeStart'] || !this.modalForm['bidTimeEnd']) {
      return {type: false, mess: '请选择投标时间'};
    }
    return {type: true};
  }

  issueResult(flag) { //分别发布调用接口
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
    params.aggregateModelList = Utils.deepCopy(this.classificationData);
    if (flag == 'issue') { // 分别发布
      params.aggregateModelList.map((x: any) => {
        x.referencePriceTaxNo = x.calculation === '10' ? x.price : undefined;
        x.markedPriceTaxNo = x.calculation === '20' ? x.price : undefined;
      });
    } else {
      if (this.bidPriceType == '10') { // 捆包发布按均价
        params.remark = this.modalForm.remark;
        params.aggregateModelList[0].settleType = this.modalForm.settleType;
        params.aggregateModelList[0].referencePriceTaxNo = this.modalForm.calculation === '10' ? this.modalForm.price : undefined;
        params.aggregateModelList[0].markedPriceTaxNo = this.modalForm.calculation === '20' ? this.modalForm.price : undefined;
      } else {
        params.remark = this.modalForm.remark;
        params.aggregateModelList.map((x: any) => {
          x.referencePriceTaxNo = x.calculation === '10' ? x.price : undefined;
          x.markedPriceTaxNo = x.calculation === '20' ? x.price : undefined;
        });
      }
    }
    this.confirmLoading = true;
    this.http.post(urls.insertOrderTender, params).then((res: any) => {
      this.confirmLoading = false;
      if (res.data.code == 100) {
        this.nzMess.create('success', '提示信息', '发布成功！');
        this.getList(this.searchData);
        this.modalRef.destroy();
      }
    });
  }

  getCompanyUserBid(name: string = '') {
    this.bidCompanyUser = [];
    let params: any = {
      businessModuleId: this.selectData1[0].businessType,
    };
    this.http.post(urls.getBidderCompany, params).then((x: any) => {
      if (x.success) {
        this.bidCompanyUser = x.data.data || [];
        this.bidCompanyUser.map((x: any) => {
          x.stringName = x.name + (x.mobile && `(${x.mobile})` || '') + (x.companyName && `--${x.companyName}` || '');
        });
      }
    });
  }


  dataFilter(inputValue: string, item: any): boolean {
    return item.companyName.indexOf(inputValue) > -1;
  }

  selectedBider(data: any) { //穿梭框数据改变

    if (data.to === 'right') {
      this.modalForm.companyUserModelList = [...this.modalForm.companyUserModelList, ...data.list];
    } else {
      data.list.map((x: any) => {
        this.modalForm.companyUserModelList = this.modalForm.companyUserModelList.filter((a: any) => a.companyId != x.companyId);
      });
    }
  }

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

  bidEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.modalForm.bidTimeStart) {
      return false;
    }
    if (typeof this.modalForm.bidTimeStart === 'string') {
      let data = new Date(Date.parse(this.modalForm.bidTimeStart));
      this.modalForm.bidTimeStart = data;
    }
    if (this.modalForm.bidTimeStart.getTime() - new Date().getTime() > 0) {
      return endValue.getTime() <= this.modalForm.bidTimeStart.getTime() - 86400000;
    } else {
      return endValue.getTime() <= this.modalForm.bidTimeStart.getTime();
    }

  };

  bidStartTime = (current: Date): object => {
    const startDate: Date = this.modalForm.bidTimeStart;
    const currentDate: Date = current || this.modalForm.bidTimeStart;
    return {
      nzDisabledHours: () => {
        return this.rangeTime(0, new Date().getHours());
      },
      nzDisabledMinutes: () => {
        if (currentDate.getHours() <= new Date().getHours()) {
          return this.rangeTime(0, new Date().getMinutes());
        } else {
          return [];
        }
      }
    };
  };


  bidEndTime = (current: Date): object => {
    if (!this.modalForm.bidTimeStart) {
      return;
    }
    const startDate: Date = this.modalForm.bidTimeStart;
    const currentDate: Date = current || this.modalForm.bidTimeStart;
    return {
      nzDisabledHours: () => {
        if (currentDate.getTime() < Date.parse(format(startDate, 'YYYY-MM-DD')) + 16 * 60 * 60 * 1000 - 1) {
          return this.rangeTime(0, this.modalForm.bidTimeStart.getHours());
        } else {
          return [];
        }
      },
      nzDisabledMinutes: () => {
        if (currentDate.getHours() <= startDate.getHours() && currentDate.getTime() < Date.parse(format(startDate, 'YYYY-MM-DD')) + 16 * 60 * 60 * 1000 - 1) {
          return this.rangeTime(0, this.modalForm.bidTimeStart.getMinutes());
        } else {
          return [];
        }
      }
    };
  };

  private rangeTime(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
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

  /**
   * 货盘明细页码点击事件
   * @param param
   */
  pageIndexEmit(param: any) {
    let tmp = this.data2PageTmp;
    tmp.page = param;
    this.getNextList(tmp);
  }

  /**
   * 按品名/按流向查询汇总
   */
  classification(param: any): void {
    if (this.buttonId === 'issue') {
      if (param.classification == 'product') {
        param.issueType = 'FBFS20'; //分别发布品名
      } else if (param.classification == 'flow') {
        param.issueType = 'FBFS10'; // 分别发布流向
      } else if (param.classification == 'specifications') {
        param.issueType = 'FBFS60'; //分别发布尺寸
      }
    } else if (this.buttonId === 'issues') {
      if (param.classification == 'flow') {
        param.issueType = 'FBFS40'; // 捆绑发布流向
      } else if (param.classification == 'product') {
        param.issueType = 'FBFS50'; //捆绑发布品名
      } else if (param.classification == 'specifications') {
        param.issueType = 'FBFS70'; //捆绑发布尺寸
      } else {
        param.issueType = 'FBFS30'; //捆绑发布均价
      }
    }
    this.http.post(urls.classification, param).then(
      res => {
        if (res.success) {
          this.classificationData = res.data.data || [];
          for (let t = 0; t < this.classificationData.length; t++) {
            this.classificationData[t].settleType = 'JSFS20';
            this.classificationData[t].calculation = '10';
          }
        }
      }
    );
  }

  /**
   * 按品名/按流向当前激活 tab 面板的序列号变更回调函数
   * @param data
   */
  selectedIndexChange(data: number) {
    console.log(data)
    const param = {classification: '', publishType: '', list: []};
    data == 0 && (param.classification = 'flow');
    data == 1 && (param.classification = 'product');
    data == 2 && (param.classification = 'specifications');
    this.selectData1.forEach(
      res => {
        param.list.push({palletNo: res.palletNo});
      }
    );
    this.classification(param);
  }

  /**
   * 捆绑发布radio更改事件
   * @param param
   */
  radioChange(param: any) {
    const params = {classification: '', publishType: 'binding', list: []};
    if (param === '20') {
      params.classification = 'flow';
      this.selectData1.forEach(
        res => {
          params.list.push({palletNo: res.palletNo});
        }
      );
      this.classification(params);
    } else if (param === '10') {
      this.selectData1.forEach(
        res => {
          params.list.push({palletNo: res.palletNo});
        }
      );
      this.classification(params);
    }
  }

  bidStartDateChange() {
    if (!this.modalForm.bidTimeEnd) {
      this.modalForm.bidTimeEnd = this.modalForm.bidStartDate;
    }
  }

  import() {
    this.validateForm = this.fb.group({});
    this.modalFormDataImport.forEach(item => {
      const validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading1 = false;
    this.modalTitle = '导入excel';
    this.tplModal = this.nzModal.create({
      nzTitle: this.tplTitle1,
      nzContent: this.tplContent1,
      nzFooter: this.tplFooter1,
      nzWidth: '35%',
      nzMaskClosable: false,
      nzClosable: false,

    });
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  fileChange(file: any) {
    this.importFile = file.target.files[0];
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});
  }

  trim(str) {
    if (str == null) {
      str = '';
    }
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }

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
      this.nzMessage.error('格式不正确！');
      return;
    }
    let _data;
    const dataList: any = [];
    this.implistLoading1 = true;
    const headTemplate =
      ['业务模式', '装点省', '装点市', '装点区', '卸点省', '卸点市', '卸点区', '是否包车', '载重方式', '临界吨位', '参考运量', '品种', '路程公里数'];

    this.xlsx.import(this.importFile, true).then((data: any) => {

      const keys = Object.keys(data);

      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error('提示信息', '未读取到sheet页');
        this.implistLoading1 = false;
        return;
      }

      this.old_data = _data;
      const headArr: any = _data && _data[0] || [];
      if (!this.validateHead(headTemplate, headArr)) {
        this.nzMess.remove();
        this.nzMess.error('提示信息', `模板不正确，请选择正确模板`);
        return;
      }
      _data.forEach(item => {
        for (const i in item) {
          if (typeof item[i] === 'string') {
            if (!item[i] || this.trim(item[i]) === '' || this.trim(item[i]) === null || this.trim(item[i]) === undefined) {
              delete item[i];
            }
          } else {
            if (!item[i] || item[i] === '' || item[i] === null || item[i] === undefined) {
              delete item[i];
            }
          }

        }
      });
      const _dataNew = [];
      _data.forEach(item => {
        if (!(item.filter(x => x != undefined).length == 0 || item.length === 0)) {
          _dataNew.push(item);
        }
      });
      _data = _dataNew;
      if (_data.length == 1) {
        this.nzMess.error('提示信息', `请检查数据，第一个tab页为空`);
        this.implistLoading1 = false;
        return;
      }
      dataList.push(_data);
      _data = [];

      this.excelFilter(dataList);
    });
  }

  excelFilter(data: any) {
    const param: any = [];
    const eNameHeader: any = [];
    for (let j = 0; j < data.length; j++) {
      data[j][0].map((item, index) => {
          if (this.patchEname(item)) {
            eNameHeader.push({field: this.patchEname(item), index: index});
          }
        }
      );
      for (let i = 1; i < data[j].length; i++) {
        const temp: any = {};
        eNameHeader.forEach((h) => {
          temp[h.field] = data[j][i][h.index];
        });
        param.push(temp);
      }

    }
    const count: any = [];
    param.forEach(item => {
      item.tPalletItems = [{refCapacity: item.refCapacity, productName: item.productName}];
      item.requestUserSegmentId = this.info.APPINFO.USER.segmentId;
    });
    const url = urls.importPalletAndItem;
    this.http.post(url, param).then(res => {
      if (res.success) {
        this.nzMess.create('success', '提示信息', res.data.msg, {nzDuration: 3000});
        this.tplModal.destroy();
        this.listSearch(this.searchData);
      }
      this.implistLoading1 = false;
    });


  }

  patchEname(cName: any) {

    this.columnsArr.push(
      {colCname: '业务模式', colEname: 'businessTypeName'},
      {colCname: '装点省', colEname: 'originProvinceName'},
      {colCname: '装点市', colEname: 'originCityName'},
      {colCname: '装点区', colEname: 'originDistrictName'},
      {colCname: '卸点省', colEname: 'destinationProvinceName'},
      {colCname: '卸点市', colEname: 'destinationCityName'},
      {colCname: '卸点区', colEname: 'destinationDistrictName'},
      {colCname: '是否包车', colEname: 'hiredTypeName'},
      {colCname: '载重方式', colEname: 'loadStandardName'},
      {colCname: '临界吨位', colEname: 'thresholdsWeight'},
      {colCname: '参考运量', colEname: 'refCapacity'},
      {colCname: '品种', colEname: 'productName'},
      {colCname: '路程公里数', colEname: 'distance'}
    );

    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() === cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  }

  validateHead(head, receiptHead): boolean {
    let flag = true;
    // if (head.length != receiptHead.length) {
    //   flag = false;
    // }
    head.forEach(item => {
      if (typeof item !== 'string') {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        flag = false;
      }
    });
    if (!flag) {

      this.implistLoading1 = false;
    }
    return flag;
  }

  handleCancel1() {
    this.tplModal.destroy();
    this.validateForm.reset();
  }
}
