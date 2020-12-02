import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {localUrls} from '@model/localUrls';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService, NzMessageService} from 'ng-zorro-antd';
import {urls} from '@model/url';
import {toDemical} from '@validator/validator';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {format as dateformat} from 'date-fns';
import {UserinfoService} from '@service/userinfo-service.service';
import {Utils} from '@util/utils';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-payment-registration',
  templateUrl: './payment-registration.component.html',
  styleUrls: ['./payment-registration.component.css'],
  providers: [
    XlsxService
  ]
})
export class PaymentRegistrationComponent implements OnInit {
  listLoading: boolean = false;
  inpData: any = {};
  tplModal: NzModalRef;
  tableData: any = [];
  totalPages: any = 1;
  selecetedData: any=[];
  pageSize: Number = 30;
  tempSearchParam: any = {};
  businessModuleCompany = false;   //业务公司按钮弹窗控制
  businessModuleCompanyLoading = false;
  segmentIdArr:any=[]
  // commissionClientName:any;
  popData: any = {
    pay_name: {
      name: '',
      id: ''
    },
    com_name: {
      name: '',
      id: ''
    },
    payment_bank: {
      name: '',
      id: ''
    },
    beneficiary_bank: {
      name: '',
      id: ''
    }

  };

  modalFormVisible = false; // 表单弹窗
  modalTitle: string = '新增收款登记';
  modalValidateForm: FormGroup;
  modalSendData: any = {};
  modalFormData: Array<any> = [
    {
      name: '凭证号', eName: 'certificateNumber', type: 'text', validateCon: '', require: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '凭证号格式不正确，只能填数字或字母'
      }
    },
    // {
    //   name: '单位助记码', eName: 'zjNo', type: 'text', validateCon: '请输入界面ID', require: false,
    //   validators: {
    //     require: false,
    //     pattern:true,
    //     patternStr:'[a-zA-Z0-9]*',
    //     patternErr:'单位助记码格式不正确，只能填数字或字母'
    //   }
    // },
    {
      name: '付款方式', eName: 'payType', type: 'select', validateCon: '请选择付款方式', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '付款单位',
      eName: 'commissionClientName',
      bindName: 'com_name',
      type: 'commissionClientName',
      validateCon: '请选择付款单位',
      require: true,
      findSet: {
        url: 'getCompanyBankThree',
        formId: 'form_bank_tan',
        name: '付款单位',
        parameter: 'recCompanyName',
        parameterSend: 'recCompanyId'
      },
      validate: {validateOpt: 'inpValue', validateCon: '请选择付款单位,若无数据，请在客户结算账户添加！'},
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '付款银行', eName: 'commissionBank', bindName: 'payment_bank', type: 'text', validateCon: '请输入付款银行', require: false, disabled: true,
      findSet: {
        url: 'getPayCompany',
        name: '选择银行账户',
        formId: 'form_bank_set',
        parameter: 'bankName',
        parameterSend: 'account'
      }, searchValue: 'com_name',
      validate: {validateOpt: 'inpValue', validateCon: '请选择付款银行,若无数据，请在客户结算账户添加！'},
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '付款账户', eName: 'commissionAccount', bindName: 'com_name', type: 'text', validateCon: '请输入付款账户', require: false, disabled: true,
      findSet: {formId: 'company_pop', name: '付款单位', parameter: 'companyName', parameterSend: 'companyId'},
      validate: {validateOpt: 'inpValue', validateCon: '请输入付款账户'},
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '收款金额', eName: 'priceAmount', type: 'number', validateCon: '请输入收款金额', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '收款单位', eName: 'recCompanyName', bindName: 'pay_name', type: 'recCompanyName', validateCon: '请输入收款单位', require: true,
      findSet: {
        url: 'getRecCompany',
        formId: 'form_rec_test',
        name: '收款单位',
        parameter: 'companyName',
        parameterSend: 'settleCompanyId'
      },
      validate: {validateOpt: 'inpValue', validateCon: '请选择收款单位,若无数据，请在公司结算账户添加！'},
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '收款银行', eName: 'bankName', bindName: 'beneficiary_bank', type: 'text', validateCon: '请输入收款银行', require: false, disabled: true,
      findSet: {
        url: 'getBankMsgByRecCompanyName',
        name: '选择银行账户',
        formId: 'form_rec_bank_set',
        parameter: 'bank',
        parameterSend: 'bankAccount'
      }, searchValue: 'pay_name',
      validate: {validateOpt: 'inpValue', validateCon: '请选择收款银行,若无数据，请在公司结算账户添加！'},
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '收款账户', eName: 'receiveAccount', type: 'text', validateCon: '请输入收款账户', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '收账时间', eName: 'billDate', type: 'time', validateCon: '请选择加油时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请填写备注', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '付款银行ID', eName: 'payBankId', type: 'text', validateCon: '请填写备注', require: false, hidden: true,
      validators: {
        require: false
      }
    },
    {
      name: '收款银行ID', eName: 'recBankId', type: 'text', validateCon: '请填写备注', require: false, hidden: true,
      validators: {
        require: false
      }
    },
  ];

  typeDataArr: any = [];

  importValidate: FormGroup; // 导入表单验证
  businessModuleValidate: FormGroup;//业务公司表但验证
  isVisible: boolean = false; // 弹框是否显示
  importFile: File; // 选中的文件
  importLoading: boolean; // 导入按钮loading
  caculateEnameArr: any = [
    {field: 'priceAmount', tipInfo: '收款金额', tipInfoType: '元', demLength: 2}

  ];
  showExplainFlag1: boolean = false;
  showExplainFlag2: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef; // 隐藏文件选框

  templateUrl: string = 'http://another2.oss-cn-hangzhou.aliyuncs.com/import/收款导入模板.xlsx';

  constructor(private http: HttpUtilService,
              private fb: FormBuilder,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private xlsx: XlsxService,
              private msg: NzMessageService,
              private info: UserinfoService,
              private angularHttp: HttpClient
  ) {
    this.importValidate = this.fb.group({
      file: [null, [Validators.required]],
      fileName: [null, [Validators.required]],
    });
    this.businessModuleValidate = this.fb.group({
      segmentId: [null, [Validators.required]],
    });
  }


  ngOnInit() {
    //  this.listSearch({page: 1, length: this.pageSize});

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

      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        {value: '', disabled: this.modalFormData[i].disabled}, validatorOrOpts
      ));
    }

    this.http.post(urls.static, {valueSetCode: 'FFFS'}).then((res: any) => { //获取费用类型
      if (res.success) {
        this.typeDataArr = res.data.data.data;
      }
    });
    this.http.post(urls.getCompanySegment,{companyId:this.info.APPINFO.USER.companyId}).then(res=>{
        if(res.success){
          let arr = [];
          res.data.data.forEach(item => {
            arr.push({name: item.segmentName, value: item.segmentId});
          });
          this.segmentIdArr = [...arr];
        }
    })
  }

  listSearch(data: any): void {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  searchParam: any = {};
  searchParamArr: Array<any> = [];

  getList(data: any): void {
    console.log(data);
    this.listLoading = true;
    this.tempSearchParam = data;
    // this.searchParamArr=data.queryParameterList;
    // //console.log(this.searchParamArr)
    // this.searchParamArr.forEach(val => {
    //   if(val.name=='业务标记'){
    //     if(val.value1=='是'){
    //       val.value1='YWBJ10'
    //     }else{
    //       val.value1='YWBJ20'
    //     }
    //   }
    // });
    // data.queryParameterList=this.searchParamArr;
    //console.log(data)
    // if(data.queryParameterList){
    //
    // }
    let url = localUrls.getPaymentRegListUrl;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.listLoading = false;
          this.tableData = res.data.data.data;
          this.totalPages = res.data.data.total;
        }
      }
    );
  }


  selectData(data: any): void {
    console.log(data);
    this.selecetedData = data;
  }

  modelChange(value: string, data: any) { //弹窗选择框

    if (value === 'FFFS10') {
      this.modalFormData[3].hidden = true;
      this.modalFormData[4].hidden = true;
    } else {
      this.modalFormData[3].hidden = false;
      this.modalFormData[4].hidden = false;
    }
  }

  btnAdd(): void {
    this.inpData = {};
    this.modalFormVisible = true;
    this.popData.pay_name.name = '';
    this.popData.pay_name.id = '';
    this.popData.com_name.name = '';
    this.popData.com_name.id = '';
    this.modalValidateForm.reset();
    let nowDate = new Date();
    this.modalValidateForm.get('billDate').setValue(Utils.dateFormat(nowDate, 'yyyy-MM-dd'));
    this.modalValidateForm.get('payType').setValue('FFFS20');

    console.log();
    // console.log(this.commissionClientName)
  }

  selecetedDataArr:Array<any> = [];
  statusIf : boolean = false;
  recNo : Array<any> = [];
  recRecNo : any;

  btnClick(data: any): void {
    switch (data.type.buttonId) {
      case 'delete': {
        //作废
        if (data.data.length < 1) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选择后操作！'
          });
          this.destroyTplModal();
          return;
        }
        let url = localUrls.deletePaymentRegUrl;
        let param = [];

        const status = this.selecetedData.some(element => {
          let obj = {};
          obj['settleRecNo'] = element.settleRecNo;
          param.push(obj);
          return !element.settleRecNo;
        });
        if (status) {
          this.nz.warning('提示消息', '请选择有收款单号的数据进行操作！');
          return;
        }
        this.http.post(url, {tSettleRecModels: param}).then((res: any) => {
          if (res.success) {
            this.nz.create('success', '提示信息', '作废成功', {nzDuration: 3000});
            // this.listSearch({page: 1, length: this.pageSize});
            this.tempSearchParam.page = 1;
            this.listSearch(this.tempSearchParam);
          }
        });
      }
        break;
      case 'showModal':
        this.showModal();
        break;
      case 'refresh':
        this.refresh();
        break;
      case 'export': {
        this.btnExport();
      }
        break;
      case 'busiCompany': {
        this.btnBusiCompany();
      }
        break;
      case 'exportKingdee': {
        this.btnexportKingdee();
      }
        break;
      case 'mark': {   //业务标记
        //console.log(data)
        if (data.data.length < 1) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选择后操作！'
          });
          this.destroyTplModal();
          return;
        }
        /*this.selecetedDataArr=this.selecetedData;
             this.selecetedDataArr.filter(item =>  {
               item.errMsg=`收款信息："${this.selecetedData[0].settleRecNo}"收款号的记录已配款，不可标记)`;
          });*/
        this.selecetedDataArr=this.selecetedData;
        this.selecetedDataArr.forEach(val => {
          if(val.settleRecFlag == '是'){
            if(val.status != '初始登记'){
              this.recNo.push(val.settleRecNo);
              // this.recRecNo='收款信息：'+this.recNo+ '收款号的记录已配款，不可标记';
              // this.msg.error(this.recRecNo);
              this.statusIf=true;
            }
          }
        });
        if(this.statusIf){
           this.recNo.forEach(value => {
             this.recRecNo='收款信息：'+value+ '收款号的记录已配款，不可标记';
             this.msg.error(this.recRecNo);
           })
           this.statusIf=false;
           this.recNo = [];
           return;
        }
        /*if(this.selecetedData[0].settleRecFlag=='是'){
           if(this.selecetedData[0].status != '初始登记'){
             const recNo = this.selecetedData[0].settleRecNo
             const recRecNo='收款信息：'+recNo+ '收款号的记录已配款，不可标记';
             this.msg.error(recRecNo);
             return;
           }
        }*/
        let paramlist = this.selecetedDataArr;
        //paramlist.push(this.selecetedData[0]);
        let url = localUrls.modifyBussinessMark;

        this.http.post(url, {tSettleRecModels: paramlist}).then((res: any) => {
          if (res.success) {
            this.nz.create('success', '提示信息', '业务标记成功', {nzDuration: 3000});
            // this.listSearch({page: 1, length: this.pageSize});
            this.tempSearchParam.page = 1;
            this.listSearch(this.tempSearchParam);
          }
        });
        //this.btnMark();
      }
        break;
    }

  }

  /*
  *    强制刷新
  */
  refresh() {
    let url = localUrls.refreshInfo;
    let param: any = {};
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        // this.getList(this.tempSearchParam);
        this.tempSearchParam.page = 1;
        this.listSearch(this.tempSearchParam);
      }
    });
  }

  handleCancel(): void {
    this.modalFormVisible = false;
    this.modalSendData = {};
    this.showExplainFlag1 = false;
    this.showExplainFlag2 = false;
    // this.showExplainFlag3 = false;
    // this.showExplainFlag4 = false;
    this.popData = {
      pay_name: {
        name: '',
        id: ''
      },
      com_name: {
        name: '',
        id: ''
      },
      payment_bank: {
        name: '',
        id: ''
      },
      beneficiary_bank: {
        name: '',
        id: ''
      }

    };

    console.log(this.popData);
  }

  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
      this.showExplainFlag1 = !this.popData.pay_name.id;
      this.showExplainFlag2 = !this.popData.com_name.id;
      // this.showExplainFlag3 = !this.popData.payment_bank.id;
      // this.showExplainFlag4 = !this.popData.beneficiary_bank.id;
    }
    if (this.showExplainFlag1 || this.showExplainFlag2) {
      return;
    }
    if ('VALID' === this.modalValidateForm.status) {
      if (this.modalValidateForm.get('payType').value === 'FFFS10') {
        this.modalValidateForm.get('commissionBank').setValue(null);
        this.modalValidateForm.get('commissionAccount').setValue(null);
      }
      this.modalValidateForm.get('commissionClientName').setValue(this.popData.com_name.name || '');
      this.modalValidateForm.get('recCompanyName').setValue(this.popData.pay_name.name || '');
      this.modalValidateForm.get('billDate').setValue(this.modalValidateForm.get('billDate').value && this.modalValidateForm.get('billDate').value instanceof Date ? Utils.dateFormat(this.modalValidateForm.get('billDate').value, 'yyyy-MM-dd') : this.modalValidateForm.get('billDate').value);
      this.modalSendData = this.modalValidateForm.getRawValue();
      // this.modalSendData.bankName = this.popData.beneficiary_bank.name;
      // this.modalSendData.commissionBank = this.popData.payment_bank.name;
      this.modalSendData.recCompanyId = this.popData.pay_name.id;
      this.modalSendData.commissionClientId = this.popData.com_name.id || '';
      // commissionBank付款银行
      let url = localUrls.addPaymentRegUrl;
      this.http.post(url, this.modalSendData).then((res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '增加成功', {nzDuration: 3000});
          this.modalFormVisible = false;
          this.modalSendData = {};
          // this.listSearch({page: 1, length: this.pageSize});
          this.tempSearchParam.page = 1;
          this.listSearch(this.tempSearchParam);
        }
      });

    }


  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  inpEmit(data: any, objname) {
    console.log(data, objname);
    this.inpData = data;
    // this.commissionClientName = this.inpData.inpName;
    this.popData[objname].name = this.inpData.inpName;
    this.popData[objname].id = this.inpData.inpValue;

    //收款单位带入收款银行信息
    if (objname === 'pay_name' && data.selData && data.selData[0]) {
      // this.modalValidateForm.get('bankName').setValue(data.selData[0].bank);
      this.modalValidateForm.get('receiveAccount').setValue(data.selData[0].bankAccount);
      this.modalValidateForm.get('bankName').setValue(data.selData[0].bank);
      // this.popData.beneficiary_bank.name = data.selData[0].bank;
      // this.popData.beneficiary_bank.id = data.selData[0].bankId || data.selData[0].bank;
      this.modalValidateForm.get('recBankId').setValue(data.selData[0].bankId);
      // this.popData.pay_name.id = data.selData[0].bankAccount;
    }

    // 收款银行
    // if (objname === 'beneficiary_bank' && data.selData && data.selData[0]) {
    //   // this.modalValidateForm.get('bankName').setValue(data.selData[0].bank);
    //   this.modalValidateForm.get('receiveAccount').setValue(data.inpValue);
    //   this.modalValidateForm.get('recBankId').setValue(data.selData[0].bankId);
    // }

    // 付款银行
    // if (objname === 'payment_bank' && data.selData && data.selData[0]) {
    //   // this.modalValidateForm.get('bankName').setValue(data.selData[0].bank);
    //   this.modalValidateForm.get('commissionAccount').setValue(data.inpValue);
    //   this.modalValidateForm.get('payBankId').setValue(data.selData[0].bankId);
    // }


    //付款单位 查询付款银行信息
    if (objname === 'com_name' && data.selData && data.selData[0]) {
      this.modalValidateForm.get('commissionAccount').setValue(data.selData[0].account);
      this.modalValidateForm.get('commissionBank').setValue(data.selData[0].bankName);
      this.modalValidateForm.get('payBankId').setValue(data.selData[0].bankId);
      // this.popData[objname].name = data.selData[0].recCompanyName;
      // this.http.post(inpModalUrl.getPayCompany, {companyId: data.inpValue}).then(
      //   res => {
      //     if (res.success) {
      //       if (res.data.data.total >0) {
      //         this.modalValidateForm.get('commissionAccount').setValue(res.data.data.data[0].account);
      //         this.modalValidateForm.get('payBankId').setValue(res.data.data.data[0].bankId);
      //         this.popData.payment_bank.name = res.data.data.data[0].bankName;
      //         this.popData.payment_bank.id = res.data.data.data[0].bankId || res.data.data.data[0].bankName;
      //       }
      //     }
      //   }
      // );
      // this.modalValidateForm.get('bankName').setValue(data.selData[0].bank);
      // this.modalValidateForm.get('commissionAccount').setValue(data.selData[0].bankAccount);
      // this.popData.payment_bank.name = data.selData[0].bank;
      // this.popData.payment_bank.id = data.selData[0].bank;

    }


  }


  blur(): void {
    this.modalValidateForm.get('priceAmount').setValue(toDemical(this.modalValidateForm.get('priceAmount').value));
  }

  /**
   * Excel导入弹出框
   */
  showModal() {
    this.isVisible = true;
    this.importLoading = false;
    this.importValidate.reset();
  }

  /**
   * 点击输入框弹出文件选择框
   */
  selectFile() {
    this.fileInput.nativeElement.click();
  }

  /**
   * 选择文件后将文件名称回写到输入框中
   * @param e
   */
  writeFileName(e: any) {
    this.importFile = e.target.files[0];
    this.importValidate.patchValue({fileName: this.importFile.name});
  }

  /**
   * 导入确定按钮触发事件
   */
  importExcel() {
    for (const i in this.importValidate.controls) {
      this.importValidate.controls[i].markAsDirty();
      this.importValidate.controls[i].updateValueAndValidity();
    }
    if (this.importValidate.invalid) {
      return false;
    }
    this.importLoading = true;
    this.xlsx.import(this.importFile).then(res => {
      const keys = Object.keys(res);
      if (!keys || keys.length == 0) {
        this.importLoading = false;
        this.msg.error('上传数据格式不正确，请下载标准模板!');
        return;
      }

      const data = res[keys[0]];
      if (!data || data.length < 2) {
        this.importLoading = false;
        this.msg.error('上传数据格式不正确，请下载标准模板!');
        return;
      }

      // 模板必要字段验证
      if (this.validateColumns(data[0]) === false) {
        this.importLoading = false;
        return;
      }
      // 导入数据校验
      const recList = this.toSettleRec(data);
      if (this.validateData(recList) === false) {
        this.importLoading = false;
        return;
      }

      this.http.post(localUrls.importSettleRecUrl, {tSettleRecModels: recList}).then((res: any) => {
        if (res.success) {
          this.isVisible = false;
          this.msg.success(`导入收款登记信息成功!共导入${recList.length}条`);
          // this.listSearch({page: 1, length: this.pageSize});
          this.tempSearchParam.page = 1;
          this.listSearch(this.tempSearchParam);
        }
        this.importLoading = false;
      });

    });
  }

  importColumns: Array<any> = [
    {ename: 'billDate', cname: '日期', required: true}, // 收款时间
    {ename: 'commissionClientName', cname: '付款单位', required: true}, // 付款单位
    {ename: 'commissionAccount', cname: '付款账号', required: false}, // 付款账号 改了
    {ename: 'commissionBank', cname: '付款银行', required: false}, // 付款银行  改了
    {ename: 'priceAmount', cname: '金额', required: true, validator: 'number'}, // 收账金额
    {ename: 'recCompanyName', cname: '收款单位', required: true},  // 收款单位
    {ename: 'bankName', cname: '收款银行', required: true}, // 转账银行
    {ename: 'receiveAccount', cname: '收款账号', required: true},  // 收款账号
    {ename: 'receiveTerm', cname: '项目'}, // 收款项目
    {ename: 'receiveUser', cname: '结算负责人', required: true}, // 结算负责人
    {ename: 'tranFlow', cname: '账户明细编号-交易流水号', required: true}, // 交易流水
    {ename: 'remark', cname: '备注'}, // 备注
  ];


  /**
   * 导入数据校验
   * @param data
   */
  validateData(data: Array<any>): boolean {
    const invalidColumn = this.importColumns.filter(item => item.required).filter(col => {
      return data.some((item, index) => {
        // 如果没有值或者值去空格后长度为0，返回true
        if (!item[col.ename] || item[col.ename].trim().length == 0) {
          col.errMsg = `存在"${col.cname}"字段为空(行号：${index + 2})`;
          return true;
        }
        item[col.ename] = item[col.ename].trim();
        if (col.validator === 'number') {
          item[col.ename] = item[col.ename].replace(/,/g, '');
          if (isNaN(item[col.ename])) {
            col.errMsg = `存在"${col.cname}"字段不是数字(行号：${index + 2})`;
            return true;
          }
        }
        return false;
      });
    });

    if (invalidColumn && invalidColumn.length > 0) {
      //this.msg.error(`导入失败！导入数据错误：${invalidColumn.map(item => item.errMsg).join(',')}的数据`);
      this.msg.error(`上传数据格式不正确，请下载标准模板!`);
      return false;
    }
    return true;
  }

  /**
   * 列头验证
   * @param header
   */
  validateColumns(header: Array<any>): boolean {
    const invalid = this.importColumns.filter(col => col.required && !header.some(h => h && h.trim() == col.cname));
    if (invalid && invalid.length > 0) {
      this.msg.error(`上传数据格式不正确，请下载标准模板!`);
      // this.msg.error(`导入失败！模板错误："${invalid.map(item => item.cname).join('","')}"字段必须存在！`);
      return false;
    }
    return true;
  }

  /**
   * 将csv数组转为收款登记
   * @param data
   */
  toSettleRec(data: any): Array<any> {
    if (!data || data.length < 2) {
      this.msg.error('上传数据格式不正确，请下载标准模板!');
      return;
    }
    let dataArray = [];
    const header = data[0].map(item => this.getEname(item));
    for (let i = 1; i < data.length; i++) {
      let obj = {};
      header.forEach((key, index) => obj[key] = data[i][index]);
      dataArray.push(obj);
    }
    dataArray = dataArray.filter(item => item.billDate);
    // 将日期和时间拼接，并转为YYYY-MM-DD HH:mm:ss格式
    dataArray.forEach(item => item.billDate = dateformat(`${item.billDate}`, 'YYYY-MM-DD HH:mm:ss'));

    return dataArray;
  }

  /**
   * 根据列配置的中文名称获取英文名称
   * @param cname
   */
  getEname(cname: string): string {
    if (!cname) {
      return cname;
    }
    const col = this.importColumns.find(item => item.cname === cname.trim());
    if (col) {
      return col.ename;
    }
    return cname;
  }

  /**
   * 点击导出
   */
  btnExport(): void {
    this.angularHttp.post(localUrls.exportSettleRec, this.tempSearchParam, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `收款信息.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  }

  /**
   * 点击业务标记
   */
  /*btnMark(): void {
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }
    if(this.selecetedData[0].settleRecFlag=='是'){
      if(this.selecetedData[0].status != '初始登记'){
        /!*this.selecetedDataArr=this.selecetedData;
        this.selecetedDataArr.filter(item =>  {
          item.errMsg=`收款信息："${this.selecetedData[0].settleRecNo}"收款号的记录已配款，不可标记)`;
        });*!/
        const recNo = this.selecetedData[0].settleRecNo
        const recRecNo='收款信息：'+recNo+ '收款号的记录已配款，不可标记';
        this.msg.error(recRecNo);
        return;
      }
    }
    let paramlist = this.selecetedData[0];
    let url = localUrls.modifyBussinessMark;

    this.http.post(url, {tSettleRecModels: paramlist}).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '业务标记成功', {nzDuration: 3000});
        // this.listSearch({page: 1, length: this.pageSize});
        this.tempSearchParam.page = 1;
        this.listSearch(this.tempSearchParam);
      }
    });
  }*/


  /*
  *  业务公司按钮
  */
  btnBusiCompany(){
    if(this.selecetedData.length<=0){
      this.nz.error('提示信息','请勾选数据')
      return;
    }
    this.businessModuleValidate.get('segmentId').setValue(this.segmentIdArr[0].value)
    this.businessModuleCompany = true;
  }

  /*
  *  业务公司弹窗确定
  */
  changeBusinessModuleId() {
    for (const i in this.businessModuleValidate.controls) {
      this.businessModuleValidate.controls[i].markAsDirty();
      this.businessModuleValidate.controls[i].updateValueAndValidity();
    }
    if (this.businessModuleValidate.invalid) {
      return false;
    }
    this.businessModuleCompanyLoading = true
    let param :any ={};
    param.tSettleRecModels = this.selecetedData;
    param.tSettleRecModels .forEach(item=>{
      item.segmentId = this.businessModuleValidate.get('segmentId').value;
    })
    this.http.post(localUrls.changeBusinessModuleId,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息','修改成功')
        this.tempSearchParam.page = 1;
        this.listSearch(this.tempSearchParam);
        this.businessModuleCompany = false;
        this.businessModuleCompanyLoading = false;
      }
    })
  }

  /*
  *   业务公司弹窗取消
  */
  handleCancel1(){
    this.businessModuleCompany = false;
    this.businessModuleCompanyLoading = false;
    this.businessModuleValidate.reset()
  }

  /*
  *  金蝶导出
  */
  btnexportKingdee(){
    if(this.selecetedData.length<=0){
      this.nz.error('提示信息','请勾选数据')
      return;
    }
    this.angularHttp.post(localUrls.JDExport, {tSettleRecModels:this.selecetedData}, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `金蝶导出.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  }
}
