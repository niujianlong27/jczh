import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Utils} from '../../../../common/util/utils';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {urls} from '../../../../common/model/url';
import {format} from 'date-fns';

@Component({
  selector: 'app-appraise-bid',
  templateUrl: './appraise-bid.component.html',
  styleUrls: ['./appraise-bid.component.css']
})
export class AppraiseBidComponent implements OnInit {

  @ViewChild('modalContent') content;
  @ViewChild('modalFooter') footer;

  private title: string; // 弹窗标题
  private modal: NzModalRef; // 弹窗创建
  private tplModal: NzModalRef;//操作成功后弹窗属性
  buttonId: string; // 按钮 Select 竞价选择，Results 查看竞价结果,Again 重新竞价,Cancel 撤销
  nzWidth = '70%'; // 弹窗宽度
  private modalCancel = new EventEmitter(); // 弹窗取消
  type: string; // 类型 均价:CJLX10,流向:CJLX20,品名:CJLX30
  radioValue: string = '10'; // 重新竞价 选择绑定值
  showChildList: boolean = false; // 弹窗是否展示子列表
  trSelectedShow: boolean = false; // 弹窗列表点击选中
  modalListLoading: boolean = false; //弹窗主表单载入状态
  modalChildListLoading: boolean = false; // 弹窗子表单载入状态
  companyLists: Array<any> = [];           //承运人列表
  modalForm: any = {orderBids: [], itemAggregates: {}}; //弹窗表单
  nzSelectedIndex = 0;

  unitArray: Array<any> = []; // 价格静态数据
  taxArray: Array<any> = []; // 税静态数据

  tempRowid: string; // 点击数据rowid暂存
  tempTenderBidNo: string; // 点击数据tenderBidNo暂存

  header: Array<any> = []; // 表头
  // 主表单
  dataSet: Array<any> = []; // 表格数据
  searchParam: Array<any> = []; //搜索数据缓存
  listLoading: boolean = true; // 主列表加载状态
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  selectedData: any;  // 选中的数据
  btnDisable: any = {      // 禁用按钮
    Select: true,
    Results: true,
    Again: true,
    Cancel: true
  };

  // 延时时间
  timeTypeArr: any[] = [{name: '10', value: '10'}, {name: '20', value: '20'}, {name: '30', value: '30'}];

  // 明细相关
  // 货盘明细
  dataSetPallet: Array<any> = [];
  totalPagePallet: number = 0;

  // 捆包明细 bale
  dataSetBale: Array<any> = [];
  totalPageBale: number = 0;

  childHeader: Array<any> = [];
  childDataSet: Array<any> = [];

  // 竞价数据
  bidDataSet: Array<any> = [];


  averageHeader: Array<any> = [
    {colCname: '出价时间', colEname: 'createDate', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '承运人', colEname: 'bidderName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '承运人联系方式', colEname: 'mobile', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '船舶名称', colEname: 'boatName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '船期', colEname: 'loadDateStart', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '载重MT', colEname: 'capacity', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '是否含税', colEname: 'settleTypeName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: `参考运价 单位`, colEname: 'markedPriceTax', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: `投标价*单位`, colEname: 'companyName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: `箱数*个`, colEname: 'containerNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
  ];

  // 竞价左list
  bidLeftHeader: Array<any> = [
    {colCname: '出价时间', colEname: 'bidderTime', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '承运人', colEname: 'bidderId', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '承运人联系方式', colEname: 'mobile', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '船舶名称', colEname: 'boatName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '船期', colEname: 'loadDateStart', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '载重MT', colEname: 'capacity', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: `总价`, colEname: 'containerNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
  ];

  // 竞价右List
  // 流向
  bidRightHeader1: Array<any> = [
    {colCname: '货盘号', colEname: 'palletNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '装货港-码头', colEname: 'startAddress', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '卸货港-码头', colEname: 'endAddress', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '重量（MT）', colEname: 'goodsWeight', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '数量', colEname: 'goodsNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '是否含税', colEname: 'settleType', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '参考运价', colEname: 'referencePriceTaxNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '投标价', colEname: 'offerPriceTax', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '箱数*个', colEname: 'goodsNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'}
  ];

  // 品名
  bidRightHeader2: Array<any> = [
    {colCname: '货盘号', colEname: 'palletNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '货盘明细号', colEname: 'palletItemNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '装货港-码头', colEname: 'startAddress', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '卸货港-码头', colEname: 'endAddress', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '品名', colEname: 'productName', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '规格', colEname: 'specDesc', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '重量（MT）', colEname: 'goodsWeight', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '数量', colEname: 'goodsNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '集装箱类别', colEname: 'containerType', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '集装箱个数', colEname: 'containerNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '是否含税', colEname: 'settleType', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '参考运价', colEname: 'referencePriceTaxNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '投标价', colEname: 'offerPriceTax', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
    {colCname: '箱数*个', colEname: 'goodsNo', visible: 'XSBJ10', edit: 'BJBJ20', type: 'string', width: '120'},
  ];

  // 按流向表头
  flowTemplateHeader: Array<any> = [
    {eName: 'palletNo', cName: '货盘号', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'startAddress', cName: '装货港-码头', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'endAddress', cName: '卸货港码头', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'goodsWeight', cName: '重量（MT）', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'settleType', cName: '是否含税', colStatus: false, type: 'string', switch: 'taxSelect'},
    {eName: 'markedPriceTaxNo', cName: '最高限价', colStatus: true, type: 'string', switch: 'unitSelect'}
  ];

  // 按品名表头
  productTemplateHeader: Array<any> = [
    {eName: 'palletNo', cName: '货盘号', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'palletItemNo', cName: '货盘明细号', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'startAddress', cName: '装货港-码头', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'endAddress', cName: '卸货港码头', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'productName', cName: '品名', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'specDesc', cName: '规格', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'goodsWeight', cName: '重量（MT）', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'containerType', cName: '集装箱类别', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'containerNo', cName: '集装箱个数', colStatus: false, type: 'string', switch: 'string'},
    {eName: 'settleType', cName: '是否含税', colStatus: false, type: 'string', switch: 'taxSelect'},
    {eName: 'markedPriceTaxNo', cName: '最高限价', colStatus: true, type: 'string', switch: 'unitSelect'},
  ];

  templateDataSet: Array<any> = [];

  parmas: any = {
    classification: 'flow',
    tOrderTenderItemAggregateModels: []
  };


  constructor(private http: HttpUtilService, private nm: NzModalService, private notification: NzNotificationService) {
  }

  ngOnInit() {
    this.listMainSearch({page: 1, length: this.pageSize});
    this.modalCancel.subscribe(
      () => {
        this.modal.destroy();
      }
    );
    this.selectCompanyer();

    this.getStatic(this.unitArray, 'JJJS');
    this.getStatic(this.taxArray, 'JSFS');
  }

  // 主列表获取
  listMainSearch(data: any): void {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.listLoading = true;
    this.getListMainSearch(data);
  }

  getListMainSearch(data: any): void {
    let url = TRANS_URLS.selectPalletList;
    this.searchParam = data;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data.data || [];
          this.totalPage = res.data.data.total || 0;
        }
        this.listLoading = false;
      }
    );
  }

  // 货盘明细
  getListPallet(data: any): void {
    let url = TRANS_URLS.selelctPalletItemByContent;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSetPallet = res.data.data || [];
        }
      }
    );
  }

  // 捆包明细
  getListBale(data: any): void {
    let url = TRANS_URLS.selectpalletPackContent;
    this.http.post(url, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSetBale = res.data.data || [];
        }
      }
    );
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data || []);
        }
      }
    );
  }

  //弹窗列表获取
  getModalList(url, param): void {
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.bidDataSet = res.data.data || res.data.data.data || [];
        }
      }
    );
  }

  // 子列表
  getChildResult(data: any): void {
    this.http.post(TRANS_URLS.getPalletDetails, {tenderBidNo: data.tenderBidNo, bidderId: data.bidderId}).then(
      (res: any) => {
        this.childDataSet = res.data.data || [];
      }
    );
  }

  // 货盘明细 捆包明细查询
  getPalletFind(data): void {
    this.http.post(urls.palletFind, {palletNo: data.palletNo || ''}).then(
      (res: any) => {
        if (res.success) {
          this.dataSetPallet = res.data.data.palletItemModelList;
          this.dataSetBale = res.data.data.palletPackModelList;
        } else {
          this.dataSetPallet = [];
          this.dataSetBale = [];
        }
      }
    );
  }

  //承运人查询
  selectCompanyer(name: string = '') {
    this.http.post(urls.selectCompanyUserBid, {tenderFlag: 1, name: name}).then((x: any) => {
      if (x.success) {
        this.companyLists = x.data.data;
      }
    });
  }

  // 撤销
  revokeTender(): void {
    this.http.post(TRANS_URLS.revokeTender, {tOrderTenderItemAggregateModels: [{tenderNo: this.selectedData.tenderNo}]}).then(
      (res: any) => {
        if (res.success) {
          this.notification.success('提示消息', '撤销成功!');
          this.listMainSearch(this.searchParam);
        } else {
          this.notification.error('提示消息', '撤销失败!');
        }
      }
    );
  }

  // 穿梭框查询
  dataFilter(inputValue: string, item: any): boolean {
    return item.name.indexOf(inputValue) > -1;
  }

  //穿梭框数据改变
  selectedBider(data: any) {
    if (data.to === 'right') {
      this.modalForm.orderBids = [...this.modalForm.orderBids, ...data.list];
    } else {
      data.list.map((x: any) => {
        this.modalForm.orderBids = this.modalForm.orderBids.filter((a: any) => a.userId != x.userId);
      });
    }
  }

  // 按钮点击触发事件
  btnClick(data: any) {
    if (!this.selectedData) {
      this.tplModal = this.nm.warning(
        {
          nzTitle: '提示信息',
          nzContent: '请选择数据后操作！'
        }
      );
      this.destroyTplModal();
      return;
    }
    this.showChildList = false;
    this.nzSelectedIndex = 0;
    this.buttonId = data.buttonId;
    const url = TRANS_URLS.getBiddingSelection;
    this.type = this.selectedData.tenderType || '';
    const param = {
      tenderNo: this.selectedData.tenderNo,
      bidding: ''
    };

    if (this.buttonId === 'Select') {
      this.title = '竞价评选管理>  竞价选择';
      param.bidding = 'selection';
      switch (this.type) {
        case 'CJLX10': {
          this.header = Utils.deepCopy(this.averageHeader);
        }
          break;
        case 'CJLX20': {
          this.header = Utils.deepCopy(this.bidLeftHeader);
          this.childHeader = Utils.deepCopy(this.bidRightHeader1);
        }
          break;
        case 'CJLX30': {
          this.header = Utils.deepCopy(this.bidLeftHeader);
          this.childHeader = Utils.deepCopy(this.bidRightHeader2);
        }
          break;
        default: {
          this.notification.error('提示消息', '选择数据非法');
          return;

        }
      }
      this.getModalList(url, param);
      this.creatModal();
      return;
    }

    if (this.buttonId === 'Results') {
      this.title = '竞价评选管理>  查看竞价结果';
      param.bidding = 'results';

      switch (this.type) {
        case 'CJLX10': {
          this.header = Utils.deepCopy(this.averageHeader);
        }
          break;
        case 'CJLX20': {
          this.header = Utils.deepCopy(this.bidLeftHeader);
          this.childHeader = Utils.deepCopy(this.bidRightHeader1);
        }
          break;
        case 'CJLX30': {
          this.header = Utils.deepCopy(this.bidLeftHeader);
          this.childHeader = Utils.deepCopy(this.bidRightHeader2);
        }
          break;
        default: {
          this.notification.error('提示消息', '选择数据非法');
          this.type = 'CJLX10';
          this.header = Utils.deepCopy(this.averageHeader);
          // return;
        }
      }
      this.getModalList(url, param);
      this.creatModal();
      return;
    }

    if (this.buttonId === 'Again') {
      this.title = '竞价评选管理>  重新发布';
      this.creatModal();
      return;
    }

    if (this.buttonId === 'Cancel') {
      this.revokeTender();
    }
  }

  tabClick(): void {
    this.showChildList = false;
    if (this.nzSelectedIndex === 0) {
      this.getModalList(TRANS_URLS.getBiddingSelection, {bidding: 'results', tenderNo: this.selectedData.tenderNo});
    } else {
      this.getModalList(TRANS_URLS.getBiddingSelectionHistory, {tenderNo: this.selectedData.tenderNo});
    }
  }

  // 竞价选择
  radioChange(): void {
    this.modalForm = {orderBids: [], itemAggregates: {}};
    this.parmas.classification = 'flow';
    if (this.radioValue === '20') {
      this.require(this.parmas);
    }
  }

  //捆绑发布按品名、流向切换
  tab(data: string) {
    this.parmas.classification = data;
    this.require(this.parmas);
  }

  //捆绑发布发送请求
  require(data: {}) {
    this.http.post(urls.entrustBundled, data).then(
      (res: any) => {
        // this.loading = false;
        if (res.success) {
          this.templateDataSet = res.data.data || [];
        }
      }
    );
  }

  // 创建弹窗
  creatModal(): void {
    this.modal = this.nm.create(
      {
        nzTitle: this.title,
        nzContent: this.content,
        nzFooter: this.footer,
        nzClosable: true,
        nzMaskClosable: false,
        nzWidth: this.nzWidth,
        nzOnCancel: () => {
          this.modalCancel.emit();
        }
      }
    );
  }

  // 取消 关闭触发
  close(): void {
    this.modalCancel.emit();
  }

  // 弹窗list点击事件
  listClick(data: any) {
    if (this.type === 'CJLX10') {
      return;
    }
    if (data.tenderBidNo === this.tempTenderBidNo) {
      data.showChildren = !data.showChildren;
    } else {
      this.dataSet.forEach(element => {
        element.showChildren = false;
      });
      data.showChildren = true;
    }
    if (data.showChildren) {
      this.showChildList = true;  //控制子列表是否显示
      this.trSelectedShow = true;
      this.getChildResult(data);
    } else {
      this.showChildList = false;
      this.trSelectedShow = false;
    }
    this.tempTenderBidNo = data.tenderBidNo;
  }

  // 主列表选中数据
  updateDataResult(data: any): void {
    this.selectedData = data[0];
    this.parmas.tOrderTenderItemAggregateModels = data;
    if (!this.selectedData) {
      this.btnDisable = {
        Select: true,
        Results: true,
        Again: true,
        Cancel: true
      };

      return;
    }
    switch (data[0] ? data[0].status : '') {
      case 'JJZZ10':
      case 'JJZZ20':
      case 'JJZZ30': {
        this.btnDisable = {
          Select: true,
          Results: true,
          Again: true,
          Cancel: false
        };
      }
        break;
      case 'JJZZ40': {
        this.btnDisable = {
          Select: false,
          Results: true,
          Again: true,
          Cancel: true
        };
      }

        break;
      case 'JJZZ50': {
        this.btnDisable = {
          Select: true,
          Results: false,
          Again: true,
          Cancel: true
        };
      }
        break;
      case 'JJZZ60': {
        this.btnDisable = {
          Select: true,
          Results: false,
          Again: false,
          Cancel: true
        };
      }
        break;

      default: {
        this.btnDisable = {
          Select: true,
          Results: true,
          Again: true,
          Cancel: true
        };
      }
    }


  }

  // 重新竞价
  publishBid(): void {
    let param: any = {orderBids: [], palletModels: []};
    param.bidTimeStart = format(this.modalForm.bidTimeStart, 'YYYY-MM-DD HH:mm:ss');
    param.oneTime = this.modalForm.oneTime;
    param.markedPriceTaxNo = this.modalForm.markedPriceTaxNo;
    param.twoTime = this.modalForm.twoTime;
    param.delay = this.modalForm.delay;
    param.remark = this.modalForm.remark;
    param.palletModels.push({palletNo: this.selectedData.palletNo});
    param.bidder = 'CJRS20';
    param.status = 'JJZZ60';
    this.modalForm.orderBids.map(
      (x: any) => {
        let o: any = {};
        o.bidderCompanyId = x.companyId;
        o.bidderId = x.userId;
        param.orderBids.push(o);
      }
    );
    if (this.radioValue === '10') {

    }
    if (this.radioValue === '20') {
      param.itemAggregates = [];
      this.templateDataSet.forEach(
        (res: any) => {
          const temp: any = {};
          temp.tenderPalletNos = res.palletNo;
          temp.tenderItemNos = res.palletItemNo;
          temp.settleType = res.settleType;
          temp.markedPriceTaxNo = res.markedPriceTaxNo;
          temp.calculation = res.calculation;
          param.itemAggregates.push(temp);
        }
      );
    }
    console.log(param);
    this.http.post(TRANS_URLS.rebidding, param).then(
      (res: any) => {
        console.log('重新竞价成功!');
      }
    );
  }

  // 选择点击事件
  selectClick(data): void {
    this.http.post(TRANS_URLS.bidSelect, {bidderId: data.bidderId, tenderNo: this.selectedData.tenderNo}).then(
      (res: any) => {
        if (res.success) {
          this.notification.success('提示消息', '选择竞价人成功!');
          this.modalCancel.emit();
          this.updateDataResult([]);
          this.listMainSearch(this.searchParam);
        }
      }
    );
  }

  // 提示消息弹窗销毁
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  listMainClick(data: any) {
    this.getListPallet(data);
    this.getListBale(data);
  }
}
