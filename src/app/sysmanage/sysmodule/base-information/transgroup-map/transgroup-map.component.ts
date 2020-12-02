import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {XlsxService} from '@component/simple-page/xlsx/xlsx.service';
import {HttpUtilService} from '@service/http-util.service';
import {TRANS_URLS} from '@model/trans-urls';
import {urls} from '@model/url';

@Component({
  selector: 'app-transgroup-map',
  templateUrl: './transgroup-map.component.html',
  styleUrls: ['./transgroup-map.component.css']
})
export class TransgroupMapComponent implements OnInit {

  modalValidateForm: FormGroup;
  modalFormVisible: boolean = false; //  表单弹窗
  listLoading: boolean = false;
  modalTitle: string; //弹窗标题
  showExplainFlag: boolean = false;
  dataSet: any = [];
  totalPages: number = 0;
  pageSize: number = 30;
  searchData: any;
  selectList: Array<any> = [];//选中的数据
  status:any; // 按钮标记

  modalFormData: Array<any> = [

    {
      type: 'inputModal',
      eName: 'companyId',
      url: 'getCompanyId',
      name: '平台车队',
      formId: 'company_pop',
      nameStr: 'companyName', // 传参
      idStr: 'companyId',// 返回数据
      require: true,
      value: null,  // 默认显示
      model: null,
      disabled: false,
      validateCon: '请选择平台车队',
      validators: {
        require: true,
        pattern: false,
      },
      extraParam:{}
    },
    {
      type: 'inputModal',
      url: 'getCompanySettle',
      eName:'settleCompanyId',
      name: '结算公司',
      formId: 'company_settle',
      nameStr: 'settleCompanyName', // 传参
      idStr: 'settleCompanyId',// 返回数据
      require: false,
      value: null,  // 默认显示
      model: null,
      validateCon: '请选择结算公司',
      disabled: true,
      validators: {
        require: false,
        pattern: false,
      },
      extraParam:{}
    },
    {
      name: '车队简称', eName: 'busCompanyName', type: 'text', require: true, validateCon: '请输入车队简称',
      disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', require: false, validateCon: '请输入备注',
      disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    }

  ];

  constructor(private http: HttpUtilService,
              private nzMess: NzNotificationService,
              private msg: NzMessageService,
              private xlsx: XlsxService,
              private nzModal: NzModalService,
              private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
  this.validateForm()
  }

  validateForm(){
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    this.modalValidateForm = this.fb.group({});
    for (const control of this.modalFormData) {
      let validatorOrOpts: Array<any> = [];
      control.validators.require && validatorOrOpts.push(Validators.required);
      control.validators.pattern && validatorOrOpts.push(Validators.pattern(control.validators.patternStr));
      this.modalValidateForm.addControl(control.eName, new FormControl(
        {value: '', disabled: control.disabled}, validatorOrOpts
      ));

    }
  }

  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  getList(data: any): void {
    this.selectList = [];
    this.searchData = {...data};
    let url = urls.transGroupMapgetRecord;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data.total ? res.data.data.total : 0;
      }
    });
  }
  btnClick(data: any): void {
    this.status = '';
    switch (data.buttonId) {
      case 'Add':
        this.add();
        break;
      case 'Update':
        this.Update();
        break;
      case 'Delete':
        this.Delete();
        break;
      default:
        this.msg.warning('按钮没有绑定方法！');
        break;
    }
  }

  add(){
    this.modalFormVisible = true;
    this.modalFormData[1].disabled = true;
    this.validateForm();
    this.modalTitle = '车队结算账户管理 > 新增';
    this.status = 'add';
    this.modalValidateForm.reset();
  }

  Update(){
    if (!this.selectList || this.selectList.length != 1) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作！'
      });
      return;
    }
    this.modalFormData[1].extraParam.companyId = this.selectList[0].companyId;
    this.modalFormData[1].disabled = false;
    this.modalFormData[0].value = this.selectList[0].companyName;
    this.modalFormData[1].value = this.selectList[0].settleCompanyName;
    this.validateForm();
    this.modalValidateForm.patchValue(this.selectList[0]);
    this.modalFormVisible = true;
    this.modalTitle = '车队结算账户管理 > 修改';
    this.status = 'update';
  }

  Delete(){  // 删除
    if (!this.selectList || this.selectList.length == 0) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    let url = urls.transGroupMapDelete;
    this.nzModal.confirm({
      nzTitle: '车队结算账户管理 > 删除',
      nzContent: '<p class="m-re">是否要将选中的数据删除?</p>',
      nzOnOk: () => new Promise((resolve, reject) => {
        let data = this.selectList.map(item => {
          return {rowid : item.rowid}
        })
        this.http.post(url, {tTransGroupMapModels:data}).then(
          (res: any) => {
            if (res.success) {
              resolve();
              this.nzMess.success('提示消息', res.data.data);
              this.selectList = [];
              this.listSearch(this.searchData);
            } else {
              reject();
            }
          }
        );
      })
    });
  }

  selectData(data) { // 选择列表
    this.selectList = data;
  }

  handleOk() { // 弹框确认
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }
    let data =  this.modalValidateForm.getRawValue();
    let params = this.modalValidateForm.getRawValue();
    if (this.status == 'update') {
      this.updateData(data);
    } else if (this.status == 'add') {
      this.addData(data)
    }

  }

  addData(data: any) { // 添加数据
    this.http.post(urls.transGroupMapInsert, data).then(res => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '添加成功！');
        }
      }
    );
  }

  updateData(data: any) { //修改数据
    data.rowid = this.selectList[0].rowid;
    this.http.post(urls.transGroupMapUpdate, data).then(res => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nzMess.success('提示消息', '修改成功！');
        }
      }
    );
  }

  handleCancel(): void { // 弹框取消
    this.modalFormVisible = false;
    this.modalFormData[0].value = '';
    this.modalFormData[1].value = '';
    this.modalValidateForm.reset();
  }

  /**
   * 批量修改
   */
  modalInputModal(model: any, data: any) {
    if (data.eName == "companyId"){
      if (model.inpValue) {
        this.modalFormData[1].disabled = false;
        this.modalFormData[1].value = '';
        this.modalFormData[1].extraParam.companyId = model.inpValue;
      }else{
        this.modalFormData[1].disabled = true;
        this.modalFormData[1].value = '';
      }
      this.validateForm();
      this.status == 'update' && this.modalValidateForm.get('busCompanyName').setValue(this.selectList[0].busCompanyName);
      this.status == 'update' && this.modalValidateForm.get('remark').setValue(this.selectList[0].remark);

    }
    model.selData && (data.model = model.selData);
    model.selData && this.modalValidateForm.get(data.eName).setValue(model.selData[0] && model.selData[0][data.idStr] || null);

  }

}
