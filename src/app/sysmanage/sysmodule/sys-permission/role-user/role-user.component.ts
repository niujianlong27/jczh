import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';

import {
  debounceTime, distinctUntilChanged
} from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-role-user',
  templateUrl: './role-user.component.html',
  styleUrls: ['./role-user.component.css']
})
export class RoleUserComponent implements OnInit {

  // 角色表头
  roleHeaderData: Array<any> = [
    {cName: '角色ID', eName: 'roleId'},
    {cName: '角色名称', eName: 'roleName'},
  ];

  // 用户表头
  userHeaderData: Array<any> = [
    {cName: '用户ID', eName: 'userId'},
    {cName: '用户登录名', eName: 'loginName'},
    {cName: '用户名', eName: 'name'},
    {cName: '用户类型', eName: 'userTypeName'},
  ];

  // 角色数据
  roleData: Array<any> = [];

  // 用户数据
  userData: Array<any> = [];

  // 当前激活标签页
  nzSelectedIndex = 0;
  // 选中数据
  selectData: Array<any> = [];
  // 是否全选
  allChecked = false;
  // checked不定状态
  indeterminate = false;
  // 公司ID
  companyId: string;
  // 当前点击的role数据
  roleSelectData;
  // 提示信息
  tplModal: NzModalRef;
  // 动态禁用Button
  btnDisable: any = {
    Add: true,
    Reset: false,
    Remove: false
  };

  // 用户搜索
  searchValue: string;
  // 声明subject类型
  private searchTerms = new Subject<string>();

  selectedCompany: any;
  roleHeight: string;
  userHeight:string;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测

  constructor(private httpUtilService: HttpUtilService, private nm: NzModalService, private nn: NzNotificationService, private info: UserinfoService) {
  }

  ngOnInit() {
    this.companyId = this.info.get('USER').companyId;
    if (!this.permissions) {
      this.getRoleUserByCompanyId();
    }
    // 管道加入Rxjs操作符-
    this.searchTerms.pipe(
      // 在传出最终字符串之前，debounceTime(300) 将会等待，直到新增字符串的事件暂停了 300 毫秒。
      // 你实际发起请求的间隔永远不会小于 300ms。
      debounceTime(500),
      // 确保只在过滤条件变化时才发送请求
      distinctUntilChanged()
    ).subscribe(
      // 执行函数
      term => this.ChangeData()
    );
  }
  heightFun(data: number, type: number) {
     if (type === 0) {
        this.roleHeight = `${data}px`;
     } else {
        this.userHeight = `${data}px`;
     }
  }
  // 通过将筛选值推送到searchTerms内，进行节流
  search(term: string): void {
    this.searchTerms.next(term);
  }
  // 角色点击触发
  roleClick(data: any) {
    this.roleData.filter(data => data.isClick = false);
    data.isClick = true;
    // 重置搜索框
    this.searchValue = null;
    if (this.nzSelectedIndex === 0) {
      this.roleSelectData = data;
      this.userData = [];
      this.getUserByUserIdAndroleId();
    }

    if (this.nzSelectedIndex === 1) {
      this.roleSelectData = data;
      this.getUserByCompanyID();
    }

  }

  // 通过roleID 和公司ID查询已选择用户列表
  getUserByUserIdAndroleId() {
    const params = {
      url: '',
      data: {
        companyId: this.companyId,
        roleId: this.roleSelectData.roleId,
        agencyCompanyId: '',
        // 搜索
        name: this.searchValue
      }, method: 'POST'
    };
    params.url = `${environment.baseUrl}roleUser/getRoleUser`;
    //params.url = `${environment.baseUrlSystem}roleUser/getRoleUser`;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
      //console.log(this.selectedCompany)
    } else {
      delete params.data.agencyCompanyId;
    }
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.userData = res.data.data;
        }
      }
    );
  }

  // 根据公司ID查询未选择用户
  getUserByCompanyID() {
    const params = {url: '', data: {companyId: '', agencyCompanyId: '', name: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}roleUser/getNoRoleUser`;
    //params.url = `${environment.baseUrlSystem}roleUser/getNoRoleUser`;
    params.data.companyId = this.companyId;
    params.data.name = this.searchValue;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.userData = res.data.data;
        }
      }
    );
  }

  // 根据companyID查询role信息
  getRoleUserByCompanyId() {
    const params = {url: '', data: {companyId: '', agencyCompanyId: '', name: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}role/getRoleIdAndName`;
    //params.url = `${environment.baseUrlSystem}role/getRoleIdAndName`;
    params.data.companyId = this.companyId;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.roleData = res.data.data;

          if (this.roleData && this.roleData.length !== 0) {
            this.roleSelectData = this.roleData[0];
            this.roleData[0].isClick = true;
            if (this.nzSelectedIndex === 0) {
              this.getUserByUserIdAndroleId();
            } else {
              this.getUserByCompanyID();
            }
          } else {
            this.userData = [];
          }

        }
      }
    );
  }

  // 已选用户删除
  removeUser(): void {
    const params = {url: '', data: {'tRoleUserModels': []}, method: 'POST'};
    params.url = `${environment.baseUrl}roleUser/deleteRoleUser`;
    //params.url = `${environment.baseUrlSystem}roleUser/deleteRoleUser`;
    for (const data of this.selectData) {
      params.data.tRoleUserModels.push(data);
    }
    console.log(params.data);
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nn.create('success', '提示信息', '用户移除成功！', {nzDuration: 3000});
          this.getUserByUserIdAndroleId();
          this.reset();
        } else {
          this.nn.error('提示信息', '用户移除失败！');
        }
      }
    );
  }

  // 未选用户添加权限
  addPermissions(): void {
    const params = {url: '', data: {'tRoleUserModels': []}, method: 'POST'};
    params.url = `${environment.baseUrl}roleUser/addRoleUser`;
    //params.url = `${environment.baseUrlSystem}roleUser/addRoleUser`;
    for (const data of this.selectData) {
      //data.companyId = this.companyId;
      data.companyId = this.selectedCompany;
      data.roleId = this.roleSelectData.roleId;
      params.data.tRoleUserModels.push(data);
    }
    //console.log (params)
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nn.create('success', '提示信息', '用户权限添加成功！', {nzDuration: 3000});
          this.getUserByCompanyID();
          this.reset();
        } else {
          this.nn.error('提示信息', '用户权限添加失败！');
        }
      }
    );
  }

  // Tab点击触发
  tabClick(data: any) {
    if (data === 'select') {
      this.btnDisable = {
        Add: true,
        Remove: false,
        Reset: false
      };
      if (this.roleSelectData && this.roleData.length !== 0) {
        this.getUserByUserIdAndroleId();
      } else {
        this.userData = [];
        return;
      }
    }

    if (data === 'notToChoose') {
      this.btnDisable = {
        Add: false,
        Remove: true,
        Reset: false
      };
      if (this.roleSelectData && this.roleData.length !== 0) {
        this.getUserByCompanyID();
      } else {
        this.userData = [];
        return;
      }
    }

  }

  // 选中逻辑
  refreshStatus() {
    let allChecked: boolean, allUnChecked: boolean;
    allChecked = this.userData.filter(value => !value.disabled).every(value => value.checked === true);
    allUnChecked = this.userData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);

    this.selectData = []; // 每次重置
    this.userData.map( // 要修改的数据
      (val: any) => {
        if (val.checked) {
          this.selectData.push(val);
        }
      }
    );
  }

  // 全选
  checkAll(value: boolean) {
    this.userData = this.userData ? this.userData : [];
    this.userData.forEach(data => {
        data.checked = value;
      }
    );
    this.refreshStatus();
  }

  // 按钮
  btnClick(data: any): void {
    switch (data.buttonId) {
      case 'Add': {
        this.btnAdd();
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

  // 重置
  reset() {
    this.checkAll(false);
  }

  // 点击添加
  btnAdd() {
    if (this.selectData.length === 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作'
      });
      this.destroyTplModal();
      return;
    }
    this.addPermissions();
  }

  // 移除
  remove() {
    if (this.selectData.length === 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作'
      });
      this.destroyTplModal();
      return;
    }
    this.removeUser();
  }


  // 弹出框销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  companyChange(): void {
    this.getRoleUserByCompanyId();
  }
  // 清空搜索框内容
  onNzSelectChange(args: any[]): void {
    this.searchValue = null;
    console.log(args);
  }
  // 根据输入对列表筛选---0:已选用户；1:未选用户
  ChangeData(): void {
    if (this.nzSelectedIndex === 0) {
      this.getUserByUserIdAndroleId();
    } else {
      this.getUserByCompanyID();
    }
  }
}
