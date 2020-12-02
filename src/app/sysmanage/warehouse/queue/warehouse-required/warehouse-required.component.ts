import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import {WAREHOUSEURL} from '@model/warehouseUrl';
import {CommonService} from '@service/common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserinfoService } from '@service/userinfo-service.service';
import { environment } from '@env/environment';
@Component({
  selector: 'app-warehouse-required',
  templateUrl: './warehouse-required.component.html',
  styleUrls: ['./warehouse-required.component.css']
})
export class WarehouseRequiredComponent implements OnInit {
  intervalFlag = true; // 控制定时器是否执行
  dataSet: Array<any> = []; // 结果集
  loading = false; // 页面查询加载
  pageSize = 30; // 页面显示数据条数
  totalPage = 0; // 总页数
  updateData: Array<any> = []; // 选中的数据
  buttonId = '';
  carNum: Number = 0; // 页面序号
  tabs: Array<any> = []; // 页面数组
  tempSearchParam: any = {}; // 查询参数
  columnsArr: any[] = []; // 列表头
  // saveFlag = true; // 保存标记
  // updateFlag = false; // 修改标记
  warehouseArr: Array<any> = []; // 仓库数组
  num = 0; // 全部仓库的数据数量
  gateArr: Array<any> = []; // 大门数组
  tempUpdateParam: any = {}; // 修改参数保存
  tplModal: NzModalRef; // 操作成功后弹窗属性
  modalTitle: string = null; // 批量修改标题
  searchData:{[key:string]:any} = {}; // 操作的数据
  validateForm:FormGroup;
  modalValidateForm: FormGroup;//操作代码集弹窗
  InsertFormVisible:boolean=false;//操作弹框
  warehouseCodeArr:Array<any> = []; // 仓库权限code数组
  searchArray:Array<any> = [];
  // 计算排队时长定时器
  interval: any;
  //刷新数据定时器
  updateInterval:any;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;

  @ViewChild('warehouse') warehouse:ElementRef;
  @ViewChild('gate') gate:ElementRef;
  constructor(
    private http: HttpUtilService,
    private nz: NzNotificationService,
    private cm:CommonService,
    private nm: NzModalService,
    private fb: FormBuilder,
    private user: UserinfoService,
  ) {
  }

  // 模板表单数据
  modalFormData: Array<any> = [
    {name: '车牌号', eName:'truckNo', type: 'input',validateCon: '',require:false,
      validators:{
        require: true,
        pattern:false,
      }
   },
    {name: '品种', eName:'matName', type: 'input', validateCon: '',require:false,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '优先级', eName:'queueClassName', type: 'input', validateCon: '',require:false,
    validators:{
      require: true,
      pattern:false,
    }
  },
  {name: '大门', eName:'gateName', type: 'input', validateCon: '请选择入厂大门',require:false,
  validators:{
    require: true,
    pattern:false,
  },
  },
  {name: '仓库', eName:'warehouseName', type: 'input', validateCon: '请选择仓库',require:false,
  validators:{
    require: true,
    pattern:false,
  },
},
{name: '排队开始时间', eName:'queueStartTime', type: 'input', validateCon: '',require:false,
  validators:{
    require: true,
    pattern:false,
  },
},
{name: '排队号', eName:'queueNo', type: 'input', validateCon: '',require:false,
  validators:{
    require: true,
    pattern:false,
  },
},
{name: '操作备注', eName:'remark', type: 'textarea', validateCon: '请填写备注',require:true,
  validators:{
    require: true,
    pattern:false,
  },
}
];

  ngOnInit() {
     this.getTabs();
     this.getData(WAREHOUSEURL.GETALLWAREHOUSE, this.warehouseArr);
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

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.updateData = [];
    // data.status="^(product_disp_queue_status_1)";
    data.warehouseCode = this.tempSearchParam.warehouseCode ? this.tempSearchParam.warehouseCode : '';
    this.getList(data);
  }

  ngOnDestroy() {
    // 清除定时器
    clearInterval(this.interval);
    clearInterval(this.updateInterval);
  }

      // f
 // 静态数据获取
public staticData = (code: string) => new Observable((observe) => {
  this.getStatic(code,observe);
})
private getStatic(code: string, ob?: any){
 let url = WAREHOUSEURL.GETALLCODESETS;
 let param:any = {codesetCode: code};
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
        ob && ob.next(data);
     } else {
        ob && ob.error();
     }
   }
 )
}

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    const url = WAREHOUSEURL.WAREHOUSEGETRECORDS; // 查询数据
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    const param = {...data};
    param.warehouseCode = this.warehouseCodeArr.join(',');
    // data.wahouseCode = this.warehouseCodeArr.join(',');
    if (this.warehouseCodeArr.length > 0 ) {
      this.http.post(WAREHOUSEURL.GETRECORDBYWAREHOUSECODE, {...param}).then((res: any) => {
        if (res.success) {
         console.log(res.data);
         this.tabs.map(x => {
           x.itemCount = 0;
         });
          for (let i = 0 ; i < res.data.data.length ; i++) {
            for ( let j = 0 ; j < this.tabs.length ; j++ ) {
                if ( res.data.data[i].warehouseCode === this.tabs[j].itemCode ) {
                  this.tabs[j].itemCount = res.data.data[i].queueCount;
                  if( this.tabs.length > 1){
                    this.tabs[0].itemCount += this.tabs[j].itemCount;
                  }
                }
            }
          }
        }
      });
    }


    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.dataSet.map(x => (x.selectShow = false));
        if(this.updateData[0]){
          this.dataSet.map(x => {
            if(x.rowid === this.updateData[0].rowid){
              x.checked = true;
            }
          });
        }
        
        this.setQueueingTime();
      }
    });
    this.tabs.forEach(item => {
      item.itemCount = 0;
    });
  }

  getData(url, arr): void {
    this.http.post(url, {}).then(
      (res: any) => {
        console.log(res.data);
        if (res.data.code === 100) {
          res.data.data.forEach(item => {
            arr.push(item);
          });
        }
      }
    );
  }

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
    console.log(data.buttonId);
    switch (this.buttonId) {
      case 'Update': // 修改按钮
          this.updateMethod(this.updateData[0]);
        break;
        case 'Save': // 保存修改
          this.saveMethod(this.dataSet.filter(x => x.selectShow === true)[0]);
        break;
        case 'BatchUpdate':  // 批量修改
          this.btnUpdateAll();
          break;
          case 'Cancel': // 取消保存
            this.cancelMethod();
            break;
            case 'Operate': // 操作
            this.operate(this.updateData[0]);
          break;
          case 'directEntry': // 直接进库
            this.directEntry('1');
            break;
            case 'Return': // 操作返回
               this.Cancel();
                break;
                case 'greenChannel': // 绿色通道
                    this.directEntry('2');
                    break;
                    case 'CallNum': // 叫号
                      this.callNum();
                      break;
                      case 'PassNum': // 过号
                      this.passQueue();
                      break;
      case 'ManualOutbound':
        this.manualOutbound();
        break;
    }
  }

  /**
   * 过号
   */
  passQueue(){
    if (this.updateData.length  === 0 ) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请勾选数据再进行操作'
      });
      return;
    }
    //clearInterval(this.updateInterval);
    let param:any = {};
    param.taskId=this.updateData[0].taskId;
    this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: '是否确定过号?',
      nzOnOk: () => new Promise((resolve, reject) => {
         this.http.post(WAREHOUSEURL.PASSQUEUE, param).then(
           (res: any) => {
             console.log(param);
             console.log(res);
             if (res.data.code === 100) {
                 resolve();
                 this.getList(this.tempSearchParam);
                 this.nm.success({
                   nzTitle: '提示信息',
                   nzContent: res.data.msg
                 })
             } else {
               reject();
             }
           }
         )
      })
    })
   // this.updateInterval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize }); }, 1000*60);
  }
  



  /**
   * 
   * @param data 叫号
   */
  callNum(){
    // const param = this.updateData.map(x => ({taskId: x.taskId}));
    // if (this.updateData.length  === 0 ) {
    //   this.tplModal = this.nm.info({
    //     nzTitle: '提示信息',
    //     nzContent: '请勾选数据再进行操作'
    //   });
    //   return;
    // }
  //  clearInterval(this.updateInterval);
    // let param:any = {};
    // param.taskId = this.updateData[0].taskId;
    // param.warehouseCode = this.updateData[0].wahouseCode; 
    this.nm.confirm({
      nzTitle: '提示信息',
      nzContent: '是否确定叫号?',
      nzOnOk: () => new Promise((resolve, reject) => {
         this.http.post(WAREHOUSEURL.CALLQUEUE, {warehouseCode: this.tempSearchParam.warehouseCode}).then(
           (res: any) => {
             if (res.data.code === 100) {
                 resolve();
                 this.getList(this.tempSearchParam);
                 this.nm.success({
                   nzTitle: '提示信息',
                   nzContent: res.data.msg
                 })
             } else {
               reject();
             }
           }
         )
      })
    })
  //  this.updateInterval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize }); }, 1000*60);
  }

  /**
   * 操作按钮
   */
  operate(data:any){
    if(this.updateData.length!=1){
      this.nz.error('提示信息','请勾选一条数据')
      return;
    }
   // clearInterval(this.updateInterval);
  //   this.http.post(WAREHOUSEURL.WAREHOUSEGETRECORDS, {rowid:data.rowid}).then(
  //    (res: any) => {
  //      if (res.success) {
  //       console.log(res.data.data.data[0])
  //       this.searchData=res.data.data.data[0];
  //       this.modalValidateForm.patchValue(res.data.data.data[0]);
  //      }
  //    }
  //  )
       this.searchData = data;
       this.modalValidateForm.patchValue(data);

    // this.modalValidateForm.patchValue(this.plArr[0]);
     this.InsertFormVisible=true;
  }

  /**
   * 直接入厂
   */

directEntry(param:any){

  for (const i in this.modalValidateForm.controls) {						
    this.modalValidateForm.controls[i].markAsDirty();
    this.modalValidateForm.controls[i].updateValueAndValidity();
  }
  if (this.modalValidateForm.status === 'INVALID') {
    return;
  }

  // this.searchData.gateCode=this.modalValidateForm.get('gateCode').value;                                       大门和仓库不可以修改
  // this.searchData.warehouseCode=this.modalValidateForm.get('warehouseCode').value;
  // this.warehouseArr.map(x => {
  //   if(x.warehouseCode ===  this.searchData.warehouseCode){
  //     this.searchData.warehouseName = x.warehouseName;
  //   }
  // });
  // this.gateArr.map(x => {
  //   if(x.itemCode === this.searchData.gateCode){
  //     this.searchData.gateName = x.itemCname;
  //   }
  // });
  this.searchData.remark = this.modalValidateForm.get('remark').value.replace( /^\s*/, '');;
  // if (this.cm.canOperate([ this.searchData ], 'remark', [ '', undefined, null ], '操作备注不能为空，请重新填写')) {
  //   return;
  // }
  const data = {...this.searchData};
  let url;
  let title;
  if(param === '1'){ // 直接入厂
      url = WAREHOUSEURL.WAREHOUSEINFACTORY;
      title = '直接进库成功';
      this.searchData.status = undefined; // 后台不需要状态
  }else if(param === '2'){   // 加入绿色通道
      url = WAREHOUSEURL.WAREHOUSEGREEN;
      title = '加入绿色通道成功';
  }
  this.http.post(url, {'taskId':data.taskId}).then(
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

    // 获取表头以及仓库
  getTabs(): void {
        const tab: any = {};
        // tab.itemCname = '全部';
        // tab.itemCount = 0;
        // tab.itemCode = '' ;
        //  this.tabs.push(tab);
        //获取仓库
        this.http.post(WAREHOUSEURL.GETALLCODESETS, {'codesetCode' : 'product_disp.gate'}).then(
        (res: any) => {
          if (res.success) {
            this.gateArr = res.data.data;
          }
        }
      );
    //  `${environment.baseUrlSystem}roleButton/getUserButtons`
      // 通过虚拟formid获取按钮放在tab
      this.http.post( `${environment.baseUrlSystem}roleButton/getUserButtons`, {'userId' : this.user.APPINFO.USER.userId , 'formId':'form_queue_product_ware_right'}).then(
        (res: any) => {
          if (res.success) {
            console.log('获取表头的接口');
            console.log(res.data.data);
            res.data.data.map(x => {
              this.tabs.push({'itemCname': x.buttonName , 'itemCode': x.buttonId , 'itemCount': 0} );
              this.warehouseCodeArr.push(x.buttonId);
              console.log(this.warehouseCodeArr);
            });
            if(this.tabs.length > 1){
              this.tabs.unshift({'itemCname': '全部' , 'itemCode': '' , 'itemCount': 0 }); 
            }
            if(this.tabs.length === 0){
              this.intervalFlag = false;
              this.tabs.push({'itemCname': '全部' , 'itemCode': '' , 'itemCount': 0});
            }else{
              this.tabs[0].itemCode = this.warehouseCodeArr.join(',');
              this.tempSearchParam.warehouseCode = this.tabs[0].itemCode;
              this.listSearch({page:1,pageSize:30});
              this.interval = setInterval(() => { this.setQueueingTime(); }, 1000*60);
            }
            // if(this.warehouseCodeArr.length > 0 ) {
            //   this.http.post(WAREHOUSEURL.GETRECORDBYWAREHOUSECODE, {'warehouseCode': this.warehouseCodeArr.join(',')}).then((res: any) => {
            //     if (res.success) {
            //      console.log(res.data);
            //       for (let i = 0 ; i < res.data.data.length ; i++) {
            //         for ( let j = 0 ; j < this.tabs.length ; j++ ) {
            //             if ( res.data.data[i].warehouseCode === this.tabs[j].itemCode ) {
            //               this.tabs[j].itemCount = res.data.data[i].queueCount;
            //               this.num += this.tabs[j].itemCount;
            //             }
            //         }                                                                          每次切换tab或者执行定时器会执行计数和查询
            //       }[ ]                                                                         方法在getlist
            //     }
            //   });
            // }
            // if(this.tabs.length === 0){
            //   this.intervalFlag = false;
            //   this.tabs.push({'itemCname': '全部' , 'itemCode': '' , 'itemCount': 0});
            // }else{
            //   this.tabs[0].itemCode = this.warehouseCodeArr.join(',');
            //   this.tempSearchParam.warehouseCode = this.tabs[0].itemCode;
            //   this.listSearch({page:1,pageSize:30});
            //   this.interval = setInterval(() => { this.setQueueingTime(); }, 1000*60);
            // }
          }
        }
      );



  }

  Cancel(){
   // this.updateInterval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize });console.log('操作返回后取消');}, 1000*60);
    this.InsertFormVisible = false;
    this.modalValidateForm.reset();
  }

  /**
   * 切换tab执行查询
   */
  selectChange(data: any) {
    this.tempSearchParam.warehouseCode = data;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 替换仓库  实现可配置
   * @param data 
   */
  colName(data:any){
    const warehouse = data.filter(x => x.colEname === 'warehouseCode');
    warehouse[0].tdTemplate = this.warehouse;
    const gate = data.filter(x => x.colEname === 'gateName');
    gate[0].tdTemplate = this.gate;
  }

     /**
   * 修改方法
   * @param 选中的第一条数据
   */
  updateMethod(data: any) {
    const that = this;
    console.log(data)
    that.tempUpdateParam = { ...data };
    console.log(that.tempUpdateParam);
    if (this.updateData.length !== 1) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后修改'
      });
      return;
    }
    // this.saveFlag = false;
    // this.updateFlag = true;
    data.selectShow = true;
  //  clearInterval(this.updateInterval);
  }

  /**
   * 保存方法
   */
  saveMethod(data: any) {
    console.log(data);
    if (this.cm.canOperate([ data ], 'warehouseCode', [ '', undefined, null ], '仓库不能为空，请重新填写')) {
      return;
    }
    // if (this.cm.canOperate([ data ], 'gateCode', [ '', undefined, null ], '大门不能为空，请重新填写')) {
    //   return;
    // }
    this.warehouseArr.map(x => {
      if(x.warehouseCode === data.warehouseCode){
        data.warehouseName = x.warehouseName;
      }
    });
    // this.gateArr.map(x => {
    //   if(x.itemCode === data.gateCode){
    //     data.gateName = x.itemCname;
    //   }
    // });
    let param : any = {} ;
    param.taskId=data.taskId;
    param.warehouseName=data.warehouseName;
    param.warehouseCode=data.warehouseCode;


    this.http.post(WAREHOUSEURL.WAREHOUSEBATCHUPDATE, {'entryQueues' : [param]}).then((res: any) => {
      if (res.success) {
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '修改成功'
          });
      }
      // this.saveFlag = true;
      // this.updateFlag = false;
      this.listSearch(this.tempSearchParam);
     // this.updateInterval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize }); console.log('保存后查询') }, 1000*60);
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
      if(item.status == 'product_disp_queue_status_37'){
        item._bgColor = '#63c2de';
      }
    });
  }

  btnUpdateAll(){
    if(this.updateData.length == 0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请至少选择一条数据之后修改'
      });
      return;
    }
  //  clearInterval(this.updateInterval);
    this.modalTitle = "仓库车辆排队调度 >批量修改仓库"
    this.validateForm = this.fb.group({
      warehouseCode: [null,[Validators.required]],
    });
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable:false,
    });
  }
  /**
   * 取消批量修改大门
   */
  handleCance(){
    this.tplModal.destroy();
    this.listSearch({ page: 1, length: this.pageSize });
   // this.updateInterval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize });console.log('取消批量修改仓库后查询')  }, 1000*60);
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
    if(this.validateForm.get('warehouseCode').value==undefined){
      this.nz.error('提示信息','请选择大门')
      return;
    }
    this.updateWarehouse();
  }

  /**
   * 批量修改仓库方法
   */
  updateWarehouse(){
    const warehouseCode = this.validateForm.get('warehouseCode').value;
    let warehouseName;
    this.warehouseArr.map(x => {
      if(x.itemCode === warehouseCode){
        warehouseName = x.itemCname;
      }
    });
    this.updateData.forEach(element => {
      element.warehouseCode = warehouseCode;
      element.warehouseName = warehouseName;
    });
    const taskIdArr = [];
    this.updateData.map(x => {
      taskIdArr.push(x.taskId);
    });
    // const param: any = {} ;
    // param.taskId = taskIdArr;
    // param.warehouseCode = wahouseCode;
    // param.warehouseName = wahouseName;
    this.http.post(WAREHOUSEURL.WAREHOUSEBATCHUPDATE,{'entryQueues' : this.updateData}).then(
      (res: any) => {
        if (res.success) {
          this.nz.success('提示信息','批量修改成功');
          this.listSearch({ page: 1, length: this.pageSize });
          this.validateForm.reset();
          this.tplModal.destroy();
        }
      //  this.updateInterval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize });console.log('批量修改成功后查询')  }, 1000*60);
      }
    );
}

   /**
   * 取消保存方法 把修改保存下来的数据赋值
   */
  cancelMethod() {
    console.log(this.updateData[0]);
    const data = this.dataSet.filter( x => x.selectShow === true)[0];
    // data.gateName = this.tempUpdateParam.gateName;
    // data.gateCode=this.tempUpdateParam.gateCode;
    data.warehouseCode = this.tempUpdateParam.warehouseCode;
    data.warehouseName = this.tempUpdateParam.warehouseName;
    // this.saveFlag = true;
    // this.updateFlag = false;
    this.dataSet.map((x) => ( x.selectShow = false));
   // this.updateInterval = setInterval(() => { this.listSearch({ page: 1, length: this.pageSize }); console.log('取消保存后查询') }, 1000*60);
  }

  /**
   * 切换tab时把查询条件带过来
   */
  searchComponent(data: any){
    console.log(data);
    if (this.searchArray.length === 0) {
      this.searchArray = data.controlArray;
    } else {
      data.controlArray = this.searchArray;
    }
  }
   manualOutbound() {
     if (this.updateData.length  === 0 ) {
       this.tplModal = this.nm.info({
         nzTitle: '提示信息',
         nzContent: '请勾选数据再进行操作'
       });
       return;
     }
     if (this.updateData[0].status !== 'product_disp_queue_status_40') {
       this.tplModal = this.nm.info({
         nzTitle: '提示信息',
         nzContent: '只有已入库的车才可以手动出库'
       });
       return;
     }
     let param:any = {};
     console.log(this.updateData[0]);
     param.taskId = this.updateData[0].taskId;
     this.nm.confirm({
       nzTitle: '提示信息',
       nzContent: '是否确定进行手动出库操作?',
       nzOnOk: () => new Promise((resolve, reject) => {
         console.log(WAREHOUSEURL.MANUALOUTBOUND,'tttt');
         this.http.post(WAREHOUSEURL.MANUALOUTBOUND, param).then(
           (res: any) => {
             console.log(param);
             console.log(res);
             if (res.data.code === 100) {
               resolve();
               this.getList(this.tempSearchParam);
               this.nm.success({
                 nzTitle: '提示信息',
                 nzContent: res.data.msg
               });
             } else {
               reject();
             }
           }
         );
       })
     });
  }
}
