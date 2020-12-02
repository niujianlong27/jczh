import {Component, OnInit} from '@angular/core';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadFiles} from '@service/upload-files';
import {NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {portUrl} from '@model/portUrl';

@Component({
  selector: 'app-bank-base-information',
  templateUrl: './bank-base-information.component.html',
  styleUrls: ['./bank-base-information.component.css']
})
export class BankBaseInformationComponent implements OnInit {

  pageSize: number = 30; //条数
  dataSet: Array<any> = []; //列表数据
  totalPage: number = 0; //数据总数
  listLoading: boolean = false; //list加载
  searchData: any; // 搜索数据
  selectData: Array<any> = [];
  buttonId: string; // 按钮ID

  rowid: string = '';

  status: string = '';

  modalFormData: Array<any> = [
    {
      name: '银行ID', eName: 'bankId', type: 'text', validateCon: '请输入银行ID', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]+',
        patternErr: '资源ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '银行名称', eName: 'bankName', type: 'text', validateCon: '请输入资源名称', require: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[\u4e00-\u9fa5]+[0-9]*',
        patternErr: '资源名称格式不正确，只能为中文名称或中文名称加数字'
      }
    },
    {
      name: 'app下拉银行名称', eName: 'appBankName', type: 'text', validateCon: '请输入app下拉银行名称', radioArr: [], require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '排序', eName: 'sortIndex', type: 'number', validateCon: '请输入排序', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '使用类别', eName: 'bankType', type: 'text', validateCon: '请输入使用类别', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },

    {
      name: '银行图标', eName: 'bankImg', type: 'img', validateCon: '请上传银行图标', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];

  // 弹出框
  modalFormVisible: boolean = false;
  modalValidateForm: FormGroup;
  modalTitle: string;
  // 图片上传
  previewImage = '';
  previewVisible = false;
  iconList = [];
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  constructor(
    private http: HttpUtilService,
    public upload: UploadFiles,
    private fb: FormBuilder,
    private nn: NzNotificationService,
    private nm: NzModalService,) {
  }

  ngOnInit() {
    this.upload.setUpload();
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

    // this.listSearch({page: 1, length: this.pageSize});

  }


  /**
   * 查询事件
   * @param param
   */
  listSearch(param: any) {
    this.listLoading = true; //list加载
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = param;
    this.getListSearch(param);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    this.http.post(urls.selectBankBasePage, data).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
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
    console.log(this.buttonId);
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
   * 新增
   */
  btnAdd(): void {
    this.modalTitle = '银行基础信息管理>新增';
    this.modalFormVisible = true;
    this.status = 'add';
  }

  /**
   * 修改
   */
  btnUpdate(): void {
    if (this.selectData.length !== 1) {
      this.nn.warning('提示消息', '请选择一条数据后操作！');
      return;
    }

    this.modalTitle = '银行基础信息管理>修改';
    this.modalFormVisible = true;
    this.status = 'update';
    this.modalValidateForm.patchValue(this.selectData[0]);
    this.rowid = this.selectData[0].rowid;
    this.iconList = this.upload.getFileList(this.selectData[0].bankImg);
  }

  /**
   * 删除
   */
  btnDelete(): void {
    if (this.selectData.length === 0) {
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
   * 删除请求事件
   */
  deleteRequest(): Promise<boolean> {
    const url = urls.bankBaseDeleteList;
    const param = {
      tBankBaseModelList: this.selectData
    };
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
   * 弹窗确认
   */
  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData();
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData();
    }

  }

  /**
   * 添加请求
   */
  addData(): void {
    const url = urls.insertBankBase;
    const param = this.modalValidateForm.getRawValue();

    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '新增成功！');
          this.listSearch({page: 1, length: this.pageSize});
          this.modalFormVisible = false;
        }
      }
    );


  }

  /**
   * 修改请求
   */
  updateData(): void {
    const url = urls.updateBankBase;
    const param = this.modalValidateForm.getRawValue();
    param.rowid = this.rowid;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nn.success('提示消息', '修改成功！');
          this.listSearch({page: 1, length: this.pageSize});
          this.modalFormVisible = false;
        }
      }
    );

  }

  /**
   * 弹窗取消
   */
  handleCancel(): void {
    this.modalFormVisible = false;
  }

  /**
   * 弹窗关闭
   */
  closeResult(): void {
    this.iconList = [];
    this.modalValidateForm.reset();
  }

  /**
   * 图标更改事件
   * @param info
   * @param name
   */
  handleChange(info, name) {
    if (info.file.status === 'done') {
      if (name == 'bankImg') {
        // 单图片
        this.iconList = [info.file.originFileObj];
        this.modalValidateForm.patchValue({bankImg: this.iconList[0].url});

        // 多图片
        // this.cardPhotoList = this.cardPhotoList.map(item => item.originFileObj ? item.originFileObj : item);
        // this.validateForm.patchValue({ cardPhoto: this.cardPhotoList.map(item => item.url).join(";") });
      }


    }
    if (info.file.status === 'removed') {
      if (name == 'bankImg') {
        // 单图片
        this.modalValidateForm.patchValue({bankImg: ''});

        // 多图片
        // this.validateForm.patchValue({ icon: this.iconList.map(item => item.url).join(";") });
      }


    }
  }

}
