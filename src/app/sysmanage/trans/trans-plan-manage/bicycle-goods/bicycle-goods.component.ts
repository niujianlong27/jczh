import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {urls} from '../../../../common/model/url';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {CommonService} from '../../../../common/services/common.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, map, retry} from 'rxjs/operators';
import {of} from 'rxjs';
import {TRANS_PLAN_URLS} from '@model/transPlan-urls';
import {ALLOCATE} from '@model/allocate-urls';
import {validateCardId, validatePhone, validateVehicleNo} from '@validator/validator';
//import {Utils} from '@util/utils';
import { Utils } from '../../../sea/common/utils';

@Component({
  selector: 'app-bicycle-goods',
  templateUrl: './bicycle-goods.component.html',
  styleUrls: ['./bicycle-goods.component.css']
})
export class BicycleGoodsComponent implements OnInit {
  // controlArray: Array<any> = [
  //   {
  //     cName: '车牌号',eName: 'car_mark', type: 'text', require: true, validateCon: '请输入车牌号',
  //     disabled: false, customPattern: validateVehicleNo(),
  //     customValidateStatus: 'pattern', customValidateCon: '车牌格式不正确',
  //   },
  // ]

  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,
              private fb:FormBuilder,
              private info: UserinfoService,
              private cm:CommonService,) { }

  ngOnInit() {
    // for (const control of this.controlArray) {
    //   const validateArr = [];
    //   if (control.require) {
    //     validateArr.push(Validators.required);
    //   }
    //   if (control.customPattern) {
    //     validateArr.push(Validators.pattern(control.customPattern));
    //   }
    //   if (control.customValidate) {
    //     validateArr.push(control.customValidate);
    //   }
   // }
    //this.currentDate = Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.listSearch({page: 1, length: this.pageSize1});
    this.getStatic(this.consignorCompanyArr,'CYTYR')
    this.getStatic(this.startPointArr,'CYZCD')
    //this.getprodKindPrice();
  }

  totalPage: any = 0;
  pageSize1: any = 30;
  pageSize2: any = 30;
  pageSize4: any = 30;
  dataSet: any;
  dataSet2: any;
  dataSet3: any;
  dataSet4: any;
  loading: boolean;
  loading1: boolean;
  tempSearchParam: any;
  buttonId:any;
  carrierCompanyName:any;
  carrierCompanyId:any;
  validateForm1:FormGroup;
  productArr:any=[]
  carriageArr:any=[]
  dataSetAdd:any=[]
  modalTitle:any ;
  currentDate:any;
  tplModal: NzModalRef;
  consignorCompanyArr:Array<any>=[];
  startPointArr1:Array<any>=[];
  startPointArr:Array<any>=[];
  provinceArr:Array<any>=[];
  cityArr:Array<any>=[];
  areaArr:Array<any>=[];
  listLoading2: any
  listLoading4: any
  tPlans:any;
  totalPages2: any = 0;
  totalPages4: any = 0;
  updatedata: any
  updatadata3: any
  driver:any
  remark:any
  implistLoading:boolean= false;
  deleteVisible:boolean=false;
  selectData:any;
  modalTitle2:any;
  deleteCon:any;
  selectedList1: any = [];
  loadTaskCode: number = 0;
  prodNameArr: Array<any> = [];
  validateVehicleError: boolean;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  @ViewChild('productName') productName:ElementRef;
  @ViewChild('mark') mark:ElementRef;
  @ViewChild('weight') weight:ElementRef;
  @ViewChild('car_mark') car_mark:ElementRef;
  @ViewChild('carriageCompany') carriageCompany:ElementRef;
  @ViewChild('vehicleNo') vehicleNo:ElementRef;
   checked:boolean=true;
    volume: string;
    vehicle:string;

  // 页面grid 左右分栏
  leftWidth: string = '49.5%';
  lineWidth: string = '49.5%';
  rightWidth: string = '49.5%';
  display: string = 'block';
  rightShow: boolean = false;

  /**
   * 右grid控制
   * @param data
   */
  gridLineFun(data: number) {
    const w = data < 1 ? data : 0.96;

    this.leftWidth = `${w * 100}%`;
    this.lineWidth = `${w * 100}%`;
    this.rightWidth = `${99 - w * 100}%`;
    this.display = 'block';

  }

  /**
   * 右grid
   */
  rightShowFun() {
    this.rightShow = !this.rightShow;
    if (this.rightShow) {
      this.leftWidth = '99%';
      this.lineWidth = '99%';
      this.rightWidth = '0%';
      this.display = 'none';
    } else {
      this.leftWidth = '49.5%';
      this.lineWidth = '49.5%';
      this.rightWidth = '49.5%';
      this.display = 'block';
    }
  }

  /**
   * 主列表点击触发的方法
   * @param data
   */
  listClick(data: any): void {
    this.selectedList1 = data;
    this.loadTaskCode = data.loadTaskCode;
    let url = ALLOCATE.get_bicycle_detail;
    this.listLoading2 = true;
    let param:any = {}
    param.loadTaskCode=this.loadTaskCode;
    this.http.post(url, data).then((res: any) => {
      if (res.data.code==100) {

        this.listLoading2 = false;
        this.dataSet2 = res.data.data.dataLeft;
       // this.totalPages2 = res.data.data&&res.data.data.total||[];
        this.dataSet4 = res.data.data.dataRight
      //  this.totalPages2 = res.data.data&&res.data.data.total||[];
      }
    })
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

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url = ALLOCATE.get_bicycle_list;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      console.log(res)
      if (res.data.code == 100) {
        console.log(182)
        this.loading = false;
        this.dataSet = res.data.data;
        this.totalPage = res.data.total || 0;
        this.dataSet2=data.result ==[]?[]: data.result;
        this.dataSet4=[];
      }
    })
  }

/*
* 按钮事件
* */
  btnclick(data: any) {
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'Add':
        this.btnAdd();  //新增
        break;

    }
  }
//新增
  btnAdd(){
    //this.currentDate = Utils.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
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
      productName:[null, [Validators.required]],
      carriageCompany:[null, [Validators.required]],
      weight:[null, [Validators.required]],
      mark:[null],
      car_mark:[null, [Validators.required, Validators.pattern(validateVehicleNo())]],
      carrierCompanyId:[null],
      vehicleNo:[null],
    });

    
    this.getAddressData({level: 'DZDJ10'});
    this.http.post(urls.selectProdNew, {}).then(
      (res: any) => {
        if (res.success) {
          let arr = [];
          res.data.data.forEach( item => {
            arr.push({name:item.prodKindPriceOut,value:item.prodKindPriceOut})
          });
          this.productArr = [...arr];
        }
      }
    );

    this.http.post(urls.getPlateCompanyName, {}).then(
      (res: any) => {
        if (res.success) {
          //console.log(res)
          let arr = [];
          res.data.data.data.forEach( item => {
            arr.push({name:item.shortName,value:item.companyId})
          });
          this.carriageArr = [...arr];
          //console.log(this.carriageArr)
        }
      }
    );
    this.validateForm1.reset();
    this.validateForm1.get('cityId').reset({value: null, disabled: true});
    this.validateForm1.get('districtId').reset({value: null, disabled: true});
    //this.dataSetAdd = [];
    //this.router.navigate(['/system/trans/entrust-manage/entrustAdd'])
    this.modalTitle = "单车分货 > 新增分货";
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '50%',
      nzMaskClosable: false,
      nzClosable: false,
    })

    console.log(this.startPointArr)
    console.log(this.consignorCompanyArr)
    //this.startPointArr1=this.selectZCD(this.startPointArr,this.consignorCompanyArr[0].value)
    this.startPointArr1=this.startPointArr
    //console.log(this.selectZCD(this.startPointArr))
    //this.startPointArr1=this.startPointArr[0].name
    //console.log(this.selectZCD(this.startPointArr,this.consignorCompanyArr[0].value))
    //this.productArr=this.getprodKindPrice()
    this.validateForm1.get('consignorCompanyId').setValue(this.consignorCompanyArr[0]&&this.consignorCompanyArr[0].value||undefined);
    this.validateForm1.get('carrierCompanyId').setValue(this.carrierCompanyId);
    this.validateForm1.get('startPoint').setValue(this.startPointArr1[0]&&this.startPointArr1[0].value||undefined);
    this.validateForm1.get('businessTime').setValue(this.getLocalTime());
    //this.validateForm1.get('productName').setValue(this.getprodKindPrice());
  }

  loadFalse(){
    this.loading1= false
  }
//获取地址
  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ10': {
              //console.log(res.data.data)
              this.provinceArr = res.data.data;
              this.validateForm1.get('provinceId').setValue('370000000')
            }
              break;
            case 'DZDJ20': {
              this.cityArr = res.data.data;
            }
              break;
            case 'DZDJ30': {
              this.areaArr = res.data.data;
            }
              break;
          }
        }
      }
    );
  }

  // selectZCD(data1:Array<any>,code:any):Array<any>{
  //   let arr:Array<any>=[]
  //   for(let i:number = 0;i<data1.length;i++){
  //     if(data1[i].relatedCode==undefined){
  //       continue;
  //     }
  //     if(data1[i].relatedCode ==code){
  //       arr.push(data1[i]);
  //     }
  //   }
  //   return arr;
  // }

  selectZCD(data1:Array<any>):Array<any>{
    let arr:Array<any>=[]
    for(let i:number = 0;i<data1.length;i++){
      arr.push(data1[i].name)
    }
    return arr;
    console.log(arr)
  }

  TYRChange(data:any){
    console.log(data)
    this.startPointArr1=this.selectZCD(this.startPointArr);
    this.validateForm1.get('startPoint').setValue(this.startPointArr1[0]&&this.startPointArr1[0].value||undefined);
  }

  //获取时间
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
//查询司机
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


  // gridHeight(data:any){
  //   this.gridOneHeight = `${data.one}px`;
  //   this.gridTwoHeight = `${data.two}px`;
  //   this.gridThreeHeight = `${data.three}px`;
  // }
//子表1
  getList2(data: any) {

  }
//子表2
  getList3(data: any) {
    let url = TRANS_URLS.getSchedullInfoItem
    this.listLoading4 = true;
    let param:any = {}
    this.tPlans = data.tPlans
    param.tPlans=data.tPlans;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        // console.log(res)
        this.listLoading4 = false;
        this.dataSet4 = res.data.data&&res.data.data.data||[]
        this.totalPages4 = res.data.data&&res.data.data.total||[];
      }
    })
  }

  //获取省市区
  addressChange(value, name): void {
    console.log(431)
    switch (name) {
      case 'DZDJ10': {
        if (value) {
        //if(value=370000000){
          //console.log(value)
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


  /**
   * 主列表当前页数改变的方法
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getList1({page: page, length: this.pageSize1});
  }
  getPageIndex2(page: any): void {
    this.getList2({page: page, length: this.pageSize2,tPlans:this.tPlans});
  }
  getPageIndex3(page: any): void {
    this.getList3({page: page, length: this.pageSize2,tPlans:this.tPlans});
  }

  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.getList1({page: 1, length: this.pageSize1});
  }
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({page: 1, length: this.pageSize2,tPlans:this.tPlans});
  }
  getPageSize3(pageSize: any): void {
    this.pageSize4 = pageSize;
    this.getList3({page: 1, length: this.pageSize4,tPlans:this.tPlans});
  }

  updateDataResult(data: any) {
    this.selectData = data;
    if (this.selectData.length !== 0) {
      const tloadTaskCodes = [];
      this.selectData.forEach(
        res => {
          tloadTaskCodes.push({loadTaskCode: res.loadTaskCode});
        }
      );
      this.getDetail({tloadTaskCodes: tloadTaskCodes});
      console.log(tloadTaskCodes)
    } else {
      this.dataSet2=[];
      this.dataSet4=[];
    }
      // this.getList3({page:1,length:this.pageSize4,tPlans:data});
  }
  updataDataResult4(data){
    this.updatadata3 = data;
  }
  getDetail(param:any){
    let url = ALLOCATE.get_bicycle_detail;
    this.listLoading2 = true;
    this.http.post(url, param).then((res: any) => {
      if (res.data.code==100) {

        this.listLoading2 = false;
        this.dataSet2 = res.data.data.dataLeft;
         this.totalPages2 = res.data.total||[];
        this.dataSet4 = res.data.data.dataRight
          this.totalPages2 =res.data.total||[];
      }
    })
  }

  // colName(data:any){
  //   let productName = data.filter(x => x.colEname === 'productName')
  //   productName[0].tdTemplate = this.productName;
  // }

  colName1(data:any){
    let vehicleNo = data.filter(x => x.colEname === 'vehicleNo')
    //vehicleNo[0].tdTemplate = this.vehicleNo;
  }

  modelChange(data:any){
    this.checked = true;
    console.log(data)
    this.dataSet3.forEach(item=>{
      item.vehicleNoList.forEach(item1=>{
        if(item1.vehicleNo==data){
          item.truckWeight=item1.truckWeight;
          item.vehicleKind = item1.vehicleKind;
        }
      })
    })
  }

//弹窗按钮取消
  handleCancel() {
    this.tplModal.destroy();
    //this.driver = null;
    //this.remark = null;
    this.validateForm1.reset()
  }

//弹窗按钮确定
  importConfirm3(){
    console.log(530)
    console.log(this.validateForm1)
    for (const i in this.validateForm1.controls) {
      this.validateForm1.controls[i].markAsDirty();
      this.validateForm1.controls[i].updateValueAndValidity();
    }
    if (this.validateForm1.status === 'INVALID') {
      return;
    }
    this.implistLoading = true;
    let url = ALLOCATE.add_bicycle;
    // let url = 'http://192.168.21.89:9206';
    let param :any={}
    param = this.validateForm1.getRawValue();
    console.log(param)
   // param.remark = this.remark;
    //param.planDriver = {}
    //console.log(this.updatadata3)
    // param.planDriver.driverName = this.updatadata3[0].name
    // param.planDriver.driverId = this.updatadata3[0].userId
    // param.planDriver.vehicleNo = this.updatadata3[0].vehicleNo
    // param.planDriver.mobile = this.updatadata3[0].mobile
    // param.planDriver.planWeight = this.updatadata3[0].entrustedWeight
    // param.businessTime = param.businessTime && param.businessTime instanceof Date ? Utils.dateFormat(param.businessTime, 'yyyy-MM-dd') : param.businessTime || '';
    // param.tOrderItemModels = this.dataSetAdd;

    //param.tOrderItemModels.forEach(item1=>{
      this.consignorCompanyArr.forEach(item=>{
        if(param.consignorCompanyId==item.value){
          param.consignorCompanyName=item.name;
        }
      })
      this.startPointArr.forEach(item=>{
        if(param.startPoint==item.value){
          param.startLocationName=item.name;
          //item1.startPoint =item.value;
          //item1.startLocationName = item.name
        }
      })
      this.provinceArr.forEach(item=>{
        if(param.provinceId==item.code){
          param.provinceName=item.name;
          //item1.endProvinceCode =item.code;
          //item1.provinceName = item.name
        }
      })
      this.cityArr.forEach(item=>{
        if(param.cityId==item.code){
          param.cityName=item.name;
          //item1.endCityCode =item.code;
          //item1.cityName = item.name
        }
      })
      this.areaArr.forEach(item=>{
        if(param.districtId==item.code){
          param.districtName=item.name;
          //item1.endDistrictCode =item.code;
          //item1.districtName = item.name
        }else if (param.districtId ==null) {
          param.districtName = null
          //item1.endDistrictCode =null;
          //item1.districtName = null
        }
      })
      this.carriageArr.forEach(item=>{
        //console.log(item)
         if(param.carriageCompany==item.value){
           param['trans_group_name'] =item.name;
          //param.carriageCompany=item.name;
         }
      })
    // this.cityArr.forEach(item=>{
    //   if(param.cityId==item.code){
    //     param.cityName=item.name;
    //     //item1.endCityCode =item.code;
    //     //item1.cityName = item.name
    //   }
    // })
    //})
     console.log(param.carriageCompany)
       param['city'] = param.cityName;
       param['end_point'] = param.districtName;
       param['commodity'] = param.productName;
       if(this.checked==true){
         param['mark'] = '1';
       }else{
         param['mark'] = '-';
       }

       // if( ){
       //     this.nzMess.error('请填写正确的车牌号格式');
       //     return
       // }

       //let list = this.dataSet.filter((x: any) => x.checked);
       //console.log(list);
       //if (list.length < 1) {
    //   this.tplModal = this.nm.warning({
    //     nzTitle: '提示信息',
    //     nzContent: '正在进行分货，请稍后......'
    //   });
       //this.destroyTplModal();
       //return;
       //}

    this.http.post(url,param).then((res:any)=>{
      console.log(param)
      if(res.data.code == 100){
        console.log(620);
        // this.tplModal = this.nm.warning({
        //   nzTitle: '提示信息',
        //   nzContent: '正在进行分货，请稍后......'
        // });
        this.nz.create('success','提示信息',res.data.msg,{nzDuration: 3000})
        this.tplModal.destroy();
        //this.remark = null;
        this.listSearch({ page: 1, length: this.pageSize1, result:res.data.data});


      }
      this.implistLoading = false
    })

    // if (data.buttonId !== 'Add' && data.buttonId !== 'abolish') {
    //   let list = this.dataSet.filter((x: any) => x.checked);
    //   if (list.length < 1) {
    //     this.tplModal = this.nm.warning({
    //       nzTitle: '提示信息',
    //       nzContent: '正在进行分货，请稍后......'
    //     });
    //     this.destroyTplModal();
    //     return;
    //   }
    // }
  }


  // /*验证车牌号*/
  //  validateVehicleNo() {
  //   return new RegExp(/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/);
  //  }
  // validateVehicleNoFun(val: string){
  //   const v = validateVehicleNo();
  //   this.validateVehicleError = v.test(val);
  //   console.log(this.validateVehicleError);
  // }


  /**
   * 提示弹窗自动关闭
   */
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  modalConfirmResult(data:any){
    console.log(data)
    if(data.type=='ok'){
      if(!this.updatedata||this.updatedata.length!=1){
        this.nzMess.error('请勾选一条数据！');
        return
      }
      if(this.cm.canOperate(this.updatedata,"planStatus",["DDZT30","DDZT40","DDZT60","DDZT80","DDZT70"],"勾选调度单已经完成，不能进行操作！")){
        return
      };
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

  /**
   * 价格品种应付获取
   */
  getprodKindPrice(): void {
    const observable = fromPromise(this.http.post(urls.getprodKindPrice, {prodKind: '20'})).pipe(
      retry(3),
      map(res => {
        if (res.success) {
          return res.data.data;
        } else {
          throw new Error('服务器出错');
        }
      }),
      catchError(() => of([]))
    );
    observable.subscribe(
      value => {
        this.prodNameArr = value;
      }
    );
  }
  /**
   * 公司应付获取
   */
  getPlateCompanyName(): void {
    const observable = fromPromise(this.http.post(urls.getPlateCompanyName, {prodKind: '20'})).pipe(
      retry(3),
      map(res => {
        if (res.success) {
          return res.data.data;
        } else {
          throw new Error('服务器出错');
        }
      }),
      catchError(() => of([]))
    );
    observable.subscribe(
      value => {
        this.prodNameArr = value;
      }
    );
  }

  /**
   * 装车时间限制
   */
  disabledStartDate = (current: Date): boolean => {
    return Utils.beforeNowDate(current, this.validateForm1.value.bidTimeEnd);
  }

}
