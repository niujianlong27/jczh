import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {TRANS_URLS} from '@model/trans-urls';
import {localUrls} from '@model/localUrls';
import {UploadFiles} from '@service/upload-files';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ImgViewerService} from '@component/img-viewer/img-viewer';
import {Utils} from '@util/utils';
import {format} from 'date-fns';
import {trackUrl} from '@model/trackUrl';
import {Router} from '@angular/router';

declare var JSONH: any;

@Component({
  selector: 'app-waybill-ledger',
  templateUrl: './waybill-ledger.component.html',
  styleUrls: ['./waybill-ledger.component.css']
})
export class WaybillLedgerComponent implements OnInit {
  modalValidateForm: FormGroup;
  modalFormVisible = false; //  表单弹窗
  listLoading = false;
  modalTitle: string; // 弹窗标题
  showExplainFlag = false;
  dataSet: any = [];
  updateData: any = []; // 选中的数据
  totalPages = 0;
  pageSize = 30;
  searchData: any;
  selectList: Array<any> = [];
  carrierCompanyId: any;
  carrierCompanyName: any = '';
  private tplModal: NzModalRef;
  resData: any;
  public returnPicList: any[] = []; // 返单图片
  static: any;
  modalFormData: any;
  istrue = true;
  totalWeight: any = 0; // 总重量
  totalNum: any = 0; // 应收总金额
  totalPayNum: any = 0; // 应付总金额

  @ViewChild('fileInput') fileInput: ElementRef;

  updateConsigneeFindset = {
    url: 'selectCompanyList',
    formId: 'company_pop',
    name: '客户名称',
    parameter: 'companyName', // 发送请求的参数
  };
  consigneeCompanyId = '';
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
  @ViewChild('tplTitle1') tplTitle1;
  @ViewChild('tplContent1') tplContent1;
  @ViewChild('tplFooter1') tplFooter1;
  validateForm: FormGroup;
  implistLoading1: boolean;


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
  private importFile: any;
  private columnsArr: any = [{colCname: '物料', colEname: 'productName'},
    {colCname: '收货方', colEname: 'consignorCompanyName'},
    {colCname: '起运地', colEname: 'startPoint'},
    {colCname: '目的地', colEname: 'detailAddress'},
    {colCname: '结算单号', colEname: 'saleNo'},
    {colCname: '承运数量', colEname: 'preTotalWeight'},
    {colCname: '应收单价', colEname: 'rcvUnitPrice'},
    {colCname: '应收账款（含税）', colEname: 'rcvTransFee'},
    {colCname: '承运车队', colEname: 'carrierCompanyName'},
    {colCname: '车号', colEname: 'travelNo'},
    {colCname: '承运方', colEname: 'driverName'},
    {colCname: '含税单价', colEname: 'unitPrice'},
    {colCname: '含税金额', colEname: 'transFee'},
    {colCname: '备注', colEname: 'remark'},
    {colCname: '发货单号', colEname: 'mainProductListNo'},
    {colCname: '年', colEname: 'loadY'},
    {colCname: '月', colEname: 'loadM'},
    {colCname: '日', colEname: 'loadD'},
    {colCname: '销售日期', colEname: 'saleTime'},];

  private old_data: any;

  constructor(private http: HttpUtilService,
              private nzMess: NzNotificationService,
              private nzMessage: NzMessageService,
              private nm: NzModalService,
              private msg: NzMessageService,
              private imgService: ImgViewerService,
              private xlsx: XlsxService,
              public upload: UploadFiles,
              private ngHttp: HttpClient,
              public router: Router,
              private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});

    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.retrunData ? this.retrunData : [];

    this.modalValidateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      const validatorOrOpts: Array<any> = [];
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
    this.totalPayNum = 0;
    const url = TRANS_URLS.getWaybillcd;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data.total ? res.data.data.total : 0;

        this.dataSet.forEach(item => {
          if (Number(item.preTotalWeight) !== Number(item.sjgbsl)) {
            item._bgColor = '#DC3638';
            item.font_color = 'multi'; // 字体颜色
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
      case 'Generate': // 生成
        this.Generate();
        break;
      case 'Match':
        this.Match(); // 价格匹配
        break;
      case 'import':
        this.import(); // 导入
        break;
      case 'updateWaybillWeight': { // 修改运单重量
        this.btnUpdateWaybillWeight();
      }
        break;
      case 'updateConsignee': { // 修改收货单位
        this.btnUpdateConsignee();
      }
        break;
      default:
        this.msg.warning('按钮没有绑定方法！');
        break;
    }
  }

  export() {  // 导出
    const url = TRANS_URLS.exportWaybillParameter;
    this.ngHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      const blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单台账.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  Update() {
    if (!this.selectList || this.selectList.length != 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      return;
    }

    this.router.navigate(['/system/trans/waybill-manage/waybill-add'], {
      queryParams: {
        'operateType': 'update',
        'source': 'ledger',
        'waybillNo': this.selectList[0].waybillNo
      }
    });
  }

  selectData(data) {
    this.selectList = data;
    this.totalWeight = this.selectList.map(item => item.preTotalWeight).reduce((acc, cur) => this.isNum(acc) + this.isNum(cur), 0);
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
    const params = {};
    params['waybillList'] = this.selectList.map(item => {
      return {
        waybillNo: item.waybillNo
      };
    });
    this.nm.confirm(
      {
        nzTitle: '提示消息',
        nzContent: '是否确认生成结算单?',
        nzOnOk: () => {
          const url = localUrls.save;
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
    const tWaybills = [];
    for (let i = 0, len = this.selectList.length; i < len; i++) {
      tWaybills.push(
        {
          waybillNo: this.selectList[i].waybillNo,
          orderNo: this.selectList[i].orderNo
        }
      );
    }
    const url = localUrls.matchingWaybill;

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
    this.modalTitle = '运单台账 > 返单';
    this.modalFormData = this.retrunData;
    this.modalValidateForm = this.fb.group({});
    this.returnPicList = [];
    for (const control of this.modalFormData) {
      const validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));

    }
    this.modalValidateForm && this.modalValidateForm.reset();
    this.static = 'return';
    const waybill = this.selectList[0];
    const data = {};
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
    const params = this.modalValidateForm.getRawValue();
    if (this.static == 'return') {
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

  // 图片查看
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
    const url = TRANS_URLS.updateWaybillBySettleWeightV2;
    const param: any = {tWaybills: []};
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
      nzTitle: '运单台账>修改收货单位',
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
    if (param.selData && param.selData[0]) {
      this.consigneeCompanyId = param.selData[0].companyId;
    } else {
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

  import() {
    this.validateForm = this.fb.group({});
    this.modalFormDataImport.forEach(item => {
      const validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading1 = false;
    this.modalTitle = '运单台账>导入';
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle1,
      nzContent: this.tplContent1,
      nzFooter: this.tplFooter1,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false,

    });
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  fileChange(file: any) {
    this.importFile = file.target.files[0];
    // console.log(this.importFile);
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});

  }

  handleCancel1() {
    this.tplModal.destroy();
    this.validateForm.reset();
  }

  importConfirm() {
    // tslint:disable-next-line:forin
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
    // const headTemplate =
    //   ['进厂日期', '供货客户', '车号', '磅单重量', '供货地城市', '客户单价', '收款金额', '车队单价', '车队裸价运费', '承运单位', '品名', '备注', '业务'];

    this.xlsx.import(this.importFile, true).then((data: any) => {

      const keys = Object.keys(data);
      // _data.push( data[keys[i]]);

      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error('提示信息', '未读取到sheet页');
        this.implistLoading1 = false;
        return;
      }

      this.old_data = _data;
      const headArr: any = _data && _data[0] || [];
      // if (!this.validateHead(headTemplate, headArr)) {
      //   this.nzMess.remove();
      //   this.nzMess.error('提示信息', `模板不正确，请下载正确模板`);
      //   return;
      // }
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
      console.log(dataList)
      this.excelFilter(dataList);
    });
  }

  trim(str) {
    if (str == null) {
      str = '';
    }
    return str.replace(/(^\s*)|(\s*$)/g, '');
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

  patchEname(cName: any) {

    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() === cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
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
    console.log(param)
    // param.forEach(item => {
    //   const x: any = {};
    //   x.travelNo = item.travelNo;
    //   x.preTotalWeight = item.preTotalWeight;
    //   x.loadDate = format(item.loadDate, 'YYYY-MM-DD');
    //   x.endPoint = item.endPoint;
    //   x.rcvUnitPrice = item.rcvUnitPrice;
    //   x.rcvTranssFee = item.rcvTranssFee;
    //   x.unitPrice = item.unitPrice;
    //   x.transFee = item.transFee;
    //   x.carrierCompanyName = item.carrierCompanyName;
    //   x.produceName = item.produceName;
    //   x.remark = item.remark;
    //   count.push(x);
    // });
    const url = TRANS_URLS.importWaybillExcel;
    this.http.post(url, {'tWaybillModels': param}).then(res => {
      if (res.success) {
        this.nzMess.create('success', '提示信息', res.data.msg, {nzDuration: 3000});
        this.tplModal.destroy();
        this.listSearch({page: 1, length: this.pageSize});
      }
      this.implistLoading1 = false;
    });


  }

  validateData(data: any): boolean {
    // 验证表头合同号必须存在
    let count: any;
    let excelHeader: any = data && data[0] || [];
    let opt = ['司机名称', '联系电话', '车牌号', '托运人', '业务执行时间', '起始地', '目的地省', '目的地市', '品名', '重量'];
    let tipMess = [];
    for (let j = 0; j < opt.length; j++) {
      let op = opt[j];
      if (excelHeader.indexOf(op) < 0) {
        tipMess.push(op);
      } else {
        // 验证必填字段不能为空
        for (let i = 1; i < data.length; i++) {
          count = this.old_data.indexOf(data[i]);
          let index = excelHeader.indexOf(op);
          if (!data[i][index] || data[i][index] == '' || data[i][index] == undefined || data[i][index] == null) {
            this.nzMess.remove();
            this.nzMess.error('提示信息', `必填字段“${op}”在行号为${count + 1}处为空！`);
            return false;
          }
        }

      }
    }
  }

  aClick() {
    window.location.href = 'https://another2.oss-cn-hangzhou.aliyuncs.com/import/%E8%BF%90%E5%8D%95%E5%8F%B0%E8%B4%A6%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx';
  }


}
