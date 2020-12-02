import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {UploadFiles} from '@service/upload-files';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {SearchformComponent} from '@component/searchform/searchform.component';
import {localUrls} from '@model/localUrls';
import {AuthStatus} from '../car-auth/car-auth.component';

@Component({
  selector: 'app-carbusiness-auth',
  templateUrl: './carbusiness-auth.component.html',
  styleUrls: ['./carbusiness-auth.component.css']
})
export class CarbusinessAuthComponent implements OnInit {

  pageSize = 30; // 条数
  dataSet: Array<any> = []; // 列表数据
  totalPage = 0; // 数据总数
  listLoading = false; // list加载
  searchData: any = {}; // 搜索数据
  selectData: Array<any> = [];
  buttonId: string;   // 按钮ID

  nzVisible = false;
  nzTitle = '';
  buttonLoading = false;

  AuthStatus = AuthStatus;

  @ViewChild('reasonForRejection') reasonForRejection: TemplateRef<any>;

  validateForm: FormGroup = this.fb.group({});
  controlArray: Array<any> = [
    {
      cName: '车队', eName: 'fleet', type: 'text', require: false, disabled: false, validateCon: '请输入车牌号!', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '车牌号', eName: 'vehicleNo', type: 'text', require: false, disabled: false, validateCon: '请输入车牌号!', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '业务类型', eName: 'businessTypeName', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: []
    },
    {
      cName: '流向', eName: 'endPoint', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: []
    },
    {
      cName: '装载仓库', eName: 'startPoint', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: []
    },
    {
      cName: '姓名', eName: 'name', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '随车电话', eName: 'vehicleMobile', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '身份证号', eName: 'cardId', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '车辆类型', eName: 'vehicleKind', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: []
    },
    {
      cName: '车盘宽度', eName: 'diskWidth', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '载重', eName: 'weight', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      extra: true,
      extraContent: '吨',
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '车辆长度', eName: 'vehicleLength', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      cName: '可承运品种', eName: 'productName', type: 'text', require: false, disabled: false, validateCon: '', readOnly: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: []
    },
  ];
  rejectReason = ''; // 驳回理由

  constructor(
    private http: HttpUtilService,
    public upload: UploadFiles,
    private fb: FormBuilder,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.formInitialization();
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    param.page = param.page || 1; // 最好有
    param.length = param.length || this.pageSize; // 最好有
    this.searchData = param;
    this.getListSearch(param);
  }

  /**
   * 列表查询数据获取
   * @param data
   */
  getListSearch(data: any): void {
    this.listLoading = true;
    const url = localUrls.getVehicleAuthInfo;
    this.http.post(url, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data && res.data.data.data || [];
          this.totalPage = res.data.data.total || 0;
          this.selectData = [];
        }
      }
    );
  }

  /**
   * 选择事件
   * @param param
   */
  updateDataResult(param: Array<any>) {
    this.selectData = param;
  }

  /**
   * 按钮点击
   * @param param
   */
  btnClick(param: any) {
    this.buttonId = param.type.buttonId;
    switch (this.buttonId) {
      case 'Auth': {
        this.btnAuth();
      }
        break;
      default: {
        this.nm.warning('点击按钮功能未定义!');
      }
        break;
    }
  }

  /**
   * 查询区域数据返回
   * @param param
   */
  searchComponent(param: SearchformComponent) {
    console.log(param.controlArray);
  }

  /**
   * 点击审核
   */
  btnAuth(): void {
    if (this.selectData.length === 0) {
      this.nm.warning('请选择数据后操作！');
      return;
    }
    this.nzTitle = '车辆业务审核 > 审核';
    this.nzVisible = true;
    this.validateForm.patchValue(this.selectData[0]);
  }


  /**
   * 点击取消
   */
  handleCancel() {
    this.nzVisible = false;
  }

  /**
   * 弹窗关闭后数据处理
   */
  nzAfterClose() {
    this.rejectReason = '';
  }

  /**
   * 弹窗按钮点击
   */
  modalButtonClick(buttonID: string) {
    this.buttonLoading = true;
    switch (buttonID) {
      case 'pass': {
        this.btnPass();
      }
        break;
      case 'reject': {
        this.btnReject();
      }
        break;
      default: {
        this.nm.warning('点击按钮功能未定义!');
      }
        break;
    }
  }

  /**
   * 点击通过审核
   */
  btnPass(): void {
    this.reviewRequest('pass');
  }

  /**
   * 点击驳回审核
   */
  btnReject(): void {
    this.nzModal.create({
      nzTitle: '车辆业务审核 > 驳回',
      nzContent: this.reasonForRejection,
      nzOnOk: () => {
        this.reviewRequest('reject');
      },
      nzOnCancel: () => {
        this.buttonLoading = false;
      }
    });
  }

  /**
   * 审核请求
   */
  reviewRequest(type?: string): void {
    let url = '';
    let param = {};
    if (!this.selectData[0] || !this.selectData[0].vehicleNo) {
      this.nm.warning('选中数据不存在车牌号，请重新选择有车牌号数据后操作!');
      this.buttonLoading = false;
      return;
    }
    switch (type) {
      case 'pass': {
        url = localUrls.updateVehicleAuthPass;
        param = {
          vehicleNo: this.selectData[0].vehicleNo,
          businessType: this.selectData[0].businessType,
          companyId: this.selectData[0].companyId,

        };
      }
        break;
      case 'reject': {
        url = localUrls.updateVehicleAuthReject;
        param = {
          vehicleNo: this.selectData[0].vehicleNo,
          businessType: this.selectData[0].businessType,
          companyId: this.selectData[0].companyId,
          rejectReason: this.rejectReason
        };
      }
        break;
      default:
        this.nm.warning('点击按钮功能未定义!');
        return;
    }


    this.http.post(url, param).then(
      res => {
        this.buttonLoading = false;
        if (res.success) {
          this.nzVisible = false;
          this.nm.success(type === 'pass' ? '审核通过请求成功!' : '驳回请求成功');
          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   * 表单初始化
   */
  formInitialization(): void {
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
  }

}
