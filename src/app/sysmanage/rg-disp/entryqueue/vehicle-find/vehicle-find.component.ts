import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { format} from 'date-fns';
import {HttpClient} from '@angular/common/http';
import { GlobalService } from 'src/app/common/services/global-service.service';
import { removeDisabledFailures } from 'tslint';
import {CommonService} from '@service/common.service';
@Component({
  selector: 'app-vehicle-find',
  templateUrl: './vehicle-find.component.html',
  styleUrls: ['./vehicle-find.component.css'],
})
export class VehicleFindComponent implements OnInit {

  tabs: Array<any> = [];
  inqu: any = {};
  listLoading: boolean = false;
  dataSet: any;
  dataSet1:any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  pageNUm:number;//当前页面序号
  kindArr:Array<any>=[];
  subKindArr:Array<any> = [];
  gateArr=[];
  formId:String;
  carNum:number=0;
  statusArr=[];
  detailArr=[];
  updateData:any=[]
  tplModal: NzModalRef;//操作成功后弹窗属性
  warehouseArr=[];
  statusType:String='';
  modalTitle: string;//弹框的标题
  defaultCreateTime: any;//默认创建时间
  confirmVisible:boolean=false;//确认进厂弹框
  exportLoading:boolean=false;
  tempSearchData: any = {}; // 查询条件
  defaultDate: Date;
  deleteVisible1:boolean=false;
  finishVisible = false;//弹窗显示控制
  isVisible:boolean=false;
  selectedData: string;
  finishCon: string;//弹窗文字内容
  searchDate:Date;
  vehicleNum:number=0;
  totalWeight=0;
  // 计算排队时长定时器
  interval: any;
  private buttonId: any;
  statusTypeSelect:any;
  // 是否开启定时器
  intervalFlag: boolean = false;
  constructor(private fb: FormBuilder, private modal: NzModalService, private http: HttpUtilService,private anhttp: HttpClient, private info: UserinfoService,private nm: NzModalService,private globalSer: GlobalService ,private cm:CommonService,private nz:NzNotificationService,) {
  }

  ngOnInit() {
    const curdate = new Date();
    curdate.setHours(0,0,0);
    curdate.setDate(curdate.getDate() - 7);
    this.defaultDate=curdate;
    this.inqu.startCreateTime=format(curdate,'YYYY-MM-DD HH:mm:ss')
    this.getallCodest();
    this.query();
    // this.interval = setInterval(() => { this.query(); }, 1000*60);
  }

  getNum(){
    this.tabs.forEach(element => {
      element.itemCount=0;
    });
    // this.inqu.statusTypeSelect = this.statusTypeSelect
    this.http.post(RGDISPURL.VEHICLEGETNUM, this.inqu).then(
      // this.http.post(RGDISPURL.VEHICLEGETNUM, {startCreateTime: format(this.defaultDate,'YYYY-MM-DD HH:mm:ss')}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data[0]);
          res.data.data.forEach(ele => {
            for(var i=1;i<this.tabs.length;i++){
              if(ele.statusType == this.tabs[i].statusType){
                this.tabs[i].itemCount=ele.ct;
                this.tabs[0].itemCount+=ele.ct;
              }
            }
          });
        }
      }
    )
  }


  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);
  }


  // 获取表头
  getallCodest(): void {
    const tab: any = {};
    tab.itemCname = "全部";
    tab.statusType = "";
    tab.itemCount = 0;
    tab.formId='form_rgDisp_vehicleFind0';
    this.tabs.push(tab);
    this.tabs.push({itemCname:'超时或已取消',statusType:'disp_queueDetailStatus_0',itemCount:0,formId:'form_rgDisp_vehicleFind1'});
    this.tabs.push({itemCname:'在途',statusType:'disp_queueDetailStatus_1',itemCount:0,formId:'form_rgDisp_vehicleFind2'});
    this.tabs.push({itemCname:'十公里已取号',statusType:'disp_queueDetailStatus_2',itemCount:0,formId:'form_rgDisp_vehicleFind3'});
    this.tabs.push({itemCname:'已叫号',statusType:'disp_queueDetailStatus_3',itemCount:0,formId:'form_rgDisp_vehicleFind4'});
    this.tabs.push({itemCname:'已入厂',statusType:'disp_queueDetailStatus_4',itemCount:0,formId:'form_rgDisp_vehicleFind5'});
    this.tabs.push({itemCname:'已完成',statusType:'disp_queueDetailStatus_5',itemCount:0,formId:'form_rgDisp_vehicleFind6'});

    this.http.post(RGDISPURL.GETCODESET,{'codesetCode':'disp.matKind'}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.kindArr.push(item)
          });
        }
      }
    )

    this.http.post(RGDISPURL.GETCODESET,{'codesetCode':'disp.feigang'}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.subKindArr.push(item);
          });
        }
      }
    )

    this.http.post(RGDISPURL.GETWAREHOUSE,{}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            const item: any = {};
            item.itemCname = element.label;
            item.itemCode = element.value;
            this.warehouseArr.push(item);
          });
        }
      }
    )

    this.http.post(RGDISPURL.GETCODESET,{'codesetCode':'disp.gate'}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.gateArr.push(item);
            //console.log( this.queueArr)
          });
        }
      }
    )

    this.http.post(RGDISPURL.GETCODESET,{'codesetCode':'disp.XZQY'}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.statusArr.push(item);
            //console.log( this.queueArr)
          });
        }
      }
    )

    this.http.post(RGDISPURL.GETCODESET,{'codesetCode':'disp.queueDetailStatus'}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.detailArr.push(item);
            //console.log( this.queueArr)
          });
        }
      }
    )

  }

  pageSizeEmit(data:number){
    console.log(data);
    this.pageSize=data;
  }
  pageIndexEmit(data:number){
    console.log(data);
    this.pageNUm=data;
    this.inqu.page=this.pageNUm;
    this.inqu.length = this.pageSize;
    //this.inqu.page=this.
    this.getListSearch();
  }
  query(){
    this.updateData = []
    this.tabs[0].itemCount=0;
    this.preDateTime();
    this.getNum();
    this.inqu.page = 1; //最好有
    this.pageNUm=1;
    this.inqu.length = this.pageSize || 30;//最好有
    this.inqu.statusType=this.statusType;
    // this.inqu.statusTypeSelect = this.statusTypeSelect

    this.globalSer.pageNumEmitter.emit({
      formId: this.formId,
      gridId: 'grid1',
      length: this.inqu.length,
      page: 1,
      search: true
    });
    this.getListSearch();
  }

  preDateTime(): void {

    // this.inqu.startCreateTime = this.inqu.startCreateTime && this.inqu.startCreateTime instanceof Date ? Utils.dateFormat(this.inqu.startCreateTime, 'yyyy-MM-dd') : this.inqu.startCreateTime || '';
    if(this.carNum == 0 ||this.carNum ==2 ||this.carNum==5){

      this.inqu.startCreateTime = this.inqu.startCreateTime && this.inqu.startCreateTime instanceof Date ? format(this.inqu.startCreateTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.startCreateTime || null;
      this.inqu.endCreateTime = this.inqu.endCreateTime && this.inqu.endCreateTime instanceof Date ? format(this.inqu.endCreateTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.endCreateTime || null;
    }else if(this.carNum == 1){

      this.inqu.startRecReviseTime = this.inqu.startRecReviseTime && this.inqu.startRecReviseTime instanceof Date ? format(this.inqu.startRecReviseTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.startRecReviseTime || null;
      this.inqu.endRecReviseTime = this.inqu.endRecReviseTime && this.inqu.endRecReviseTime instanceof Date ? format(this.inqu.endRecReviseTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.endRecReviseTime || null;
    }else if(this.carNum ==3){
      this.inqu.startQueueStartTime = this.inqu.startQueueStartTime && this.inqu.startQueueStartTime instanceof Date ? format(this.inqu.startQueueStartTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.startQueueStartTime || null;
      this.inqu.endQueueStartTime = this.inqu.endQueueStartTime && this.inqu.endQueueStartTime instanceof Date ? format(this.inqu.endQueueStartTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.endQueueStartTime || null;
    }else if(this.carNum ==4){
      this.inqu.endEntryNoticeTime = this.inqu.endEntryNoticeTime && this.inqu.endEntryNoticeTime instanceof Date ? format(this.inqu.endEntryNoticeTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.endEntryNoticeTime || null;
      this.inqu.startEntryNoticeTime = this.inqu.startEntryNoticeTime && this.inqu.startEntryNoticeTime instanceof Date ? format(this.inqu.startEntryNoticeTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.startEntryNoticeTime || null;
    }else if(this.carNum == 6){
      this.inqu.startFinishTime = this.inqu.startFinishTime && this.inqu.startFinishTime instanceof Date ? format(this.inqu.startFinishTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.startFinishTime || null;
      this.inqu.endFinishTime = this.inqu.endFinishTime && this.inqu.endFinishTime instanceof Date ? format(this.inqu.endFinishTime,'YYYY-MM-DD HH:mm:ss') : this.inqu.endFinishTime || null;
    }
  }

  getListSearch(){
    this.totalWeight=0;//当点击上面的tab，对总重量进行重置
    this.vehicleNum=0;//当点击上面的tab，对车辆数目进行重置
    this.listLoading=true;
    this.tempSearchData = {...this.inqu};
    console.log(this.inqu.intervalHours)
    //this.inqu.startCreateTime=format(this.inqu.startCreateTime,'YYYY-MM-DD');
//  console.log(this.inqu.startCreateTime)
// console.log(this.inqu.endCreateTime)
    this.http.post(RGDISPURL.VEHICLEGET, {...this.inqu}).then(
      (res: any) => {
        if (res.success) {
          this.listLoading=false;
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          this.vehicleNum=res.data.data.data.length;
          res.data.data.data.forEach(element => {
            this.totalWeight+=element.grassWeight;
          });
          this.totalWeight=Number(this.totalWeight.toFixed(2));
        }else{
          this.listLoading=false;
        }
      }
    )
  }

  selectChange(data:any){

    // if(this.carNum ==0 || this.carNum ==2){
    // }else{
    //   this.inqu.startCreateTime=null;
    // }
    this.inqu.endCreateTime=null;
    this.inqu.startRecReviseTime=null;
    this.inqu.endRecReviseTime =null;
    this.inqu.startQueueStartTime=null;
    this.inqu.endQueueStartTime=null;
    this.inqu.endEntryNoticeTime=null;
    this.inqu.startEntryNoticeTime=null;
    this.inqu.startFinishTime=null;
    this.inqu.endFinishTime=null;
    if(this.tempSearchData.startCreateTime){
      this.inqu.startCreateTime = this.tempSearchData.startCreateTime;
    }else{
      this.inqu.startCreateTime = format(this.defaultDate,'YYYY-MM-DD HH:mm:ss');
    }
    // this.inqu.startCreateTime=format(this.defaultDate,'YYYY-MM-DD HH:mm:ss');
    this.formId=this.tabs[this.carNum].formId;
    // switch(this.carNum){
    //   case 0:
    //       this.statusType='';
    //       break;
    //       case 1:
    //         this.statusType='disp_queueDetailStatus_0';break;
    //         case 2:
    //         this.statusType='disp_queueDetailStatus_1';break;
    //         case 3:
    //           this.statusType='disp_queueDetailStatus_2';break;
    //           case 4:
    //             this.statusType='disp_queueDetailStatus_3';break;
    //             case 5:
    //               this.statusType='disp_queueDetailStatus_4';break;
    //               case 6:
    //                 this.statusType='disp_queueDetailStatus_5';break;
    //                 default :
    //                 this.statusType='';
    // }
    this.statusType = data;
    this.statusTypeSelect = `^(${data})`
    this.query();
  }

  delete(data){
    if(data ==undefined){
      this.nz.error('提示信息','请勾选一条数据')
      return
    }
    if(this.cm.canOperate(this.updateData,"status",["disp_queueDetailStatus_35"],"勾选数据待入厂，不可删除")){
      return
    };
    this.modalTitle = '提示信息';
    this.finishVisible = true;
    this.finishCon = '确定要删除此记录?';
    this.selectedData = data.taskId;
  }

  confirm(data){
    if(this.updateData.length!=1){
      this.nz.error('提示信息','请选择一个车辆')
      return
    }
    if(this.cm.canOperate(this.updateData,"status",["disp_queueDetailStatus_00","disp_queueDetailStatus_01","disp_queueDetailStatus_10",
      "disp_queueDetailStatus_15","disp_queueDetailStatus_20","disp_queueDetailStatus_23",
      "disp_queueDetailStatus_27","disp_queueDetailStatus_35","disp_queueDetailStatus_50",],"该车辆未进厂不能操作！")){
      return
    };
    this.modalTitle = '提示信息';
    this.confirmVisible = true;
    this.finishCon = '是否确认出厂?';
    this.selectedData = data.taskId;
  }

  updateDataResult(data:any){
    this.updateData = data
  }

  trans(data){
    if(data ==undefined){
      this.nz.error('提示信息','请勾选一条数据')
      return
    }
    this.http.post(RGDISPURL.TRANSRECORD, {taskId:data.taskId}).then(
      (res: any) => {
        if (res.success) {
          //  this.listLoading=false;
          this.dataSet1 = res.data.data.data;
          // this.totalPage = res.data.data.total;
          //this.query();
        }
      }
    )
    this.isVisible=true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  modalConfirmResult(data){
    if ('ok' === data.type) {
      this.http.post(RGDISPURL.VEHICLEDELETEBYTASKID, {taskId:this.selectedData}).then(
        (res: any) => {
          if (res.success) {
            //this.listLoading=false;
            // this.dataSet = res.data.data.data;
            //this.totalPage = res.data.data.total;
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '删除成功'
            });
            this.query();
          }else{
          }
        }
      )
    }
    this.finishVisible = false;
  }
  deleteResult(data:any){
    if ('ok' === data.type) {
      this.http.post(RGDISPURL.PAUSEVEHICLE, {taskId:this.selectedData}).then(
        (res: any) => {
          if (res.success) {
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '操作成功'
            });
            this.query();
            this.destroyTplModal();
          }
        }
      )
    }
    this.deleteVisible1 = false;
  }

  confirmResult(data:any){
    if ('ok' === data.type) {
      this.http.post(RGDISPURL.CONFIRMOUT, {taskId:this.selectedData}).then(
        (res: any) => {
          if (res.success) {
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '操作成功'
            });
            this.query();
            this.destroyTplModal();
          }
        }
      )
    }
    this.confirmVisible = false;
  }


  pause(data:any){
    if(data ==undefined){
      this.nz.error('提示信息','请勾选一条数据')
      return
    }
    if(this.buttonId =='Suspend'){
      if(this.cm.canOperate(this.updateData,"status",["disp_queueDetailStatus_00","disp_queueDetailStatus_01","disp_queueDetailStatus_10","disp_queueDetailStatus_15","disp_queueDetailStatus_23",
        "disp_queueDetailStatus_35","disp_queueDetailStatus_40","disp_queueDetailStatus_50",],"勾选数据不可暂停")){
        return
      };
    }else{
      if(this.cm.canOperate(this.updateData,"status",["disp_queueDetailStatus_00","disp_queueDetailStatus_01","disp_queueDetailStatus_10","disp_queueDetailStatus_20","disp_queueDetailStatus_23",
        "disp_queueDetailStatus_35","disp_queueDetailStatus_40","disp_queueDetailStatus_50","disp_queueDetailStatus_27"],"勾选数据不可恢复")){
        return
      };
    }
    this.modalTitle = '提示信息';
    //this.finishVisible = true;
    if(data.status == 'disp_queueDetailStatus_20' || data.status == 'disp_queueDetailStatus_27' ){this.finishCon ='是否暂停'}else if(data.status == 'disp_queueDetailStatus_15'){
      this.finishCon = '是否恢复排队'
    }
    //this.finishCon = '确定要暂停此记录?';
    this.selectedData=data.taskId;
    this.deleteVisible1=true;
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  exportExcel(){
    this.exportLoading=true;
    console.log(this.exportLoading);
    let url  = RGDISPURL.EXPORT;
    let param = {...this.inqu};
    this.anhttp.post(url, param, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel;filename=车辆调度信息.xls'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `车辆调度信息.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    setTimeout(() => {
      this.exportLoading=false;
    }, 1000);
    console.log(this.exportLoading);
  }
  btnClick(data:any){
    this.buttonId =  data.buttonId
    switch (data.buttonId){
      case 'Out':
        this.confirm(this.updateData[0]);
        break;
      case 'Process':
        this.trans(this.updateData[0]);
        break;
      case 'Delete':
        this.delete(this.updateData[0]);
        break;
      case 'Suspend':
        this.pause(this.updateData[0]);
        break;
      case 'Recovery':
        this.pause(this.updateData[0]);
        break;
      case 'Export':
        this.exportExcel();
        break;
      case 'Open':
        this.controlInterval();
        break;
      case 'Close':
        this.controlInterval();
        break;
      default:
        break;
    }}

  controlInterval() {
    if (!this.intervalFlag) {
      console.log('开启定时器');
      this.intervalFlag = true;
      this.interval = setInterval(() => { this.query(); }, 1000*60*5);
    } else {
      console.log('关闭定时器');
      this.intervalFlag = false;
      clearInterval(this.interval);
    }
  }

  // controlTabs(data:any){
  //   let arr:any =[]
  //   for(let j = 0;j<this.tabs.length;j++){
  //     for(let i =0;i<data.length;i++){
  //       if(data[i].buttonName===this.tabs[j].itemCname){
  //         arr.push(this.tabs[j])
  //       }
  //     }
  //   }
  //   this.tabs = arr
  //
  //   for(let i= 1;i<arr.length;i++){
  //     if(i!=arr.length-1){
  //       this.statusTypeSelect += `${arr[i].statusType}|`
  //     }else{
  //       this.statusTypeSelect += arr[i].statusType
  //     }
  //   }
  //   this.statusTypeSelect = `^(${this.statusTypeSelect})`
  //   // console.log(this.gateCodeSelect)
  //   this.query()
  // }
  // tabArr:any =[]
  // btnDataReturn(data:any){
  //   console.log(data)
  //   this.tabArr.push(data);
  //   if(this.tabArr.length<=1){
  //     this.controlTabs(this.tabArr[0])
  //   }
  // }
}
