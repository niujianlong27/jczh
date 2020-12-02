import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {UserinfoService} from '@service/userinfo-service.service';
import {urls} from '@model/url';
import {stockManageURL} from '@model/stockManage';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {environment} from '@env/environment';
import {GlobalService} from '@service/global-service.service';
import {CommonService} from '@service/common.service';
@Component({
  selector: 'app-stock-out-registration',
  templateUrl: './stock-out-registration.component.html',
  styleUrls: ['./stock-out-registration.component.css']
})
export class StockOutRegistrationComponent implements OnInit {

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
  addDataArr:any=[]
  deleteData:any=[];
  updateOldDate:any =[]
  isRoute = false;
  userDataArr:any=[];
  constUserData:any = [];
  selectNum:number = 0
  userDataArr1:any=[];
  constUserData1:any = [];
  selectNum1:number = 0
  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,
              private fb:FormBuilder,
              private info: UserinfoService,
              private _route:ActivatedRoute,private cm: CommonService,
              private router: Router,private glo: GlobalService,) {
    this.validateForm = this.fb.group({
      outWsNo:[null],
      outWsTime:[null, [Validators.required]],
      operUser:[null],
      operTeam:[null],
      craneOper:[null],
      remark:[null],
      rowid:[null],
    })
    this._route.queryParams.subscribe((params: Params) => {
      if(params.isRoute){
        this.isRoute = true;
        console.log(JSON.parse(sessionStorage.getItem('data')))
        JSON.parse(sessionStorage.getItem('data')).forEach(item=>{
          let flag  = false;
          this.dataSet.forEach(item1=>{
            if(item1.packNo===item.packNo){
              flag = true
            }
          })
          if(!flag){
            item.status = '00'
            this.dataSet .push(item)
            if(item.isInsert!=='1'){
              this.addDataArr.push(item)
            }
          }
        })
      }else if(params.buttonId==='Update'){
        this.buttonId = 'Update'
        this.validateForm.patchValue(JSON.parse(sessionStorage.getItem('data'))[0]);
        this.dataSet = JSON.parse(sessionStorage.getItem('item'));
        this.getUser(JSON.parse(sessionStorage.getItem('data'))[0].operUserName);
        this.getUser1(JSON.parse(sessionStorage.getItem('data'))[0].craneOperName)
        this.updateOldDate = JSON.parse(sessionStorage.getItem('item'));
        this.dataSet.forEach(item=>{
          if(item.isPack !=='KBGL20'){
            item.editstate = 0;
          }
        })
      }else{
        this.isRoute = false;
      }
      this.dataSet1=[...this.dataSet1]
      console.log(this.dataSet1)
    } )
    if(this.buttonId!=='Update'){
      this.getUser();
      this.getUser1();
    }

  }

  ngOnInit() {
    if(this.buttonId!=='Update'){
      this.validateForm.get('outWsTime').setValue(new Date())
    }
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
    sessionStorage.setItem('dataSet',JSON.stringify(this.dataSet))
    this.router.navigate(['/system/stock-manage/stock-in-manage/stockManage'], {
      queryParams: {
        isRoute:true,isPlan:false
      }
    }).then(r => console.log(r));
  }

  btnDelete(){
    if(this.updateData.length<=0){
      this.nz.warning('提示信息','请勾选一条信息！')
      return;
    }
    if(this.updateData.filter(x=>x.status==='10')>0){
      this.nz.warning('提示信息','勾选数据中含有已入库数据，请重新勾选！')
      return;
    }
    this.updateData.forEach(item=>{
      if(this.addDataArr.indexOf(item)>=0){
        this.addDataArr.splice(this.addDataArr.indexOf(item),1);
        this.dataSet.splice(this.dataSet.indexOf(item),1);
      }else if(this.updateOldDate.indexOf(item)>=0){
        this.updateOldDate.splice(this.updateOldDate.indexOf(item),1);
        this.dataSet.splice(this.dataSet.indexOf(item),1);
      }else{
        this.dataSet.splice(this.dataSet.indexOf(item),1);
        this.deleteData.push(item);
      }
    })
    this.dataSet = [...this.dataSet]
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
    let url = stockManageURL.saveStockOut;
    let param :any= {};
    param = this.validateForm .getRawValue();
    param.stockOutDetailModels = [];
    this.addDataArr.forEach(item1=>{
      item1.mark=0;
      param.stockOutDetailModels.push(item1);
    })
    this.updateOldDate.forEach(item1=>{
      item1.mark = 1;
      param.stockOutDetailModels.push(item1)
    })
    this.deleteData.forEach(item1=>{
      item1.mark = 2;
      param.stockOutDetailModels.push(item1);

    })
    console.log(param)
    if(this.cm.canOperate(param.stockOutDetailModels,'weight',[undefined,null,''],'请填写重量')){
      return;
    }
    if(this.cm.canOperate(param.stockOutDetailModels,'packageNum',[undefined,null,''],'请填写件数')){
      return;
    }
    if(this.cm.canOperate(param.stockOutDetailModels,'branchNum',[undefined,null,''],'请填写支数')){
      return;
    }
    if(this.canSave(param.stockOutDetailModels)){
      return;
    }
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息','保存成功');
        if(this.buttonId==='Update'){
          this.glo.searchReload.emit({target: 'stockOutDetail'});
          this.router.navigate(['/system/stock-manage/stock-in-manage/storeOutManage'], {
            queryParams: {

            }
          }).then(r => console.log(r));
        }else{
          this.btnReset();
        }
        this.addDataArr =[]
        this.deleteData = []
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







  btnReset(){
    this.validateForm.reset();
    this.dataSet =[]
    this.validateForm.get('outWsTime').setValue(new Date().toLocaleDateString());
  }

  btnImport(){
    this.modalTitle = '出库登记->计划导入'
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
    this.updatedata1.forEach(item=>{
      let flag = false;
      this.dataSet.forEach(item1=>{
          if(item.packNo ===item1.packNo){
            flag = true
          }
      })
      if(!flag){
        this.dataSet.push(item);
        this.addDataArr.push(item);
      }
    })
    this.dataSet.forEach(item=>{
      if(item.isPack!=='KBGL20'){
        item.editState = 0;
      }
    })
    this.dataSet = [...this.dataSet]
    this.tplModal.destroy();
    this.updatedata1=[]
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
    let url = stockManageURL.selectStockOut
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.updateData = []
    data.status = '00'
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data && res.data.data || [];
        this.totalPage = res.data && res.data.total;

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
      `${environment.baseUrlStorage}storeProdSet/getUser`,
      {
        name: name
      }
    ).then((res: any) => {
      console.log(res)
      if (res.data.code === 100) {
        this.constUserData1 = res.data.data || [];
        this.userDataArr1 = this.constUserData1.slice(0, 50);
      }
    });
  }

  public selectSearch1(txt: string) {
    this.getUser1(txt);
  }

  public selectOpen1(bool: boolean) {
    this.selectNum1 = 1;
    if (bool) {
      this.userDataArr1 = this.constUserData1.slice(0, 50);
    }
  }

  public loadMore1() {
    let num = 50 * (++this.selectNum1);
    if (num > this.constUserData1.length) {
      num = this.constUserData1.length;
    }
    const userData = this.constUserData1.slice(this.userDataArr1.length, num);
    this.userDataArr1 = [...this.userDataArr1, ...userData];
  }

  // 深拷贝

  deepClone(data: any = {}) {
    if (typeof data !== 'object' || data == null) {
      //  obj是null ，或者不是对象和数组  直接返回
      return data;
    }

    //  初始化返回结果
    let result;
    if (data instanceof Array) {
      result = [];
    } else {
      result = {};
    }
    for (const key in data) {
      //  保证key不是原型的属性
      if (data.hasOwnProperty(key)) {
        // 递归调用
        result[key] = this.deepClone(data[key]);
      }
    }
    //  返回结果
    return result;
  }

  modelChange(data:any){
    this.updateOldDate.forEach(item=>{
      if(data.data.rowid===item.rowid){
        this.updateOldDate.splice(this.updateOldDate.indexOf(item),1)
      }
    })
    this.updateOldDate.push(data.data)
  }
}
