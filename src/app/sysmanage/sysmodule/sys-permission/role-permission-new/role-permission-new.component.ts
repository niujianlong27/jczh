import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '@service/userinfo-service.service';
import {environment} from '@env/environment';
import {Utils} from '@util/utils';

@Component({
  selector: 'app-role-permission-new',
  templateUrl: './role-permission-new.component.html',
  styleUrls: ['./role-permission-new.component.css']
})
export class RolePermissionNewComponent implements OnInit {

  // 角色表头
  roleHeaderData: Array<any> = [
    {cName: '角色ID', eName: 'roleId'},
    {cName: '角色名称', eName: 'roleName'},
  ];

  // 角色数据
  roleData: Array<any> = [];

  // 当前点击的role数据
  roleSelectData;

  // 面板数据
  panels: Array<any> = [];

  // 面板缓存
  panelsTmp: Array<any> = [];

  // 当前激活tab
  nzSelectedIndex = 0;

  // 选中权限数据
  selectData: Array<any> = [];

  // 动态禁用Button
  btnDisable: any = {
    Add: true,
    Reset: false,
    Remove: false
  };

  companyId: string;

  searchData = ''; // 搜索触发数据

  selectedCompany: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测
  roleHeight: string;
  rightHeight: string;

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService, private info: UserinfoService) {
  }

  ngOnInit() {
    this.companyId = this.info.get('USER').companyId;
    if (!this.permissions) {
      this.getRoleUserByCompanyId();
    }
  }

  heightFun(data: number, type: number) {
    if (type === 0) {
      this.roleHeight = `${data}px`;
    } else {
      this.rightHeight = `${data}px`;
    }
  }

  // 根据companyID查询role信息
  getRoleUserByCompanyId(): void {
    const params = {url: '', data: {companyId: '', agencyCompanyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}role/getRoleIdAndName`;
    params.data.companyId = this.companyId;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }

    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.roleData = res.data.data;
          if (this.roleData && this.roleData.length !== 0) {
            this.roleSelectData = this.roleData[0];
            this.roleData[0].isClick = true;
            if (this.nzSelectedIndex === 0) {
              this.getPermissionsByComIdAndRoleId();
            } else {
              this.unauthorizedData();
            }

          } else {
            this.panels = [];
          }
        }
      }
    );
  }

  // 根据公司ID和角色ID查询有权限
  getPermissionsByComIdAndRoleId(name?: string): void {
    const params = {
      url: '',
      data: {
        companyId: this.companyId,
        roleId: this.roleSelectData.roleId,
        agencyCompanyId: '',
        resourceName: name
      },
      method: 'POST'
    };
    // params.url = `${environment.baseUrlSystem}formButton/selectRoleButtonWithForm`;
    params.url = `${environment.baseUrlSystem}roleButton/selectRoleButtonWithFormV2`;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.panels = res.data.data.withJurisdiction;
          this.panelsTmp = res.data.data.withJurisdiction;
          this.selectData = [];
        } else {
          this.panels = [];
          this.panelsTmp = [];
        }

      }
    );
  }

  //根据公司ID和角色ID查询无权限
  unauthorizedData(name?: string): void {
    const params = {
      url: '',
      data: {
        companyId: this.companyId,
        roleId: this.roleSelectData.roleId,
        agencyCompanyId: '',
        resourceName: name
      },
      method: 'POST'
    };
    // params.url = `${environment.baseUrlSystem}roleButton/selectNoJurisdictionListNew`;
    params.url = `${environment.baseUrlSystem}roleButton/selectNoJurisdictionListNewV2`;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectData = [];
          this.panels = res.data.data.withoutJurisdiction;
          this.panelsTmp = res.data.data.withoutJurisdiction;
        } else {
          this.panels = [];
          this.panelsTmp = [];
        }
      }
    );
  }

  // 根据rowid移除权限
  remove(): void {
    const params = {buttonModels: [], agencyCompanyId: ''};
    const url = `${environment.baseUrlSystem}roleButton/deleteRoleButton`;
    if (this.selectData.length === 0) {
      this.nz.warning('提示消息', '请选择数据后操作！');
      return;
    }
    this.selectData.forEach(
      value => value.menuModel = null
    );
    console.log(this.selectData);
    params.buttonModels = this.selectData;
    if (this.permissions && this.selectedCompany) {
      params.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.agencyCompanyId;
    }
    this.http.post(url, params).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '权限移除成功', {nzDuration: 3000});
          this.getPermissionsByComIdAndRoleId();
        }
        // else {
        //   this.nz.error('提示信息', '权限移除失败');
        // }
      }
    );
  }

  // 添加权限
  add(): void {
    const params = {url: '', data: {buttonModels: [], agencyCompanyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrlSystem}roleButton/insertRoleButton`;
    if (this.selectData.length === 0) {
      this.nz.warning('提示消息', '请选择数据后操作！');
      return;
    }
    this.selectData.forEach(
      value => value.menuModel = null
    );
    for (const data of this.selectData) {
      data.roleId = this.roleSelectData.roleId;
      params.data.buttonModels.push(data);
    }

    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '权限添加成功', {nzDuration: 3000});
          this.unauthorizedData();
        }
        // else {
        //   this.nz.error('提示信息', '权限添加失败');
        // }
      }
    );
  }

  // 角色点击触发
  roleClick(data: any): void {
    this.roleData.filter(data => data.isClick = false);
    data.isClick = true;
    this.roleSelectData = data;
    if (this.nzSelectedIndex === 0) {
      this.getPermissionsByComIdAndRoleId();
    }
    if (this.nzSelectedIndex === 1) {
      this.unauthorizedData();
    }

  }

  // Tab点击触发
  tabClick(data: any): void {
    setTimeout(() => {
      this.searchData = '';
      this.panels = [];
    },);
    if (data === 'haveJurisdiction') {
      this.btnDisable = {
        Add: true,
        Remove: false,
        Reset: false
      };
      if (this.roleSelectData && this.roleData.length !== 0) {
        this.getPermissionsByComIdAndRoleId();
      } else {
        this.panels = [];
        return;
      }
    }

    if (data === 'noJurisdiction') {
      this.btnDisable = {
        Add: false,
        Remove: true,
        Reset: false,
      };
      if (this.roleSelectData && this.roleData.length !== 0) {
        this.unauthorizedData();
      } else {
        this.panels = [];
        return;
      }
    }
  }

  // 按钮触发事件
  btnClick(data: any): void {
    switch (data.buttonId) {
      case 'Add': {
        this.add();
      }
        break;
      case 'Remove': {
        this.remove();
      }
        break;
      case 'Reset': {
        this.reset();
      }
        break;

    }
  }

  // 移除
  // remove(): void {
  //   this.removePermissions();
  // }

  // 添加
  // add(): void {
  //   this.addPermissions();
  // }

  // 重置
  reset(): void {
    for (const panel of this.selectData) {
      if (panel.menuModel) {
        panel.menuModel.buttonModels.forEach(
          (val: any) => {
            val.checked = false;
          }
        );
      }
      panel.menuModel.checked = false;
      panel.menuModel.indeterminate = false;
    }
    this.selectData = [];
  }

  // 选中逻辑
  refreshStatus(data: any, button?: any) {
    const allChecked = data.buttonModels.every(value => value.checked === true);
    const allUnChecked = data.buttonModels.every(value => !value.checked);
    data.checked = allChecked;
    data.indeterminate = (!allChecked) && (!allUnChecked);
    if (typeof button === 'undefined') {
      if (data.buttonModels) {
        this.selectData = this.selectData.filter(
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
            val.menuModel = data;
            this.selectData.push(val);
          }
        );
      }
    } else {
      if (button.checked) {
        button.menuModel = data;
        this.selectData.push(button);
      } else {
        this.selectData = this.selectData.filter(
          value => (value.formId !== button.formId) || (value.buttonId !== button.buttonId)
        );
      }
    }
  }

  // panel全选逻辑
  panelAllChecked(data: any): void {
    data.buttonModels.forEach(res => {
        res.checked = data.checked;
      }
    );
    this.refreshStatus(data);
  }

  // 公司数据获取
  companyData(data: any): void {
    this.companyId = data.selectData.companyId;
    this.getRoleUserByCompanyId();
    this.roleSelectData = null;
    this.panels = [];
  }

  companyChange(): void {
    this.getRoleUserByCompanyId();
  }

  search() {
    switch (this.nzSelectedIndex) {
      case 0: {
        this.getPermissionsByComIdAndRoleId(this.searchData);
      }
        break;
      case 1: {
        this.unauthorizedData(this.searchData);
      }
        break;
    }

  }

}
