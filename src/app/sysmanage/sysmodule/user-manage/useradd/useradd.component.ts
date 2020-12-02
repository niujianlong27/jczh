import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {urls} from '@model/url';
import {UserinfoService} from '@service/userinfo-service.service';
import {UploadFiles} from '@service/upload-files';
import {GlobalService} from '@service/global-service.service';

@Component({
  selector: 'app-useradd',
  templateUrl: './useradd.component.html',
  styleUrls: ['./useradd.component.css']
})
export class UseraddComponent implements OnInit {
  validateForm: FormGroup;
  radioOptionsSexArr = [
    {name: '男', value: '男'},
    {name: '女', value: '女'},
  ];

  //上传
  idCard_fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];
  // previewImage = '';
  // previewVisible = false;
  statusArr = [];
  userCompanyTypeArr = [];
  userTypeArr = [];

  loginPowerArr = [];
  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  inputModalModel: string; // 公司名字 输入
  borderRed: boolean = false; // 公司名字输入状态
  inpData: any = {};
  companyData: any;
  private rowid: string;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  // findset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};
  segmentId: string = ''; // 业务模块值Id
  inputMoadlVisible: boolean = false; //业务模块弹窗
  inputMoadlTableData: Array<any> = []; //弹窗表格
  allChecked: boolean = false;
  indeterminate: boolean = false;
  inputModalUpdate: Array<any> = [];
  cardPhotoList = [];
  previewImage = '';
  previewVisible = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private nn: NzNotificationService,
              private http: HttpUtilService,
              private info: UserinfoService,
              private glo: GlobalService,
              public upload: UploadFiles) {
  }

  ngOnInit() {
    this.upload.setUpload();

    let data = JSON.parse(sessionStorage.getItem('userListData'));
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));
    let tempData = {rowid: '', segmentId: ''};

    this.validateForm = this.fb.group({
      companyId: [{value: null, disabled: true}],
      userId: [{value: this.dataFlag ? tempData['userId'] : null, disabled: true}],
      loginName: [this.dataFlag ? tempData['loginName'] : null, [Validators.required]],
      name: [this.dataFlag ? tempData['name'] : null, [Validators.required]],
      employeeId: [this.dataFlag ? tempData['employeeId'] : null, [Validators.pattern('^[0-9a-zA-Z]*$')]],
      gender: [this.dataFlag ? tempData['gender'] : null, [Validators.required]],
      mobile: [this.dataFlag ? tempData['mobile'] : null, [Validators.required, Validators.pattern('^\\d{11}$')]],
      email: [this.dataFlag ? tempData['email'] : null, [Validators.email]],
      cardId: [this.dataFlag ? tempData['cardId'] : null, [Validators.pattern('^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',)]],
      driverId: [this.dataFlag ? tempData['driverId'] : null],
      status: [this.dataFlag ? tempData['status'] : null, [Validators.required]],
      loginAuthz: [this.dataFlag ? tempData['loginAuthz'] : null, [Validators.required]],
      remark: [this.dataFlag ? tempData['remark'] : null],
      segmentName: {value: this.dataFlag ? tempData['segmentName'] : null, disabled: false},
      cardPhoto: [this.dataFlag ? tempData['cardPhoto'] : null],
    });

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
      this.inputModalModel = tempData['companyName'];
      // this.validateForm.get('companyId').setValue(tempData['companyId']);
      this.validateForm.patchValue(tempData);
      this.rowid = tempData.rowid;
      this.segmentId = tempData.segmentId;

      if (tempData['cardPhoto']) {
        this.cardPhotoList = tempData['cardPhoto'].split(';').filter(item => item).map((url, index) => {
          return {
            uid: index + 1,
            name: `身份证${index + 1}.png`,
            status: 'done',
            url: url
          };
        });
      }

    }

    this.getStatic(this.statusArr, 'YHZT');
    this.getStatic(this.userCompanyTypeArr, 'YHLX');
    this.getStatic(this.userTypeArr, 'YHJS');
    this.getStatic(this.loginPowerArr, 'DLSQ');
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleChange(info, name) {
    if (info.type == 'success') { // 验证上传图片格式
      info.fileList.forEach((item, index) => {
        if (item.type.indexOf('image') < 0) {
          this.nn.warning('提示信息', '身份证照片上传格式不符合要求，请重新上传');
          this.cardPhotoList.splice(index, 1);
          return;
        }
      });
    }
    if (info.file.status === 'done') {
      if (name == 'cardPhoto') {
        // 多图片
        this.cardPhotoList = this.cardPhotoList.map(item => item.originFileObj ? item.originFileObj : item);
        this.validateForm.patchValue({cardPhoto: this.cardPhotoList.map(item => item.url).join(';')});
      }

    }
    if (info.file.status === 'removed') {
      console.log(info.fileList);
      console.log(this.cardPhotoList);
      if (name == 'cardPhoto') {
        // 多图片
        this.validateForm.patchValue({cardPhoto: this.cardPhotoList.map(item => {if(item.status != 'removed'){
          return item.url}
        }).join(';')});
      }

    }
  }


  submitForm(): void {
    if (!this.dataFlag) {
      let addUrl = `${environment.baseUrl}user/addUser`;
      this.operate(addUrl);
    } else {
      let updateUrl = `${environment.baseUrl}user/updateList`;
      this.operate(updateUrl);
    }
  }

  //添加和修改的逻辑
  operate(url: string): void {
    for (const i in this.validateForm.controls) {
      if (typeof(this.validateForm.controls[i].value) == 'string') {
        let str = this.validateForm.controls[i].value + '';
        str = str.trim();
      }
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let param = {rowid: '', companyId: '', segmentId: '', busiSegments: null, companyName: ''};
    param = this.validateForm.getRawValue();
    param.rowid = this.rowid;
    param.segmentId = this.segmentId;
    param.companyName = this.inputModalModel;
    if (this.inputMoadlTableData && this.inputMoadlTableData.length > 0) {
      const segmentIds = this.segmentId.split(',');
      param.busiSegments = this.inputMoadlTableData.filter(item => segmentIds.some(sid => sid === item.segmentId));
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    !this.segmentId && (param['segmentName'] = '');
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.router.navigate(['/system/userManage/list']);
          this.glo.searchReload.emit({target: 'userlist'});
        }
      }
    );

  }

  cancel(): void {
    sessionStorage.removeItem('userListData');
    this.router.navigate(['/system/userManage/list']);
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

  getSegmentInformation(): void {
    this.http.post(urls.getSegmentInformation, {transType: '20'}).then(
      (res: any) => {
        if (res.success) {
          this.inputMoadlTableData = res.data.data || [];
          if (this.inputMoadlTableData) {
            if (this.segmentId) {

              const strings = this.segmentId.split(',');

              strings.forEach(
                value => {
                  this.inputMoadlTableData.forEach(
                    res => {
                      if (res.segmentId === value) {
                        res.checked = true;
                      }
                    }
                  );
                }
              );
              this.refreshStatus();

            }
          }
        }
      }
    );
  }

  inpEmit(data: any) {
    this.inpData = data;
    this.validateForm.get('companyId').setValue(data.inpValue);
  }

  inputClick() {
    this.inputMoadlVisible = true;
    this.getSegmentInformation();


  }

  inputMoadleCancel(): void {
    this.inputMoadlVisible = false;
  }

  inputMoadlOk(): void {
    let segmentName = '';
    this.segmentId = '';
    for (const data of this.inputModalUpdate) {
      segmentName += data.segmentName + ',';
      this.segmentId += data.segmentId + ',';
    }
    segmentName = segmentName.slice(0, segmentName.length - 1);
    this.segmentId = this.segmentId.slice(0, this.segmentId.length - 1);
    this.validateForm.get('segmentName').setValue(segmentName);

    this.inputMoadlVisible = false;
  }

  checkAll(value: boolean): void {
    this.inputMoadlTableData.forEach(
      data => {
        data.checked = value;
      }
    );
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.inputMoadlTableData.every(value => value.checked === true);
    const allUnChecked = this.inputMoadlTableData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.inputModalUpdate = [];
    this.inputModalUpdate = this.inputMoadlTableData.filter(
      value => value.checked === true
    );
  }

  segmentChange(data) {
    !data && (this.segmentId = '');
  }


}
