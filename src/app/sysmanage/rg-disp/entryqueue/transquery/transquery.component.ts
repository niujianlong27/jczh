import { Component, OnInit } from '@angular/core';
import {RGDISPURL} from '../../../../common/model/rgDispUrl';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-transquery',
  templateUrl: './transquery.component.html',
  styleUrls: ['./transquery.component.css']
})
export class TransqueryComponent implements OnInit {

  loading:boolean = false
  dataSet:any = []
  tempSearchParam:any
  totalPage:any
  updateData:any = []
  pageSize1:any = 30
  isShow:boolean=true;
  variable:boolean=false;

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService, private anhttp: HttpClient,) { }

  ngOnInit( ) {
    this.listSearch({page: 1, length: this.pageSize1})
  }
  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    data.variable=this.variable;//给后台传是否只显示操作记录
    this.getList1(data);
  }

  btnClick(data:any){
    switch (data.buttonId){
      case 'export':
        this.btnexport();
        break;

      default:
        break;
    }
  }
  btnexport(){
    let url =RGDISPURL.exportTransQuery;
    let param:any=this.tempSearchParam;
    this.anhttp.post(url, param, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运输任务过程导出.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }
  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url = RGDISPURL.getRecords
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        console.log(res)
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;

      }
    })
  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data:any):void{
    this.updateData = data;
  }
  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }

  modelChange(data:any){
    console.log(data)
    for(let i :number = 0;i<data.queryParameterList.length;i++){
      if(data.queryParameterList[i].parameter=='kindName'&&data.queryParameterList[i].value1=='废钢'){
        this.isShow = false
        return;
      }else{
        this.isShow = true;
      }
    }


  }

}
