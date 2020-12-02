/**
 * 业务分款  新页面，上下列表调换
 */
import { Component, OnInit, ViewChild  } from '@angular/core';
import { urls } from '../../../../common/model/url';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { GlobalService } from '../../../../common/services/global-service.service';
import {NzModalRef,NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { isPosNum } from '../../../../common/validators/validator';
import { Utils } from '../../../../common/util/utils';
@Component({
  selector: 'app-rev-write-off2',
  templateUrl: './rev-write-off2.component.html',
  styleUrls: ['./rev-write-off2.component.css']
})
export class RevWriteOff2Component implements OnInit {
  settleRec:any[];//收款信息
  settleReport:any[];//结算报表
  settleRecTemp:any[] = [];//收款信息 原有得到数据要保存一份
  settleReportTemp:any[] = [];//结算报表 原有的数据保存
  modalData:any[];//弹窗
  pageSize1:number = 30;
  pageSize2:number = 30;
  pageSize3:number = 30;
  total1: number;
  total2: number;
  total3: number;
  selectData1Temp:any[] = []; //原有得到数据要保存一份,选择的
  selectData2Temp:any[] = [];//原有得到数据要保存一份,选择的
  selectDataTrue:any = {surplusAmount:0,allocationAmount:0};//包含过去已经分配过的  未分配金额 已分配金额
  selectData1:any[] = [];
  selectData2:any[] = [];
  modalSelectData:any[] = [];
  isLoading: boolean = true;
  tplModal: NzModalRef;
  confirmModal: NzModalRef;
  modaltotal: number;
  modalTitle: string;
  modalContent:string;
  confirmStatus:string;
  accAuto:boolean;
  accApply:boolean;
  tabIndex:number = 0;
  whyData:string;
  tabArr:any[] = [{name:'未处理',tableType:10},{name:'已处理',tableType:20}];
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('applyTitle') applyTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  @ViewChild('confirmContent') confirmContent;
  @ViewChild('confirmFooter') confirmFooter;
  @ViewChild('why') why;
  private searchData: any = {};
  constructor(private http: HttpUtilService, private glo: GlobalService, private nz: NzNotificationService, private modal: NzModalService) { }

  ngOnInit() {
  //  this.getSettleRec(urls.settleRec,{page:1,length:this.pageSize1,tableType:10},1);
  //  this.getSettleRec(urls.settleReport,{page:1,length:this.pageSize2,tableType:10},2);
  }
  listSearch(data:any){
    // this.tabIndex = 0;
    data.length = data.length?data.length:this.pageSize1;
    data.tableType =this.tabIndex == 0?10:20;
    this.searchData = data;
    this.getSettleRec(urls.settleRec,data,1);
    this.getSettleRec(urls.settleReport,{page:1,length:this.pageSize2,tableType:10},2);//重置
  }
  btnClick(type:any){ //按钮点击
    console.log(this.selectData1,this.selectData2);
    if ((type.buttonId === 'sub') && (!this.selectData1[0])){
      this.glo.modalOpen({ type: 'warning', title: '提示信息', content: '请选择数据进行操作' });
      return;
    }
    if ((type.buttonId === 'del') && !this.selectData1[0]){
      this.glo.modalOpen({ type: 'warning', title: '提示信息', content: '请选择数据进行操作' });
      return;
    }
    if(type.buttonId === 'sub'){//分款
       this.modalTitle = '分款确认';
       this.modalContent = "确定要将勾选的数据进行分款？";
       this.confirmStatus = 'sub';
       this.tplModal = this.glo.createModal({tplTitle:this.tplTitle,tplContent:this.confirmContent,tplFooter:this.confirmFooter});

    }else if(type.buttonId === 'acc'){//平账
      this.confirmStatus = 'acc';
      this.tplModal = this.glo.createModal({width:'70%',tplTitle:this.applyTitle,tplContent:this.tplContent,tplFooter:this.tplFooter});
      this.getModalList({});

     // this.settleAccounts();
    }else if(type.buttonId === 'del'){
      this.modalTitle = '作废确认';
      this.modalContent = "确定要将勾选的数据进行作废？";
      this.confirmStatus = 'del';
      this.tplModal = this.glo.createModal({tplTitle:this.tplTitle,tplContent:this.confirmContent,tplFooter:this.confirmFooter});

    }
  }
  tabFun(data:any){ //tab
    window.setTimeout(()=>{
      this.tabIndex = data.tableType == 10?0:1;
      this.selectData1 = [];
      this.searchData.page = 1;
      this.searchData.tableType = data.tableType;
      this.getSettleRec(urls.settleRec,{...this.searchData},1);
     // this.getSettleRec(urls.settleRec,{page:1,length:this.pageSize1,tableType:data.tableType},1);
      this.getSettleRec(urls.settleReport, { page: 1, length: this.pageSize2, tableType: data.tableType }, 2);
    })
  }
  selectData1Fun(data:any){//选中1 单选
   const beforeData = this.settleRecTemp.filter((x:any)=>x.settleRecNo === (this.selectData1[0] && this.selectData1[0].settleRecNo));
   const n = this.selectData2.map((x:any)=>x.allocationAmount).reduce((x,y)=>Number(x)+Number(y),0);
  
   if(data[0] && (n > Number(data[0].surplusAmount)) ){
     this.modal.warning({
       nzTitle: '提示信息',
       nzContent: '选中的结算报表数据的分配金额大于收款信息的未分配金额，请重新分配'
     })
     window.setTimeout(()=>{
      data[0].checked = false;
     })
     return;
   }

    this.selectData1Temp = [];
    this.selectDataTrue.surplusAmount = 0;
    this.selectDataTrue.allocationAmount = 0;
    this.selectData1 = data;
    if( this.tabIndex == 1){
      return;
    }
    if(this.selectData1[0]){
      this.selectDataTrue.surplusAmount = this.selectData1[0].surplusAmount;
      this.selectDataTrue.allocationAmount = this.selectData1[0].allocationAmount;
   }
   data.map((item:any) => {this.selectData1Temp.push(Object.assign({},item))});//保留一份
   if(beforeData[0]){
       this.settleRec.map((x:any)=>{
         if(x.settleRecNo === beforeData[0].settleRecNo){
          x.surplusAmount = beforeData[0].surplusAmount;
          x.allocationAmount= beforeData[0].allocationAmount;
         }
       });
   }
   if(data[0]){
     //n代表已分配的金额    
     this.selectData1[0].surplusAmount =  Number(this.selectData1[0].surplusAmount) - n;
     this.selectData1[0].allocationAmount =  Number(this.selectData1[0].allocationAmount) + n;
   }
   
   /* if( this.tabIndex == 1){
      return;
    }
  
    this.settleRecTemp.map((item:any,i:number) => { //重置之前选的
      let list = Object.assign({},item);
      this.settleRec[i].surplusAmount = list.surplusAmount;
      this.settleRec[i].allocationAmount = list.allocationAmount;

   })
 
   if(this.selectData1[0]){
      this.selectDataTrue.surplusAmount = this.selectData1[0].surplusAmount;
      this.selectDataTrue.allocationAmount = this.selectData1[0].allocationAmount;
   }
   data.map((item:any) => {this.selectData1Temp.push(Object.assign({},item))});//保留一份
   this.getSettleRec(urls.settleReport,{page:1,length:this.pageSize2,tableType:10,settleRecNo:data[0]&&data[0].settleRecNo},2);*/
  
  }

  selectData2Fun(data:any){//选中2
    
    /*可能会变*/
  /*  let allocationAmount = 0;
    this.settleReport.filter((x:any)=>!x.checked).map((x:any)=>{
      allocationAmount = Utils.add(x.allocationAmount,allocationAmount);
      x.allocationAmount = 0;
    });
    this.selectData1[0] && ( this.selectData1[0].surplusAmount = Utils.add(this.selectData1[0].surplusAmount,allocationAmount) );
    this.selectData1[0] && ( this.selectData1[0].allocationAmount = Utils.sub(this.selectData1[0].allocationAmount,allocationAmount) );*/
   /* this.selectData2.map((x:any) => {
      x.allocationAmount = '';
    });*/

    if(this.selectData2.length > data.length){
      const c = !data[0] ? this.selectData2 : this.selectData2.filter((x:any)=> data.indexOf(x) === -1);
      console.log(this.settleReportTemp);
     console.debug(c);
      c.map((x:any) => {
        x.allocationAmount = '';
       const d = this.settleReportTemp.filter((y:any)=>x.settleReportNo === y.settleReportNo);
       x.surplusAmount = d[0].surplusAmount;
       x.flatAmount =  d[0].flatAmount;
      })
    }
    this.selectData2 = data;

    if(data[0]){
      data.map((x:any) => {
        if(x.allocationAmount === '' || x.allocationAmount === null || x.allocationAmount === undefined){
          x.allocationAmount = 0;
        }
      })
    }
    const divisionSettleReportList = this.selectData2.map((x:any)=> { return {settleReportNo: x.settleReportNo} });
    this.searchData.page = 1;
    this.searchData.tableType = 10;
    this.getSettleRec(urls.settleRec,{...this.searchData, divisionSettleReportList:divisionSettleReportList},1);
   // this.getSettleRec(urls.settleRec,{page:1,length:this.pageSize2,tableType:10,divisionSettleReportList:divisionSettleReportList},1);
    
  }
  getSettleRec(url:string,param:any,type:number){
    this.isLoading = true;
    this.http.post(url,param).then((res:any)=>{
      this.isLoading = false;
      if(res.success){
         if(type === 1){
            this.settleRec = [];
            this.settleRecTemp = [];
            this.settleRec =  res.data.data&&res.data.data.data || [];
            this.total1 = res.data.data&&res.data.data.total;
            this.settleRec.map((item:any) => {
               let list = Object.assign({},item);
               this.settleRecTemp.push(list);

            })
         } else {
           this.settleReport = [];
           this.settleReportTemp = [];
           this.selectData2 = [];
           this.settleReport =  res.data.data&&res.data.data.data || [];
           this.total2 = res.data.data&&res.data.data.total;

           this.settleReport.map( (data:any) => {
             data.allocationAmount =  data.isRelation == 10?data.allocationAmount:'';
             let list = Object.assign({},data);
             this.settleReportTemp.push(list);
            // data.allocationAmount = '0.00';
         //   param.tableType == 20 && (data.editstate = 0);
        //     if(param.settleRecNo){
            //  data.isRelation == 10 && (data.allocationAmount = data.thisRecDivisionAmount);//带出已分配的
          //    data.checked = data.isRelation == 10?true:false; //有关联的自动勾选
           //   data.checked?this.selectData2.push(data):null; //自动分配
           //   data.checked?data.disabled = true:null;//有关联的选择不能去掉
          //   }
            })
              this.settleReport.filter((x:any)=> x.checked).map((x:any)=>{
                this.selectDataTrue.surplusAmount = Utils.add(this.selectDataTrue.surplusAmount,x.allocationAmount);
                this.selectDataTrue.allocationAmount = Utils.sub(this.selectDataTrue.allocationAmount,x.allocationAmount);
              })
         }
      }
    })
  }
  divisionMoney(){ //分款
    let param = {settleRecNo:this.selectData1[0].settleRecNo,divisionSettleReportList:[]};
    this.selectData2.map( (item:any) => {
       let temp:any = {};
       temp.allocationAmount = item.allocationAmount;
       temp.settleReportNo = item.settleReportNo;
       param.divisionSettleReportList.push(temp);
    })
    this.http.post(urls.divisionMoney,param).then(
      (res:any) => {
        if(res.success){
          this.nz.create('success','提示信息','分款成功',{nzDuration:3000});
          this.tplModal.destroy();
          this.searchData.page = 1;
          this.searchData.tableType = 10;
          this.getSettleRec(urls.settleRec,{...this.searchData},1);
         // this.getSettleRec(urls.settleRec,{page:1,length:this.pageSize1,tableType:10},1);
          this.getSettleRec(urls.settleReport,{page:1,length:this.pageSize2,tableType:10},2);
        }
      }
    )
  }
  settleAccounts(url:string,type:number):void{ //平账
    let param:any = { settleReportList:[]};
    this.modalSelectData.map((item:any)=>{
      let temp:any = {};
      temp.settleReportNo = item.settleReportNo;
      param.settleReportList.push(temp);
    })
    param.reason = type === 1?this.whyData:undefined;
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.nz.create('success', '提示信息', '平账成功', { nzDuration: 3000 });
          this.searchData.page = 1;
          this.searchData.tableType = 10;
          this.getSettleRec(urls.settleRec,{...this.searchData},1);
         // this.getSettleRec(urls.settleRec, { page: 1, length: this.pageSize1, tableType: 10 }, 1);
          this.getSettleRec(urls.settleReport, { page: 1, length: this.pageSize2, tableType: 10 }, 2);
          this.tplModal.destroy();
          this.confirmModal.destroy();
        }
      }
    )
  }
  //作废
  cancellation(){
    let param = {settleRecNo:this.selectData1[0].settleRecNo};
    this.http.post(urls.updateDivisionMoneyToVoid,param).then((res:any) => {
      if(res.success){
        this.nz.create('success', '提示信息', '作废成功', { nzDuration: 3000 });
        this.tabIndex = 1;
       // this.getSettleRec(urls.settleRec,{page:1,length:this.pageSize1,tableType:20},1);
       this.searchData.page = 1;
       this.searchData.tableType = 20;
       this.getSettleRec(urls.settleRec,{...this.searchData},1);
        this.tplModal.destroy();
      }
    })
  }
  modalAuto(){ //自动平账
    if(!this.modalSelectData[0]){
      this.glo.modalOpen({ type: 'warning', title: '提示信息', content: '请选择数据进行操作' });
      return;
    }

    this.modalTitle = '自动平账确认';
    this.modalContent = "确定要将勾选的数据进行自动平账？";
    this.confirmStatus = 'acc';
    this.accAuto = true;
    this.confirmModal = this.glo.createModal({tplTitle:this.tplTitle,tplContent:this.confirmContent,tplFooter:this.confirmFooter});
   // this.settleAccounts();
  }
  modalApply(){ //申请平账
    if(!this.modalSelectData[0]){
      this.glo.modalOpen({ type: 'warning', title: '提示信息', content: '请选择数据进行操作' });
      return;
    }

    this.modalTitle = '申请平账原因';
  //  this.modalContent = this.why;
    this.confirmStatus = 'why';
    this.accApply = false;
    this.whyData = '';
    this.confirmModal = this.glo.createModal({tplTitle:this.tplTitle,tplContent:this.why,tplFooter:this.confirmFooter});

  }
  modalCancel(num:number){ //取消弹窗
    console.log(this.confirmStatus,num);
    if(this.confirmStatus === 'sub' || this.confirmStatus === 'del'){
        this.tplModal.destroy();
    };
    if(this.confirmStatus === 'acc'){
       num === 1?this.tplModal.destroy():this.confirmModal.destroy();
    }
    if(this.confirmStatus ==='why') {
    /*  if( this.accApply){
        this.confirmModal.destroy();
        this.accApply = false;
      }else{
        this.tplModal.destroy();
      }*/
      num === 1?this.tplModal.destroy():this.confirmModal.destroy();
    }
  }
  modalSelectDataFun(data:any){ //弹窗选择数据
    console.log(data);
    this.modalSelectData = data;
  }
  modalConfirm(){ //弹窗确定
    if(this.confirmStatus === 'sub'){
      this.divisionMoney();
    }else if(this.confirmStatus === 'acc'){
   //   this.accAuto?this.settleAccounts(urls.settleAccounts,0):null;
      this.settleAccounts(urls.settleAccounts,0);

    }else if(this.confirmStatus === 'del'){
      this.cancellation();
    }else  if(this.confirmStatus ==='why') {
      //this.accApply?this.settleAccounts(urls.applyFlatfee,1):null;
      this.settleAccounts(urls.applyFlatfee,1);
    }
  }
  inputBlur(data:any){ //失焦
    
  }
  //分账选择

  inputModelFun(data:any){
    if(!isPosNum(data.val)){ 
     let val = parseFloat(data.val);
     data.input.value = isNaN(val)?0: Math.abs(val);
    }
   // data.data.checked = true;
    data.data.allocationAmount = data.input.value;
    let t = 0;
    this.settleReport.filter( (x:any) => x.checked && (x.settleReportNo !== data.data.settleReportNo) ).map((x:any)=> t = Utils.add(t,x.allocationAmount));//下表已分配的 ，不包含本次
    let reportArr = this.settleReportTemp.filter((x:any)=> x.settleReportNo === data.data.settleReportNo);//结算报表号唯一,下表
    let reportTempAllocationAmount = reportArr[0].allocationAmount;//下表初始的有关联的分款金额 不变
     let currentMaxValue = Utils.sub(this.selectDataTrue.surplusAmount,t);
     if(this.selectData1[0] && (data.input.value > currentMaxValue ) ){
        data.input.value = currentMaxValue;
        data.data.allocationAmount = currentMaxValue;
     }
     this.selectData1[0] && ( this.selectData1[0].surplusAmount = Utils.sub(currentMaxValue,data.data.allocationAmount) );   //上剩余分配/未分配
     this.selectData1[0] && ( this.selectData1[0].allocationAmount =  Utils.add(Utils.add(this.selectDataTrue.allocationAmount,t),data.data.allocationAmount) );//上已分配
     data.data.flatAmount = Utils.add(Utils.sub(reportArr[0].flatAmount,reportTempAllocationAmount),data.data.allocationAmount); //下已收
     data.data.surplusAmount = Utils.sub(Utils.add(reportArr[0].surplusAmount,reportTempAllocationAmount),data.data.allocationAmount);//下未收

    // data.data.checked && this.selectData2.push(data.data);
    // this.selectData2 = this.selectData2.filter(item => item.settleReportNo != data.data.settleReportNo);
   //  this.selectData2 = [...this.selectData2,data.data];
  }

  modalSearch(data:any){
    this.getModalList(data);
  }
  //获取弹窗自动平账列表
  getModalList(param:any){
    this.http.post(urls.selectCanLeveledAccountSettleReport,param).then((res:any)=>{
        if(res.success){
          this.modalData = [];
          this.modalData = res.data.data&&res.data.data.data || [];
          this.modaltotal = res.data.data&&res.data.data.total;
        }
    })
  }
}
