import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { messageUrl } from '../../../common/model/messageUrl';
import { GlobalService } from 'src/app/common/services/global-service.service';
import { CommonService } from '@service/common.service';

@Component({
  selector: 'app-message-send-view',
  templateUrl: './message-send-view.component.html',
  styleUrls: ['./message-send-view.component.css']
})
export class MessageSendViewComponent implements OnInit {
  public listFormVisible = false; // 消息详细列表表单弹窗
  public dataSet: Array<any>;
  public pageSize = 30; // 条数
  public totalPage: number; // 数据总条数
  public listLoading = true; // 表格是否在加载中
  private searchData: any; // 存储查询的数据
  public btnsDisable: any = {
    Cancel: true
  };

  public listPageSize = 30; // 条数
  public listTotalPage: number; // 数据总条数
  public listDataSet: Array<any>;
  public detailModalTitle: string; // 消息详细框标题
  public modalListLoading = true; // 消息详细弹框表格加载
  private viewData: any; // 进行详细查看的消息
  private selectMsgs: Array<any>; // 消息组选中数组集合
  constructor(
    private httpUtilService: HttpUtilService,
    private globalService: GlobalService,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize });
  }

  /**
   * 消息组列表获取
   * @param param 参数
   */
  listSearch(param: any): void {
    // 列表查询
    param.page = param.page || 1; // 最好有
    param.length = param.length || this.pageSize; // 最好有
    this.searchData = param; // 查询的数据存储
    this.listLoading = true;
    this.selectMsgs = []; // 清空消息组选中集合
    this.getListSearch(param);
  }

  /**
   * 消息组信息获取执行
   * @param data
   */
  getListSearch(data: any): void {
    const params = {
      url: messageUrl.messageGetGroup,
      data: data,
      method: 'POST'
    };
    params.data.isAll = true;
    this.httpUtilService.request(params).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data.data;
        this.totalPage = res.data.data.total;
      }
    });
  }

  /**
   * 按钮栏点击操作
   * @param event
   */
  btnClick(event: any): void {
    const btnId = event.buttonId;
    if (this.selectMsgs.length < 1) {
      this.common.createTplModal('warning', '请至少选中一条数据！');
      return;
    }
    // 深度拷贝
    const params = JSON.parse(JSON.stringify(this.searchData));
    params.messageModelList = [];
    this.selectMsgs.forEach(element => {
      params.messageModelList.push({ messageGroupId: element.groupId });
    });
    switch (btnId) {
      case 'Cancel':
        // 取消发送
        params.messageStatus = 'CFBJ20';
        this.cancleSend(params);
        break;
      default:
        this.common.createTplModal('warning', '按钮未绑定方法！');
    }
  }

  /**
   * 定时消息取消发送
   * @param data 请求参数
   */
  cancleSend(data: any): void {
    const params = {
      url: messageUrl.messageCancelSend,
      data: data,
      method: 'POST'
    };
    this.common.createTplModal('confirm', '是否确认取消发送此次定时推送？', () => {
      this.httpUtilService.request(params).then((res: any) => {
        if (res.success) {
          this.listSearch(this.searchData);
          this.common.createTplModal('success', '取消发送操作成功！');
        } else {
          this.common.createTplModal('error', '取消发送操作失败！');
        }
      });
    });
  }

  /**
   * 详情框关闭
   */
  handleCancel(): void {
    this.listFormVisible = false;
  }

  /**
   * 详情框每次关闭调用
   */
  closeResult(): void {
    this.listDataSet = [];
    this.listTotalPage = 0;
  }

  /**
   * 消息组表选中值更新
   * @param value 表格选中值
   */
  updateDataResult(value: Array<any>): void {
    this.selectMsgs = value;
    this.btnsDisable = {
      Cancel: false
    };
    if (value.length === 0) {
      this.btnsDisable = {
        Cancel: true
      };
    }
    // 取消发送按钮是否可点击
    value.forEach(element => {
      const { x: sendPlanTime, y: nowTime } = {
        x: new Date(element.sendPlanTime),
        y: new Date()
      };
      if (
        sendPlanTime.getTime() < nowTime.getTime() ||
        !element.sendPlanTime ||
        element.groupStatus === 'CFBJ20'
      ) {
        this.btnsDisable.Cancel = true;
      }
    });
  }

  /**
   * 显示消息组详情框
   */
  showListModal(): void {
    this.listFormVisible = true;
    this.detailModalTitle = '消息详情';
    this.listPageSize = 30;
    // 手动初始化弹框列表的pageIndex为1
    this.globalService.pageNumEmitter.emit({
      formId: 'form_message_sendView',
      gridId: 'grid1',
      length: this.listPageSize,
      page: 1,
      search: true
    });
    this.getListDetail({ page: 1, length: this.listPageSize });
  }

  /**
   * 获取消息详细列表数据
   * @param data
   */
  getListDetail(data: any): void {
    this.modalListLoading = true;
    const params = {
      url: messageUrl.messageGetDetail,
      data: data,
      method: 'POST'
    };
    params.data.isAll = true;
    params.data.messageGroupId = this.viewData.groupId;
    this.httpUtilService.request(params).then((res: any) => {
      this.modalListLoading = false;
      if (res.success) {
        this.listDataSet = res.data.data.data;
        this.listTotalPage = res.data.data.total;
      }
    });
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex(page: any): void {
    this.getListDetail({ page: page, length: this.listPageSize });
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize(pageSize: any): void {
    this.getListDetail({ page: 1, length: pageSize });
  }

  /**
   * 表格内查看操作
   * @param data
   */
  operateView(data: any): void {
    this.viewData = data;
    this.showListModal();
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.listSearch({ page: page, length: this.pageSize });
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.listSearch({ page: 1, length: pageSize });
  }
}
