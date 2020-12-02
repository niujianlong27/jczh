import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CommonService} from '@service/common.service';
import {GlobalService} from '@service/global-service.service';
@Component({
  selector: 'app-vehiclequeue',
  templateUrl: './vehiclequeue.component.html',
  styleUrls: ['./vehiclequeue.component.css'],
})
export class VehiclequeueComponent implements OnInit {
  isLoading = false;
  modalTitle: string = null;
  isOkLoading = false;
  tabs: Array<any> = [];
  listLoading = false;
  dataSet: any;
  page: 1;
  pageSize = 30; // 条数
  totalPage: number; // 数据总条数
  carNum = 0;
  status: String;
  taskId: String;
  dealId: String;
  searchData: {[key: string]: any} = {};
  gateCode: String;
  gateName: String;
  warehouseCode: String;
  warehouseName: String;
  tplModal: NzModalRef; // 操作成功后弹窗属性
  InsertFormVisible = false; // 操作弹框
  modalValidateForm: FormGroup; // 操作代码集弹窗
  hidden = false;
  gateArr: Array<any> = [];
  plArr: Array<any> = [];
  code: String;
  Update = false;
  warehouseArr: Array<any> = [];
  gateCodeSelect: any = '';
  // 计算排队时长定时器
  interval: any;
  // 刷新数据定时器
  updateInterval: any;
  queuestatus: string;
  // 是否开启定时器
  intervalFlag = false;
  @ViewChild('warehouse') warehouse: ElementRef;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  validateForm: FormGroup;
  tempSearchParam: any = {};
  modalFormData: Array<any> = [
    {name: '车牌号', eName: 'truckNo', type: 'input', validateCon: '', require: false,
      validators: {
        require: true,
        pattern: false,
      }
   },
    {name: '品种', eName: 'kindName', type: 'input', validateCon: '', require: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {name: '优先级', eName: 'queueClassName', type: 'input', validateCon: '', require: false,
    validators: {
      require: true,
      pattern: false,
    }
  },
  {name: '大门', eName: 'gateCode', type: 'select', validateCon: '请选择入厂大门', require: false,
  validators: {
    require: true,
    pattern: false,
  },
  },
  {name: '仓库', eName: 'warehouseCode', type: 'select', validateCon: '请选择仓库', require: false,
  validators: {
    require: true,
    pattern: false,
  },
},
{name: '排队开始时间', eName: 'queueStartTime', type: 'input', validateCon: '', require: false,
  validators: {
    require: true,
    pattern: false,
  },
},
{name: '排队号', eName: 'qeueNo', type: 'num', validateCon: '', require: false,
  validators: {
    require: true,
    pattern: false,
  },
},
{name: '操作备注', eName: 'remark', type: 'textarea', validateCon: '', require: true,
  validators: {
    require: true,
    pattern: false,
  },
}
];
  constructor(private fb: FormBuilder, private nz: NzNotificationService, private globalSer: GlobalService,
              private modal: NzModalService, private http: HttpUtilService, private cm: CommonService, private info: UserinfoService, private nm: NzModalService) {

  }
  ngOnInit() {
    this.getallCodest();
    this.listSearch({ page: 1, length: this.pageSize });
    this.modalValidateForm = this.fb.group({
    });
    // this.modalFormData = this.modalFormData1;//初始化第一个tab页
    for (let i = 0; i < this.modalFormData.length; i++) {
      const validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require) {
        validatorOrOpts.push(Validators.required);
      }
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }

    this.interval = setInterval(() => { this.setQueueingTime(); }, 1000 * 60);
    // this.updateInterval=setInterval(() => { this.listSearch({ page: 1, length: this.pageSize }); }, 1000*60);
  }
  getNum() {
    this.http.post(RGDISPURL.ENTRYQUEUEGETNUMBER, {status: '^(disp_queueDetailStatus_2|disp_queueDetailStatus_3)', gateCode: this.gateCodeSelect}).then(
     (res: any) => {
       if (res.success) {
         console.log(res.data.data[0]);
         res.data.data.forEach(ele => {
          for (let i = 1; i < this.tabs.length; i++) {
            if (ele.gateCode == this.tabs[i].itemCode) {
              this.tabs[i].itemCount = ele.ct;
              this.tabs[0].itemCount += ele.ct;
            }
          }
         });
       }
     }
   );
  }


  listSearch(data) {
    console.log(data);
    this.tabs.forEach(item => {
      item.itemCount = 0;
    });
    this.getNum();
    data.page = data.page || 1; // 最好有
    data.length = data.length || this.pageSize; // 最好有
    console.log(data.length);
    data.gateCode = this.tempSearchParam.gateCode ? this.tempSearchParam.gateCode : this.gateCodeSelect;
    // switch(this.carNum){
    //   case 0:
    //     data.gateCode='';
    //     break;
    //     case 1:
    //       data.gateCode='disp_gate_EA';
    //       break;
    //       case 2:
    //         data.gateCode='disp_gate_WE';
    //         break;
    //         case 3:
    //           data.gateCode='disp_gate_NOR';
    //           break;
    //           case 4:
    //             data.gateCode='disp_gate_SGL';
    //             break;
    //             case 5:
    //               data.gateCode='disp_gate_LZDM';
    //               break;
    //               case 6:
    //               data.gateCode='disp_gate_XNM';
    //               break;
    //             default :
    //             data.gateCode='';
    // }
    this.getListSearch(data);
  }

   // 获取表头
   getallCodest(): void {
    const tab: any = {};
    tab.itemCname = '全部';
    tab.itemCode = '';
    tab.itemCount = 0;
    this.tabs.push(tab);

    const tab1: any = {};
    tab1.itemCname = '东二门';
    tab1.itemCode = 'disp_gate_EA';
    tab1.itemCount = 0;
    this.tabs.push(tab1);

    const tab2: any = {};
    tab2.itemCname = '西门';
    tab2.itemCode = 'disp_gate_WE';
    tab2.itemCount = 0;
    this.tabs.push(tab2);

    const tab3: any = {};
    tab3.itemCname = '北门';
    tab3.itemCode = 'disp_gate_NOR';
    tab3.itemCount = 0;
    this.tabs.push(tab3);

    const tab4: any = {};
    tab4.itemCname = '东三门';
    tab4.itemCode = 'disp_gate_SGL';
    tab4.itemCount = 0;
    this.tabs.push(tab4);

    const tab5: any = {};
    tab5.itemCname = '冷轧东门';
    tab5.itemCode = 'disp_gate_LZDM';
    tab5.itemCount = 0;
    this.tabs.push(tab5);

    const tab6: any = {};
    tab6.itemCname = '西南门';
    tab6.itemCode = 'disp_gate_XNM';
    tab6.itemCount = 0;
    this.tabs.push(tab6);

    this.http.post(RGDISPURL.GETCODESET, {'codesetCode': 'disp.gate'}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data);
          res.data.data.forEach(element => {
            // 排队大类名称
               const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              this.gateArr.push(item);
              // console.log( this.gateArr)
          });
        }
      }
    );

    this.http.post(RGDISPURL.GETWAREHOUSE, {}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data);
          res.data.data.forEach(element => {
              const item: any = {};
              item.itemCname = element.label;
              item.itemCode = element.value;
              this.warehouseArr.push(item);
          });
        }
      }
    );

  }
  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);
    clearInterval(this.updateInterval);
  }
  handleOk() {

  }
  // 获取表格数据
  getListSearch(data: any) {

    this.Update = false;
    this.listLoading = true;
    data.status = '^(disp_queueDetailStatus_2|disp_queueDetailStatus_3)';
    this.tempSearchParam = data;
    this.http.post(RGDISPURL.ENTRYQUEUEGET, data).then(
     (res: any) => {
       if (res.success) {
         this.listLoading = false;
         this.dataSet = res.data.data.data;
         this.totalPage = res.data.data.total;
         this.dataSet.forEach(item => {
           item.selectShow = false;
         });
         this.dataSet.map(x => x.editstate = 0);
         this.setQueueingTime();

         this.dataSet.forEach(element => {
           if (element.status == '35') {
             element.disabled = true;
           }
         });
         this.dataSet.forEach(item => {
           item.editstate = 0;
         });
       } else {
        this.listLoading = false;
       }
     }
   );
  }
  // 切换tab页时调用方法
  selectChange(data: any): void {
    this.tempSearchParam.gateCode = data;
    this.listSearch(this.tempSearchParam);
  }

   // 修改按钮
  update(data: any) {
    this.hidden = true;
    console.log(data);
    this.dataSet.forEach(item => {
      if (item.id == data.id) {
        item.editstate = 1;
        item.selectShow = true;
        item.gateName = item.gateCode;
      } else {
        item.editstate = 0;
        item.selectShow = false;
        this.gateArr.forEach(item1 => {
          if (item.gateCode == item1.itemCode) {
            item.gateName = item1.itemCname;
          }
        });
      }
    });
  }

  // 取消保存
  cancle(data: any, flag= null) {
    this.hidden = false;
    data.editstate = 0;
    data.selectShow = false;
     this.listSearch({ page: 1, length: this.pageSize });
  }

  /**
   * 主列表当前页码变化
   * @param page
   */
  pageIndexEmit(page: any): void {
    this.page = page;
    this.listSearch({page: page, length: this.pageSize});
  }

  /**
   * 主列表每页展示条数变化
   * @param pageSize
   */
  pageSizeEmit(param: any): void {
    this.pageSize = param;
    this.listSearch({page: 1, length: this.pageSize});
  }

   // 修改方法
   saveData(data) {
    data.recRevisor = this.info.APPINFO.USER.name;
    this.hidden = false;
     this.dataSet.forEach(item => {
       if (item.id == data.id) {
         item.editstate = 1;
         item.selectShow = true;
       } else {
         item.editstate = 0;
         item.selectShow = false;
       }
     });
    data.gateCode = data.gateName;
     if (data.warehouseCode == undefined) {
       data.warehouseName = undefined;
     }
      this.http.post(RGDISPURL.ENTRYQUEUEUPDATE, data).then(
        (res: any) => {
          if (res.success) {
            this.dataSet = res.data.data.data;
            this.totalPage = res.data.data.total;
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '修改成功'
            });
            this.listSearch(this.tempSearchParam);
          }
        }
      );
  }

  operation(data: any) {
    // this.modalValidateForm.patchValue(this.updateSet[0]);
    this.queuestatus = data.status;
    this.dataSet.forEach(item => {
      if (item.id == data.id) {
        item.gateName = item.gateCode;
        item.warehouseName = item.warehouseCode;
      } else {
        this.gateArr.forEach(item1 => {
          if (item.gateCode == item1.itemCode) {
            item.gateName = item1.itemCname;
          }
        });
        this.warehouseArr.forEach(item1 => {
          if (item.warehouseCode == item1.itemCode) {
            item.warehouseName = item1.itemCname;
          }
        });
      }
    });
    data.status = '^[2,3]';
    this.http.post(RGDISPURL.ENTRYQUEUEGET, {id: data.id, status: '^(disp_queueDetailStatus_2|disp_queueDetailStatus_3)'}).then(
     (res: any) => {
       if (res.success) {
        console.log(res.data.data.data[0]);
        // this.status=res.data.data.data[0].status;
        // this.taskId=res.data.data.data[0].taskId;
        // this.dealId=res.data.data.data[0].dealId;
        this.searchData = res.data.data.data[0];
        this.modalValidateForm.patchValue(res.data.data.data[0]);
       }
     }
   );

    // this.modalValidateForm.patchValue(this.plArr[0]);
     this.InsertFormVisible = true;
  }


  // 数据弹出框取消
closeResult(): void {
  this.modalValidateForm.reset();
}
// 数据弹出框取消
handleCancel(): void {
  this.InsertFormVisible = false;
  this.listSearch({ page: 1, length: this.pageSize });
}

// 直接入厂
directEntry() {

  this.searchData.gateCode = this.modalValidateForm.get('gateCode').value;
  this.searchData.gateName = this.gateName;
  this.searchData.warehouseCode = this.modalValidateForm.get('warehouseCode').value;
  this.searchData.warehouseName = this.warehouseName;
  this.searchData.remark = this.modalValidateForm.get('remark').value;
  if (this.cm.canOperate([ this.searchData ], 'remark', [ '', undefined, null ], '操作备注不能为空，请重新填写')) {
    return;
  }
  const data = {...this.searchData};
  console.log(data);
  this.http.post(RGDISPURL.ENTRYNOTICE, data).then(

    (res: any) => {
      debugger;
      if (res.success) {
        this.InsertFormVisible = false;
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '叫车成功'
        });
        this.listSearch(this.tempSearchParam);
      }
    }
  );
}

// 加入绿色通道
greenChannel() {

  this.searchData.gateCode = this.gateCode;
  this.searchData.gateName = this.gateName;
  this.searchData.warehouseCode = this.warehouseCode;
  this.searchData.warehouseName = this.warehouseName;
  this.searchData.remark = this.modalValidateForm.get('remark').value;
  if (this.cm.canOperate([ this.searchData ], 'remark', [ '', undefined, null ], '操作备注不能为空，请重新填写')) {
    return;
  }
  const data = {...this.searchData};
  this.http.post(RGDISPURL.FASTTRACK, data).then(
    (res: any) => {
      if (res.success) {
        this.InsertFormVisible = false;
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '加入绿色通道成功'
        });
        this.listSearch(this.tempSearchParam);
      }
    }
  );
}

gateChange(data: any) {
  console.log(data);
  this.gateCode = data;
  this.gateArr.forEach(element => {
    if (this.gateCode == element.itemCode) {
      this.gateName = element.itemCname;
    }
  });
}

wareChange(data: any) {
  console.log(data);
  this.warehouseCode = data;
  this.warehouseArr.forEach(element => {
    if (this.warehouseCode == element.itemCode) {
      this.warehouseName = element.itemCname;
    }
  });
}

setQueueingTime() {
    console.log('时间定时器刷新');
  const curDateTime = new Date().getTime();
  this.dataSet.map(item => {
    if (item.queueStartTime) {
      const queueingTime = curDateTime - new Date(item.queueStartTime.replace(/-/g, '/')).getTime();
      const hours = Math.trunc(queueingTime / (1000 * 60 * 60));
      const minutes = Math.trunc((queueingTime % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 0) {
        item.queueingTime = hours + '小时' + minutes + '分';
      } else if (minutes >= 0) {
        item.queueingTime = minutes + '分';
      }
      if (hours > 47) {
        item._bgColor = '#f86c6b';
      } else if (hours > 23) {
        item._bgColor = '#ffbf00';
      } else {
        item._bgColor = '';
      }
    }
    if (item.entryNoticeTime) {
      const noticeTime = curDateTime - new Date(item.entryNoticeTime.replace(/-/g, '/')).getTime();
      item.callingWaitTime = Math.trunc(noticeTime / (1000 * 60)) + '分';
    }
    if (item.status == 'disp_queueDetailStatus_27') {
      item._bgColor = '#63c2de';
    }
  });
}
updateGate() {


      this.plArr.forEach(element => {
        element.gateCode = this.validateForm.get('gateCode').value;
      });
      this.http.post(RGDISPURL.ENTRYQUEUEUPDATEALL, this.plArr).then(
        (res: any) => {
          if (res.success) {
            // this.dataSet = res.data.data.data;
            // this.totalPage = res.data.data.total;
            this.nz.success('提示信息', '批量修改成功');
            this.plArr = [];
            this.listSearch({ page: 1, length: this.pageSize });
            this.validateForm.reset();
            this.tplModal.destroy();

          }
        }
      );



}
updateDataResult(data: any[]) {
  // console.log(data);
  this.plArr = data;
  // console.log(data)
}
  colName(data: any) {
    const warehouse = data.filter(x => x.colEname === 'warehouseCode');
    warehouse[0].tdTemplate = this.warehouse;
  }
  modelChange(data: any, data1: any) {
    this.warehouseArr.forEach(item => {
      if (item.itemCode == data) {
        data1.warehouseName = item.itemCname;
      }
    });
}
  btnClick(data: any) {
    switch (data.buttonId) {
      case 'directEntry':
        this.directEntry();
        break;
      case 'greenChannel':
        this.greenChannel();
        break;
      case 'return':
        this.handleCancel();
        break;
      case 'Update':
        this.btnUpdate();
        break;
      case 'Make':
        this.btnMake();
        break;
      case 'Save':
        this.saveData(this.dataSet.filter(x => x.editstate == 1)[0]);
        break;
      case 'UpdateAll':
        this.btnUpdateAll();
        break;
      case 'Open':
        this.controlInterval();
        break;
      case 'Close':
        this.controlInterval();
        break;
      default:
        break;
    }
  }
  btnUpdate() {
    if (this.plArr.length != 1) {
      this.nz.error('提示信息', '请勾选一条数据');
      return;
    }
    if (this.cm.canOperate(this.plArr, 'status', ['disp_queueDetailStatus_35'], '勾选数据已入厂，不可修改')) {
      return;
    }
    this.Update = true;
    this.update(this.plArr[0]);
  }

  btnMake() {
    if (this.plArr.length != 1) {
      this.nz.error('提示信息', '请勾选一条数据');
      return;
    }
    if (this.cm.canOperate(this.plArr, 'status', ['disp_queueDetailStatus_35'], '勾选数据已入厂，不可操作')) {
      return;
    }
    this.operation(this.plArr[0]);
  }
  btnUpdateAll() {
    if (this.plArr.length == 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后修改'
      });
      return;
    }
    this.modalTitle = '车辆排队调度 >批量修改大门';
    this.validateForm = this.fb.group({
      gateCode: [null, [Validators.required]],
    });
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false,

    });
  }

  controlInterval() {
    if (!this.intervalFlag) {
      console.log('开启定时器');
      this.intervalFlag = true;
      this.updateInterval = setInterval(() => {
        this.page = 1;
        this.globalSer.pageNumEmitter.emit({formId: 'form_rgDisp_vehiclequeue', gridId: 'grid1', page: 1, length: this.pageSize})
        this.listSearch({ page: 1, length: this.pageSize });
        }, 1000 * 60 * 5);
    } else {
      console.log('关闭定时器');
      this.intervalFlag = false;
      clearInterval(this.updateInterval);
    }
  }

  handleCance() {
    this.tplModal.destroy();
    this.listSearch({ page: 1, length: this.pageSize });
  }
  importConfirm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }

    if (this.validateForm.get('gateCode').value == undefined) {
      this.nz.error('提示信息', '请选择大门');
      return;
    }
    this.updateGate();
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
  //       this.gateCodeSelect += `${arr[i].itemCode}|`
  //     }else{
  //       this.gateCodeSelect += arr[i].itemCode
  //     }
  //   }
  //   this.gateCodeSelect = `^(${this.gateCodeSelect})`
  //   // console.log(this.gateCodeSelect)
  //   this.listSearch({ page: 1, length: this.pageSize,gateCode:this.gateCodeSelect})
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
