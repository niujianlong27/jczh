import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {urls} from '@model/url';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {CommonService} from '@service/common.service';
import {UploadFiles} from '@service/upload-files';
import {format, addMinutes, differenceInMinutes} from 'date-fns';
import {Utils} from '@util/utils';
import {GlobalService} from '@service/global-service.service';

@Component({
  selector: 'app-bidding-evaluate',
  templateUrl: './bidding-evaluate.component.html',
  styleUrls: ['./bidding-evaluate.component.css']
})
export class BiddingEvaluateComponent implements OnInit {
  recordTit: string;
  confirmCon: string;
  modalRef: NzModalRef;
  data1: Array<any> = [];
  data2: Array<any> = [];
  data2Storage: Array<any> = [];
  selectData1: any[] = [];
  loading: boolean = false;
  modalTitle: string;
  bidPriceType: string = '10';
  taxInclusive: string = '10';
  driverType: string;
  continueTimeArr: Array<any> = [
    {name: '自定义', value: '0'},
    {name: '10分钟', value: '10'},
    {name: '15分钟', value: '15'},
    {name: '20分钟', value: '20'},
    {name: '30分钟', value: '30'}
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
  implistLoading: boolean = false;
  modalResultShow: boolean = false;
  comfirmLoading: boolean = false;
  historyIsVisible: boolean = false;
  confirmLoading: boolean = false;
  selectedIndex: number = 0;
  selectedIndex1: number = 0;
  queryHistoryLoading: boolean = false;
  inputShow: boolean = false;
  bidHistory: Array<any> = [];
  bidHistoryStorage: Array<any> = [];
  bidHistoryAll: Array<any> = [];
  getBidInfo: any = {};//竞价数据
  bidFlag: boolean = false;
  tplModal: NzModalRef;
  bidderCompanyList: Array<any> = [];//承运人数据
  driverList: Array<any> = [];//司机数据
  bidderCompanyListStorage: Array<any> = []; // 承运人数据
  driverListStorage: Array<any> = []; // 司机总数据存放
  bidCompanyUser: Array<any> = [];//投标人数据
  btnDis: any = {bid: true, result: true};
  status: any = '';//根据不同状态显示不同弹窗   10:显示船舶信息，投标价。  20：显示table,投标价
  buttonId: string;
  private modalCancel = new EventEmitter(); // 弹窗取消
  tempInfo: any = {};
  private timer: any;
  @ViewChild('recordTitle') recordTitle: TemplateRef<any>;
  @ViewChild('recordContent') recordContent: TemplateRef<any>;
  @ViewChild('recordFooter') recordFooter: TemplateRef<any>;
  @ViewChild('biddingSelection') biddingSelection: TemplateRef<any>;

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


  summaryData: Array<any> = [];
  bidderSelectList: Array<any> = [];
  bidDetailSelectList: Array<any> = [];
  resultSelectList: Array<any> = [];
  disabledAllCheckBox: boolean = true; //明细是否禁止全选
  nzSpinning: boolean = false;

  //grid信息
  gridOneHeight: string;
  gridTwoHeight: string;

  constructor(
    private nzModal: NzModalService,
    private modalService: NzModalService,
    private http: HttpUtilService,
    private nm: NzModalService,
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private upload: UploadFiles,
    private info: UserinfoService,
    private nz: NzNotificationService,
    private nzMess: NzNotificationService,
    private com: CommonService,
    private globalSer: GlobalService
  ) {
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
      //console.log(test);
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

  duration(data: any) {
    if (this.modalForm.continueTime != '0') {
      this.inputShow = false;
    }
    if (this.modalForm.executionTimeStart == null) {
      this.modalForm.executionTimeStart = null;
    } else {
      const endDate = addMinutes(this.modalForm.executionTimeStart, data);
      //console.log(format(endDate, 'YYYY-MM-DD HH:mm'));
      this.modalForm.executionTimeEnd = endDate;
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

  verifyCeilingPrice(data: any) {
    this.tempInfo.ceilingPriceTax = Number(data).toFixed(3);
  }

  verifyLowerPrice(data: any) {
    this.tempInfo.lowerPriceTax = Number(data).toFixed(3);
  }


  btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Select'://竞价选择
        this.openHistoryModal(data.buttonName);
        break;
      case 'Detail'://查看竞价详情
        this.openHistoryModal(data.buttonName);
        break;
      case 'Binding'://重新竞价
        this.afreshBidding();
        break;
      case 'WithDraw'://撤回
        this.delete();
        break;
      default:
        break;
    }
  }

  listSearch(data: any) {
    this.searchData = data;
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.bidderCompanyId = this.info.get('USER').companyId;
    this.getList(this.searchData);
  }

  getList(params = {}) {
    this.btnDis.bid = true; //重置
    this.btnDis.result = true;//重置
    this.loading = true;
    this.http.post(urls.getJjTenderListForConsignor, params).then((x: any) => {
      if (x.success) {
        //console.log(x);
        this.data2 = [];
        this.data1 = x.data.data && x.data.data.data || [];
        this.totalpage = x.data.data.total;
        this.selectData1 = [];
        //this.changeStatus(this.data1);
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            for (var y = 0; y < this.data1.length; y++) {
              this.data1[y].now = new Date(new Date(this.data1[y].now).getTime() + 1000);
              if (new Date(this.data1[y].tenderTimeEnd).getTime() > new Date(this.data1[y].now).getTime()) {
                var leftTime = (new Date(this.data1[y].tenderTimeEnd).getTime()) - (new Date(this.data1[y].now).getTime()); //计算剩余的毫秒数
                // var a = (leftTime / 1000 / 60 / 60 / 24).toString();
                // var b = (leftTime / 1000 / 60 / 60 % 24).toString();
                // var c = (leftTime / 1000 / 60 % 60).toString();
                // var d = (leftTime / 1000 % 60).toString();
                var days = parseInt((leftTime / 1000 / 60 / 60 / 24).toString(), 10); //计算剩余的天数
                var hours = parseInt((leftTime / 1000 / 60 / 60 % 24).toString(), 10); //计算剩余的小时
                var minutes = parseInt((leftTime / 1000 / 60 % 60).toString(), 10);//计算剩余的分钟
                var seconds = parseInt((leftTime / 1000 % 60).toString(), 10);//计算剩余的秒数
                this.data1[y].endDown = days + '天' + hours + '小时' + minutes + '分' + seconds + '秒';
              } else {
                this.data1[y].endDown = '已结束';
              }
              if (new Date(this.data1[y].tenderTimeStart).getTime() > new Date(this.data1[y].now).getTime()) {
                var leftTime1 = (new Date(this.data1[y].tenderTimeStart).getTime()) - (new Date(this.data1[y].now).getTime()); //计算剩余的毫秒数
                // var a = (leftTime / 1000 / 60 / 60 / 24).toString();
                // var b = (leftTime / 1000 / 60 / 60 % 24).toString();
                // var c = (leftTime / 1000 / 60 % 60).toString();
                // var d = (leftTime / 1000 % 60).toString();
                var days1 = parseInt((leftTime1 / 1000 / 60 / 60 / 24).toString(), 10); //计算剩余的天数
                var hours1 = parseInt((leftTime1 / 1000 / 60 / 60 % 24).toString(), 10); //计算剩余的小时
                var minutes1 = parseInt((leftTime1 / 1000 / 60 % 60).toString(), 10);//计算剩余的分钟
                var seconds1 = parseInt((leftTime1 / 1000 % 60).toString(), 10);//计算剩余的秒数
                this.data1[y].startDown = days1 + '天' + hours1 + '小时' + minutes1 + '分' + seconds1 + '秒';
              } else {
                this.data1[y].startDown = '已开始';
              }
            }
          },
          1000);
      }
      this.loading = false;
      //console.log(this.loading);
    });
  }

  selectData(data: any) {
    //console.log(data);
    this.selectData1 = data;
    if (this.selectData1.length == 1) {
      if (this.selectData1[0].tenderStatus == 'JJZZ10') {
        this.btnDis.Select = true;
        this.btnDis.Detail = true;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = false;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ20') {
        this.btnDis.Select = true;
        this.btnDis.Detail = false;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = false;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ30') {
        this.btnDis.Select = true;
        this.btnDis.Detail = false;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = true;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ40') {
        this.btnDis.Select = false;
        this.btnDis.Detail = true;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = true;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ50') {
        this.btnDis.Select = true;
        this.btnDis.Detail = false;
        this.btnDis.Binding = true;
        this.btnDis.WithDraw = true;
      } else if (this.selectData1[0].tenderStatus == 'JJZZ60') {
        this.btnDis.Select = true;
        this.btnDis.Detail = false;
        this.btnDis.Binding = false;
        this.btnDis.WithDraw = true;
      }
      if (this.selectData1[0].retenderType == '1') {
        this.btnDis.Binding = true;
      }
    } else {
      this.btnDis.Select = true;
      this.btnDis.Detail = true;
      this.btnDis.Binding = true;

      this.selectData1.forEach(
        item => {
          //console.log(item)
          if (item.tenderStatus == 'JJZZ10' || item.tenderStatus == 'JJZZ20') {
            this.btnDis.WithDraw = false;
          } else {
            this.btnDis.WithDraw = true;
          }
        });

    }
    if (this.selectData1.length !== 0) {
      let param: any = {jjTenderItemModels: []};
      //param.consignorCompanyId = this.selectData1[0].consignorCompanyId;
      this.selectData1.forEach(
        res => {
          param.jjTenderItemModels.push({tenderNo: res.tenderNo, companyId: this.selectData1[0].companyId});
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
    this.http.post(urls.getJJTenderItemByTenderNos, param).then((x: any) => {
      this.nextLoading = false;
      if (x.success) {
        this.data2 = x.data.data.data || [];
        this.totalpage2 = x.data.data.total;
        // this.data2 = x.data.data && x.data.data.palletModelList && x.data.data.palletModelList[0] && x.data.data.palletModelList[0].palletItemModelList || [];
      }
    });
  }


  getbiddingadata() {
    this.getBidInfo = {};
    let params: any = {};
    this.http.post(urls.getBidInfo, {
      requestCompanyId: this.selectData1[0].companyId,
      tenderNo: this.selectData1[0].tenderNo
    }).then((res: any) => {
      //console.log(res);
      if (res.success) {
        this.getBidInfo = res.data.data || [];
        //console.log(this.getBidInfo)
        this.getBidInfo.carrierType == '10' ? this.tempInfo.carriiagePrice = true : this.tempInfo.carriiagePrice = false;
        this.getBidInfo.driverType == '10' ? this.tempInfo.driverPrice = true : this.tempInfo.driverPrice = false;
        this.tempInfo.carrierSplit = this.getBidInfo.bidPriceType;
        this.tempInfo.driverSplit = this.getBidInfo.driverType;
        this.taxInclusive = this.getBidInfo.settleType;
        if (this.getBidInfo.settleType == '10') {
          this.tempInfo.lowerPriceTax = this.getBidInfo.lowerPriceTax;
          this.tempInfo.ceilingPriceTax = this.getBidInfo.ceilingPriceTax;
        } else {
          this.tempInfo.lowerPriceTax = this.getBidInfo.lowerPriceTaxNo;
          this.tempInfo.ceilingPriceTax = this.getBidInfo.ceilingPriceTaxNo;
        }
        //this.modalForm.executionTimeStart = this.getBidInfo.tenderTimeStart;
        //this.modalForm.executionTimeEnd = this.getBidInfo.tenderTimeEnd;
        //const test = differenceInMinutes(format(this.getBidInfo.tenderTimeEnd, 'YYYY-MM-DD HH:mm'), this.modalForm.executionTimeStart);
        //this.inputShow = true;
        //this.modalForm.continueTime = '0';
        //this.modalForm.continueTimeNew = test.toString();
        this.modalForm.continueTime = '10';
        this.modalForm.executionTimeStart = new Date();
        this.modalForm.executionTimeEnd = addMinutes(this.modalForm.executionTimeStart, 10);
        this.modalForm.remark = this.getBidInfo.remark;
        this.bidPriceType = this.getBidInfo.carrierSplit;
        this.driverType = this.getBidInfo.driverSplit;
        this.getBidderCompany();//查询承运人
        this.getDriver();//查询司机

        // if (this.getBidInfo.carrierList) {
        //   this.getBidInfo.carrierList.forEach(
        //     (res, index) => {
        //       this.bidderCompanyList.forEach(
        //         (item, index1) => {
        //           if (res.bidderCompanyId == item.companyId) {
        //             console.log(1234);
        //             this.carriageOfSelectedValue[index] = item.companyName;
        //           }
        //         });
        //     });
        // }
        // if (this.getBidInfo.driverList) {
        //   this.getBidInfo.driverList.forEach(
        //     (res, index) => {
        //       this.driverList.forEach(
        //         (item, index1) => {
        //           if (res.bidderId == item.userId) {
        //             this.listOfSelectedValue[index] = item.name;
        //           }
        //         });
        //     });
        // }
      }
    });
  }

  /**
   * 打开出价历史弹框
   * @param bidFlag 是否选择承运商标记
   */
  openHistoryModal(bidFlag?: any) {
    if (this.selectData1.length == 0) {
      this.msg.error('请选择一条竞价单后操作！');
      return;
    }
    this.bidFlag = bidFlag;
    this.getHistory();
    if (bidFlag && bidFlag === '竞价选择') {
      this.nzSpinning = true;
      this.data2Storage = Utils.deepCopy(this.data2);
      this.modalRef = this.nzModal.create(
        {
          nzTitle: '评定竞价>竞价选择',
          nzContent: this.biddingSelection,
          nzWidth: '60%',
          nzStyle: {top: '0px'},
          nzOnOk: () => this.bidSelect(),
          nzMaskClosable: false
        }
      );
      this.modalRef.afterClose.subscribe(
        () => {
          this.summaryData = [];
          this.bidHistoryStorage = [];
          this.data2Storage = [];
          this.bidderSelectList = [];
          this.bidDetailSelectList = [];
          this.resultSelectList = [];
          this.disabledAllCheckBox = true;
        }
      );
      this.data2Storage.forEach(
        value => value.disabled = true
      );
      return;
    }
    this.selectedIndex = 0;
    this.historyIsVisible = true;
    this.queryHistoryLoading = true;
    // this.getHistory();

  }

  bidderCompany: Array<any> = [];

  /**
   * 查询预招标出价信息
   */
  getHistory(): void {
    const url = this.selectedIndex ? urls.getJjBidRecordInfoByTenderNo : urls.getJjBidInfoByTenderNo;
    this.queryHistoryLoading = true;
    this.http.post(url, {tenderNo: this.selectData1[0].tenderNo}).then(
      (res: any) => {
        if (res.success) {
          console.log(res);
          this.bidHistory = res.data.data || [];
          this.bidHistoryStorage = Utils.deepCopy(this.bidHistory);
          this.bidHistory.forEach(res => {
            res.isCheckedButton = false;
          });
          this.nzSpinning = false;
        }
        this.queryHistoryLoading = false;
      }
    );
  }

  changeCompany(data: any) {
    // this.bidHistory.forEach((res,index)=>{
    //   res.isCheckedButton = false;
    //   this.bidHistory[index].isCheckedButton = true;
    //   console.log(this.bidHistory)
    // })

    this.bidHistory.forEach(item => {
      if (!item.isCheckedButton && item.bidderCompanyId === data.bidderCompanyId) {
        item.isCheckedButton = true;
      } else {
        item.isCheckedButton = false;
      }
    });
  }

  //选择承运人/司机
  selectBidding() {
    this.confirmLoading = true;
    let params: any = {carrierList: []};
    let url = urls.updateForSelect;
    /*this.bidHistory.forEach(
      (res,index) => {
        if(res.isCheckedButton){
          if(!params.carrierList[index]){
            params.carrierList[index] = {};
          }
          params.carrierList[0].bidderCompanyId = res.bidderCompanyId;
        }

      }
    );*/
    params.tenderNo = this.selectData1[0].tenderNo;
    params.carrierList = this.bidHistory.filter(item => item.isCheckedButton).map(item => {
      return {
        bidderCompanyId: item.bidderCompanyId,
        bidderId: item.bidderId
      };
    });
    if (params.carrierList.length !== 1) {
      this.msg.error('请选择一个竞价人！');
      return;
    }

    this.http.post(url, params).then(
      (res: any) => {
        if (res.success) {
          this.confirmLoading = false;
          this.modalCancel.emit();
          this.notification.success('提示消息', '选择成功!');
          this.historyIsVisible = false;
          this.listSearch(this.searchData);
        }
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

  delectDriver(role, index) {
    if (role === 'driver') {
      this.listOfSelectedValue.splice(index, 1);
    } else {
      this.carriageOfSelectedValue.splice(index, 1);
    }
    // $scope.valueObj.carrier.name.splice($.inArray(e,$scope.valueObj.carrier.name), 1);
  }

  /**
   * 重新竞价
   * @param name
   */
  afreshBidding() {
    this.modalForm = {};//重置
    this.modalForm.companyUserModelList = []; //重置
    if (!this.selectData1[0]) {
      this.nzModal.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据进行操作！'
      });
      return;
    }
    this.carriageOfSelectedValue = [];
    this.listOfSelectedValue = [];
    this.getbiddingadata();//查询货盘信息
    /*this.getBidderCompany();//查询承运人
    this.getDriver();//查询司机*/

    this.modalTitle = `评定竞价  > 重新竞价`;
    this.modalRef = this.nzModal.create({
      nzTitle: this.recordTitle,
      nzContent: this.recordContent,
      nzWrapClassName: 'recordBox',
      nzFooter: this.recordFooter,
      nzWidth: '75%'
    });
    this.modalRef.afterClose.subscribe(
      () => {
        this.carriageSeletedList = [];
        this.driverSeletedList = [];
        this.bidderSearchTmp = {};
        this.driverSearchTmp = {};
        this.searchCarriageValue = '';
        this.searchDriverValue = '';
      }
    );
  }

  //查询承运人
  getBidderCompany(data = {bidderCompanyName: ''}) {
    this.bidderCompanyList = [];
    const params: any = {
      ...data,
      businessModuleId: this.data2[0].businessModuleId,
    };
    this.bidderSearchTmp = params;
    this.http.post(urls.getBidderCompanyData, params).then((res: any) => {
      if (res.success) {
        this.bidderCompanyListStorage = res.data.data || [];
        this.totalCarriagePage = res.data.data.total;
        this.bidderCompanyList = [...this.bidderCompanyListStorage];
        // if (this.carriageSeletedList.length !== 0) {
        //   this.carriageSeletedList.forEach(
        //     value => {
        //       this.bidderCompanyList.forEach(
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
              this.bidderCompanyList.forEach(
                (item) => {
                  if (res.bidderCompanyId === item.companyId) {
                    if (this.carriageSeletedList.some(value => value === res.bidderCompanyId)) {
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

  //查询司机
  getDriver(data = {}) {
    this.driverList = [];
    let params: any = {
      ...data,
      //platerCompanyId: 'C000002001',
      platerCompanyId: this.platerData,
      businessModuleId: this.data2[0].businessModuleId,
      companyId: this.getBidInfo.orderList[0].tOrderItemModels[0].consignorCompanyIdRoot
      //companyId: this.selectData1[0].consignorCompanyIdRoot || this.data2[0].consignorCompanyIdRoot
    };
    if (!params.platerCompanyId) {
      //console.log(944)
      this.msg.warning('公司静态数据无单车车队');
    }
    this.driverSearchTmp = params;
    this.http.post(urls.selectUserId, params).then((res: any) => {
      if (res.success) {
        this.driverListStorage = res.data.data && res.data.data.data || [];
        this.totalDriverPage = res.data.data.total;
        this.driverList = [...this.driverListStorage];

        // if (this.driverSeletedList.length !== 0) {
        //   this.driverSeletedList.forEach(
        //     value => {
        //       this.driverList.forEach(
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
              this.driverList.forEach(
                (item, index1) => {
                  if (res.bidderId === item.userId) {
                    if (this.driverSeletedList.some(value => value === res.bidderId)) {
                    } else {
                      item.checked = true;
                      this.driverSeletedList.push(item.userId);
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

  delete() {
    if (this.selectData1.length == 0) {
      this.msg.error('请至少选择一条竞价单后撤回');
      return;
    }

    this.modalService.confirm({
      nzTitle: '<i>是否确定撤回选中竞价单信息?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.deleteList(),
    });
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

  //放弃竞价
  abandonBid() {
    //console.log(234);
    this.modalService.confirm({
      nzTitle: '<i>是否确定放弃竞价?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.abandonConfirm(),
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
    const tenderNos = [];
    let url = urls.updateForCancel;
    this.selectData1.forEach(
      res => {
        tenderNos.push(res.tenderNo);
      }
    );
    //console.log(tenderNos);
    this.http.post(url, {tenderNos: tenderNos}).then(
      (res: any) => {
        if (res.success) {
          this.modalCancel.emit();
          this.notification.success('提示消息', '撤回成功!');

          this.listSearch(this.searchData);
        }
      }
    );
  }

  abandonConfirm() {
    let url = urls.updateForAbandon;
    this.http.post(url, {tenderNo: this.selectData1[0].tenderNo}).then(
      (res: any) => {
        if (res.success) {
          this.modalCancel.emit();
          this.notification.success('提示消息', '放弃竞价成功!');
          this.historyIsVisible = false;
          this.modalRef.destroy();
          this.listSearch(this.searchData);
        }
      }
    );
  }

  confirmPublish(id: string) { //重新竞价
    this.issueResult();
  }

  ifWeightPrice: boolean = false;
  weightPrice: any;

  issueResult() { //重新竞价调用接口
    //console.log(this.carriageOfSelectedValue);
    let params: any = {carrierList: [], driverList: [], orderList: []};
    if (this.modalForm.executionTimeStart == null) {
      this.msg.error('请选择开始时间！');
      return;
    }
    if (this.modalForm.executionTimeEnd == null) {
      this.msg.error('请选择结束时间！');
      return;
    }
    params.tenderTimeStart = format(this.modalForm.executionTimeStart, 'YYYY-MM-DD HH:mm');
    params.tenderTimeEnd = format(this.modalForm.executionTimeEnd, 'YYYY-MM-DD HH:mm');
    /*this.modalForm.companyUserModelList.map((x: any) => {
      let o: any = {};
      o.bidderCompanyId = x.companyId;
      params.driverList.push(o);
    });*/
    //let tOrderModelList = this.getBidInfo.tenderItems;
    // this.carriageOfSelectedValue.forEach(
    //   (res, index) => {
    //     this.bidderCompanyList.forEach(
    //       (item, index1) => {
    //         if (res == item.companyName) {
    //           if (!params.carrierList[index]) {
    //             params.carrierList[index] = {};
    //           }
    //           params.carrierList[index].bidderCompanyId = item.companyId;
    //         }
    //       });
    //   });

    this.carriageSeletedList.forEach(
      value => {
        params.carrierList.push({bidderCompanyId: value});
      }
    );

    this.driverSeletedList.forEach(
      value => {
        params.driverList.push({bidderId: value});
      }
    );

    // this.listOfSelectedValue.forEach(
    //   (res, index) => {
    //     this.driverList.forEach(
    //       (item, index1) => {
    //         if (res == item.name) {
    //           if (!params.driverList[index]) {
    //             params.driverList[index] = {};
    //           }
    //           params.driverList[index].bidderName = item.name;
    //           params.driverList[index].bidderId = item.userId;
    //         }
    //       });
    //   });
    /*for(let i:number =0;i<tOrderModelList.length;i++){
      if(i==0){
        tOrderModelList[i].tOrderItemModels=[];
      }
      this.selectData1.forEach((element:any)=>{
        if(tOrderModelList[i].orderNo = element.orderNo){
          tOrderModelList[i].tOrderItemModels.push(element);
        }
      })
      params.orderList[i].tOrderItemModels = tOrderModelList[i].tOrderItemModels;
      params.orderList[i].companyId = tOrderModelList[i].companyId;
      params.orderList[i].orderNo = tOrderModelList[i].orderNo;
    }*/
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
    if (this.taxInclusive == '10') {
      params.lowerPriceTax = this.tempInfo.lowerPriceTax;
      params.ceilingPriceTax = this.tempInfo.ceilingPriceTax;
    } else {
      params.lowerPriceTaxNo = this.tempInfo.lowerPriceTax;
      params.ceilingPriceTaxNo = this.tempInfo.ceilingPriceTax;
    }
    params.tenderNo = this.selectData1[0].tenderNo;
    //params.carrierType = this.selectData1[0].tenderNo;
    console.log(params);
    //console.log(this.data1);
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
    let url = urls.insertJjTender;
    if (this.buttonId == 'Afresh') {
      params.addMinute = this.modalForm.addMinute;
    }
    params.createType = 10;
    this.http.post(url, params).then((res: any) => {
      this.confirmLoading = false;
      console.log(res);
      if (res.data.code == 100) {
        console.log(222);
        this.nzMess.create('success', '提示信息', '重新竞价成功！');


        this.getList(this.searchData);
        //this.confirmRef.destroy();
        this.modalRef.destroy();
      }
    });
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
  };

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
        this.bidderCompanyList = this.bidderCompanyListStorage.filter(
          value => value.companyName && value.companyName.indexOf(this.searchCarriageValue) !== -1
        );
      }
        break;
      case 'driverSearch': {
        this.driverList = this.driverListStorage.filter(
          value => value.name && value.name.indexOf(this.searchDriverValue) !== -1
        );
      }
        break;
    }
  }

  reset(param: string) {
    switch (param) {
      case 'carriageSearch': {
        this.searchCarriageValue = '';
        this.getBidderCompany({...this.bidderSearchTmp, bidderCompanyName: this.searchCarriageValue});
      }
        break;
      case 'driverSearch': {
        this.searchCarriageValue = '';
        this.getDriver({...this.driverSearchTmp, name: this.searchDriverValue});
      }
        break;
    }

  }

  /**
   * 竞价人选择
   * @param param
   */
  bidderSelect(param: Array<any>) {
    this.bidderSelectList = param;
    if (this.bidderSelectList.length === 1) {
      // this.disabledAllCheckBox = Utils.sub(this.bidderSelectList[0].surplusTrainNum, this.data2Storage.length) < 0;
      this.disabledAllCheckBox = false;
      this.data2Storage.forEach(
        value => {
          // value.checked = false;
          value.disabled = false;
        }
      );
      this.bidDetailSelectList = [];
    } else {
      this.disabledAllCheckBox = true;
      this.bidDetailSelectList = [];
      this.data2Storage.forEach(
        value => {
          // value.checked = false;
          value.disabled = true;
        }
      );
    }
    this.globalSer.tableSelectedChangeEmitter.emit({gridId: 'grid4', checked: false});

  }

  /**
   * 委托明细选择
   * @param param
   */
  bidDetailSelect(param: Array<any>) {
    this.bidDetailSelectList = param;
    // 临时去掉车次
    // if (Utils.sub(param.length, this.bidderSelectList[0].surplusTrainNum) === 0) {
    //   this.bidDetailSelectList = param;
    //   this.data2Storage.forEach(
    //     value => value.disabled = true
    //   );
    //   this.bidDetailSelectList.forEach(
    //     value => value.disabled = false
    //   );
    // } else {
    //   this.bidDetailSelectList = param;
    //   this.data2Storage.forEach(
    //     value => value.disabled = false
    //   );
    // }
  }

  /**
   * 结果选择
   * @param param
   */
  resultSelect(param: Array<any>) {
    this.resultSelectList = param;
    //console.log(this.resultSelectList)
  }


  /**
   * 匹配点击
   */
  matchClick() {
    this.nzSpinning = true;
    const tmp: Array<any> = [];
    const offerPriceTax: any = this.bidderSelectList[0].offerPriceTax;
    const offerPriceTaxNo: any = this.bidderSelectList[0].offerPriceTaxNo;
    this.bidDetailSelectList.forEach(
      value => {
        this.data2Storage = this.data2Storage.filter(
          value1 => {
            return value1.rowid !== value.rowid;
          }
        );
        value.checked = false;
        value.disabled = false;
        const all = Object.assign({}, this.bidderSelectList[0], value);
        all.bidder = this.bidderSelectList[0];
        all.bidderDetail = value;

        all.totAmount = offerPriceTax === '--' ? '--' : Utils.mul(value.totalWeight, offerPriceTax);
        all.totAmountNo = offerPriceTaxNo === '--' ? '--' : Utils.mul(value.totalWeight, offerPriceTaxNo);
        tmp.push(all);

      }
    );
    console.log(this.bidDetailSelectList);
    //console.log(this.bidderSelectList)
    this.bidderSelectList[0].surplusTrainNum = Utils.sub(this.bidderSelectList[0].surplusTrainNum, this.bidDetailSelectList.length);
    // if (Utils.sub(this.bidderSelectList[0].surplusTrainNum, 0) === 0) {
    //   this.bidHistoryStorage = this.bidHistoryStorage.filter(
    //     value => {
    //       value.checked = false;
    //       return Utils.sub(value.surplusTrainNum, 0) !== 0;
    //     }
    //   );
    //
    //   this.bidderSelectList = [];
    //
    // }
    // this.judgement();
    this.bidDetailSelectList = [];
    this.summaryData = [...this.summaryData, ...tmp];
    this.nzSpinning = false;

  }

  //resultSelectDetail:Array<any> = [];
  //nzMore:boolean=false;
  /**
   * 点击取消
   */
  cancelClick() {
    /*if(this.resultSelectList.length==1){
       this.nzSpinning = true;
       this.summaryData = this.summaryData.filter(
          value => value.rowid !== this.resultSelectList[0].rowid
       );
       this.data2Storage = [this.resultSelectList[0].bidderDetail, ...this.data2Storage];
       if (Utils.sub(this.resultSelectList[0].bidder.surplusTrainNum, 0) === 0) {
         this.bidHistoryStorage = [this.resultSelectList[0].bidder, ...this.bidHistoryStorage];
       }
       this.resultSelectList[0].bidder.surplusTrainNum = Utils.add(this.resultSelectList[0].bidder.surplusTrainNum, 1);
       this.resultSelectList = [];
       this.judgement();


    //}else{*/

    this.nzSpinning = true;
    console.log(this.resultSelectList.length);
    this.resultSelectList.forEach(
      value => {
        this.summaryData = this.summaryData.filter(
          value1 => {
            return value1.rowid !== value.rowid;
          }
        );
      }
    );
    this.resultSelectList.forEach(val => {
      //this.data2Storage.push(val.bidderDetail)
      this.data2Storage = [val.bidderDetail, ...this.data2Storage];
      val.bidder.surplusTrainNum = Utils.add(val.bidder.surplusTrainNum, 1);
    });
    console.log(this.data2Storage);
    // if (Utils.sub(this.resultSelectList[0].bidder.surplusTrainNum, 0) === 0) {
    //   this.bidHistoryStorage = [this.resultSelectList[0].bidder, ...this.bidHistoryStorage];
    // }
    //console.log(this.bidHistoryStorage)
    // this.resultSelectList[0].bidder.surplusTrainNum = Utils.add(this.resultSelectList[0].bidder.surplusTrainNum, this.resultSelectList.length);
    this.resultSelectList = [];
    // this.judgement();
    this.nzSpinning = false;
    //}

  }

  /**
   * 竞价选择
   */
  bidSelect(): Promise<any> | boolean {
    if (this.data2Storage.length !== 0) {
      this.notification.warning('提示消息', '请将明细分配完!');
      return false;
    }
    const url = urls.updateForSelect;
    const params: any = {
      tenderNo: '',
      carrierList: []
    };
    this.summaryData.forEach(
      value => {
        const item =
          {
            bidderCompanyId: '',
            bidderId: '',
            itemRowid: ''
          };
        item.bidderCompanyId = value.bidderCompanyId;
        item.bidderId = value.bidderId;
        item.itemRowid = value.bidderDetail.rowid;
        params.carrierList.push(item);
      }
    );
    // const map: Map<string, any> = this.summaryData.reduce(
    //   (previousValue, currentValue) => {
    //     let item = previousValue.get(currentValue.bidderCompanyId);
    //     if (!item) {
    //       item = {
    //         bidderCompanyId: '',
    //         bidderId: '',
    //         itemRowid: []
    //       };
    //       item.bidderId = currentValue.bidderId;
    //       item.bidderCompanyId = currentValue.bidderCompanyId;
    //       previousValue.set(currentValue.bidderCompanyId, item);
    //     }
    //     item.itemRowid.push(currentValue.bidderDetail.rowid);
    //     return previousValue;
    //   }, new Map<string, Array<any>>()
    // );
    params.tenderNo = this.selectData1[0].tenderNo;
    // params.carrierList = Array.from(map.values());

    return this.http.post(url, params).then(
      res => {
        if (res.success) {
          this.notification.success('提示消息', '选择成功!');
          //this.data2Storage=[];
          this.listSearch(this.searchData);
        }
      }
    );
  }

  /**
   * grid高度
   * @param data
   */
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

  /**
   * 判断当前选择竞价人的剩余车次是否大于明细
   */
  judgement(): void {
    if (this.bidderSelectList[0] && Utils.sub(this.bidderSelectList[0].surplusTrainNum, this.data2Storage.length) >= 0) {
      this.disabledAllCheckBox = false;
      this.data2Storage.forEach(
        value => value.disabled = false
      );
    } else if (this.bidderSelectList[0] && Utils.sub(this.bidderSelectList[0].surplusTrainNum, this.data2Storage.length) < 0) {
      this.disabledAllCheckBox = true;
      this.data2Storage.forEach(
        value => value.disabled = false
      );
    } else {
      this.disabledAllCheckBox = true;
      this.data2Storage.forEach(
        value => value.disabled = true
      );
    }

    this.nzSpinning = false;
  }

  handleCancel(){
    this.historyIsVisible = false;
    this.selectedIndex = undefined
  }

}
