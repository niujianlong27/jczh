/* import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {Utils} from '../../../../common/util/utils';
import {NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {urls} from '../../../../common/model/url';
import {format} from 'date-fns';
import {UploadFiles} from '../../../../common/services/upload-files';
import { validate } from 'codelyzer/walkerFactory/walkerFn';
import { validateVehicleNo, validateCardId, validatePhone, validateBankNo } from '../../../../common/validators/validator';
import {inpModalUrl} from '../../../../common/model/inpModalUrl';
import {from} from 'rxjs';
import {take, skip, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { GlobalService } from '../../../../common/services/global-service.service';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})
export class VehicleAddComponent implements OnInit {

  // 上传相关
  previewImage = '';
  previewVisible = false;
  validateForm: FormGroup;
  dataFlag: Boolean = false;      //false为‘添加’，true为‘修改’功能
  rowid: number;
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  inputModalModel: string; // 公司名字 输入
  borderRed: boolean = false; // 公司名字输入状态
  companyData: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  inpData: any = {};

  vehicleImgUrlArr: Array<any> = [];   // 车辆照片
  insuranceImgArr:Array<any> = [];     // 保险单照片
  commercialInsuranceImgArr:Array<any> = [];
  drivelicenseImgArr:Array<any> = [];  // 行驶证照片
  agreementImgArr:Array<any> = []; // 挂靠协议
  truckTypeList:Array<any> = []; // 货车类型
  transportCapacityList = []; // 运输能力
  kindList:any=[];//车型
  vehicleKindList:any=[];//种类
  buttonId:any = 'Add'
  controlArray: Array<any> = [
    {
      cName: '公司ID', eName: 'companyId', type: 'text', require: true, validateCon: '请输入公司ID',
      disabled: true
    },
    {
      cName: '公司名称', eName: 'companyName', type: 'modal', require: true, validateCon: '请输入公司名称',
      disabled: false
    },
    {
      cName: '车牌号', eName: 'vehicleNo', type: 'text', require: true, validateCon: '请输入车牌号',
      disabled: false, customPattern: validateVehicleNo(),
      customValidateStatus: 'pattern', customValidateCon: '车牌格式不正确',
    },

    {
      cName: '车长', eName: 'vehicleLength', type: 'number', require: true, validateCon: '请输入车长',
      disabled: false
    },
    {
      cName: '车宽', eName: 'vehicleWidth', type: 'number', require: true, validateCon: '请输入车宽',
      disabled: false
    },
    {
      cName: '车高', eName: 'vehicleHeight', type: 'number', require: true, validateCon: '请输入车高',
      disabled: false
    },
    {
      cName: '轴数', eName: 'axleNum', type: 'number', require: true, validateCon: '请输入轴数',
      disabled: false
    },

    {
      cName: '载重类型', eName: 'truckType', type: 'select', require: true, validateCon: '请输入货车类型',
      disabled: false,selectList:this.truckTypeList
    },

    {
      cName: '总重量', eName: 'totalWeight', type: 'text', require: true, validateCon: '请输入总重量',
      disabled: false
    },

    {
      cName: '载重', eName: 'capacity', type:'number', require: true, validateCon: '请输入载重',
      disabled: false
    },
    {
      cName: '车型', eName: 'kind', type:'select', require: true, validateCon: '请选择车型',selectList:this.kindList,
      disabled: false
    },
    {
      cName: '种类', eName: 'vehicleKind', type:'select', require: true, validateCon: '请选择种类',selectList:this.vehicleKindList,
      disabled: false
    },
    {
      cName: '运输能力', eName: 'transportCapacity', type: 'select', require: true, validateCon: '请选择运输能力',
      disabled: false, selectList: this.transportCapacityList
    },

    {
      cName: '发动机号', eName: 'engineNo', type: 'text', show: false, validateCon: '请输入发动机号',
      disabled: false
    },

    {
      cName: '备注', eName: 'remark', type: 'text', require: false, validateCon: '请输入备注',
      disabled: false, maxLength: 50
    },
    {
      cName: '车辆照片', eName: 'vehicleImgUrl', type: 'upload', require: this.buttonId==='Add', show: false, validateCon: '请上传车辆照片',dataArr: this.vehicleImgUrlArr,
      disabled: false
    },
    {
      cName: '行驶证照片', eName: 'drivelicenseImg', type: 'upload', require: this.buttonId==='Add', show: false, validateCon: '请上传行驶证照片',dataArr: this.drivelicenseImgArr,
      disabled: false
    },
    {
      cName: '交强险保单', eName: 'insuranceImg', type: 'upload',require: this.buttonId==='Add',  show: false, validateCon: '请上传交强险保单',dataArr: this.insuranceImgArr,
      disabled: false
    },
    {
      cName: '商业险保单', eName: 'commercialInsuranceImg', type: 'upload',require: this.buttonId==='Add',  show: false, validateCon: '请上传商业险保单',dataArr: this.commercialInsuranceImgArr,
      disabled: false
    },
    {
      cName: '挂靠协议照片', eName: 'agreementImg', type: 'upload', require: this.buttonId==='Add', show: false, validateCon: '请上传协议照片',dataArr: this.agreementImgArr,
      disabled: false
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpUtilService,
    private info: UserinfoService,
    public upload: UploadFiles,
    private nzMess: NzNotificationService,
    public route: ActivatedRoute,
    public global: GlobalService) {
  }

  ngOnInit(): void {
    this.getStatic(this.truckTypeList, 'HCLX');
    this.getStatic(this.transportCapacityList, 'YSNL');
    this.getStatic(this.kindList, 'VKIND');
    this.getStatic(this.vehicleKindList, 'PZKRCDMCX');

    this.validateForm = this.fb.group({});
    for (const control of this.controlArray) {
      const validateArr = [];
      control.eName == 'transportCapacity' && (control.selectList = this.transportCapacityList);
      if (control.require) {

        validateArr.push(Validators.required);
      }
      if (control.customPattern) {
        validateArr.push(Validators.pattern(control.customPattern));
      }
      if (control.customValidate) {
        validateArr.push(control.customValidate);
      }
      this.validateForm.addControl(control.eName, new FormControl( {value: null, disabled: control.disabled}, validateArr ));
      if (control.eName === 'companyName') {
        this.validateForm.get('companyName').clearValidators();
      }
    }
    let data;
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));
    let tempData;
    // 获取manage也传过来的queryParams
    this.route.queryParams.subscribe((res) => {
      this.validateForm.reset();
      this.validateForm.get('transportCapacity').setValue('YSNL10');
      const d = JSON.parse(res.vehicleData)
      data = JSON.parse(sessionStorage.getItem('vehicleData') || "{}");
      if (!d) {
        this.buttonId = 'Add'
        if (this.companyData) {
          this.inputModalModel = this.companyData.companyName;
          this.validateForm.get('companyId').setValue(this.companyData.companyId);
        } else {
          this.inputModalModel = this.info.get('USER').companyName;
          this.validateForm.get('companyId').setValue(this.info.get('USER').companyId);
        }

      } else if (data.data && data.data.length > 0) {
        this.buttonId = 'Update'
        tempData =  data.data && data.data[0] || {};
        this.dataFlag = true;
        this.validateForm.patchValue(tempData);
        this.rowid = tempData.rowid;
        this.inputModalModel = tempData.companyName;
        this.validateForm.get('vehicleImgUrl').setValidators([]);
        this.validateForm.get('drivelicenseImg').setValidators([]);
        this.validateForm.get('insuranceImg').setValidators([]);
        this.validateForm.get('commercialInsuranceImg').setValidators([]);
        this.validateForm.get('agreementImg').setValidators([]);
        if (tempData['vehicleImgUrl']) {
          this.vehicleImgUrlArr = tempData['vehicleImgUrl'].split(';').filter(item => item).map((url, index) => {
            return {
              uid: index + 1,
              name: `驾驶证${index + 1}.png`,
              status: 'done',
              url: url
            }
          });
        }
        if (tempData['drivelicenseImg']) {
          this.drivelicenseImgArr = tempData['drivelicenseImg'].split(';').filter(item => item).map((url, index) => {
            return {
              uid: index + 1,
              name: `行驶证${index + 1}.png`,
              status: 'done',
              url: url
            }
          });
        }
        if (tempData['insuranceImg']) {
          this.insuranceImgArr = tempData['insuranceImg'].split(';').filter(item => item).map((url, index) => {
            return {
              uid: index + 1,
              name: `交强险保单${index + 1}.png`,
              status: 'done',
              url: url
            }
          });
        }
        if (tempData['commercialInsuranceImg']) {
          this.commercialInsuranceImgArr = tempData['commercialInsuranceImg'].split(';').filter(item => item).map((url, index) => {
            return {
              uid: index + 1,
              name: `商业险保单${index + 1}.png`,
              status: 'done',
              url: url
            }
          });
        }
        if (tempData['agreementImg']) {
          this.agreementImgArr = tempData['agreementImg'].split(';').filter(item => item).map((url, index) => {
            return {
              uid: index + 1,
              name: `挂靠协议${index + 1}.png`,
              status: 'done',
              url: url
            }
          });
        }
        for (const control of this.controlArray) {
          control.eName == 'vehicleImgUrl' && (control.dataArr = this.vehicleImgUrlArr);
          control.eName == 'drivelicenseImg' && (control.dataArr = this.drivelicenseImgArr);
          control.eName == 'insuranceImg' && (control.dataArr = this.insuranceImgArr);
          control.eName == 'commercialInsuranceImg' && (control.dataArr = this.commercialInsuranceImgArr);
          control.eName == 'agreementImg' && (control.dataArr = this.agreementImgArr);

        }
      }
    });

  }

  submitForm(): void {
    let param :any = {};
    if (!this.dataFlag) {  //新增
      let addUrl = `${environment.baseUrl}vehicle/insertVehicle`;
      this.operate(addUrl,param);
    } else { // 修改
      let updateUrl = `${environment.baseUrl}vehicle/updateVehicle`;
      this.operate(updateUrl,param);
    }

  }

  //添加和修改的逻辑
  operate(url: string,paramgram={}): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
    let param = this.validateForm.getRawValue();
    param.vehicleLength = param.vehicleLength ? Number(param.vehicleLength) : null;
    param.capacity = param.capacity ? Number(param.capacity) : null;

    this.dataFlag &&  (param.rowid = this.rowid);
    this.http.post(url, {...param,...paramgram}).then(
      (res: any) => {
        if (res.success) {
          this.router.navigate(['/system/baseInformation/vehicleManage']);
          this.global.searchReload.emit({target: 'vehicleManage'});
          this.nzMess.success('提示消息', '保存成功！');

        }
      }
    );
  }

  cancel(): void {
    sessionStorage.removeItem('vehicleData');
    this.router.navigate(['/system/baseInformation/vehicleManage']);
  }

  // 图片上传相关
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleChange(info, name) {
    if (info.file.status === 'done' || info.file.status === 'removed') {
      let Arr = info.fileList;
      switch (name) {
        case 'vehicleImgUrl' :
          this.vehicleImgUrlArr = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({ vehicleImgUrl: this.vehicleImgUrlArr.map(item => item.url).join(";") });
          break;
        case 'drivelicenseImg' :
          this.drivelicenseImgArr = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({ drivelicenseImg: this.drivelicenseImgArr.map(item => item.url).join(";") });
          break;
        case 'insuranceImg' :
          this.insuranceImgArr = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({ insuranceImg: this.insuranceImgArr.map(item => item.url).join(";") });
          break;
        case 'commercialInsuranceImg' :
          this.commercialInsuranceImgArr = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({ commercialInsuranceImg: this.commercialInsuranceImgArr.map(item => item.url).join(";") });
          break;
        case 'agreementImg' :
          this.agreementImgArr = Arr.map(item => item.originFileObj ? item.originFileObj : item);
          this.validateForm.patchValue({ agreementImg: this.agreementImgArr.map(item => item.url).join(";") });
          break;

      }
    }
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
  inpEmitModal(data:any,name: string){
    const da = data.selData && data.selData[0] || {};
    this.validateForm.get(name).setValue(data.inpName);
    if(name === 'truckGroupName'){
      this.validateForm.get('truckGroup').setValue(da.companyId);
    }else if(name === 'settleCarrierName'){
      this.validateForm.get('settleCarrierId').setValue(da.companyId);
    }
  }

}
*/

/**
 *  车辆管理-新增 -修改 -审核
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { ImgViewerService } from '@component/img-viewer/img-viewer';
import { UploadFiles } from '@service/upload-files';
import { UploadFile, NzMessageService, NzModalService, UploadFilter } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { retry } from 'rxjs/operators';
import { UserinfoService } from '@service/userinfo-service.service';
import { GlobalService } from '@service/global-service.service';
import { validateVehicleNo } from '@validator/validator';
import { format } from 'date-fns';
@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})
export class VehicleAddComponent implements OnInit {
  public baseInfoData: any[] = [
    {
      cName: '公司名称',
      eName: 'companyName',
      type: 'text',
      disabled: true,
      required: true,
      model: this.info.get('USER').companyName,
      validators: [Validators.required]
    },
    { cName: '公司Id', eName: 'companyId', model: this.info.get('USER').companyId },
    {
      cName: '车牌号',
      eName: 'vehicleNo',
      type: 'text',
      required: true,
      errorMsg: '车牌号格式不正确',
      validators: [Validators.required, Validators.pattern(validateVehicleNo())]
    },
    { cName: '车型', eName: 'vehicleKind', type: 'select', required: true, list: [], validators: [Validators.required] },
    { cName: '行驶证主页', eName: 'drivelicenseImg', type: 'upload', required: true, value: [], validators: [Validators.required] },
    { cName: '行驶证副页', eName: 'drivelicenseImg2', type: 'upload', required: true, value: [], validators: [Validators.required] },
    {
      cName: '车主姓名',
      eName: 'ownerName',
      type: 'inputModal',
      required: true,
      placeholder: '请输入车主姓名进行搜索',
      findset: { url: 'getUserListByNameNew', name: '选择车主', formId: 'form_user_input_modal', parameter: 'name' },
      validators: [Validators.required]
    },
    { cName: '车主Id', eName: 'ownerId' },
    { cName: '联系方式', eName: 'phone', type: 'text', required: true, disabled: true, validators: [Validators.required] }
  ];

  public drivelicenseInfoData: any[] = [
    { cName: '车辆类型', eName: 'lsType', type: 'text', required: true, validators: [Validators.required] },
    { cName: '所有人', eName: 'lsOwner', type: 'text', required: true, validators: [Validators.required] },
    { cName: '住址', eName: 'lsAddress', type: 'text', required: true, validators: [Validators.required] },
    { cName: '使用性质', eName: 'lsUseType', type: 'text', required: true, validators: [Validators.required] },
    { cName: '品牌型号', eName: 'lsModel', type: 'text', required: true, validators: [Validators.required] },
    { cName: '发证机构', eName: 'lsOffice', type: 'text', required: true, validators: [Validators.required] },
    { cName: '车架号', eName: 'frameNo', type: 'text', required: true, validators: [Validators.required] },
    { cName: '发动机号', eName: 'engineNo', type: 'text', required: true, validators: [Validators.required] },
    { cName: '注册日期', eName: 'lsRegDate', type: 'date', required: true, validators: [Validators.required] },
    { cName: '发证日期', eName: 'lsIssueDate', type: 'date', required: true, validators: [Validators.required] }
  ];

  public vehicleInfoData: any[] = [
    { cName: '导航车型', eName: 'kind', type: 'select', required: true, list: [], validators: [Validators.required] },
    { cName: '总重量', eName: 'totalWeight', type: 'number', required: true, validators: [Validators.required] },
    { cName: '载重', eName: 'capacity', type: 'number', required: true, validators: [Validators.required] },
    { cName: '车辆正面', eName: 'vehicleImgUrl', required: true, type: 'upload', value: [], validators: [Validators.required] },
    { cName: '车辆主驾', eName: 'vehicleImgUrl2', type: 'upload', required: true, value: [], validators: [Validators.required] },
    { cName: '车长', eName: 'vehicleLength', type: 'number', required: true, validators: [Validators.required] },
    { cName: '车宽', eName: 'vehicleWidth', type: 'number', required: true, validators: [Validators.required] },
    { cName: '车高', eName: 'vehicleHeight', type: 'number', required: true, validators: [Validators.required] },
    { cName: 'VIP车辆主驾', eName: 'vipImgUrl1', type: 'upload', value: [] },
    { cName: 'VIP车辆副驾', eName: 'vipImgUrl2', type: 'upload', value: [] },
    {
      cName: '轴数',
      eName: 'axleNum',
      type: 'select',
      required: true,
      list: [
        { name: '1轴', value: '1轴' },
        { name: '2轴', value: '2轴' },
        { name: '3轴', value: '3轴' },
        { name: '4轴', value: '4轴' },
        { name: '5轴', value: '5轴' },
        { name: '6轴', value: '6轴' },
        { name: '6轴以上', value: '6轴以上' }
      ],
      validators: [Validators.required]
    },
    {
      cName: '排放标准',
      eName: 'emissionStand',
      type: 'select',
      required: true,
      list: [
        { name: '国三', value: '国三' },
        { name: '国四', value: '国四' },
        { name: '国五', value: '国五' },
        { name: '国六', value: '国六' }
      ],
      validators: [Validators.required]
    },
    { cName: '是否为VIP车辆', eName: 'vipStatus', type: 'checkbox' }
  ];

  public insuranceInfoData: any[] = [
    { cName: '保险公司', eName: 'insCompany', type: 'select', list: [] },
    { cName: '保险单号', eName: 'insNo', type: 'text' },
    { cName: '保险起始日期', eName: 'insStartDate', type: 'date' },
    { cName: '保险终止日期', eName: 'insEndDate', type: 'date' },
    { cName: '交强险保单首页', eName: 'insuranceImg', type: 'upload', required: true, value: [], validators: [Validators.required] },
    { cName: '商业险保单首页', eName: 'commercialInsuranceImg', type: 'upload', value: [] }
  ];

  public auditInfoData: any[] = [
    { cName: '审核状态', eName: 'auditStatus', type: 'select', list: [] },
    { cName: '审核方式', eName: 'auditWay', type: 'select', list: [] },
    { cName: '驳回理由', eName: 'backReason', type: 'areaText' },
    { cName: '提交人', eName: 'submitUser', type: 'text', disabled: true, model: this.info.get('USER').name },
    { cName: '提交时间', eName: 'submitDate', type: 'date', disabled: true },
    { cName: '备注', eName: 'remark', type: 'areaText' }
  ];

  public formData: any[] = [];
  private updateData: any = {};
  public vehicleForm: FormGroup;
  public modalForm: FormGroup;
  public btnLoading: boolean;
  public checkLoading: boolean;
  public rejectLoading: boolean;
  public visible: boolean;
  public imgType = 'image/png,image/jpeg,image/gif,image/bmp,image/jpg,image/svg,image/tiff';
  public pageStatus: 'add' | 'update' | 'check';

  public filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => this.imgType.split(',').indexOf(w.type) !== -1);
        if (filterFiles.length !== fileList.length) {
          this.mess.error('包含文件格式不正确，只支持 png, jpeg, gif, bmp, jpg, svg, tiff 格式');
          return filterFiles;
        }
        return fileList;
      }
    }
  ];

  constructor(
    public upload: UploadFiles,
    private imgService: ImgViewerService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private info: UserinfoService,
    private mess: NzMessageService,
    private glo: GlobalService,
    private modal: NzModalService
  ) {}

  // 图片查看
   public handlePreview = (file: UploadFile) => {
     this.imgService.viewer({ url: file.url || file.thumbUrl });
   }

   ngOnInit() {
     this.getStatic('PZKRCDMCX', 'vehicleKind');
     this.getStatic('VKIND', 'kind');
     this.getStatic('INSCOMPANY', 'insCompany');
     this.formData = [
       {
         title: '车辆基本信息',
         form: this.baseInfoData
       },
       {
         title: '行驶证信息',
         form: this.drivelicenseInfoData
       },
       {
         title: '车辆参数',
         form: this.vehicleInfoData
       },
       {
         title: '保险信息',
         form: this.insuranceInfoData
       }
     ];
     if (this.router.url === '/system/baseInformation/vehicleAdd') {
       this.pageStatus = 'add';
     } else if (this.router.url === '/system/baseInformation/vehicleUpdate') {
       this.pageStatus = 'update';
     } else if (this.router.url === '/system/baseInformation/vehicleCheck') {
       this.pageStatus = 'check';
       this.getStatic('SHZT', 'auditStatus');
       this.getStatic('SHFS', 'auditWay');
       this.formData = [
         {
           title: '车辆基本信息',
           form: this.baseInfoData
         },
         {
           title: '审核结果',
           form: this.auditInfoData
         },
         ...this.formData.slice(1)
       ];
     }
     this.vehicleForm = this.fb.group({});
     this.formData.forEach((item: any, index: number) => {
       item.form.forEach((x: any) => {
         this.vehicleForm.addControl(x.eName, new FormControl(
           { value: x.model || null, disabled: this.pageStatus === 'check' ? true : x.disabled },
           (x.required && this.pageStatus === 'add') ||
           (x.required && this.pageStatus === 'update' && index === 0
           && x.eName !== 'drivelicenseImg' && x.eName !== 'drivelicenseImg2') ? x.validators : null
         ));
       });
     });
     if (this.pageStatus !== 'add') {
       this.updateData = JSON.parse(sessionStorage.getItem('vehicleData') || '{}');
       this.updateData.vipStatus = this.updateData.vipStatus === '1';
       this.vehicleForm.patchValue(this.updateData);
       this.formData.forEach((d: any) => {
         d.form.forEach((item: any, index: number) => {
           if (item.type === 'upload' && this.updateData[item.eName]) {
             item.value = [{ url: this.updateData[item.eName], status: 'done', uid: index }];
           }
           if (item.type === 'inputModal' && item.eName === 'ownerName') {
             item.extraParam = { companyId: this.vehicleForm.get('companyId').value };
           }
         });
       });
     }
   }

   // 选择车主
   public inpEmit(data: any, b: any) {
     const nameObj = (data.selData && data.selData[0]) || {};
     if (b.eName === 'ownerName') {
       this.vehicleForm.get('ownerName').setValue(nameObj.name);
       this.vehicleForm.get('ownerId').setValue(nameObj.userId);
       this.vehicleForm.get('phone').setValue(nameObj.mobile);
     }
   }

   // 保存
   public save() {
     // console.log(this.vehicleForm.get('vehicleNo'));
     // tslint:disable-next-line: forin
     // for (const i in this.vehicleForm.controls) {
     //   this.vehicleForm.controls[i].markAsDirty();
     //   this.vehicleForm.controls[i].updateValueAndValidity();
     // }
     // if (this.vehicleForm.status === 'INVALID') {
     //   return;
     // }
     // let url = 'vehicle/insertVehicle';
     const param = this.vehicleForm.getRawValue();
     console.log(param)
     // const otherParam: any = {};
     // param.lsRegDate = format(param.lsRegDate, 'YYYY-MM-DD') || undefined;
     // param.lsIssueDate = format(param.lsIssueDate, 'YYYY-MM-DD') || undefined;
     // param.insStartDate = format(param.insStartDate, 'YYYY-MM-DD') || undefined;
     // param.insEndDate = format(param.insEndDate, 'YYYY-MM-DD') || undefined;
     // param.submitDate = format(param.submitDate, 'YYYY-MM-DD') || undefined;
     // param.vipStatus = param.vipStatus ? '1' : '0';
     // if (this.pageStatus === 'update') {
     //   url = 'vehicle/updateVehicle';
     //   otherParam.rowid = this.updateData.rowid;
     // }
     // this.btnLoading = true;
     // this.http.post(
     //   `${environment.baseUrl}${url}`,
     //   {
     //     ...param,
     //     ...otherParam
     //   }
     // ).subscribe((res: any) => {
     //   this.btnLoading = false;
     //   if (res.code === 100) {
     //     this.mess.success(res.msg);
     //     this.glo.searchReload.emit({ target: 'vehicleManage' });
     //     this.router.navigate(['/system/baseInformation/vehicleManage']);
     //   }
     // });
   }

   // 通过
   public check() {
     // tslint:disable-next-line: forin
     //  for (const i in this.vehicleForm.controls) {
     //    this.vehicleForm.controls[i].markAsDirty();
     //    this.vehicleForm.controls[i].updateValueAndValidity();
     //  }
     if (this.vehicleForm.get('auditWay').value !== 'SHFS20' && this.vehicleForm.get('auditStatus').value === 'SHZT10') {
       this.modal.error({
         nzTitle: '信息提示',
         nzContent: '已通过车辆无法进行通过操作'
       });
       return;
     }
     this.checkLoading = true;
     this.http.post(
       `${environment.baseUrl}vehicle/checkAccess`,
       {
         tVehicleModels: [
           {
             ...this.vehicleForm.getRawValue(),
             rowid: this.updateData.rowid
           }]
       }
     ).subscribe((res: any) => {
       this.checkLoading = false;
       if (res.code === 100) {
         this.mess.success(res.msg);
         this.glo.searchReload.emit({ target: 'vehicleManage' });
         this.router.navigate(['/system/baseInformation/vehicleManage']);
       }
     });
   }

   // 驳回
   public reject() {
     if (this.vehicleForm.get('auditStatus').value === 'SHZT30') {
       this.modal.error({
         nzTitle: '信息提示',
         nzContent: '未通过车辆无法进行驳回操作'
       });
       return;
     }
     this.visible = true;
     this.modalForm = this.fb.group({
       backReason: [null, [Validators.required]]
     });
   }

   public rejectResult() {
     // tslint:disable-next-line: forin
     for (const i in this.modalForm.controls) {
       this.modalForm.controls[i].markAsDirty();
       this.modalForm.controls[i].updateValueAndValidity();
     }
     if (this.modalForm.status === 'INVALID') {
       return;
     }
     this.rejectLoading = true;
     this.http.post(
       `${environment.baseUrl}vehicle/checkReject`,
       {
         backReason: this.modalForm.get('backReason').value,
         tVehicleModels: [
           {
             ...this.vehicleForm.getRawValue(),
             rowid: this.updateData.rowid
           }
         ]
       }
     ).subscribe((res: any) => {
       this.rejectLoading = false;
       if (res.code === 100) {
         this.mess.success(res.msg);
         this.glo.searchReload.emit({ target: 'vehicleManage' });
         this.router.navigate(['/system/baseInformation/vehicleManage']);
       }
     });
   }

   // 上传图片
   public handleChange(d: any) {
     const pic = d.value.map((x: any) => {
       if (x.status === 'done') {
         return (x.originFileObj && x.originFileObj.url) || x.url;
       }
     }).join(',');
     this.vehicleForm.get(d.eName).setValue(pic || null);
     this.vehicleForm.get(d.eName).markAsDirty();
     this.vehicleForm.get(d.eName).updateValueAndValidity();
   }

   // 静态数据
   private getStatic(code: string, flag: string) {
     this.http.post(
       `${environment.baseUrl}static/getStatic`,
       {
         valueSetCode: code
       }
     ).pipe(
       retry(3)
     ).subscribe((res: any) => {
       if (res.code === 100) {
         const data = (res.data && res.data.data) || [];
         const list = [...this.baseInfoData, ...this.drivelicenseInfoData,
           ...this.auditInfoData, ...this.insuranceInfoData, ...this.vehicleInfoData];
         const param = list.filter((x: any) => x.eName === flag);
         if (param[0]) {
           param[0].list = data;
         }
       }
     });
   }

   // 返回
   public back() {
     this.router.navigate(['/system/baseInformation/vehicleManage']);
   }
}
