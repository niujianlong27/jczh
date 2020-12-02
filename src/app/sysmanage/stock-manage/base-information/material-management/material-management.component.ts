import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {stockManageURL} from '@model/stockManage';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-material-management',
  templateUrl: './material-management.component.html',
  styleUrls: ['./material-management.component.css']
})
export class MaterialManagementComponent implements OnInit {


  modalFormData: Array<any> = [
    {
      name: '材质名称', eName: 'signname', type: 'text', validateCon: '请输入材质名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text',
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
    params.url = stockManageURL.selectProdsign;
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
      case 'export': {  // 导出
        this.btnExport();
      }
        break;
    }

  }

  // 添加
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '材质管理 > 新增';
  }

  // 修改
  btnUpdate(): void {
    this.modalFormVisible = true;
    this.modalTitle = '材质管理 > 修改';
    this.modalValidateForm.patchValue(this.selectedData[0]);

  }

  // 删除
  btnDelete(): void {
    this.nm.confirm({
      nzTitle: '材质管理 > 删除',
      nzContent: '是否确认删除？',
      nzOnOk: () => this.deleteRequest()
    });
  }

  /**
   * 导出
   */
  btnExport(): void {
    this.nm.confirm({
      nzTitle: '仓库管理 > 导出',
      nzContent: '是否确认导出？',
      nzOnOk: () => this.exportRequest()
    });
  }

  /**
   * 导出请求
   */
  exportRequest(): Subscription {
    const url = stockManageURL.getProdsignExcel;

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
        a.download = `材质管理.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  /**
   * 删除请求
   */
  deleteRequest(): Promise<void> {
    const url = stockManageURL.deleteProdsign;
    const param = {
      prodsignModels: []
    };
    this.selectedData.forEach(
      value => {
        param.prodsignModels.push({rowid: value.rowid});
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

    const url = stockManageURL.insertProdsign;
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
    const url = stockManageURL.updateProdsign;
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
