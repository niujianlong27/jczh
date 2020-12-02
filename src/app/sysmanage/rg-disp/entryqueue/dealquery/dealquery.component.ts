import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import {urls} from '../../../../common/model/url';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {debug} from 'util';
import {combineAll} from 'rxjs/operators';

@Component({
  selector: 'app-dealquery',
  templateUrl: './dealquery.component.html',
  styleUrls: ['./dealquery.component.css']
})
export class DealqueryComponent implements OnInit {
  loading:boolean = false
  dataSet:any = []
  tempSearchParam:any
  totalPage:any
  updateData:any = []
  pageSize1:any = 30
  isChange:any = false;
  kindNameArr:any =[];
  doorArr:any=[]
  parkArr:any=[]
  Update:boolean = false
  @ViewChild('kind') kind:ElementRef;

  constructor( private http: HttpUtilService, private nm: NzModalService, private nz: NzNotificationService,    private info: UserinfoService,) { }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize1})
    // this.getStatic(this.kindNameArr,'disp.matKind');
    this.getStatic(this.doorArr,'disp.gate');
    this.getStatic(this.parkArr,'disp.park');
    this.http.post(RGDISPURL.GETCODESET,{codesetCode:'disp.matKind'}).then(res=>{
      if(res.success){
        res.data.data.forEach(item=>{
          let data={name:'',value:''}
          data.name = item.itemCname
          data.value =item.itemCode;
          this.kindNameArr .push(data)
        })
      }

    })
  }
  /**
   * 获取主列表方法
   * @param data
   */
  getList1(data: any): void {
    let url =RGDISPURL.SELECTDEALQUERY;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.dataSet.forEach(item=>{
          item.editstate = 0;
          item.selectShow= false
        })
        this.updateData = []
      }
    })
  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    this.Update = false
    data.page = data.page || 1;
    data.length = data.length || this.pageSize1;
    this.getList1(data);
  }
  update(data:any){
    this.dataSet.forEach(item=>{
      if(item.dealNo!=data.dealNo){
        return;
      }
      this.kindNameArr.forEach(item1=>{
        if(item.kindName==item1.name){
          item.kindName = item1.value;
        }
      })
      this.doorArr.forEach(item2=>{
        if(item.toGateName ==item2.name){
          item.toGateName = item2.value;
        }
      })
      this.parkArr.forEach(item2=>{
        if(item.parkName ==item2.name){
          item.parkName = item2.value;
        }
      })
    })
    this.dataSet = [...this.dataSet];
    this.isChange = true;
    this.dataSet.forEach(item=>{
      if(item==data&&item.editstate==0){
        item.editstate = 1;
        item.selectShow = true;
      }
    });
  }
  save(data:any){
    data.kindCode = data.kindName
    data.toGate = data.toGateName
    data.parkCode = data.parkName
    data.recRevisor = this.info.APPINFO.USER.name
    this.http.post(RGDISPURL.UPDATEDEALQUERY,data).then(res=>{
      if(res.success){
        console.log(res)
        this.listSearch(this.tempSearchParam);
      }
    })
  }
  cancle(data:any,index:any) {
    this.isChange = false;
    this.dataSet.forEach(item=>{
      if(item==data&&item.editstate==1){
        item.editstate = 0;
        item.selectShow = false;
      }
    });
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data:any):void{
    this.updateData = data;
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
    console.log(this.tempSearchParam)
    this.tempSearchParam.page = page
    this.getList1(this.tempSearchParam );
  }

  colName(data: any) {
    let kind = data.filter(x => x.colEname === 'kindName')
    kind[0].tdTemplate = this.kind;
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.data.forEach(item => {
            data.push(item)
          })
        }
      }
    );
  }
  btnClick(data:any){
    switch (data.buttonId){
      case 'Update':
        this.btnUpdate();
        break;
      case 'Save':
        this.save(this.dataSet.filter(x=>x.editstate==1)[0]);
        break;
      default:
        break;
    }
  }
  btnUpdate(){
    if(this.updateData.length!=1){
      this.nz.error('提示信息','请勾选一条数据')
      return;
    }
    this.Update = true;
    this.update(this.updateData[0]);
  }

  modelChange(data:any,dady1:any){

  }
}
