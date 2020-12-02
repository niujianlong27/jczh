import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {HttpClient} from '@angular/common/http';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '@model/url';
import {environment} from '@env/environment';

@Component({
  selector: 'app-business-permission',
  templateUrl: './business-permission.component.html',
  styleUrls: ['./business-permission.component.css']
})
export class BusinessPermissionComponent implements OnInit {

  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalFormVisible2 = false; // 表单弹窗
  modalValidateForm: FormGroup;
  modalValidateForm2: FormGroup;
  columnsArr: any; //列缓存
  listLoading: boolean = true;// 表单加载状态
  pageSize: number = 30;//条数
  data: any;//查询条件缓存
  tempSearchParam: any;
  totalPage: number;//数据总条数
  dataSet: Array<any> = []; // 价格数据表单数据
  modalTitle: string; // 弹出框标题
  modalTitle2: string; // 弹出框标题
  status: string;
  selectedData: Array<any> = []; // 选中的数据
  modalFormData: Array<any> = [];
  modalFormData2: Array<any> = [];
  private tplModal: NzModalRef; // 弹窗相关
  deleteVisible = false; // 确认弹窗
  private rowid: any;
  inputModalModel: string;
  inputModalModel2: string;
  deleteCon: string;
  UserBusiSegment: any[] = [];
  UserBusiSegment2: any[] = [];
  findset: any = {
    url: 'getBusiSegment',
    formId: 'form_busi',
    name: '业务板块',
    parameter: 'segmentName',
    parameterSend: 'segmentId'
  };
  findset2: any = {
    url: 'getAppRoleById',
    formId: 'form_app_role',
    name: '角色名称',
    parameter: 'roleName',
    parameterSend: 'roleId'
  };
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  private commonModalForm(flag = false){
    this.modalFormData = [
      {
        name: '业务板块名称', eName: 'segmentId', type: 'inputModal', validateCon: '请输入业务板块名称', require: true, disabled: false,
        //selectArr: this.UserBusiSegment,
        validators: {
          require: true,
          pattern: false,
        }
      },

      {
        name: '设置项', eName: 'setCode', type: 'text', validateCon: '请填写设置项', require: true, disabled: false,
        validators: {
          require: true,
          pattern: false,
        }
      },

      {
        name: '设置值', eName: 'value', type: 'text', validateCon: '请填写设置值', require: true, disabled: false,
        validators: {
          require: true,
          pattern: false,
        }
      },

      {
        name: '备注', eName: 'remark', type: 'text', validateCon: '请填写设置值', require: false, disabled: false,
        validators: {
          require: false,
          pattern: false,
        }
      },
    ];
    this.modalValidateFormInit();
  }

  private commonModalForm2(flag = false){
    this.modalFormData2 = [
      {
        name: '业务板块名称', eName: 'segmentId', type: 'inputModal', validateCon: '请选择业务板块名称', require: true, disabled: false,
        selectArr: this.UserBusiSegment,
        validators: {
          require: true,
          pattern: false,
        }
      },

      {
        name: '角色名称', eName: 'roleId', type: 'select', validateCon: '请选择角色名称', require: true, disabled: false,
        selectArr: this.UserBusiSegment2,
        validators: {
          require: true,
          pattern: false,
        }
      },
    ];
    this.modalValidateFormInit2();
  }

  constructor(private http: HttpUtilService,
               private anhttp: HttpClient,
               private xlsx: XlsxService,
               private fb: FormBuilder,
               private nm: NzModalService,
               private nn: NzNotificationService) { }

  private modalValidateFormInit(){
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
        {value: null, disabled: this.modalFormData[i].disabled}, validatorOrOpts
      ));
    }
  }

  private modalValidateFormInit2(){
    this.modalValidateForm2 = this.fb.group({});
    this.modalFormData2 = this.modalFormData2 ? this.modalFormData2 : [];
    for (let i = 0; i < this.modalFormData2.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData2[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData2[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData2[i].validators.patternStr));
      }

      this.modalValidateForm2.addControl(this.modalFormData2[i].eName, new FormControl(
        {value: null, disabled: this.modalFormData2[i].disabled}, validatorOrOpts
      ));
    }
  }


  ngOnInit() {
    //this.modalValidateForm = this.fb.group({});
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListSearch(data);
  }
  // 数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.getBusiSegmentConfigById;
    params.data = data;
    this.data = {...params.data}
    this.tempSearchParam = data;
    console.log(params.data)
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          console.log(res)
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total;
        }
      }
    );
  }
  btnClick(data: any) {
    switch (data.type.buttonId) {
      case 'Configuration': {
        this.commonModalForm2();
        this.modalTitle2 = `添加APP角色组管理`;
        this.modalFormVisible2 = true
        this.status = 'app';
      }
        break;

    }
  }
  // 添加
  btnAdd() {
    this.commonModalForm();
    this.modalTitle = '业务版块配置> 新增';
    this.status = 'add';
    setTimeout(() => this.modalFormVisible = true,50)
    //this.modalFormVisible = true;
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
    this.commonModalForm(true);
    this.modalTitle = '业务版块配置 > 修改';
    this.status = 'update';
    this.modalFormVisible = true;
    window.setTimeout(() => {
      this.rowid = data.data[0].rowid;
      this.modalValidateForm.patchValue(data.data[0]);
      this.inputModalModel = data.data[0].segmentName;
    },500)
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

  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.insertBusiSegmentConfig;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
          this.inputModalModel= '';
        }
      }
    );

  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.updateBusiSegmentConfig;
    data.rowid = this.rowid;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
          this.inputModalModel= '';
        }
      }
    );

  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tBusiSegmentConfigModels: []}, method: 'POST'};
    params.url = urls.deleteBusiSegmentConfig;
    params.data.tBusiSegmentConfigModels = this.selectedData;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '删除成功！');
        }
      }
    );
  }

   // 弹窗销毁
   destroyTplModal(): void {
     window.setTimeout(() => {
       this.tplModal.destroy();
     }, 1500);
   };
  //取消
  handleCancel() {
    this.modalFormVisible = false;
    this.inputModalModel= '';
  }

  //取消
  handleCancel2() {
    this.modalFormVisible2 = false;
    this.inputModalModel= '';
    this.inputModalModel2='';
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

  handleOk2() {
    console.log(327)
    if ('VALID' === this.modalValidateForm2.status && 'app' === this.status) {
      this.addAppData(this.modalValidateForm2.getRawValue());
    }


  }
// 添加数据
  addAppData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.insertBusiSegmentConfigByone;
    data.value=data.roleId;
    params.data = data;
    console.log(data)
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.modalFormVisible2 = false;
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '添加成功！');
          this.inputModalModel= '';
          this.inputModalModel2='';
        }
      }
    );

  }
  inpEmit(data: any) {
    this.modalValidateForm.get('segmentId').setValue(data.inpValue);
  }
  inpEmit2(data: any) {
    this.modalValidateForm2.get('segmentId').setValue(data.inpValue);
  }
  inpEmit3(data: any) {
    this.modalValidateForm2.get('roleId').setValue(data.inpValue);
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



}
