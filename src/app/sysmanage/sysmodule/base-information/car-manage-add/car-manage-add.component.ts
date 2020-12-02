import {Component, Host, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {UploadFiles} from '@service/upload-files';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {GlobalService} from '@service/global-service.service';
import {urls} from '@model/url';
import {localUrls} from '@model/localUrls';
import {forkJoin, from, throwError} from 'rxjs';
import {concatMap, map, reduce, retry} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {GridRowSource} from '@component/simple-page/grid-block/grid-row.directive';
import {UserinfoService} from '@service/userinfo-service.service';
import {inpModalUrl} from '@model/inpModalUrl';


@Component({
  selector: 'app-car-manage-add',
  templateUrl: './car-manage-add.component.html',
  styleUrls: ['./car-manage-add.component.css'],
  providers: [
    GridRowSource
  ],
})
export class CarManageAddComponent implements OnInit, OnDestroy {

  validateForm: FormGroup = this.fb.group({});
  carManageData: any = {};
  vehicleKinds: Array<any> = [];
  products: Array<any> = [];
  isSingleList: Array<any> = [];
  receiveTypeList: Array<any> = [];
  settleCarrierIdList: Array<any> = [];
  vehicleNoOld = ''; //旧需求中，可修改车牌号，用于存旧车牌
  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};
  inputModalModel: string = null;
  settleCarrierId: string = null;
  borderRed = false;

  segmentIds: Array<any> = []; // 业务类型和流向集合
  selectSegmentIds: Array<any> = []; // 业务类型和流向选择集合

  buttonLoading = false;
  spinning = true; // 加载状态
  @ViewChild('endPointRef') endPointRef: TemplateRef<any>;

  controlArray: Array<any> = [
    {
      cName: '车牌号', eName: 'vehicleNo', type: 'text', require: true, disabled: false, validateCon: '请输入车牌号!',
      validators: {
        require: true,
        pattern: true,
        patternStr: '(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-HJ-NP-Z]{1}[A-HJ-NP-Z]{1}(([0-9]{5}[DF])|(DF[0-9]{4}))$)|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-HJ-NP-Z]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$)|(^(日钢){1}[0-9A-HJ-NP-Z]{5}$)|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-HJ-NP-Z0-9\\/]{8}$)',
        patternErr: '车牌号格式不正确'
      }
    },
    {
      cName: '车辆类型', eName: 'vehicleKind', type: 'defaultSelect', require: true, disabled: false, validateCon: '请选择车辆类型!',
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: this.vehicleKinds
    },
    {
      cName: '车盘宽度', eName: 'diskWidth', type: 'number', require: true, disabled: false, validateCon: '请输入车盘宽度!',
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      numberType: {
        nzMin: 0,
        nzMax: 99999999999,
        nzPrecision: 3,
        nzStep: 1
      }
    },
    {
      cName: '可承运品种', eName: 'productName', type: 'select', require: true, disabled: false, validateCon: '请选择可承运品种!',
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: this.products
    },
    {
      cName: '载重', eName: 'weight', type: 'number', require: true, disabled: false, validateCon: '请输入载重!',
      extra: true,
      extraContent: '吨',
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      numberType: {
        nzMin: 0,
        nzMax: 99999999999,
        nzPrecision: 3,
        nzStep: 1
      }
    },
    {
      cName: '车辆长度', eName: 'vehicleLength', type: 'number', require: true, disabled: false, validateCon: '请输入车辆长度!',
      extra: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      numberType: {
        nzMin: 0,
        nzMax: 99999999999,
        nzPrecision: 3,
        nzStep: 1
      }
    },
    {
      cName: '应收税率', eName: 'recTax', type: 'number', require: true, disabled: false, validateCon: '请输入应收税率字段!',
      validators: {
        require: true,
        pattern: false,
      },
      numberType: {
        nzMin: 0,
        nzMax: 99999999999,
        nzPrecision: 3,
        nzStep: 1
      }
    },
    {
      cName: '姓名', eName: 'name', type: 'text', require: false, disabled: false, validateCon: '请输入姓名!',
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '随车电话', eName: 'vehicleMobile', type: 'number', require: false, disabled: false, validateCon: '请输入随车电话!',
      validators: {
        require: false,
        pattern: true,
        patternStr: '^\\d{11}$',
        patternErr: '随车电话格式输入不正确，请输入十一位数字!',
      },
      numberType: {
        nzMin: 0,
        nzMax: 9999999999999999,
        nzPrecision: 0,
        nzStep: 1
      }
    },
    {
      cName: '身份证号', eName: 'cardId', type: 'text', require: false, disabled: false, validateCon: '请输入身份证号!',
      validators: {
        require: false,
        pattern: true,
        patternStr: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
        patternErr: '身份证号格式不正确,请重新填写!'
      }
    },
    {
      cName: '是否单车结算', eName: 'isSingle', type: 'defaultSelect', require: false, disabled: false, validateCon: '请选择是否单车结算!',
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: this.isSingleList
    },
    {
      cName: '计价方式', eName: 'receiveType', type: 'defaultSelect', require: false, disabled: false, validateCon: '请选择计价方式!',
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: this.receiveTypeList
    },
    {
      cName: '车辆结算的结算单位', eName: 'settleCarrierId', type: 'modal', require: false, disabled: false, validateCon: '请选择计价方式!',
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: this.settleCarrierIdList
    },
  ];
  checkArray: Array<any> = [
    {
      cName: '平台认证状态', eName: 'authStatusName', type: 'text', require: false, disabled: true, validateCon: '请输入车牌号!',
      validators: {
        require: false,
        pattern: false,
        patternStr: '(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|(DF[0-9]{4}))$)|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$)|(^(日钢){1}[0-9A-Z]{5}$)|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z0-9]{5,7}$)',
        patternErr: '车牌号格式不正确'
      }
    },
    {
      cName: '驳回原因', eName: 'rejectReason', type: 'text', require: false, disabled: true, validateCon: '请输入车牌号!',
      validators: {
        require: false,
        pattern: false,
        patternStr: '(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|(DF[0-9]{4}))$)|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$)|(^(日钢){1}[0-9A-Z]{5}$)|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z0-9]{5,7}$)',
        patternErr: '车牌号格式不正确'
      }
    },
  ];

  refresh: any = Math.random().toString(36).substr(2);
  companyId:string;

  constructor(
    private http: HttpUtilService,
    public upload: UploadFiles,
    private fb: FormBuilder,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
    private router: Router,
    private glo: GlobalService,
    private httpClient: HttpClient,
    private info: UserinfoService,
    @Host() private rowSource: GridRowSource,
  ) {
  }

  ngOnInit() {
    this.companyId = this.info.APPINFO.USER.companyId;
    this.companyId == 'C000000899' && this.controlArray.forEach(item => {
      if (item.eName == 'isSingle'){
        item.disabled = true
      }
    });
    this.formInitialization(); // 表单初始化
    this.companyId == 'C000000899' && this.validateForm.get('isSingle').setValue('DCJS20');
    this.searchReloadEvent();
    this.getProd(); // 获取品种
    this.getStatic('CLLX', this.vehicleKinds); // 获取静态集值
    this.getStaticValue('DCJS', this.isSingleList); // 获取静态集值
    this.getStaticValue('JJFS', this.receiveTypeList); // 获取静态集值
  }

  /**
   * 点击确认
   */
  btnConfirm(): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }

    if (this.validateForm.status === 'VALID') {
      if (this.selectSegmentIds.length === 0) {
        this.nm.warning('请选择业务流向数据后操作！');
        return;
      }

      this.buttonLoading = true;
      switch (this.carManageData['status']) {
        case 'add':
          this.addRequest();
          break;
        case 'update':
          this.updateJudgment();
          break;
        default:
          this.nm.warning('页面来源非法！');
          break;
      }
    }
  }

  /**
   * 更新判断
   */
  updateJudgment(): void {
    this.nzModal.confirm({
      nzTitle: '提示消息',
      nzContent: '是否保存修改内容，并重新审核?',
      nzOnOk: () => this.updateRequest(),
      nzOnCancel: () => {
        this.router.navigateByUrl('system/baseInformation/carManage').then(
          value => {
            this.buttonLoading = false;
            if (value) {
              this.validateForm.get('vehicleNo').enable();
              this.segmentIds = [];
              this.selectSegmentIds = [];
              sessionStorage.removeItem('carManageData');
              this.validateForm.reset({});
              this.glo.searchReload.emit({target: 'carManageData'});
            } else {
              this.nm.error('跳转失败!');
            }
          }
        );
      }
    });
  }

  /**
   * 添加请求
   */
  addRequest(): void {
    const url = localUrls.insertVehicleInfo;
    const param = this.validateForm.getRawValue();
    param.segmentIds = this.selectSegmentIds.map(value => ({
      segmentId: value.segmentId,
      endPoint: value.endPoint && value.endPoint.toString(),
      startPoint: value.startPoint && value.startPoint.toString()
    }));
    param.vehicleKind = param.vehicleKind && param.vehicleKind.toString();
    param.productName = param.productName && param.productName.toString();
    // 公司id是C000000899 ；单车结算默认否
    this.companyId == 'C000000899' && (param.isSingle = 'DCJS20');

    this.http.post(url, param).then(
      res => {

        if (res.success) {
          this.nm.success('新增成功!');
          this.router.navigateByUrl('system/baseInformation/carManage').then(
            value => {
              if (value) {
                this.validateForm.get('vehicleNo').enable();
                this.segmentIds = [];
                this.selectSegmentIds = [];
                sessionStorage.removeItem('carManageData');
                this.validateForm.reset({});
                this.glo.searchReload.emit({target: 'carManageData'});
              } else {
                this.nm.error('跳转失败!');
              }
            }
          );
        }
        this.buttonLoading = false;

      }
    );
  }

  /**
   * 修改请求
   */
  updateRequest(): void {
    this.spinning = true;
    const url = localUrls.updateVehicleInfo;
    const param = this.validateForm.getRawValue();
    param.segmentIds = this.selectSegmentIds.map(value => ({
      segmentId: value.segmentId || null,
      endPoint: value.endPoint && value.endPoint.toString() || null,
      startPoint: value.startPoint && value.startPoint.toString() || null
    }));
    param.vehicleKind = param.vehicleKind && param.vehicleKind.toString();
    param.productName = param.productName && param.productName.toString();
    param.vehicleNoOld = this.vehicleNoOld;
    param.createId = this.carManageData['data'].createId;
    param.createDate = this.carManageData['data'].createDate;
    // 公司id是C000000899 ；单车结算默认否
    this.companyId == 'C000000899' && (param.isSingle = 'DCJS20');

    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nm.success('修改成功!');
          this.buttonLoading = false;

          this.router.navigateByUrl('system/baseInformation/carManage').then(
            value => {
              if (value) {
                this.validateForm.get('vehicleNo').enable();
                this.segmentIds = [];
                this.selectSegmentIds = [];
                sessionStorage.removeItem('carManageData');
                this.validateForm.reset({});
                this.glo.searchReload.emit({target: 'carManageData'});
              } else {
                this.nm.error('跳转失败!');
              }
            }
          );
        }
        this.buttonLoading = false;
        this.spinning = false;
      }
    );
  }

  /**
   * 点击取消
   */
  btnCancel(): void {
    this.router.navigateByUrl('system/baseInformation/carManage').then(
      value => {
        if (value) {
          this.validateForm.get('vehicleNo').enable();
          this.segmentIds = [];
          this.selectSegmentIds = [];
          this.validateForm.reset({});
          sessionStorage.removeItem('carManageData');
          this.glo.searchReload.emit({target: 'carManageData'});
        } else {
          this.nm.error('跳转失败!');
        }
        this.buttonLoading = false;
      }
    );
  }

  /**
   * 获取当前用户业务板块
   */
  getUserBusinessSegment() {
    this.http.post(urls.getSegmentInformation, {}).then(
      res => {
        const data: Array<any> = (res.data.data || []).map(x => ({name: x.segmentName, value: x.segmentId}));
        this.segmentIds = data.map(
          value => ({businessTypeName: value.name, segmentId: value.value, selectList: [], selectList2: []})
        );
        from(data).pipe(
          concatMap(
            value => forkJoin([this.getEndPointByBusi(value), this.getStartPointByBusi(value)])
          ),
          reduce((acc, value) => [...acc, value], [])
        ).subscribe(
          value => {
            this.segmentIds.forEach((value1: any, index) => {
              value1.selectList = value[index][0];
              value1.selectList2 = value[index][1];
            });

          },
          () => {
            setTimeout(
              () => {
                this.nzModal.warning({
                  nzTitle: '提示消息',
                  nzContent: '业务模式数据获取失败，请检查网络！'
                });
              }, 1000
            );
          },
          () => {
            if (this.carManageData['status'] === 'update') {
              this.getbusiAndEndPoint();
            } else {
              this.spinning = false;
            }
          }
        );
        // from(data).pipe(
        //   concatMap(
        //     value => this.httpClient.post(localUrls.getEndPointByBusi, {segmentId: value.value}).pipe(
        //       map(
        //         (value: any) => {
        //           if (value.code === 100) {
        //             return value.data;
        //           }
        //           return throwError('请求错误');
        //         }
        //       ),
        //       retry(3),
        //     )
        //   ),
        //   reduce((acc, value) => [...acc, value], [])
        // ).subscribe(
        //   value => {
        //     this.segmentIds.forEach((value1: any, index) => {
        //       value[index].forEach(
        //         value2 => {
        //           value1.selectList.push({name: value2.endPoint, value: value2.endPoint});
        //         }
        //       );
        //     });
        //
        //   },
        //   () => {
        //     setTimeout(
        //       () => {
        //         this.nzModal.warning({
        //           nzTitle: '提示消息',
        //           nzContent: '业务模式数据获取失败，请检查网络！'
        //         });
        //       }, 1000
        //     );
        //   },
        //   () => {
        //     if (this.carManageData['status'] === 'update') {
        //       this.getbusiAndEndPoint();
        //     } else {
        //       this.spinning = false;
        //     }
        //   }
        // );
      }
    );
  }

  /**
   * 获取对应流向
   * @param value
   */
  getEndPointByBusi(value) {
    return this.httpClient.post(localUrls.getEndPointByBusi, {segmentId: value.value}).pipe(
      map(
        (value: any) => {
          if (value.code === 100) {
            return value.data.map(value1 => {
              return {name: value1.endPoint, value: value1.endPoint};
            });
          }
          return throwError('请求错误');
        }
      ),
      retry(3),
    );
  }

  /**
   * 查询装载仓库
   * @param value
   */
  getStartPointByBusi(value) {
    return this.httpClient.post(localUrls.getStartPointByBusi, {segmentId: value.value}).pipe(
      map(
        (value: any) => {
          if (value.code === 100) {
            return value.data.map(value1 => {
              return {name: value1.startPoint, value: value1.startPoint};
            });
          }
          return throwError('请求错误');
        }
      ),
      retry(3),
    );
  }

  /**
   * 静态集值获取 获取值为name
   * @param valueSetCode
   * @param parameter
   */
  getStatic(valueSetCode: string, parameter: Array<any>): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      res => {
        if (res.success) {
          const data = (res.data.data.data || []).map(item => ({name: item.name, value: item.name}));
          Array.prototype.push.apply(parameter, data);
        }
      }
    );
  }

  /**
   * 静态集值获取 获取值为value
   * @param valueSetCode
   * @param parameter
   */
  getStaticValue(valueSetCode: string, parameter: Array<any>): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      res => {
        if (res.success) {
          const data = (res.data.data.data || []).map(item => ({name: item.name, value: item.value}));
          Array.prototype.push.apply(parameter, data);
        }
      }
    );
  }

  /**
   * 获取品种
   */
  getProd(): void {
    this.http.post(urls.selectProdNew, {}).then(
      res => {
        const data = (res.data.data || []).map(item => ({name: item.prodKindPrice, value: item.prodKindPrice}));
        Array.prototype.push.apply(this.products, data);
      }
    );
  }

  /**
   * 表单初始化
   */
  formInitialization(): void {
    this.spinning = true;
    for (const control of this.controlArray) {
      const validator: Array<any> = [];
      if (control.validators.require) {
        validator.push(Validators.required);
      }
      if (control.validators.pattern) {
        validator.push(Validators.pattern(control.validators.patternStr));
      }
      this.validateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: !!control.disabled}, validator
      ));
    }
    for (const control of this.checkArray) {
      const validator: Array<any> = [];
      if (control.validators.require) {
        validator.push(Validators.required);
      }
      if (control.validators.pattern) {
        validator.push(Validators.pattern(control.validators.patternStr));
      }
      this.validateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: !!control.disabled}, validator
      ));
    }
    this.pageDataInitialization(); // 页面数据初始化
  }

  /**
   * 页面数据初始化
   */
  pageDataInitialization(): void {
    this.spinning = true;
    this.carManageData = JSON.parse(sessionStorage.getItem('carManageData')) || {status: ''};
    if (this.carManageData['status'] === 'add') {
      this.validateForm.reset({});
      this.vehicleNoOld = '';
      this.segmentIds = [];
      this.selectSegmentIds = [];
      this.validateForm.get('vehicleNo').enable();
      this.validateForm.get('receiveType').setValue('JJFS10');
    } else if (this.carManageData['status'] === 'update') {
      this.validateForm.get('vehicleNo').disable();
      const data = this.carManageData['data'];
      data.vehicleKind = data.vehicleKind && data.vehicleKind.split(',');
      data.productName = data.productName && data.productName.split(',');
      this.settleCarrierId = data.settleCarrierId;
      this.inputModalModel = data.settleCarrierName;
      this.validateForm.patchValue(data);
      this.vehicleNoOld = data.vehicleNo;
    } else {
      this.router.navigateByUrl('system/baseInformation/carManage').then(() => {
        this.validateForm.get('vehicleNo').enable();
        this.segmentIds = [];
        this.selectSegmentIds = [];
        sessionStorage.removeItem('carManageData');
      });
      return;
    }
    this.getUserBusinessSegment(); // 获取业务模式数据
  }

  /**
   * searchReload事件订阅
   */
  searchReloadEvent(): void {
    this.glo.searchReload.subscribe(value => {
      if (value['target'] === 'carManageDataAdd') {
        this.pageDataInitialization();
      }
    });
  }

  ngOnDestroy(): void {
    // this.glo.searchReload.unsubscribe();
  }

  /**
   * table 表头
   * @param param
   */
  tableColumns(param: Array<any>) {
  }

  /**
   * 业务类型，流向选择
   * @param param
   */
  updateDataResult(param: Array<any>) {
    this.selectSegmentIds = param;
  }

  /**
   * 查询业务板块流向
   */
  getbusiAndEndPoint(): void {
    const url = localUrls.getbusiAndEndPoint;
    const param: any = {
      vehicleNo: this.vehicleNoOld,
      companyId: this.carManageData['data'].companyId
    };
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.selectSegmentIds = [];
          this.spinning = false;
          const data: Array<any> = res.data && res.data.data || [];
          data.forEach(
            value => {
              this.segmentIds.forEach(
                value1 => {
                  if (value.businessType === value1.segmentId) {
                    value1.endPoint = value['endPoint'] && value['endPoint'].split(',') || null;
                    value1.startPoint = value['startPoint'] && value['startPoint'].split(',') || null;
                    value1.checked = true;
                    value1.authStatusName = value['authStatusName'] || null;
                    value1.rejectReason = value['rejectReason'] || null;
                    this.selectSegmentIds.push(value1);
                  }
                }
              );

              this.refresh = Math.random().toString(36).substr(2);
            }
          );
        }
      }
    );
  }

  /**
   * 流向选择更改事件
   * @param param
   * @param obj
   */
  endPointSelectChange(param: Array<any>, obj: any) {
    console.log(param, '222');
    if (param.length === 0) {
      if (!obj.endPoint && !obj.startPoint) {
        obj.checked = false;
        this.selectSegmentIds = this.selectSegmentIds.filter(
          value => value.segmentId !== obj.segmentId
        );
      }

    } else {
      if (!obj.checked) {
        obj.checked = true;
        this.selectSegmentIds.push(obj);
      }
    }
  }

  /**
   * 获取公司
   * @param parameter
   */
  getCompany(parameter): void {
    this.http.post(inpModalUrl.default, {}).then(
      res => {
        if (res.success) {
          const data = (res.data.data.data || []).map(item => ({name: item.name, value: item.value}));
          Array.prototype.push.apply(parameter, data);
        }
      }
    );
  }

  /**
   * 业务公司选择
   * @param param
   */
  inpEmit(param: any) {
    this.settleCarrierId = param.inpValue;
    this.inputModalModel = param.inpName;
    this.validateForm.patchValue({
      settleCarrierId: this.settleCarrierId,
    });

    // this.borderRed = !param.inpValue;
  }

}
