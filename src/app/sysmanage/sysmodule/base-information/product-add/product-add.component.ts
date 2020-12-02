/*
 * @Description: 产品添加的界面
 * @Author: 赵泽平
 * @Date: 2019-01-21 11:36:52
 * @LastEditTime: 2019-01-21 14:13:23
 * @LastEditors: Please set LastEditors
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {environment} from '@env/environment';
import {urls} from '@model/url';
import {UserinfoService} from '@service/userinfo-service.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  typeDataArr: Array<any> = [];
  isShArr: Array<any> = [];
  submitLoading = false; //确定按钮加载状态
  controlArray: Array<any> = [
    {
      cName: '公司ID', eName: 'companyId', type: 'text', require: true, disabled: false, validateCon: '请输入公司ID',
      validators: {
        require: true,
        pattern: false,

      }
    }, {
      cName: '公司名称', eName: 'companyName', type: 'text', require: true, disabled: false, validateCon: '请输入公司名称',
      validators: {
        require: true,
        pattern: false,

      }
    }, {
      cName: '产品编号', eName: 'prodcode', type: 'text', require: true, disabled: false, validateCon: '请输入产品编号',
      validators: {
        require: true,
        pattern: false,

      }
    }, {
      cName: '产品名称', eName: 'prodname', type: 'text', require: true, disabled: false, validateCon: '请输入产品名称',
      validators: {
        require: true,
        pattern: false,
      }
    }, {
      cName: '产品类型', eName: 'prodtype', type: 'text', require: true, disabled: false, validateCon: '请输入产品类型',
      validators: {
        require: true,
        pattern: false,

      }
    },
    {
      cName: '是否为散货', eName: 'isSteel', type: 'radio', require: true, disabled: false, validateCon: '请选择是否为散货',
      validators: {
        require: true,
        pattern: false,

      },
    },
    {
      cName: '备注', eName: 'remark', type: 'text', require: false, disabled: false, validateCon: '请选择是否为散货',
      validators: {
        require: false,
        pattern: false,

      },
    },
  ];
  validateForm: FormGroup;
  dataFlag: boolean = false;      //false为‘添加’，true为‘修改’功能
  ID: any;
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  inputModalModel: string; // 公司名字 输入
  borderRed: boolean = false; // 公司名字输入状态
  companyData: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  inpData: any = {};

  constructor(private fb: FormBuilder, private router: Router, private http: HttpUtilService,
              private info: UserinfoService, private nz: NzNotificationService) {
  }

  ngOnInit() {

    let data = JSON.parse(sessionStorage.getItem('productData'));
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));
    let tempData;

    this.validateForm = this.fb.group({});
    for (const control of this.controlArray) {
      let validatorOrOpts: Array<any> = [];
      if (control.validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (control.validators.pattern) {
        validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      }
      this.validateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: !!control.disabled}, validatorOrOpts
      ));
    }

    if (!data) {
      if (this.companyData) {
        this.inputModalModel = this.companyData.companyName;
        // this.validateForm.get('companyId').setValue(this.companyData.companyId);
      } else {
        this.inputModalModel = this.info.get('USER').companyName;
        this.validateForm.get('companyId').setValue(this.info.get('USER').companyId);
        this.validateForm.get('companyName').setValue(this.info.get('USER').companyName);
      }

    } else if (data.data && data.data.length > 0) {
      tempData = data.data[0];
      this.dataFlag = true;
      this.validateForm.patchValue(tempData);
      this.ID = tempData.id;
    }
    this.getStatic(this.typeDataArr, 'YHLX');
    this.getStatic(this.isShArr, 'ISSH');
  }

  submitForm(): void {
    if (!this.dataFlag) {
      //add
      let addUrl = `${environment.baseUrlSystem}product/insertProduct`;
      this.operate(addUrl);
    } else {
      //update
      let updateUrl = `${environment.baseUrlSystem}product/updateProduct`;
      this.operate(updateUrl);
    }
  }

  cancel(): void {
    sessionStorage.removeItem('productData');
    this.router.navigate(['/system/baseInformation/productManage']);
  }

  operate(url: string): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    let param = this.validateForm.getRawValue();
    if (this.dataFlag) {
      param.id = this.ID;
    }
    this.submitLoading = true;
    this.http.post(url, param).then(
      (res: any) => {
        this.submitLoading = false;
        if (res.success) {
          this.nz.create('success', '提示信息', !this.dataFlag ? '新增成功' : '修改成功', {nzDuration: 3000});
          this.router.navigate(['/system/baseInformation/productManage']);
        }
      }
    );
  }


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
