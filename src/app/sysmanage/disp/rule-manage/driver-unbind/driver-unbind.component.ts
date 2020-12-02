import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { DISPURL } from '../../../../common/model/dispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-driver-unbind',
  templateUrl: './driver-unbind.component.html',
  styleUrls: ['./driver-unbind.component.css']
})
export class DriverUnbindComponent implements OnInit {
  dataSet:any=[];//结果集
  loading:any;//页面查询加载
  pageSize:any = 30;//页面显示数据条数
  totalPage:any;//总页数
  updatedata:any=[];
  listLoading: any;
  deleteVisible: any;
  deletemodaltitle: any;
  tplModal: NzModalRef;

  unbindVisible: boolean = false; //司机解绑弹窗
  unbindmodalTitle: string = ''; //司机解绑主题
  unbindCon: string = ''; //司机解绑提示

  tempSearchData: any = {};
  tempSearchParam: any;
       // 用户信息

  //选中的数据

  constructor( private http: HttpUtilService , private nz: NzNotificationService, private nm: NzModalService,private info: UserinfoService) {   }


  ngOnInit() {
     this.listSearch({page: 1, length: this.pageSize});
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    console.log('进入查询方法');
    console.log(data.length + '----' + this.pageSize);
    data.page = data.page || 1;
    data.length =  this.pageSize || data.length ;
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    const url = DISPURL.DRIVERUNBINDSEARCHALL;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.updatedata = [];
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
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
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  /**
   * 按钮点击事件
   * @param data
   */
  btnclick(data: any) {
    console.log(data.type.buttonId);
    switch (data.type.buttonId) {
      case 'UnBind':
        this.unbindClick(this.updatedata);
        break;
    }
  }

  /**
   * 司机解绑弹框
   */
  unbindClick(data: any) {
    // tslint:disable-next-line:triple-equals
    if (data.length != 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '警告信息',
        nzContent: '请选中一条数据后进行操作'
      });
    } else {
      this.unbindVisible = true;
      this.unbindmodalTitle = '提示信息';
      this.unbindCon = '确定要解绑所选数据的设备?';
    }
  }

  /**
   * 确定司机解绑按钮
   */
  driverUnbind(data: any) {
    if ('ok' === data.type) {
      console.log('司机确定解绑');
      this.driverUnbindPort(this.updatedata[0]);
    }
    this.unbindVisible = false;
  }

  /**
   * 司机解绑接口
   */
  driverUnbindPort(data:any){
    const url = DISPURL.DRIVERUNBIND;
    console.log(this.info);
    data.updateId =this.info.APPINFO.USER.userId ;
    data.updateName=this.info.APPINFO.USER.name;
    this.listLoading = true;
    //data.driverPhone =data.mobile;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '解绑成功'
        });
      }
      this.listLoading =false;
     // this.getListSearch(this.tempSearchData);
      this.getList(this.tempSearchData);
    })
  }



  deleteData(data: any) {

  }
  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize(pageSize: any): void {
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

//    getListSearch(data: any) {
//      this.tempSearchData=data;
//      const params = { url: '', data: {}, method: 'POST' };
//      params.url = DISPURL.GETUSERTRUCKLIST; //查询集合或者对象
//      data.enterpriseId = this.info.APPINFO.USER.companyId;
//
//      params.data = data;
//      this.tempSearchParam = data;
//      this.http.request(params).then((res: any) => {
//        this.listLoading = false;
//        if (res.success) {
//          if (res.data.data) {
//            this.dataSet = res.data.data.data;
//            this.totalPage = res.data.data.total;
//          } else {
//            this.dataSet = [];
//          }
//        }
//      });
//      console.log(this.dataSet);
//   }
 }
