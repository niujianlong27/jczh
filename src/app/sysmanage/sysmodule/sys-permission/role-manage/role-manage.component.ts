import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {environment} from '../../../../../environments/environment';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.component.html',
  styleUrls: ['./role-manage.component.css']
})
export class RoleManageComponent implements OnInit {

  modalFormData: Array<any> = [
    {
      name: '角色名称', eName: 'roleName', type: 'text', validateCon: '请输入角色名称', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入备注', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    }
  ];

  dataSet: any;//表格里数据
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;//表格是否在加载中
  selectedData: Array<any> = [];
  // 数据弹出框
  modalFormVisible = false; // 数据弹窗
  modalValidateForm: FormGroup;
  private status: string;// add添加，update更新
  private rowid: number;//记录rowid;

  searchData: any;  //存储查询的数据
  private tplModal: NzModalRef; // 弹窗相关

  selectedCompany: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测

  constructor(private httpUtilService: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private info: UserinfoService, private nn: NzNotificationService) {
  }

  ngOnInit(): void {
    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require) {
        validatorOrOpts.push(Validators.required);
      }
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        {value: '', disabled: this.modalFormData[i].disabled}, validatorOrOpts
      ));
    }
  }

  listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.listLoading = true;
    if (this.selectedCompany && this.permissions) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}role/getRole`;
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

  //添加
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = `角色管理 > 新增`;
    this.status = 'add';
  }

  //更新
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
    this.modalTitle = `角色管理 > 修改`;
    this.modalFormVisible = true;
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
  }

  //删除
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
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}role/insertRole`;
    if (this.selectedCompany) {
      data.agencyCompanyId = this.selectedCompany;
    }
    params.data = data;
    if(!params.data['roleName'].trim()){
      this.nn.warning('提示消息', '输入不能为空字符！');
      return
    }
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
    params.url = `${environment.baseUrl}role/updateRole`;
    data.rowid = this.rowid;
    params.data = data;
    if(!params.data['roleName'].trim()){
      this.nn.warning('提示消息', '输入不能为空字符！');
      return
    }
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tRoleModels: []}, method: 'POST'};
    params.url = `${environment.baseUrl}role/deleteRole`;
    for (const selectedDatum of this.selectedData) {
      params.data.tRoleModels.push({rowid: selectedDatum.rowid});
    }

    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch({});
          this.nn.success('提示消息', '删除成功！');
        }
      }
    );
  }

  //删除框确认
  modalConfirmResult(data: any): void {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;
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

  handleCancel(): void {
    this.modalFormVisible = false;
  }

  closeResult(): void {
    this.modalValidateForm.reset();
  }

  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  // 服务器返回确认信息处理
  serverReturnInformation(res: any) {
    if (!res.success) {
      this.modalErrorResult(res.msg);
    }
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
  }

}
