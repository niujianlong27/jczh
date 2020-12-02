import {Component, OnInit, ViewChild} from '@angular/core';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '@util/utils';
import {localUrls} from '@model/localUrls';
import {UserinfoService} from '@service/userinfo-service.service';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-payment-report-form',
  templateUrl: './payment-report-form.component.html',
  styleUrls: ['./payment-report-form.component.css']
})
export class PaymentReportFormComponent implements OnInit {
  modalValidateForm: FormGroup;
  modalFormVisible: boolean = false; //  表单弹窗

  listLoading: boolean = false;
  tplModal: NzModalRef;
  dataSet: any[] = [];
  total: number;
  selectArr = [];
  selectList: Array<any> = [];
  modalTitle: string;
  modalRef: NzModalRef;
  reportName: string;
  reportRemark: string;
  waybillNos: string;
  tempSerachData: any;
  pageSize: number = 30;

  recset: any = {formId: 'form_rec_test', name: '付款单位', parameter: 'companyName', parameterSend: 'settleCompanyId', url: 'getRecCompany'};
  findset: any = {
    url: 'getCompanyBankThree',
    formId: 'form_bank_tan',
    name: '收款单位',
    parameter: 'recCompanyName',
    parameterSend: 'recCompanyId'
  };
  transset: any = {
    url: 'getCompanyBankThree',
    formId: 'form_bank_tan',
    name: '收款单位',
    parameter: 'recCompanyName',
    parameterSend: 'recCompanyId'
  };
  fleetset: any = {formId: 'company_pop', name: '运输车队', parameter: 'companyName', parameterSend: 'companyId'};
  settleCompany: any;
  settleCompanyId: any;
  carrierCompany: any;
  carrierCompanyId: any;
  transCompany: any;
  transCompanyId: any;
  fleetCompany: any;
  fleetCompanyId: any;

  inpData: any = {};
  isDifferent: boolean = false;
  caculateEnameArr: any = [
    {field: 'weight', tipInfo: '已选重量', tipInfoType: '吨', demLength: 3},
    {field: 'payTotalPrice', tipInfo: '总价', tipInfoType: '元', demLength: 2},
  ];
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  @ViewChild('generateReports') generateReports;

  buttonType: string;
  dateRange: any;
  consignorCompanyName: any;
  consignorCompanyId: any;
  businessType: any;
  feeType: any;
  calInfo: any = {};
  workPart: any = [];
  feeArr: any = [];
  startCreateDate: any;
  endCreateDate: any;
  btnDis: boolean = false;

  modalFormData: Array<any> = [
    {
      name: '结算报表号', eName: 'payReportNo', type: 'text', require: true, validateCon: '请输入结算报表号',
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    }

  ];

  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private nm: NzModalService,
              private modal: NzModalService,
              private nz: NzNotificationService,
              private info: UserinfoService,
              private angularHttp: HttpClient,
              private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    //  this.listSearch({ length: 30, page: 1 });
    this.http.post(localUrls.getWorkPart, {}).then((res: any) => { //业务板块
      if (res.success) {
        this.workPart = res.data.data && res.data.data.data || [];
      }
    });

    this.http.post(urls.getFee, {companyId: this.info.APPINFO.USER.companyId}).then((res: any) => { //获取费用类型
      if (res.success) {
        this.feeArr = res.data.data;
      }
    });


    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];

    this.modalValidateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      let validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));

    }
  }

  listSearch(param: any) {
    param.page = param.page || 1;
    param.length = param.length || this.pageSize;
    this.tempSerachData = {...param};
    this.getList(param);
  }

  getList(param: any) {
    this.listLoading = true;
    this.http.post(urls.accountsPayable, param).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = [];
        this.dataSet = res.data.data && res.data.data.data || [];
        this.total = res.data.data && res.data.data.total;
      }
    });
  }

  btnClick(type: any) {
    this.buttonType = type.type.buttonId;

    switch (this.buttonType) {
      case 'BatchCreate' :
        this.modalTitle = '批量生成结算报表';
        this.createModal();
        break;
      case 'GenerateReports' : // 按运单号生成报表
        this.btnGenerateReports();
        break;
      case 'Create' : // 选择生成结算报表
        this.Create(type);
        break;
      case 'Out':
        this.export();
        break;
      case 'addReport':
        this.addReport();
        break;
      default:
        this.msg.error('按钮未绑定方法');
    }

  }


  Create(type) {
    this.selectArr = [];
    this.selectArr = type.data;
    if (type.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }

    const d = this.selectArr.some(x => x.settleType != this.selectArr[0].settleType);
    if (d) {
      this.nz.create('error', '提示信息', '选择了不同的支付方式，请选择相同的支付方式', {nzDuration: 3000});
      return;
    }
    if (this.isDifferent) {
      this.nz.create('error', '提示信息', '选择了不同的车队，无法生成结算报表', {nzDuration: 3000});
      return;
    }
    this.modalTitle = '生成结算报表确认';
    this.carrierCompany = '';
    this.carrierCompanyId = '';

    this.http.post(localUrls.judgmentReport, {generateSettlementReportModels: this.selectArr}).then(
      res => {
        if (res.success) {
          this.createModal();
          this.inpData = {inpName: this.selectArr[0].receivefeeClientName, inpValue: this.selectArr[0].receivefeeClientNo};
          this.settleCompany = this.selectArr[0].receivefeeClientName;
          this.settleCompanyId = this.selectArr[0].receivefeeClientNo;
          if (this.selectArr[0].invoiceCompanyName && this.selectArr[0].invoiceCompany) {
            this.transCompany = this.selectArr[0].invoiceCompanyName;
            this.transCompanyId = this.selectArr[0].invoiceCompany;
          } else {
            this.transCompany = this.selectArr[0].receivefeeClientName;
            this.transCompanyId = this.selectArr[0].receivefeeClientNo;
          }
          this.fleetCompany = this.selectArr[0].transCompanyName;
          this.fleetCompanyId = this.selectArr[0].transCompanyId;
          const carrierOne = this.selectArr.every((x: any) => x.carrierCompanyId !== this.selectArr[0].carrierCompanyId);
          if (!carrierOne) {
            this.carrierCompany = this.selectArr[0].carrierCompanyName;
            this.carrierCompanyId = this.selectArr[0].carrierCompanyId;
          }

        }

      }
    );
  }

  modalGetInfo() {//统计

    let url = localUrls.selectStatisticalInfo;
    let param: any = {type: '20'};
    param.startCreateDate = this.startCreateDate = this.dateRange && this.dateRange[0] ? Utils.dateFormat(this.dateRange[0], 'yyyy-MM-dd HH:mm:ss') : '';
    param.endCreateDate = this.endCreateDate = this.dateRange && this.dateRange[1] ? Utils.dateFormat(this.dateRange[1], 'yyyy-MM-dd HH:mm:ss') : '';
    param.consignorCompanyId = this.consignorCompanyId || '';
    param.businessType = this.businessType;
    param.feeType = this.feeType;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.calInfo = res.data.data || {};
      }
    });
  }

  modalConfirm() { //生成应付报表

    let param: any = {};
    if (this.buttonType === 'Create') {
      let tSettleFees = [];

      this.selectArr.map((data: any) => {
        let obj: any = {};
        obj.rowid = data.rowid;
        tSettleFees.push(obj);
      });
      param.tSettleFees = tSettleFees;
      param.carrierCompanyId = this.carrierCompanyId;
    }

    param.reportName = this.reportName;
    param.receivefeeClientName = this.inpData.inpName;
    param.receivefeeClientNo = this.inpData.inpValue;
    param.remake = this.reportRemark;
    // param.taxPercent = this.taxPercent;
    //新增2019.2.27
    param.settleCompanyId = this.settleCompanyId;
    param.transCompanyId = this.transCompanyId;
    param.fleetCompanyId = this.fleetCompanyId;

    if (this.buttonType === 'Create') {
      this.insertPayReport(urls.insertPayReport, param);
    } else if (this.buttonType === 'BatchCreate') {
      param.consignorCompanyId = this.consignorCompanyId;
      param.businessType = this.businessType;
      param.feeType = this.feeType;
      param.startCreateDate = this.startCreateDate;
      param.endCreateDate = this.endCreateDate;
      param.type = '20';
      this.insertPayReport(localUrls.insertBatchPayReport, param);
    }

  }

  modalCancel() {
    this.settleCompany = '';
    this.settleCompanyId = '';
    this.modalRef.destroy();
  }

  createModal(width?: string) {
    this.calInfo = {};
    this.consignorCompanyName = '';
    this.consignorCompanyId = '';
    this.businessType = '';
    this.feeType = '';
    this.dateRange = '';
    this.startCreateDate = '';
    this.endCreateDate = '';
    this.reportName = '';
    // this.taxPercent = 9;
    this.reportRemark = '';
    this.modalRef = this.modal.create({ //弹窗
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: width || 520,
      nzMaskClosable: false,
      nzClosable: true,
      nzOnCancel: () => {
        this.settleCompany = '';
        this.settleCompanyId = '';
      }
    });
  }

  insertPayReport(url: any, param: any) {
    this.btnDis = true;
    this.http.post(url, param).then((res: any) => {
      this.btnDis = false;
      if (res.success) {
        this.nz.create('success', '提示信息', '生成结算报表成功', {nzDuration: 3000});
        this.getList(this.tempSerachData);
        this.modalRef.destroy();

      }
    });
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  inpEmitCon(data: any) {
    this.consignorCompanyName = data.inpName || '';
    this.consignorCompanyId = data.inpValue || '';

    this.inpData = data;
    if (data.inpValue) {
      this.settleCompany = data.inpName || '';
      this.settleCompanyId = data.inpValue || '';
    }
  }

  inpEmit(data: any) {
    this.inpData = data;
    this.settleCompany = data.inpName || '';
    this.settleCompanyId = data.inpValue || '';
  }

  inpEmitCarrier(data: any) {
    this.carrierCompany = data.inpName || '';
    this.carrierCompanyId = data.inpValue || '';
  }

  inpTransEmit(data: any) {
    this.transCompany = data.inpName || '';
    this.transCompanyId = data.inpValue || '';
  }

  inpFleetEmit(data: any) {
    this.fleetCompany = data.inpName || '';
    this.fleetCompanyId = data.inpValue || '';
  }

  updateDataResult(data: Array<any>): void {
    this.selectList = data;
    let hash: any = {length: 0};
    for (const datum of data) {
      if (!hash[datum.transCompanyId]) {
        hash[datum.transCompanyId] = true;
        hash.length += 1;
      }
    }
    if (hash.length === 1) {
      this.isDifferent = false;
    } else if (hash.length === 0) {
      this.isDifferent = false;
    } else {
      this.isDifferent = true;
      this.nz.create('warning', '提示信息', '选择了不同的车队', {nzDuration: 3000});
    }
  }

  /**
   * 按运单号生成结算报表
   */
  btnGenerateReports(): void {
    this.calInfo = {};
    this.consignorCompanyName = '';
    this.consignorCompanyId = '';
    this.businessType = '';
    this.feeType = '';
    this.dateRange = '';
    this.startCreateDate = '';
    this.endCreateDate = '';
    this.reportName = '';
    this.reportRemark = '';
    this.waybillNos = '';

    this.nm.create({
      nzTitle: '应付报表生成 > 按运单号生成报表',
      nzContent: this.generateReports,
      nzMaskClosable: false,
      nzOnOk: () => this.generateReportsRequest(),
      nzOnCancel: () => {
        this.calInfo = {};
        this.consignorCompanyName = '';
        this.consignorCompanyId = '';
        this.businessType = '';
        this.feeType = '';
        this.dateRange = '';
        this.startCreateDate = '';
        this.endCreateDate = '';
        this.reportName = '';
        this.reportRemark = '';
        this.waybillNos = '';
      }
    });
  }

  generateReportsRequest(): Promise<any> {
    const url = localUrls.addPayReportByWaybillNo;
    const param: any = {};
    param.carrierCompanyId = this.carrierCompanyId;
    param.settleCompanyId = this.settleCompanyId;
    param.transCompanyId = this.transCompanyId;
    param.fleetCompanyId = this.fleetCompanyId;
    param.reportName = this.reportName;
    param.remake = this.reportRemark;
    param.waybillNos = this.waybillNos.match(/YD\d+/gm);
    param.receivefeeClientName = this.inpData.inpName;
    param.receivefeeClientNo = this.inpData.inpValue;

    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nz.success('提示消息', '运单号生成报表成功！');
          this.listSearch({length: 30, page: 1});
          return true;
        } else {
          return false;
        }
      }
    );
  }

  export() {
    let url: any = localUrls.settleExportSettle;
    this.angularHttp.post(url, this.tempSerachData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/xlsx'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `应付报表生成.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  addReport() { // 添加到结算报表
    if (!this.selectList || this.selectList.length == 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后进行操作！'
      });
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = '应付报表生成 > 添加到结算报表';

  }

  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    let url = localUrls.insertPayReportSub;
    let data = this.selectList.map(item => {
      return {
        rowid:item.rowid,
        settleNo:item.settleNo,
        transCompanyId: item.transCompanyId,
        carrierCompanyId: item.carrierCompanyId,
        receivefeeClientNo: item.receivefeeClientNo
      };
    });
    let param = this.modalValidateForm.getRawValue();
    this.http.post(url, {tSettleFees:data,...param}).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.modalFormVisible = false;
        this.msg.success(res.data.data);
        this.getList(this.tempSerachData);
      }
    });
  }

  handleCancel(): void {
    this.modalFormVisible = false;
  }
  afterClose(){
    this.modalValidateForm.reset();
  }

}
