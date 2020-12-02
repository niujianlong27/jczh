import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '../../../../common/model/url';

@Component({
  selector: 'app-forklift-manage',
  templateUrl: './forklift-manage.component.html',
  styleUrls: ['./forklift-manage.component.css']
})
export class ForkliftManageComponent implements OnInit {

  selectedData: Array<any> = []; //选中数据
  buttonId: string; //按钮ID
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据

  rowid: string = ''; //rowid

  // 数据弹窗
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalTitle: string; // 弹窗标题
  status: string = ''; //弹窗状态
  modalOkLoading: boolean = false; //弹窗确定按钮状态

  berthList: Array<any> = []; //泊位数组存储

  modalFormData: Array<any> = [
    {
      name: '港口名称', eName: 'portName', type: 'text', validateCon: '请填写船批号', require: true, disabled: false,
      validators: {
        require: true
      },
    },

    {
      name: '车号', eName: 'forkliftNo', type: 'text', validateCon: '请选择船只', require: true,
      validators: {
        require: true
      }
    },
    {
      name: '吨位', eName: 'ton', type: 'number', validateCon: '请填写目的港', require: false,
      validators: {
        require: false
      }
    },
    {
      name: '品牌', eName: 'brand', type: 'text', validateCon: '请选择计划泊位', require: false,
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
    const url = urls.getForkliftList;
    this.http.post(url, data).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          this.selectedData = [];
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
      case 'Add': {
        this.btnAdd();
      }
        break;
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
   * 新增点击事件
   */
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '船舶动态管理 > 修改';
    this.status = 'add';
    // this.modalValidateForm.patchValue(this.selectedData[0]);
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
    this.modalValidateForm.get('portName').reset({value: null, disabled: true});
    this.modalValidateForm.get('forkliftNo').reset({value: null, disabled: true});
    this.modalValidateForm.patchValue(this.selectedData[0]);
    this.rowid = this.selectedData[0].rowid;

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
    const url = urls.deleteForklift;
    const param = {
      tForkliftModels: []
    };
    this.selectedData.forEach(
      value => param.tForkliftModels.push({rowid: value.rowid})
    );
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
      this.addData();
    }

    if (this.modalValidateForm.status === 'VALID' && this.status === 'update') {
      this.updateData();
    }

  }

  /**
   * 新增
   */
  addData(): void {
    const url = urls.insertForklift;
    const param = this.modalValidateForm.getRawValue();
    this.modalOkLoading = true;
    this.http.post(url, param).then(
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
   * 修改
   */
  updateData(): void {
    const url = urls.updateForklift;
    const param = this.modalValidateForm.getRawValue();
    param.rowid = this.rowid;
    this.modalOkLoading = true;
    this.http.post(url, param).then(
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
   * 弹窗关闭后处理
   */
  closeResult() {
    this.modalValidateForm.reset({});
    this.modalValidateForm.get('portName').reset({value: null, disabled: false});
    this.modalValidateForm.get('forkliftNo').reset({value: null, disabled: false});
  }


}
