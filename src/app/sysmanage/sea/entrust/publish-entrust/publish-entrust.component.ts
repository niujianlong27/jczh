import { Component, OnInit } from '@angular/core';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { CodesetService } from '../../common/codeset.service';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from '../../common/utils';

@Component({
  selector: 'app-publish-entrust',
  templateUrl: './publish-entrust.component.html',
  styleUrls: ['../../common/sea-common.css', './publish-entrust.component.css']
})
export class PublishEntrustComponent implements OnInit {
  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;

  buttonId: string;
  result: any[] = [];                //货盘数据列表
  itemData: any[] = [];                //货盘明细列表
  selectedData: any[] = []; // 选中的货盘数据
  
  settleType: Array<any> = [];  //  是否含税
  calculation: Array<any> = [];  //  计价方式
  bizScope: Array<any> = [];  //  业务范围
  inqu: any = {createDateStart: new Date(new Date().getTime() - 1000*60*60*24*7)};; // 追加查询条件

  form: FormGroup;
  publishType: number = 1;  // 1=分别发布；2=捆绑发布；默认分别发布
  modalIsVisible: boolean = false;  // 发布弹框显示标记
  ownerCarrierMap: any = {}; // 承运商列表map
  bidCarrierMap: any = {}; // 参与竞价承运商列表map
  ownerCarriers: Array<any> = []; // 当前展示承运商
  bidCarriers: Array<any> = []; // 当前选中承运商
  clickedPallet: any = {};  // 发布竞价单弹框当前点击货盘
  insertLoading: boolean = false;
  private initalSearch: any;
  defaultButtonDisable: any = {
    LssuedSeparately: true, // 分别发布
    Bundled: true,  // 捆绑发布
    Copy: true, // 复制
    Update: true, // 修改
    Delete: true, // 删除
  }
  btnDisable: any = this.defaultButtonDisable;

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
  

  constructor(private modalService: NzModalService,
    private router: Router,
    private http: HttpUtilService,
    private nzMess: NzNotificationService,
    private codeset: CodesetService,
    private appInfo: UserinfoService,
    private fb: FormBuilder, 
    private msg: NzMessageService, ) {

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
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'LssuedSeparately': this.publishTender(1); break;
      case 'Bundled': this.publishTender(2); break;
      case 'Copy': this.copyUpdate(this.buttonId); break;
      case 'Update': this.copyUpdate(this.buttonId); break;
      case 'Delete': this.delete(); break;
      default: this.msg.error("该功能待开发"); break;
    }
  }

  
  /**
   * 查询货盘
   * @param pageParam 
   */
  getList(pageParam: any) {      //获取数据列表接口
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    this.inqu.createDateStart = Utils.format(this.inqu.createDateStart);
    this.inqu.createDateEnd = Utils.format(this.inqu.createDateEnd);
    this.loading = true;
    this.http.post(SEA_URLS.getPallet, { ...pageParam }).then((res: any) => {
      setTimeout(() => this.loading = false, 100);
      if (res.success) {
        this.itemData = [];
        this.result = res.data.data && res.data.data.data || [];
        this.total = res.data.data.total ? res.data.data.total : 0;

        this.selectedData = [];
        this.btnDisable = this.defaultButtonDisable;
      }
    });
  }

  /**
   * 货盘列表行点击事件
   * @param data 
   */
  rowClick(data: any) { 
    this.itemData = [];
    this.loading = true;
    this.http.post(SEA_URLS.getPalletItemByTender, {palletNo: data.palletNo}).then((res: any) => {
      if (res.success) {
        this.itemData = res.data.data;
      }
      this.loading = false;
    });
  }

  /**
   * 货盘列表checkbox点击
   * @param data 选中数据
   */
  checkedData(data: any) {
    this.selectedData = data.checkedData;
    const pretenderNos = this.selectedData.filter(item => item.pretenderNo && item.pretenderNo.trim()).map(item => item.pretenderNo);
    // 捆绑货盘勾中时捆绑货盘同时勾中
    if (data.checked) {
      this.result.forEach(item => pretenderNos.some(pretenderNo => pretenderNo === item.pretenderNo) && (item.checked = true));
      this.selectedData = this.result.filter(item => item.checked);
    }

    this.btnDisable.Update = !(this.selectedData && this.selectedData.length === 1 && this.selectedData[0].palletStatus === 'HPZT10');
    this.btnDisable.Copy = !(this.selectedData && this.selectedData.length === 1);
    this.btnDisable.Delete = !(this.selectedData && this.selectedData.every(item => item.palletStatus === 'HPZT10'));
    this.btnDisable.LssuedSeparately = !(this.selectedData && (this.selectedData.every(item => item.palletStatus === 'HPZT10' || item.palletStatus === 'HPZT30')));
    this.btnDisable.Bundled = this.btnDisable.LssuedSeparately;
    console.dir(this.btnDisable);
  }

  /**
   * 复制/修改
   * @param buttonId 
   */
  copyUpdate(buttonId: string) {        
    if(!this.selectedData || this.selectedData.length !== 1){
      this.msg.error("请选中一条货盘数据复制");
      return;
    }
    
    const param = {
      palletNo: this.selectedData[0].palletNo,
      operateType: buttonId === 'Update' ? 'update_tender' : 'insert_tender',
    };
    this.router.navigate(['system/sea/pretender/pretenderPalletAdd'], { queryParams: param });
  }

  /**
   * 删除
   */
  delete() {
    if(!this.selectedData || this.selectedData.length !== 1){
      this.msg.error("请至少选中一条货盘数据删除");
      return;
    }

    this.modalService.confirm({
      nzTitle  : '<i>是否确定删除选中货盘信息?</i>',
      nzContent: '<b></b>',
      nzOnOk   : () => this.deleteList(),
    });
  }

  /**
   * 批量删除货盘信息
   */
  deleteList() {
    this.http.post(SEA_URLS.deletePallet, {palletModelList: this.selectedData}).then((res: any) => {
      if (res.success) {
        this.initalSearch();
        this.nzMess.create('success', '提示信息', '删除成功！');
      }
    });
  }


  publishData: Array<any> = [];
  
  /**
   * 发布竞价单弹框显示
   * @param type 1=分别发布；2=捆绑发布；默认分别发布
   */
  publishTender(type?: number){
    this.publishType = type || this.publishType;
    if(!this.selectedData || this.selectedData.length === 0){
      this.msg.error("请至少选中一条货盘数据发布");
      return;
    }
    this.form.reset();
    if(this.selectedData[0].transType == '10'){
      this.defaultTenderParam.calculation = 'JJJS20';
    }else{
      this.defaultTenderParam.calculation = 'JJJS10';
    }
    this.form.patchValue(this.defaultTenderParam);

    const param = { ownerCompanyId: null, palletNos: null, bizScope: null}; 
    if(type === 2){
      param.ownerCompanyId = this.selectedData[0].consignorCompanyId;
      param.palletNos = this.selectedData.map(item => item.palletNo);
      param.bizScope = this.selectedData[0].transType;
      this.clickedPallet = {palletNo: param.palletNos};
    }else{
      this.getPublishData();
      this.clickedPallet = this.publishData[0];
      param.ownerCompanyId = this.publishData[0].consignorCompanyId;
      param.palletNos = this.publishData[0].palletNo.split(",");
      param.bizScope = this.selectedData[0].transType;
    }
    this.modalIsVisible = true;
    this.getOwnerCarrier(param);
  }

  /**
   * 分别发布弹框表格数据
   */
  getPublishData(){
    const pretenderNos = Utils.distinct(this.selectedData.filter(item => item.pretenderNo && item.pretenderNo.trim()).map(item => item.pretenderNo));
    const separateData = this.selectedData.filter(item => !pretenderNos.some(pretenderNo => item.pretenderNo === pretenderNo));
    const bindData = pretenderNos.map(pretenderNo => {
      const bindPallets = this.selectedData.filter(item => item.pretenderNo === pretenderNo);
      return {
        palletNo: bindPallets.map(item => item.palletNo).join(","),
        flowDesc: Utils.distinct(bindPallets.map(item => Utils.getFlowDesc(item))).join(";"),
        totWeight: bindPallets.map(item => Number(item.totWeight)).reduce((acc, cur) => acc + cur, 0),
        consignorCompanyId: bindPallets[0].consignorCompanyId,
      }
    });
    separateData.forEach(item => item.flowDesc = Utils.getFlowDesc(item));
    this.publishData = [...bindData, ...separateData];
    this.publishData.forEach(item => {
      item.settleType = this.defaultTenderParam.settleType;
      item.markedPriceTaxNo = this.defaultTenderParam.markedPriceTaxNo;
      item.calculation = this.defaultTenderParam.calculation;
    });
  }

  /**
   * 竞价分别发布，行点击事件
   * @param data 
   */
  rowClicked(data: any){
    this.getOwnerCarrier({ ownerCompanyId: data.consignorCompanyId, palletNos: data.palletNo.split(","), bizScope: data.transType});
  }


  /**
   * 查询承运商
   * @param param 
   */
  getOwnerCarrier(param: any) {   
    const cacheKey = param.palletNos.join(",");
    if(this.ownerCarrierMap[cacheKey]){
      this.ownerCarriers = this.ownerCarrierMap[cacheKey];
      return;
    }
    this.http.post(SEA_URLS.getBidCarrier, param).then((res: any) => {
      if (res.success) {
        this.ownerCarriers = res.data.data;
        this.ownerCarrierMap[cacheKey] = this.ownerCarriers;

        this.bidCarriers = this.ownerCarriers.filter(item => item.direction == 'right');
        this.bidCarrierMap[cacheKey] = this.bidCarriers;
      }
    });
  }

  /**
   * 竞价单发布
   */
  insertList(){
    const removeCtrl = ['markedPriceTaxNo', 'calculation', 'settleType'];
    let invalid: boolean = false;
    for (const i in this.form.controls) {
      if(this.publishType === 1 && removeCtrl.some(item => item === i)){
        continue;
      }
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
      
      this.form.controls[i].invalid && (invalid = true);
      // console.log(`${i}:${this.form.controls[i].invalid}`);
    }
    if(invalid) return;

    this.form.value.bidTimeStart = Utils.format(this.form.value.bidTimeStart, 'm');
    // 将publishData数据转存到货盘数据中
    if(this.publishType === 1){
      this.selectedData.forEach(item => {
        const data = this.publishData.find(p => p.palletNo.indexOf(item.palletNo) > -1);
        item.settleType = data.settleType;
        item.markedPriceTaxNo = data.markedPriceTaxNo;
        item.calculation = data.calculation;
      });

      if(this.selectedData.some(item => !item.settleType || !item.markedPriceTaxNo || !item.calculation)){
        this.nzMess.error('提示信息', '分别发布每条记录的是否含税、最高限价、计价方式都必填');
        return;
      }
    }
    
    const param = this.getInsertParam();
    this.insertLoading = true;
    this.http.post(SEA_URLS.insertTender, param).then((res: any) => {
      if (res.success) {
        this.modalIsVisible = false;
        this.nzMess.create('success', '提示信息', "竞价单发布成功!");
        this.initalSearch();
      }
      this.insertLoading = false;
    });
  }

  /**
   * 拼接参数
   */
  getInsertParam(): any {
    const param = { tenderModels: null};
    // 捆绑发布
    if(this.publishType === 2){
      param.tenderModels = [this.getbindData(this.selectedData)];
    } else {
      // 分别发布
      const pretenderNos = Utils.distinct(this.selectedData.filter(item => item.pretenderNo && item.pretenderNo.trim()).map(item => item.pretenderNo));
      const bindData = pretenderNos.map(pretenderNo => this.getbindData(this.selectedData.filter(item => item.pretenderNo === pretenderNo)));

      const separateData = this.selectedData.filter(item => !pretenderNos.some(pretenderNo => item.pretenderNo === pretenderNo))
        .map(item => this.getSeparateData(item));
      param.tenderModels = [...bindData, ...separateData];
    }

    return param;
  }

  /**
   * 获取捆绑发布数据
   * @param pallets 
   */
  getbindData(pallets: Array<any> | any): any{
    const bindPallets = Array.isArray(pallets) ? pallets : [pallets];
    const palletNos = bindPallets.map(item => item.palletNo).join(",");
    const settleType = this.publishType === 2 ? this.form.value.settleType : bindPallets[0].settleType;
    const tender = {
      bindNo: bindPallets.length,
      palletNos: palletNos,
      offerPriceType: 'BJLX20',
      tenderType: 'CJLX10',
      bidder: 'CJRS20',
      totWeight: bindPallets.map(item => Number(item.totWeight)).reduce((acc, cur) => acc + cur, 0),
      totSheet: bindPallets.map(item => Number(item.totSheet)).reduce((acc, cur) => acc + cur, 0),
      productName: Utils.distinct(bindPallets.map(item => item.productName ? item.productName.split(",") : '').reduce((acc, cur) => acc.concat(cur ? cur : []), [])).join(","),
      flowDesc: Utils.distinct(bindPallets.map(item => Utils.getFlowDesc(item))).join(";"),
      containerDesc: Utils.getPalletContainerDesc(bindPallets),
      transType: bindPallets[0].transType,
      companyId: bindPallets[0].companyId,
      consignorCompanyId: bindPallets[0].consignorCompanyId,
      settleType: settleType,
      markedPriceTax: settleType == 'JSFS10' ? (this.publishType === 2 ? this.form.value.markedPriceTaxNo : bindPallets[0].markedPriceTaxNo) : null,
      markedPriceTaxNo: settleType == 'JSFS20' ? (this.publishType === 2 ? this.form.value.markedPriceTaxNo : bindPallets[0].markedPriceTaxNo) : null,
      calculation: bindPallets[0].calculation,
    }
    const orderBids = this.bidCarrierMap[palletNos].map(item => {return {bidderCompanyId: item.carrierCompanyId}});
    return {...this.form.value, ...tender, orderBids: orderBids};
  }

  /**
   * 获取分别发布数据
   * @param pallet 
   */
  getSeparateData(pallet: any){
    const tender = {
      bindNo: 1,
      palletNos: pallet.palletNo,
      offerPriceType: 'BJLX20',
      tenderType: 'CJLX10',
      bidder: 'CJRS20',
      totWeight: pallet.totWeight,
      totSheet: pallet.totSheet,
      productName: pallet.productName,
      flowDesc: Utils.getFlowDesc(pallet),
      containerDesc: pallet.containerDesc,
      transType: pallet.transType,
      companyId: pallet.companyId,
      consignorCompanyId: pallet.consignorCompanyId,
      settleType: pallet.settleType,
      markedPriceTax: pallet.settleType == 'JSFS10' ? pallet.markedPriceTaxNo : null,
      markedPriceTaxNo: pallet.settleType == 'JSFS20' ? pallet.markedPriceTaxNo : null,
      calculation: pallet.calculation,
    }
    const orderBids = this.bidCarrierMap[pallet.palletNo].map(item => {return {bidderCompanyId: item.carrierCompanyId}});
    return {...this.form.value, ...tender, orderBids: orderBids}
  }

  /**
   * 发布弹出框货盘点击事件
   * @param pallet 
   */
  palletClick(pallet: any){
    this.clickedPallet = pallet;
    const param = { ownerCompanyId: pallet.consignorCompanyId, palletNos: pallet.palletNo};
    this.getOwnerCarrier(param);
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
      this.bidCarrierMap[this.clickedPallet.palletNo] = this.bidCarriers;
    } else {
      this.bidCarriers = this.bidCarriers.filter(item => !data.list.some(d => d.carrierCompanyId = item.carrierCompanyId));
      this.bidCarrierMap[this.clickedPallet.palletNo] = this.bidCarriers;
    }
  }

  /**
   * 竞价开始时间限制
   */
  disabledStartDate = (current: Date): boolean => {
    return Utils.beforeNowDate(current, this.form.value.bidTimeEnd); 
  }

}
