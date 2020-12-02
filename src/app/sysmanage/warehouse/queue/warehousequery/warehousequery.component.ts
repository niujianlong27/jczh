import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {WAREHOUSEURL} from '@model/warehouseUrl';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-warehousequery',
  templateUrl: './warehousequery.component.html',
  styleUrls: ['./warehousequery.component.css']
})
export class WarehousequeryComponent implements OnInit {

  dataSet: Array<any> = []; // 结果集
  loading = false; // 页面查询加载
  pageSize = 30; // 页面显示数据条数
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  tplModal: NzModalRef; // 操作成功后弹窗属性
  buttonId = '';
  carNum: Number = 0; // 页面序号
  tabs: Array<any> = []; // 页面数组
  tempSearchParam: any = {}; // 保存查询数据
  isVisible:boolean=false; // 运输过程弹框
  modalTitle: string = '任务运输过程';//弹框的标题
  vehicleNum:number=0; //车辆数
  totalWeight=0; //总重量
  dataSet1: any; // 运输任务过程数据
  constructor(
    private http: HttpUtilService,
    private nz: NzNotificationService,
    private nm: NzModalService,
    private  angularHttp: HttpClient,
  ) {
  }

  ngOnInit() {
    this.getTabs();
    this.listSearch({page:1,pageSize:30});
  }

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
 } else if (code === 'product_disp.matkind') {
  url = WAREHOUSEURL.GETALLMAT;
  param = {};
  key = 'matKindName';
  value = 'matKindCode';
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
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.statusType = this.tempSearchParam.statusType ? this.tempSearchParam.statusType : '';
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    this.totalWeight=0;//当点击上面的tab，对总重量进行重置
    this.vehicleNum=0;//当点击上面的tab，对车辆数目进行重置
    const url = WAREHOUSEURL.INWAREHOUSEGETRECORDS;
    const url1 = WAREHOUSEURL.GETNUMBYSTATUS;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.updateData = [];
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.vehicleNum = res.data.data.data.length;
        res.data.data.data.forEach(element => {
          this.totalWeight += Number(element.netWeight);
        });
        this.totalWeight=Number(this.totalWeight.toFixed(2));
      }
    });
    this.http.post(url1, {}).then(res => {
      if (res.success) {
        this.tabs.forEach(item => {
          item.itemCount = 0;
        });
        for (let i = 0 ; i < res.data.data.length ; i++) {
          for ( let j = 1 ; j < this.tabs.length ; j++ ) {
              if ( res.data.data[i].statusType === this.tabs[j].itemCode ) {
                this.tabs[j].itemCount = res.data.data[i].queueCount;
                this.tabs[0].itemCount += res.data.data[i].queueCount;
              }
          }
        }
        // for (let i = 0 ; i < res.data.data.length ; i++) {
        //   for ( let j = 1 ; j < this.tabs.length ; j++ ) {
        //     if ( res.data.data[i].status.startsWith(this.tabs[j].itemCode)) {
        //       this.tabs[j].itemCount = res.data.data[i].ct;
        //       this.tabs[0].itemCount += res.data.data[i].ct;
        //     }
        //   }
          // this.tabs[0].itemCount += res.data.data[i].ct;
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
    this.buttonId = data.buttonId;
    switch(this.buttonId){
      case 'Export':
        this.exportExcel();
        break;
    }
  }

  // 获取表头
  getTabs(): void {
    this.tabs.push({ itemCname: '全部', itemCode: '', itemCount: 0 });
    this.tabs.push({ itemCname: '超时或过号', itemCode: '1', itemCount: 0});
    this.tabs.push({ itemCname: '已签到', itemCode: '2', itemCount: 0});
    this.tabs.push({ itemCname: '待入库', itemCode: '3', itemCount: 0 });
    this.tabs.push({ itemCname: '已入库', itemCode: '4', itemCount: 0});
    this.tabs.push({ itemCname: '已挑库', itemCode: '5',  itemCount: 0});
  }

  // tab切换
  selectChange(data: any) {
    //debugger;
    this.tempSearchParam.statusType = data ;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 导出
   */
  exportExcel(){
      let url: any = WAREHOUSEURL.INWAREHOUSEEXPORT;
      let param:any=this.tempSearchParam;
      this.angularHttp.post(url, param, {responseType: 'blob'}).subscribe((res: any) => {
        var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
        var objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `入库车辆数据.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
    }
}
