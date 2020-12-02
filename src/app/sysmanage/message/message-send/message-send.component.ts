import { Component, OnInit, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { messageUrl } from '../../../common/model/messageUrl';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
import { format, differenceInCalendarDays } from 'date-fns';
import {
  analysisString,
  regParams
} from '../../../common/validators/validator';
import { CommonService } from '@service/common.service';

@Component({
  selector: 'app-message-send',
  templateUrl: './message-send.component.html',
  styleUrls: ['./message-send.component.css'],
  providers: [UserinfoService]
})
export class MessageSendComponent implements OnInit {
  public topicCodeList: Array<any> = []; // 消息主题列表
  public modalValidateForm: FormGroup;
  public userValidateForm: FormGroup;
  public pageSize: Number = 30; // 条数
  public totalPage: number; // 数据总条数
  public selectLoading = false; // 接收人加载loading显示
  public selectIndex = 1; // 接收人分页
  private topicId: any; // 选择的消息主题rowID
  private sendType: any; // 选择消息主题的发送类型
  private plateCompanyId: any; // 主题归属公司id
  public paramRequired: Boolean = true; // 消息参数是否必填
  private paramsValidator: {}; // 消息参数验证用
  public receiveDisabled: Boolean = true; // 接收人是否可选
  private receiversIdList: Array<any> = []; // 接收人列表接口用
  public receiversModalTitle: String = '接收人选择';
  public receiversModalVisible: Boolean = false;
  private receiveCompanyId: Array<any> = []; // 接收公司集合
  public userKind: Boolean = false;
  public selectHeight: string;
  public selectedHeight: string;
  public selectCompanyHeight: string;
  public usersSelectData: Array<any> = [];
  public usersSelectedData: Array<any> = [];
  public listLoadingCompany: Boolean = false;
  public indeterminate: Boolean = false;
  public indeterminateSelectCompany: Boolean = false;
  public allChecked: Boolean = false;
  public allCheckedCompany: Boolean = false;
  public companySelectHeader: Array<any> = [ // 已绑定公司列表
    { cName: '公司名称', eName: 'companyName' }
  ];

  public userSelectHeader: Array<any> = [ // 用户选择表头
    { cName: '公司名称', eName: 'companyName' },
    { cName: '角色名称', eName: 'roleName' },
    { cName: '用户类型', eName: 'userTypeName' },
    { cName: '用户名', eName: 'name' }
  ];

  public userSelectedHeader: Array<any> = [ // 用户已选择表头
    { cName: '公司名称', eName: 'companyName' },
    { cName: '角色名称', eName: 'roleName' },
    { cName: '用户类型', eName: 'userTypeName' },
    { cName: '用户名', eName: 'name' },
    { cName: '删除', eName: 'delete' }
  ];

  private selectData: Array<any> = [];
  private selectedCompanys: Array<any> = [];
  public companys: Array<any> = [];
  public isLoadingTopic = false;
  private topicPageIndex: any = 1;
  private topicSearchValue: any;
  public btnText: String = '接收人未选择';
  constructor(
    private httpUtilService: HttpUtilService,
    private fb: FormBuilder,
    private common: CommonService
  ) { }

  /**
   * 计划时间验证
   */
  private planTimeValite = (control: FormControl): { [s: string]: boolean } => {
    if (control.value) {
      if (control.value.getTime() < new Date().getTime()) {
        return { noExpiration: true, error: true };
      }
      if (this.modalValidateForm.controls.expirationTime.value) {
        if (
          control.value.getTime() >
          this.modalValidateForm.controls.expirationTime.value.getTime()
        ) {
          return { hasExpiration: true, error: true };
        }
      }
    }
    return {};
  }

  /**
   * 消息过期时间验证
   */
  private expirationTimeValite = (control: FormControl): { [s: string]: boolean } => {
    if (control.value) {
      if (control.value.getTime() < new Date().getTime()) {
        return { noPlan: true, error: true };
      }
      if (!this.modalValidateForm.controls.sendPlanTime.value) {
      } else {
        if (
          control.value.getTime() <
          this.modalValidateForm.controls.sendPlanTime.value.getTime()
        ) {
          return { hasPlan: true, error: true };
        }
      }
    }
    return {};
  }

  /**
   * 消息参数完整性验证
   */
  private bodyParamValite = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else {
      if (regParams(control.value, this.paramsValidator)) {
        return {
          complete: true,
          error: true
        };
      }
      return {};
    }
  }

  ngOnInit() {
    this.getTopicList();
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({
      topicCode: [null, [Validators.required]],
      receiveIdList: [null],
      sendPlanTime: [null, [this.planTimeValite]],
      expirationTime: [null, [this.expirationTimeValite]],
      messageTitle: [null, [Validators.required]],
      messageBody: [null, [Validators.required]],
      messageParam: [null, [Validators.required, this.bodyParamValite]],
      remark: [null]
    });

    this.userValidateForm = this.fb.group({
      companyName: [null],
      roleName: [null],
      userType: [null],
      name: [null]
    });
  }

  /**
   * 获取时间可选范围
   * @param start 开始数
   * @param end 结束数
   */
  private timeRange(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  /**
   * 发送计划日期不可选择范围定义
   */
  public disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  /**
   * 消息过期日期不可选择范围定义
   */
  public disabledDate1 = (current: Date): boolean => {
    let today: any;
    // 发送计划时间存在，则不能早于计划发送日期
    if (this.modalValidateForm.controls.sendPlanTime.value) {
      today = this.modalValidateForm.controls.sendPlanTime.value;
    } else {
      today = new Date();
    }
    return differenceInCalendarDays(current, today) < 0;
  }

  /**
   * 发送计划日期不可选择范围
   */
  public disabledTime = (current: Date): object => {
    const dateTime = current || new Date();
    const planValue = new Date(JSON.parse(JSON.stringify(dateTime)));
    const date = new Date();
    let hour = 0;
    let min = 0;
    let sec = 0;
    if (planValue.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)) {
      hour = new Date().getHours();
      min = hour !== dateTime.getHours() ? 0 : new Date().getMinutes();
      sec = hour !== dateTime.getHours() || min !== dateTime.getMinutes() ? 0 : new Date().getSeconds();
    }
    return {
      nzDisabledHours: () => this.timeRange(0, hour),
      nzDisabledMinutes: () => this.timeRange(0, min),
      nzDisabledSeconds: () => this.timeRange(0, sec)
    };
  }

  /**
   * 消息过期时间不可选择范围定义
   */
  public disabledTime1 = (current: Date): object => {
    const sendPlanTime = this.modalValidateForm.controls.sendPlanTime.value;
    const dateTime = current || (sendPlanTime || new Date());
    const planValue = new Date(JSON.parse(JSON.stringify(dateTime)));
    const date = sendPlanTime ? new Date(JSON.parse(JSON.stringify(sendPlanTime))) : new Date();
    const dateValue = sendPlanTime ? new Date(JSON.parse(JSON.stringify(sendPlanTime))) : new Date();
    let hour = 0;
    let min = 0;
    let sec = 0;
    if (planValue.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)) {
      hour = dateValue.getHours();
      min = hour !== dateTime.getHours() ? 0 : dateValue.getMinutes();
      sec = hour !== dateTime.getHours() || min !== dateTime.getMinutes() ? 0 : dateValue.getSeconds() + 1;
    }
    return {
      nzDisabledHours: () => this.timeRange(0, hour),
      nzDisabledMinutes: () => this.timeRange(0, min),
      nzDisabledSeconds: () => this.timeRange(0, sec)
    };
  }

  /**
   * 获取主题列表
   */
  private getTopicList(): void {
    const params = {
      url: messageUrl.messageTopicSearch,
      data: {
        page: this.topicPageIndex,
        length: 30,
        queryParameterList: this.topicSearchValue
          ? [
            {
              formId: '',
              value2: null,
              queryBoxType: 'string',
              value1: this.topicSearchValue,
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
        const data = res.data.data.data ? res.data.data.data : [];
        this.isLoadingTopic = false;
        this.topicCodeList = [...this.topicCodeList, ...data];
      }
    });
  }

  /**
   * 按钮点击
   * @param data
   */
  public btnClick(button: any): void {
    switch (button.buttonId) {
      case 'Send':
        this.sendData();
        break;
      case 'Cancel':
        this.resetForm();
        break;
      default:
        this.common.createTplModal('warning', '按钮未绑定方法！');
    }
  }

  // 表单验证
  private validateForm(): boolean {
    for (const i in this.modalValidateForm.controls) {
      if (i) {
        this.modalValidateForm.controls[i].markAsDirty();
        this.modalValidateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.modalValidateForm.status === 'VALID') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 消息推送form框，目标类型值不为空则显示推送目标
   * @param data 选中消息主题topicCode
   */
  public optionsChange(data: EventEmitter<any[]>): void {
    const selectedTopic = this.topicCodeList.filter(
      res => res.topicCode === data
    );
    this.modalValidateForm.controls.receiveIdList.setValue([]);
    this.paramRequired = false;
    if (selectedTopic.length > 0) {
      // 人员选择框--初始化---start
      this.resetReceivers();
      // 人员选择框--初始化---end
      this.receiveDisabled = false;
      this.topicId = selectedTopic[0].rowid;
      this.sendType = selectedTopic[0].sendType;
      this.plateCompanyId = selectedTopic[0].plateCompanyId;
      this.modalValidateForm.controls.messageTitle.setValue(
        selectedTopic[0].messageTemplateTitle
      );
      this.modalValidateForm.controls.messageBody.setValue(
        selectedTopic[0].messageTemplateBody
      );
      const paramsArr = analysisString(selectedTopic[0].messageTemplateBody); // 解析模板内容的param
      let paramsString: String = ''; // 消息参数内容
      this.modalValidateForm.controls.messageParam.clearValidators(); // 清除消息参数的验证
      this.modalValidateForm.controls.messageParam.setValue(null); // 消息参数初始化
      if (paramsArr) {
        this.paramRequired = true;
        const paramArray = {};
        for (const i of paramsArr) {
          const name = i.replace(/\$|\{|\}/g, '');
          paramArray[name] = ''; // 消息参数数组添加
        }
        this.paramsValidator = paramArray;
        // 字符串参数名换行
        paramsString = JSON.stringify(paramArray)
          .replace(/,/g, ',\n')
          .replace(/{/g, '{\n')
          .replace(/}/g, '\n}');
        this.modalValidateForm.controls.messageParam.setValue(paramsString); // 消息参数赋值
        // 如果消息内容解析param存在，则重设消息参数的验证
        this.modalValidateForm.controls.messageParam.setValidators([
          Validators.required,
          this.bodyParamValite
        ]);
      }
      this.getReceivers();
      this.getBindCompanys(selectedTopic[0]);
    }
  }

  /**
   * 消息推送
   * 计划发送时间不为空，则调用发布接口
   */
  private sendData(): void {
    if (this.validateForm()) {
      const url = messageUrl.messagePush;
      const params = this.modalValidateForm.getRawValue();
      params.sendType = this.sendType;
      params.receiveCompanyId = this.receiveCompanyId;
      params.plateCompanyId = this.plateCompanyId;
      params.receiveIdList = this.receiversIdList;
      if (this.modalValidateForm.controls.sendPlanTime.value) {
        params.sendPlanTime = format(
          params.sendPlanTime,
          'YYYY-MM-DD HH:mm:ss'
        );
      }
      if (this.modalValidateForm.controls.expirationTime.value) {
        params.expirationTime = format(
          params.expirationTime,
          'YYYY-MM-DD HH:mm:ss'
        );
      }
      this.httpUtilService.post(url, params).then(res => {
        if (res.success) {
          this.common.createTplModal('success', '消息推送成功！');
          this.resetForm();
          this.resetReceivers();
        }
      });
    }
  }

  /**
   * 重置接收人选择
   */
  private resetReceivers(): void {
    this.usersSelectData = [];
    this.usersSelectedData = [];
    this.receiversIdList = [];
    this.receiveCompanyId = [];
    this.selectedCompanys = [];
    this.companys = [];
    this.userKind = false;
    this.indeterminate = false;
    this.indeterminateSelectCompany = false;
    this.allChecked = false;
    this.allCheckedCompany = false;
    this.btnText = '接收人未选择';
    this.userValidateForm.reset();
  }

  /**
   * form重置
   */
  private resetForm(): void {
    this.modalValidateForm.reset();
    this.receiveDisabled = true;
  }

  // 分页改变
  public pageChange(event: any): void {
    this.selectIndex = event;
    this.usersSelectData = [];
    this.getReceivers();
  }

  /**
   * 获取接收人列表
   * @param value 主题code
   */
  private getReceivers(): void {
    this.selectLoading = true;
    const params = {
      url: messageUrl.sendUserGet,
      data: {
        messageTopicId: this.topicId,
        queryParameterList: [this.userValidateForm.getRawValue()],
        page: this.selectIndex,
        length: 30
      },
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      this.selectLoading = false;
      if (res.success) {
        const result =
          typeof res.data.data === 'string' ? [] : res.data.data.data;
        this.usersSelectData = result;
        this.totalPage = res.data.data.total;
        this.checkAll(false);
        this.checkData();
        this.heightFun(0, 0);
      }
    });
  }

  /**
   * 接收人选择框弹出
   */
  public showReceiversModal(): void {
    this.receiversModalVisible = true;
  }

  /**
   * 接受人搜索
   * @param value
   */
  public searchUsers(): void {
    for (const i in this.userValidateForm.controls) {
      if (i) {
        this.userValidateForm.controls[i].markAsDirty();
        this.userValidateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.modalValidateForm.status !== 'VALID') {
      return;
    }
    this.selectIndex = 1;
    this.getReceivers();
  }

  /**
   * 接收人弹框取消按钮
   */
  public handleCancel(): void {
    this.receiversModalVisible = false;
  }

  /**
   * 接收人弹框确认按钮
   */
  public handleOk(): void {
    this.receiveCompanyId = this.selectedCompanys.map(item => {
      return item.companyId;
    });
    this.receiversIdList = this.usersSelectedData.map(item => {
      return { companyId: item.companyId, userId: item.userId };
    });
    if (
      this.receiveCompanyId.length === 0 &&
      this.receiversIdList.length === 0
    ) {
      this.common.createTplModal('warning', '接收人未选择！');
      return;
    }
    this.common.createTplModal('success', '接收人选择成功！', () => {
      this.receiversModalVisible = false;
      this.btnText = '接收人已选择';
      return true;
    });
  }

  /**
   * 接收人弹框afterclose函数
   */
  public closeResult(): void {
    this.userValidateForm.reset();
  }

  /**
   * 设置已订阅公司、用户选择表、未选择表高度
   * @param data
   * @param type
   */
  public heightFun(data: number, type: number): void {
    const selectedArr = ['usersSelectData', 'usersSelectedData', 'companys'];
    const targetArr = ['selectHeight', 'selectedHeight', 'selectCompanyHeight'];
    if (this[selectedArr[type]].length === 0) {
      this[targetArr[type]] = '100px';
    } else {
      this[targetArr[type]] = '300px';
    }
  }

  /**
   * 用户全选/反选
   * @param value 布尔值
   */
  public checkAll(value: boolean): void {
    this.usersSelectData = this.usersSelectData ? this.usersSelectData : [];
    this.usersSelectData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  /**
   * 用户选中
   */
  public refreshStatus(): void {
    const { allChecked, allUnChecked } = {
      allChecked: this.usersSelectData.length > 0
        ? this.usersSelectData.every(value => value.checked === true)
        : false,
      allUnChecked: this.usersSelectData.every(value => !value.checked)
    };
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
    this.selectData = []; // 每次重置
    this.usersSelectData.map(
      // 要修改的数据
      (val: any) => {
        if (val.checked && !val.disabled) {
          this.selectData.push(val);
        }
      }
    );
  }

  /**
   * 全选--绑定公司
   * @param value 布尔值
   */
  public checkAllCompany(value: boolean): void {
    this.companys = this.companys ? this.companys : [];
    this.companys.forEach(data => {
      data.checked = value;
    });
    this.refreshStatusCompany();
  }

  /**
   * 选中逻辑--绑定公司
   */
  public refreshStatusCompany(): void {
    const { allChecked, allUnChecked } = {
      allChecked: this.companys.length > 0
        ? this.companys.every(value => value.checked === true)
        : false,
      allUnChecked: this.companys.every(value => !value.checked)
    };
    this.allCheckedCompany = allChecked;
    this.indeterminateSelectCompany = !allChecked && !allUnChecked;
    this.selectedCompanys = []; // 每次重置
    this.companys.map(
      // 要修改的数据
      (val: any) => {
        if (val.checked) {
          this.selectedCompanys.push(val);
        }
      }
    );
  }

  /**
   * 搜索-主题
   * @param value
   */
  public SearchChange(value: any): void {
    this.isLoadingTopic = true;
    this.topicSearchValue = value;
    this.topicPageIndex = 1;
    this.topicCodeList = [];
    this.getTopicList();
  }

  /**
   * 主题列表滚动到底部回调
   */
  public scrollToBottom(): void {
    this.topicPageIndex++;
    this.isLoadingTopic = true;
    this.getTopicList();
  }

  /**
   * 获取主题已绑定的公司列表
   * @param data 选择的主题模板数据
   */
  private getBindCompanys(data: any): void {
    this.listLoadingCompany = true;
    const params = {
      url: messageUrl.bindedCompanys,
      data: {
        topicPlateCompanyId: data.plateCompanyId,
        topicCode: data.topicCode,
        sendType: data.sendType,
        plateCompanyId: null,
        parameter: null
      },
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      const result = res.data.data.data ? res.data.data.data : [];
      this.companys = result;
      this.heightFun(0, 2);
      this.listLoadingCompany = false;
      this.checkAllCompany(true);
    });
  }

  /**
   * 将选择的接收人推到已选择表中
   */
  public pushData(): void {
    if (this.selectData.length === 0) {
      this.common.createTplModal('warning', '未勾选接收人！');
      return;
    }
    this.usersSelectedData = [...this.usersSelectedData, ...this.selectData];
    this.checkData();
    this.selectData = [];
  }

  /**
   * 已选择接收人清空
   */
  public clearUsers(): void {
    this.usersSelectedData = [];
    this.allChecked = false;
    this.indeterminate = false;
    this.checkData();
  }

  /**
   * 删除某个已选择用户
   * @param item 选中的已选择用户
   * @param index 选中的已选择用户index
   */
  public delUser(item: any, index: any): void {
    this.usersSelectedData.splice(index, 1);
    this.checkData();
  }

  /**
   * 检查待选接收人与已选择接收人重复性
   */
  private checkData(): void {
    const _this = this;
    if (this.usersSelectedData.length === 0) {
      this.allChecked = false;
      this.indeterminate = false;
    }
    this.usersSelectData.map(item => {
      const indexNum = _this.usersSelectedData.findIndex(e => {
        return item.companyId === e.companyId && item.userId === e.userId;
      });
      if (indexNum > -1) {
        item.checked = true;
        item.disabled = true;
      } else {
        item.checked = false;
        item.disabled = false;
      }
      return item;
    });
    this.heightFun(0, 1);
  }
}
