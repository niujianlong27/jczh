/**
 * 应付报表管理功能
 */
import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {localUrls} from '@model/localUrls';
import {HttpUtilService} from '@service/http-util.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '@model/url';
import {UserinfoService} from '@service/userinfo-service.service';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {retry} from 'rxjs/operators';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})
export class PaymentReportComponent implements OnInit {
  validateForm: FormGroup;
  tplModal: NzModalRef;
  pageSize: number = 30;//条数
  listLoading: boolean = false;
  childlistLoading: boolean = false;
  dataSet: any = [];
  childrenDataSet: any = [];
  totalPages: Number = 0;
  children_totalPages: Number = 0;
  isMutli: boolean = false;
  listWidth: string;
  trSelectedShow: boolean = false;
  tempRowid: any;
  insteadLoading: boolean = false;
  tabArr = [
    {name: '费用明细', index: 0},
    {name: '货物明细', index: 1},
  ];
  tabIndex: Number = 0;
  gridId: string = 'grid2';
  selectedData: Array<any> = [];//存储勾选中的数据
  currentSelectedListData: any = {}; //点击列表当前条数据
  itemSelectList: Array<any> = [];//存储勾选中的子表数据
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
  caculateEnameArr: any = [
    {field: 'totWeight', tipInfo: '重量', tipInfoType: '吨', demLength: 3},
    {field: 'totAmount', tipInfo: '结算金额', tipInfoType: '元', demLength: 2},
  ];
  transCompanyName: string;
  transCompanyId: string;
  @ViewChild('reconciliation') reconciliation: TemplateRef<any>;
  companyModalObj: any = {title: '', error: ''};
  companyId: string;
  recName: string;
  bankName: string;
  account: string;
  bankId: string;
  btnId: string;
  carrierCompanyId: string;
  carrierCompany: string;
  gridOneHeight: string;
  gridTwoHeight: string;
  private searchData: any = {};
  companyType: any = [];
  modalObj: any = {
    visible: false,
    title: null,
    loading: false,
    data: [
      {
        name: '付款单位',
        required: true,
        type: 'inputModal',
        parameter: 'carrierCompanyName',
        formId: 'form_rec_test',
        url: 'getRecCompany',
        modelName: null,
        modelId: null,
        nameStr: 'companyName',
        valStr: 'settleCompanyId'
      },
      {
        name: '结算单位',
        required: true,
        type: 'inputModal',
        parameter: 'settleCompanyName',
        formId: 'form_bank_tan',
        url: 'getCompanyBankThree',
        modelName: null,
        modelId: null,
        parameterSend: 'recCompanyId',
        nameStr: 'recCompanyName',
        valStr: 'recCompanyId'
      },
      {
        name: '运输车队',
        required: true,
        type: 'inputModal',
        parameter: 'fleetCompanyName',
        formId: 'company_pop',
        url: 'default',
        modelName: null,
        modelId: null,
        parameterSend: 'companyId',
        nameStr: 'companyName',
        valStr: 'companyId'
      },
      {
        name: '收款单位',
        required: true,
        type: 'inputModal',
        parameter: 'transCompanyName',
        formId: 'form_bank_tan',
        url: 'getCompanyBankThree',
        modelName: null,
        modelId: null,
        parameterSend: 'recCompanyId',
        nameStr: 'recCompanyName',
        valStr: 'recCompanyId'
      },
      {name: '报表名称', required: true, type: 'text', parameter: 'reportName'},
      {name: '业务板块', required: true, type: 'select', parameter: 'businessType', data: []},
      {name: '总重量', required: true, type: 'number', parameter: 'totWeight'},
      {name: '总金额', required: true, type: 'number', parameter: 'totAmount'},
      {name: '申请金额', required: true, type: 'number', parameter: 'appliedAmount'},
      {name: '信息费', required: true, type: 'number', parameter: 'infoCost'},
      {name: '总费用', required: true, type: 'number', parameter: 'totalCost'},
      {name: '费用描述', type: 'text', parameter: 'feeDesc'},
      {name: '备注', type: 'bigText', parameter: 'remark'}
    ],
  };

  constructor(private http: HttpUtilService,
              private info: UserinfoService,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private  angularHttp: HttpClient,
              private fb: FormBuilder) {
  }

  private getCompanyBusiSegment() { //获取公司业务板块接口
    this.angularHttp.post(urls.getSegmentInformation, {transType: 20}).pipe(
      retry(3)
    ).subscribe(
      (res: any) => {
        if (res.code === 100) {
          const businessType = this.modalObj.data.filter(x => x.parameter === 'businessType');
          const data = res.data.map(x => ({value: x.segmentId, name: x.segmentName}));
          businessType[0].data = [...data];
        }
      }
    );
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});
    this.validateForm = this.fb.group({});
    this.modalObj.data.forEach((x: any) => {
      this.validateForm.addControl(x.parameter, new FormControl({}, x.required ? Validators.required : null));
    });
    this.getCompanyBusiSegment();
    this.getStatic(this.companyType, 'DZGS');

  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

  modalInpEmit(data: any, item: any) {
    item.modelName = data.selData ? data.selData[0] && data.selData[0][item.nameStr] : null;
    item.modelId = data.selData ? data.selData[0] && data.selData[0][item.valStr] : null;
    this.validateForm.get(item.parameter).setValue(item.modelName);

  }

  handleModalOk() { //手工录入
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    let obj = {};
    this.modalObj.loading = true;
    this.modalObj.data.forEach(
      (x: any) => {
        if (x.parameter === 'carrierCompanyName') {
          obj = {...obj, carrierCompanyName: x.modelName, carrierCompanyId: x.modelId};
        } else if (x.parameter === 'settleCompanyName') {
          obj = {...obj, settleCompanyName: x.modelName, settleCompanyId: x.modelId};
        } else if (x.parameter === 'fleetCompanyName') {
          obj = {...obj, fleetCompanyName: x.modelName, fleetCompanyId: x.modelId};
        } else if (x.parameter === 'transCompanyName') {
          obj = {...obj, transCompanyName: x.modelName, transCompanyId: x.modelId};
        }
      }
    );
    const params = {
      ...this.validateForm.getRawValue(),
      ...obj,
    };
    this.angularHttp.post(localUrls.payreportInsert, params).subscribe(
      (res: any) => {
        this.modalObj.loading = false;
        if (res.code === 100) {
          this.nz.create('success', '提示信息', res.msg, {nzDuration: 3000});
          this.modalObj.visible = false;
          this.getList(this.searchData);
        }
      }
    );
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
      payReportNos: tPayReportModels
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
            this.exportExcel(30);
            break;
          case 3:
            this.exportExcel(40);
            break;
          case 4:
            this.exportExcel(50);
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

  /**
   * 分组打印end
   */
  listSearch(data: any): void {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.getList(this.searchData);
  }

  updateData(data: any) {
    this.selectedData = data;
    if (this.selectedData[0]) {
      this.getChildrenListData(this.selectedData);
    } else {
      this.childrenDataSet = [];
      this.itemSelectList = [];
    }

  }

  getList(data: any): void {
    let url = localUrls.paymentReportListUrl;
    this.childrenDataSet = [];
    this.itemSelectList = [];
    this.listLoading = true;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.listLoading = false;
        this.selectedData = [];
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPages = res.data.data && res.data.data.total;
      }
    });
  }

  private reconciliationFun() {
    let url = localUrls.paymentReportReconciliations;
    let param: any = {payReportList: []};
    this.selectedData.map((x: any) => {
      let o: any = {};
      o.payReportNo = x.payReportNo;
      o.confirmationMark = 'QRBJ20';
      o.transCompanyId = this.transCompanyId;
      o.bankId = this.bankId;
      o.dataCompanyId = x.companyId;
      o.requestCompanyId = this.info.APPINFO.USER.companyId;
      o.requestUserId = this.info.APPINFO.USER.userId;
      o.requestCompanyType = this.info.APPINFO.USER.companyType;
      param.payReportList.push(o);
    });
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        this.nz.create('success', '提示信息', '发起成功', {nzDuration: 3000});
        this.getList(this.searchData);
        this.tplModal.destroy();
      }
    });
  }

  private insteadFun() {
    let url = localUrls.paymentReportReconciliations;
    let param: any = {payReportList: []};
    if (!this.bankId || !this.bankName || !this.companyId || !this.recName) {
      !this.bankId && this.nz.create('error', '提示信息', '开户银行必填字段');
      return;
    }
    this.selectedData.map((x: any) => {
      let o: any = {};
      o.payReportNo = x.payReportNo;
      o.confirmationMark = 'QRBJ40';
      o.dataCompanyId = x.companyId;
      o.companyId = this.transCompanyId;
      o.bankId = this.bankId;
      o.requestCompanyId = this.info.APPINFO.USER.companyId;
      o.requestUserId = this.info.APPINFO.USER.userId;
      o.requestCompanyType = this.info.APPINFO.USER.companyType;
      o.carrierCompanyId = this.carrierCompanyId;
      param.payReportList.push(o);
    });
    this.insteadLoading = true;
    this.http.post(url, param).then((res: any) => {
      this.insteadLoading = false;
      if (res.success) {
        this.nz.create('success', '提示信息', '转代收代付成功', {nzDuration: 3000});
        this.getList(this.searchData);
        this.tplModal.destroy();
      }
    });
  }

  inpEmitCarrier(data: any) {
    this.carrierCompanyId = data.inpValue;
    this.carrierCompany = data.inpName;
  }

  inpEmit2(data: any) {
    this.companyId = data.inpValue;
    this.recName = data.inpName;
    this.getMsgByCompanyId(this.companyId);
  }

  btnClick(data: any): void {
    this.btnId = data.buttonId;
    if (data.buttonId === 'Invalid') {
      if (this.selectedData.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作！'
        });
        this.destroyTplModal();
        return;
      }
      let url = localUrls.paymentReportInvalidUrl;
      let param = {tPayReportModels: []};
      this.selectedData.forEach(element => {
        let obj = {};
        obj['payReportNo'] = element.payReportNo;
        param.tPayReportModels.push(obj);
      });
      this.http.post(url, param).then((res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '作废成功', {nzDuration: 3000});
          //  this.listSearch({page: 1, length: this.pageSize});
          this.getList(this.searchData);
        }
      });
    }

    // 发起对账按钮
    if (data.buttonId === 'reconciliation') {
      if (this.selectedData.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作！'
        });
        this.destroyTplModal();
        return;
      }

      const canReconciliation = this.selectedData.some((x: any) => x.confirmationMark !== 'QRBJ10' && x.confirmationMark !== 'QRBJ50');
      //判断是否能够发起对账
      if (!canReconciliation) {
        this.companyModalObj.title = '对账公司';
        this.companyModalObj.error = '请选择对账公司!';
        this.transCompanyId = 'C000007586';
        this.tplModal = this.nm.create({
          nzTitle: '对账确认',
          nzContent: this.reconciliation,
          nzMaskClosable: false,
          nzOnOk: () => {
            if (this.transCompanyId) {
              this.reconciliationFun();
            }
            return false;
          }
        });

      } else {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '只有确认标记为初始化或驳回状态的数据才能发起对账'
        });
        this.destroyTplModal();
        return;
      }
    }

    // 申请代收代付
    if (data.buttonId === 'instead') {
      if (this.selectedData.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作！'
        });
        this.destroyTplModal();
        return;
      }
      const insteadEnter = this.selectedData.some((x: any) => x.confirmationMark !== 'QRBJ30');
      //判断是否能够发起对账
      if (!insteadEnter) {
        this.companyModalObj.title = '代收代付公司';
        this.companyModalObj.error = '请选择代收代付公司!';
        this.bankId = '';
        this.bankName = '';
        this.account = '';
        this.transCompanyId = this.selectedData[0].turnCompany;//.settleCompanyId;
        this.transCompanyName = this.selectedData[0].turnCompanyName;
        this.carrierCompanyId = this.selectedData[0].virtualCompany;
        this.carrierCompany = this.selectedData[0].virtualCompanyName;
        this.companyId = this.selectedData[0].settleCompanyId;
        this.recName = this.selectedData[0].settleCompanyName;
        this.getMsgByCompanyId(this.companyId);

        this.tplModal = this.nm.create({
          nzTitle: '转代收代付',
          nzContent: this.reconciliation,
          nzMaskClosable: false,
          nzOnOk: () => {
            if (this.transCompanyId) {
              this.insteadFun();
            }
            return false;
          }
        });

      } else {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '该数据当前不能进行申请代收代付操作！'
        });
        this.destroyTplModal();
        return;
      }
    }
    // 生成信息费报表
    if (data.buttonId === 'generateInfoFeePayment') {
      if (this.selectedData.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作！'
        });
        this.destroyTplModal();
        return;
      }

      let url = localUrls.paymentReportgenerateInfoFeePayment;
      let param: any = {};
      param['payReportNo'] = this.selectedData[0]['payReportNo'];
      this.http.post(url, param).then((res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '信息费结算报表生成成功', {nzDuration: 3000});
          this.getList(this.searchData);
        }
      });
    }


    // 对账通过按钮
    if (data.buttonId === 'confirm') {
      if (this.selectedData.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择后操作！'
        });
        this.destroyTplModal();
        return;
      }
      if (this.selectedData.length > 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选择一条数据进行操作！'
        });
        this.destroyTplModal();
        return;
      }
      //判断是否能够对账通过
      // console.log(this.selectedData)
      if (this.selectedData[0]['confirmationMark'] === 'QRBJ20') {
        this.carrierCompanyId = this.selectedData[0].virtualCompany;
        this.carrierCompany = this.selectedData[0].virtualCompanyName;
        this.tplModal = this.nm.create({
          nzTitle: '对账通过确认',
          nzContent: this.reconciliation,
          nzMaskClosable: false,
          nzOnOk: () => {
            let url = localUrls.paymentReportReconciliation;
            let param: any = {};
            param['payReportNo'] = this.selectedData[0]['payReportNo'];
            param['confirmationMark'] = 'QRBJ30';
            param.dataCompanyId = this.selectedData[0].companyId;
            param.carrierCompanyId = this.carrierCompanyId;
            this.http.post(url, param).then((res: any) => {
              if (res.success) {
                this.nz.create('success', '提示信息', '对账通过成功', {nzDuration: 3000});
                // this.listSearch({page: 1, length: this.pageSize});
                this.getList(this.searchData);
                this.tplModal.destroy();
              }
            });
            return false;
          }
        });

      } else {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '该数据当前不能进行对账通过操作！'
        });
        this.destroyTplModal();
        return;
      }


    }

    //打印
    if (data.buttonId === 'test') {
      if (this.selectedData.length > 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请只选择一条数据操作！'
        });
        this.destroyTplModal();
        return;
      }
      this.printModalVisible = true;
      this.printModalTabIndex === 0 && this.printListFun(10);
      this.printModalTabIndex = 0;
    }

    //批量打印
    if (data.buttonId === 'batchPrint') {
      this.batchPrint();
    }
    //手工录入
    if (data.buttonId === 'insert') {
      this.modalObj.visible = true;
      this.modalObj.title = `应付报表管理 > ${data.buttonName}`;
      this.validateForm.reset();
      this.modalObj.data.forEach((x: any) => {
        if (x.type === 'inputModal') {
          x.modalName = null;
          x.modalId = null;
          x.value = null;
        }
      });
    }

    //报表导出
    if (data.buttonId === 'testyf') {
      this.btnTestyf();
    }

    // 费用导出
    if (data.buttonId === 'testes') {
      this.btnTestes();
    }
    // 付款登记
    if (data.buttonId === 'payRegister') {
      this.payRegister();
    }
    //删除明细
    if (data.buttonId === 'deleteItem') {
      this.deleteItem();
    }


  }

  getChildrenListData(data: any): void {
    this.childrenDataSet = [];
    this.children_totalPages = 1;
    this.childlistLoading = true;
    let url = this.tabIndex === 0 ? localUrls.paymentReportChildrenListUrl1 : localUrls.paymentReportChildrenListUrl2;
    let param = {tSettleFeeModel: data};
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.childlistLoading = false;
          this.childrenDataSet = this.tabIndex === 0 ? res.data && res.data.data || [] : res.data && res.data.data && res.data.data.data || [];
          // this.children_totalPages = res.data && res.data.total;
        }
      }
    );
  }

  listClick(data: any): void {
    this.currentSelectedListData = data;
    // payReportNo
    this.dataSet.forEach(item => {
      if (item.payReportNo === data.payReportNo) {
        item.checked = !item.checked;
      }
    });

    this.updateData(this.dataSet.filter(item => item.checked));
    //  if (data.rowid === this.tempRowid) {
    //    data.showChildren = !data.showChildren;
    //  } else {
    //    this.dataSet.forEach(element => {
    //      element.showChildren = false;
    //    });
    //    data.showChildren = true;
    //  }
    //  if (data.showChildren) {
    // //   this.showChildrenList = true;  //控制子列表是否显示
    //    this.trSelectedShow = true;
    //    // this.tabIndex = 0;
    //    this.getChildrenListData({});
    //  } else {
    //  //  this.showChildrenList = false;
    //    this.trSelectedShow = false;
    //    this.childrenDataSet = [];
    //    this.currentSelectedListData = {};
    //  }
    //  this.tempRowid = data.rowid;
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
      this.selectedData[0] && this.getChildrenListData(this.selectedData);
    });
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  /**
   * 通过公司ID查询银行信息
   * @param {string} companyId
   */
  getMsgByCompanyId(companyId: string): void {
    this.http.post(urls.getMsgByCompanyId, {companyId: companyId}).then(
      res => {
        if (res.success) {
          this.bankName = res.data.data && res.data.data.bankName;
          this.account = res.data.data && res.data.data.account;
          this.bankId = res.data.data && res.data.data.bankId;
        }
      }
    );
  }

  /**
   * 批量打印合同
   */
  batchPrint(): void {
    this.selectedData.forEach(
      res => {
        this.angularHttp.get(urls.carriageContract,
          {
            responseType: 'blob',
            params: {
              payReportNo: res.payReportNo,
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
    );

  }

  /**
   * 导出
   * @param flag
   */
  exportExcel(flag): void {
    const tPayReportModels = [];
    this.selectedData.map((y: any) => {
      tPayReportModels.push(y.payReportNo);
    });
    this.angularHttp.post(urls.subExport,
      {
        tab: flag,
        payReportNos: tPayReportModels
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
   * 报表导出
   */
  btnTestyf(): void {
    this.angularHttp.post(urls.payReportExportXlsx,
      {...this.searchData},
      {responseType: 'blob'}
    ).subscribe(
      (res: any) => {
        var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        var objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `报表导出.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  /**
   * 费用导出
   */
  btnTestes(): void {
    if (this.selectedData.length === 0) {
      this.nz.warning('提示消息', '请选择数据后操作！');
      return;
    }
    const param = {tSettleFeeModel: this.selectedData};
    this.angularHttp.post(urls.exportSettleFees,
      param,
      {responseType: 'blob'}
    ).subscribe(
      (res: any) => {
        var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        var objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.target = '_blank';
        a.download = `费用导出.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  payRegister() {

    if (!this.selectedData || this.selectedData.length === 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后操作！'
      });
      this.destroyTplModal();
      return;
    }
    let data = this.selectedData.map(item => {
      return {
        payReportNo: item.payReportNo,
        totAmount: item.totAmount
      };
    });
    this.http.post(localUrls.updatePayRegister, {tPayReportModels: data}).then(
      res => {
        if (res.success) {
          this.nz.create('success', '提示信息', res.data.data, {nzDuration: 5000});
          this.getList(this.searchData);

        }
      }
    );
  }

  selectItem(data) {
    this.itemSelectList = data;
  }

  deleteItem() {

    if (!this.itemSelectList || this.itemSelectList.length == 0) {
      this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    let url = localUrls.deletePayReportByNo;
    this.nm.confirm({
      nzTitle: '应付报表管理 > 删除',
      nzContent: '<p class="m-re">是否要将选中的数据删除?</p>',
      nzOnOk: () => new Promise((resolve, reject) => {
        let data = this.itemSelectList.map(item => {
          return {
            rowid: item.rowid,
            settleNo: item.settleNo,
            payReportNo: item.payReportNo,
            settleSubno: item.settleSubno
          };
        });

        this.http.post(url, {tSettleFeeslist: data}).then(
          (res: any) => {
            if (res.success) {
              resolve();
              this.nz.success('提示消息', res.data.data);
              this.getList(this.searchData);
            } else {
              reject();
            }
          }
        );
      })
    });
  }


  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.data.forEach(item => {
            data.push(item);
          });
        }
      }
    );
  }

}
