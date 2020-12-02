import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadFiles} from '../../../../common/services/upload-files';
import {planUrl} from '../../../../common/model/planUrls';
import {Utils} from '../../../../common/util/utils';
import {urls} from '../../../../common/model/url';
import {ReportingStatus, ShipPlan, ShipPlanStatus} from '../../shipment-plan-manage/ship-loading/ship-plan-status.enum';
import {ShipUnloading} from '../ship-unloading.enum';

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

  modalFormData: Array<any> = [
    {
      name: '船批号', eName: 'boatBatchNum', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
      validators: {
        require: true
      }
    },
    {
      name: '船名', eName: 'boatName', type: 'pop', validateCon: '请选择船只', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '船只代码', eName: 'boatNum', type: 'text', validateCon: '请填写船号', require: true, disabled: true,
      validators: {
        require: false
      }
    },
    {
      name: '船舶长度', eName: 'boatLength', type: 'text', validateCon: '请输入船舶长度', require: true, disabled: true,
      validators: {
        require: true
      },
    },
    {
      name: '船舶宽度', eName: 'boatWidth', type: 'text', validateCon: '请输入船舶宽度', require: true, disabled: true,
      validators: {
        require: true
      },
    },
    {
      name: '载重/吨', eName: 'capacity', type: 'text', validateCon: '请输入载重/吨', require: true, disabled: true,
      validators: {
        require: true
      },
    },
    {
      name: '船长', eName: 'captain', type: 'text', validateCon: '请填写船长', require: true,
      validators: {
        require: true
      }
    },

    {
      name: '联系电话', eName: 'contactsPhone', type: 'text', validateCon: '请填写联系电话', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '计划靠港时间', eName: 'expectToportTime', type: 'date', validateCon: '请填写计划靠港时间', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '计划锚地时间', eName: 'expectAnchorageTime', type: 'date', validateCon: '请填写计划锚地时间', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '计划靠泊时间', eName: 'expectBerthingTime', type: 'date', validateCon: '请填写计划靠泊时间', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '计划离港时间', eName: 'expectDepartureTime', type: 'date', validateCon: '请填写计划离港时间', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '起始港', eName: 'startPort', type: 'text', validateCon: '请填写起始港', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '目的港', eName: 'arrivalPort', type: 'text', validateCon: '请填写目的港', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '计划泊位', eName: 'expectBerth', type: 'select', validateCon: '请选择计划泊位', require: true,
      validators: {
        require: true
      },
      selectList: this.berthList
    },


  ];
  boatName: string;
  modalOkLoading: boolean = false; //弹窗确定按钮状态

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
    const url = planUrl.getList2;
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
    const status = this.selectedData.some(
      res => res.status != ShipUnloading.TheGenerated
    );
    if (status) {
      this.nn.warning('提示消息', `本条数据${this.selectedData[0].statusName}，不能修改！`);
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = '船舶计划 > 修改';
    this.status = 'update';
    this.boatName = this.selectedData[0].boatName;
    // this.rowid = this.selectedData[0].rowid;
    this.modalValidateForm.patchValue(this.selectedData[0]);

  }

  /**
   * 删除
   */
  btnDelete(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }
    const status = this.selectedData.some(
      res => res.status != ShipUnloading.TheGenerated
    );
    if (status) {
      this.nn.warning('提示消息', '请选择状态为已生成的数据进行删除！');
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
    param.expectToportTime = Utils.dateFormat(param.expectToportTime, 'yyyy-MM-dd HH:mm:ss');
    param.expectAnchorageTime = Utils.dateFormat(param.expectAnchorageTime, 'yyyy-MM-dd HH:mm:ss');
    param.expectBerthingTime = Utils.dateFormat(param.expectBerthingTime, 'yyyy-MM-dd HH:mm:ss');
    param.expectDepartureTime = Utils.dateFormat(param.expectDepartureTime, 'yyyy-MM-dd HH:mm:ss');
    param.planType = 'ZXLX20';
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
    param.planType = 'ZXLX20';
    param.expectToportTime = Utils.dateFormat(new Date(param.expectToportTime), 'yyyy-MM-dd HH:mm:ss');
    param.expectAnchorageTime = Utils.dateFormat(new Date(param.expectAnchorageTime), 'yyyy-MM-dd HH:mm:ss');
    param.expectBerthingTime = Utils.dateFormat(new Date(param.expectBerthingTime), 'yyyy-MM-dd HH:mm:ss');
    param.expectDepartureTime = Utils.dateFormat(new Date(param.expectDepartureTime), 'yyyy-MM-dd HH:mm:ss');
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

}
