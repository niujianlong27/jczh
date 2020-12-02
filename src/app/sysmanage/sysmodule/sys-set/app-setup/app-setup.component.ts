import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {urls} from '@model/url';

@Component({
  selector: 'app-app-setup',
  templateUrl: './app-setup.component.html',
  styleUrls: ['./app-setup.component.css']
})
export class AppSetupComponent implements OnInit {

  radioArr: Array<any> = [];

  modalFormData: Array<any> = [
    {
      name: '界面ID', eName: 'formId', type: 'text', validateCon: '请输入界面ID', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '界面名称', eName: 'formName', type: 'text', validateCon: '请输入界面名称', require: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '界面名称格式不正确，只能填数字或字母'
      }
    },
    {
      name: '访问URL', eName: 'formUrl', type: 'text', validateCon: '请输入访问URL', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '图标', eName: 'icon', type: 'upload', validateCon: '请上传图标', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '界面描述', eName: 'formDesc', type: 'text', validateCon: '请输入界面描述', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '排序', eName: 'sortId', type: 'text', validateCon: '请输入排序', require: false,
      validators: {
        require: false,
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

  // 图片上传相关
  fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];

  // 上传相关
  previewImage = '';
  previewVisible = false;

  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;

  // 确认框
  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗

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

  private rowid: number;
  private status: string;
  private tplModal: NzModalRef; // 弹窗相关

  constructor(private httpUtilService: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private nn: NzNotificationService) {
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

    this.getStatic(this.radioArr, 'ANLX');

  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.selectAppForm;
    params.data = data;
    this.tempSearchParam = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total;
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

  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.insertAppForm;
    params.data = data;
    this.httpUtilService.request(params).then(
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

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tAppFormModels: []}, method: 'POST'};
    params.url = urls.deleteAppForm;
    params.data.tAppFormModels = this.selectedData;
    this.httpUtilService.request(params).then(
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

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateAppForm;
    data.rowid = this.rowid;
    params.data = data;
    this.httpUtilService.request(params).then(
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

  // 添加
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '系统界面功能设置 > 新增';
    this.status = 'add';
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
    this.modalTitle = '系统界面功能设置 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
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
    this.deleteCon = '确定要删除当前记录?';
    this.status = 'delete';
    this.selectedData = data.data;

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

  // 数据弹出框相关
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

  // 数据弹出框取消
  handleCancel(): void {
    this.modalFormVisible = false;
  }

  // 数据弹出框取消
  closeResult(): void {
    this.modalValidateForm.reset();
  }

  // 图片上传相关
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

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

}
