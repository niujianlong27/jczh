import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
import { messageUrl } from '../../../common/model/messageUrl';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '@service/common.service';

@Component({
  selector: 'app-message-remind',
  templateUrl: './message-remind.component.html',
  styleUrls: ['./message-remind.component.css']
})
export class MessageRemindComponent implements OnInit {
  public topicCodeHeader: Array<any> = [ // 消息主题列表
    { cName: '主题名称', eName: 'topicName' },
    { cName: '发送类型', eName: 'sendTypeName' },
    { cName: '消息种类', eName: 'messageKindName' }
  ];

  public userHeaderData: Array<any> = [ // 用户表头
    { cName: '公司名称', eName: 'companyName' },
    { cName: '用户名', eName: 'name' },
    { cName: '用户类型', eName: 'userTypeName' },
    { cName: '手机号码', eName: 'mobile' },
    { cName: '邮箱', eName: 'email' }
  ];

  public topicData: Array<any> = []; // 角色数据
  public userData: Array<any> = []; // 用户数据
  public nzSelectedIndex = 0; // 当前激活标签页
  private selectData: Array<any> = []; // 选中数据
  public allChecked = false; // 是否全选
  public indeterminate = false; // checked不定状态
  private companyId: string; // 公司ID
  private roleSelectData: any; // 当前点击的role数据
  public btnDisable: any = { // 动态禁用Button
    Add: true,
    Reset: false,
    Remove: false
  };

  public pageSize = 30;
  public topicPageSize = 30;
  public topicTotalPage: Number = 1;
  public totalPage: Number = 1; // 数据总条数
  public listLoading = false; // 用户绑定设置表格是否在加载中
  public listLoading1 = false; // 消息主题表格是否在加载中
  public pageIndex: any = 1;
  public topicPageIndex: any = 1;
  public roleGroupList: Array<any> = []; // 角色列表
  public bindValidateForm: FormGroup; // 已订阅公司列表搜索form
  public unBindValidateForm: FormGroup; // 未订阅公司列表搜索form
  public topicValidateForm: FormGroup; // 主题搜索form
  public roleHeight: string;
  public userHeight: string;
  public permissions: boolean =
    this.info.get('USER').companyType === 'GSLX10' &&
    this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测

  constructor(
    private httpUtilService: HttpUtilService,
    private info: UserinfoService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.companyId = this.info.get('USER').companyId;
    // 主题搜索form初始化
    this.topicValidateForm = this.formBuilder.group({
      searchValue: [null]
    });
    // 已订阅公司搜索form初始化
    this.bindValidateForm = this.formBuilder.group({
      platformRoleBind: [null],
      searchValueBind: [null]
    });
    // 未订阅公司搜索form初始化
    this.unBindValidateForm = this.formBuilder.group({
      platformRoleUnBind: [null],
      searchValueUnBind: [null]
    });
    this.getBizRoles();
    this.getTopics();
  }

  /**
   * 设置主题表/用户表高度
   * @param data 数值
   * @param type 类型（主题表/用户表）
   */
  public heightFun(data: number, type: number): void {
    if (type === 0) {
      this.roleHeight = `${data}px`;
    } else {
      this.userHeight = `${data}px`;
    }
  }

  /**
   * 主题分页
   * @param event 分页数
   */
  public topicPageChange(event: any): void {
    this.topicPageIndex = event;
    this.getTopics();
  }

  /**
   * 用户分页改变
   * @param event 当前分页数
   */
  public pageChange(event: any): void {
    this.pageIndex = event;
    this.ChangeData();
  }

  /**
   * 主题点击触发
   * @param data 选中主题
   */
  public topicClick(data: any): void {
    this.topicData.map(item => (item.isClick = false));
    data.isClick = true;
    this.pageIndex = 1;
    if (this.nzSelectedIndex === 0) {
      this.roleSelectData = data;
      this.userData = [];
      this.getUsersByUrlType(0);
    }
    if (this.nzSelectedIndex === 1) {
      this.roleSelectData = data;
      this.getUsersByUrlType(1);
    }
  }

  /**
   * 获取绑定/未绑定接口所需参数
   */
  private getUserParams(): Object {
    const role = !this.nzSelectedIndex
      ? this.bindValidateForm.get('platformRoleBind').value
      : this.unBindValidateForm.get('platformRoleUnBind').value;
    return {
      companyId: this.companyId,
      messageTopicId: this.roleSelectData.rowid,
      roleId: role ? role.roleId : null,
      roleType: role ? role.roleType : null,
      // 搜索
      queryParameterList: [
        {
          name: !this.nzSelectedIndex
            ? this.bindValidateForm.get('searchValueBind').value
            : this.unBindValidateForm.get('searchValueUnBind').value
        }
      ],
      page: this.pageIndex,
      length: this.pageSize
    };
  }

  /**
   * 针对当前选择主题，用户绑定时的可选性
   * @param data 用户列表
   */
  private analysisUser(data): Array<any> {
    const sendType = this.roleSelectData.sendType;
    const userData = data.map(item => {
      switch (sendType) {
        case 'XXQF10':
          if (
            item.loginAuthz !== 'DLSQ20' &&
            item.loginAuthz !== 'DLSQ40' &&
            item.loginAuthz !== 'DLSQ30'
          ) {
            item.checkStatus = true;
          }
          break;
        case 'XXQF20':
          if (item.loginAuthz !== 'DLSQ30' && item.loginAuthz !== 'DLSQ40') {
            item.checkStatus = true;
          }
          break;
        case 'XXQF30':
          if (!item.mobile) {
            item.checkStatus = true;
          }
          break;
        case 'XXQF40':
          if (!item.mobile) {
            item.checkStatus = true;
          }
          break;
        case 'XXQF50':
          if (!item.email) {
            item.checkStatus = true;
          }
          break;
      }
      return item;
    });
    return userData;
  }

  /**
   * 获取用户列表
   * @param index urlArr下标（0:已绑定用户列表，1:未绑定用户）
   */
  private getUsersByUrlType(index: number): void {
    this.listLoading = true;
    if (!this.roleSelectData) {
      this.common.createTplModal('warning', '当前消息主题不存在！');
      return;
    }
    const urlArr = [messageUrl.topicBindUsers, messageUrl.topicNoBindUsers];
    const params = {
      url: urlArr[index],
      data: this.getUserParams(),
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.userData =
          typeof res.data.data === 'string'
            ? []
            : this.analysisUser(res.data.data.data);
        this.totalPage = res.data.data.total;
        this.checkAll(false); // tab切换重置checkbox
      }
    });
  }

  /**
   * 获取主题列表
   */
  private getTopics(): void {
    this.listLoading1 = true;
    const params = {
      url: messageUrl.messageTopicSearch,
      data: {
        page: this.topicPageIndex,
        length: this.topicPageSize,
        queryParameterList: this.topicValidateForm.get('searchValue').value
          ? [
            {
              formId: '',
              value2: null,
              queryBoxType: 'string',
              value1: this.topicValidateForm.get('searchValue').value,
              postQuery: '且',
              parameter: 'topicName',
              query: '包含',
              name: '主题名称',
              format: '',
              parameter2: 'topicName_between_end',
              checkBox: true
            }
          ]
          : null
      },
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      if (res.success) {
        this.listLoading1 = false;
        this.topicData = res.data.data.data;
        this.topicTotalPage = res.data.data.total;
        if (this.topicData && this.topicData.length !== 0) {
          this.roleSelectData = this.topicData[0];
          this.topicData[0].isClick = true;
          this.ChangeData();
        } else {
          this.userData = [];
        }
      }
    });
  }

  /**
   * 用户移除执行
   */
  private removeUser(): void {
    const params = {
      url: messageUrl.topicUsersUnBind,
      data: {
        subscribeSubjectIdList: [],
        tMessageSubscribe: this.roleSelectData
      },
      method: 'POST'
    };
    for (const data of this.selectData) {
      params.data.subscribeSubjectIdList.push(data);
    }
    this.httpUtilService.request(params).then((res: any) => {
      if (res.success) {
        this.common.createTplModal('success', '用户解绑成功！');
        this.getUsersByUrlType(0);
      } else {
        this.common.createTplModal('error', '用户解绑失败！');
      }
    });
  }

  /**
   * 主题绑定用户执行
   */
  private bindTopics(): void {
    const params = {
      url: messageUrl.topicUsersBind,
      data: {
        subscribeSubjectIdList: [],
        tMessageSubscribe: this.roleSelectData
      },
      method: 'POST'
    };
    for (const data of this.selectData) {
      params.data.subscribeSubjectIdList.push({
        userId: data.userId,
        companyId: data.companyId
      });
    }
    this.httpUtilService.request(params).then((res: any) => {
      if (res.success) {
        this.common.createTplModal('success', '用户主题绑定成功！');
        this.getUsersByUrlType(1);
      } else {
        this.common.createTplModal('error', '用户主题绑定失败！');
      }
    });
  }

  /**
   * 绑定用户选中逻辑
   */
  public refreshStatus(): void {
    const { allChecked, allUnChecked } = {
      allChecked: this.userData.length > 0
        ? this.userData.every(value => value.checked === true)
        : false,
      allUnChecked: this.userData.every(value => !value.checked)
    };
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
    this.selectData = []; // 每次重置
    this.userData.map(
      // 要修改的数据
      (val: any) => {
        if (val.checked) {
          this.selectData.push(val);
        }
      }
    );
  }

  /**
   * 绑定用户全选/反选
   * @param value 布尔值
   */
  public checkAll(value: boolean): void {
    this.userData = this.userData ? this.userData : [];
    this.userData.forEach(data => {
      if (data.checkStatus && this.nzSelectedIndex === 1) {

      } else {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  /**
   * 按钮栏内按钮函数
   * @param data 按钮id
   */
  public btnClick(data: any): void {
    switch (data.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Remove':
        this.remove();
        break;
      case 'Reset':
        this.reset();
        break;
      default:
        this.common.createTplModal('warning', '按钮未绑定方法!');
    }
  }

  /**
   * 主题重置confirm框确认
   */
  private reset(): void {
    this.common.createTplModal('confirm', '此操作将移除当前主题所有绑定用户，是否确认？', () => {
      this.resetTopic();
    });
  }

  /**
   * 主题重置执行
   */
  private resetTopic(): void {
    const params = {
      url: messageUrl.topicUsersUnBind,
      data: {
        subscribeSubjectIdList: [],
        tMessageSubscribe: this.roleSelectData
      },
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      if (res.success) {
        this.common.createTplModal('success', '主题重置成功！');
        this.ChangeData();
      } else {
        this.common.createTplModal('error', '主题重置失败！');
      }
    });
  }

  /**
   * 主题绑定用户前验证
   */
  private btnAdd(): void {
    if (this.selectData.length === 0) {
      this.common.createTplModal('warning', '请选择后操作！');
      return;
    }
    this.bindTopics();
  }

  /**
   * 主题绑定用户移除前确认
   */
  private remove(): void {
    if (this.selectData.length === 0) {
      this.common.createTplModal('warning', '请选择后操作！');
      return;
    }
    this.common.createTplModal('confirm', '是否确认从当前主题上移除选定用户？', () => {
      this.removeUser();
    });
  }

  /**
   * Tab点击触发
   * @param data
   */
  public tabClick(data: any): void {
    setTimeout(() => {
      const { ind, btnStatus } =
        data === 'select'
          ? {
            ind: 0,
            btnStatus: { Add: true, Remove: false, Reset: false }
          }
          : {
            ind: 1,
            btnStatus: { Add: false, Remove: true, Reset: false }
          };
      this.btnDisable = btnStatus;
      this.pageIndex = 1;
      if (this.roleSelectData && this.topicData.length !== 0) {
        this.getUsersByUrlType(ind);
      } else {
        this.userData = [];
      }
    }, 300);
  }

  /**
   * 判断获取已选用户数据还是未选用户数据
   */
  private ChangeData(): void {
    if (this.nzSelectedIndex === 0) {
      this.getUsersByUrlType(0);
    } else {
      this.getUsersByUrlType(1);
    }
  }

  /**
   * 获取公司角色组
   */
  private getBizRoles(): void {
    // 查询公司下app角色组
    this.httpUtilService
      .request({
        url: `${environment.baseUrl}approle/getAppRoleUser`,
        data: {},
        method: 'POST'
      })
      .then((res: any) => {
        if (res.success) {
          // 增加app角色标识
          const roles = res.data.data.map(function(item) {
            if (item) {
              item.roleType = 'app';
            }
            return item;
          });
          this.roleGroupList = [...this.roleGroupList, ...roles];
        }
      });
    // 查询公司下web角色组
    this.httpUtilService
      .request({
        url: `${environment.baseUrl}role/getRoleIdAndName`,
        data: {
          agencyCompanyId: this.companyId,
          companyId: this.companyId
        },
        method: 'POST'
      })
      .then((res: any) => {
        if (res.success) {
          // 增加web角色标识
          const roles = res.data.data.map(function(item) {
            if (item) {
              item.roleType = 'web';
            }
            return item;
          });
          this.roleGroupList = [...this.roleGroupList, ...roles];
        }
      });
  }

  /**
   * 消息主题查询
   */
  public searchTopic(): void {
    for (const i in this.topicValidateForm.controls) {
      if (i) {
        this.topicValidateForm.controls[i].markAsDirty();
        this.topicValidateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.topicValidateForm.status !== 'VALID') {
      return;
    }
    this.topicPageIndex = 1;
    this.getTopics();
  }

  /***
   * 订阅公司筛选查询
   * @param type 筛选已订阅/未订阅用户
   *  */
  public submitForm(type: string): void {
    const { ind, name } =
      type === 'bind'
        ? { ind: 0, name: 'bindValidateForm' }
        : { ind: 1, name: 'unBindValidateForm' };
    for (const i in this[name].controls) {
      if (i) {
        this[name].controls[i].markAsDirty();
        this[name].controls[i].updateValueAndValidity();
      }
    }
    if (this[name].status !== 'VALID') {
      return;
    }
    this.pageIndex = 1;
    this.getUsersByUrlType(ind);
  }
}
