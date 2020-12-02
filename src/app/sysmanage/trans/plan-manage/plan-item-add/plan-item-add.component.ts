import { Component, OnInit, Input } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { TRANS_URLS, SYS_URLS } from '../../../../common/model/trans-urls';
import { SelectService } from '../../../../components/simple-page/simple-page-form.module';
import { isMobile } from '../../../../common/validators/validator';

@Component({
  selector: 'app-plan-item-add',
  templateUrl: './plan-item-add.component.html',
  styleUrls: ['./plan-item-add.component.css']
})
export class PlanItemAddComponent implements OnInit {

  @Input() planFlowId: string;
  @Input() operateType: string;

  formId = 'plan_manage';

  plan: any = {};
  driver: any = {};

  // 调度相关信息
  orderData: Array<any> = [];
  itemData: Array<any> = [];
  packData: Array<any> = [];

  loading: boolean = false;
  pageSize: number = 30;
  total: number = 0;
  selectedOrderData: Array<any> = [];

  driverDataSource: Array<any> = [];
  dirverFieldKey = { text: 'name', value: 'userId' };
  
  constructor(private http: HttpUtilService,
    public router: Router,
    private msg: NzMessageService,
    private selectService: SelectService) { }

  ngOnInit() {

    this.planFlowId = this.planFlowId || '10';
    this.operateType = this.operateType || 'add';

    console.dir(this);
    this.query({});

    // 加载司机工号下拉数据源
    this.selectService.getValue(SYS_URLS.SELECT_DRIVER, {}).then((res: any) => {
      if (res.success) {
        this.driverDataSource = res.data.data.data;
      }
    });
  }

  /**
   * 查询委托
   * @param pageParam 
   */
  query(pageParam?: any){
    this.loading = true;
    pageParam.page = pageParam.page || 1;
    pageParam.length = pageParam.length || this.pageSize;
    pageParam.planFlowId = this.planFlowId;
    this.http.post(TRANS_URLS.SELECT_ORDER, {...pageParam}).then((res: any) => {
      if (res.success) {
        this.orderData = res.data.data && res.data.data.data;
        this.total = res.data.data && res.data.data.total;
        this.itemData = [];
        this.packData = [];
      } 
      this.loading = false;
    });
  }

  /**
   * 按钮区按钮点击事件统一处理
   * @param button 
   */
  btnClick(button: any){
    switch(button.buttonId){
      case "createPlan": this.createPlan(); break;
      case "forceFinish": this.forceFinish(); break;
      case "cancelPlan": this.cancelPlan(); break;
      default: this.msg.error("按钮未绑定方法");
    }
  }

  /**
   * 生成调度
   */
  createPlan(){
    if(!this.selectedOrderData || this.selectedOrderData.length === 0){
      this.msg.error("请至少选择选择一条调度记录！");
      return;
    }

    if(!this.validateDriver() || !this.validateItem()){
      return false;
    }

    const packData = this.packData.filter(item => item.checked && (item.planWeight > 0 || item.planQuantity > 0));
    const planItemData = this.createItem(packData);

    this.plan.flowId = this.planFlowId;
    this.plan.tPlanItems = planItemData;
    
    this.setPlanInfo(packData);

    this.plan.tPlanDriver = this.driver;

    this.http.post(TRANS_URLS.INSERT_PLAN, this.plan).then(
      (res: any) => {
        if (res.success) {
          this.msg.success(`生成调度成功！`);
          this.query({});
        }
      }
    );

  }

  /**
   * 根据捆包信息生成调度子项
   * @param packData 
   */
  createItem(packData: Array<any>): Array<any> {
    return packData.map(item => {
      return {
        orderNo: item.orderNo,
        orderItemNo: item.orderItemNo,
        orderPackNo: item.orderPackNo,
        flowSeqNo: item.flowSeqNo,
        planWeight: item.planWeight,
        planQuantity: item.planQuantity,
        startPoint: item.startPoint,
        endPoint: item.endPoint,
        startLocationName: item.startLocationName,
        endLocationName: item.endLocationName,
      };
    });
  }

  /**
   * 获取选中捆包生成的调度明细
   */
  checkOk(): Array<any>{
    if(!this.validateItem()){
      return [];
    }

    return this.createItem(this.packData.filter(item => item.checked && (item.planWeight > 0 || item.planQuantity > 0)));
  }

  /**
   * 根据选中的捆包信息刷新流向、总重量、总件数
   * @param packData 
   */
  setPlanInfo(packData: Array<any>): any{
    this.plan.planWeight = packData.map(item => Number(item.planWeight)).reduce((acc, cur) => acc += cur, 0);
    this.plan.planQuantity = packData.map(item => Number(item.planQuantity)).reduce((acc, cur) => acc += cur, 0);

    const unique = ['startLocationName', 'endLocationName'];
    let hash = {};
    const flowData = packData.filter(item => item.checked && (item.planWeight > 0 || item.planQuantity > 0)).reduceRight((item, next) => {
      const key = unique.map(u => next[u]).join("#");
      hash[key] ? '' : hash[key] = true && item.push(next);
      return item
    }, []);

    this.plan.flowDesc = flowData.map(item => `${item.startPoint}→${item.endPoint}`).join(";");

    return {planWeight: this.plan.planWeight, planQuantity: this.plan.planQuantity, flowDesc: this.plan.flowDesc};
  }

  /**
   *  调度明细校验
   */
  validateItem(packData?: Array<any>): boolean{
    packData = packData ? packData : this.packData;
    const validateArray = [
      { ename: 'planWeight', cname: '调度量', validator: 'number' },
      { ename: 'planQuantity', cname: '调度数量', validator: 'number' },
    ];
    
    packData.forEach(item => {
      item.planWeight = item.planWeight ? item.planWeight : 0;
      item.planQuantity = item.planQuantity ? item.planQuantity : 0;
    });
    const data = packData.filter(item => item.checked && (item.planWeight > 0 || item.planQuantity > 0));
    if(data.length == 0){
      this.msg.error(`调度明细信息不能为空！`);
      return false;
    }
    let msg = validateArray.filter(item => item.validator && data.some(pack => isNaN(pack[item.ename]))).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`调度明细信息"${msg}"字段必须为数字！`);
      return false;
    }

    const unique = ['orderNo', 'flowSeqNo'];
    let hash = {};
    const distinctData = data.reduceRight((item, next) => {
      const key = unique.map(u => next[u]).join("#");
      hash[key] ? '' : hash[key] = true && item.push(next);
      return item
    }, []);

    msg = distinctData.filter(item => distinctData.filter(item2 => item.orderNo === item2.orderNo).length > 1)
      .map(item => item.orderNo).reduceRight((item, next) => {
        hash[item.orderNo] ? '' : hash[item.orderNo] = true && item.push(next);
        return item;
      }, []).join(",");

    if (msg) {
      this.msg.error(`不能同时调度同一委托单下多段流向数据！委托单号："${msg}"`);
      return false;
    }

    return true;
  }

  /**
   * 司机校验
   */
  validateDriver(driver?: any): boolean{
    driver = driver ? driver : this.driver;
    const validateArray = [
      { ename: 'driverId', cname: '驾驶员' },
    ];
    const msg = validateArray.filter(item => !driver[item.ename]).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`调度信息"${msg}"字段不能为空！`);
      return false;
    }

    if(!isMobile(driver.mobile)){
      this.msg.error(`请正确输入司机联系电话`);
      return false;
    }

    return true;
  }

  /**
   * 强制完成
   */
  forceFinish(){
    if(!this.selectedOrderData || this.selectedOrderData.length === 0){
      this.msg.error("请选择至少选择一条调度记录！");
      return;
    }
    // let invalidate = this.selectedOrderData.filter((item, index) => {
    //   item.rowIndex = index+1;
    //   return item.settleFlag === 'FYDJ20';
    // });
    // if(invalidate.length > 0){
    //   this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join("、")}条调度已登记运费不能作废`);
    //   return;
    // }

    // invalidate = this.selectedOrderData.filter((item, index) => {
    //   item.rowIndex = index+1;
    //   return item.priceFlag === 'HJBJ20';
    // });
    // if(invalidate.length > 0){
    //   this.msg.error(`所选第${invalidate.map(item => item.rowIndex).join("、")}条调度运费已核价不能作废`);
    //   return;
    // }

    this.http.post(TRANS_URLS.DELETE_ORDER, {tOrders: this.selectedOrderData}).then(
      (res: any) => {
        if (res.success) {
          this.msg.success(`作废成功！作废调度${this.selectedOrderData.length}条`);
          this.selectedOrderData = [];
          this.query({});
          // this.driverData = res.data.data;
        }
      }
    );

  }

  /**
   * 撤销调度
   */
  cancelPlan(){
    if(!this.selectedOrderData || this.selectedOrderData.length === 0){
      this.msg.error("请至少选择选择一条调度记录！");
    }
  }

  /**
   * 行点击事件
   * @param data 
   */
  rowCilcked(data: any){
    data.checked = !data.checked;
    this.selectedOrder(this.orderData.filter(item => item.checked));
  }

  totalWeight: number = 0;
  totalSheet: number = 0;

  /**
   * 选中数据
   * @param data 
   */
  selectedOrder(data: any){
    this.selectedOrderData = data;
    this.totalWeight = this.selectedOrderData.map(item => item.totalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    this.totalSheet = this.selectedOrderData.map(item => item.totalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0);

    if(this.selectedOrderData.length === 0){
      this.itemData = [];
      this.packData = [];
    }else{
      this.queryItem();
      this.queryPack();
    }
  }

  /**
   * grid中输入框失去焦点事件
   * @param data 
   */
  modelChange(data: any){
    if(isNaN(data.val)){
      data.data[data.header.colEname] = 0;
    }

    const packData = this.packData.filter(item => item.checked);

    this.plan.planWeight = packData.map(item => Number(item.planWeight)).reduce((acc, cur) => acc += cur, 0);
    this.plan.planQuantity = packData.map(item => Number(item.planQuantity)).reduce((acc, cur) => acc += cur, 0);
  }

  /**
   * 委托明细行点击事件
   */
  itemRowClicked(data: any){
    data.checked = !data.checked;
    this.packData.forEach(pack => pack.checked = this.itemData.findIndex(item => item.checked && pack.orderItemNo == item.orderItemNo) > -1);

    this.setPlanInfo(this.packData.filter(item => item.checked));
  }

  /**
   * 委托明细选中数据
   */
  selectedItem(data: any){
    this.packData.forEach(pack => pack.checked = this.itemData.findIndex(item => item.checked && pack.orderItemNo == item.orderItemNo) > -1);

    this.setPlanInfo(this.packData.filter(item => item.checked));
  }

  /**
   * 委托捆包行点击事件
   */
  packRowClicked(data: any){
    data.checked = !data.checked;
    if(data.checked){
      data.planWeight = data.surplusWeight;
      data.planQuantity = data.surplusSheet;
    }else{
      data.planWeight = 0;
      data.planQuantity = 0;
    }
    console.dir(data)
    this.setPlanInfo(this.packData.filter(item => item.checked));
  }

  /**
   * 委托捆包选中数据
   */
  selectedPack(data: any){
    this.packData.forEach(pack => {
      if(data.findIndex(item => item.orderPackNo == pack.orderPackNo && item.flowSeqNo == pack.flowSeqNo) > -1){
        pack.planWeight = pack.surplusWeight;
        pack.planQuantity = pack.surplusSheet;
      }else{
        pack.planWeight = 0;
        pack.planQuantity = 0;
      }
    });
    this.setPlanInfo(this.packData.filter(item => item.checked));
  }


  /**
   * 根据调度查询调度明细信息
   */
  queryItem() {
    this.http.post(TRANS_URLS.SELECT_ORDERITEM_BY_ORDER, { tOrders: this.selectedOrderData }).then(
      (res: any) => {
        if (res.success) {
          this.itemData = res.data.data;
          this.itemData.forEach(item => item.checked = true);
        }
      }
    );
  }

  /**
   * 根据调度查询调度捆包信息
   */
  queryPack() {
    this.http.post(TRANS_URLS.SELECT_PLANORDERITEM_BY_ORDER,  { tOrders: this.selectedOrderData, planFlowId: this.planFlowId }).then(
      (res: any) => {
        if (res.success) {
          this.packData = res.data.data;
          this.packData.forEach(item => {
            item.checked = true;
            item.planWeight = item.surplusWeight;
            item.planQuantity = item.surplusSheet;
          });

          this.setPlanInfo(this.packData);
        }
      }
    );
  }

  /**
   * 根据选择工号带回的userId查找用户相关信息，并设置到driver中
   * @param userId 
   */
  setDriverInfo(userId: string) {
    if (userId) {
      const user = this.driverDataSource.filter(item => item.userId === userId)[0];
      this.driver.driverId = userId;
      this.driver.vehicleNo = user.vehicleNo;
      this.driver.mobile = user.mobile;
    }
  }

}


