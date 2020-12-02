import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { messageUrl } from '../../../common/model/messageUrl';
import { urls } from '../../../common/model/url';
import { UserinfoService } from '../../../common/services/userinfo-service.service';
import { CommonService } from '@service/common.service';

@Component({
  selector: 'app-message-template',
  templateUrl: './message-template.component.html',
  styleUrls: ['./message-template.component.css']
})
export class MessageTemplateComponent implements OnInit {
  public formId: String = 'form_message_template';
  public selectSplitGroup: Array<any> = []; // 发送类型下拉集合
  public selectKindGroup: Array<any> = []; // 消息种类下拉集合
  public selectBtypeGroup: Array<any> = []; // 业务类型下拉集合
  public webInterfaceList: string[] = []; // web跳转界面列表
  public appInterfaceList: string[] = []; // app跳转界面列表
  public modalFormVisible: Boolean = false; // 表单弹窗
  public modalValidateForm: FormGroup;
  public modalTitle: string; // 弹窗标题
  public dataSet: Array<any>;
  public pageSize = 30; // 条数
  public totalPage = 0; // 数据总条数
  public listLoading = true; // 表格是否在加载中
  public businessTypeIsRequired = false; // 业务类型是否必填
  public isLoadingWeb: Boolean = false;
  public isLoadingApp: Boolean = false;
  private selectedData: Array<any> = [];
  private searchData: any; // 存储查询的数据
  private status: string; // add添加，update更新
  private rowid: string;
  private webPage = 1; // web界面分页page
  private appPage = 1; // app界面分页page
  private webSearchValue: any; // web界面搜索值
  private appSearchValue: any; // app界面搜索值
  private companyId: any; // 当前账户所属公司ID
  constructor(
    private httpUtilService: HttpUtilService,
    private fb: FormBuilder,
    private info: UserinfoService,
    private common: CommonService) {
  }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize });

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({
      topicCode: [{ value: null, disabled: true }],
      topicName: [null, [Validators.required]],
      sendType: [null, [Validators.required]],
      messageTemplateTitle: [null, [Validators.required]],
      messageTemplateBody: [null, [Validators.required]],
      messageKind: [null, [Validators.required]],
      businessType: [null],
      retryInterval: [null, [Validators.pattern(new RegExp(/^\d+$/))]],
      retryTimes: [null, [Validators.pattern(new RegExp(/^\d+$/))]],
      retryUpgradeSendType: [null],
      repeatInterval: [null, [Validators.pattern(new RegExp(/^\d+$/))]],
      repeatTimes: [null, [Validators.pattern(new RegExp(/^\d+$/))]],
      repeatUpgradeSendType: ['false', [Validators.required]],
      webFormid: [null],
      appFormid: [null],
      remark: [null]
    });
    this.getStatic('FSLX', this.selectSplitGroup);
    this.getStatic('XXZL', this.selectKindGroup);
    this.getStatic('YWLX', this.selectBtypeGroup);
    this.getWebInterface();
    this.getAppInterface();

    this.companyId = this.info.get('USER').companyId;
  }

  /**
   * 获取静态值
   * @param valueSetCode string
   * @param parameter Array
   */
  private getStatic(valueSetCode: string, parameter: Array<any>): void {
    this.httpUtilService.post(urls.static, { valueSetCode: valueSetCode }).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(parameter, res.data.data.data);
        }
      }
    );
  }

  /**
   * 列表查询
   * @param param 查询参数
   */
  public listSearch(param: any) {
    param.page = param.page || 1;
    param.length = param.length || this.pageSize;
    this.searchData = param;
    this.listLoading = true;
    this.getListSearch(param);
  }

  /**
   * 列表查询数据获取
   * @param data 查询参数
   */
  private getListSearch(data: Object): void {
    const params = {
      url: messageUrl.messageTopicSearch,
      data: data,
      method: 'POST'
    };
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  /**
   * 按钮点击
   * @param data
   */
  public btnClick(button: any) {
    switch (button.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      default:
        this.common.createTplModal('warning', '按钮未绑定方法!');
    }
  }

  /**
   * 表单验证
   */
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
   * 消息种类值改变
   * @param value 消息种类值
   */
  public mesKindChange(value): void {
    this.businessTypeIsRequired = false;
    this.modalValidateForm.get('businessType').setValidators(null);
    if (value === 'XXZL20') {
      this.businessTypeIsRequired = true;
      this.modalValidateForm.get('businessType').setValidators([Validators.required]);
    }
  }

  /**
   * 弹框主题新增框
   */
  private btnAdd(): void {
    this.modalFormVisible = true;
    this.modalValidateForm.controls.repeatUpgradeSendType.setValue('false');
    this.modalTitle = '消息主题 > 添加';
    this.status = 'add';
  }

  /**
   * 选中数据
   */
  public updateDataResult(param: Array<any>) {
    this.selectedData = param;
  }

  /**
   * 修改按钮函数
   * @param data
   */
  private btnUpdate(): void {
    if (this.selectedData.length === 0 || this.selectedData.length > 1) {
      this.common.createTplModal('warning', '请选择一条数据后进行修改!');
      return;
    }
    if (this.selectedData[0].plateCompanyId !== this.companyId) {
      this.common.createTplModal('warning', '当前主题无权限修改!');
      return;
    }
    this.status = 'update';
    this.modalTitle = '消息主题 > 修改';
    this.modalFormVisible = true;
    this.rowid = this.selectedData[0].rowid;
    this.modalValidateForm.patchValue(this.selectedData[0]);
    this.webSearchValue = this.selectedData[0].webFormName;
    this.appSearchValue = this.selectedData[0].appFormName;
    this.getWebInterface();
    this.getAppInterface();
  }

  /**
   * 删除按钮函数
   */
  private btnDelete(): void {
    const delDatas = this.selectedData;
    if (delDatas.length < 1) {
      this.common.createTplModal('warning', '请选中后进行删除!');
      return;
    }
    if (this.selectedData[0].plateCompanyId !== this.companyId) {
      this.common.createTplModal('warning', '当前主题无权限删除!');
      return;
    }
    this.common.createTplModal('confirm', '是否确认删除此条主题模板？', () => {
      this.deleteData();
    });
  }

  /**
   * 执行主题新增
   */
  private addData() {
    if (this.validateForm()) {
      const params = {
        url: messageUrl.messageTopicAdd,
        data: this.modalValidateForm.getRawValue(),
        method: 'POST'
      };
      this.httpUtilService.request(params).then(
        (res: any) => {
          if (res.success) {
            this.listSearch(this.searchData);
            this.modalFormVisible = false;
            this.common.createTplModal('success', '新增主题成功！');
          } else {
            this.common.createTplModal('error', '新增主题失败！');
          }
        }
      );
    }
  }

  /**
   * 执行主题修改
   */
  private updateData() {
    if (this.validateForm()) {
      const paramsData = this.modalValidateForm.getRawValue();
      paramsData.rowid = this.rowid;
      const params = {
        url: messageUrl.messageTopicUpdate,
        data: paramsData,
        method: 'POST'
      };
      this.httpUtilService.request(params).then(
        (res: any) => {
          if (res.success) {
            this.listSearch(this.searchData);
            this.modalFormVisible = false;
            this.common.createTplModal('success', '主题修改成功！');
          } else {
            this.common.createTplModal('error', '主题修改失败！');
          }
        }
      );
    }
  }

  /**
   * 执行主题删除
   */
  private deleteData() {
    const params = {
      url: messageUrl.messageTopicDel,
      data: { tMessageTopicModels: [] },
      method: 'POST'
    };
    this.selectedData.forEach(element => {
      params.data.tMessageTopicModels.push({
        rowid: element.rowid
      });
    });
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.searchData);
          this.common.createTplModal('success', '主题删除成功！');
        } else {
          this.common.createTplModal('error', '主题删除失败！');
        }
      }
    );
  }

  /**
   * 是否重发切换
   */
  public repeatUpgradeChange(value): void {
    if (value === 'true') {
      this.modalValidateForm.get('repeatInterval').setValidators([Validators.required]);
      this.modalValidateForm.get('repeatTimes').setValidators([Validators.required]);
    } else {
      this.modalValidateForm.get('repeatInterval').setValidators(null);
      this.modalValidateForm.get('repeatTimes').setValidators(null);
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
   * 弹框确认按钮
   */
  public handleOk(): void {
    if (this.status === 'add') {
      this.addData();
    } else {
      this.updateData();
    }
  }

  private interfaceParams(value: string | null): Array<any> {
    return [{
      checkBox: true,
      formId: '',
      format: '',
      name: '界面名称',
      parameter: 'formName',
      parameter2: 'formName_between_end',
      postQuery: '且',
      query: '包含',
      queryBoxType: 'string',
      value1: value,
      value2: null
    }];
  }

  /**
   * 获取web界面list
   */
  private getWebInterface(): void {
    const params = {
      url: `${environment.baseUrl}form/getForm`,
      data: {
        length: 30,
        page: this.webPage,
        queryParameterList: this.webSearchValue ? this.interfaceParams(this.webSearchValue) : []
      },
      method: 'POST'
    };
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.isLoadingWeb = false;
        if (this.webInterfaceList.length > 0) {
          this.webInterfaceList = [...this.webInterfaceList, ...res.data.data.data];
        } else {
          this.webInterfaceList = [...[], ...res.data.data.data];
        }
      }
    );
  }

  /**
   * 获取app界面list
   */
  private getAppInterface(): void {
    const params = {
      url: `${environment.baseUrl}appform/selectAppForm`,
      data: {
        length: 30,
        page: this.appPage,
        queryParameterList: this.appSearchValue ? this.interfaceParams(this.appSearchValue) : []
      },
      method: 'POST'
    };
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.isLoadingApp = false;
        if (this.appInterfaceList.length > 0) {
          this.appInterfaceList = [...this.appInterfaceList, ...res.data.data.data];
        } else {
          this.appInterfaceList = [...[], ...res.data.data.data];
        }
      }
    );
  }

  /**
   * 搜索-web界面跳转
   * @param value
   */
  public SearchChangeWeb(value: any): void {
    this.webSearchValue = value;
    this.webPage = 1;
    this.webInterfaceList = [];
    this.getWebInterface();
  }

  /**
   * 搜索-app界面跳转
   */
  public SearchChangeApp(value: any): void {
    this.appSearchValue = value;
    this.appPage = 1;
    this.appInterfaceList = [];
    this.getAppInterface();
  }

  /**
   * web界面滚动到底部回调
   */
  public scrollToBottomWeb(): void {
    this.webPage++;
    this.isLoadingWeb = true;
    this.getWebInterface();
  }

  /**
   * App界面滚动到底部回调
   */
  public scrollToBottomApp(): void {
    this.appPage++;
    this.isLoadingApp = true;
    this.getAppInterface();
  }
}
