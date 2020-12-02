import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {UploadFiles} from '@service/upload-files';
import {urls} from '@model/url';

@Component({
  selector: 'app-app-version',
  templateUrl: './app-version.component.html',
  styleUrls: ['./app-version.component.css']
})
export class AppVersionComponent implements OnInit {

  OSList: Array<any> = [];

  modalFormData: Array<any> = [
    {
      name: 'APP名称', eName: 'appName', type: 'text', validateCon: '请输入APP名称', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '操作系统', eName: 'appOs', type: 'select', validateCon: '请选择操作系统', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: this.OSList
    },
    {
      name: 'APP下载地址', eName: 'appAddress', type: 'file', validateCon: '请上传APP', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: 'APP版本号', eName: 'versionNum', type: 'text', validateCon: '请输入APP版本号', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '是否强制更新', eName: 'isForceUpdate', type: 'select', validateCon: '请选择是否强制更新', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: [
        {name: '否', value: '0'},
        {name: '是', value: '1'},
      ]
    },
    {
      name: '是否为当前版本', eName: 'isCurrentVersion', type: 'select', validateCon: '请选择是否为当前版本', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      },
      selectList: [
        {name: '否', value: '0'},
        {name: '是', value: '1'},
      ]
    },
    {
      name: '更新内容', eName: 'remark', type: 'textarea', validateCon: '请输入更新内容', require: true, disabled: false,
      validators: {
        require: true,
        pattern: true,
        patternStr: new RegExp('^(\\S+)[\\s\\S]*?(\\S+)$'),
        patternErr: '请输入更新内容'
      }
    }
  ];

  // 数据弹窗
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalTitle: string; // 弹窗标题
  status: string = ''; //弹窗状态
  rowid: string = '';

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  total: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态

  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  searchData: any;  //存储查询的数据缓存

  //图片上传
  formFileList = [];
  previewImage = '';
  previewVisible = false;

  constructor(private http: HttpUtilService, private nn: NzNotificationService, private nm: NzModalService, private fb: FormBuilder, public upload: UploadFiles) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    for (const modalFormDatum of this.modalFormData) {
      let validatorOrOpts: Array<any> = [];
      modalFormDatum.validators.require ? validatorOrOpts.push(Validators.required) : null;
      modalFormDatum.validators.pattern ? validatorOrOpts.push(Validators.pattern(modalFormDatum.validators.patternStr)) : null;
      this.modalValidateForm.addControl(modalFormDatum.eName, new FormControl(
        {value: '', disabled: modalFormDatum.disabled}, validatorOrOpts
      ));
    }

    this.upload.setUpload();
    this.getStatic(this.OSList, 'CZXT');
  }

  /**
   * 列表搜索
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
   * 列表查询
   * @param param
   */
  getListSearch(param: any): void {
    this.listLoading = true;
    const url = urls.getAppVersion;
    this.http.post(url, param).then(
      res => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.total = res.data.data.total;
        }
      }
    );
  }

  /**
   * 按钮点击事件
   * @param data
   */
  btnClick(data: any) {
    const buttonId = data.type.buttonId;
    switch (buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      default:
        this.nn.warning('提示消息', '按钮未定义!');
        break;
    }
  }

  /**
   * 新增按钮点击
   */
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = 'APP版本维护 > 新增';
    this.status = 'add';
  }

  /**
   * 新增请求
   */
  addData(): void {
    const url = urls.insertAppVersion;
    const param = this.modalValidateForm.getRawValue();
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.modalFormVisible = false;
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '添加成功！');
        }
      }
    );
  }

  /**
   * 修改按钮点击
   */
  btnUpdate(): void {
    if (this.selectedData.length === 0 || this.selectedData.length > 1) {
      this.nn.warning('提示消息', '请选择一条数据后操作！');
      return;
    }
    this.modalFormVisible = true;
    this.modalTitle = 'APP版本维护 > 修改';
    this.status = 'update';
    this.rowid = this.selectedData[0].rowid;
    this.modalValidateForm.patchValue(this.selectedData[0]);
    const formFile = this.modalValidateForm.get('appAddress').value;
    if (formFile) {
      this.formFileList = this.upload.getFileList(formFile);
    }

  }

  /**
   * 修改请求
   */
  updateData(): void {

    const url = urls.updateAppVersion;
    const param = this.modalValidateForm.getRawValue();
    param.rowid = this.rowid;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.modalFormVisible = false;
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '修改成功！');
        }
      }
    );
  }

  btnDelete(): void {
    if (this.selectedData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作！');
      return;
    }

    this.nm.confirm({
      nzTitle: '提示消息',
      nzContent: '是否确认删除数据',
      nzOnOk: () => {
        const url = urls.deleteAppVersion;
        const param = [];
        this.selectedData.forEach(
          res => {
            param.push({rowid: res.rowid});
          }
        );
        return this.http.post(url, {appVersionModelList: param}).then(
          res => {
            if (res.success) {
              this.modalFormVisible = false;
              this.listSearch(this.searchData);
              this.nn.success('提示消息', res.data.msg);
            }
          }
        );
      }
    });
  }

  /**
   * 弹窗确认
   */
  handleOk(): void {
    console.log(this.modalValidateForm.getRawValue());
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
   * 弹窗取消
   */
  handleCancel(): void {
    this.modalFormVisible = false;
  }

  /**
   * 弹窗关闭后回调
   */
  closeResult(): void {
    this.modalValidateForm.reset();
    this.formFileList = [];
    this.rowid = '';
  }


  /**
   * 选中数据
   * @param param
   */
  updateDataResult(param: Array<any>) {
    this.selectedData = param;
  }

  /**
   * 图片上传
   * @param info
   * @param name
   */
  handleChange(info, name) {

    if (info.file.status === 'done') {
      if (name == 'formImg') {
        // 单图片
        this.formFileList = [info.file.originFileObj];
        this.modalValidateForm.patchValue({appAddress: this.formFileList[0].url});

        // 多图片
        // this.cardPhotoList = this.cardPhotoList.map(item => item.originFileObj ? item.originFileObj : item);
        // this.validateForm.patchValue({ cardPhoto: this.cardPhotoList.map(item => item.url).join(";") });
      }

    }
    if (info.file.status === 'removed') {
      if (name == 'formImg') {
        // 单图片
        this.modalValidateForm.patchValue({appAddress: ''});

        // 多图片
        // this.validateForm.patchValue({ cardPhoto: this.cardPhotoList.map(item => item.url).join(";") });
      }

    }
  }

  /**
   * 上传预览
   * @param file
   */
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  /**
   * 上传文件名处理
   * @param file
   */
  handleData = (file) => {
    this.upload.setUpload();
    this.upload.new_multipart_params['key'] = 'app/' + this.upload.calculate_object_name(file);
    return this.upload.new_multipart_params;
  };

  /**
   * 获取静态数据
   * @param data
   * @param valueSetCode
   */
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

}
