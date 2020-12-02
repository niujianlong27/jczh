import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {format as dateformat} from 'date-fns';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '@model/trans-urls';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-outline-agreement',
  templateUrl: './outline-agreement.component.html',
  styleUrls: ['./outline-agreement.component.css']
})
export class OutlineAgreementComponent implements OnInit {
  modalValidateForm: FormGroup;

  order: any = {};
  formId: string = 'form_outline_agreement';
  operateType: string = 'Add';
  pageSource: any;
  itemData: Array<any> = [];
  initRowData = {newRow: true, checked: true};
  popTableData: Array<any> = [];
  updateOrder:any;
  isReturn:boolean = true;
  productionCompanyName:any;  // 生产
  productionCompanyId:any; //
  carrierCompanyId:any; //  承运
  carrierCompanyName:any; //
  consignorCompanyName:any;// 托运
  consignorCompanyId: any;
  modalFormData: Array<any> = [
    {
      name: '合同编号', eName: 'orderNo', type: 'text', require: false, validateCon: '请输入合同编号',
      disabled: true,
      validators: {
        require: false,
        pattern: false,
      }

    },
    {
      name: '签订地点', eName: 'signedSite', type: 'text', require: true, validateCon: '请输入签订地点',
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '签订日期', eName: 'signedDate', type: 'date', require: true, validateCon: '请选择签订日期',
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '生产单位', eName: 'productionCompanyId', type: 'model1', validateCon: '请选择生产单位', require: false,
      findset:{formId:'form_bank_tan',name:'生产单位',parameter:'companyName',parameterSend:'companyId',url:'getCompanyBankThree'},
      // validate: {validateOpt: 'inpValue', validateCon: '请选择生产单位'},
      validators: {
        require: false,
        pattern: false,
      },
      disabled: false

    },
    {
      name: '生产单位地址', eName: 'productionAddress', type: 'text', require: false, validateCon: '请输入生产单位地址',
      disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '生产单位电话', eName: 'productionPhone', type: 'text', require: false, validateCon: '请输入生产单位电话',
      disabled: false,maxLength:'18',
      validators: {
        require: false,
        pattern: false,
        patternStr: '',
        patternErr: '生产单位电话格式输入不正确!',
      }
    },
    {
      name: '托运单位', eName: 'consignorCompanyId', type: 'model2', validateCon: '请选择托运单位', require: true,
      findset:{formId:'settle_company_pop',name:'托运单位',parameter:'settleCompanyName',parameterSend:'settleCompanyId',url:'transSettleCompany'},
      validate: {validateOpt: 'inpValue', validateCon: '请选择托运单位'},
      validators: {
        require: true,
        pattern: false,
      },
      disabled: false

    },
    {
      name: '托运单位地址', eName: 'consignorAddress', type: 'text', require: false, validateCon: '请输入托运单位地址',
      disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '托运人电话', eName: 'consignorPhone', type: 'text', require: false, validateCon: '请输入托运人电话',
      disabled: false,maxLength:'18',
      validators: {
        require: false,
        pattern: false,
        patternStr: '^[0-9]{11,20}$',
        patternErr: '托运人电话格式输入不正确!',
      }
    },
    {
      name: '承运单位', eName: 'carrierCompanyId', type: 'model3', validateCon: '请选择承运单位', require: true,
      findset:{formId:'form_bank_tan',name:'承运单位',parameter:'companyName',parameterSend:'companyId',url:'getCompanyBankThree'},
      validate: {validateOpt: 'inpValue', validateCon: '请选择承运单位'},
      validators: {
        require: true,
        pattern: false,
      },
      disabled: false

    },
    {
      name: '承运单位地址', eName: 'carrierAddress', type: 'text', require: false, validateCon: '请输入承运单位地址',
      disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '承运人电话', eName: 'carrierPhone', type: 'text', require: false, validateCon: '请输入承运人电话',
      disabled: false,maxLength:'18',
      validators: {
        require: false,
        pattern: false,
        patternStr: '^[0-9\-]{0,20}$',
        patternErr: '承运人电话格式输入不正确!',
      }
    },
    {
      name: '有效开始日期', eName: 'validityStartDate', type: 'date', require: true, validateCon: '请选择有效开始日期',
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '有效结束日期', eName: 'validityEndDate', type: 'date', require: true, validateCon: '请选择有效结束日期',
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '保证金', eName: 'cashDeposit', type: 'text', require: false, validateCon: '请输入保证金',
      disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'validityRemark', type: 'text', require: false, validateCon: '请输入备注',
      disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },

  ];


  constructor(
    private http: HttpUtilService,
    private msg: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private nz: NzNotificationService,
    private info: UserinfoService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
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

      this.consignorCompanyName= '江苏驰迅物流有限公司';// 托运
      this.consignorCompanyId ='C000001992';


    }

    // 如果是修改，根据运单号加载该运单数据
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams.operateType) {
        if (queryParams.operateType === 'Update') {
          this.operateType = 'Update';
          this.pageSource = queryParams.source;
          this.updateOrder= queryParams.orderNo;
          this.loadData(queryParams.orderNo);
          this.isReturn = false;
        }
      }
    });
  }

  btnClick(data) {
    switch (data.buttonId) {
      case 'save':
        // if (this.operateType === 'Update') {
        //   this.update();
        // } else if (this.operateType == 'Add') {
          this.insert();
        // }
        break;
      case  'itemAdd':
        this.itemAdd();
        break;
      case  'itemDelete':
        this.itemDelete();
        break;
      case  'deleteAll':
        this.deleteAll();
        break;
      case  'return':
        this.return();
        break;
    }
  }

  insert() {

    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    if (!this.validateWaybill() || !this.validatePack()) {
      return;
    }
    let data = this.modalValidateForm.getRawValue();
    data.cashDeposit = data.cashDeposit ? data.cashDeposit :null;
    this.handleData(data);
    let params = {...data,tOutlineAgreementItemModels:this.itemData};
    this.http.post(TRANS_URLS.saveRecord,params).then((res: any) => {
      if (res.success) {
        this.operateType === 'Update' &&  this.itemData.forEach(item => item.newRow = false);
        this.msg.success(res.data.data);
        //保存成功跳转到查询页面
        this.router.navigate(['/system/trans/order-manage/frameAgreement'], {queryParams: {}});
      }
    });
  }

  update() {
    if (!this.validateWaybill() || !this.validatePack()) {
      return;
    }
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    let data = this.modalValidateForm.getRawValue();
    this.handleData(data);
    let params = {...data,tOutlineAgreementItemModels:this.itemData};

    this.http.post(TRANS_URLS.saveRecord, params).then((res: any) => {
      if (res.success) {
        // 保存成功将新行标记置为false
        this.msg.success('修改成功');
        //保存成功跳转到查询页面
        let url = '/system/trans/order-manage/frameAgreement';
        this.router.navigate([url], {queryParams: {}});

      }
    });
  }

  itemAdd() {
    const rowIndex = this.itemData.length == 0 ? 1 : this.itemData[this.itemData.length - 1].itemRowindex;
    this.itemData = [...this.itemData, {...this.initRowData, itemRowindex: rowIndex}];
    this.setPopTableData({});
  }

  itemDelete() {
    if (this.itemData.filter(item => item.checked).length == 0) {
      this.msg.warning('请至少选择一条委托信息');
      return;
    }
    let deleteIndex = 0;
    this.itemData.forEach(item => item.checked ? this.popTableData.splice(deleteIndex, 1) : deleteIndex++);
    this.itemData = this.itemData.filter(item => !item.checked);

  }

  deleteAll() {
    if (!this.itemData || this.itemData.length == 0) {
      this.msg.warning('无委托明细信息！');
      return;
    }
    this.itemData = [];

  }

  setCompanyId(data: any, fieldName: string, fieldTextName?: string) {
    this.modalValidateForm.get(fieldName).setValue( data.inpValue);
    if (fieldName === 'productionCompanyId') { // 生产方
      this.productionCompanyName = data.inpName;
      this.productionCompanyId = data.selData && data.selData[0] && data.selData[0].companyId || '';
      this.modalValidateForm.get('productionPhone').setValue(data.selData && data.selData[0] && data.selData[0].telphone || '');
      this.modalValidateForm.get('productionAddress').setValue( data.selData && data.selData[0] && data.selData[0].address || '');
    }
    if (fieldName === 'carrierCompanyId') { // 承运
      this.carrierCompanyName = data.inpName;
      this.carrierCompanyId = data.selData && data.selData[0] && data.selData[0].companyId || '';
      this.modalValidateForm.get('carrierPhone').setValue(data.selData && data.selData[0] && data.selData[0].telphone || '');
      this.modalValidateForm.get('carrierAddress').setValue( data.selData && data.selData[0] && data.selData[0].address || '');

    }
    if (fieldName == 'consignorCompanyId') { // 托运
      // this.order.consignorCompanyId = data.selData && data.selData[0] && data.selData[0].companyId || '';
      this.consignorCompanyName = data.inpName;
      this.modalValidateForm.get('consignorPhone').setValue(data.selData && data.selData[0] && data.selData[0].telphone || '');
      this.modalValidateForm.get('consignorAddress').setValue( data.selData && data.selData[0] && data.selData[0].address || '');
    }
  }

  return(){
      this.router.navigate(['/system/trans/order-manage/frameAgreement'], {queryParams: {}})
   }


  /**
   * 设置pop选择相关信息
   * @param item
   */
  setPopTableData(item: any) {
  }



  /**
   * 加载运单主表、捆包表、司机表数据
   * @param waybillNo
   */
  loadData(orderNo: string) {
    if (!orderNo) {
      this.msg.error('系统错误！合同号为空！');
    }
    this.query(orderNo); // 查询合同信息
  }

  /**
   * 运单查询
   */
  query(orderNo: string) {
    this.http.post(TRANS_URLS.selectAllByNo, {orderNo: orderNo}).then(
      (res: any) => {
        if (res.success) {
          this.order = res.data.data && res.data.data[0] || {};
          this.productionCompanyName = this.order.productionCompanyName;
          this.productionCompanyId = this.order.productionCompanyId;
          this.carrierCompanyId = this.order.carrierCompanyId;
          this.carrierCompanyName = this.order.carrierCompanyName;
          this.consignorCompanyName = this.order.consignorCompanyName;
          this.consignorCompanyId = this.order.consignorCompanyId;
          this.itemData = this.order.tOutlineAgreementItemModels;
          this.itemData.forEach((item, index) => (item.rowIndex = index + 1,item.checked = true));
          this.modalValidateForm.patchValue(this.order)
        }
      }
    );
  }

  /**
   *
   */
  validateWaybill(): boolean {
    const validateArray = [
      {ename: 'signedSite', cname: '签订地点'},
      {ename: 'signedDate', cname: '签订日期'},
      {ename: 'consignorCompanyId', cname: '托运单位'},
      {ename: 'carrierCompanyId', cname: '承运单位'},
      {ename: 'validityStartDate', cname: '有效开始时间'},
      {ename: 'validityEndDate', cname: '有效结束时间'},
    ];
  // const msg = validateArray.filter(item => !this.order[item.ename]).map(item => item.cname).join('","');
  //   if (msg) {
  //     this.msg.error(`合同主信息"${msg}"字段不能为空！`);
  //     return false;
  //   }
    if (this.itemData.length == 0) {
      this.msg.error(`捆包明细不能为空！`);
      return;
    }

    return true;
  }

  // 捆包信息验证
  validatePack(): boolean {
    const validateArray = [
      // {ename: 'prePackWeight', cname: '重量', validator: 'number'},
      // {ename: 'prePackSheet', cname: '件数', validator: 'number'},
    ];

    let errArr = validateArray.filter(f => this.itemData.some(item => !item[f.ename]));
    if (errArr.length > 0) {
      this.msg.error(`捆包信息"${errArr.map(item => item.cname).join(',')}"不能为空！`);
      return false;
    }
    errArr = validateArray.filter(f => f.validator === 'number').filter(f => this.itemData.some(item => isNaN(item[f.ename])));
    if (errArr.length > 0) {
      this.msg.error(`捆包信息"${errArr.map(item => item.cname).join(',')}"必须为数字！`);
      return false;
    }
    return true;
  }

  /**
   * 提交后台前处理数据
   */
  handleData(data) {
    data.signedDate = data.signedDate && dateformat(data.signedDate, 'YYYY-MM-DD HH:mm:ss');
    data.validityStartDate = data.validityStartDate && dateformat(data.validityStartDate, 'YYYY-MM-DD HH:mm:ss');
    data.validityEndDate = data.validityEndDate && dateformat(data.validityEndDate, 'YYYY-MM-DD HH:mm:ss');
  }


}
