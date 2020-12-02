import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';
import {CommonService} from '@service/common.service';
import {urls} from '@model/url';

import {differenceInCalendarDays} from "date-fns";
import {TRANS_URLS} from '@model/trans-urls';
import {Utils} from '@util/utils';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.css']
})
export class AddScheduleComponent implements OnInit {

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
  dataSet3:any=[]//车队列表数据
  dataSet4:any=[]//司机列表数据
  updatadata3:any=[]
  updatadata4:any=[]
  businessModuleIdArr:any=[]
  loading1:boolean;
  loading
  remark:any
  driver:any
  fleet:any
  deleteVisible:boolean=false;
  modalTitle2:any;
  deleteCon:any;
  open:boolean = false
  implistLoading:boolean = false
  tplModal: NzModalRef;
  @ViewChild('productName') productName:ElementRef;
  @ViewChild('vehicleNo') vehicleNo:ElementRef;



  constructor(private http: HttpUtilService,
              private nm: NzModalService,
              private nz: NzNotificationService,
              private nzMess:NzMessageService,
              private fb:FormBuilder,
              private info: UserinfoService,
              private cm:CommonService,) {

  }

  ngOnInit() {
    this.validateForm1 = this.fb.group({
      consignorCompanyId: [null],
      startPoint: [null, [Validators.required]],
      provinceId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      districtId: [null],
      businessTime: [null, [Validators.required]],
      businessModuleId: [null, [Validators.required]],
      carrierCompanyId:[null],
    });
    debugger
    this.getStatic(this.consignorCompanyArr,'CYTYR')
    this.getStatic(this.startPointArr,'CYZCD')
    setTimeout(()=>{
      this.validateForm1.get('cityId').reset({value: null, disabled: true});
      this.validateForm1.get('districtId').reset({value: null, disabled: true});
      this.validateForm1.get('consignorCompanyId').setValue(this.consignorCompanyArr[0]&&this.consignorCompanyArr[0].value||undefined);
      this.TYRChange(this.consignorCompanyArr[0]&&this.consignorCompanyArr[0].value||undefined);
      this.validateForm1.get('businessTime').setValue(this.getLocalTime());
    },500)
  }

  TYRChange(data:any){
    // console.log(data)
    this.startPointArr1=this.selectZCD(this.startPointArr,data);
    this.validateForm1.get('startPoint').setValue(this.startPointArr1[0]&&this.startPointArr1[0].value||undefined);
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

  businiessModuleIdChange(data:any){
    debugger
    if(this.validateForm1.get('consignorCompanyId').value==null||data==null){
      return
    }
    let url = TRANS_URLS.getPlateCompanyName;
    this.loading = true;
    let param: any = {businessModuleId:data};
    this.http.post(url, param).then((res: any) => {
      if (res.success) {
        console.log(res);

        this.dataSet3 = res.data.data.data;
        this.loading = false;
        this.dataSet4 = [];
      }
    });
  }
  getBusinessMOduleId(data1:Array<any>,code:any){
    this.http.post(urls.getBusinessModuleId,{plateCompanyId:code,companyId:this.info.APPINFO.USER.companyId}).then(res=>{
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


  getDriver(){
    this.http.post(urls.selectDriverData,{businessModuleId:this.validateForm1.get('businessModuleId').value,platerCompanyId:this.updatadata3[0].companyId,companyId:this.validateForm1.get('consignorCompanyId').value}).then(res=>{
      console.log(res)
      if(res.success){
        this.dataSet4 = res.data.data
      }
      this.loading1 = false
    })
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

  updataDataResult4(data:any){
    this.updatadata3 = data;
    if(this.updatadata3.length===1){
      this.loading1 = true
      this.getDriver()
    }
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

  modelChange(data:any,data1:any){
    console.log(this.dataSet3);
    let flag :boolean = false
    data1.vehicleNoList.forEach(item1=>{
      if(item1.vehicleNo==data){
        data1.truckWeight=item1.truckWeight;
        data1.vehicleKind = item1.vehicleKind;
        flag = true
      }
    })
    if(!flag){
      data1.truckWeight = null
      data1.vehicleKind = null
    }
    data1.vehicleNo = data
  }
  open1(data:any){
    data.open  = true
  }

  disabledDate=(current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
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

  updateData(data:any){
    this.updatedataAdd = data
  }
  colName(data:any){
    let productName = data.filter(x => x.colEname === 'productName')
    productName[0].tdTemplate = this.productName;
  }

  selectFleet() {
    let itemStr: any;
    let arr: any = [];
    let arr1: any = [];
    // this.dataSet2.forEach((item: any) => {
    //   let param: any = {};
    //   param.companyName = item.companyName;
    //   arr1.push(param);
    // });
    this.dataSet3.forEach((item: any) => {
      itemStr = JSON.stringify(item);
      if (itemStr.indexOf(this.fleet) >= 0) {
        arr.push(item);

        this.dataSet3 = this.dataSet3.filter(item1 => item1.companyName !== item.companyName);

        return;
      }
    });

    this.dataSet3 = [...arr, ...this.dataSet3];
    arr = [];
  }

  /*
  *  车队列表修改
  */
  modelChange1(data:any){

  }

  /*
  * 司机列表勾选
  */
  updataDataResult5(data:any){
    this.updatadata4 = data;
  }

  /*
  *   司机列表勾选
  */
  updataDataResult6(data:any){

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

  handleCancel(){
    this.tplModal.destroy();
    this.updatadata4 = [];
    this.updatadata3 = [];
    this.dataSet3 = [];
    this.dataSet4 = [];
  }

  importConfirm4(){
    for (const i in this.validateForm1.controls) {
      this.validateForm1.controls[i].markAsDirty();
      this.validateForm1.controls[i].updateValueAndValidity();
    }
    if (this.validateForm1.status == 'INVALID') {
      return;
    }
    if(this.updatadata3.length!=1){
      this.nzMess.error('请勾选一个车队');
      return
    }
    if (this.cm.canOperate(this.updatadata3, 'settleType', ['',undefined,null], '请给勾选车队选择是否含税')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata3, 'priceStatus', ['',undefined,null], '请给勾选车队选择价格状态')) {
      return;
    }
    if (this.cm.canOperate(this.updatadata3, 'unitPrice', ['',undefined,null], '请给勾选车队填写金额')) {
      return;
    }
    if(this.updatadata4.length!=1){
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
    let url =TRANS_URLS.consignorCompanyAddSchedule;
    let param :any={}
    param = this.validateForm1.getRawValue();
    param.remark = this.remark;
    param.planDriver = {}
    console.log(this.updatadata3)
    param.planDriver.driverName = this.updatadata3[0].name
    param.planDriver.driverId = this.updatadata3[0].userId
    param.planDriver.vehicleNo = this.updatadata3[0].vehicleNo
    param.planDriver.mobile = this.updatadata3[0].mobile
    param.planDriver.planWeight = this.updatadata3[0].entrustedWeight
    param.businessTime = param.businessTime && param.businessTime instanceof Date ? Utils.dateFormat(param.businessTime, 'yyyy-MM-dd') : param.businessTime || '';
    param.tOrderItemModels = this.dataSetAdd;
    param.tTenderPriceModel=this.updatadata3[0];
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
    console.log(param)
    this.http.post(url,param).then((res:any)=>{
      if(res.success){
        console.log(res);
        this.nz.create('success', '提示信息', res.data.data, {nzDuration: 3000});
        this.tplModal.destroy();
        this.dataSetAdd = [];
        this.updatadata4=[];
        this.updatadata3 = [];
        this.implistLoading = false;
      }
    })
  }

  isfillingWeight() {
    let count = 0;
    let flag: boolean = false;
    this.dataSetAdd.forEach(item => {
      console.log(item);
      if (item.totalWeight == '' || item.productName == '') {
        flag = true;
        count = 1;
        return;
      }
      if (item.totalWeight == undefined || item.productName == undefined) {
        flag = true;
        count = 1;
        return;
      }
      if (item.totalWeight <= 0) {
        flag = true;
        count = 2;
        return;
      }
      if (item.specDesc != undefined && item.specDesc.length > 20) {
        flag = true;
        count = 3;
        return;
      }
      if (item.remark != undefined && item.remark.length > 30) {
        flag = true;
        count = 4;
        return;
      }
      if (item.totalWeight != undefined && item.totalWeight.length > 18) {
        flag = true;
        count = 5;
        return;
      }
      if (item.warehouseOutNo != undefined && item.warehouseOutNo.length > 20) {
        flag = true;
        count = 6;
        return;
      }
    });
    if (flag) {
      if (count == 1) {
        this.nzMess.error('请填写表中参考运量和品种');
      }
      if (count == 2) {
        this.nzMess.error('参考运量填写错误，应大于0，请重新填写！');
      }
      if (count == 3) {
        this.nzMess.error('规格限制20个字，请重新输入！');
      }
      if (count == 4) {
        this.nzMess.error('备注限制30个字，请重新输入！');
      }
      if (count == 5) {
        this.nzMess.error('参考运量限制14位，请重新输入！');
      }
      if (count == 6) {
        this.nzMess.error('出库仓库号限制20个字，请重新输入！');
      }
    }
    return flag;
  }
}
