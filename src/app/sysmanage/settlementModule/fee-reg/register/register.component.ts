import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { urls } from '../../../../common/model/url';
import { isPosNum, toDemical } from '../../../../common/validators/validator';
import { UserinfoService } from "../../../../common/services/userinfo-service.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  tplModal: NzModalRef;
  pageSize: number = 30;
  totalPage: number;
  listLoading: boolean = true;
  dataSet: any[] = [];
  modalShow: boolean = false;
  tplTitle:string;
  modalData:any[]=[];
  leftControllArr:any[] = [];
  type: boolean;
  priceType: any[] = [];
  feeArr: any[] = [];
  inpData:any;
  showLeftArea:boolean = true;
  seletedData:any = [];
  selectedLength:Number;
  selectedWeight:number = 0;
  caculateEnameArr: any = [
    { field: 'totalSheet', tipInfo: '已选件数', tipInfoType: '件', demLength: 3 },
    { field: 'totalWeight', tipInfo: '已选重量', tipInfoType: '吨', demLength: 3 }
  ];
  @ViewChild('informationModal') informationModal:TemplateRef<any>;
  informationRadio:string = 'JJFS10';
  proportion:number|string;
  payPrice: number | string;
  receivefeeClien:any = {};
  private searchData: any = {};
  constructor(private http: HttpUtilService, private nm: NzModalService, private nn: NzNotificationService, private info: UserinfoService) {

  }

  ngOnInit() {
   
   //this.getList({length:this.pageSize,page:1});
    this.http.post(urls.static, {valueSetCode: 'JJFS'}).then((res:any) => { //付款方式
        if(res.success){
          this.priceType = res.data.data.data;
        }
     })
    this.http.post(urls.getFee, {companyId:this.info.APPINFO.USER.companyId,type:'10'}).then((res:any) => { //获取费用类型
     if(res.success){
       this.feeArr = res.data.data;
       console.log(this.feeArr);
     }
   })
  }
  listSearch(param:any): void{
    this.searchData = param;
    this.getList(this.searchData);
  }
  informationRegFun(data:any[]){
    let param:any= {waybillList:[]};
    let settleFeeList:any = {agentFlag:'YSBJ10',payableFlag:'YFBJ20',receiveType:'',unitPrice:'',
  totalPrice:'',payReceiveType:'JJFS10',payTotalPrice:'',feeType:'F012',feeName:'信息费'};
  settleFeeList.proportion = this.informationRadio === 'JJFS20' && this.proportion || '';
  settleFeeList.payPrice = this.informationRadio === 'JJFS10' && this.payPrice || '';
  settleFeeList.receivefeeClientName = this.receivefeeClien.receivefeeClientName;
  settleFeeList.receivefeeClientNo = this.receivefeeClien.receivefeeClientNo;
   data.map((x:any)=>{
     let o:any = {};
        o.waybillNo = x.waybillNo;
        param.waybillList.push(o);
   });
   param.settleFeeList = [settleFeeList];
    this.http.post(urls.informationFeeRegistration,param).then((res:any)=>{
      if(res.success){
        this.nn.create('success','提示信息','信息费登记成功',{nzDuration:3000});
      //  this.getList({length:this.pageSize,page:1});
        this.getList(this.searchData);
        this.tplModal.destroy();
      }
    });
  }
  register(data:any){//登记
    if(!data.data[0]){
      this.tplModal = this.nm.warning({
              nzTitle: '提示信息',
              nzContent: '请选择数据进行操作。'
            });
      this.destroyTplModal();
      return;
    }
    if(data.type.buttonId === 'information'){
  this.tplModal = this.nm.create({
        nzTitle:'信息费登记',
        nzContent: this.informationModal,
        nzOnOk:()=>{
          if(!this.receivefeeClien.receivefeeClientNo){
            this.nn.remove();
            this.nn.create('error','提示信息','请选择收款单位',{nzDuration:3000});
            return false;
          }
          if( this.informationRadio === 'JJFS10' && (this.payPrice === '' || this.payPrice === undefined)){
            this.nn.remove();
            this.nn.create('error','提示信息','请填写单价',{nzDuration:3000});
            return false;
          }
          if( this.informationRadio === 'JJFS20' && (this.proportion === '' || this.proportion === undefined)){
            this.nn.remove();
            this.nn.create('error','提示信息','请填写运费百分比',{nzDuration:3000});
            return false;
          }
          this.informationRegFun(data.data || []);
          return false;
        }
      })
      return;
    }
    this.selectedWeight = 0;
    this.selectedLength = data.data.length;
    data.data.forEach(element => {
      this.selectedWeight += Number(element.totalWeight);
    });
    
    if(data.type.buttonId !== 'regiter'){ //登记按钮
       return;
    }
   
    
    for(let d of data.data){
      if (d.settleFlag != 'FYDJ10'){
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '存在已登记数据，请重新选择。'
        });
        this.destroyTplModal();
        return;
      }
      if (!d.consignorCompanyId || d.consignorCompanyId == '') {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '委托单位不存在，不能进行登记！'
        });
        this.destroyTplModal();
        return;
      }
    }
    this.seletedData = data.data;
    
   
    if (data.data.length > 1) {
      this.showLeftArea = false;
    }else{
      this.showLeftArea = true;
    }
    this.modalShow = true;
    this.modalData  = [];
    this.tplTitle = `费用登记 > 登记`;
    this.feeArr.map((item:any) => {
       let temp:any = {};
      temp.payType = 'JJFS10'; //默认单价
      temp.payReceiveType = 'JJFS10';
      temp.feeId = item.feeId;
      temp.feeName = item.feeName;
       temp.unitPrice = '';
      temp.payPrice = '';
       temp.totalPrice = '';
      temp.payTotalPrice = '';
      if (item.feeType == 'FYLX30'){
        temp.agentFlagDis = true;
        temp.payableFlagDis = true;
      } else if (item.feeType == 'FYLX10'){
        temp.agentFlagDis = true;
        temp.payableFlagDis = false;
      } else if (item.feeType == 'FYLX20'){
        temp.agentFlagDis = false;
        temp.payableFlagDis = true;
      }
       this.modalData.push(temp);
    });
  
    this.leftControllArr = [
      {name:'运单号',model:data.data[0].waybillNo},
      { name: '委托单位', model: data.data[0].consignorCompanyName},
      { name: '起始地', model: data.data[0].startAddress},
      { name: '目的地', model: data.data[0].endAddress},
      {name:'车船号',model:data.data[0].travelNo},
      { name: '运输日期', model: data.data[0].shipDate},
      {name:'重量',model:data.data[0].totalWeight},
      {name:'驾驶员',model:data.data[0].driverName}
    ];
    this.type = false;
  }
  update(data:any){ //修改
    this.selectedWeight = 0;
    data.data.forEach(element => {
      this.selectedWeight += Number(element.totalWeight);
    });
    if(!data.data[0]){
    this.tplModal =  this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '请选择数据进行操作。'
          });
          this.destroyTplModal();
      return;
    }
    if(data.data.length>1){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请单选进行修改操作'
      });
      this.destroyTplModal();
      return;
    }
    

    for (let d of data.data) {
      if (d.settleFlag != 'FYDJ20') {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '该费用未登记，不能进行修改'
        });
        this.destroyTplModal();
        return;
      }
    }
    this.seletedData = data.data;

    this.modalData  = [];
    //获取修改弹窗的信息
    let updateInfo = [];
    let url = urls.getWaybillFeeUpdateInfo;
    let param = {waybillNo:data.data[0].waybillNo};
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        updateInfo = res.data.data || [];
        // console.log(updateInfo);
        this.modalShow = true;
        this.tplTitle = `费用登记 > 修改`;
        this.type = true;
        this.feeArr.map((item: any) => {
          let temp: any = {};
          // temp.payType = data.data[0].payType;
          // temp.agentFlag = data.data[0].agentFlag;
          // temp.payableFlag = data.data[0].payableFlag;
          
          temp.feeId = item.feeId;
          temp.feeName = item.feeName;
          if (item.feeType == 'FYLX30') {
            temp.agentFlagDis = true;
            temp.payableFlagDis = true;
          } else if (item.feeType == 'FYLX10') {
            temp.agentFlagDis = true;
            temp.payableFlagDis = false;
          } else if (item.feeType == 'FYLX20') {
            temp.agentFlagDis = false;
            temp.payableFlagDis = true;
          }
          // temp.receivefeeClientName =  data.data[0].receivefeeClientName;
          // item.receivefeeClientNo = data.data[0].receivefeeClientNo;
          // temp.unitPrice =  data.data[0].unitPrice;
          // temp.totalPrice = data.data[0].totalPrice || data.data[0].unitPrice*data.data[0].totalWeight;
          this.modalData.push(temp);
        });
        // console.log(this.modalData);
        for (let m of this.modalData) {
          for (let u of updateInfo) {
            if (m.feeId == u.feeType) {
              m.agentFlag = u.agentFlag == 'YSBJ20'?true:false;
              m.payableFlag = u.payableFlag == 'YFBJ20'?true:false;
              m.payType = u.receiveType; 
              m.unitPrice = u.unitPrice;
              m.totalPrice = u.totalPrice;
              m.payPrice = u.payPrice || '';
              m.payTotalPrice = u.payTotalPrice || '';
              m.payReceiveType = u.payReceiveType;
              m.payPrice = u.payPrice;
              m.payTotalPrice = u.payTotalPrice;
              m.receivefeeClientName = u.receivefeeClientName;
              m.receivefeeClientNo = u.receivefeeClientNo;
              m.rowid = u.rowid;
              m.settleSubno = u.settleSubno;
              m.settleNo = u.settleNo;
            }
          }
        }
      }
    })
   
    this.leftControllArr = [
      { name: '运单号', model: data.data[0].waybillNo },
      { name: '委托单位', model: data.data[0].consignorCompanyName },
      { name: '起始地', model: data.data[0].startAddress },
      { name: '目的地', model: data.data[0].endAddress },
      { name: '车船号', model: data.data[0].travelNo },
      { name: '运输日期', model: data.data[0].shipDate },
      { name: '重量', model: data.data[0].totalWeight },
      { name: '驾驶员', model: data.data[0].driverName }
    ];
  }
  confirm(){
    let confirmParam = { settleFeeList: [], waybillList: [], waybillNo:''},temp = [];
    this.modalData.map(
      (data) => {
        if(data.agentFlag || data.payableFlag){
           temp.push(data);
        }
      }
    );
    if(!temp[0]){
      this.tplModal =  this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '没有要提交的数据'
      });
      this.destroyTplModal();
      return;
    };

    for(let i=0;i<temp.length;i++){
      let status:boolean =true;
        if (temp[i].agentFlag){  //选中应收则应收单价、应收总价不能为空
          if (!(temp[i].unitPrice && temp[i].totalPrice)){
            status = false;
          }
        }
        if (temp[i].payableFlag) {  //选中应付则应付单价、应付总价不能为空
          if (!(temp[i].payPrice && temp[i].payTotalPrice)){
            status = false;
          }
        }
        if(status){
           console.log('pass');
           let obj:any = {};
          obj.agentFlag = temp[i].agentFlag ? 'YSBJ20' :'YSBJ10'; //应收是否选中
          obj.payableFlag = temp[i].payableFlag ? 'YFBJ20' :'YFBJ10'; //应付是否选中

          obj.receiveType = temp[i].agentFlag ? temp[i].payType : ''; //应收计价方式
          obj.unitPrice = temp[i].agentFlag ?temp[i].unitPrice:''; //应收单价
          obj.totalPrice = temp[i].agentFlag ?temp[i].totalPrice:''; //应收总价

          obj.payReceiveType = temp[i].payableFlag ? temp[i].payReceiveType : ''; //应付计价方式
          obj.payPrice = temp[i].payableFlag ?temp[i].payPrice:'';   //应付单价
          obj.payTotalPrice = temp[i].payableFlag?temp[i].payTotalPrice:'';   //应付总价

          // obj.receiveType = temp[i].payType; //应收计价方式
          // obj.unitPrice = temp[i].unitPrice; //应收单价
          // obj.totalPrice = temp[i].totalPrice; //应收总价

          // obj.payReceiveType = temp[i].payReceiveType; //应付计价方式
          // obj.payPrice = temp[i].payPrice;   //应付单价
          // obj.payTotalPrice = temp[i].payTotalPrice;   //应付总价

           obj.feeType  = temp[i].feeId;
           obj.feeName  = temp[i].feeName;
           obj.receivefeeClientName =   temp[i].receivefeeClientName;
           obj.receivefeeClientNo =  temp[i].receivefeeClientNo;
         
          console.log(this.type);
           if(this.type){
             obj.rowid = temp[i].rowid;
             obj.settleSubno = temp[i].settleSubno;
             obj.settleNo = temp[i].settleNo;
           }
           confirmParam.settleFeeList.push(obj);
        }else{
          this.tplModal =  this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '要提交的数据还有未填写价格信息的'
          });
          this.destroyTplModal();
          return;
        }
    }
    confirmParam.waybillList = [];
    this.seletedData.forEach(element => {
      let obj:any = {};
      obj.waybillNo = element.waybillNo;
      confirmParam.waybillList.push(obj);
    });
    confirmParam.waybillNo = confirmParam.waybillList[0].waybillNo;
    !this.type?this.feeRegisterFun(confirmParam):this.feeUpdateFun(confirmParam);
  }
  cancel(){
    this.modalShow = false;
  }
  getList(param:any): void{ //获取列表
    this.listLoading = true;
    this.dataSet = [];
    this.http.post(urls.WaybillFeeRegisterList,param).then(
      (res:any) => {
        this.listLoading = false;
          if(res.success){
            this.dataSet = res.data.data && res.data.data.data;
            this.totalPage = res.data.data && res.data.data.total;
          }
      }
    )
  }
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };
  priceChange(type:number,data:any){
    console.log(data);
     if(type === 10){
      //  console.log(data.unitPrice);
       if(!isPosNum(data.unitPrice)){
        data.unitPrice = '';
        data.totalPrice = '';
        return;
       }
      
        data.totalPrice = data.unitPrice * this.selectedWeight;
     } else if (type === 20){
      if(!isPosNum(data.totalPrice)){
        data.totalPrice = '';
        data.unitPrice = '';
        return;
       }
       
       data.unitPrice = data.totalPrice / this.selectedWeight;
     }else if(type === 30){
       if (!isPosNum(data.payPrice)) {
         data.payPrice = '';
         data.payTotalPrice = '';
         return;
       }
       
       data.payTotalPrice = data.payPrice * this.selectedWeight;
     }else{
       if (!isPosNum(data.payTotalPrice)) {
         data.payPrice = '';
         data.payTotalPrice = '';
         return;
       }
       
       data.payPrice = data.payTotalPrice / this.selectedWeight;
     }
     if(data.agentFlag){
       data.unitPrice = (data.unitPrice || data.unitPrice == 0) && toDemical(data.unitPrice, 3) || '';
       data.totalPrice = (data.totalPrice || data.totalPrice == 0) && toDemical(data.totalPrice, 2) || '';
     }
    if (data.payableFlag){
      data.payPrice = (data.payPrice || data.payPrice == 0) && toDemical(data.payPrice, 3) || '';
      data.payTotalPrice = (data.payTotalPrice || data.payTotalPrice == 0) && toDemical(data.payTotalPrice, 2) || '';
    }
    
  };
  feeRegisterFun(param:any){
    const url =urls.addFeeRegister; // urls.updateFeeRegister;//urls.addFeeRegister原本的登记接口
    console.log(param);
    this.http.post(url,param).then(
      (res:any) => {
        if(res.success){
          console.log(res);
          this.modalShow = false;
          this.nn.create('success','提示信息','费用登记成功',{nzDuration:3000});
         // this.getList({length:this.pageSize,page:1});
         this.getList(this.searchData);
        }
      }
    );
  }
  feeUpdateFun(param:any){
    this.http.post(urls.updateFeeRegister,param).then(
      (res:any) => {
        if(res.success){
          console.log(res);
          this.nn.create('success','提示信息','费用登记修改成功',{nzDuration:3000});
          this.modalShow = false;
         // this.getList({length:this.pageSize,page:1});
         this.getList(this.searchData);
        }
      }
    );
  }

  inpEmit(data:any,item:any){
    this.inpData = data;
    item.receivefeeClientName = data.inpName;
    item.receivefeeClientNo = data.inpValue;

  }
}
