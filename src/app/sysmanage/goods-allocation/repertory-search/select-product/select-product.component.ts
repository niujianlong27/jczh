import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {Goods_Allocation_Url} from '../../../../common/model/goodsAllocation-url';
import {stockUrl} from '@model/stockUrl';
import {contractUrl} from '../../../../common/model/contractUrl';


@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.css']
})
export class SelectProductComponent implements OnInit {

  dataSet: any = []; // 结果集
  loading: any; // 页面查询加载
  pageSize: any = 30; // 页面显示数据条数
  totalPage: any; // 总页数
  updatedata: any = []; // 选中的数据
  handleVisible:boolean = false;
  handleCon:string = '';
  handleLoading:boolean = false;
  buttonId:any
  tempSearchParam:any
  handleVisible1:boolean = false;
  handleCon1:string=''
  handleLoading1:boolean = false;
  totalWeight:any
  fWhsArr:any=[]
  constructor( private http: HttpUtilService , private nz: NzNotificationService, ) {   }

  ngOnInit() {
    this.listSearch({page: 1, length: this.pageSize});

  }

  /**
   * 查询方法
   * @param data
   */
  listSearch(data: any) {
    console.log('进入查询方法');
    data.page = data.page || 1;
    data.length = data.length || this.pageSize;
    this.getList(data);
  }

  /**
   * 获取主列表方法
   * @param data
   */
  getList(data: any): void {
    const url = Goods_Allocation_Url.getProduction;
    this.loading = true;
    this.dataSet = [];
    this.tempSearchParam = data
    // this.tempSearchParam = data;
    this.http.post(url, data).then((res: any) => {
      if (res.success) {
        console.log(res);
        this.loading = false;
        this.dataSet = res.data.data && res.data.data.data || [];
        this.totalPage = res.data.data && res.data.data.total || 0;
        this.dataSet.forEach(item=>{
          if(item.status==='RKZT00'){
            item._bgColor = '#DC3638'
            item.font_color = 'multi';
          }else if(item.status === 'RKZT10'){
            item._bgColor = '#EEEE00'
          }
        })
      }
    });
  }

  /**
   * 页面选中数据赋值给全局变量
   * @param data
   */
  updateDataResult(data: any) {
    this.updatedata = data;
    this.totalWeight = Number((((this.updatedata.map(item => item.fWeight).reduce((acc, cur) => this.isNotANumber(Number(acc)) + this.isNotANumber(Number(cur)), 0)))/1000).toFixed(3));

  }


  /**
   * 主列表每页展示条数改变的方法
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
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

  /**
   * 点击按钮执行的方法，根据按钮的buttonId来判断执行什么方法
   * @param data
   */
  btnclick(data: any) {
    this.buttonId = data.buttonId;
    switch (data.buttonId) {
      case 'HandleOk':
        this.btnHandleOk();
        break;
      case 'Cancle':
        this.btnCancle();
        break;
      case 'Match':
        this.btnMatch();
        break;
      case 'HandleOkOut':
        this.btnOut();
        break;
      case 'CancleOut':
        this.btnCancleOut();
        break;
      case 'Refresh':
        this.btnRefresh();
        break;
      default:
        break;
    }
  }

  btnHandleOk(){
    let flag:boolean = false;
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据')
      return;
    }
    this.updatedata.forEach(item=>{
      if(item.status!=='RKZT10'||item.type!=='入库'){
        flag = true;
      }
    })
    if(flag){
      this.nz.warning('提示信息','只有待处理状态且类型为入库才能确认入库')
      return;
    }
    this.handleCon = '是否对所选记录进行入库操作？'
    this.handleVisible = true;
  }

  btnCancle(){
    let flag:boolean = false;
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据')
      return;
    }
    this.updatedata.forEach(item=>{
      if(item.status!=='RKZT10'||item.type!=='入库'){
        flag = true;
      }
    })
    if(flag){
      this.nz.warning('提示信息','只有待处理状态且类型为入库才能取消入库')
      return;
    }
    this.handleCon = '取消入库后，该记录将无法进行入库操作，请确认？'
    this.handleVisible = true;
  }


  modalConfirmResult(data:any){
    if(data.type=='ok'){
      this.handleLoading = true
      let url = Goods_Allocation_Url.okProduction;
      let param :any={stringList:[]}
      if(this.buttonId==='Cancle'){
        param.status = 'RKZT30';
      }else{
        param.status = 'RKZT20'
      }
      this.updatedata.forEach(item=>{
        param.stringList.push(item.fNumber);
      })
      this.http.post(url,param).then(res=>{
        console.log(res)
        if(res.success){
          this.nz.create('success','提示信息','修改成功');
          this.handleVisible = false
          this.getList(this.tempSearchParam);
        }
      this.handleLoading = false
      })

    }else{
      this.handleVisible = false
    }
  }

  btnMatch(){
    let flag:boolean = false;
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据')
      return;
    }
    if( this.canOperate(this.updatedata,'status',['RKZT00','RKZT10'],'只有待处理或者未匹配的数据才可以匹配库位')){
      return;
    }
    let url = stockUrl.Matchproduct;
    let param :any={stringList:[]}
    this.updatedata.forEach(item=>{
      param.stringList.push(item.id);
    })
    this.http.post(url,param).then(res=>{
      if(res.success){
        this.nz.create('success','提示信息','匹配成功');
        this.getList(this.tempSearchParam);
      }
    })
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

  btnOut(){
    let flag:boolean = false;
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据')
      return;
    }
    this.updatedata.forEach(item=>{
      if(item.status!=='RKZT10'||item.type!=='出库'){
        flag = true;
      }
    })
    if(flag){
      this.nz.warning('提示信息','只有待处理状态且类型为出库才能确认出库')
      return;
    }
    this.handleCon1 = '是否对所选记录进行出库操作？'
    this.handleVisible1 = true;
  }
  btnCancleOut(){
    let flag:boolean = false;
    if(this.updatedata.length<=0){
      this.nz.warning('提示信息','请勾选一条数据')
      return;
    }
    this.updatedata.forEach(item=>{
      if(item.status!=='RKZT10'||item.type!=='出库'){
        flag = true;
      }
    })
    if(flag){
      this.nz.warning('提示信息','只有待处理状态且类型为出库才能取消出库')
      return;
    }
    this.handleCon = '取消出库后，该记录将无法进行出库操作，请确认？'
    this.handleVisible1 = true;
  }

  modalConfirmResult1(data:any){
    if(data.type=='ok'){
      this.handleLoading1 = true
      let url = stockUrl.StockOutOK;
      let param :any={stringList:[]}
      if(this.buttonId==='CancleOut'){
        param.status = 'RKZT30';
      }else{
        param.status = 'RKZT20'
      }
      this.updatedata.forEach(item=>{
        param.stringList.push(item.fNumber);
      })
      this.http.post(url,param).then(res=>{
        console.log(res)
        if(res.success){
          this.nz.create('success','提示信息','修改成功');
          this.handleVisible1 = false
          this.getList(this.tempSearchParam);
        }
        this.handleLoading1 = false
      })

    }else{
      this.handleVisible1 = false
    }
  }
  btnRefresh(){
    this.http.post(contractUrl.refreshProduct,{}).then(res=>{
      if(res.success){

        this.nz.success('提示信息','刷新成功')
        this.getList(this.tempSearchParam)
      }
    })
  }
  /*
*    数字NAN修改为0
*/
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }

  searchData(data:any){
      console.log(data)
    this.http.post(Goods_Allocation_Url.getCustomerId,{}).then(res=>{
      console.log(res)
      if(res.success){
        this.fWhsArr = res.data&&res.data.data||[];
        data.forEach(item=>{
          if(item.parameter==='whsidName'){
            item.apiParameter.optionList=[]
            this.fWhsArr.forEach(item1=>{
              item.apiParameter.optionList.push({value:item1.whsId,name:item1.whsDesc})
            })
          }
        })
      }
    })
    //data[].apiParameter.optionList     whsDesc   whsId
    }
}
