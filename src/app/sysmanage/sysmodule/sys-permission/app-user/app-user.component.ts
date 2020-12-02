import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {environment} from '../../../../../environments/environment';
import {urls} from '../../../../common/model/url';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-app-user',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.css']
})
export class AppUserComponent implements OnInit {


  // 用户表头
  userHeaderData: Array<any> = [
    {cName: '用户ID', eName: 'userId'},
    {cName: '用户名字', eName: 'name'},
  ];

  // app表头
  appHeaderData: Array<any> = [
    {cName: '界面ID', eName: 'formId'},
    {cName: '界面名称', eName: 'formName'},
    // {cName: '用户名', eName: 'name'},
    // {cName: '用户类型', eName: 'userType'},
  ];

  // app数据
  appData: Array<any> = [];
  havePermission: Array<any> = [];
  noPermission: Array<any> = [];

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
  // 当前点击的user数据
  userSelectData;
  // 提示信息
  tplModal: NzModalRef;
  // 动态禁用Button
  btnDisable: any = {
    Add: true,
    Reset: false,
    Remove: false
  };

  selectedCompany: any;
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测

  constructor(private httpUtilService: HttpUtilService, private nm: NzModalService, private nn: NzNotificationService, private info: UserinfoService) {
  }

  ngOnInit() {
    // this.companyId = this.info.get('USER').companyId;
    // if (!this.permissions) {
    //   this.getRoleUserByCompanyId();
    // }
    this.selectUser();
  }


  // 角色点击触发
  userClick(data: any) {
    if (data.isClick) {
      return;
    }
    this.userData.filter(data => data.isClick = false);
    data.isClick = true;
    this.appData = [];
    this.userSelectData = data;
    this.getUserForm();
    // this.getUserFromBK();


  }

  // APP查询用户
  selectUser(): void {
    const param = {companyId:''};
    if (this.selectedCompany) {
      param.companyId = this.selectedCompany;
    } else {
      delete param.companyId
    }
    this.httpUtilService.post(urls.selectAppUserForm, param).then(
      (res: any) => {
        if (res.success) {
          this.userData = res.data.data || [];
        }
      }
    );
  }

  // APP查询用户已有界面
  getUserForm(): void {
    this.httpUtilService.post(urls.getUserForm, {userId: this.userSelectData.userId}).then(
      (res: any) => {
        if (res.success) {
          this.havePermission = res.data.data || [];

          this.httpUtilService.post(urls.getUserFromBK, {userId: this.userSelectData.userId}).then(
            (res: any) => {
              if (res.success) {
                this.noPermission = res.data.data || [];

                if (this.nzSelectedIndex === 0) {
                  // this.getUserByUserIdAndroleId();
                  this.appData = this.havePermission;
                  /*setTimeout(() => {
                    }
                  );*/
                }

                if (this.nzSelectedIndex === 1) {
                  // this.getUserByCompanyID();
                  this.appData = this.noPermission;
                  /*setTimeout(() => {
                      this.appData = this.noPermission;
                    }
                  );*/
                }
              }
            }
          );
        }
      }
    );
  }

  // APP查询用户没有的界面
  getUserFromBK(): void {
    this.httpUtilService.post(urls.getUserFromBK, {userId: this.userSelectData.userId}).then(
      (res: any) => {
        if (res.success) {
          this.noPermission = res.data.data || [];
        }
      }
    );
  }

  // APP更新用户FormId
  updateAppUserForm(data: any): void {

    const params: Array<any> = [];
    for (const datum of data) {
      const param = {
        companyId: this.userSelectData.companyId,
        userId: this.userSelectData.userId,
        formId: ''
      };
      param.formId = datum.formId;
      params.push(param);
    }

    this.httpUtilService.post(urls.updateAppUserForm, {userId: this.userSelectData.userId, tAppUserFormModels: params}).then(
      (res: any) => {
        if (res.success) {
          console.log('成功');
          this.nn.success('提示消息', '更新权限成功！');
          this.userClick(this.userSelectData);
          this.getUserForm();
          this.reset();
        }
      }
    );
  }

  // 通过roleID 和公司ID查询已选择用户列表
  getUserByUserIdAndroleId() {
    const params = {
      url: '',
      data: {
        companyId: this.companyId,
        roleId: this.userSelectData.roleId,
        agencyCompanyId: ''
      }, method: 'POST'
    };
    params.url = `${environment.baseUrl}roleUser/getRoleUser`;
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

  // 根据公司ID查询未选择用户
  getUserByCompanyID() {
    const params = {url: '', data: {companyId: '', agencyCompanyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}roleUser/getNoRoleUser`;
    params.data.companyId = this.companyId;
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
    const params = {url: '', data: {companyId: '', agencyCompanyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}role/getRoleIdAndName`;
    params.data.companyId = this.companyId;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.userData = res.data.data;

          if (this.userData && this.userData.length !== 0) {
            this.userSelectData = this.userData[0];
            this.userData[0].isClick = true;
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
    for (const data of this.selectData) {
      params.data.tRoleUserModels.push(data);
    }
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
    for (const data of this.selectData) {
      data.companyId = this.companyId;
      data.roleId = this.userSelectData.roleId;
      params.data.tRoleUserModels.push(data);
    }
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
      if (this.userSelectData && this.userData.length !== 0) {
        // this.appData = this.havePermission;
        setTimeout(
          () => {
            this.appData = this.havePermission;
            this.reset();
          }
        );
      } else {
        this.appData = [];
        return;
      }
    }

    if (data === 'notToChoose') {
      this.btnDisable = {
        Add: false,
        Remove: true,
        Reset: false
      };
      if (this.userSelectData && this.userData.length !== 0) {
        // this.appData = this.noPermission;
        setTimeout(
          () => {
            this.appData = this.noPermission;
            this.reset();
          }
        );
      } else {
        this.appData = [];
        return;
      }
    }

  }

  // 选中逻辑
  refreshStatus() {
    let allChecked: boolean, allUnChecked: boolean;
    allChecked = this.appData.filter(value => !value.disabled).every(value => value.checked === true);
    allUnChecked = this.appData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);

    this.selectData = []; // 每次重置
    this.appData.map( // 要修改的数据
      (val: any) => {
        if (val.checked) {
          this.selectData.push(val);
        }
      }
    );

  }

  // 全选
  checkAll(value: boolean) {
    this.appData = this.appData ? this.appData : [];
    this.appData.forEach(data => {
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
    const tmp: Array<any> = Utils.deepCopy(this.havePermission);
    for (const selectDatum of this.selectData) {
      tmp.push(selectDatum);
    }

    this.updateAppUserForm(tmp);
    // this.addPermissions();
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
    // this.removeUser();
    // this.havePermission
    let tmp;
    // for (const selectDatum of this.selectData) {
    //   const indexOf = this.havePermission.indexOf(selectDatum);
    //   tmp = this.havePermission.slice(indexOf, 1);
    // }
    tmp = this.havePermission.filter(
      a => {
        return this.selectData.every(
          b => {
            return a.formId !== b.formId;
          }
        );
      }
    );
    // console.log(tmp);
    this.updateAppUserForm(tmp);
  }


  // 弹出框销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  companyChange(): void {
    // this.getRoleUserByCompanyId();
    this.selectUser();
  }

}
