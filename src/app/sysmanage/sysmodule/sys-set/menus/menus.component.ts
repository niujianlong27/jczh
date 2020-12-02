import {Component, OnInit} from '@angular/core';
import {environment} from '@env/environment';
import {HttpUtilService} from '@service/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {urls} from '@model/url';
import {UploadFiles} from '@service/upload-files';
import {Observable} from 'rxjs';
import {SYS_URLS} from '@model/trans-urls';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {

  radioArr: Array<any> = [];

  modalFormData: Array<any> = [
    {
      name: '资源ID', eName: 'resourceId', type: 'text', validateCon: '请输入资源ID', require: true,
      validators: {
        require: true,
        pattern: true,
        patternStr: '[a-zA-Z0-9]+',
        patternErr: '资源ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '资源名称', eName: 'resourceName', type: 'text', validateCon: '请输入资源名称', require: true,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[\u4e00-\u9fa5]+[0-9]*',
        patternErr: '资源名称格式不正确，只能为中文名称或中文名称加数字'
      }
    },
    {
      name: '资源类型', eName: 'type', type: 'radio', validateCon: '请输入资源类型', radioArr: this.radioArr, require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '排序', eName: 'sortId', type: 'number', validateCon: '请输入排序', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '界面ID', eName: 'formId', type: 'text', validateCon: '请输入界面ID', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '父资源ID', eName: 'parentId', type: 'text', validateCon: '请输入父资源ID', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: 'icon', eName: 'icon', type: 'img', validateCon: '请上传icon', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '图片', eName: 'pic', type: 'pic', validateCon: '请上传pic', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入备注', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];

  modalFormData2: Array<any> = [
    {
      name: '图标', eName: 'pic', type: 'pic', validateCon: '请上传pic', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '上级菜单', eName: 'parentId', type: 'select', validateCon: '请选择上级菜单', require: false, disabled: false,
      //selectArr: this.UserBusiSegment2,
      validators: {
        require: false,
        pattern: false,
      }
    },
    /*{
      name: '界面ID', eName: 'resourceId', type: 'text', validateCon: '请输入界面ID', require: true,
      validators: {
        require: true,
        pattern: true,
        // patternStr: '[a-zA-Z0-9]+',
        // patternErr: '资源ID格式不正确，只能填数字或字母'
      }
    },*/
    {
      name: '资源名称', eName: 'resourceName', type: 'text', validateCon: '请输入界面名称', require: true,
      validators: {
        require: true,
        pattern: false,
        /*patternStr: '[\u4e00-\u9fa5]+[0-9]*',
        patternErr: '资源名称格式不正确，只能为中文名称或中文名称加数字'*/
      }
    },
    {
      name: 'form_id', eName: 'formId', type: 'text', validateCon: '请输入资源类型', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];
  findset2: any = {
    url: 'getMenuV2',
    formId: 'form_web_menu',
    name: '上级菜单',
    parameter: 'resourceName',
    parameterSend: 'parentId'
  };
  inputModalModel2: string;
  // 确认框
  modalTitle: string;
  modalTitle2: string;
  deleteVisible: boolean = false;//删除弹窗显示控制
  deleteCon: string;
  dataSet: Array<any>;
  // 表单
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数

  listLoading: boolean = true;// 表单加载状态
  private selectedData: Array<any> = [];//选择需要删除数据
  modalValidateForm: FormGroup;
  modalValidateForm2: FormGroup;
  private status: string;
  private rowid: string;
  searchData: any;  //存储查询的数据
  private tplModal: NzModalRef;

  // 弹出框
  modalFormVisible: boolean = false;
  modalFormVisible2: boolean = false;
  // 图片上传
  iconList = [];
  picList = [];
  picList2 = [];
  previewImage = '';
  previewImage2 = '';
  previewVisible = false;
  previewVisible2 = false;
  uploadData: any = {};
  new_multipart_params: any = {};


  constructor(private http: HttpClient,
              private httpUtilService: HttpUtilService,
              private fb: FormBuilder,
              private nm: NzModalService,
              private nn: NzNotificationService,
              public upload: UploadFiles,
              public upload2: UploadFiles,) {
  }

  ngOnInit() {

    this.getStatic();

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalValidateForm2 = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    this.modalFormData2 = this.modalFormData2 ? this.modalFormData2 : [];
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
    for (let i = 0; i < this.modalFormData2.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData2[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData2[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData2[i].validators.patternStr));
      }

      this.modalValidateForm2.addControl(this.modalFormData2[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }

    this.listSearch({page: 1, length: this.pageSize});
  };

  // 列表获取
  listSearch(param: any): void {
    param.page = param.page || 1; //最好有
    param.length = param.length || this.pageSize; //最好有
    this.searchData = param;
    this.listLoading = true;
    this.getListSearch(param);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}menu/selectMenuList`;
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

  btnClick(data: any): void {
    //const selectArr = this.dataSet.filter(x => x.checked);
    //console.log(data)
    switch (data.type.buttonId) {
      case 'AddV2': {//保存 按钮
        this.btnAddV2();
      }
        break;
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
    let url=`${environment.baseUrlSystem}menu/selectMenuExport`;
    this.http.post(url, this.searchData, {responseType: 'blob'}).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `系统菜单设置.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  }

  btnAddV2():void{
    this.modalFormVisible2 = true;
    this.modalTitle2 = ` 添加`;
    this.status = 'addV2';
  }
  // 添加按钮
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = ` 添加`;
    this.status = 'add';
  }

  // 更新按钮
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
    this.modalTitle = '系统菜单 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);

    data.data[0].icon && (this.iconList = data.data[0].icon.split(';').filter(item => item).map((url, index) => {
      return {
        uid: index + 1,
        name: `icon${index + 1}.png`,
        status: 'done',
        url: url
      };
    }));
    data.data[0].pic && (this.picList = data.data[0].pic.split(';').filter(item => item).map((url, index) => {
      return {
        uid: index + 1,
        name: `pic${index + 1}.png`,
        status: 'done',
        url: url
      };
    }));
  }

  // 删除按钮
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
    this.selectedData = data.data;
    this.status = 'delete';
  }

  // 添加数据
  addData(data: any) {
    let params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}menu/insertMenu`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        }
      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}menu/updateMenu`;
    data.rowid = this.rowid;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.modalFormVisible = false;
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '修改成功！');
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tMenus: []}, method: 'POST'};
    params.url = `${environment.baseUrl}menu/deleteMenu`;
    for (const data of this.selectedData) {
      params.data.tMenus.push({rowid: data.rowid});
    }

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '删除成功！');
        }

      }
    );

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

  // 异常确认弹出框
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
  handleOk2(): void {
    if ('VALID' === this.modalValidateForm2.status && 'addV2' === this.status) {
      this.addNewData(this.modalValidateForm2.value);
    }

  }
  // 添加数据
  addNewData(data: any) {
    let params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}menu/insertMenuV2`;
    data.icon=data.pic;
    params.data = data;
    //params.icon=data.pic;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible2 = false;
          this.nn.success('提示消息', '添加成功！');
          this.inputModalModel2='';
        }
      }
    );
  }
  handleCancel(): void {
    this.modalFormVisible = false;
  }
  handleCancel2(): void {
    this.modalFormVisible2 = false;
    this.inputModalModel2='';
  }
  closeResult(): void {
    this.iconList = [];
    this.picList = [];
    this.modalValidateForm.reset();
  }
  closeResult2(): void {
    this.picList2 = [];
    this.modalValidateForm2.reset();
  }

  // 图片上传函数
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  // 图片上传函数
  handlePreview2 = (file: UploadFile) => {
    this.previewImage2 = file.url || file.thumbUrl;
    this.previewVisible2 = true;
  };
  handleChange(info, name) {
    if (info.file.status === 'done') {
      if (name == 'icon') {
        // 单图片
        this.iconList = [info.file.originFileObj];
        this.modalValidateForm.patchValue({icon: this.iconList[0].url});

        // 多图片
        // this.cardPhotoList = this.cardPhotoList.map(item => item.originFileObj ? item.originFileObj : item);
        // this.validateForm.patchValue({ cardPhoto: this.cardPhotoList.map(item => item.url).join(";") });
      }
      if (name == 'pic') {
        // 单图片
        this.picList = [info.file.originFileObj];
        this.modalValidateForm.patchValue({pic: this.picList[0].url});

        // 多图片
        // this.cardPhotoList = this.cardPhotoList.map(item => item.originFileObj ? item.originFileObj : item);
        // this.validateForm.patchValue({ cardPhoto: this.cardPhotoList.map(item => item.url).join(";") });
      }

    }
    if (info.file.status === 'removed') {
      if (name == 'icon') {
        // 单图片
        this.modalValidateForm.patchValue({icon: ''});

        // 多图片
        // this.validateForm.patchValue({ icon: this.iconList.map(item => item.url).join(";") });
      }
      if (name == 'pic') {
        // 单图片
        this.modalValidateForm.patchValue({pic: ''});

        // 多图片
        // this.validateForm.patchValue({ icon: this.iconList.map(item => item.url).join(";") });
      }

    }
  }

  handleChange2(info, name) {
    if (info.file.status === 'done') {
      if (name == 'icon') {
        // 单图片
        this.iconList = [info.file.originFileObj];
        this.modalValidateForm2.patchValue({icon: this.iconList[0].url});
      }
      if (name == 'pic') {
        // 单图片
        this.picList2 = [info.file.originFileObj];
        this.modalValidateForm2.patchValue({pic: this.picList2[0].url});
      }
    }
    if (info.file.status === 'removed') {
      if (name == 'icon') {
        // 单图片
        this.modalValidateForm2.patchValue({icon: ''});
      }
      if (name == 'pic') {
        // 单图片
        this.modalValidateForm2.patchValue({pic: ''});
      }

    }
  }

  getStatic(): void {
    this.httpUtilService.post(urls.static, {valueSetCode: 'CDLX'}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(this.radioArr, res.data.data.data);
        }
      }
    );
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };


  getPolicy(): Observable<any> {
    const that = this;
    return Observable.create(function (observer) {
      if (that.uploadData.expire && that.uploadData.expire > (new Date().getTime() / 1000 + 20 * 60)) {
        observer.next();
      } else {
        that.http.post(SYS_URLS.UPLOAD_GETPOLICY, {}).subscribe((res: any) => {
          if (res.data && res.code == 100) {
            that.uploadData = res.data;
            observer.next();
          } else {
            observer.error();
          }
        });
      }
    });
  }

  /**
   * 文件上传处理
   * @param file
   */
  handleData = (file) => {
    this.new_multipart_params = {};
    this.uploadData = {};
    this.setUpload();
    this.new_multipart_params['key'] = 'icon/' + file.name;
    return this.new_multipart_params;
  };

  setUpload() {
    this.getPolicy().subscribe(() => {
      //设置formdata
      this.new_multipart_params = {
        'policy': this.uploadData.policy,
        'OSSAccessKeyId': this.uploadData.accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'signature': this.uploadData.signature,
      };
    });
  }

  inpEmit3(data: any) {
    this.modalValidateForm2.get('parentId').setValue(data.inpValue);
  }

}
