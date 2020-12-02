import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {UserinfoService} from '@service/userinfo-service.service';
import {stockManageURL} from '@model/stockManage';
import {GlobalService} from '@service/global-service.service';

@Component({
  selector: 'app-stock-in-manage',
  templateUrl: './stock-in-manage.component.html',
  styleUrls: ['./stock-in-manage.component.css']
})
export class StockInManageComponent implements OnInit {

  dataSet1:any=[];
  dataSet2:any = [];
  upTotal:any;
  updatedata:any=[];
  listLoading1 = false;
  tempSearchParam:any;
  pageSize1:any = 30;
  gridOneHeight:string
  gridTwoHeight:string
  constructor( private router: Router,private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,
               private nzMess:NzMessageService,
               private fb:FormBuilder,
               private info: UserinfoService,private _route: ActivatedRoute,private glo: GlobalService,) {

    this._route.queryParams.subscribe((params: Params) => {



    } )
  }

  ngOnInit() {
    this.searchReloadEvent();
    this.searchList({page:1,length:30});
  }
  /**
   * searchReload事件订阅
   */
  searchReloadEvent(): void {
    this.glo.searchReload.subscribe(
      value => {
        if (value['target'] === 'stockInDetail') {
          this.dataSet1 = [];
          this.updatedata = [];
          this.searchList({page:1,length:30});
        }
      }
    );
  }
  searchList(data:any){
    data.page = data.page || 1;
    data.length = this.pageSize1 || data.length;
    this.getList1(data);
  }

  getList1(data:any) {
    let url = stockManageURL.selectstockinInfo
    this.listLoading1 = true;
    this.tempSearchParam = data;
    this.updatedata = []
    this.dataSet2 =[]
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        this.dataSet1 = res.data.data && res.data.data.data || [];
        this.upTotal = res.data.data && res.data.data.total;

      }
    });
  }

  btnClick(data:any){
    switch (data.buttonId) {
      case 'Update':
        this.btnUpdate();
        break;
      case 'Delete':
        this.btnDelete();
        break;
      case 'audit':
        this.btnAudit();
        break;
      case'cancel':
        this.btnCancel();
        break;
    }
  }

  btnCancel(){
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据')
      return
    }
    if(this.updatedata.filter(x=>x.auditStatus!=='RKSHZT20').length>0){
      this.nz.warning('提示信息','勾选数据含有未审核数据，请重新勾选!');
      return;
    }
    let url = stockManageURL.cancleStockInInfo;
    let param ={rowids:[]};
    this.updatedata.forEach(item=>{
      param.rowids.push(item.rowid);
    })
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息','取消成功')
        this.updatedata=[];
        this.getList1(this.tempSearchParam);
      }
    })
  }

  btnAudit(){
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据')
      return
    }
    if(this.updatedata.filter(x=>x.auditStatus==='RKSHZT20').length>0){
      this.nz.warning('提示信息','勾选数据含有已审核数据，请重新勾选!');
      return;
    }
    let url = stockManageURL.auditStockInInfo;
    let param ={rowids:[]};
    this.updatedata.forEach(item=>{
      param.rowids.push(item.rowid);
    })
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息','审核成功')
        this.updatedata=[];
        this.getList1(this.tempSearchParam);
      }
    })
  }

  btnDelete(){
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据')
      return
    }
    if(this.updatedata.filter(x=>x.auditStatus==='RKSHZT20').length>0){
      this.nz.warning('提示信息','勾选数据含有已审核数据，请重新勾选!');
      return;
    }
    let url = stockManageURL.deleteStockInInfo;
    let param ={rowids:[]};
    this.updatedata.forEach(item=>{
      param.rowids.push(item.rowid);
    })
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息','删除成功')
        this.updatedata=[];
        this.getList1(this.tempSearchParam);
      }
    })
  }

  btnUpdate(){
    if(this.updatedata.length!==1){
      this.nz.warning('提示信息','请勾选一条数据')
      return
    }
    if(this.updatedata.filter(x=>x.auditStatus==='RKSHZT20').length>0){
      this.nz.warning('提示信息','勾选数据为已审核数据，请重新勾选!');
      return;
    }
    console.log(this.updatedata)
    sessionStorage.setItem('data', JSON.stringify(this.updatedata));
    sessionStorage.setItem('item', JSON.stringify(this.dataSet2));
    this.router.navigate(['system/stock-manage/stock-in-manage/stockInPlanned'], {
      queryParams: {
        buttonId:'Update'
      }
    }).then(r => console.log(r));
  }

  selectData(data:any){
    this.updatedata = data;
    if(data.length>0){
      this.getList2(data);
    }else{
      this.dataSet2 = []
    }
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

  getList2(data:any){
    let url = stockManageURL.selectStockInInfoItem

     let param:any ={inWsIds:[]}
     data.forEach(item=>{
       param.inWsIds.push(item.inWsNo)
     })
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.dataSet2 = res.data&&res.data.data||[];
      }
    })
  }

  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }
}
