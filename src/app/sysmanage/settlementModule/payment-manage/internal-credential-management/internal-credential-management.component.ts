import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {HttpClient} from '@angular/common/http';
import {UploadFiles} from '@service/upload-files';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {localUrls} from '@model/localUrls';
import {Utils} from '@util/utils';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-internal-credential-management',
  templateUrl: './internal-credential-management.component.html',
  styleUrls: ['./internal-credential-management.component.css']
})
export class InternalCredentialManagementComponent implements OnInit {

  pageSize = 30; // 条数
  dataSet: Array<any> = []; // 列表数据
  totalPage = 0; // 数据总数
  listLoading = false; // list加载
  searchData: any = {}; // 搜索数据
  selectData: Array<any> = [];
  buttonId: string;   // 按钮ID


  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  implistLoading: boolean = false; //导入确定加载
  validateForm: FormGroup; // 导入弹框


  importFile: any;
  tplModal: NzModalRef;
  columnsArr = [
    {colEname: 'kingdeeId', colCname: '代码'},
    {colEname: 'kingdeeName', colCname: '名称'},
    {colEname: 'companyName', colCname: '全名'},
  ];
  columnsArr2 = [
    {colEname: 'collectionDate', colCname: '收款日期'},
    {colEname: 'companyName', colCname: '付款公司'},
    {colEname: 'amount', colCname: '金额'},
    // {colEname: 'busType', colCname: '业务类型'},
    {colEname: 'summary', colCname: '摘要'}
  ];

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

  constructor(
    private http: HttpUtilService,
    private angularHttp: HttpClient,
    public upload: UploadFiles,
    private fb: FormBuilder,
    private xlsx: XlsxService,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.formInitialization();
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    param.page = param.page || 1; // 最好有
    param.length = param.length || this.pageSize; // 最好有
    this.searchData = param;
    this.getListSearch(param);
  }

  /**
   * 列表查询数据获取
   * @param data
   */
  getListSearch(data: any): void {
    this.listLoading = true;
    const url = localUrls.selectInternCollectionData;
    this.http.post(url, data).then(
      (res: any) => {

        if (res.success) {
          this.dataSet = res.data.data && res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total || 0;
          this.selectData = [];
        }

      }
    ).finally(() => {
      this.listLoading = false;
      this.validateForm.reset();
    });
  }

  /**
   * 选择事件
   * @param param
   */
  updateDataResult(param: Array<any>) {
    this.selectData = param;
  }

  /**
   * 按钮点击
   * @param param
   */
  btnClick(param: any) {
    this.buttonId = param.buttonId;
    switch (this.buttonId) {
      case 'Export': {
        this.btnExport();
      }
        break;
      case 'Import2': {
        this.btnImport();
      }
        break;
      case 'Import1': {
        this.btnImport();
      }
        break;
      default: {
        this.nm.warning('点击按钮功能未定义!');
      }
        break;
    }
  }

  btnImport(): void {
    let nztitle = this.buttonId === 'Import1' ? '客户导入' : '信息费导入';
    this.tplModal = this.nzModal.create({
      nzTitle: `内部结算> ${nztitle}`,
      nzContent: this.tplContent,
      nzWidth: '32%',
      nzMaskClosable: false,
      nzClosable: false,
      nzFooter: this.tplFooter,
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


  /**
   * 导入确定按钮
   */
  importConfirm() {

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
    let headTemplate = [];
    switch (this.buttonId) {
      case 'Import1': {
        headTemplate = ['代码', '名称', '全名'];
      }
        break;
      case 'Import2': {
        headTemplate = ['收款日期', '付款公司', '金额', '摘要'];
      }
        break;
      default: {
        return;
      }
    }

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
      if (!this.validateHead(headTemplate, headArr)) {
        return;
      }
      this.excelFilter(_data);
    });

  }

  /**
   * 验证模板是否正确
   */
  validateHead(head, receiptHead): boolean {
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

  excelFilter(data: any) {
    let url;
    let param: Array<any> = [];
    switch (this.buttonId) {
      case 'Import1': {
        url = localUrls.importInternData;
      }
        break;
      case 'Import2': {
        url = localUrls.importCollectionData;
      }
        break;
      default:
        return;
    }

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
      param.push(temp);
    }
    param.forEach(
      value => {
        value.collectionDate = value.collectionDate && Utils.format(value.collectionDate);
      }
    );
    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      if (res.success) {
        this.tplModal.destroy();
        this.nn.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.listSearch(this.searchData);
      }
    });

  }

  /**
   * 通过列表表头与自定义表头对比 获取字段名
   * @param cName
   */
  patchEname(cName: any) {
    cName = cName + '';

    switch (this.buttonId) {
      case 'Import1': {
        for (let i = 0; i < this.columnsArr.length; i++) {
          if (this.columnsArr[i].colCname.trim() === cName.trim()) {
            return this.columnsArr[i].colEname;
          }
        }
      }
        break;
      case 'Import2': {
        for (let i = 0; i < this.columnsArr2.length; i++) {
          if (this.columnsArr2[i].colCname.trim() === cName.trim()) {
            return this.columnsArr2[i].colEname;
          }
        }
      }
        break;
      default: {
        return;
      }
    }

  };

  /**
   * 导入弹窗取消
   */
  handleCancel(): void {
    this.tplModal.destroy();
    this.validateForm.reset();
  }

  /**
   * 导出点击
   */
  btnExport(): void {
    this.nzModal.confirm({
      nzTitle: '内部结算>导出',
      nzContent: '是否确认导出数据？',
      nzOnOk: () => this.exportRequest()
    });
  }

  exportRequest(): Subscription {
    const url = localUrls.exportInternData;
    const param = this.searchData;
    return this.angularHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/xlsx'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `金蝶凭证引入.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  formInitialization(): void {
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
  }


}
