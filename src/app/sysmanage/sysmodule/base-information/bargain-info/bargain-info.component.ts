import {Component, OnInit} from '@angular/core';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '@util/utils';
import {localUrls} from '@model/localUrls';

@Component({
  selector: 'app-bargain-info',
  templateUrl: './bargain-info.component.html',
  styleUrls: ['./bargain-info.component.css']
})
export class BargainInfoComponent implements OnInit {

  pageSize: number = 30; //条数
  dataSet: Array<any> = []; //列表数据
  totalPage: number = 0; //数据总数
  listLoading: boolean = false; //list加载
  searchData: any; // 搜索数据
  selectData: Array<any> = [];

  private buttonId: string = '';

  modalFormVisible: boolean;
  modalTitle: string;
  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [

    {
      name: '发货通知单号', eName: 'deliveryNoticeNo', type: 'text', validateCon: '请输入发货通知单号', require: true, disabled: false,
      validators: {
        require: true,
        pattern: true,
        patternStr: '^[a-zA-Z0-9]+$',
        patternErr: '只支持输入数字或字母'
      }
    },
    {
      name: '原价格', eName: 'originalPrice', type: 'number', validateCon: '请输入原价格', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '车队价格', eName: 'price', type: 'number', validateCon: '请输入车队价格', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '应收含税价格', eName: 'recPriceTax', type: 'number', validateCon: '请输入应收含税价格', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    }, {
      name: '市场价格', eName: 'marketPrice', type: 'number', validateCon: '请输入市场价格', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '省名称', eName: 'provinceCode', type: 'province', validateCon: '请选择省', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '市名称', eName: 'cityCode', type: 'city', validateCon: '请选择市', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '区名称', eName: 'districtCode', type: 'area', validateCon: '请选择区', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '乡名称', eName: 'townCode', type: 'town', validateCon: '请选择乡', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },

    // {
    //   name: '单车价格', eName: 'vehiclePrice', type: 'number', validateCon: '请输入界面ID', require: false, disabled: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '参考区域', eName: 'referenceArea', type: 'text', validateCon: '请输入界面ID', require: false, disabled: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '参考区域不含税价格', eName: 'referencePrice', type: 'number', validateCon: '请输入界面ID', require: false, disabled: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '参考区域含税价格', eName: 'referencePriceTax', type: 'number', validateCon: '请输入界面ID', require: false, disabled: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '申请日期', eName: 'submitDate', type: 'date', validateCon: '请输入界面ID', require: false, disabled: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '执行日期', eName: 'executionDate', type: 'date', validateCon: '请输入界面ID', require: false, disabled: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },


  ];

  provinceMap: Map<string, string> = new Map<string, string>();
  cityMap: Map<string, string> = new Map<string, string>();
  districtMap: Map<string, string> = new Map<string, string>();
  townMap: Map<string, string> = new Map<string, string>();

  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  townArr: Array<any> = [];

  rowid: string = '';

  constructor(
    private http: HttpUtilService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private nn: NzNotificationService
  ) {
  }

  ngOnInit() {
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});

    this.modalFormData.forEach(
      res => {
        const validatorOrOpts: Array<any> = [];
        res.validators.require ? validatorOrOpts.push(Validators.required) : null;
        res.validators.pattern ? validatorOrOpts.push(Validators.pattern(res.validators.patternStr)) : null;

        this.modalValidateForm.addControl(res.eName, new FormControl(
          {value: '', disabled: res.disabled}, validatorOrOpts
        ));
      }
    );

    this.getAddressData({level: 'DZDJ10'});
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    this.listLoading = true; //list加载
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = {...param};
    this.getListSearch(param);
  }

  /**
   * 列表查询数据获取
   * @param data
   */
  getListSearch(data: any): void {
    this.listLoading = true;
    this.http.post(localUrls.bargainInfoGetPage, data).then(
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
      case 'Add': {
        this.btnAdd();
      }
        break;
      case 'Update': {
        this.btnUpdate();
      }
        break;
      case 'Delete': {
        this.btnDelete();
      }
        break;
      case 'use': {
        this.isUse();
      }
        break;
      case 'unuse': {
        this.isNotUse();
      }
        break;
    }
  }

  /**
   * 添加事件
   */
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '一单一议 > 新增';
  }

  /**
   * 修改
   */
  btnUpdate(): void {
    if (this.selectData.length !== 1) {
      this.nn.warning('提示消息', '请选择一条数据后操作!');
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = '一单一议 > 修改';
    this.modalValidateForm.patchValue(this.selectData[0]);
    this.rowid = this.selectData[0].rowid;
  }

  /**
   * 弹窗关闭
   */
  btnDelete(): void {
    if (this.selectData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作!');
      return;
    }

    this.nm.confirm(
      {
        nzTitle: '一单一议 > 删除',
        nzContent: '是否确认删除当前选中数据？',
        nzOnOk: () => this.deleteData()
      }
    );
  }

  /**
   * 状态修改
   */
  isUse(): void {
    let istrue = true;
    if (this.selectData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作!');
      return;
    }
    let data = [];
    const param = this.selectData.map(item => {
      if (item.status !== 'YJSY10' && istrue) {  //YJSY10 未使用
        istrue = false;
        return this.nn.warning('提示消息', '所选数据中存在未使用数据!');
      } else {
        data.push({
          rowid: item.rowid,
          status: item.status
        });
      }
    });

    istrue && this.nm.confirm(
      {
        nzTitle: '一单一议 > 状态修改',
        nzContent: '是否确认修改当前选中数据的状态？',
        nzOnOk: () => this.isUseData(localUrls.updateIfUse, data)
      }
    );
  }

  /**
   * 状态修改
   */
  isNotUse(): void {
    let istrue = true;
    let data = [];
    if (this.selectData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作!');
      return;
    }
    this.selectData.forEach(item => {
      if (item.status !== 'YJSY20' && istrue) {  //YJSY20 使用
        istrue = false;
        return this.nn.warning('提示消息', '所选数据中存在已使用数据!');
      } else {
        data.push({
          rowid: item.rowid,
          status: item.status
        });
      }
    });
    istrue && this.nm.confirm(
      {
        nzTitle: '一单一议 > 状态修改',
        nzContent: '是否确认修改当前选中数据的状态？',
        nzOnOk: () => this.isUseData(localUrls.updateIfUseTwo, data)
      }
    );
  }

  /**
   * 状态使用
   */
  isUseData(url: any, data): Promise<any> {
    return this.http.post(url, {bargainInfoModelList: data}).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '状态修改成功!');
          this.listSearch(this.searchData);
          return true;
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 删除请求
   */
  deleteData(): Promise<any> {
    const param = {bargainInfos: this.selectData};
    const url = localUrls.bargainInfoDeleteList;
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '删除成功!');
          this.listSearch(this.searchData);
          return true;
        } else {
          return false;
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
              this.provinceArr.forEach(
                value => this.provinceMap.set(value.code, value.name)
              );
            }
              break;
            case 'DZDJ20': {
              this.cityArr = res.data.data;
              this.cityMap.clear();
              this.cityArr.forEach(
                value => this.cityMap.set(value.code, value.name)
              );
            }
              break;
            case 'DZDJ30': {
              this.areaArr = res.data.data;
              this.districtMap.clear();
              this.areaArr.forEach(
                value => this.districtMap.set(value.code, value.name)
              );
            }
              break;
            case 'DZDJ40': {
              this.townArr = res.data.data;
              this.townMap.clear();
              this.townArr.forEach(
                value => this.townMap.set(value.code, value.name)
              );
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
          this.modalValidateForm.get('cityCode').reset({value: null, disabled: false});
          this.modalValidateForm.get('districtCode').reset({value: null, disabled: true});
          this.modalValidateForm.get('townCode').reset({value: null, disabled: true});
        }

      }
        break;
      case 'DZDJ20': {
        if (value) {
          this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.modalValidateForm.get('districtCode').reset({value: null, disabled: false});
          this.modalValidateForm.get('townCode').reset({value: null, disabled: true});
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value});
          this.modalValidateForm.get('townCode').reset({value: null, disabled: false});
        }
      }
        break;
      case 'DZDJ40': {
      }
        break;
    }
  }

  /**
   * 弹窗确认
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }

    if (this.modalValidateForm.status === 'VALID' && this.buttonId === 'Add') {
      this.addData();
    }
    if (this.modalValidateForm.status === 'VALID' && this.buttonId === 'Update') {
      this.updateData();
    }

  }

  /**
   * 添加请求
   */
  addData(): void {
    const param = this.modalValidateForm.getRawValue();
    param.submitDate = param.submitDate && param.submitDate instanceof Date ? Utils.dateFormat(param.submitDate, 'yyyy-MM-dd HH:mm:ss') : param.submitDate || '';
    param.executionDate = param.executionDate && param.executionDate instanceof Date ? Utils.dateFormat(param.executionDate, 'yyyy-MM-dd HH:mm:ss') : param.executionDate || '';
    param.provinceName = this.provinceMap.get(param.provinceCode) || '';
    param.cityName = this.cityMap.get(param.cityCode) || '';
    param.districtName = this.districtMap.get(param.districtCode) || '';
    param.townName = this.townMap.get(param.townCode) || '';
    const url = localUrls.bargainInfoInsert;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '新增成功!');
          this.modalFormVisible = false;
          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   * 修改请求
   */
  updateData(): void {
    const param = this.modalValidateForm.getRawValue();
    param.submitDate = param.submitDate && param.submitDate instanceof Date ? Utils.dateFormat(param.submitDate, 'yyyy-MM-dd HH:mm:ss') : param.submitDate || '';
    param.executionDate = param.executionDate && param.executionDate instanceof Date ? Utils.dateFormat(param.executionDate, 'yyyy-MM-dd HH:mm:ss') : param.executionDate || '';
    param.provinceName = this.provinceMap.get(param.provinceCode) || '';
    param.cityName = this.cityMap.get(param.cityCode) || '';
    param.districtName = this.districtMap.get(param.districtCode) || '';
    param.townName = this.townMap.get(param.townCode) || '';
    param.rowid = this.rowid || '';
    const url = localUrls.bargainInfoUpdate;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '修改成功!');
          this.modalFormVisible = false;
          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.modalFormVisible = false;

  }

  /**
   * 弹窗关闭后回调
   */
  closeResult() {
    this.modalValidateForm.reset();
    this.modalValidateForm.get('cityCode').reset({value: null, disabled: true});
    this.modalValidateForm.get('districtCode').reset({value: null, disabled: true});
    this.modalValidateForm.get('townCode').reset({value: null, disabled: true});
    this.rowid = '';
  }

}
