import { Component, OnInit } from '@angular/core';
import {stockUrl} from '@model/stockUrl';
import {Router} from '@angular/router';
import {UserinfoService} from '@service/userinfo-service.service';
import {FormBuilder} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@service/common.service';

@Component({
  selector: 'app-product-set',
  templateUrl: './product-set.component.html',
  styleUrls: ['./product-set.component.css']
})
export class ProductSetComponent implements OnInit {
  updatedata:any =[];
  dataSet:any=[];
  pageSize:any = 30
  tempSearchParam:any
  totalPage:any;
  totalPage2:any;
  loading:boolean = false;
  loading2:boolean = false;
  moduleLoading:boolean = false;
  visible:boolean = false
  width:any='60%  '
  inputModalSearchValue:any;
  checkoutDate:any; // 物资代码选择选中的数据
  sendData: any={}; // 调用参数

  dataSet2:any=[]
  constructor(private router: Router, private appInfo: UserinfoService, private fb: FormBuilder, private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private cm: CommonService) { }

  ngOnInit() {
    this.listSearch({})
  }

  listSearch(data:any){
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  getList(data:any){
    let url = stockUrl.getProductConfig;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
      }
    })
  }
  btnclick(data:any){
    switch (data.buttonId) {
      case 'Update':
        this.btnUpdate();
        break;
      default:
        break;
    }
  }

  btnUpdate(){
    if(this.updatedata.length!==1){
      this.nz.error('提示信息','请勾选一条数据！')
      return;
    }
    this.visible = true
    this.keyUp(null);//弹框获取数据
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex(page: any): void {
    this.tempSearchParam.page = page;
    this.listSearch(this.tempSearchParam);
  }


  updateDataResult(data:any){
    this.updatedata = data
  }

  handleOk(){
    let  url = stockUrl.setProductConfig;
    console.log(this.checkoutDate[0]);
    console.log(this.updatedata[0]);
    console.log(this.checkoutDate[0].itemId);

    this.sendData.itemId = this.checkoutDate[0].itemId;
    this.sendData.id = this.updatedata[0].id;
    this.sendData.productArea = this.updatedata[0].productArea;
    console.log(this.sendData);

    this.http.post(url, this.sendData).then((res: any) => {
      if (res.success) {
        this.nz.success('提示信息','修改成功')
        this.visible = false;
        this.listSearch(this.tempSearchParam);
      }
    })
  }

  handleCancel(){
    this.visible = false;
  }

  keyUp(data:any){
    let url = stockUrl.getItema;
    this.loading2 = true;
    this.dataSet2 = [];
    this.http.post(url, {itemId:data}).then((res: any) => {
      if (res.success) {
        this.loading2 = false;
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPage2 = res.data.data && res.data.data.total || 0;
      }
    })
  }

  updateDataResult2(data:any){
    this.checkoutDate = data;
    console.log(this.checkoutDate) ;
  }


}
