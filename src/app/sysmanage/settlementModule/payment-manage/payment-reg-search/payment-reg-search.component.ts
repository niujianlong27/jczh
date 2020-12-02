import {Component, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {environment} from '../../../../../environments/environment';
import {localUrls} from '@model/localUrls';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-payment-reg-search',
  templateUrl: './payment-reg-search.component.html',
  styleUrls: ['./payment-reg-search.component.css']
})
export class PaymentRegSearchComponent implements OnInit {

  tplModal: NzModalRef; // 错误弹窗

  // 主表单
  totalPages: Number = 1; // 总共页数
  pageSize: number = 30; // 条数
  listLoading: boolean = false; // 加载装态
  listLoading2: boolean = false;
  dataSet: Array<any> = []; // 数据
  selectData: Array<any> = []; // 选中数据
  isMulti: boolean = true; // 是否多选
  clickData: any; // 点击时数据
  searchData: any; // 搜索时数据

  // 子表单
  tempRowid: any;
  childrenDataSet: Array<any> = []; // 数据
  selectDataChild: Array<any> = []; // 选中数据
  isMultiChild: boolean = false; // 是否多选
  tabArr = [
    {name: '详细信息', index: 0}
  ];
  gridOneHeight: string;
  gridTwoHeight: string;
  // 表单公共部分
  showChildrenList: boolean = false; // 是否展示子列表
  trSelectedShow: boolean = false;
  caculateEnameArr: any = [
    {field: 'priceAmount', tipInfo: '已选付款金额', tipInfoType: '元', demLength: 2}
  ];

  constructor(private http: HttpUtilService,
              private nm: NzModalService,private anhttp: HttpClient,
              private nz: NzNotificationService,
              private angularHttp: HttpClient
  ) {
  }

  ngOnInit() {
   // this.listSearch({ page: 1, length: this.pageSize });
  }

  // 主列表刷新数据
  listSearch(data: any): void {
    data.page = data.page || 1; // 最好有
    data.length = data.length || this.pageSize; // 最好有
    this.searchData = data;
    this.getList(data);
  }

  // 主列表数据获取
  getList(data: any): void {
    const url = `${environment.baseUrlSettle}paypayment/selectByPayPatmentByLook`;
    this.listLoading = true;
    this.dataSet = [];
    this.http.post(url, data).then((res: any) => {
        if (res.success) {
          this.listLoading = false;
          this.dataSet = res.data.data && res.data.data.data || [];
          this.totalPages = res.data.data && res.data.data.total || 0;
        }
      }
    );
  }

  // 子列表数据获取
  getListChild(): void {
    const url = `${environment.baseUrlSettle}payment/getSelectByRegister`;
    this.listLoading2 = true;
    this.childrenDataSet = [];
    const tPaymentModels = [];
    this.selectData.forEach(
      res => {
        tPaymentModels.push({payPaymentNo: res.payPaymentNo});
      }
    );
    // payPaymentNo
    this.http.post(url, {tPaymentModels: tPaymentModels}).then((res: any) => {
        this.listLoading2 = false;
        if (res.success) {
          this.childrenDataSet = res.data.data || [];
        }
      }
    );
  }

  // 按钮点击
  btnClick(data: any): void {
    console.log(data);
    let url: string;
    let successTip: string;
    let param: any = {tPayPaymentModels: []};
    if (data.buttonId === 'export') {
      this.export();
      return;
    }else if(data.buttonId === 'kingdeeExport'){
        this.JDExport();
        return;
    } else if (data.buttonId === 'Delete') { // 作废按钮
      if (this.selectData.length == 0) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作'
        });
        this.destroyTplModal();
        return;
      }
      url = `${environment.baseUrlSettle}paypayment/delectPayPaymentCancellation`;
      successTip = '作废成功';
      for (const selectDatum of this.selectData) {
        param.tPayPaymentModels.push({rowid: selectDatum.rowid});
      }
    } else if (data.buttonId === 'Detail') {// 作废明细按钮
      if (this.selectDataChild.length == 0) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作'
        });
        this.destroyTplModal();
        return;
      }
      url = `${environment.baseUrlSettle}payment/getDelectPaymentCancellation`;
      successTip = '作废明细成功';
      param = this.selectDataChild[0];
    }

    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', successTip, {nzDuration: 3000});
          if (data.buttonId === 'Delete') {
            this.listSearch(this.searchData);
            this.selectData = [];
            this.childrenDataSet = [];
          } else {
            this.listSearch(this.searchData);
            this.childrenDataSet = [];
            // this.getListChild();
            this.selectDataChild = [];
            this.childrenDataSet = [];
          }
        }
      }
    );

  }

  // 主列表点击
  listClick(data: any): void {
    this.dataSet.forEach(item => {
      if (item.payPaymentNo === data.payPaymentNo) {
        item.checked = !item.checked;
      }
    });

    this.updateData(this.dataSet.filter(item => item.checked));
  }

  // 主列表选中数据
  updateData(data: any): void {
    this.selectData = data;
    this.childrenDataSet = []; // 子列表数据清空
    this.selectData[0] && this.getListChild();
  }

  // 子列表选中数据
  updataDataChild(data: any): void {
    this.selectDataChild = data;
  }

  export() {
    let url: any = localUrls.exportByPayPatment;
    this.angularHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/xlsx'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `财务付款查询.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  // 错误弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }


  /*
  *  金蝶导出
  */
  JDExport(){
    if(this.selectData.length<=0){
      this.nz.warning('提示信息','请勾选数据')
      return;
    }
    if(this.selectData.filter(x=>x.payTheTagCode==='ZFBJ30').length !==this.selectData.length){
      this.nz.warning('提示信息','请勾选付款成功的数据！')
      return;
    }
    const url = `${environment.baseUrlSettle}kingDee/exportPayPaymentData`;
    this.anhttp.post(url, {tPayPaymentModels:this.selectData}, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `金蝶导出.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

}
