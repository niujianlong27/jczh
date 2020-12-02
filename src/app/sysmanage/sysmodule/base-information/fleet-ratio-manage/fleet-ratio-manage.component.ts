import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '@model/url';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '@util/utils';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {format} from 'date-fns';

@Component({
  selector: 'app-fleet-ratio-manage',
  templateUrl: './fleet-ratio-manage.component.html',
  styleUrls: ['./fleet-ratio-manage.component.css'],
  providers: [
    XlsxService
  ]
})
export class FleetRatioManageComponent implements OnInit {

  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗
  status: string;
  inputModalModel: string;
  modalFormVisible: boolean = false;
  borderRed: boolean = false;
  private tplModal: NzModalRef; // 弹窗相关
  modalValidateForm: FormGroup;
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  modalOkLoading = false;

  prodKindPriceArr: Array<any> = [];
  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  driverArr: Array<any> = [];

  dataSetDetailModal: Array<any> = [];
  //grid信息
  gridOneHeight: string;
  gridTwoHeight: string;
  addModalFormData: Array<any> = [
    // {
    //   name: '公司ID', eName: 'companyId', type: 'text', validateCon: '请输入公司ID', require: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '公司名称', eName: 'companyName', type: 'modal', validateCon: '请输入公司名称', require: true,disabled: false,
    //   validators: {
    //     require: true,
    //     pattern: false,
    //   }
    // },
    {
      name: '省市区', eName: 'flowAddress', type: 'region', validateCon: '请输入省市区', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    // {
    //   name: '卸货地', eName: 'loadPlaces', type: 'area', validateCon: '请输入卸货地', require: true, disabled: false,
    //   validators: {
    //     require: true,
    //     pattern: false,
    //   }
    // },
    {
      name: '品种',
      eName: 'prodNames',
      type: 'select',
      validateCon: '请输入品种',
      require: true,
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    // {
    //   name: '运输车队', eName: 'consignee', type: 'driver', validateCon: '请输入运输车队', require: true, disabled: false,
    //   validators: {
    //     require: true,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '中标比例', eName: 'fleetRatio', type: 'text', validateCon: '请输入中标比例', require: true, disabled: false,
    //   validators: {
    //     require: true,
    //     pattern: true,
    //     patternStr: '^(1|0(\\.[0-9]{1,2})?)',
    //     patternErr: '0-1中不超过两位的小数，包含0、1'
    //
    //   }
    // },
    {
      name: '开始日期', eName: 'startDate', type: 'date', validateCon: '请输入开始日期', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '结束日期', eName: 'endDate', type: 'date', validateCon: '请输入结束日期', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入备注', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    }

  ];
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
        require: true,
        pattern: false
      }
    },
  ];
  confirmRef: NzModalRef;
  formId: string = 'form_Fleet_ratio';
  columnsArr: any;
  implistLoading: boolean = false; //导入确定加载
  importFile: any;
  pageSize: number = 100;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;  //列表数据缓存
  selectData1: Array<any> = [];
  private rowid: any;
  buttonId: string;
  getcompanyId: string;
  confimCon: string;
  importLoading: boolean;
  areaCheckAll: Boolean = false; // 卸货地是否全选
  prodCheckAll: Boolean = false; // 产品是否全选


  dataSet2: Array<any> = [];
  listLoading2 = false;
  pageSize2 = 30;
  totalpage2 = 1;
  selectDataDetailModal: Array<any> = [];

  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  @ViewChild('confirmTitle') confirmTitle;
  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;

  constructor(
    private http: HttpUtilService,
    private fb: FormBuilder,
    private nzModal: NzModalService,
    private nzMess: NzNotificationService,
    private xlsx: XlsxService,
    private info: UserinfoService
  ) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    this.getcompanyId = this.info.APPINFO.USER.companyId;
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({
      provinceCode: [{disabled: false, value: null}],
      flowAddress: [{disabled: true, value: null}],
      loadPlace: [{disabled: true, value: null}],
    });
    this.addModalFormData = this.addModalFormData ? this.addModalFormData : [];
    for (let i = 0; i < this.addModalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.addModalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.addModalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.addModalFormData[i].validators.patternStr));
      }

      this.modalValidateForm.addControl(this.addModalFormData[i].eName, new FormControl(
        {value: '', disabled: this.addModalFormData[i].disabled}, validatorOrOpts
      ));
    }
    this.getAddressData({level: 'DZDJ10'});
    this.getStatic();
    // this.getDriver();

  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.getFleetRatio;
    params.data = data;
    this.tempSearchParam = data;
    this.dataSet2 = [];
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          const result = res.data.data.data || [];
          if (result.length > 0) {
            this.dataSet = result.map(item => {
              // if (!item.loadPlaceId) {
              //   item.loadPlaceId = '全部';
              // }
              if (!item.prodName) {
                item.prodName = '全部';
              }
              return item;
            });
          } else {
            this.dataSet = result;
          }
          this.totalPage = res.data.data && res.data.data.total;

        }
      }
    );
  }

  // 按钮区按钮点击事件统一处理
  btnClick(button: any) {
    switch (button.buttonId) {
      case 'Add' :
        this.add();
        break;
      case 'Update':
        this.update();
        break;
      case 'Delete':
        this.delete();
        break;
      case 'Import':
        this.btnImport();
        break;
      default:
        this.nzMess.error('提示消息', '按钮未绑定方法！');
    }
  }

  add() {
    this.inputModalModel = '';
    this.modalFormVisible = true;
    this.modalTitle = '线路分货比例 > 新增';
    this.status = 'add';
    this.modalValidateForm.reset();
    console.log(this.modalValidateForm.getRawValue());
    // this.inputModalModel = this.info.get('USER').companyName;
    // this.modalValidateForm.get('companyId').setValue( this.getcompanyId);
    this.modalValidateForm.get('provinceCode').enable();
    this.modalValidateForm.get('flowAddress').disable();
    this.modalValidateForm.get('loadPlace').disable();
    this.modalValidateForm.get('prodNames').enable();
  }

  addData(data: any) { // 添加数据
    data.startDate = format(data.startDate, 'YYYY-MM-DD HH:mm:ss');
    data.endDate = format(data.endDate, 'YYYY-MM-DD HH:mm:ss');
    this.cityArr.map(function (item) {
      if (item.code === data.flowAddress) {
        data.flowAddressName = item.name;
      }
    });
    if (data.loadPlaces) {
      data.loadPlaces = this.areaCheckAll ? [{'loadPlaceId': '全部', 'loadPlaceName': '全部'}]
        : data.loadPlaces.map((item) => {
          return {'loadPlaceId': item.code, 'loadPlaceName': item.name};
        });
    }
    if (data.prodNames) {
      data.prodNames = this.prodCheckAll ? [{'prodName': '全部'}] : data.prodNames.map((item) => {
        return {'prodName': item};
      });
    }
    if (!this.modalValidateForm.get('provinceCode').value || !this.modalValidateForm.get('flowAddress').value) {
      this.nzMess.warning('提示消息', '请选择省市!');
      return;
    }
    let ratio = 0;
    let error = [];
    this.dataSetDetailModal.some(
      value => {
        if (Number(value.fleetRatio) < 0) {
          error.push('比例不能为负数！');
          return true;
        }
        if (!value.fleetRatio) {
          error.push('请填写比例！');
          return true;
        }
        if (!value.consigneeId) {
          error.push('请选择车队！');
          return true;
        }
        ratio = Utils.add(ratio, value.fleetRatio);
        return false;
      }
    );
    if (error.length !== 0) {
      this.nzMess.warning('提示消息', error[0]);
      return;
    }
    if (ratio !== 100) {
      this.nzMess.warning('提示消息', '比例总和必须为100！');
      return;
    }
    data.tFleetRatioModels = this.dataSetDetailModal;

    this.modalOkLoading = true;

    this.http.post(urls.insertFleetRatioV2, data).then(res => {
        this.modalOkLoading = false;
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '添加成功！');
        } else {
          // this.nzMess.error('提示消息', '添加失败！');
        }
      }
    );
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
            }
              break;
          }
        }

      });
  }

  update() {  //修改

    this.modalValidateForm.reset();
    if (!this.selectData1 || !this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    if (!this.selectData1 || this.selectData1.length > 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作！'
      });
      return;
    }
    console.log(this.selectData1[0].loadPlace, this.selectData1[0].prodName);
    // this.inputModalModel = this.selectData1[0].companyName;
    this.modalFormVisible = true;
    this.modalTitle = '线路分货比例 > 修改';
    this.status = 'update';
    this.rowid = this.selectData1[0].rowid;
    const updateData = JSON.parse(JSON.stringify(this.selectData1[0]));
    console.log(updateData, 'test');
    updateData.consignee = updateData.consigneeId;
    // updateData.loadPlaces = updateData.loadPlace ? updateData.loadPlace : null;
    if (updateData.prodName === '全部,' || updateData.prodName === '全部') {
      updateData.prodNames = [];
      this.prodKindPriceArr.forEach(
        value => {
          updateData.prodNames.push(value.value);
        }
      );
    } else {
      updateData.prodNames = updateData.prodName ? updateData.prodName.split(',') : null;
    }

    this.modalValidateForm.patchValue(updateData);
    console.log(this.modalValidateForm, 'form');
    this.dataSetDetailModal = Utils.deepCopy(this.dataSet2);
    this.dataSetDetailModal.forEach(
      value => {
        value.selectedFiltersStatus = {consigneeId: true};
      }
    );
    this.modalValidateForm.get('provinceCode').disable();
    this.modalValidateForm.get('provinceCode').setValue(updateData.provinceCode);
    this.modalValidateForm.get('flowAddress').disable();
    this.modalValidateForm.get('flowAddress').setValue(updateData.flowAddress);
    this.modalValidateForm.get('loadPlace').disable();
    this.modalValidateForm.get('loadPlace').setValue(updateData.loadPlace);
    this.modalValidateForm.get('prodNames').disable();
  }


  updateData(data: any) { // 添加数据
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateFleetRatioV2;
    data.rowid = this.rowid;
    data.createId = this.selectData1[0].createId;
    data.startDate = format(data.startDate, 'YYYY-MM-DD HH:mm:ss');
    data.endDate = format(data.endDate, 'YYYY-MM-DD HH:mm:ss');
    // data.loadPlaces = data.loadPlace;
    // data.prodNames = data.prodNames;
    // if (!this.modalValidateForm.get('provinceCode').value || !this.modalValidateForm.get('flowAddress').value ) {
    //   this.nzMess.warning('提示消息', '请选择省市!');
    //   return;
    // }
    let ratio = 0;
    let error = [];
    this.dataSetDetailModal.some(
      value => {

        delete value.consignee;
        if (Number(value.fleetRatio) < 0) {
          error.push('比例不能为负数！');
          return true;
        }
        if (!value.fleetRatio) {
          error.push('请填写比例！');
          return true;
        }
        if (!value.consigneeId) {
          error.push('请选择车队！');
          return true;
        }
        ratio = Utils.add(ratio, value.fleetRatio);
        return false;
      }
    );
    if (error.length !== 0) {
      this.nzMess.warning('提示消息', error[0]);
      return;
    }
    if (ratio !== 100) {
      this.nzMess.warning('提示消息', '比例总和必须为100！');
      return;
    }
    data.tFleetRatioModels = this.dataSetDetailModal;
    if (data.prodNames.length === this.prodKindPriceArr.length) {
      data.prodNames = [{prodName: '全部'}];
    } else {
      data.prodNames = data.prodNames.map(item => {
        return {prodName: item};
      });
    }

    params.data = data;
    this.modalOkLoading = true;
    this.http.request(params).then(
      (res: any) => {
        this.modalOkLoading = false;
        if (res.success) {

          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '修改成功！');
          this.selectData1 = [];
        } else {
          // this.nzMess.error('提示消息', '修改失败！');
        }
      }
    );
  }

  delete() {
    if (this.selectData1.length < 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    // this.confimCon = '确定删除该条记录？';
    // this.tplModal = this.nzModal.create({
    //   nzTitle: this.confirmTitle,
    //   nzContent: this.confirmContent,
    //   nzFooter: this.confirmFooter
    // });
    this.selectedData = this.selectData1;

    this.nzModal.confirm({
      nzTitle: '提示信息',
      nzContent: '确定删除选中记录?',
      nzOnOk: () => this.deleteData()
    });
  }

  deleteData() {
    // 删除数据
    // this.status = '';
    const params = {url: '', data: {tFleetRatioModels: []}, method: 'POST'};
    params.url = urls.deleteFleetRatioV3;
    params.data.tFleetRatioModels = this.selectedData;
    return this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nzMess.success('提示消息', '删除成功！');
          this.selectData1 = [];
          // this.handleCancel();
        } else {
          // this.nzMess.error('提示消息', '删除失败！');
        }
      }
    );
  }

  handleCancel(): void {   //弹窗取消
    this.tplModal.destroy();
  }

  /**
   * 弹出框相关
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    const param = this.modalValidateForm.getRawValue();
    this.driverArr.forEach(item => {
      if (param.consignee == item.consigneeId) {
        param.consignee = item.consignee;
        param.consigneeId = item.consigneeId;
      }
    });
    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(param);
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(param);
    }
    if ('INVALID' === this.modalValidateForm.status && 'delete' === this.status) {
      this.deleteData();
    }
    // this.modalValidateForm.reset();
  }

  btnImport() {   //导入
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading = false;
    this.modalTitle = '线路分货比例 > 导入';
    this.tplModal = this.nzModal.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '35%',
      nzMaskClosable: false,
      nzClosable: false
    });
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  userColumnsEmit(data: any): void {
    this.columnsArr = data;
  }

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
    let _data = [];
    this.implistLoading = true;
    let headTemplate = ['流向', '产品', '运输车队', '中标比例', '开始日期', '结束日期', '卸货地'];
    this.xlsx.import(this.importFile, true).then((data: any) => {
      let keys = Object.keys(data);
      // _data.push(data[keys[i]]);
      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error('提示信息', '未读取到sheet页！读取数据Excel失败！');
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
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let flag = true;
    if (head.length != receiptHead.length) {
      flag = false;
    }
    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        flag = false;
        return;
      }
    });
    if (!flag) {
      this.nzMess.remove();
      this.nzMess.error('提示信息', '模板不匹配，请选择正确模板！');
      this.importLoading = false;
    }
    return flag;
  }


  excelFilter(data: any) {
    let url = urls.importFleetRatio;
    let param: any = {tFleetRatioModels: []};
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
      param.tFleetRatioModels.push(temp);
    }

    param.tFleetRatioModels.forEach((item) => {
      item.creatDate = item.creatDate && Utils.format(item.creatDate);
      item.collectionDate = item.collectionDate && Utils.format(item.collectionDate);
      item.flowConfirmationTime = item.flowConfirmationTime && Utils.format(item.flowConfirmationTime);
    });
    this.http.post(url, param).then((res: any) => {
      this.implistLoading = false;
      if (res.success) {
        this.tplModal.destroy();
        this.nzMess.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.listSearch({page: 1, length: this.pageSize});
      }
    });

  }

  patchEname(cName: any) {
    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() == cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  };

  selectData(data: any) { // 主列表数据多选框选择
    this.selectData1 = data;
    this.getSublist();
  }

  closeResult() {
    this.modalValidateForm.reset();
    this.areaCheckAll = false;
    this.prodCheckAll = false;
    this.dataSetDetailModal = [];
  }

  addhandleCancel() {
    this.modalFormVisible = false;
  }

  disabledStartDate = (startValue: Date): boolean => {   //时间判断结束大于开始
    if (!startValue || !this.modalValidateForm.value.endDate) {
      return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000);
    }
    if (typeof this.modalValidateForm.value.endDate === 'string') {
      let data = new Date(Date.parse(this.modalValidateForm.value.endDate));
      this.modalValidateForm.value.endDate = data;
    }
    return (startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000)) || (startValue.getTime() > this.modalValidateForm.value.endDate.getTime());

  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.modalValidateForm.value.startDate) {
      return false;
    }
    if (typeof this.modalValidateForm.value.startDate === 'string') {
      let data = new Date(Date.parse(this.modalValidateForm.value.startDate));
      this.modalValidateForm.value.startDate = data;
    }
    return endValue.getTime() <= this.modalValidateForm.value.startDate.getTime();
  };

  inpEmit(data: any) {
    this.modalValidateForm.get('companyName').setValue(data.inpValue);
  }

  getStatic(): void {

    this.http.post(urls.selectProdNew, {}).then(
      (res: any) => {
        if (res.success) {
          let arr = [];
          res.data.data.forEach(item => {
            arr.push({name: item.prodKindPriceOut, value: item.prodKindPriceOut});
          });
          this.prodKindPriceArr = [...arr];
        }
      }
    );
  }

  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          value && this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.modalValidateForm.get('flowAddress').reset({value: null, disabled: false},);
          this.modalValidateForm.get('loadPlace').reset({value: null, disabled: true},);
        }

      }
        break;
      case 'DZDJ20': {
        if (value) {
          value && this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.modalValidateForm.get('loadPlace').reset({value: null, disabled: false},);
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          value && this.getAddressData({level: 'DZDJ40', parentCode: value});
        }
      }
        break;
      case 'DZDJ40': {
      }
        break;
    }
  }

  getDriver() {
    let url = urls.selectDriver;
    this.http.post(url, {}).then((res: any) => {
      if (res.success) {
        res.data.data.forEach(item => {
          this.driverArr.push({consignee: item.shortName, consigneeId: item.companyId});
        });
      }
    });


  }

  getDriverNew(columns: Array<any>) {
    let url = urls.selectDriver;
    this.http.post(url, {}).then((res: any) => {
      if (res.success) {
        columns.forEach(
          value => {
            if (value.colEname === 'consigneeId') {
              res.data.data.forEach(item => {
                value.apiParameter.optionList.push({name: item.companyName, value: item.companyId});
              });
            }
          }
        );

      }
    });


  }


  /**
   * @param value 卸货地的值
   */
  areaChange(value: any): void {
    if (!value) {
      return;
    }
    if (value.length !== this.areaArr.length) {
      this.areaCheckAll = false;
    } else {
      this.areaCheckAll = true;
    }
  }

  /**
   * 卸货地全选
   */
  checkAllAreas(): void {
    const area = this.modalValidateForm.controls['loadPlaces'];
    if (area.value && (area.value.length === this.areaArr.length)) {
      area.setValue([]);
      this.areaCheckAll = false;
    } else {
      area.setValue(this.areaArr);
      this.areaCheckAll = true;
    }
  }

  /**
   * @param value 产品的值
   */
  prodChange(value: any): void {
    if (!value) {
      return;
    }
    if (value.length !== this.prodKindPriceArr.length) {
      this.prodCheckAll = false;
    } else {
      this.prodCheckAll = true;
    }
  }

  /**
   * 卸货地全选
   */
  checkAllProd(): void {
    const prod = this.modalValidateForm.controls['prodNames'];
    if (prod.value && (prod.value.length === this.prodKindPriceArr.length)) {
      prod.setValue([]);
      this.prodCheckAll = false;
    } else {
      const valueArr = this.prodKindPriceArr.map(item => item.value);
      prod.setValue(valueArr);
      this.prodCheckAll = true;
    }
  }

  /**
   * grid高度
   * @param data
   */
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

  pageIndexEmit($event: any) {

  }

  pageSizeEmit($event: any) {

  }

  /**
   * 弹窗明细修改
   * @param type
   */
  editDetails(type: string): void {
    switch (type) {
      case 'add': {
        this.dataSetDetailModal = [...this.dataSetDetailModal, {selectedFiltersStatus: {consigneeId: true}}];
      }
        break;
      case 'delete': {
        if (this.selectDataDetailModal.length === 0) {
          this.nzMess.warning('提示消息', '请选择数据后操作');
          return;
        }
        this.selectDataDetailModal.forEach(
          value => {
            this.dataSetDetailModal = this.dataSetDetailModal.filter(
              value1 => value1 !== value
            );
          }
        );
      }
        break;
    }
  }

  updateDataResultModal(selectData: Array<any>): void {
    this.selectDataDetailModal = selectData;
  }

  getSublist(): void {
    if (this.selectData1.length === 0) {
      this.dataSet2 = [];
      return;
    }
    this.listLoading2 = true;
    const param = {
      tFleetRatioModels: []
    };
    param.tFleetRatioModels = this.selectData1;
    this.http.post(urls.getFleetRatioItem, param).then(
      res => {
        this.listLoading2 = false;
        if (res.success) {
          this.dataSet2 = res.data.data || [];
        }
      }
    );
  }

  columnsDetailModalChange(columns: Array<any>) {
    console.log(columns);
    this.getDriverNew(columns);

  }

  inpModalEmit(param: any) {
    console.log(param, 'test');
  }
}
