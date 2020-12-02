import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {TRANS_URLS} from '@model/trans-urls';
import {localUrls} from '@model/localUrls';
import {UploadFiles} from '@service/upload-files';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ImgViewerService} from '@component/img-viewer/img-viewer';

declare var JSONH: any;

@Component({
  selector: 'app-sales-settlement-ledger',
  templateUrl: './sales-settlement-ledger.component.html',
  styleUrls:['./sales-settlement-ledger.component.css']
})
export class SalesSettlementLedgerComponent implements OnInit {
  modalValidateForm: FormGroup;
  modalFormVisible: boolean = false; //  表单弹窗
  listLoading: boolean = false;
  modalTitle: string; //弹窗标题
  showExplainFlag: boolean = false;
  dataSet: any = [];
  updateData: any = [];//选中的数据
  totalPages: number = 0;
  pageSize: number = 30;
  searchData: any;
  selectList: Array<any> = [];
  carrierCompanyId: any;
  carrierCompanyName: any = '';
  private tplModal: NzModalRef;
  resData: any;
  public returnPicList: any[] = []; // 返单图片
  static: any;
  modalFormData: any;
  istrue: boolean = true;
  totalWeight:any = 0; //总重量
  totalNum:any = 0; // 应收总金额
  totalPayNum:any = 0; // 应付总金额

  updateConsigneeFindset = {
    url: 'selectCompanyList',
    formId: 'company_pop',
    name: '客户名称',
    parameter: 'companyName', // 发送请求的参数
  };
  consigneeCompanyId: string = '';

  updataFormData: Array<any> = [
    {
      name: '运单号', eName: 'waybillNo', type: 'text', require: false, validateCon: '请输入运单号',
      disabled: true,
      validators: {
        require: false,
        pattern: false,
      }

    },
    {
      name: '发货通知单号', eName: 'mainProductListNo', type: 'text', require: false, validateCon: '请输入发货通知单号',
      disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '卸点', eName: 'endLocationName', type: 'text', require: false, validateCon: '请输入卸点',
      disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '客户名称', eName: 'carrierCompanyId', type: 'model', validateCon: '请选择客户', require: false,
      findset: {
        formId: 'company_pop',
        name: '客户名称',
        parameter: 'companyName', // 发送请求的参数
        parameterSend: 'companyId',
      },
      validate: {validateOpt: 'inpValue', validateCon: '请选择客户'},
      validators: {
        require: true,
        pattern: false,
      },
      disabled: true

    },
    {
      name: '结算重量', eName: 'sjgbsl', type: 'number', require: false, validateCon: '请输入结算重量',
      disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '承运重量', eName: 'preTotalWeight', type: 'number', require: true, validateCon: '请输入承运重量',
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    }

  ];

  retrunData: Array<any> = [
    {
      name: '件数', eName: 'totalSheet', type: 'text', require: false, validateCon: '请输入件数',
      disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '重量', eName: 'totalWeight', type: 'text', require: false, validateCon: '请输入重量',
      disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '上传返单图片', eName: 'returnPic', type: 'pic', require: true, validateCon: '请上传返单图片',
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
  ];

  @ViewChild('updateConsigneeRef') updateConsigneeRef: TemplateRef<any>;


  constructor(private http: HttpUtilService,
              private nzMess: NzNotificationService,
              private nm: NzModalService,
              private msg: NzMessageService,
              private imgService: ImgViewerService,
              private xlsx: XlsxService,
              public upload: UploadFiles,
              private ngHttp: HttpClient,
              private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});

    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.updataFormData ? this.updataFormData : [];

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

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  getList(data: any): void {
    this.searchData = {...data};
    this.totalWeight = 0;
    this.totalNum = 0;
    this.totalPayNum= 0;
    let url = TRANS_URLS.getOrderHdWaybill;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data.total ? res.data.data.total : 0;

        this.dataSet.forEach(item => {
          if (Number(item.preTotalWeight) !== Number(item.sjgbsl)) {
            item._bgColor = '#DC3638';
            item.font_color = 'multi'; //字体颜色
          } else {
            item.font_color = '';
          }
        });

      }
    });
  }

  btnClick(data: any): void {
    this.static = '';
    switch (data.buttonId) {
      case 'Export':
        this.export();
        break;
      case 'update':
        this.Update();
        break;
      case 'waybillReturn':
        this.waybillReturn(); // 返单
        break;
      case 'Generate': //生成
        this.Generate();
        break;
      case 'Match':
        this.Match(); // 价格匹配
        break;

      case 'updateWaybillWeight': { //修改运单重量
        this.btnUpdateWaybillWeight();
      }
        break;
      case 'updateConsignee': { //修改收货单位
        this.btnUpdateConsignee();
      }
        break;
      default:
        this.msg.warning('按钮没有绑定方法！');
        break;
    }
  }

  export() {  //导出
    let url = TRANS_URLS.exportWaybillSales;
    this.ngHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `销售结算单台账.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  Update() {
    this.static = 'update';
    if (!this.selectList || this.selectList.length != 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      return;
    }
    this.modalFormData = this.updataFormData ? this.updataFormData : [];
    this.modalValidateForm = this.fb.group({});

    for (const control of this.modalFormData) {
      let validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));

    }

    this.modalFormVisible = true;
    this.modalTitle = '销售结算单台账 > 修改';
    this.carrierCompanyName = this.selectList[0].carrierCompanyName;
    this.modalValidateForm.patchValue(this.selectList[0]);


    this.modalValidateForm.get('mainProductListNo').setValue(this.selectList[0].mainProductListNo);
    this.modalValidateForm.get('endLocationName').setValue(this.selectList[0].endLocationName);
    this.modalValidateForm.get('waybillNo').setValue(this.selectList[0].waybillNo);
    this.modalValidateForm.get('sjgbsl').setValue(this.selectList[0].sjgbsl);

  }

  selectData(data) {
    this.selectList = data;
    this.totalWeight = this.selectList.map(item => item.sjgbsl).reduce((acc, cur) => this.isNum(acc) + this.isNum(cur), 0);
    this.totalNum = this.selectList.map(item => item.rcvTransFee).reduce((acc, cur) => this.isNum(acc) + this.isNum(cur), 0);
    this.totalPayNum = this.selectList.map(item => item.transFee).reduce((acc, cur) => this.isNum(acc) + this.isNum(cur), 0);

  }

  handleCancel(): void {
    this.modalFormVisible = false;
    this.modalValidateForm.reset();
  }

  Generate() {
    if (!this.selectList || this.selectList.length === 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请至少选择一条数据进行操作！'
      });
      return;
    }
    let params = {waybillList: []};
    this.selectList.forEach(item => {
       const arr = item.waybillNo && item.waybillNo.split(",").map(x => ({waybillNo: x})) || [];
                 params.waybillList.push(...arr);
    });
    this.nm.confirm(
      {
        nzTitle: '提示消息',
        nzContent: '是否确认生成结算单?',
        nzOnOk: () => {
          let url = localUrls.save;
          this.http.post(url, params).then((res: any) => {
            if (res.success) {
              this.nzMess.success('提示消息', res.data.msg);
              this.getList(this.searchData);
            }
          });
        }
      }
    );

  }

  Match() {
    if (!this.selectList || this.selectList.length === 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请至少选择一条数据进行操作！'
      });
      return;
    }
    let tWaybills = [];
    for (let i = 0, len = this.selectList.length; i < len; i++) {
      tWaybills.push(
        {
          waybillNo: this.selectList[i].waybillNo,
          orderNo: this.selectList[i].orderNo
        }
      );
    }
    let url = localUrls.matchingWaybill;

    this.nm.confirm({
      nzTitle: '价格匹配',
      nzContent: '<p class="m-re">是否要将选中的数据进行价格匹配?</p>',
      nzOnOk: () => new Promise((resolve, reject) => {
        this.http.post(url, {tWaybills: tWaybills}).then(
          (res: any) => {
            if (res.success) {
              resolve();
              this.nzMess.success('提示消息', res.data.data);
              this.selectList = [];
              this.listSearch(this.searchData);
            } else {
              reject();
            }
          }
        );
      })
    });
  }

  waybillReturn() {
    if (!this.selectList || this.selectList.length != 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行返单！'
      });
      return;
    }

    this.modalFormVisible = true;
    this.modalTitle = '销售结算单台账 > 返单';
    this.modalFormData = this.retrunData;
    this.modalValidateForm = this.fb.group({});
    this.returnPicList = [];
    for (const control of this.modalFormData) {
      let validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));

    }
    this.modalValidateForm && this.modalValidateForm.reset();
    this.static = 'return';
    const waybill = this.selectList[0];
    let data = {};
    data['waybillNo'] = waybill.waybillNo;
    this.http.post(TRANS_URLS.waybillReturnV4, {...data, companyId: waybill.companyId}).then((res): any => {
      if (res.success) {
        this.resData = res.data.data;
        this.modalValidateForm.patchValue(res.data.data || {});
        const pics = this.resData.returnPic && this.resData.returnPic.split(';') || [];
        this.returnPicList = pics.map((x: string, i: number) => ({url: x, status: 'done', uid: i}));
        this.modalValidateForm.get('returnPic').setValue(pics.join(','));
        this.modalValidateForm.get('totalSheet').setValue(this.resData.returnSheet);
        this.modalValidateForm.get('totalWeight').setValue(this.resData.returnTotalWeight);
        this.carrierCompanyName = waybill.carrierCompanyName;

      }
    });

  }

  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    let params = this.modalValidateForm.getRawValue();
    if (this.static == 'update') {
      params.carrierCompanyId = this.selectList[0].carrierCompanyId;
      let url = TRANS_URLS.updateByNo;
      this.http.post(url, params).then((res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.modalFormVisible = false;
          this.msg.success('修改成功！');
          this.getList(this.searchData);
        }
      });
    } else if (this.static == 'return') {
      if (!this.istrue) {
        this.nzMess.warning('提示消息', '上传文件中包含非图片的文件，请重新选择！');
        return;
      }

      this.resData && this.resData.returnSheet && this.modalValidateForm.get('totalSheet').setValue(this.resData.returnSheet);
      this.resData && this.resData.returnTotalWeight && this.modalValidateForm.get('totalWeight').setValue(this.resData.returnTotalWeight);
      const pics = this.returnPicList.map(x => x.originFileObj && x.originFileObj.url || x.url).join(';');
      this.http.post(TRANS_URLS.RETURN_WAYBILL, {...this.selectList[0], ...this.modalValidateForm.value, returnPic: pics}).then(
        (res: any) => {
          if (res.success) {
            this.nzMess.success('提示消息', '返单操作成功！');
            this.getList(this.searchData);
            this.modalFormVisible = false;
          }
        }
      );
    }

  }

  //图片查看
  handlePreview = (file: UploadFile) => {
    this.imgService.viewer({url: file.url || file.thumbUrl});
  };

  /**
   * 返单
   */
  handleChange(data: any) {
    if (data.type == 'success') {
      this.istrue = true;
      data.fileList.forEach(item => {
        if (this.istrue && item.type && item.type.indexOf('image') === -1) {
          this.istrue = false;
        }
      });
    }

    const pics = this.returnPicList.map(x => {
      if (x.status === 'done') {
        return x.originFileObj && x.originFileObj.url || x.url;
      }
    }).join(';');

    this.modalValidateForm.get('returnPic').setValue(pics || '');
    this.modalValidateForm.get('returnPic').markAsDirty();
    this.modalValidateForm.get('returnPic').updateValueAndValidity();
  }

  /**
   * 修改运单重量
   */
  btnUpdateWaybillWeight(): void {
    if (this.selectList.length === 0) {
      this.msg.warning('请选择数据后操作!');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认修改选择的运单重量?',
      nzOnOk: () => this.updateWaybillWeightRequest()
    });
  }

  /**
   * 修改运单重量
   */
  updateWaybillWeightRequest(): Promise<any> {
    const url = TRANS_URLS.updateWaybillBySettleWeight;
    const param: any = {tWaybills: []};
    this.selectList.forEach(
      value =>
        param.tWaybills.push({
          waybillNo: value.waybillNo,
          mainProductListNo: value.mainProductListNo,
          companyId: value.companyId
        })
    );
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nzMess.success('提示消息', '修改运单重量成功！');
          this.selectList = [];
          this.listSearch(this.searchData);
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 修改收货单位
   */
  btnUpdateConsignee(): void {
    if (this.selectList.length === 0) {
      this.msg.warning('请选择数据后操作!');
      return;
    }
    this.nm.create({
      nzTitle: '销售结算单台账>修改收货单位',
      nzContent: this.updateConsigneeRef,
      nzOnOk: () => this.updateConsigneeRequest()
    }).afterClose.subscribe(() => {
      this.consigneeCompanyId = '';
    });
  }

  /**
   * 修改收货单位
   */
  updateConsigneeRequest(): Promise<any> | boolean {
    if (!this.consigneeCompanyId) {
      this.msg.warning('请选择收货单位后操作!');
      return false;
    }
    const url = TRANS_URLS.updateWaybillConsignee;
    const param: any = {
      tWaybills: [],
      consigneeCompanyId: this.consigneeCompanyId
    };
    this.selectList.forEach(
      value =>
        param.tWaybills.push({
          waybillNo: value.waybillNo,
          companyId: value.companyId
        })
    );
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nzMess.success('提示消息', '修改收货单位成功！');
          this.selectList = [];
          this.listSearch(this.searchData);
        } else {
          return false;
        }
      }
    );
  }

  inpEmit(param: any): void {
    if (param.selData && param.selData[0]){
      this.consigneeCompanyId =param.selData[0].companyId
    }else {
      this.consigneeCompanyId = '';
    }
  }

  isNum(data) { // 判断数字
    if (isNaN(data)) {
      return 0;
    } else {
      return Number(data);
    }
  }

}
