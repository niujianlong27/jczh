import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';
import {stockManageURL} from '@model/stockManage';
import {CommonService} from '@service/common.service';

@Component({
  selector: 'app-stock-out-planned-registration',
  templateUrl: './stock-out-planned-registration.component.html',
  styleUrls: ['./stock-out-planned-registration.component.css']
})
export class StockOutPlannedRegistrationComponent implements OnInit {

  dataSet1:any=[];
  totalPage:any;
  updatedata:any=[];
  addDataArr:any=[];
  deleteDataArr:any=[]
  listLoading1 = false
  pageSize1= 30;
  tempSearchParam:any
  isRoute = false
  updateOldDate:any =[]
  constructor( private router: Router,
               private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
               private nzMess:NzMessageService,
               private fb:FormBuilder,
               private info: UserinfoService,
               private _route:ActivatedRoute,private cm: CommonService,) {
    this._route.queryParams.subscribe((params: Params) => {
     if(params.isRoute){
       this.isRoute = true;
       console.log(JSON.parse(sessionStorage.getItem('data')))
       JSON.parse(sessionStorage.getItem('data')).forEach(item=>{
         item.status = '00'
         this.dataSet1 .push(item)
         if(item.isInsert!=='1'){
           if(item.isPack==='KBGL20'){
             item.editstate = 1;
           }else{
             item.editstate = 0
           }
           this.addDataArr.push(item)
         }
       })
     }else {
       this.isRoute = false;
     }
      this.dataSet1=[...this.dataSet1]
      console.log(this.dataSet1)
    } )
  }

  ngOnInit() {
    if(!this.isRoute){
      this.searchList({page:1,length:30})
    }
  }

  searchList(data:any){
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }
  getList1(data:any){
    let url = stockManageURL.selectStockOutPlan
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.updatedata = []
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total;
        this.dataSet1.forEach(item=>{
          item.editstate = 0;
        })
        this.isRoute = false;
      }
    });
  }

  btnClick(data:any){
    switch (data.buttonId) {
      case 'Add':
        this.btnAdd();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case'Save':
        this.btnSave();
      default:
        break;
    }
  }

  btnSave(){

    let url = stockManageURL.saveStockOutPlan;
    let param = {stockOutPlanModels:[]};
      this.addDataArr.forEach(item1=>{
        item1.mark=0;
        param.stockOutPlanModels.push(item1);
      })
    this.updateOldDate.forEach(item1=>{
      item1.mark=1;
      param.stockOutPlanModels.push(item1);
    })
      this.deleteDataArr.forEach(item1=>{
          item1.mark = 2;
          param.stockOutPlanModels.push(item1);

      })
    if(this.cm.canOperate(param.stockOutPlanModels,'weight',[undefined,null,''],'请填写重量')){
      return;
    }
    if(this.cm.canOperate(param.stockOutPlanModels,'packageNum',[undefined,null,''],'请填写件数')){
      return;
    }
    if(this.cm.canOperate(param.stockOutPlanModels,'branchNum',[undefined,null,''],'请填写支数')){
      return;
    }
    if(this.canSave(param.stockOutPlanModels)){
      return;
    }
    this.http.post(url,param).then(res=>{
        if(res.success){
          this.nz.success('提示信息','保存成功');
          this.getList1({page:1,length:30});
          this.addDataArr =[]
          this.deleteDataArr = []
          this.updateOldDate =[]
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
  btnAdd(){
    sessionStorage.setItem('dataSet',JSON.stringify(this.dataSet1))
    this.router.navigate(['/system/stock-manage/stock-in-manage/stockManage'], {
      queryParams: {
        isRoute:true,isPlan:true
      }
    }).then(r => console.log(r));
  }

  btnDelete(){
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据!')
      return;
    }
    if(this.updatedata.filter(x=>x.status==='10').length>0){
      this.nz.warning('提示信息','勾选数据包含确认数据，请重新勾选!')
      return;
    }
    this.updatedata.forEach(item=>{
      if(this.addDataArr.indexOf(item)>=0){
        this.addDataArr.splice(this.addDataArr.indexOf(item),1);
        this.dataSet1.splice(this.dataSet1.indexOf(item),1);
      }else if(this.updateOldDate.indexOf(item)>=0){
        this.updateOldDate.splice(this.updateOldDate.indexOf(item),1);
        this.dataSet1.splice(this.dataSet1.indexOf(item),1);
      }else{
        this.dataSet1.splice(this.dataSet1.indexOf(item),1);
        this.deleteDataArr.push(item);
      }

    })
    this.dataSet1 = [...this.dataSet1]
  }

  selectData(data:any){
      this.updatedata = data
  }

  modelChange(data:any) {
  }

}
