import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {WAREHOUSEURL} from '@model/warehouseUrl';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserinfoService } from '@service/userinfo-service.service';
@Component({
  selector: 'app-transquery',
  templateUrl: './transquery.component.html',
  styleUrls: ['./transquery.component.css']
})
export class TransqueryComponent implements OnInit {

  dataSet: Array<any> = []; // 结果集
  loading = false; // 页面查询加载
  pageSize = 30; // 页面显示数据条数
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  buttonId = '';
  tempSearchParam: any = {};
  tabs: Array<any> = []; // tab数组
  initQueueType = '2'; // 任务类型
  warehouseCodeArr: Array<any> = [];
  constructor(
    private http: HttpUtilService,
    private  angularHttp: HttpClient,
    private info: UserinfoService
  ) {
  }

  ngOnInit() {
   this.getTabs();
   this.getWarehouse();
   // this.listSearch({page: 1, pageSize: 30, queueType: 2});
  }

  /**
   * 获取仓库
   */
  getWarehouse(){
    this.http.post( `${environment.baseUrlSystem}roleButton/getUserButtons`, {'userId' : this.info.get('USER').userId , 'formId':'form_queue_product_ware_right'}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data);
          res.data.data.map(x => {
            this.warehouseCodeArr.push(x.buttonId);
            console.log(this.warehouseCodeArr);
          });
            this.tempSearchParam.warehouseCode = this.warehouseCodeArr.join(',');
            this.listSearch({page:1,pageSize:30}); 
        }
      }
    );
  }

  /**
   * 设置表头
   * @param data
   */
  getTabs() {
    this.tabs.push({ itemCname: '入厂运输任务过程查询', queueType: '2'});
    this.tabs.push({ itemCname: '入库运输任务过程查询', queueType: '3'});
  }

      // f
 // 静态数据获取
public staticData = (code: string) => new Observable((observe) => {
  this.getStatic(code,observe);
})
private getStatic(code: string, ob?: any){
 let url = WAREHOUSEURL.GETALLCODESETS;
 let param:any = {codesetCode: code, status: 'product_disp.codeset_status_10'};
 let key = 'itemCname';
 let value = 'itemCode';
 if (code === 'getWarehouseName') {
     url = WAREHOUSEURL.GETALLWAREHOUSE;
     param = {};
     key = 'warehouseName';
     value = 'warehouseCode';
 }
 if (code === 'form_queue_product_ware_right') {
  url = `${environment.baseUrlSystem}roleButton/getUserButtons`;
  param = {
    userId: this.info.get('USER').userId,
    formId: code
  };
  key = 'buttonName';
  value = 'buttonId';
}
 this.http.post(url, param).then(
   (res: any) => {
     if (res.success) {
         const data = (res.data.data || []).map((x: any) => ({name: x[key], value: x[value]}));
        //  if (code === 'product_disp.queueClass') { // 排队优先级
        //       this.queueClass = [...data];
        //  } else if (code === 'product_disp.ruleStatus') { // 状态
        //       this.ruleStatus = [...data];
        //  } else if (code === 'getKindName') { // 分类名称
        //       this.kindArr = [...data];
        //  } else if (code === 'getWarehouseName') { //仓库名称
        //       this.warehouseArr = [...data];
        //  } else if (code === 'product_disp.gate') { // 可入厂大门
        //       this.gateArr = [...data];
        //  }
        // if(code === 'form_queue_product_ware_right'){
        //     data.map( x => {
        //       this.warehouseCodeArr.push(x.value);
        //     });
        // }
        ob && ob.next(data);
     } else {
        ob && ob.error();
     }
   }
 )
}

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    console.log(data);
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.queueType = this.tempSearchParam.queueType ? this.tempSearchParam.queueType : this.initQueueType;
    // if (data.queryParameterList && data.queryParameterList.some(x => x.parameter === 'warehouseName')){
    //   data.warehouseCode = undefined;
    // } else {
    data.warehouseCode = this.tempSearchParam.warehouseCode;
    // }
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    const url = WAREHOUSEURL.TRANSQUERYGETRECORDS;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      console.log(data);
      if (res.success) {
        console.log(res);
        this.loading = false;
        this.updateData = [];
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
    this.updateData = data;
  }

  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnClick(data: any) {
    console.log(data.buttonId);
    // console.log(this.buttonId);
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Export':
        this.exportExcel();
        break;
    }
  }

  /**
   * 导出方法
   */
  exportExcel() {
    const url: any = WAREHOUSEURL.TRANSQUERYEXPORT;
    const param: any = this.tempSearchParam;
    this.angularHttp.post(url, param, {responseType: 'blob'}).subscribe((res: any) => {
      const blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运输任务过程导出.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /**
   * 切换tab
   */
  selectChange(data: any) {
    this.tempSearchParam.queueType = data;
    this.listSearch(this.tempSearchParam);
  }

}

