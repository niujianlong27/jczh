import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import {WAREHOUSEURL} from '@model/warehouseUrl';
import {CommonService} from '@service/common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-vehiclequeue',
  templateUrl: './vehiclequeue.component.html',
  styleUrls: ['./vehiclequeue.component.css']
})
export class VehiclequeueComponent implements OnInit {
  dataSet: Array<any> = []; // 结果集
  loading: any; // 页面查询加载
  pageSize = 30; // 页面显示数据条数
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  buttonId = '';
  public dataSetClone: any[] = [];
  carNum: Number = 0; // 页面序号
  tabs: Array<any> = []; // 页面数组
  tempSearchParam: any = {}; // 查询参数
  columnsArr: any[] = []; // 列表头
  saveFlag = true; // 保存标记
  updateFlag = false; // 修改标记
  warehouseArr: Array<any> = []; // 仓库数组
  gateArr: Array<any> = []; // 大门数组
  tempUpdateParam: any = {}; // 修改参数保存
  tplModal: NzModalRef; // 操作成功后弹窗属性
  modalTitle: string = null; // 批量修改标题
  searchData: {[key: string]: any} = {}; // 操作的数据
  validateForm: FormGroup;
  modalValidateForm: FormGroup; // 操作代码集弹窗
  InsertFormVisible = false; // 操作弹框
  public isUpdate: boolean;
  // 计算排队时长定时器
  interval: any;
  // 刷新数据定时器
  updateInterval:any;

  private kindArr = [];
  private queueClass = [];
  private ruleStatus = [];

  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  @ViewChild('warehouse') warehouse: ElementRef;
  @ViewChild('gate') gate: ElementRef;
  constructor(
    private http: HttpUtilService,
    private nz: NzNotificationService,
    private cm:CommonService,
    private nm: NzModalService,
    private fb: FormBuilder,
  ) {
  }

  // 模板表单数据
  modalFormData: Array<any> = [
    {name: '车牌号', eName:'truckNo', type: 'input',validateCon: '', require: false,
      validators: {
        require: true,
        pattern: false,
      }
   },
    {name: '品种', eName:'matName', type: 'input', validateCon: '', require: false,
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
  {name: '大门', eName: 'gateCode', type: 'select', validateCon: '请选择入厂大门', require: true,
  validators: {
    require: true,
    pattern: false,
  },
  },
  {name: '仓库', eName: 'warehouseName', type: 'input', validateCon: '请选择仓库', require: false,
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
{name: '排队号', eName: 'queueNo', type: 'input', validateCon: '', require: false,
  validators: {
    require: true,
    pattern: false,
  },
},
{name: '操作备注', eName: 'remark', type: 'textarea', validateCon: '请填写备注', require: true,
  validators: {
    require: true,
    pattern: false,
  },
}
];

  ngOnInit() {
     this.getTabs();
     // this.listSearch({page:1,pageSize:30});
     // this.getData(WAREHOUSEURL.GETALLWAREHOUSE, this.warehouseArr);
     // this.interval = setInterval(() => { this.setQueueingTime(); }, 1000*60);
     this.updateInterval = setInterval(() => { this.getList(this.tempSearchParam); }, 1000*60);
     this.modalValidateForm = this.fb.group({
    });
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
  }

     // 按钮数据返回
public btnData(data: any[]){
  this.isUpdate = data.some(x => x.buttonId === 'Update');
}

    // f
 // 静态数据获取
public staticData = (code: string) => new Observable((observe) => {
  this.getStatic(code,observe);
})
private getStatic(code: string, ob?: any){
 let url = WAREHOUSEURL.GETALLCODESETS;
 let param: any = {codesetCode: code};
 let key = 'itemCname';
 let value = 'itemCode';
 if (code === 'getWarehouseName') {
     url = WAREHOUSEURL.GETALLWAREHOUSE;
     param = {};
     key = 'warehouseName';
     value = 'warehouseCode';
 } else if (code === 'product_disp.matkind') {
  url = WAREHOUSEURL.GETALLMAT;
  param = {};
  key = 'matKindName';
  value = 'matKindCode';
}
 this.http.post(url, param).then(
   (res: any) => {
     if (res.success) {
         const data = (res.data.data || []).map((x: any) => ({name: x[key], value: x[value]}));
        //  if (code === 'product_disp.queueClass') { // 排队优先级
        //       this.queueClass = [...data];
        //  } else if (code === 'product_disp.ruleStatus') { // 状态
        //       this.ruleStatus = [...data];
        //  } else if (code === 'getKindName') { // 分类名称
        //       this.kindArr = [...data];
        //  } else if (code === 'getWarehouseName') { //仓库名称
        //       this.warehouseArr = [...data];
          if (code === 'product_disp.gate') { // 可入厂大门
              this.gateArr = [...data];
         }
        ob && ob.next(data);
     } else {
        ob && ob.error();
     }
   }
 )
}

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    data.status = "^(product_disp_queue_status_1)";
    data.gateCode = this.tempSearchParam.gateCode ? this.tempSearchParam.gateCode : '';
    this.updateData = [];
    this.getList(data);
  }


  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);
    clearInterval(this.updateInterval);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    const url = WAREHOUSEURL.ENTRYQUEUEGETRECORDS; // 查询数据
    const url1 = WAREHOUSEURL.GETNUMBYGATE; // 查询车辆数
    this.loading = true;
    this.dataSet = [];
   // this.updateData = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSetClone = [];
        const dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data && res.data.total || 0;
        this.dataSet = [...dataSet];
        if (this.updateData[0]){
          this.dataSet.map(x => {
            // if(x.rowid === this.updateData[0].rowid){
            //   x.checked = true;
            // }
            this.updateData.map(y => {
                 if (x.rowid === y.rowid) {
                    x.checked = true;
                 }
            });
          });
        }
        this.totalPage = res.data.data && res.data.data.total || 0;
       //  this.dataSet.map(x => (x.editstate = 0));
        this.setQueueingTime();
        dataSet.forEach((x: any) => {
          this.dataSetClone = [...this.dataSetClone, {...x}];
          x.editstate = 0;
        });
      }
    });
    this.http.post(url1, {'status':"^(product_disp_queue_status_1)"}).then(res => {
      if (res.success) {
        this.tabs.forEach(item => {
          item.itemCount = 0;
        });
        for (let i = 0 ; i < res.data.data.length ; i++) {
          for ( let j = 1 ; j < this.tabs.length ; j++ ) {
              if ( res.data.data[i].gateCode === this.tabs[j].itemCode ) {
                this.tabs[j].itemCount = res.data.data[i].ct;
              }
          }
          this.tabs[0].itemCount += res.data.data[i].ct;
        }
      }
    });
  }

  // getData(url, arr): void {
  //   this.http.post(url, {}).then(
  //     (res: any) => {
  //       console.log(res.data);
  //       if (res.data.code === 100) {
  //         res.data.data.forEach(item => {
  //           arr.push(item);
  //         });
  //       }
  //     }
  //   );
  // }

  /**
   * 页面选中数据赋值给全局变量
   * @param data
   */
  updateDataResult(data: any) {
    this.updateData = data;
  }

  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnClick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      // case 'Update': // 修改按钮
      //     this.updateMethod(this.updateData[0]);
      //   break;
        // case 'Save': // 保存修改
        //   this.saveMethod(this.dataSet.filter(x => x.selectShow === true)[0]);
        // break;
        case 'BatchUpdate':  // 批量修改
          this.btnUpdateAll();
          break;
          // case 'Cancel': // 取消保存
          //   this.cancelMethod();
          //   break;
            case 'Operate': // 操作
            this.operate(this.updateData[0]);
          break;
          case 'directEntry': // 直接入厂
            this.directEntry('1');
            break;
            case 'Return': // 操作返回
               this.Cancel();
                break;
                case 'greenChannel':
                    this.directEntry('2');
                    break;
                    case 'CallNum':
                      this.callNum(this.updateData);
                      break;
    }
  }
  /**
   * 叫号
   * @param data
   */
  callNum(data: any) {
    if (data.length  !== 1 ) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请勾选一条数据进行操作'
      });
      return;
    }
    // const taskId = data[0].taskId;
    this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: '是否确定叫号?',
      nzOnOk: () => new Promise((resolve, reject) => {
         this.http.post(WAREHOUSEURL.CALLNUM, {'warehouseCode': data[0].warehouseCode}).then(
           (res: any) => {
             if (res.code === 100) {
                 resolve();
                 this.getList(this.tempSearchParam);
                 this.nm.success({
                   nzTitle: '提示信息',
                   nzContent: res.msg
                 })
             } else {
               reject();
             }
           }
         );
      })
    });
  }

  /**
   * 操作按钮
   */
  operate(data:any){
    if(this.updateData.length !== 1){
      this.nz.error('提示信息', '请勾选一条数据');
      return;
    }
    this.http.post(WAREHOUSEURL.ENTRYQUEUEGETRECORDS, {rowid: data.rowid, status:"^(product_disp_queue_status_1)"}).then(
     (res: any) => {
       if (res.success) {
        console.log(res.data.data.data[0]);
        this.searchData = res.data.data.data[0];
        this.modalValidateForm.patchValue(res.data.data.data[0]);
       }
     }
   )

    // this.modalValidateForm.patchValue(this.plArr[0]);
     this.InsertFormVisible = true;
  }

  /**
   * 直接入厂
   */

directEntry(param: any) {

  for (const i in this.modalValidateForm.controls) {											
    this.modalValidateForm.controls[i].markAsDirty();
    this.modalValidateForm.controls[i].updateValueAndValidity();
  }
  if (this.modalValidateForm.status === 'INVALID') {
    return;
  }

  this.searchData.gateCode=this.modalValidateForm.get('gateCode').value;
  // this.searchData.warehouseCode=this.modalValidateForm.get('warehouseCode').value;
  // this.warehouseArr.map(x => {
  //   if(x.warehouseCode ===  this.searchData.warehouseCode){
  //     this.searchData.warehouseName = x.warehouseName;
  //   }
  // });
  this.gateArr.map(x => {
    if (x.value === this.searchData.gateCode) {
      this.searchData.gateName = x.name;
    }
  });
  this.searchData.remark = this.modalValidateForm.get('remark').value.replace( /^\s*/, '');
  // if (this.cm.canOperate([ this.searchData ], 'remark', [ '', undefined, null ], '操作备注不能为空，请重新填写')) {
  //   return;
  // }
 
  const data = {...this.searchData};
  const tempStatus = data.status;
  let url;
  let title;
  if (param === '1'){ // 直接入厂
      url = WAREHOUSEURL.ENTRYNOTICE;
      title = '叫车成功';
      data.status = undefined; // 后台不需要状态
  } else if (param === '2'){   // 加入绿色通道
      url = WAREHOUSEURL.GREENCHANNNEL;
      title = '加入绿色通道成功';
      data.status = tempStatus;
  }
  this.http.post(url, data).then(
    (res: any) => {
      if (res.success) {
        this.InsertFormVisible=false;
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: title
        });
        this.listSearch(this.tempSearchParam);
      }
    }
  )
}

    // 获取表头
  getTabs(): void {
        const tab: any = {};
        tab.itemCname = '全部';
        tab.itemCount = 0;
        tab.itemCode = '' ;
        tab.formId = '';
        this.tabs.push(tab);
        this.http.post(WAREHOUSEURL.GETALLCODESETS, {'codesetCode' : 'product_disp.gate'}).then(
        (res: any) => {
          if (res.success) {
            console.log('获取表头的接口');
            console.log(res.data.data);
            // this.gateArr = (res.data.data || []).map((x: any) => ({name: x.itemCname, value: x.itemCode}));
            res.data.data.forEach(element => {
              // 排队大类名称
              console.log(element)
                const item: any = {};
                item.itemCname = element.itemCname;
                item.itemCode = element.itemCode;
                item.itemCount = 0;
                item.formId = '';
                if (element.status === 'product_disp.codeset_status_10'){
                item.status = true;
                this.tabs.push(item);
                } else {
                  item.status = false;
                }
            });
            this.listSearch({page: 1, length: this.pageSize});
          }
        }
      );

  }

  Cancel(){
    this.InsertFormVisible = false;
    this.modalValidateForm.reset();
  }

  /**
   * 切换tab执行查询
   */
  selectChange(data: any) {
    this.tempSearchParam.gateCode = data;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 替换仓库  实现可配置
   * @param data 
   */
  colName(data:any){
    // const warehouse = data.filter(x => x.colEname === 'warehouseCode');
    // warehouse[0].tdTemplate = this.warehouse;
    // const gate = data.filter(x => x.colEname === 'gateName');
    // gate[0].tdTemplate = this.gate;
  }

     /**
   * 修改方法
   * @param 选中的第一条数据
   */
  updateMethod(data: any) {
    console.log(data);
    // const that = this;
    // console.log(data)
    // that.tempUpdateParam = { ...data };
    // console.log(that.tempUpdateParam);
    // if (this.updateData.length !== 1) {
    //   this.tplModal = this.nm.info({
    //     nzTitle: '提示信息',
    //     nzContent: '请选择一条数据之后修改'
    //   });
    //   return;
    // }
    data.gateName = data.gateCode;
    data._setUpdate = true;
    // this.saveFlag = false;
    // this.updateFlag = true;
    // data.selectShow = true;
    data.editstate = 1;
  }

  /**
   * 保存方法
   */
  saveMethod(data: any) {
    console.log(data);
    let param = {...data};
    // if (this.cm.canOperate([ data ], 'warehouseCode', [ '', undefined, null ], '仓库不能为空，请重新填写')) {
    //   return;
    // }
   
    if (this.cm.canOperate([ param ], 'gateName', [ '', undefined, null ], '大门不能为空，请重新填写')) {
      return;
    }
    // this.warehouseArr.map(x => {
    //   if(x.warehouseCode === data.warehouseCode){
    //     data.warehouseName = x.warehouseName;
    //   }
    // });
    param.gateCode = data.gateName;
    // this.gateArr.map(x => {
    //   if(x.value === data.gateCode){
    //     data.gateName = x.name;
    //   }
    // });
    const gateName = this.gateArr.filter((x: any) => x.value === param.gateCode);
    param.gateName = gateName[0] && gateName[0].name;
    data.btnloading = true;
    this.http.post(WAREHOUSEURL.ENTRYQUEUEUPDATE, {...param}).then((res: any) => {
      data.btnloading = false;
      if (res.success) {
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '修改成功'
          });
      }
      this.saveFlag = true;
      this.updateFlag = false;
      this.listSearch(this.tempSearchParam);

    });


  }

  /**
   * 设置排队时间
   */
  setQueueingTime(){
    const curDateTime = new Date().getTime();
    this.dataSet.map(item => {
      if(item.queueStartTime){
        const queueingTime = curDateTime - new Date(item.queueStartTime.replace(/-/g, '/')).getTime();
        const hours = Math.trunc(queueingTime/(1000*60*60));
        const minutes = Math.trunc((queueingTime%(1000*60*60))/(1000*60));
        if(hours > 0){
          item.queueingTime = hours + '小时' + minutes + '分';
        }else if(minutes >= 0){
          item.queueingTime = minutes + '分';
        }
        if(hours > 47){
          item._bgColor='#f86c6b';
        }else if(hours > 23){
          item._bgColor='#ffbf00';
        }else {
          item._bgColor = "";
        }
      }
      if(item.entryNoticeTime){
        const noticeTime = curDateTime - new Date(item.entryNoticeTime.replace(/-/g, '/')).getTime();
        item.callingWaitTime = Math.trunc(noticeTime/(1000*60)) + '分';
      }
      if(item.status == 'product_disp_queue_status_17'){
        item._bgColor = '#63c2de';
      }
    });
  }

  btnUpdateAll() {
    if(this.updateData.length == 0) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请至少选择一条数据之后修改'
      });
      return;
    }
    this.modalTitle = "车辆排队调度 >批量修改大门"
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
  /**
   * 取消批量修改大门
   */
  handleCance(){
    this.tplModal.destroy();
    this.listSearch({ page: 1, length: this.pageSize });
  }

  /**
   * 确定批量修改大门
   */
  importConfirm(){
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }

    if(this.validateForm.get('gateCode').value == undefined){
      this.nz.error('提示信息','请选择大门')
      return;
    }
    this.updateGate();
  }

  /**
   * 批量修改大门方法
   */
  updateGate(){
    let gateCode = this.validateForm.get('gateCode').value;
    let gateName;
    this.gateArr.map(x => {
      if(x.value === gateCode) {
        gateName = x.name;
      }
    });
    this.updateData.forEach(element => {
      element.gateCode = gateCode;
      element.gateName = gateName;
    });

    this.http.post(WAREHOUSEURL.BATCHUPDATEGATE, {'entryQueues' : this.updateData, 'gateName': gateName, 'gateCode':gateCode }).then(
      (res: any) => {
        if (res.success) {
          this.nz.success('提示信息', '批量修改成功');
          this.listSearch({ page: 1, length: this.pageSize });
          this.validateForm.reset();
          this.tplModal.destroy();
        }
      }
    );
}

   /**
   * 取消保存方法 把修改保存下来的数据赋值
   */
  cancelMethod(data) {
    // console.log(this.updateData[0]);
    const d = this.dataSetClone.filter((x: any) => x.rowid === data.rowid);
    Object.keys(data).forEach(x => data[x] = d[0][x]);
    //const data = this.dataSet.filter( x => x.selectShow === true)[0];
    // data.gateName = this.tempUpdateParam.gateName;
    // data.gateCode=this.tempUpdateParam.gateCode;
    // data.warehouseCode = this.tempUpdateParam.warehouseCode;
    // data.warehouseName = this.tempUpdateParam.warehouseName;
    // this.saveFlag = true;
    // this.updateFlag = false;
    data._setUpdate = false;
    // this.dataSet.map((x) => ( x.selectShow = false));
    data.selectShow = false;
    data.editstate = 0;
  }
}
