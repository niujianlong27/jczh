import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzNotificationService, NzModalService, NzMessageService, UploadFile} from 'ng-zorro-antd';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';
import {Utils} from '@util/utils';
import {NumberFormat} from 'xlsx';
import {TRANS_URLS} from '@model/trans-urls';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {HttpClient} from '@angular/common/http';
import {isPosNum} from '@validator/validator';
import {toDemical} from '@validator/validator';
import {format} from "date-fns";
import {UserinfoService} from '@service/userinfo-service.service';
import {localUrls} from '@model/localUrls';
import {ImgViewerService} from '@component/img-viewer/img-viewer';


@Component({
  selector: 'app-trans-fee',
  templateUrl: './trans-fee.component.html',
  styleUrls: ['./trans-fee.component.css']
})
export class TransFeeComponent implements OnInit {
  tplModal: NzModalRef;
  listLoading: boolean = false;
  implistLoading: boolean = false; //导入确定加载
  dataSet: any = [];
  updateData: any = [];//选中的数据
  totalPages: number = 0;
  pageSize: number = 30;
  selectedList: any = [];
  deepSelectList: any = [];
  lists: any;
  searchData: any; //查询条件
  allTotalPrice: number = 0; // 应收总价
  allPayTotalPrice: number = 0; // 应付总价
  allTotalWeight: number = 0; // 重量
  validateForm: FormGroup; // 导入弹框
  importFile: any;
  columnsArr: any; // table表头数据
  formValidate: FormGroup;
  modalObj: any = { // 弹框相关
    visible: false,
    loading: false,
    title: null,
    data: []
  };
  @ViewChild('copyPriceModal') copyPriceModal: TemplateRef<any>;


  modalFormData: Array<any> = [
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请选择文件', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请选择文件', require: false, hidden: true,
      validators: {
        require: false,
        pattern: false
      }
    }
  ];

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

  @ViewChild('updateConsigneeRef') updateConsigneeRef: TemplateRef<any>;
  @ViewChild('tplTitle1') tplTitle1;
  @ViewChild('tplContent1') tplContent1;
  @ViewChild('tplFooter1') tplFooter1;
  @ViewChild('excelFileInput') excelFileInput: ElementRef;
  validateFormForm: FormGroup;
  implistLoading1: boolean;

  private importFileFile: any;
  private columnsArrArray: any = [];
  private old_data: any;


  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  private modalTitle: string;

  businessType: string;
  radioValue = '10';
  addPrice: number;
  choiceType = 'waybill';
  linePrice: number;
  private modalRef: NzModalRef;
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  @ViewChild('urlImg') urlImg: TemplateRef<any>;

  constructor(private http: HttpUtilService,
              private nm: NzModalService,
              private msg: NzMessageService,
              private nzMess: NzNotificationService,
              private nzMessage: NzMessageService,
              private fb: FormBuilder,
              private imgService: ImgViewerService,
              private ngHttp: HttpClient,
              private xlsx: XlsxService,
              private nn: NzNotificationService,
              private info: UserinfoService,
  ) {
  }

  ngOnInit() {
    let companyid = this.info.APPINFO.USER.companyId;
    this.listSearch({page: 1, length: this.pageSize});
  }

  //图片查看
  handlePreview = (file: UploadFile) => {
    this.imgService.viewer({url: file.url || file.thumbUrl});
  };

  getView(e: MouseEvent, data: string, item: any) {
    e.preventDefault();
    e.stopPropagation();
    this.dataSet.forEach((x: any) => x._bgColor = '');
    item._bgColor = '#a8b6ba';
    if (data) {
      const urls = data.split(';');
      this.imgService.viewer({url: urls});
    }
  }


  listSearch(data: any) {  // 查询页码处理
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  getList(data: any): void {  // 查询
    this.selectedList = [];
    this.allTotalPrice = 0;
    this.allPayTotalPrice = 0;
    this.allTotalWeight = 0;
    this.searchData = {...data};
    let url = urls.getWaybillFeeList;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total;
        this.dataSet.forEach((item, index) => {
          item.rowIndex = index + 1;
          item.editstate = 0;

        });
        this.lists = Utils.deepCopy(this.dataSet);

      }
    });
  }

  userColumnsEmit(data: any): void { // 获取表头数据
    this.columnsArr = data;
    const url = data.filter((x: any) => x.type === 'url');
    url[0].tdTemplate = this.urlImg;
  }

  btnClick(data: any): void {
    console.log(data.buttonId);
    switch (data.buttonId) {
      case 'Update': //修改
        this.update();
        break;
      case 'UpdateConsignee': // 修改客户
        this.UpdateConsignee();
        break;
      case 'UpdateImport': //导入
        this.import();
        break;
      case 'Export': //导出
        this.export();
        break;
      case 'Import':
        this.importExcel();
        break;
      case 'copyPrice'://价格匹配
        this.copyPrice();
        break;
      case 'paymentRequest'://付款申请
        this.paymentRequest();
        break;
      case 'UpdateIsEffect'://结算单生效
        this.updateIsEffect();
        break;
      case 'template':{
        this.btnTemplate();
      }
        break;

      default:
        break;
    }
  }

  /**
   * 价格匹配
   */
  copyPrice() {
    this.addPrice = null;
    this.choiceType = 'waybill';
    if (!this.selectedList[0]) {
      this.msg.error('请选择数据再操作!');
      return;
    }
    const businessTypeName = this.selectedList.every((x: any) => x.businessTypeName === this.selectedList[0].businessTypeName);
    if (!businessTypeName) {
      this.msg.error('请选择统一业务板块的运单!');
      return;
    }
    this.businessType = '009';
    this.radioValue = this.businessType === '009' ? '50' : '10';
    this.modalRef = this.nm.create({
      nzTitle: '结算单修改 > 价格匹配',
      nzMaskClosable: false,
      nzContent: this.copyPriceModal,
      nzOnOk: () => {
        return this.settleV2CheckRequest().then(
          value => {
            if (value) {
              if (this.radioValue == '70' && (!this.addPrice || this.addPrice <= 0)) {
                this.nm.error({
                  nzTitle: '提示信息',
                  nzContent: '总价录入必填且要大于0!'
                });
                return false;
              }
              this.businessType === '009' && this.rizhaoCopyPriceResult();
              return false;
            } else {
              return false;
            }
          }
        );
      }
    });
  }

  /**
   * 价格匹配前检查
   */
  settleV2CheckRequest(): Promise<boolean> {
    const url = localUrls.settleV2Check;
    const param = {
      waybillList: [],
      companyId: this.info.get('USER').companyId
    };
    this.selectedList.forEach(
      value => param.waybillList.push({waybillNo: value.waybillNo})
    );
    return this.http.post(url, param).then(
      res => {
        return res.success;
      }
    );
  }

  rizhaoCopyPriceResult() {
    let params: any = {tWaybills: []};
    this.selectedList.map((x: any) => {
      let o: any = {};
      o.waybillNo = x.waybillNo;
      o.companyId = x.companyId;
      params.tWaybills.push(o);
    });
    params.linePrice = this.radioValue === '60' ? this.linePrice : undefined;
    if (this.radioValue == '70') {
      params.addPrice = this.addPrice;
      params.choiceType = this.choiceType;
    }
    let url = urls.generateReports;
    this.http.post(url, params).then((res: any) => {
      if (res.success) {
         this.listSearch(this.searchData);
         this.nn.success('提示消息', res.data.data);
        this.modalRef.destroy();
      }
    });

  }



  updateIsEffect(){
    if (!this.selectedList || this.selectedList.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      this.destroyTplModal();
      return;
    }
    let data = this.selectedList.map(item => {
      return {
        settleNo: item.settleNo,
        companyId: item.companyId,
      };
    });
    let url = urls.updateIsEffect;
    this.nm.confirm({
      nzTitle: `结算单修改 > 结算单生效`,
      nzContent: `是否对选中的数据进行结算单生效操作?`,
      nzOnOk: () => {
        this.http.post(url, {tSettleModels: data}).then((res: any) => {
          this.listLoading = false;
          if (res.success) {
            this.listSearch(this.searchData);
            this.nn.success('提示消息', res.data.data);
          }
        });
      }
    });

  }

  paymentRequest(){
    if (!this.selectedList || this.selectedList.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      this.destroyTplModal();
      return;
    }
    let data = this.selectedList.map(item => {
      return {
        waybillNo:item.waybillNo,
        settleNo: item.settleNo,
        companyId: item.companyId,
        settleSubno: item.settleSubno,
        feeType:item.feeType
      };
    });
    let url = urls.paymentRequest;
    this.nm.confirm({
      nzTitle: `结算单修改 > 付款申请`,
      nzContent: `是否对选中的数据进行付款申请?`,
      nzOnOk: () => {
        this.http.post(url, {settleModelList: data}).then((res: any) => {
          this.listLoading = false;
          if (res.success) {
            this.listSearch(this.searchData);
            this.nn.success('提示消息', res.data.msg);
          }
        });
      }
    });

  }

  update() { // 修改按钮
    if (!this.selectedList || this.selectedList.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      this.destroyTplModal();
      return;
    }
    let data = this.selectedList.map(item => {
      return {
        settleNo: item.waybillNo,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        payPrice: item.payPrice,
        payTotalPrice: item.payTotalPrice,
        companyId: item.companyId,
        settleSubno: item.settleSubno,
        feeType:item.feeType
      };
    });
    let url = urls.updateWaybillFee;
    this.http.post(url, {settleFees: data}).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.listSearch(this.searchData);
        this.nn.success('提示消息', res.data.msg,{nzDuration: 5000});

      }
    });


  }

  selectData(data: any) { // 选择数据
    this.selectedList = data;
    this.deepSelectList = Utils.deepCopy(data);
    this.dataSet.forEach((item, ins) => {
      item.editstate = 0;
      item.unitPrice = this.lists[ins].unitPrice; //重量等于初始查询重量
      item.totalPrice = this.lists[ins].totalPrice; //重量等于初始查询重量
      item.payPrice = this.lists[ins].payPrice; //重量等于初始查询重量
      item.payTotalPrice = this.lists[ins].payTotalPrice; //重量等于初始查询重量

      this.selectedList.forEach((data, index) => {
        if (data.rowIndex == item.rowIndex) {
          data.unitPrice = this.deepSelectList[index].unitPrice; //重量等于初始查询重量
          data.totalPrice = this.deepSelectList[index].totalPrice; //重量等于初始查询重量
          data.payPrice = this.deepSelectList[index].payPrice; //重量等于初始查询重量
          data.payTotalPrice = this.deepSelectList[index].payTotalPrice; //重量等于初始查询重量
          item.editstate = 1;
        }

      });
    });
    this.allTotalPrice = this.selectedList.map(item => item.totalPrice).reduce((acc, cur) => this.isNum(acc) + this.isNum(cur), 0);
    this.allPayTotalPrice = this.selectedList.map(item => item.payTotalPrice).reduce((acc, cur) => this.isNum(acc) + this.isNum(cur), 0);
    this.allTotalWeight = this.selectedList.map(item => item.preTotalWeight).reduce((acc, cur) => this.isNum(acc) + this.isNum(cur), 0);

  }

  modelChange(data) { // 列表输入变化时触发
    let param = data.data;
    if (!isPosNum(data.val)) {  //判断是否数字
      let val = parseFloat(data.val);
      data.input.value = isNaN(val) ? 0 : toDemical(val,0);
    }
    let num = data.input.value;
    switch (data.header.colEname) {
      case 'unitPrice': //应收单价
        param.unitPrice = this.isNum(num);
        param.totalPrice = Utils.mul(param.unitPrice, param.preTotalWeight);
        break;

      case 'totalPrice': //应收总价
        param.totalPrice = this.isNum(num);
        param.unitPrice = Utils.div(param.totalPrice, param.preTotalWeight);
        break;

      case 'payPrice':   //应付单价
        param.payPrice = this.isNum(num);
        param.payTotalPrice = Utils.mul(param.payPrice, param.preTotalWeight);
        break;
      case 'payTotalPrice': //应付总价
        param.payTotalPrice = this.isNum(num);
        param.payPrice = Utils.div(param.payTotalPrice, param.preTotalWeight);
        break;
    }
    this.selectedList.forEach(item => {
      if (item.rowid == param.rowid) {
        item.payTotalPrice = param.payTotalPrice;
        item.totalPrice = param.totalPrice;

      }
    });

    this.allTotalPrice = this.selectedList.map(item => item.totalPrice).reduce((acc, cur) => this.isNum(acc) + this.isNum(cur), 0);
    this.allPayTotalPrice = this.selectedList.map(item => item.payTotalPrice).reduce((acc, cur) => this.isNum(acc) + this.isNum(cur), 0);

  }

  private UpdateConsignee() { // 修改客户按钮
    if (!this.selectedList || this.selectedList.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      this.destroyTplModal();
      return;
    }
    this.modalObj.data = [
      {
        type: 'inputModal',
        parameter: 'consigneeCompanyId',
        name: '客户',
        formId: 'company_pop',
        nameStr: 'companyName',
        idStr: 'companyId',
        required: true,
        value: null,
        model: null,
      },

    ];
    this.modalObj.title = `结算单修改 > 修改客户`;
    this.nm.confirm({
      nzTitle: `结算单修改 > 修改客户`,
      nzContent: `是否对选中的数据进行修改?`,
      nzOnOk: () => {
        this.formValidate = this.fb.group({
          consigneeCompanyId: [null, Validators.required],
        });
        this.modalObj.visible = true;
      }
    });
  }

  modalInputModal(model: any, data: any) { // pop弹框时间触发
    data.model = model.selData;
    model.selData[0] && this.formValidate.get(data.parameter).setValue(model.selData[0][data.idStr] || null);
  }


  modalOk() { // 修改客户弹框确认
    for (const i in this.formValidate.controls) {
      this.formValidate.controls[i].markAsDirty();
      this.formValidate.controls[i].updateValueAndValidity();
    }
    if (this.formValidate.status === 'INVALID') {
      return;
    }
    this.modalObj.loading = true;
    const tWaybillModels = this.selectedList.map(x => ({waybillNo: x.waybillNo, companyId: x.companyId}));
    const params = {
      tWaybillModels: tWaybillModels, ...this.formValidate.getRawValue(),
    };
    this.http.post(TRANS_URLS.updateConsigneeCompanyId, params).then(
      (res: any) => {
        this.modalObj.loading = false;
        this.modalObj.visible = false;
        if (res.success) {
          this.msg.success(res.data.data);
          this.listSearch(this.searchData);
        }
      }
    );
  }

  import() { //导入
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;

    this.tplModal = this.nm.create({
      nzTitle: '结算单修改 > 导入',
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '32%',
      nzMaskClosable: false,
      nzClosable: false
    });
  }

  /**
   * 选择excel
   */
  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  /**
   * 选择excel带入名称
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});
  }


  importConfirm() {   //导入确定按钮

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }

    if (!Utils.isExcel(this.importFile.name)) {
      this.nn.remove();
      this.nn.error('提示信息', '格式不正确！');
      return;
    }

    let _data = [];
    this.implistLoading = true;
    let headTemplate = ['地磅编号', '应收单价', '应付单价'];
    this.xlsx.import(this.importFile, true).then((data: any) => {
      let keys = Object.keys(data);
      let _data = data[keys[0]];
      if (!_data) {
        this.nn.remove();
        this.nn.error('提示信息', '未读取到sheet页！读取数据Excel失败！');
        this.implistLoading = false;
        return;
      }
      let headArr: any = _data && _data[0] || [];
      if (!this.validateHeadHead(headTemplate, headArr)) {
        return;
      }
      this.excelFilterFilter(_data);
    });

  }

  /**
   * 验证模板是否正确
   */
  validateHeadHead(head, receiptHead): boolean {
    let count: string = '';
    let flag = true;
    // if(head.length != receiptHead.length){ // excal表头是否和定义表头长度相同
    //   flag = false;
    // }
    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        count = item;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        flag = false;
        count = item;
        return;
      }
    });
    if (!flag) {
      this.nn.remove();
      this.nn.error('提示信息', '文件表头' + count + '与模板不匹配，请选择正确模板！');
      this.implistLoading = false;
    }
    return flag;
  }

  excelFilterFilter(data: any) {
    let url = urls.feeByImport;
    let param: any = {excelFees: []};
    let eNameHeader: any = [];
    data[0].map((item, index) => {
        if (this.patchEname(item)) {
          eNameHeader.push({field: this.patchEname(item), index: index});
        }
      }
    );
    for (let i = 1; i < data.length; i++) {
      let temp: any = {};
      eNameHeader.forEach((h) => {
        temp[h.field] = data[i][h.index];
      });
      param.excelFees.push(temp);
    }
    let arr = param.excelFees.filter(item => {  //滤除品名、末检时间、车牌号为空的数据
      return (item.weighbridgeNo);
    });

    param.excelFees = arr;
    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      if (res.success) {
        this.tplModal.destroy();
        this.nn.create('success', '提示信息', res.data.msg,{nzDuration: 0,nzStyle:{
            marginLeft: '-100px',width: '500px',display:'block',wordBreak: 'break-all',wordWrap: 'break-word'}});
        this.listSearch(this.searchData);
      }
    })

  }

  patchEname(cName: any) { // 通过列表表头与自定义表头对比 获取字段名
    cName = cName + '';
    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() == cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  };

  handleCancel(): void {   //导入弹窗取消
    this.tplModal.destroy();
  }

  export() {  //导出
    let url = urls.statementsExport;
    this.ngHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `结算单修改.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }



  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 3000);
  }

  isNum(data) { // 判断数字
    if (isNaN(data)) {
      return 0;
    } else {
      return Number(data);
    }
  }

  /**
   * 模板下载 点击
   */
  btnTemplate():void{
    const url ='http://another2.oss-cn-hangzhou.aliyuncs.com/import/%E7%BB%93%E7%AE%97%E5%8D%95%E5%BA%94%E6%94%B6%E5%BA%94%E4%BB%98%E5%8D%95%E4%BB%B7%E4%BF%AE%E6%94%B9%E6%A8%A1%E7%89%88.xlsx'
    let a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  importExcel() {
    this.validateFormForm = this.fb.group({});
    this.modalFormDataImport.forEach(item => {
      const validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateFormForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading1 = false;
    this.modalTitle = '结算单修改>导入';
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle1,
      nzContent: this.tplContent1,
      nzFooter: this.tplFooter1,
      nzWidth: '33%',
      nzMaskClosable: false,
      nzClosable: false,

    });
  }

  selectExcelFile() {
    this.excelFileInput.nativeElement.click();
  }

  excelFileChange(file: any) {
    this.importFile = file.target.files[0];
    this.validateFormForm.patchValue({importFile: this.importFile && this.importFile.name || ''});

  }

  handleCancel1() {
    this.tplModal.destroy();
    this.validateFormForm.reset();
  }

  importConfirm1() {
    for (const i in this.validateFormForm.controls) {
      this.validateFormForm.controls[i].markAsDirty();
      this.validateFormForm.controls[i].updateValueAndValidity();
    }
    if (this.validateFormForm.status === 'INVALID') {
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
      ['进厂日期',  '供货客户',  '车号', '磅单重量', '供货地城市', '客户单价', '收款金额', '车队单价', '车队裸价运费', '承运单位', '品名', '备注','业务'];

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
        this.nzMess.error('提示信息',`模板不正确，请下载正确模板`);
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
        this.nzMess.error('提示信息',`请检查数据，第一个tab页为空`);
        this.implistLoading1 = false;
        return;
      }
      if(!this.validateData(_data)){
        this.implistLoading1 = false;
        return;
      }
      dataList.push(_data);
      _data = [];
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

  patchEnameName(cName: any) {
    this.columnsArr.push({colCname: '供货客户', colEname: 'consigneeCompanyId'}, {colCname: '车号', colEname: 'travelNo'}, {colCname: '磅单重量', colEname: 'preTotalWeight'}
      , {colCname: '进厂日期', colEname: 'loadDate'}, {colCname: '供货地城市', colEname: 'endPoint'}, {colCname: '客户单价', colEname: 'rcvUnitPrice'},
      {colCname: '收款金额', colEname: 'rcvTransFee'}, {colCname: '车队单价', colEname: 'unitPrice'}, {colCname: '车队裸价运费', colEname: 'transFee'},
      {colCname: '承运单位', colEname: 'carrierCompanyName'}, {colCname: '品名', colEname: 'productName'}, {colCname: '备注', colEname: 'remark'}, {colCname: '业务', colEname: 'businessTypeName'}
    );
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
          if (this.patchEnameName(item)) {
            eNameHeader.push({field: this.patchEnameName(item), index: index});
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
    const url = TRANS_URLS.importWaybillHS;
    this.http.post(url, {'tWaybillModels' : param}).then(res => {
      if (res.success) {
        this.nzMess.create('success', '提示信息', res.data.msg, {nzDuration: 3000});
        this.tplModal.destroy();
        this.listSearch(this.searchData);
        this.validateFormForm.reset();
      }
      this.implistLoading1 = false;
    });
  }

  validateData(data: any): boolean {
    let count: any;
    let excelHeader: any = data && data[0] || [];
    let opt = ['业务'];
    let tipMess = [];
    for (let j = 0; j < opt.length; j++) {
      let op = opt[j];
      if (excelHeader.indexOf(op) < 0) {
        tipMess.push(op);
      } else {
        // 验证必填字段不能为空
        for (let i = 1; i < data.length; i++) {
          count = this.old_data.indexOf(data[i])
          let index = excelHeader.indexOf(op);
          if (!data[i][index] || data[i][index] == '' || data[i][index] == undefined || data[i][index] == null) {
            this.nzMess.remove();
            this.nzMess.error('提示信息',`必填字段“${op}”在行号为${count + 1}处为空！`);
            return false;
          }
        }

      }
    }
    if(tipMess.length > 0){
      this.nzMess.remove();
      this.nzMess.error('提示信息',`字段${tipMess.join('、')}必须存在！`);
      return false;
    }
    return true
  }

  aClick(){
    window.location.href="https://another2.oss-cn-hangzhou.aliyuncs.com/import/%E8%BD%A6%E8%BE%86%E8%B0%83%E5%BA%A6%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx";
  }

}
