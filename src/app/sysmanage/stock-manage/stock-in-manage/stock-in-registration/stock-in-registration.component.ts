import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';
import {urls} from '@model/url';
import { stockManageURL } from '@model/stockManage'
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CommonService} from '@service/common.service';
import {GlobalService} from '@service/global-service.service';
import {DatePipe} from '@angular/common';
import {environment} from '@env/environment';

@Component({
  selector: 'app-stock-in-registration',
  templateUrl: './stock-in-registration.component.html',
  styleUrls: ['./stock-in-registration.component.css'],
  providers: [DatePipe]
})
export class StockInRegistrationComponent implements OnInit {

  dataSet:any=[];
  updateData:any=[];
  pageSize1:any =30;
  totalPage:any =0;
  listLoading1 = false;
  tempSearchParam:any
  buttonId:any
  warehouseArr:any=[];
  wsLocationArr:any=[];
  @ViewChild('wsId') wsId:ElementRef;
  @ViewChild('wsLocation') wsLocation:ElementRef;
  @ViewChild('itemid') itemid:ElementRef
  modalTitle:any;
  implistLoading = false;
  @ViewChild('tplTitle2') tplTitle2;
  @ViewChild('tplContent2') tplContent2;
  @ViewChild('tplFooter2') tplFooter2;
  tplModal: NzModalRef;
  validateForm:FormGroup;
  dataSet1:any=[]
  updatedata1:any = []
  inTypeArr:any=[]
  itemidArr:any=[]
  updateOldData:any=[]
  deleteData:any=[];
  addArr:any=[]
  userDataArr:any=[];
  constUserData:any = [];
  selectNum:number = 0
  companyDataArr:any=[];
  constUserData1:any = [];
  selectNum1:number = 0
  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,private router: Router,
              private fb:FormBuilder,private glo: GlobalService,private datepipe: DatePipe,
              private info: UserinfoService,private _route: ActivatedRoute,private cm: CommonService) {
    this.validateForm = this.fb.group({
      inWsNo:[null],
      inWsTime:[null, [Validators.required]],
      inType:[null, [Validators.required]],
      operUser:[null, [Validators.required]],
      operTeam:[null],
      tallyman:[null],
      craneOper:[null],
      remark:[null],
      rowid:[null],
      customerCode:[null, [Validators.required]],
    })
    this._route.queryParams.subscribe((params: Params) => {
      console.log(params)
      this.buttonId = params.buttonId
      if(params.buttonId==='Update'){
        console.log(JSON.parse(sessionStorage.getItem('data')))
        this.validateForm.patchValue(JSON.parse(sessionStorage.getItem('data'))[0])
        this.dataSet = JSON.parse(sessionStorage.getItem('item'))
        this.dataSet.forEach(item=>{
          this.wsLocationOpenChange(true,item);
        })
        this.getUser(JSON.parse(sessionStorage.getItem('data'))[0].operUserName)
        this.getUser1(JSON.parse(sessionStorage.getItem('data'))[0].customerName)
      }
    } )
    this.dataSet = [...this.dataSet]
  }

  ngOnInit() {
    console.log(this.info)
    if(this.buttonId!=='Update'){
      this.validateForm.get('inWsTime').setValue(new Date().toLocaleDateString())
      this.getUser(this.info.APPINFO.USER.name);
      this.getUser1(this.info.APPINFO.USER.companyName);
      this.validateForm.get('operUser').setValue(this.info.APPINFO.USER.userId)
      this.validateForm.get('customerCode').setValue(this.info.APPINFO.USER.companyId)
    }
    this.http.post(stockManageURL.selectItemid,{}).then(res=>{
      if(res.success){
        let arr = [];
        console.log(res);
        this.itemidArr=res.data.data

      }
    })
    this.http.post(stockManageURL.selectWs, {}).then(
      (res: any) => {
        console.log(res);
        if (res.success) {
          let arr = [];
          console.log(res);
          res.data.data.forEach(item => {
            arr.push({value: item.wsId, name: item.wsName});
          });
          this.warehouseArr = [...arr];

        }
      }
    );
    this.getStatic(this.inTypeArr,'RKLX')

  }


  // searchList(data:any){
  //   data.page = data.page || 1;
  //   data.length = this.pageSize1 || data.length;
  //   this.getList1(data);
  // }
  //
  // getList1(data:any){
  //   let url = 'http://192.168.23.121:9110/stockinplan/getStockInPlanList'
  //   this.listLoading1 = true;
  //   this.tempSearchParam = data;
  //   this.updateData = []
  //   this.http.post(url, data).then((res: any) => {
  //     this.listLoading1 = false;
  //     if (res.success) {
  //       this.dataSet = res.data.data && res.data.data.data || [];
  //       this.totalPage = res.data.data && res.data.data.total;
  //       this.dataSet.forEach(item=>{
  //         item.editstate = 0;
  //       })
  //     }
  //   });
  // }

  btnClick(data:any){
    switch (data.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'Save':
        this.btnSave();
        break;
      case 'Reset':
        this.btnReset();
        break;
      case 'Import':
        this.btnImport();
        break;
      default:
        break;
    }
  }
//ResetImport
  updateDataResult(data:any){
    console.log(data)
    this.updateData = data
    this.dataSet.forEach(item1=>{
      if(item1.rowid){
        item1.editstate = 0;
        item1.canUpdate = true
      }
      data.forEach(item=>{
        if(item.rowid===item1.rowid){
          if(item.status!=='RKJHZT20'){
            item1.editstate = 1;
            item1.canUpdate = false
          }else{
            item1.editstate = 0;
            item1.canUpdate = true
          }
        }
      })
    })
    data.forEach(item=>{
      this.wsLocationOpenChange(true,item)

    })
  }
  //
  // /**
  //  * 当前页码变化
  //  * @param page
  //  */
  // getPageIndex1(page: any): void {
  //   this.tempSearchParam.page = page;
  //   this.searchList(this.tempSearchParam);
  // }
  //
  // /**
  //  * 每页展示条数变化
  //  * @param pageSize
  //  */
  // getPageSize1(pageSize: any): void {
  //   this.pageSize1 = pageSize;
  //   this.tempSearchParam.length = pageSize;
  //   this.searchList(this.tempSearchParam);
  // }

  btnAdd(){
    this.dataSet.unshift({editstate:1,canUpdate:false});
    this.dataSet = [...this.dataSet]
  }

  btnDelete(){
    if(this.updateData.length<=0){
      this.nz.warning('提示信息','请勾选一条信息！')
      return;
    }
    if(this.updateData.filter(x=>x.status==='RKZT20').length>0){
      this.nz.warning('提示信息','勾选数据中含有已入库数据，请重新勾选！')
      return;
    }
    this.updateData.forEach(item=>{
      if(item.rowid){
      debugger
        this.updateOldData.forEach(item1=>{
          if(item.rowid===item1.rowid){
            this.updateOldData.splice(this.updateOldData.indexOf(item1),1);

          }
        })
        this.deleteData.push(item);

        // for(let i =0;i<this.addArr.length;i++){
        //
        //   if(this.addArr[i].rowid===item.rowid){
        //     this.addArr.splice(this.addArr.indexOf(this.addArr[i]),1);
        //   }else{
        //     if(count===0){
        //
        //       count++;
        //     }
        //   }
        // }

        this.dataSet.forEach(item2=>{
          if(item2==item){
            this.dataSet.splice(this.dataSet.indexOf(item2),1);
          }
        })
      }else{
        this.dataSet.forEach(item1=>{
          if(item1==item){
            this.dataSet.splice(this.dataSet.indexOf(item1),1);
          }
        })
      }
    })

    this.dataSet = [...this.dataSet]
    this.updateData =[]
  }

  btnSave(){
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == 'INVALID') {
      return;
    }
      if(this.dataSet.length<=0){
        this.nz.warning('提示信息','请至少添加一条数据')
        return;
      }
    console.log(this.dataSet)
    let url = stockManageURL.saveStockInRegistration
    let param:any = {}
    param = this.validateForm.getRawValue();
    param.inWsTime = this.inWsTimeModelChange(this.validateForm.get('inWsTime').value)
    param.tStockInModels =[];
    this.dataSet.forEach(item=>{
      if(!item.rowid){
        item.mark = 0;
        param.tStockInModels.push(item);
      }
    })
    this.addArr.forEach(item=>{
      item.mark =0;
      param.tStockInModels.push(item)
    })
    this.updateOldData.forEach(item=>{
      item.mark = 1;
      param.tStockInModels .push(item);
    })
    this.deleteData.forEach(item=>{
      item.mark = 2;
      param.tStockInModels .push(item);
    })
    param.tStockInModels.forEach(item=>{
      item.planId = item.rowid
    })
    console.log(param)
    this.companyDataArr.forEach(item=>{
      if(item.companyId===this.validateForm.get('customerCode').value){
        param.customerName = item.companyName
      }
    })
    if(this.cm.canOperate(param.tStockInModels,'productName',[undefined,null,''],'请选择物资代码')){
      return;
    }
    if(this.cm.canOperate(param.tStockInModels,'spec',[undefined,null,''],'请选择物资代码')){
      return;
    }
    if(this.cm.canOperate(param.tStockInModels,'weight',[undefined,null,''],'请填写重量')){
      return;
    }
    if(this.cm.canOperate(param.tStockInModels,'packageNum',[undefined,null,''],'请填写件数')){
      return;
    }
    if(this.cm.canOperate(param.tStockInModels,'branchNum',[undefined,null,''],'请填写支数')){
      return;
    }
    if(this.cm.canOperate(param.tStockInModels,'wsId',[undefined,null,''],'请填写仓库')){
      return;
    }
    if(this.cm.canOperate(param.tStockInModels,'wsLocationId',[undefined,null,''],'请填写库位')){
      return;
    }
    if(this.canSave(param.tStockInModels)){
      return;
    }
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息','保存成功!');
        this.updateOldData=[]
        this.deleteData = []
        this.addArr =[]
        this.glo.searchReload.emit({target: 'stockInDetail'});
        if(this.buttonId ==='Update'){
          this.router.navigate(['/system/stock-manage/stock-in-manage/stockInManage'], {
            queryParams: {

            }
          }).then(r => console.log(r));
        }else{
          this.btnReset()
        }
      }
    })
  }

  canSave(data:any){
    let flag = false
    data.forEach(item=>{
      if(item.weight.length>18){
        flag = true
      }
      if(item.branchNum.length>18){
        flag = true;
      }
      if(item.packageNum.length>18){
        flag = true
      }
    })
    if(flag){
      this.nz.warning('提示信息','输入数据过长请重新输入')
    }
    return flag ;
  }

  colName1(data:any){
    let wsId = data.filter(x => x.colEname === 'wsId')
    wsId[0].tdTemplate = this.wsId;
    let wsLocation = data.filter(x => x.colEname === 'wsLocationId')
    wsLocation[0].tdTemplate = this.wsLocation;
    let itemid = data.filter(x => x.colEname === 'prodId')
    itemid[0].tdTemplate = this.itemid;
  }

  fWhsChange(data:any,data1:any){
    data1.wsLocation=undefined;
    data1.wsLocationId = undefined;
    console.log(data)
    this.warehouseArr.forEach(item=>{
      if(item.value===data){
        data1.wsName = item.name;
      }
    })
    if(this.buttonId !== 'Update'){
      return
    }
    if(data1.rowid){
      let flag = false;


          this.updateOldData.forEach(item=>{
            if(item.rowid===data1.rowid){
              this.updateOldData.splice(this.updateOldData.indexOf(item),1);
            }
          })
          this.updateOldData.push(data1)




    }

  }

  modelChange(data:any){
    if(this.buttonId==='Update'){
      let flag = false
      if(data.data.rowid){
        this.addArr.forEach(item=>{
          if(item.rowid!==data.data.rowid){
            this.updateOldData.forEach(item=>{
              if(item.rowid===data.data.rowid){
                flag = true
              }
            })
            if(!flag){
              this.updateOldData.push(data.data)
            }
          }

        })

      }
    }
  }

  wsLocationChange(data:any,data1:any){
    data1.wsLocationArr.forEach(item=>{
      if(data ===item.value){
        data1.wsLocation = item.name
      }
    })
    if(this.buttonId !== 'Update'){
      return
    }
    console.log(data)
    if(data1.rowid){

      this.updateOldData.forEach(item=>{
        if(item.rowid===data1.rowid){
          this.updateOldData.splice(this.updateOldData.indexOf(item),1);
        }
      })
      this.updateOldData.push(data1)
    }

  }

  itemidModelChange(data:any,data1:any){
    this.itemidArr.forEach(item=>{
      if(item.itemid===data){
        data1.productName =item.cname;
        data1.spec = item.spec
      }
    })
    if(this.buttonId !== 'Update'){
      return
    }
    if(data1.rowid){

          this.updateOldData.forEach(item=>{
            if(item.rowid===data1.rowid){
              this.updateOldData.splice(this.updateOldData.indexOf(item),1);
            }
          })
          this.updateOldData.push(data1)
        }

  }


  btnReset(){
    this.validateForm.reset();
    this.dataSet =[]
    this.updateOldData=[]
    this.deleteData = []
    this.addArr =[]
    this.validateForm.get('inWsTime').setValue(new Date().toLocaleDateString());
  }

  btnImport(){
    this.modalTitle = '入库登记->计划导入'
    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle2,
      nzContent: this.tplContent2,
      nzFooter: this.tplFooter2,
      nzWidth: '50%',
      nzMaskClosable: false,
      nzClosable: false,
    });
    this.searchList({page: 1, length: this.pageSize1});
  }

  handleCancel(){
    this.tplModal.destroy();
    this.updatedata1 =[]
  }

  importConfirm2(){
    if(this.updatedata1.length<=0){
      this.nz.warning('提示信息','请勾选一条数据！');
      return;
    }
    let flag = false
    this.dataSet.forEach(item=>{
      this.updatedata1.forEach(item1=>{
        if(item.rowid===item1.rowid){
          flag  = true;
        }
      })
    })
    if(flag){
      this.nz.warning('提示信息','该数据已经导入请勾选其他数据!')
      return;
    }
   this.updatedata1.forEach(item=>{
     item.editstate  = 0;
     item.canUpdate = true
     item.checked = false
     this.dataSet.push(item);
     this.addArr.push(item)
     this.wsLocationOpenChange(true,item);
   })
    this.tplModal.destroy();
    this.updatedata1=[]
    this.dataSet=[...this.dataSet]
    console.log(this.dataSet)
  }
  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page = page;
    this.searchList(this.tempSearchParam);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.searchList(this.tempSearchParam);
  }

  searchList(data:any){

    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }
  getList1(data:any){
    let url = stockManageURL.selectStockInPlan10
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.updateData = []
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total;

      }
    });
  }

  updateDataResult1(data:any) {
    this.updatedata1 = data
  }
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }
  wsLocationOpenChange(data:any,data1:any){
    if(data){
      this.http.post(stockManageURL.selectWsLocation,{wsId:data1.wsId}).then(res=>{
        if (res.success) {
          let arr = [];
          console.log(res);
          res.data.data.forEach(item => {
            arr.push({value: item.locationCdoe, name: item.locationName});
          });
          data1.wsLocationArr = [...arr];
        }})
    }
  }

  canOperate(list:Array<any>,option:string,statusArr:Array<any>,tipInfo:string):boolean{
    let flag = false;
    list.forEach((item) => {
      if(statusArr.indexOf(item[option]) < 0){
        flag = true;
      }
    });
    if(flag){
      this.nz.warning('提示信息',tipInfo)
      // window.setTimeout(() => {
      //   this.tplModal.destroy();
      // }, 1500);
    }
    return flag
  }

  inWsTimeModelChange(data:any){
      return this.datepipe.transform(data,'yyyy-MM-dd')
  }


  private getUser(name?: string) {
    this.http.post(
      `${environment.baseUrlStorage}storeProdSet/getUser`,
      {
        name: name
      }
    ).then((res: any) => {
      console.log(res)
      if (res.data.code === 100) {
        this.constUserData = res.data.data || [];
        this.userDataArr = this.constUserData.slice(0, 50);
      }
    });
  }

  public selectSearch(txt: string) {
    this.getUser(txt);
  }

  public selectOpen(bool: boolean) {
    this.selectNum = 1;
    if (bool) {
      this.userDataArr = this.constUserData.slice(0, 50);
    }
  }

  public loadMore() {
    let num = 50 * (++this.selectNum);
    if (num > this.constUserData.length) {
      num = this.constUserData.length;
    }
    const userData = this.constUserData.slice(this.userDataArr.length, num);
    this.userDataArr = [...this.userDataArr, ...userData];
  }

  private getUser1(name?: string) {
    this.http.post(
      `${environment.baseUrlStorage}stockin/getAllCompanyName`,
      {
        name: name
      }
    ).then((res: any) => {
      console.log(res)
      if (res.data.code === 100) {
        this.constUserData1 = res.data.data || [];
        this.companyDataArr = this.constUserData1.slice(0, 50);
      }
    });
  }

  public selectSearch1(txt: string) {
    this.getUser1(txt);
  }

  public selectOpen1(bool: boolean) {
    this.selectNum1 = 1;
    if (bool) {
      this.companyDataArr = this.constUserData1.slice(0, 50);
    }
  }

  public loadMore1() {
    let num = 50 * (++this.selectNum);
    if (num > this.constUserData1.length) {
      num = this.constUserData1.length;
    }
    const userData = this.constUserData1.slice(this.companyDataArr.length, num);
    this.companyDataArr = [...this.companyDataArr, ...userData];
  }

}
