import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.css']
})
export class RolePermissionComponent implements OnInit {

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
  roleHeight:string;
  rightHeight:string;
  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService, private info: UserinfoService) {
  }

  ngOnInit() {
    this.companyId = this.info.get('USER').companyId;
    if (!this.permissions) {
      this.getRoleUserByCompanyId();
    }
  }

  heightFun(data:number,type:number){
    if(type === 0){
      this.roleHeight = `${data}px`;
    }else{
      this.rightHeight = `${data}px`;
    }
  }
  // 根据companyID查询role信息
  getRoleUserByCompanyId(): void {
    const params = {url: '', data: {companyId: '', agencyCompanyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}role/getRoleIdAndName`;
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
  getPermissionsByComIdAndRoleId(): void {
    const params = {
      url: '',
      data: {
        companyId: this.companyId,
        roleId: this.roleSelectData.roleId,
        agencyCompanyId: ''
      },
      method: 'POST'
    };
    params.url = `${environment.baseUrl}formButton/selectRoleButtonWithForm`;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          //console.log(res)
          this.panels = res.data.data.haveJurisdictionList;
          this.panelsTmp = res.data.data.haveJurisdictionList;
          console.log(this.panels)

        }
      }
    );
  }

  //根据公司ID和角色ID查询无权限
  unauthorizedData(): void {
    const params = {
      url: '',
      data: {
        companyId: this.companyId,
        roleId: this.roleSelectData.roleId,
        agencyCompanyId: ''
      },
      method: 'POST'
    };
    params.url = `${environment.baseUrl}roleButton/selectNoJurisdictionList`;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.panels = res.data.data.noJurisdictionList;
          this.panelsTmp = res.data.data.noJurisdictionList;
          console.log(this.panels)
        }
      }
    );
  }

  // 根据rowid移除权限
  removePermissions(): void {
    const params = {url: '', data: {buttonModels: [], agencyCompanyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}roleButton/deleteRoleButton`;
    params.data.buttonModels = this.selectData;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '权限移除成功', {nzDuration: 3000});
          this.getPermissionsByComIdAndRoleId();
        } else {
          this.nz.error('提示信息', '权限移除失败');
        }
      }
    );
  }

  // 添加权限
  addPermissions(): void {
    const params = {url: '', data: {buttonModels: [], agencyCompanyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}roleButton/insertRoleButton`;
    console.log(this.selectData)
    for (const data of this.selectData) {
      data.roleId = this.roleSelectData.roleId;
      console.log(this.roleSelectData.roleId);
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
        } else {
          this.nz.error('提示信息', '权限添加失败');
        }
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
    setTimeout(()=>{this.searchData = ''});
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
  remove(): void {
    this.removePermissions();
  }

  // 添加
  add(): void {
    this.addPermissions();
  }

  // 重置
  reset(): void {
    for (const panel of this.panels) {
      if (panel.buttonModels) {
        panel.buttonModels.forEach(
          (val: any) => {
            val.checked = false;
          }
        );
      }
      panel.checked = false;
      panel.indeterminate = false;

    }
  }

  // 选中逻辑
  refreshStatus(data: any) {
    this.selectData = [];
    const allChecked = data.buttonModels.every(value => value.checked === true);
    console.log(allChecked)
    const allUnChecked = data.buttonModels.every(value => !value.checked);
    console.log(allUnChecked)
    data.checked = allChecked;
    data.indeterminate = (!allChecked) && (!allUnChecked);
    for (const panel of this.panels) {
      if (panel.buttonModels) {
        panel.buttonModels.map(
          (val: any) => {
            if (val.checked) {
              this.selectData.push(val);
              console.log (this.selectData)
            }
          }
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
    console.log(this.searchData)
    console.log(349)
    if (this.searchData) {
      this.panels = this.panelsTmp.filter(
        (res: any) => {
          return res.formName.indexOf(this.searchData) >= 0;
        }
      );
    } else {
      this.panels = Utils.deepCopy(this.panelsTmp);
    }

  }

}
