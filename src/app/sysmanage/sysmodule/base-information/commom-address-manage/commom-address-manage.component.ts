import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {urls} from '@model/url';

@Component({
  selector: 'app-commom-address-manage',
  templateUrl: './commom-address-manage.component.html',
  styleUrls: ['./commom-address-manage.component.css']
})
export class CommomAddressManageComponent implements OnInit {

  modalFormVisible: boolean = false; //  表单弹窗
  modalValidateForm: FormGroup;
  deleteVisible: boolean = false; //  确认弹窗
  modalTitle: string; //  删除弹窗标题
  deleteCon: string; //  删除弹窗文字内容
  dataSet: Array<any>;
  pageSize: number = 30; //  条数
  totalPage: number;  // 数据总条数
  listLoading: boolean = true;//表格是否在加载中
  selectedData: Array<any> = [];
  searchData: any;  //存储查询的数据
  private status: string;// add添加，update更新
  private rowid: number;
  private tplModal: NzModalRef;
  showExplainFlag: boolean = false;

  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  townArr: Array<any> = [];
  tempData: any;
  provinceName: string = '';
  cityName: string = '';
  districtName: string = '';
  townName: string = '';
  provinceMap: { [key: string]: string } = {};
  cityMap: { [key: string]: string } = {};
  areaMap: { [key: string]: string } = {};
  townMap: { [key: string]: string } = {};
  customerCode: any;
  customerName:any = '';
  endPoint:any;

  modalFormData: Array<any> = [
    {
      name: '省名称', eName: 'provinceCode', type: 'province', require: true, validateCon: '请输入省',
      disabled: false
    },
    {
      name: '市名称', eName: 'cityCode', type: 'city', require: true, validateCon: '请输入市',
      disabled: true
    },
    {
      name: '区名称', eName: 'districtCode', type: 'area', require: true, validateCon: '请输入区',
      disabled: true
    },
    {
      name: '乡名称', eName: 'townCode', type: 'town', require: false, validateCon: '请输入乡',
      disabled: true
    },
    {
      name: '地址', eName: 'locationName', type: 'text1', require: false, validateCon: '请输入详细地址',
      disabled: false
    },
    {
      name: '详细地址', eName: 'address', type: 'text', require: true, validateCon: '请输入详细地址',
      disabled: false
    },
    {
      name: '客户名称', eName: 'customerId', type: 'popTwo', validateCon: '请选择客户', require: true,
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
      }
    },

    {
      name: '是否默认地址', eName: 'isDefault', type: 'radio', validateCon: '请选择是否为默认地址', require: true,
      validators: {
        require: true,
        pattern: false,
      },
      radioArr: [{value: '10', name: '是'}, {value: '00', name: '否'}]
    },


  ];


  constructor(private httpUtilService: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private nn: NzNotificationService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    this.getAddressData({level: 'DZDJ10'});

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];

    this.modalValidateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: null, disabled: control.disabled}, control.require ? Validators.required : null
      ));
    }
  }


  listSearch(param: any) { //列表查询
    param.page = param.page || 1;
    param.length = param.length || this.pageSize;
    this.searchData = param; //查询的数据存储
    this.listLoading = true;
    this.getListSearch(param);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.getCommonAddress;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  btnAdd(): void { //添加
    this.modalFormVisible = true;
    this.modalTitle = '常用地址 > 添加';
    this.status = 'add';
  };

  btnUpdate(data: any): void { //修改
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
    this.modalTitle = '常用地址 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
    this.customerName = data.data[0].customerName;
    this.endPoint = data.data[0].endPoint;
  }

  btnDelete(data: any): void { //删除
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }
    this.selectedData = data.data;
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除此条记录?';
    this.status = 'delete';
  }

  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.addCommonAddress;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        }
      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateCommonAddress;
    data.rowid = this.rowid;
    params.data = data;
    params.data['endPoint'] = this.endPoint;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tCommonAddressModels: []}, method: 'POST'};
    params.url = urls.deleteCommonAddress;
    params.data.tCommonAddressModels = this.selectedData;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.nn.success('提示消息', '删除成功！');
          this.listSearch(this.searchData);
        }
      }
    );
  }


  /**
   * 公司设置值
   * @param data
   */
  inpEmitTwo(data: any) {
    this.customerName = data.inpName || '';
    this.customerCode = data.inpValue || '';
    data.selData && data.selData[0] && this.modalValidateForm.get('customerId').setValue(data.selData[0].companyId);
  }


  // 删除框确认
  modalConfirmResult(data: any) {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;
  }

  handleOk(): void {

    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('INVALID' === this.modalValidateForm.status) {
      return;
    }
    let params = this.modalValidateForm.getRawValue();
    params.provinceName = this.provinceMap[params.provinceCode];
    params.cityName = this.cityMap[params.cityCode];
    params.districtName = this.areaMap[params.districtCode];
    params.townName = this.townMap[params.townCode];

    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(params);
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(params);
    }
  }

  handleCancel(): void {
    this.modalFormVisible = false;
  }

  closeResult(): void {
    this.modalValidateForm.reset();
    this.customerCode = '';
    this.customerName = '';
  }

  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 3000);
  }

  //获取地址信息
  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.httpUtilService.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ10': {
              this.provinceArr = res.data.data;
              this.provinceArr.forEach(
                map => {
                  this.provinceMap[map.code] = map.name;
                }
              );
            }
              break;
            case 'DZDJ20': {
              this.cityArr = res.data.data;
              this.cityArr.forEach(
                map => {
                  this.cityMap[map.code] = map.name;
                }
              );
            }
              break;
            case 'DZDJ30': {
              this.areaArr = res.data.data;
              this.areaArr.forEach(
                map => {
                  this.areaMap[map.code] = map.name;
                }
              );
            }
              break;
            case 'DZDJ40': {
              this.townArr = res.data.data;
              this.townArr.forEach(
                map => {
                  this.townMap[map.code] = map.name;
                }
              );
            }
              break;
          }
          this.locationName('address');
        }
      }
    );
  }

  // 地点更改
  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          value && this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.modalValidateForm.get('cityCode').reset({value: null, disabled: false},);
          this.modalValidateForm.get('districtCode').reset({value: null, disabled: true},);
          this.modalValidateForm.get('townCode').reset({value: null, disabled: true},);
        }

      }
        break;
      case 'DZDJ20': {
        if (value) {
          value && this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.modalValidateForm.get('districtCode').reset({value: null, disabled: false},);
          this.modalValidateForm.get('townCode').reset({value: null, disabled: true},);
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          value && this.getAddressData({level: 'DZDJ40', parentCode: value});
          this.modalValidateForm.get('townCode').reset({value: null, disabled: false},);
        }
      }
        break;
      case 'DZDJ40': {
        this.locationName('address');
      }
        break;
    }

  }

  // 地址名称值设置
  locationName(eName: string) {
    if (eName !== 'address') {
      return;
    }
    const modalFormData = this.modalValidateForm.getRawValue();
    const provinceName = this.provinceMap[modalFormData.provinceCode] || '';
    const cityName = this.cityMap[modalFormData.cityCode] || '';
    const areaName = this.areaMap[modalFormData.districtCode] || '';
    const townName = this.townMap[modalFormData.townCode] || '';
    if (modalFormData.address) {
      if (!modalFormData.address.includes(cityName)) {

        this.modalValidateForm.get('locationName').setValue(provinceName + cityName + areaName + townName + modalFormData.address);
      } else {
        this.modalValidateForm.get('locationName').setValue(modalFormData.address);
      }
    } else {
      this.modalValidateForm.get('locationName').setValue(provinceName + cityName + areaName + townName);
    }
  }


}
