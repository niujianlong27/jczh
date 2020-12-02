import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {Router} from '@angular/router';
import {NzMessageService, NzModalRef, NzModalService, UploadFile} from 'ng-zorro-antd';
import {TRANS_URLS, SETTLE_URLS} from '@model/trans-urls';
import {UserinfoService} from '@service/userinfo-service.service';
import {HttpClient} from '@angular/common/http';
import {localUrls} from '@model/localUrls';
import {until} from 'selenium-webdriver';
import {urls} from '@model/url';

@Component({
  selector: 'app-waybill-fee-reg',
  templateUrl: './waybill-fee-reg.component.html',
  styleUrls: ['./waybill-fee-reg.component.css']
})
export class WaybillFeeRegComponent implements OnInit {
  @ViewChild('copyPriceModal') copyPriceModal: TemplateRef<any>;
  private modalRef: NzModalRef;
  private importModalRef: NzModalRef;
  radioValue = '10';
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  payableFlag: any;     //应付勾选框
  agentFlag: boolean;   //应收勾选框
  payPrice: any;   //应付运费单价
  unitPrice: any;  //应收运费单价
  // 运单相关信息
  waybillData: Array<any> = [];
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  selectedWaybillData: Array<any> = [];
  selectedPackData: Array<any> = [];
  btnLoading: any = {
    save: false,
    createSettle: false,
    createCopeSettle: false,
    createReceivableSettle: false
  };

  // 运单司机/捆包相关信息
  packData: Array<any> = [];
  packLoading: boolean = false;
  packPageSize: number = 100;
  packTotal: number = 0;

  // 导入弹框是否显示
  isVisible: boolean = false;
  rcvTransFeeTotal: number;
  transFeeTotal: number;

  rcvTransTotalFee: number;
  transTotalFee: number;

  // rightShow:boolean = false;
  businessType: string;
  linePrice: number;
  // 文件上传相关
  @ViewChild('importDataModal') importDataModal: TemplateRef<any>;
  importUrl = TRANS_URLS.import;

  fileList: UploadFile[] = [];
  gridOneHeight: string;
  gridTwoHeight: string;
  private searchData: any = {};
  public addPrice: number;
  public choiceType = 'waybill';

  constructor(
    private http: HttpUtilService,
    public router: Router,
    private modal: NzModalService,
    private msg: NzMessageService,
    private info: UserinfoService,
    private anhttp: HttpClient
  ) {
  }

  ngOnInit() {
  }

  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  /**
   * 查询运单
   * @param pageParam
   */
  query(pageParam?: any) {
    this.loading = true;
    this.businessType = '';
    this.packData = [];//新加的
    this.waybillData = [];//新加的
    this.rcvTransTotalFee = 0;
    this.transTotalFee = 0;
    this.rcvTransFeeTotal = 0;
    this.transFeeTotal = 0;
    this.selectedWaybillData = [];
    this.totalWeight = 0;
    this.totalSheet = 0;

    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    this.searchData = pageParam;
    this.http.post(TRANS_URLS.RETURN_WAYBILL_SYS, {...pageParam}).then((res: any) => {
      if (res.success) {
        this.waybillData = res.data.data.data ? res.data.data.data : [];
        this.total = res.data.data.total ? res.data.data.total : 0;
        this.waybillData.forEach((item, index) => item.rowIndex = index + 1);
      }
      this.loading = false;
    });
  }

  /**
   * 按钮区按钮点击事件统一处理
   * @param button
   */
  btnClick(button: any) {
    switch (button.buttonId) {
      case 'save':
        this.save();
        break;
      case 'createSettle':
        this.createSettle();
        break;
      case 'createReceivableSettle':
        this.receivableSettle();
        break;
      case 'createCopeSettle':
        this.copeSettle();
        break;
      case 'copyPrice':
        this.copyPrice();
        break;
      case 'import':
        this.importData();
        break;
      case 'exportList':
        this.exportList();
        break;
      default:
        this.msg.error('按钮未绑定方法');
    }
  }

  /**
   * 保存
   */
  save() {
    const selectedPack = this.packData.filter(item => item.checked);
    if (selectedPack.length == 0) {
      this.msg.error('请至少选择一条运单捆包记录！');
      return;
    }
    this.btnLoading.save = true;
    this.http.post(TRANS_URLS.UPDATE_WAYBILLPACK, {tWaybillPacks: selectedPack}).then(
      (res: any) => {
        this.btnLoading.save = false;
        if (res.success) {
          this.msg.success(`保存成功！修改捆包信息${selectedPack.length}条`);
          this.query(this.searchData);
        }
      }
    );
  }

  /**
   * 生成结算单
   */
  createSettle() {
    if (true) {
      return this.msg.error('该功能暂不提供使用！');
    }
    if (!this.selectedWaybillData || this.selectedWaybillData.length < 1) {
      this.msg.error('请至少选择一条运单记录！');
      return;
    }

    const invalidate = this.selectedWaybillData.filter(waybill =>
      this.packData.filter(pack => waybill.waybillNo == pack.waybillNo).every(item => !isNaN(item.rcvUnitPrice) && item.rcvUnitPrice > 0)
      || this.packData.filter(pack => waybill.waybillNo == pack.waybillNo).every(item => !isNaN(item.unitPrice) && item.unitPrice > 0));

    // if(invalidate.length > 0){
    //   this.msg.error(`所选运单中运单号为：${invalidate.map(item => item.waybillNo).join(",")}的运单应收价格或应付价格不全为数字`);
    //   return;
    // }
    let param = [];
    this.selectedWaybillData.map((x: any) => {
      let o: any = {};
      o.waybillNo = x.waybillNo;
      param.push(o);
    });
    this.btnLoading.createSettle = true;
    this.http.post(SETTLE_URLS.ADD_TRANS_FEE_PRICE, {waybillList: param}).then(
      (res: any) => {
        this.btnLoading.createSettle = false;
        if (res.success) {
          this.msg.success(`生成结算单成功！`);
          //this.query({});
          this.query(this.searchData);
        }
      }
    );

  }

  /**
   * 生成 应收结算单
   */
  receivableSettle() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length < 1) {
      this.msg.error('请至少选择一条运单记录！');
      return;
    }

    const invalidate = this.selectedWaybillData.filter(waybill =>
      this.packData.filter(pack => waybill.waybillNo == pack.waybillNo).every(item => !isNaN(item.rcvUnitPrice) && item.rcvUnitPrice > 0)
      || this.packData.filter(pack => waybill.waybillNo == pack.waybillNo).every(item => !isNaN(item.unitPrice) && item.unitPrice > 0));

    // if(invalidate.length > 0){
    //   this.msg.error(`所选运单中运单号为：${invalidate.map(item => item.waybillNo).join(",")}的运单应收价格或应付价格不全为数字`);
    //   return;
    // }
    let param = [];
    this.selectedWaybillData.map((x: any) => {
      let o: any = {};
      o.waybillNo = x.waybillNo;
      param.push(o);
    });
    this.btnLoading.createReceivableSettle = true;
    this.http.post(SETTLE_URLS.GENERATE_RECEIVABLE_SETTLE, {waybillList: param}, null, 6000000).then(
      (res: any) => {
        this.btnLoading.createReceivableSettle = false;
        if (res.success) {
          this.msg.success(`生成应收结算单成功！`);
          // this.query({});
          this.query(this.searchData);
        }
      }
    );

  }


  /**
   * 生成  应付结算单
   */
  copeSettle() {
    if (!this.selectedWaybillData || this.selectedWaybillData.length < 1) {
      this.msg.error('请至少选择一条运单记录！');
      return;
    }

    const invalidate = this.selectedWaybillData.filter(waybill =>
      this.packData.filter(pack => waybill.waybillNo == pack.waybillNo).every(item => !isNaN(item.rcvUnitPrice) && item.rcvUnitPrice > 0)
      || this.packData.filter(pack => waybill.waybillNo == pack.waybillNo).every(item => !isNaN(item.unitPrice) && item.unitPrice > 0));

    // if(invalidate.length > 0){
    //   this.msg.error(`所选运单中运单号为：${invalidate.map(item => item.waybillNo).join(",")}的运单应收价格或应付价格不全为数字`);
    //   return;
    // }
    let param = [];
    this.selectedWaybillData.map((x: any) => {
      let o: any = {};
      o.waybillNo = x.waybillNo;
      param.push(o);
    });
    this.btnLoading.createCopeSettle = true;
    this.http.post(SETTLE_URLS.GENERATE_COPE_SETTLE, {waybillList: param}, null, 6000000).then(
      (res: any) => {
        this.btnLoading.createCopeSettle = false;
        if (res.success) {
          this.msg.success(`生成应付结算单成功！`);
          // this.query({});
          this.query(this.searchData);
        }
      }
    );

  }

  /**
   * 复制单价
   */
  copyPrice() {
    this.addPrice = null;
    this.choiceType = 'waybill';
    const businessTypeName = this.selectedWaybillData.every((x: any) => x.businessTypeName === this.selectedWaybillData[0].businessTypeName);
    if (!this.selectedWaybillData[0]) {
      this.msg.error('请选择数据再操作!');
      return;
    }
    if (!businessTypeName) {
      this.msg.error('请选择统一业务板块的运单!');
      return;
    }
    // this.msg.warning("该功能待开发");
    // this.businessType = this.selectedWaybillData[0].businessType; 之前是这个，改为同一个弹窗内容
    this.businessType = '009';
    this.radioValue = this.businessType === '009' ? '50' : '10';
    this.modalRef = this.modal.create({
      nzTitle: '价格匹配',
      nzMaskClosable: false,
      nzContent: this.copyPriceModal,
      nzOnOk: () => {
      return   this.settleV2CheckRequest().then(
          value => {
            if (value) {

              if (this.radioValue == '70' && (!this.addPrice || this.addPrice <= 0)) {
                this.modal.error({
                  nzTitle: '提示信息',
                  nzContent: '总价录入必填且要大于0!'
                });
                return false;
              }
              this.businessType === '009' && this.rizhaoCopyPriceResult();
              return false;

            } else {
              return false;
            }
          }
        );
        //
        // if (this.radioValue == '70' && (!this.addPrice || this.addPrice <= 0)) {
        //   this.modal.error({
        //     nzTitle: '提示信息',
        //     nzContent: '总价录入必填且要大于0!'
        //   });
        //   return false;
        // }
        // this.businessType === '009' && this.rizhaoCopyPriceResult();
        // return false;
      }
    });
  }

  rizhaoCopyPriceResult() {
    let params: any = {tWaybills: []};
    this.selectedWaybillData.map((x: any) => {
      let o: any = {};
      o.waybillNo = x.waybillNo;
      o.orderNo = x.orderNo;
      params.tWaybills.push(o);
    });
    params.linePrice = this.radioValue === '60' ? this.linePrice : undefined;
    if (this.radioValue == '70') {
      params.addPrice = this.addPrice;
      params.choiceType = this.choiceType;
    }
    this.http.post(localUrls.generateReports, params).then((res: any) => {
      if (res.success) {
        // this.msg.success(`${res.data.data}`);
        this.modal.info({
          nzTitle: '提示信息',
          nzContent: res.data.data
        });
        this.modalRef.destroy();
        this.queryPack('rizhaoCopyPrice');
      }
    });

  }

  /**
   * grid 输入变化触发事件
   * @param data
   */
  modelChange(data) {
    //2019-9-2 新增一个逻辑，只修改了这里 start
    if (data.header.colEname === 'payLinePrice') {
      if (data.data.receiveType === 'JJFS20') {
        const unitPrice = data.data.payLinePrice * 32 / this.totalWeight;
        this.packData.forEach(
          value => {
            value.payLinePrice = data.data.payLinePrice;
            value.unitPrice = unitPrice;
            value.transFee = unitPrice * value.prePackWeight;
            value.receiveType = 'JJFS20';
          }
        );
      } else {
        data.data.unitPrice = data.data.payLinePrice;
        data.data.transFee = data.data.unitPrice * data.data.prePackWeight;
      }
    }
    //end
    if (data.header.colEname === 'rcvUnitPrice' || data.header.colEname === 'rcvReceiveType') {
      // if (data.data.rcvReceiveType === 'JJFS10') {
      this.packData.forEach(item => {
        if (item.rowid == data.data.rowid) {
          item.rcvTransFee = item.rcvUnitPrice * item.prePackWeight;
        }
      });
      //   }
    }

    if (data.header.colEname === 'unitPrice' || data.header.colEname === 'receiveType') {

      if (data.data.receiveType === 'JJFS20') {
        const unitPrice = data.data.payLinePrice * 32 / this.totalWeight;
        this.packData.forEach(
          value => {
            value.payLinePrice = data.data.payLinePrice;
            value.unitPrice = unitPrice;
            value.transFee = unitPrice * value.prePackWeight;
            value.receiveType = 'JJFS20';
          }
        );
      } else {
        this.packData.forEach(item => {
          if (item.rowid == data.data.rowid) {
            item.unitPrice = data.data.payLinePrice;
            item.transFee = item.unitPrice * item.prePackWeight;
          }
        });
      }
      // if (data.data.receiveType === 'JJFS10') {
      // }
    }


  }

  /**
   * 失焦事件
   */
  inputBlur(data: any) {
    if (data.data.checked) {
      this.selectedPack(this.packData);
    }

  }

  /**
   * 行点击事件
   * @param data
   */
  rowCilcked(data: any) {
    this.waybillData.forEach(item => {
      if (item.rowIndex === data.rowIndex) {
        item.checked = !item.checked;
      }
    });
    this.selectedWaybill(this.waybillData.filter(item => item.checked));
  }

  totalWeight: number = 0;
  totalSheet: number = 0;


  /**
   * 选中数据
   * @param data
   */
  selectedWaybill(data: any) {
    this.selectedWaybillData = data;
    this.totalWeight = this.selectedWaybillData.map(item => item.preTotalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalSheet = this.selectedWaybillData.map(item => item.preTotalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0);


    this.queryPack();
  }

  /**
   *  捆包选中
   * */
  selectedPack(data: any[]) {
    this.selectedPackData = data;
    this.rcvTransTotalFee = data.map((x: any) => x.rcvTransFee).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    this.transTotalFee = data.map((x: any) => x.transFee).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
  }

  /**
   * 根据运单查询运单捆包信息
   */
  queryPack(type?: string) {
    if (this.selectedWaybillData.length == 0) {
      this.packData = [];
      this.rcvTransFeeTotal = 0;
      this.transFeeTotal = 0;
      return;
    }
    const selectedWaybillDataMap: {
      [waybillNo: string]: { businessType: string, priceFlag: string }
    } = {};

    const param = [];
    this.selectedWaybillData.map(
      res => {
        selectedWaybillDataMap[res.waybillNo] = {businessType: res.businessType, priceFlag: res.priceFlag};
        param.push(
          {
            companyId: res.companyId,
            waybillNo: res.waybillNo
          }
        );
      }
    );

    this.http.post(localUrls.getListByWayBillModel, {tWaybills: param}).then(
      (res: any) => {
        if (res.success) {
          this.packData = res.data.data;
          this.rcvTransTotalFee = 0;
          this.transTotalFee = 0;
          this.rcvTransFeeTotal = this.packData.map((x: any) => x.rcvTransFee).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
          this.transFeeTotal = this.packData.map((x: any) => x.transFee).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
          this.packData.map((x: any) => {
            x.inputDisabled = {};
            //2019-9-2 应付单价和应收线路价格禁用 start
            x.inputDisabled.unitPrice = true;
            x.inputDisabled.linePrice = true;
            x.inputDisabled.rcvReceiveType = true;
            x.inputDisabled.rcvUnitPrice = true;
            x.inputDisabled.rcvTransFee = true;
            x.inputDisabled.transFee = true;
            //end
            /* if (selectedWaybillDataMap[x.waybillNo].businessType === '005' || selectedWaybillDataMap[x.waybillNo].businessType === '009') {
               x.inputDisabled.rcvReceiveType = true;
               x.inputDisabled.rcvUnitPrice = true;
               x.inputDisabled.rcvTransFee = true;
               x.inputDisabled.transFee = true;
             }
             switch (selectedWaybillDataMap[x.waybillNo].priceFlag) {
               // HJBJ20应收结算单生成
               // HJBJ30应付结算单生成
               case 'HJBJ20': {
                 x.inputDisabled.rcvReceiveType = true;
                 x.inputDisabled.rcvUnitPrice = true;
                 x.inputDisabled.rcvTransFee = true;
                 x.inputDisabled.transFee = true;
               }
                 break;
               case 'HJBJ30': {
                 x.inputDisabled.receiveType = true;
                 x.inputDisabled.unitPrice = true;
                 x.inputDisabled.transFee = true;
                 x.inputDisabled.transFee = true;
               }
                 break;
             }*/
            if (!x.rcvReceiveType) {
              x.rcvReceiveType = 'JJFS10';
            }
            if (!x.receiveType) {
              x.receiveType = 'JJFS10';
            }
            /* if (type === 'rizhaoCopyPrice') {
               x.inputDisabled = {};
               x.inputDisabled.rcvReceiveType = true;
               x.inputDisabled.rcvUnitPrice = true;
               x.inputDisabled.rcvTransFee = true;
               x.inputDisabled.transFee = true;
             }*/
          });
        }
      }
    );
  }

  /**
   * 导入数据
   */
  importData(): void {
    this.importModalRef = this.modal.create({
        nzTitle: '导入数据',
        nzContent: this.importDataModal,
        nzOnOk: () => this.handleUpload(),
      }
    );
    this.importModalRef.afterClose.subscribe(
      () => {
        this.fileList = [];
      }
    );
  }

  /**
   * 文件上传处理
   * @param file
   */
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  /**
   * 确认上传
   */
  handleUpload(): Promise<any> {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
        formData.append('file', file);
      }
    );

    return this.http.post(TRANS_URLS.import + '?requestCompanyId=' + this.info.get('USER').companyId, formData).then(
      res => {
        if (res.success) {
          this.msg.success('上传成功!');
          this.query(this.searchData);
        }
      }
    );

  }

  /**
   * 捆包明细导出
   */
  exportList() {
    const url: string = TRANS_URLS.exportListByWayBillModel;
    const param = [];
    this.selectedWaybillData.forEach(
      res => {
        param.push({companyId: res.companyId, waybillNo: res.waybillNo});
      }
    );
    this.anhttp.post(url, {tWaybills: param}, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `运单捆包明细.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });
  }

  /**
   * 价格匹配前检查
   */
  settleV2CheckRequest(): Promise<boolean> {
    const url = localUrls.settleV2Check;
    const param = {
      waybillList: [],
      companyId: this.info.get('USER').companyId
    };
    this.selectedWaybillData.forEach(
      value => param.waybillList.push({waybillNo: value.waybillNo})
    );
    return this.http.post(url, param).then(
      res => {
        return res.success;
      }
    );
  }

}

