import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadFiles} from '../../../../common/services/upload-files';
import {planUrl} from '../../../../common/model/planUrls';
import {Utils} from '../../../../common/util/utils';
import {urls} from '../../../../common/model/url';
import {ReportingStatus, ShipPlan, ShipPlanStatus} from '../ship-loading/ship-plan-status.enum';
import {ShipUnloading} from '../../ship-unloading-plan-manage/ship-unloading.enum';

@Component({
  selector: 'app-ship-plan',
  templateUrl: './ship-plan.component.html',
  styleUrls: ['./ship-plan.component.css']
})
export class ShipPlanComponent implements OnInit {

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  total: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态

  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  searchData: any;  //存储查询的数据缓存

  // 数据弹窗
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalTitle: string; // 弹窗标题
  status: string = ''; //弹窗状态
  rowid: string = '';
  companyId: string = '';


  findSet: any = {url: 'getListByBoatName', parameter: 'boatName', name: '选择船舶', formId: 'form_boat_info'};
  berthList: Array<any> = [];
  tradeTypeList: Array<any> = [];

  modalFormData: Array<any> = [
    {
      name: '船批号', eName: 'boatBatchNum', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: 'LMS船批号', eName: 'lmsBoatBatchNum', type: 'text', validateCon: '请填写LMS船批号', require: false, disabled: false,
      validators: {
        require: false
      }
    },
    {
      name: '船名', eName: 'boatName', type: 'pop', validateCon: '请选择船只', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '计划类型', eName: 'planType', type: 'select2', validateCon: '请选择计划类型', require: true,
      validators: {
        require: true
      },
      selectList: [
        {
          label: '装船',
          value: 'ZXLX10',
        },
        {

          label: '卸船',
          value: 'ZXLX20',
        },

      ]
    },

    {
      name: '船只代码', eName: 'boatNum', type: 'text', validateCon: '请填写船号', require: false, disabled: true,
      validators: {
        require: false
      }
    },
    {
      name: '船舶长度', eName: 'boatLength', type: 'text', validateCon: '请输入船舶长度', require: false, disabled: true,
      validators: {
        require: false
      },
    },
    {
      name: '船舶宽度', eName: 'boatWidth', type: 'text', validateCon: '请输入船舶宽度', require: false, disabled: true,
      validators: {
        require: false
      },
    },
    {
      name: '载重/吨', eName: 'capacity', type: 'text', validateCon: '请输入载重/吨', require: false, disabled: true,
      validators: {
        require: false
      },
    },
    {
      name: '船长', eName: 'captain', type: 'text', validateCon: '请填写船长', require: false,
      validators: {
        require: false
      }
    },

    {
      name: '联系电话', eName: 'contactsPhone', type: 'text', validateCon: '请填写联系电话', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划靠港时间', eName: 'expectToportTime', type: 'date', validateCon: '请填写计划靠港时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划锚地时间', eName: 'expectAnchorageTime', type: 'date', validateCon: '请填写计划锚地时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划靠泊时间', eName: 'expectBerthingTime', type: 'date', validateCon: '请填写计划靠泊时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划离港时间', eName: 'expectDepartureTime', type: 'date', validateCon: '请填写计划离港时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '实际靠港时间', eName: 'actualToportTime', type: 'date', validateCon: '请填写实际靠港时间', require: false,
      validators: {
        require: false
      }
    }, {
      name: '实际锚地时间', eName: 'actualAnchorageTime', type: 'date', validateCon: '请填写实际锚地时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '实际靠泊时间', eName: 'actualBerthingTime', type: 'date', validateCon: '请填写实际靠泊时间', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '起始港', eName: 'startPort', type: 'text', validateCon: '请填写起始港', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '目的港', eName: 'arrivalPort', type: 'text', validateCon: '请填写目的港', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划泊位', eName: 'expectBerth', type: 'select', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
      selectList: this.berthList
    },
    {
      name: '货种', eName: 'goodsType', type: 'text', validateCon: '请填写目的港', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划件数', eName: 'expectPackCount', type: 'text', validateCon: '请填写目的港', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '计划效率', eName: 'expectEfficiency', type: 'text', validateCon: '请填写目的港', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '贸别', eName: 'tradeType', type: 'select', validateCon: '请填写目的港', require: false,
      validators: {
        require: false
      },
      selectList: this.tradeTypeList
    },
    {
      name: '船代', eName: 'boatAgent', type: 'text', validateCon: '请填写目的港', require: false,
      validators: {
        require: false
      }
    }

  ];
  boatName: string;
  modalOkLoading: boolean = false; //弹窗确定按钮状态

  message: string; // 判断提示消息

  constructor(private http: HttpUtilService,
              private nn: NzNotificationService,
              private nm: NzModalService,
              private fb: FormBuilder,
              public upload: UploadFiles) {
  }

  ngOnInit() {
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(
      res => {
        let validatorOrOpts: Array<any> = [];
        res.validators.require ? validatorOrOpts.push(Validators.required) : null;
        res.validators.pattern ? validatorOrOpts.push(Validators.required) : null;
        this.modalValidateForm.addControl(res.eName, new FormControl(
          {value: '', disabled: res.disabled}, validatorOrOpts
        ));
      }
    );

    this.listSearch({page: 1, length: this.pageSize});
    this.getberthageNamebyCompanyId();
    this.getStatic(this.tradeTypeList, 'MB');
  }

  /**
   * 查询
   * @param param
   */
  listSearch(param: any) {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = param;
    this.listLoading = true;
    this.getListSearch(param);
  }

  /**
   * 列表查询
   * @param param
   */
  private getListSearch(param: any) {

    this.listLoading = true;
    const url = planUrl.getList;
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.total = res.data.data.total;
          this.selectedData = [];
        }
      }
    );

  }

  /**
   * 按钮点击事件
   * @param param
   */
  btnClick(param: any) {
    const buttonId = param.type.buttonId;
    switch (buttonId) {
      case 'Add': //添加
        this.btnAdd();
        break;
      case 'Update': // 修改
        this.btnUpdate();
        break;
      case 'Del': // 删除
        this.btnDelete();
        break;
      case 'Issued': //下发
        this.issued();
        break;
      case 'Cancellation': //撤销下发
        this.cancellation();
        break;
    }
  }

  /**
   * 选中数据
   * @param param
   */
  updateDataResult(param: any) {
    this.selectedData = param;
  }

  /**
   * 添加
   */
  btnAdd(): void {

    this.modalFormVisible = true;
    this.modalTitle = '船舶计划 > 新增';
    this.status = 'add';
  }

  /**
   * 修改按钮点击
   */
  btnUpdate(): void {
    if (this.selectedData.length === 0 || this.selectedData.length > 1) {
      this.nn.warning('提示消息', '请选择一条数据后操作！');
      return;
    }

    if (this.shipStatusJudgment(this.selectedData[0])) {
      this.nn.warning('提示消息', `本条数据${this.message}，不能修改！`);
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = '船舶计划 > 修改';
    this.status = 'update';
    this.boatName = this.selectedData[0].boatName;
    // this.rowid = this.selectedData[0].rowid;
    this.modalValidateForm.patchValue(this.selectedData[0]);
    this.modalValidateForm.get('planType').reset({value: this.selectedData[0].planType, disabled: true});

  }

  /**
   * 删除
   */
  btnDelete(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }

    if (this.shipStatusJudgment(this.selectedData[0])) {
      this.nn.warning('提示消息', `存在${this.message}状态数据，不能删除！`);
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认删除吗？',
      nzOnOk: () => {
        const url = planUrl.deleteList;
        const params = {boatPlanModelList: []};
        this.selectedData.forEach(
          res => {
            params.boatPlanModelList.push(res);
          }
        );
        return this.http.post(url, params).then(
          res => {
            if (res.success) {
              this.nn.success('提示消息', '删除成功!');
              this.listSearch({page: 1, length: this.pageSize});
            }
          }
        );
      }
    });
  }

  /**
   * 添加请求
   */
  addData(): void {
    const url = planUrl.addList;
    const param = this.modalValidateForm.getRawValue();
    param.expectToportTime = param.expectToportTime && Utils.dateFormat(new Date(param.expectToportTime), 'yyyy-MM-dd HH:mm:ss');
    param.expectAnchorageTime = param.expectAnchorageTime && Utils.dateFormat(new Date(param.expectAnchorageTime), 'yyyy-MM-dd HH:mm:ss');
    param.expectBerthingTime = param.expectBerthingTime && Utils.dateFormat(new Date(param.expectBerthingTime), 'yyyy-MM-dd HH:mm:ss');
    param.expectDepartureTime = param.expectDepartureTime && Utils.dateFormat(new Date(param.expectDepartureTime), 'yyyy-MM-dd HH:mm:ss');
    param.actualToportTime = param.actualToportTime && Utils.dateFormat(new Date(param.actualToportTime), 'yyyy-MM-dd HH:mm:ss');
    param.actualAnchorageTime = param.actualAnchorageTime && Utils.dateFormat(new Date(param.actualAnchorageTime), 'yyyy-MM-dd HH:mm:ss');
    param.actualBerthingTime = param.actualBerthingTime && Utils.dateFormat(new Date(param.actualBerthingTime), 'yyyy-MM-dd HH:mm:ss');
    param.tonLevel = Math.floor(((param.capacity / 5000) || 0) + 1)*10;
    this.modalOkLoading = true;
    this.http.post(url, {boatPlanModelList: [param]}).then(
      res => {
        this.modalOkLoading = false;
        if (res.success) {
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功!');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 更新请求
   */
  updateData(): void {
    const url = planUrl.updateList;
    const param = this.modalValidateForm.getRawValue();
    param.expectToportTime = param.expectToportTime && Utils.dateFormat(new Date(param.expectToportTime), 'yyyy-MM-dd HH:mm:ss');
    param.expectAnchorageTime = param.expectAnchorageTime && Utils.dateFormat(new Date(param.expectAnchorageTime), 'yyyy-MM-dd HH:mm:ss');
    param.expectBerthingTime = param.expectBerthingTime && Utils.dateFormat(new Date(param.expectBerthingTime), 'yyyy-MM-dd HH:mm:ss');
    param.expectDepartureTime = param.expectDepartureTime && Utils.dateFormat(new Date(param.expectDepartureTime), 'yyyy-MM-dd HH:mm:ss');
    param.actualToportTime = param.actualToportTime && Utils.dateFormat(new Date(param.actualToportTime), 'yyyy-MM-dd HH:mm:ss');
    param.actualAnchorageTime = param.actualAnchorageTime && Utils.dateFormat(new Date(param.actualAnchorageTime), 'yyyy-MM-dd HH:mm:ss');
    param.actualBerthingTime = param.actualBerthingTime && Utils.dateFormat(new Date(param.actualBerthingTime), 'yyyy-MM-dd HH:mm:ss');
    param.companyId = this.selectedData[0].companyId;
    this.modalOkLoading = true;
    this.http.post(url, {boatPlanModelList: [param]}).then(
      res => {
        this.modalOkLoading = false;
        if (res.success) {
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功!');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  /**
   * 下发
   */
  issued(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }
    const status = this.selectedData.some(
      res => res.status !== 'BGZT10' && res.status !== 'CBDD70'
    );
    if (status) {
      this.nn.warning('提示消息', '选中数据有已下发数据，不能再次下发！');
      return;
    }
    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认下发吗？',
      nzOnOk: () => {
        const url = planUrl.issued;
        const params = {boatPlanModelList: []};
        this.selectedData.forEach(
          res => {
            params.boatPlanModelList.push({boatBatchNum: res.boatBatchNum});
          }
        );
        return this.http.post(url, params).then(
          res => {
            if (res.success) {
              this.nn.success('提示消息', '下发成功!');
              this.listSearch({page: 1, length: this.pageSize});
            }
          }
        );
      }
    });
  }

  /**
   * 撤销下发
   */
  cancellation(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }

    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '确认撤销下发吗？',
      nzOnOk: () => this.cancelRequest()

    });

  }

  /**
   * 撤销下发请求
   */
  cancelRequest(): Promise<any> {

    const url = planUrl.revocationIssued;
    const params = {boatPlanModelList: []};
    this.selectedData.forEach(
      res => {
        params.boatPlanModelList.push({boatBatchNum: res.boatBatchNum});
      }
    );
    return this.http.post(url, params).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '撤销下发成功!');
          this.listSearch({page: 1, length: this.pageSize});
          return true;
        } else {
          return false;
        }
      }
    );
  }

  //弹窗控制
  /**
   * 弹窗确认
   */
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }


    if (this.modalValidateForm.status === 'VALID' && this.status === 'add') {
      this.addData();
    }

    if (this.modalValidateForm.status === 'VALID' && this.status === 'update') {
      this.updateData();
    }

  }

  /**
   * 弹窗取消
   */
  handleCancel() {
    this.modalFormVisible = false;
  }

  /**
   * 弹窗关闭回调
   */
  closeResult() {
    this.modalValidateForm.reset({});
    this.boatName = '';
    this.modalValidateForm.get('planType').reset({value: null, disabled: false});
  }

  /**
   * 泊位查询
   */
  getberthageNamebyCompanyId(): void {
    this.http.post(urls.getberthageNamebyCompanyId, {}).then(
      res => {
        if (res.success) {
          Array.prototype.push.apply(this.berthList, res.data.data);
        }
      }
    );
  }

  /**
   * 弹窗抛出数据
   * @param param
   */
  inpEmit(param: any) {
    if (!param.selData) {
      this.modalValidateForm.get('boatName').setValue('');
      this.modalValidateForm.get('boatNum').setValue('');
      this.modalValidateForm.get('boatLength').setValue('');
      this.modalValidateForm.get('boatWidth').setValue('');
      this.modalValidateForm.get('captain').setValue('');
      this.modalValidateForm.get('contactsPhone').setValue('');
      this.modalValidateForm.get('capacity').setValue('');
    } else {
      this.modalValidateForm.patchValue(param.selData[0]);
      this.modalValidateForm.get('boatNum').setValue(param.selData[0].boatCode);
      this.modalValidateForm.get('captain').setValue(param.selData[0].contact);
      this.modalValidateForm.get('contactsPhone').setValue(param.selData[0].contactPhone);
      // this.modalValidateForm.get('boatLength').setValue(param.selData[0].boatLength);
      // this.modalValidateForm.get('boatWidth').setValue(param.selData[0].boatWidth);
      // this.modalValidateForm.get('boatName').setValue(param.selData[0].boatName);
    }
  }

  inputModalModelChange(param: any) {
    this.modalValidateForm.get('boatName').setValue(param);
  }

  //判断
  shipStatusJudgment(param: any): boolean {
    switch (param['planType']) {
      case 'ZXLX10':
        if (!ShipPlan.ShipPlanReleaseableStatus(param.status)) {
          this.message = param['statusName'];
          return true;
        } else if (!(param.toPortStatus === ReportingStatus.NotPort)) {
          this.message = param['toPortStatusName'];
          return true;
        } else {
          return false;
        }

      case 'ZXLX20':
        if (param.status !== ShipUnloading.TheGenerated) {
          this.message = param['statusName'];
          return true;
        } else if (!(param.toPortStatus === ReportingStatus.NotPort)) {
          this.message = param['toPortStatusName'];
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  /**
   * 静态集值获取
   * @param data
   * @param valueSetCode
   */
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        } else {
          Array.prototype.push.apply(data, []);
        }
      }
    );
  }

  /**
   * 弹窗 选择事件
   * @param param
   * @param eName
   */
  selectChange(param: any, eName: any) {
    if (eName === 'planType') {
      switch (param) {
        case 'ZXLX10': {
          this.modalFormData.some(
            res => {
              if (res.eName === 'expectPackCount') {
                res['hidden'] = false;
                return true;
              } else {
                return false;
              }
            }
          );
        }
          break;
        case 'ZXLX20': {
          this.modalFormData.some(
            res => {
              if (res.eName === 'expectPackCount') {
                res['hidden'] = true;
                return true;
              } else {
                return false;
              }
            }
          );
          this.modalValidateForm.get('expectPackCount').setValue(null);
        }
          break;
      }
    }
  }

}
