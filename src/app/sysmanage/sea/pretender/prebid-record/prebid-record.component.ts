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
  selector: 'app-prebid-record',
  templateUrl: './prebid-record.component.html',
  styleUrls: ['../../common/sea-common.css', './prebid-record.component.css']
})
export class PrebidRecordComponent implements OnInit, OnDestroy {

  page: Page = new Page();
  platPage: Page = new Page();

  // 主界面
  inqu: any = {createDateStart: new Date(new Date().getTime() - 1000*60*60*24*7)};
  queryLoading: boolean = false;
  result: Array<any> = [];

  goodsData: Array<any> = [];

  // 出价弹框
  form: FormGroup;
  modalIsVisible: boolean = false;
  prebidLoading: boolean = false;

  pretenderStatus: Array<any> = [];
  pretenderStatus2: Array<any> = [];
  pretenderStatusFlag: Array<any> = [];
  bizScope: Array<any> = [];
  settleType: Array<any> = [];
  calculation: Array<any> = [];
  companyType: string;

  ownerCompany: Array<any> = [];
  carrierCompany: Array<any> = [];

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
    this.pretenderStatus = this.codeset.get('pretenderStatus');
    this.pretenderStatus2 = this.codeset.get('pretenderStatus2');
    this.pretenderStatusFlag = this.codeset.get('pretenderStatusFlag');
    this.settleType = this.codeset.get('settleType');
    this.calculation = this.codeset.get('calculation');
    this.codeset.reFetchSeaUserInfo().then(() => {
      this.bizScope = this.codeset.getItems('bizScope', this.appInfo.APPINFO.USER.seaUserBizScope);
      if (this.bizScope && this.bizScope.length > 0) {
        this.inqu.transType = this.bizScope[0].value;
        this.query();
      } else {
        this.msg.warning("该用户或公司未配置业务范围，请联系运营人员，或者重新登录或刷新试一下。");
      }
      this.companyType = this.appInfo.APPINFO.USER.seaCompanyType;
    });

    this.queryOwner();

    this.countdownTimer = setInterval(() => this.countdown(), 1000);

    // 用户标记localstorage缓存
    this.showMarkedBuffer = this.simpleCache.getLocal(this.getMarkedBufferName()) || {};
  }
  // 用户标记localstorage缓存名称
  getMarkedBufferName() {
    return 'PREBID_MARKED_' + this.appInfo.APPINFO.USER.userId;
  }

  ngOnDestroy(){
    this.countdownTimer && clearInterval(this.countdownTimer);
  }

  /**
   * 分页查询方法
   */
  query() {
    this.inqu.createDateStart = Utils.format(this.inqu.createDateStart);
    this.inqu.createDateEnd = Utils.format(this.inqu.createDateEnd);
    this.queryLoading = true;
    const url = this.companyType === '30' ? SEA_URLS.getCarrierPretender : SEA_URLS.getPretender;
    this.http.post(url, { ...this.inqu, ...this.page.getPagingObj() }).then((res: any) => {
      if (res.success) {
        this.page.total = res.data.data.total;
        this.curTime = new Date(res.data.data.nowDate).getTime();
        res.data.data.data && res.data.data.data.filter(item => item.bidTimeStart).forEach(item => {
          if(item.status == 'ZTZT10' || item.status == 'ZTZT20' || item.status == 'ZTZT30'){
            item.endTime = new Date(item.bidTimeEnd).getTime();
          }
          if(item.status == 'ZTZT10' && item.bidTimeStart){
            item.startTime = new Date(item.bidTimeStart).getTime();
          }
        });
        this.countdown(res.data.data.data);
        this.result = res.data.data.data;
        // 处理标记缓存
        this.processMarkedBuffer(this.result);
      }
      this.queryLoading = false;
    });
  }

  /**
   *  定时任务刷新倒计时
   */
  countdown(data?: Array<any>){
    if(!data){
      this.curTime = this.curTime + 1000;
    }
    const countdownData = data || this.result;
    countdownData.filter(item => item.bidTimeStart).forEach(item => {
      if(item.status == 'ZTZT10'){
        const diffTime = item.startTime - this.curTime;
        
        if(!item.startTime || diffTime <= 0){
          item.statusFlag = '12';
          item.status = 'ZTZT20';
          item.timeout = '';
        }else if(diffTime <= 10*60*1000){
          item.timeout = format(diffTime, 'mm:ss');
        }else{
          item.timeout = '距开标>10分钟';
        }
      }
      
      if(item.status == 'ZTZT20' || item.status == 'ZTZT30'){
        if(item.endTime <= this.curTime){
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
   * @param visible 
   * @param pretenderNo 
   */
  queryGoods(visible: boolean, pretenderNo: string){
    if(!visible){
      return;
    }
    if(this.tenderGoodsMap[pretenderNo]){
      this.goodsData = this.tenderGoodsMap[pretenderNo];
      return;
    }
    this.queryGoodsLoading = true;
    this.http.post(SEA_URLS.getPalletItemByTender, { pretenderNo: pretenderNo}).then((res: any) => {
      if (res.success) {
        this.goodsData = res.data.data;
        this.tenderGoodsMap[pretenderNo] = this.goodsData;
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
    const param = {pretenderNo: this.tenderInfo.pretenderNo, bidderCompanyId: this.appInfo.APPINFO.USER.companyId};
    this.http.post(SEA_URLS.getPrebid, param).then((res: any) => {
      if (res.success) {
        this.bidInfo = {};
        if (res.data.data && res.data.data.length > 0) {
          this.bidInfo =  res.data.data[0];
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
      } else {
        this.msg.error("系统错误，请联系系统管理员！");
      }
    });

    // 查询货盘信息
    
    this.http.post(SEA_URLS.getPalletByTender, {pretenderNo: this.tenderInfo.pretenderNo}).then((res: any) => {
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
  prebid(){
    let invalid: boolean = false;
    for (const i in this.form.controls) {
      if(!this.isBoxPrice && i === 'containerNo'){
        continue;
      }
      this.form.controls[ i ].markAsDirty();
      this.form.controls[ i ].updateValueAndValidity();
      this.form.controls[ i ].invalid && (invalid = true);
    }
    if(invalid) return;

    this.form.value.loadDateStart = Utils.format(this.form.value.loadDateStart);
    this.form.value.loadDateEnd = Utils.format(this.form.value.loadDateEnd);
    this.form.value.targetDate = Utils.format(this.form.value.targetDate);
    this.prebidLoading = true;
    const param = { ...this.bidInfo, ...this.form.value, pretenderNo: this.tenderInfo.pretenderNo};
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
  openHistoryModal(data: any){
    this.historyIsVisible = true;

    this.queryHistoryLoading = true;
    const param = {pretenderNo: data.pretenderNo, bidderCompanyId: this.appInfo.APPINFO.USER.companyId};
    this.http.post(SEA_URLS.getPrebidrecord, param).then((res: any) => {
      if (res.success) {
        this.bidHistory = res.data.data;
        this.bidHistory.forEach(item => item.docUrlsList = this.upload.getFileList(item.docUrls));
      }
      this.queryHistoryLoading = false;
    });
  }

  modalRef: any;
  openPallet(data: any){
    this.modalRef = this.modalService.create({
      nzTitle: '查看货盘',
      nzContent: PalletAddComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '75%',
      nzOnCancel: () => this.modalRef.destroy(),
      nzComponentParams: {palletNo: data.palletNos},
    });
  }


  docUrlsList = [];

  handleChange(info, name) {
    if (info.file.status === 'done') {
      if (name == 'docUrls') {
        this.docUrlsList = this.docUrlsList.map(item => item.originFileObj ? item.originFileObj : item);
        const docUrls = this.docUrlsList.map(item => item.url).join(";");
        this.form.patchValue({docUrls: docUrls});
        
      }
    }
    if (info.file.status === 'removed') {
      if (name == 'docUrls') {
        this.docUrlsList = this.docUrlsList.filter(item => item.url !== info.file.url);
        const docUrls = this.docUrlsList.map(item => item.url).join(";");
        this.form.patchValue({docUrls: docUrls});
      }
    }
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
  markRow(item){
    item.marked = !item.marked;
    if (item.marked) {
      this.showMarkedCount++;
    } else {
      this.showMarkedCount--;
    }
    this.showMarkedBuffer[item.pretenderNo] = item.marked;
    this.simpleCache.setLocal(this.getMarkedBufferName(), JSON.stringify(this.showMarkedBuffer));
  }
  // 点击总选择是否显示标记
  markRowSelect(){
    if (!this.showMarked && this.showMarkedCount === 0) {
      this.msg.warning('请先选择标记行！');
      return;
    }
    this.showMarked = !this.showMarked;
  }
  // 查询成功后处理标记缓存
  processMarkedBuffer(items) {
    this.showMarked = false;
    const now = new Date().getTime();
    if(this.showMarkedBuffer['recordTime']){
      if (now - this.showMarkedBuffer['recordTime'] > 48 * 3600 * 1000){
        this.showMarkedBuffer = {};
        this.showMarkedBuffer['recordTime'] = now;
        return;
      }
    }else{
      this.showMarkedBuffer['recordTime'] = now;
    }
    this.showMarkedCount = 0;
    return items && items.forEach(item => {
      if (this.showMarkedBuffer[item.pretenderNo]) {
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



