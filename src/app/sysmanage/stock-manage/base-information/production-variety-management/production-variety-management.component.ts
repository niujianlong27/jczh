import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';
import {stockManageURL} from '@model/stockManage';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-production-variety-management',
  templateUrl: './production-variety-management.component.html',
  styleUrls: ['./production-variety-management.component.css']
})
export class ProductionVarietyManagementComponent implements OnInit {

  modalFormData: Array<any> = [
    {
      name: '产品ID', eName: 'id', type: 'text', validateCon: '请输入产品ID', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '类别', eName: 'category', type: 'text', validateCon: '请输入类别', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '规格', eName: 'specifications', type: 'text', validateCon: '请输入规格', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '口径', eName: 'caliber', type: 'number', validateCon: '请输入口径', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '壁厚', eName: 'thick', type: 'number', validateCon: '请输入壁厚', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '下差壁厚', eName: 'lowThick', type: 'number', validateCon: '请输入下差壁厚', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '上差壁厚', eName: 'upThick', type: 'number', validateCon: '请输入上差壁厚', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '白管支数', eName: 'packaging', type: 'number', validateCon: '请输入白管支数', require: true,
      validators: {
        require: true,
        pattern: false,
        precision: '0'
      }
    },
    {
      name: '长度', eName: 'fLength', type: 'number', validateCon: '请输入长度', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '生产区域', eName: 'productArea', type: 'text', validateCon: '请输入生产区域', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '黑管支数', eName: 'blackPackaging', type: 'number', validateCon: '请输入品种分组', require: false,
      validators: {
        require: false,
        pattern: false,
        precision: '0'
      }
    },
    {
      name: '水压值', eName: 'waterPressure', type: 'text', validateCon: '请输入品种分组', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '下差重量', eName: 'lowWeight', type: 'number', validateCon: '请输入品种分组', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '上差重量', eName: 'upWeight', type: 'number', validateCon: '请输入品种分组', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入品种分组', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },

  ];


  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  nzOkLoading = false;

  // 确认框
  modalTitle: string; // 弹出框标题

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
  searchData: any;  //存储查询的数据

  buttonID: string = '';


  constructor(
    private http: HttpUtilService,
    private fb: FormBuilder,
    private nm: NzModalService,
    private nn: NzNotificationService,
    private  angularHttp: HttpClient
  ) {
  }

  ngOnInit() {

    this.listSearch({page: 1, length: this.pageSize});

    this.formInitialization();

  }

  /**
   * 列表查询
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }

  /**
   * 列表查询数据获取
   * @param data
   */
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = stockManageURL.selectDcProduct;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        this.selectedData = [];
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }


  btnClick(data: any): void {
    this.buttonID = data.type.buttonId;
    switch (data.type.buttonId) {

      case 'Add': {  //新增
        this.btnAdd();
      }
        break;
      case 'Update': {  // 修改
        this.btnUpdate();
      }
        break;
      case 'Delete': {  // 删除
        this.btnDelete();
      }
        break;
      case 'Export': {  // 导出
        this.btnExport();
      }
        break;
    }

  }

  // 添加
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '生产品种管理 > 新增';
  }

  // 修改
  btnUpdate(): void {
    this.modalFormVisible = true;
    this.modalTitle = '生产品种管理 > 修改';
    this.modalValidateForm.patchValue(this.selectedData[0]);

  }

  // 删除
  btnDelete(): void {
    this.nm.confirm({
      nzTitle: '生产品种管理 > 删除',
      nzContent: '是否确认删除？',
      nzOnOk: () => this.deleteRequest()
    });
  }

  /**
   * 导出
   */
  btnExport(): void {
    this.nm.confirm({
      nzTitle: '生产品种管理 > 导出',
      nzContent: '是否确认导出？',
      nzOnOk: () => this.exportRequest()
    });
  }

  /**
   * 导出请求
   */
  exportRequest(): Subscription {
    const url = stockManageURL.getDcProductExcel;

    return this.angularHttp.post(
      url,
      this.tempSearchParam,
      {responseType: 'blob'}
    ).subscribe(
      (res: any) => {
        const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `生产品种管理.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  /**
   * 删除请求
   */
  deleteRequest(): Promise<void> {
    const url = stockManageURL.deleteDcProduct;
    const param = {
      dcProductModelList: []
    };
    this.selectedData.forEach(
      value => {
        param.dcProductModelList.push({rowid: value.rowid});
      }
    );
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '删除成功！');
          this.listSearch({page: 1, length: this.pageSize});
        }
      }
    );
  }

  // 数据弹出框相关
  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm.status && 'Add' === this.buttonID) {
      this.addData();
    }
    if ('VALID' === this.modalValidateForm.status && 'Update' === this.buttonID) {
      this.updateData();
    }
  }

  /**
   * 添加数据
   */
  addData() {

    const url = stockManageURL.insertDcProduct;
    const params = this.modalValidateForm.getRawValue();
    this.nzOkLoading = true;
    this.http.post(url, params).then(
      (res: any) => {
        this.nzOkLoading = false;
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        }
      }
    );
  }

  /**
   * 修改数据
   */
  updateData() {
    const url = stockManageURL.updateDcProduct;
    const params = this.modalValidateForm.getRawValue();
    params.rowid = this.selectedData[0].rowid;
    this.nzOkLoading = true;
    this.http.post(url, params).then(
      (res: any) => {
        this.nzOkLoading = false;
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '修改成功！');
          this.modalFormVisible = false;
        }
      }
    );
  }

  // 数据弹出框取消
  handleCancel(): void {
    this.modalFormVisible = false;
  }

  // 数据弹出框取消
  closeResult(): void {
    this.modalValidateForm.reset();
  }


  /**
   * 选中数据
   * @param $event
   */
  updateDataResult($event: Array<any>) {
    this.selectedData = $event;
  }

  /**
   *  数据弹出框表单初始化
   */
  formInitialization() {

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
  }

}
