import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
import { messageUrl } from '../../../common/model/messageUrl';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@service/common.service';

@Component({
  selector: 'app-message-subscribe',
  templateUrl: './message-subscribe.component.html',
  styleUrls: ['./message-subscribe.component.css']
})
export class MessageSubscribeComponent implements OnInit {
  public topicCodeHeader: Array<any> = [ // 消息主题表头
    { cName: '主题名称', eName: 'topicName' },
    { cName: '发送类型', eName: 'sendTypeName' },
    { cName: '消息种类', eName: 'messageKindName' }
  ];

  public companyHeaderData: Array<any> = [{ cName: '公司名称', eName: 'companyName' }]; // 公司表头
  public topicData: Array<any> = []; // 角色数据
  public companyData: Array<any> = []; // 公司数据
  public nzSelectedIndex = 0; // 当前激活标签页
  private selectData: Array<any> = []; // 选中数据
  private selectCompanyData: Array<any> = []; // 公司选择数据
  public allChecked = false; // 是否全选
  public allCheckCompany = false;
  public indeterminate = false; // checked状态
  public indeterminateCompany = false; // company - checked不定状态
  public btnDisable: object = { // 动态禁用Button
    Add: true,
    Reset: false,
    Remove: false,
    Copy: false
  };

  public pageSize = 30;
  public totalPage = 1; // 数据总条数
  public listLoading = false; // 用户绑定设置表格是否在加载中
  public listLoading1 = false; // 消息主题表格是否在加载中
  public pageIndex: any = 1;

  public bindValidateForm: FormGroup; // 已订阅公司列表搜索form
  public unBindValidateForm: FormGroup; // 未订阅公司列表搜索form
  public companyValidateForm: FormGroup; // 公司搜索列表form
  public roleHeight: string;
  public userHeight: string;
  public permissions: boolean =
    this.info.get('USER').companyType === 'GSLX10' &&
    this.info.get('USER').companyStatus === 'PTGS10'; // 权限检测

  public modalValidateForm: FormGroup;
  public companys: Array<any> = []; // 复制公司选择列表
  public isLoadingCompany = false;
  public modalFormVisible: Boolean = false;
  private companyPageIndex: any = 1;
  private companySearchValue: any;
  constructor(
    private httpUtilService: HttpUtilService,
    private info: UserinfoService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) { }

  ngOnInit() {
    // 已订阅公司搜索form初始化
    this.bindValidateForm = this.formBuilder.group({
      platformCompanyBind: [null],
      searchValueBind: [null]
    });
    // 未订阅公司搜索form初始化
    this.unBindValidateForm = this.formBuilder.group({
      platformCompanyUnBind: [null],
      searchValueUnBind: [null]
    });
    // 公司搜索form初始化
    this.companyValidateForm = this.formBuilder.group({
      searchValue: [null]
    });
    // 复制框初始化
    this.modalValidateForm = this.formBuilder.group({
      companyName: [null],
      companyId: [null],
      targetCompanys: [null, [Validators.required]]
    });
    this.getTpCompanys();
  }

  /**
   * 表格高度监听函数
   * @param data number
   * @param type number
   */
  public heightFun(data: number, type: number) {
    if (type === 0) {
      this.roleHeight = `${data}px`;
    } else {
      this.userHeight = `${data}px`;
    }
  }

  /***
   * 公司订阅主题筛选查询
   * @param type 筛选已订阅/未订阅表
   *  */
  public submitForm(type: string): void {
    const { name, ind } =
      type === 'bind'
        ? { name: 'bindValidateForm', ind: 0 }
        : { name: 'unBindValidateForm', ind: 1 };
    for (const i in this[name].controls) {
      if (i) {
        this[name].controls[i].markAsDirty();
        this[name].controls[i].updateValueAndValidity();
      }
    }
    if (this[name].status !== 'VALID') {
      return;
    }
    this.getTopicByCompany(ind);
  }

  /**
   * 分页改变
   * @param event
   */
  public pageChange(event: number): void {
    this.pageIndex = event;
    this.selectCompanyData = [];
    this.getTpCompanys();
  }

  /**
   * 获取公司请求参数
   */
  private getCompanyParams(): Object {
    return {
      parameter: this.companyValidateForm.get('searchValue').value,
      page: this.pageIndex,
      length: this.pageSize
    };
  }

  /**
   * 获取公司列表
   */
  private getTpCompanys() {
    this.companyData = [];
    const params = {
      url: messageUrl.topicCompany,
      data: this.getCompanyParams(),
      method: 'POST'
    };
    this.listLoading = true;
    this.httpUtilService.request(params).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.companyData = res.data.data.data ? res.data.data.data : [];
        this.totalPage = res.data.data.total;
        this.checkAllCompany(false);
        this.topicData = [];
      }
    });
  }

  /**
   * 公司搜索
   */
  public searchCompany() {
    for (const i in this.companyValidateForm.controls) {
      if (i) {
        this.companyValidateForm.controls[i].markAsDirty();
        this.companyValidateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.companyValidateForm.status !== 'VALID') {
      return;
    }
    this.pageIndex = 1;
    this.selectCompanyData = [];
    this.getTpCompanys();
  }

  /**
   * 获取绑定/未绑定接口所需参数
   */
  private getUserParams(value?: boolean): Object {
    const _this = this;
    // 解析选中公司
    const getCompanys = function() {
      if (_this.selectCompanyData.length > 0) {
        return _this.selectCompanyData.map(item => {
          return { companyId: item.companyId };
        });
      } else {
        return null;
      }
    };
    // value:用作“复制”功能判断当前公司是否绑有主题
    return {
      messageTopicCompanyModels: getCompanys(),
      parameter: value ? '' : false || !this.nzSelectedIndex
        ? this.bindValidateForm.get('searchValueBind').value
        : this.unBindValidateForm.get('searchValueUnBind').value
    };
  }

  /**
   * 获取公司已订阅/未订阅主题列表
   * @param index urlArr下标（0:已订阅主题，1:未订阅主题）
   * @param callback 用作“复制”功能获取公司已绑主题列表后回调
   */
  private getTopicByCompany(index: number, callback?: Function) {
    this.listLoading1 = true;
    if (this.selectCompanyData.length === 0) {
      this.common.createTplModal('warning', '未选择任何公司！');
      this.topicData = [];
      this.listLoading1 = false;
      return;
    }
    const urlArr = [messageUrl.companyBindList, messageUrl.companyUnBindList];
    const params = {
      url: urlArr[index],
      data: callback ? this.getUserParams(true) : this.getUserParams(),
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        // 回调函数存在，执行回调
        if (callback) {
          callback(res.data.data);
          return;
        }
        if (
          Object.prototype.toString.call(res.data.data) === '[object String]'
        ) {
          this.topicData = [];
          this.checkAll(false);
        } else {
          this.topicData = res.data.data;
          this.checkAll(false);
        }
      }
    });
  }

  /**
   * 已选公司取消订阅
   */
  private removeUser(): void {
    const params = {
      url: messageUrl.topicUnBindCompany,
      data: {
        companyBankList: this.selectCompanyData,
        messageTopicModels: this.selectData
      },
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      if (res.success) {
        this.common.createTplModal('success', '公司解绑成功！');
        this.getTopicByCompany(0);
      } else {
        this.common.createTplModal('error', '公司解绑失败！');
      }
    });
  }

  /**
   * 执行主题订阅
   */
  private bindTopics(): void {
    const params = {
      url: messageUrl.topicBindCompany,
      data: {
        companyBankList: this.selectCompanyData,
        messageTopicModels: this.selectData
      },
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      if (res.success) {
        this.common.createTplModal('success', '公司主题绑定成功！');
        this.getTopicByCompany(1);
      } else {
        this.common.createTplModal('error', '公司主题绑定失败！');
      }
    });
  }

  /**
   *  主题全选
   * @param value 全选/反选
   */
  public checkAll(value: boolean) {
    this.topicData = this.topicData ? this.topicData : [];
    this.topicData.forEach(data => {
      data.checked = value;
    });
    this.refreshStatus();
  }

  /**
   * 选中逻辑--主题
   */
  public refreshStatus() {
    const { allChecked, allUnChecked } = {
      allChecked: this.topicData.length > 0
        ? this.topicData.every(value => value.checked === true)
        : false,
      allUnChecked: this.topicData.every(value => !value.checked)
    };
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
    this.selectData = []; // 每次重置
    this.topicData.map((val: any) => {
      if (val.checked) {
        this.selectData.push(val);
      }
    });
  }

  /**
   * 选中逻辑--公司
   */
  public refreshStatusCompany() {
    const { allChecked, allUnChecked } = {
      allChecked: this.companyData.length > 0
        ? this.companyData.every(value => value.checked === true)
        : false,
      allUnChecked: this.companyData.every(value => !value.checked)
    };
    this.allCheckCompany = allChecked;
    this.indeterminateCompany = !allChecked && !allUnChecked;
    this.selectCompanyData = []; // 每次重置
    this.companyData.map(
      // 要修改的数据
      (val: any) => {
        if (val.checked) {
          this.selectCompanyData.push(val);
        }
      }
    );
    // 未选中公司时清空主题表
    if (this.selectCompanyData.length !== 0) {
      if (this.nzSelectedIndex === 0) {
        this.getTopicByCompany(0);
      } else {
        this.getTopicByCompany(1);
      }
    } else {
      this.topicData = [];
    }
  }

  /**
   * 全选-公司
   * @param value
   */
  public checkAllCompany(value: boolean) {
    this.companyData = this.companyData ? this.companyData : [];
    this.companyData.forEach(data => {
      data.checked = value;
    });
    this.refreshStatusCompany();
  }

  /**
   * 按钮栏
   * @param data
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
      case 'Copy':
        this.copyCompany();
        break;
      default:
        this.common.createTplModal('warning', '按钮未绑定方法!');
    }
  }

  /**
   * 重置公司主题
   */
  private reset(): void {
    if (this.selectCompanyData.length === 0) {
      this.common.createTplModal('warning', '请至少选择一家公司进行操作！');
      return;
    }
    this.common.createTplModal('confirm', '此操作将移除当前所选公司下绑定的所有主题，是否确认？', () => {
      this.resetTopic();
    });
  }

  /**
   * 执行公司重置
   */
  private resetTopic() {
    const params = {
      url: messageUrl.topicResetCompany,
      data: {
        companyBankList: this.selectCompanyData,
        messageTopicModels: []
      },
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      if (res.success) {
        this.common.createTplModal('success', '公司重置成功！');
        if (this.nzSelectedIndex === 0) {
          this.getTopicByCompany(0);
        } else {
          this.getTopicByCompany(1);
        }
      } else {
        this.common.createTplModal('error', '公司重置失败！');
      }
    });
  }

  /**
   * 公司绑定主题
   */
  private btnAdd() {
    if (this.selectCompanyData.length === 0 || this.selectData.length === 0) {
      this.common.createTplModal('warning', '请至少选择一家订阅公司和一条订阅主题后进行操作！');
      return;
    }
    this.bindTopics();
  }

  /**
   * 公司移除主题
   */
  private remove() {
    if (this.selectCompanyData.length === 0 || this.selectData.length === 0) {
      this.common.createTplModal('warning', '请至少选择一家订阅公司和一条订阅主题后进行操作！');
      return;
    }
    this.common.createTplModal('confirm', '是否确认从当前主题上移除选定公司？', () => {
      this.removeUser();
    });
  }

  /**
   * Tab点击触发
   * @param data
   */
  public tabClick(data: any) {
    setTimeout(() => {
      const { btnStatus, ind } =
        data === 'select'
          ? {
            btnStatus: { Add: true, Remove: false, Reset: false, Copy: false },
            ind: 0
          }
          : {
            btnStatus: { Add: false, Remove: true, Reset: false, Copy: true },
            ind: 1
          };
      this.btnDisable = btnStatus;
      if (this.selectCompanyData) {
        this.getTopicByCompany(ind);
      } else {
        this.topicData = [];
      }
    }, 300);
  }

  /**
   * 获取复制目标公司列表
   */
  private getTargetCompnys(): void {
    const params = {
      url: messageUrl.topicCompany,
      data: {
        length: 30,
        page: this.companyPageIndex,
        parameter: this.companySearchValue
      },
      method: 'POST'
    };
    const companyId = this.selectCompanyData[0].companyId;
    this.httpUtilService.request(params).then((res: any) => {
      const data = res.data.data.data
        ? res.data.data.data.filter(item => item.companyId !== companyId)
        : [];
      this.isLoadingCompany = false;
      if (this.companys.length > 0) {
        this.companys = [...this.companys, ...data];
      } else {
        this.companys = [...[], ...data];
      }
    });
  }

  /**
   * 搜索-复制目标公司列表
   * @param value
   */
  public SearchChange(value: any): void {
    this.isLoadingCompany = true;
    this.companySearchValue = value;
    this.companyPageIndex = 1;
    this.companys = [];
    this.getTargetCompnys();
  }

  /**
   * 复制目标公司列表滚动到底部回调
   */
  public scrollToBottom(): void {
    this.companyPageIndex++;
    this.isLoadingCompany = true;
    this.getTargetCompnys();
  }

  /**
   * 显示复制弹框
   */
  private copyCompany(): void {
    const _this = this;
    if (this.selectCompanyData.length !== 1) {
      this.common.createTplModal('warning', '请先选择一家公司进行复制！');
    } else {
      this.getTopicByCompany(0, function(data) {
        if (
          Object.prototype.toString.call(data) === '[object String]'
        ) {
          _this.common.createTplModal('warning', '当前公司不存在已绑定主题，请重新选择！');
        } else {
          _this.modalFormVisible = true;
          _this.modalValidateForm.patchValue(_this.selectCompanyData[0]);
          _this.SearchChange(null);
        }
      });
    }
  }

  /**
   * 弹框关闭
   */
  public closeResult(): void {
    this.modalValidateForm.reset();
  }

  /**
   * 弹框取消按钮
   */
  public handleCancel(): void {
    this.modalFormVisible = false;
  }

  /**
   * 复制框form验证
   */
  private validateCopyForm(): Boolean {
    for (const i in this.modalValidateForm.controls) {
      if (i) {
        this.modalValidateForm.controls[i].markAsDirty();
        this.modalValidateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.modalValidateForm.status !== 'VALID') {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 复制弹框确认按钮
   */
  public handleOk(): void {
    if (this.validateCopyForm()) {
      const params = {
        url: messageUrl.topicCopy,
        data: {
          companyBankList: this.selectCompanyData,
          messageTopicModels: [],
          targetCompanys: this.modalValidateForm.get('targetCompanys').value
        },
        method: 'POST'
      };
      this.httpUtilService.request(params).then((res: any) => {
        if (res.success) {
          this.modalFormVisible = false;
          this.common.createTplModal('success', '主题复制成功！');
        } else {
          this.common.createTplModal('error', '主题复制失败！');
        }
      });
    }
  }

  /**
   * 主题是否可全选
   * @param data
   */
  public canCheckAll(data: any): Boolean {
    if (data.length > 0) {
      return data.some(item => item.math === 'XF');
    } else {
      return false;
    }
  }
}
