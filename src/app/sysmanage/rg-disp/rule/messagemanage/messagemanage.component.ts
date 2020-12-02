import { Component, OnInit, EventEmitter } from '@angular/core';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { format } from 'date-fns';
@Component({
  selector: 'app-messagemanage',
  templateUrl: './messagemanage.component.html',
  styleUrls: ['./messagemanage.component.css']
})
export class MessagemanageComponent implements OnInit {
  modalTitle: string;
  listLoading: boolean = false;
  dataSet: any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  //hidden:{[key:number]:any} = {};//保存取消按钮
  tplModal: NzModalRef;//操作成功后弹窗属性
  InsertFormVisible: boolean = false;//新增弹框
  modalValidateForm: FormGroup;//新增代码集弹窗
  messageArr: Array<any> = [];
  kindArr: Array<any> = [];
  queueArr: Array<any> = [];
  type: String;
  isOkLoading = false;
  typeName: String;
  private columnsArr: any[] = [];
  modalFormData: Array<any> = [];
  searchdataReturn: Array<any> = [];
  messageType: string;
  queryList: Array<any> = [];
  dateFormat:any;
  currentDate =format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  deleteVisible: boolean = false;//删除弹框
  deletemodaltitle: string;//弹框的标题
  finishCon: string;//弹窗文字内容
  deleteId: string;
  queryParameterList: any = []
  param: any
  status0: boolean = true;
  status1: boolean = true;
  status2: boolean = true;


  UpdateArr:Array<any>=[];
  saveFlag:boolean=true;


  modalFormData1: Array<any> = [
    {
      name: '消息类型', eName: 'type', type: 'select', validateCon: '请输入消息类型', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '消息标题', eName: 'title', type: 'text', validateCon: '请输入消息标题', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '消息内容', eName: 'body', type: 'textarea', validateCon: '请输入消息内容', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    }
  ];
  modalFormData2: Array<any> = [
    {
      name: '消息类型', eName: 'type', type: 'select', validateCon: '请输入消息类型', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '消息标题', eName: 'title', type: 'text', validateCon: '请输入消息标题', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '消息内容', eName: 'body', type: 'textarea', validateCon: '请输入消息内容', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },

    {
      name: '开始时间', eName: 'startTime', type: 'date', validateCon: '请输入开始时间', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '结束时间', eName: 'endTime', type: 'date', validateCon: '请输入结束时间', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '品种', eName: 'kindCode', type: 'select1', validateCon: '请输入品种', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '排队状态', eName: 'queueStatus', type: 'select2', validateCon: '请输入状态', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '间隔时间', eName: 'timeInterval', type: 'num1', validateCon: '请输入间隔时间', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '提示次数', eName: 'maxCount', type: 'num', validateCon: '请输入次数', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    }
  ];

  modalFormData3: Array<any> = [

    {
      name: '消息类型', eName: 'type', type: 'select', validateCon: '请输入消息类型', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '消息标题', eName: 'title', type: 'text', validateCon: '请输入消息标题', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '消息内容', eName: 'body', type: 'textarea', validateCon: '请输入消息内容', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '接收人手机', eName: 'receiver', type: 'text', validateCon: '请输入接收人手机', require: true,
      validators: {
        require: true,
        pattern: true,
        patternStr: '1[3|4|5|7|8][0-9]{9}',
        patternErr: '不是正确的手机号'
      }
    }
  ];
  constructor(private fb: FormBuilder, private modal: NzModalService, private http: HttpUtilService, private info: UserinfoService, private nm: NzModalService, private nz: NzNotificationService, ) {
    this.getallCodest();
    this.listSearch({ page: 1, length: this.pageSize });
  }
  getallCodest() {
    this.http.post(RGDISPURL.GETCODESET, { 'codesetCode': 'disp.messageType' }).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.messageArr.push(item);
            //console.log( this.queueArr)
          });
        }
      }
    )

    this.http.post(RGDISPURL.GETCODESET, { 'codesetCode': 'disp.matKind' }).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.kindArr.push(item);
            //console.log( this.queueArr)
          });
        }
      }
    )

    this.http.post(RGDISPURL.GETCODESET, { 'codesetCode': 'disp.mesQueueStatus' }).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.queueArr.push(item);
            //console.log( this.queueArr)
          });
        }
      }
    )


  }

  ngOnInit() {
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData1;//初始化第一个tab页
    this.modelChange('disp_messageType_1');
    console.log();
  }

  listSearch(data) {
    this.saveFlag=true;
    this.UpdateArr=[];
    console.log(format(new Date(), 'YYYY-MM-DD HH:mm:ss'))
    //if(this.queryParameterList){
    data.queryParameterList = this.queryParameterList
    console.log(this.queryParameterList)
    // }
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.getListSearch(data);
  }

  getListSearch(data) {
    this.listLoading = true;
    this.http.post(RGDISPURL.MESSAGEGETRECORDS, data).then(
      (res: any) => {
        if (res.success) {
          this.listLoading = false;
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          this.dataSet.map(x => x.editstate = 0);
          for (var i = 0; i < this.dataSet.length; i++) {
            if (this.dataSet[i].queueStatus == 'disp_mesQueueStatus_1') {
              this.dataSet[i].queueStatusName = '厂内'
            } else if (this.dataSet[i].queueStatus == 'disp_mesQueueStatus_2') {
              this.dataSet[i].queueStatusName = '在途'
            } else if (this.dataSet[i].queueStatus == 'disp_mesQueueStatus_3') {
              this.dataSet[i].queueStatusName = '已取号'
            }
          }
          //this.dataSet.map(x => x.queueStatusName = x.queueStatus);
          // console.log(res.data.data.data[0].codesetCode)
          // this.dataSet.map(x => x.status == 'WLFL10'? x.status='启用': x.status='作废');
        }
      }
    )
  }

  //修改按钮
  update(data) {
    if(this.UpdateArr.length==0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后修改'
      });
      return;
    }
    if(this.UpdateArr[0].type =='disp_messageType_3'){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '通知无法修改修改'
      });
      return;
    }
    this.saveFlag=false;
    //let data=this.UpdateArr[0];
    //console.log(this.searchdataReturn[0].value1 == '公告')
    data.editstate = 1;
    console.log(data)
    data.kindName = data.kindCode;
    data.queueStatusName = data.queueStatus;
    console.log('1111111111111111111111111')
    console.log(this.columnsArr)
    const startTime = this.columnsArr.filter(x => x.colEname === 'startTime');
    const endTime = this.columnsArr.filter(x => x.colEname === 'endTime');
    const kindName = this.columnsArr.filter(x => x.colEname === 'kindName');
    const queueStatusName = this.columnsArr.filter(x => x.colEname === 'queueStatusName');
    const timeInterval = this.columnsArr.filter(x => x.colEname === 'timeInterval');
    const maxCount = this.columnsArr.filter(x => x.colEname === 'maxCount');

    if (data.typeName != '群发') {
      startTime[0].edit = 'BJBJ20';
      endTime[0].edit = 'BJBJ20';
      kindName[0].edit = 'BJBJ20';
      queueStatusName[0].edit = 'BJBJ20';
      timeInterval[0].edit = 'BJBJ20';
      maxCount[0].edit = 'BJBJ20';
    } else {
      startTime[0].edit = 'BJBJ10';
      endTime[0].edit = 'BJBJ10';
      kindName[0].edit = 'BJBJ10';
      queueStatusName[0].edit = 'BJBJ10';
      timeInterval[0].edit = 'BJBJ10';
      maxCount[0].edit = 'BJBJ10';
    }


  }
  //取消保存
  cancle(data, flag = null) {
    //data.hidden[flag] = false;
    data.editstate = 0;
    this.listSearch({ page: 1, length: this.pageSize });
  }

  //修改方法
  saveData(data) {
    //let data=this.UpdateArr[0];
    this.UpdateArr=[];
    // this.dataSet.map(x => x.status == '启用' ? x.dealType='CSCL10': x.dealType='CSCL20');
    data.recRevisor = this.info.APPINFO.USER.name;
    // data.hidden[flag] = false;
    data.editstate = 0;
    // this.dataSet.forEach(element => {
    //   element.hidden[flag]=false;
    // });
    data.kindCode = data.kindName;
    //data.status = data.statusName;
    data.queueStatus = data.queueStatusName;
    if (data.type == 'disp_messageType_2') {
      data.startTime = format(data.startTime, 'YYYY-MM-DD HH:mm:ss');
      data.endTime = format(data.endTime, 'YYYY-MM-DD HH:mm:ss');
      console.log(data.startTime);
    }

    if (data.startTime > data.endTime) {
      this.nz.create('error', '提示信息', '开始时间不能大于结束时间!', { nzDuration: 3000 });
      this.listSearch({ page: 1, length: this.pageSize });
      return;
    }

    if (data.endTime<this.currentDate) {
      this.nz.create('error', '提示信息', '结束时间要大于当前时间!', { nzDuration: 3000 });
      this.listSearch({ page: 1, length: this.pageSize });
      return;
    }

    this.http.post(RGDISPURL.MESSAGEUPDATE, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '修改成功'
          });
        }
        this.saveFlag=true;
        this.listSearch({ page: 1, length: this.pageSize });
      }

    )
  }
  // 数据弹出框取消
  closeResult(): void {
    this.modalValidateForm.reset();
   this.modelChange('disp_messageType_1');
  }
  // 数据弹出框取消
  handleCancel(): void {
    this.InsertFormVisible = false;
    this.modelChange('disp_messageType_1');
  }
  btnClick(data: any) {
    //this.removeController();//先移除所有控制器
    switch (data.buttonId) {
      case 'Add':
        this.InsertFormVisible = true;
        break;
        case 'Update':
          this.update(this.UpdateArr[0]);
          break;
          case 'Save':
            this.saveData(this.dataSet.filter(x=>x.editstate==1)[0]);
            break;
            case 'Delete':
              this.deleteBtn(this.UpdateArr[0]);
              break;
    }
  }

  codeChange(data) {
    console.log(data)
    this.type = data;
    this.messageArr.forEach(element => {
      if (this.type == element.itemCode) {
        this.typeName = element.itemCname
      }
    });
  }

  //新增弹框确认
  handleOk() {
    const data = this.modalValidateForm.value;
    const params = { url: '', data: {}, method: 'POST' };
    console.log(data.type)
    if (data.type == 'disp_messageType_2') {
      data.startTime = format(data.startTime, 'YYYY-MM-DD HH:mm:ss');
      data.endTime = format(data.endTime, 'YYYY-MM-DD HH:mm:ss');
      console.log(data.startTime);
    }

    if (data.startTime > data.endTime) {
      this.nz.create('error', '提示信息', '开始时间不能大于结束时间!', { nzDuration: 3000 });
      this.isOkLoading = false;
      return;
    }

    if(data.endTime<this.currentDate){
      this.nz.create('error', '提示信息', '结束时间要大于当前时间!', { nzDuration: 3000 });
      return;
    }

    console.log(format(new Date(), 'YYYY-MM-DD HH:mm:ss'))

    this.kindArr.forEach(element => {
      if (element.itemCode === data.kindCode) {//添加群发数据时把kindname值也带过去
        data.kindName = element.itemCname;
      }
    });




    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }


    console.log(data);
    if (data.type == 'disp_messageType_1') {
      params.url = RGDISPURL.MESSAGEINSERT;
    } else if (data.type == 'disp_messageType_2' || data.type == 'disp_messageType_3') {
      params.url = RGDISPURL.MESSAGESEND;
    }
    data.enterpriseId = this.info.APPINFO.USER.companyId;
    data.sender = this.info.APPINFO.USER.name;
    data.bk1 = this.info.APPINFO.USER.userId;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch({ page: 1, length: this.pageSize });
          this.isOkLoading = false;
          this.InsertFormVisible = false;
          this.tplModal = this.modal.warning({
            nzTitle: '提示信息',
            nzContent: '新增成功!'
          });
          this.destroyTplModal();
          this.modelChange('disp_messageType_1');

        }
        this.isOkLoading = false;
      })

  }



  modelChange(val: any) {
    console.log(val)
    this.removeController();
    if (val === 'disp_messageType_1') {
      this.modalFormData = this.modalFormData1;
    } else if (val === 'disp_messageType_2') {
      this.modalFormData = this.modalFormData2;
    } else if (val === 'disp_messageType_3') {
      this.modalFormData = this.modalFormData3;
    }
    // if(this.modalValidateForm.get('title')&&this.modalValidateForm.get('body')){
    //   this.modalValidateForm.get('title').reset();
    //   this.modalValidateForm.get('body').reset();
    // }

    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
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

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  columns(data: any[]) {
    this.columnsArr = data;
  }


  //删除按钮
  deleteBtn(data) {

    if(this.UpdateArr.length==0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后删除'
      });
      return;
    }
    if(this.UpdateArr[0].status!= 'disp_messageStatus_12'&&this.UpdateArr[0].status!='disp_messageStatus_23'){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '只能删除已经失效或者作废的消息'
      });
      return;
    }
    //let data=this.UpdateArr[0];
    this.deletemodaltitle = '提示信息';
    this.finishCon = '是否删除此数据';
    this.deleteId = data.id;
    this.deleteVisible = true;
    // console.log(this.searchdataReturn[0].value1);
    // console.log(this.searchdataReturn[3].apiParameter.valueSetCode)
  }
  //删除方法
  deleteData(data) {
    //console.log(data)
    if ('ok' == data.type) {
      this.http.post(RGDISPURL.MESSAGEDELETE, { id: this.deleteId }).then(
        (res: any) => {
          if (res.success) {
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '操作成功'
            });
            this.deleteVisible = false;
            this.UpdateArr=[];
            this.listSearch({ page: 1, length: this.pageSize });
          }
        }
      )
    } else if ('cancel' == data.type) {
      console.log('取消')
      this.deleteVisible = false;
    }
  }
  searchDataReturn(data: any) {
    console.log(data[0]);
    // data.forEach(element => {
    //   if (element.parameter == 'typeName') {
    //     element.value1 = '公告'
    //   }
    // });
    //data[0].value1 = '公告'
  }

  listChange(data: any) {
    console.log(data)
    this.queryParameterList = [];
    console.log(data.queryParameterList)
    if (data.queryParameterList) {
      for (var i = 0; i < data.queryParameterList.length; i++) {
        if (data.queryParameterList[i].parameter == 'typeName') {
          this.messageType = data.queryParameterList[i].value1;
          this.queryParameterList.push(data.queryParameterList[i]);
          break;
        } else {
          this.messageType = '';
        }
      }
    }

    console.log(this.messageType);
    if (this.messageType == '公告') {
      this.status0 = false;
      this.status1 = true;
      this.status2 = true;
    } else if (this.messageType == '群发') {
      this.status0 = true;
      this.status1 = false;
      this.status2 = true;
    } else if (this.messageType == '通知') {
      this.status0 = true;
      this.status1 = true;
      this.status2 = false;
    } else if (this.messageType == '') {
      this.status0 = true;
      this.status1 = true;
      this.status2 = true;
    }

    if (!data.queryParameterList) {
      data.queryParameterList = [];
    }
    data.queryParameterList.forEach(item => {
      if (item.parameter == 'typeName') {
        if (item.value1 == '公告') {
          this.param = 'statusName';
        } else if (item.value1 == '通知') {
          this.param = 'status2'
        } else if (item.value1 == '群发') {
          this.param = 'status1'
        }
      }
      console.log(this.param)
      if (item.parameter == 'statusName') {
        if (this.param != 'status1' && this.param != 'status2' && this.messageType != '') {
          this.queryParameterList.push(item);
        }
      }else if (item.parameter == 'status1') {
        if (this.param != 'statusName' && this.param != 'status2' && this.messageType != '') {
          this.queryParameterList.push(item);
        }
      }else if (item.parameter == 'status2') {
        if (this.param != 'status1' && this.param != 'statusName' && this.messageType != '') {
          this.queryParameterList.push(item);
        }
      }else if(item.parameter != 'typeName'){
        this.queryParameterList.push(item);
      }
    })
    console.log(this.queryParameterList)
    //this.queryParameterList = data.queryParameterList;


  }

  updateDataResult(data:any){
    this.UpdateArr=data;
  }

}
