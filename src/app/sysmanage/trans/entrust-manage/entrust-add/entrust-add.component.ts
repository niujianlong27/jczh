import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {urls} from '../../../../common/model/url';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-entrust-add',
  templateUrl: './entrust-add.component.html',
  styleUrls: ['./entrust-add.component.css']
})
export class EntrustAddComponent implements OnInit {
  dataSet:any;
  validateForm: FormGroup;
  endLocationArr:Array<any>;
  inputModalModel:any;
  inputModalModel1:any;
  inputModalModel2:any;
  inpData:any;
  borderRed: boolean = false; // 公司名字输入状态
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  formIdFindset1: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  formIdFindset2: any = {formId: 'point_pop', name: '地点名称（带省市区）', parameter: 'locationName', parameterSend: 'locationId'};// formId设置

  controlArray: Array<any>=[
    {
      cName: '委托单号', eName: 'orderNo', type: 'text', require: true, disabled: true, validateCon: '',
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '托运人', eName: 'consignorCompanyId', type: 'input1', require: true, disabled: true, validateCon: '请选择托运人',
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '承运人', eName: 'carrierCompanyId', type: 'input', require: true, disabled: true, validateCon: '请选择承运人',
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '起始地', eName: 'startLocationId', type: 'input2', require: true, disabled: true, validateCon: '',
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '目的地', eName: 'endLocationId', type: 'select2', require: true, disabled: false, validateCon: '',
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      cName: '业务时间', eName: '', type: 'date', require: true, disabled: false, validateCon: '请选择业务时间',
      validators: {
        require: true,
        pattern: false,
      }
    },
  ];


  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpUtilService,
              private info: UserinfoService,) { }

  ngOnInit() {
    this.validateForm = this.fb.group({});
    for (const control of this.controlArray) {
      let validatorOrOpts: Array<any> = [];
      if (control.validators.require)
        validatorOrOpts.push(Validators.required);
      if (control.validators.pattern)
        validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.validateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: !!control.disabled}, validatorOrOpts
      ));
    }
    this.inputModalModel = this.info.get('USER').companyName;
    this.validateForm.get('carrierCompanyId').setValue(this.info.get('USER').companyId);
    this.inputModalModel1 = '日照钢铁';
    this.validateForm.get('consignorCompanyId').setValue('C000000882');
    this.inputModalModel2 = '山东省日照市岚山区日照钢铁';
    this.validateForm.get('startLocationId').setValue('P000001012');
  }


  submitForm(){

  }

  cancel(){

  }

  updateData(){

  }
  btnCLick(data:any){

  }
  inpEmit(data: any) {
    this.inpData = data;
    this.validateForm.get('carrierCompanyId').setValue(data.inpValue);
  }
}
