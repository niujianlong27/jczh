import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {environment} from '@env/environment';
import {urls} from '@model/url';
import {UserinfoService} from '@service/userinfo-service.service';
import {UploadFiles} from '@service/upload-files';
import {Observable} from 'rxjs';
import {GlobalService} from '../../../../common/services/global-service.service';
import {format} from 'date-fns';
import { el } from '@angular/platform-browser/testing/src/browser_util';
import { viewAttached } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-driver-add',
  templateUrl: './driver-add.component.html',
  styleUrls: ['./driver-add.component.css']
})
export class DriverAddComponent implements OnInit {
  cardUrl: any;//身份证正面图片url
  oppoCardUrl: any;//身份证反面图片url
  driverUrl: any;//驾驶员图片url
  IdCardName: any;
  driverName: any;

  typeDataArr: Array<any> = [];
  loginAuthzArr: Array<any> = [];
  authStatusArr: Array<any> = [];
  statusArr: Array<any> = [];
  userCompanyTypeArr: Array<any> = [];
  isVisible: boolean = false;
  inputValue: any;
  status: any;
  urlList: any = [];
  urlList1: any = [];
  disAbled: boolean = sessionStorage.getItem('status') == 'updata';
  cardIdArr: any = [];
  driverIdArr: any = [];
  cardPhotoBadge: any = [];
  controlArray: Array<any> = [
    {
      cName: '公司ID', eName: 'companyId', type: 'text', require: true, disabled: true, validateCon: '',
      aduit: true, // 审核的时候去掉
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '公司名称', eName: 'companyName', type: 'modal', require: true, disabled: false, validateCon: '',
      aduit: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '用户名', eName: 'loginName', type: 'text', require: true, disabled: this.disAbled, validateCon: '请输入用户名',
      aduit: true,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '姓名', eName: 'name', type: 'text', require: true, disabled: this.disAbled, validateCon: '请输入姓名',
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '手机号', eName: 'mobile', type: 'text', require: true, disabled: this.disAbled, validateCon: '请输入手机号',
      validators: {
        require: true,
        pattern: true,
        patternStr: '^(0|\\+?86|17951)?(13[0-9]|15[0-9]|17[0678]|18[0-9]|19[0-9]|14[57])[0-9]{8}$',
        patternErr: '手机号格式不正确'
      }
    },
    {
      cName: '身份证号', eName: 'cardId', type: 'text', require: true, disabled: this.disAbled, validateCon: '请输入身份证号',
      validators: {
        require: true,
        pattern: true,
        patternStr: '^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$',
        patternErr: '身份证号格式不正确'
      }
    },
    {
      cName: '驾驶证号', eName: 'driverId', type: 'text', require: true, disabled: this.disAbled, validateCon: '请输入驾驶证号',
      validators: {
        require: true,
        pattern: true,
        patternStr: '^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$',
        patternErr: '驾驶证号格式不正确'
      }
    },
    {
      cName: '类型',
      eName: 'userCompanyType',
      type: 'select',
      require: true,
      aduit: true,
      disabled: this.disAbled,
      validateCon: '请选择类型',
      value: 'YHLX20',
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      cName: '身份证发行时间', eName: 'cardIssueDate', type: 'date', require: false, disabled: this.disAbled, validateCon: '请选择身份证发行时间',
      aduit: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '身份证过期时间', eName: 'cardExpiryDate', type: 'date', require: false, disabled: this.disAbled, validateCon: '请选择身份证过期时间',
      aduit: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '驾驶证有效起始时间', eName: 'driverIssueDate', type: 'date', require: false, disabled: this.disAbled, validateCon: '请选择驾驶证发行时间',
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '驾驶证过期时间', eName: 'driverExpiryDate', type: 'date', require: false, disabled: this.disAbled, validateCon: '请选择驾驶证过期时间',
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '登陆授权', eName: 'loginAuthz', type: 'select1', require: true, disabled: false, validateCon: '请选择登陆授权',
      value: 'DLSQ30',
      validators: {
        require: true,
        pattern: true,
      }
    },{
      cName: '状态', eName: 'status', type: 'select2', require: true, disabled: false, validateCon: '请选择状态',
      value: 'YHZT10',
      validators: {
        require: true,
        pattern: true,
      }
    },{
      cName: '认证状态', eName: 'authStatus', type: 'select3', require: true, disabled: false, validateCon: '请选择认证状态',
      value: 'RZZT90',
      validators: {
        require: true,
        pattern: true,
      }
    },
    {
      cName: '身份证照片', eName: 'cardPhoto', type: 'upload', require: false, validateCon: '请上传身份证照片', dataArr: this.cardIdArr,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '身份证反面照片', eName: 'cardPhotoBadge', type: 'upload', require: false, validateCon: '请上传身份证反面照片', dataArr: this.cardPhotoBadge,
      aduit: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      cName: '驾驶证照片', eName: 'driverPhoto', type: 'upload', require: false, validateCon: '请上传驾驶证照片', dataArr: this.driverIdArr,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];

  validateForm: FormGroup;
  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
  rowid: string;
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  inputModalModel: string; // 公司名字 输入
  borderRed: boolean = false; // 公司名字输入状态
  companyData: any;
  driverData: any;
  // 图片上传相关
  fileList: any = [];
  fileList1: any = [];
  // 上传相关
  previewImage = '';
  previewVisible = false;

  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  inpData: any = {};
  public img1Rotate = 'rotate(0deg)';
  public img2Rotate = 'rotate(0deg)';
  @ViewChild('imgLeft') imgLeft: any;
  @ViewChild('imgRight') imgRight: any;
  readonly constHeight = 350;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpUtilService,
    private info: UserinfoService,
    private nz: NzNotificationService,
    public upload: UploadFiles,
    private nm: NzModalService,
    public global: GlobalService) {
  }

  ngOnInit() {

    this.driverData = JSON.parse(sessionStorage.getItem('driverData'));
    let data = JSON.parse(sessionStorage.getItem('driverData'));
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));
    let tempData;
    this.status = sessionStorage.getItem('status');
    if (this.status == 'updata') {
      this.disAbled = true;
    }
    this.validateForm = this.fb.group({});
console.log("this.validateForm:"+JSON.stringify(this.validateForm));
    for (const control of this.controlArray) {
      if (!(this.status === 'updata' && control.aduit)) {
        let validatorOrOpts: Array<any> = [];
        if (this.status === 'updata' && (control.eName === 'cardIssueDate' ||
        control.eName === 'cardExpiryDate' || control.eName === 'driverIssueDate' || control.eName === 'driverExpiryDate')) {
          control.type = 'text';
        }
        if (control.validators.require) {
          validatorOrOpts.push(Validators.required);
        }
        if (control.validators.pattern) {
          validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
        }
        this.validateForm.addControl(control.eName, new FormControl(
          {value: control.value || '', disabled: !!control.disabled}, validatorOrOpts
        ));
      } else {
        control.type = '';
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
      //设置默认值
      tempData = data.data[0];
      this.dataFlag = true;
      this.validateForm.patchValue(tempData);
      tempData['cardPhoto'] && (this.cardIdArr = tempData['cardPhoto'].split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `身份证${index + 1}.png`,
          status: 'done',
          url: url
        };
      }));
      tempData['cardPhotoBadge'] && (this.cardPhotoBadge = tempData['cardPhotoBadge'].split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `身份证反面${index + 1}.png`,
          status: 'done',
          url: url
        };
      }));
      tempData['driverPhoto'] && (this.driverIdArr = tempData['driverPhoto'].split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `驾驶证反面${index + 1}.png`,
          status: 'done',
          url: url
        };
      }));
      for (const control of this.controlArray) {
        control.eName == 'cardPhotoBadge' && (control.dataArr = this.cardPhotoBadge);
        control.eName == 'cardPhoto' && (control.dataArr = this.cardIdArr);
        control.eName == 'driverPhoto' && (control.dataArr = this.driverIdArr);
      }
      this.rowid = tempData.rowid;
    }

    this.getStatic(this.userCompanyTypeArr, 'YHLX');
    this.getStatic(this.authStatusArr, 'RZZT');
    this.getStatic(this.statusArr, 'YHZT');
    this.getStatic(this.loginAuthzArr, 'DLSQ');
    if (this.status == 'updata') { // 审核
      this.getviewContractDetail();
      console.log(this.imgLeft, this.imgRight);
    }
  }

 ngAfterViewInit(): void {
   //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
   //Add 'implements AfterViewInit' to the class.
    if (this.status === 'updata') { // 审核
      if (this.imgLeft.src) {
        const width = this.imgLeft.naturalWidth;
        const height = this.imgLeft.naturalHeight;
        this.imgLeft.width = width / height * this.constHeight + 'px';
      }
      if (this.imgRight.src) {
        const width = this.imgRight.naturalWidth;
        const height = this.imgRight.naturalHeight;
        this.imgRight.width = width / height * this.constHeight + 'px';
      }
    }
 }
  // 图片旋转
  public rotate(flag: number) {
    const str = flag === 1 ? this.img1Rotate : this.img2Rotate;
    const arr = str.match(/\d+/);
    let rotate: number = arr ? +arr[0] : 0;
    switch (rotate) {
      case 0:
        rotate = 90;
        break;
      case 90:
        rotate = 180;
        break;
      case 180:
        rotate = 270;
        break;
      case 270:
        rotate = 360;
        break;
      case 360:
        rotate = 0;
        break;
    }
    if (flag === 1) {
      this.img1Rotate = `rotate(${rotate}deg)`;
    } else {
      this.img2Rotate = `rotate(${rotate}deg)`;
    }
  }

  submitForm(): void { // 确认
    if (!this.dataFlag) {
      //add
      let addUrl = `${environment.baseUrl}user/addDriver`;
      //let addUrl = `http://192.168.21.97:9030/user/addDriver`;
      this.operate(addUrl);
    } else {
      //update
      let updateUrl = `${environment.baseUrl}user/updateDriver`;
      this.operate(updateUrl);
    }
  }

  submitForm1() { // 审核
    let url = `${environment.baseUrl}user/authDriver`;
    let param = this.validateForm.getRawValue();
    param.cardIssueDate = (param.cardIssueDate && format(param.cardIssueDate, 'YYYY-MM-DD HH:mm:ss')) || undefined;
    param.cardExpiryDate = (param.cardExpiryDate && format(param.cardExpiryDate, 'YYYY-MM-DD HH:mm:ss')) || undefined;
    param.driverIssueDate = (param.driverIssueDate && format(param.driverIssueDate, 'YYYY-MM-DD HH:mm:ss')) || undefined;
    param.driverExpiryDate = (param.driverExpiryDate && format(param.driverExpiryDate, 'YYYY-MM-DD HH:mm:ss')) || undefined;
    param.userId = this.driverData.data[0].userId;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.success('提示信息', '审核成功');
        this.router.navigate(['/system/baseInformation/DirverManage']);
        this.global.searchReload.emit({target: 'DirverManage'});
      }
    });
  }

  // 取消
  cancel(): void {
    sessionStorage.removeItem('vehicleData');
    this.router.navigate(['/system/baseInformation/DirverManage']);
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
    // let urls: Array<any> = [];
    // urls = this.fileList.map(item => {
    //   return item.url;
    // });
    let param = this.validateForm.getRawValue();
    param.cardIssueDate = (param.cardIssueDate && format(param.cardIssueDate, 'YYYY-MM-DD HH:mm:ss')) || undefined;
    param.cardExpiryDate = (param.cardExpiryDate && format(param.cardExpiryDate, 'YYYY-MM-DD HH:mm:ss')) || undefined;
    param.driverIssueDate = (param.driverIssueDate && format(param.driverIssueDate, 'YYYY-MM-DD HH:mm:ss')) || undefined;
    param.driverExpiryDate =  (param.driverExpiryDate && format(param.driverExpiryDate, 'YYYY-MM-DD HH:mm:ss')) || undefined;
    // param.cardPhoto = urls.join();
    if (!this.dataFlag) {

      this.http.post(url, param).then(
        (res: any) => {
          if (res.success) {
            console.log('成功');
            this.router.navigate(['/system/baseInformation/DirverManage']);
            this.global.searchReload.emit({target: 'DirverManage'});
          } else {
            console.log('失败');
          }
        }
      );
    } else {
      param.rowid = this.rowid;
      this.http.post(url, param).then(
        (res: any) => {
          if (res.success) {
            this.router.navigate(['/system/baseInformation/DirverManage']);
          } else {
            console.log('失败');
          }
        }
      );
    }
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          if (valueSetCode == 'YHLX') {
            for (let i = 0; i < res.data.data.data.length; i++) {
              if (res.data.data.data[i].value == 'YHLX10') {
                res.data.data.data.splice(i, 1);
              }
            }
          }
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  inpEmit(data: any) {
    this.inpData = data;
    this.validateForm.get('companyId').setValue(data.inpValue);
  }

  cancel1() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
    this.inputValue = null;
  }

  handleOk() {
    let url = `${environment.baseUrl}user/rejectDriver`;
    let param: any = {};
    console.log(this.driverData);
    param.mobile = this.driverData.data[0].mobile;
    param.userId = this.driverData.data[0].userId;
    param.rejectReason = this.inputValue;
    this.isVisible = false;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.success('提示信息', '驳回成功');
        this.router.navigate(['/system/baseInformation/DirverManage']);
        this.global.searchReload.emit({target: 'DirverManage'});
      }
    });
  }

  getviewContractDetail() {
    let url = `${environment.baseUrl}user/getDriverAuthDetail`;
    let param: any = this.driverData.data[0];
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          if (res.data.data && res.data.data.cardPhoto) {
            this.urlList = res.data.data.cardPhoto.split(',');
            this.fileList = this.urlList.map((item, index) => {
              return ({
                uid: index,
                url: item,
                status: 'done',
                name: this.upload.getRealFileName(item)
              });
            });
          }
          if (res.data.data && res.data.data.driverPhoto) {
            this.urlList1 = res.data.data.driverPhoto.split(',');
            this.fileList1 = this.urlList1.map((item, index) => {
              return ({
                uid: index,
                url: item,
                status: 'done',
                name: this.upload.getRealFileName(item)
              });
            });
          }
        }
      }
    );

  }

  handlePreview = (file: UploadFile) => { // 图片相关
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleChange(info, name) { // 获取上传路径
    console.log(info)
    if (info.file.status === 'done' || info.file.status === 'removed') {
      let Arr = info.fileList;
      switch (name) {
        case 'cardPhoto' :
          this.cardIdArr = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({cardPhoto: this.cardIdArr.map(item => item.url).join(';')});
          this.cardUrl = Arr[0].originFileObj.url;
          this.uploadIDCard();
          break;
        case 'cardPhotoBadge' :
          this.cardPhotoBadge = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({cardPhotoBadge: this.cardPhotoBadge.map(item => item['url']).join(';')});
          this.oppoCardUrl = Arr[0].originFileObj.url;
          console.log('身份证反面：' + this.oppoCardUrl);
          this.uploadOppoIDCard();
          break;
        case 'driverPhoto' :
          this.driverIdArr = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({driverPhoto: this.driverIdArr.map(item => item['url']).join(';')});
          this.driverUrl = Arr[0].originFileObj.url;
          this.uploadDriverLicence();
          break;
      }



    }

  };

  uploadIDCard() {
    // let url = `http://192.168.21.97:9030/user/uploadIDCard`;
    let url = `${environment.baseUrl}user/uploadIDCard`;
    let param: any = {};
    let tempData;
    param.url = this.cardUrl;
    param.code = 'face';
    console.log('身份证正面图片地址：' + param.url);
    console.log('param:' + param);
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log('接口调用成功');

        this.validateForm.patchValue(
          {
            cardId: res.data.data.num,
          }
        );
        tempData = res.data.data;
        this.validateForm.patchValue(tempData);

        this.IdCardName = res.data.data.name;
      } else {
        console.log('图片识别失败');
      }
    });
  };

  uploadOppoIDCard() {
    let url = `${environment.baseUrl}user/uploadIDCard`;
    let param: any = {};
    let tempData;
    param.url = this.oppoCardUrl;
    param.code = 'back';
    console.log('身份证反面图片地址：' + param.url);
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log('接口调用成功');
        this.validateForm.patchValue(
          {
            cardIssueDate: format(res.data.data.start_date, 'YYYY-MM-DD HH:mm:ss'),
            cardExpiryDate: format(res.data.data.end_date, 'YYYY-MM-DD HH:mm:ss'),
          }
        );
        console.log('身份证反面日期：' + format(res.data.data.start_date, 'YYYY-MM-DD HH:mm:ss'));
        tempData = res.data.data;
        this.validateForm.patchValue(tempData);
      } else {
        console.log('图片识别失败');
      }
    });
  }

  uploadDriverLicence() {
    let url = `${environment.baseUrl}user/uploadDriverLicence`;
    let param: any = {};
    let tempData;
    param.url = this.driverUrl;
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.validateForm.patchValue(
          {
            driverId: res.data.data.num,
            driverExpiryDate: format(res.data.data.end_date, 'YYYY-MM-DD HH:mm:ss'),
            driverIssueDate: format(res.data.data.start_date, 'YYYY-MM-DD HH:mm:ss'),
          },
        );
        tempData = res.data.data;
        this.validateForm.patchValue(tempData);
        console.log('驾驶证：' + format(res.data.data.start_date, 'YYYY-MM-DD HH:mm:ss'));

        this.driverName = res.data.data.name;
        this.uploadIDCard();
        console.log('驾驶证姓名：' + this.driverName);
        console.log('身份证姓名：' + this.IdCardName);
        if (this.IdCardName === this.driverName) {
          this.validateForm.patchValue(
            {
              authStatus: 'RZZT90' ,
            },
          );
        } else {
          this.validateForm.patchValue(
            {
              authStatus: 'RZZT20' ,
            },
          );
        }
      }
    });
  }

  remove = () => { // 图片删除  返回 false 不删除图片
    if (this.status == 'updata') {
      return false;
    } else {
      return true;
    }
  };
}
