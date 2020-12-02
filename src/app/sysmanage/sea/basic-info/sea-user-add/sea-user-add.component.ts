import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { CodesetService } from '../../common/codeset.service';

@Component({
  selector: 'app-sea-user-add',
  templateUrl: './sea-user-add.component.html',
  styleUrls: ['../../common/sea-common.css', './sea-user-add.component.css']
})
export class SeaUserAddComponent implements OnInit {

  page: Page = new Page();
  userPage: Page = new Page();

  // 主界面
  inqu: any = {};
  queryLoading: boolean = false;
  result: Array<any> = [];
  loading: boolean = false;

  // 选择/新增员工弹框
  inquUser: any = {};
  userIsVisible: boolean = false;
  userData: Array<any> = [];
  userLoading: boolean = false;
  insertLoading: boolean = false;

  bizScope: Array<any> = [];

  constructor(private http: HttpUtilService,
    private msg: NzMessageService, 
    private appInfo: UserinfoService,
    private codeset: CodesetService, ) { }

  ngOnInit() {
    this.bizScope = this.codeset.get('bizScope');

    this.query();
  }

  /**
   * 分页查询方法
   */
  query() {
    this.queryLoading = true;
    this.http.post(SEA_URLS.getUser, {...this.inqu, ...this.page.getPagingObj()}).then((res: any) => {
      if (res.success) {
        this.result = res.data.data.data;
        this.page.total = res.data.data.total;

        this.result.forEach(item => item.bizScope = item.bizScope ? item.bizScope.split(",") : []);
      }
      this.queryLoading = false;
    });
  }


  /**
   * 打开员工选择弹框
   */
  openModal(){
    this.userIsVisible = true;
    this.inquUser = {};
    this.queryUser();
  }

  /**
   * c查询员工列表
   */
  queryUser(){
    this.userLoading = true;
    this.http.post(SEA_URLS.getSystemUserList, {queryParameterList: this.getQueryParam(), ...this.userPage.getPagingObj()}).then((res: any) => {
      if (res.success) {
        this.userData = res.data.data.data;
        this.userPage.total = res.data.data.total;
      }
      this.userLoading = false;
    });
  }

  getQueryParam(): Array<any>{
    const param = [];
    if(this.inquUser.userName){
      param.push({"parameter": "name", "query":"包含", "postQuery":"且", "value1": this.inquUser.userName});
    }
    return param;
  }

  /**
   * 保存员工信息
   */
  insertList(){
    const data = this.userData.filter(item => item.checked);
    data.forEach(item => {
      if(item.bizScope && Array.isArray(item.bizScope)){
        item.bizScope = item.bizScope.join(",")
      }
      item.userName = item.name;
    });
    if(data.length < 1){
      this.msg.error("请至少选择一条用户信息！");
      return;
    }
    this.insertLoading = true;
    this.http.post(SEA_URLS.insertListUser, {userBizScopes: data}).then((res: any) => {
      if (res.success) {
        this.msg.success("添加成功");
        this.userIsVisible = false;
        this.query()
      }
      this.insertLoading = false;
    });
  }

  /**
   * 修改保存
   */
  save(data: any){
    this.loading = true;
    data.bizScope = data.bizScope && Array.isArray(data.bizScope)? data.bizScope = data.bizScope.join(",") : data.bizScope = '';
    this.http.post(SEA_URLS.updateUser, {...data}).then((res: any) => {
      if (res.success) {
        this.msg.success("修改成功");
        data.isEditing = false;
        data.bizScope = data.bizScope ? data.bizScope = data.bizScope.split(",") : [];
      }
      this.loading = false;
    });
  }

  /**
   * 删除
   * @param data 
   */
  delete(data: any){
    this.http.post(SEA_URLS.deleteUser, {rowid: data.rowid}).then((res: any) => {
      if (res.success) {
        this.msg.success("删除成功");
        this.query();
      }
    });
  }

  allChecked: boolean = false;
  indeterminate: boolean = false;

  platAllChecked: boolean = false;
  platIndeterminate: boolean = false;

  refreshStatus(type?: string): void {
    if(type === 'user'){
      const allChecked = this.userData.filter(value => !value.disabled).every(value => value.checked === true);
      const allUnChecked = this.userData.filter(value => !value.disabled).every(value => !value.checked);
      this.platAllChecked = allChecked;
      this.platIndeterminate = (!allChecked) && (!allUnChecked);
    }else{
      const allChecked = this.result.filter(value => !value.disabled).every(value => value.checked === true);
      const allUnChecked = this.result.filter(value => !value.disabled).every(value => !value.checked);
      this.allChecked = allChecked;
      this.indeterminate = (!allChecked) && (!allUnChecked);
    }
  }

  checkAll(value: boolean, type?: string): void {
    const data = type === 'user' ? this.userData : this.result;
    data.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus(type);
  }

  /**
   * 下拉框中文值设置
   * @param val 选中值
   * @param data 值存放的对象
   * @param options 下拉数据源
   * @param key 对象key值
   */
  setDisplayName(val: any[], data: any, options: Array<any>, key: string){
    if(!Array.isArray(val)){
      val = [val]
    }
    data[key] = options.filter(opt => val && val.some(item => item == opt.value)).map(item => item.label).join(",");
  }


  /**
    * 修改每页显示数量
    * @param pageSize 
    */
  pageSizeChange(pageSize: any, type?: string) {
    if(type === 'user'){
      this.userPage.pageSize = pageSize;
      this.queryUser();
    }else{
      this.page.pageSize = pageSize;
      this.query();
    }
  }

  /**
   * 修改页码
   * @param pageIndex 
   */
  pageIndexChange(pageIndex: any, type?: string) {
    if(type === 'user'){
      this.userPage.pageIndex = pageIndex;
      this.queryUser();
    }else{
      this.page.pageIndex = pageIndex;
      this.query();
    }
  }

}


