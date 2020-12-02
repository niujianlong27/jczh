import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadFiles} from '@service/upload-files';
import {NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';

@Component({
  selector: 'app-update-register',
  templateUrl: './update-register.component.html',
  styleUrls: ['./update-register.component.css']
})
export class UpdateRegisterComponent implements OnInit {
  validateForm: FormGroup;
  modalFormData: Array<any>;
  registerType: any; //注册类型 ， shipper 货主方 ， transport 承运方
  timer: any;
  count: number = 60;
  codeClick: boolean = false;
  current = 1;
  cardPhoto: any = [];
  cardPhotoBadge: any = [];
  transPoadPermit: any = [];
  busiLicense: any = [];
  formData: any;
  // 上传相关
  previewImage = '';
  previewVisible = false;
  iDcardValue: any; // 身份信息
  businessValue: any; //  企业资质认证
  tempData: any;
  type: any;
  iDcardData: Array<any> = [ //   身份证信息 注册第一步

    {
      name: '身份证正面照', eName: 'cardPhotoBadge', type: 'upload', require: true, validateCon: '请上传身份证正面照片', dataArr: this.cardPhotoBadge,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '身份证反面照', eName: 'cardPhoto', type: 'upload', require: true, validateCon: '请上传身份证反面照片', dataArr: this.cardPhoto,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '身份证号', eName: 'cardId', type: 'text', require: true, validateCon: '请输入身份证号',
      validators: {
        require: true,
        pattern: true,
        patternStr: '^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$',
        patternErr: '身份证号格式不正确'
      }
    }
  ];

  businessData: Array<any> = [ // 承运企业资质认证  承运注册第二步
    {
      name: '公司名称', eName: 'companyName', type: 'text', require: true, validateCon: '请输入公司名称',
      disabled: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '税号', eName: 'creditCode', type: 'text', require: true, validateCon: '请输入税号',
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '营业执照', eName: 'busiLicense', type: 'upload', require: true, validateCon: '请上传营业执照', dataArr: this.busiLicense,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '道路经营许可证', eName: 'transPoadPermit', type: 'upload', require: true, validateCon: '请上传道路经营许可证', dataArr: this.transPoadPermit,
      validators: {
        require: true,
        pattern: false,
      }
    },
  ];

  businessData2: Array<any> = [ // 货主企业资质认证 第二步
    {
      name: '公司名称', eName: 'companyName', type: 'text', require: true, validateCon: '请输入公司名称',
      display: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '税号', eName: 'creditCode', type: 'text', require: true, validateCon: '请输入税号',
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '营业执照', eName: 'busiLicense', type: 'upload', require: true, validateCon: '请上传营业执照', dataArr: this.busiLicense,
      validators: {
        require: true,
        pattern: false,
      }
    }
  ];

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              public upload: UploadFiles,
              private nz: NzNotificationService,
              private http: HttpUtilService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.registerType = queryParams.registerType;
      this.type = queryParams.read || '';
    });
    this.formData = JSON.parse(sessionStorage.getItem('updateRegister')); //当前的按钮状态新增、修改

    if (this.type == 'userAgreement'){
      this.current = 2;
      this.registerType == 'transport' && this.transport();
      this.registerType == 'shipper' && this.shipper();
      this.iDcardValue = JSON.parse(sessionStorage.getItem('iDcardValue'));
      this.businessValue = JSON.parse(sessionStorage.getItem('businessValue'));
      this.validateForm.patchValue(this.businessValue);

      this.businessValue['busiLicense'] && (this.busiLicense = this.businessValue['busiLicense'].split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `营业执照${index + 1}.png`,
          status: 'done',
          url: url
        };
      }));
      this.businessValue['transPoadPermit'] && (this.transPoadPermit = this.businessValue['transPoadPermit'].split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `运输许可${index + 1}.png`,
          status: 'done',
          url: url
        };
      }));
      for (const control of this.modalFormData) {
        control.eName == 'busiLicense' && (control.dataArr = this.busiLicense);
        control.eName == 'transPoadPermit' && (control.dataArr = this.transPoadPermit);

      }

    }else{
      this.getFormData();
    }



  }

  getFormData() {
    this.iDcard(); // 身份证信息表单初始
    this.http.post(urls.selectApplicationAcc, this.formData).then(
      (res: any) => {
        if (res.success) {
          this.tempData = res.data && res.data.data || [];
          this.validateForm.patchValue(this.tempData[0]);

          this.tempData[0]['cardPhoto'] && (this.cardPhoto = this.tempData[0]['cardPhoto'].split(';').filter(item => item).map((url, index) => {
            return {
              uid: index + 1,
              name: `身份证反面${index + 1}.png`,
              status: 'done',
              url: url
            };
          }));
          this.tempData[0]['cardPhotoBadge'] && (this.cardPhotoBadge = this.tempData[0]['cardPhotoBadge'].split(';').filter(item => item).map((url, index) => {
            return {
              uid: index + 1,
              name: `身份证正面${index + 1}.png`,
              status: 'done',
              url: url
            };
          }));

          this.tempData[0]['busiLicense'] && (this.busiLicense = this.tempData[0]['busiLicense'].split(';').filter(item => item).map((url, index) => {
            return {
              uid: index + 1,
              name: `营业执照${index + 1}.png`,
              status: 'done',
              url: url
            };
          }));
          this.tempData[0]['transPoadPermit'] && (this.transPoadPermit = this.tempData[0]['transPoadPermit'].split(';').filter(item => item).map((url, index) => {
            return {
              uid: index + 1,
              name: `运输许可${index + 1}.png`,
              status: 'done',
              url: url
            };
          }));
          for (const control of this.modalFormData) {
            control.eName == 'cardPhoto' && (control.dataArr = this.cardPhoto);
            control.eName == 'cardPhotoBadge' && (control.dataArr = this.cardPhotoBadge);

          }

        }
      }
    );
  }


  iDcardSubmit() { // 身份信息
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    this.iDcardValue = this.validateForm.getRawValue();
    this.registerType == 'transport' && this.transport();
    this.registerType == 'shipper' && this.shipper();
    this.validateForm.patchValue(this.tempData[0]);

    this.current += 1;
    for (const control of this.modalFormData) {
      control.eName == 'busiLicense' && (control.dataArr = this.busiLicense);
      control.eName == 'transPoadPermit' && (control.dataArr = this.transPoadPermit);
    }
  }

  businessSubmit() { //企业资质认证
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    this.businessValue = this.validateForm.getRawValue();
    let params = {};
    params = {...this.businessValue, ...this.iDcardValue};
    params['password'] = this.formData.password;
    params['loginName'] = this.formData.loginName;
    this.http.post(urls.updateApplicationAcc, params).then(
      (res: any) => {
        if (res.success) {
          this.current += 1;
        }
      }
    );

  }

  ending() {
    this.router.navigate(['login']);
  }

  handlePreview = (file: UploadFile) => { // 图片相关
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleChange(info, name, arr) { // 获取上传路径
    if (info.file.status === 'done' || info.file.status === 'removed') {
      let Arr = info.fileList;

      info.fileList.forEach((item, index) => {
        if (item.type.indexOf('image') < 0) {
          this.nz.warning('提示信息', '身份证照片上传格式不符合要求，请重新上传');
          arr.splice(index, 1);
          return;
        }
      });

      switch (name) {
        case 'cardPhoto' : // 身份证反面
          this.cardPhoto = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({cardPhoto: this.cardPhoto.map(item => item.url).join(';')});
          break;
        case 'cardPhotoBadge' : // 身份证正面
          this.cardPhotoBadge = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({cardPhotoBadge: this.cardPhotoBadge.map(item => item['url']).join(';')});
          break;

        case 'busiLicense' : //  营业执照
          this.busiLicense = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({busiLicense: this.busiLicense.map(item => item['url']).join(';')});
          break;
        case 'transPoadPermit' : //道路运输许可证
          this.transPoadPermit = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({transPoadPermit: this.transPoadPermit.map(item => item['url']).join(';')});
          break;
      }
    }
  };


  iDcard() { // 身份证信息
    this.modalFormData = this.iDcardData;
    this.validateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      const validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.validateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));
    }
  }

  transport() { // 承运企业资格认证
    this.modalFormData = this.businessData;
    this.validateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      const validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.validateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));
    }
    this.validateForm.addControl('agree', new FormControl(
      {value: false, disabled: false}));


  }

  shipper() { // 货主企业资格认证
    this.modalFormData = this.businessData2;
    this.validateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      const validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.validateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));
    }
    this.validateForm.addControl('agree', new FormControl(
      {value: false, disabled: false}));


  }


  userAgreement() {
    this.businessValue = this.validateForm.getRawValue();

    sessionStorage.setItem('businessValue', JSON.stringify({...this.businessValue}));
    sessionStorage.setItem('iDcardValue', JSON.stringify({...this.iDcardValue}));
    this.router.navigate(['userAgreement'], {queryParams: {'type': 'update', 'registerType': this.registerType}});

  }
}
