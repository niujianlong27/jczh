import {Component, DoCheck, OnInit} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {TRANS_URLS, SYS_URLS} from '../../../../common/model/trans-urls';
import {format as dateformat} from 'date-fns';
import {contractUrl} from '../../../../common/model/contractUrl';
import {urls} from '../../../../common/model/url';
import {toDemical} from '../../../../common/validators/validator';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';



/**
 * Title: order-add.component.ts
 * Description:
 * Created:
 * Modified: pengzitong 2019/2/22
 */
@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css']
})
export class OrderAddComponent implements OnInit {
  checked: boolean = false;
  formId: string = 'order_registration';

  order: any = {
    contractDate: new Date(),
    flowId: '10',
    carrierCompanyName: this.info.APPINFO.USER.companyName,
    carrierCompanyId: this.info.APPINFO.USER.companyId
  };

  initRowData = {newRow: true, checked: true};

  orderData: Array<any> = [];
  itemData: Array<any> = [];
  packData: Array<any> = [];
  businessNature: Array<any> = [];
  businessNature1: any;
  saveLoading: boolean = false;
  performancePlace:any;

  // 生成捆包、明细条件
  fields: Array<any> = ['productName', 'specDesc']; // 品名、规格

  flowApi = {
    url: SYS_URLS.SELECT_COMPANY_FLOW,
    fieldKey: {text: 'flowName', value: 'flowId'},
  }


  popTableData: Array<any> = [];

  operateType: string = 'add';

  // btnHidden:any = {  //初始不显示返回按钮
  //   cancel:true
  // };

  isVisible: boolean = false;
  modalPageSize: any = 30;
  modalListLoading: boolean = false;
  modalDataSet: any = [];
  modalTotalPages: any = 0;
  modalUpdateData: any = [];
  modalBtnDis: any = {};
  modalTempSearchParam: any = {};
  //selectedLength: any = 0;
  transSettleCompany:any;
  transSettleCompanyName:any

  leftGridHidden:boolean = false;
  bankObj:any = {companyBank:'',companyBankNo:'',settleBank:'',settleBankNo:''};
  constructor(private http: HttpUtilService,
              private msg: NzMessageService,
              private route: ActivatedRoute,
              private router: Router,
              private nz: NzNotificationService,
              private info: UserinfoService,

  ) {

  }

  /**
   * 初始化
   */
  ngOnInit() {

    // 如果是修改，根据委托号加载该委托数据
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams.operateType) {
        if (queryParams.operateType === 'update' || queryParams.operateType === 'view') {
          this.operateType = queryParams.operateType;
          this.http.post(urls.getSettleCompany ,{companyId:this.order.carrierCompanyId}).then((res:any)=>{
              if(res.success){
                this.performancePlace = res.data.data.performancePlace;
              }
            }
          )
          // this.btnHidden = {  //修改时显示返回按钮
          //   cancel:true
          // };
          this.loadData(queryParams.orderNo);
        }
      }else{
        this.http.post(urls.getSettleCompany ,{companyId:this.info.APPINFO.USER.companyId}).then((res:any)=>{
          if(res.success){
            this.transSettleCompanyName=res.data.data.settleCompanyName;
            this.transSettleCompany=res.data.data.settleCompanyId;
            this.order.transSettleCompanyName = res.data.data.settleCompanyName;
            this.performancePlace = res.data.data.performancePlace;
            this.order.transSettleCompany = res.data.data.settleCompanyId;
            this.bankObj.settleBank = res.data.data.bank;
            this.bankObj.settleBankNo = res.data.data.bankAccount;
            this.order.bankId = res.data.data.bankId;

          }
          }
        )
        this.order.businessNature='YWXZ40';
      }
    });

    this.getStatic(this.businessNature, 'YWXZ');
  }

  /**
   * 按钮点击
   * @param data
   */
  //按钮
  btnClick(button: any) {
    switch (button.buttonId) {
      case "save":
          this.save();
        break;
      case "Use":
        this.useOrder();
        break;
      case "clearData":
        this.clearData();
        break;
      case "addBales":
        this.addNewItem();
        break;
      case "deleteBales":
        this.deleteItem();
        break;
      case "Return":
        this.cancel();
        break;
      case "deleteAll":
        this.deleteAllItem();
        break;

      default:
        this.msg.error("按钮未绑定方法");
    }
  }

  /**
   * 加载委托主表、委托明细表、捆包表数据
   * @param orderNo
   */
  loadData(orderNo: string) {
    if (!orderNo) {
      this.msg.error("系统错误！委托单号为空！");
    }
    this.query(orderNo, 'update'); // 查询委托信息
  }

  /**
   * 委托信息查询
   */
  query(orderNo: string, status?: any) {
    this.http.post(TRANS_URLS.GET_ORDER, {orderNo: orderNo}).then(
      (res: any) => {
        if (res.success) {
          this.order = res.data.data;
          this.order.isAllrateFlag = (this.order.isAllrate == '是');
          this.order.totalPrice && (this.order.totalPrice = toDemical(this.order.totalPrice, 2));
          if (status == 'update') {
            this.orderData = [this.order];
            this.bankObj.settleBank = res.data.data.bankname;
            this.bankObj.settleBankNo = res.data.data.bankAccount;
            this.bankObj.companyBank = res.data.data.cusbankname;
            this.bankObj.companyBankNo = res.data.data.cusaccount;
          }

          this.orderData.forEach((item, index) => item.rowIndex = index + 1);
          this.itemData = this.order.tOrderItemModels ? this.order.tOrderItemModels : [];
          this.packData = this.itemData.map(item => item.tOrderPackModels).reduce((acc, cur) => acc.concat(cur ? cur : []), []);
          let packIndex = 1;
          this.itemData.forEach((item, index) => {
            item.itemRowindex = index + 1;
            item.tOrderPackModels && item.tOrderPackModels.forEach(pack => {
              pack.itemRowindex = index + 1;
              pack.packRowindex = packIndex++;
            });

            this.popTableData = [];
            this.setPopTableData(item);
          });

        }
      });
  }

  /**
   * 设置pop选择相关信息
   * @param item
   */
  setPopTableData(item: any) {
    this.popTableData.push({
      startLocationName: {
        name: item.startLocationName,
        value: item.startPoint
      },
      endLocationName: {
        name: item.endLocationName,
        value: item.endPoint
      },
      consignerCompanyName: {
        name: item.consignerCompanyName,
        value: item.consignerCompanyId
      },
    });
  }

  /**
   * grid中pop选择确定事件
   * @param data
   */
  inpEmit(data: any) {
    this.itemData[data.index][data.eName] = data.inpName;
    this.popTableData[data.index][data.eName].name = data.inpName;
    this.popTableData[data.index][data.eName].value = data.inpValue;

    if (data.eName === 'consignerCompanyName') {
      this.itemData[data.index].consignerCompanyId = data.inpValue;
    } else if (data.eName === 'startLocationName') {
      this.itemData[data.index].startPoint = data.inpValue;
    } else if (data.eName === 'endLocationName') {
      this.itemData[data.index].endPoint = data.inpValue;
    }
  }

  /**
   * 行点击事件
   * @param data
   */
  rowCilcked(data: any) {

    // if(data.checked){
    //   data.checked = false;
    // }else{
    //   this.orderData.forEach(item => {
    //     if(item.rowIndex === data.rowIndex){
    //       item.checked = true;
    //       if(this.order.orderNo != item.orderNo){
    //         this.query(item.orderNo);
    //       }
    //     }else{
    //       item.checked = false;
    //     }
    //   });
    // }
    this.query(data.orderNo);
  }

  /**
   * 选中数据
   * @param data
   */
  selectedOrder(data: any) {
    if (data.length > 0 && this.order.orderNo != data[0].orderNo) {
      this.query(data[0].orderNo);
    }
  }


  /**
   * 新增（清空数据）
   */
  clearData() {
    this.order = {
      contractDate: new Date(),
      consignorCompanyName: '',
      carrierCompanyName: this.info.APPINFO.USER.companyName,
      carrierCompanyId: this.info.APPINFO.USER.companyId,
      flowId: '10',
      orderCompanyName: '',
      consigneeCompanyName: '',
      transSettleCompanyName: this.transSettleCompanyName,
      transSettleCompany:this.transSettleCompany,
      loadSettleCompanyIdName: '',
      detailAddressName: '',
      businessNature:'YWXZ40',
      customerBankId:''
    };
    this.itemData = [];
    this.packData = [];
  }

  /**
   * 保存按钮
   */
  save() {
    if (this.order.orderNo) {
      this.update();
    } else {
      this.insert();
    }
  }

  /**
   * 使用订单
   */
  useOrder() {
    this.isVisible = true;
    this.modalBtnDis = {
      patchPrice: true,
      use: true
    }
    this.modalListSearch({});
  }

  /**
   * 新增保存
   */
  insert() {
    this.saveLoading = true;
    // if(!this.validateOrder() || !this.validateItem() || !this.validatePack() || !this.validateData()){
    if (!this.validateOrder() || !this.validateItem()) {
      this.saveLoading = false;
      return;
    }
    this.handleData();
   for(let i:number=0;i<this.itemData.length;i++){
      if(this.itemData[i].receiveType=='JJFS10'){
        if(Number(this.itemData[i].transWeight)!=Number(this.itemData[i].totalWeight)){
          this.msg.error('运输重量和结算重量不相等，无法保存')
          return;
        }
      }
   }
    this.order.performancePlace = this.performancePlace;
    this.http.post(TRANS_URLS.INSERT_ORDER, this.order).then((res: any) => {
      this.saveLoading = false;
      if (res.success) {
      //  this.selectedLength = 0;
        this.msg.success('保存成功');
        Object.assign(this.order, res.data.data);
        this.orderData.forEach(item => item.checked = false);
        this.order.checked = true;
        this.order.tOrderItemModels && this.order.tOrderItemModels.forEach(item => {
          item.newRow = false;
          item.tOrderPackModels && item.tOrderPackModels.forEach(pack => pack.newRow = false)
        });
        this.itemData = this.order.tOrderItemModels;

        this.order.rowIndex = this.orderData.length > 0 ? this.orderData[this.orderData.length - 1].rowIndex : 1;
        this.orderData = [...this.orderData, this.order];
        this.clearData();
        this.bankObj.companyBank = '';
        this.bankObj.companyBankNo = '';
        // this.query(res.data && res.data.data && res.data.data.orderNo);
        this.router.navigate(['/system/trans/order-manage/draftOrder']);

      }

    });
  }

  /**
   * 修改保存
   */
  update() {
    this.saveLoading = true;
    // if(!this.validateOrder() || !this.validateItem() || !this.validatePack() || !this.validateData()){
    if (!this.validateOrder() || !this.validateItem()) {
      this.saveLoading = false;
      return;
    }
    this.handleData();
    for(let i:number=0;i<this.itemData.length;i++){
      if(this.itemData[i].receiveType=='JJFS10'){
        if(Number(this.itemData[i].transWeight)!=Number(this.itemData[i].totalWeight)){

          this.msg.error('运输重量和结算重量不相等，无法保存')
          return;
        }
      }
    }
    this.order.performancePlace = this.performancePlace;
    this.http.post(TRANS_URLS.UPDATE_ORDER, this.order).then((res: any) => {
      this.saveLoading = false;
      if (res.success) {
        // 保存成功将新行标记置为false
      //  this.selectedLength = 0;
        this.msg.success('保存成功');
        Object.assign(this.order, res.data.data);
        this.orderData.forEach(item => item.checked = false);
        this.order.checked = true;

        this.order.tOrderItemModels && this.order.tOrderItemModels.forEach(item => {
          item.newRow = false;
          item.tOrderPackModels && item.tOrderPackModels.forEach(pack => pack.newRow = false)
        });
        this.itemData = this.order.tOrderItemModels;

        this.query(res.data && res.data.data && res.data.data.orderNo,'update');
        this.router.navigate(['/system/trans/order-manage/draftOrder']);

      }

    });
  }

  /**
   * 提交后台前处理数据
   */
  handleData() {
    this.order.contractDate = this.order.contractDate && dateformat(this.order.contractDate, 'YYYY-MM-DD HH:mm:ss');
    this.order.tOrderItemModels = this.itemData;

    this.order.isAllrate = this.order.isAllrateFlag ? '是' : '否';

    let totalWeight = 0;
    let totalSheet = 0;
    // let totalPrice = 0;
    this.order.tOrderItemModels.forEach(item => {
      item.totalWeight = Number(item.totalWeight);
      item.totalSheet = Number(item.totalSheet);
      // item.totalPrice = item.totalWeight * Number(item.unitPrice);
      totalWeight += item.totalWeight;
      totalSheet += item.totalSheet;
      // totalPrice += item.totalPrice;
    });
    this.order.totalWeight = totalWeight;
    this.order.totalSheet = totalSheet;
    // this.order.totalPrice = totalPrice;
  }

  /**
   * 委托明细与委托捆包数据关联验证
   */
  validateData(): boolean {

    let msg = this.itemData.filter(item => !item.tOrderPackModels || item.tOrderPackModels.length == 0).map(item => this.fields.map(f => item[f]).join(",")).join(";");
    if (msg) {
      this.msg.error(`委托明细列表中存在数据未关联捆包的记录：${msg}`);
      return false;
    }

    msg = this.itemData.filter(item => item.totalWeight != item.tOrderPackModels.map(item => item.totalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0)).map(item => this.fields.map(f => item[f]).join(",")).join(";");
    if (msg) {
      this.msg.error(`委托明细列表中存在数据重量与关联捆包重量之和不相等的记录：${msg}`);
      return false;
    }

    msg = this.itemData.filter(item => item.totalSheet != item.tOrderPackModels.map(item => item.totalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0)).map(item => this.fields.map(f => item[f]).join(",")).join(";");
    if (msg) {
      this.msg.error(`委托明细列表中存在数据件数与关联捆包件数之和不相等的记录：${msg}`);
      return false;
    }

    const msgColumn = ['totalWeight', 'totalSheet'];
    msg = this.packData.filter(item => !item.itemRowindex).map(item => [...this.fields, ...msgColumn].map(f => item[f]).join(",")).join(";");
    if (msg) {
      this.msg.error(`委托捆包列表中存在没有关联委托明细的记录：${msg}`);
      return false;
    }

    return true;
  }

  /**
   * 委托信息验证
   */
  validateOrder(): boolean {
    const validateArray = [
      {ename: 'contractDate', cname: '合同立项日期'},
      // { ename: 'businessNature', cname: '业务性质' },
      {ename: 'consignorCompanyId', cname: '客户名称'},
      {ename: 'carrierCompanyId', cname: '运输单位'},
      // { ename: 'orderCompanyId', cname: '订货单位' },
      // { ename: 'consigneeCompanyId', cname: '收货单位' },
      { ename: 'transSettleCompany', cname: '承运结算账户' },
      // { ename: 'loadSettleCompanyid', cname: '吊装结算账户' },
      { ename: 'detailAddressName', cname: '收货地址' },
      { ename: 'flowId', cname: '运输方式' },
      // { ename: 'businessNatureName', cname: '业务性质' },
    ];


    const msg = validateArray.filter(item => !this.order[item.ename]).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`委托主信息"${msg}"字段不能为空！`);
      return false;
    }
    return true;
  }

  /**
   * 委托明细信息验证
   */
  validateItem(): boolean {
    if (!this.itemData || this.itemData.length == 0) {
      this.msg.error("委托明细不能为空！");
      return false;
    }
    const validateArray = [
      // {ename: 'orderItemNo', cname: '项次号'},
      {ename: 'productName', cname: '品名'},
      {ename: 'specDesc', cname: '规格'},
      // { ename: 'startPoint', cname: '起始地' },
      // { ename: 'endPoint', cname: '目的地' },
      // { ename: 'consignerCompanyId', cname: '发货单位' },
      {ename: 'totalSheet', cname: '件数', validator: 'number'},
      {ename: 'totalWeight', cname: '重量', validator: 'number'},
      // { ename: 'unitPrice', cname: '单价', validator: 'number' },
    ];
    let msg = validateArray.filter(item => this.itemData.some(data => !data[item.ename])).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`委托明细信息"${msg}"字段不能为空！`);
      return false;
    }
    msg = validateArray.filter(item => item.validator && this.itemData.some(data => isNaN(data[item.ename]))).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`委托明细信息"${msg}"字段必须为数字！`);
      return false;
    }

    return true;
  }

  /**
   * 捆包信息验证
   */
  validatePack(): boolean {
    if (!this.packData || this.packData.length == 0) {
      this.msg.error("委托捆包不能为空！");
      return false;
    }
    const validateArray = [
      {ename: 'productName', cname: '品名'},
      {ename: 'specDesc', cname: '规格'},
      {ename: 'totalWeight', cname: '重量', validator: 'number'},
      {ename: 'totalSheet', cname: '件数', validator: 'number'},
    ];
    let msg = validateArray.filter(item => this.packData.some(data => !data[item.ename])).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`委托捆包信息"${msg}"字段不能为空！`);
      return false;
    }
    msg = validateArray.filter(item => item.validator && this.packData.some(data => isNaN(data[item.ename]))).map(item => item.cname).join('","');
    if (msg) {
      this.msg.error(`委托捆包信息"${msg}"字段必须为数字！`);
      return false;
    }
    return true;
  }

  /**
   * 取消（取消修改，并跳转到查询界面）
   */
  cancel() {
    if (this.operateType === 'view') {
      this.router.navigate(['/system/trans/order-manage/order'], {queryParams: {}});
    } else {
      this.router.navigate(['/system/trans/order-manage/draftOrder'], {queryParams: {}});
    }

  }

  /**
   * 新增明细空行
   */
  addNewItem() {
    const rowIndex = this.itemData.length == 0 ? 1 : this.itemData[this.itemData.length - 1].itemRowindex;
    this.itemData = [...this.itemData, {...this.initRowData, itemRowindex: rowIndex}];

    let arr: any = [];
    Object.assign(arr, this.itemData);
    arr = arr.filter(item => item.checked);
   // this.selectedLength = arr.length;

    this.setPopTableData({});
  }

  updateDataResult(data: any) {
 //   this.selectedLength = data.length;
  }

  /**
   * 新增捆包空行
   */
  addNewPack() {
    const rowIndex = this.packData.length == 0 ? 1 : this.packData[this.packData.length - 1].packRowindex;
    this.packData = [...this.packData, {...this.initRowData, packRowindex: rowIndex}];
  }

  /**
   * 复制新增明细
   */
  copyAddItem() {
    const selectedData = this.itemData.filter(item => item.checked);
    if (selectedData.length == 0) {
      this.msg.warning("请至少选择一条捆包信息");
      return;
    }
    const rowIndex = this.itemData.length == 0 ? 1 : this.itemData[this.itemData.length - 1].rowIndex;
    selectedData.forEach((item, index) => {
      this.itemData = [...this.itemData, {...item, ...this.initRowData, rowIndex: (rowIndex + index + 1)}];
      this.setPopTableData(item);
    });
  }

  /**
   * 复制新增捆包
   */
  copyAddPack() {
    const selectedData = this.packData.filter(item => item.checked);
    if (selectedData.length == 0) {
      this.msg.warning("请至少选择一条捆包信息");
      return;
    }
    const rowIndex = this.packData.length == 0 ? 1 : this.packData[this.packData.length - 1].rowIndex;
    selectedData.forEach((item, index) => {
      this.packData = [...this.packData, {...item, ...this.initRowData, rowIndex: (rowIndex + index + 1)}];
    });
  }

  /**
   * 删除委托明细信息
   */
  deleteItem() {
    if (this.itemData.filter(item => item.checked).length == 0) {
      this.msg.warning("请至少选择一条委托信息");
      return;
    }
    let deleteIndex = 0;
    this.itemData.forEach(item => item.checked ? this.popTableData.splice(deleteIndex, 1) : deleteIndex++);
    this.itemData = this.itemData.filter(item => !item.checked);

    let arr: any = [];
    Object.assign(arr, this.itemData);
    arr = arr.filter(item => item.checked);
   // this.selectedLength = arr.length;
  }

  /**
   * 删除委托捆包信息
   */
  deletePack() {
    if (this.packData.filter(item => item.checked).length == 0) {
      this.msg.warning("请至少选择一条捆包信息");
      return;
    }
    this.packData = this.packData.filter(item => !item.checked);
  }

  /**
   * 删除全部委托明细信息
   */
  deleteAllItem() {
    if (!this.itemData || this.itemData.length == 0) {
      this.msg.warning("无委托明细信息！");
      return;
    }
    // this.msg.success(`明细信息删除成功！删除${this.itemData.length}条明细信息`);
    this.itemData = [];

   // this.selectedLength = 0;
  }

  /**
   * 删除全部委托捆包信息
   */
  deleteAllPack() {
    if (!this.packData || this.packData.length == 0) {
      this.msg.warning("无委托捆包信息！");
      return;
    }
    // this.msg.success(`明细信息删除成功！删除${this.packData.length}条明细信息`);
    this.packData = [];
  }

  /**
   * 生成捆包信息
   */
  createPack() {
    if (!this.validateItem()) {
      return;
    }
    this.packData = this.itemData.map((item, index) => {
      const pack = {
        newRow: true,
        itemRowindex: item.itemRowindex,
        packRowindex: index + 1,
        productName: item.productName,
        specDesc: item.specDesc,
        totalWeight: item.totalWeight,
        totalSheet: item.totalSheet,
      }

      item.tOrderPackModels = [pack];
      return pack
    });
    this.msg.success(`捆包信息生成成功！生成${this.packData.length}条捆包信息`);
  }


  /**
   * 汇总生成明细信息
   */
  createItem() {
    if (!this.validatePack()) {
      return;
    }
    let hash = {};
    const groupData = this.packData.reduceRight((item, next) => {
      const key = this.fields.map(u => next[u]).join("#");
      hash[key] ? '' : hash[key] = true && item.push(next);
      return item
    }, []);

    this.itemData = groupData.map((item, index) => {
      let orderItem = {
        newRow: true,
        itemRowindex: index + 1,
        productName: item.productName,
        specDesc: item.specDesc,
        totalWeight: 0,
        totalSheet: 0,
        tOrderPackModels: []
      }
      orderItem.tOrderPackModels = this.packData.filter(pack => {
        const eq = this.fields.map(field => item[field]).join("#") == this.fields.map(field => pack[field]).join("#");
        if (eq) {
          pack.itemRowindex = index + 1;
        }
        return eq;
      });

      orderItem.totalWeight = orderItem.tOrderPackModels.map(item => item.totalWeight).reduce((acc, cur) => Number(acc) + Number(cur), 0);
      orderItem.totalSheet = orderItem.tOrderPackModels.map(item => item.totalSheet).reduce((acc, cur) => Number(acc) + Number(cur), 0);

      this.setPopTableData(orderItem);
      return orderItem;
    });
    this.msg.success(`明细信息生成成功！生成${this.itemData.length}条明细信息`);
  }

  /**
   * 公司弹框设置公司ID
   * @param data
   * @param fieldName
   */
  setCompanyId(data: any, fieldName: string, fieldTextName?: string) {
    this.order[fieldName] = data.inpValue;
    if (fieldTextName) {
      this.order[fieldTextName] = data.inpName;
      (fieldName ==='consignorCompanyId') && (this.order.consignorCompanyId = data.selData && data.selData[0] && data.selData[0].companyId || '');
      this.order.customerBankId =  data.selData && data.selData[0] && data.selData[0].bankId || '';
      this.bankObj.companyBank = data.selData && data.selData[0] && data.selData[0].bankName || '';
      this.bankObj.companyBankNo = data.selData && data.selData[0] && data.selData[0].account || '';
    }
    if(fieldName == 'transSettleCompany'){
      this.bankObj.settleBank = data.selData && data.selData[0] && data.selData[0].bank || '';
      this.order.bankId =  data.selData && data.selData[0] && data.selData[0].bankId || '';
      this.bankObj.settleBankNo = data.selData && data.selData[0] && data.selData[0].bankAccount || '';
    }
  }

  /**
   * 查询
   * @param data
   */
  modalListSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.modalPageSize;
    this.getModalList(data);
  }


  /**
   * 获取弹窗列表
   * @param data
   */
  getModalList(data: any): void {
    let url = contractUrl.selectSales2;
    this.modalTempSearchParam = data;
    this.modalDataSet = [];
    this.modalListLoading = true;
    this.http.post(url, data).then((res: any) => {
      this.modalListLoading = false;
      if (res.success) {
        this.modalDataSet = res.data.data && res.data.data.data || [];
        this.modalTotalPages = res.data.data && res.data.data.total;
        this.modalDataSet.forEach((item) => {
          item.editstate = 0;
        })
      }
    })
  }

  /**
   * 弹窗选中数据发生变化
   * @param data
   */
  modalUpdateDatafun(data: any) {
    this.modalUpdateData = data;
    if (this.modalUpdateData.length > 0) {
      this.modalBtnDis = {};
    } else {
      this.modalBtnDis = {
        patchPrice: true,
        use: true
      };
    }
  }

  /**
   * 弹窗按钮点击
   * @param data
   */
  modalBtnClick(data: any) {

    switch (data.buttonId) {
      case 'use':
        this.modalBtnUse();
        break;
      case 'patchPrice':
        this.modalBtnPatchPrice();
        break;
      default:
        break;
    }
  }

  /**
   * 使用订单
   */
  modalBtnUse() {
    let url = TRANS_URLS.USE_ORDER;
    let param: any = {saledList: []};
    param.saledList = [...this.modalUpdateData];
    this.modalBtnDis = {
      use: true
    };
    this.http.post(url, param).then((res: any) => {
      console.log(res);
      this.modalBtnDis = {};
      if (res.success) {
        this.orderData = [...this.orderData, ...res.data&& res.data.data || []];
        //去重
        let obj: any = {};
        let arr: any = [];
        this.orderData.forEach(item => {
          if (!obj[item.orderNo]) {
            arr.push(item);
            obj[item.orderNo] = true;
          }
        });
        this.nz.create('success', '提示信息', res.data.msg, {nzDuration: 3000})
        this.orderData = [...arr];
        this.isVisible = false;
        this.orderData.length > 0 && this.query(this.orderData[0].orderNo);
      }
    });
  }

  /**
   * 匹配价格
   */
  modalBtnPatchPrice() {
    let url = contractUrl.matchSales;
    let param: any = {};
    param.transportPriceList = this.modalUpdateData;
    this.modalBtnDis = {
      patchPrice: true
    };
    this.http.post(url, param).then((res: any) => {
      this.modalBtnDis = {};
      if (res.success) {
        this.nz.create('success', '提示信息', '匹配成功', {nzDuration: 3000});
        this.modalListSearch(this.modalTempSearchParam);
      }
    })
  }

  /**
   * 弹窗取消
   */
  nzOnCancel() {
    this.isVisible = false;
    this.modalDataSet = [];
  }

  /**
   * 弹窗确定
   */
  nzOnOk() {
    this.isVisible = false;
    this.modalDataSet = [];
  }


  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        } else {
          Array.prototype.push.apply(data, []);
        }

      }
    );
  }


  /*
  *    根据输入的值的变化改变总价的值
  */
  modelChange(data:any){
    let itemDataNew = 0;
    let sumTotalPrice = 0;
    if(data.header.colEname === 'transWeight' ) {

        this.itemData.forEach((item:any)=>{
          if (item.receiveType==='JJFS20'&&!(item.totalWeight===undefined)) {

                  return;

          }
          item.totalWeight=item.transWeight;
        })

    }
    // 改变总金额 数据处理
    if(data.header.colEname==='totalPrice') {

      // 总金额除以总重量
      itemDataNew = (Number(this.isNotANumber( this.itemData[data.index].transWeight)) != 0)  ? Number(this.isNotANumber( this.itemData[data.index].totalPrice)) / Number(this.isNotANumber( this.itemData[data.index].transWeight)):0;

      //运输价格
      this.itemData[data.index].tranUnitPrice = (itemDataNew - Number(this.itemData[data.index].loadUnitPrice || 0 )).toFixed(3);
      //单价
      this.itemData[data.index].unitPrice = Number(this.isNotANumber( this.itemData[data.index].tranUnitPrice)) + Number(this.isNotANumber( this.itemData[data.index].loadUnitPrice));
      this.itemData.forEach((item: any) => {
        //循环列表数据，总金额相加
        sumTotalPrice += Number(item.totalPrice)
      });
      this.order.totalPrice = sumTotalPrice.toFixed(2);
    }
    //如果修改 装车价格、运输价格、运输重量 数据处理
    if(data.header.colEname==='tranUnitPrice'||data.header.colEname==='loadUnitPrice'||data.header.colEname==='transWeight'){

      this.itemData.forEach((item:any)=>{
        itemDataNew = (Number(this.isNotANumber(item.tranUnitPrice))+Number(this.isNotANumber(item.loadUnitPrice)))*Number(this.isNotANumber(item.transWeight));
        //总金额
        item.totalPrice=itemDataNew.toFixed(3);
        sumTotalPrice += Number(item.totalPrice)
        //单价
        item.unitPrice = Number(this.isNotANumber(item.tranUnitPrice))+Number(this.isNotANumber(item.loadUnitPrice))
      })
      this.order.totalPrice = sumTotalPrice.toFixed(2);
    }
  }
  /*
  *   把NaN变为0
  */
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }

}

