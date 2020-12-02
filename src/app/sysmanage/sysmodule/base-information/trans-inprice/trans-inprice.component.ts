import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {urls} from '../../../../common/model/url';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, map, retry} from 'rxjs/operators';
import {of} from 'rxjs';
import {Utils} from '../../../../common/util/utils';
import {XlsxService} from '../../../../components/simple-page/xlsx/xlsx.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-trans-inprice',
  templateUrl: './trans-inprice.component.html',
  styleUrls: ['./trans-inprice.component.css']
})
export class TransInpriceComponent implements OnInit {

  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  @ViewChild('fileInput') fileInput: ElementRef;
  pricecolumnsArr: any;//价格列缓存
  placecolumnsArr: any;//地点列缓存
  columnsArr: any; //列缓存
  implistLoading: boolean = false; //导入确定加载
  importFile: any;

  importmodalFormData: Array<any> = [  //导入文件
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
  modalFormData: Array<any> = [
    {
      name: '业务板块名称', eName: 'segmentId', type: 'inputModal', validateCon: '请输入业务板块名称', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '省', eName: 'province', type: 'province', validateCon: '请选省', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '市', eName: 'city', type: 'city', validateCon: '请选市', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '区', eName: 'area', type: 'area', validateCon: '请选区', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '界面名称格式不正确，只能填数字或字母'
      }
    },
    {
      name: '乡', eName: 'town', type: 'town', validateCon: '请选乡', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '价格品种', eName: 'prodKindPrice', type: 'select', validateCon: '请输入公司ID', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '运费价格', eName: 'tranPrice', type: 'number', validateCon: '请输入运费价格', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '装车价格', eName: 'loadPrice', type: 'number', validateCon: '请输入装车价格', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '总价', eName: 'totalPrice', type: 'number', validateCon: '请输入结束长度', require: true, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '距离', eName: 'distance', type: 'number', validateCon: '请输入距离', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[0-9]+$',
        patternErr: '请输入正整数'
      }
    },

  ];

  selectArr: Array<any> = [];
  data: any;//查询条件缓存
  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗
  status: string;

  private tplModal: NzModalRef; // 弹窗相关

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 价格数据表单数据
  dataSet2: Array<any> = [];//地点价格 表单数据
  selectedData: Array<any> = []; // 选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;
  private rowid: any;

  findset: any = {
    url: 'getBusiSegment',
    formId: 'form_busi',
    name: '业务板块',
    parameter: 'segmentName',
    parameterSend: 'segmentId'
  };
  inputModalModel: string;
  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  townArr: Array<any> = [];
  // 业务模块 输入
  // selectedCompany: any; // 当前公司


  constructor(private http: HttpUtilService,
              private anhttp: HttpClient,
              private xlsx: XlsxService,
              private fb: FormBuilder,
              private nm: NzModalService,
              private nn: NzNotificationService) {
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

    // this.getStatic(this.selectArr, 'JGPZ');
    this.getAddressData({level: 'DZDJ10'});
    this.getprodKindPrice();

  }

  // 价格数据列表查询数据获取
  getListSearch(data: any): void {
    const params = data;
    let url = urls.getTransInprice;
    this.data = {...params};
    this.tempSearchParam = data;
    this.getListSearch2(this.tempSearchParam);
    this.http.post(url,params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  // 地点价格列表查询数据获取
  getListSearch2(param?): void {
    let url = urls.selectSpaceMoney;
    const params = param || {};
    this.http.post(url, params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet2 = res.data.data;
        }
      }
    );
  }

  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.addTransInprice;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        }
      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateTransInprice;
    data.rowid = this.rowid;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {transInpriceModels: []}, method: 'POST'};
    params.url = urls.deleteTransInprice;
    params.data.transInpriceModels = this.selectedData;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '删除成功！');
        }
      }
    );
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 添加
  btnAdd() {
    this.modalFormVisible = true;
    this.modalTitle = '线路价格管理(应收) > 新增';
    this.status = 'add';
  }

  // 修改
  btnUpdate(data: any) {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后修改！'
      });
      this.destroyTplModal();
      return;
    }
    if (!data || data.data.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalFormVisible = true;
    this.modalTitle = '线路价格管理(应收) > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
    this.inputModalModel = data.data[0].segmentName;
  }

  // 删除
  btnDelete(data: any) {
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除当前记录?';
    this.status = 'delete';
    this.selectedData = data.data;
  }

  // 弹出框相关
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }

    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(this.modalValidateForm.getRawValue());
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(this.modalValidateForm.getRawValue());
    }


  }

  handleCancel() {
    this.modalFormVisible = false;
  }

  closeResult() {
    this.modalValidateForm.reset();
    this.modalValidateForm.get('city').reset({value: null, disabled: true});
    this.modalValidateForm.get('area').reset({value: null, disabled: true});
    this.modalValidateForm.get('town').reset({value: null, disabled: true});
    this.cityArr = [];
    this.areaArr = [];
    this.townArr = [];
    this.inputModalModel = '';

  }

  // 确认框结果
  modalConfirmResult(data: any) {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;

  }

  // 公司更改触发
  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
  }

  // 弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  inpEmit(data: any) {
    this.modalValidateForm.get('segmentId').setValue(data.inpValue);
  }

  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        } else {
          Array.prototype.push.apply(data, []);
        }
      }
    );
  }

  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.modalValidateForm.get('city').reset({value: null, disabled: false},);
          this.modalValidateForm.get('area').reset({value: null, disabled: true},);
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
        } else {
          this.modalValidateForm.get('city').reset({value: null, disabled: true},);
          this.modalValidateForm.get('area').reset({value: null, disabled: true},);
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
        }

      }
        break;
      case 'DZDJ20': {
        if (value) {
          this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.modalValidateForm.get('area').reset({value: null, disabled: false},);
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
        } else {
          this.modalValidateForm.get('area').reset({value: null, disabled: true},);
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value});
          this.modalValidateForm.get('town').reset({value: null, disabled: false},);
        } else {
          this.modalValidateForm.get('town').reset({value: null, disabled: true},);
        }
      }
        break;
      case 'DZDJ40': {
      }
        break;
    }
  }

  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ10': {
              this.provinceArr = res.data.data;
            }
              break;
            case 'DZDJ20': {
              this.cityArr = res.data.data;
            }
              break;
            case 'DZDJ30': {
              this.areaArr = res.data.data;
            }
              break;
            case 'DZDJ40': {
              this.townArr = res.data.data;
            }
              break;
          }
        }
      }
    );
  }

  btnClick(data: any) {

    switch (data.buttonId) {
      case 'Add': {
        this.modalFormVisible = true;
        this.modalTitle = '线路价格管理(应收) > 新增';
        this.status = 'add';
      }
        break;
      case 'Update': {
        if (!this.selectedData || this.selectedData.length < 1) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选择数据后修改！'
          });
          this.destroyTplModal();
          return;
        }
        if (!this.selectedData || this.selectedData.length > 1) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选择一条数据进行修改！'
          });
          this.destroyTplModal();
          return;
        }

        this.modalFormVisible = true;
        this.modalTitle = '线路价格管理(应收) > 修改';
        this.status = 'update';
        this.rowid = this.selectedData[0].rowid;
        this.modalValidateForm.patchValue(this.selectedData[0]);
        this.inputModalModel = this.selectedData[0].segmentName;
      }
        break;
      case 'Delete': {
        if (this.selectedData.length < 1) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选中后进行删除！'
          });
          this.destroyTplModal();
          return;
        }

        this.modalTitle = '提示信息';
        this.deleteVisible = true;
        this.deleteCon = '确定要删除当前记录?';
        this.status = 'delete';
      }
        break;
      case 'Export': {
        this.export();
      }
        break;
      case 'Import': {
        // this.Import()
      }
        break;

    }
  }

  // 价格数据 选择结果
  updataClick(data: any) {
    this.selectedData = data;
  }

  numberChange(data: any, eName: any) {
    switch (eName) {
      case 'tranPrice': {
        this.modalValidateForm.get('totalPrice').setValue(Number(this.modalValidateForm.get('tranPrice').value) + Number(this.modalValidateForm.get('loadPrice').value));
      }
        break;
      case 'loadPrice': {
        this.modalValidateForm.get('totalPrice').setValue(Number(this.modalValidateForm.get('tranPrice').value) + Number(this.modalValidateForm.get('loadPrice').value));
      }
        break;
    }
  }

  getprodKindPrice(): void {
    const observable = fromPromise(this.http.post(urls.getprodKindPrice, {prodKind: '10'})).pipe(
      retry(3),
      map(res => {
        if (res.success) {
          return res.data.data;
        } else {
          throw new Error('服务器出错');
        }
      }),
      catchError(err => of([]))
    );
    observable.subscribe(
      value => {
        this.selectArr = value;
      }
    );
  }

  export(): void {  //导出
    let url: any = urls.exportExcel;
    this.anhttp.post(url, this.data, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `应收价格管理导出.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });

  }

  // Import() {   //导入
  //   this.validateForm = this.fb.group({});
  //   this.importmodalFormData.forEach(item => {
  //     let validatorOpt = [];
  //     item.validators.require && validatorOpt.push(Validators.required);
  //     item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
  //     this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
  //   });
  //   // this.implistLoading = false;
  //   this.modalTitle = '线路价格管理(应收) > 导入';
  //   this.tplModal = this.nm.create({
  //     nzTitle: this.tplTitle,
  //     nzContent: this.tplContent,
  //     nzFooter: this.tplFooter,
  //     nzWidth: '35%',
  //     nzMaskClosable: false,
  //     nzClosable: false
  //   });
  // }
  //
  // selectFile() {  //选择导入文件
  //   this.fileInput.nativeElement.click();
  // }
  //
  // userColumnsEmit(data: any): void {
  //   this.pricecolumnsArr = data;
  // }
  //
  // fileChange(file: any) {
  //   this.importFile = file.target.files[0];
  //   this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});
  //
  // }
  //
  // importConfirm() {   //导入确定按钮
  //   for (const i in this.validateForm.controls) {
  //     this.validateForm.controls[i].markAsDirty();
  //     this.validateForm.controls[i].updateValueAndValidity();
  //   }
  //   ;
  //   if (this.validateForm.status === 'INVALID') {
  //     return;
  //   }
  //   let _data = [];
  //   this.implistLoading = true;
  //   let headTemplate = [];
  //   this.xlsx.import(this.importFile, true).then((data: any) => {
  //     let keys = Object.keys(data);
  //
  //     let _data = data[keys[0]];
  //     if (!_data) {
  //       this.nn.remove();
  //       this.nn.error("提示信息", '未读取到sheet页！读取数据Excel失败！');
  //       this.implistLoading = false;
  //       return;
  //     }
  //     let headArr: any = _data && _data[0] || [];
  //     if (!this.validateHead(headTemplate, headArr)) {
  //       return;
  //     }
  //     this.excelFilter(_data);
  //   });
  //
  // }
  //
  // /**
  //  * 验证模板是否正确
  //  * @param head
  //  * @param receiptHead
  //  */
  // validateHead(head, receiptHead): boolean {
  //   let flag = true;
  //   if (head.length != receiptHead.length) {
  //     flag = false;
  //   }
  //   ;
  //   head.forEach(item => {
  //     if (typeof item != "string") {
  //       flag = false;
  //       return;
  //     }
  //     if (receiptHead.indexOf(item.trim()) < 0) {
  //       flag = false;
  //       return;
  //     }
  //   });
  //   if (!flag) {
  //     this.nn.remove();
  //     this.nn.error("提示信息", "模板不匹配，请选择正确模板！");
  //     // this.importLoading = false;
  //   }
  //   return flag;
  // }
  //
  //
  // excelFilter(data: any) {
  //   let url;//导入接口
  //   let param: any = {trans: []};
  //   let eNameHeader: any = [];
  //
  //   data[0].map((item, index) => {
  //       if (this.patchEname(item)) {
  //         eNameHeader.push({field: this.patchEname(item), index: index});
  //       }
  //     }
  //   );
  //   for (let i = 1; i < data.length; i++) {
  //     let temp: any = {};
  //     eNameHeader.forEach((h) => {
  //       temp[h.field] = data[i][h.index];
  //     });
  //     param.trans.push(temp);
  //   }
  //
  //   // param.trans.forEach((item) => {
  //   //   item.creatDate = item.creatDate && Utils.format(item.creatDate);
  //   //   item.collectionDate = item.collectionDate && Utils.format(item.collectionDate);
  //   //   item.flowConfirmationTime = item.flowConfirmationTime && Utils.format(item.flowConfirmationTime);
  //   // });
  //   this.http.post(url, param).then((res: any) => {
  //     this.implistLoading = false;
  //     if (res.success) {
  //       this.tplModal.destroy();
  //       this.nn.create('success', '提示信息', res.data.data, {nzDuration: 3000});
  //       this.listSearch({page: 1, length: this.pageSize});
  //     }
  //   })
  //
  // }
  //
  // patchEname(cName: any) {
  //
  //   for (let i = 0; i < this.columnsArr.length; i++) {
  //     if (this.columnsArr[i].colCname.trim() == cName.trim()) {
  //       return this.columnsArr[i].colEname;
  //     }
  //   }
  // };
  //
  // importHandleCancel(): void {   //弹窗取消
  //   this.tplModal.destroy();
  // }


}
