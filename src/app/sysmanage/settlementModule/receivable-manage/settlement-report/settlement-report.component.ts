import {Component, OnInit} from '@angular/core';
import {UserinfoService} from '@service/userinfo-service.service';
import {HttpUtilService} from '@service/http-util.service';
import {toDemical, isAlphanumeric} from '@validator/validator';

import {GlobalService} from '@service/global-service.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {localUrls} from '@model/localUrls';
import {urls} from '@model/url';
import {Utils} from '@util/utils';
import {Company} from './company';
import {HttpClient} from '@angular/common/http';
import {inpModalUrl} from '@model/inpModalUrl';

@Component({
  selector: 'app-settlement-report',
  templateUrl: './settlement-report.component.html',
  styleUrls: ['./settlement-report.component.css']
})

export class SettlementReportComponent implements OnInit {
  gridOneHeight: string;
  gridTwoHeight: string;
  //页面之前为多选，改成单选。
  trSelectedShow: boolean = false;
  tplModal: NzModalRef;
  loading: boolean = false;
  dataHeader: Array<any> = [];//表头
  pageSize: number = 30;//条数
  dataSet: any = [];
  listLoading: boolean = false;
  totalPages: Number = 1;
  selectedData: Array<any> = [];
  currentSelectedListData: any = {}; //点击列表当前条数据
  tempRowid: any;
  childrenDataSet: any = [];
  gridId: string = 'feeDetail';
  children_totalPages: Number = 1;
  tabArr = [
    {name: '费用明细', index: 0},
    {name: '货物明细', index: 1},
  ];
  feeListDataSet: any = [];
  feeListLoading: boolean = false;
  showChildrenList: boolean = false;//初始不显示子表
  tabIndex: number = 0;//子列表选项卡的index
  modalShow = false;//弹窗显示
  tplTitle = '开票';//弹窗标题
  totalMount: any;//总金额
  maxBillAmount: any = '0.00'; //可开票金额
  currentFocusRow: any;//当前聚焦行index
  invoiceListData: any[] = [{}];

  invoiceCompanyName: string;
  deliverCompanyName: string;
  invoiceTitleName: string;
  invoiceCompanyId: string;//开票单位id
  deliverCompanyId: string;//收票单位id
  invoiceTitle: string;//发票抬头id

  feeArr: any[] = []; //获取费用类型

  findSet1: any = {'parameter': 'companyName', 'parameterSend': 'companyId', 'name': '开票单位', 'formId': 'company_pop'};
  findSet2: any = {url: 'getCompanyBankThree', parameter: 'companyName', name: '收票单位', formId: 'form_bank_tan'};
  findSet3: any = {
    url: 'getCompanyBankThree',
    parameter: 'companyName',
    parameterSend: 'companyId',
    'name': '发票抬头',
    formId: 'form_bank_tan'
  };


  //展示内容
  invoiceTopData: Company = new Company();
  invoiceShowInfo = [
    {label: '税号', bindName: 'creditCode'},
    {label: '地址', bindName: 'companyAddress'},
    {label: '电话', bindName: 'companyPhone'},
    {label: '开户银行', bindName: 'bankName'},
    {label: '银行账号', bindName: 'bankAccount'},
    // { label: '备注', bindName: 'remark' },
  ];
  invoiceType: any;
  remark: any;

  //发票抬头的表头
  invoiceListHeader = [
    {cName: '费用名称', eName: 'feeName', type: 'text'},
    {cName: '税务分类代码', eName: 'taxClassifyCode', type: 'text'},
    // { cName: '费用类型', eName: 'feeType', type:'text',hidden:true },
    {cName: '单价', eName: 'price', type: 'number'},
    {cName: '重量', eName: 'weight', type: 'number'},
    {cName: '金额', eName: 'money', type: 'number'},
    {cName: '税率(%)', eName: 'tax', type: 'number'},
    {cName: '税额', eName: 'taxAmount', type: 'number'}
  ];

  childrenListWeight: any = '0.000';
  childrenListTotalPrice: any = '0.000000';

  printModalVisible: boolean = false;
  printModalTabIndex: number = 0;
  printModalData1: any[] = [];
  printModalData2: any[] = [];
  printModalData3: any[] = [];
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

  depositBankFindset: any = {
    url: 'getBankMsgByRecCompanyName',
    name: '选择银行账户',
    formId: 'form_bank_set',
    parameter: 'bankName',
    parameterSend: 'account'
  };
  currentTableHeight: number;
  private searchData: any = {};

  constructor(private http: HttpUtilService, private info: UserinfoService, private globalSer: GlobalService, private nm: NzModalService, private nn: NzNotificationService, private nz: NzNotificationService, private  angularHttp: HttpClient) {
  }

  ngOnInit() {
    //this.listSearch({page: 1, length: this.pageSize});
    this.http.post(urls.getFee, {companyId: this.info.APPINFO.USER.companyId}).then((res: any) => { //获取费用类型
      if (res.success) {
        this.feeArr = res.data.data;
      }
    });
  }

  /**
   * 分组打印
   */
  printListFun(flag: number = 20) {
    let settleReportNos = [];
    this.printModalLoading = true;
    this.printModalData1 = [];
    this.printModalData2 = [];
    this.printModalData3 = [];
    this.selectedData.map((y: any) => {
      settleReportNos.push(y.settleReportNo);
    });
    this.http.post(urls.settleReportPrintExport, {
      'tab': flag,
      'settleReportNos': settleReportNos
    }).then((x: any) => {
      this.printModalLoading = false;
      if (x.success) {
        flag === 10 && (this.printModalData1 = x.data.data);
        flag === 20 && (this.printModalData2 = x.data.data);
        flag === 40 && (this.printModalData3 = x.data.data);
      }
    });
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
      case 2: { //按装车清单号
        this.printModalHeader = [
          {visible: 'XSBJ10', colCname: '业务时间', colEname: 'loadDate'},
          {visible: 'XSBJ10', colCname: '装车清单号', colEname: 'mainProductListNo'},
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
    }

  }

  handleCancel() {
    this.printModalVisible = false;
  }

  handleOk(mark?) {

    switch (mark) {
      case 10: {
        switch (this.printModalTabIndex) {
          case 0:
            this.exportExcel(10);
            break;
          case 1:
            this.exportExcel(20);
            break;
          case 2:
            this.exportExcel(40);
            break;
        }
      }
        break;
      case 20: {
        switch (this.printModalTabIndex) {
          case 0: {
            if (this.printModalData1.length < 1) {
              this.nz.warning('提示消息', '暂无数据，无法打印！');
              return;
            }
            const settleReportNos: Array<any> = [];
            this.selectedData.map((y: any) => {
              settleReportNos.push(y.settleReportNo);
            });
            this.angularHttp.get(urls.printSettleReport,
              {
                responseType: 'blob',
                params: {
                  tab: this.printModalTabIndex ? '20' : '10',
                  settleReportNos: settleReportNos.toString(),
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
            const settleReportNos: Array<any> = [];
            this.selectedData.map((y: any) => {
              settleReportNos.push(y.settleReportNo);
            });
            this.angularHttp.get(urls.printSettleReport,
              {
                responseType: 'blob',
                params: {
                  tab: this.printModalTabIndex ? '20' : '10',
                  settleReportNos: settleReportNos.toString(),
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
          case 3:
            break;
        }

      }
        break;
      default:
        break;
    }

  }

  /**
   * 分组打印end
   */
  listSearch(data: any): void {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.getList(this.searchData);
  }

  getList(data: any): void {
    this.selectedData = [];
    let url = localUrls.getSettleReportUrl;
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total;
        this.childrenDataSet =[];
        this.selectedData = [];
      }
    });
  }


  getChildrenListData(): void {
    // console.log(this.tabIndex);
    // console.log(this.currentSelectedListData);

    this.children_totalPages = 1;
    this.loading = true;
    let url = localUrls.getFeeDetailUrl;
    let param = {tSettleFeeModel: []};
    this.selectedData.forEach(
      res => param.tSettleFeeModel.push({settleReportNo: res.settleReportNo})
    );
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.loading = false;

          this.childrenDataSet = this.tabIndex == 0 ? (res.data.data && res.data.data.tSettleFeeModel || []) : (res.data && res.data.data || []);

          this.childrenListWeight = this.childrenDataSet.filter(item => item.weight && item.feeType === 'F001').map(item => item.weight).reduce((acc, cur) => Utils.add(acc, cur), 0);
          this.childrenListTotalPrice = this.childrenDataSet.filter(item => item.totalPrice).map(item => item.unitPrice*item.weight).reduce((acc, cur) => Utils.add(acc, cur), 0);

        }
      }
    );
  }

  updateData(data: any) {
    this.selectedData = data;
    this.childrenDataSet = [];
    this.childrenListWeight = '0.000';
    this.childrenListTotalPrice = '0.00';
    this.selectedData[0] && this.getChildrenListData();
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  listClick(data: any): void {
    this.currentSelectedListData = data;
    this.dataSet.forEach(item => {
      if (item.settleReportNo === data.settleReportNo) {
        item.checked = !item.checked;
      }
    });

    this.updateData(this.dataSet.filter(item => item.checked));

  }

  tabChange(data: any): void {//子表选项卡切换
    setTimeout(() => {
      this.tabIndex = data.index;
      if (data.index === 0) {
        //费用明细
        this.gridId = 'feeDetail';
      } else {
        //货物明细
        this.gridId = 'goodsDetail';
      }
      this.childrenDataSet = [];
      this.selectedData[0] && this.getChildrenListData();
    });
  }

  private multiBill() { //多个数据开票申请
    const isBill = this.selectedData.some((x: any) => x.uninvoicedAmount && (Number(x.uninvoicedAmount) === 0));
    if (isBill) {
      this.nm.error({
        nzTitle: '提示信息',
        nzContent: '您所选的数据包含有已经开过票的数据!'
      });
      return;
    }
    let params = {settleInvModels: []};
    params.settleInvModels = this.selectedData.map((x: any) => {
      if (x.uninvoicedAmount && Number(x.uninvoicedAmount) === 0) {
        return;
      }

      return {
        'settleCompanyName': x.settleCompanyName,
        'settleCompanyId': x.settleCompanyId,
        'settleReportNo': x.settleReportNo,
        'invoiceCompanyId': x.carrierCompanyId,
        'businessType': x.businessType,
        'businessTypeName': x.businessTypeName,
        'invoiceAmount': !x.uninvoicedAmount ? x.undividedAmount : x.uninvoicedAmount
      };

    });
    this.http.post(localUrls.insertReprotInvs, params).then((x: any) => {
      if (x.success) {
        this.nm.success({
          nzTitle: '提示信息',
          nzContent: '开票申请成功!'
        });
        // this.listSearch({page: 1, length: this.pageSize});
        this.getList(this.searchData);
      }
    });
  }

  btnClick(data: any): void {//按钮点击事件
    this.invoiceTopData.clear();
    if (this.selectedData.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作。'
      });
      this.destroyTplModal();
      return;
    }
    switch (data.buttonId) {
      case 'Bill': {
        //开票
        //多个数据进行开票申请
        if (this.selectedData.length > 1) {
          this.multiBill();
          return;
        }

        //单个数据进行开票申请
        // this.invoiceCompanyName = this.info.APPINFO.USER.companyName;
        // this.invoiceCompanyId = this.info.APPINFO.USER.companyId;
        this.invoiceCompanyName = this.selectedData[0].carrierCompanyName;
        this.invoiceCompanyId = this.selectedData[0].carrierCompanyId;

        this.deliverCompanyName = this.selectedData[0].settleCompanyName;
        this.deliverCompanyId = this.selectedData[0].settleCompanyId;
        this.invoiceTitleName = this.selectedData[0].settleCompanyName;
        this.invoiceTitle = this.selectedData[0].settleCompanyId;
        this.remark = this.selectedData[0].invoiceRemark;
        this.invoiceType = '专票';

        // this.getInvoiceTopData(this.invoiceTitle);//根据发票抬头获取税号、地址等信息
        this.getCompanyBankThree(this.invoiceTitleName);
        this.invoiceListData = [];
        if (this.selectedData[0].invItem) { // 如果主列表有invItem则从主列表带入发票明细
          JSON.parse(this.selectedData[0].invItem).forEach(
            res => {
              let dataObj = {
                feeType: res.feeName,
                price: toDemical(res.price, 2),
                weight: toDemical(res.weight, 3),
                money: toDemical(res.amount, 2),
                feeName: res.feeName,
                tax: toDemical(res.rate, 2),
                taxAmount: toDemical(res.tax, 2),
                taxClassifyCode: res.taxClassifyCode,
              };
              this.invoiceListData.push(dataObj);
            }
          );
          this.caculateMoney();
        }
        // this.totalMount = '';

        this.modalShow = true;
        let url = localUrls.getFeeListUrl;
        let param = {tSettleFeeModel: []};
        let obj: any = {};
        this.selectedData.forEach(element => {
          obj.settleReportNo = element.settleReportNo;
          param.tSettleFeeModel.push(obj);
        });
        this.feeListLoading = true;
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            this.feeListLoading = false;
            this.feeListDataSet = res.data.data && res.data.data.tSettleFeeModel || [];
            this.maxBillAmount = toDemical(Number(res.data.data.maxBillAmount), 2);
          }
        });
        // this.selectedData[0].bankId ? this.getBankData() : this.getBankData2();
      }
        break;
      case 'Invalid': {
        this.btnInvalid();
      }
        break;
      case 'payReport': {
        let url = localUrls.creatPaymentReport;
        let param = {settleReportNo: this.selectedData[0].settleReportNo};
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            this.nz.create('success', '提示信息', '生成应付结算报表成功', {nzDuration: 3000});
            // this.listSearch({page: 1, length: this.pageSize});
            this.getList(this.searchData);
          }
        });
      }
        break;
      case 'GroupPrint': {
        if (this.selectedData.length > 1) {
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选择一条数据进行操作。'
          });
          this.destroyTplModal();
          return;
        }
        this.printModalVisible = true;
        this.printModalTabIndex === 0 && this.printListFun(10);
        this.printModalTabIndex = 0;
      }
        break;
      case 'received': {
        let url = localUrls.received;
        let param = {
          settleReportNo: this.selectedData[0].settleReportNo,
          dataCompanyId: this.selectedData[0].companyId,
          parentCompanyId: this.selectedData[0].parentCompanyId
        };
        this.http.post(url, param).then((res: any) => {
          if (res.success) {
            this.nz.create('success', '提示信息', '已接收操作成功!', {nzDuration: 3000});
            // this.listSearch({page: 1, length: this.pageSize});
            this.getList(this.searchData);
          }
        });
      }
        break;
      case 'exportExcel': {
        //费用明细导出
        this.btnExportExcel();
      }
        break;
      case 'print': {
        this.btnPrint();
      }
    }
  }

  /**
   *合同打印
   */
  btnPrint(): void {
    if (this.selectedData.length !== 1) {
      this.nn.warning('提示消息', '请选择一条数据后操作！');
      return;
    }
    this.angularHttp.get(urls.carriageContractBySettleReport,
      {
        responseType: 'blob',
        params: {
          settleReportNo: this.selectedData[0].settleReportNo,
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

  /**
   * 点击作废
   */
  btnInvalid(): void {
    this.nm.confirm(
      {
        nzTitle: '提示消息',
        nzContent: '是否确认作废选中数据？',
        nzOnOk: () => this.InvalidData()
      }
    );
  }

  /**
   * 作废请求
   * @constructor
   */
  InvalidData(): Promise<any> {
    let url = localUrls.settlementReportDeleteUrl;
    let param = {tSettleReportModels: []};
    let status = false;
    this.selectedData.forEach(element => {
      let obj: any = {};
      obj.settleReportNo = element.settleReportNo;
      param.tSettleReportModels.push(obj);
      if (element.invoiceAmount) {
        status = true;
      }
    });
    if (status) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '已开票，不能作废'
      });
      this.destroyTplModal();
      return;
    }
    return this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '作废成功', {nzDuration: 3000});
        this.getList(this.searchData);
      } else {
        return false;
      }
    });
  }

  getInvoiceTopData(invoId): void {
    let url = localUrls.dataSelectModalListUrl;
    let param = {companyId: this.info.APPINFO.USER.companyId, theCompanyId: invoId, formId: 'company_pop'};
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.invoiceTopData.changeCompany(res.data.data.data[0]);
      }
    });
  }

  updateFeeListData(data: any): void {
    if (this.invoiceListData.length === 0) {
      let arr = [];
      let obj = {};
      let dataArr = {};
      data.map((list) => {
        if (!obj[list.feeType]) {    //根据费用类型分组
          arr.push(list);
          obj[list.feeType] = true;
          dataArr[list.feeType] = {unitPrice: Number(list.unitPrice), weight: Number(list.weight), money: Number(list.totalPrice)};
        } else {
          arr.forEach(element => {
            if (element.feeType == list.feeType) {
              // console.log(element.unitPrice);
              dataArr[list.feeType].unitPrice += Number(list.unitPrice);  //单价汇总
              dataArr[list.feeType].weight += Number(list.weight);  //重量汇总
              dataArr[list.feeType].money += Number(list.unitPrice*list.weight);  //金额汇总
            }
          });
        }
      });
      Object.keys(dataArr).map((x) => {
        console.log(x, dataArr[x]);
        let dataObj = {
          feeType: x,
          price: toDemical((dataArr[x].money / dataArr[x].weight)||0, 2),
          weight: toDemical(dataArr[x].weight||0,2),
          money: toDemical(dataArr[x].money||0,2),
          feeName: '',
          taxClassifyCode:'3010502020200000000',
          tax:'9',
          taxAmount:toDemical(Utils.mul(Utils.div(dataArr[x].money,1.09) ,0.09),2)
        };
        this.feeArr.forEach((f) => {
          console.log(f.feeId);
          if (f.feeId == dataObj.feeType) {
            dataObj.feeName = f.feeName;
            console.log(dataObj);
          }
        });
        this.invoiceListData.push(dataObj);
      });
      this.caculateMoney();
    }

  }

  addList(): void {
    const companyId = this.info.get('USER').companyId;
    if ((companyId === 'C000000888' || companyId === 'C000000890' || companyId === 'C000000887' ||
    companyId === 'C000000885' || companyId === 'C000000886') && this.invoiceListData.length === 1) {
      this.invoiceListData.push({
        feeName: '装车费',
        tax: 6,
        price: 10,
        weight: this.invoiceListData[0].weight,
        taxClassifyCode: this.invoiceListData[0].taxClassifyCode
      });
      if (this.invoiceListData[0].weight) {
        this.currentFocusRow = 1;
        this.valueChange({ eName: 'weight' }, this.invoiceListData[1]);
        this.valueChange({ eName: 'tax' }, this.invoiceListData[1]);
      }
      return;
    }
    this.invoiceListData.push({});
  }

  subList(): void {
    this.invoiceListData = this.invoiceListData.filter((data, index) => index != this.currentFocusRow);
    this.currentFocusRow = 'VALID';
    this.caculateMoney();
  }

  focusFn(data: any, index: any) {
    this.currentFocusRow = index;
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  inpEmit1(data: any) {
    this.invoiceCompanyName = data.inpName;
    this.invoiceCompanyId = data.inpValue;
  }

  inpEmit2(data: any) {

    this.deliverCompanyName = data.inpName;
    this.deliverCompanyId = data.selData[0].companyId;
    if (data.selData[0]) {
      this.invoiceTopData.bankName = data.selData[0].bankName;
      this.invoiceTopData.bankAccount = data.selData[0].account;
      this.invoiceTopData.companyAddress = data.selData[0].companyAddress;
      this.invoiceTopData.companyPhone = data.selData[0].companyPhone;
      this.invoiceTopData.taxNo = data.selData[0].creditCode;
      this.invoiceTopData.creditCode = data.selData[0].creditCode;
      this.invoiceTitleName = data.selData[0].recCompanyName;
      this.invoiceTitle = data.selData[0].recCompanyId;

    } else {
      this.invoiceTopData.clear();
    }

  }

  inpEmit3(data: any) {
    this.invoiceTitleName = data.inpName;
    this.invoiceTitle = data.inpValue;
    if (this.invoiceTitle) {
      this.getInvoiceTopData(this.invoiceTitle);
      this.invoiceTopData.bankName = data.selData[0].bankName;
      this.invoiceTopData.bankAccount = data.selData[0].account;
      // this.getBankData2();
    } else {
      this.invoiceTopData.clear();
    }

  }

  valueChange(h: any, data?: any) {          // 费用类型不应该为输入框
    // console.log(this.currentFocusRow);
    // console.log(h)
    this.invoiceListData.forEach((element, index) => {
      if (index == this.currentFocusRow) {
        if (h.eName == 'money') {
          //金额改变 根据重量计算单价/
          element.money = toDemical(Number(element.money), 2);
          if (element.weight && element.weight != 0) {
            element.price = toDemical(Number(element.money) / Number(element.weight), 2);
          }
          if (element.tax && element.tax != 0) {
            element.taxAmount = toDemical((element.money / (element.tax * 0.01 + 1)) * (element.tax * 0.01), 2);
          }
          this.caculateMoney();
        } else if (h.eName == 'price') {
          //单价取两位,单价改变  根据重量计算金额
          element.price = toDemical(Number(element.price), 2);
          if (element.weight) {
            element.money = toDemical(Number(element.price) * Number(element.weight), 2);
          }
          if (element.weight && element.weight != 0) {
            element.price = toDemical(Number(element.money) / Number(element.weight), 2);
          }
          if (element.tax && element.tax != 0) {
            element.taxAmount = toDemical((element.money / (element.tax * 0.01 + 1)) * (element.tax * 0.01), 2);
          }
          this.caculateMoney();

        } else if (h.eName == 'weight') {  //重量改变  根据单价计算金额
          element.weight = toDemical(Number(element.weight), 3);
          if (element.price) {
            element.money = toDemical(Number(element.price) * Number(element.weight), 2);
          }
          if (element.weight && element.weight != 0) {
            element.price = toDemical(Number(element.money) / Number(element.weight), 2);
          }
          if (element.tax && element.tax != 0) {
            element.taxAmount = toDemical((element.money / (element.tax * 0.01 + 1)) * (element.tax * 0.01), 2);
          }
          this.caculateMoney();
        } else if (h.eName == 'taxAmount') { // 税额取两位
          //单价取两位,单价改变  根据重量计算金额
          element.taxAmount = toDemical(Number(element.taxAmount), 2);

        } else if (h.eName == 'tax') {

          if (element.tax < 0) {
            element.tax = 0;
          } else if (element.tax > 100) {
            element.tax = 100;
          }
          element.tax = toDemical(Number(element.tax), 2);
          if (element.money && element.money != 0) {
            element.taxAmount = toDemical((element.money / (element.tax * 0.01 + 1)) * (element.tax * 0.01), 2);
          }
        }
      }
    });
    // console.log(data);
  }


  caculateMoney() {   //计算总金额
                      // console.log(this.invoiceListData);
    this.totalMount = 0;
    this.invoiceListData.forEach(element => {
      Number(element.price * element.weight) == 0 && (element.money = 0);
      this.totalMount += element.price && element.weight && !isNaN(element.price) && !isNaN( element.weight) ? Number(element.money) : Number('0.00');
    });
    this.totalMount = toDemical(this.totalMount, 2);
  }

  modelChange(name: any, data: any) {
    switch (name) {
      case 'creditCode':
        if (!isAlphanumeric(data) || data.length > 20) {
          this.invoiceTopData[name] = '';
        }
        break;

      // case 'companyPhone':
      //   if((!isMobile(data)) && (!isTelphone(data))){
      //     this.invoiceTopData[name] = '';
      //   }
      //   break;

      default:
        break;
    }

  }

  modalConfirm(): void {//弹窗确认逻辑

    if (Number(this.totalMount) > Number(this.maxBillAmount)) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '总金额不能大于可开票金额'
      });
      this.destroyTplModal();
      return;
    }
    if (!(this.invoiceTopData.bankAccount && this.invoiceTopData.bankName)) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '无银行信息，请去客户结算账户页面维护银行账户！'
      });
      this.destroyTplModal();
      return;
    }
    let modalConfirmParam = {
      settleReportNo: this.selectedData[0].settleReportNo,
      invoiceAmount: '',
      tSettleInvitemllist: [],
      invoiceCompanyId: this.invoiceCompanyId,
      settleCompanyId: this.deliverCompanyId,
      invoiceTitle: this.invoiceTitle,
      businessType: this.selectedData[0].businessType ? this.selectedData[0].businessType : '',
      businessTypeName: this.selectedData[0].businessTypeName ? this.selectedData[0].businessTypeName : ''
    };
    modalConfirmParam.invoiceAmount = this.totalMount || '';
    this.invoiceListData.forEach(element => {
      element.amount = element.money;    //传给后台的money字段变为amount字段
    });
    modalConfirmParam.tSettleInvitemllist = this.invoiceListData;

    // console.log(this.invoiceListData);
    let modalConfirmUrl = localUrls.modalConfirmUrl;
    // console.log(this.invoiceTopData,555555555);
    this.invoiceTopData.taxNo = this.invoiceTopData.creditCode;
    Object.assign(this.invoiceTopData, modalConfirmParam);
    this.invoiceTopData.remark = this.remark;
    this.invoiceTopData.invoiceType = this.invoiceType;
    this.http.post(modalConfirmUrl, this.invoiceTopData).then(
      (res: any) => {
        if (res.success) {
          this.modalShow = false;
          this.invoiceListData = [{}];
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '开票申请成功！'
          });
          this.destroyTplModal();

          //  this.listSearch({page: 1, length: this.pageSize});
          this.getList(this.searchData);
        }
      }
    );
  }

  modalCancel(): void {//弹窗取消逻辑
    this.invoiceTopData.clear();
    this.modalShow = false;
  }

  modalClose() { //弹窗关闭逻辑
    this.invoiceTopData.clear();
    this.totalMount = ''
  }

  /**
   * 开户银行弹窗
   * @param data
   */
  depositBankInpEmit(data: any) {
    this.invoiceTopData.bankAccount = data.inpValue;
  }

  /**
   * 银行信息查询(通过bankId)
   */
  getBankData(): void {
    this.http.post(urls.getMsgByBankId, {bankIds: [{bankId: this.selectedData[0].bankId}]}).then(
      res => {
        if (res.success) {
          if (res.data.data[0]) {
            this.invoiceTopData.bankName = res.data.data[0].bankName ? res.data.data[0].bankName : '';
            this.invoiceTopData.bankAccount = res.data.data[0].account ? res.data.data[0].account : '';
          }

        }
      }
    );
  }

  // 通过公司查询银行
  getBankData2(): void {
    this.http.post(inpModalUrl.getBankMsgByRecCompanyName, {receivefeeClientName: this.invoiceTitle}).then(
      res => {
        if (res.success) {
          if (res.data.data.total === 1) {
            this.invoiceTopData.bankName = res.data.data.data[0].bankName;
            this.invoiceTopData.bankAccount = res.data.data.data[0].account;
          }
        }
      }
    );
  }

  /**
   * 表单当前高度
   * @param data
   */
  currentTableHeightFun(data: number) {
    this.currentTableHeight = data + 38;
  }

  /**
   * 获取公司银行
   * @param param
   */
  getCompanyBankThree(param: any): void {
    this.http.post(inpModalUrl.getCompanyBankThree, {companyName: param}).then(
      res => {
        if (res.success) {
          if (res.data.data.total === 1) {
            if (res.data.data.data) {
              this.invoiceTopData.bankName = res.data.data.data[0].bankName;
              this.invoiceTopData.bankAccount = res.data.data.data[0].account;
              this.invoiceTopData.companyAddress = res.data.data.data[0].companyAddress;
              this.invoiceTopData.companyPhone = res.data.data.data[0].companyPhone;
              this.invoiceTopData.taxNo = res.data.data.data[0].creditCode;
              this.invoiceTopData.creditCode = res.data.data.data[0].creditCode;
              this.invoiceTitleName = res.data.data.data[0].recCompanyName;
              this.invoiceTitle = res.data.data.data[0].recCompanyId;

            } else {
              this.invoiceTopData.clear();
            }
          }
        }

        // param.depositBank = res.data.data.data[0].bankName;
        // param.bankAccount = res.data.data.data[0].account;
        // param.lineNumber = res.data.data.data[0].lineNumber || '';
        // param.bankId = res.data.data.data[0].bankId || '';
      }
    );
  }

  /**
   * 导出
   * @param flag
   */
  exportExcel(flag): void {
    const settleReportNos = [];
    this.selectedData.map((y: any) => {
      settleReportNos.push(y.settleReportNo);
    });
    this.angularHttp.post(urls.settleReportSubExport,
      {
        tab: flag,
        settleReportNos: settleReportNos
      },
      {responseType: 'blob'}
    ).subscribe(
      (res: any) => {
        var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        var objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `明细导出.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  /**
   * 费用明细
   */
  btnExportExcel(): void {
    const param = {tSettleFeeModel: this.selectedData};
    this.angularHttp.post(urls.exportReportFees,
      param,
      {responseType: 'blob'}
    ).subscribe(
      (res: any) => {
        var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        var objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `费用明细导出.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

}
