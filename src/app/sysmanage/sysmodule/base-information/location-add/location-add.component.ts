import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {environment} from '../../../../../environments/environment';
import {Utils} from '../../../../common/util/utils';
import {UploadFile} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {urls} from '../../../../common/model/url';

@Component({
  selector: 'app-location-add',
  templateUrl: './location-add.component.html',
  styleUrls: ['./location-add.component.css']
})
export class LocationAddComponent implements OnInit {

  radioArr: Array<any> = [];
  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  townArr: Array<any> = [];
  tempData: any;
  controlArray: Array<any> = [
    {
      cName: '公司ID', eName: 'companyId', type: 'text', require: true, validateCon: '请输入界面ID',
      disabled: true
    },
    {
      cName: '公司名称', eName: 'companyName', type: 'modal', require: true, validateCon: '请输入界面ID',
      disabled: false
    },
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
      disabled: false
    },
    {
      cName: '经度', eName: 'longitude', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },

    {
      cName: '纬度', eName: 'latitude', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '地点名称', eName: 'locationName', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '备注', eName: 'remark', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
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
  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
  rowid: number;

  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  inputModalModel: string; // 公司名字 输入
  borderRed: boolean = false; // 公司名字输入状态
  companyData: any;

  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  inpData: any = {};
  provinceName: string = '';
  cityName: string = '';
  districtName: string = '';
  townName: string = '';
  AreaCodes: object = {
    provinceCode: '',
    cityCode: '',
    districtCode: '',
    townCode: ''
  };


  constructor(private fb: FormBuilder, private router: Router, private http: HttpUtilService, private info: UserinfoService) {
  }

  ngOnInit(): void {
    let data = JSON.parse(sessionStorage.getItem('locationData'));
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));
    this.getAddressData({level: 'DZDJ10'});
    this.getStatic(this.radioArr, 'DDLX');
    this.validateForm = this.fb.group({});
    for (const control of this.controlArray) {

      this.validateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, control.require ? Validators.required : null
      ));
      if (control.eName === 'companyName') {
        this.validateForm.get('companyName').clearValidators();
      }
    }
    if (!data) {

      if (this.companyData) {
        this.inputModalModel = this.companyData.companyName;
        this.validateForm.get('companyId').setValue(this.companyData.companyId);
      } else {
        this.inputModalModel = this.info.get('USER').companyName;
        this.validateForm.get('companyId').setValue(this.info.get('USER').companyId);
      }

    } else if (data.data && data.data.length > 0) {
      this.tempData = data.data[0];
      this.dataFlag = true;
      // this.validateForm.patchValue(tempData);
      this.rowid = this.tempData['rowid'];
      this.inputModalModel = this.companyData ? this.companyData.companyName : this.info.get('USER').companyName;
    }

  }

  submitForm(): void {
    console.log(this.provinceName, this.cityName, this.districtName, this.townName, 'gggg');
    if (!this.dataFlag) {
      //add
      let addUrl = `${environment.baseUrl}point/insertPoint`;
      this.operate(addUrl);
    } else {
      //update
      let updateUrl = `${environment.baseUrl}point/updatePoint`;
      this.operate(updateUrl);
    }
  }

  //添加和修改的逻辑
  operate(url: string): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    let param = this.validateForm.getRawValue();
    Object.assign(param, {
        provinceName: this.provinceName,
        cityName: this.cityName,
        districtName: this.districtName,
        townName: this.townName
      }
    );
    // debugger;

    if (!this.dataFlag) {

    } else {
      param.rowid = this.rowid;
    }

    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          console.log('成功');
          this.router.navigate(['/system/baseInformation/locationManage']);
        } else {
          console.log('失败');
        }
      }
    );
  }

  cancel(): void {
    sessionStorage.removeItem('locationData');
    this.router.navigate(['/system/baseInformation/locationManage']);
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  inpEmit(data: any) {
    this.inpData = data;
    this.validateForm.get('companyId').setValue(data.inpValue);
  }

  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.validateForm.get('cityCode').reset({value: '', disabled: false});
          this.validateForm.get('districtCode').reset({value: '', disabled: true});
          this.validateForm.get('townCode').reset({value: '', disabled: true});
          if (!this.tempData) {
            const tmp = this.provinceArr.find(res => res.code === value);
            this.provinceName = tmp.name;
          }
        }

      }
        break;
      case 'DZDJ20': {
        if (value) {
          this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.validateForm.get('districtCode').reset({value: '', disabled: false});
          this.validateForm.get('townCode').reset({value: '', disabled: true});
          if (!this.tempData) {
            const tmp = this.cityArr.find(res => res.code === value);
            this.cityName = tmp.name;
          }
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value});
          this.validateForm.get('townCode').reset({value: '', disabled: false});
          if (!this.tempData) {
            const tmp = this.areaArr.find(res => res.code === value);
            this.districtName = tmp.name;
          }
        }
      }
        break;
      case 'DZDJ40': {
        if (value) {
          if (!this.tempData) {
            const tmp = this.townArr.find(res => res.code === value);
            this.townName = tmp.name;
          }

        }

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
              if (this.tempData) {
                this.validateForm.patchValue(this.tempData);
                this.provinceName = this.tempData.provinceName;
                this.cityName = this.tempData.cityName;
                this.districtName = this.tempData.districtName;
                this.townName = this.tempData.townName;
                this.tempData = {};
              }

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


}
