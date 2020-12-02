import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {environment} from '@env/environment';
import {Utils} from '@util/utils';

@Component({
  selector: 'app-company-permission-new',
  templateUrl: './company-permission-new.component.html',
  styleUrls: ['./company-permission-new.component.css']
})
export class CompanyPermissionNewComponent implements OnInit {

  nzSpinning = false; // 加载状态
  // 表头
  userHeaderData: Array<any> = [
    {cName: '界面ID', eName: 'formId'},
    {cName: '界面名称', eName: 'formName'},
    {cName: 'url', eName: 'formUrl'},
    {cName: '备注', eName: 'remark'},
  ];
  private tplModal: NzModalRef;

  // 已选权限数据
  selectedPermissionData: Array<any> = [];
  //selectedPermissionDataTmp: Array<any> = [];

  // 未选权限数据
  unselectedPermissionData: Array<any> = [];
  //unselectedPermissionDataTmp: Array<any> = [];

  // 选中数据
  // 选择的已选权限数据
  selectData1: Array<any> = [];

  //permissionselectData1: Array<any> = [];
  //permissionSelect1: Array<any> = [];
  // 选择的未选权限数据
  selectData2: Array<any> = [];
  // permissionselectData2: Array<any> = [];
  //permissionSelect2: Array<any> = [];

  // 是否全选
  // 已选权限
  //allChecked1: boolean = false;
  // 未选选权限
  //allChecked2: boolean = false;

  // checked不定状态
  // 已选权限
  indeterminate1: boolean = false;
  // 未选选权限
  indeterminate2: boolean = false;

  // 查询输入框
  // 公司ID
  companyId: string;

  // 公司名字
  companyName: string = 'test';

  // 菜单类型
  menuType: string = 'test';

  formName: any;

  validateForm: FormGroup;
  private rowid: number;
  statusName: string;

  // 角色数据
  roleData: Array<any> = [];

  // 面板数据
  //panels: Array<any> = [];

  // 面板缓存
  panelsTmp: Array<any> = [];

  // 当前激活tab
  nzSelectedIndex = 0;

  // 选中权限数据
  //selectData: Array<any> = [];
  searchData = ''; // 搜索触发数据
  // 动态禁用Button
  btnDisable: any = {
    Add: true,
    Reset: false,
    Remove: false
  };
  height2 = '500px';
  height1 = '500px';

  constructor(private fb: FormBuilder,
              private router: Router,
              private nm: NzModalService,
              private http: HttpUtilService,
              private nz: NzNotificationService) {
  }

  ngOnInit() {
    let data = sessionStorage.getItem('companyPermission');
    let tempData;
    if (!data) {
      this.router.navigate(['/system/systemSet/companyPermission']);
    } else {
      tempData = JSON.parse(data);
      this.companyId = tempData.plateCompanyId;
      this.companyName = tempData.companyName;
      this.menuType = tempData.companyType;
      sessionStorage.removeItem('companyPermission');
      this.rowid = tempData.rowid;
      if (tempData.status === 'PTGS10') {
        this.statusName = '停用';
      } else {
        this.statusName = '启用';
      }
      this.nzSpinning = true;
      this.getData1();
      this.getData2();
    }

  }

  // panel 已选 全选逻辑
  panelAllChecked1(data: any, checked: boolean): void {
    if (data.buttonModels && data.buttonModels.length > 0) {
      data.buttonModels.forEach(res => {
          res.checked = data.checked;
        }
      );
      this.refreshStatus1(data);
    } else {
      if (checked) {
        this.selectData1.push(data);
      } else {
        this.selectData1 = this.selectData1.filter(
          value => value.formId !== data.formId
        );
      }
    }

  }

  // panel 未选 全选逻辑
  panelAllChecked2(data: any, checked: boolean): void {
    if (data.buttonModels && data.buttonModels.length > 0) {
      data.buttonModels.forEach(res => {
          res.checked = data.checked;
        }
      );
      this.refreshStatus2(data);
    } else {
      if (checked) {
        this.selectData2.push(data);
      } else {
        this.selectData2 = this.selectData2.filter(
          value => value.formId !== data.formId
        );
      }
    }
    console.log(this.selectData2);
  }

  // 选中逻辑
  // 已选权限选中逻辑
  refreshStatus1(data?: any, button?: any) {
    const allChecked = data.buttonModels.every(value => value.checked === true);
    const allUnChecked = data.buttonModels.every(value => !value.checked);
    data.checked = allChecked;
    data.indeterminate = (!allChecked) && (!allUnChecked);
    if (typeof button === 'undefined') {
      if (data.buttonModels) {
        this.selectData1 = this.selectData1.filter(
          value => {
            return data.buttonModels.every(
              val => {
                return (value.formId !== val.formId) || (value.buttonId !== val.buttonId);
              }
            );
          }
        );

      }
      if (allChecked) {
        data.buttonModels.map(
          (val: any) => {
            this.selectData1.push(val);
          }
        );
      }
    } else {
      if (button.checked) {
        this.selectData1.push(button);
      } else {
        this.selectData1 = this.selectData1.filter(
          value => (value.formId !== button.formId) || (value.buttonId !== button.buttonId)
        );
      }
    }

  }

  // 未选权限 选中逻辑
  refreshStatus2(data?: any, button?: any) {
    const allChecked = data.buttonModels.every(value => value.checked === true);
    const allUnChecked = data.buttonModels.every(value => !value.checked);
    data.checked = allChecked;
    data.indeterminate = (!allChecked) && (!allUnChecked);
    if (typeof button === 'undefined') {
      if (data.buttonModels) {
        this.selectData2 = this.selectData2.filter(
          value => {
            return data.buttonModels.every(
              val => {
                return (value.formId !== val.formId) || (value.buttonId !== val.buttonId);
              }
            );
          }
        );

      }
      if (allChecked) {
        data.buttonModels.map(
          (val: any) => {
            this.selectData2.push(val);
          }
        );
      }
    } else {
      if (button.checked) {
        this.selectData2.push(button);
      } else {
        this.selectData2 = this.selectData2.filter(
          value => (value.formId !== button.formId) || (value.buttonId !== button.buttonId)
        );
      }
    }
  }

  // 添加
  add(): void {

    if (!this.selectData2 || this.selectData2.length == 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择未选权限后进行操作！'
      });
      return;
    }
    const params = {url: '', data: {newWithoutCompanyId: [], companyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}companyForm/updateCompanyFormButton`;
    params.data.newWithoutCompanyId = this.selectData2;
    params.data.companyId = this.companyId;
    this.nzSpinning = true;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '权限添加成功', {nzDuration: 3000});
          this.getData1();
          this.getData2();
          this.selectData2 = [];
          this.selectData1 = [];
        } else {
          this.nz.error('提示信息', '权限添加失败');
        }
      }
    );
  }

  // 移除
  remove(): void {
    if (!this.selectData1 || this.selectData1.length == 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择已选权限后进行操作！'
      });
      return;
    }
    const params = {url: '', data: {newHaveCompanyId: [], companyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}companyForm/updateCompanyFormButton`;
    params.data.newHaveCompanyId = this.selectData1;
    params.data.companyId = this.companyId;
    this.nzSpinning = true;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '权限删除成功', {nzDuration: 3000});
          this.getData1();
          this.getData2();
          this.selectData2 = [];
          this.selectData1 = [];
        } else {
          this.nz.error('提示信息', '权限删除失败');
        }
      }
    );
  }

  // 取消  返回按钮
  cancel(): void {
    sessionStorage.removeItem('companyPermission');
    this.router.navigate(['/system/systemSet/companyPermissionAddNew']);
  }

  // // 重置
  // reset() {
  //   this.panelAllChecked1(false);
  //   this.panelAllChecked2(false);
  // }

  // 数据获取（已选）
  getData1(param?: string) {
    const params = {url: '', data: {resourceName: param, menuType: this.menuType, companyId: ''}, method: 'POST'};
    //params.url = `${environment.baseUrl}form/getFormByCompanyId`;
    // params.url = `${environment.baseUrlSystem}form/getFormButtonByCompanyId`;
    params.url = `${environment.baseUrlSystem}form/getFormButtonByCompanyIdV2`;
    params.data.companyId = this.companyId;
    this.http.request(params).then(
      (res: any) => {
        this.nzSpinning = false;
        if (res.success) {
          // this.selectedPermissionData = res.data.data.haveCompanyId;
          this.selectedPermissionData = res.data.data.withJurisdiction;
          //this.unselectedPermissionData = res.data.data.withoutCompanyId;
        }
      }
    );
  }

  //数据获取（未选）
  getData2(param?: string) {
    const params = {url: '', data: {resourceName: param, menuType: this.menuType, companyId: ''}, method: 'POST'};
    //params.url = `${environment.baseUrl}form/getFormByCompanyId`;
    // params.url = `${environment.baseUrlSystem}form/getFormButtonByCompanyId`;
    params.url = `${environment.baseUrlSystem}form/getFormButtonByCompanyIdV2`;
    params.data.companyId = this.companyId;
    this.http.request(params).then(
      (res: any) => {
        this.nzSpinning = false;
        if (res.success) {
          //this.selectedPermissionData = res.data.data.haveCompanyId;
          // this.unselectedPermissionData = res.data.data.withoutCompanyId;
          this.unselectedPermissionData = res.data.data.withoutJurisdiction;
        }
      }
    );
  }

  // 发送数据
  sendData() {
    const params = {url: '', data: {companyId: '', newHaveCompanyId: [], newWithoutCompanyId: []}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}companyForm/updateCompanyFormButton`;
    params.data.newHaveCompanyId = this.selectedPermissionData;
    params.data.newWithoutCompanyId = this.unselectedPermissionData;
    params.data.companyId = this.companyId;
    this.http.request(params).then(
      (res: any) => {
        this.getData1();
        this.getData2();
        this.nz.remove();
        this.nz.success('提示消息', '保存成功');
      }
    );
  }

  statusChange(): void {
    let status;
    if (!this.selectedPermissionData || this.selectedPermissionData.length == 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '已选权限中存在数据时才可操作！'
      });
      return;
    }
    if (this.statusName === '启用') {
      status = 'PTGS10';
    }
    if (this.statusName === '停用') {
      status = 'PTGS20';
    }
    this.http.post(`${environment.baseUrl}plateCompany/setPlateCompnay`, {rowid: this.rowid, status: status}).then(
      (res: any) => {
        if (res.success) {
          this.statusName = this.statusName === '启用' ? '停用' : '启用';
        }
      }
    );
  }

  //已选权限查询
  selectedPermissionSearch(data) {
    this.getData1(data.value);
    // this.searchData = data.value;
    // if (!this.searchData) {
    //   this.getData1();
    // }
    // this.panelsTmp = this.selectedPermissionData;
    // if (this.searchData) {
    //   this.selectedPermissionData = this.panelsTmp.filter(
    //     (res: any) => {
    //       return res.formName.indexOf(this.searchData) >= 0;
    //     }
    //   );
    // } else {
    //   this.selectedPermissionData = Utils.deepCopy(this.panelsTmp);
    // }
  }

  //未选权限查询
  unselectedPermissionSearch(data) {
    this.getData2(data.value);
    // this.searchData = data.value;
    // if (!this.searchData) {
    //   this.getData2();
    // }
    // this.panelsTmp = this.unselectedPermissionData;
    // if (this.searchData) {
    //   this.unselectedPermissionData = this.panelsTmp.filter(
    //     (res: any) => {
    //       return res.formName.indexOf(this.searchData) >= 0;
    //     }
    //   );
    // } else {
    //   this.unselectedPermissionData = Utils.deepCopy(this.panelsTmp);
    // }
  }

  //table 高度
  tableHeight(data: number, flag: number) {
    if (flag) {
      this.height2 = `${data}px`;
    } else {
      this.height1 = `${data}px`;
    }
  }


}

