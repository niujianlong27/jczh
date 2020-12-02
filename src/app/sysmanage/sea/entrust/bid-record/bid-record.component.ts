import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { CodesetService } from '../../common/codeset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns'
import { UploadFiles } from '../../../../common/services/upload-files';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { SimpleCacheService } from '../../../../common/services/simple-cache.service';
import { Utils } from '../../common/utils';

@Component({
  selector: 'app-bid-record',
  templateUrl: './bid-record.component.html',
  styleUrls: ['../../common/sea-common.css', './bid-record.component.css']
})
export class BidRecordComponent implements OnInit, OnDestroy {

  page: Page = new Page();
  platPage: Page = new Page();

  // 主界面
  inqu: any = { createDateStart: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7) };
  queryLoading: boolean = false;
  result: Array<any> = [];

  goodsData: Array<any> = [];

  // 出价弹框
  form: FormGroup;
  modalIsVisible: boolean = false;
  bidLoading: boolean = false;

  tenderStatus: Array<any> = [];
  tenderStatusFlag: Array<any> = [];
  bizScope: Array<any> = [];
  settleType: Array<any> = [];
  calculation: Array<any> = [];

  ownerCompany: Array<any> = [];
  carrierCompany: Array<any> = [];

  countdownTimer: any;
  curTime: number = new Date().getTime();

  minPriceTimer: any;
  companyType: string;
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
    this.tenderStatus = this.codeset.get('tenderStatus');
    this.tenderStatusFlag = this.codeset.get('tenderStatusFlag');
    this.settleType = this.codeset.get('settleType');
    this.calculation = this.codeset.get('calculation');
    this.codeset.reFetchSeaUserInfo().then(() => {
      this.bizScope = this.codeset.getItems('bizScope', this.appInfo.APPINFO.USER.seaUserBizScope);
      if (this.bizScope && this.bizScope.length > 0) {
        this.inqu.transType = this.bizScope[0].value;
      } else {
        this.msg.warning("该用户或公司未配置业务范围，请联系运营人员，或者重新登录或刷新试一下。");
      }
      this.companyType = this.appInfo.APPINFO.USER.seaCompanyType;
      this.query();
    });
    
    this.queryOwner();

    this.countdownTimer = setInterval(() => this.countdown(), 1000);

    this.minPriceTimer = setInterval(() => this.minPrice(), 1000 * 10);
    // 用户标记localstorage缓存
    this.showMarkedBuffer = this.simpleCache.getLocal(this.getMarkedBufferName()) || {};
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
  query() {
    this.inqu.createDateStart = Utils.format(this.inqu.createDateStart);
    this.inqu.createDateEnd = Utils.format(this.inqu.createDateEnd);
    this.queryLoading = true;
    const url = this.companyType === '30' ? SEA_URLS.getCarrierTender : SEA_URLS.getTender;
    this.http.post(url, { ...this.inqu, ...this.page.getPagingObj() }).then((res: any) => {
      if (res.success) {
        this.page.total = res.data.data.total;
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
        // 处理标记缓存
        this.processMarkedBuffer(this.result);
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
            if (tender.endTime < this.curTime && this.companyType === '30') {
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
  queryGoods(visible: boolean, tenderNo: string) {
    if (!visible) {
      return;
    }
    // 竞价单关联货物明细缓存对象中存在，直接使用缓存值，否则查询
    if (this.tenderGoodsMap[tenderNo]) {
      this.goodsData = this.tenderGoodsMap[tenderNo];
      return;
    }
    this.queryGoodsLoading = true;
    this.http.post(SEA_URLS.getPalletItemByTender, { tenderNo: tenderNo }).then((res: any) => {
      if (res.success) {
        this.goodsData = res.data.data;
        this.tenderGoodsMap[tenderNo] = this.goodsData;
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


  allChecked: boolean = false;
  indeterminate: boolean = false;

  refreshStatus(): void {
    const allChecked = this.result.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.result.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAll(value: boolean, type?: string): void {
    this.result.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
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
  }
  // 点击总选择是否显示标记
  markRowSelect() {
    if (!this.showMarked && this.showMarkedCount === 0 ){
      this.msg.warning('请先选择标记行！');
      return;
    }
    this.showMarked = !this.showMarked;
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
    * 修改每页显示数量
    * @param pageSize 
    */
  pageSizeChange(pageSize: any) {
    this.page.pageSize = pageSize;
    this.query();
  }

  /**
   * 修改页码
   * @param pageIndex 
   */
  pageIndexChange(pageIndex: any) {
    this.page.pageIndex = pageIndex;
    this.query();
  }

}



