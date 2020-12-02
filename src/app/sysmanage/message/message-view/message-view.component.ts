import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpUtilService } from '../../../common/services/http-util.service';
import { messageUrl } from '../../../common/model/messageUrl';
import { GlobalService } from '../../../common/services/global-service.service';
import { Router } from '@angular/router';
import { SimpleCacheService } from '@service/simple-cache.service';
import { Utils } from '@util/utils';
import { CommonService } from '@service/common.service';

@Component({
  selector: 'app-message-view',
  templateUrl: './message-view.component.html',
  styleUrls: ['./message-view.component.css']
})
export class MessageViewComponent implements OnInit {
  public modalFormVisible = false; // 表单弹窗
  public modalValidateForm: FormGroup;
  public modalTitle: string; // 删除弹窗标题
  public dataSet: Array<any>;
  public pageSize = 30; // 条数
  public totalPage: number; // 数据总条数
  public listLoading = true; // 表格是否在加载中
  public showHref = false; // 是否显示详情弹框内的跳转
  private searchData: any; // 存储查询的数据

  constructor(
    private httpUtilService: HttpUtilService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private simpleCache: SimpleCacheService,
    private common: CommonService
  ) {
    globalService.msgReadEvent.subscribe((data: any) => {
      this.listSearch(this.searchData);
    });
  }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize });
    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({
      sendIdName: [null],
      sendTypeName: [null],
      sendTime: [null],
      messageTitle: [null],
      messageBody: [null],
      webFormid: [null],
      messageId: [null],
      receiveTime: [null]
    });
  }

  /**
   * 获取接收消息列表
   * @param param 参数
   */
  public listSearch(param: any): void {
    // 列表查询
    param.page = param.page || 1; // 最好有
    param.length = param.length || this.pageSize; // 最好有
    this.searchData = param; // 查询的数据存储
    this.listLoading = true;
    this.getListSearch(param);
  }

  /**
   * 接收消息列表获取执行
   * @param data 参数
   */
  protected getListSearch(data: Object): void {
    const params = {
      url: messageUrl.messageListGet,
      data: data,
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data.data;
        this.totalPage = res.data.data.total;
      }
    });
  }

  /**
   * 全部已读/标记已读
   * @param event 选中消息集合
   */
  public readBtn(event: any): void {
    const btnId = event.type.buttonId;
    if (event.data.length < 1 && btnId === 'Read') {
      this.common.createTplModal('warning', '请至少选择一条消息！');
      return;
    }
    if (btnId === 'Read') {
      const status = event.data.some(item => item.receiveTime);
      if (status) {
        this.common.createTplModal('warning', '选择消息中存在已读消息！');
        return;
      }
    }
    // 生成新的存储空间，防止影响searchData的存储空间
    const params = Utils.deepCopy(this.searchData);
    // receiveTime：表示是否已读
    switch (btnId) {
      case 'Read':
        params.messageModelList = [];
        event.data.forEach(element => {
          params.messageModelList.push({
            messageId: element.messageId,
            receiveTime: 1
          });
        });
        this.messageBeReaded(params);
        break;
      case 'AllRead':
        this.messageAllRead();
        break;
      default:
        this.common.createTplModal('warning', '按钮未绑定方法！');
    }
  }

  /**
   * 标记已读
   * @param data 需要标记已读的消息
   */
  protected messageBeReaded(data: Object): void {
    const params = {
      url: messageUrl.messageRead,
      data: data,
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      if (res.success) {
        this.common.createTplModal('success', '消息标记已读成功！');
        this.globalService.msgReadEvent.emit();
      } else {
        this.common.createTplModal('error', '消息标记已读失败！');
      }
    });
  }

  /**
   * 全部标记已读
   */
  protected messageAllRead(): void {
    const params = {
      url: messageUrl.messageAllRead,
      data: {},
      method: 'POST'
    };
    this.httpUtilService.request(params).then((res: any) => {
      if (res.success) {
        this.common.createTplModal('success', '消息全部已读成功！');
        this.globalService.msgReadEvent.emit();
      } else {
        this.common.createTplModal('error', '消息全部已读失败！');
      }
    });
  }

  /**
   * 查看框显示
   */
  public handleCancel(): void {
    this.modalFormVisible = false;
    this.showHref = false;
  }

  /**
   * 查看框关闭
   */
  public closeResult(): void {
    this.modalValidateForm.reset();
  }

  /**
   * 消息表格内查看关联页面
   * @param data
   */
  public operateView(data: any): void {
    if (!data.webFormid) {
      return;
    }
    this.modalFormVisible = false;
    const formUrlArr = this.simpleCache.getLocal('formUrlArr'); // 获取form_url数组
    const formUrlItem = formUrlArr.filter(x => x.formId === data.webFormid); // 与当前消息匹配form_url
    const params = Utils.deepCopy(this.searchData);
    params.messageModelList = [];
    params.messageModelList.push({ messageId: data.messageId, receiveTime: 1 });
    setTimeout(() => { // 延迟执行，防止跳转出现页面卡死现象
      this.router.navigate([formUrlItem[0].formUrl]).then(() => {
        if (!data.receiveTime) {
          this.messageBeReaded(params);
        }
      });
    }, 300);
  }

  /**
   * 查看消息详情
   * @param data 消息内容
   */
  public viewDetail(data: any): void {
    this.modalFormVisible = true;
    this.showHref = false;
    this.modalTitle = '消息详情';
    const formUrlArr = this.simpleCache.getLocal('formUrlArr'); // 获取form_url数组
    const formUrlItem = formUrlArr.filter(x => x.formId === data.webFormid); // 与当前消息匹配form_url
    if (formUrlItem[0] && formUrlItem[0].formUrl) {
      this.showHref = true;
    }
    this.modalValidateForm.patchValue(data);
    if (!data.receiveTime) {
      const params = Utils.deepCopy(this.searchData);
      params.messageModelList = [{ messageId: data.messageId, receiveTime: 1 }];
      this.messageBeReaded(params);
    }
  }
}
