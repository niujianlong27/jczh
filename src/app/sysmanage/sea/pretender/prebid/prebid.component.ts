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
  selector: 'app-prebid',
  templateUrl: './prebid.component.html',
  styleUrls: ['./prebid.component.css']
})
export class PrebidComponent implements OnInit {
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  result: Array<any> = [];
  palletItem: Array<any> = [];

  selectedData: any;  // 选中的数据

  settleType: Array<any> = [];  //  是否含税
  calculation: Array<any> = [];  //  计价方式
  bizScope: Array<any> = [];  //  业务范围
  inqu: any = {createDateStart: new Date(new Date().getTime() - 1000*60*60*24*7)}; // 追加查询条件

  form: FormGroup;
  modalIsVisible: boolean = false;  // 发布弹框显示标记
  ownerCarriers: Array<any> = []; // 当前展示承运商
  bidCarriers: Array<any> = []; // 当前选中承运商
  tenderPallet: Array<any> = [];  // 当前预招标单关联货盘列表
  insertLoading: boolean = false;
  private initalSearch: any;
  btnDisable: any = {      // 禁用按钮
    Select: true, // 预招标选择
    Results: true,  // 查看预招标结果
    Again: true,  // 重新预招标
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
    //   } else {
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
      case 'Release': this.publishTender(); break;  // 发布竞价
      case 'Delete': this.delete(); break;  // 撤销
      case 'Result': this.openHistoryModal(); break;  // 查看投标结果
      case 'Select': this.openHistoryModal(true); break; //预招标选择
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
    this.http.post(SEA_URLS.getPretender, { ...pageParam }).then(
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
      this.msg.error("请至少选中一条预招标单数据删除");
      return;
    }

    this.modalService.confirm({
      nzTitle: '<i>是否确定删除选中预招标单信息?</i>',
      nzContent: '<b></b>',
      nzOnOk: () => this.deleteList(),
    });
  }

  /**
   * 批量删除预招标单信息
   */
  deleteList() {
    this.http.post(SEA_URLS.deletePretender, { pretenderModelList: [this.selectedData] }).then((res: any) => {
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
      this.msg.error("请选择一条预招标信息！");
      return;
    }
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
    const url = this.selectedIndex ? SEA_URLS.getPrebidrecord : SEA_URLS.getPrebid;
    this.queryHistoryLoading = true;
    this.http.post(url, { pretenderNo: this.selectedData.pretenderNo }).then(
      (res: any) => {
        if (res.success) {
          this.bidHistoryAll = res.data.data || [];
          this.bidHistoryAll.forEach(item => {
            item.docUrlsList = this.upload.getFileList(item.docUrls);
            item.bidder = `${item.bidderCompanyName}-${item.bidderName}`;
            item.offerPrice = item.offerPriceTax ? item.offerPriceTax : item.offerPriceTaxNo;
          });
          this.bidderCompany = Utils.distinct(this.bidHistoryAll.map(item => item.bidderCompanyName)).map(item => {return {text: item, value: item,}});
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
  bidderFilter(bidders: string[]){
    if(!bidders || bidders.length == 0){
      this.bidHistory = this.bidHistoryAll;
    }else{
      this.bidHistory = this.bidHistoryAll.filter(item => bidders.some(bider => item.bidderCompanyName === bider));
    }
  }



  /**
   * 排序
   * @param sortType 
   * @param sortKey 
   * @param dataType 
   */
  sort(sortType: string, sortKey: string, dataType?: 'string' | 'number'){
    if(sortType === 'ascend'){
      this.bidHistory = this.bidHistory.sort((a, b) => Utils.compareFn(a[sortKey], b[sortKey], dataType));
    }else if(sortType === 'descend'){
      this.bidHistory = this.bidHistory.sort((a, b) => Utils.compareFn(b[sortKey], a[sortKey], dataType));
    }
  }

  /**
   * 预招标选择承运商
   * @param bid 
   */
  winningPrebid(bid: any) {
    this.http.post(SEA_URLS.prebidWinning, bid).then(
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
   * 发布竞价单弹框显示
   */
  publishTender() {
    if (!this.selectedData) {
      this.msg.error("请选中一条预招标单数据重新发布");
      return;
    }
    this.form.reset();
    if(this.selectedData.transType == '10'){
      this.defaultTenderParam.calculation = 'JJJS20';
    }else{
      this.defaultTenderParam.calculation = 'JJJS10';
    }
    this.form.patchValue(this.defaultTenderParam);

    this.modalIsVisible = true;
    this.getOwnerCarrier();
    this.getPallet();
  }

  /**
   * 竞价发布
   */
  insertList() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return;

    if (!this.bidCarriers || this.bidCarriers.length == 0) {
      this.notification.error("提示信息", "必须选中参与预招标承运人");
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

    const tender = {
      bindNo: this.tenderPallet.length,
      palletNos: this.tenderPallet.map(item => item.palletNo).join(","),
      offerPriceType: this.tenderPallet.length > 1 ? 'BJLX20' : 'BJLX30',
      tenderType: 'CJLX10',
      bidder: 'CJRS20',
      totWeight: this.tenderPallet.map(item => Number(item.totWeight)).reduce((acc, cur) => acc + cur, 0),
      totSheet: this.tenderPallet.map(item => Number(item.totSheet)).reduce((acc, cur) => acc + cur, 0),
      productName: Utils.distinct(this.tenderPallet.map(item => item.productName ? item.productName.split(",") : '').reduce((acc, cur) => acc.concat(cur ? cur : []), [])).join(","),
      flowDesc: Utils.distinct(this.tenderPallet.map(item => Utils.getFlowDesc(item))).join(";"),
      containerDesc: this.selectedData.containerDesc,
      transType: this.selectedData.transType,
      consignorCompanyId: this.selectedData.consignorCompanyId,
      companyId: this.selectedData.companyId,
    }

    const orderBids = this.bidCarriers.map(item => { return { bidderCompanyId: item.carrierCompanyId } });
    
    const tenderModel = { ...tender, ...this.form.value, orderBids: orderBids };

    this.insertLoading = true;
    this.http.post(SEA_URLS.insertTender, { tenderModels: [tenderModel] }).then((res: any) => {
      if (res.success) {
        this.modalIsVisible = false;
        this.notification.create('success', '提示信息', "竞价单发布成功!");
        this.initalSearch();
      }
      this.insertLoading = false;
    });
  }

  /**
   * 查询货盘信息
   */
  getPallet() {
    this.http.post(SEA_URLS.getPalletByTender, { pretenderNo: this.selectedData.pretenderNo }).then((res: any) => {
      if (res.success) {
        this.tenderPallet = res.data.data;
        this.tenderPallet.forEach(item => {
          item.flowDesc = Utils.getFlowDesc(item);
          item.docUrlsList = this.upload.getFileList(item.docUrls);
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

    // 预投标选择(待确认状态)
    this.btnDisable.Select = !this.selectedData || this.selectedData.status !== 'ZTZT40' || this.selectedData.transType !== '10';
    // 查看投标结果
    this.btnDisable.Result = !this.selectedData || (this.selectedData.status !== 'ZTZT40' && this.selectedData.status !== 'ZTZT60');
    // 发布竞价（预招标失败）
    this.btnDisable.Release = this.btnDisable.Result;
    // 撤销/删除（初始状态、出价中）
    this.btnDisable.Delete = !this.selectedData || (this.selectedData.status !== 'ZTZT10' && this.selectedData.status !== 'ZTZT20');

    // this.btnDisable = { Select: false, Result: false, Release: false, Delete: false, }
    if(this.selectedData){
      this.http.post(SEA_URLS.getPalletItemByTender, { pretenderNo: this.selectedData.pretenderNo }).then(
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
   * 预招标单列表点击，查询预招标单关联货盘明细信息
   * @param data 
   */
  rowClick(data: any) {
    this.result.forEach(item => {
      if (item.rowid === data.rowid) {
        item.checked = !item.checked;
      }else if(item.checked){
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

