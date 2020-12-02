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
  selector: 'app-ship-add',
  templateUrl: './ship-add.component.html',
  styleUrls: ['./ship-add.component.css']
})
export class ShipAddComponent implements OnInit {
  dataFlag: boolean = false;      //false为‘添加’，true为‘修改’功能
  radioArr: Array<any> = [];
  controlArray: Array<any> = [
    {
      cName: '公司ID', eName: 'companyId', type: 'text', require: true, validateCon: '请输入公司ID',
      disabled: true
    },
    {
      cName: '公司名称', eName: 'companyName', type: 'modal', require: false, validateCon: '请输入公司名称',
      disabled: false
    },
    {
      cName: '船只代码', eName: 'boatCode', type: 'text', require: true, validateCon: '请输入船只代码',
      disabled: false
    },
    {
      cName: '船只名称', eName: 'boatName', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '船旗', eName: 'flagCountry', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '联系人', eName: 'contact', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '类型', eName: 'type', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '出厂年月', eName: 'buildDate', type: 'data', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '联系电话', eName: 'contactPhone', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '船宽', eName: 'boatWidth', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '船高', eName: 'boatHeight', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '船长', eName: 'boatLength', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '满载吃水', eName: 'draft', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '载重吨', eName: 'capacity', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '净载重吨', eName: 'netCapacit', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '总重吨', eName: 'deadWeight', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '状态', eName: 'status', type: 'radio', require: true, validateCon: '请选择状态',
      radioArr: this.radioArr, disabled: false
    },
    {
      cName: '净重吨', eName: 'netDeadWeight', type: 'number', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '船上电话', eName: 'boatPhone', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '船东公司名称', eName: 'boatOwner', type: 'text', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '散装仓容', eName: 'bulkCapacity', type: 'number', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '包装仓容', eName: 'baleCapacity', type: 'number', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: 'imo', eName: 'imo', type: 'text', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: 'crane', eName: 'crane', type: 'text', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: 'mmsi号', eName: 'mmsi', type: 'text', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: 'GPS号', eName: 'gpsNo', type: 'text', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '船级社', eName: 'boatClass', type: 'text', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '舱口', eName: 'hatchSize', type: 'number', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '航速', eName: 'speed', type: 'number', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '备注', eName: 'remark', type: 'text', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: 'PI证书', eName: 'piCertUrl', type: 'upload', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: 'ISSC证书', eName: 'isscCertUrl', type: 'upload', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: 'CLASS证书', eName: 'classCertUrl', type: 'upload', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '船只照片', eName: 'boatImgUrl', type: 'upload', show: false, validateCon: '请输入界面ID',
      disabled: false
    },
  ];

  validateForm: FormGroup;

  rowid: number;

  // 图片上传相关
  fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];

  // 上传相关
  previewImage = '';
  previewVisible = false;

  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  inputModalModel: string; // 公司名字 输入
  borderRed: boolean = false; // 公司名字输入状态
  companyData: any;

  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  inpData: any = {};


  constructor(private fb: FormBuilder, private router: Router, private http: HttpUtilService, private info: UserinfoService) {
  }

  ngOnInit(): void {
    let data = JSON.parse(sessionStorage.getItem('shipData'));
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));
    let tempData;
    // data && data.data.length > 0 && (this.controlArray[2].disabled = true);

    this.validateForm = this.fb.group({});
    for (const control of this.controlArray) {
      data && data.data.length > 0 && control.eName == 'boatCode' && (control.disabled = true);
      this.validateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, control.require ? Validators.required : null
      ));
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
      tempData = data.data[0];
      this.dataFlag = true;
      this.validateForm.patchValue(tempData);
      this.rowid = tempData.rowid;
    }

    this.getStatic(this.radioArr, 'CBZT');

  }

  submitForm(): void {
    if (!this.dataFlag) {
      //add
      let addUrl = `${environment.baseUrlSystem}boat/insertBoat`;
      this.operate(addUrl);
    } else {
      //update
      let updateUrl = `${environment.baseUrlSystem}boat/updateBoat`;
      this.operate(updateUrl);
    }
  }

  //添加和修改的逻辑f
  operate(url: string): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    let param = this.validateForm.getRawValue();
    param.buildDate = param.buildDate && param.buildDate instanceof Date ? Utils.dateFormat(param.buildDate, 'yyyy-MM-dd') : param.buildDate || null;
    if (!this.dataFlag) {
      this.http.post(url, param).then(
        (res: any) => {
          if (res.success) {
            this.router.navigate(['/system/baseInformation/shipManagement']);
          }
        }
      );
    } else {
      param.rowid = this.rowid;
      this.http.post(url, param).then(
        (res: any) => {
          if (res.success) {
            this.router.navigate(['/system/baseInformation/shipManagement']);
          }
        }
      );
    }
  }

  cancel(): void {
    sessionStorage.removeItem('shipData');
    this.router.navigate(['/system/baseInformation/shipManagement']);
  }

  // 图片上传相关
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

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


}
