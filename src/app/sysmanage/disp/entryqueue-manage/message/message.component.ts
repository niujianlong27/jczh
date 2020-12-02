import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { DISPURL } from '../../../../common/model/dispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {DatePipe} from "@angular/common"

@Component({
  selector: 'app-test',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  
  modalFormData: Array<any> = [];

  modalFormData1:Array<any> =[
      {name: '消息类型',  eName: 'msgType', type: 'select', validateCon: '请输入消息类型', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '消息标题', eName: 'msgTitle', type: 'text', validateCon: '请输入消息标题', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '消息内容', eName: 'msgBod', type: 'textarea', validateCon:'请输入消息内容', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    }
  ];

  modalFormData2:Array<any> =[
      {name: '消息类型',  eName: 'msgType', type: 'select', validateCon: '请输入消息类型', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '消息标题', eName: 'msgTitle', type: 'text', validateCon: '请输入消息标题', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '消息内容', eName: 'msgBod', type: 'textarea', validateCon:'请输入消息内容', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },

    {name: '开始时间', eName: 'startTime', type: 'date', validateCon: '请输入开始时间', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '结束时间', eName: 'endTime', type: 'date', validateCon: '请输入结束时间', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '品种', eName: 'kindCode', type: 'select1', validateCon: '请输入品种', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '排队状态', eName: 'queueStatus', type: 'select2', validateCon: '请输入状态', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '间隔时间', eName: 'timeInterval', type: 'num1', validateCon: '请输入间隔时间', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '提示次数', eName: 'maxCount', type: 'num', validateCon: '请输入次数', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    }
  ];

  modalFormData3:Array<any> =[
      
    {name: '消息类型',  eName: 'msgType', type: 'select', validateCon: '请输入消息类型', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '消息标题', eName: 'msgTitle', type: 'text', validateCon: '请输入消息标题', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '消息内容', eName: 'msgBod', type: 'textarea', validateCon:'请输入消息内容', require: true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '接收人手机', eName: 'receiver', type: 'text', validateCon: '请输入接收人手机', require: true,
      validators:{
        require: true,
        pattern: true,
        patternStr:'1[3|4|5|7|8][0-9]{9}',
        patternErr:'不是正确的手机号'
      }
    }
  ];
  //modalFormData1: Array<any> = JSON.parse(JSON.stringify(this.modalFormData));

  msgType="公告";
  dateFormat = 'yyyy-MM-dd HH:mm:ss';
  dataSet:any;
  modalTitle: string;
  pageSize:number = 30;//条数
  totalPage:number;//数据总条数
  listLoading:boolean = true;
  selectedData:Array<any> = [];
  // 数据弹出框
  disable:boolean = false; 

  isOkLoading = false;
  queueList:Array<any> = [];//排队状态的集合
  kindList:Array<any> = [];//品种的下拉列表的集合
  msgList:Array<any> = [];//公告类型的下拉列表的集合
  modalValidateForm: FormGroup;
  modalFormVisible = false;
  private status:string;// add添加，update更新
  private rowid:number;//记录rowid;
  searchData:any;  //存储查询的数据
  updateSet:any={};
  param: any = {};
  // 提示弹框
  tplModal: NzModalRef;
  
  constructor(private fb: FormBuilder, private http: HttpUtilService, private modal: NzModalService, private nz: NzNotificationService, private info: UserinfoService ,private datePipe:DatePipe) { }

  ngOnInit() {
    this.getCodeset();
    this.listSearch({page:1,length:this.pageSize});
    this.modalValidateForm = this.fb.group({});
    this.modelChange('XXLX10');
  /*  this.modalFormData=this.modalFormData1;
  //  this.modalFormData =  this.modalFormData?this.modalFormData:[];
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts:Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '',validatorOrOpts
      ));
    
    }*/
    

  }

  listSearch(data:any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }
  
  getListSearch(data:any): void{ //获取列表
    const params = {url: '', data: {}, method: 'POST'};
    params.url = DISPURL.GETMESSAGEURL;
    params.data = data;
    this.http.request(params).then(
      (res:any) => {
        this.listLoading = false;
        if(res.success){
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }
  
  //小代码
  getCodeset(): void {
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            //debugger;
            if (element.codesetCode == 'XXLX') {
              this.msgList.push(element);
            }
            if (element.codesetCode == 'XXPZ') {
              this.kindList.push(element);
            }
            if (element.codesetCode == 'XXPDZT') {
              this.queueList.push(element);
            }
          });
        }
      }
    )
  }

//添加
btnAdd() : void {

  this.disable=false;
  this.modalFormVisible = true;
  this.modalTitle = `消息管理 > 新增`;
  this.status = 'add';
  this.modalValidateForm.patchValue({msgType:'XXLX10'});//给弹框消息类型一个默认值
  if(this.modalFormData1.length>3){//控制公告弹框出来状态的select矿
    this.modalFormData1.pop();
        this.modalValidateForm.removeControl('status');
  }
}


// getUpdateData(data:any):void{
//   const params = {url: '', data: {}, method: 'POST'};
//   params.url = DISPURL.GETMESSAGEURL;
//   params.data = data.data[0];
//   this.http.request(params).then(
//     (res:any) => {
//       if(res.success){
//         this.updateSet = res.data.data.data[0];
//         //this.totalPage = res.data.data.total;
//         //console.log(this.updateSet[0]);
//         console.log(data.data[0]);
//        console.log(this.updateSet);
//       }
//     }
//   );
// }

//更新
btnUpdate(data:any):void{

//this.getUpdateData(data);
//const params = {url: '', data: {}, method: 'POST'};//赋给更新表单上的数据是调接口来了
  //params.url = DISPURL.GETMESSAGEURL;
  //params.data = data.data[0];
  // this.http.post(DISPURL.GETMESSAGEURL, this.param)
  if(data.data.length>=1){
    this.param.rowId=data.data[0].rowId;
  }
  this.param.enterpriseId = this.info.APPINFO.USER.companyId;
  this.http.post(DISPURL.GETMESSAGEURL, this.param).then(
    (res:any) => {
      if(res.success){
        //debugger
        this.updateSet = res.data.data.data;
        //this.totalPage = res.data.data.total;
        //console.log(this.updateSet[0]);
        //console.log(res.data.data.data);
       //console.log(this.updateSet);
      }
      if (data.data.length < 1) {
        this.tplModal = this.modal.warning({
          nzTitle: '提示信息',
          nzContent: '请选中一条数据后进行修改!'
        });
        this.destroyTplModal();
        return;
      }
      this.disable=true;
      if(this.updateSet[0].msgType==='XXLX30'){
        this.tplModal = this.modal.warning({
          nzTitle: '提示信息',
          nzContent: '通知消息不能修改!'
        });
        this.destroyTplModal();
        return;
      }
      if(this.updateSet[0].msgType==='XXLX10'){//如果是公告的修改则要加状态select框
        if(this.modalFormData1.length>3){
          this.modalFormData1.pop();//为了防止每次修改按钮都加新元素所以在这里控制下
        }
        this.modalFormData1.push(
          {name: '状态', eName: 'status', type: 'select3', validateCon: '请输入状态', require: true,
          validators:{
            require: true,
            pattern:false,
          }
        }
        );
      }
      this.modalTitle = `消息管理 > 修改`;
      this.modalFormVisible = true;
      this.status = 'update';
      this.rowid = data.data[0].rowId;
      this.modalValidateForm.patchValue(this.updateSet[0]);
      
    }
  );
  
  //console.log(this.updateSet);
  //this.modalValidateForm.patchValue(data.data[0]);
  //this.modalValidateForm.patchValue(this.dataSet);
}

modelChange(val:any){
  this.removeController();
  if (val === 'XXLX10') {
    this.modalFormData = this.modalFormData1;
  } else if (val === 'XXLX20') {
    
    this.modalFormData = this.modalFormData2;
  } else if (val === 'XXLX30') {
    this.modalFormData = this.modalFormData3;
  } 
  if(this.modalValidateForm.get('msgTitle')&&this.modalValidateForm.get('msgBod')){
    this.modalValidateForm.get('msgTitle').reset();
    this.modalValidateForm.get('msgBod').reset();
  }
 
   
  for (let i = 0; i < this.modalFormData.length; i++) {
    let validatorOrOpts:Array<any> = [];
    if (this.modalFormData[i].require)
      validatorOrOpts.push(Validators.required);
    if (this.modalFormData[i].validators.pattern)
      validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
    this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
      '',validatorOrOpts
    ));
  }

}

removeController(): void {
  this.modalValidateForm.removeControl('receiver');
  //this.modalValidateForm.removeControl('msgTitle');
  //this.modalValidateForm.removeControl('msgBod');
  this.modalValidateForm.removeControl('startTime');
  this.modalValidateForm.removeControl('endTime');
  this.modalValidateForm.removeControl('kindCode');
  this.modalValidateForm.removeControl('queueStatus');
  this.modalValidateForm.removeControl('timeInterval');
  this.modalValidateForm.removeControl('maxCount');
  this.modalValidateForm.removeControl('status');
}
// 添加数据
addData(data: any) {
  const params = {url: '', data: {}, method: 'POST'};
  this.kindList.forEach(element => {
    if(element.itemCode===data.kindCode){//添加群发数据时把kindname值也带过去
      data.kindName=element.itemCname;
    }
  });
  
  if(data.msgType==='XXLX20'){
    data.startTime=this.datePipe.transform(data.startTime, 'yyyy-MM-dd HH:mm:ss');//转换日期格式
    data.endTime=this.datePipe.transform(data.endTime, 'yyyy-MM-dd HH:mm:ss')
    console.log(data.startTime);
  }
  
  if(data.startTime>data.endTime){
    this.nz.create('error', '提示信息', '开始时间不能大于结束时间!', { nzDuration: 3000 });
    this.isOkLoading=false;
    return;
  }
  params.url = DISPURL.INSERTMESSAGEURL;
  data.enterpriseId=this.info.APPINFO.USER.companyId;
  data.sender=this.info.APPINFO.USER.name;
  data.bk1=this.info.APPINFO.USER.userId;
  params.data = data;
  this.http.request(params).then(
    (res:any) => {
      if (res.success) {
        this.listSearch(this.searchData);
        this.isOkLoading=false;
        this.modalFormVisible = false;
        this.tplModal = this.modal.warning({
          nzTitle: '提示信息',
          nzContent: '新增成功!'
        });
        this.destroyTplModal();
      }
      this.isOkLoading=false;
    }
  )
}

// 修改数据
updateData(data: any) {
  //console.log('updateData')
  const params = {url: '', data: {}, method: 'POST'};
  this.kindList.forEach(element => {//和增加同理
    if(element.itemCode===data.kindCode){
      data.kindName=element.itemCname;
    }
  });
  if(data.msgType==='XXLX20'){
    data.startTime=this.datePipe.transform(data.startTime, 'yyyy-MM-dd HH:mm:ss');//转换日期格式
    data.endTime=this.datePipe.transform(data.endTime, 'yyyy-MM-dd HH:mm:ss')
    //console.log(data.startTime);
  }
  if(data.startTime>data.endTime){
    this.nz.create('error', '提示信息', '开始时间不能大于结束时间!', { nzDuration: 3000 });
    this.isOkLoading=false;
    return;
  }
  params.url = DISPURL.UPDATEMESSAGEURL;
  data.enterpriseId=this.info.APPINFO.USER.companyId;
  data.sender=this.info.APPINFO.USER.name;
  data.bk1=this.info.APPINFO.USER.userId;
  data.rowId = this.rowid;
  params.data=data;
  this.http.request(params).then(
    (res:any) => {
      if (res.success) {
        this.listSearch(this.searchData);
        this.isOkLoading=false;
        this.modalFormVisible = false;
        this.tplModal = this.modal.warning({
          nzTitle: '提示信息',
          nzContent: '修改成功!'
        });
        this.destroyTplModal();
      }
      this.isOkLoading=false;
    }
  )
}


handleOk(): void {
  //console.log(this.modalValidateForm.controls);
  for (const i in this.modalValidateForm.controls) {
    
    this.modalValidateForm.controls[ i ].markAsDirty();
    this.modalValidateForm.controls[ i ].updateValueAndValidity();
  }
  if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
    this.isOkLoading = true;
    this.addData(this.modalValidateForm.value);
  }
  if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
    this.isOkLoading = true;
    this.updateData(this.modalValidateForm.value);
  }

}

handleCancel(): void {
  this.modalFormVisible = false;
  //this.removeController();
}

closeResult(): void{
  this.modalValidateForm.reset();
}

destroyTplModal(): void {//提示弹窗自动关闭
  window.setTimeout(() => {
    this.tplModal.destroy();
  }, 1500);
}

}
