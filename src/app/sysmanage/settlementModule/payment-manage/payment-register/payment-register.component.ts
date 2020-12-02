import {Component, OnInit, ViewChild} from '@angular/core';
import {localUrls} from '@model/localUrls';
import {HttpUtilService} from '@service/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '@util/utils';
import {urls} from '@model/url';
import {inpModalUrl} from '@model/inpModalUrl';
import {HttpClient} from '@angular/common/http';
import {UserinfoService} from '@service/userinfo-service.service';
import {toDemical} from '@validator/validator';

@Component({
  selector: 'app-payment-register',
  templateUrl: './payment-register.component.html',
  styleUrls: ['./payment-register.component.css']
})
export class PaymentRegisterComponent implements OnInit {
  pageSize: number = 30;//条数
  listLoading: boolean = false;
  dataSet: any = [];
  totalPages: Number = 1;
  isMutli: boolean = true;
  modal_isMutli: boolean = true; // 控制单选或多选
  modal_totalPages: Number = 1;
  modal_dataSet: any = [];
  modal_loading: boolean = true;
  // tplTitle:string = '结算报表查询';
  tplModal: NzModalRef;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  currentModalType: string;//弹窗类型
  gridId: string;//弹窗gridId
  currentModalSelectedData: any = [];//弹窗当前选中的数据
  topAeraData: any;
  tempreceivefeeClientNo: any;
  private settleType: string;
  inpData: any = {};//接收数据弹窗的数据
  // pop 弹框
  findset: any = {
    url: 'getCompanyBankThree',
    formId: 'form_bank_tan',
    name: '收款单位',
    parameter: 'recCompanyName',
    parameterSend: 'recCompanyId'
  };
  receivefeeClientName: any;
  receivefeeClientNo: any;
  depositBank: any;
  formId: string;

  carrierCompanyName: string;
  carrierCompanyId: string;
  carrierBankId: string;
  carrierset: any = {
    url: 'getRecCompany',
    formId: 'form_rec_test',
    name: '付款单位',
    parameter: 'companyName',
    parameterSend: 'settleCompanyId'
  };

  selectedArr: any = [];
  modelSelectedArr: any = []; // 收款
  carrierSelectedArr: any = []; // 付款
  selectMap: { [key: string]: number } = {};

  weight: number;
  modalValidateForm: FormGroup;

  modalFormData: Array<any> = [
    {
      name: '请款单号', eName: 'paymentNo', type: 'text', validateCon: '请输入请款单号', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '结算报表号', eName: 'payReportNo', type: 'text', validateCon: '请输入结算报表号', require: false, disabled: true,
      validators: {}
    },
    {
      name: '结算单位', eName: 'settleCompanyName', type: 'text', validateCon: '请输入结算单位', require: false, disabled: true,
      validators: {}
    },


    {
      name: '请款时间', eName: 'updateDate', type: 'time', validateCon: '请输入请款时间', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '付款理由', eName: 'mome', type: 'text', validateCon: '请输入付款理由', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '付款类型', eName: 'feeType', type: 'select', validateCon: '请输入付款类型', require: true,
      selectArr: this.selectedArr,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '应付总金额', eName: 'totAmount', type: 'number', validateCon: '请输入应付总金额', require: true, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '已申请金额', eName: 'appliedAmount', type: 'number', validateCon: '请输入已申请金额', require: true, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '未申请金额', eName: 'priceAmount', type: 'number', validateCon: '请输入未申请金额', require: true, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '本次申请金额', eName: 'payAmount', type: 'number', validateCon: '请输入本次申请金额', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '付款单位', eName: 'carrierCompanyName', type: 'inputModalCarrier', validateCon: '请输入付款单位', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '开户银行', eName: 'carrierDepositBank', type: 'text', validateCon: '请输入开户银行', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '银行账号', eName: 'carrierBankAccount', type: 'carrbankSelect', validateCon: '请选择银行账号', require: false, disabled: true,
      selectArr: this.carrierSelectedArr, valueId: 'bankAccount', text: 'bankAccount',
      validators: {
        require: false,
        pattern: false,
      }
    },

    {
      name: '联行号', eName: 'payLineNumber', type: 'text', validateCon: '请输入联行号', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '纳税人识别号', eName: 'carrierTaxNo', type: 'text', validateCon: '请输入纳税人识别号', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '收款单位', eName: 'receivefeeClientName', type: 'inputModal', validateCon: '请输入收款单位', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '开户银行', eName: 'depositBank', type: 'text', validateCon: '请输入开户银行', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '银行账号', eName: 'bankAccount', type: 'bankSelect', validateCon: '请输入银行账号', require: false, disabled: true,
      selectArr: this.modelSelectedArr,
      validators: {
        require: false,
        pattern: false,
      }
    },

    {
      name: '联行号', eName: 'lineNumber', type: 'text', validateCon: '请输入联行号', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '纳税人识别号', eName: 'taxNo', type: 'text', validateCon: '请输入纳税人识别号', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },

    {
      name: '业务板块Id', eName: 'segmentId', type: 'text', validateCon: '业务板块Id', require: false, hidden: true,
      validators: {
        require: false,
        pattern: false, //不显示，需传值
      }
    }

  ];

  //提示弹窗
  showTipModal: boolean = false;
  modalCon: string;
  depositBankDISABLED: boolean = true;

  bankId: string = '';
  receivefeeDisabled: boolean = false;
  transCompanyId: string = '';
  settleCompanyId: string = '';

  constructor(
    private http: HttpUtilService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private nz: NzNotificationService,
    private  angularHttp: HttpClient,
    private info: UserinfoService
  ) {
  }

  ngOnInit() {

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      }

      if (this.modalFormData[i].eName === 'feeType') {
        this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
          'FKLX40', validatorOrOpts
        ));
      } else {
        this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
          '', validatorOrOpts
        ));
      }
    }
    this.getStatic(this.selectedArr, 'FKLX');
  }


  btnClick(data: any): void { // 按钮弹框

    this.currentModalType = data.buttonId;
    switch (this.currentModalType) {
      case 'inqufee': { //结算报表弹窗
        this.inqufee();
      }
        break;
      case 'calculate': {//结算单弹窗
        this.calculate();
      }
        break;
      case 'save': { // 保存
        this.save();
      }
        break;
      case 'print': { //打印
        this.print();
      }
        break;
    }
  }

  inqufee() {
    this.tplTitle = '结算报表查询';
    this.gridId = 'grid1';
    this.formId = 'form_payment_stat';
    this.modal_isMutli = false;
    this.modal_dataSet = [];
    this.tipModalCreat();
  }

  calculate() {
    this.tplTitle = '结算单查询';
    this.gridId = 'grid1';
    this.formId = 'form_payment_dan';
    this.modal_isMutli = true;
    this.modal_dataSet = [];
    this.tipModalCreat();
  }

  save() {
    let obj: any = {}; // 设置保存参数
    Object.assign(obj, this.modalValidateForm.value);
    obj.updateDate = obj.updateDate instanceof Date ? obj.updateDate && Utils.dateFormat(obj.updateDate) : obj.updateDate;
    obj.payDate = obj.updateDate;
    obj.payYfAmount = 0;
    obj.totalAmount = obj.totAmount;
    obj.totalWeight = this.weight;
    obj.payCompanyId = this.inpData.inpValue;
    obj.carrierCompanyId = this.carrierCompanyId;
    obj.carrierBankId = this.carrierBankId;
    obj.bankId = this.bankId;

    if (this.settleType === 'DCJS10') {
      obj.payCompanyId = this.modalValidateForm.get('receivefeeClientName').value;
    }
    if (!obj.carrierCompanyId || obj.carrierCompanyId == '') {
      this.showTipModal = true;
      this.modalCon = '请填写付款单位';
      return;
    }
    if (!obj.payCompanyId || obj.payCompanyId == '') {
      this.showTipModal = true;
      this.modalCon = '请填写收款单位';
      return;
    }
    if (!obj.feeType || obj.feeType == '') {
      this.showTipModal = true;
      this.modalCon = '请填写付款类型';
      return;
    }
    if (!obj.payAmount || obj.payAmount == '') {
      this.showTipModal = true;
      this.modalCon = '请填写本次请款金额';
      return;
    }
    if (!obj.mome || obj.mome == '') {
      this.showTipModal = true;
      this.modalCon = '请填写本次付款理由';
      return;
    }

    if (!obj.bankAccount || obj.bankAccount == '') {
      this.showTipModal = true;
      this.modalCon = '无银行数据，请去客户结算账户维护银行数据';
      return;
    }
    if (!obj.carrierBankId || obj.carrierBankId == '') {
      this.showTipModal = true;
      this.modalCon = '无银行数据，请去客户结算账户维护银行数据';
      return;
    }
    if (this.settleType !== 'DCJS10' && (!obj.bankId || obj.bankId == '')) {
      this.showTipModal = true;
      this.modalCon = '无银行数据，请去客户结算账户维护银行数据';
      return;
    }

    const param = {tPaymentModels: []};
    param.tPaymentModels.push(obj);
    let url = localUrls.paymentRegistCreateUrl2;

    this.http.post(url, {...param, settleType: this.settleType}).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
        this.modalValidateForm.get('paymentNo').setValue(res.data.data[0].paymentNo);
      }
    });
  }

  tipModalCreat(): void {
    //重置表单
    this.modalValidateForm.reset();
    this.receivefeeDisabled = false;
    this.depositBank = '';
    this.modalValidateForm.get('feeType').setValue('FKLX40');
    this.tempreceivefeeClientNo = '';

    //pop框默认显示重置
    this.receivefeeClientName = '';
    this.receivefeeClientNo = '';
    this.transCompanyId = '';
    this.carrierCompanyName = '';
    this.carrierCompanyId = '';

    this.dataSet = []; // 表单数据

    this.depositBankDISABLED = true;
    this.depositBank = '';

    this.carrierBankId = null;

    // 选择框重置
    this.modelSelectedArr = [];
    this.carrierSelectedArr = [];
    this.modalValidateForm.get('bankAccount').setValue(null);
    this.modalValidateForm.get('carrierBankAccount').setValue(null);

    // 创建弹框
    this.tplModal = this.modal.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.currentModalType === 'inqufee' ? null : this.tplFooter,
      nzWidth: '70%',
      nzMaskClosable: false,
      nzClosable: true
    });
  }

  //结算报表列表获取
  getModal_list(data: any): void {
    this.modal_loading = true;
    let url = this.currentModalType === 'inqufee' ? localUrls.paymentRegistListUrl1 : localUrls.paymentRegistListUrl2;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.modal_dataSet = res.data.data.data;
          this.modal_loading = false;
          this.modal_totalPages = res.data.data.total;
        }
      }
    );
  }

  modal_success(): void {  //确认
    if (this.currentModalSelectedData.length > 0) {
      if (this.currentModalSelectedData[0].bankId) {
        this.bankId = this.currentModalSelectedData[0].bankId;
        this.getBankData();
      }

      if (this.currentModalType === 'inqufee') {

        //结算报表查询'确定'
        let url = localUrls.paymentRegistConfirmUrl1;
        let param = {settleModelList: this.currentModalSelectedData};

        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            this.dataSet = res.data.data.settleModelList || [];
            this.topAeraData = res.data.data.tPayReportModels[0];
            this.topAeraData.totAmount = Number(this.topAeraData.totAmount).toFixed(2);
            this.topAeraData.c = Number(this.topAeraData.appliedAmount).toFixed(2);
            this.tempreceivefeeClientNo = res.data.data.tPayReportModels[0].receivefeeClientNo;

            this.inpData = {
              inpName: this.currentModalSelectedData[0].settleCompanyName,
              inpValue: this.currentModalSelectedData[0].settleCompanyId
            };

            this.topAeraData.priceAmount = (Number(this.topAeraData.totAmount) - Number(this.topAeraData.appliedAmount)).toFixed(2);
            this.topAeraData.settleCompanyName = this.currentModalSelectedData[0].settleCompanyName;
            this.modalValidateForm.patchValue(this.topAeraData);

            const totAmountData = this.modalValidateForm.get('priceAmount').value;

            let feeType = this.modalValidateForm.get('feeType').value.toString();
            if (totAmountData) {
              if (this.selectMap[feeType]) {
                this.modalValidateForm.get('payAmount').setValue(this.selectMap[feeType] * totAmountData);
              }
            }
            this.weight = this.currentModalSelectedData[0].totWeight;

            this.receivefeeClientName = this.currentModalSelectedData[0].settleCompanyName; // 收款弹框默认显示
            this.receivefeeClientNo = this.currentModalSelectedData[0].settleCompanyId;

            this.carrierCompanyName = this.currentModalSelectedData[0].carrierCompanyName;// 付款弹框默认显示
            this.carrierCompanyId = this.currentModalSelectedData[0].carrierCompanyId;
            this.getTaxNoByCompanyId(this.currentModalSelectedData[0].carrierCompanyId, 'carrier');  // 付款查询联行号
            this.currentModalSelectedData[0].carrierCompanyName && this.getCarrierBank(this.carrierCompanyName); // 根据收款单位查询银行卡号

            this.settleType = res.data.data.settleType;

            //单车改动
            if (this.settleType === 'DCJS10') {
              const d = res.data.data && res.data.data.tVehicleModelList && res.data.data.tVehicleModelList[0] || {};
              this.inpData.inpName = d.settleName;
              this.receivefeeClientName = d.settleName;
              this.modalValidateForm.get('receivefeeClientName').setValue(d.settleName);
              this.modalValidateForm.get('depositBank').setValue(d.bankSubCode);
              this.modalValidateForm.get('bankAccount').setValue(d.bankAccount);
              this.modalValidateForm.get('taxNo').setValue(d.cardId);
              this.modalValidateForm.get('lineNumber').setValue(d.lineNumber);
              this.bankId = d.bankCode;
            } else {
              this.getTaxNoByCompanyId(this.currentModalSelectedData[0].settleCompanyId);  // 收款查询联行号
              this.currentModalSelectedData[0].settleCompanyName && this.getBank(this.receivefeeClientName); // 查询收款银行卡号
            }
            this.currentModalSelectedData = [];
            this.tplModal.destroy();

          }
        });
      } else if (this.currentModalType === 'calculate') {
        let url = localUrls.paymentRegistConfirmUrl2;
        let param = {tSettleModels: []};
        this.currentModalSelectedData.forEach(element => {
          let obj = {};
          obj['rowid'] = element.rowid;
          obj['transCompanyId'] = element.transCompanyId;
          param.tSettleModels.push(obj);
        });
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            let arr = res.data.data.payreport || [];
            let reNo = [];
            arr.forEach(element => {
              reNo.push(element.payReportNo);
            });
            this.showTipModal = true;
            this.modalCon = `已生成结算报表号${reNo[0]}`;
            this.dataSet = res.data.data.payreport || [];
            this.topAeraData = res.data.data.payment;
            this.topAeraData.totAmount = Number(this.topAeraData.totAmount).toFixed(2);
            this.topAeraData.appliedAmount = Number(this.topAeraData.appliedAmount).toFixed(2);
            this.topAeraData.priceAmount = (Number(this.topAeraData.totAmount) - Number(this.topAeraData.appliedAmount)).toFixed(2);
            this.modalValidateForm.patchValue(this.topAeraData);
            this.tplModal.destroy();
            this.currentModalSelectedData = [];
          } else {
            return;
          }
        });
      }
    } else {
      this.nz.warning('提示消息', '请选择数据后确认！');
    }


  }

  modal_return(): void {
    this.currentModalSelectedData = [];
    this.weight = 0;
    this.tplModal.destroy();
  }

  modal_listSearch(data: any): void {
    this.getModal_list(data);
  }

  modal_btnClick(data: any): void {
    const buttonId = data.type.buttonId;
    switch (buttonId) {
      case 'Confirm': {
        this.modal_success();
      }
        break;
      case 'Cancel': {
        this.modal_return();
      }
        break;
    }
  }

  modal_check(data: any): void {   //弹窗列表选中
    this.currentModalSelectedData = data;

  }

  tipModalResult(data: any) {
    this.showTipModal = false;
  }


  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.getAllMsgByCompanyId, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data);
          res.data.data.forEach(
            res => {
              this.selectMap[res.valueId] = res.value;
            }
          );
        }
      }
    );
  }

  getBankData(): void {
    this.http.post(urls.getMsgByBankId, {bankIds: [{bankId: this.bankId}]}).then(
      res => {
        if (res.success) {
          this.inpData = {
            inpName: res.data.data[0].recName,
            inpValue: res.data.data[0].recCompanyName
          };
          this.receivefeeClientName = res.data.data[0].recName;
          this.depositBank = res.data.data[0].bankName;
          this.modalValidateForm.get('bankAccount').setValue(res.data.data[0].account);
          this.modalValidateForm.get('bankAccount').disable();
          this.modalValidateForm.get('lineNumber').setValue(res.data.data[0].accountJoint);
          this.modalValidateForm.get('lineNumber').disable();
          this.getTaxNoByCompanyId(this.inpData.inpValue);  // 收款查询联行号
          this.receivefeeDisabled = true;
        }
      }
    );
  }

  /**
   * 费用类型更改时触发
   * @param data
   */
  feeTypeChange(data: {}) {
    if (data) {
      const totAmountData = this.modalValidateForm.get('priceAmount').value;
      if (totAmountData) {
        if (this.selectMap[data.toString()]) {
          this.modalValidateForm.get('payAmount').setValue(toDemical(this.selectMap[data.toString()] * totAmountData), 2);
        }
      }
    }
  }

  /**
   * 获取税号
   * @param companyId
   */
  getTaxNoByCompanyId(companyId: string, type?: string): void {
    const param = {
      companyId: companyId
    };
    this.http.post(urls.getTaxNoByCompanyId, param).then(
      res => {
        if (res.success) {
          type === 'carrier' ? this.modalValidateForm.get('carrierTaxNo').setValue(res.data.data.creditCode) : this.modalValidateForm.get('taxNo').setValue(res.data.data.creditCode);
        }
      }
    );
  }


  //打印
  print(): void {
    const paymentNo = this.modalValidateForm.get('paymentNo').value;
    if (!paymentNo) {
      this.nz.warning('提示消息', '请付款申请登记后再打印请款单！');
      return;
    }
    this.angularHttp.get(localUrls.payment,
      {
        responseType: 'blob',
        params: {
          paymentNoList: [paymentNo],
          requestUserId: this.info.get('USER').userId,
          requestCompanyId: this.info.get('USER').companyId
        }
      }
    ).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/pdf'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      res => {
      }
    );

  }

  inpEmitCarrier(data: any) { // 付款pop款选中
    this.modelSelectedArr = [];
    this.modalValidateForm.get('bankAccount').setValue(null);
    this.carrierSelectedArr = [];
    if (data.selData && data.selData[0]) {
      this.carrierCompanyId = data.inpValue;
      this.getTaxNoByCompanyId(data.inpValue, 'carrier');  // 付款查询联行号
      this.getCarrierBank(data.inpName);

    } else {
      this.modalValidateForm.get('carrierBankAccount').setValue(null);
      this.modalValidateForm.get('payLineNumber').setValue(null);
      this.modalValidateForm.get('carrierDepositBank').setValue(null);
      this.modalValidateForm.get('carrierTaxNo').setValue(null);
      this.carrierBankId = null;
      this.carrierCompanyId = null;
    }

  }

  inpEmit(data: any) { // 收款pop框选中
    this.modelSelectedArr = [];
    this.modalValidateForm.get('bankAccount').setValue(null);
    if (data.selData && data.selData[0]) {
      this.depositBankDISABLED = false;
      this.inpData = {
        inpName: data.selData[0] && data.selData[0].companyName || null,
        inpValue: data.selData[0] && data.selData[0].companyId || null
      };
      this.receivefeeClientName = this.inpData.inpName;
      this.receivefeeClientNo = this.inpData.inpValue;
      this.bankId = data.selData[0].bankId;
      this.getTaxNoByCompanyId(data.inpValue); // 收款查询税号或联行号
      this.getBank(this.inpData.inpName); // 查询银行卡号
    } else {
      this.bankId = null;
      this.depositBankDISABLED = true;
      this.depositBank = '';
      this.modalValidateForm.get('bankAccount').setValue(null);
      this.modalValidateForm.get('lineNumber').setValue(null);
      this.modalValidateForm.get('depositBank').setValue(null);
      this.modalValidateForm.get('taxNo').setValue(null);
    }
  }

  getBank(data) { // 收款查询银行账户
    this.modelSelectedArr = [];
    this.modalValidateForm.get('bankAccount').setValue(null);
    this.http.post(inpModalUrl.getCompanyBankThree, {
      formId: 'form_bank_tan', length: 30,
      page: 1, companyName: data
    }).then(
      res => {
        if (res.success) {
          this.modelSelectedArr = res.data.data ? res.data.data.data : [];
          this.modelSelectedArr[0] && this.modalValidateForm.get('bankAccount').setValue(this.modelSelectedArr[0].account);
        }
      });
  }

  bankSelected(data) { //收款 根据银行卡号查询显示开户银行和联行号
    if (data) {
      this.modelSelectedArr.forEach(item => {
        if (item.account == data) {
          this.modalValidateForm.get('depositBank').setValue(item.bankName);
          this.modalValidateForm.get('lineNumber').setValue(item.accountJoint);
          this.bankId = item.bankId;

        }
      });
    }
  }


  getCarrierBank(data) { // 付款 查询银行账户
    this.carrierSelectedArr = [];
    this.modalValidateForm.get('carrierBankAccount').setValue('');
    this.http.post(inpModalUrl.getRecCompany, {
      formId: 'form_rec_test', length: 30,
      page: 1, companyName: data
    }).then(
      res => {
        if (res.success) {
          this.carrierSelectedArr = res.data.data ? res.data.data.data : [];
          this.carrierSelectedArr[0] && this.modalValidateForm.get('carrierBankAccount').setValue(this.carrierSelectedArr[0].bankAccount);
        }
      });
  }

  carrierBankSelected(data) {  // 付款 根据银行卡号查询显示开户银行和联行号
    if (data) {
      this.carrierSelectedArr.forEach(item => {
        if (item.bankAccount == data) {
          this.modalValidateForm.get('carrierDepositBank').setValue(item.bank);
          this.modalValidateForm.get('payLineNumber').setValue(item.accountJoint);
          this.carrierBankId = item.bankId;
        }
      });
    }
  }


}
