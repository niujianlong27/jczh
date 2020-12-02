import {Component, OnInit} from '@angular/core';
import {urls} from '../../../../common/model/url';
import {localUrls} from '../../../../common/model/localUrls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {GlobalService} from '../../../../common/services/global-service.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.css']
})
export class FeeSearchComponent implements OnInit {

  //tab头
  //tabArr:Array<any> = [{name:'结算单',gridId:'grid1'},{name:'费用信息（可操作）',gridId:'grid2'},{name:'费用明细',gridId:'grid3'}];
  //表格数据
  dataSet1: Array<any> = [];
  dataSet2: Array<any> = [];
  dataSet3: Array<any> = [];
  // 条数
  pageSize: number = 30;
  // list加载状态
  listLoading: boolean = true;
  // 总条数
  totalPage1: number;
  totalPage2: number;
  totalPage3: number;
  // 作废弹窗
  //弹窗显示
  modalVisible: boolean = false;
  //弹窗标题
  modalTitle: string;
  //弹窗数据
  modalCon: string;
  gridId: string = 'grid1';//gridId默认1
  tabIndex: number = 0;//面板默认为第一个
  isCheckBox: boolean = true;//有没有选择框
  selectDataArr = [];//选中的数据

  selectDataListTwo = [];//费用信息中选中的数据
  tempParam: any;
  caculateEnameArr: any = [
    {field: 'weight', tipInfo: '已选重量', tipInfoType: '吨', demLength: 3},
    {field: 'totalPrice', tipInfo: '总价', tipInfoType: '元', demLength: 2},
  ];

  searchParam: any = {};

  constructor(private http: HttpUtilService, private nn: NzNotificationService, private gl: GlobalService, private  angularHttp: HttpClient) {
  }

  ngOnInit() {
  //  this.getListSearch(urls.selectSettleByOrder, {page: 1, length: 30}, 'grid1');//默认查询结算单
  }

  //查询
  listSearch(data: any): void {
    this.tabIndex = 0;
    this.gridId = 'grid1';
    data.page = data.page || 1;
    data.length = data.length || 30;
    this.selectDataArr = [];
    this.selectDataListTwo = [];
    this.searchParam = data;
    this.getListSearch(urls.selectSettleByOrder, data, 'grid1');
  }

  // 列表查询数据获取
  getListSearch(url: string, param: any, type: string): void {
    this.listLoading = true;
    this.http.post(url, param).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        if (type === 'grid1') {
          this.dataSet1 = res.data.data.data;
          this.totalPage1 = res.data.data.total;
          this.dataSet1.map((x: any) => {
            this.selectDataArr.map((y: any) => {
              (x.settleNo === y.settleNo) && (x.checked = true);
            });
          });
        } else if (type === 'grid2') {
          this.dataSet2 = res.data.data.data;
          this.totalPage2 = res.data.data.total;
          this.dataSet2.map((x: any) => {
            this.selectDataListTwo.map((y: any) => {
              (x.settleNo === y.settleNo) && (x.checked = true);
            });
          });
        } else if (type === 'grid3') {
          this.dataSet3 = res.data.data.data;
          this.totalPage3 = res.data.data.total;
        }

      }
    });
  }

  tabResultFun(flag: string) {
    if (this.gridId === flag) {
      return;
    }
    let settleNo = [];
    this.selectDataArr.map((data: any) => {
      settleNo.push(data.settleNo);
    });
    window.setTimeout(() => {
      // this.gridId = flag.gridId;
      //  this.dataSet = [];
      if (flag === 'grid1') {
        this.tabIndex = 0;
        this.gridId = 'grid1';
        //   this.selectDataArr = [];
        this.dataSet1 = [];
       // this.getListSearch(urls.selectSettleByOrder, {page: 1, length: 30}, flag);
       this.getListSearch(urls.selectSettleByOrder, {...this.searchParam}, flag);
      } else if (flag === 'grid2') {
        if (this.selectDataArr.length < 1) {
          this.nn.warning('提示消息', '请选择数据!');
          this.tabIndex = 1;
          this.gridId = 'grid2';
          this.dataSet2 = [];
          return;
        }
        this.tabIndex = 1;
        this.gridId = 'grid2';
        this.dataSet2 = [];
        this.tempParam = settleNo.join(',');
        this.getListSearch(urls.selectFee, {page: 1, length: 30, settleNo: settleNo.join(',')}, flag);
      } else if (flag === 'grid3') {
        if (this.selectDataArr.length < 1) {
          this.nn.warning('提示消息', '请选择数据!');
          this.tabIndex = 2;
          this.gridId = 'grid3';
          this.dataSet3 = [];
          return;
        }
        this.tabIndex = 2;
        this.gridId = 'grid3';
        this.dataSet3 = [];
        this.getListSearch(urls.selectOrderFee, {page: 1, length: 30, settleNo: settleNo.join(',')}, flag);
      }
    });
  }

  /* pageIndexFun(n:number){

   }
   pageSizeFun(n:number){

   }*/
  modalConfirmResult(flag: any) {

    if (flag.type === 'cancel') {
      this.modalVisible = false;
    } else {
      let param = [];
      this.selectDataListTwo.forEach((element) => {
        let obj = {};
        obj['rowid'] = element.rowid;
        param.push(obj);
      });
      this.http.post(localUrls.feeSearchDelUrl, {tSettleFeeModel: param}).then(
        (res: any) => {
          this.modalVisible = false;
          if (res.success) {
            this.nn.create('success', '提示信息', '作废成功', {nzDuration: 3000});
            this.selectDataListTwo = [];
            this.getListSearch(urls.selectFee, {page: 1, length: this.pageSize, settleNo: this.tempParam}, 'grid2');
          }
        }
      );
    }
  }

  selectData(data: any) {
    if (this.gridId === 'grid1') {
      this.selectDataArr = data;
    }//用于后面查询的
    if (this.gridId === 'grid2') {
      this.selectDataListTwo = data;
    }
  }

  btnClick(data: any): void {
    if (data.buttonId === 'Invalid') {
      if (!this.selectDataListTwo[0]) {
        this.gl.modalOpen({type: 'warning', title: '提示信息', content: '请在费用信息（可操作）选择数据进行操作'});
        return;
      }
      this.modalTitle = '费用登记查询作废操作确认';
      this.modalVisible = true;
      this.modalCon = '确定将勾选的数据进行作废？';
    }
    if (data.buttonId === 'export') {
      this.angularHttp.post(localUrls.export,this.searchParam, {responseType: 'blob',}).subscribe(
        res => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
          let objectUrl = URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = objectUrl;
          a.target = '_blank';
          a.download = `费用登记.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      );
    }
  }
}
