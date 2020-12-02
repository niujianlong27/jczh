import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {HttpClient } from '@angular/common/http';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {CommonService} from '@service/common.service';
import {DISPURL} from '@model/dispUrl';
@Component({
  selector: 'app-entrust-info',
  templateUrl: './entrust-info.component.html',
  styleUrls: ['./entrust-info.component.css']
})
export class EntrustInfoComponent implements OnInit {
  loading: boolean;
  updatedata: any = [];
  dataSet: any = [];
  totalPage: any = 0;
  pageSize1: any = 30;
  totalPages2: any = 0;
  listLoading2: any;
  dataSet2: any;
  pageSize2: any = 30;
  tempSearchParam: any;
  tOrders: any;
  buttonId: any;
  dataSet3 = [];
  gridOneHeight: string;
  gridTwoHeight: string;
  totalWeight = 0;
  totalPageAll = 0;
  noCompleteWeight = 0;
  completeWeight = 0;
  caculateEnameArr: any = [
    {field: 'allWeight', tipInfo: '已选总重量', tipInfoType: '吨', demLength: 3},
    {field: 'totalWeight', tipInfo: '已选待委托重量', tipInfoType: '吨', demLength: 3},
  ];

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService, private cm: CommonService, private httpp: HttpClient) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1});
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    const url = TRANS_URLS.getEntrustInfo;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.dataSet.forEach(item => {
          if (item.carrierCompanyName == undefined) {
            item.carrierCompanyName = item.carrierUserName;
          }
        });
      }
    });
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  updateDataResult(data: any) {
    this.updatedata = data;
    if (data.length > 0) {
      this.getList2({tOrders: data});
      this.getList3({tWaybillModels: data});
    } else {
      this.dataSet2 = [];
      this.dataSet3 = [];
    }
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.listSearch(this.tempSearchParam);
  }

  getList2(data: any) {
    const url = TRANS_URLS.getEntrustInfoItem;
    this.listLoading2 = true;
    const param: any = {};
    this.tOrders = data.tOrders;
    param.tOrders = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.listLoading2 = false;
        this.dataSet2 = res.data.data && res.data.data.data || [];
        this.totalPages2 = res.data.data && res.data.data.total || [];
      }
    });
  }

  getPageIndex2(page: any) {
    this.getList2({page: page, length: this.pageSize1, tOrders: this.tOrders});
  }
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2, tOrders: this.tOrders});
  }
  btnclick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Withdraw':
        this.btnWitchdraw();
        break;
      case  'Export' :
        this.exportExcel(this.tempSearchParam);
        break;
      default:
        break;
    }


  }

  exportExcel(data: any[]) {
    const url = TRANS_URLS.exportExcelALLWT ;    // 接口的地址
    const currentTime = new Date();
    const month = currentTime.getMonth() + 1;
    // tslint:disable-next-line:max-line-length
    const formatDateTime = currentTime.getFullYear() + '-' + month + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
    console.log(formatDateTime);
    // data = [{taskId: data[0].taskId}, {taskId: data[data.length - 1].taskId}];    //  设定格式
    //  发送http请求
    let param;
/*    const tempArr: Array<any> = [];
    for (let i = 0; i <data.length ; i++) {

      const obj = {'orderNo': data[i].orderNo};
      tempArr.push(obj);
      // @ts-ignore

    }*/
    param = data;
    this.httpp.post(url, param, {
      responseType: 'blob', headers: {'Content-type': 'application/json'}
    }).subscribe((response: any) => {
      // 调用html5 中的api来接收后台回传的文件
      const blob = new Blob([response], {type: 'application/vnd.ms-excel'});
      //  定义文件的url
      const fileUrl = window.URL.createObjectURL(blob);
      // dom操作 定义a节点 然后 通过 a href download 来下载文件
      const a = window.document.createElement('a');
      a.href = fileUrl;
      // 定义存储的文件名为   车辆调度信息+“yyyy-mm-dd hh:mm:ss”
      a.download = '委托查询信息' + formatDateTime + '.xlsx';
      // dom操作  在body中添加节点 然后触发点击事件 并移除该节点
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

  }


  /*
   * 撤回
   */

  btnWitchdraw() {
    if (this.updatedata.length !== 1) {
      this.nz.error('提示信息', '请勾选一条数据');
      return;
    }
    if (this.updatedata[0].orderSourceName !== '定向委托') {
      this.nz.error('提示信息', '只能撤回定向委托的数据');
      return;
    }
    if (this.cm.canOperate(this.updatedata, 'orderSource', ['WTLY10', 'WTLY30', 'WTLY50', 'WTLY60', 'WTLY70'], '该数据不是来源于定向委托，不可撤回')) {
      return;
    }
    if (this.cm.canOperate(this.updatedata, 'status', ['ETST40'], '该数据已撤回，不可再次撤回')) {
      return;
    }

    const url = TRANS_URLS.returnEntrust;
    const param = this.updatedata[0];
    this.http.post(url, param).then(res => {
      if (res.success) {
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.listSearch(this.tempSearchParam);
      }
    });
  }


  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  getList3(data: any) {
    this.http.post(TRANS_URLS.getWaybillinfo, data).then(res => {
      if (res.success) {
        console.log(res);
        this.dataSet3 = res.data && res.data.data || [];
        // this.totalPages3 = res.data.data&&res.data.data.total||[];
        // let sumWeight:any =0;
        // let sumCompleteWeight :any = 0;
        // let sumNoCompleteWeight :any = 0;
        // this.dataSet3.forEach(item=>{
        //   debugger
        //   sumWeight +=Number(item.preTotalWeight);
        //   if(item.status==='TDZT30'){
        //     sumCompleteWeight+=Number(item.preTotalWeight);
        //   }else{
        //     sumNoCompleteWeight += Number(item.preTotalWeight);
        //   }
        // })
        // this.totalWeight = sumWeight;
        // this.totalPageAll = res.data.data.length;
        // this.completeWeight = sumCompleteWeight;
        // this.noCompleteWeight = sumNoCompleteWeight;
      }
    });

  }

  /*
 *    数字NAN修改为0
 */
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }

  updateDataResult3(data: any) {
    let sumWeight: any = 0;
    let sumCompleteWeight: any = 0;
    let sumNoCompleteWeight: any = 0;
    data.forEach(item => {
      sumWeight += Number(item.preTotalWeight);
      if (item.status === 'YDZT30') {
        sumCompleteWeight += Number(item.preTotalWeight);
      } else {
        sumNoCompleteWeight += Number(item.preTotalWeight);
      }
    });
    this.totalWeight = sumWeight;
    this.totalPageAll = data.length;
    this.completeWeight = sumCompleteWeight;
    this.noCompleteWeight = sumNoCompleteWeight;
  }
}
