import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {urls} from '@model/url';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {CommonService} from '@service/common.service';
import {Utils} from '../../sea/common/utils';
import {UploadFiles} from '@service/upload-files';
import {format, addMinutes, differenceInMinutes} from 'date-fns';

@Component({
  selector: 'app-grad-evaluate',
  templateUrl: './grad-evaluate.component.html',
  styleUrls: ['./grad-evaluate.component.css']
})
export class GradEvaluateComponent implements OnInit {
  selectedValue = null;
  recordTit: string;
  confirmCon: string;
  modalRef: NzModalRef;
  data1: any[] = [];
  data2: any[] = [];
  selectData1: any[] = [];
  loading: boolean = false;
  modalTitle: string;
  bidPriceType: string = '10';
  taxInclusive: string = '20';
  unitPrice: string = '10';
  driverType: string;
  continueTimeArr: Array<any> = [
    {name: '自定义', value: '0'},
    {name: '10分钟', value: '10'},
    {name: '15分钟', value: '15'},
    {name: '20分钟', value: '20'},
    {name: '30分钟', value: '30'}
  ];
  circulationRobContinueTimeArr: Array<any> = [
    {name: '自定义', value: '0'},
    {name: '一天', value: '1440'},
    {name: '三天', value: '4320'},
    {name: '五天', value: '7200'},
    {name: '十五天', value: '21600'}
  ];
  listOfSelectedValue: string[] = [];
  carriageOfSelectedValue: string[] = [];
  // 主列表页码数据
  totalpage: number = 0;
  pageSize: number = 30;
  // 子列表货盘明细页码数据
  totalpage2: number = 0;
  pageSize2: number = 30;
  data2PageTmp: any = {length: 30}; // 货盘明细页码数据缓存
  nextLoading: boolean = false;
  searchData: any = {};//存储查询条件
  modalForm: any = {};
  modalResultShow: boolean = false;
  comfirmLoading: boolean = false;
  historyIsVisible: boolean = false;
  selectedIndex: number = 0;
  selectedIndex1: number = 0;
  queryHistoryLoading: boolean = false;
  confirmLoading: boolean = false;
  bidHistory: Array<any> = [];
  bidHistoryAll: Array<any> = [];
  bidFlag: boolean = false;
  tplModal: NzModalRef;
  bidCompanyUser: Array<any> = [];//投标人数据
  btnDis: any = {bid: true, result: true};
  status: any = '';//根据不同状态显示不同弹窗   10:显示船舶信息，投标价。  20：显示table,投标价
  buttonId: string;
  private modalCancel = new EventEmitter(); // 弹窗取消
  tempInfo: any = {};
  getBidInfo: any = {};//抢单数据
  inputShow: boolean = false;
  isDriverGrab: boolean = false; // 是否司机抢单确认：true：司机抢单；false:抢单
  isAllDisplayDataChecked = false; // 司机选择全选
  isIndeterminate = false;
  footerText: any;
  // driverList: Array<any> = []; // 司机数据
  public driverData: any = {
    driverList: [], // 司机数据
    bidderCompanyList: [], // 承运人数据存放---下拉加载用
    bidderCompanyListStorage: [], // 承运人数据
    driverListStorage: [] // 司机总数据存放---下拉加载用
  }; // 司机数据
  private timer: any;

  totalTrainNum: number; //总车次
  surplusTrainNum: number;//剩余车次
  remaindTrainNum: number;//已分配车次
  @ViewChild('recordTitle') recordTitle: TemplateRef<any>;
  @ViewChild('recordContent') recordContent: TemplateRef<any>;
  @ViewChild('recordFooter') recordFooter: TemplateRef<any>;
  @ViewChild('trainNumContent') trainNumContent: TemplateRef<any>;


  pageCarriageSize: number = 30;
  totalCarriagePage: number = 0;
  pageDriverSize: number = 30;
  totalDriverPage: number = 0;
  carriageSeletedList: Array<any> = [];
  driverSeletedList: Array<any> = [];
  bidderSearchTmp: any;
  driverSearchTmp: any;
  searchCarriageValue: string;
  searchDriverValue: string;

  //grid信息
  gridOneHeight: string;
  gridTwoHeight: string;

  constructor(private nzModal: NzModalService,
              private modalService: NzModalService,
              private http: HttpUtilService,
              private nm: NzModalService,
              private notification: NzNotificationService,
              private msg: NzMessageService,
              private upload: UploadFiles,
              private info: UserinfoService,
              private nz: NzNotificationService,
              private nzMess: NzMessageService,
              private com: CommonService) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize});
    // this.getBidderCompany();//查询承运人
    // this.getDriver();//查询司机
    this.getPlaterData();
  }

  /*  duration(data:any){
      const endDate = addMinutes(this.modalForm.executionTimeStart, data);
      //console.log(format(endDate, 'YYYY-MM-DD HH:mm'));
      this.modalForm.executionTimeEnd = endDate
    }
    getTime(data:any){
      this.inputShow = true;
      //console.log(format(data, 'YYYY-MM-DD HH:mm'));
      const test = differenceInMinutes(format(data, 'YYYY-MM-DD HH:mm'), this.modalForm.executionTimeStart);
      this.modalForm.continueTimeNew = test.toString()
      if(data == null){
        this.modalForm.continueTimeNew = ""
      }
    }
    getStartTime(data:any){
      this.inputShow = true;
      //console.log(format(data, 'YYYY-MM-DD HH:mm'));
      const test = differenceInMinutes(this.modalForm.executionTimeEnd,format(data, 'YYYY-MM-DD HH:mm'));
      this.modalForm.continueTimeNew = test.toString()
      if(data == null){
        this.modalForm.continueTimeNew = ""
      }
    }*/
  duration(data: any, type?: string) {
    if (this.modalForm.continueTime != '0') {
      this.inputShow = false;
    }
    if (this.modalForm.executionTimeStart == null) {
      this.modalForm.executionTimeStart = null;
    } else {

      if (this.selectData1[0].robbedType === 'QTLX30') {
        switch (type) {
          case 'select': {
            const endDate = addMinutes(this.modalForm.executionTimeStart, data);
            this.modalForm.executionTimeEnd = endDate;
          }
            break;
          case 'input': {
            const endDate = addMinutes(this.modalForm.executionTimeStart, data * 1440);
            this.modalForm.executionTimeEnd = endDate;
          }
            break;
        }

      } else {
        const endDate = addMinutes(this.modalForm.executionTimeStart, data);
        this.modalForm.executionTimeEnd = endDate;
      }

      // const endDate = addMinutes(this.modalForm.executionTimeStart, data);
      //console.log(format(endDate, 'YYYY-MM-DD HH:mm'));
      // this.modalForm.executionTimeEnd = endDate;
    }
  }

  getTime(data: any) {
    this.inputShow = true;
    this.modalForm.continueTime = '0';
    //console.log(format(data, 'YYYY-MM-DD HH:mm'));
    const test = differenceInMinutes(format(data, 'YYYY-MM-DD HH:mm'), this.modalForm.executionTimeStart);
    this.modalForm.continueTimeNew = test.toString();
    if (data == null || this.modalForm.executionTimeStart == null) {
      this.modalForm.continueTimeNew = '';
    }
  }

  getStartTime(data: any) {
    /*this.inputShow = true;
    this.modalForm.continueTime = '0'
    const test = differenceInMinutes(this.modalForm.executionTimeEnd,format(data, 'YYYY-MM-DD HH:mm'));
    this.modalForm.continueTimeNew = test.toString()
    if(data == null ||  this.modalForm.executionTimeEnd == null){
      this.modalForm.continueTimeNew = ""
    }*/
    const endDate1 = addMinutes(format(data, 'YYYY-MM-DD HH:mm'), this.modalForm.continueTime != '0' ? this.modalForm.continueTime : this.modalForm.continueTimeNew);
    this.modalForm.executionTimeEnd = endDate1;
    if (data == null || this.modalForm.executionTimeEnd == null) {
      this.modalForm.continueTimeNew = '';
      this.modalForm.executionTimeEnd = null;
    }
  }

  /**
   * 抢单单价/包车价不可超过12位
   * @param value
   */
  inputNumberChange(value: Number) {
    if (value >= 999999999999) {
      this.msg.error('价格不可超过999999999999(12位)');
    }
  }

  carriageChuange(data: any) {
    //console.log(data)
    if (data == '10') {
      this.carriageOfSelectedValue = [];
    }
  }

  driverChuange(data: any) {
    //console.log(data)
    if (data == '10') {
      this.listOfSelectedValue = [];
    }
  }

  verifyPrice(data: any) {
    if (this.unitPrice == '10') {
      this.tempInfo.unitPrice = Number(data).toFixed(3);
    } else {
      this.tempInfo.include = Number(data).toFixed(3);
    }
  }


  btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Anew'://重新竞价
        this.afreshBidding();
        break;
      case 'Withdraw'://撤回
        this.delete();
        break;
      case 'Select': // 抢单选择
        this.openHistoryModal(data.buttonName);
        break;
      case 'Detail': // 查看抢单详情
        this.openHistoryModal(data.buttonName);
        break;
      case 'UpdateTrainNum': //调整车次
        this.btnUpdateTrainNum();
        break;
      case 'Stop': // 中止抢单
        this.btnStop();
        break;
      default:
        break;
    }
  }

  listSearch(data: any) {
    this.searchData = data;
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.robberCompanyId = this.info.get('USER').companyId;
    this.getList(this.searchData);
  }

  getList(params: any) {
    //重置
    this.btnDis.bid = true;
    this.btnDis.result = true;
    this.btnDis.UpdateTrainNum = true;
    this.btnDis.Stop = true;
    this.btnDis.Anew = true;
    this.btnDis.Withdraw = true;
    this.btnDis.Select = true;

    this.loading = true;
    this.http.post(urls.getRobbedListForConsignor, params).then((x: any) => {
      if (x.success) {
        console.log(x);
        this.data2 = [];
        this.data1 = x.data.data && x.data.data.data || [];
        this.totalpage = x.data.data.total;
        this.selectData1 = [];
        //this.changeStatus(this.data1);
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            for (let y = 0; y < this.data1.length; y++) {
              this.data1[y].now = new Date(new Date(this.data1[y].now).getTime() + 1000);
              if (new Date(this.data1[y].robbedTimeEnd).getTime() > new Date(this.data1[y].now).getTime()) {
                let leftTime = (new Date(this.data1[y].robbedTimeEnd).getTime()) - (new Date(this.data1[y].now).getTime()); //计算剩余的毫秒数
                // var a = (leftTime / 1000 / 60 / 60 / 24).toString();
                // var b = (leftTime / 1000 / 60 / 60 % 24).toString();
                // var c = (leftTime / 1000 / 60 % 60).toString();
                // var d = (leftTime / 1000 % 60).toString();
                let days = parseInt((leftTime / 1000 / 60 / 60 / 24).toString(), 10); //计算剩余的天数
                let hours = parseInt((leftTime / 1000 / 60 / 60 % 24).toString(), 10); //计算剩余的小时
                let minutes = parseInt((leftTime / 1000 / 60 % 60).toString(), 10);//计算剩余的分钟
                let seconds = parseInt((leftTime / 1000 % 60).toString(), 10);//计算剩余的秒数
                this.data1[y].endDown = days + '天' + hours + '小时' + minutes + '分' + seconds + '秒';
              } else {
                this.data1[y].endDown = '已结束';
              }
              if (new Date(this.data1[y].robbedTimeStart).getTime() > new Date(this.data1[y].now).getTime()) {
                let leftTime1 = (new Date(this.data1[y].robbedTimeStart).getTime()) - (new Date(this.data1[y].now).getTime()); //计算剩余的毫秒数
                // var a = (leftTime / 1000 / 60 / 60 / 24).toString();
                // var b = (leftTime / 1000 / 60 / 60 % 24).toString();
                // var c = (leftTime / 1000 / 60 % 60).toString();
                // var d = (leftTime / 1000 % 60).toString();
                let days1 = parseInt((leftTime1 / 1000 / 60 / 60 / 24).toString(), 10); //计算剩余的天数
                let hours1 = parseInt((leftTime1 / 1000 / 60 / 60 % 24).toString(), 10); //计算剩余的小时
                let minutes1 = parseInt((leftTime1 / 1000 / 60 % 60).toString(), 10);//计算剩余的分钟
                let seconds1 = parseInt((leftTime1 / 1000 % 60).toString(), 10);//计算剩余的秒数
                this.data1[y].startDown = days1 + '天' + hours1 + '小时' + minutes1 + '分' + seconds1 + '秒';
              } else {
                this.data1[y].startDown = '已开始';
              }
            }
          },
          1000);
      }
      this.loading = false;
      console.log(this.loading);
    });
  }

  selectData(data: any) {
    //console.log(data);
    this.selectData1 = data;
    if (this.selectData1.length === 1) {
      switch (this.selectData1[0].robbedStatus) {
        case 'QDZT10': {
          this.btnDis.Anew = true;
          this.btnDis.Select = true;
          this.btnDis.Detail = false;
          this.btnDis.Withdraw = false;

          this.btnDis.UpdateTrainNum = true;
          this.btnDis.Stop = true;
        }
          break;
        case 'QDZT20': {
          this.btnDis.Anew = true;
          this.btnDis.Select = true;
          this.btnDis.Detail = false;
          this.btnDis.Withdraw = false;

          if (this.selectData1[0].robbedType === 'QTLX30') {
            this.btnDis.UpdateTrainNum = false;
            this.btnDis.Stop = false;
          } else {
            this.btnDis.UpdateTrainNum = true;
            this.btnDis.Stop = true;
          }
        }
          break;
        case 'QDZT25': {
          this.btnDis.Anew = true;
          this.btnDis.Withdraw = true;
          this.btnDis.Select = true;
          this.btnDis.Detail = false;

          if (this.selectData1[0].robbedType === 'QTLX30') {
            this.btnDis.UpdateTrainNum = false;
            this.btnDis.Stop = false;
          } else {
            this.btnDis.UpdateTrainNum = true;
            this.btnDis.Stop = true;
          }
        }
          break;
        case 'QDZT30': {
          this.btnDis.Anew = true;
          this.btnDis.Withdraw = true;
          this.btnDis.Select = false;
          this.btnDis.Detail = false;

          this.btnDis.UpdateTrainNum = true;
          this.btnDis.Stop = true;
        }
          break;
        case 'QDZT40': {
          this.btnDis.Anew = true;
          this.btnDis.Withdraw = true;
          this.btnDis.Select = true;
          this.btnDis.Detail = false;

          this.btnDis.UpdateTrainNum = true;
          this.btnDis.Stop = true;
        }
          break;
        case 'QDZT50': {
          this.btnDis.Anew = false;
          this.btnDis.Withdraw = true;
          this.btnDis.Select = true;
          this.btnDis.Detail = false;

          this.btnDis.UpdateTrainNum = true;
          this.btnDis.Stop = true;
        }
          break;
      }
      if (this.selectData1[0].rerobbedType == '1') {
        this.btnDis.Anew = true;
      }
      // 非司机抢单不可进行抢单选择和抢单详情
      if (this.selectData1[0].robbedType === 'QTLX10') {
        this.btnDis.Select = true;
        // if (this.riZhaoSteelStatus()) { // 日钢 抢单类型 为抢单 可以看查看详情
        //   // this.btnDis.Detail = false;
        // } else {
        //   this.btnDis.Detail = true;
        // }

      }
    } else {
      this.btnDis.Anew = true;
      this.btnDis.Select = true;
      this.btnDis.Detail = true;
      this.btnDis.UpdateTrainNum = true;
      this.btnDis.Stop = true;
      this.selectData1.forEach(
        item => {
          if (item.robbedStatus == 'QDZT10' || item.robbedStatus == 'QDZT20') {
            this.btnDis.Withdraw = false;
          } else {
            this.btnDis.Withdraw = true;
          }
        });

      // if (this.selectData1.length > 1) {
      //   this.btnDis.Stop = this.selectData1.some(
      //     value => {
      //       return value.robbedType !== 'QTLX30' || value.robbedStatus == 'QDZT10' || value.robbedStatus == 'QDZT20';
      //     }
      //   );
      // } else {
      //   this.btnDis.Stop = true;
      // }

    }


    if (this.selectData1.length !== 0) {
      let param: any = {robbedItemModels: []};
      //param.consignorCompanyId = this.selectData1[0].consignorCompanyId;
      this.selectData1.forEach(
        res => {
          param.robbedItemModels.push({robbedNo: res.robbedNo, companyId: this.selectData1[0].companyId});
        }
      );
      this.getNextList(param);
    } else {
      this.data2 = [];
    }
  }

  getNextList(param: any) {
    param.page = 1; //最好有
    param.length = param.length || this.pageSize2; //最好有
    param.consignorCompanyId = this.selectData1[0].companyId;
    this.data2PageTmp = param;
    this.nextLoading = true;
    this.http.post(urls.getRobbedItemByRobbedNos, param).then((x: any) => {
      this.nextLoading = false;
      if (x.success) {
        this.data2 = x.data.data.data || [];
        this.totalpage2 = x.data.data.total;
        // this.data2 = x.data.data && x.data.data.palletModelList && x.data.data.palletModelList[0] && x.data.data.palletModelList[0].palletItemModelList || [];
      }
    });
  }

  /**
   * 打开出价历史弹框
   * @param bidFlag 是否选择承运商标记
   */
  openHistoryModal(bidFlag?: boolean) {
    if (this.selectData1.length == 0) {
      this.msg.error('请选择一条抢单信息！');
      return;
    }
    this.footerText = null;
    this.bidFlag = bidFlag;
    this.selectedIndex = 0;
    this.historyIsVisible = true;
    this.queryHistoryLoading = true;
    this.getHistory();
  }

  bidderCompany: Array<any> = [];

  /**
   * 查询预招标出价信息
   */
  getHistory(): void {
    const url = urls.getRobbedInfoByRobbedNo;
    this.queryHistoryLoading = true;
    this.http.post(url, {robbedNo: this.selectData1[0].robbedNo}).then(
      (res: any) => {
        if (res.success) {
          this.bidHistoryAll = res.data.data || [];
          this.bidHistoryAll.forEach(item => {
            item.docUrlsList = this.upload.getFileList(item.docUrls);
            item.bidder = `${item.bidderCompanyName}-${item.bidderName}`;
            item.offerPrice = item.offerPriceTax ? item.offerPriceTax : item.offerPriceTaxNo;
          });
          this.bidderCompany = Utils.distinct(this.bidHistoryAll.map(item => item.bidderCompanyName)).map(item => {
            return {text: item, value: item,};
          });
          this.bidHistory = this.bidHistoryAll;
        }
        this.queryHistoryLoading = false;
      }
    );
  }

  //选择司机
  isNotSelected(value, flag): boolean {
    if (flag === 'carriage') {
      return this.carriageOfSelectedValue.indexOf(value) === -1;
    } else {
      return this.listOfSelectedValue.indexOf(value) === -1;
    }

  }

  /**
   * 计算运力和金额总和
   */
  selectCount(): void {
    const countData = {
      total: 0,
      totalNo: 0,
      transport: 0
    };
    this.bidHistory.filter(item => item.isCheckedButton).forEach(item => {
      if (item.totalPriceTax !== '--' && item.totalPriceTax) {
        countData.total += parseFloat(item.totalPriceTax);
      }
      if (item.totalPriceTaxNo !== '--' && item.totalPriceTaxNo) {
        countData.totalNo += parseFloat(item.totalPriceTaxNo);
      }
      countData.transport += parseFloat(item.weight);
    });
    this.footerText = '总金额(含税):' + countData.total + ' 总金额(不含税):' + countData.totalNo + ' 总运力:' + countData.transport;
  }

  /**
   * 全选
   * @param value
   */
  checkAll(value: any): void {
    this.bidHistory.forEach(item => {
      item.isCheckedButton = value;
    });
    this.selectCount();
  }

  /**
   * 行选择取消对总选择对影响
   */
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.bidHistory
      .every(item => item.isCheckedButton);
    this.isIndeterminate =
      this.bidHistory.some(item => item.isCheckedButton) &&
      !this.isAllDisplayDataChecked;
    this.selectCount();
  }

  /**
   * 抢单选择确认
   */
  robConfirm() {
    const params: any = {driverList: []};
    const url = urls.assessmentForSelect;
    params.robbedNo = this.selectData1[0].robbedNo;
    params.driverList = this.bidHistory.filter(item => item.isCheckedButton).map(item => {

      return {
        robberCompanyId: item.robberCompanyId,
        robberId: item.robberId,
        vehicleNo: item.vehicleNo,
        weight: item.weight
      };
    });
    if (params.driverList.length === 0) {
      this.msg.error('请选择一个抢单司机！');
      return;
    }
    this.http.post(url, params).then(
      (res: any) => {
        if (res.success) {
          this.modalCancel.emit();
          this.notification.success('提示消息', '选择成功!');
          this.historyIsVisible = false;
          this.listSearch(this.searchData);
        }
      }
    );
  }

  delectDriver(role, index) {
    if (role === 'driver') {
      this.listOfSelectedValue.splice(index, 1);
    } else {
      this.carriageOfSelectedValue.splice(index, 1);
    }
    // $scope.valueObj.carrier.name.splice($.inArray(e,$scope.valueObj.carrier.name), 1);
  }

  selectChange(data: any) {
    //console.log(data)
    if (!data) {
      this.bidPriceType = undefined;
    }
  }

  changeDriver(data: any) {
    //console.log(data)
    if (!data) {
      this.driverType = undefined;
    }
  }

  /**
   * 重新竞价
   * @param name
   */
  afreshBidding() {
    //console.log(this.selectData1[0])
    this.modalForm = {};//重置
    this.modalForm.companyUserModelList = []; //重置
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    if (this.selectData1[0].robbedType === 'QTLX10') {
      this.isDriverGrab = false;
    } else {
      this.isDriverGrab = true;
    }
    this.carriageOfSelectedValue = [];
    this.listOfSelectedValue = [];
    /*this.getBidderCompany();//查询承运人*/

    // 重置承运人和司机下拉
    this.driverData.bidderCompanyList = [];
    // this.driverData.bidderCompanyList = [...this.driverData.bidderCompanyList, ...this.driverData.bidderCompanyListStorage.slice(0, 10)];
    this.driverData.driverList = [];
    // this.driverData.driverList = [...this.driverData.driverList, ...this.driverData.driverListStorage.slice(0, 10)];

    this.getbiddingadata(); //查询旧抢单数据

    this.modalTitle = `评定抢单  > 重新下发`;
    this.modalRef = this.nzModal.create({
      nzTitle: this.recordTitle,
      nzContent: this.recordContent,
      nzFooter: this.recordFooter,
      nzClassName: 'recordBox',
      nzWidth: '75%'
    });
    this.modalRef.afterClose.subscribe(
      () => {
        this.carriageSeletedList = [];
        //this.driverSeletedList = [];
        this.bidderSearchTmp = {};
        this.driverSearchTmp = {};
        this.searchCarriageValue = '';
        this.searchDriverValue = '';
      }
    );

  }

  driver: Array<any> = [];
  getBidInfof: Array<any> = [];

  /**
   * 获取旧抢单数据
   * 注：原本没注释，以上后添加 大概猜测
   */
  getbiddingadata() {
    this.getBidInfo = {};
    let params: any = {};
    console.log(this.selectData1);
    this.http.post(urls.getRobbedInfo,
      {
        requestCompanyId: this.selectData1[0].companyId,
        robbedNo: this.selectData1[0].robbedNo
      }
    ).then((res: any) => {
      //console.log(res);
      if (res.success) {
        console.log(res.data.data);
        this.driver = res.data.data.driverList;
        this.getBidInfo = res.data.data || [];
        //console.log(this.getBidInfo)
        this.getBidInfo.carrierType == '10' ? this.tempInfo.carriiagePrice = true : this.tempInfo.carriiagePrice = false;
        this.getBidInfo.driverType == '10' ? this.tempInfo.driverPrice = true : this.tempInfo.driverPrice = false;
        /*this.tempInfo.carrierSplit = this.getBidInfo.bidPriceType;
        this.tempInfo.driverSplit = this.getBidInfo.driverType;
        this.tempInfo.settleType = this.getBidInfo.taxInclusive;*/

        this.getBidInfo.totalTrainNum = this.selectData1[0].totalTrainNum;
        /* this.getBidInfof=this.getBidInfo;
         this.getBidInfof.forEach(value => {
           value.totalTrainNum= this.selectData1[0].totalTrainNum;
         });*/

        this.bidPriceType = this.getBidInfo.carrierSplit;
        this.driverType = this.getBidInfo.driverSplit;
        this.taxInclusive = this.getBidInfo.settleType;

        console.log(this.getBidInfo);
        /*if(this.getBidInfo.taxInclusive == '10'){
          this.tempInfo.lowerPriceTax = this.getBidInfo.lowerPriceTax;
          this.tempInfo.ceilingPriceTax = this.getBidInfo.ceilingPriceTax;
        }else {
          this.tempInfo.lowerPriceTax = this.getBidInfo.lowerPriceTax;
          this.tempInfo.ceilingPriceTax = this.getBidInfo.ceilingPriceTax;
        }*/

        if (this.getBidInfo.hiredType == '10') {
          this.unitPrice = '20';
          this.tempInfo.include = this.getBidInfo.offerPrice;
        } else {
          this.unitPrice = '10';
          this.tempInfo.unitPrice = this.getBidInfo.offerPrice;
        }
        /*this.modalForm.executionTimeStart = this.getBidInfo.robbedTimeStart;
        this.modalForm.executionTimeEnd = this.getBidInfo.robbedTimeEnd;
        const test = differenceInMinutes(format(this.getBidInfo.robbedTimeEnd, 'YYYY-MM-DD HH:mm'), this.modalForm.robbedTimeStart);
        this.inputShow = true;
        this.modalForm.continueTime = '0';
        console.log(test);
        this.modalForm.continueTimeNew = test.toString();*/

        this.modalForm.executionTimeStart = new Date();

        //若为循环抢单 则设置为一天
        if (this.selectData1[0].robbedType === 'QTLX30') {
          this.modalForm.continueTime = '1440';
          this.modalForm.executionTimeEnd = addMinutes(this.modalForm.executionTimeStart, 1440);


        } else {
          this.modalForm.continueTime = '10';
          this.modalForm.executionTimeEnd = addMinutes(this.modalForm.executionTimeStart, 10);

        }
        this.modalForm.remark = this.getBidInfo.remark;

        this.modalForm.totalTrainNum = this.getBidInfo.totalTrainNum;

        this.getDriver(); // 查询司机
        this.getBidderCompany(); //查询承运人
        // if (this.getBidInfo.carrierList) {
        //   // this.getBidInfo.carrierList.forEach(
        //   //   (res, index) => {
        //   //     this.driverData.bidderCompanyListStorage.forEach(
        //   //       (item, index1) => {
        //   //         if (res.robberCompanyId == item.companyId) {
        //   //           this.carriageOfSelectedValue[index] = item.companyName;
        //   //         }
        //   //       });
        //   //   });
        //   this.getBidInfo.carrierList.forEach(
        //     (res, index) => {
        //       this.driverData.bidderCompanyListStorage.forEach(
        //         (item, index1) => {
        //           if (res.robberCompanyId === item.companyId) {
        //             item.checked = true;
        //           }
        //         });
        //     });
        // }
        // if (this.getBidInfo.driverList) {
        //   // this.getBidInfo.driverList.forEach(
        //   //   (res, index) => {
        //   //     this.driverData.driverListStorage.forEach(
        //   //       (item, index1) => {
        //   //         if (res.robberCompanyId == item.userId) {
        //   //           this.listOfSelectedValue[index] = item.name;
        //   //         }
        //   //       });
        //   //   });
        //
        //   this.getBidInfo.driverList.forEach(
        //     (res, index) => {
        //       this.driverData.driverListStorage.forEach(
        //         (item, index1) => {
        //           if (res.robberCompanyId === item.userId) {
        //             item.checked = true;
        //           }
        //         });
        //     });
        //
        // }
      }
    });
  }

  //查询承运人
  getBidderCompany(data = {bidderCompanyName: ''}) {
    this.driverData.bidderCompanyList = [];
    const params: any = {
      ...data,
      businessModuleId: this.data2[0].businessModuleId,
    };
    this.bidderSearchTmp = params;
    this.http.post(urls.getBidderCompanyData, params).then((res: any) => {
      if (res.success) {
        this.driverData.bidderCompanyListStorage = res.data.data || [];
        this.totalCarriagePage = res.data.data.total;
        if (this.driverData.bidderCompanyListStorage.length > 0) {
          this.driverData.bidderCompanyList = [...this.driverData.bidderCompanyListStorage];
        }

        // if (this.carriageSeletedList.length !== 0) {
        //   this.carriageSeletedList.forEach(
        //     value => {
        //       this.driverData.bidderCompanyList.forEach(
        //         value1 => {
        //           if (value === value1.companyId) {
        //             value1.checked = true;
        //           }
        //         }
        //       );
        //     }
        //   );
        // }

        if (this.getBidInfo.carrierList) {
          this.getBidInfo.carrierList.forEach(
            (res) => {
              this.driverData.bidderCompanyList.forEach(
                (item) => {
                  if (res.robberCompanyId === item.companyId) {
                    if (this.carriageSeletedList.some(value => value === res.robberCompanyId)) {
                    } else {
                      item.checked = true;
                      this.carriageSeletedList.push(item.companyId);
                    }
                  }
                });
            });
        }

      }
    });
  }

  // 查询司机
  getDriver(data = {name: ''}) {
    this.driverData.driverList = [];
    let params: any = {
      ...data,
      //platerCompanyId: 'C000002001',
      platerCompanyId: this.platerData,
      businessModuleId: this.data2[0].businessModuleId,
      companyId: this.getBidInfo.orderList[0].consignorCompanyIdRoot
      //companyId: this.selectData1[0].consignorCompanyIdRoot || this.data2[0].consignorCompanyIdRoot
    };
    if (!params.platerCompanyId) {
      //console.log(944)
      this.msg.warning('公司静态数据无单车车队');
    }
    this.driverSearchTmp = params;
    console.log(params);
    let url = '';
    // QTLX10: 抢单类型-抢单-insertTrobbed            selectUserId
    // QTLX20: 抢单类型-司机抢单-insertDriverGrab     getDriverCommon
    // QTLX30: 抢单类型-循环抢单-insertDriverGrab     selectUserId
    console.log(this.selectData1[0]);

    // if (this.selectData1[0].robbedType === 'QTLX10') {
    //   url = urls.selectUserId;
    // } else {
    //   url = urls.getDriverCommon;
    // }

    if (this.selectData1[0].robbedType === 'QTLX20') {
      url = urls.getDriverCommon;
    } else {
      url = urls.selectUserId;
    }

    this.http.post(url, params).then((res: any) => {
      if (res.success) {
        this.driverData.driverListStorage = res.data.data && res.data.data.data || [];
        this.totalDriverPage = res.data.data.total;
        if (this.driverData.driverListStorage.length > 0) {
          this.driverData.driverList = [...this.driverData.driverListStorage];
        }
        if (url === urls.selectUserId) {
          this.driverData.driverListStorage.forEach(
            value => value.name = value.name + `(${value.mobile})`
          );
        }
        /*this.http.post(url, params).then((res: any) => {
          if (res.success) {
            this.driverListStorage = res.data.data && res.data.data.data || [];
            this.totalDriverPage = res.data.data.total;
            this.driverList = [...this.driverListStorage];
            if (url === urls.selectUserId) {
              this.driverListStorage.forEach(
                value => value.name = value.name + `(${value.mobile})`
              );
            }*/

        // if (this.driverSeletedList.length !== 0) {
        //   this.driverSeletedList.forEach(
        //     value => {
        //       this.driverData.driverList.forEach(
        //         value1 => {
        //           if (value === value1.userId) {
        //             value1.checked = true;
        //           }
        //         }
        //       );
        //     }
        //   );
        // }

        if (this.getBidInfo.driverList) {
          this.getBidInfo.driverList.forEach(
            (res, index) => {
              this.driverData.driverList.forEach(
                (item, index1) => {
                  if (res.robberCompanyId === item.userId) {
                    if (this.driverSeletedList.some(value => value === res.robberCompanyId)) {
                    } else {
                      item.checked = true;
                      this.driverSeletedList.push(item.companyId);
                    }
                  }
                });
            });
        }

      }
    });
  }

  platerData: any;

  getPlaterData() {
    let url = urls.getTStaticCompany;
    let params: any = {
      valueSetCode: 'DCCD'
    };
    this.http.post(url, params).then((res: any) => {
      if (res.success) {
        console.log(res);
        if (res.data.data.length != 0) {
          this.platerData = res.data.data[0].value;
          console.log(this.platerData);
        }

      }
    });
  }

  confirmPublish(id: string) { //重新竞价
    this.issueResult();
  }

  ifWeightPrice: boolean = false;
  weightPrice: any;

  issueResult() { //重新竞价调用接口
    //this.confirmLoading = true;

    console.log(this.carriageOfSelectedValue);
    let params: any = {carrierList: [], driverList: [], orderList: []};
    if (this.modalForm.executionTimeStart == null) {
      this.msg.error('请选择开始时间！');
      return;
    }
    if (this.modalForm.executionTimeEnd == null) {
      this.msg.error('请选择结束时间！');
      return;
    }

    if (this.selectData1[0].robbedType === 'QTLX30') {
      if (!this.modalForm.totalTrainNum) {
        this.nzMess.error('请填写车次！');

        return;
      }
      params.totalTrainNum = this.modalForm.totalTrainNum;

    }
    params.robbedTimeStart = format(this.modalForm.executionTimeStart, 'YYYY-MM-DD HH:mm');
    params.robbedTimeEnd = format(this.modalForm.executionTimeEnd, 'YYYY-MM-DD HH:mm');
    params.hiredType = this.unitPrice == '10' ? '20' : '10';
    console.log(this.carriageOfSelectedValue);
    this.carriageSeletedList.forEach(
      value => {
        params.carrierList.push({robberCompanyId: value});
      }
    );
    // this.carriageOfSelectedValue.forEach(
    //   (res, index) => {
    //     this.driverData.bidderCompanyListStorage.forEach(
    //       (item, index1) => {
    //         console.log(res, item.companyName);
    //         if (res == item.companyName) {
    //           if (!params.carrierList[index]) {
    //             params.carrierList[index] = {};
    //           }
    //           params.carrierList[index].robberCompanyId = item.companyId;
    //         }
    //       });
    //   });
    // console.log(this.driver)
    //console.log(this.driverSeletedList)
    this.driverSeletedList.forEach(
      value => {
        if (value) {
          params.driverList.push({robberCompanyId: value});
        } else {
          params.driverList = this.driver;
        }
        //params.driverList.push({robberCompanyId: value});
      }
    );
    // this.listOfSelectedValue.forEach(
    //   (res, index) => {
    //     this.driverData.driverListStorage.forEach(
    //       // this.driverData.driverList.forEach(
    //       (item, index1) => {
    //         if (res == item.name) {
    //           if (!params.driverList[index]) {
    //             params.driverList[index] = {};
    //           }
    //           params.driverList[index].robberName = item.name;
    //           params.driverList[index].robberCompanyId = item.userId;
    //         }
    //       });
    //   });
    params.orderList = this.getBidInfo.orderList;
    if (this.tempInfo.carriiagePrice) {
      params.carrierType = '10';
    } else {
      params.carrierType = '20';
    }
    if (this.tempInfo.driverPrice) {
      params.driverType = '10';
    } else {
      params.driverType = '20';
    }
    params.carrierSplit = this.bidPriceType;
    params.driverSplit = this.driverType;
    params.settleType = this.taxInclusive;
    params.remark = this.modalForm.remark;
    if (this.unitPrice == '10') {
      params.offerPrice = this.tempInfo.unitPrice;
    } else {
      params.offerPrice = this.tempInfo.include;
    }
    params.robbedNo = this.selectData1[0].robbedNo;
    /*params.carrierType = this.selectData1[0].tenderNo;*/
    console.log(params);
    console.log(this.data2);
    this.data2.forEach(value => {
      this.weightPrice = value.totalWeight * params.ceilingPriceTax;
      if (this.weightPrice > 999999999999) {
        this.ifWeightPrice = true;
      }
    });
    if (this.ifWeightPrice) {
      this.msg.error('明细重量与价格乘积不得超过999999999999（12位）');
      this.ifWeightPrice = false;
      return;
    }
    this.confirmLoading = true;
    params.createType = 10;
    let url = '';
    // QTLX10: 抢单类型-抢单-insertTrobbed
    // QTLX20: 抢单类型-司机抢单-insertDriverGrab
    // QTLX30: 抢单类型-循环抢单
    if (this.selectData1[0].robbedType === 'QTLX10') {
      url = urls.insertTrobbed;
    } else if (this.selectData1[0].robbedType === 'QTLX30') {
      url = urls.insertCirculationTrobbed;
    } else {
      url = urls.insertDriverGrab;
    }
    if (this.buttonId == 'Afresh') {
      params.addMinute = this.modalForm.addMinute;
    }
    //console.log(this.selectData1)
    //console.log(params)
    this.http.post(url, params).then((res: any) => {
      this.confirmLoading = false;
      console.log(res);
      if (res.data.code == 100) {
        console.log(222);
        this.nz.create('success', '提示信息', '重新抢单成功！');
        this.modalRef.destroy();


        this.listSearch(this.searchData);
        this.driver = [];
        //this.confirmRef.destroy();
      }
    });
  }


  delete() {
    if (this.selectData1.length == 0) {
      this.msg.error('请至少选中一条抢单数据撤销');
      return;
    }

    this.modalService.confirm({
      nzTitle: '<i>是否确定撤回选中抢单信息?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.deleteList(),
    });
  }

  disabledStartDate = (startValue: Date): boolean => {   //时间判断结束大于开始
    if (!startValue || !this.modalForm.executionTimeEnd) {
      return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000);
    }
    if (typeof this.modalForm.executionTimeEnd === 'string') {
      let data = new Date(Date.parse(this.modalForm.executionTimeEnd));
      this.modalForm.executionTimeEnd = data;
    }
    return startValue.getTime() <= (new Date().getTime() - 24 * 60 * 60 * 1000) || (startValue.getTime() > this.modalForm.executionTimeEnd.getTime());

  };
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.modalForm.executionTimeStart) {
      return false;
    }
    if (typeof this.modalForm.executionTimeStart === 'string') {
      let data = new Date(Date.parse(this.modalForm.executionTimeStart));
      this.modalForm.executionTimeStart = data;
    }
    return endValue.getTime() <= this.modalForm.executionTimeStart.getTime();
  };

  /**
   * 批量撤销/流标
   */
  deleteList() {
    const robbedNos = [];
    let url = urls.updateForCancel1;
    this.selectData1.forEach(
      res => {
        robbedNos.push(res.robbedNo);
      }
    );
    console.log(robbedNos);
    this.http.post(url, {robbedNos: robbedNos}).then(
      (res: any) => {
        if (res.success) {
          this.modalCancel.emit();
          this.notification.success('提示消息', '撤回成功!');

          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   * 货盘明细页码点击事件
   * @param param
   */
  pageIndexEmit(param: any) {
    let tmp = this.data2PageTmp;
    tmp.page = param;
    this.getNextList(tmp);
  }

  /**
   * 货盘明细条数点击事件
   * @param param
   */
  pageSizeEmit(param: any) {
    let tmp = this.data2PageTmp;
    tmp.length = param;
    this.pageSize2 = param;
    this.selectData1.length !== 0 ? this.getNextList(tmp) : null;
  }

  cancel() {
    this.modalRef.destroy();
  }

  confirm() {
    this.modalRef.destroy();
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }


  /**
   * 放弃抢单
   */
  giveUpGrab(): void {
    console.log(234);
    this.modalService.confirm({
      nzTitle: '<i>是否确定放弃抢单?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.giveUpConfirm(),
    });
  }


  giveUpConfirm() {
    const url = urls.withdrawForAbandon;
    this.http.post(url, {robbedNo: this.selectData1[0].robbedNo}).then(
      (res: any) => {
        if (res.success) {
          this.modalCancel.emit();
          this.notification.success('提示消息', '放弃抢单成功!');
          this.historyIsVisible = false;
          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   * 点击调整车次
   */
  btnUpdateTrainNum(): void {
    if (this.selectData1.length === 0 || this.selectData1.length > 1) {
      this.msg.error('请选择一条抢单信息！');
      return;
    }
    this.totalTrainNum = this.selectData1[0].totalTrainNum && Number(this.selectData1[0].totalTrainNum) || 0;
    this.surplusTrainNum = this.selectData1[0].surplusTrainNum && Number(this.selectData1[0].surplusTrainNum) || 0;
    this.remaindTrainNum = this.totalTrainNum - this.surplusTrainNum;
    this.nzModal.create({
      nzTitle: '评定抢单>调整车次',
      nzContent: this.trainNumContent,
      nzOnOk: () => this.updateTrainNumRequest()
    });
  }

  /**
   * 调整车次请求
   */
  updateTrainNumRequest(): Promise<any> {
    const url = urls.updateTotalTrainNum;
    const param: any = {
      robbedNo: this.selectData1[0].robbedNo,
      totalTrainNum: this.totalTrainNum
    };
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nz.success('提示消息', '调整车次成功!');
          this.listSearch(this.searchData);
          this.totalTrainNum = 0;
          this.surplusTrainNum = 0;
          this.remaindTrainNum = 0;
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 中止抢单
   */
  btnStop(): void {
    if (this.selectData1.length === 0 || this.selectData1.length > 1) {
      this.msg.error('请选择一条抢单信息！');
      return;
    }

    this.nzModal.confirm(
      {
        nzTitle: '评定抢单>中止抢单',
        nzContent: '是否确认中止抢单？',
        nzOnOk: () => {
          return this.stopRequest();
        }
      }
    );

  }

  /**
   * 中止抢单请求
   */
  stopRequest(): Promise<any> {
    const url = urls.updateForStop;
    const param: any = {
      robbedNo: this.selectData1[0].robbedNo
    };
    return this.http.post(url, param).then(
      res => {
        if (res.success) {
          this.nz.success('提示消息', '中止抢单成功!');
          this.listSearch(this.searchData);
        } else {
          return false;
        }
      }
    );
  }

  /**
   * 总车次修改
   */
  totalTrainNumChange() {
    this.surplusTrainNum = (Number(this.totalTrainNum) || 0) + (Number(this.selectData1[0].remaindTrainNum) || 0);
  }

  /**
   * 承运人选择
   * @param param
   */
  updateCarriageDataResult(param: Array<any>) {
    param.forEach(
      value => {
        if (value.checked) {
          if (!this.carriageSeletedList.some(value1 => value.companyId === value1)) {
            this.carriageSeletedList.push(value.companyId);
          }
        } else {
          this.carriageSeletedList = this.carriageSeletedList.filter(
            value1 => value1 !== value.companyId
          );
        }
      }
    );
  }

  /**
   * 司机选择
   * @param param
   */
  updateDriverDataResult(param: Array<any>) {
    console.log(param);
    param.forEach(
      value => {
        if (value.checked) {
          if (!this.driverSeletedList.some(value1 => value.userId === value1)) {
            this.driverSeletedList.push(value.userId);
          }
        } else {
          this.driverSeletedList = this.driverSeletedList.filter(
            value1 => value1 !== value.userId
          );
        }
      }
    );
    //console.log(this.driverSeletedList)
  }

  pageIndexCarriageEmit(param: number) {
    // this.getBidderCompany({...this.bidderSearchTmp, page: param});
  }

  pageSizeCarriageEmit(param: number) {
    this.pageCarriageSize = param;
    // this.getBidderCompany({...this.bidderSearchTmp, page: 1, length: this.pageCarriageSize});
  }

  pageIndexDriverEmit(param: number) {
    // this.getDriver({...this.driverSearchTmp, page: param});
  }

  pageSizeDriverEmit(param: number) {
    this.pageDriverSize = param;
    // this.getDriver({...this.driverSearchTmp, page: 1, length: this.pageDriverSize});
  }

  search(param: string) {
    switch (param) {
      case 'carriageSearch': {

        this.driverData.bidderCompanyList = this.driverData.bidderCompanyListStorage.filter(
          value => value.companyName && value.companyName.indexOf(this.searchCarriageValue) !== -1
        );
        // this.getBidderCompany({...this.bidderSearchTmp, bidderCompanyName: this.searchCarriageValue});
      }
        break;
      case 'driverSearch': {

        this.driverData.driverList = this.driverData.driverListStorage.filter(
          value => value.name && value.name.indexOf(this.searchDriverValue) !== -1
        );
        // this.getDriver({...this.driverSearchTmp, name: this.searchDriverValue});
      }
        break;
    }
  }

  reset(param: string) {
    switch (param) {
      case 'carriageSearch': {
        this.searchCarriageValue = '';
        // this.getBidderCompany({...this.bidderSearchTmp, bidderCompanyName: this.searchCarriageValue});
      }
        break;
      case 'driverSearch': {
        this.searchCarriageValue = '';
        // this.getDriver({...this.driverSearchTmp, name: this.searchDriverValue});
      }
        break;
    }

  }

  /**
   * grid高度
   * @param data
   */
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

  //page: number = 1;

  /**
   * 主表页码点击事件
   * @param param
   */
  /*pageIndex1(param: any) {
    console.log(param)
    this.page=param;
    const parm = {page : this.page, length :this.pageSize};
    this.getList(parm);
  }*/

  /**
   * 主表条数点击事件
   * @param param
   */

  /*pageSize1(param: any) {
    console.log(param)
    this.pageSize=param;
    const parm = {page : 1, length :param};
    this.getList(parm);
  }*/

  riZhaoSteelStatus(): boolean {

    return (this.info.get('USER').segmentId === '020') || (this.info.get('USER').companyId === 'C000000882');
  }

}
