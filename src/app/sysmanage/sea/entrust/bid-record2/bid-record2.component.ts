import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { CodesetService } from '../../common/codeset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns'
import { UploadFiles } from '../../../../common/services/upload-files';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { SimpleCacheService } from '../../../../common/services/simple-cache.service';
import { Utils } from '../../common/utils';

@Component({
  selector: 'app-bid-record2',
  templateUrl: './bid-record2.component.html',
  styleUrls: ['../../common/sea-common.css', './bid-record2.component.css']
})
export class BidRecord2Component implements OnInit {

  // 主界面
  queryLoading: boolean = false;
  result: Array<any> = [];
  resultShow: Array<any> = [];
  pageSize: number = 30;
  total: number = 0;

  palletItem: Array<any> = [];

  // 出价弹框
  form: FormGroup;
  modalIsVisible: boolean = false;
  bidLoading: boolean = false;
  settleType: Array<any> = [];
  calculation: Array<any> = [];

  ownerCompany: Array<any> = [];

  countdownTimer: any;
  curTime: number = new Date().getTime();

  minPriceTimer: any;
  showMarked = false; // 是否只显示标记记录
  showMarkedBuffer = {};
  showMarkedCount = 0;

  constructor(private http: HttpUtilService,
    private msg: NzMessageService,
    private codeset: CodesetService,
    public fb: FormBuilder,
    public upload: UploadFiles,
    private appInfo: UserinfoService,
    private simpleCache: SimpleCacheService) {

    this.form = this.fb.group({
      "boatName": [null, []],
      "loadDateStart": [null, []],
      "loadDateEnd": [null, []],
      "capacity": [null, []],
      "settleType": [null, []],
      "markedPrice": [null, []],
      "offerPriceTax": [null, [Validators.required]],
      "minPrice": [null, []],
      "calculation": [null, []],
      "containerNo": [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.settleType = this.codeset.get('settleType');
    this.calculation = this.codeset.get('calculation');
    // this.queryOwner();

    this.countdownTimer = setInterval(() => this.countdown(), 1000);

    this.minPriceTimer = setInterval(() => this.minPrice(), 1000 * 10);
    // 用户标记localstorage缓存
    this.showMarkedBuffer = this.simpleCache.getLocal(this.getMarkedBufferName()) || {};
  }

  
  /**
  * 自定义查询区域准备就绪时回调 
  */
  private initalSearch: any;
  _initalSearch(search) {
    this.initalSearch = function () {
      search.listSearch();
    }
    // 执行初始画面查询
    this.initalSearch();
  }

  // 用户标记localstorage缓存名称
  getMarkedBufferName() {
    return 'BID_MARKED_' + this.appInfo.APPINFO.USER.userId;
  }

  ngOnDestroy() {
    this.countdownTimer && clearInterval(this.countdownTimer);
    this.minPriceTimer && clearInterval(this.minPriceTimer);
  }

  /**
   * 分页查询方法
   */
  query(pageParam: any) {
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    this.queryLoading = true;
    const url = SEA_URLS.getCarrierTender;
    this.http.post(url, { ...pageParam }).then((res: any) => {
      if (res.success) {
        this.total = res.data.data.total ? res.data.data.total : 0;
        this.curTime = new Date(res.data.data.nowDate).getTime();
        res.data.data.data.forEach(item => {
          // 结束时间倒计时、暗标倒计时
          if (item.status == 'JJZZ10' || item.status == 'JJZZ20' || item.status == 'JJZZ30') {
            item.oneTime = new Date(item.bidOneTime).getTime();
            item.endTime = new Date(item.bidTimeEnd).getTime();
            item.delayTime = new Date(item.bidTimeDelay).getTime();
            item.bidEnable = item.isBidTwo || item.isBidDelay;
          }
          // 开始倒计时
          if (item.status == 'JJZZ10' && item.bidTimeStart) {
            item.startTime = new Date(item.bidTimeStart).getTime();
            item.bidEnable = false;
          }
        });
        this.countdown(res.data.data.data);
        this.minPrice(res.data.data.data);
        this.result = res.data.data.data;
        this.resultShow = this.result;
        // 处理标记缓存
        this.processMarkedBuffer(this.resultShow);
      }
      this.queryLoading = false;
    });
  }

  /**
   * 获取最低价
   * @param data 
   */
  minPrice(data?: Array<any>) {
    data = data || this.result;
    const tenderModels = data.filter(item => item.status == 'JJZZ20' || item.status == 'JJZZ30').map(item => { return { tenderNo: item.tenderNo } });
    // 查询最低价
    this.http.post(SEA_URLS.getMinPrice, { tenderModels: tenderModels }).then((res: any) => {
      if (res.success) {
        const tendersMinPrice = res.data.data;
        if (tendersMinPrice && tendersMinPrice.length > 0) {
          tendersMinPrice.forEach(item => {
            const tender = this.result.find(tender => item.tenderNo === tender.tenderNo);
            // 进入暗标时间并且是承运商，则最低价不显示
            if (tender.endTime < this.curTime) {
              tender.minPrice = '***';
            } else {
              tender.minPrice = item.min;
            }
          });
          if (this.tenderInfo) {
            let minPrice = tendersMinPrice.find(item => item.tenderNo === this.tenderInfo.tenderNo).min;
            if (this.tenderInfo.endTime < this.curTime) {
              minPrice = '***';
            }
            this.form.patchValue({ minPrice: minPrice });
          }
        }
      }
    });
  }

  /**
   *  定时任务刷新倒计时
   */
  countdown(data?: Array<any>) {
    if (!data) {
      this.curTime = this.curTime + 1000;
    }
    const countdownData = data || this.result;
    countdownData.forEach(item => {
      // 竞价开始倒计时
      if (item.status == 'JJZZ10') {
        const diffTime = item.startTime - this.curTime;
        if (diffTime <= 0) {
          item.statusFlag = '12';
          item.status = 'JJZZ20';
          item.timeout = '';
          item.bidEnable = true;
          // console.log(`bidEnable-1:${item.bidEnable}`)
        } else if (diffTime <= 10 * 60 * 1000) {
          item.timeout = `开标：${format(diffTime, 'mm:ss')}`;
        } else {
          item.timeout = '距开标>10分钟';
        }
        // console.log(`${diffTime}:${format(item.startTime, 'YYYY-MM-DD HH:mm:ss')}-${format(this.curTime, 'YYYY-MM-DD HH:mm:ss')}`)
      }

      // 竞价结束倒计时、暗标倒计时
      if (item.status == 'JJZZ20' || item.status == 'JJZZ30') {
        // 是否进入第二阶段
        const twoDiffTime = item.oneTime - this.curTime;
        if (twoDiffTime <= 0 && twoDiffTime >= -1000) {
          if (!item.queryFlagTwo) {
            item.bidEnable = false;
            this.queryIsTwoBidder(item);
            item.queryFlagTwo = 1;
          }
          // console.log(`bidEnable-2:${item.bidEnable}`)
        }

        // 是否进入暗标阶段
        const endDiffTime = item.endTime - this.curTime;
        // console.log(`endDiffTime:${endDiffTime}`)
        if (endDiffTime >= 0) {
          item.timeout = `明标：${format(endDiffTime, 'mm:ss')}`;
        } else if (endDiffTime >= -1000 || (item.statusFlag != '21' && !item.queryFlag)) {
          item.minPrice = '***';
          item.isDelayBid = true;
          if (!item.queryFlag) {
            item.bidEnable = false;
            this.queryIsDelayBidder(item);
            item.queryFlag = 1;
          }
          // console.log(`bidEnable-3:${item.bidEnable}`)
        }

        // 暗标倒计时
        const delayDiffTime = item.delayTime - this.curTime;
        if (item.queryFlag == 2) {
          if (item.isDelayBid && item.bidEnable) {
            item.timeout = `暗标：${format(delayDiffTime, 'mm:ss')}`;
          } else {
            item.timeout = '无暗标资格';
          }
        } else if (item.queryFlag == 1) {
          item.bidEnable = false;
          // console.log(`bidEnable-4:${item.bidEnable}`)
          item.timeout = '暗标即将开始...';
        }

        // console.log(`delayDiffTime:${delayDiffTime}`)
        // 是否结束
        if (delayDiffTime <= 0) {
          item.statusFlag = item.offerPrice ? '22' : '21';

          item.status = 'JJZZ40';
          item.timeout = '';
        }
      }
    });
  }

  /**
   * 查询该竞价单是否有第二阶段出价资格
   * @param data 
   */
  queryIsTwoBidder(data: any) {
    this.http.post(SEA_URLS.isTwoBidder, { tenderNo: data.tenderNo }).then((res: any) => {
      if (res.success) {
        data.bidEnable = res.data.data > 0;
        // console.log(`bidEnable-5:${data.bidEnable}`)
        data.queryFlagTwo = res.data.data == -1 ? 0 : 2; // 0=未查询；1=查询中；2=查询成功
        // data.queryFlagTwo === 2 && (data.statusFlag = '21');
      }
    });
  }

  /**
   * 查询该竞价单是否有暗标出价资格
   * @param data 
   */
  queryIsDelayBidder(data: any) {
    this.http.post(SEA_URLS.isDelayBidder, { tenderNo: data.tenderNo }).then((res: any) => {
      if (res.success) {
        data.bidEnable = res.data.data > 0;
        // console.log(`bidEnable-6:${data.bidEnable}`)
        data.queryFlag = res.data.data == -1 ? 0 : 2; // 0=未查询；1=查询中；2=查询成功
      }
    });
  }


  /**
   * 查询所有货主公司
   */
  queryOwner() {
    this.http.post(SEA_URLS.getSeaCompanyAll, { status: 10, companyType: 20 }).then((res: any) => {
      if (res.success) {
        this.ownerCompany = res.data.data;
      }
    });
  }


  queryGoodsLoading: boolean = false;
  tenderGoodsMap: any = {}; //  竞价单关联货物明细缓存
  /**
   * 根据预招标单号查询货盘明细
   * @param visible 
   * @param tenderNo 
   */
  queryPalletItem(visible: boolean, data: any) {
    if (!visible || !data || !data.tenderNo) {
      this.palletItem = [];
      return;
    }
    const tenderNo = data.tenderNo;
    // 竞价单关联货物明细缓存对象中存在，直接使用缓存值，否则查询
    if (this.tenderGoodsMap[tenderNo]) {
      this.palletItem = this.tenderGoodsMap[tenderNo];
      return;
    }
    this.queryGoodsLoading = true;
    this.http.post(SEA_URLS.getPalletItemByTender, { tenderNo: tenderNo }).then((res: any) => {
      if (res.success) {
        this.palletItem = res.data.data;
        this.tenderGoodsMap[tenderNo] = this.palletItem;
      }
      this.queryGoodsLoading = false;
    });
  }


  /**
   * 打开出价弹框
   */
  openModal(data: any) {
    this.tenderInfo = data;
    this.isBoxPrice = this.tenderInfo.calculation === 'JJJS30' || this.tenderInfo.calculation === 'JJJS40';
    this.form.reset();
    // 查询出价信息
    const param = { tenderNo: this.tenderInfo.tenderNo, bidderCompanyId: this.appInfo.APPINFO.USER.companyId };
    this.http.post(SEA_URLS.getCompanyBid, param).then((res: any) => {
      if (res.success) {
        this.bidInfo = {};
        if (res.data.data) {
          this.bidInfo = res.data.data;
          this.bidInfo.offerPriceTax = this.bidInfo.offerPrice;
        }
        this.modalIsVisible = true;
        const tenderInfo = {
          settleType: this.tenderInfo.settleType,
          markedPrice: this.tenderInfo.settleType == 'JSFS10' ? this.tenderInfo.markedPriceTax : this.tenderInfo.markedPriceTaxNo,
          calculation: this.tenderInfo.calculation,
        };

        if (this.tenderInfo.endTime < this.curTime) {
          this.bidInfo.minPrice = '***';
          this.tenderInfo.minPrice = '***'
        } else {
          this.bidInfo.minPrice = this.bidInfo.min;
          this.tenderInfo.minPrice = this.bidInfo.minPrice;
        }
        this.form.patchValue({ ...tenderInfo, ...this.bidInfo });
      } else {
        this.msg.error("系统错误，请联系系统管理员！");
      }
    });

    // 查询货盘信息
    this.http.post(SEA_URLS.getPalletByTender, { tenderNo: this.tenderInfo.tenderNo }).then((res: any) => {
      if (res.success) {
        this.palletList = res.data.data;
        this.palletList.forEach(item => {
          item.flowDesc = Utils.getFlowDesc(item);
          item.docUrlsList = this.upload.getFileList(item.docUrls);
        });
      }
    });

  }

  /**
   * 出价弹框关闭
   */
  cancel() {
    this.modalIsVisible = false;
    this.tenderInfo = null;
  }


  tenderInfo: any;
  bidInfo: any = {};
  palletList: Array<any> = [];
  isBoxPrice: boolean = false;

  /**
   * 出价
   */
  bid() {
    let invalid: boolean = false;
    for (const i in this.form.controls) {
      if (!this.isBoxPrice && i === 'containerNo') {
        continue;
      }
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
      this.form.controls[i].invalid && (invalid = true);
    }
    if (invalid) return;

    this.form.value.loadDateStart = Utils.format(this.form.value.loadDateStart);
    this.form.value.loadDateEnd = Utils.format(this.form.value.loadDateEnd);

    this.bidLoading = true;
    const param = { ...this.bidInfo, ...this.form.value, tenderNo: this.tenderInfo.tenderNo };
    this.http.post(SEA_URLS.bid, param).then((res: any) => {
      if (res.success) {
        this.msg.success("竞价出价成功！");
        // 出价成功，如果最低价不存在或者当前最低价大于当前出价，则将最低价置为当前出价
        if (!this.tenderInfo.minPrice || this.tenderInfo.minPrice > this.form.value.offerPriceTax) {
          this.tenderInfo.minPrice = this.form.value.offerPriceTax;
        }
        this.tenderInfo.offerPrice = this.form.value.offerPriceTax;
        if (this.tenderInfo.statusFlag === '12') {
          this.tenderInfo.statusFlag = '13';
        }
        if (this.tenderInfo.status == 'JJZZ20') {
          this.tenderInfo.status = 'JJZZ30';
        }
        this.cancel();
      }
      this.bidLoading = false;
    });
  }

  historyIsVisible: boolean = false;
  bidHistory: Array<any> = [];
  queryHistoryLoading: boolean = false;

  /**
   * 打开出价历史弹框
   * @param data 
   */
  openHistoryModal(data: any) {
    this.historyIsVisible = true;

    this.queryHistoryLoading = true;
    const param = { tenderNo: data.tenderNo, bidderCompanyId: this.appInfo.APPINFO.USER.companyId };
    this.http.post(SEA_URLS.getBidrecord, param).then((res: any) => {
      if (res.success) {
        this.bidHistory = res.data.data;
      }
      this.queryHistoryLoading = false;
    });
  }

  // 点击每行标记图标
  markRow(item) {
    item.marked = !item.marked;
    if(item.marked){
      this.showMarkedCount++;
    }else{
      this.showMarkedCount--;
    }
    this.showMarkedBuffer[item.tenderNo] = item.marked;
    this.simpleCache.setLocal(this.getMarkedBufferName(), JSON.stringify(this.showMarkedBuffer));

    this.btnHiden.buttonMark = this.selectedData && this.selectedData.marked;
    this.btnHiden.buttonUnmark = !this.btnHiden.buttonMark;
  }
  // 点击总选择是否显示标记
  markRowSelect() {
    if (!this.showMarked && this.showMarkedCount === 0) {
      this.msg.warning('请先选择标记行！');
      return;
    }
    this.showMarked = !this.showMarked;
    
    if (this.showMarked) {
      this.resultShow = this.result.filter(item => item.marked);
    } else {
      this.resultShow = this.result;
    }
    this.btnHiden.buttonMarked = this.showMarked;
    this.btnHiden.buttonAll = !this.showMarked;
  }
  // 查询成功后处理标记缓存
  processMarkedBuffer(items) {
    this.showMarked = false;
    const now = new Date().getTime();
    if (this.showMarkedBuffer['recordTime']) {
      if (now - this.showMarkedBuffer['recordTime'] > 48 * 3600 * 1000) {
        this.showMarkedBuffer = {};
        this.showMarkedBuffer['recordTime'] = now;
        return;
      }
    } else {
      this.showMarkedBuffer['recordTime'] = now;
    }
    this.showMarkedCount = 0;
    return items && items.forEach(item => {
      if (this.showMarkedBuffer[item.tenderNo]) {
        item.marked = true;
        this.showMarkedCount++;
        item.markedName = '已关注'; 
      } else {
        item.markedName = '未关注'; 
      }
    });
  }

  /**
   * 下拉框中文值设置
   * @param val 选中值
   * @param data 值存放的对象
   * @param options 下拉数据源
   * @param key 对象key值
   */
  setDisplayName(val: any[], data: any, options: Array<any>, key: string) {
    if (!Array.isArray(val)) {
      val = [val]
    }
    data[key] = options.filter(opt => val && val.some(item => item == opt.value)).map(item => item.label).join(",");
  }

  /**
 * 船期开始大于等于当前日期并且小于等于结束日期
 */
  disabledStartDate = (startValue: Date): boolean => {
    return Utils.beforeNowDate(startValue, this.form.value.loadDateEnd);
  };

  /**
   * 船期结束选择框限制
   */
  disabledEndDate = (endValue: Date): boolean => {
    return Utils.beforeNowDate(endValue) || Utils.beforeDate(endValue, this.form.value.loadDateStart);
  }

  /**
   * 按钮组件点击事件处理
   * @param data 
   */
  btnClick(data: any) {
    switch (data.buttonId) {
      case 'buttonBid': this.buttonBid(); break;  // 出价
      case 'buttonHistory': this.buttonHistory(); break;  // 出价历史
      case 'buttonMark': this.buttonMark(); break;  // 关注
      case 'buttonUnmark': this.buttonUnmark(); break;  // 取消关注
      case 'buttonMarked': this.buttonMarked(); break; //查看关注
      case 'buttonAll': this.buttonAll(); break; //查看全部
      default: this.msg.error("该功能待开发"); break;
    }
  }

  /**
   * 出价
   */
  buttonBid(){
    if(!this.selectedData){
      this.msg.error("请选择一条竞价单数据出价");
      return;
    }
    this.openModal(this.selectedData);
  }

  /**
   * 查看出价历史
   */
  buttonHistory(){
    if(!this.selectedData){
      this.msg.error("请选择一条竞价单数据查看出价历史");
      return;
    }
    this.openHistoryModal(this.selectedData);
  }

  /**
   * 关注/标记
   */
  buttonMark() {
    if (this.selectedData && !this.selectedData.marked) {
      this.markRow(this.selectedData);
    } else {
      this.msg.error("请选择一条未关注竞价单数据关注");
    }
  }

  /**
   * 关注/标记
   */
  buttonUnmark() {
    if (this.selectedData && this.selectedData.marked) {
      this.markRow(this.selectedData);
    } else {
      this.msg.error("请选择一条已关注竞价单数据取消关注");
    }
  }

  /**
   * 查看关注
   */
  buttonMarked(){
    this.markRowSelect();
  }

  /**
   * 查看全部
   */
  buttonAll(){
    this.markRowSelect();
  }


  /**
   * checkbox点击触发事件
   * @param data 
   */
  selectedData: any;  // 选中的数据
  btnDisable: any = {      // 禁用按钮
    buttonBid: true, // 出价
    buttonHistory: true,  // 出价历史
    buttonMark: true,  // 关注
    buttonUnmark: true, // 取消关注
  };
  btnHiden: any = {
    buttonMark: false,  // 关注
    buttonUnmark: true, // 取消关注
    buttonMarked: this.showMarked,  // 只看已关注
    buttonAll: !this.showMarked, // 全部
  }
  checkboxClick(data: Array<any>) {
    this.selectedData = data && data[0] ? data[0] : null;

    // 出价
    this.btnDisable.buttonBid = !this.selectedData || !this.selectedData.bidEnable;
    // 出价历史
    this.btnDisable.buttonHistory = !this.selectedData || !this.selectedData.offerPrice;
    // 关注/取消
    this.btnDisable.buttonMark = !this.selectedData;
    this.btnDisable.buttonUnmark = !this.selectedData;

    this.btnHiden.buttonMark = this.selectedData && this.selectedData.marked;
    this.btnHiden.buttonUnmark = !this.btnHiden.buttonMark;

    this.queryPalletItem(this.selectedData.checked, this.selectedData);
    
  }

  /**
   * 竞价单列表点击，查询竞价单关联货盘明细信息
   * @param data 
   */
  rowClick(data: any) {
    this.result.forEach(item => {
      if (item.rowid === data.rowid) {
        item.checked = !item.checked;
      } else if (item.checked) {
        item.checked = false;
      }
    });

    this.checkboxClick(this.result.filter(item => item.checked));
  }


  // 页面grid
  leftWidth: string = '60.5%';
  lineWidth: string = '60.5%';
  rightWidth: string = '39.5%';
  display: string = 'block';
  rightShow: boolean = false;

  /**
   * 右grid控制
   * @param data
   */
  gridLineFun(data: number) {
    const w = data < 1 ? data : 0.96;

    this.leftWidth = `${w * 100}%`;
    this.lineWidth = `${w * 100}%`;
    this.rightWidth = `${99 - w * 100}%`;
    this.display = 'block';

  }

  /**
   * 右grid
   */
  rightShowFun() {
    this.rightShow = !this.rightShow;
    if (this.rightShow) {
      this.leftWidth = '99%';
      this.lineWidth = '99%';
      this.rightWidth = '0%';
      this.display = 'none';
    } else {
      this.leftWidth = '60.5%';
      this.lineWidth = '60.5%';
      this.rightWidth = '39.5%';
      this.display = 'block';
    }
  }

}




