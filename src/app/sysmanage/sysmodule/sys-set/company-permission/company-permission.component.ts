import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {environment} from '@env/environment';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '@model/url';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '@service/userinfo-service.service';

@Component({
  selector: 'app-company-permission',
  templateUrl: './company-permission.component.html',
  styleUrls: ['./company-permission.component.css']
})
export class CompanyPermissionComponent implements OnInit {

  modalFormData: Array<any> = [
    {
      name: '公司ID', eName: 'plateCompanyId', type: 'text', validateCon: '请输入界面ID', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '公司名称', eName: 'companyName', type: 'text', validateCon: '请输入按钮ID', require: true,
      validators: {
        require: true,
      }
    },
    {
      name: '公司管理员ID', eName: 'userId', type: 'text', validateCon: '请输入按钮名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '公司管理员名称', eName: 'name', type: 'text', validateCon: '请选择按钮类型', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    }
  ];

  // 公司用户表头
  listHeader: Array<any> = [
    {colCname: '用户ID', colEname: 'userId'},
    {colCname: '用户名', colEname: 'name'}
  ];

  dataSet: any;//表格里数据
  deleteVisible = false;//删除弹窗显示控制
  modalTitle: string;//删除弹窗标题
  deleteCon: string;//删除弹窗文字内容
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;//表格是否在加载中
  private selectedData: Array<any> = [];
  private status: string;
  private rowid: number;
  searchData: any;  //存储查询的数据
  buttonLoading: boolean = false; // 按钮加载状态

  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;

  // 公司权限新增弹出框
  nzVisible: boolean = false; // 弹出框控制

  // 公司用户弹框
  companyUserVisible: boolean = false; // 弹出框控制
  isMutli: any; // 是否允许多选
  allChecked = false;
  indeterminate = false;
  listData: Array<any> = [];

  // 用户创建弹窗
  userVisible: boolean = false;

  // 公司ID临时存储
  plateCompanyId: string;

  // 创建用户名字
  userName: string;
  loginName: string;

  // 提示信息
  tplModal: NzModalRef;

  typeDataArr: Array<any> = []; // 类型下拉数据
  segmentDate: Array<any> = []; // 业务板块下拉数据

  // 添加公司
  companyForm: FormGroup;
  copymodal: any = {
    data: [],
    searchData: {},
    disabled: true
  };

  constructor(private info: UserinfoService, private router: Router, private httpUtilService: HttpUtilService, private fb: FormBuilder, private nm: NzModalService, private nn: NzNotificationService,) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        {value: '', disabled: true}, validatorOrOpts
        )
      );
    }

    this.companyForm = this.fb.group({
      plateCompanyId: [null, []],
      companyName: [null, [Validators.required]],
      companyType: [null, [Validators.required]],
      segmentId: [null, [Validators.required]],
    });

    this.getStaticFun('GSLX');

    this.getSegment();
  }

  listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data; //查询的数据存储
    this.getListSearch(data);
  }

  // 列表查询数据获取
  getListSearch(data: any, modal = false): void {
    if (!modal) {
      this.listLoading = true;
    } else {
      this.copymodal.loading = true;
    }
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}plateCompany/getPlataCompany`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (!modal) {
          this.listLoading = false;
        } else {
          this.copymodal.loading = false;
        }

        if (res.success) {
          if (!modal) {
            this.dataSet = res.data.data.data;
            // this.pageSize = res.data.data.total;
            this.totalPage = res.data.data.total;
          } else {
            this.copymodal.data = res.data.data.data;
            this.copymodal.disabled = true;
            this.copymodal.totalPage = res.data.data.total;
          }

        }
      }
    );
  }

  buttonId: string;

  // 新增
  add(data: any): void {
    this.buttonId = 'add';
    this.plateCompanyId = this.info.get('USER').companyId;
    this.companyForm.patchValue({plateCompanyId: this.plateCompanyId});
    this.nzVisible = true;
  }

  /**
   * 修改
   * @param data
   */
  update(data: any): void {
    this.buttonId = 'update';
    if (!data || data.data.length !== 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条记录后操作'
      });
      this.destroyTplModal();
      return;
    }
    const formValue = data.data[0];
    this.httpUtilService.post(urls.getCompanySegment, {companyId: formValue.plateCompanyId}).then(
      (res: any) => {
        if (res.success) {
          formValue.segmentId = res.data.data.map(item => item.segmentId);
          this.companyForm.patchValue(formValue);
          this.nzVisible = true;
        }
      }
    );
  }

  //删除
  btnDelete(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作'
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

  // 按钮
  btnClick(data: any) {

    if (data.type.buttonId === 'setCompanyPermissions') {
      // 公司权限设置
      if (!data || data.data.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作'
        });
        this.destroyTplModal();
        return;
      }
      sessionStorage.removeItem('companyPermission');
      sessionStorage.setItem('companyPermission', JSON.stringify(data.data[0]));
      this.router.navigate(['/system/systemSet/companyPermissionAdd']);
      //this.router.navigate(['/system/systemSet/companyPermissionAddNew']);
    }

    if (data.type.buttonId === 'setCompanyAdmin') {
      // 设置公司管理员
      if (!data || data.data.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作'
        });
        this.destroyTplModal();
        return;
      }
      this.modalValidateForm.patchValue(data.data[0]);
      this.modalFormVisible = true;
      this.modalTitle = '公司权限设置  >  设置管理员';
      this.status = 'addAdmin';
    }
    if (data.type.buttonId === 'copyCompanyForm') {
      if (!data || data.data.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作'
        });
        this.destroyTplModal();
        return;
      }
      if (data.data && data.data.length > 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择一条数据进行操作'
        });
        this.destroyTplModal();
        return;
      }
      this.copymodal.visible = true;
      this.copymodal.title = data.type.buttonName;
    }
  }

  /**
   * 复制公司界面
   */
  modalSearch(param: any) {
    this.getListSearch(param, true);
    this.copymodal.searchData = param;
  }

  pageIndex(num: number) {
    this.copymodal.searchData.page = num;
    this.getListSearch(this.copymodal.searchData, true);
  }

  pageSizeFun(num: number) {
    this.copymodal.searchData.page = 1;
    this.copymodal.searchData.length = num;
    this.getListSearch(this.copymodal.searchData, true);
  }

  modalSelected(data: any[]) {
    this.copymodal.disabled = true;
    if (data.length) {
      this.copymodal.disabled = false;
    }
  }

  modalOk() {
    const data1 = this.dataSet.filter(x => x.checked);//
    const data2 = this.copymodal.data.filter(x => x.checked);//都只能单选
    this.copymodal.btnloading = true;
    this.httpUtilService.post(`${environment.baseUrl}companyForm/copyCompanyForm`, {
      companyId: data1[0].companyId,
      copySourceCompanyId: data2[0].companyId
    }).then((res: any) => {
      this.copymodal.btnloading = false;
      if (res.success) {
        this.nn.create('success', '提示消息', res.msg);
        this.listSearch(this.searchData);
        this.copymodal.visible = false;
      }
    });
  }

  // 添加数据
  addData() {
    const formValue = this.companyForm.value;
    formValue.busiSegmentModels = this.segmentDate.filter(item => formValue.segmentId.some(sid => item.segmentId === sid));
    formValue.companyTypeName = this.typeDataArr.find(item => item.value === formValue.companyType).name;

    const params = {
      url: this.buttonId === 'update' ? `${environment.baseUrl}plateCompany/updatePlateCompany` : `${environment.baseUrl}plateCompany/insertPlateCompnay`,
      data: formValue,
      method: 'POST'
    };
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nzVisible = false;
          this.nn.create('success', '提示消息', this.buttonId === 'update' ? '修改成功' : '添加成功');
          this.listSearch(this.searchData);
        }
      }
    );
  }

  // 添加管理员数据
  addAdminData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}plateCompany/setCompanyAdmin`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.modalFormVisible = false;
          this.nn.create('success', '提示消息', '添加成功');
          this.listSearch(this.searchData);
        }
      }
    );
  }


  // 删除数据
  deleteData() {
    const params = {url: '', data: {deleteList: []}, method: 'POST'};
    params.url = `${environment.baseUrl}plateCompany/deletePlateCompany`;
    for (const data of this.selectedData) {
      params.data.deleteList.push(data);
    }
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.nn.create('success', '提示消息', '删除成功');
          this.listSearch(this.searchData);
        }
      }
    );
  }

  // 类型下拉列表
  getStaticFun(valueSetCode: string): void {
    this.httpUtilService.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          this.typeDataArr = res.data.data.data;
        }
      }
    );
  }

  /**
   *  业务板块下拉数据
   * @param valueSetCode
   */
  getSegment(): void {
    this.httpUtilService.post(urls.getSegmentInformation, {}).then(
      (res: any) => {
        if (res.success) {
          this.segmentDate = res.data.data;
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

  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }


  // 数据弹出框取消
  handleCancel(): void {
    this.modalFormVisible = false;
    this.companyUserVisible = false;
  }

  // 数据弹出框取消
  closeResult(): void {
    this.modalValidateForm.reset();
    this.modalFormVisible = false;
    this.companyUserVisible = false;
  }

  // 公司管理员添加
  addAdmin(data) {
    this.plateCompanyId = data;
    this.userVisible = true;
  }

  // 设置公司管理员
  setCompanyAdmin(data: any) {
    this.companyUserVisible = true;
    this.getUserData(data);
  }

  // 公司用户弹窗
  // 公司用户数据获取
  getUserData(data: any) {
    const params = {url: '', data: {companyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}user/getUserNameByCompanyId`;
    params.data.companyId = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listData = res.data.data;
      }
    );
  }

  // 选择逻辑
  refreshStatus(data?: any): void {
    const allChecked = this.listData.every(value => value.checked === true);
    const allUnChecked = this.listData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    if (!this.isMutli) {
      this.listData.map((list: any) => {
        list.checked = false; //单选情况下设置checked;
      });
      data.checked = !data.checked;
    }
  }

  // 全选
  checkAll(value: boolean): void {
    this.listData.forEach(data => {
        if (!data.disabled) {
          data.checked = value;
        }
      }
    );
    this.refreshStatus();
  }

  userOk() {
    let sel_Data;
    for (let item of this.listData) {
      if (item.checked) {
        sel_Data = item;
      }
    }
    this.modalValidateForm.patchValue(sel_Data);
    this.companyUserVisible = false;
  }

  userCancel() {
    this.companyUserVisible = false;
  }

  userClose() {
    this.companyUserVisible = false;
  }

  // 设置管理员确定按钮
  setAdmin() {
    let tempData = this.modalValidateForm.getRawValue();
    tempData.companyId = this.modalValidateForm.getRawValue().plateCompanyId;
    delete tempData.plateCompanyId;
    if (!(tempData.userId && tempData.name)) {
      this.nn.create('warning', '提示消息', '请选择或创建用户后确认');
      return;

    }
    this.addAdminData(tempData);

  }

  // 设置管理员取消
  adminCancel() {
    this.modalValidateForm.reset();
    this.modalFormVisible = false;
  }

  // 添加用户弹窗
  // 添加用户确认
  userOnOk() {
    this.buttonLoading = true;
    if (!this.userName) {
      this.nn.create('warning', '提示消息', '请输入用户名');
      this.buttonLoading = false;
      return;
    }
    if (!this.loginName) {
      this.nn.create('warning', '提示消息', '请输入登录名');
      this.buttonLoading = false;
      return;
    }
    this.userAdd();
  }

  // 添加用户
  userAdd() {
    const params = {url: '', data: {companyId: '', name: '', loginName: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}user/insertAdmin`;
    params.data.companyId = this.plateCompanyId;
    params.data.name = this.userName;
    params.data.loginName = this.loginName;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nn.create('success', '提示消息', '用户添加成功');
          this.modalValidateForm.get('userId').setValue(res.data.data);
          this.modalValidateForm.get('name').setValue(this.userName);
          this.plateCompanyId = '';
          this.userName = '';
          this.loginName = '';
          this.userVisible = false;
          this.buttonLoading = false;
        } else {
          this.buttonLoading = false;
        }
      }
    );
  }

  //添加用户取消
  userAddCancel() {
    this.userVisible = false;
    this.userName = '';
    this.loginName = '';
  }

  // 添加公司确认
  companyOk(): void {
    for (const i in this.companyForm.controls) {
      this.companyForm.controls[i].markAsDirty();
      this.companyForm.controls[i].updateValueAndValidity();
    }
    if ('VALID' === this.companyForm.status) {
      this.addData();

    }
  }

  // 取消
  companyCancel(): void {
    this.nzVisible = false;

  }

  // 关闭后
  companyCloseResult(): void {
    this.companyForm.reset();
  }

  // 弹出框销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

}
