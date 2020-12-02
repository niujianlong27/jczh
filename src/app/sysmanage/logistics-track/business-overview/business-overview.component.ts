import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../common/services/http-util.service';//引入自定义封装的http,实现与后台服务器接口对接
import {FormBuilder, FormGroup} from '@angular/forms';
import {environment} from '../../../../environments/environment'; //引入环境配置
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';//引入ngzorro库的相关组件，从而实现弹窗，信息提示和文件上传功能
import { GlobalService } from '../../../common/services/global-service.service';
import { urls } from '../../../common/model/url';
import {trackUrl} from '../../../common/model/trackUrl';

@Component({
  selector: 'app-business-overview',
  templateUrl: './business-overview.component.html',
  styleUrls: ['./business-overview.component.css']
})
export class BusinessOverviewComponent implements OnInit {


  //tab头
  //tabArr:Array<any> = [{name:'结算单',gridId:'grid1'},{name:'费用信息（可操作）',gridId:'grid2'},{name:'费用明细',gridId:'grid3'}];
  //表格数据
  dataSet1:Array<any>=[];
  dataSet2:Array<any>=[];
  dataSet3:Array<any>=[];

  pageSize: number = 30;//条数
   // 总条数
  totalPage1:number;
  totalPage2:number;
  totalPage3:number;
  gridId:string = 'grid1';//gridId默认1
  tabIndex:number = 0;//面板默认为第一个
  
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;

  constructor(private http: HttpUtilService, private nn: NzNotificationService, private gl: GlobalService) { }

  ngOnInit() {
    this.listSearch({page:1,length:30})
    // this.getListSearch(trackUrl.selectTransPlanBusinessOverview,{page:1,length:30},'grid1');//默认查询结算单
  }

   // 列表查询数据获取
   getListSearch(url:string,param: any,type:any):void {
    this.listLoading = true;
     this.http.post(url,param).then( (res:any)=>{
       this.listLoading = false;
       if(res.success){
          if(type === 'grid1'){
            this.dataSet1 = res.data.data.data;
            this.totalPage1 = res.data.data.total;
          }else if(type === 'grid2'){
            this.dataSet2 = res.data.data.data;
            this.totalPage2 = res.data.data.total;
          }else if(type === 'grid3'){
            this.dataSet3 = res.data.data.data;
            this.totalPage3 = res.data.data.total;
          }
         
       }
     })
  }

 //查询
 listSearch(data:any):void {
  this.tabIndex = 0;
  this.gridId = 'grid1';
  data.page = data.page || 1;
  data.length = data.length || 30;
  this.getListSearch(trackUrl.selectTransPlanBusinessOverview,data,'grid1');
}


//点击表头出现对应表格
  tabResultFun(flag:string){
    if(this.gridId === flag){
       return;
    }
    let settleNo = [];
    
    window.setTimeout(()=>{
     // this.gridId = flag.gridId;
    //  this.dataSet = [];
      if(flag === 'grid1'){
        this.tabIndex = 0;
        this.gridId = 'grid1';
        this.dataSet1 = [];
        this.getListSearch(trackUrl.selectTransPlanBusinessOverview,{page:1,length:30},flag);
      }else if(flag === 'grid2'){
        this.tabIndex = 1;
        this.gridId = 'grid2';
        this.dataSet2 = [];
        this.getListSearch(trackUrl.selectOrderBusinessOverview,{page:1,length:30},flag);
      }else if(flag === 'grid3'){
        this.tabIndex = 2;
        this.gridId = 'grid3';
        this.dataSet3 = [];
        this.getListSearch(trackUrl.selectWaybillPackTransInfo,{page:1,length:30},flag);
      }
    })
  }
  btnClick(data:any):void{
    console.log(data);

  }

}
