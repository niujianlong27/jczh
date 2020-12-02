import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '../../../../common/model/url';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-prod-spections',
  templateUrl: './prod-spections.component.html',
  styleUrls: ['./prod-spections.component.css']
})
export class ProdSpectionsComponent implements OnInit {

  weightArr: Array<any> = [];
  selectArr: Array<any> = [];
  isUseArr: Array<any> = [];


  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalFormData: Array<any> = [
    // {
    //   name: '公司ID', eName: 'companyId', type: 'text', validateCon: '请输入公司ID', require: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },
    {
      name: '品种', eName: 'prodKind', type: 'text', validateCon: '请输入品种', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '开始长度', eName: 'lengthStart', type: 'number', validateCon: '请输入开始长度', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '结束长度', eName: 'lengthEnd', type: 'number', validateCon: '请输入结束长度', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '应收价格品种', eName: 'prodKindPrice', type: 'text', validateCon: '请输入应收价格品种', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '应付价格品种', eName: 'prodKindPriceOut', type: 'text', validateCon: '请输入应收价格品种', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '载重标记 ', eName: 'weight', type: 'weight', validateCon: '请选择载重标记', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '重量范围开始 ', eName: 'weightBegin', type: 'number', validateCon: '请选择载重标记', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '重量范围结束 ', eName: 'weightEnd', type: 'number', validateCon: '请选择载重标记', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '价格实际品种 ', eName: 'prodKindPriceActual', type: 'text', validateCon: '请输入价格实际品种', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '使用标记 ', eName: 'isUse', type: 'isUse', validateCon: '请选择使用标记', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    // {
    //   name: '规格', eName: 'spections', type: 'text', validateCon: '请输入规格', require: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //     patternStr: '[a-zA-Z0-9]*',
    //     patternErr: '界面名称格式不正确，只能填数字或字母'
    //   }
    // },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入规格', require: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '界面名称格式不正确，只能填数字或字母'
      }
    },


  ];

  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗
  status: string;

  private tplModal: NzModalRef; // 弹窗相关

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;
  private rowid: any;
  radioArr: Array<any> = [];

  // selectedCompany: any; // 当前公司

  constructor(private http: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private nn: NzNotificationService) {
  }

  ngOnInit() {

    this.listSearch({page: 1, length: this.pageSize});

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      }

      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }

    // this.getStatic(this.selectArr, 'JGPZ');
    this.getStatic(this.weightArr, 'ZZBJ');
    this.getStatic(this.isUseArr, 'SYBJ');
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.selectProdSections;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.addProdSerctions;
    data.lengthStart = data.lengthStart ? data.lengthStart : 0;
    data.lengthEnd = data.lengthEnd ? data.lengthEnd : 0;
    data.weightBegin = data.weightBegin ? data.weightBegin : 0;
    data.weightEnd = data.weightEnd ? data.weightEnd : 0;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        } else {
          this.nn.error('提示消息', '添加失败！');
        }
      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateProdSerctions;
    data.rowid = this.rowid;
    data.lengthStart = data.lengthStart ? data.lengthStart : 0;
    data.lengthEnd = data.lengthEnd ? data.lengthEnd : 0;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        } else {
          this.nn.error('提示消息', '修改失败！');
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tProdSpectionsModels: []}, method: 'POST'};
    params.url = urls.deleteProdSerctions;
    params.data.tProdSpectionsModels = this.selectedData;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '删除成功！');
        } else {
          this.nn.error('提示消息', '删除失败！');
        }
      }
    );
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListSearch(data);
  }

  // 添加
  btnAdd() {
    this.modalFormVisible = true;
    this.modalTitle = '品名规格对应管理 > 新增';
    this.status = 'add';
    this.modalValidateForm.get('isUse').setValue('SYBJ10');
  }

  // 修改
  btnUpdate(data: any) {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后修改！'
      });
      this.destroyTplModal();
      return;
    }
    if (!data || data.data.length > 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalFormVisible = true;
    this.modalTitle = '品名规格对应管理 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
  }

  // 删除
  btnDelete(data: any) {
    if (data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除当前记录?';
    this.status = 'delete';
    this.selectedData = data.data;
  }

  // 弹出框相关
  handleOk() {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }

    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(this.modalValidateForm.getRawValue());
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(this.modalValidateForm.getRawValue());
    }


  }

  handleCancel() {
    this.modalFormVisible = false;
  }

  closeResult() {
    this.modalValidateForm.reset();
  }

  // 确认框结果
  modalConfirmResult(data: any) {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;

  }

  // 公司更改触发
  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
  }

  // 弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

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
   * 弹窗输入框更改事件
   * @param {string} eName
   * @param {any} data
   */
  ngModelChange(eName: string, data: any) {
    switch (eName) {
      case 'lengthStart': {
        if (this.modalValidateForm.get('lengthEnd').value < data) {
          this.modalValidateForm.get('lengthEnd').setValue(data);
        }
      }
        break;
      case 'lengthEnd': {
        if (this.modalValidateForm.get('lengthStart').value > data) {
          this.modalValidateForm.get('lengthStart').setValue(data);
        }
      }
        break;
    }
  }
}
