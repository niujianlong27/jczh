/**
 * 合同配款操作
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {urls} from '../../../../common/model/url';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {GlobalService} from '../../../../common/services/global-service.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {isPosNum} from '../../../../common/validators/validator';
import {Utils} from '../../../../common/util/utils';

@Component({
  selector: 'app-entrust-distribution',
  templateUrl: './entrust-distribution.component.html',
  styleUrls: ['./entrust-distribution.component.css']
})
export class EntrustDistributionComponent implements OnInit {

  settleRec: Array<any> = [];//收款信息
  settleReport: any[] = [];//结算报表
  settleReportSearchTmp: any[] = [];//结算报表查询时候临时存储
  searchFlag: boolean = false; //搜索标志位处理
  receiptData: string;//结算报表查询输入框数据
  settleRecTemp: any[] = [];//收款信息 原有得到数据要保存一份
  settleReportTemp: any[] = [];//结算报表 原有的数据保存
  modalData: any[];//弹窗
  pageSize1: number = 30;
  pageSize2: number = 30;
  pageSize3: number = 30;
  total1: number;
  total2: number;
  total3: number;
  selectData1Temp: any[] = []; //原有得到数据要保存一份,选择的
  selectData2Temp: any[] = [];//原有得到数据要保存一份,选择的
  selectDataTrue: any = {allocationAmount: 0};//包含过去已经分配过的  未分配金额 已分配金额
  selectData1: any[] = [];
  selectData2: any[] = [];
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
  ischick: boolean = false; //判断是否是勾选状态
  isTrueGrid1: boolean = true;
  isTrueGrid2: boolean = false; //多选控制
  private multiSelect: boolean = true;
  private diffMoney = 0;
  businessModuleArr:Array<any> =[];
  queryParam:any ={};//查询条件缓存


  // tabIndex:number = 0;

  //tabArr:any[] = [{name:'未处理',tableType:10},{name:'已处理',tableType:20}];
  @ViewChild('tplTitle') tplTitle;

  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;

  constructor(private http: HttpUtilService, private glo: GlobalService, private nz: NzNotificationService, private modal: NzModalService) {
  }

  ngOnInit() {
   // this.getSettleRec(urls.getPage, {page: 1, length: this.pageSize1}, 1);
   // this.getSettleRec(urls.selectSettleRecForOrder, {page: 1, length: this.pageSize2}, 2);
    this.getDiffMoney();
  }

  listSearch(data: any) {
    data.length = data.length ? data.length : this.pageSize1;
    this.getSettleRec(urls.getPage, data, 1);
    this.getSettleRec(urls.selectSettleRecForOrder, {page: 1, length: this.pageSize2}, 2);//重置
  }

  btnClick(type: any) { //按钮点击

    if (type.buttonId === 'sub') {//手动分款
      if (!this.selectData1[0]) {
        this.glo.modalOpen({type: 'warning', title: '提示信息', content: '请选择上表数据进行操作'});
        return;
      }
      if (!this.selectData2[0]) {
        this.glo.modalOpen({type: 'warning', title: '提示信息', content: '请选择下表数据进行操作'});
        return;
      }
      //判断上列表多条数据时，未分配金额小于未收总金额
     if (this.selectData1.length > 1 && !this.multiSelect) {
        this.nz.create('error', '提示信息', '未分配金额小于未收总金额，请重新选择', {nzDuration: 3000});
        return
      }
      if (this.confirmValidateFun()) {  //客户名称和收款单位保持一致，
        this.glo.modalOpen({type: 'warning', title: '提示信息', content: '请选择客户名称和付款单位一致的的数据'});//客户名称和付款单位保持一致
        return;
      }
      //已收金额 allocationAmount + 误差 > = 总金额  允许自动确认
      if ((this.selectData1.length == 1) && this.selectData1[0].allocationAmount + this.diffMoney >= this.selectData1[0].totalPrice) {
        this.modal.confirm(
          {
            nzTitle: '确认分款',
            nzContent: Number(this.selectData1[0].allocationAmount) === Number(this.selectData1[0].totalPrice) ? '已收金额和合同金额相等，是否确认分款?' : '已收金额和合同金额不一致，是否确认分款?',
            nzOnOk: () => {
              // 弹框确定按钮事件  并调用自动确认接口
              let param = {orderModelList: this.selectData1, tSettleRecModels: this.selectData2, valueId: 'HTPK001'};
              const url = urls.allocateFunds;
              return this.http.post(url, param).then(
                (res: any) => {
                  if (res.success) {

                  } else {
                    return Promise.reject('erro');
                  }
                }
              ).then(
                (res: any) => {
                  let param = {tOrders: []};
                  this.selectData1.map((x: any) => {
                    let o: any = {};
                    o.orderNo = x.orderNo;
                    param.tOrders.push(o);
                  });
                  return this.http.post(urls.confirm, param).then((x: any) => {
                    if (x.success) {
                      this.nz.create('success', '提示信息', '分款成功', {nzDuration: 3000});
                      this.selectData1 = [];
                      this.selectData2 = [];
                      this.getSettleRec(urls.getPage, {...this.queryParam, tableType: 10}, 1);
                      this.getSettleRec(urls.selectSettleRecForOrder, {
                        page: 1,
                        length: this.pageSize2,
                        tableType: 10
                      }, 2);
                      this.tplModal.destroy();
                    }
                  });
                }
              );
            },
            nzOnCancel: () => {
              // 弹框取消按钮事件 只分款不自动确认
              let param = {orderModelList: this.selectData1, tSettleRecModels: this.selectData2, valueId: 'HTPK001'};
              /*this.selectData2.map( (item:any) => {
                // let temp:any = {};
               //  temp.allocationAmount2 = item.allocationAmount2;
              //   temp.settleRecNo = item.settleRecNo;
                 param.tSettleRecModels.push(item);
              })*/
              const url = urls.allocateFunds;
              return this.http.post(url, param).then(
                (res: any) => {
                  if (res.success) {
                    this.nz.create('success', '提示信息', '分款成功', {nzDuration: 3000});
                    this.selectData1 = [];
                    this.selectData2 = [];
                    this.getSettleRec(urls.getPage, {...this.queryParam, tableType: 10}, 1);
                    this.getSettleRec(urls.selectSettleRecForOrder, {
                      page: 1,
                      length: this.pageSize2,
                      tableType: 10
                    }, 2);
                    this.tplModal.destroy();
                  }
                }
              );
            }
          }
        );
      } else {
        this.modalTitle = '手动分款确认';
        this.modalContent = '确定要将勾选的数据进行手动分款？';
        this.confirmStatus = 'sub';
        this.tplModal = this.glo.createModal({
          tplTitle: this.tplTitle,
          tplContent: this.confirmContent,
          tplFooter: this.confirmFooter
        });
      }
    } else if (type.buttonId === 'auto_sub') {
      this.modalTitle = '自动分款确认';
      this.modalContent = '确定要将勾选的数据进行自动分款？';
      this.confirmStatus = 'auto_sub';
      if (this.selectData1.length < 1) {
        this.nz.warning('提示消息', '请至少勾选一条委托单信息！');
        return;
      }
      if (this.confirmValidateFun()) {
        this.glo.modalOpen({type: 'warning', title: '提示信息', content: '请选择客户名称和付款单位一致的的数据'});//客户名称和付款单位保持一致
        return;
      }
      this.tplModal = this.glo.createModal({
        tplTitle: this.tplTitle,
        tplContent: this.confirmContent,
        tplFooter: this.confirmFooter
      });
    }
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
    this.selectData1Fun(this.settleRec.filter(item => item.checked));
  }

  selectData1Fun(data: any) {//选中1 单选
    this.ischick = false;
    this.receiptData = '';
    this.settleReport = [];
    this.searchFlag = false;
    this.selectData1 = data;//Utils.deepCopy(data);
    // allocationAmount 已收金额
    if (this.selectData1.length > 1) {  //选择多条数据
      for (let i = 0; i < this.selectData1.length; i++) { //判断当前数据的客户名称是否相同，以及多选控制
        if (this.selectData1[i].consignorCompanyName !== data[0].consignorCompanyName) {
          // this.selectData1[i].checked = false;
          this.selectData1.splice(i, 1);
          return this.nz.create('error', '提示信息', `请选择相同客户名称的列表`, {nzDuration: 3000});
        }
        if (Number(this.selectData1[i].allocationAmount)) {
          this.isTrueGrid1 = false;
          return this.nz.create('error', '提示信息', `已选数据中存在已收金额不为0，不可多选`, {nzDuration: 3000});
        }
      }
      this.isTrueGrid2 = false;
    } else if (this.selectData1.length == 1) { //选择一条
      if (!Number(this.selectData1[0].allocationAmount)) {  // 已收金额为0
        this.isTrueGrid1 = true;  //上表可多选
      } else {
        this.isTrueGrid1 = false;  //上表单选
      }
      this.isTrueGrid2 = true;
    }
    this.collectedAmount = 0;
    this.totalSum = 0;
    this.uncollectedAmount = 0;
    this.selectData1Temp = [];
    // this.selectDataTrue.totalPrice = 0;
    this.selectDataTrue.allocationAmount = 0;
    if (this.selectData1[0]) {
      this.ischick = true;
      // this.selectDataTrue.totalPrice = this.selectData1[0].totalPrice;
      this.selectDataTrue.allocationAmount = this.selectData1[0].allocationAmount;
      this.selectName = this.selectData1[this.selectData1.length - 1];
      this.receiptData = this.selectName['consignorCompanyName'];
      //获取已选数据的总数据
      this.totalSum = this.selectData1.map((x: any) => x.totalPrice).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
      this.collectedAmount = this.selectData1.map((x: any) => x.allocationAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
      this.uncollectedAmount = this.selectData1.map((x: any) => x.surplusAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    }
    this.settleRecTemp.map((item: any, i: number) => { //重置之前选的
      let list = Object.assign({}, item);
      // this.settleRec[i].totalPrice = list.totalPrice;
      this.settleRec[i].allocationAmount2 = list.allocationAmount2;
      this.settleRec[i].totalPrice = list.totalPrice;
      this.settleRec[i].allocationAmount = list.allocationAmount;

    });
    data.map((item: any) => {
      this.selectData1Temp.push(Object.assign({}, item));
    });//保留一份
    // !this.selectData1[0] && this.getSettleRec(urls.getPage, {page: 1, length: this.pageSize1, tableType: 10}, 1);
    // !this.selectData1[1] ? this.getSettleRec(urls.selectSettleRecForOrder, {
    //   page: 1,
    //   length: this.pageSize2,
    //   orderNo: data[0] && data[0].orderNo
    // }, 2) : this.getSettleRec(urls.selectSettleRecForOrder, {page: 1, length: this.pageSize2}, 2); //自动配款不回填
    if (this.selectData1.length == 1){
      this.getSettleRec(urls.selectSettleRecForOrder, {
        page: 1,
        length: this.pageSize2,
        orderNo: data[0] && data[0].orderNo
      }, 2)
    } else if(this.selectData1.length == 0){
      this.getSettleRec(urls.selectSettleRecForOrder, {page: 1, length: this.pageSize2}, 2);
    }

  }


  validateFun() { //判断上下表收款单位是否一致
    if (this.selectData1.length === 1 && this.selectData2[0]) {
      for (let i = 0; i < this.selectData2.length; i++) {
        if (this.selectData1[0].consignorCompanyId !== this.selectData2[i].commissionClientId) {
          this.nz.remove();
          return this.nz.create('error', '提示信息', `请选择收款单位相同的收款记录`, {nzDuration: 3000});
        }
      }

    }
  }

  private confirmValidateFun() { //客户名称和收款单位保持一致，
    return this.selectData1.some((x: any) => this.selectData2.some((y: any) => x.consignorCompanyId !== y.commissionClientId));
  }

  selectData2Fun(data: any) { //选中2
    this.selectData2 = data;
    this.selectData2Temp = Utils.deepCopy(data);
    this.validateFun(); //判断上下表收款单位是否一致
    this.multiSelect = true;
    //选择下表数据时，上表勾选数据已收未收、总金额为初始勾选数据的和
    // this.collectedAmount = this.selectData1Temp.map((x: any) => x.allocationAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    // this.uncollectedAmount = this.selectData1Temp.map((x: any) => x.surplusAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    /*可能会变*/
      //上 余额 surplusAmount
    //上 已收金额 allocationAmount
    //下 分款金额 allocationAmount2
    //下 未分配金额 surplusAmount
    //下 已分配金额 allocationAmount
    if(this.selectData1.length === 1){
      let allocationAmount2 = 0;
      this.settleReport.filter((x: any) => !x.checked).map((x: any) => {
        allocationAmount2 = Utils.add(x.allocationAmount2 || '0', allocationAmount2);
        x.surplusAmount = Utils.add(x.surplusAmount, x.allocationAmount2);
        x.allocationAmount = Utils.sub(x.allocationAmount, x.allocationAmount2);
        x.allocationAmount2 = 0;
      });
      this.selectData1[0] && (this.selectData1[0].remainAmount = Utils.add(this.selectData1[0].remainAmount, allocationAmount2));
      this.selectData1[0] && (this.selectData1[0].surplusAmount = Utils.add(this.selectData1[0].surplusAmount, allocationAmount2));
      this.selectData1[0] && (this.selectData1[0].allocationAmount = Utils.sub(this.selectData1[0].allocationAmount, allocationAmount2));
      this.selectData2.forEach(
        res => {

          if ((res.allocationAmount2 === 0 || res.allocationAmount2 === '0') && ((this.selectData1[0].surplusAmount) * 1 >= 0)) {
            if ((this.selectData1[0].surplusAmount) * 1 > (res.surplusAmount) * 1) {
              res.allocationAmount2 = res.surplusAmount;
            } else {
              res.allocationAmount2 = this.selectData1[0].surplusAmount;
            }
            res.allocationAmount = Utils.add(res.allocationAmount, res.allocationAmount2);
            res.surplusAmount = Utils.sub(res.surplusAmount, res.allocationAmount2);
            this.selectData1[0].allocationAmount = Utils.add(this.selectData1[0].allocationAmount, res.allocationAmount2);
            this.selectData1[0].surplusAmount = Utils.sub(this.selectData1[0].surplusAmount, res.allocationAmount2);
          }

        }
      );
    }

    if (this.selectData1.length > 1) {//上表选多个下表只能选一个
      this.selectData1.map((x:any,i:number)=>{
        x.allocationAmount =  this.selectData1Temp[i].allocationAmount;
        x.surplusAmount = this.selectData1Temp[i].surplusAmount;
      });
      this.settleReport.map((x:any) => {
         const t = this.settleReportTemp.filter(y => y.settleRecNo === x.settleRecNo);
         x.allocationAmount = t[0] && t[0].allocationAmount;
         x.surplusAmount = t[0] && t[0].surplusAmount;
         x.allocationAmount2 = t[0] && t[0].allocationAmount2;
      });
      if(!this.selectData2[0]){
        return;
      }
      const totalAllocationAmount2 = this.selectData1.map((x:any) => x.surplusAmount).reduce((m,n)=> Number(m) + Number(n),0);
      if(totalAllocationAmount2 >  this.selectData2[0].surplusAmount){
        this.multiSelect = false;
      }
      this.selectData2[0].allocationAmount2 = Number(this.selectData2[0].allocationAmount2 || '0') + totalAllocationAmount2;
      this.selectData1.map((x:any)=>{
        x.allocationAmount = Number(x.allocationAmount) + Number(x.surplusAmount);
        x.surplusAmount = 0;
      });
      this.selectData2[0].allocationAmount = Number(this.selectData2[0].allocationAmount) + totalAllocationAmount2;
      this.selectData2[0].surplusAmount = Number(this.selectData2[0].surplusAmount) - totalAllocationAmount2;
    }
    // 勾选数据变化后，总的价格更新
    // this.collectedAmount = this.selectData1.map((x: any) => x.allocationAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    this.itemTotalSum = this.selectData2.map((x: any) => x.priceAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);

  }

  getSettleRec(url: string, param: any, type: number) {
    if (type == 1) { this.queryParam = {...param}};
    this.isLoading = true;
    this.http.post(url, param).then((res: any) => {
      this.isLoading = false;
      if (res.success) {
        if (type === 1) {  //上表请求
          this.totalSum = 0; // 已选总金额
          this.collectedAmount = 0; //已收总金额
          this.uncollectedAmount = 0;  // 未收总金额
          this.settleRec = [];
          this.settleRecTemp = [];
          // this.settleReport = [];
          this.settleRec = res.data.data && res.data.data.data || [];
          this.total1 = res.data.data && res.data.data.total;
          this.settleRec.length !== 0 && this.settleRec.forEach(
            res => {
              res.surplusAmount = res.totalPrice - res.allocationAmount;  //未收= 总价 - 已收
            }
          );
          this.settleRec.map((item: any) => {
            let list = Object.assign({}, item);
            this.settleRecTemp.push(list);

          });
        } else {  //下表请求
          this.itemTotalSum = 0;
          this.settleReport = [];
          this.settleReportTemp = [];
          this.selectData2 = [];
          this.settleReport = res.data.data && res.data.data.data || [];
          this.total2 = res.data.data && res.data.data.total;
          this.settleReport.map((data: any) => {
            data.allocationAmount2 = data.allocationAmount2 === null || data.allocationAmount2 === undefined ? '' : data.allocationAmount2;
            // data.allocationAmount = '0.00';
            param.tableType == 20 && (data.editstate = 0);
            if (param.orderNo) {
              //  data.isRelation == 10 && (data.allocationAmount = data.thisRecDivisionAmount);//带出已分配的
              data.checked = data.isRelation == 10; //有关联的自动勾选
              data.checked ? this.selectData2.push(data) : null; //自动分配
              data.checked ? data.disabled = true : null;//有关联的选择不能去掉
            }
            if (this.selectData1[1]) {  //多选禁填输入信息
               data.inputDisabled = {'allocationAmount2': true};
            } else {
              data.inputDisabled = undefined;
            }
          });
          this.settleReportTemp = Utils.deepCopy(this.settleReport);
          this.settleReport.filter((x: any) => x.checked).map((x: any) => {
            // this.selectDataTrue.totalPrice = Utils.add(this.selectDataTrue.totalPrice,x.allocationAmount2);
            this.selectDataTrue.allocationAmount = Utils.sub(this.selectDataTrue.allocationAmount, x.allocationAmount2);
          });
          this.itemTotalSum = this.selectData2.map((x: any) => x.priceAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
          this.ischick && this.receiptData && this.receiptSearch();
        }
      }
    });
  }

  divisionMoney(flag: string) { //分款
    let param = {orderModelList: this.selectData1, tSettleRecModels: this.selectData2, valueId: 'HTPK001'};
    /*this.selectData2.map( (item:any) => {
      // let temp:any = {};
     //  temp.allocationAmount2 = item.allocationAmount2;
    //   temp.settleRecNo = item.settleRecNo;
       param.tSettleRecModels.push(item);
    })*/
    let url;
    if (flag === 'sub') {
      url = this.selectData1.length > 1 ? urls.allocateFundsV2 : urls.allocateFunds
    } else {
      url = urls.autoAllocateFunds;
    }
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.ischick = false;
          this.receiptData= '';
          this.selectData1 = [];
          this.selectData2 = [];
          this.getSettleRec(urls.getPage, {...this.queryParam, tableType: 10}, 1);
          this.getSettleRec(urls.selectSettleRecForOrder, {page: 1, length: this.pageSize2, tableType: 10}, 2);
          flag === 'sub' ? this.nz.create('success', '提示信息', '分款成功', {nzDuration: 3000}) : this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
          this.tplModal.destroy();
        }
      }
    );
  }


  modalCancel(num: number) { //取消弹窗
    if (this.confirmStatus === 'sub' || this.confirmStatus === 'auto_sub') {
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
    }
  }

  //分账选择
  inputBlur(data: any) {
    window.setTimeout(() => {
      this.validateFun();
    });
  }

  inputModelFun(data: any) {
      if (!isPosNum(data.val)) {
        let val = parseFloat(data.val);
        data.input.value = isNaN(val) ? 0 : Math.abs(val);
      }
      data.data.checked = true;
      data.data.allocationAmount2 = data.input.value;
      let t = 0;
      //下表数据被选择并且不等于当前被输入的数据  t 为被分配的总金额，不包括本条
      this.settleReport.filter((x: any) => x.checked && (x.settleRecNo !== data.data.settleRecNo)).map((x: any) => t = Utils.add(t, x.allocationAmount2));//下表已分配的 ，不包含本次
      let reportArr = this.settleReportTemp.filter((x: any) => x.settleRecNo === data.data.settleRecNo);//结算报表号唯一,settleReportTemp下表数据
      let reportTempAllocationAmount = reportArr[0].allocationAmount2 || '0';//下表初始的有关联的分款金额
      let surplusAmountTmp = reportArr[0].surplusAmount || '0';//下表初始的有关联的未分款
      // let currentMaxValue = Utils.sub(Utils.sub(this.selectDataTrue.totalPrice || 0,this.selectDataTrue.allocationAmount || 0),t);
      let currentMaxValue = Utils.sub(Utils.sub(this.selectData1[0] && this.selectData1[0].totalPrice || 0, this.selectDataTrue.allocationAmount || 0), t);
      // let currentMaxValue= data.data.surplusAmount;
  
      if (reportArr[0].isRelation === '10') {
        const tmp = Utils.add((reportArr[0].surplusAmount || '0'), (reportArr[0].allocationAmount2 || '0')); //部分配款时，可分款金额
        if (this.selectData1[0] && (Utils.sub(data.input.value, tmp)) > 0) {
          data.input.value = tmp;
          data.data.allocationAmount2 = tmp;
        }
      } else {
        if (this.selectData1[0] && (Utils.sub(data.input.value, surplusAmountTmp)) > 0) {
          data.input.value = surplusAmountTmp;
          data.data.allocationAmount2 = surplusAmountTmp;
        }
      }
  
  
      //上 余额 surplusAmount
      //上 已收金额 allocationAmount
      //下 分款金额 allocationAmount2
      //下 未分配金额 surplusAmount
      //下 已分配金额 allocationAmount
  
      this.selectData1[0] && (this.selectData1[0].surplusAmount = Utils.sub(currentMaxValue, data.data.allocationAmount2));   //上剩余分配/未分配
      this.selectData1[0] && (this.selectData1[0].allocationAmount = Utils.add(Utils.add(this.selectDataTrue.allocationAmount, t), data.data.allocationAmount2));//上已分配
      data.data.allocationAmount = Utils.add(Utils.sub(reportArr[0].allocationAmount, reportTempAllocationAmount), data.data.allocationAmount2); //下已收
      data.data.surplusAmount = Utils.sub(Utils.add(reportArr[0].surplusAmount, reportTempAllocationAmount), data.data.allocationAmount2);//下未收
      data.data.checked && this.selectData2.push(data.data);
      this.selectData2 = this.selectData2.filter(item => item.settleRecNo != data.data.settleRecNo);
      this.selectData2 = [...this.selectData2, data.data];
      // 勾选数据变化后，总的价格更新
      // this.collectedAmount = this.selectData1.map((x: any) => x.allocationAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
      // this.uncollectedAmount = this.selectData1.map((x: any) => x.surplusAmount).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
   
  }

  settleReportIndexEmit(data: any) {
    let param;
    this.searchFlag = false;
    if (this.selectData1[0] && !this.selectData1[1]) {
      param = {page: data, length: this.pageSize2, orderNo: this.selectData1[0].orderNo};
    } else {
      param = {page: data, length: this.pageSize2};
    }
    this.getSettleRec(urls.selectSettleRecForOrder, param, 2);
  }

  settleReportSizeEmit(data: any) {
    let param;
    this.searchFlag = false;
    if (this.selectData1[0] && !this.selectData1[1]) {
      param = {page: 1, length: data, orderNo: this.selectData1[0].orderNo};
    } else {
      param = {page: 1, length: data};
    }
    this.getSettleRec(urls.selectSettleRecForOrder, param, 2);
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

    if (this.receiptData && !this.searchFlag) {
      this.settleReportSearchTmp = [];
      Array.prototype.push.apply(this.settleReportSearchTmp, this.settleReport);
      // this.settleReportSearchTmp=Utils.deepCopy(this.settleReport);
      this.searchFlag = true;
      this.search();
    } else if (!this.receiptData && this.searchFlag) {
      this.searchFlag = true;
      this.settleReport = [...this.settleReportSearchTmp];
    } else if (this.receiptData && this.searchFlag) {
      this.search();
    }

  }

  search(): void {
    this.settleReport = this.settleReportSearchTmp.filter(
      value =>
        Object.values(value).toString().split(this.receiptData.trim()).length > 1
    );
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

  /**
   * 查询数据返回
   * @param {Array<any>} data
   */
  searchDataReturn(data: Array<any>) {
    data.forEach(item => {
      if (item.parameter === 'businessModuleName') {
        item.queryBoxType = 'select';
        item.apiParameter = {optionList:[]}
      }
    });
    let url = urls.getSegmentInformation;
    if (!this.businessModuleArr[0]) {
      this.http.post(url, {transType: '20'}).then((res: any) => {
        if (res.success) {
          this.businessModuleArr = res.data.data && res.data.data || [];

          this.businessModuleArr.forEach(
            res => {
              res.name = res.segmentName;
              res.value = res.segmentName;
            }
          );

          data.forEach(
            res => {
              if (res.parameter === 'businessModuleName' && res.queryBoxType === 'select') {
                Array.prototype.push.apply(res.apiParameter.optionList, this.businessModuleArr);
              }
            }
          );

        }
      });
    } else {
      data.forEach(
        res => {
          if (res.parameter === 'businessModuleName' && res.queryBoxType === 'select') {
            Array.prototype.push.apply(res.apiParameter.optionList, this.businessModuleArr);
          }
        }
      );
    }

  }

}
