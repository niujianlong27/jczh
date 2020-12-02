import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { Page } from '../../common/page.model';
import { CodesetService } from '../../common/codeset.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns'
import { UploadFiles } from '../../../../common/services/upload-files';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { PalletAddComponent } from '../pallet-add/pallet-add.component';
import { SimpleCacheService } from '../../../../common/services/simple-cache.service';
import { Utils } from '../../common/utils';

@Component({
  selector: 'app-prebid-record2',
  templateUrl: './prebid-record2.component.html',
  styleUrls: ['../../common/sea-common.css', './prebid-record2.component.css']
})
export class PrebidRecord2Component implements OnInit, OnDestroy {
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
  prebidLoading: boolean = false;
  settleType: Array<any> = [];
  calculation: Array<any> = [];

  ownerCompany: Array<any> = [];

  countdownTimer: any;
  curTime: number = new Date().getTime();

  showMarked = false; // 是否只显示标记记录
  showMarkedBuffer = {};
  showMarkedCount = 0;
  constructor(private http: HttpUtilService,
    private msg: NzMessageService,
    private codeset: CodesetService,
    public fb: FormBuilder,
    private upload: UploadFiles,
    private appInfo: UserinfoService,
    private modalService: NzModalService,
    private simpleCache: SimpleCacheService) {

    this.form = this.fb.group({
      "boatName": [null, []],
      "loadDateStart": [null, []],
      "loadDateEnd": [null, []],
      "targetDate": [null, []],
      "settleType": [null, []],
      "markedPrice": [null, []],
      "offerPriceTax": [null, [Validators.required]],
      "calculation": [null, []],
      "containerNo": [null, [Validators.required]],
      "docUrls": [null, []],
    });
  }

  ngOnInit() {
    this.settleType = this.codeset.get('settleType');
    this.calculation = this.codeset.get('calculation');
    // this.queryOwner();

    this.countdownTimer = setInterval(() => this.countdown(), 1000);

    // 用户标记localstorage缓存
    this.showMarkedBuffer = this.simpleCache.getLocal(this.getMarkedBufferName()) || {};
  }
  // 用户标记localstorage缓存名称
  getMarkedBufferName() {
    return 'PREBID_MARKED_' + this.appInfo.APPINFO.USER.userId;
  }

  ngOnDestroy() {
    this.countdownTimer && clearInterval(this.countdownTimer);
  }

  /**
   * 分页查询方法
   */
  query(pageParam: any) {
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    this.queryLoading = true;
    const url = SEA_URLS.getCarrierPretender;
    this.http.post(url, { ...pageParam }).then((res: any) => {
      if (res.success) {
        this.total = res.data.data.total ? res.data.data.total : 0;
        this.curTime = new Date(res.data.data.nowDate).getTime();
        res.data.data.data && res.data.data.data.filter(item => item.bidTimeStart).forEach(item => {
          if (item.status == 'ZTZT10' || item.status == 'ZTZT20' || item.status == 'ZTZT30') {
            item.endTime = new Date(item.bidTimeEnd).getTime();
          }
          if (item.status == 'ZTZT10' && item.bidTimeStart) {
            item.startTime = new Date(item.bidTimeStart).getTime();
          }
        });
        this.countdown(res.data.data.data);
        this.result = res.data.data.data;
        this.resultShow = this.result;
        // 处理标记缓存
        this.processMarkedBuffer(this.result);
      }
      this.queryLoading = false;
    });
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

  /**
   *  定时任务刷新倒计时
   */
  countdown(data?: Array<any>) {
    if (!data) {
      this.curTime = this.curTime + 1000;
    }
    const countdownData = data || this.result;
    countdownData.filter(item => item.bidTimeStart).forEach(item => {
      // console.log(`${format(new Date(), 'HH:mm:ss')}>${item.timeout}`)
      if (item.status == 'ZTZT10') {
        const diffTime = item.startTime - this.curTime;

        if (!item.startTime || diffTime <= 0) {
          item.statusFlag = '12';
          item.status = 'ZTZT20';
          item.timeout = '';
        } else if (diffTime <= 10 * 60 * 1000) {
          item.timeout = format(diffTime, 'mm:ss');
        } else {
          item.timeout = '距开标>10分钟';
        }
      }

      if (item.status == 'ZTZT20' || item.status == 'ZTZT30') {
        if (item.endTime <= this.curTime) {
          item.statusFlag = item.offerPrice ? '22' : '21';
          item.status = 'ZTZT40';
        }
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
  tenderGoodsMap: any = {};
  /**
   * 根据预招标单号查询货盘明细
   * @param data 
   */
  queryPalletItem(data: any) {
    if (!data || !data.pretenderNo) {
      this.palletItem = [];
      return;
    }
    const pretenderNo = data.pretenderNo;
    if (this.tenderGoodsMap[pretenderNo]) {
      this.palletItem = this.tenderGoodsMap[pretenderNo];
      return;
    }
    this.queryGoodsLoading = true;
    this.http.post(SEA_URLS.getPalletItemByTender, { pretenderNo: pretenderNo }).then((res: any) => {
      if (res.success) {
        this.palletItem = res.data.data;
        this.tenderGoodsMap[pretenderNo] = this.palletItem;
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
    this.docUrlsList = [];
    // 查询出价信息
    const param = { pretenderNo: this.tenderInfo.pretenderNo, bidderCompanyId: this.appInfo.APPINFO.USER.companyId };
    this.http.post(SEA_URLS.getPrebid, param).then((res: any) => {
      if (res.success) {
        this.bidInfo = {};
        if (res.data.data && res.data.data.length > 0) {
          this.bidInfo = res.data.data[0];
          this.bidInfo.offerPriceTax = this.bidInfo.offerPrice;
        }
        this.modalIsVisible = true;
        const tenderInfo = {
          settleType: this.tenderInfo.settleType,
          markedPrice: this.tenderInfo.settleType == 'JSFS10' ? this.tenderInfo.markedPriceTax : this.tenderInfo.markedPriceTaxNo,
          calculation: this.tenderInfo.calculation,
        };
        // this.tenderInfo.offerPrice = this.form.value.offerPriceTax;
        this.form.patchValue({ ...tenderInfo, ...this.bidInfo });
        this.docUrlsList = this.upload.getFileList(this.bidInfo.docUrls);
        console.dir(this.form)
      } else {
        this.msg.error("系统错误，请联系系统管理员！");
      }
    });

    // 查询货盘信息

    this.http.post(SEA_URLS.getPalletByTender, { pretenderNo: this.tenderInfo.pretenderNo }).then((res: any) => {
      if (res.success) {
        this.palletList = res.data.data;
        this.palletList.forEach(item => {
          item.flowDesc = Utils.getFlowDesc(item);
          item.docUrlsList = this.upload.getFileList(item.docUrls)
        });
      }
    });
  }

  tenderInfo: any = {};
  bidInfo: any = {};
  palletList: Array<any> = [];
  isBoxPrice: boolean = false;
  /**
   * 出价
   */
  prebid() {
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
    this.form.value.targetDate = Utils.format(this.form.value.targetDate);
    this.prebidLoading = true;
    const param = { ...this.bidInfo, ...this.form.value, pretenderNo: this.tenderInfo.pretenderNo };
    this.http.post(SEA_URLS.prebid, param).then((res: any) => {
      if (res.success) {
        this.msg.success("预投标出价成功！");
        this.modalIsVisible = false;
        this.tenderInfo.offerPrice = this.form.value.offerPriceTax;
        this.tenderInfo.statusFlag = '13';
      }
      this.prebidLoading = false;
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
    const param = { pretenderNo: data.pretenderNo, bidderCompanyId: this.appInfo.APPINFO.USER.companyId };
    this.http.post(SEA_URLS.getPrebidrecord, param).then((res: any) => {
      if (res.success) {
        this.bidHistory = res.data.data;
        this.bidHistory.forEach(item => item.docUrlsList = this.upload.getFileList(item.docUrls));
      }
      this.queryHistoryLoading = false;
    });
  }

  modalRef: any;
  openPallet(data: any) {
    this.modalRef = this.modalService.create({
      nzTitle: '查看货盘',
      nzContent: PalletAddComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '75%',
      nzOnCancel: () => this.modalRef.destroy(),
      nzComponentParams: { palletNo: data.palletNos },
    });
  }


  docUrlsList = [];

  handleChange(info, name) {
    if (info.file.status === 'done') {
      if (name == 'docUrls') {
        this.docUrlsList = this.docUrlsList.map(item => item.originFileObj ? item.originFileObj : item);
        const docUrls = this.docUrlsList.map(item => item.url).join(";");
        this.form.patchValue({ docUrls: docUrls });

      }
    }
    if (info.file.status === 'removed') {
      if (name == 'docUrls') {
        this.docUrlsList = this.docUrlsList.filter(item => item.url !== info.file.url);
        const docUrls = this.docUrlsList.map(item => item.url).join(";");
        this.form.patchValue({ docUrls: docUrls });
      }
    }
  }

  // 点击每行标记图标
  markRow(item) {
    item.marked = !item.marked;
    if (item.marked) {
      this.showMarkedCount++;
    } else {
      this.showMarkedCount--;
    }
    this.showMarkedBuffer[item.pretenderNo] = item.marked;
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
      if (this.showMarkedBuffer[item.pretenderNo]) {
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
  buttonBid() {
    if (!this.selectedData) {
      this.msg.error("请选择一条预招标单数据出价");
      return;
    }
    this.openModal(this.selectedData);
  }

  /**
   * 查看出价历史
   */
  buttonHistory() {
    if (!this.selectedData) {
      this.msg.error("请选择一条预招标单数据查看出价历史");
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
      this.msg.error("请选择一条未关注预招标单数据关注");
    }
  }

  /**
   * 关注/标记
   */
  buttonUnmark() {
    if (this.selectedData && this.selectedData.marked) {
      this.markRow(this.selectedData);
    } else {
      this.msg.error("请选择一条已关注预招标单数据取消关注");
    }
  }

  /**
   * 查看关注
   */
  buttonMarked() {
    this.markRowSelect();
  }

  /**
   * 查看全部
   */
  buttonAll() {
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
    this.btnDisable.buttonBid = !this.selectedData || (this.selectedData.status != 'ZTZT20' && this.selectedData.status != 'ZTZT30');
    // 出价历史
    this.btnDisable.buttonHistory = !this.selectedData || !this.selectedData.offerPrice;
    // 关注/取消
    this.btnDisable.buttonMark = !this.selectedData;
    this.btnDisable.buttonUnmark = !this.selectedData;

    this.btnHiden.buttonMark = this.selectedData && this.selectedData.marked;
    this.btnHiden.buttonUnmark = !this.btnHiden.buttonMark;

    this.queryPalletItem(this.selectedData);

  }

  /**
   * 预招标单列表点击，查询预招标单关联货盘明细信息
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




