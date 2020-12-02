import { Component, OnInit } from '@angular/core';
import {stockManageURL} from '@model/stockManage';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-stock-manage',
  templateUrl: './stock-manage.component.html',
  styleUrls: ['./stock-manage.component.css']
})
export class StockManageComponent implements OnInit {

  dataSet1:any=[];
  updatedata:any=[];
  totalPage:any;
  pageSize1:any=30;
  gridOneHeight:string;
  tempSearchParam:any
  listLoading1 = false
  isRoute = false
  routeData:any=[]
  isPlan:any ;
  constructor(private router: Router,
              private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,
              private fb:FormBuilder,
              private info: UserinfoService,
              private _route:ActivatedRoute,
              private anhttp: HttpClient,) {
    this.routeData = []
    this._route.queryParams.subscribe((params: Params) => {
      console.log(params)
      if(params.isRoute){
        this.isRoute = true
      }else{
        this.isRoute = false
      }
      this.isPlan = params.isPlan;
      this.routeData = JSON.parse(sessionStorage.getItem('dataSet'));
    } )
    this.searchList({page:1,length:30})
  }

  ngOnInit() {

  }

  searchList(data:any){
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }

  getList1(data:any){
    let url;
    if(this.isRoute){
      url = stockManageURL.selectStockInfo10
      data.status = '10'
    }else{
      url = stockManageURL.selectStockInfo

    }
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.updatedata = []
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        if(this.isRoute){
          this.dataSet1 = res.data && res.data.data || [];
          this.totalPage = res.data&& res.data.total;
        }else{
          this.dataSet1 = res.data.data && res.data.data.data || [];
          this.totalPage = res.data.data && res.data.data.total;
        }
      }
    });
  }

  btnClick(data:any){
    switch (data.buttonId) {
      case 'Define':
        this.btnDefine();
        break
      case 'into':
        this.btnExport();
        break
      default:
        break
    }
  }

  btnExport(){
    let url = stockManageURL.exportStockInfo;
    let param = this.tempSearchParam;
    this.anhttp.post(url,param , {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `库存.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  btnDefine(){
    this.updatedata.forEach(item=>{
      this.routeData.push(item)
    })
    let url;
    if(this.isPlan == 'true'){
      url = '/system/stock-manage/stock-in-manage/stockOutPlannedRegistration'
    }else{
      url = '/system/stock-manage/stock-in-manage/stockOutRegistration'
    }
    sessionStorage.setItem('data',JSON.stringify(this.routeData))
    this.router.navigate([url], {
      queryParams: {
        isRoute:true
      }
    }).then(r => console.log(r));
  }

  selectData(data:any){
    this.updatedata = data
  }


  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.searchList(this.tempSearchParam);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.searchList(this.tempSearchParam);
  }
}
