import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {urls} from '@model/url';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {CommonService} from '@service/common.service';
import {Utils} from '@util/utils';

@Component({
  selector: 'app-bidding-manage',
  templateUrl: './bidding-manage.component.html',
  styleUrls: ['./bidding-manage.component.css']
})
export class BiddingManageComponent implements OnInit {
  recordTit: string;
  confirmCon: string;
  modalRef: NzModalRef;
  data1: any[] = [];
  data2: any[] = [];
  selectData1: any[] = [];
  loading: boolean = false;
  // 主列表页码数据
  totalpage: number = 0;
  pageSize: number = 30;
  // 子列表货盘明细页码数据
  totalpage2: number = 0;
  pageSize2: number = 30;
  data2PageTmp: any = {length: 30}; // 货盘明细页码数据缓存
  nextLoading: boolean = false;
  searchData: any = {};//存储查询条件
  modalResultShow: boolean = false;
  comfirmLoading: boolean = false;
  tplModal: NzModalRef;
  btnDis: any = {Binding: true};
  status: any = '';//根据不同状态显示不同弹窗   10:显示船舶信息，投标价。  20：显示table,投标价
  buttonId: string;
  tempInfo: any = {};
  private timer: any;

  //grid信息
  gridOneHeight: string;
  gridTwoHeight: string;

  @ViewChild('recordTitle') recordTitle: TemplateRef<any>;
  @ViewChild('recordContent') recordContent: TemplateRef<any>;
  @ViewChild('recordFooter') recordFooter: TemplateRef<any>;

  constructor(private nzModal: NzModalService,
              private nm: NzModalService,
              private http: HttpUtilService,
              private nz: NzNotificationService,
              private info: UserinfoService,
              private com: CommonService) {
  }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});
  }


  btnClick(data: any) {
    console.log(data);
    if (this.selectData1.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择后操作！'
      });
      this.destroyTplModal();
      return;
    }

    //this.tempInfo = {};
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'Binding':
        this.participation(data.buttonName);
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
    this.loading = true;
    //params.bidderCompanyId = this.info.get('USER').companyId;
    this.http.post(urls.getJjTenderListForBidder, params).then((x: any) => {
      if (x.success) {
        console.log(x);
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
                var days = parseInt((leftTime / 1000 / 60 / 60 / 24).toString(), 10); //计算剩余的天数
                var hours = parseInt((leftTime / 1000 / 60 / 60 % 24).toString(), 10); //计算剩余的小时
                var minutes = parseInt((leftTime / 1000 / 60 % 60).toString(), 10);//计算剩余的分钟
                var seconds = parseInt((leftTime / 1000 % 60).toString(), 10);//计算剩余的秒数
                this.data1[y].endDown = days + '天' + hours + '小时' + minutes + '分' + seconds + '秒';
              } else {
                this.data1[y].endDown = '已结束';
                /*if(){
                  this.data1[y].tenderStatus = 'JJZZ50'
                }*/
              }
              if (new Date(this.data1[y].tenderTimeStart).getTime() > new Date(this.data1[y].now).getTime()) {
                var leftTime1 = (new Date(this.data1[y].tenderTimeStart).getTime()) - (new Date(this.data1[y].now).getTime()); //计算剩余的毫秒数
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
      console.log(this.loading);
    });
  }

  selectData(data: any) {
    this.selectData1 = data;
    if (this.selectData1.length == 1) {
      this.btnDis.Binding = false;
    } else {
      this.btnDis.Binding = true;
    }


    if (this.selectData1.length !== 0) {
      let param: any = {jjTenderItemModels: []};
      //param.consignorCompanyId = this.selectData1[0].consignorCompanyId;
      this.selectData1.forEach(
        res => {
          param.jjTenderItemModels.push({tenderNo: res.tenderNo, companyId: this.selectData1[0].companyId});
          if (res.tenderStatusName != '竞价中' && res.tenderStatusName != '已出价') {
            this.btnDis.Binding = true;
          } else {
            this.btnDis.Binding = false;
          }
        }
      );
      this.getNextList(param);
    } else {
      this.data2 = [];
    }
  }

  participation(name: string) {
    this.recordTit = `竞价管理  > ${name}`;
    let url = urls.getBidInfoByTenderNoAndCompany;
    this.modalRef = this.nzModal.create({
      nzTitle: this.recordTitle,
      nzContent: this.recordContent,
      nzFooter: this.recordFooter,
      nzWidth: '50%'
    });
    if (this.selectData1[0].offerPriceTax !== '--') {
      this.tempInfo.price = this.selectData1[0].offerPriceTax == '--' ? '' : this.selectData1[0].offerPriceTax;
    } else if (this.selectData1[0].offerPriceTaxNo!== '--') {
      this.tempInfo.price = this.selectData1[0].offerPriceTaxNo == '--' ? '' : this.selectData1[0].offerPriceTaxNo;
    } else {
      this.tempInfo.price = '';
    }
    if (this.selectData1[0].settleType == '10') {
      this.tempInfo.totAmount = this.selectData1[0].totAmount == '--' ? '' : this.selectData1[0].totAmount;
    } else if (this.selectData1[0].settleType == '20') {
      this.tempInfo.totAmount = this.selectData1[0].totAmountNo == '--' ? '' : this.selectData1[0].totAmountNo;
    } else {
      this.tempInfo.totAmount = '';
    }
    this.tempInfo.offerTrainNum = this.selectData1[0].offerTrainNum || null;
    //this.biddingInfo()//竞价信息
  }

  /*biddingInfo(){

  }*/

  verifyPrice(data: any) {
    console.log(data);
    //this.tempInfo.price = Number(this.tempInfo.price).toFixed(3);
    this.tempInfo.totAmount = Utils.mul(this.tempInfo.price, this.selectData1[0].planTotalWeight).toFixed(3);
    //this.tempInfo.totAmount = (Number(data) * Number(this.selectData1[0].planTotalWeight)).toFixed(3);
  }

  bidConfirm() {
    this.modalConfirm();
  }

  modalConfirm() {
    if (!this.tempInfo.price) {
      this.nz.warning('提示消息', '请填写单价!');
      return;
    }
    if (!this.tempInfo.offerTrainNum) {
      this.nz.warning('提示消息', '请填写车次!');
      return;
    }
    let url = urls.insertTjjBid;
    let param: any = {tBidModels: []};
    param.bidderCompanyId = this.selectData1[0].bidderCompanyId;
    param.companyId = this.selectData1[0].companyId;
    param.tenderNo = this.selectData1[0].tenderNo;
    param.settleType = this.selectData1[0].settleType;
    if (this.selectData1[0].settleType == '10') {
      param.offerPriceTax = this.tempInfo.price;
    } else {
      param.offerPriceTaxNo = this.tempInfo.price;
    }
    param.offerTrainNum = this.tempInfo.offerTrainNum;
    this.comfirmLoading = true;
    this.http.post(url, param).then((res: any) => {
      this.comfirmLoading = false;
      if (res.success) {
        this.nz.create('success', '提示信息', '出价成功', {nzDuration: 3000});
        this.modalRef.destroy();
        this.getList(this.searchData);
      }
    });


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
   * grid高度
   * @param data
   */
  gridHeight(data: any) {
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two - 45}px`;
  }

}
