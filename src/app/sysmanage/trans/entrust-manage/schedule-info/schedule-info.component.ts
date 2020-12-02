import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '../../../../common/model/url';
// @ts-ignore
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Utils} from '../../../../common/util/utils';
import {CommonService} from '../../../../common/services/common.service';
import {XlsxService} from '../../../../components/simple-page/xlsx/xlsx.service';
import {ENgxPrintComponent} from '@component/e-ngx-print';

@Component({
  selector: 'app-schedule-info',
  templateUrl: './schedule-info.component.html',
  styleUrls: ['./schedule-info.component.css'],
  providers: [
    XlsxService
  ]
})
export class ScheduleInfoComponent implements OnInit {
  loading: boolean;
  updatedata: any=[]
  dataSet: any=[];
  totalPage: any = 0
  pageSize1: any = 30;
  totalPages2: any = 0;
  listLoading2: any
  dataSet2: any = []
  pageSize2: any = 30;
  tempSearchParam: any
  tPlans:any;
  buttonId:any
  old_data:any =[] //原始数据
  gridOneHeight: string;
  gridTwoHeight: string;
  businessModuleIdArr:any=[]
  modalTitle:any ;
  validateForm1:FormGroup;
  consignorCompanyArr:Array<any>=[];
  startPointArr:Array<any>=[];
  startPointArr1:Array<any>=[];
  provinceArr:Array<any>=[];
  cityArr:Array<any>=[];
  areaArr:Array<any>=[];
  dataSetAdd:any=[]
  updatedataAdd:any=[]
  addGridId:any = this.info.APPINFO.USER.companyId==='C000062070'?'grid3':'grid2';
  productArr:any=[]
  buttonId1:any
  carrierCompanyName:any
  carrierCompanyId:any
  isAgain:boolean = false
  implistLoading:boolean= false;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  @ViewChild('productName') productName:ElementRef;
  @ViewChild('vehicleNo') vehicleNo:ElementRef;
  @ViewChild('tplTitle1') tplTitle1;
  @ViewChild('tplContent1') tplContent1;
  @ViewChild('tplFooter1') tplFooter1;
  @ViewChild('fileInput') fileInput: ElementRef;
  tplModal: NzModalRef;
  tplModal1: NzModalRef;
  //打印相关
  print:any={productName:'',totalWeight:'',endPoint:''}
  @ViewChild('print1') printComponent1: ENgxPrintComponent;
  hideTable1: boolean = true;
  showHead: boolean = false;
  printCSS:'margin:auto; text-align:left;width:720px;'

  dataSet3:any=[]
  updatadata3:any=[]
  loading1:boolean;
  remark:any
  driver:any
  deleteVisible:boolean=false;
  modalTitle2:any;
  deleteCon:any;
  open:boolean = false

  isVisible:boolean = false;
  dataSetBatch:any = [] ;
  batchUpdateData:any=[];
  @ViewChild('prodName1') prodName1:ElementRef;
  @ViewChild('startPoint') startPoint:ElementRef;
  @ViewChild('endLocationName') endLocationName:ElementRef;
  @ViewChild('driverName') driverName:ElementRef;
  @ViewChild('tplTitle2') tplTitle2;
  @ViewChild('tplContent2') tplContent2;
  @ViewChild('tplFooter2') tplFooter2;
  @ViewChild('modalTitle3') modalTitle3;
  @ViewChild('modalContent') modalContent;

  validateForm2:FormGroup;
  nameArr:any=[];
  newDrivder:boolean = false; //新人新车显示
  // leftWidth: string = '49.5%';
  // lineWidth: string = '49.5%';
  // rightWidth: string = '49.5%';
  // display: string = 'block';
  // rightShow: boolean = false;

  columnsArr: any=[];
  importFile: any;
  implistLoading1: boolean = false;
  validateForm: FormGroup;
  remarkArr: any = [];
  carrieCompanyNameArr:any=[]
  carrieCompanyNameArr1:any=[]
  modalFormData: Array<any> = [
    {
      name: '请选择文件', eName: 'importFile', type: 'text', validateCon: '请导入文件', require: true, readOnly: true,
      validators: {
        require: true,
        pattern: false
      }
    },
    {
      name: '文件', eName: 'file', type: 'file', validateCon: '请导入文件', require: true, hidden: true,
      validators: {
        require: true,
        pattern: false
      }
    },
  ];
  findSet:any={name:'司机名称电话' ,url:'getAllDriver',parameter:'driverName' ,formId:'form_schedule_info_findset'}//搜索司机参数

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,
              private fb:FormBuilder,
              private info: UserinfoService,
              private cm:CommonService,
              private xlsx: XlsxService,
              private elRef: ElementRef) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize1})
    this.getStatic(this.consignorCompanyArr,'CYTYR')
    this.getStatic(this.startPointArr,'CYZCD')
    this.getStatic(this.carrieCompanyNameArr,'CYCD')
    let url1 = TRANS_URLS.getDriver;

    let param1 :any = {companyId:this.info.APPINFO.USER.companyId,authStatus:'RZZT90'};//获取对应车队的车辆
    this.http.post(url1,param1).then((res:any)=>{
      if(res.success){
        this.dataSet3 = res.data.data.data;
      }
    })
    this.validateForm1 = this.fb.group({
      consignorCompanyId: [null],
      startPoint: [null, [Validators.required]],
      provinceId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      districtId: [null],
      businessTime: [null, [Validators.required]],
      businessModuleId: [null, [Validators.required]],
      carrierCompanyName:[null,[Validators.required]],
    });
    this.getBusinessMOduleId(this.businessModuleIdArr,this.info.APPINFO.USER.companyId);
    this.remarkArr = [{label: '鞍座', value: '鞍座'}, {label: '草垫子', value: '草垫子'}, {label: '钢丝绳', value: '钢丝绳'}, {label: '垫皮', value: '垫皮'}, {label: '垫木', value: '垫木'}, {label: '是否汽线改装', value: '是否汽线改装'}];
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url = TRANS_URLS.getSchedullInfo
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
      }
    })
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = this.pageSize1|| data.length ;
    this.getList1(data);
  }

  updateDataResult(data: any) {
    if(data.length!=0) {
      this.updatedata = data;
      this.getList2({page:1,length:this.pageSize2,tPlans:data});
    }else{
      this.updatedata = [];
      this.dataSet2=[];
    }
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.listSearch(this.tempSearchParam);
  }

  getList2(data: any) {
    let url = TRANS_URLS.getSchedullInfoItem
    this.listLoading2 = true;
    let param:any = {}
    this. tPlans = data.tPlans
    param.tPlans=data.tPlans;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        // console.log(res)
        this.listLoading2 = false;
        this.dataSet2 = res.data.data&&res.data.data.data||[]
        this.totalPages2 = res.data.data&&res.data.data.total||[];
      }
    })
  }

  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2,tPlans:this.tPlans});
  }


  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2,tPlans:this.tPlans});
  }

  btnclick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'AgainPlan'://重新下发
        this.btnResert();
        break;
      case 'Cancal'://强制完成
        this.btnCancal();
        break;
      case 'Import':
        this.btnImport();
        break;
      case 'Print':
        this.btnPrint();
        break;
      case 'Batch':
        this.btnBatch();
        break;
      default:
        break;
    }
  }

  btnResert(){
    if(!this.updatedata||this.updatedata.length!=1){
      this.nzMess.error('请勾选一条数据！');
      return
    }
    if(this.canOperate(this.updatedata,"planStatus",["DDZT35","DDZT40"],"请勾选调度状态为已拒单或者已超时的数据")){
      return
    };
    // let param:any = this.updatedata[0]
    // param.tPlanItems = this.dataSet2
    // this.http.post(TRANS_URLS.againScheduleInfo,param).then(res=>{
    //   if(res.success){
    //     this.nz.success('提示信息',res.data.data);
    //     this.listSearch(this.tempSearchParam);
    //   }
    // })
    // let url1 = TRANS_URLS.getDriver;
    //
    // let param1 :any = {companyId:this.info.APPINFO.USER.companyId,authStatus:'RZZT90'};//获取对应车队的车辆
    // this.http.post(url1,param1).then((res:any)=>{
    //   if(res.success){
    //     this.dataSet3 = res.data.data.data;
    //
    //   }
    // })
    this.isAgain = true
    this.loading1 = true
    this.http.post(urls.selectProdNew, {}).then(
      (res: any) => {
        // console.log(res)
        if (res.success) {
          let arr = [];
          res.data.data.forEach( item => {
            arr.push({name:item.prodKindPriceOut,value:item.prodKindPriceOut})
          });
          this.productArr = [...arr];
           console.log(this.productArr)
        }
      }
    );
    this.getAddressData({level: 'DZDJ10'});
    this.validateForm1 = this.fb.group({
      consignorCompanyId: [null],
      startPoint: [null, [Validators.required]],
      provinceId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      districtId: [null],
      businessTime: [null, [Validators.required]],
      businessModuleId: [null, [Validators.required]],
      carrierCompanyName:[null,[Validators.required]],

    });
    let url = TRANS_URLS.selectSchedule;
    let param :any = {planNo:this.updatedata[0].planNo,companyId:this.updatedata[0].companyId};
    this.http.post(url,param).then((res:any)=>{
      if(res.success){
        console.log(res)
        // this.startPointArr1=this.selectZCD(this.startPointArr,res.data.data.consignorCompanyId)
        this.TYRChange(res.data.data.consignorCompanyId)
        this.validateForm1.get('consignorCompanyId').setValue(res.data.data.consignorCompanyId);
        this.validateForm1.get('businessModuleId').setValue(res.data.data.businessModuleId);
        this.carrierCompanyId =  res.data.data.companyId;
        this.carrierCompanyName = res.data.data.companyName
        this.carrieCompanyNameArr1.forEach(item=>{
          if(item.value ===res.data.data.carrieCompanyId){
            this.vehicleChange(item)
            this.validateForm1.get('carrierCompanyName').setValue(item);
          }
        })
        this.validateForm1.get('startPoint').setValue(res.data.data.tPlanItems[0].startPoint);
        this.getAddressData({level:'DZDJ20',parentCode:res.data.data.tPlanItems[0].endProvinceCode})
        this.getAddressData({level:'DZDJ30',parentCode:res.data.data.tPlanItems[0].endCityCode})
        this.validateForm1.get('provinceId').setValue(res.data.data.tPlanItems[0].endProvinceCode);
        this.validateForm1.get('cityId').setValue(res.data.data.tPlanItems[0].endCityCode);
        this.validateForm1.get('districtId').setValue(res.data.data.tPlanItems[0].endDistrictCode);
        this.validateForm1.get('businessTime').setValue(res.data.data.dateTime);
        res.data.data.tPlanItems.forEach(item=>{
          item.totalWeight = item.planWeight
        })
        this.dataSetAdd = res.data.data.tPlanItems
        this.dataSetAdd = [...this.dataSetAdd];
        console.log(this.dataSetAdd)
        setTimeout(()=>{
          console.log(this.dataSet3)
          this.dataSet3.forEach(item=>{
            if(item.userId==(res.data.data&&res.data.data.driverId||undefined)){
              item.vehicleNo = res.data.data.tPlanDriver.vehicleNo;
              item.planWeight = res.data.data.tPlanDriver.planWeight;
              item.checked=true;
            }
            this.loading1=false
          })
        },5000)

        this.updatadata3 = this.dataSet3.filter(x=>x.checked)
        this.modalTitle = "车辆调度 > 再次调度";
        this.tplModal = this.nm.create({
          nzTitle: this.tplTitle,
          nzContent: this.tplContent,
          nzFooter: this.tplFooter,
          nzWidth: '50%',
          nzMaskClosable: false,
          nzClosable: false,
        })
        console.log(this.validateForm1.getRawValue())
      }
    })
  }

  btnCancal(){
    if(!this.updatedata||this.updatedata.length!=1){
      this.nzMess.error('请勾选一条数据！');
      return
    }
    // if(this.canOperate(this.updatedata,"planStatus",["DDZT10","DDZT20","DDZT50"],"勾选调度单已经完成，不能进行操作！")){
    //   return
    // };
    this.deleteVisible = true;
    this.modalTitle2 = '提示信息'
    this.deleteCon='确定要关闭任务吗？'
  }

  modalConfirmResult(data:any){
    console.log(data)
    if(data.type=='ok'){

      let param:any = this.updatedata[0]
      param.tPlanItems = this.dataSet2
      this.http.post(TRANS_URLS.cancleScheduleInfo,param).then(res=>{
        if(res.success){
          this.nz.success('提示信息',res.data.data);
          this.listSearch(this.tempSearchParam);
          this.deleteVisible = false;
        }
      })
    }else{
      this.deleteVisible = false;
    }
  }

  btnAdd(){
    let url = TRANS_URLS.getDriver;
    this.loading1 = true
    let param :any = {companyId:this.info.APPINFO.USER.companyId,authStatus:'RZZT90'};//获取对应车队的车辆
    // this.http.post(url,param).then((res:any)=>{
    //   if(res.success){
    //     this.dataSet3 = res.data.data.data;
    //     console.log(this.dataSet3);
    //     // @ts-ignore
    //     setTimeout(this.loadFalse(),3000);
    //   }
    // })
    this.http.post(TRANS_URLS.selectLastprovince,{}).then(res=>{
        if(res.success){
          this.validateForm1.get('provinceId').setValue(res.data.data.provinceCode);
          this.validateForm1.get('cityId').setValue(res.data.data.cityCode);
          this.validateForm1.get('districtId').setValue(res.data.data.districtCode);
        }
    })
    // console.log(this.info.APPINFO.USER)
    this.carrierCompanyId= this.info.APPINFO.USER.companyId
    this.carrierCompanyName= this.info.APPINFO.USER.companyName


    this.getAddressData({level: 'DZDJ10'});
    this.http.post(urls.selectProdNew, {}).then(
      (res: any) => {
        // console.log(res)
        if (res.success) {
          let arr = [];
          res.data.data.forEach( item => {
            arr.push({name:item.prodKindPriceOut,value:item.prodKindPriceOut})
          });
          this.productArr = [...arr];
          // console.log(this.productArr)
        }
      }
    );
    this.validateForm1.reset();
    this.validateForm1.get('cityId').reset({value: null, disabled: true});
    this.validateForm1.get('districtId').reset({value: null, disabled: true});
    this.dataSetAdd = [];
    //this.router.navigate(['/system/trans/entrust-manage/entrustAdd'])
    this.modalTitle = "车辆调度 > 新增调度单";
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '50%',
      nzMaskClosable: false,
      nzClosable: false,
    })
      //console.log(this.startPointArr)
    console.log(this.consignorCompanyArr)
    // this.startPointArr1=this.selectZCD(this.startPointArr,this.consignorCompanyArr[0].value)
    this.validateForm1.get('consignorCompanyId').setValue(this.consignorCompanyArr[0]&&this.consignorCompanyArr[0].value||undefined);
    this.TYRChange(this.consignorCompanyArr[0]&&this.consignorCompanyArr[0].value||undefined);
    this.validateForm1.get('carrierCompanyName').setValue(this.carrieCompanyNameArr1[0]);
    this.vehicleChange(this.carrieCompanyNameArr1[0])
    this.validateForm1.get('startPoint').setValue(this.startPointArr1[0]&&this.startPointArr1[0].value||undefined);
    this.validateForm1.get('businessTime').setValue(this.getLocalTime());
    this.loading1 = false
  }


  loadFalse(){
    this.loading1= false
  }

  getLocalTime(){
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
      : nowDate.getMonth() + 1;
    let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
      .getDate();
    let dateStr1:string = year + "-" + month + "-" + day;
    return dateStr1;
  }

  // /**
  //  * 右grid
  //  */
  // rightShowFun() {
  //   this.rightShow = !this.rightShow;
  //   if (this.rightShow) {
  //     this.leftWidth = '99%';
  //     this.lineWidth = '99%';
  //     this.rightWidth = '0%';
  //     this.display = 'none';
  //   } else {
  //     this.leftWidth = '49.5%';
  //     this.lineWidth = '49.5%';
  //     this.rightWidth = '49.5%';
  //     this.display = 'block';
  //   }
  // }
  // /**
  //  * 右grid控制
  //  * @param data
  //  */
  // gridLineFun(data: number) {
  //   console.log(data);
  //   const w = data < 1 ? data : 0.96;
  //
  //   this.leftWidth = `${w * 100}%`;
  //   this.lineWidth = `${w * 100}%`;
  //   this.rightWidth = `${99 - w * 100}%`;
  //   this.display = 'block';
  //
  // }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }


  //获取省市区
  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.validateForm1.get('cityId').reset({value: null, disabled: false});
          this.validateForm1.get('districtId').reset({value: null, disabled: true});
        }
      }
        break;
      case 'DZDJ20': {
        if (value) {
          this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.validateForm1.get('districtId').reset({value: null, disabled: false});
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value});
        }
      }
        break;
    }
  }

  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ10': {
              this.provinceArr = res.data.data;
              //this.provinceArr = res.data.data;
            }
              break;
            case 'DZDJ20': {
              this.cityArr = res.data.data;
              //this.cityArr = res.data.data;
            }
              break;
            case 'DZDJ30': {
              this.areaArr = res.data.data;
              //this.areaArr = res.data.data;
            }
              break;
          }
        }
      }
    );
  }

  updateData(data:any){
    this.updatedataAdd = data
  }
  btnCLick1(data:any){
    this.buttonId1 = data.buttonId;
    switch (this.buttonId1){
      case 'Additem':
        this.btnAddItem();
        break;
      case 'Deleteitem':
        this.btnDeleteItem();
        break;
      default:
        break;
    }
  }
  btnAddItem(){
    this.dataSetAdd.push({checked:true});
    this.dataSetAdd = [...this.dataSetAdd];
    this.updatedataAdd = this.dataSetAdd.filter(item => item.checked);
  }
  btnDeleteItem(){
    if (this.dataSetAdd.filter(item => item.checked).length == 0) {
      this.nzMess.warning("请至少选择一条委托信息");
      return;
    }
    let deleteIndex = 0;
    this.dataSetAdd.forEach(item => item.checked ? this.dataSetAdd.splice(deleteIndex, 1) : deleteIndex++);
    this.dataSetAdd = this.dataSetAdd.filter(item => !item.checked);

    let arr: any = [];
    Object.assign(arr, this.dataSetAdd);
    arr = arr.filter(item => item.checked);
    // this.selectedLength = arr.length;
  }
  disabledDate=(current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  }
  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.companyStatic, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        // console.log(res.data.data.data)
        if (res.success) {
          res.data.data.data.forEach(item=>{
            data.push(item)
          })
        }
      }
    );
  }



  updataDataResult4(data:any){
    let banList :any = this.isBlackList(data);
    window.setTimeout(()=>{
      banList.forEach(item=>{
        if(item.userId){
          data.forEach(item1=>{
            if(item1.userId===item.userId){
              item1.checked = false;
              this.nz.warning('提示信息','该司机在黑名单中无法调度，请选择其他司机')
              data.splice(data.indexOf(item1),1);
            }
          })
        }else if(item.auditVehicleNo){
          data.forEach(item1=>{
            if(item1.vehicleNo===item.auditVehicleNo){
              item1.vehicleNo = undefined;
              this.nz.warning('提示信息','该车牌未审核无法调度，请选择其他车牌')
            }
          })
        }else if(item.vehicleNo){
          data.forEach(item1=>{
            if(item1.vehicleNo===item.vehicleNo){
              item1.vehicleNo = undefined;
              this.nz.warning('提示信息','该车牌在黑名单中无法调度，请选择其他车牌')
            }
          })
        }
      })
      this.updatadata3 = data;
      if(data.length>0){
        if(data[0].flag===1&&this.info.APPINFO.USER.companyId==='C000062070'&&data[0].vehicleNo){
          this.showNewDriver(data[0]);
      }else{
          this.newDrivder = false;

        }
      }else{
        this.newDrivder = false;

      }
    },500)
  }
  handleCancel() {
    this.tplModal.destroy();
    this.driver = null;
    this.remark = null;
    this.newDrivder = false
    this.validateForm1.reset()
  }
  importConfirm3(){
    for (const i in this.validateForm1.controls) {
      this.validateForm1.controls[i].markAsDirty();
      this.validateForm1.controls[i].updateValueAndValidity();
    }
    if (this.validateForm1.status == 'INVALID') {
      return;
    }
    if(this.updatadata3.length!=1){
      this.nzMess.error('请勾选一个司机');
      return
    }
    if(this.dataSetAdd.length<1){
      this.nzMess.error('请至少添加一条明细');
      return
    }
    if(this.isfillingWeight()){
      return;
    }
    this.implistLoading = true;
    let url = TRANS_URLS.addScheduleInfo;
    let param :any={}
    param = this.validateForm1.getRawValue();
    if (this.remark){
      param.remark = this.remark.toString();
    } else {
      param.remark = ' ';
    }
    let test = this.validateForm1.get('carrierCompanyName').value

    param.carrierCompanyName = test.value2
    param.carrierCompanyId = test.value
    param.planDriver = {}
    console.log('++++'+this.updatadata3[0])
    param.planDriver = this.updatadata3[0]
    param.businessTime = param.businessTime && param.businessTime instanceof Date ? Utils.dateFormat(param.businessTime, 'yyyy-MM-dd') : param.businessTime || '';
    param.tOrderItemModels = this.dataSetAdd;

    param.tOrderItemModels.forEach(item1=>{


      this.consignorCompanyArr.forEach(item=>{
        if(param.consignorCompanyId==item.value){
          param.consignorCompanyName=item.name;
        }
      })
      this.startPointArr.forEach(item=>{
        if(param.startPoint==item.value){
          param.startLocationName=item.name;
          item1.startPoint =item.value;
          item1.startLocationName = item.name
        }
      })
      this.provinceArr.forEach(item=>{
        if(param.provinceId==item.code){
          param.provinceName=item.name;
          item1.endProvinceCode =item.code;
          item1.provinceName = item.name
        }
      })
      this.cityArr.forEach(item=>{
        if(param.cityId==item.code){
          param.cityName=item.name;
          item1.endCityCode =item.code;
          item1.cityName = item.name
        }
      })
      this.areaArr.forEach(item=>{
        if(param.districtId==item.code){
          param.districtName=item.name;
          item1.endDistrictCode =item.code;
          item1.districtName = item.name
        }else if (param.districtId ==null) {
          param.districtName = null
          item1.endDistrictCode =null;
          item1.districtName = null
        }
      })
    })
    console.log('+++++param')
    console.log(param);
    this.http.post(url,param).then((res:any)=>{
      if(res.success){
        // console.log(res);
        this.nz.create('success','提示信息',res.data.data,{nzDuration: 3000})
        this.tplModal.destroy();
        this.remark = null;
        this.newDrivder = false
        this.dataSetAdd=[];
        this.listSearch({ page: 1, length: this.pageSize1 });
      }
      this.implistLoading = false
    })
  }

  driverWeight():boolean{
    let flag = false;
    let sum :number = 0;
    this.dataSetAdd.forEach(item=>{
      sum+=Number(item.totalWeight)
    })
    if(Number(this.updatadata3[0].entrustedWeight)!=Number(sum)){
      this.nzMess.error('司机重量不等于明细重量之和，请重新填写！');
      flag = true;
    }
    return flag;
  }
  isfillingWeight(){
    let count = 0;
    let flag:boolean=false
    this.dataSetAdd.forEach(item=>{
      if(item.totalWeight==""||item.productName==""){
        flag = true;
        count = 1;
        return
      }
      if(item.totalWeight==undefined||item.productName==undefined){
        flag = true;
        count = 1;
        return
      }
      if(item.totalWeight<=0){
        flag = true;
        count = 2;
        return;
      }
      if(item.specDesc!=undefined&&item.specDesc.length>20){
        flag = true;
        count = 3;
        return;
      }
      if(item.remark!=undefined&&item.remark.length>30){
        flag = true;
        count = 4;
        return;
      }

    })
    if(flag){
      if(count ==1){
        this.nzMess.error('请填写表中参考运量和品种');
      }
      if(count ==2){
        this.nzMess.error('参考运量填写错误，应大于0，请重新填写！');
      }
      if(count ==3){
        this.nzMess.error('规格限制20个字，请重新输入！');
      }
      if(count ==4){
        this.nzMess.error('备注限制30个字，请重新输入！');
      }
    }
    return flag;
  }


  selectDriver2(){

    let itemStr:any;
    let arr:any = [];
    let arr1:any=[];
    this.dataSet3.forEach((item:any)=>{
      let param :any={}
      param.name=item.name;
      param.vehicleNo=item.vehicleNo;
      param.vehicleKind = item.vehicleKind
      param.mobile = item . mobile;
      param.userId = item.userId;
      arr1.push(param);
    })
    arr1.forEach((item:any)=>{
      itemStr = JSON.stringify(item);
      if(itemStr.indexOf(this.driver)>0){
        arr.push(item);

        this.dataSet3 = this.dataSet3.filter(item1 =>(item1.name !== item.name));

        return;
      }
    })
    this.dataSet3 = [ ...arr,...this.dataSet3];
    arr = []
  }

  colName(data:any){
    let productName = data.filter(x => x.colEname === 'productName')
    productName[0].tdTemplate = this.productName;
  }

  colName1(data:any){
    let vehicleNo = data.filter(x => x.colEname === 'vehicleNo')
     window.setTimeout(() => {
      vehicleNo[0].tdTemplate = this.vehicleNo;
     })
    this.dataSet3.forEach(item=>{
      item.open = false
    })
    console.log(this.dataSet3);
  }

  TYRChange(data:any){
    console.log(data)
    this.startPointArr1=this.selectZCD(this.startPointArr,data);
    this.carrieCompanyNameArr1=this.selectCD(this.carrieCompanyNameArr,data);
    this.validateForm1.get('startPoint').setValue(this.startPointArr1[0]&&this.startPointArr1[0].value||undefined);
    this.validateForm1.get('carrierCompanyName').setValue(this.carrieCompanyNameArr1[0]&&this.carrieCompanyNameArr1[0]||undefined);
    console.log(222)
    this.getBusinessMOduleId(this.businessModuleIdArr,data);

  }

  selectZCD(data1:Array<any>,code:any):Array<any>{
    let arr:Array<any>=[]
    for(let i:number = 0;i<data1.length;i++){
      if(data1[i].relatedCode==undefined){
        continue;
      }
      if(data1[i].relatedCode ==code){
        arr.push(data1[i]);
      }
    }
    return arr
  }
  selectCD(data1:Array<any>,code:any):Array<any>{
    let arr:Array<any>=[]
    for(let i:number = 0;i<data1.length;i++){
      if(data1[i].relatedCode==undefined){
        continue;
      }
      if(data1[i].relatedCode ==code){
        arr.push(data1[i]);
      }
    }
    return arr
  }

  // businiessModuleIdChange(data:any){
  //   console.log(data)
  //   if(this.validateForm1.get('consignorCompanyId').value==null||data==null){
  //     return
  //   }
  //   if(this.isAgain){
  //     this.isAgain = false
  //     return;
  //
  //   }
  //   let url = urls.selectDriverData
  //   let param = {companyId:this.validateForm1.get('consignorCompanyId').value,platerCompanyId:this.info.APPINFO.USER.companyId,businessModuleId:data}
  //   this.http.post(url,param).then(res=>{
  //     console.log(res)
  //     this.dataSet3 = res.data.data;
  //     this.loading1 = false
  //   })
  // }

  vehicleChange(data:any){
    console.log(data)
    if(this.validateForm1.get('consignorCompanyId').value==null||data==null){
      return
    }
    if(this.isAgain){
      this.isAgain = false
      return;

    }
    let url = urls.selectDriverData
    let param = {companyId:this.validateForm1.get('consignorCompanyId').value,platerCompanyId:data.value}
    this.http.post(url,param).then(res=>{
      console.log(res)
      this.dataSet3 = res.data.data;
      this.loading1 = false
    })
  }
  getBusinessMOduleId(data1:Array<any>,code:any){
    this.http.post(urls.getBusinessModuleId,{companyId:code}).then(res=>{
      if(res.success){
        console.log(res)
        let arr:any =[]
        res.data.data.forEach(item=>{
          arr.push({value:item.segmentId,name:item.segmentName})
        })
        this.businessModuleIdArr = arr
      }
      this.validateForm1.get('businessModuleId').setValue((this.businessModuleIdArr[0]&&this.businessModuleIdArr[0].value||undefined))
    })
  }

  modelChange(data:any,data1:any){
    let banList :any = this.isBlackList([data1]);
    window.setTimeout(()=>{
      banList.forEach(item=>{
        if(item.userId){
          if(data1.userId===item.userId){
            data1.checked = false;
            this.nz.warning('提示信息','该司机在黑名单中无法调度，请选择其他司机')
          }
        }else if(item.auditVehicleNo){
          if(data===item.auditVehicleNo){
            data=undefined;
            data1.vehicleNo = undefined
            this.nz.warning('提示信息','该车牌未审核无法调度，请选择其他车牌')
          }
        }else if(item.vehicleNo){
          if(data===item.vehicleNo){
            data=undefined;
            data1.vehicleNo = undefined
            this.nz.warning('提示信息','该车牌在黑名单中无法调度，请选择其他车牌')
          }
        }
      })
      console.log(this.dataSet3);
      let flag :boolean = false
      data1.vehicleNoList.forEach(item1=>{
        if(item1.vehicleNo==data){
          data1.driverId=item1.driverId;
          data1.truckWeight=item1.truckWeight;
          data1.vehicleKind = item1.vehicleKind;
          data1.vehicleLength = item1.vehicleLength;
          data1.vehicleWidth = item1.vehicleWidth;
          flag = true
        }
      })
      if(!flag){
        data1.truckWeight = null
        data1.vehicleKind = null
      }
      data1.vehicleNo = data
      if(data1.flag===1&&this.info.APPINFO.USER.companyId==='C000062070'&&data1.vehicleNo){
        this.showNewDriver(data1)
      }
    },500)
  }
  open1(data:any){
    data.open  = true
  }


  /**
   *导入按钮
   */
  btnImport() {
    this.validateForm = this.fb.group({});
    this.modalFormData.forEach(item => {
      let validatorOpt = [];
      item.validators.require && validatorOpt.push(Validators.required);
      item.validators.pattern && validatorOpt.push(Validators.pattern(item.validators.patternStr));
      this.validateForm.addControl(item.eName, new FormControl('', validatorOpt));
    });
    this.implistLoading1 = false;
    this.modalTitle = "车辆调度>导入"
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle1,
      nzContent: this.tplContent1,
      nzFooter: this.tplFooter1,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false,

    });
  }

  /**
   * 选择excel
   */
  selectFile() {
    this.fileInput.nativeElement.click();
  }

  /**
   * 选择excel带入名称
   * @param file
   */
  fileChange(file: any) {
    this.importFile = file.target.files[0];
    //console.log(this.importFile);
    this.validateForm.patchValue({importFile: this.importFile && this.importFile.name || ''});

  }

  /**
   * 导入弹窗确定
   */
  importConfirm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    ;
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    if (!Utils.isExcel(this.importFile.name)) {
      this.nzMess.remove();
      this.nzMess.error('格式不正确！');
      return;
    }
    let _data;
    let dataList: any = [];
    this.implistLoading1 = true;
    let headTemplate =
      ['司机名称', '联系电话', '车牌号', '托运人', '业务执行时间', '起始地', '目的地省', '目的地市', '目的地区', '品名', '规格', '牌号', '重量'];

    this.xlsx.import(this.importFile, true).then((data: any) => {

      let keys = Object.keys(data);
      //_data.push( data[keys[i]]);

      let _data = data[keys[0]];
      if (!_data) {
        this.nzMess.remove();
        this.nzMess.error('未读取到sheet页！读取数据Excel失败！');
        this.implistLoading1 = false;
        return;
      }
      ;
      this.old_data = _data;
      let headArr: any = _data && _data[0] || [];
      if (!this.validateHead(headTemplate, headArr)) {
        this.nzMess.remove();
        this.nzMess.error(`模板不正确，请下载正确模板`);
        return;
      }
      _data.forEach(item=>{
        for( let i in item){
          if(typeof  item[i] ==='string'){
            console.log(this.trim(item[i])===''||this.trim(item[i])===null||this.trim(item[i])===undefined)
            if(!item[i]||this.trim(item[i])===''||this.trim(item[i])===null||this.trim(item[i])===undefined){
              delete item[i];
            }
          }else{
            if(!item[i]||item[i]===''||item[i]===null||item[i]===undefined){
              delete item[i];
            }
          }

        }
      })
      console.log(_data)
      let _dataNew =[];
      _data.forEach(item=>{
        if(!(item.filter(x=>x!=undefined).length == 0||item.length===0)){
          _dataNew .push(item);
        }
      })
      _data = _dataNew
      console.log(_data)
      if(_data.length==1){
        this.nzMess.error(`请检查数据，第一个tab页为空`);
        this.implistLoading1 = false;
        return;
      }
      if(!this.validateData(_data)){
        // this.nzMess.error("合同号不能为空！");
        this.implistLoading1 = false;
        return;
      }
      //this.removeEmpty(_data).then(this.excelFilter(_data));
      //console.log(_data);
      dataList.push(_data);
      _data = [];

      //console.log(dataList);
      this.excelFilter(dataList);
    });


  }

  trim(str) {
    if(str == null){
      str = "";
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
  };

  /**
   * 验证模板是否正确
   * @param head
   * @param receiptHead
   */
  validateHead(head, receiptHead): boolean {
    let flag = true;
    // if (head.length != receiptHead.length) {
    //   flag = false;
    // }
    ;
    head.forEach(item => {
      if (typeof item != 'string') {
        flag = false;
        return;
      }
      if (receiptHead.indexOf(item.trim()) < 0) {
        console.log(item);
        flag = false;
      }
    });
    if (!flag) {

      this. implistLoading1= false;
    }
    return flag;
  }
  /*
  *   导入调接口
  * */

   excelFilter(data: any) {
     let param: any = [];
     let eNameHeader: any = [];
     for (let j = 0; j < data.length; j++) {
       //console.log(data[j][0]);
       console.log(data[j][0]);

       data[j][0].map((item, index) => {
           if (this.patchEname(item)) {
             eNameHeader.push({field: this.patchEname(item), index: index});
           }
         }
       );
       // console.log(eNameHeader);
       for (let i = 1; i < data[j].length; i++) {
         let temp: any = {};
         eNameHeader.forEach((h) => {
           temp[h.field] = data[j][i][h.index];
         });
         param.push(temp);
       }
       ;
     }
     let count: any = [];
     console.log(param);
     param.forEach(item=>{
       let x :any ={planDriver:{},tOrderItemModels:[],consignorCompanyName:"",businessTime:""}
       x.consignorCompanyName = item.consignorCompanyName;
       x.businessTime = item.businessTime
       x.planDriver.driverName = item.driverName;
       x.planDriver.mobile = item.mobile;
       x.planDriver.vehicleNo = item.vehicleNo;
       x.tOrderItemModels.push({startLocationName:item.startLocationName,provinceName:item.provinceName,cityName:item.cityName,districtName:item.districtName
         ,productName:item.productName,totalWeight:item.planWeight,specDesc:item.specDesc,shopsign:item.shopsign})
       count .push(x)
     })
    console.log(count)
    let url = TRANS_URLS.importScheduleInfo;
     this.http.post(url,count).then(res=>{
       if(res.success){
         this.nz.create('success','提示信息',res.data.data,{nzDuration: 3000})
         this.tplModal.destroy();
         this.listSearch({ page: 1, length: this.pageSize1 });
       }
       this. implistLoading1= false;
     })


   }


  /***
   * 根据Excel中文表头匹配页面列表表头
   */
  patchEname(cName: any) {
    this.columnsArr.push({colCname:"托运人",colEname:"consignorCompanyName"},{colCname:"业务执行时间",colEname:"businessTime"}
            ,{colCname:"目的地省",colEname:"provinceName"},{colCname:"目的地市",colEname:"cityName"},{colCname:"目的地区",colEname:"districtName"})
    for (let i = 0; i < this.columnsArr.length; i++) {
      if (this.columnsArr[i].colCname.trim() == cName.trim()) {
        return this.columnsArr[i].colEname;
      }
    }
  }

  removeEmpty(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].length < 1) {
        data.splice(i, 1);
        i = i - 1;

      }
    }
    return data;
  }

  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data: any) {
    this.columnsArr .push.apply( this.columnsArr,data)
  }
  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit1(data: any) {
    this.columnsArr .push.apply( this.columnsArr,data)
    console.log(this.columnsArr)
  }

  /*
  * 取消弹窗
   */
  handleCancel1() {
    this.tplModal.destroy();
    this.validateForm.reset()
  }

  /**
   * 跳转下载
   */

  aClick(){
    window.location.href="https://another2.oss-cn-hangzhou.aliyuncs.com/import/%E8%BD%A6%E8%BE%86%E8%B0%83%E5%BA%A6%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx";
  }

  /**
   * 导入数据验证表头及必填字段
   * @param data
   */
  validateData(data:any):boolean{
    // 验证表头合同号必须存在
    let count :any
    let excelHeader:any = data && data[0] || [];
    let opt = ['司机名称', '联系电话', '车牌号', '托运人', '业务执行时间', '起始地', '目的地省', '目的地市',  '品名',  '重量']
    let tipMess = [];
    for(let j = 0;j < opt.length;j++){
      let op = opt[j];
      if(excelHeader.indexOf(op) < 0){
        tipMess.push(op);
      }else{
        // 验证必填字段不能为空
        for(let i=1;i<data.length;i++){
          count = this.old_data.indexOf(data[i])
          let index = excelHeader.indexOf(op);
          // console.log(data[i],data[i][index],index);
          if(!data[i][index] || data[i][index] == ''||data[i][index] == undefined||data[i][index] == null){
            this.nzMess.remove();
            this.nzMess.error(`必填字段“${op}”在行号为${count+1}处为空！`);
            return false;
          };
        };

      }
    };
    if(tipMess.length > 0){
      this.nzMess.remove();
      this.nzMess.error(`字段${tipMess.join('、')}必须存在！`);
      return false;
    };
    return true
  }

  /*
  *打印完成
   */
  printComplete() {
    this.showHead = false
    console.log('打印完成！');
  }

  /*
  * 打印
   */

  customPrint(print: any) {
    this.showHead = true
    const printHTML: HTMLElement = print;
    console.log(this.elRef.nativeElement.childNodes)
    this.printComponent1.print(printHTML);
  }
  /*
  * 打印按钮
   */
  btnPrint(){
    if(this.updatedata.length!==1){
      this.nzMess.error('请只勾选一条数据!');
      return;
    }
    this.print.companyId=this.updatedata[0].companyName;
    this.businessModuleIdArr.forEach(item=>{
      if(item.value===this.updatedata[0].businessModuleId){
        this.print.businessModuleId = item.name
      }
    })
    this.print .consignorCompanyId = this.updatedata[0].consignorCompanyName;
    this.print.endPoint = this.dataSet2[0].endLocationName;
    this.print.mobile = this.updatedata[0].mobile;
    this.print.name = this.updatedata[0].driver;
    this.dataSet2.forEach(item=>{
      this.print.productName += `${item.productName}      `
      this.print.totalWeight += `${item.totalWeight}     `
    })
    this.print.vehicleNo = this.updatedata[0].vehicleNo;
    console.log(this.print)
    let editPrint :any  =`<div  style="margin:auto; text-align:left;width:720px;" id="print_div" >` +
      `  <h2 >${this.print.consignorCompanyId} ${this.print.businessModuleId}  派车单</h2>` +
      `  <p > 车队：${this.print.companyId}  ${this.print.vehicleNo}</p>` +
      `  <p > 司机：${this.print.name}  ${this.print.mobile}</p>` +
      `  <p > 流向：${this.print.endPoint}</p>` +
      `  <p > 品名：${this.print.productName}</p>` +
      `  <p > 重量：${this.print.totalWeight}吨</p>` +
      `</div>`;
    this.customPrint(editPrint);
  }

  /**
   *    确认并打印
   */
  importConfirm4(){
    for (const i in this.validateForm1.controls) {
      this.validateForm1.controls[i].markAsDirty();
      this.validateForm1.controls[i].updateValueAndValidity();
    }
    if (this.validateForm1.status == 'INVALID') {
      return;
    }
    if(this.updatadata3.length!=1){
      this.nzMess.error('请勾选一个司机');
      return
    }
    if(this.dataSetAdd.length<1){
      this.nzMess.error('请至少添加一条明细');
      return
    }
    if(this.isfillingWeight()){
      return;
    }
    this.implistLoading = true;
    this.print.companyId=this.info.APPINFO.USER.companyName;
    this.businessModuleIdArr.forEach(item=>{
      if(item.value===this.validateForm1.get('businessModuleId').value){
        this.print.businessModuleId = item.name
      }
    })
    this.consignorCompanyArr.forEach(item=>{
      if(item.value===this.validateForm1.get('consignorCompanyId').value){
        this.print .consignorCompanyId = item.name;
      }
    })
    this.provinceArr.forEach(item=>{
      if(this.validateForm1.get('provinceId').value==item.code){
        this.print.endPoint+=item.name;
      }
    })
    this.cityArr.forEach(item=>{
      if(this.validateForm1.get('cityId').value==item.code){
        this.print.endPoint+=item.name;
      }
    })
    this.areaArr.forEach(item=>{
      if(this.validateForm1.get('districtId').value==item.code){
        this.print.endPoint+=item.name;
      }
    })
    this.print.mobile = this.updatadata3[0].mobile;
    this.print.name = this.updatadata3[0].name;
    this.dataSetAdd.forEach(item=>{
      this.print.productName += `${item.productName}      `
      this.print.totalWeight += `${item.totalWeight}吨     `
    })
    this.print.vehicleNo = this.updatadata3[0].vehicleNo;
    console.log(this.print);
    this.importConfirm3();
    let editPrint :any  =`<div  style="margin:auto; text-align:left;width:720px;" id="print_div" >` +
      `  <h2 >${this.print.consignorCompanyId} ${this.print.businessModuleId}  派车单</h2>` +
      `  <p > 车队：${this.print.companyId}  ${this.print.vehicleNo}</p>` +
      `  <p > 司机：${this.print.name}  ${this.print.mobile}</p>` +
      `  <p > 流向：${this.print.endPoint}</p>` +
      `  <p > 品名：${this.print.productName}</p>` +
      `  <p > 重量：${this.print.totalWeight}吨</p>` +
      `</div>`;
    this.customPrint(editPrint);
  }


  canOperate(list:Array<any>,option:string,statusArr:Array<any>,tipInfo:string):boolean{
    let flag = false;
    list.forEach((item) => {
      if(statusArr.indexOf(item[option]) < 0){
        flag = true;
      }
    });
    if(flag){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: tipInfo
      });
      // window.setTimeout(() => {
      //   this.tplModal.destroy();
      // }, 1500);
    }
    return flag;
  }


  btnBatch(){
    this.batchUpdateData=[];
    this.dataSetBatch =[];
    this.http.post(urls.selectProdNew, {}).then(
      (res: any) => {
        // console.log(res)
        if (res.success) {
          let arr = [];
          res.data.data.forEach( item => {
            arr.push({name:item.prodKindPriceOut,value:item.prodKindPriceOut})
          });
          this.productArr = [...arr];
          console.log(this.productArr)
        }
      }
    );
    let param: any = {
      companyId: 'C000000882',
      platerCompanyId: this.info.APPINFO.USER.companyId,
      businessModuleId: '020'
    };

    this.http.post(urls.selectDriverData, param).then(res => {
      if (res.success) {
        this.nameArr = res.data.data;
        console.log(this.nameArr)
        // let arr = [];
        // res.data.data.forEach( item => {
        //   arr.push({name:item.name,value:item.driverId})
        // });
        // this.nameArr = [...arr];
      }
    });
    this.searchBatchData();
    this.startPointArr1=this.selectZCD(this.startPointArr,'C000000882');
    this.tplModal = this.nm.create({
      nzTitle: this.modalTitle3,
      nzContent: this.modalContent,
      nzFooter: null,
      nzWidth: '60%',
      nzMaskClosable: false,
      nzClosable: true,
    })

  }

  searchBatchData(){
    this.http.post(TRANS_URLS.getBatchSchedule,{}).then(res=>{
      if(res.success){
        console.log(res)
        res.data.data.data.forEach(item=>{
          item.driverName = item.driverId
        })
        this.dataSetBatch = res.data.data&&res.data.data.data||[];
      }
    })
  }

  btnClick2(data:any){
    switch (data.buttonId) {
      case 'Add':
        this.btnBatchAdd();
        break;
      case 'Update':
        this.btnBatchUpdate();
        break;
      case 'Delete':
        this.btnBatchDelete();
        break;
      case 'Save':
        this.btnBatchSave();
        break;
      case 'Use':
        this.btnBatchUse();
        break;
      default:
        break;
    }
  }

  btnBatchAdd(){
    this.dataSetBatch.unshift({checked:true,startPoint:this.startPointArr1[0].value});
    this.dataSetBatch = [...this.dataSetBatch];
    this.batchUpdateData = this.dataSetBatch.filter(x=>x.checked);
  }

  btnBatchUpdate(){

  }

  btnBatchDelete(){
    if(this.batchUpdateData.length<1){
      this.nzMess.error('请勾选一条数据');
      return;
    }
    this.http.post(TRANS_URLS.deleteBatchSchedule,this.batchUpdateData).then(res=>{
      if(res.success){
        this.nz.success('提示信息',res.data.data,{nzDuration: 3000});
        this.searchBatchData();
        this.batchUpdateData=[];
      }
      console.log(res)
    })
  }

  btnBatchSave(){
    if(this.batchUpdateData.length<1){
      this.nzMess.error('请勾选一条数据');
      return;
    }
    console.log(this.batchUpdateData)
    if(this.cm.canOperate(this.batchUpdateData,'driverName',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'vehicleNo',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'startPoint',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'endLocationName',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'prodName',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'planWeight',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.batchUpdateData.filter(x=>x.planWeight<=0).length>0){
      this.nzMess.error('重量必须大于0,请重新输入!');
      return
    }
    if(this.isAgree()){
        return;
    }
    let param :any={};
    param.planTemplateList = this.batchUpdateData;
    param.planTemplateList.forEach(item=>{
      item.businessModuleId = '020';
      item.consignorCompanyId = 'C000000882'
      item.companyId = this.info.APPINFO.USER.companyId
      item.name=null
    })
    this.http.post(TRANS_URLS.saveBatchSchedule,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息',res.data.data,{nzDuration: 3000});
        this.searchBatchData();
        this.batchUpdateData=[];
      }
    })
  }

  isAgree(){
    let flag = false;
    let count :number = 0
    this.batchUpdateData.forEach(item=>{
      if(item.vehicleNo.length>20){
        count  = 1;
        flag= true;
        return
      }
      if(item.planWeight.length>12){
        count  = 2;
        flag= true;
        return
      }
      if(item.prodSpec.length>20){
        count  = 3;
        flag= true;
        return
      }
    })
    if(count==1){
      this.nzMess.error('车牌号最多20位，请重新填写！');
      return flag;
    }else if(count==2){
      this.nzMess.error('重量最多12位，请重新填写！');
      return flag;
    }else if(count == 3){
      this.nzMess.error('规格最多50位，请重新填写！');
      return
    }
    return  flag;
  }

  btnBatchUse(){
    if(this.batchUpdateData.length<1){
      this.nzMess.error('请勾选一条数据');
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'driverName',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'vehicleNo',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'startPoint',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'endLocationName',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'prodName',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.cm.canOperate(this.batchUpdateData,'planWeight',['',undefined,null],'清填写必填内容')){
      return;
    }
    if(this.batchUpdateData.filter(x=>x.planWeight<=0).length>0){
      this.nzMess.error('重量必须大于0,请重新输入!');
      return
    }
    if(this.isAgree()){
      return;
    }
    let url = TRANS_URLS.useBatchSchedule;
    let param:any={};
    param.planTemplateList = this.batchUpdateData;
    param.planTemplateList.forEach(item=>{
      item.businessModuleId = '020';
      item.consignorCompanyId = 'C000000882'
      item.companyId = this.info.APPINFO.USER.companyId
      item.name=null
    })
    this.http.post(url,param).then(res=>{
        console.log(res)
        if(res.success){
          this.nz.success('提示信息',res.data.data,{nzDuration: 3000});
          console.log(this.tplModal)
          this.tplModal.destroy();
          this.listSearch(this.tempSearchParam);
        }
    })
  }

  colName2(data:any){
    console.log(this.prodName1)
    let productName = data.filter(x => x.colEname === 'prodName')
    productName[0].tdTemplate = this.prodName1;
    let name = data.filter(x => x.colEname === 'driverName')
    name[0].tdTemplate = this.driverName;
    let startPoint = data.filter(x => x.colEname === 'startPoint')
    startPoint[0].tdTemplate = this.startPoint;
    let endPoint = data.filter(x => x.colEname === 'endLocationName')
    endPoint[0].tdTemplate = this.endLocationName;
  }

  updateDataBatch(data:any){
    this.batchUpdateData=data;
  }

  handleCancel2(){
    this.tplModal1.destroy();
    this.validateForm2.reset()
  }


  importConfirm1(){
    for (const i in this.validateForm2.controls) {
      this.validateForm2.controls[i].markAsDirty();
      this.validateForm2.controls[i].updateValueAndValidity();
    }
    if (this.validateForm2.status == 'INVALID') {
      return;
    }
    this.batchData.endProvinceCode = this.validateForm2.get('endProvinceCode').value
    this.batchData.endCityCode = this.validateForm2.get('endCityCode').value
    this.batchData.endDistrictCode = this.validateForm2.get('endDistrictCode').value
    let str:any=''
    this.provinceArr.forEach(item=>{
      if(this.validateForm2.get('endProvinceCode').value===item.code){
        str+=item.name
      }
    })
    this.cityArr.forEach(item=>{
      if(this.validateForm2.get('endCityCode').value===item.code){
        str+=item.name
      }
    })
    this.areaArr.forEach(item=>{
      if(this.validateForm2.get('endDistrictCode').value===item.code){
        str+=item.name
      }
    })
    this.batchData.endLocationName = str

    this.dataSetBatch.forEach(item=>{
      if(item.vehicleNo === this.batchData.vehicleNo){
        item = this.batchData
      }
    })
    this.dataSetBatch =[...this.dataSetBatch]
    this.tplModal1.destroy();
  }

  batchData:any={}

  endPointChoice(data:any){
    console.log(data)
    this.getAddressData({level: 'DZDJ10'});
    this.validateForm2 = this.fb.group({
      endProvinceCode: [null, [Validators.required]],
      endCityCode: [null, [Validators.required]],
      endDistrictCode: [null],
    });
    this.validateForm2.reset();
    this.validateForm2.get('endCityCode').reset({value: null, disabled: true});
    this.validateForm2.get('endDistrictCode').reset({value: null, disabled: true});
    this.modalTitle = "选择省市区"
    this.tplModal1 = this.nm.create({
      nzTitle: this.tplTitle2,
      nzContent: this.tplContent2,
      nzFooter: this.tplFooter2,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: false,
    });
    this.batchData = data
    if(data.endProvinceCode!==undefined||data.endProvinceCode!==null||data.endProvinceCode!==''){
      this.validateForm2.get('endProvinceCode').setValue(data.endProvinceCode);
      this.addressChange2(data.endProvinceCode,'DZDJ10')
    }
    if(data.endCityCode!==undefined||data.endCityCode!==null||data.endCityCode!==''){
      this.validateForm2.get('endCityCode').setValue(data.endCityCode);
      this.addressChange2(data.endCityCode,'DZDJ20')
    }
    if(data.endDistrictCode!==undefined||data.endDistrictCode!==null||data.endDistrictCode!==''){
      this.validateForm2.get('endDistrictCode').setValue(data.endDistrictCode);
    }
  }

  addressChange2(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.validateForm2.get('endCityCode').reset({value: null, disabled: false});
          this.validateForm2.get('endDistrictCode').reset({value: null, disabled: true});
        }
      }
        break;
      case 'DZDJ20': {
        if (value) {
          this.getAddressData({level: 'DZDJ30', parentCode: value});
          this.validateForm2.get('endDistrictCode').reset({value: null, disabled: false});
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
          this.getAddressData({level: 'DZDJ40', parentCode: value});
        }
      }
        break;
    }
  }

  driverChange(data:any){
    console.log(data)
   this.nameArr.forEach(item=>{
     if(data.driverName=== item.driverId){
       data.driverId = item.driverId
       data.mobile = item.mobile;
       data.vehicleNo = item.vehicleNo;
     }
   })
  }

  isBlackList(data:any){
    let url = urls.checkBlackList;
    let param :any={};
    let banList:any=[]
    param.tBlackListModels = data
    this.http.post(url,param).then(res=>{
      if(res.success){
        console.log(res)
        res.data.data.forEach(item=>{
          if(item.userId||item.vehicleNo||item.auditVehicleNo){
            banList.push(item)
          }
        })

      }
    })
    return banList
  }
  /*
  *  判断该司机车牌是否为新人新车
  */
  showNewDriver(data:any){
    this.http.post(TRANS_URLS.selectNewDriver,data).then(res=>{
      if(res.success){
        console.log(res)
        if(res.data.data.newDriver){
          this.newDrivder = true;
        }else{
          this.newDrivder = false;
        }
      }
    })
  }

  /*
  *  修改应付金额的同时修改应收
  */
  addModelChange(data:any){
    if(data.header.colEname==='unitPrice'){
      data.data.unitReceivePrice = data.val*1.09;
    }
  }

  otherDriverInpEmit(data:any){
    if(!data.selData){
      return;
    }
    let banList :any = this.isBlackList(data.selData);
    window.setTimeout(()=> {
      banList.forEach(item => {
        if (item.userId) {
          data.selData.forEach(item1 => {
            if (item1.userId === item.userId) {
              item1.checked = false;
              this.nz.warning('提示信息', '该司机在黑名单中无法调度，请选择其他司机')
              data.selData.splice(data.indexOf(item1), 1);
            }
          })
        } else if (item.auditVehicleNo) {
          data.selData.forEach(item1 => {
            if (item1.vehicleNo === item.auditVehicleNo) {
              item1.vehicleNo = undefined;
              this.nz.warning('提示信息', '该车牌未审核无法调度，请选择其他车牌')
            }
          })
        } else if (item.vehicleNo) {
          data.selData.forEach(item1 => {
            if (item1.vehicleNo === item.vehicleNo) {
              item1.vehicleNo = undefined;
              this.nz.warning('提示信息', '该车牌在黑名单中无法调度，请选择其他车牌')
            }
          })
        }
      })
    },500)
    if(data.selData.length>0){
      this.dataSet3.unshift(data.selData[0]);
      this.updatadata3 = this.dataSet3.filter(x=>x.checked);
      this.dataSet3 = [...this.dataSet3]
    }
  }
}
