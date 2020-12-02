import { Component, OnInit } from '@angular/core';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { CodesetService } from '../../common/codeset.service';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from '../../common/utils';
import { UploadFiles } from '../../../../common/services/upload-files';

@Component({
  selector: 'app-pretender-publish',
  templateUrl: './pretender-publish.component.html',
  styleUrls: ['../../common/sea-common.css', './pretender-publish.component.css']
})
export class PretenderPublishComponent implements OnInit {
  
  pageSize: number = 30;
  total: number = 0;

  buttonId: string;
  loading: boolean = false;
  result: any[] = [];                //货盘数据列表
  itemLoading: boolean = false;
  itemData: any[] = [];                //货盘明细列表
  selectedData: any[] = []; // 选中的货盘数据
  
  settleType: Array<any> = [];  //  是否含税
  calculation: Array<any> = [];  //  计价方式
  bizScope: Array<any> = [];  //  业务范围
  inqu: any = {createDateStart: new Date(new Date().getTime() - 1000*60*60*24*7)}; // 追加查询条件

  form: FormGroup;
  publishType: number = 1;  // 1=分别发布；2=捆绑发布；默认分别发布
  modalIsVisible: boolean = false;  // 发布弹框显示标记
  insertLoading: boolean = false;
  private initalSearch: any;
  defaultButtonDisable: any = {
    issue: true, // 分别发布
    issues: true,  // 捆绑发布
    copy: true, // 复制
    Update: true, // 修改
    Delete: true, // 删除
    preview: true, //预览
  }
  btnDisable: any = this.defaultButtonDisable;

  defaultTenderParam: any = {
    // bidTimeStart: new Date(),
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
    private msg: NzMessageService, 
    public upload: UploadFiles) {
    this.form = this.fb.group({
      markedPriceTaxNo: [null, [Validators.required]],
      calculation: [null, [Validators.required]],
      settleType: [null, [Validators.required]],
      bidTimeStart: [null, []],
      bidTimeEnd: [null, [Validators.required]],
      docUrls: [null, []],
      remark: [null, []],
    });
  }


  ngOnInit() {
    this.settleType = this.codeset.get('settleType');
    this.calculation = this.codeset.get('calculation');
    
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
      case 'issue': this.publishPretender(1); break;
      case 'issues': this.publishPretender(2); break;
      case 'copy': this.copyUpdate(this.buttonId); break;
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
      if (res.success) {
        this.itemData = [];
        this.result = res.data.data && res.data.data.data || [];
        this.total = res.data.data.total ? res.data.data.total : 0;

        this.selectedData = [];
        this.btnDisable = this.defaultButtonDisable;
      }
      setTimeout(() => this.loading = false, 100);
    });
  }

  /**
   * 货盘列表行点击事件
   * @param data 
   */
  rowClick(data: any) { 
    this.itemData = [];
    this.itemLoading = true;
    this.http.post(SEA_URLS.getPalletItemByTender, {palletNo: data.palletNo}).then((res: any) => {
      if (res.success) {
        this.itemData = res.data.data;
      }
      this.itemLoading = false;
    });
  }

  /**
   * 货盘列表checkbox点击
   * @param data 选中数据
   */
  checkedData(data: any) {
    this.selectedData = data;

    this.btnDisable.Update = !(this.selectedData && this.selectedData.length === 1 && this.selectedData[0].palletStatus === 'HPZT10');
    this.btnDisable.copy = !(this.selectedData && this.selectedData.length === 1);
    this.btnDisable.Delete = !(this.selectedData && this.selectedData.every(item => item.palletStatus === 'HPZT10'));
    this.btnDisable.issue = !(this.selectedData && (this.selectedData.every(item => item.palletStatus === 'HPZT10')));
    this.btnDisable.issues = this.btnDisable.issue;
    // this.btnDisable.preview = this.btnDisable.LssuedSeparately;
    // this.btnDisable = {
    //   issue: false, // 分别发布
    //   issues: false,  // 捆绑发布
    //   copy: false, // 复制
    //   Update: false, // 修改
    //   Delete: false, // 删除
    //   preview: false, //预览
    // }
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
      operateType: buttonId === 'Update' ? 'update_pretender' : 'insert_pretender',
    };
    this.router.navigate(['system/sea/pretender/pretenderPalletAdd'], { queryParams: param });
  }

  /**
   * 删除
   */
  delete() {
    if(!this.selectedData || this.selectedData.length === 0){
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
  publishPretender(type?: number){
    this.publishType = type || this.publishType;
    if(!this.selectedData || this.selectedData.length === 0){
      this.msg.error("请至少选中一条货盘数据发布");
      return;
    }
    this.docUrlsList = [];
    this.form.reset();
    if(this.selectedData[0].transType == '10'){
      this.defaultTenderParam.calculation = 'JJJS20';
    }else{
      this.defaultTenderParam.calculation = 'JJJS10';
    }
    this.form.patchValue(this.defaultTenderParam);

    // 分别发布
    if(type === 1){
      this.selectedData.forEach(item => {
        item.flowDesc = Utils.getFlowDesc(item);
        item.settleType = this.defaultTenderParam.settleType;
        item.markedPriceTaxNo = this.defaultTenderParam.markedPriceTaxNo;
        item.calculation = this.defaultTenderParam.calculation;
      });
    }
    
    this.modalIsVisible = true;
  }

  /**
   * 预招标单发布
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
    }
    if(invalid) return;

    this.form.value.bidTimeStart = Utils.format(this.form.value.bidTimeStart, 'm');
    this.form.value.bidTimeEnd = Utils.format(this.form.value.bidTimeEnd, 'm');
    
    if(this.publishType === 1){
      if(this.selectedData.some(item => !item.settleType || !item.markedPriceTaxNo || !item.calculation)){
        this.nzMess.error('提示信息', '分别发布每条记录的是否含税、最高限价、计价方式都必填');
        return;
      }
    }
    
    const param = this.getInsertParam();
    this.insertLoading = true;
    this.http.post(SEA_URLS.insertPretender, param).then((res: any) => {
      if (res.success) {
        this.modalIsVisible = false;
        this.nzMess.create('success', '提示信息', "预招标单发布成功!");
        this.initalSearch();
      }
      this.insertLoading = false;
    });
  }

  /**
   * 拼接参数
   */
  getInsertParam(): any {
    const param = { pretenderModelList: null};
    // 捆绑发布
    if(this.publishType === 2){
      param.pretenderModelList = [this.getbindData()];
    } else {
      // 分别发布
      param.pretenderModelList = this.selectedData.map(item => this.getSeparateData(item));
    }
    return param;
  }

  /**
   * 获取捆绑发布数据
   */
  getbindData(): any{
    const bindPallets = this.selectedData;
    const palletNos = bindPallets.map(item => item.palletNo).join(",");
    const settleType = this.publishType === 2 ? this.form.value.settleType : bindPallets[0].settleType;
    const pretender = {
      bindNo: bindPallets.length,
      palletNos: palletNos,
      offerPriceType: 'BJLX20',
      issueType: 'FBFS20',
      bidder: 'CJRS20',
      totWeight: bindPallets.map(item => Number(item.totWeight)).reduce((acc, cur) => acc + cur, 0),
      totSheet: bindPallets.map(item => Number(item.totSheet)).reduce((acc, cur) => acc + cur, 0),
      productName: Utils.distinct(bindPallets.map(item => item.productName ? item.productName.split(",") : '').reduce((acc, cur) => acc.concat(cur ? cur : []), [])).join(","),
      flowDesc: Utils.distinct(bindPallets.map(item => Utils.getFlowDesc(item))).join(";"),
      containerDesc: Utils.getPalletContainerDesc(bindPallets),
      transType: bindPallets[0].transType,
      consignorCompanyId: bindPallets[0].consignorCompanyId,
      companyId: bindPallets[0].companyId,
      settleType: settleType,
      markedPriceTax: settleType == 'JSFS10' ? (this.publishType === 2 ? this.form.value.markedPriceTaxNo : bindPallets[0].markedPriceTaxNo) : null,
      markedPriceTaxNo: settleType == 'JSFS20' ? (this.publishType === 2 ? this.form.value.markedPriceTaxNo : bindPallets[0].markedPriceTaxNo) : null,
      calculation: bindPallets[0].calculation,
    }
    return {...this.form.value, ...pretender};
  }

  /**
   * 获取分别发布数据
   * @param pallet 
   */
  getSeparateData(pallet: any){
    const pretender = {
      bindNo: 1,
      palletNos: pallet.palletNo,
      offerPriceType: 'BJLX20',
      issueType: 'FBFS10',
      bidder: 'CJRS20',
      totWeight: pallet.totWeight,
      totSheet: pallet.totSheet,
      productName: pallet.productName,
      flowDesc: Utils.getFlowDesc(pallet),
      containerDesc: pallet.containerDesc,
      transType: pallet.transType,
      consignorCompanyId: pallet.consignorCompanyId,
      companyId: pallet.companyId,
      settleType: pallet.settleType,
      markedPriceTax: pallet.settleType == 'JSFS10' ? pallet.markedPriceTaxNo : null,
      markedPriceTaxNo: pallet.settleType == 'JSFS20' ? pallet.markedPriceTaxNo : null,
      calculation: pallet.calculation,
    }
    return {...this.form.value, ...pretender};
  }

  /**
   * 投标开始时间限制
   */
  disabledStartDate = (current: Date): boolean => {
    return Utils.beforeNowDate(current, this.form.value.bidTimeEnd); 
  }

  /**
   * 结束时间限制
   */
  disabledEndDate = (current: Date): boolean => {
    return Utils.beforeNowDate(current) || Utils.beforeDate(current, this.form.value.bidTimeStart); 
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

}
