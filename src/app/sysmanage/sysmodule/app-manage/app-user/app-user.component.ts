import {Component, OnInit} from '@angular/core';
import {GlobalService} from '@service/global-service.service';
import {HttpUtilService} from '@service/http-util.service';
import {urls} from '@model/url';
import {NzNotificationService} from 'ng-zorro-antd';

import {
  debounceTime, distinctUntilChanged
} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-app-user',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.css']
})
export class AppUserComponent implements OnInit {

  roleData: Array<any> = [
    {roleId: '1', roleName: '1111'},
    {roleId: '2', roleName: '2222'},
    {roleId: '3', roleName: '3333'},
  ]; //角色数据
  userData: Array<any> = []; //用户数据
  // 动态禁用Button
  btnDisable: any = {
    Add: true,
    reset: false,
    Delete: false
  };
  tableHeight: any; //表格高度
  buttonId: string = '';//按钮ID
  selectRoleData: any = {roleId: ''}; // 点击选中角色
  totalPage: number;
  pageSize: number = 30;
  selectedIndex: number = 0; //用户tab序号绑定
  selectedUserData: Array<any> = [];
  listLoading: boolean = false; //用户列表加载状态


  //用户搜索
  searchValue: string;
  // 声明subject类型
  private searchTerms = new Subject<string>();

  // 用户总数

  constructor(private globalSer: GlobalService, private http: HttpUtilService, private nn: NzNotificationService) {
  }

  ngOnInit() {
    this.getRoleData();
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

  // 通过将筛选值推送到searchTerms内，进行节流
  search(term: string): void {
    console.log(999, this.searchValue, term);
    this.searchTerms.next(term);
  }

  btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Add': {
        this.insertList();
      }
        break;
      case 'Delete': {
        this.deleteList();
      }
        break;
      case 'reset':
        this.btnReset();
        break;
    }

  }

  btnReset(): void {
    this.globalSer.tableSelectedChangeEmitter.emit({gridId: 'grid2', checked: false});
  }

  /**
   * 表格高度
   * @param param
   */
  currentTableHeightFun(param: number) {
    this.tableHeight = param;
  }

  /**
   * 角色点击抛出
   * @param param
   */
  listClick(param: any) {
    if (param.roleId === this.selectRoleData.roleId) {
      return;
    }
    // 重置搜索框
    this.searchValue = null;
    this.selectRoleData = param;
    this.selectedIndex ? this.getUser({
      page: 1,
      length: this.pageSize,
      name: this.searchValue,
      roleId: this.selectRoleData.roleId
    }) : this.getHasUser({
      roleId: this.selectRoleData.roleId,
      page: 1,
      length: this.pageSize,
      name: this.searchValue,
    });
  }

  /**
   * 用户管理 tab点击更改
   * @param param
   */
  selectedIndexChange(param: number) {
    // 重置搜索框值
    this.searchValue = null;
    switch (param) {
      case 0: {
        this.btnDisable = {
          Add: true,
          reset: false,
          Delete: false
        };
        this.selectRoleData && this.getHasUser({
          name: this.searchValue,
          roleId: this.selectRoleData.roleId,
          page: 1,
          length: this.pageSize
        });
      }
        break;
      case 1: {
        this.btnDisable = {
          Add: false,
          reset: false,
          Delete: true
        };
        this.getUser({ page: 1, length: this.pageSize, name: this.searchValue, roleId: this.selectRoleData.roleId });
      }
        break;
    }
  }

  /**
   * 获取角色
   */
  getRoleData(): void {
    const url = urls.getAppRoleUser;
    this.http.post(url, {}).then(
      res => {
        if (res.success) {
          this.roleData = res.data.data || [];
          this.selectRoleData = this.roleData[0];
          this.selectRoleData && this.getHasUser({
            name: this.searchValue,
            roleId: this.selectRoleData.roleId,
            page: 1,
            length: this.pageSize
          });

        }
      }
    );
  }

  /**
   * 未选用户获取
   */
  getUser(param: any): void {
    this.listLoading = true;
    const url = urls.getuser;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.listLoading = false;
          this.userData = res.data.data.data || [];
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  /**
   * 已选用户
   */
  getHasUser(param: any): void {
    this.listLoading = true;
    const url = urls.getHasUser;
    this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.listLoading = false;
          this.userData = res.data.data.data || [];
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  /**
   * 添加
   */
  insertList(): void {
    if (this.selectedUserData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作!');
      return;
    }
    const url = urls.insertList;
    const appRoleUserModelList = [];
    this.selectedUserData.forEach(
      res => {
        appRoleUserModelList.push({userId: res.userId});
      }
    );
    this.http.post(url, {roleId: this.selectRoleData.roleId, appRoleUserModelList: appRoleUserModelList}).then(
      res => {
        if (res.success) {
          this.getUser({
            page: 1,
            roleId: this.selectRoleData.roleId,
            length: this.pageSize,
            name: this.searchValue
          });
        }
      }
    );
  }

  /**
   * 删除
   */
  deleteList(): void {
    if (this.selectedUserData.length === 0) {
      this.nn.warning('提示消息', '请选择数据后操作!');
      return;
    }
    const url = urls.approleUserDeleteList;
    const appRoleUserModelList = [];
    this.selectedUserData.forEach(
      res => {
        appRoleUserModelList.push({userId: res.userId});
      }
    );
    this.http.post(url, {roleId: this.selectRoleData.roleId, appRoleUserModelList: appRoleUserModelList}).then(
      res => {
        if (res.success) {
          this.getHasUser({
            roleId: this.selectRoleData.roleId,
            page: 1,
            length: this.pageSize,
            name: this.searchValue
          });
        }
      }
    );
  }

  /**
   * 页数更新事件
   * @param param
   */
  pageChange(param: any) {
    this.selectRoleData && (this.selectedIndex ? this.getUser({
      page: param,
      length: this.pageSize,
      name: this.searchValue,
     roleId: this.selectRoleData.roleId
    }) : this.getHasUser({
      roleId: this.selectRoleData.roleId,
      page: param,
      length: this.pageSize,
      name: this.searchValue
    }));
  }

  /**
   * 页面数据量大小改变
   * @param param
   */
  pageSizeChange(param: any) {
    this.pageSize = param;
    this.selectRoleData &&
    (this.selectedIndex ? this.getUser({
      page: 1,
      length: this.pageSize,
      name: this.searchValue,
      roleId: this.selectRoleData.roleId
    }) : this.getHasUser({
      roleId: this.selectRoleData.roleId,
      page: 1,
      length: this.pageSize,
      name: this.searchValue
    }));
  }

  /**
   * 用户选择数据
   * @param param
   */
  updateDataResult(param: any) {
    this.selectedUserData = param;
  }

  // 清空搜索框内容
  // onNzSelectChange(args: any[]): void{
  //   this.searchValue = null
  //   console.log(args)
  // }
  // 根据输入对列表筛选---0:已选用户；1:未选用户
  ChangeData(): void {
    if (this.selectedIndex === 0) {
      this.getHasUser({
        roleId: this.selectRoleData.roleId,
        page: 1,
        length: this.pageSize,
        name: this.searchValue,
      });
    } else {
      this.getUser({
        page: 1,
        length: this.pageSize,
        name: this.searchValue,
        roleId: this.selectRoleData.roleId
      });
    }
  }
}
