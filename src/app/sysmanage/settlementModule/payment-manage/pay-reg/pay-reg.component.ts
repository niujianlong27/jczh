import {Component, OnInit, ViewChild} from '@angular/core';
import {localUrls} from '@model/localUrls';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '@util/utils';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {toDemical} from 'src/app/common/validators/validator';
import {urls} from '@model/url';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-pay-reg',
  templateUrl: './pay-reg.component.html',
  styleUrls: ['./pay-reg.component.css']
})
export class PayRegComponent implements OnInit {
  inpData: any = {};
  tplModal: NzModalRef;
  listLoading: boolean = false;
  isMutli: boolean = true;
  dataSet: any = [];
  totalPages: Number = 1;
  pageSize: Number = 30;
  modalFormVisible = false; // 表单弹窗 付款登记
  modalFormVisible2 = false; // 表单弹窗 在线支付
  commissionClientName: any;
  carrierCompanyName: any;
  modalTitle: string = '新增付款登记';
  modalValidateForm: FormGroup; // 付款登记
  modalValidateForm2: FormGroup;// 在线支付
  selectedDataArr: Array<any> = [];
  feeArr: any = [];

  status: boolean = false;
  caculateEnameArr: any = [
    {field: 'payAmount', tipInfo: '已选请款金额', tipInfoType: '元', demLength: 2}
  ];

  payTheTag: boolean = false;

  channelData: Array<any> = []; //支付通道数据存储

  modalStatus: string; // 弹窗 selectDate 付款登记，AddPayment 在线支付
  // 付款登记
  modalFormData: Array<any> = [
    {
      name: '付款方式', eName: 'payType', type: 'select', validateCon: '请输入付款方式', disabled: false, require: false,
      selectArr: [],
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '付款时间', eName: 'billDate', type: 'time', validateCon: '请输入付款时间', require: false,
      validators: {
        require: true,
      }
    },
    {
      name: '金额', eName: 'priceAmount', type: 'number', validateCon: '请输入金额', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '凭证号', eName: 'certificateNumber', type: 'text', validateCon: '请输入凭证号', disabled: false, require: false,
      validators: {
        require: false,
        pattern: true,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '凭证号格式不正确，只能填数字或字母'
      }
    },
    {
      name: '收款银行', eName: 'bankName', type: 'text', validateCon: '请输入收账银行', disabled: true, require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '收款账户', eName: 'bankAccount', type: 'text', validateCon: '请输入收账银行账户', disabled: true, require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '收款单位', eName: 'commissionClientName', type: 'inputModal', validateCon: '请输入收款单位', disabled: false, require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '付款银行', eName: 'payBankName', type: 'text', validateCon: '请输入转账银行', disabled: true, require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '付款账户', eName: 'payBankAccount', type: 'text', validateCon: '请输入转账银行账户', disabled: true, require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '付款单位', eName: 'carrierCompanyName', type: 'inputModalCarrier', validateCon: '请输入付款单位', disabled: false, require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '业务板块Id', eName: 'segmentId', type: 'text', validateCon: '', require: false, disabled: false, hidden: true,
      validators: {
        require: false,
        pattern: false,
      }
    }
  ];
  // 在线支付
  modalFormData2: Array<any> = [
    {
      name: '通道名称', eName: 'channelId', type: 'radio', validateCon: '请输入凭证号', disabled: false, require: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '凭证号格式不正确，只能填数字或字母'
      }
    },
    {
      name: '通道说明', eName: 'remark', type: 'textarea', validateCon: '请输入凭证号', disabled: true, require: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '凭证号格式不正确，只能填数字或字母'
      }
    },
    {
      name: '凭证号', eName: 'certificateNumber', type: 'text', validateCon: '请输入凭证号', disabled: false, require: false,
      validators: {
        require: false,
        pattern: true,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '凭证号格式不正确，只能填数字或字母'
      }
    },
    {
      name: '转账银行', eName: 'bankName', type: 'text', validateCon: '请输入转账银行', disabled: true, require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '转账银行账户', eName: 'bankAccount', type: 'text', validateCon: '请输入转账银行', disabled: true, require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '收款单位', eName: 'commissionClientName', type: 'inputModal', validateCon: '请输入收款单位', disabled: false, require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '金额', eName: 'priceAmount', type: 'number', validateCon: '请输入金额', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '密码', eName: 'payPassWord', type: 'password', validateCon: '请输入密码', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '业务板块Id', eName: 'segmentId', type: 'text', validateCon: '', require: false, hidden: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '付款理由', eName: 'mome', type: 'text', validateCon: '请填写付款理由', require: true, hidden: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '车队', eName: 'carTeam', type: 'text', validateCon: '', require: false, hidden: true,
      validators: {
        require: false,
        pattern: false,
      }
    },

  ];

  logo: string = 'https://another2.oss-cn-hangzhou.aliyuncs.com/undefinedBi2jsn4JePWBAj4hdYW42ry5R7Qwcb2z.png'; //支付通道无logo默认展示的logo
  modalOkLoading: boolean = false;

  @ViewChild('reject') reject;
  rejectForm = this.fb.group({
    paymentNo: {value: '', disabled: true},
    rejectReason: [''],

  });
  private searchData: any = {};
  //在线支付 批量
  modalFormVisible3: boolean;
  modalValidateForm3: FormGroup;
  modalFormData3: Array<any> = [
    {
      name: '通道名称', eName: 'channelId', type: 'radio', validateCon: '请输入凭证号', disabled: false, require: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '凭证号格式不正确，只能填数字或字母'
      }
    },
    {
      name: '通道说明', eName: 'remark', type: 'textarea', validateCon: '请输入凭证号', disabled: true, require: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '凭证号格式不正确，只能填数字或字母'
      }
    },
    // {
    //   name: '凭证号', eName: 'certificateNumber', type: 'text', validateCon: '请输入凭证号', disabled: false, require: false,
    //   validators: {
    //     require: false,
    //     pattern: true,
    //     patternStr: '[a-zA-Z0-9]*',
    //     patternErr: '凭证号格式不正确，只能填数字或字母'
    //   }
    // },
    // {
    //   name: '转账银行', eName: 'bankName', type: 'text', validateCon: '请输入转账银行', disabled: true, require: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '转账银行账户', eName: 'bankAccount', type: 'text', validateCon: '请输入转账银行', disabled: true, require: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '收款单位', eName: 'commissionClientName', type: 'inputModal', validateCon: '请输入收款单位', disabled: false, require: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    {
      name: '金额', eName: 'priceAmount', type: 'number', validateCon: '请输入金额', require: false, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '密码', eName: 'payPassWord', type: 'password', validateCon: '请输入密码', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '业务板块Id', eName: 'segmentId', type: 'text', validateCon: '', require: false, hidden: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    // {
    //   name: '付款理由', eName: 'reason', type: 'text', validateCon: '请填写付款理由', require: true, hidden: false,
    //   validators: {
    //     require: true,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '车队', eName: 'carTeam', type: 'text', validateCon: '', require: false, hidden: true,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },

  ];

  constructor(private http: HttpUtilService,
              private nm: NzModalService,
              private fb: FormBuilder,
              private angularHttp: HttpClient,
              private nz: NzNotificationService) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalValidateForm2 = this.fb.group({});
    this.modalValidateForm3 = this.fb.group({});
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
    for (let i = 0; i < this.modalFormData2.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData2[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData2[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData2[i].validators.patternStr));
      }

      this.modalValidateForm2.addControl(this.modalFormData2[i].eName, new FormControl(
        {value: '', disabled: this.modalFormData2[i].disabled}, validatorOrOpts
      ));
    }
    for (let i = 0; i < this.modalFormData3.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData3[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData3[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData3[i].validators.patternStr));
      }

      this.modalValidateForm3.addControl(this.modalFormData3[i].eName, new FormControl(
        {value: '', disabled: this.modalFormData3[i].disabled}, validatorOrOpts
      ));
    }

    this.http.post(urls.static, {valueSetCode: 'FFFS'}).then((res: any) => { //获取费用类型
      if (res.success) {
        this.feeArr = res.data.data.data;
      }
    });

    this.getPayChannels();
  }

  listSearch(data: any): void {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.searchData = {...data};
    this.getList(data);
  }

  getList(data: any): void {
    let url = localUrls.payRegGetUrl;
    // let param = {};
    this.listLoading = true;
    this.dataSet = [];
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total || 0;
      }
    });
  }

  updateData(data: any): void {
    this.selectedDataArr = data;
    this.payTheTag = this.selectedDataArr.some(
      res => {
        return res.payTheTag === 'ZFBJ10';
      }
    );
    if (this.payTheTag) {
      this.nz.warning('提示消息', '该请款单已发起在线支付，无法再次申请!');
    }
  }


  btnClick(data: any): void {
    if (data.type.buttonId != 'export' && this.selectedDataArr.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }


    switch (data.type.buttonId) {
      case 'selectDate': {
        // console.log(this.commissionClientName);
        // console.log(this.selectedDataArr);
        if (this.payTheTag) {
          this.nz.warning('提示消息', '该请款单已发起在线支付，无法再次付款登记!');
          return;
        }
        this.modalTitle = '新增付款登记';
        this.modalStatus = 'selectDate';
        this.modalFormData[0].selectArr = this.feeArr;
        // this.selectValue = 'FFFS20';
        this.modalValidateForm.get('payType').setValue('FFFS20');

        let url = localUrls.getAmount;
        let param: any = {};
        let rowidArr = [];
        this.selectedDataArr.forEach(element => {
          rowidArr.push(element.rowid);
        });
        param.rowids = rowidArr.join(',');
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            this.modalFormVisible = true;
            this.commissionClientName = res.data.data.companyName;
            this.carrierCompanyName = this.selectedDataArr[0].carrierCompanyName;
            this.inpData.inpName = res.data.data.companyName;
            this.modalValidateForm.patchValue({
              'priceAmount': res.data.data.totalAmount ? toDemical(res.data.data.totalAmount, 2) : res.data.data.totalAmount,
              'billDate': this.defaultTime(),
              'segmentId': res.data.data.segmentId || '',
              'bankName': res.data.data.bankName || '',
              'bankAccount': this.selectedDataArr[0].bankAccount,
              'payBankName': this.selectedDataArr[0].carrierBankName || '',
              'payBankAccount': this.selectedDataArr[0].carrierAccount,
            });

          }
        });
      }
        break;
      case 'AddPayment': {
        if (this.selectedDataArr.length > 1) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '在线支付只能选择单条数据！'
          });
          this.destroyTplModal();
          return;
        }
        if (this.payTheTag) {
          this.nz.warning('提示消息', '该请款单已发起在线支付，无法再次在线支付!');
          return;
        }
        this.modalTitle = '在线支付';
        // console.log(this.commissionClientName);
        // console.log(this.selectedDataArr);
        // this.modalFormData[0].selectArr = this.feeArr;
        this.modalStatus = 'AddPayment';
        // this.selectValue = 'FFFS20';
        if (this.channelData[0]) {
          this.modalValidateForm2.get('channelId').setValue(this.channelData[0].channelId);
          this.modalValidateForm2.get('remark').setValue(this.channelData[0].remark);
          // this.modalValidateForm2.get('mome').setValue('运费');
          this.channelsChange(this.modalValidateForm2.get('channelId').value);
        }

        this.getAmount();
      }
        break;
      case 'Reject': {
        if (this.selectedDataArr.length > 1) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '驳回只能选择单条数据！'
          });
          this.destroyTplModal();
          return;
        }
        if (this.payTheTag) {
          this.nz.warning('提示消息', '该请款单已发起在线支付，无法驳回!');
          return;
        }

        this.rejectForm.patchValue(this.selectedDataArr[0]);

        this.nm.create(
          {
            nzTitle: '驳回申请',
            nzContent: this.reject,
            nzMaskClosable: false,
            nzOnOk: () => {
              const param = this.rejectForm.getRawValue();
              param.payYfAmount = this.selectedDataArr[0].payYfAmount;
              param.payAmount = this.selectedDataArr[0].payAmount;
              return this.http.post(localUrls.updateReject, param).then(
                res => {
                  if (res.success) {
                    this.nz.success('提示消息', '驳回成功');
                    this.rejectForm.reset();
                    //  this.listSearch({page: 1, length: this.pageSize});
                    this.searchData.page = 1;
                    this.listSearch({...this.searchData});
                  } else {
                    return false;
                  }
                }
              );
            }
          }
        );
      }
        break;
      case 'payBatch': // 批量在线支付
      {

        if (this.selectedDataArr.length === 0) {
          this.nz.warning('提示消息', '请选择数据后操作！');
          return;
        }


        if (this.payTheTag) {
          this.nz.warning('提示消息', '选中数据存在已支付数据，请去除后操作！');
          return;
        }


        if (this.channelData[0]) {
          this.modalValidateForm3.get('channelId').setValue(this.channelData[0].channelId);
          this.modalValidateForm3.get('remark').setValue(this.channelData[0].remark);
          this.batchChannelsChange(this.modalValidateForm3.get('channelId').value);

        }
        this.getSumAmount();
        this.modalTitle = '在线支付（批量）';
        this.modalStatus = 'payBatch';
      }
        break;
      case 'export':
        this.export();
        break;
    }
  }

  handleCancel(): void {
    switch (this.modalStatus) {
      case 'selectDate': {
        this.modalFormVisible = false;
        // this.modalSendData = {};
        this.modalValidateForm.reset();
        this.commissionClientName = '';
        this.status = false;
      }
        break;
      case 'AddPayment': {
        this.modalFormVisible2 = false;
        // this.modalSendData = {};
        this.modalValidateForm2.reset();
        this.commissionClientName = '';
        this.status = false;
      }
        break;
      case 'payBatch': {
        this.modalFormVisible3 = false;
        this.modalValidateForm3.reset();
        // this.status = false;
      }
        break;
    }

    this.modalOkLoading = false;
  }

  handleOk(): void {
    switch (this.modalStatus) {
      case 'selectDate': {
        for (const i in this.modalValidateForm.controls) {
          this.modalValidateForm.controls[i].markAsDirty();
          this.modalValidateForm.controls[i].updateValueAndValidity();
          this.status = !this.inpData.inpName;
        }
        if ('VALID' === this.modalValidateForm.status && !this.status) {
          let obj: any = {paymentNos: []};
          Object.assign(obj, this.modalValidateForm.getRawValue());
          // this.modalValidateForm.value.billDate = this.modalValidateForm.value.billDate && Utils.dateFormat(this.modalValidateForm.value.billDate);
          obj.commissionClientName = this.inpData.inpName || '';
          obj.billDate = obj.billDate instanceof Date ? obj.billDate && Utils.dateFormat(obj.billDate) : obj.billDate;
          for (const selectData of this.selectedDataArr) {
            obj.paymentNos.push(selectData.paymentNo);
          }
          obj.paymentNos = obj.paymentNos.toString();
          let url = localUrls.payRegSaveUrl;
          this.http.post(url, obj).then((res: any) => {
            if (res.success) {
              this.nz.create('success', '提示信息', '增加成功', {nzDuration: 3000});
              this.selectedDataArr = [];
              this.modalValidateForm.reset();
              this.commissionClientName = '';
              this.modalFormVisible = false;
              //  this.listSearch({page: 1, length: this.pageSize});
              this.searchData.page = 1;
              this.listSearch({...this.searchData});
            }
          });
        }
      }
        break;
      case 'AddPayment': {   //在线支付
        //console.log(641)
        if(this.modalValidateForm2.value.channelId=='ZGYT'){
          this.nz.warning('提示消息', '暂未正式开放，请选择-建设银行作为支付方式付款');
          return;
        }

        //console.log(this.modalValidateForm2)
        for (const i in this.modalValidateForm2.controls) {
          this.modalValidateForm2.controls[i].markAsDirty();
          this.modalValidateForm2.controls[i].updateValueAndValidity();
          this.status = !this.inpData.inpName;
        }
        if ('VALID' === this.modalValidateForm2.status && !this.status) {
          this.modalOkLoading = true;
          let obj: any = {rowidList: [], orderList1: [], billDate: this.defaultTime, payType: 'FFFS20'};
          Object.assign(obj, this.modalValidateForm2.getRawValue());
          // this.modalValidateForm.value.billDate = this.modalValidateForm.value.billDate && Utils.dateFormat(this.modalValidateForm.value.billDate);
          obj.commissionClientName = this.inpData.inpName || '';
          obj.billDate = obj.billDate instanceof Date ? obj.billDate && Utils.dateFormat(obj.billDate) : obj.billDate;
          for (const selectData of this.selectedDataArr) {
            obj.rowidList.push(selectData.rowid);
            obj.orderList1.push({paymentNo: selectData.paymentNo});

          }

          let url = localUrls.getOnlinePay;
          this.http.post(url, obj).then((res: any) => {
            this.modalOkLoading = false;
            if (res.success) {
              this.nz.create('success', '提示信息', '在线支付请求成功', {nzDuration: 3000});
              this.selectedDataArr = [];
              this.modalValidateForm2.reset();
              this.commissionClientName = '';
              this.modalFormVisible2 = false;
              // this.listSearch({page: 1, length: this.pageSize});
              this.searchData.page = 1;
              this.listSearch({...this.searchData});
            }
          });
        }
      }
        break;
      case 'payBatch': {   //在线支付批量
        //console.log(this.modalValidateForm3)
        this.modalOkLoading = true;
        this.payBatchRequest();
      }
        break;
    }
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  inpEmit(data: any) {
    this.inpData = data;
    this.status = false;
  }

  getPayChannels(): void {
    this.http.post(urls.getPayChannels, {}).then(
      (res: any) => {
        if (res.success) {
          this.channelData = res.data.data;
        }
      }
    );
  }

  /**
   * 在线支付 支付通道更改
   * @param data
   */
  channelsChange(data: any): void {
    //console.log(data)
    this.channelData.find(
      res => {
        if (res.channelId === data) {
          this.modalValidateForm2.get('remark').setValue(res.remark);
          if (this.modalValidateForm2.get('channelId').value !== 'JSYH' && this.modalValidateForm2.get('channelId').value !== 'HXYH') { //判断 如果为建设银行，华夏银行 要求输入密码
            this.modalFormData2.some(
              res => {
                if (res.eName === 'payPassWord') {
                  res['hidden'] = true;
                  return true;
                } else {
                  return false;
                }
              }
            );
            this.modalValidateForm2.get('payPassWord').reset({value: null, disabled: true});
          } else {
            this.modalFormData2.some(
              res => {
                if (res.eName === 'payPassWord') {
                  res['hidden'] = false;
                  return true;
                } else {
                  return false;
                }
              }
            );
            this.modalValidateForm2.get('payPassWord').reset({value: null, disabled: false});
          }
          return true;
        }
      }
    );
  }

  /**
   * 在线支付汇总金额获取
   */
  getAmount() {
    let url = localUrls.getAmount;
    let param: any = {};
    let rowidArr = [];
    this.selectedDataArr.forEach(element => {
      rowidArr.push(element.rowid);
    });
    param.rowids = rowidArr.join(',');
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.modalFormVisible2 = true;
        this.commissionClientName = res.data.data.companyName;
        this.inpData.inpName = res.data.data.companyName;
        this.modalValidateForm2.patchValue({
          priceAmount: res.data.data.totalAmount ? toDemical(res.data.data.totalAmount, 2) : res.data.data.totalAmount,
          billDate: this.defaultTime(),
          segmentId: res.data.data.segmentId || '',
          mome: res.data.data.mome || '运费',
        });
        this.modalValidateForm2.patchValue({
          bankName: this.selectedDataArr[0].bankName,
          bankAccount: this.selectedDataArr[0].bankAccount,
          carTeam: this.selectedDataArr[0].carTeam || ''
        });
      }
    });
  }

  /**
   * 批量支付金额汇总
   */
  getSumAmount(): void {
    const url = localUrls.getSumAmount;
    const param: any = {orderList1: []};
    this.selectedDataArr.forEach(
      value => param.orderList1.push({paymentNo: value.paymentNo})
    );
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.modalFormVisible3 = true;
          this.modalValidateForm3.get('priceAmount').setValue(res.data.data);
        }
      }
    );
  }

  /**
   * 批量支付
   */
  payBatchRequest(): void {
    const url = localUrls.getOnlinePay;
    const param: any = this.modalValidateForm3.getRawValue();
    //console.log(param)

    if(param.channelId=='ZGYT'){
      this.nz.warning('提示消息', '暂未正式开放，请选择-建设银行作为支付方式付款');
      this.modalOkLoading = false;
      return;
    }
    param.orderList1 = [];
    this.selectedDataArr.forEach(
      res => {
        param.orderList1.push({paymentNo: res.paymentNo});
      }
    );
    this.http.post(url, param).then(
      res => {
        this.modalOkLoading = false;
        if (res.success) {
          this.nz.create('success', '提示信息', '在线支付请求成功', {nzDuration: 3000});
          this.selectedDataArr = [];
          this.modalValidateForm3.reset();
          this.modalFormVisible3 = false;
          // this.listSearch({page: 1, length: this.pageSize});
          this.searchData.page = 1;
          this.listSearch({...this.searchData});
        }
      }
    );
  }

  /**
   * 批量在线支付 支付通道修改
   * @param param
   */
  batchChannelsChange(param: any) {
    //console.log(param)
    this.channelData.find(
      res => {
        if (res.channelId === param) {
          this.modalValidateForm3.get('remark').setValue(res.remark);
          if (this.modalValidateForm3.get('channelId').value !== 'JSYH' && this.modalValidateForm3.get('channelId').value !== 'HXYH') { //判断 如果为建设银行,华夏银行 要求输入密码
            this.modalFormData3.some(
              res => {
                if (res.eName === 'payPassWord') {
                  res['hidden'] = true;
                  return true;
                } else {
                  return false;
                }
              }
            );
            this.modalValidateForm3.get('payPassWord').reset({value: '', disabled: true});
          } else {
            this.modalFormData3.some(
              res => {
                if (res.eName === 'payPassWord') {
                  res['hidden'] = false;
                  return true;
                } else {
                  return false;
                }
              }
            );
            this.modalValidateForm3.get('payPassWord').reset({value: '', disabled: false});
          }
          return true;
        }
      }
    );
  }

  export() {
    let url: any = localUrls.ExportByPayment;
    this.angularHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/xlsx'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `财务付款.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }


  /**
   * 返回当前时间
   */
  defaultTime(): string {
    return Utils.dateFormat(new Date());
  };

}
