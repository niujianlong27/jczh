import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserinfoService} from '@service/userinfo-service.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {messageUrl} from '@model/messageUrl';
import {CacheService} from '@service/cache.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-message-send-rgsales-all-message',
  templateUrl: './message-send-rgsales-all-message.component.html',
  styleUrls: ['./message-send-rgsales-all-message.component.css']
})
export class MessageSendRGSalesAllMessageComponent implements OnInit {

  public upHeight: string;
  public downHeight: string;
  private searchParam: any = {};
  public upData: Array<any> = [];
  public downData: Array<any> = [];
  public total = 0;
  public upLoading = false;
  public downLoading = false;

  public selectedUpDataList: Array<any> = [];
  public selectedDownDataList: Array<any> = [];
  refresh = 0; // 用于表2刷新选择

  constructor(
    private http: HttpClient,
    private info: UserinfoService,
    private nn: NzNotificationService,
    private nzModal: NzModalService,
    private nm: NzMessageService,
    private cache: CacheService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
  }

  // 表格高度
  public tableHeight(data: any) {
    this.upHeight = `${data.one}px`;
    this.downHeight = `${data.two}px`;
  }

  // 查询
  public search(param: any) {
    this.searchParam = param;
    this.getData();
  }

  // 表1数据获取
  private getData() {
    this.upLoading = true;
    this.http.post(
      messageUrl.messageGetGroup,
      this.searchParam
    ).subscribe((res: any) => {
        if (res.code === 100) {
          this.upData = (res.data && res.data.data) || [];
          this.total = (res.data && res.data.total) || 0;
        }
      },
      () => {
        this.downData = [];
        this.upLoading = false;
      },
      () => {
        this.downData = [];
        this.upLoading = false;
        this.selectedUpDataList = [];

      });
  }

  // 选择表1数据
  public selectedFun(data: Array<any>) {
    this.selectedUpDataList = data;

    if (this.selectedUpDataList.length !== 0) {
      this.getDetail();
    } else {
      this.downData = [];
    }
  }

  /**
   * 表2选择数据
   * @param data
   */
  public selectedDownData(data: Array<any>) {
    this.selectedDownDataList = data;
  }

  // 表2数据获取
  private getDetail() {
    this.downLoading = true;
    this.http.post(
      messageUrl.messageGetDetail,
      {
        page: 1,
        length: 100000,
        messageGroupId: this.selectedUpDataList[0].groupId
      }
    ).subscribe(
      (res: any) => {
        if (res.code === 100) {
          this.downData = (res.data && res.data.data) || [];
          this.downData.forEach(
            value => {
              value.checked = true;
            }
          );
          this.refresh = Math.random();
        }
      },
      () => {
        this.downLoading = false;
      },
      () => {
        this.downLoading = false;

      });
  }

  // 页面功能模块
  public btnClick(data: any) {
    switch (data.buttonId) {
      case 'Select': {
        this.btnSelect();
      }
        break;
      default:
        break;
    }
  }

  /**
   * 点击选择
   */
  btnSelect(): void {
    const receiveIdList: Array<any> = [];
    this.selectedDownDataList.forEach(
      value => {
        const tmp = {
          userId: value.receiveId,
          companyId: value.companyId,
          mobile: value.mobile,
          name: value.receiveIdName,
          checked: true
        };
        receiveIdList.push(tmp);
      }
    );
    const sendData = {
      receiveIdList,
      modalValidateForm: this.selectedUpDataList[0]
    };
    this.cache.setLocal('rgSalesMessage', sendData);
    this.router.navigate(['../messageSendRGSales', {topicCode: this.selectedUpDataList[0].topicCode}], {relativeTo: this.route});
  }

  /**
   * 搜索条件抛出
   * @param params
   */
  searchDataReturn(params: Array<any>): void {
    const topicName = this.cache.getLocal('topicName');
    topicName && params.forEach(
      value => {
        if (value.parameter === 'topicCodeName') {

          value.value1 = topicName;
          value.checkBox = true;
          this.cache.clearLocal('topicName');

        }
      }
    );
  }

}
