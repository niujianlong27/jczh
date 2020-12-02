import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';
import {urls} from '@model/url';

@Component({
  selector: 'app-basic-bank-information',
  templateUrl: './basic-bank-information.component.html',
  styleUrls: ['./basic-bank-information.component.css']
})
export class BasicBankInformationComponent implements OnInit {

  pageSize: number = 30; //条数
  dataSet: Array<any> = []; //列表数据
  totalPage: number = 0; //数据总数
  listLoading: boolean = true; //list加载
  searchData: any; // 搜索数据
  selectData: Array<any> = [];
  modalFormVisible: boolean;
  modalTitle: string;
  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    {
      name: '业务公司ID', eName: 'companyId', type: 'text', validateCon: '请输入界面ID', require: true, disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '业务公司名称', eName: 'companyName', type: 'modal', validateCon: '请输入界面ID', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '银行名称', eName: 'bankName', type: 'bankName', validateCon: '请输入界面ID', require: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '银行支行名称', eName: 'bankSubbranchName', type: 'bankSubbranchName', validateCon: '请输入界面ID', require: true, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '联行号', eName: 'accountJoint', type: 'text', validateCon: '请输入界面ID', require: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '银行省份', eName: 'bankProvince', type: 'province', validateCon: '请输入界面ID', require: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '银行城市', eName: 'bankCity', type: 'city', validateCon: '请输入界面ID', require: true, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];
  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  townArr: Array<any> = [];
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  borderRed: boolean;
  borderRed2: boolean = false;

  inputModalModel: string;


  private buttonId: string = '';
  bankBaseList: Array<any> = [];
  bankSubbranchNameList: Array<any> = [];


  constructor(
    private http: HttpUtilService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private info: UserinfoService,
    private nn: NzNotificationService
  ) {
  }

  ngOnInit() {

    this.listSearch({page: 1, length: this.pageSize});

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(
      res => {
        const validatorOrOpts: Array<any> = [];
        res.validators.require ? validatorOrOpts.push(Validators.required) : null;
        this.modalValidateForm.addControl(res.eName, new FormControl(
          {value: '', disabled: res.disabled}, validatorOrOpts
        ));
      }
    );

    this.getAddressData({level: 'DZDJ10'});
    this.selectBankBase();
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    this.listLoading = true; //list加载
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = param;
    this.getListSearch(param);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    this.http.post(urls.selectBasicBankInformation, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
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
    this.buttonId = param.type.buttonId;
    switch (this.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Update':
        if (this.selectData.length !== 1) {
          this.nn.warning('提示消息', '请选择一条数据进行修改!');
          return;
        }
        this.btnUpdate();
        break;
      case 'Delete':
        this.btnDelete();
        break;
    }
  }


  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
      this.borderRed = !this.inputModalModel;
    }

    if (this.modalValidateForm.status === 'VALID' && this.buttonId === 'Add') {
      this.addData();
    }
    if (this.modalValidateForm.status === 'VALID' && this.buttonId === 'Update') {
      this.updateData();
    }


  }

  handleCancel() {
    this.modalFormVisible = false;

  }

  closeResult() {
    this.modalValidateForm.reset();
    this.modalValidateForm.get('bankCity').reset({value: null, disabled: true});
    this.modalValidateForm.get('bankSubbranchName').reset({value: null, disabled: true});
    this.inputModalModel = '';
  }

  /**
   * 添加
   */
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '银行基础信息 > 新增';
  }

  /**
   * 添加请求
   */
  addData(): void {
    const param = this.modalValidateForm.getRawValue();
    this.http.post(urls.insertBasicBankInformation, param).then(
      res => {
        if (res.success) {
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功!');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 修改
   */
  btnUpdate(): void {
    this.modalFormVisible = true;
    this.modalTitle = '银行基础信息 > 修改';
    this.modalValidateForm.patchValue(this.selectData[0]);
    this.inputModalModel = this.selectData[0].companyName;
  }

  /**
   * 修改请求
   */
  updateData(): void {
    const param = this.modalValidateForm.getRawValue();
    param.rowid = this.selectData[0].rowid;
    this.http.post(urls.updateBasicBankInformation, param).then(
      res => {
        if (res.success) {
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功!');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  btnDelete(): void {
    this.nm.confirm(
      {
        nzTitle: '提示消息',
        nzContent: '确认删除选择数据?',
        nzOnOk: () => this.deleteData()
      }
    );

  }

  deleteData(): Promise<any> {
    const param = {bankIds: []};
    this.selectData.forEach(
      res => {
        param.bankIds.push({rowid: res.rowid});
      }
    );
    return this.http.post(urls.deleteCollectOperationteam, param).then(
      res => {
        if (res.success) {
          this.modalFormVisible = false;
          this.selectData = [];
          this.nn.success('提示消息', '删除成功!');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 地址获取
   * @param data
   */
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

  /**
   * 省市区修改
   * @param value
   * @param name
   */
  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.modalValidateForm.get('bankCity').reset({value: null, disabled: false});
        }

      }
        break;
      case 'DZDJ20': {
        if (value) {
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
        }
      }
        break;
      case 'DZDJ40': {
      }
        break;
    }
  }

  /**
   * 业务公司选择
   * @param param
   */
  inpEmit(param: any) {
    this.modalValidateForm.patchValue({
      companyId: param.inpValue,
      companyName: param.inpName
    });

    this.borderRed2 = !param.inpValue;
  }

  /**
   * 银行获取
   */
  selectBankBase(): void {
    this.http.post(urls.selectBankBase, {}).then(
      res => {
        if (res.success) {
          this.bankBaseList = res.data.data;
        }
      }
    );

  }

  /**
   * 银行支行获取
   */
  selectBank(param: string): void {
    this.modalValidateForm.get('bankSubbranchName').reset({value: null, disabled: false});
    this.http.post(urls.selectBank, {bankId: param}).then(
      res => {
        if (res.success) {
          this.bankSubbranchNameList = res.data.data;
        }
      }
    );

  }

  /**
   * 银行更改
   * @param param
   */
  bankBaseChange(param: any) {
    if (param) {
      this.selectBank(param);
    }
  }

}
