import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {urls} from '@model/url';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit {

  radioArr: Array<any> = [];
  prerequisiteArr: Array<any> = [];
  modalFormData: Array<any> = [
    {
      name: '界面ID', eName: 'formId', type: 'text', validateCon: '请输入界面ID', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '表格ID', eName: 'gridId', type: 'text', validateCon: '请输入表格ID', require: true,
      validators: {
        require: true,
        pattern: true,
        patternStr: '[a-zA-Z0-9]+',
        patternErr: '表格ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '表格名称', eName: 'gridName', type: 'text', validateCon: '请输入表格名称', require: true,
      validators: {
        require: true,
        pattern: false,
        // patternStr:'[\u4e00-\u9fa5]+[0-9]*',
        patternStr: '[a-zA-Z0-9]+',
        patternErr: '表格名称格式不正确，只能为中文名称或中文名称加数字'
      }
    },
    {
      name: '列名称', eName: 'colCname', type: 'text', validateCon: '请输入列名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '列表/视图', eName: 'tableName', type: 'text', validateCon: '请输入列表/视图', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '列表字段', eName: 'colEname', type: 'text', validateCon: '请输入列表字段', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '列是否显示', eName: 'visible', type: 'radio', validateCon: '请选择列是否显示', radioArr: this.radioArr, require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '是否是必备条件', eName: 'prerequisite', type: 'radio', validateCon: '请选择列是否是必备条件', radioArr: this.prerequisiteArr, require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '类型', eName: 'type', type: 'select', validateCon: '请选择类型', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '列宽度', eName: 'width', type: 'number', validateCon: '请输入列宽度', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '排序', eName: 'sortId', type: 'text', validateCon: '请输入排序', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '格式化', eName: 'format', type: 'text', validateCon: '请输入格式', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '用户类型设置', eName: 'userType', type: 'checkbox', validateCon: '请输入格式', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];

  checkOptions = [
    {label: '托运人', value: 'isConsignee', checked: true},
    {label: '承运人', value: 'isCarrier'}
  ];
  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  typeDataArr: Array<any> = []; // 类型下拉数据

  // 确认框
  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible: boolean = false; // 确认弹窗

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态

  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  validateForm: FormGroup;

  private rowid: number;
  private status: string;

  searchData: any;  //存储查询的数据
  selectData: Array<any> = [];
  private tplModal: NzModalRef;

  constructor(private httpUtilService: HttpUtilService,
              private fb: FormBuilder,
              private nm: NzModalService,
              private nn: NzNotificationService,
              private http: HttpClient,) {
  }

  ngOnInit() {

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

    this.listSearch({page: 1, length: this.pageSize});
    this.getStatic(this.typeDataArr, 'columnType');
    this.getStatic(this.radioArr, 'XSBJ');
    this.getStatic(this.prerequisiteArr, 'BBTJ');

  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}column/selectColumnList`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );

  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }
  btnClick(data: any): void {
    switch (data.type.buttonId) {
      case 'Export': {  //导出
        this.btnExport();
      }
        break;
    }

  }
  /**
   * 导出按钮
   */
  btnExport(): void {
    console.log(this.searchData)
    let url=`${environment.baseUrlSystem}column/selectColumnExport`;
    this.http.post(url, this.searchData, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `界面字段设置.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  }
  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}column/insertList`;
    params.data = data;
    Object.assign(params.data, this.processCheckData());

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        } else {
          this.nn.error('提示消息', '添加失败！');
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tColumns: []}, method: 'POST'};
    params.url = `${environment.baseUrl}column/deleteList`;
    for (const selectedDatum of this.selectedData) {
      params.data.tColumns.push({rowid: selectedDatum.rowid});
    }

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '删除成功！');
        } else {
          this.nn.error('提示消息', '删除失败！');
        }
      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}column/updateList`;
    data.rowid = this.rowid;
    params.data = data;
    Object.assign(params.data, this.processCheckData());
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        } else {
          this.nn.error('提示消息', '修改失败！');
        }
      }
    );
  }

  // 添加
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = `系统界面列设置 > 新增`;
    this.status = 'add';
    this.modalValidateForm.get('userType').setValue(this.checkOptions);
  }

  // 修改
  btnUpdate(data: any): void {
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
    this.modalTitle = '系统界面列设置 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
    const checkOptions = [
      {label: '托运人', value: 'isConsignee', checked: Boolean(Number(data.data[0].isConsignee))},
      {label: '承运人', value: 'isCarrier',checked: Boolean(Number(data.data[0].isCarrier))}
    ];
    this.modalValidateForm.get('userType').setValue(checkOptions);
  }

  // 删除
  btnDelete(data: any): void {
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
    this.deleteCon = '确定要删除此条记录?';
    this.status = 'delete';
    this.selectedData = data.data;

  }

  // 确认框数据处理
  modalConfirmResult(data: any) {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;
  }

  // 服务器返回确认信息处理
  serverReturnInformation(res: any) {
    if (!res.success) {
      this.modalErrorResult(res.msg);
    }
  }

  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(this.modalValidateForm.value);
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(this.modalValidateForm.value);
    }

  }

  handleCancel(): void {
    this.modalFormVisible = false;
  }

  closeResult(): void {
    this.modalValidateForm.reset();
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.httpUtilService.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  /**
   * check处理
   */
  processCheckData(): {} {
    const checkData: Array<any> = this.modalValidateForm.get('userType').value;
    const data = {};
    checkData.forEach(
      value => data[value.value] = Number(value.checked)
    );

    return data;
  }

}
