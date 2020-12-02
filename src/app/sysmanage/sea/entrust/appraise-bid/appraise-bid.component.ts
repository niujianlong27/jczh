import { Component, OnInit } from '@angular/core';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { format } from 'date-fns';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CodesetService } from '../../common/codeset.service';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { UploadFiles } from '../../../../common/services/upload-files';
import { Utils } from '../../common/utils';

@Component({
  selector: 'app-appraise-bid',
  templateUrl: './appraise-bid.component.html',
  styleUrls: ['./appraise-bid.component.css']
})
export class AppraiseBidComponent implements OnInit {
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  result: Array<any> = [];
  palletItem: Array<any> = [];

  selectedData: any;  // 选中的数据

  settleType: Array<any> = [];  //  是否含税
  calculation: Array<any> = [];  //  计价方式
  bizScope: Array<any> = [];  //  业务范围
  inqu: any = { createDateStart: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7) }; // 追加查询条件

  form: FormGroup;
  modalIsVisible: boolean = false;  // 发布弹框显示标记
  ownerCarriers: Array<any> = []; // 当前展示承运商
  bidCarriers: Array<any> = []; // 当前选中承运商
  tenderPallet: Array<any> = [];  // 当前竞价单关联货盘列表
  insertLoading: boolean = false;
  private initalSearch: any;
  btnDisable: any = {      // 禁用按钮
    Select: true, // 竞价选择
    Results: true,  // 查看竞价结果
    Again: true,  // 重新竞价
    Cancel: true  // 撤销
  };

  defaultTenderParam: any = {
    bidTimeStart: new Date(),
    oneTime: 10,
    twoTime: 20,
    delay: 5,
    maxNo: 3,
    settleType: 'JSFS10',
    markedPriceTaxNo: 0,
    calculation: 'JJJS10',
  }


  constructor(private http: HttpUtilService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private codeset: CodesetService,
    private appInfo: UserinfoService,
    private upload: UploadFiles, ) {

    this.form = this.fb.group({
      markedPriceTaxNo: [null, [Validators.required]],
      calculation: [null, [Validators.required]],
      settleType: [null, [Validators.required]],
      bidTimeStart: [null, [Validators.required]],
      oneTime: [null, [Validators.required]],
      twoTime: [null, [Validators.required]],
      delay: [null, [Validators.required]],
      maxNo: [null, [Validators.required]],
      remark: [null, []],
    });
  }

  ngOnInit() {
    this.settleType = this.codeset.get('settleType');
    this.calculation = this.codeset.get('calculation');
    

    this.getBidSetting();
  }

  /**
   * 获取竞价参数配置信息
   */
  getBidSetting() {
    this.http.post(SEA_URLS.getUserSetting, {}).then((res: any) => {
      if (res.success) {
        this.defaultTenderParam = Object.assign(this.defaultTenderParam, res.data.data);
      }
    });
  }

  /**
   * 自定义查询区域准备就绪时回调
   * @param search 自定义查询控件ref
   */
  _initalSearch(search) {
    this.initalSearch = function () {
      search.listSearch();
    }
    // 执行初始画面查询
    this.initalSearch();
    // this.codeset.reFetchSeaUserInfo().then(() => {
    //   this.bizScope = this.codeset.getItems('bizScope', this.appInfo.APPINFO.USER.seaUserBizScope);
    //   if (this.bizScope && this.bizScope.length > 0) {
    //     this.inqu.transType = this.bizScope[0].value;
    //     // 执行初始画面查询
    //     this.initalSearch();
    //   }else {
    //     this.msg.warning("该用户或公司未配置业务范围，请联系运营人员，或者重新登录或刷新试一下。");
    //   }
    // });
   
  }

  /**
     * 按钮组件点击事件处理
     * @param data 
     */
  btnClick(data: any) {
    switch (data.buttonId) {
      case 'Again': this.republish(); break;  // 重新竞价
      case 'Cancel': this.delete(); break;  // 撤销
      case 'Results': this.openHistoryModal(); break;  // 查看竞价结果
      case 'Select': this.openHistoryModal(true); break; //竞价选择
      default: this.msg.error("该功能待开发"); break;
    }
  }

  /**
   * 分页查询
   * @param data 
   */
  getList(pageParam: any): void {
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    this.inqu.createDateStart = Utils.format(this.inqu.createDateStart);
    this.inqu.createDateEnd = Utils.format(this.inqu.createDateEnd);
    this.loading = true;
    this.http.post(SEA_URLS.getTender, { ...pageParam }).then(
      (res: any) => {
        if (res.success) {
          this.result = res.data.data.data || [];
          this.total = res.data.data.total || 0;
          this.selectedData = null;
        }
        setTimeout(() => this.loading = false, 100);
      }
    );
  }

  /**
   * 删除
   */
  delete() {
    if (!this.selectedData) {
      this.msg.error("请至少选中一条竞价单数据删除");
      return;
    }

    this.modalService.confirm({
      nzTitle: '<i>是否确定删除选中竞价单信息?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.deleteList(),
    });
  }

  /**
   * 批量删除竞价单信息
   */
  deleteList() {
    this.http.post(SEA_URLS.deleteTender, { tenderModels: [this.selectedData] }).then((res: any) => {
      if (res.success) {
        this.initalSearch();
        this.notification.create('success', '提示信息', '删除成功！');
      }
    });
  }

  historyIsVisible: boolean = false;
  bidHistory: Array<any> = [];
  bidHistoryAll: Array<any> = [];
  queryHistoryLoading: boolean = false;
  selectedIndex: number = 0;
  bidFlag: boolean = false;
  /**
   * 打开出价历史弹框
   * @param bidFlag 是否选择承运商标记
   */
  openHistoryModal(bidFlag?: boolean) {
    if (!this.selectedData) {
      this.msg.error("请选择一条竞价信息！");
      return;
    }
    this.bidFlag = bidFlag;
    this.selectedIndex = 0;
    this.historyIsVisible = true;
    this.getHistory();
  }

  bidderCompany: Array<any> = [];
  /**
   * 查询竞价出价信息
   */
  getHistory(): void {
    const url = this.selectedIndex ? SEA_URLS.getBidrecord : SEA_URLS.getBid;
    this.queryHistoryLoading = true;
    this.http.post(url, { tenderNo: this.selectedData.tenderNo }).then(
      (res: any) => {
        if (res.success) {
          this.bidHistoryAll = res.data.data || [];
          // 只显示出过价的承运商的出价信息
          this.bidHistoryAll = this.bidHistoryAll.filter(item => item.offerPriceTaxNo || item.offerPriceTax);
          this.bidHistoryAll.forEach(item => {
            item.bidder = `${item.bidderCompanyName}-${item.bidderName}`;
            item.offerPrice = item.offerPriceTax ? item.offerPriceTax : item.offerPriceTaxNo;
          });
          this.bidderCompany = Utils.distinct(this.bidHistoryAll.map(item => item.bidderCompanyName)).map(item => { return { text: item, value: item, } });
          this.bidHistory = this.bidHistoryAll;
        }
        this.queryHistoryLoading = false;
      }
    );
  }

  /**
   * 筛选出价人
   * @param bidders 
   */
  bidderFilter(bidders: string[]) {
    if (!bidders || bidders.length == 0) {
      this.bidHistory = this.bidHistoryAll;
    } else {
      this.bidHistory = this.bidHistoryAll.filter(item => bidders.some(bider => item.bidderCompanyName === bider));
    }
  }



  /**
   * 排序
   * @param sortType 
   * @param sortKey 
   * @param dataType 
   */
  sort(sortType: string, sortKey: string, dataType?: 'string' | 'number') {
    if (sortType === 'ascend') {
      this.bidHistory = this.bidHistory.sort((a, b) => Utils.compareFn(a[sortKey], b[sortKey], dataType));
    } else if (sortType === 'descend') {
      this.bidHistory = this.bidHistory.sort((a, b) => Utils.compareFn(b[sortKey], a[sortKey], dataType));
    }
  }

  /**
   * 竞价选择承运商
   * @param bid 
   */
  winningBid(bid: any) {
    this.http.post(SEA_URLS.bidWinning, bid).then(
      (res: any) => {
        if (res.success) {
          this.notification.success("提示信息", "评标成功");
          this.historyIsVisible = false;
          this.initalSearch();
        }
      }
    );
  }

  /**
   * 重新发布竞价单弹框显示
   */
  republish() {
    if (!this.selectedData) {
      this.msg.error("请选中一条竞价单数据重新发布");
      return;
    }
    this.form.reset();
    this.form.patchValue(this.defaultTenderParam);

    this.modalIsVisible = true;
    this.getOwnerCarrier();
    this.getPallet();
  }

  /**
   * 竞价单发布
   */
  insertList() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return;

    if (!this.bidCarriers || this.bidCarriers.length == 0) {
      this.notification.error("提示信息", "必须选中参与竞价承运人");
      return;
    }

    this.form.value.bidTimeStart = Utils.format(this.form.value.bidTimeStart, 'm');

    // 根据是否含税将拦标价设置到对应字段。
    if (this.form.value.settleType == 'JSFS10') {
      this.form.value.markedPriceTax = this.form.value.markedPriceTaxNo;
      this.form.value.markedPriceTaxNo = null;
    } else {
      this.form.value.markedPriceTax = null;
    }

    const orderBids = this.bidCarriers.map(item => { return { bidderCompanyId: item.carrierCompanyId } });
    const tender = { ...this.selectedData, ...this.form.value, orderBids: orderBids };

    this.insertLoading = true;
    this.http.post(SEA_URLS.insertTender, { tenderModels: [tender] }).then((res: any) => {
      if (res.success) {
        this.modalIsVisible = false;
        this.notification.create('success', '提示信息', "竞价单重新发布成功!");
        this.initalSearch();
      }
      this.insertLoading = false;
    });
  }


  /**
   * 查询货盘信息
   */
  getPallet() {
    this.http.post(SEA_URLS.getPalletByTender, { tenderNo: this.selectedData.tenderNo }).then((res: any) => {
      if (res.success) {
        this.tenderPallet = res.data.data;
        this.tenderPallet.forEach(item => {
          item.flowDesc = Utils.getFlowDesc(item);
          item => item.docUrlsList = this.upload.getFileList(item.docUrls);
        });
      }
    });
  }

  /**
   * 查询承运商
   */
  getOwnerCarrier() {
    const param = {
      ownerCompanyId: this.selectedData.consignorCompanyId,
      palletNos: this.selectedData.palletNos.split(","),
      bizScope: this.selectedData.transType,
    };
    this.http.post(SEA_URLS.getBidCarrier, param).then((res: any) => {
      if (res.success) {
        this.ownerCarriers = res.data.data;
        this.bidCarriers = this.ownerCarriers.filter(item => item.direction == 'right');
      }
    });
  }

  /**
   * 穿梭框过滤触发方法
   * @param inputValue 
   * @param item 
   */
  dataFilter(inputValue: string, item: any): boolean {
    return item.name.indexOf(inputValue) > -1;
  }

  /**
   * 左右移动触发事件
   * @param data 
   */
  selectedBider(data: any) {   //承运人穿梭框改变时触发
    if (data.to === 'right') {
      this.bidCarriers = [...this.bidCarriers, ...data.list];
    } else {
      this.bidCarriers = this.bidCarriers.filter(item => !data.list.some(d => d.carrierCompanyId = item.carrierCompanyId));
    }
  }

  /**
   * checkbox点击触发事件
   * @param data 
   */
  checkboxClick(data: Array<any>) {
    this.selectedData = data && data[0] ? data[0] : null;

    // 竞价选择(待确认状态)
    this.btnDisable.Select = !this.selectedData || this.selectedData.status !== 'JJZZ40';
    // 查看竞价结果
    this.btnDisable.Results = !this.selectedData || (this.selectedData.status !== 'JJZZ40' && this.selectedData.status !== 'JJZZ50' && this.selectedData.status !== 'JJZZ60');
    // 重新竞价（竞价失败）
    this.btnDisable.Again = !this.selectedData || this.selectedData.status !== 'JJZZ60';
    // 撤销/删除（初始状态、出价中）
    this.btnDisable.Cancel = !this.selectedData || (this.selectedData.status !== 'JJZZ10' && this.selectedData.status !== 'JJZZ20');

    if(this.selectedData){
      this.http.post(SEA_URLS.getPalletItemByTender, { tenderNo: this.selectedData.tenderNo }).then(
        (res: any) => {
          if (res.success) {
            this.palletItem = res.data.data || [];
          }
        }
      );
    }else {
      this.palletItem = [];
    }
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

  /**
 * 竞价开始时间限制
 */
  disabledStartDate = (current: Date): boolean => {
    return Utils.beforeNowDate(current, this.form.value.bidTimeEnd);
  }
}
