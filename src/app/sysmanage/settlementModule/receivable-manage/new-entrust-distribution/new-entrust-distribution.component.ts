import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {urls} from '../../../../common/model/url';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {GlobalService} from '../../../../common/services/global-service.service';
import {NzModalRef, NzNotificationService} from 'ng-zorro-antd';
import {isPosNum} from '../../../../common/validators/validator';
import {Utils} from '../../../../common/util/utils';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-new-entrust-distribution',
  templateUrl: './new-entrust-distribution.component.html',
  styleUrls: ['./new-entrust-distribution.component.css']
})
export class NewEntrustDistributionComponent implements OnInit {
  searchData:any = {};
  settleRec: Array<any> = [];//收款信息
  settleReport: any[] = [];//结算报表
  settleReportSearchTmp: any[] = [];//结算报表查询时候临时存储
  receiptData: string = '';//结算报表查询输入框数据
  settleRecTemp: any[] = [];//收款信息 原有得到数据要保存一份
  settleReportTemp: any[] = [];//结算报表 原有的数据保存
  modalData: any[];//弹窗
  pageSize1: number = 30;
  pageSize2: number = 30;
  pageSize3: number = 30;
  total1: number;
  total2: number;
  total3: number;
  //settleRecDataTemp: any[] = []; //原有得到数据要保存一份,选择的
  settleDataTemp: any[] = [];//原有得到数据要保存一份,选择的
  selectDataTrue: any = {allocationAmount: 0};//包含过去已经分配过的  未分配金额 已分配金额
  settleRecData: any[] = [];
  settleData: any[] = [];
  modalSelectData: any[] = [];
  isLoading: boolean = true;
  tplModal: NzModalRef;
  confirmModal: NzModalRef;
  modaltotal: number;
  modalTitle: string;
  modalContent: string;
  confirmStatus: string;
  selectName: any = {}; //选择客户名称
  itemTotalSum: number = 0;//收款信息总金额
  totalSum: number = 0; // 已选总金额
  collectedAmount: number = 0; //已收总金额
  uncollectedAmount: number = 0;  // 未收总金额
  isTrueGrid1: boolean = true;
  private multiSelect: boolean = true;
  private diffMoney = 0;
  queryParam: any = {page:1};//查询条件缓存
  confrimLoading:boolean;
  currentSelect:any[] = [];//当前是否勾选的数据 表2
  inputStaticData:any = {};
  loading:boolean = false;
  temParams:any;
  // tabIndex:number = 0;

  //tabArr:any[] = [{name:'未处理',tableType:10},{name:'已处理',tableType:20}];
  @ViewChild('tplTitle') tplTitle: TemplateRef<any>;

  @ViewChild('confirmContent') confirmContent: TemplateRef<any>;
  @ViewChild('confirmFooter') confirmFooter: TemplateRef<any>;

  constructor(private http: HttpUtilService,
              private ngHttp: HttpClient,
              private glo: GlobalService,
              private nz: NzNotificationService) {
  }

  ngOnInit() {
   // this.getSettleRec(urls.selectSettleRecForOrder2, {page: 1, length: this.pageSize2}, 2);
    this.getDiffMoney();
  }

  listSearch(data: any) {
    this.searchData = data;
    data.length = this.pageSize2 ? this.pageSize2 : data.length;
    this.getSettleRec(urls.selectSettleRecForOrder2, data, 2);//重置
  }
  private settleReportReset(){ //上表初始化
      this.itemTotalSum = 0;
      this.settleReport = [];
      this.settleReportTemp = [];
      this.settleData = [];
  }
  private settleRecReset(){ //下表初始化
    this.totalSum = 0; // 已选总金额
    this.collectedAmount = 0; //已收总金额
    this.uncollectedAmount = 0;  // 未收总金额
    this.settleRec = [];
    this.settleRecTemp = [];
  }
  btnClick(type: any) { //按钮点击
    this.confirmStatus = type.buttonId;
    console.log(type.buttonId);

    if (type.buttonId === 'export'){
      this.export();
      return
    }
    if (type.buttonId === 'sub') {//手动分款
      if (!this.settleRecData[0]) {
        this.glo.modalOpen({type: 'warning', title: '提示信息', content: '请选择对应的合同数据'});
        return;
      }
      if (!this.settleData[0]) {
        this.glo.modalOpen({type: 'warning', title: '提示信息', content: '请选择收款记录'});
        return;
      }
      if (this.settleData.length > 1) {
        this.glo.modalOpen({type: 'warning', title: '提示信息', content: '请选择单条收款记录进行操作'});
        return;
      }
      //判断上列表多条数据时，未分配金额小于未收总金额
     /* if (this.settleRecData.length > 1 && !this.multiSelect) {
        this.nz.create('error', '提示信息', '未分配金额小于未收总金额，请重新选择', {nzDuration: 3000});
        return
      }*/
      if (this.confirmValidateFun()) {  //客户名称和收款单位保持一致，
        this.glo.modalOpen({type: 'warning', title: '提示信息', content: '请选择客户名称和付款单位一致的的数据'});//客户名称和付款单位保持一致
        return;
      }

        this.modalTitle = '手动分款确认';
        this.modalContent = '确定要将勾选的数据进行手动分款？';
     /*  this.confirmStatus = 'sub';
        this.tplModal = this.glo.createModal({
          tplTitle: this.tplTitle,
          tplContent: this.confirmContent,
          tplFooter: this.confirmFooter
        });*/

    } else if (type.buttonId === 'auto_sub') {
      this.modalTitle = '自动分款确认';
      this.modalContent = '确定要将勾选的数据进行自动分款？';
     // this.confirmStatus = 'auto_sub';
      if (this.settleData.length < 1) {
        this.nz.warning('提示消息', '请至少勾选一条委托单信息！');
        return;
      }

    /*  this.tplModal = this.glo.createModal({
        tplTitle: this.tplTitle,
        tplContent: this.confirmContent,
        tplFooter: this.confirmFooter
      });*/
    }else if(type.buttonId === 'Force'){ //强制分款
        if(!this.settleRecData[0]){
          this.glo.modalOpen({type: 'warning', title: '提示信息', content: '请选择至少一条合同数据进行操作'});
          return;
        }

        this.modalTitle = `${type.buttonName}`;
        this.modalContent = `确定要将勾选的合同进行${type.buttonName}？`;
     /*   this.tplModal = this.glo.createModal({
          tplTitle: this.tplTitle,
          tplContent: this.confirmContent,
          tplFooter: this.confirmFooter
        });*/
    }
    this.tplModal = this.glo.createModal({
      tplTitle: this.tplTitle,
      tplContent: this.confirmContent,
      tplFooter: this.confirmFooter
    });
  }
 //付款单位上下不一致，上表多选情况
 private disabledSettleRec(data:any[],select:any[]){
   // if(!select[0]) return;
  const diffArr = select.length === 1 ? data.filter((item:any) => item.consignorCompanyId !== select[0].commissionClientId) : data;
     diffArr.map((x:any) => {
      // x.disabled = true;
       x.inputDisabled = {allocationAmount2: true};
     })
 }
  getSettleRec(url: string, param: any, type: number) {

    this.isLoading = true;
    type === 2 && (this.loading = true);
    this.temParams ={...param};
    this.http.post(url, param).then((res: any) => {
      this.isLoading = false;
      type === 2 && (this.loading = false);
      if (res.success) {
        if (type === 1) {  //合同请求

          this.settleRecReset();
          this.currentSelect = [];
          this.settleRec = res.data.data && res.data.data|| [];
          this.total1 = res.data.data && res.data.data.total;
          this.settleRec.length != 0 && this.settleRec.forEach(
            res => {
              res.totalPrice && (res.surplusAmount = Utils.sub(res.totalPrice,res.allocationAmount || 0));  //未收= 总价 - 已收
            }
          );
          this.settleRecTemp = Utils.deepCopy(this.settleRec);
          this.disabledSettleRec(this.settleRec,this.settleData);

        } else {  //收款信息请求

          this.settleReportReset();
          this.inputStaticData = {};
          this.settleReport = res.data.data && res.data.data.data || [];
          this.total2 = res.data.data && res.data.data.total;

          this.settleReportTemp = Utils.deepCopy(this.settleReport);

        }
      }
    });
  }


  selectData1Fun(data: any) { //选中收款信息
    this.receiptData = '';
    this.settleData = data;
    this.settleDataTemp = Utils.deepCopy(data);
    let num = this.settleData.length - 1;
    this.multiSelect = true;

    if(!data[0] || data.length>1){
      this.settleReport.forEach((x:any) => {/*要改*/
        const arr = this.settleReportTemp.filter((y:any) => y.settleRecNo === x.settleRecNo);
        x.surplusAmount = arr[0].surplusAmount;
        x.allocationAmount = arr[0].allocationAmount;
      })
    }

    if (this.settleData[0]) {
      let params = {...this.queryParam, tableType: 10, consignorCompanyName: this.settleData[num].commissionClientName,settleRecNo: this.settleData[num].settleRecNo};
      this.selectName = this.settleData[this.settleData.length - 1];
      this.receiptData = this.selectName['commissionClientName'];
      this.settleData[0] && this.getSettleRec(urls.getListBySettleRec, params, 1);
    }else{
      this.settleRecReset();
      this.inputStaticData = {};
    }

    this.itemTotalSum = this.settleData.map((x: any) => x.priceAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);

  }
  private currentDataFun(data1:any[],data2:any[]){ //当前正在勾的数据
     // const data = data1.concat(data2);
     const data = [...data1,...data2];
      let result:any,obj:any = {};
        data.forEach((item:any) => {
          if(!obj[item.orderNo]){
             obj[item.orderNo] = true;
          }else{
            obj[item.orderNo] = false;
          }
        })
      result = data.filter((x:any) => obj[x.orderNo] );
      return result;
  }
  private totalMoney(){
    this.totalSum = this.settleRecData.map((x: any) => x.totalPrice).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    this.collectedAmount = this.settleRecData.map((x: any) => x.allocationAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    this.uncollectedAmount = this.settleRecData.map((x: any) => x.surplusAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
  }
  selectData2Fun(data: any) {//选中合同委托记录
    this.settleRecData = data;
    this.collectedAmount = 0;
    this.totalSum = 0;
    this.uncollectedAmount = 0;
   const currentData = this.currentDataFun(data,this.currentSelect);
   if(this.settleData.length === 1){
     if(this.settleRecData.length > this.currentSelect.length){
       currentData.forEach((select:any) => {
        const primaryAllocationAmount = Number(this.settleData[0].surplusAmount) >= Number(select.surplusAmount) ? select.surplusAmount : this.settleData[0].surplusAmount;
        this.settleData[0].surplusAmount = Utils.sub(this.settleData[0].surplusAmount,primaryAllocationAmount);//上表未分配金额
        this.settleData[0].allocationAmount = Utils.add(this.settleData[0].allocationAmount,primaryAllocationAmount);//上表已分配金额
        select.allocationAmount2 = Utils.add(primaryAllocationAmount,select.allocationAmount2 || 0);//下表分配金额
        select.surplusAmount = Utils.sub(select.surplusAmount,primaryAllocationAmount);//下表未收金额
        select.allocationAmount = Utils.add(select.allocationAmount,primaryAllocationAmount);//下表已收金额
       });
     }else{
        currentData.forEach((select:any) => {
          const tempArr = this.settleRecTemp.filter((x:any) => x.orderNo === select.orderNo);//获取未变的;
          const relaAmout = Utils.sub(select.allocationAmount2,tempArr[0].allocationAmount2 || 0);//获取之前分配的金额
          select.allocationAmount2 = tempArr[0].allocationAmount2;//下表分配金额
          select.surplusAmount = tempArr[0].surplusAmount;//下表未收金额
          select.allocationAmount = tempArr[0].allocationAmount;
          this.settleData[0].surplusAmount = Utils.add(this.settleData[0].surplusAmount,relaAmout);//上表未分配金额
          this.settleData[0].allocationAmount = Utils.sub(this.settleData[0].allocationAmount,relaAmout);
          this.inputStaticData[select.orderNo] = null;
        });
     }
    }
    if(data[0]){
      this.totalMoney();
    }
   this.currentSelect =  data;
  }

  /**
   * 行点击事件
   * @param data
   */
  reportRowCilcked(data: any) {
    this.settleReport.forEach(item => {
      if (item.settleRecNo === data.settleRecNo) {
        item.checked = !item.checked;
      }
    });
    this.selectData1Fun(this.settleReport.filter(item => item.checked));
  }

  /**
   * 行点击事件
   * @param data
   */
  rowCilcked(data: any) {
    this.settleRec.forEach(item => {
      if (item.orderNo === data.orderNo) {
        item.checked = !item.checked;
      }
    });
    this.selectData2Fun(this.settleRec.filter(item => item.checked));
  }

  private confirmValidateFun() { //客户名称和收款单位保持一致，
    return this.settleRecData.some((x: any) => this.settleData.some((y: any) => x.consignorCompanyId !== y.commissionClientId));
  }

  divisionMoney(flag: string) { //分款
    let param = {orderModelList: this.settleRecData, tSettleRecModels: this.settleData, valueId: 'HTPK001'};
    let url:string;
    if (flag === 'sub') {
      url = urls.allocateFundsV3;//this.settleRecData.length > 1 ? urls.allocateFundsV2 : urls.allocateFunds
    } else {
      url = urls.autoAllocateFunds2;
    }
    this.confrimLoading = true;
    this.http.post(url, param).then(
      (res: any) => {
        this.confrimLoading = false;
        if (res.success) {
          this.receiptData = '';
          this.settleRecData = [];
          this.settleData = [];
          this.settleRec = [];
          this.getSettleRec(urls.selectSettleRecForOrder2, {...this.searchData, tableType: 10}, 2);
          flag === 'sub' ? this.nz.create('success', '提示信息', '分款成功', {nzDuration: 3000}) : this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
          this.tplModal.destroy();
        }
      }
    );
  }

  modalCancel(num: number) { //取消弹窗
    if (this.confirmStatus === 'sub' || this.confirmStatus === 'auto_sub' || this.confirmStatus === 'Force') {
      this.tplModal.destroy();
    }
  }

  modalSelectDataFun(data: any) { //弹窗选择数据
    this.modalSelectData = data;
  }

  modalConfirm() { //弹窗确定
    if (this.confirmStatus === 'sub') {
      this.divisionMoney('sub');
    } else if (this.confirmStatus === 'auto_sub') {
      this.divisionMoney('auto_sub');
    }else if(this.confirmStatus === 'Force'){
      this.forceOrder();
    }
  }

  private forceOrder(){
    this.confrimLoading = true;
    const tOrderModelList = this.settleRecData.map(x => ({orderNo:x.orderNo}));
    this.http.post(urls.forceConfirm,{tOrderModelList: tOrderModelList}).then((res:any)=>{
      this.confrimLoading = false;
      if(res.success){
        this.tplModal.destroy();
        this.nz.create('success', '提示信息', res.data.msg);
        const params = {...this.queryParam, tableType: 10, consignorCompanyName: this.receiptData.trim()};
        this.getSettleRec(urls.getListBySettleRec, params, 1);
      }
    })
  }
  inputModelFun(data: any) {
    if(this.settleData.length !== 1){
       return;
    }
    let otherAllocationAmount2:number = 0;
    const settleReportTemp = this.settleReportTemp.filter((x:any) => x.settleRecNo === this.settleData[0].settleRecNo);
    const sourceSettleRec = this.settleRecTemp.filter((x:any) => x.orderNo === data.data.orderNo)//获取未变的对应合同
    this.settleRec.forEach((item:any) => {
      if(item.orderNo !== data.data.orderNo){
        const arr =  this.settleRecTemp.filter((x:any) => x.orderNo === item.orderNo);
      otherAllocationAmount2 = Utils.add(Utils.sub(item.allocationAmount2 || 0,arr[0].allocationAmount2 || 0),otherAllocationAmount2);
      }
    })

     if(data.val === ''){
      this.settleData[0].surplusAmount = Utils.sub(settleReportTemp[0].surplusAmount,otherAllocationAmount2);//上表未分配金额
      this.settleData[0].allocationAmount = Utils.add(settleReportTemp[0].allocationAmount,otherAllocationAmount2);//上表已分配金额
      data.data.surplusAmount = sourceSettleRec[0].surplusAmount;//下表未收金额
      data.data.allocationAmount = sourceSettleRec[0].allocationAmount;
      data.data.checked = false;
      this.settleRecData = this.settleRec.filter((x:any) => x.checked);
      this.currentSelect = this.settleRec.filter((x:any) => x.checked);
      this.inputStaticData[data.data.orderNo] = null;
        return;
     }
    if (!isPosNum(data.val)) {
      let val = parseFloat(data.val);
      data.input.value = isNaN(val) ? 0 : Math.abs(val);
    }
    const had = !!(this.inputStaticData[data.data.orderNo]&& (Number(data.input.value) == Number(this.inputStaticData[data.data.orderNo].allocationAmount2)));
    if(had){
      return;
    }

    const surplusAmount = Utils.sub(settleReportTemp[0].surplusAmount,otherAllocationAmount2);
    const soruceSurplusAmount = Utils.add(sourceSettleRec[0].surplusAmount,sourceSettleRec[0].allocationAmount2 || 0);//加上相关联的，实际上可以这次分配的金额
    const primaryAllocationAmount = Number(surplusAmount) >= soruceSurplusAmount ? soruceSurplusAmount : surplusAmount;

    data.data.allocationAmount2 = Number(data.input.value) >= primaryAllocationAmount ? primaryAllocationAmount : data.input.value;//下表分配金额
    const relaAmout = Utils.sub(data.data.allocationAmount2,sourceSettleRec[0].allocationAmount2 || 0);//这次实际分配的金额

    this.settleData[0].surplusAmount = Utils.sub(Utils.sub(settleReportTemp[0].surplusAmount,relaAmout),otherAllocationAmount2);//上表未分配金额
    this.settleData[0].allocationAmount = Utils.add(Utils.add(settleReportTemp[0].allocationAmount,relaAmout),otherAllocationAmount2);//上表已分配金额
    data.data.surplusAmount = Utils.sub(soruceSurplusAmount,data.data.allocationAmount2);//下表未收金额
    data.data.allocationAmount = Utils.add(sourceSettleRec[0].allocationAmount,relaAmout);//下表已收金额
    data.data.checked = true;
    let enterbool = this.settleRecData.some((x:any) => x.orderNo === data.data.orderNo);
    let enterbool2 = this.currentSelect.some((x:any) => x.orderNo === data.data.orderNo);
    if( data.data.checked && !enterbool){
      this.settleRecData.push(data.data);
    }
    if(data.data.checked && !enterbool2){
      this.currentSelect.push(data.data);
    }
    this.totalMoney();
    this.inputStaticData[data.data.orderNo] = Utils.deepCopy(data.data);
  }

  settleReportIndexEmit(data: any) {
   this.searchData.page = data;
  this.searchData.length = this.pageSize2;
    if (this.settleRecData[0] && !this.settleRecData[1]) {
  this.searchData.orderNo =  this.settleRecData[0].orderNo;

    }
    this.getSettleRec(urls.selectSettleRecForOrder2, this.searchData, 2);
  }

  settleReportSizeEmit(data: any) {
    this.pageSize2 = data;
  this.searchData.page = 1;
  this.searchData.length = data;
    if (this.settleRecData[0] && !this.settleRecData[1]) {
      this.searchData.orderNo = this.settleRecData[0].orderNo;

    }
    this.getSettleRec(urls.selectSettleRecForOrder2, this.searchData, 2);
  }

  settleRecIndexEmit(data: any) {
    this.getSettleRec(urls.getPage, {page: data, length: this.pageSize1}, 1);
  }

  settleRecSizeEmit(data: any) {
    this.getSettleRec(urls.getPage, {page: 1, length: data}, 1);
  }

  /**
   * 收款模糊查询
   */
  receiptSearch() {
    this.settleReport.forEach((x:any) => {/*要改*/
      const arr = this.settleReportTemp.filter((y:any) => y.settleRecNo === x.settleRecNo);
      x.surplusAmount = arr[0].surplusAmount;
      x.allocationAmount = arr[0].allocationAmount;
    })
    let params = {...this.queryParam, tableType: 10, consignorCompanyName: this.receiptData.trim(), settleRecNo: this.settleData[this.settleData.length - 1].settleRecNo};
   // this.settleData[0] && this.getSettleRec(urls.getListBySettleRec, params, 1);
   this.getSettleRec(urls.getListBySettleRec, params, 1);
  }

  /**
   * 自动分款允许差值获取
   */
  getDiffMoney(): void {
    this.http.post(urls.getDiffMoney, {valueId: 'HTPK001'}).then(
      res => {
        if (res.success) {
          this.diffMoney = parseInt(res.data.data);
        }
      }
    );
  }
  export(){
    console.log(111)
    let url: any = urls.settleRecexport;
    this.ngHttp.post(url, this.temParams, {responseType: 'blob'}).subscribe((res: any) => {
      let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `合同配款操作.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
