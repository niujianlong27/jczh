import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {urls} from "../../../../common/model/url";
import {environment} from "../../../../../environments/environment";
import {TableFormComponent} from "../../../../components/table-form/table-form.component";
import {GlobalService} from "../../../../common/services/global-service.service";

@Component({
  selector: 'app-team-user-manage',
  templateUrl: './team-user-manage.component.html',
  styleUrls: ['./team-user-manage.component.css']
})
export class TeamUserManageComponent implements OnInit {


  confimCon: string;
  private tplModal: NzModalRef; // 弹窗相关
  modalTitle: string; // 提示框标题
  selectedLength: any = 0;

  // 用户数据
  userData: Array<any> = []
  selectUserData: Array<any> = [];
  nzSelectedIndex: number = 0;
  roleClickData: any = {}; //点击列表项数据
  tabClickname:string = 'select';
  // formId: string = '';
  pageSize: number = 30;//条数
  pageSize2: number = 30;//条数
  pageSize3: number = 30;//条数
  totalPage: number;//数据总条数
  selecttotalPage: number;
  notselecttotalPage: number;
  islistLoading: boolean = false;// 表单加载状态
  grid2listLoading: boolean = false;// 表单加载状态
  grid3listLoading: boolean = false;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选择用户勾选中数据
  notselectedData: Array<any> = []; //未选用户勾选数据
  tempSearchParam: any;  //列表页码存储
  companyId: string; // 公司id
  btnDisable: any = {};
  @ViewChild(TableFormComponent) child: TableFormComponent;

  constructor(private globalSer: GlobalService,private http: HttpUtilService, private fb: FormBuilder, private nzModal: NzModalService, private nzMess: NzNotificationService, private info: UserinfoService) {
  }


  ngOnInit() {
    this.companyId = this.info.get('USER').companyId;
    this.listSearch({page: 1, length: this.pageSize});
  }

  listSearch(data: any) {  //
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.islistLoading = true;

    this.getListSearch(data);
  }

  getListSearch(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.teamGetPage;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.islistLoading = false;
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total;
        }
      }
    );
  }
  select(data:any){
    data[0] && this.roleClick(data[0]);
    if (data.length < 1) {
      this.selectUserData = [];
      this. userData = [];
    }


  };
  // 点击列表触发
  roleClick(data: any) {
    this.roleClickData = data;
    this.dataSet.forEach(item => {
      item.checked = false;
      if (item.teamId === data.teamId) {
        item.checked = !item.checked;
      }
    });
    if (this.nzSelectedIndex === 0) { // 获取已选择的数据
      this.getUserSelect({page: 1, length: this.pageSize2});
    } else if (this.nzSelectedIndex === 1) {   //获取未选择的数据
      this.getUserNotSelect({page: 1, length: this.pageSize3});
    }

  };


  // 查询未选择用户
  getUserNotSelect(Data: any) {
    let data = {};
    data['teamId'] = this.roleClickData.teamId;
    data['companyId'] = this.companyId;
    data['page'] = Data.page || 1;
    data['length'] = Data.length || this.pageSize3;
    this.http.post(urls.getnotTeamUser, data).then(res => {
      if (res.success) {
        this.grid3listLoading = false;
        this.userData = res.data.data.data;
        this.notselecttotalPage = res.data.data.data && res.data.data.total;
      }

    })
  }

  // 查询已选择用户列表
  getUserSelect(Data: any) {
    let data = {};
    data['teamId'] = this.roleClickData.teamId;
    data['page'] = Data.page || 1;
    data['length'] = Data.length || this.pageSize2;
    this.http.post(urls.getTeamUser, data).then(res => {
      if (res.success) {
        this.grid2listLoading = false;
        this.selectUserData = res.data.data.data;
        this.selecttotalPage = res.data.data.data && res.data.data.total;
      }

    })
  }


  // 按钮区按钮点击事件统一处理
  btnClick(button: any) {
    switch (button.buttonId) {
      case "Add" :
        this.add();
        break;
      case "Remove":
        this.remove();
        break;
      case "Reset":
        this.resert();
        break;
      default:
        this.nzMess.error('提示消息', '按钮未绑定方法！');
    }
  };

  add() {
    if (this.notselectedData.length === 0) {
      this.tplModal = this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择未选用户列表后操作'
      });
      this.destroyTplModal();
      return;
    }
    this.addPermissions();
  }

  // 未选用户添加权限
  addPermissions(): void {
    const params = {url: '', data: {'teamUsers': []}, method: 'POST'};
    params.url = urls.insertListTeamUser;
    let arr = this.notselectedData.map(item => {
      return {
        teamId: this.roleClickData.teamId,
        remark: this.roleClickData.remark,
        userId: item.userId
      }
    });
    params.data.teamUsers = [...arr];
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nzMess.create('success', '提示信息', '用户添加成功！', {nzDuration: 3000});
          this.getUserNotSelect({page: 1, length: this.pageSize3});
          // this.reset();
        } else {
          // this.nzMess.error('提示信息', '用户添加失败！');
        }
      }
    );

  }

  remove() {
    if (this.selectedData.length === 0) {
      this.tplModal = this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择已选用户列表后操作'
      });
      this.destroyTplModal();
      return;
    }
    this.removeUser();
  }

  // 已选用户删除
  removeUser(): void {

    const params = {url: '', data: {'teamUsers': []}, method: 'POST'};
    params.url = urls.deleteListTeamUser;
    let arr = this.selectedData.map(item => {
      return {rowid: item.rowid}
    });
    params.data.teamUsers = [...arr];

    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.nzMess.create('success', '提示信息', '用户删除成功！', {nzDuration: 3000});
          this.getUserSelect({page: 1, length: this.pageSize2});
        } else {
          // this.nzMess.error('提示信息', '用户移除失败！');
        }
      }
    );
  }

  resert() {  //重置
    if (this.tabClickname === 'select') {
      this.globalSer.tableSelectedChangeEmitter.emit({gridId: 'grid2', checked: false});
    }else if (this.tabClickname === 'notToChoose') {
      this.globalSer.tableSelectedChangeEmitter.emit({gridId: 'grid3', checked: false});

    }

  }


  selectData(data: any) { // 选择列表数据多选框选择
    this.selectedData = data;
  }

  notToChooseData(data: any) {  //未选用户勾选数据
    this.notselectedData = data;
  }

  tabClick(data: any) {  //切换选择未选择
    this.selectedData = [];
    this.notselectedData = [];
    this.tabClickname = data;
    if (data === 'select') {

      if (this.roleClickData.teamId && this.dataSet.length !== 0) {
        this.getUserSelect({page: 1, length: this.pageSize2});
      } else {
        this.selectUserData = [];
        return;
      }
    } else if (data === 'notToChoose') {

      if (this.roleClickData.teamId && this.dataSet.length !== 0) {
        this.getUserNotSelect({page: 1, length: this.pageSize3});
      } else {
        this.userData = [];
        return;
      }
    }

  };

  handleCancel(): void {   //弹窗取消
    this.tplModal.destroy();
  }

  // 弹出框销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 2000);
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getUserSelect({page: page, length: this.pageSize2});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getUserSelect({page: 1, length: this.pageSize2});
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getUserNotSelect({page: page, length: this.pageSize3});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize3 = pageSize;
    this.getUserNotSelect({page: 1, length: this.pageSize3});
  }


}

