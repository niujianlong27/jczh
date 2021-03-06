import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {urls} from '@model/url';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {UploadFiles} from '@service/upload-files';

@Component({
  selector: 'app-app-interface',
  templateUrl: './app-interface.component.html',
  styleUrls: ['./app-interface.component.css']
})
export class AppInterfaceComponent implements OnInit {

  formGroup: Array<any> = [];
  modalFormData: Array<any> = [
    {
      name: '界面ID', eName: 'formId', type: 'text', validateCon: '请输入界面ID', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '界面名称', eName: 'formName', type: 'text', validateCon: '请输入界面名称', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '界面说明', eName: 'formDesc', type: 'text', validateCon: '请输入界面说明', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '界面分组', eName: 'formGroup', type: 'select', validateCon: '请选择界面分组', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      },
      selectList: this.formGroup
    },
    {
      name: '界面图标', eName: 'formImg', type: 'img', validateCon: '请上传界面图标', require: true, disabled: false, hidden: false,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入按钮名称', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
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
  formImgList = [];
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
      modalFormDatum.validators.pattern ? validatorOrOpts.push(Validators.required) : null;
      this.modalValidateForm.addControl(modalFormDatum.eName, new FormControl(
        {value: '', disabled: modalFormDatum.disabled}, validatorOrOpts
      ));
    }

    this.upload.setUpload();
    this.getStatic(this.formGroup, 'JMFZ');
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
    const url = urls.selectAppForm;
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
    this.modalTitle = 'APP界面设置 > 新增';
    this.status = 'add';
  }

  /**
   * 新增请求
   */
  addData(): void {
    const url = urls.insertAppForm;
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
    this.modalTitle = 'APP界面设置 > 修改';
    this.status = 'update';
    this.rowid = this.selectedData[0].rowid;
    this.modalValidateForm.patchValue(this.selectedData[0]);
    const formImg = this.modalValidateForm.get('formImg').value;
    if (formImg) {
      this.formImgList = formImg.split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `界面图标${index + 1}.png`,
          status: 'done',
          url: url
        };
      });
    }

  }

  /**
   * 修改请求
   */
  updateData(): void {

    const url = urls.updateAppForm;
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
        const url = urls.deleteAppForm;
        const param = [];
        this.selectedData.forEach(
          res => {
            param.push({rowid: res.rowid});
          }
        );
        return this.http.post(url, {tAppFormModels: param}).then(
          res => {
            if (res.success) {
              this.modalFormVisible = false;
              this.listSearch(this.searchData);
              this.nn.success('提示消息', '修改成功！');
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
    this.formImgList = [];
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
        this.formImgList = [info.file.originFileObj];
        this.modalValidateForm.patchValue({formImg: this.formImgList[0].url});

        // 多图片
        // this.cardPhotoList = this.cardPhotoList.map(item => item.originFileObj ? item.originFileObj : item);
        // this.validateForm.patchValue({ cardPhoto: this.cardPhotoList.map(item => item.url).join(";") });
      }

    }
    if (info.file.status === 'removed') {
      if (name == 'formImg') {
        // 单图片
        this.modalValidateForm.patchValue({formImg: ''});

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
