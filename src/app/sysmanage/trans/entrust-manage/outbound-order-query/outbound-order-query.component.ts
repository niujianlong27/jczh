import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {contractUrl} from '../../../../common/model/contractUrl';

@Component({
  selector: 'app-outbound-order-query',
  templateUrl: './outbound-order-query.component.html',
  styleUrls: ['./outbound-order-query.component.css']
})
export class OutboundOrderQueryComponent implements OnInit {

  dataSet:any=[];//结果集
  loading:any;//页面查询加载
  pageSize:any = 30;//页面显示数据条数
  totalPage:any;//总页数
  updatedata:any=[];//选中的数据
  caculateEnameArr: any = [
    {field: 'weight', tipInfo: '已选重量', tipInfoType: '吨', demLength: 3},
  ];
  constructor( private http: HttpUtilService ,private nz: NzNotificationService,) {   }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize})
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    console.log('进入查询方法')
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    let url = contractUrl.queryOutbound;
    this.loading = true;
    this.dataSet = [];
    //this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        console.log(res);
        // res.data.data.data.forEach(item => {
        //   if (item.isUse === '10'){
        //     item.isUse = "";
        //   }
        // });
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        for (let i = 0; i < this.dataSet.length; i++) {
          if (this.dataSet[i].isUse === 10) {
            this.dataSet[i].isUse = "使用";
          } else {
            this.dataSet[i].isUse = "未使用" ;
          }
        }
        console.log(this.dataSet);
      }
    });
  }

  /**
   * 页面选中数据赋值给全局变量
   * @param data
   */
  updateDataResult(data: any) {
    this.updatedata = data;
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    this.getList({page: 1, length: this.pageSize});
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex(page: any): void {
    this.getList({page: page, length: this.pageSize});
  }
  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnclick(data:any){

  }
}
