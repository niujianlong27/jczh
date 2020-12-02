import {Component, OnInit} from '@angular/core';
import {localUrls} from '../../../../common/model/localUrls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {HttpClient} from '@angular/common/http';
import {urls} from '../../../../common/model/url';
import {Router} from '@angular/router';


//declare var io: any;

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.css']
})
export class PaymentConfirmComponent implements OnInit {

  printModalVisible: boolean = false;
  printModalTabIndex: number = 0;
  printModalData1: Array<any> = [];
  printModalData2: Array<any> = [];
  printModalData3: Array<any> = [];
  printModalData4: Array<any> = [];
  printModalData5: Array<any> = [];

  printModalLoading: boolean = false;
  printModalHeader: any[] = [
    {visible: 'XSBJ10', colCname: '业务时间', colEname: 'loadDate'},
    {visible: 'XSBJ10', colCname: '车属单位', colEname: 'carrierCompanyName'},
    {visible: 'XSBJ10', colCname: '付款金额', colEname: 'totalPrice', format: '2', type: 'number'},
    {visible: 'XSBJ10', colCname: '信息费', colEname: 'informationFee', format: '2', type: 'number'},
    {visible: 'XSBJ10', colCname: '开户行', colEname: 'bank'},
    {visible: 'XSBJ10', colCname: '银行账号', colEname: 'bankAccount'},
    {visible: 'XSBJ10', colCname: '联行号', colEname: 'bankNumber'},
    {visible: 'XSBJ10', colCname: '车队联系电话', colEname: 'fleetContact'},
    {visible: 'XSBJ10', colCname: '纳税人识别号', colEname: 'taxpayerIdentificationNumber'},
    {visible: 'XSBJ10', colCname: '备注', colEname: 'remark'},
  ];

  tplModal: NzModalRef;
  pageSize: number = 30;//条数
  listLoading: boolean = false;
  childlistLoading: boolean = false;
  dataSet: any = [];
  childrenDataSet: any = [];
  totalPages: Number = 1;
  children_totalPages: Number = 1;
  isMutli: boolean = false;
  listWidth: string;
  showChildrenList: boolean = true;//初始不显示子列表
  trSelectedShow: boolean = false;
  tempRowid: any;
  tabArr = [
    {name: '费用明细', index: 0},
    {name: '货物明细', index: 1},
  ];
  tabIndex: Number = 0;
  gridId: string = 'grid2';
  selectedData: Array<any> = [];//存储勾选中的数据
  currentSelectedListData: any = {}; //点击列表当前条数据
  gridOneHeight: string;
  gridTwoHeight: string;
  private searchData: any = {};
  isFleet:boolean = false;
  formId:string = 'form_pay_report_confirmation';
  constructor(private http: HttpUtilService,private router:Router, private nm: NzModalService, private nz: NzNotificationService, private  angularHttp: HttpClient, private info: UserinfoService) {
  }


//   ngOnInit() {
//     this.listSearch({ page: 1, length: this.pageSize });
//   }

  ngOnInit() {
    if (this.router.url == '/system/paymentManage/paymentConfirmFleet') {
      this.isFleet = true;
      this.formId = 'form_fleet_pay_confirmation'
    }

    // this.listSearch({page: 1, length: this.pageSize});
  }


  listSearch(data: any): void {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.getList(this.searchData);
  }

  updateData(data: any) {
    // console.log(data);
    this.selectedData = data;
    this.printModalData1 = [];
    this.printModalData2 = [];
    this.printModalData3 = [];
    this.printModalData4 = [];
    if (this.selectedData.length === 1) {
      this.printModalTab({index: this.printModalTabIndex});
    }
  }

  getList(data: any): void {
    let url = localUrls.paymentReportConfirm;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total;
      }
    });
  }

  btnClick(data: any): void {

    //对账确认按钮
    if (data.buttonId === 'confirm') {
      if (this.selectedData.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作！'
        });
        this.destroyTplModal();
        return;
      }
      let url = localUrls.paymentReportReconciliation;
      let param: any = {};

      param['payReportNo'] = this.selectedData[0]['payReportNo'];
      param.dataCompanyId = this.selectedData[0].companyId;
      param['confirmationMark'] = 'QRBJ30';

      this.http.post(url, param).then((res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '对账确认成功！', {nzDuration: 3000});
         // this.listSearch({page: 1, length: this.pageSize});
         this.searchData.page = 1;
         this.getList(this.searchData);
        }
      });
    }


    //对账确认按钮
    if (data.buttonId === 'overrule') {
      if (this.selectedData.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作！'
        });
        this.destroyTplModal();
        return;
      }
      let url = localUrls.paymentReportReconciliation;
      let param: any = {};

      param['payReportNo'] = this.selectedData[0]['payReportNo'];
      param.dataCompanyId = this.selectedData[0].companyId;
      param['confirmationMark'] = 'QRBJ50';

      this.http.post(url, param).then((res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '已驳回！', {nzDuration: 3000});
         // this.listSearch({page: 1, length: this.pageSize});
         this.searchData.page = 1;
         this.getList(this.searchData);
        }
      });
    }

    //批量导出
    if (data.buttonId === 'test') {
      // this.printModalVisible = true;
      // this.printModalTabIndex === 0 && this.printListFun(10);
      // this.printModalTabIndex = 0;
      this.handleOk(20);
    }

  }

  getChildrenListData(data: any): void {
    console.log(this.tabIndex);
    console.log(this.currentSelectedListData);
    this.childrenDataSet = [];
    this.children_totalPages = 1;
    this.childlistLoading = true;
    let url = this.tabIndex === 0 ? localUrls.paymentReportChildrenListUrl1 : localUrls.paymentReportChildrenListUrl2;
    let param = {tSettleFeeModel: [{payReportNo: this.currentSelectedListData.payReportNo}]};
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.childlistLoading = false;
          this.childrenDataSet = res.data && res.data.data || [];
          // this.children_totalPages = res.data && res.data.total;
        }
      }
    );
  }

  listClick(data: any): void {
    this.currentSelectedListData = data;
    if (data.rowid === this.tempRowid) {
      data.showChildren = !data.showChildren;
    } else {
      this.dataSet.forEach(element => {
        element.showChildren = false;
      });
      data.showChildren = true;
    }
    if (data.showChildren) {
      this.showChildrenList = true;  //控制子列表是否显示
      this.trSelectedShow = true;
      // this.tabIndex = 0;
      this.getChildrenListData({});
    } else {
      this.showChildrenList = false;
      this.trSelectedShow = false;
    }
    this.tempRowid = data.rowid;
    // console.log(data);
  }

  tabChange(data: any): void {
    setTimeout(() => {
      this.tabIndex = data.index;
      if (data.index === 0) {
        //费用明细
        this.gridId = 'grid2';
      } else {
        //货物明细
        this.gridId = 'grid3';
      }
      // console.log(this.tabIndex)
      this.getChildrenListData({});
    });
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }
  /**
   * 批量导出
   */
  batchExport() {
    this.angularHttp.get(urls.printPayReport,
      {
        responseType: 'blob',
        params: {
          tab: '10',
          payReportNos: this.selectedData[0].payReportNo,
          requestCompanyId: this.info.APPINFO.USER.companyId
        }
      }
    ).subscribe(
      res => {
        let blob = new Blob([res], {type: 'application/pdf'});
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        // a.download = `1.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    );
  }

  handleCancel() {
    this.printModalVisible = false;
  }

  handleOk(mark?) {
    switch (mark) {
      case 10: {
        this.printModalVisible = false;

      }
        break;
      case 20: {

        switch (this.printModalTabIndex) {
          case 0: {
            if (this.printModalData1.length < 1) {
              this.nz.warning('提示消息', '暂无数据，无法打印！');
              return;
            }
            const payReportNos: Array<any> = [];
            this.selectedData.map((y: any) => {
              payReportNos.push(y.payReportNo);
            });
            this.angularHttp.get(urls.printPayReport,
              {
                responseType: 'blob',
                params: {
                  tab: this.printModalTabIndex ? '20' : '10',
                  payReportNos: payReportNos.toString(),
                  requestCompanyId: this.info.APPINFO.USER.companyId
                }
              }
            ).subscribe(
              res => {
                let blob = new Blob([res], {type: 'application/pdf'});
                let objectUrl = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = objectUrl;
                a.target = '_blank';
                // a.download = `1.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            );
          }
            break;
          case 1: {
            if (this.printModalData2.length < 1) {
              this.nz.warning('提示消息', '暂无数据，无法打印！');
              return;
            }
            const payReportNos: Array<any> = [];
            this.selectedData.map((y: any) => {
              payReportNos.push(y.payReportNo);
            });
            this.angularHttp.get(urls.printPayReport,
              {
                responseType: 'blob',
                params: {
                  tab: this.printModalTabIndex ? '20' : '10',
                  payReportNos: payReportNos.toString(),
                  requestCompanyId: this.info.APPINFO.USER.companyId
                }
              }
            ).subscribe(
              res => {
                let blob = new Blob([res], {type: 'application/pdf'});
                let objectUrl = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = objectUrl;
                a.target = '_blank';
                // a.download = `1.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            );
          }
            break;
          case 2: {
            if (this.printModalData3.length < 1) {
              this.nz.warning('提示消息', '暂无数据，无法打印！');
              return;
            }
            this.angularHttp.get(urls.carriageContract,
              {
                responseType: 'blob',
                params: {
                  payReportNo: this.selectedData[0].payReportNo,
                  requestUserId: this.info.APPINFO.USER.userId,
                  requestCompanyId: this.info.APPINFO.USER.companyId
                }
              }
            ).subscribe(
              res => {
                let blob = new Blob([res], {type: 'application/pdf'});
                let objectUrl = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = objectUrl;
                a.target = '_blank';
                // a.download = `1.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            );
          }
            break;
        }

        // this.http.post(urls.settleReportPrint, {
        //   tab: this.printModalTabIndex ? '20' : '10',
        //   settleReportNos: settleReportNos
        // }).then(
        //   res => {
        //     if (res.success) {
        //       window.open(res.data.data);
        //       this.printModalVisible = false;
        //
        //     }
        //   }
        // );
      }
        break;
    }
  }

  printModalTab(data: any) {
    switch (data.index) {
      case 0: {
        this.printModalHeader = [
          {visible: 'XSBJ10', colCname: '业务时间', colEname: 'loadDate'},
          {visible: 'XSBJ10', colCname: '车属单位', colEname: 'carrierCompanyName'},
          {visible: 'XSBJ10', colCname: '付款金额', colEname: 'totalPrice', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '信息费', colEname: 'informationFee', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '开户行', colEname: 'bank'},
          {visible: 'XSBJ10', colCname: '银行账号', colEname: 'bankAccount'},
          {visible: 'XSBJ10', colCname: '联行号', colEname: 'bankNumber'},
          {visible: 'XSBJ10', colCname: '车队联系电话', colEname: 'fleetContact'},
          {visible: 'XSBJ10', colCname: '纳税人识别号', colEname: 'taxpayerIdentificationNumber'},
          {visible: 'XSBJ10', colCname: '备注', colEname: 'remark'},
        ];
        this.printListFun(10);
      }
        break;
      case 1: {
        this.printModalHeader = [
          {visible: 'XSBJ10', colCname: '业务时间', colEname: 'loadDate'},
          {visible: 'XSBJ10', colCname: '运单号', colEname: 'waybillNo'},
          {visible: 'XSBJ10', colCname: '车船号', colEname: 'travelNo'},
          {visible: 'XSBJ10', colCname: '委托单位', colEname: 'consignorCompanyName'},
          {visible: 'XSBJ10', colCname: '车属单位', colEname: 'carrierCompanyName'},
          {visible: 'XSBJ10', colCname: '起始地', colEname: 'startPortName'},
          {visible: 'XSBJ10', colCname: '目的地', colEname: 'endPortName'},
          {visible: 'XSBJ10', colCname: '总重量', colEname: 'weight'},
          {visible: 'XSBJ10', colCname: '付款金额', colEname: 'totalPrice', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '信息费', colEname: 'informationFee', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '开户行', colEname: 'bank'},
          {visible: 'XSBJ10', colCname: '银行账号', colEname: 'bankAccount'},
          {visible: 'XSBJ10', colCname: '联行号', colEname: 'bankNumber'},
          {visible: 'XSBJ10', colCname: '车队联系电话', colEname: 'fleetContact'},
          {visible: 'XSBJ10', colCname: '纳税人识别号', colEname: 'taxpayerIdentificationNumber'},
          {visible: 'XSBJ10', colCname: '备注', colEname: 'remark'},
        ];
        this.printListFun(20);
      }
        break;
      case 2: {
        this.printModalHeader = [
          {visible: 'XSBJ10', colCname: '合同号', colEname: 'orderNo'},
          {visible: 'XSBJ10', colCname: '品名', colEname: 'productId'},
          {visible: 'XSBJ10', colCname: '重量', colEname: 'weight'},
          {visible: 'XSBJ10', colCname: '单价', colEname: 'payPrice', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '金额', colEname: 'payAmount', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '合同备注', colEname: 'remark'},
          {visible: 'XSBJ10', colCname: '起点', colEname: 'startPoint'},
          {visible: 'XSBJ10', colCname: '终点', colEname: 'endPoint'},
          // {visible: 'XSBJ10', colCname: '付款金额', colEname: 'amount'},
          // {visible: 'XSBJ10', colCname: '信息费', colEname: 'informationFee'},
          // {visible: 'XSBJ10', colCname: '开户行', colEname: 'bank'},
          // {visible: 'XSBJ10', colCname: '银行账号', colEname: 'bankAccount'},
          // {visible: 'XSBJ10', colCname: '联行号', colEname: 'bankNumber'},
          // {visible: 'XSBJ10', colCname: '车队联系电话', colEname: 'fleetContact'},
          // {visible: 'XSBJ10', colCname: '纳税人识别号', colEname: 'taxpayerIdentificationNumber'},
          // {visible: 'XSBJ10', colCname: '备注', colEname: 'remark'},
        ];
        this.printListFun(30);
      }
        break;
      case 3: {
        this.printModalHeader = [
          {visible: 'XSBJ10', colCname: '业务时间', colEname: 'loadDate'},
          {visible: 'XSBJ10', colCname: '装车清单号', colEname: 'waybillNo'},
          {visible: 'XSBJ10', colCname: '车船号', colEname: 'travelNo'},
          {visible: 'XSBJ10', colCname: '委托单位', colEname: 'consignorCompanyName'},
          {visible: 'XSBJ10', colCname: '车属单位', colEname: 'carrierCompanyName'},
          {visible: 'XSBJ10', colCname: '起始地', colEname: 'startPortName'},
          {visible: 'XSBJ10', colCname: '目的地', colEname: 'endPortName'},
          {visible: 'XSBJ10', colCname: '总重量', colEname: 'weight'},
          {visible: 'XSBJ10', colCname: '付款金额', colEname: 'totalPrice', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '信息费', colEname: 'informationFee', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '开户行', colEname: 'bank'},
          {visible: 'XSBJ10', colCname: '银行账号', colEname: 'bankAccount'},
          {visible: 'XSBJ10', colCname: '联行号', colEname: 'bankNumber'},
          {visible: 'XSBJ10', colCname: '车队联系电话', colEname: 'fleetContact'},
          {visible: 'XSBJ10', colCname: '纳税人识别号', colEname: 'taxpayerIdentificationNumber'},
          {visible: 'XSBJ10', colCname: '备注', colEname: 'remark'},
        ];
        this.printListFun(40);
      }
        break;
      case 4: {
        this.printModalHeader = [
          {visible: 'XSBJ10', colCname: '合同号', colEname: 'orderNo'},
          {visible: 'XSBJ10', colCname: '结算单位', colEname: 'transCompanyName'},
          {visible: 'XSBJ10', colCname: '车队价', colEname: 'price'},
          {visible: 'XSBJ10', colCname: '车队金额', colEname: 'totAmount'},
          {visible: 'XSBJ10', colCname: '出库时间', colEname: 'outstockDate'},
          {visible: 'XSBJ10', colCname: '车船号', colEname: 'travelNo'},
          {visible: 'XSBJ10', colCname: '大载标载', colEname: 'weightName'},
          {visible: 'XSBJ10', colCname: '终点', colEname: 'endPoint'},
          {visible: 'XSBJ10', colCname: '终点省', colEname: 'endProvinceName', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '终点城市', colEname: 'endCityName', format: '2', type: 'number'},
          {visible: 'XSBJ10', colCname: '终点区', colEname: 'endDistrictName'},
          {visible: 'XSBJ10', colCname: '终点乡', colEname: 'endTownName'},
          {visible: 'XSBJ10', colCname: '车队结算单位', colEname: 'settleCompanyName'},
          {visible: 'XSBJ10', colCname: '收货用户', colEname: 'contactName'},
          {visible: 'XSBJ10', colCname: '品名', colEname: 'productName'},
          {visible: 'XSBJ10', colCname: '牌号', colEname: 'packShopsign'},
          {visible: 'XSBJ10', colCname: '规格', colEname: 'specDesc'},
          {visible: 'XSBJ10', colCname: '出库重量', colEname: 'prePackWeight'},
          {visible: 'XSBJ10', colCname: '出库件数', colEname: 'prePackSheet'},
          {visible: 'XSBJ10', colCname: '运输方式', colEname: 'transTypeName'},
          {visible: 'XSBJ10', colCname: '库存组织', colEname: 'prodCompany'},
        ];
        this.printListFun(50);
      }
        break;
    }
    // if (data.index === 1) {
    //   this.printModalHeader = [
    //     {visible: 'XSBJ10', colCname: '业务时间', colEname: 'loadDate'},
    //     {visible: 'XSBJ10', colCname: '运单号', colEname: 'waybillNo'},
    //     {visible: 'XSBJ10', colCname: '车船号', colEname: 'travelNo'},
    //     {visible: 'XSBJ10', colCname: '委托单位', colEname: 'consignorCompanyName'},
    //     {visible: 'XSBJ10', colCname: '车属单位', colEname: 'carrierCompanyName'},
    //     {visible: 'XSBJ10', colCname: '起始地', colEname: 'startPortName'},
    //     {visible: 'XSBJ10', colCname: '目的地', colEname: 'endPortName'},
    //     {visible: 'XSBJ10', colCname: '总重量', colEname: 'totalWeight'},
    //     {visible: 'XSBJ10', colCname: '付款金额', colEname: 'amount'},
    //     {visible: 'XSBJ10', colCname: '信息费', colEname: 'informationFee'},
    //     {visible: 'XSBJ10', colCname: '开户行', colEname: 'bank'},
    //     {visible: 'XSBJ10', colCname: '银行账号', colEname: 'bankAccount'},
    //     {visible: 'XSBJ10', colCname: '联行号', colEname: 'bankNumber'},
    //     {visible: 'XSBJ10', colCname: '车队联系电话', colEname: 'fleetContact'},
    //     {visible: 'XSBJ10', colCname: '纳税人识别号', colEname: 'taxpayerIdentificationNumber'},
    //     {visible: 'XSBJ10', colCname: '备注', colEname: 'remark'},
    //   ];
    //   this.printListFun(20);
    // } else {
    //   this.printModalHeader = [
    //     {visible: 'XSBJ10', colCname: '业务时间', colEname: 'loadDate'},
    //     {visible: 'XSBJ10', colCname: '车属单位', colEname: 'carrierCompanyName'},
    //     {visible: 'XSBJ10', colCname: '付款金额', colEname: 'amount'},
    //     {visible: 'XSBJ10', colCname: '信息费', colEname: 'informationFee'},
    //     {visible: 'XSBJ10', colCname: '开户行', colEname: 'bank'},
    //     {visible: 'XSBJ10', colCname: '银行账号', colEname: 'bankAccount'},
    //     {visible: 'XSBJ10', colCname: '联行号', colEname: 'bankNumber'},
    //     {visible: 'XSBJ10', colCname: '车队联系电话', colEname: 'fleetContact'},
    //     {visible: 'XSBJ10', colCname: '纳税人识别号', colEname: 'taxpayerIdentificationNumber'},
    //     {visible: 'XSBJ10', colCname: '备注', colEname: 'remark'},
    //   ];
    //   this.printListFun(10);
    // }
  }

  /**
   * 分组打印
   */
  printListFun(flag: number = 20) {
    let tPayReportModels = [];
    this.printModalLoading = true;
    this.printModalData1 = [];
    this.printModalData2 = [];
    this.printModalData3 = [];
    this.printModalData4 = [];
    this.printModalData5 = [];
    this.selectedData.map((y: any) => {
      // let o:any = [];
      // o.payReportNo = y.payReportNo;
      tPayReportModels.push(y.payReportNo);
    });
    this.http.post(urls.printSelect, {
      tab: flag,
      payReportNos: tPayReportModels,
      dataCompanyId:this.selectedData[0] && this.selectedData[0].companyId
    }).then((x: any) => {
      this.printModalLoading = false;
      if (x.success) {
        flag === 10 && (this.printModalData1 = x.data.data);
        flag === 20 && (this.printModalData2 = x.data.data);
        flag === 30 && (this.printModalData3 = x.data.data);
        flag === 40 && (this.printModalData4 = x.data.data);
        flag === 50 && (this.printModalData5 = x.data.data);
      }
    });
  }

}
