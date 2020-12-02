import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {urls} from '../../../../common/model/url';
// @ts-ignore
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {Utils} from '../../../../common/util/utils';
import {CommonService} from '@service/common.service';

@Component({
  selector: 'app-schedule-info-CDGC',
  templateUrl: './schedule-info-cdgc.component.html',
  styleUrls: ['./schedule-info-cdgc.component.css']
})
export class ScheduleInfoCdgcComponent implements OnInit {
  loading: boolean;
  updatedata: any=[]
  dataSet: any =[]
  totalPage: any = 0
  pageSize1: any = 30;
  totalPages2: any = 0;
  listLoading2: any
  dataSet2: any = []
  pageSize2: any = 30;
  tempSearchParam: any
  tPlans:any;
  buttonId:any

  gridOneHeight: string;
  gridTwoHeight: string;

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
  productArr:any=[]
  buttonId1:any
  carrierCompanyName:any
  carrierCompanyId:any
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  @ViewChild('productName') productName:ElementRef;
  tplModal: NzModalRef;

  dataSet3:any;
  updatadata3:any
  loading1:boolean;
  remark:any
  driver:any
  implistLoading:boolean
  // leftWidth: string = '49.5%';
  // lineWidth: string = '49.5%';
  // rightWidth: string = '49.5%';
  // display: string = 'block';
  // rightShow: boolean = false;

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,
              private fb:FormBuilder,
              private info: UserinfoService,
              private cm: CommonService) {
  }

  ngOnInit() {
    // this.listSearch({page: 1, length: this.pageSize1})
    this.getStatic(this.consignorCompanyArr,'CYTYR')
    this.getStatic(this.startPointArr,'CYZCD')

  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url = TRANS_URLS.getScheduleInfoCDGC;
    this.loading = true;
    this.dataSet = [];
    this.dataSet2 =[];
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
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  updateDataResult(data: any) {
    this.updatedata = data;
    if(data.length!=0) {
      this.getList2({page:1,length:this.pageSize2,tPlans:data});
    }else{
      this.dataSet2=[];
    }
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
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
        this.totalPages2 = res.data.data&&res.data.data.data.length;
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
      case 'Return':
        this.btnReturn();
        break;
      default:
        break;
    }
  }

  /*
  *  撤销
  */
  btnReturn(){
    if(this.updatedata.length!==1){
      this.nz.error('提示信息','请只勾选一条数据');
      return;
    }
    if (this.canOperate(this.updatedata, 'planStatus', ['DDZT10','DDZT20','DDZT30','DDZT50'], '该数据已失效，不能进行撤销操作！')) {
      return;
    }
    let url = TRANS_URLS.returnScheduleInfo;
    let param :any ={}
    param = this.updatedata[0]
    this.http.post(url,param).then(res=>{
      console.log(res)
      if(res.success){
        this.nz.create('success', '提示信息','撤销成功',{nzDuration: 3000});
        this.listSearch(this.tempSearchParam)
      }
    })
  }


  btnAdd(){
    let url = TRANS_URLS.getDriver;
    this.loading1 = true
    let param :any = {companyId:this.info.APPINFO.USER.companyId};//获取对应车队的车辆
    this.http.post(url,param).then((res:any)=>{
      if(res.success){
        this.dataSet3 = res.data.data.data;
        // @ts-ignore
        setTimeout(this.loadFalse(),3000);
      }
    })
    // console.log(this.info.APPINFO.USER)
    this.carrierCompanyId= this.info.APPINFO.USER.companyId
    this.carrierCompanyName= this.info.APPINFO.USER.companyName
    this.validateForm1 = this.fb.group({
      consignorCompanyId: [null],
      startPoint: [null, [Validators.required]],
      provinceId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      districtId: [null],
      businessTime: [null, [Validators.required]],
      carrierCompanyId:[null],
    });

    this.getAddressData({level: 'DZDJ10'});
    this.http.post(urls.selectProdNew, {}).then(
      (res: any) => {
        // console.log(res)
        if (res.success) {
          let arr = [];
          res.data.data.forEach( item => {
            arr.push({name:item.prodKindPrice,value:item.prodKindPrice})
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
    this.modalTitle = "调度查询 > 新增调度单";
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '50%',
      nzMaskClosable: false,
      nzClosable: false,
    })
    // console.log(this.startPointArr)
    console.log(this.consignorCompanyArr)
    this.startPointArr1=this.selectZCD(this.startPointArr,this.consignorCompanyArr[0].value)
    console.log(this.selectZCD(this.startPointArr,this.consignorCompanyArr[0].value))
    this.validateForm1.get('consignorCompanyId').setValue(this.consignorCompanyArr[0]&&this.consignorCompanyArr[0].value||undefined);
    this.validateForm1.get('carrierCompanyId').setValue(this.carrierCompanyId);
    this.validateForm1.get('startPoint').setValue(this.startPointArr1[0]&&this.startPointArr1[0].value||undefined);
    this.validateForm1.get('businessTime').setValue(this.getLocalTime());
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



  updataDataResult4(data){
    this.updatadata3 = data;
  }
  handleCancel() {
    this.tplModal.destroy();
    this.driver = null;
    this.remark = null;
  }
  importConfirm3(){
    for (const i in this.validateForm1.controls) {
      this.validateForm1.controls[i].markAsDirty();
      this.validateForm1.controls[i].updateValueAndValidity();
    }
    if (this.validateForm1.status == 'INVALID') {
      return;
    }
    if(this.dataSetAdd.length<1){
      this.nzMess.error('请至少添加一条明细');
      return
    }
    if(this.isfillingWeight()){
      return;
    }
    if(this.driverWeight()){
      return
    }
    let url = TRANS_URLS.addScheduleInfo;
    let param :any={}
    param = this.validateForm1.getRawValue();
    param.remark = this.remark;
    param.planDriver = {}
    param.planDriver.driverName = this.updatadata3[0].name
    param.planDriver.driverId = this.updatadata3[0].userId
    param.planDriver.vehicleNo = this.updatadata3[0].vehicleNo
    param.planDriver.mobile = this.updatadata3[0].mobile
    param.planDriver.planWeight = this.updatadata3[0].entrustedWeight
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

    this.http.post(url,param).then((res:any)=>{
      if(res.success){
        // console.log(res);
        this.nz.create('success','提示信息',res.data.data,{nzDuration: 3000})
        this.tplModal.destroy();
        this.dataSetAdd=[];
        this.listSearch({ page: 1, length: this.pageSize1 });
      }
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
      let param :any={};
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

  TYRChange(data:any){
    // console.log(data)
    this.startPointArr1=this.selectZCD(this.startPointArr,data);
    this.validateForm1.get('startPoint').setValue(this.startPointArr1[0]&&this.startPointArr1[0].value||undefined);
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


  canOperate(list: Array<any>, option: string, statusArr: Array<any>, tipInfo: string): boolean {
    let flag = false;
    list.forEach((item) => {
      if (statusArr.indexOf(item[option]) < 0) {
        flag = true;
      }
    });
    if (flag) {
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
}
