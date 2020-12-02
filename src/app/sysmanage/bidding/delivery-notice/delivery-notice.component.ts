import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService, NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {urls} from '@model/url';

@Component({
  selector: 'app-delivery-notice',
  templateUrl: './delivery-notice.component.html',
  styleUrls: ['./delivery-notice.component.css']
})
export class DeliveryNoticeComponent implements OnInit {
  pageSize: number = 30;//条数
  totalPage: number = 0;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 勾选中的数据
  tempSearchParam: any; //查询条件存储

  //子表
  pageSize2: number = 30;//条数
  totalPage2: number = 0;//数据总条数
  listLoading2: boolean = false;// 表单加载状态
  dataSet2: Array<any> = []; // 表单数据


  // 页面grid
  gridOneHeight: string;
  gridTwoHeight: string;

  constructor(private http: HttpUtilService,
              public router: Router,
              private msg: NzMessageService,) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.listLoading = true;
    this.getListSearch(data);
  }


  // 列表查询数据获取
  getListSearch(data: any): void {
    this.dataSet2 = [];
    this.totalPage2 = 0;
    this.tempSearchParam = data;
    this.http.post(urls.selectDeliveryNotice, data).then((res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data && res.data.data.data;
          this.totalPage = res.data.data && res.data.data.total;
        }
      }
    );
  }

  /**
   * 按钮区按钮点击事件统一处理
   * @param button
   */
  btnClick(button: any) {
    // switch (button.buttonId) {
    //   case '':
    //     break;
    //   default:
    //     this.msg.error('按钮未绑定方法');
    // }
  }

  selected(data: any) {
    this.selectedData = data;
    this.dataSet2 = [];
    this.totalPage2 = 0;
    this.selectedData[0] && this.getListSearch2({page: 1, length: this.pageSize2});
  }

  getListSearch2(data:any) {
    this.listLoading2 = true;
    let Arr = this.selectedData.map(item => {
      return {id: item.id};
    });
    data['keeperhdList'] = Arr;
    this.http.post(urls.selectKeeperln, data).then((res: any) => {
      this.listLoading2 = false;
      if (res.success) {
        this.dataSet2 = res.data.data && res.data.data.data;
        this.totalPage2 = res.data.data && res.data.data.total;
      }
    });
  }

  /**
   * 明细列表当前页码改变
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getListSearch2({page: page, length: this.pageSize2});
  }

  /**
   * 明细列表每页展示条数改变
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getListSearch2({page: 1, length: this.pageSize2});
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 20}px`;
  }

}
