import {Component, OnInit, ViewChild} from '@angular/core';
import {localUrls} from '../../../../common/model/localUrls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '../../../../common/util/utils';
import {urls} from '../../../../common/model/url';
import {format} from 'date-fns';
import {HttpClient} from '@angular/common/http';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {inpModalUrl} from '../../../../common/model/inpModalUrl';

@Component({
  selector: 'app-payment-register-batch',
  templateUrl: './payment-register-batch.component.html',
  styleUrls: ['./payment-register-batch.component.css']
})
export class PaymentRegisterBatchComponent implements OnInit {

  pageSize: number = 30;//条数
  listLoading: boolean = false;
  dataSet: Array<any> = [];
  totalPages: Number = 1;
  isMutli: boolean = true;
  modal_isMutli: boolean = true;
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
  inpData: any = {};//接收数据弹窗的数据

  findset: any = {formId: 'company_pop', name: '收款单位', parameter: 'companyName', parameterSend: 'companyId'};
  receivefeeClientName: any;
  receivefeeClientNo: any;
  formId: string;

  selectedArr: any = [];

  modalValidateForm: FormGroup;

  modalFormData: Array<any> = [
    {
      name: '请款单号', eName: 'paymentNo', type: 'text', validateCon: '请输入界面ID', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '结算报表号', eName: 'payReportNo', type: 'text', validateCon: '请输入界面ID', require: false, disabled: true,
      validators: {}
    },

    {
      name: '收款单位', eName: 'receivefeeClientName', type: 'inputModal', validateCon: '请输入界面ID', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '请款时间', eName: 'updateDate', type: 'time', validateCon: '请输入界面ID', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '货物总吨位', eName: 'totWeight', type: 'number', validateCon: '请输入界面ID', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '付款类型', eName: 'feeType', type: 'select', validateCon: '请输入界面ID', require: false,
      selectArr: this.selectedArr,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '应付总金额', eName: 'totAmount', type: 'number', validateCon: '请输入界面ID', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '已申请金额', eName: 'appliedAmount', type: 'number', validateCon: '请输入界面ID', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '未申请金额', eName: 'priceAmount', type: 'number', validateCon: '请输入界面ID', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '本次申请金额', eName: 'payAmount', type: 'number', validateCon: '请输入界面ID', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '时间范围', eName: 'dataRange', type: 'range', validateCon: '请输入界面ID', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '开户银行', eName: 'depositBank', type: 'text', validateCon: '请输入界面ID', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '银行账号', eName: 'bankAccount', type: 'text', validateCon: '请输入界面ID', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '联行号', eName: 'lineNumber', type: 'text', validateCon: '请输入界面ID', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'mome', type: 'text', validateCon: '请输入界面ID', require: false,
      validators: {
        require: true,
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
  bankId: string;
  userHeader: Array<any> = []; //表头数据获取

  selectMap: { [key: string]: number } = {}; // 费用类型map存储
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
          'FKLX10', validatorOrOpts
        ));
      } else {
        this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
          '', validatorOrOpts
        ));
      }
    }

    this.getStatic(this.selectedArr, 'FKLX');

  }

  listSearch(data: any): void {
  }

  getList(data: any): void {

  }

  btnClick(data: any): void {
    this.currentModalType = data.buttonId;
    switch (this.currentModalType) {
      case 'inqufee': {//结算报表弹窗
        this.tplTitle = '结算报表查询';
        this.gridId = 'grid1';
        this.formId = 'form_payment_stat';
        this.modal_isMutli = true;
        this.modal_dataSet = [];
        // this.getModal_list({page: 1, length: this.pageSize});
        this.tipModalCreat();
      }
        break;
      case 'calculate': {//结算单弹窗
        this.tplTitle = '结算单查询';
        this.gridId = 'grid1';
        this.formId = 'form_payment_dan';
        this.modal_isMutli = true;
        this.modal_dataSet = [];
        //this.getModal_list({page: 1, length: this.pageSize});
        this.tipModalCreat();
      }
        break;
      case 'save': { //保存
        if (this.dataSet.length === 0) {
          this.nz.warning('提示消息', '请选择数据后操作！');
          return;
        }
        const momeStatus = this.dataSet.some(
          value => !value.mome
        );
        if (momeStatus) {
          this.nz.warning('提示消息', '请填写付款理由后保存');
          return;
        }
        const obj: any = {tPaymentModels: []};
        this.dataSet.forEach(
          res => {
            res.payDate = res.payDate ? format(res.payDate, 'YYYY-MM-DD') : res.payDate;
            res.startDate = res.startDate ? format(res.startDate, 'YYYY-MM-DD') : res.startDate;
            res.endDate = res.endDate ? format(res.endDate, 'YYYY-MM-DD') : res.endDate;
            res.dataRange = res.startDate && res.endDate ? res.startDate + ',' + res.endDate : '';
          }
        );

        obj.tPaymentModels = this.dataSet;
        // Object.assign(obj, this.modalValidateForm.value);
        // obj.updateDate = obj.updateDate instanceof Date ? obj.updateDate && Utils.dateFormat(obj.updateDate) : obj.updateDate;
        // obj.dataRange = obj.dataRange ? obj.dataRange : [];
        // obj.dataRange[0] = obj.dataRange[0] instanceof Date ? obj.dataRange[0] && Utils.dateFormat(obj.dataRange[0]) : obj.dataRange[0];
        // obj.dataRange[1] = obj.dataRange[1] instanceof Date ? obj.dataRange[1] && Utils.dateFormat(obj.dataRange[1]) : obj.dataRange[1];

        let url = localUrls.paymentRegistCreateUrl2;
        // obj.dataRange = obj.dataRange.join(',');
        // obj.payDate = obj.updateDate;
        // obj.payYfAmount = obj.appliedAmount;
        // obj.totalAmount = obj.totAmount;
        // obj.totalWeight = obj.totWeight;
        // obj.payCompanyId = this.inpData.inpValue;
        // console.log(obj);

        // if (!obj.payCompanyId || obj.payCompanyId == '') {
        //   this.showTipModal = true;
        //   this.modalCon = '请填写收款单位';
        //   return;
        // }
        // if (!obj.feeType || obj.feeType == '') {
        //   this.showTipModal = true;
        //   this.modalCon = '请填写付款类型';
        //   return;
        // }
        // if (!obj.payAmount || obj.payAmount == '') {
        //   this.showTipModal = true;
        //   this.modalCon = '请填写本次请款金额';
        //   return;
        // }

        this.http.post(url, obj).then((res: any) => {
          if (res.success) {
            this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
            // this.modalValidateForm.get('paymentNo').setValue(res.data.data.paymentNo);
            // console.log(res);
            this.dataSet = res.data.data;
            this.dataSet.forEach(
              res => {
                res.dataRange = res.dataRange.split(',');
                res.startDate = res.dataRange[0];
                res.endDate = res.dataRange[1];
                res.subAmount = Number(res.totalAmount - res.appliedAmount).toFixed(2);
              }
            );
          }
        });
      }
        break;
      case 'print': { //打印
        this.print();
      }
        break;
    }
    // if (this.currentModalType === 'inqufee') {//结算报表弹窗
    //   this.tplTitle = '结算报表查询';
    //   this.gridId = 'grid1';
    //   this.formId = 'form_payment_stat';
    //   this.modal_isMutli = true;
    //   this.modal_dataSet = [];
    //   this.getModal_list({page: 1, length: this.pageSize});
    //   this.tipModalCreat();
    // } else if (this.currentModalType === 'calculate') {  //结算单弹窗
    //   this.tplTitle = '结算单查询';
    //   this.gridId = 'grid1';
    //   this.formId = 'form_payment_dan';
    //   this.modal_isMutli = true;
    //   this.modal_dataSet = [];
    //   this.getModal_list({page: 1, length: this.pageSize});
    //   this.tipModalCreat();
    // } else if (this.currentModalType === 'save') {
    //   const obj: any = {tPaymentModels: []};
    //   this.dataSet.forEach(
    //     res => {
    //       res.payDate = res.payDate ? format(res.payDate, 'YYYY-MM-DD') : res.payDate;
    //       res.startDate = res.startDate ? format(res.startDate, 'YYYY-MM-DD') : res.startDate;
    //       res.endDate = res.endDate ? format(res.endDate, 'YYYY-MM-DD') : res.endDate;
    //       res.dataRange = res.startDate && res.endDate ? res.startDate + ',' + res.endDate : '';
    //     }
    //   );
    //   obj.tPaymentModels = this.dataSet;
    //   // Object.assign(obj, this.modalValidateForm.value);
    //   // obj.updateDate = obj.updateDate instanceof Date ? obj.updateDate && Utils.dateFormat(obj.updateDate) : obj.updateDate;
    //   // obj.dataRange = obj.dataRange ? obj.dataRange : [];
    //   // obj.dataRange[0] = obj.dataRange[0] instanceof Date ? obj.dataRange[0] && Utils.dateFormat(obj.dataRange[0]) : obj.dataRange[0];
    //   // obj.dataRange[1] = obj.dataRange[1] instanceof Date ? obj.dataRange[1] && Utils.dateFormat(obj.dataRange[1]) : obj.dataRange[1];
    //
    //   let url = localUrls.paymentRegistCreateUrl2;
    //   // obj.dataRange = obj.dataRange.join(',');
    //   // obj.payDate = obj.updateDate;
    //   // obj.payYfAmount = obj.appliedAmount;
    //   // obj.totalAmount = obj.totAmount;
    //   // obj.totalWeight = obj.totWeight;
    //   // obj.payCompanyId = this.inpData.inpValue;
    //   // console.log(obj);
    //
    //   // if (!obj.payCompanyId || obj.payCompanyId == '') {
    //   //   this.showTipModal = true;
    //   //   this.modalCon = '请填写收款单位';
    //   //   return;
    //   // }
    //   // if (!obj.feeType || obj.feeType == '') {
    //   //   this.showTipModal = true;
    //   //   this.modalCon = '请填写付款类型';
    //   //   return;
    //   // }
    //   // if (!obj.payAmount || obj.payAmount == '') {
    //   //   this.showTipModal = true;
    //   //   this.modalCon = '请填写本次请款金额';
    //   //   return;
    //   // }
    //
    //   this.http.post(url, obj).then((res: any) => {
    //     if (res.success) {
    //       this.nz.create('success', '提示信息', '保存成功', {nzDuration: 3000});
    //       // this.modalValidateForm.get('paymentNo').setValue(res.data.data.paymentNo);
    //       // console.log(res);
    //       this.dataSet = res.data.data;
    //       this.dataSet.forEach(
    //         res => {
    //           res.dataRange = res.dataRange.split(',');
    //           res.startDate = res.dataRange[0];
    //           res.endDate = res.dataRange[1];
    //           res.subAmount = Number(res.totalAmount - res.appliedAmount).toFixed(2);
    //         }
    //       );
    //     }
    //   });
    //
    // }

  }

  tipModalCreat(): void {
    this.modalValidateForm.reset();
    this.modalValidateForm.get('feeType').setValue('FKLX10');
    this.tempreceivefeeClientNo = '';
    this.receivefeeClientName = '';
    this.receivefeeClientNo = '';
    this.dataSet = [];
    this.tplModal = this.modal.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.currentModalType === 'inqufee' ? null : this.tplFooter,
      nzWidth: '70%',
      nzMaskClosable: false,
      nzClosable: true
    });
  }

  selectedData(data: any) {
    // this.receivefeeClientName = data.data[0] && data.data[0][this.findset.parameter];
    // this.tempreceivefeeClientNo = data.data[0] && data.data[0].companyId;
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

  modal_success(): void {
    if (this.currentModalSelectedData.length > 0) {
      if (this.currentModalType === 'inqufee') {
        this.userHeader.forEach(
          res => {
            if (res.colEname === 'feeType') {
              res.apiParameter.optionList = [];
              res.apiParameter.optionList = [...this.selectedArr];
            }
          }
        );
        //结算报表查询'确定'
        let url = localUrls.paymentRegistConfirmUrl1;
        let param = {settleModelList: this.currentModalSelectedData};
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            // this.dataSet = Utils.deepCopy(res.data.data || []);
            console.log(this.currentModalSelectedData, this.dataSet);
            this.dataSet = res.data.data.tPayReportModels || [];
            if (this.dataSet) {
              this.dataSet.forEach(
                res => {
                  res.payYfAmount = res.appliedAmount;
                  res.totalWeight = res.totWeight;
                  res.totalAmount = res.totAmount;
                  res.payCompanyId = res.receivefeeClientNo;
                  res.subAmount = Number(res.totalAmount - res.appliedAmount).toFixed(2);
                  res.payDate = new Date();
                  res.feeType = 'FKLX40';
                  res.payAmount = this.selectMap['FKLX40'] * res.subAmount;
                  this.getTaxNoByCompanyId(res.payCompanyId, res);
                  this.getCompanyBankThree(res);
                }
              );
            }
            const oneCarrier = this.currentModalSelectedData.every((x: any) => x.carrierCompanyId !== this.currentModalSelectedData[0].carrierCompanyId);
            if (!oneCarrier) {
              this.dataSet.map((x: any) => {
                x.carrierCompanyName = this.currentModalSelectedData[0].carrierCompanyName;
                x.carrierCompanyId = this.currentModalSelectedData[0].carrierCompanyId;
              });
              this.currentModalSelectedData[0] && this.getTaxNoByCompanyId(this.currentModalSelectedData[0].carrierCompanyId, this.dataSet, 'carriers');
              this.currentModalSelectedData[0] && this.getPayBankInfo(this.currentModalSelectedData[0], this.dataSet);
            }
            // const bankIdArr: Array<any> = [];
            // this.dataSet.forEach(
            //   res => {
            //     res.bankId && bankIdArr.push({bankId: res.bankId});
            //   }
            // );
            //
            // bankIdArr.length !== 0 && this.getBankData(bankIdArr);

            // this.dataSet = res.data.data.payreport || [];
            // // this.totalPages = res.data.data.total;
            // this.topAeraData = res.data.data.payment;
            // this.topAeraData.totAmount = Number(this.topAeraData.totAmount).toFixed(2);
            // this.topAeraData.c = Number(this.topAeraData.appliedAmount).toFixed(2);
            // this.tempreceivefeeClientNo = res.data.data.payment.receivefeeClientNo;
            // this.receivefeeClientName = res.data.data.payment.receivefeeClientName;
            // this.receivefeeClientNo = res.data.data.payment.receivefeeClientNo;
            // this.inpData = { inpName: res.data.data.payment.receivefeeClientName, inpValue: res.data.data.payment.receivefeeClientNo};
            // console.log(this.topAeraData)
            // // this.topAeraData.dataRange = [];
            // // this.topAeraData.dataRange[0] = this.topAeraData.dataRange.split(',')[0];
            // // this.topAeraData.dataRange[1] = this.topAeraData.dataRange.split(',')[1];
            // this.topAeraData.priceAmount = (Number(this.topAeraData.totAmount) - Number(this.topAeraData.appliedAmount)).toFixed(2);
            // this.modalValidateForm.patchValue(this.topAeraData);
            // 排序
            this.dataSet.sort(
              (a, b) => {
                if (a.payReportNo > b.payReportNo) {
                  return 1;
                }
                if (a.payReportNo < b.payReportNo) {
                  return -1;
                }
                return 0;
              }
            );
          }
          this.currentModalSelectedData = [];
        });
      } else if (this.currentModalType === 'calculate') {
        let url = localUrls.paymentRegistConfirmUrl2;
        let param = {tSettleModels: []};
        this.currentModalSelectedData.forEach(element => {
          let obj = {};
          obj['rowid'] = element.rowid;
          param.tSettleModels.push(obj);
        });
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            if (res.data.data) {
              const param = res.data.data.payment;
              this.dataSet = [];
              param.payYfAmount = param.appliedAmount;
              param.totalWeight = param.totWeight;
              param.totalAmount = param.totAmount;
              param.payCompanyId = param.receivefeeClientNo;
              param.subAmount = Number(param.totalAmount - param.appliedAmount).toFixed(2);
              this.dataSet.push(param);

            }

            // let arr = res.data.data.payreport || [];
            // let reNo = [];
            // arr.forEach(element => {
            //   reNo.push(element.payReportNo);
            // });
            // this.showTipModal = true;
            // this.modalCon = `已生成结算报表号${reNo[0]}`;
            // this.dataSet = res.data.data.payreport || [];
            // this.topAeraData = res.data.data.payment;
            // this.topAeraData.totAmount = Number(this.topAeraData.totAmount).toFixed(2);
            // this.topAeraData.appliedAmount = Number(this.topAeraData.appliedAmount).toFixed(2);
            // this.tempreceivefeeClientNo = res.data.data.payment.receivefeeClientNo;
            // this.receivefeeClientName = res.data.data.payment.receivefeeClientName;
            // this.receivefeeClientNo = res.data.data.payment.receivefeeClientNo;
            // this.inpData = {inpName: res.data.data.payment.receivefeeClientName, inpValue: res.data.data.payment.receivefeeClientNo};
            //
            // // this.topAeraData.dataRange = [];
            // // this.topAeraData.dataRange[0] = this.topAeraData.dataRange.split(',')[0];
            // // this.topAeraData.dataRange[1] = this.topAeraData.dataRange.split(',')[1];
            // this.topAeraData.priceAmount = (Number(this.topAeraData.totAmount) - Number(this.topAeraData.appliedAmount)).toFixed(2);
            // this.modalValidateForm.patchValue(this.topAeraData);

          }
          this.currentModalSelectedData = [];
        });
      }
    } else {
      this.nz.warning('提示消息', '请选择数据后确认！');
      return;
    }

    this.tplModal.destroy();


  }

  modal_return(): void {
    this.currentModalSelectedData = [];
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

  inpEmit(data: any) {
    console.log(data);
    this.inpData = data;
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

  commonPageEmit(data: any) {
    switch (data.eName) {
      case 'receivefeeClientName': {
        if (data.inpValue) {
          this.dataSet[data.index].payCompanyId = data.inpValue;
          this.dataSet[data.index].bankAccount = data.selData[0].account;
          this.dataSet[data.index].depositBank = data.selData[0].bankName;
          this.dataSet[data.index].lineNumber = data.selData[0].accountJoint;
          this.dataSet[data.index].bankId = data.selData[0].bankId;
          this.getTaxNoByCompanyId(data.inpValue, this.dataSet[data.index]);
        } else {
          this.dataSet[data.index].payCompanyId = null;
          this.dataSet[data.index].bankAccount = null;
          this.dataSet[data.index].depositBank = null;
          this.dataSet[data.index].lineNumber = null;
          this.dataSet[data.index].bankId = null;
          this.dataSet[data.index].taxNo = null;
        }

      }
        break;
      case 'depositBank': {
        this.dataSet[data.index].bankAccount = data.inpValue;
        this.dataSet[data.index].lineNumber = data.selData[0].accountJoint;
        this.dataSet[data.index].bankId = data.selData[0].bankId;
        this.dataSet[data.index].taxNo = data.selData[0].taxNo;
      }
        break;
      case 'carrierCompanyName': {
        if (data.inpValue) {
          this.dataSet[data.index].carrierCompanyName = data.inpName;
          this.dataSet[data.index].carrierCompanyId = data.inpValue;
          this.dataSet[data.index].payBankAccount = data.selData[0].bankAccount;
          this.dataSet[data.index].payDepositBank = data.selData[0].bank;
          this.dataSet[data.index].payLineNumber = data.selData[0].accountJoint;
          this.dataSet[data.index].carrierBankId = data.selData[0].bankId;
          this.getTaxNoByCompanyId(data.inpValue, this.dataSet[data.index], 'carrier');
        } else {
          this.dataSet[data.index].carrierCompanyName = null;
          this.dataSet[data.index].carrierCompanyId = null;
          this.dataSet[data.index].payBankAccount = null;
          this.dataSet[data.index].payDepositBank = null;
          this.dataSet[data.index].payLineNumber = null;
          this.dataSet[data.index].carrierBankId = null;
          this.dataSet[data.index].payTaxNo = null;
        }

      }
    }
    // this.dataSet[data.index].payCompanyId = data.inpValue;
  }

  getBankData(data: Array<any>): void {
    this.http.post(urls.getMsgByBankId, {bankIds: data}).then(
      res => {
        if (res.success) {
          res.data.data.map(
            source => {
              const index = this.dataSet.findIndex(res1 => res1.bankId && res1.bankId === source.bankId);
              if (index !== -1) {
                this.dataSet[index].receivefeeClientName = source.recName;
                this.dataSet[index].depositBank = source.bankName;
                this.dataSet[index].bankAccount = source.account;
                this.dataSet[index].lineNumber = source.accountJoint;
                this.dataSet[index].payCompanyId = source.recCompanyName;
                this.dataSet[index].taxNo = source.taxNo;

              }
            }
          );
          // res.data.data
          // this.inpData = {
          //   inpName: res.data.data[0].recName,
          //   inpValue: res.data.data[0].recCompanyName
          // };
          // this.receivefeeClientName = res.data.data[0].recName;
          // this.depositBank = res.data.data[0].bankName;
          // this.modalValidateForm.get('bankAccount').setValue(res.data.data[0].account);
          // this.modalValidateForm.get('lineNumber').setValue(res.data.data[0].accountJoint);
        }
      }
    );
  }

  /**
   * 打印
   */
  print(): void {
    const paymentNo = [];
    this.dataSet.map(
      res => {
        if (!res.paymentNo) {
          this.nz.warning('提示消息', '请付款申请登记后再打印请款单！');
          return;
        } else {
          paymentNo.push(res.paymentNo);
        }
      }
    );

    if (!paymentNo[0]) {
      this.nz.warning('提示消息', '请付款申请登记后再打印请款单！');
      return;
    }
    this.angularHttp.get(localUrls.payment,
      {
        responseType: 'blob',
        params: {
          paymentNoList: paymentNo,
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
        this.nz.warning('提示消息', '打印请款单失败!');
      }
    );

  }

  /**
   * 获取税号
   * @param companyId
   * @param value
   */
  getTaxNoByCompanyId(companyId: string, value: any, type?: string): void {
    const param = {
      companyId: companyId
    };
    this.http.post(urls.getTaxNoByCompanyId, param).then(
      res => {
        if (res.success) {
          if (type === 'carrier') {
            value.payTaxNo = res.data.data.creditCode;
          } else if (type === 'carriers') {
            Array.isArray(value) && value.map((x: any) => {
              x.payTaxNo = res.data.data.creditCode;
            });
          } else {
            value.taxNo = res.data.data.creditCode;
          }

        }
      }
    );
  }

  /**
   * 表头数据抛出
   * @param data
   */
  userColumnsEmit(data: Array<any>) {
    this.userHeader = data;
  }

  /**
   * 获取公司银行
   * @param param
   */
  getCompanyBankThree(param: any): void {
    this.http.post(inpModalUrl.getCompanyBankThree, {companyId: param.fleetCompanyId, recCompanyName: param.receivefeeClientName}).then(
      res => {
        param.depositBank = res.data.data.data[0].bankName;
        param.bankAccount = res.data.data.data[0].account;
        param.lineNumber = res.data.data.data[0].lineNumber || '';
        param.bankId = res.data.data.data[0].bankId || '';
      }
    );
  }

  /** 获取付款公司银行*/
  private getPayBankInfo(param: any, value: any[]) {
    this.http.post(inpModalUrl.getRecCompany, {companyId: param.carrierCompanyId, companyName: param.carrierCompanyName}).then(res => {
      if (res.success) {
        value.map((x: any) => {
          x.payBankAccount = res.data.data.data[0] && res.data.data.data[0].bankAccount;
          x.payDepositBank = res.data.data.data[0] && res.data.data.data[0].bank;
          x.payLineNumber = res.data.data.data[0] && res.data.data.data[0].accountJoint;
          x.carrierBankId = res.data.data.data[0] && res.data.data.data[0].bankId;
        });
      }
    });
  }

  /**
   * table input值变化事件
   * @param data
   */
  modelChange(data: any) {
    switch (data.header.colEname) {
      case 'feeType': {
        data.data.payAmount = this.selectMap[data.val] * data.data.subAmount;
      }
        break;
    }
  }
}
