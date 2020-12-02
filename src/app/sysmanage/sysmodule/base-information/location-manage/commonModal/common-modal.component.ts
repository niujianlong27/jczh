/**
 * 地址管理 按钮新增，修改共用组件
 */
import { Component, Input, Output, EventEmitter } from  '@angular/core';
import {urls} from '@model/url';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import { environment } from '@env/environment';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
    selector: 'location-manage-modal',
    templateUrl: './common-modal.component.html',
    styles: []
  })

  export class CommonModalComponent{
    @Input() params: any = {};//传入的参数
    @Input() status: string;//add update
    @Input() rowid: string;
    @Input() set visible(val:boolean){
        this.modalFormVisible = val;
        this.visibleChange.emit(this.modalFormVisible);
        if(!val) return;
        window.setTimeout(() => {
          if(this.status === 'add'){
            this.title = '地址新增';
            this.validateForm.get('companyId').setValue(this.params.companyId);
          }else if(this.status === 'update'){
            this.title = '地址修改';
            this.validateForm.patchValue(this.params);
          }
        },50)
        
    }
    get visible(){
        return this.modalFormVisible;
    }
    @Output() visibleChange = new EventEmitter();
    @Output() updateList = new EventEmitter<string>();
 // 弹窗数据相关
 private modalFormVisible: boolean;
 loading: boolean;
 title: string;
 radioArr: Array<any> = [];
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
 controlArray: Array<any> = [
   {
     cName: '公司ID', eName: 'companyId', type: 'text', require: true, validateCon: '请输入界面ID',
     disabled: true, hidden: true
   },
   // {
   //   cName: '公司名称', eName: 'companyName', type: 'text', require: true, validateCon: '请输入界面ID',
   //   disabled: false, hidden: true
   // },
   {
     cName: '省名称', eName: 'provinceCode', type: 'province', require: true, validateCon: '请输入省',
     disabled: false
   },
   {
     cName: '市名称', eName: 'cityCode', type: 'city', require: true, validateCon: '请输入市',
     disabled: true
   },
   {
     cName: '区名称', eName: 'districtCode', type: 'area', require: true, validateCon: '请输入区',
     disabled: true
   },
   {
     cName: '乡名称', eName: 'townCode', type: 'town', require: false, validateCon: '请输入乡',
     disabled: true
   },
   {
     cName: '详细地址', eName: 'address', type: 'text', require: true, validateCon: '请输入详细地址',
     disabled: false, span: 16, span1: 3, span2: 21
   },
   {
     cName: '地址名称', eName: 'locationName', type: 'text', require: true, validateCon: '请输入地址名称',
     disabled: true, span: 24, span1: 2, span2: 22
   },
   {
     cName: '经度', eName: 'longitude', type: 'number', require: false, validateCon: '请输入界面ID',
     disabled: false, span: 10
   },

   {
     cName: '纬度', eName: 'latitude', type: 'number', require: false, validateCon: '请输入界面ID',
     disabled: false, span: 10
   },
   // {
   //   cName: '地点名称', eName: 'locationName', type: 'text', require: false, validateCon: '请输入界面ID',
   //   disabled: false
   // },
   {
     cName: '基准公里数', eName: 'standKilo', type: 'inputNumber', require: false, validateCon: '请输入基准公里数',
     disabled: false, span: 10
   },
   {
     cName: '备注', eName: 'remark', type: 'text', require: false, validateCon: '请输入界面ID',
     disabled: false, span: 10
   },
   // {
   //   cName: '围栏参数', eName: 'fenceParam', type: 'text', require: false, validateCon: '请输入界面ID',
   //   disabled: false
   // },
   // {
   //   cName: '类型', eName: 'type', type: 'radio', require: true, validateCon: '请选择类型', radioArr: this.radioArr,
   //   disabled: false
   // },
   //
   //
   // {
   //   cName: '区域', eName: 'area', type: 'text', require: false, validateCon: '请输入界面ID',
   //   disabled: false
   // },
 ];
 validateForm: FormGroup;
   constructor(private httpUtilService: HttpUtilService, private fb: FormBuilder, private nn: NzNotificationService){}
   ngOnInit(){
    this.getAddressData({level: 'DZDJ10'});
    // this.getStatic(this.radioArr, 'DDLX');
    this.validateForm = this.fb.group({});
    for (const control of this.controlArray) {
      this.validateForm.addControl(control.eName, new FormControl(
        {value: null, disabled: control.disabled}, control.require ? Validators.required : null
      ));
    }
   }
  /**
   * 获取地址信息
   * @param data
   */
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

  /**
   * 地点更改
   * @param value
   * @param name
   */
  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          value && this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.validateForm.get('cityCode').reset({value: null, disabled: false},);
          this.validateForm.get('districtCode').reset({value: null, disabled: true},);
          this.validateForm.get('townCode').reset({value: null, disabled: true},);
        }

      }
        break;
      case 'DZDJ20': {
        if (value) {
          value && this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.validateForm.get('districtCode').reset({value: null, disabled: false},);
          this.validateForm.get('townCode').reset({value: null, disabled: true},);
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          value && this.getAddressData({level: 'DZDJ40', parentCode: value});
          this.validateForm.get('townCode').reset({value: null, disabled: false},);
        }
      }
        break;
      case 'DZDJ40': {
        this.locationName('address');
      }
        break;
    }

  }


  /**
   * 获取静态数据
   * @param data
   * @param valueSetCode
   */
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.httpUtilService.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }


  handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if ('VALID' === this.validateForm.status && 'add' === this.status) {
      this.addDate(this.validateForm.getRawValue());
    }
    if ('VALID' === this.validateForm.status && 'update' === this.status) {
      this.updateData(this.validateForm.getRawValue());
    }
  }

  closeResult() {
    this.validateForm.reset({});
    this.validateForm.get('cityCode').reset({value: null, disabled: true});
    this.validateForm.get('districtCode').reset({value: null, disabled: true});
    this.validateForm.get('townCode').reset({value: null, disabled: true});
    this.cityArr = [];
    this.areaArr = [];
    this.townArr = [];
  }

  // handleCancel() {
  //   this.modalFormVisible = false;
  // }
  /**
   * 添加数据
   */
  addDate(data): void {

    data.provinceName = this.provinceMap[data.provinceCode];
    data.cityName = this.cityMap[data.cityCode];
    data.districtName = this.areaMap[data.districtCode];
    data.townName = this.townMap[data.townCode];
    this.loading = true;
    this.httpUtilService.post(`${environment.baseUrl}point/insertPoint`, data).then(
      res => {
        this.loading = false;
        if (res.success) {
          this.visible = false;
          this.updateList.emit('add');
          this.nn.success('提示消息', res.data.msg);
         // this.listSearch({page: 1, length: this.pageSize});
        //  this.getListSearch(this.searchData);
        }
      }
    );
  }
  
  /**
   * 修改数据
   */
  updateData(data): void {
    const param = data;
    param.rowid = this.rowid;
    param.provinceName = this.provinceMap[param.provinceCode];
    param.cityName = this.cityMap[param.cityCode];
    param.districtName = this.areaMap[param.districtCode];
    param.townName = this.townMap[param.townCode];
    this.loading = true;
    this.httpUtilService.post(`${environment.baseUrl}point/updatePoint`, param).then(
      res => {
        this.loading = false;
        if (res.success) {
          this.visible = false;
          this.updateList.emit('update');
          this.nn.success('提示消息', res.data.msg);
        //  this.listSearch({page: 1, length: this.pageSize});
       //   this.getListSearch(this.searchData);
        }
      }
    );
  }

  /**
   * 地址名称值设置
   * @param eName
   */
  locationName(eName: string) {
    if (eName !== 'address') {
      return;
    }

    const modalFormData = this.validateForm.getRawValue();
    const provinceName = this.provinceMap[modalFormData.provinceCode] || '';
    const cityName = this.cityMap[modalFormData.cityCode] || '';
    const areaName = this.areaMap[modalFormData.districtCode] || '';
    const townName = this.townMap[modalFormData.townCode] || '';
    if (modalFormData.address) {
      if (!modalFormData.address.includes(cityName)) {

        this.validateForm.get('locationName').setValue(provinceName + cityName + areaName + townName + modalFormData.address);
      } else {
        this.validateForm.get('locationName').setValue(modalFormData.address);
      }
    } else {
      this.validateForm.get('locationName').setValue(provinceName + cityName + areaName + townName);
    }
  }

  }