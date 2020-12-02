import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {urls} from '@model/url';
import {UploadFiles} from '@service/upload-files';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  radioArr: Array<any> = [];

  modalFormData: Array<any> = [
    {
      name: '界面ID', eName: 'formId', type: 'text', validateCon: '请输入界面ID', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '按钮ID', eName: 'buttonId', type: 'text', validateCon: '请输入按钮ID', require: true,
      validators: {
        require: true,
        pattern: true,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '按钮名称', eName: 'buttonName', type: 'text', validateCon: '请输入按钮名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '按钮类型', eName: 'type', type: 'radio', validateCon: '请选择按钮类型', require: true,
      radioArr: this.radioArr,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '按钮宽度', eName: 'weight', type: 'number', validateCon: '请输入按钮宽度', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '按钮高度', eName: 'height', type: 'number', validateCon: '请输入按钮高度', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '按钮图片', eName: 'bgImg', type: 'upload',
      validators: {
        require: false,
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
      name: '备注', eName: 'remark', type: 'text',
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];

  // 图片上传相关
  bgImgList = [];

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
  searchData: any;  //存储查询的数据

  private rowid: number;
  private status: string;
  private tplModal: NzModalRef; // 弹窗相关

  constructor(private httpUtilService: HttpUtilService,
               private fb: FormBuilder,
               private nm: NzModalService,
               private nn: NzNotificationService,
               public upload: UploadFiles,
               private http: HttpClient,) {
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
    params.url = `${environment.baseUrl}formButton/selectFormButtonList`;
    params.data = data;
    this.tempSearchParam = data;
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

  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}formButton/insertList`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {buttonModels: []}, method: 'POST'};
    params.url = `${environment.baseUrl}formButton/deleteList`;
    params.data.buttonModels = this.selectedData;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '删除成功！');
        }
      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}formButton/updateFormButton`;
    data.rowid = this.rowid;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        }
      }
    );
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
    let url=`${environment.baseUrlSystem}formButton/selectFormButtonExport`;
    this.http.post(url, this.searchData, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `界面功能设置.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
    if (this.modalValidateForm.get('bgImg').value) {
      this.bgImgList = this.modalValidateForm.get('bgImg').value.split(';').filter(item => item).map((url, index) => {
        return {
          uid: index + 1,
          name: `图标${index + 1}.png`,
          status: 'done',
          url: url
        };
      });
    }

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
    this.bgImgList = [];
    this.modalValidateForm.reset();
  }

  // 图片上传相关
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleChange(info, name) {
    if (info.file.status === 'done') {
      if (name == 'bgImg') {
        // 单图片
        this.bgImgList = [info.file.originFileObj];
        this.modalValidateForm.patchValue({bgImg: this.bgImgList[0].url});

        // 多图片
        // this.cardPhotoList = this.cardPhotoList.map(item => item.originFileObj ? item.originFileObj : item);
        // this.validateForm.patchValue({ cardPhoto: this.cardPhotoList.map(item => item.url).join(";") });
      }

    }
    if (info.file.status === 'removed') {
      if (name == 'bgImg') {
        // 单图片
        this.modalValidateForm.patchValue({bgImg: ''});

        // 多图片
        // this.validateForm.patchValue({ icon: this.iconList.map(item => item.url).join(";") });
      }

    }
  }

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
   * 上传处理
   * @param file
   */
  handleData = (file) => {
    this.upload.new_multipart_params = {};
    this.upload.uploadData = {};
    this.upload.setUpload();
    this.upload.new_multipart_params['key'] = 'icon/' + file.name;
    return this.upload.new_multipart_params;

  };

}
