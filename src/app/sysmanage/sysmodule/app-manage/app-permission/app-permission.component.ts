import {Component, OnInit} from '@angular/core';
import {GlobalService} from '@service/global-service.service';
import {urls} from '@model/url';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '@util/utils';

@Component({
  selector: 'app-app-permission',
  templateUrl: './app-permission.component.html',
  styleUrls: ['./app-permission.component.css']
})
export class AppPermissionComponent implements OnInit {

  listLoading1: boolean = false;
  listLoading2: boolean = false;
  listLoading3: boolean = false;
  roleData: Array<any> = []; //角色数据
  unselectedPermissionData: Array<any> = []; //未选权限数据
  unselectedPermissionSelectedData: Array<any> = []; //未选权限数据
  selectedPermissionData: Array<any> = []; //已选权限数据
  selectedPermissionSelectedData: Array<any> = []; //已选权限选择数据
  buttonId: string = ''; //按钮ID
  selectRoleData: any = {roleId: ''}; // 点击选中角色
  tableHeight: any = 481; //表格高度
  areaId: string = 'SSQY10';
  //已选未选权限页面数据
  totalPage1: number = 0;
  totalPage2: number = 0;
  pageSize1: number = 30;
  pageSize2: number = 30;
  //按钮禁用
  btnDisable: any = {
    Ares1: true,
    Ares2: false,
    Ares3: false,
    Ares4: false,
    Ares5: false,
    Ares6: false,
    Ares7: false,
  };
  nzSpinning: boolean = false; // 加载状态

  constructor(private globalSer: GlobalService, private http: HttpUtilService, private nn: NzNotificationService, private nzMess: NzMessageService,) {
  }

  ngOnInit() {
    this.getRoleData();
  }

  /**
   * 按钮点击事件
   * @param data
   */
  btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Ares1': {
        this.btnDisable = {
          Ares1: false,
          Ares2: true,
          Ares3: true,
          Ares4: true,
          Ares5: true,
          Ares6: true,
          Ares7: true,
        };
        setTimeout(() => {
          this.btnDisable = {
            Ares1: true,
            Ares2: false,
            Ares3: false,
            Ares4: false,
            Ares5: false,
            Ares6: false,
            Ares7: false,
          };
        }, 2001);

        this.areaId = 'SSQY10';
        if (this.selectRoleData) {
          this.appRoleForm({page: 1, length: this.pageSize1});
          this.roleForm({page: 1, length: this.pageSize2});
        }
      }
        break;
      case 'Ares2': {
        this.btnDisable = {
          Ares1: true,
          Ares2: false,
          Ares3: true,
          Ares4: true,
          Ares5: true,
          Ares6: true,
          Ares7: true,
        };
        setTimeout(() => {
          this.btnDisable = {
            Ares1: false,
            Ares2: true,
            Ares3: false,
            Ares4: false,
            Ares5: false,
            Ares6: false,
            Ares7: false,
          };
        }, 2001);
        this.areaId = 'SSQY20';
        if (this.selectRoleData) {
          this.appRoleForm({page: 1, length: this.pageSize1});
          this.roleForm({page: 1, length: this.pageSize2});
        }
      }
        break;
      case 'Ares3': {
        this.btnDisable = {
          Ares1: true,
          Ares2: true,
          Ares3: false,
          Ares4: true,
          Ares5: true,
          Ares6: true,
          Ares7: true,
        };
        setTimeout(() => {
          this.btnDisable = {
            Ares1: false,
            Ares2: false,
            Ares3: true,
            Ares4: false,
            Ares5: false,
            Ares6: false,
            Ares7: false,
          };
        }, 2001);
        this.areaId = 'SSQY30';
        if (this.selectRoleData) {
          this.appRoleForm({page: 1, length: this.pageSize1});
          this.roleForm({page: 1, length: this.pageSize2});
        }
      }
        break;
      case 'Ares4': {
        this.btnDisable = {
          Ares1: true,
          Ares2: true,
          Ares3: true,
          Ares4: false,
          Ares5: true,
          Ares6: true,
          Ares7: true,
        };
        setTimeout(() => {
          this.btnDisable = {
            Ares1: false,
            Ares2: false,
            Ares3: false,
            Ares4: true,
            Ares5: false,
            Ares6: false,
            Ares7: false,
          };
        }, 2001);
        this.areaId = 'SSQY40';
        if (this.selectRoleData) {
          this.appRoleForm({page: 1, length: this.pageSize1});
          this.roleForm({page: 1, length: this.pageSize2});
        }
      }
        break;
      case 'Ares5': {
        this.btnDisable = {
          Ares1: true,
          Ares2: true,
          Ares3: true,
          Ares4: true,
          Ares5: false,
          Ares6: true,
          Ares7: true,
        };
        setTimeout(() => {
          this.btnDisable = {
            Ares1: false,
            Ares2: false,
            Ares3: false,
            Ares4: false,
            Ares5: true,
            Ares6: false,
            Ares7: false,
          };
        }, 2001);
        this.areaId = 'SSQY50';
        if (this.selectRoleData) {
          this.appRoleForm({page: 1, length: this.pageSize1});
          this.roleForm({page: 1, length: this.pageSize2});
        }
      }
        break;
      case 'Ares6': {
        this.btnDisable = {
          Ares1: true,
          Ares2: true,
          Ares3: true,
          Ares4: true,
          Ares5: true,
          Ares6: false,
          Ares7: true,
        };
        setTimeout(() => {
          this.btnDisable = {
            Ares1: false,
            Ares2: false,
            Ares3: false,
            Ares4: false,
            Ares5: false,
            Ares6: true,
            Ares7: false,
          };
        }, 2001);
        this.areaId = 'SSQY60';
        if (this.selectRoleData) {
          this.appRoleForm({page: 1, length: this.pageSize1});
          this.roleForm({page: 1, length: this.pageSize2});
        }
      }
        break;
      case 'Ares7': {
        this.btnDisable = {
          Ares1: true,
          Ares2: true,
          Ares3: true,
          Ares4: true,
          Ares5: true,
          Ares6: true,
          Ares7: false,
        };
        setTimeout(() => {
          this.btnDisable = {
            Ares1: false,
            Ares2: false,
            Ares3: false,
            Ares4: false,
            Ares5: false,
            Ares6: false,
            Ares7: true,
          };
        }, 2001);
        this.areaId = 'SSQY70';
        if (this.selectRoleData) {
          this.appRoleForm({page: 1, length: this.pageSize1});
          this.roleForm({page: 1, length: this.pageSize2});
        }
      }
        break;
      case 'Add':
        this.insertRoleFormList();
        break;
      case 'Remove':
        this.deleteRoleList();
        break;
      case 'Reset':
        this.globalSer.tableSelectedChangeEmitter.emit({gridId: 'grid2', checked: false});
        break;
    }

  }

  /**
   * 角色点击抛出
   * @param param
   */
  listClick(param: any) {
    if (param.roleId === this.selectRoleData.roleId) {
      return;
    }
    this.selectRoleData = param;
    if (this.selectRoleData.roleId) {
      this.appRoleForm({page: 1, length: this.pageSize1});
      this.roleForm({page: 1, length: this.pageSize2});
    }
  }

  /**
   * 表格高度
   * @param param
   */
  currentTableHeightFun(param: number) {
    this.tableHeight = param;
  }

  /**
   * 获取角色
   */
  getRoleData(): void {
    const url = urls.getAppRoleUser;
    this.listLoading1 = true;
    this.http.post(url, {}).then(
      res => {
        if (res.success) {
          this.listLoading1 = false;
          this.roleData = res.data.data || [];
          this.selectRoleData = this.roleData[0];
          if (this.selectRoleData) {
            this.appRoleForm({page: 1, length: this.pageSize1});
            this.roleForm({page: 1, length: this.pageSize2});
          }

        }
      }
    );
  }

  /**
   * 已选权限
   */
  appRoleForm(param: any): void {
    this.listLoading2 = true;
    const url = urls.appRoleForm;
    const tmp = {roleId: this.selectRoleData.roleId, areaId: this.areaId};
    this.http.post(url, {...tmp, ...param}).then(
      res => {
        if (res.success) {
          this.listLoading2 = false;
          this.selectedPermissionData = res.data.data.data || [];
          this.totalPage1 = res.data.data.total;
        }
      }
    );
  }

  /**
   * 未选权限
   */
  roleForm(param: any): void {
    this.listLoading3 = true;
    const url = urls.roleForm;
    const tmp = {roleId: this.selectRoleData.roleId, areaId: this.areaId};
    this.http.post(url, {...tmp, ...param}).then(
      res => {
        if (res.success) {
          this.listLoading3 = false;
          this.unselectedPermissionData = res.data.data.data || [];
          this.totalPage2 = res.data.data.total;
        }
      }
    );
  }

  /**
   * 添加
   */
  insertRoleFormList(): void {
    this.nzSpinning = true;
    const url = urls.insertRoleFormList;
    const tmp = {roleId: this.selectRoleData.roleId, areaId: this.areaId, appRoleFormModelList: []};
    let sortId = this.selectedPermissionData.length === 0 ? 0 : Utils.add(this.selectedPermissionData[this.selectedPermissionData.length - 1].sortId, 1);
    this.unselectedPermissionSelectedData.forEach(
      res => {
        tmp.appRoleFormModelList.push({formId: res.formId, sortId: sortId++});

      }
    );
    this.http.post(url, tmp).then(
      res => {
        this.nzSpinning = false;
        if (res.success) {
          this.unselectedPermissionSelectedData = [];
          this.appRoleForm({page: 1, length: this.pageSize1});
          this.roleForm({page: 1, length: this.pageSize2});
          this.nn.success('提示消息', '添加成功！');
        }
      }
    );

  }

  /**
   * 移除
   */
  deleteRoleList(): void {
    this.nzSpinning = true;
    const url = urls.deleteRoleList;
    const tmp = {roleId: this.selectRoleData.roleId, appRoleFormModelList: []};
    this.selectedPermissionSelectedData.forEach(
      res => {
        tmp.appRoleFormModelList.push({rowid: res.rowid, formId: res.formId});
      }
    );
    this.http.post(url, tmp).then(
      res => {
        this.nzSpinning = false;
        if (res.success) {
          this.selectedPermissionSelectedData = [];
          this.appRoleForm({page: 1, length: this.pageSize1});
          this.roleForm({page: 1, length: this.pageSize2});
          this.nn.success('提示消息', '移除成功！');
        }
      }
    );

  }

  /**
   * 已选权限 选择
   * @param param
   */
  updateDataResult1(param: any) {
    this.selectedPermissionSelectedData = param;
  }

  /**
   * 未选权限 选择
   * @param param
   */
  updateDataResult2(param: any) {
    this.unselectedPermissionSelectedData = param;
  }

  /**
   * 已选权限 页数更改
   * @param param
   */
  pageIndexEmit1(param: any) {
    this.selectRoleData && this.appRoleForm({
      page: param,
      length: this.pageSize1
    });
  }

  /**
   * 已选权限 页量更改
   * @param param
   */
  pageSizeEmit1(param: any) {
    this.pageSize1 = param;
    this.selectRoleData && this.appRoleForm({
      page: 1,
      length: this.pageSize1
    });
  }

  /**
   * 未选权限 页数更改
   * @param param
   */
  pageIndexEmit2(param: any) {
    this.selectRoleData && this.roleForm({
      page: param,
      length: this.pageSize2
    });
  }

  /**
   * 未选权限 页量更改
   * @param param
   */
  pageSizeEmit2(param: any) {
    this.pageSize2 = param;
    this.selectRoleData && this.roleForm({
      page: 1,
      length: this.pageSize2
    });
  }

  /**
   * 移动
   */
  // move(param): void {
  //   let data = {
  //     ...this.selectRoleData,
  //     ...this.selectedPermissionSelectedData[0],
  //     move: param
  //   };
  //   this.http.post(urls.moveFoem, data).then(
  //     res => {
  //       if (res.success) {
  //         this.selectedPermissionSelectedData = [];
  //         // this.nn.success('提示消息', '移动成功!');
  //         this.appRoleForm({page: 1, length: this.pageSize1});
  //       }
  //     }
  //   );
  // }
  move(data: any) {
    this.listLoading2 = true;
    let sortId1 = '';
    let sortId2 = '';
    const i = this.selectedPermissionData.indexOf(this.selectedPermissionSelectedData[0]);

    if (data == 0) {
      let count: any;
      if (i === 0) {
        this.nzMess.error('已经是第一条数据了');
        this.listLoading2 = false;
        return;
      } else {
        count = this.selectedPermissionData[i];
        sortId1 = this.selectedPermissionData[i].sortId;
        sortId2 = this.selectedPermissionData[i - 1].sortId;
        this.selectedPermissionData[i] = this.selectedPermissionData[i - 1];
        this.selectedPermissionData[i - 1] = count;
      }
      this.selectedPermissionData = [...this.selectedPermissionData];
    } else {
      let count: any;
      if (i === (this.selectedPermissionData.length) - 1) {
        this.nzMess.error('已经是最后一条数据了');
        this.listLoading2 = false;
        return;
      } else {
        count = this.selectedPermissionData[i];
        sortId1 = this.selectedPermissionData[i].sortId;
        sortId2 = this.selectedPermissionData[i + 1].sortId;
        this.selectedPermissionData[i] = this.selectedPermissionData[i + 1];
        this.selectedPermissionData[i + 1] = count;
      }
      this.selectedPermissionData = [...this.selectedPermissionData];
    }
    let url = urls.move;
    let param: any = [];
    if (data === 0) {
      param.push(this.selectedPermissionData[this.selectedPermissionData.indexOf(this.selectedPermissionSelectedData[0])]);
      param.push(this.selectedPermissionData[this.selectedPermissionData.indexOf(this.selectedPermissionSelectedData[0]) + 1]);
    } else {
      param.push(this.selectedPermissionData[this.selectedPermissionData.indexOf(this.selectedPermissionSelectedData[0])]);
      param.push(this.selectedPermissionData[this.selectedPermissionData.indexOf(this.selectedPermissionSelectedData[0]) - 1]);
    }
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        if (data === 0) {
          this.selectedPermissionData[i].sortId = sortId1;
          this.selectedPermissionData[i - 1].sortId = sortId2;
        } else {
          this.selectedPermissionData[i].sortId = sortId1;
          this.selectedPermissionData[i + 1].sortId = sortId2;
        }
        this.listLoading2 = false;
      }
    });
  }

}
