import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '../../../../common/model/url';
import {planUrl} from '../../../../common/model/planUrls';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-ship-dynamic-manage',
  templateUrl: './ship-dynamic-manage.component.html',
  styleUrls: ['./ship-dynamic-manage.component.css']
})
export class ShipDynamicManageComponent implements OnInit {

  selectedData: Array<any> = []; //选中数据
  buttonId: string; //按钮ID
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据


  // 数据弹窗
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalTitle: string; // 弹窗标题
  status: string = ''; //弹窗状态
  modalOkLoading: boolean = false; //弹窗确定按钮状态
  modalFooter;
  berthList: Array<any> = []; //泊位数组存储

  modalFormData: Array<any> = [
    {
      name: '船批号', eName: 'boatBatchNum', type: 'text', validateCon: '请填写船批号', require: true, disabled: true,
      validators: {
        require: true
      }
    },

    {
      name: '船名', eName: 'boatName', type: 'text', validateCon: '请选择船只', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '目的港', eName: 'arrivalPort', type: 'text', validateCon: '请填写目的港', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '泊位', eName: 'actualBerth', type: 'select', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
      selectList: this.berthList
    },
    {
      name: '锚地时间', eName: 'actualAnchorageTime', type: 'date', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '锚地时间长原因', eName: 'anchorageRemark', type: 'text', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '靠泊时间', eName: 'actualBerthingTime', type: 'date', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '进口手续时间', eName: 'intoProcedureTime', type: 'date', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '进口备注', eName: 'intoProcedureRemark', type: 'text', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '开工时间', eName: 'startWorkTime', type: 'date', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '完工时间', eName: 'endWorkTime', type: 'date', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '作业备注', eName: 'workRemark', type: 'text', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '出口手续时间', eName: 'outProcedureTime', type: 'date', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '出口备注', eName: 'outProcedureRemark', type: 'text', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
    {
      name: '离泊时间', eName: 'actualUnberthingTime', type: 'date', validateCon: '请选择计划泊位', require: false,
      validators: {
        require: false
      },
    },
  ];

  constructor(
    private http: HttpUtilService,
    private nn: NzNotificationService,
    private nm: NzModalService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData.forEach(
      res => {
        const validatorOrOpts: Array<any> = [];
        res.validators.require ? validatorOrOpts.push(Validators.required) : null;
        this.modalValidateForm.addControl(res.eName, new FormControl(
          {value: '', disabled: res.disabled}, validatorOrOpts
        ));
      }
    );

    this.getberthageNamebyCompanyId();
  }

  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any): void {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListSearch(param);
  }

  /**
   * 查询请求
   * @param data
   */
  getListSearch(data: any): void {
    const url = planUrl.getList;
    this.http.post(url, data).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total;
        }
      }
    );

  }

  /**
   * 按钮点击
   * @param param
   */
  btnClick(param: any): void {
    this.buttonId = param.type.buttonId;
    switch (this.buttonId) {
      case 'Update': {
        this.btnUpdate();
      }
        break;
      case 'Delete': {
        this.btnDelete();
      }
        break;
    }
  }


  /**
   * 修改点击事件
   */
  btnUpdate(): void {
    if (this.selectedData.length === 0 || this.selectedData.length > 1) {
      this.nn.warning('提示消息', '请选择一条数据后操作！');
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = '船舶动态管理 > 修改';
    this.status = 'update';
    this.modalValidateForm.patchValue(this.selectedData[0]);
  }

  /**
   * 删除点击事件
   */
  btnDelete(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }

    this.nm.confirm(
      {
        nzTitle: '提示消息',
        nzContent: '是否确认删除当前选中数据？',
        nzOnOk: () => this.deleteRequest()
      }
    );

  }

  /**
   * 删除请求
   */
  deleteRequest(): Promise<boolean> {
    const url = '';
    const param = this.selectedData;
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '删除成功！');
          this.listSearch({page: 1, length: this.pageSize});
          return true;
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 选择事件
   * @param param
   */
  updateDataResult(param: Array<any>): void {
    this.selectedData = param;
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
   * 弹窗确定
   */
  handleOk() {

    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }


    if (this.modalValidateForm.status === 'VALID' && this.status === 'add') {
      // this.addData();
    }

    if (this.modalValidateForm.status === 'VALID' && this.status === 'update') {
      this.updateData();
    }

  }

  /**
   * 修改
   */
  updateData(): void {
    const url = planUrl.updateList;
    const param = this.modalValidateForm.getRawValue();
    this.modalOkLoading = true;
    param.actualAnchorageTime = param.actualAnchorageTime instanceof Date ? Utils.dateFormat(param.actualAnchorageTime, 'yyyy-MM-dd HH:mm:ss') : param.actualAnchorageTime || null;
    param.actualBerthingTime = param.actualBerthingTime instanceof Date ? Utils.dateFormat(param.actualBerthingTime, 'yyyy-MM-dd HH:mm:ss') : param.actualBerthingTime || null;
    param.intoProcedureTime = param.intoProcedureTime instanceof Date ? Utils.dateFormat(param.intoProcedureTime, 'yyyy-MM-dd HH:mm:ss') : param.intoProcedureTime || null;
    param.startWorkTime = param.startWorkTime instanceof Date ? Utils.dateFormat(param.startWorkTime, 'yyyy-MM-dd HH:mm:ss') : param.startWorkTime || null;
    param.endWorkTime = param.endWorkTime instanceof Date ? Utils.dateFormat(param.endWorkTime, 'yyyy-MM-dd HH:mm:ss') : param.endWorkTime || null;
    param.outProcedureTime = param.outProcedureTime instanceof Date ? Utils.dateFormat(param.outProcedureTime, 'yyyy-MM-dd HH:mm:ss') : param.outProcedureTime || null;
    param.actualUnberthingTime = param.actualUnberthingTime instanceof Date ? Utils.dateFormat(param.actualUnberthingTime, 'yyyy-MM-dd HH:mm:ss') : param.actualUnberthingTime || null;

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
   * 弹窗取消
   */
  handleCancel() {
    this.modalFormVisible = false;
  }

  /**
   * 弹窗清除
   */
  clear() {
    this.modalValidateForm.patchValue({
      // arrivalPort: null,
      // actualBerth: null,
      actualAnchorageTime: null,
      anchorageRemark: null,
      actualBerthingTime: null,
      intoProcedureTime: null,
      intoProcedureRemark: null,
      startWorkTime: null,
      endWorkTime: null,
      workRemark: null,
      outProcedureTime: null,
      outProcedureRemark: null,
      actualUnberthingTime: null,
    });
  }

  /**
   * 弹窗关闭后处理
   */
  closeResult() {
    this.modalValidateForm.reset({});
  }


}
