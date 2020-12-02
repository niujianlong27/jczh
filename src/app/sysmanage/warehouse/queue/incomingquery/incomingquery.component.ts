import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {WAREHOUSEURL} from '@model/warehouseUrl';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-incomingquery',
  templateUrl: './incomingquery.component.html',
  styleUrls: ['./incomingquery.component.css']
})
export class IncomingqueryComponent implements OnInit {

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
  isVisible   = false; // 运输过程弹框
  modalTitle  = '任务运输过程'; // 弹框的标题
  vehicleNum  = 0; // 车辆数
  totalWeight = 0; // 总重量
  dataSet1: any; // 运输任务过程数据
  flag = true;
  constructor(
    private http: HttpUtilService,
    private nz: NzNotificationService,
    private nm: NzModalService,
    private  angularHttp: HttpClient,
  ) {
  }

  ngOnInit() {
    this.getTabs();
    this.listSearch({page: 1, pageSize: 30});
  }

   // 静态数据获取
public staticData = (code: string) => new Observable((observe) => {
  this.getStatic(code, observe);
})
private getStatic(code: string, ob?: any){
 let url = WAREHOUSEURL.GETALLCODESETS;
 let param: any = {codesetCode: code, status: 'product_disp.codeset_status_10'};
 let key = 'itemCname';
 let value = 'itemCode';
 if (code === 'getWarehouseName') {
     url = WAREHOUSEURL.GETALLWAREHOUSE;
     param = {};
     key = 'warehouseName';
     value = 'warehouseCode';
 } else if (code === 'product_disp.matKind') {
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
 );
}


  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.status = this.tempSearchParam.status ? this.tempSearchParam.status : '';
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    this.totalWeight = 0; // 当点击上面的tab，对总重量进行重置
    this.vehicleNum = 0; // 当点击上面的tab，对车辆数目进行重置
    const url = WAREHOUSEURL.INFACTORYGETRECORDS;
    const url1 = WAREHOUSEURL.INFACTGETNUMBYSTATUS;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.updateData = [];
        this.dataSet = res.data.data && res.data.data.data || [];
        this.vehicleNum = res.data.data.data.length;
        res.data.data.data.forEach(element => {
          this.totalWeight += Number(element.netWeight);
        });
        console.log(this.totalWeight);
        this.totalWeight = Number(this.totalWeight.toFixed(2));
        this.totalPage = res.data.data && res.data.data.total || 0;
      }
    });
    this.http.post(url1, {status: ''}).then(res => {
      if (res.success) {
        this.tabs.forEach(item => {
          item.itemCount = 0;
        });
        for (let i = 0 ; i < res.data.data.length ; i++) {
          for ( let j = 1 ; j < this.tabs.length ; j++ ) {
            if ( res.data.data[i].status.startsWith(this.tabs[j].itemCode)) {
              this.tabs[j].itemCount = res.data.data[i].ct;
              this.tabs[0].itemCount += res.data.data[i].ct;
            }
          }
          // this.tabs[0].itemCount += res.data.data[i].ct;
        }
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
    // console.log(data.buttonId)
    switch (this.buttonId) {
      case 'Delete':
        this.deleteData(this.updateData);
        break;
        case 'Export':
          this.exportExcel();
          break;
          case 'Confirm':
            this.confirm(this.updateData);
            break;
          case 'Transprog':
            this.trans(this.updateData[0]);
            break;

    }
  }

  // 获取表头
  getTabs(): void {
    this.tabs.push({ itemCname: '全部', itemCode: '', itemCount: 0 , status: ''});
    this.tabs.push({ itemCname: '超时或已取消', itemCode: 'status_00_01', itemCount: 0, status: 'product_disp_queue_status_0'});
    this.tabs.push({ itemCname: '十公里已取号', itemCode: 'status_10_13_17', itemCount: 0, status: 'product_disp_queue_status_1[037]'});
    this.tabs.push({ itemCname: '已叫号', itemCode: 'product_disp_queue_status_18', itemCount: 0, status: 'product_disp_queue_status_18'});
    this.tabs.push({ itemCname: '已入厂', itemCode: 'product_disp_queue_status_20', itemCount: 0, status: 'product_disp_queue_status_20'});
    this.tabs.push({ itemCname: '已完成', itemCode: 'product_disp_queue_status_6',  itemCount: 0, status: 'product_disp_queue_status_6'});
  }

  // tab切换
  selectChange(data: any) {
    console.log(data);
    if (data === 'product_disp_queue_status_20') {
      this.flag = false;
    } else {
      this.flag = true;
    }
    this.tempSearchParam.status = data ;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 查看运输过程
   * @param data 
   */
  trans(data) {
    if (data === undefined) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请勾选一条数据'
      });
      return;
    }
    this.http.post(WAREHOUSEURL.INFACTORYPRO, {taskId: data.taskId}).then(
      (res: any) => {
        if (res.success) {
          this.dataSet1 = res.data.data.data;
        }
      }
    );
    this.isVisible = true;
  }


   // 删除
   private deleteData(data: any) {
    if (data.length  !== 1 ) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改'
      });
      return;
    }
    const taskId = data[0].taskId;
    this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: '确定要将选中的数据进行删除操作?',
      nzOnOk: () => new Promise((resolve, reject) => {
         this.http.post(WAREHOUSEURL.INFACTORYDEL, {'taskId': taskId}).then(
           (res: any) => {
             if (res.data.code === 100) {
                 resolve();
                 this.getList(this.tempSearchParam);
                 this.nm.success({
                   nzTitle: '提示信息',
                   nzContent: '删除成功'
                 });
             } else {
               reject();
             }
           }
         );
      })
    });
  }

  /**
   * 确认出厂
   */
  confirm(data) {
    if (data.length  !== 1 ) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行操作'
      });
      return;
    }
    if (data[0].status  === 'product_disp_queue_status_60' ) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '该任务已出厂，请勿重复操作'
      });
      return;
    }
    const taskId = data[0].taskId;
    this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: '确定要确认出厂吗?',
      nzOnOk: () => new Promise((resolve, reject) => {
         this.http.post(WAREHOUSEURL.INFACTORYCONFIRM, {'taskId':taskId}).then(
           (res: any) => {
             if (res.data.code === 100) {
                 resolve();
                 this.getList(this.tempSearchParam);
                 this.nm.success({
                   nzTitle: '提示信息',
                   nzContent: res.data.msg
                 })
             } else {
               reject();
             }
           }
         );
      })
    });
  }

  /**
   * 导出
   */
  exportExcel() {
      const url: any = WAREHOUSEURL.INFACTORYEXPORT;
      const param: any = this.tempSearchParam;
      this.angularHttp.post(url, param, {responseType: 'blob'}).subscribe((res: any) => {
        var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
        var objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `入厂车辆导出.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
}
