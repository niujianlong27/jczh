import {Component, OnInit} from '@angular/core';
import {urls} from '@model/url';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {UserinfoService} from '@service/userinfo-service.service';
import {UploadFiles} from '@service/upload-files';
import {GlobalService} from '@service/global-service.service';
import {HttpUtilService} from '@service/http-util.service';
import {validatePhone} from '@validator/validator';

@Component({
  selector: 'app-carier-manage-add',
  templateUrl: './carier-manage-add.component.html',
  styleUrls: ['./carier-manage-add.component.css']
})
export class CarierManageAddComponent implements OnInit {
  validateForm: FormGroup;
  inpData: any = {};
  radioOptionsHasLicenseArr = [];
  isSingleList = [
    {name: '独立结算', value: 'DCJS10'},
    {name: '车队结算', value: 'DCJS20'}
  ];
  transportCapacityList = [];
  statusArr = [];
  previewImage = '';
  previewVisible = false;

  inputModalModel: string; // 公司名字 输入
  borderRed: boolean = false; // 公司名字输入状态
  invoiceCompanyFindSet = {formId: 'form_bank_tan', name: '结算单位', parameter: 'companyName', url: 'getCompanyBankThree'};
  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
  tmp: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测

  isBlur: Boolean = true; // 开票公司是否获取焦点
  busiLicenseArr: Array<any> = [];
  transRoadPermitArr: Array<any> = [];
  controlArray: Array<any> = [
    {
      cName: '公司ID', eName: 'companyId', type: 'text', require: true, validateCon: '请输入公司ID',
      disabled: true
    },
    {
      cName: '公司名称', eName: 'companyName', type: 'text1', require: true, validateCon: '请输入公司名称',
      disabled: false
    },
    {
      cName: '公司简称', eName: 'shortName', type: 'text', require: true, validateCon: '请输入公司简称',
      disabled: false,
    },
    {
      cName: '助记码', eName: 'easyCode1', type: 'text', require: false, validateCon: '请输入助记码',
      disabled: false
    },

    // {
    //   cName: '有无营业执照', eName: 'busiLicenseHave', type: 'radio', require: true, validateCon: '请选择是否有营业执照',
    //   disabled: false, redioArr: []
    // },
    {
      cName: '结算模式', eName: 'isSingle', type: 'radio', require: true, validateCon: '请选择结算模式',
      disabled: false, radioArr: this.isSingleList
    },
    // {
    //   cName: '运输能力', eName: 'transportCapacity', type: 'select', require: true, validateCon: '请选择运输能力',
    //   disabled: false, selectList: this.transportCapacityList
    // },

    {
      cName: '开票公司', eName: 'invoiceCompany', type: 'modal', require: false, validateCon: '请输入开票公司',
      disabled: false
    },

    {
      cName: '票点数', eName: 'taxPercent', type: 'text', require: false, validateCon: '请输入票点数',
      disabled: false
    },

    {
      cName: '公司联系电话', eName: 'companyPhone', type: 'text', require: false, validateCon: '请输入公司联系电话',
      disabled: false,maxLength:'18',
      pattern: false,
      customPattern: validatePhone(),
      customValidateStatus: 'pattern', customValidateCon: '公司联系电话不正确',
    },
    {
      cName: '公司地址', eName: 'companyAddress', type: 'text', require: false, validateCon: '请输入公司地址',
      disabled: false, maxLength: 50
    },
    {
      cName: '税号', eName: 'creditCode', type: 'text', require: false, validateCon: '请输入税号',
      disabled: false
    },
    {
      cName: '备注', eName: 'remark', type: 'text', require: false, validateCon: '请输入备注',
      disabled: false, maxLength: 50
    },

    {
      cName: '营业执照', eName: 'busiLicense', type: 'upload', require: false, show: false, validateCon: '请上传营业执照', dataArr: this.busiLicenseArr,
      disabled: false
    },
    {cName: '道路运输许可证', eName: 'transRoadPermit', type: 'upload', require: false, show: false, validateCon: '请上传道路运输许可证', dataArr: this.transRoadPermitArr,
     disabled: false
    }
  ];

  constructor(private fb: FormBuilder,
              private msg: NzMessageService,
              private nn: NzNotificationService,
              private router: Router,
              private http: HttpUtilService, private info: UserinfoService,
              public upload: UploadFiles,
              public global: GlobalService) {
  }

  ngOnInit() {
    // this.getStatic(this.radioOptionsHasLicenseArr, 'YYZZ');
    // this.getStatic(this.transportCapacityList, 'YSNL');
    let data = JSON.parse(sessionStorage.getItem('carrierListData'));
    this.validateForm = this.fb.group({});
    for (const control of this.controlArray) {
      const validateArr = [];
      // control.eName == 'busiLicenseHave' && (control.radioArr = this.radioOptionsHasLicenseArr);
      // control.eName == 'transportCapacity' && (control.selectList = this.transportCapacityList);
      control.require && validateArr.push(Validators.required);
      control.pattern && validateArr.push(Validators.pattern(control.customPattern));
      control.customValidate && validateArr.push(control.customValidate);
      this.validateForm.addControl(control.eName, new FormControl({value: null, disabled: control.disabled}, validateArr));
    }
    // this.validateForm.get('transportCapacity').setValue('YSNL10');
    !data && (this.validateForm.get('isSingle').setValue('DCJS20'));
    let tempData = [];
    if (data && data.data && data.data.length > 0) {
      tempData = data.data[0];
      // 结算类型赋值

      this.isSingleList.map(function(item) {
        if (item.name === tempData['isSingle']) {
          tempData['isSingle'] = item.value;
        }
      });
      this.validateForm.patchValue(tempData);
      this.dataFlag = true;
      this.tmp = data.data[0];
      this.inputModalModel = tempData['invoiceCompanyName'];
      tempData['busiLicense'] && (this.busiLicenseArr = tempData['busiLicense'].split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `营业执照${index + 1}.png`,
          status: 'done',
          url: url
        };
      }));
      tempData['transRoadPermit'] && (this.transRoadPermitArr = tempData['transRoadPermit'].split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `道路运输许可证${index + 1}.png`,
          status: 'done',
          url: url
        };
      }));

    }
    for (const control of this.controlArray) {
      control.eName == 'busiLicense' && (control.dataArr = this.busiLicenseArr);
      control.eName == 'transRoadPermit' && (control.dataArr = this.transRoadPermitArr);
    }
  }

  submitForm(): void {
    if (!this.dataFlag) {
      //add
      let addUrl =urls.addCompany;
      this.operate(addUrl);
    } else {
      //update
      let updateUrl = urls.updateCompany;
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
    param.settleType = 'JSLX20';
    param.busiLicenseHave = 'YYZZ10';
    param.status = this.dataFlag ? this.tmp.status : 'GSZT30';
    if (this.permissions) {
      let companyData = JSON.parse(sessionStorage.getItem('companyData'));
      if (companyData) {
        param.agencyCompanyId = companyData.companyId;
      }
    }
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.nn.success('提示消息',res.data.data);
          this.router.navigate(['/system/baseInformation/carrierManage']);
          this.global.searchReload.emit({target: 'carrierList'});
        }
      }
    );

  }

  cancel(): void {
    sessionStorage.removeItem('carrierListData');
    this.router.navigate(['/system/baseInformation/carrierManage']);
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleChange(info, name) {

    if (info.file.status === 'done' || info.file.status === 'removed') {
      let Arr = info.fileList;
      switch (name) {
        case 'busiLicense' :
          this.busiLicenseArr = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({busiLicense: this.busiLicenseArr.map(item => item.url).join(';')});
          break;
        case 'transRoadPermit' :
          this.transRoadPermitArr = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({transRoadPermit: this.transRoadPermitArr.map(item => item['url']).join(';')});
          break;
      }
    }

  }

  // 静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  // 公司名称失去焦点
  blur(): void {
    this.http.post(urls.mnemonicCode, {easyCode1: this.validateForm.get('companyName').value}).then(
      (res: any) => {
        if (res.success) {
          this.validateForm.get('easyCode1').setValue(res.data.data || '');
        }
      }
    );
  }

  inpEmitModal(data: any, name: string) {
    const da = data.selData && data.selData[0] || {};
    if (name === 'invoiceCompany') {
      this.validateForm.get('invoiceCompany').setValue(da.companyId);
    }
  }

  /**
   * 开票公司是否获取焦点来判断enter是否可以进行form提交
   * @param e
   */
  blurChange(e) {
    this.isBlur = e;
  }

}
