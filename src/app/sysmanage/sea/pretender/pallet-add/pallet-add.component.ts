import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { ActivatedRoute, Router, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { SEA_URLS } from '../../../../common/model/sea-urls';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodesetService } from '../../common/codeset.service';
import { UploadFiles } from '../../../../common/services/upload-files';
import { Utils } from '../../common/utils';
import { Observable } from 'rxjs';
import { SimpleCacheService } from '../../../../common/services/simple-cache.service';

@Component({
  selector: 'app-pallet-add',
  templateUrl: './pallet-add.component.html',
  styleUrls: ['./pallet-add.component.css']
})
export class PalletAddComponent implements OnInit {
  pallet: Array<any> = [];
  palletItem: Array<any> = [];

  selectedPallet: any;

  form: FormGroup;
  orderForm: FormGroup;

  companyType: string;
  ownerCompany: Array<any> = [];
  bizScope: Array<any> = [];
  shipSociety: Array<any> = [];
  shipmentTerm: Array<any> = [];
  settleNode: Array<any> = [];
  demurrageFeeType: Array<any> = [];
  demurrageFeePoing: Array<any> = [];
  calculation: Array<any> = [];
  settleType: Array<any> = [];

  allHarbor: Array<any> = []; // 全部港口
  startHarbor: Array<any> = []; // 装货港口
  endHarborShow: Array<any> = []; // 卸货港口
  startHarborShow: Array<any> = []; // 装货港口

  startPier: Array<any> = []; //码头列表(装货)
  endPier: Array<any> = []; //码头列表（卸货）
  startPierShow: Array<any> = []; //码头列表(装货)
  endPierShow: Array<any> = []; //码头列表（卸货）

  modalIsVisible: boolean; //定向下单弹框是否显示
  carriers: Array<any> = [];  // 委托单位（货主）关联承运商
  directOrderUrl: string = SEA_URLS.directOrder;

  operateType: string;
  loading: boolean = false;
  isDisableForm: boolean = true;
  editing: boolean = false;
  orderForm_calculation = '';
  orderForm_settleType = '';
  @Input() palletNo: string;

  constructor(private nzMess: NzNotificationService,
    private fb: FormBuilder,
    private http: HttpUtilService,
    private route: ActivatedRoute,
    private router: Router,
    private appInfo: UserinfoService,
    public upload: UploadFiles,
    private codeset: CodesetService,
    private simpleCache: SimpleCacheService, ) {

    // if (this.route.snapshot.routeConfig && this.route.snapshot.routeConfig.path === 'pretenderPalletAdd') {
    //   this.isDisableForm = false;
    //   initValue = null;
    // }

    this.orderForm = this.fb.group({
      carrierCompanyId: [null, [Validators.required]],
      carrierCompanyName: [null, [Validators.required]],
      transPrice: [null, [Validators.required]],
      settleType: [null, [Validators.required]],
      taxRate: [null, []],
      calculation: [null, [Validators.required]],
      boatName: [null, []],
      capacity: [null, []],
    });
    // this.simpleCache.clearLocal(this.getConsignorCacheKey())
  }


  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      this.operateType = data.operateType;
      if (this.operateType && data.palletNo) {
        this.getPallet(data.palletNo);
      }
    });

    this.palletNo && this.getPallet(this.palletNo);
    this.createForm();

    // 默认
    !this.isDisableForm && this.addPalletItem();

    //设置表单初始值
    this.initForm();

    // 查询港口信息
    this.getHarbor();
    // 获取小代码信息
    this.getCodeset();
    // 查询货主单位（委托单位）
    this.getOwner();

    //this.simpleCache.isEditNeedReminder = true;
    //this.simpleCache.editNeedReminderMsg = '是否保存？';
  }

  palletCompany: any;
  /**
   * 设置表单初始值
   */
  initForm() {
    if (this.bizScope && this.bizScope.length > 0) {
      this.form.patchValue({ transType: this.bizScope[0].value });
    }
    // 设置委托单位，平台公司
    const userCompanyId = this.appInfo.APPINFO.USER.companyId;
    if (!this.palletCompany) {
      this.getPlateByCompany({ companyId: userCompanyId });
    } else {
      this.form.patchValue(this.palletCompany);
    }

    this.companyType = this.appInfo.APPINFO.USER.seaCompanyType;
    if (this.companyType === '20') {
      this.form.patchValue({ consignorCompanyId: userCompanyId });
    }

    if (this.companyType === '10') {
      const usedConsignor = this.simpleCache.getLocal(this.getConsignorCacheKey()) || {};
      if(usedConsignor.timeout && usedConsignor.timeout >= new Date().getTime()){
        this.form.patchValue({ consignorCompanyId: usedConsignor.consignorCompanyId });
      }
    }
    this.getUsedHarbor();
  }

  /**
   * 获取平台用户最近一次使用委托单位缓存key
   */
  getConsignorCacheKey() {
    return `PALLET_CONSIGNOR_${this.appInfo.APPINFO.USER.userId}`;
  }


  /**
   * 创建form
   */
  createForm() {
    let initValue = { value: null, disabled: this.isDisableForm };
    if (!this.palletNo) {
      this.isDisableForm = false;
      initValue = null;
    }
    this.form = this.fb.group({
      consignorCompanyId: [initValue, [Validators.required]],
      companyName: [initValue, [Validators.required]],
      companyId: [initValue, [Validators.required]],
      transType: [initValue, [Validators.required]],
      startPoint: [initValue, [Validators.required]],
      startAddress: [initValue, []],
      endPoint: [initValue, [Validators.required]],
      endAddress: [initValue, []],
      loadDateStart: [initValue, [Validators.required]],
      loadDateEnd: [initValue, [Validators.required]],
      shipSociety: [initValue, [Validators.required]],
      targetDate: [initValue, []],
      settleNode: [initValue, []],
      loadDays: [initValue, []],
      shipAge: [initValue, [Validators.required]],
      shipmentTerm: [initValue, [Validators.required]],
      demurrageFee: [initValue, []],
      demurrageFeeType: [initValue, []],
      demurrageFeePoing: [initValue, []],
      docUrls: [null, []],
      remark: [initValue, []],
    });
  }

  /**
   * 获取小代码信息
   */
  getCodeset() {
    this.codeset.reFetchSeaUserInfo().then(() => {
      this.bizScope = this.codeset.getItems('bizScope', this.appInfo.APPINFO.USER.seaUserBizScope);
      if (!this.bizScope || this.bizScope.length == 0) {
        this.nzMess.create('error', '提示信息', '当前用户业务范围未指定');
      } else {
        this.form.patchValue({ transType: this.bizScope[0].value });
      }
    });

    this.shipSociety = this.codeset.get('shipSociety');
    this.shipmentTerm = this.codeset.get('shipmentTerm');
    this.settleNode = this.codeset.get('settleNode');
    this.demurrageFeeType = this.codeset.get('demurrageFeeType');
    this.demurrageFeePoing = this.codeset.get('demurrageFeePoing');
    this.calculation = this.codeset.get('calculation');
    this.settleType = this.codeset.get('settleType');
  }


  /**
   * 根据货盘号查询货盘信息
   * @param palletNo 
   */
  getPallet(palletNo: string) {
    const pallets = palletNo.split(",").map(palletNo => { return { palletNo: palletNo } });
    this.http.post(SEA_URLS.getPallets, { palletModelList: pallets }).then((res: any) => {
      if (res.success) {
        this.pallet = res.data.data;
        this.palletItem = this.pallet[0].palletItemModelList;
        this.setPalletDisabled(this.palletItem);
        this.form.patchValue(this.pallet[0]);
        this.selectedPallet = this.pallet[0];
        // this.docUrlsList = this.upload.getFileList(this.selectedPallet.docUrls);
      }
    });
  }

  /**
   * 查询所有货主公司
   */
  getOwner() {
    this.http.post(SEA_URLS.getSeaCompanyAll, { status: 10, companyType: 20 }).then((res: any) => {
      if (res.success) {
        this.ownerCompany = res.data.data;
      }
    });
  }

  /**
   * 新增
   */
  add() {
    this.form.reset();
    this.palletItem = [];

    this.addPalletItem();
    this.initForm();
  }

  /**
   * 保存
   */
  save(directOrderUrl?: string): void {
    if (directOrderUrl) {
      if (!this.validOrder()) return;
    } else {
      if (!this.validPallet()) return;
    }

    const extInfo = this.handlePalletData();

    // 操作类型存在并且是update开头或者操作类型不存在并且货盘号存在，则修改
    const isUpdate = (this.operateType && this.operateType.startsWith('update')) || (!this.operateType && this.selectedPallet && this.selectedPallet.palletNo);
    let url = directOrderUrl ? directOrderUrl : (isUpdate ? SEA_URLS.updatePallet : SEA_URLS.insertPallet);
    // 不是修改则将货盘号清空
    if (!isUpdate && this.selectedPallet) {
      this.selectedPallet.palletNo = null;
    }

    this.loading = true;
    this.http.post(url, { ...this.selectedPallet, ...this.form.value, ...this.orderForm.value, ...extInfo, palletItemModelList: this.palletItem }).then((res: any) => {
      if (res.success) {
        this.palletItem = res.data.data.palletItemModelList;
        if (directOrderUrl) {
          this.modalIsVisible = false;
          this.nzMess.create('success', '提示信息', '定向下单成功！')
        } else {
          isUpdate ? this.nzMess.create('success', '提示信息', '修改成功！') : this.nzMess.create('success', '提示信息', '保存成功！');
        }
        if (isUpdate) {
          this.pallet.forEach(item => item.palletNo === this.selectedPallet.palletNo && (Object.assign(item, res.data.data)));
        } else {
          this.pallet = [...this.pallet, res.data.data];
          this.form.patchValue({ palletNo: res.data.data.palletNo });
        }

        this.form.markAsPristine();
        // 保存成功根据操作类型跳回指定界面
        this.cancel(directOrderUrl);

        const usedConsignor = { consignorCompanyId: this.form.value.consignorCompanyId, timeout: new Date().getTime() + 12 * 60 * 60 * 1000 }
        this.simpleCache.setLocal(this.getConsignorCacheKey(), JSON.stringify(usedConsignor));
      }
      setTimeout(() => this.loading = false, 100);
    });
  }


  /**
   * 货盘信息验证
   */
  validPallet(): boolean {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
      // console.log(`${i}:${this.form.controls[i].invalid}`)
    }
    if (this.form.invalid) return false;

    if (!this.palletItem || this.palletItem.length === 0) {
      this.nzMess.error("提示信息", "货盘明细不能为空");
      return false;
    }
    if (this.palletItem.some(item => !item.productName)) {
      this.nzMess.error("提示信息", "货盘明细的品名不能为空");
      return false;
    }
    if (this.palletItem.some(item => item.containerType && item.containerNo && isNaN(item.containerNo))) {
      this.nzMess.error("提示信息", "货盘明细的集装箱数量必须为数字");
      return false;
    }

    return true;
  }

  /**
   * 订单信息验证
   */
  validOrder(): boolean {
    for (const i in this.orderForm.controls) {
      this.orderForm.controls[i].markAsDirty();
      this.orderForm.controls[i].updateValueAndValidity();
    }
    if (this.orderForm.value.settleType == 'JSFS10' && !this.orderForm.value.taxRate && isNaN(this.orderForm.value.taxRate)) {
      this.nzMess.error("提示信息", "请输入税率！且必须为数字。");
      return false;
    }
    if (this.orderForm.invalid) return false;
    return true;
  }

  /**
   * 货盘数据处理
   */
  handlePalletData(): any {
    // 日期格式化
    this.form.value.loadDateEnd = Utils.format(this.form.value.loadDateEnd);
    this.form.value.loadDateStart = Utils.format(this.form.value.loadDateStart);
    this.form.value.targetDate = Utils.format(this.form.value.targetDate);
    // 明细数据汇总数据到货盘表
    return {
      totWeight: this.palletItem.map(item => Number(item.goodsWeight)).reduce((acc, cur) => acc + cur, 0),
      totSheet: this.palletItem.map(item => Number(item.goodsNo)).reduce((acc, cur) => acc + cur, 0),
      productName: Utils.distinct(this.palletItem.map(item => item.productName)).join(","),
      containerDesc: Utils.getContainerDesc(this.palletItem),
      consignorCompanyName: this.ownerCompany.find(item => item.companyId === this.form.value.consignorCompanyId).companyName,
      flowDesc: Utils.getFlowDesc(this.form.value),
    }
  }

  /**
   * 定向下单
   */
  directOrder(): void {
    this.validPallet() && (this.modalIsVisible = true);
    if (!this.modalIsVisible) return;
    this.orderForm.reset();
    if (this.form.value.transType === '10') {
      this.orderForm_calculation = 'JJJS20';
      this.orderForm_settleType = 'JSFS20';
    } else {
      this.orderForm_calculation = 'JJJS10';
    }
    this.http.post(SEA_URLS.getOwnerCarrierAll, { ownerCompanyId: this.form.value.consignorCompanyId }).then(res => {
      if (res.success) {
        this.carriers = res.data.data;
      }
    });
  }

  /**
   * 设置运输公司中文名称
   * @param carrierCompanyId 
   */
  setTransCompanyName(carrierCompanyId: string) {
    if (!carrierCompanyId) {
      this.orderForm.patchValue({ carrierCompanyName: null });
    } else {
      this.orderForm.patchValue({ carrierCompanyName: this.carriers.find(item => item.carrierCompanyId === carrierCompanyId).carrierCompanyName });
    }
  }

  /**
   * 返回预招标或者竞价发布发布界面
   */
  cancel(directOrderUrl?: string) {
    // if(directOrderUrl){
    //   this.router.navigate(['system/sea/order/order']);
    // }s
    this.operateType && (this.operateType.endsWith('pretender') ? this.router.navigate(['system/sea/pretender/pretenderPublish']) : this.router.navigate(['system/sea/entrust/publishEntrust']));//发布修改和复制成功后返回页面
  }

  /**
   * 货盘列表点击事件
   * @param data 
   */
  palletClick(data: any) {
    this.palletItem = data.palletItemModelList;
    this.setPalletDisabled(this.palletItem);
    this.form.patchValue(data);
    this.selectedPallet = data;
    // this.packAdd(this.palletItem);
  }

  /**
   * 货盘明细列配置信息
   * @param data 
   */
  palletItemColums(data: any) {
    const palletItemColums = Array.isArray(data) ? data : [];
    palletItemColums.forEach(item => item.colEname === 'productName' && (item.required = true));
  }

  /**
   * 添加货盘明细
   */
  addPalletItem() {
    this.palletItem = [{}, ...this.palletItem];
  }

  /**
   * 删除货盘明细
   */
  deletePalletItem() {
    this.palletItem = this.palletItem.filter(item => !item.checked);
  }

  /**
   * 查询平台公司信息
   * @param param 
   */
  getPlateByCompany(param: any) {
    const user = this.appInfo.APPINFO.USER;
    if (user.companyType === 'GSLX10'){
      this.palletCompany = { companyName: user.companyName, companyId: user.companyId };
      this.form.patchValue(this.palletCompany);
      return;
    }
    this.http.post(SEA_URLS.getPlate, param).then(res => {
      if (res.success) {
        const plate = res.data.data;
        this.palletCompany = { companyName: plate.companyName, companyId: plate.plateCompanyId };
        this.form.patchValue(this.palletCompany);
      }
    })
  }


  /**
   * 获取港口信息
   */
  getHarbor() {
    this.http.post(SEA_URLS.getBasicHarborAll, { status: 10 }).then((res: any) => {
      if (res.success) {
        this.allHarbor = res.data.data;
        this.startHarbor = this.allHarbor.filter(item => item.type == '国内');

        this.startHarborShow = this.startHarbor;
        this.endHarborShow = this.allHarbor;

        this.getUsedHarbor();
      }
    });
  }

  /**
   * 获取最近港口使用信息
   */
  getUsedHarbor() {
    const consignorCompanyId = this.form.value.consignorCompanyId;
    if (!consignorCompanyId) {
      this.startHarborShow = this.startHarbor;
      this.endHarborShow = this.allHarbor;
      return;
    }
    this.http.post(SEA_URLS.getUsedHarbor, { consignorCompanyId: consignorCompanyId }).then((res: any) => {
      if (res.success) {
        this.startHarborShow = this.changeHarborIndex(this.startHarbor, res.data.data.startHarbor);
        this.endHarborShow = this.changeHarborIndex(this.allHarbor, res.data.data.endHarbor);
      }
    });
  }

  /**
   * 调整港口显示顺序
   * @param harborArr 
   * @param usedHarbor 
   */
  changeHarborIndex(harborArr: Array<any>, usedHarbor: string): Array<any> {
    if (!usedHarbor) {
      return harborArr;
    }
    const usedHarborArr = usedHarbor.split(",").map(item => { return { harborName: item, used: true } });
    const unusedHarborArr = harborArr.filter(item => !usedHarborArr.some(used => item.harborName === used.harborName));
    unusedHarborArr.forEach(item => item.used = false);
    return [...usedHarborArr, ...unusedHarborArr];
  }

  /**
   * 查询码头
   * @param harborName 
   * @param type 
   */
  getAddress(harborName: any, type: number) {
    if (harborName) {
      this.http.post(SEA_URLS.getPierAll, { harborName: harborName }).then((res: any) => {
        if (res.success) {
          if (type === 1) {
            this.startPier = res.data.data;
            this.startPierShow = this.startPier;
          } else if (type === 2) {
            this.endPier = res.data.data;
            this.endPierShow = this.endPier;
          }
        }
      })
    }
  }

  /**
   * 码头过滤
   * @param value 
   * @param type 
   */
  filterPier(value: string, type: number) {
    if (type === 1) {
      this.startPierShow = value ? this.startPier.filter(item => item.pierName.indexOf(value) > -1) : this.startPier;
    } else if (type === 2) {
      this.endPierShow = value ? this.endPier.filter(item => item.pierName.indexOf(value) > -1) : this.endPier;
    }
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


  docUrlsList = [];
  /**
   * 附件处理方法
   * @param info 
   * @param name 
   */
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

  /**
   * 设置货盘明细不可编辑
   * @param palletItem 
   */
  setPalletDisabled(palletItem: Array<any>) {
    const columnDisabled = {
      productName: true,
      specDesc: true,
      goodsWeight: true,
      goodsNo: true,
      containerType: true,
      containerNo: true,
      remark: true,
    };
    if (this.isDisableForm) {
      palletItem.forEach(item => item.inputDisabled = columnDisabled);
    }
  }
}


export class CanPalletAddDeactivate implements CanDeactivate<PalletAddComponent>{
  canDeactivate(component: PalletAddComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (component.form.pristine) {
      return true;
    }

    return confirm('<新增货盘>页面数据已修改，尚未保存，请确认是否离开?');
  }

}