import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { localUrls } from '@model/localUrls';
import { HttpUtilService } from '@service/http-util.service';
import { NzMessageService, NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { isAlphanumeric } from '@validator/validator';
import { Utils } from '@util/utils';
import { CacheService } from '@service/cache.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { XlsxService } from '@component/simple-page/xlsx/xlsx.service';
import { GlobalService } from '@service/global-service.service';
import { format as dateformat } from 'date-fns';

@Component({
  selector: 'app-invoice-information',
  templateUrl: './invoice-information.component.html',
  styleUrls: ['./invoice-information.component.css']
})
export class InvoiceInformationComponent implements OnInit {
  // tableData: any = [];
  // isMutli = true;
  listLoading: boolean = false;
  childlistLoading: boolean = false;
  pageSize: number = 30;//条数
  pageSize1: number = 30;//条数
  tplModal: NzModalRef;
  currentSelectedListData: any = {}; //点击列表当前条数据
  dataSet: Array<any> = [];
  childrenDataSet: any = [];
  totalPages: Number = 1;
  children_totalPages: Number = 1;
  isMutli: boolean = true;
  listWidth: string;
  trSelectedShow: boolean = false;
  message: any;  //提示信息
  index: number;
  invoiceStatusName: any;  //鼠标滑过时的单条数据
  show: boolean = false;
  companyData: any = [];
  company: any = {};
  priceTotal: number = 0;
  taxPriceTotal: number = 0;

  tabArr = [
    { name: '发票明细', index: 0 },
    { name: '费用明细', index: 1 },
  ];
  tabIndex: Number = 0;
  gridId: string = 'grid2';
  selectedData: Array<any> = [];//存储勾选中的数据
  gridOneHeight: string;
  gridTwoHeight: string;
  visible: boolean = false;
  divIndex: any;
  private searchData: any = {};
  private buttonId: string;
  implistLoading: boolean = false;

  auditParam: Array<any> = [];
  audit: boolean = false;

  validateForm: FormGroup;
  modalFormData: Array<any> = [
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
        require: false,
        pattern: false
      }
    },
  ];
  templateUrl: string = 'https://another2.oss-cn-hangzhou.aliyuncs.com/seadoc/20200408133707_财务管理_开票申请导入模板.xls';

  importFile: any;
  importColumns: Array<any> = [
    { ename: 'invoiceCompanyId', cname: '账套', required: true },
    { ename: 'businessTypeName', cname: '业务板块', required: true },
    { ename: 'settleCompanyId', cname: '客户名称', required: true },
    { ename: 'transType', cname: '运输方式', required: true },
    { ename: 'feeName', cname: '项目', required: true },
    { ename: 'weight', cname: '发运量（吨）', required: true, validator: 'number' },
    { ename: 'amount', cname: '开票金额(元)', required: true, validator: 'number' },
    { ename: 'tax', cname: '税率', required: true },
    { ename: 'remark', cname: '备注栏', required: true },
    { ename: 'invoiceType', cname: '发票类型', required: true },
  ];
  columnsArr1:any=[{cname:"代码",ename:"kingdeeId"},{cname:"名称",ename:"companyName"}
    ,{cname:"全名",ename:"kingdeeName"},{cname:"类型",ename:"companyId"}];
  modalTitle: any = '开票管理 > 导入';

  @ViewChild('fileInput') fileInput: ElementRef; // 隐藏文件选框
  @ViewChild('tplTitle') tplTitle: TemplateRef<any>;
  @ViewChild('tplContent') tplContent: TemplateRef<any>;
  @ViewChild('tplFooter') tplFooter: TemplateRef<any>;

  constructor(private http: HttpUtilService,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private nzMess: NzMessageService,
              private cache: CacheService,
              private router: Router,
              private angularHttp: HttpClient,
              private fb: FormBuilder,
              private xlsx: XlsxService,
              private glo: GlobalService,
              private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});
  }

  listSearch(data: any): void {
    data.page = data.page || 1;
    data.length = this.pageSize || data.length; // 自己已经自定义页码事件了就使用自己的定义的变量
    this.searchData = { ...data };
    this.getList(data);
  }

  childrenListSearch(): void {
    this.getChildrenListData();
  }

  getList(data: any): void {
    let url = localUrls.getInvoiceInfoListUrl;
    this.listLoading = true;
    this.priceTotal = 0;
    this.taxPriceTotal = 0;
    this.dataSet = [];
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.listLoading = false;
          this.dataSet = res.data.data && res.data.data.data || [];
          this.totalPages = res.data.data && res.data.data.total;
        }
      }
    );
  }



  getChildrenListData(): void {
    this.childrenDataSet = [];
    this.children_totalPages = 1;
    this.childlistLoading = true;
    let url = this.tabIndex === 0 ? localUrls.invoiceDetailUrl : localUrls.invoiceFeeDetailUrl;
    const param = {
      tSettleInvTtemModels: [],
    };
    this.selectedData.forEach(
      res => {
        param.tSettleInvTtemModels.push({ invoiceId: res.invoiceId });
      }
    );
    this.currentSelectedListData && this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.childlistLoading = false;
          this.childrenDataSet = res.data.data || [];
        }
      }
    );
  }

  // getChildrenPageIndex(page: any): void {
  //   this.childrenListSearch({page: page, length: this.pageSize1});
  // }
  //
  // getChildrenPageSize(pageSize: any): void {
  //   this.pageSize1 = pageSize;
  //   this.childrenListSearch({page: 1, length: this.pageSize1});
  // }


  //保存
  btnClick(data: any): void {
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Save': { // 保存
        this.btnSave();
      }
        break;
      case 'bill': { // 开票并打印
        this.btnBill();
      }
        break;
      case 'invoice': { // 已开发票管理
        this.btnInvoice();
      }
        break;
      case 'export': { // 导出
        this.export();
      }
        break;
      case 'import': {   // 导入
        this.btnImport();
      }
        break;
      case 'audit': { // 审核
        this.btnAudit();
      }
        break;
      case 'cancellation': { // 作废
        this.btnCancellation();
      }
        break;
      case 'invoiceZhi':
        this.invoiceZhi();
        break;
      case 'billZhi':
        this.billZhi();
        break;
      case 'customImport':
        this.customImport();
        break;
      case 'kingdeeExport':
        this.JDExport();
        break;
      default: {
        this.nzMess.warning(`按钮功能未定义! 按钮ID：${this.buttonId}`);
      }
    }


  }

  // 开票并打印_智
  private billZhi() {
    let status1 = true;
    const status = this.selectedData.every(res => res.invoiceStatus === 'FPZT10' || res.invoiceStatus === 'FPZT25');
    if (!status) {
      this.nzMess.warning('请选择开票状态为初始或者导入失败的数据！');
      return;
    }
    for (let i: number = 1; i < this.selectedData.length; i++) {
      if (this.selectedData[i].settleCompanyName != this.selectedData[i - 1].settleCompanyName) {
        status1 = false;
        break;
      }
    }
    if (!status1) {
      this.nzMess.warning('所选数据开票单位不一致，请重新选择');
      return;
    }
    this.nm.confirm({
      nzTitle: '信息提示',
      nzContent: '是否确认开票？',
      nzOnOk: () => {
        const param = {
          settleInvModels: this.selectedData.length ? this.selectedData : undefined
        };
        return this.http.post(localUrls.createInvoiceAndInvoiceItem, { ...param }).then((res: any) => {
          if (res.success) {
            if (this.selectedData.length) {
              this.nzMess.success(res.data.msg + '，正在为您跳转！ 请等待三秒', { nzDuration: 2500 });
              setTimeout(
                () => {
                  this.glo.tipNavUpdate.emit({
                    resourceName: '开票并打印',
                    formUrl: 'system/receivableManage/invoicePrint',
                    formId: 'form_inv_print'
                  });
                  this.glo.searchReload.emit({ target: 'Invoice-print' });
                  this.cache.setSession('invoice_print_sellerName', this.selectedData[0].settleCompanyName);
                  this.getList(this.searchData);
                  this.router.navigate(['/system/receivableManage/invoicePrint']);
                }, 3000);
            } else {
              this.companyData = res.data.data;
              this.visible = true;
            }
          }
        });
      }
    });
  }

  // 已开票管理_智
  private invoiceZhi() {
    if (this.selectedData.length !== 0) {
      this.nzMess.warning('请勿选择数据！');
      return;
    }
    this.http.post(localUrls.InvoicesellerPush, {}).then(
      res => {
        if (res.success) {
          this.companyData = res.data.data.companySettleModels;
          this.visible = true;
        }
      });
  }

  btnSave() {
    if (this.selectedData.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }
    let saveUrl = localUrls.invoiceSaveUrl;
    let saveParam = [];
    let status = this.selectedData.every(res => res.invoiceNo);
    if (!status) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '发票号为必填项！'
      });
      this.destroyTplModal();
      return;
    }
    let editstate = this.selectedData.every(
      res =>
        res.editstate === '1'
    );

    if (!editstate) {
      this.nz.create('warning', '提示信息', '选中数据有已保存数据，无法保存', { nzDuration: 3000 });
    }
    this.selectedData.forEach(element => {
      let obj = {
        invoiceDate: element.invoiceDate && element.invoiceDate instanceof Date && Utils.dateFormat(element.invoiceDate, 'yyyy-MM-dd hh:mm') || '',
        invoiceSerialNumber: element.invoiceSerialNumber || '',
        invoiceNo: element.invoiceNo || '',
        invoiceTitle: element.invoiceTitle || '',
        rowid: element.rowid || '',
        taxNo: element.taxNo || '',
        taxAmount: element.taxAmount || ''
      };
      saveParam.push(obj);
    });
    this.http.post(saveUrl, saveParam).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '保存成功', { nzDuration: 3000 });
          this.searchData.page = 1;
          this.listSearch({ ...this.searchData });
        }
      }
    );
  }

  btnBill() {
    let status1 = true;
    const status = this.selectedData.every(res => res.invoiceStatus === 'FPZT10' || res.invoiceStatus === 'FPZT25');
    if (!status) {
      this.nzMess.warning('请选择开票状态为初始或者导入失败的数据！');
      return;
    }
    for (let i: number = 1; i < this.selectedData.length; i++) {
      if (this.selectedData[i].settleCompanyName != this.selectedData[i - 1].settleCompanyName) {
        status1 = false;
        break;
      }
    }
    if (!status1) {
      this.nzMess.warning('所选数据开票单位不一致，请重新选择');
      return;
    }
    this.nm.confirm(
      {
        nzTitle: '提示消息',
        nzContent: '是否确认开票！',
        nzOnOk: () => {
          const param: any = {};
          const settleInvModels: Array<any> = [];
          if (this.selectedData.length > 0) {
            this.selectedData.forEach(
              res => {
                settleInvModels.push({ invoiceId: res.invoiceId });
              }
            );
            param.settleInvModels = settleInvModels;
          }

          return this.http.post(localUrls.InvoicesellerPush, param).then(
            res => {
              if (res.success) {
                if (this.selectedData.length > 0) {
                  this.nzMess.success(res.data.data.body + '，正在为您跳转！ 请等待三秒', { nzDuration: 2500 });
                  this.cache.setSession('billingManageData', res.data.data.redirectUrl);
                  setTimeout(
                    () => {
                      this.router.navigate(['/system/receivableManage/billingManage']);
                    }, 3000
                  );
                } else {
                  // this.cache.setSession('billingManageData', res.data.data.redirectUrl);
                  // this.router.navigate(['/system/receivableManage/billingManage']);
                  this.companyData = res.data.data.companySettleModels;
                  this.visible = true;

                }

              }
              // if (res.data.header.code === 0) {
              //   //  redirectUr
              //   this.nzMess.success('开票请求成功，正在为您跳转！');
              //   setTimeout(
              //     () => {
              //       window.open(res.data.redirectUrl);
              //     }, 1000
              //   );
              //
              // }
            }
          );
        }
      }
    );
  }

  btnAudit() {
    if (this.selectedData.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }

    this.selectedData.forEach(item => {
      if (item.auditStatus == '审核') {
        this.audit = true;
      }
    });
    if (this.audit) {
      this.audit = true;
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择未审核的数据！'
      });
      this.destroyTplModal();
      this.audit = false;
      return;
    }
    let auditUrl = localUrls.invoiceAuditUrl;
    this.auditParam = [];
    this.selectedData.forEach(item => {
      this.auditParam.push({ 'rowid': item.rowid });
    });
    this.http.post(auditUrl, this.auditParam).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '审核成功', { nzDuration: 3000 });
          this.searchData.page = 1;
          //this.audit=false;
          this.listSearch({ ...this.searchData });
        }
      }
    );
  }

  /**
   * 点击发票管理
   */
  btnInvoice(): void {
    if (this.selectedData.length !== 0) {
      this.nzMess.warning('请勿选择数据！');
      return;
    }
    const param = {};
    this.http.post(localUrls.InvoicesellerPush, param).then(
      res => {
        if (res.success) {
          this.companyData = res.data.data.companySettleModels;
          this.visible = true;
        }

      }
    );

  }

  updateData(data: any) {
    this.priceTotal = data.map((x: any) => x.invoiceAmount).reduce((a, b) => Number(a) + Number(b || 0), 0);
    this.taxPriceTotal = data.map((x: any) => x.taxAmount).reduce((a, b) => Number(a) + Number(b || 0), 0);

    this.selectedData = data;
    if (this.selectedData.length !== 0) {
      this.childrenListSearch();

    } else {
      this.childrenDataSet = [];
    }
  }

  listClick(data: any): void {
    this.currentSelectedListData = data;
    this.dataSet.forEach(item => {
      if (item.invoiceId === data.invoiceId) {
        item.checked = !item.checked;
      }
    });

    this.updateData(this.dataSet.filter(item => item.checked));
  }

  tabChange(data: any): void {
    setTimeout(() => {
      this.tabIndex = data.index;
      if (data.index === 0) {
        //费用明细
        this.gridId = 'grid2';
      } else {
        //货物明细
        this.gridId = 'grid3';
      }
      JSON.stringify(this.currentSelectedListData) !== '{}' && this.childrenListSearch();
    });
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  inpEmit(data: any) {
    this.dataSet[data.index].invoiceTitle = data.inpName;
  }

  modelChange(data: any) {
    switch (data.header.ename) {
      case 'invoiceId':
      case 'taxNo':
        if (!isAlphanumeric(data.val)) {
          data.input.value = '';
          data.data[data.header.ename] = '';
        }

    }
  }

  /**
   * 开票
   * @constructor
   */
  invoicesellerPush(): Promise<any> {
    return this.http.post(localUrls.InvoicesellerPush, { invoiceSerialNumber: this.selectedData[0].invoiceSerialNumber }).then(
      res => {
        if (res.data.header.code === 0) {
          this.nzMess.success('开票成功，正在为您跳转！');
          setTimeout(
            () => {
              window.open(res.data.redirectUrl);
            }, 3
          );

        }
      }
    );
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  listOver(data: any) {
    this.invoiceStatusName = data.data.invoiceStatusName;
    this.message = data.data.message;
    this.index = data.index;
    if (this.invoiceStatusName === '导入失败') {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  listLeave(data: any) {
    this.invoiceStatusName = '';
    this.message = '';
    this.show = false;
  }

  handleCancel() {
    this.visible = false;
  }

  selectCompant(data: any, index: number) {
    this.company = data;
    this.divIndex = index;

  }

  handleOk() {
    if (this.buttonId === 'bill') { //开票
      let url: any = localUrls.InvoicesellerPushNull;
      let param: any = {};
      param.settleCompanyId = this.company.settleCompanyId;
      if (Object.keys(this.company).length == 0) {
        this.nzMess.warning('请选择开票公司');
        return;
      }
      this.http.post(url, param).then((res: any) => {
        if (res.success) {
          this.company = {};
          this.visible = false;
          this.divIndex = null;
          this.nzMess.success('正在跳转，请稍后...');
          setTimeout(() => {
            this.cache.setSession('billingManageData', res.data.data);
            this.router.navigate(['/system/receivableManage/billingManage']);
          }, 1000);
        }
      });
    } else if (this.buttonId === 'invoice') { //发票管理
      this.invoiceRequest();
    } else if (this.buttonId === 'invoiceZhi') {
      this.visible = false;
      this.divIndex = null;
      this.nzMess.success('正在跳转，请稍后...');
      setTimeout(() => {
        this.glo.tipNavUpdate.emit({
          resourceName: '已开票管理',
          formUrl: 'system/receivableManage/invoiceInformationHad',
          formId: 'form_inv_print'
        });
        // this.cache.setSession('sellerName', this.company.settleCompanyName);
        this.glo.searchReload.emit({ target: 'invoiceInformationHad' });
        this.router.navigate(['/system/receivableManage/invoiceInformationHad'],{
          queryParams:{
            sellerName: this.company.settleCompanyName
          }
        });
      }, 1000);
    } else if (this.buttonId === 'billZhi') {
      this.visible = false;
      this.divIndex = null;
      this.nzMess.success('正在跳转，请稍后...');
      setTimeout(() => {
        this.glo.tipNavUpdate.emit({
          resourceName: '开票并打印',
          formUrl: 'system/receivableManage/invoicePrint',
          formId: 'form_inv_print'
        });
        this.cache.setSession('invoice_print_sellerName', this.company.settleCompanyName);
        this.glo.searchReload.emit({ target: 'Invoice-print' });
        this.router.navigate(['/system/receivableManage/invoicePrint']);
      }, 1000);
    }
  }

  // 发票管理请求
  invoiceRequest(): void {
    if (Object.keys(this.company).length == 0) {
      this.nzMess.warning('请选择开票公司');
      return;
    }
    const url = localUrls.billingHistory;
    const param = {
      settleCompanyId: this.company.settleCompanyId,
      remark: 'INVOICE'
    };
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.company = {};
        this.divIndex = null;
        this.visible = false;
        this.nzMess.success('正在跳转，请稍后...');
        setTimeout(
          () => {
            this.cache.setSession('billingManageData', res.data.data);
            this.router.navigate(['/system/receivableManage/billingManage']);
          }, 3000
        );
      }

    });
  }

  export() {
    let url: any = localUrls.exportInvAuditStatus;
    this.angularHttp.post(url, this.searchData, { responseType: 'blob' }).subscribe((res: any) => {
      let blob = new Blob([res], { type: 'application/xlsx' });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `开票管理.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 导入按钮
   */
  btnImport(): void {
    this.templateUrl = 'https://another2.oss-cn-hangzhou.aliyuncs.com/seadoc/20200408133707_财务管理_开票申请导入模板.xls';
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;

    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
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
   * @param file
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    this.validateForm.patchValue({ importFile: this.importFile && this.importFile.name || '' });
  }

  /**
   * 弹窗取消
   */
  handleCancel2(): void {
    this.tplModal.destroy();
  }

  /**
   * 导入弹窗确定
   */
  importConfirm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }

    if (!Utils.isExcel(this.importFile.name)) {
      this.nzMess.remove();
      this.nzMess.error('格式不正确！');
      return;
    }

    this.implistLoading = true;

    this.xlsx.import(this.importFile).then(res => {
      const keys = Object.keys(res);
      if (!keys || keys.length == 0) {
        this.implistLoading = false;
        this.nzMess.error('上传数据格式不正确，请下载标准模板!');
        return;
      }

      const data = res[keys[0]];
      if (!data || data.length < 2) {
        this.implistLoading = false;
        this.nzMess.error('上传数据格式不正确，请下载标准模板!');
        return;
      }

      // 模板必要字段验证
      if (this.validateColumns(data[0]) === false) {
        this.implistLoading = false;
        return;
      }
      // 导入数据校验
      const recListData = this.toSettleRec(data);
      const recList = recListData.filter((x: any) => x.invoiceCompanyId); // 去掉没有账套的
      if (this.validateData(recList) === false) {
        this.implistLoading = false;
        return;
      }

      this.http.post(localUrls.importInvocieApplyExcel, { tSettleInvModels: recList }).then((res: any) => {
        if (res.success) {
          this.tplModal.destroy();
          this.implistLoading = false;
          this.nzMess.success(`导入开票管理信息成功!`);
          this.searchData.page = 1;
          this.listSearch({ ...this.searchData });
        }
        this.implistLoading = false;
      });
    });
  }

  /**
   * 列头验证
   * @param header
   */
  validateColumns(header: Array<any>): boolean {
    const invalid = this.importColumns.filter(col => col.required && !header.some(h => h && h.trim() == col.cname));
    if (invalid && invalid.length > 0) {
      this.nzMess.error(`上传数据格式不正确，请下载标准模板!`);
      return false;
    }
    return true;
  }
  /**
   * 列头验证
   * @param header
   */
  validateColumns1(header: Array<any>): boolean {
    const invalid = this.columnsArr1.filter(col => !header.some(h => h && h.trim() == col.cname));
    if (invalid && invalid.length > 0) {
      this.nzMess.error(`上传数据格式不正确，请下载标准模板!`);
      return false;
    }
    return true;
  }

  /**
   * 将excel拆分的数组变成传参数据
   * @param data
   */
  toSettleRec(data: any): Array<any> {
    if (!data || data.length < 2) {
      this.nzMess.error('上传数据格式不正确，请下载标准模板!');
      return;
    }
    let dataArray = [];
    //data[0]是excel表格的中文表头
    const header = data[0].map(item => this.getEname(item));
    for (let i = 1; i < data.length; i++) {
      let obj = {};
      header.forEach((key, index) => obj[key] = data[i][index]);
      dataArray.push(obj);
    }
    //dataArray = dataArray.filter(item => item.invoiceDate);

    // 将日期和时间拼接，并转为YYYY-MM-DD HH:mm:ss格式
    //dataArray.forEach(item => item.invoiceDate = dateformat(`${item.invoiceDate}`, 'YYYY-MM-DD HH:mm:ss'));
    return dataArray;
  }

  /**
   * 导入数据校验
   * @param data
   */
  validateData(data: Array<any>): boolean {
    const invalidColumn = this.importColumns.filter(item => item.required).filter(col => {
      return data.some((item, index) => {
        // 如果没有值或者值去空格后长度为0，返回true
        if (!item[col.ename] || item[col.ename].trim().length == 0) {
          col.errMsg = `存在"${col.cname}"字段为空(行号：${index + 3})`;
          return true;
        }
        item[col.ename] = item[col.ename].trim();
        if (col.validator === 'number') {
          item[col.ename] = item[col.ename].replace(/,/g, '');
          if (isNaN(item[col.ename])) {
            col.errMsg = `存在"${col.cname}"字段不是数字(行号：${index + 3})`;
            return true;
          }
        }
        return false;
      });
    });
    if (invalidColumn && invalidColumn.length > 0) {
      const arr = invalidColumn.map((x: any) => `${x.errMsg}`);
      this.nzMess.error(arr.join('<br>'), { nzDuration: 5000 });
      return false;
    }
    return true;
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
   * 作废点击
   */
  btnCancellation(): void {
    if (this.selectedData.length === 0) {
      this.nzMess.warning('请选择数据后操作！');
      return;
    }
    const status = this.selectedData.some(
      value => value.invoiceStatus !== 'FPZT10'
    );
    if (status) {
      this.nzMess.warning('只能撤销初始状态数据！');
      return;
    }

    this.nm.confirm({
      nzTitle: '开票管理>作废',
      nzContent: '是否确认作废当前选中数据',
      nzOnOk: () => this.cancellationRequest()
    });

  }

  /**
   * 作废请求
   */
  cancellationRequest(): Promise<any> {
    const url = localUrls.cancellInvoiceApply;
    const param: any = {
      tSettleInvModels: this.selectedData
    };
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nz.success('提示消息', '作废成功!');
          this.listSearch(this.searchData);
          return true;
        }
        return false;
      }
    );
  }

  getPageIndex(page: any): void {
    this.searchData.page = page;
    this.listSearch({ ...this.searchData });
  }

  getPageSize(pageSize: any): void {
    this.pageSize = pageSize;
    this.searchData.page = 1;
    this.searchData.length = this.pageSize;
    this.listSearch({ ...this.searchData });
  }

  /*
  *  客户导入
  */
  customImport(){
    this.templateUrl = 'https://another2.oss-cn-hangzhou.aliyuncs.com/seadoc/20191223103539_供应商客户导入模板.xls'
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;

    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false
    });
  }

  importConfirm1() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    ;
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    if (!Utils.isExcel(this.importFile.name)) {
      this.nzMess.remove();
      this.nzMess.error('格式不正确！');
      return;
    }
    let _data;
    let dataList: any = [];
    this.implistLoading = true;
    let headTemplate


      headTemplate = ['代码','名称','全名','类型']


    this.xlsx.import(this.importFile, true).then((data: any) => {

      let keys = Object.keys(data);
      //_data.push( data[keys[i]]);

      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error('未读取到sheet页！读取数据Excel失败！');
        this.implistLoading = false;
        return;
      }
      ;
      let headArr: any
        headArr = _data && _data[0] || [];
      if (!this.validateHead(headTemplate, headArr)) {
        this.nzMess.remove();
        this.nzMess.error(`模板不正确，请下载正确模板`);
        return;
      }
      console.log(_data)
    debugger
      _data.forEach(item=>{
        for( let i in item){
          if(typeof  item[i] ==='string'){
            console.log(this.trim(item[i])===''||this.trim(item[i])===null||this.trim(item[i])===undefined)
            if(!item[i]||this.trim(item[i])===''||this.trim(item[i])===null||this.trim(item[i])===undefined){
              delete item[i];
            }
          }else{
            if(item[i]===''||item[i]===null||item[i]===undefined){
              delete item[i];
            }
          }

        }
      })

      let _dataNew =[];
      _data.forEach(item=>{
        if(!(item.filter(x=>x!=undefined).length == 0||item.length===0)){
          _dataNew .push(item);
        }
      })
      _data = _dataNew
      console.log(_data)
      if(_data.length==1){
        this.nzMess.error(`请检查数据，第一个tab页为空`);
        this.implistLoading = false;
        return;
      }
      // if(!this.validateData(_data)){
      //   // this.nzMess.error("合同号不能为空！");
      //   this.implistLoading = false;
      //   return;
      // }
      //this.removeEmpty(_data).then(this.excelFilter(_data));
      //console.log(_data);
      dataList.push(_data);
      _data = [];

      //console.log(dataList);
      this.excelFilter(dataList);
    });


  }

  trim(str) {
    if(str == null){
      str = "";
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
  };

  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let flag = true;
    // if (head.length != receiptHead.length) {
    //   flag = false;
    // }
    ;
    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        console.log(item);
        flag = false;
      }
    });
    if (!flag) {

      this. implistLoading= false;
    }
    return flag;
  }
  /*
  *   导入调接口
  * */

  excelFilter(data: any) {
    let param: any = [];
    let eNameHeader: any = [];
    let url:any
    let param1:any ={}

      for (let j = 0; j < data.length; j++) {
        //console.log(data[j][0]);
        console.log(data[j][0]);

        data[j][0].map((item, index) => {
            if (this.patchEname(item)) {
              eNameHeader.push({field: this.patchEname(item), index: index});
            }
          }
        );
        // console.log(eNameHeader);
        for (let i = 1; i < data[j].length; i++) {
          let temp: any = {};
          eNameHeader.forEach((h) => {
            temp[h.field] = data[j][i][h.index];
          });
          param.push(temp);
        }
        ;
      }
      param1 = param;
      url = localUrls.importKingDeeDataV2

    let count: any = [];
    console.log(param1);



    this.http.post(url,param1).then(res=>{
      if(res.success){
        this.nz.create('success','提示信息',res.data.data,{nzDuration: 3000})
        this.tplModal.destroy();
        this.implistLoading = false;
        this.searchData.page = 1;
        this.listSearch({ ...this.searchData });
      }
      this. implistLoading= false;
    })


  }


  /***
   * 根据Excel中文表头匹配页面列表表头
   */
  patchEname(cName: any) {

      for (let i = 0; i < this.columnsArr1.length; i++) {
        if (this.columnsArr1[i].cname.trim() == cName.trim()) {
          return this.columnsArr1[i].ename;
        }
      }

  }

  JDExport(){
    if(this.selectedData.length<=0){
      this.nz.error('提示信息','请勾选数据');
      return;
    }
    if(this.selectedData.filter(x=>x.invoiceStatus==='FPZT50').length!==this.selectedData.length){
      this.nz.error('提示信息','请勾选已开票数据');
      return;
    }
    let url: any = localUrls.exportInvAuditStatusJD;
    this.angularHttp.post(url, {kingDeeFinancingModels:this.selectedData}, { responseType: 'blob' }).subscribe((res: any) => {
      let blob = new Blob([res], { type: 'application/xlsx' });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `金蝶导出.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

}


