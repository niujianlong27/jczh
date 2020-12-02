import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';
import { stockManageURL } from '@model/stockManage'
import {CommonService} from '@service/common.service';

@Component({
  selector: 'app-stock-in-planned-registration',
  templateUrl: './stock-in-planned-registration.component.html',
  styleUrls: ['./stock-in-planned-registration.component.css']
})
export class StockInPlannedRegistrationComponent implements OnInit {

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
  addData:any = [];
  updateOldData:any = [];
  deleteData:any = [];
  itemidArr =[];
  canUpdate = false
  WSLoading = false
  constructor(private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
              private nzMess:NzMessageService,
              private fb:FormBuilder,
              private info: UserinfoService,private cm: CommonService) {

  }

  ngOnInit() {
    this.searchList({page: 1, length: this.pageSize1});
    this.WSLoading = true
    this.http.post(stockManageURL.selectWs, {}).then(
      (res: any) => {
        this.WSLoading = false
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
    this.http.post(stockManageURL.selectItemid,{}).then(res=>{
      if(res.success){
        let arr = [];
        console.log(res);
        this.itemidArr=res.data.data

      }
    })
    ///stockinplan/getPlanStatic
  }


  searchList(data:any){

    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }
  getList1(data:any){
    let url = stockManageURL.selectStockInPlan
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.updateData = []
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total;
        this.dataSet.forEach(item=>{
          item.editstate = 0;
          item.canUpdate = true;
        })

        this.updateOldData=[]
        this.deleteData = []
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
      case 'Save':
        this.btnSave();
        break;
      default:
        break;
    }
  }

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

  btnAdd(){
    this.dataSet.unshift({editstate:1,canUpdate:false,checked:true});
    this.dataSet = [...this.dataSet]
    this.updateData = this.dataSet.filter(x=>x.checked);
  }

  btnDelete(){
    if(this.updateData.length<=0){
      this.nz.warning('提示信息','请勾选一条信息！')
      return;
    }
    if(this.updateData.filter(x=>x.status==='RKJHZT20').length>0){
      this.nz.warning('提示信息','勾选数据中含有已入库数据，请重新勾选！')
      return;
    }
    this.updateData.forEach(item=>{
      if(item.rowid){
        this.updateOldData.forEach(item1=>{
          if(item.rowid===item1.rowid){
            this.updateOldData.splice(this.updateOldData.indexOf(item1),1);
          }
        })
        this.deleteData .push(item);
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
        this.addData.splice(this.addData.indexOf(item),1);
      }
    })
    this.dataSet = [...this.dataSet]
  }

  btnSave(){
    let url = stockManageURL.saveStockInPlan;
    let param:any = {stockInPlanModels:[]}
    this.dataSet.forEach(item=>{
      if(!item.rowid){
        item.mark = 0;
        param.stockInPlanModels.push(item);
      }
    })
    this.updateOldData.forEach(item=>{
      item.mark = 1;
      param.stockInPlanModels .push(item);
    })
    this.deleteData.forEach(item=>{
      item.mark = 2;
      param.stockInPlanModels .push(item);
    })
    console.log(param)
    if(this.cm.canOperate(param.stockInPlanModels,'productName',[undefined,null,''],'请选择物资代码')){
      return;
    }
    if(this.cm.canOperate(param.stockInPlanModels,'spec',[undefined,null,''],'请选择物资代码')){
      return;
    }
    if(this.cm.canOperate(param.stockInPlanModels,'weight',[undefined,null,''],'请填写重量')){
      return;
    }
    if(this.cm.canOperate(param.stockInPlanModels,'packageNum',[undefined,null,''],'请填写件数')){
      return;
    }
    if(this.cm.canOperate(param.stockInPlanModels,'branchNum',[undefined,null,''],'请填写支数')){
      return;
    }
    if(this.cm.canOperate(param.stockInPlanModels,'wsId',[undefined,null,''],'请填写仓库')){
      return;
    }
    if(this.cm.canOperate(param.stockInPlanModels,'wsLocationId',[undefined,null,''],'请填写库位')){
      return;
    }
    if(this.canSave(param.stockInPlanModels)){
      return;
    }
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息','保存成功!');
        this.getList1(this.tempSearchParam);
        this.updateOldData = []
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

  colName1(data:any){
    let wsId = data.filter(x => x.colEname === 'wsId')
    wsId[0].tdTemplate = this.wsId;
    let wsLocation = data.filter(x => x.colEname === 'wsLocationId')
    wsLocation[0].tdTemplate = this.wsLocation;
    let itemid = data.filter(x => x.colEname === 'prodId')
    itemid[0].tdTemplate = this.itemid;
  }

  fWhsChange(data:any,data1:any){
    console.log(data)
    data1.wsLocation=undefined;
    data1.wsLocationId = undefined;
    if(data1.rowid){
      let flag = false;
      this.updateOldData.forEach(item=>{
        if(item.rowid===data1.rowid){
          this.updateOldData.splice(this.updateOldData.indexOf(item),1);
        }
      })
      this.updateOldData.push(data1)
    }
    this.warehouseArr.forEach(item=>{
      if(item.value===data){
        data1.wsName = item.name;
      }
    })
  }

  modelChange(data:any){
    let flag = false
    if(data.data.rowid){
      this.updateOldData.forEach(item=>{
        if(item.rowid===data.data.rowid){
            flag = true
        }
      })
      if(!flag){
       this.updateOldData.push(data.data)
      }
    }
  }

  itemidModelChange(data:any,data1:any){
    this.itemidArr.forEach(item=>{
      if(item.itemid===data){
        data1.productName =item.cname;
        data1.spec = item.spec
      }
    })
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

  WSOpenChange(data:any){
    if(data){
      this.WSLoading = true
      this.http.post(stockManageURL.selectWs, {}).then(
        (res: any) => {
          this.WSLoading = false
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
    }
  }

  wsLocationChange(data:any,data1:any){

    if(data1.rowid){
      let flag = false;
      this.updateOldData.forEach(item=>{
        if(item.rowid===data1.rowid){
          this.updateOldData.splice(this.updateOldData.indexOf(item),1);
        }
      })
      this.updateOldData.push(data1)
    }
    data1.wsLocationArr.forEach(item=>{
      if(item.value===data){
        data1.wsLocation = item.name;
      }
    })
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
}
