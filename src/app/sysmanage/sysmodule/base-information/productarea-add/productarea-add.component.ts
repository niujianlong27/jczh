import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {Utils} from '../../../../common/util/utils';
import {UploadFile} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {urls} from '../../../../common/model/url';

@Component({
  selector: 'app-productarea-add',
  templateUrl: './productarea-add.component.html',
  styleUrls: ['./productarea-add.component.css']
})
export class ProductareaAddComponent implements OnInit {

  radioArr: Array<any> = [];

  controlArray: Array<any> = [
    {
      cName: '公司ID', eName: 'companyId', type: 'text', require: true, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '公司名称', eName: 'companyName', type: 'modal', require: true, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '产地编号', eName: 'areaCode', type: 'number', require: true, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '产地名称', eName: 'areaName', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
    },
    {
      cName: '备注', eName: 'remark', type: 'text', require: false, validateCon: '请输入界面ID',
      disabled: false
    },


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


  constructor(private fb: FormBuilder, private router: Router, private http: HttpUtilService, private info: UserinfoService) {
  }

  ngOnInit():void{
    let data = JSON.parse(sessionStorage.getItem('productareaData'));
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));
    let tempData;
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
      tempData = data.data[0];
      this.dataFlag = true;
      this.validateForm.patchValue(tempData);
      this.rowid = tempData.rowid;
    }

    this.getStatic(this.radioArr, 'CLZT');
  }
  submitForm(): void {
    if (!this.dataFlag) {
      //add
      let addUrl = `${environment.baseUrlSystem}productarea/insertProductarea`;
      this.operate(addUrl);
    } else {
      //update
      let updateUrl = `${environment.baseUrlSystem}productarea/updateProductarea`;
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


    if (!this.dataFlag) {

    } else {
      param.rowid = this.rowid;
    }
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          console.log('成功');
          this.router.navigate(['/system/baseInformation/productareaManage']);
        } else {
          console.log('失败');
        }
      }
    );
  }


  cancel(): void {
    sessionStorage.removeItem('productareaData');
    this.router.navigate(['/system/baseInformation/productareaManage']);
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


}
