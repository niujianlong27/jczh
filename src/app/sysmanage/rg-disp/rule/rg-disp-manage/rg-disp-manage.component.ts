import { Component, OnInit } from '@angular/core';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import {CommonService} from '@service/common.service';

@Component({
  selector: 'app-rg-disp-manage',
  templateUrl: './rg-disp-manage.component.html',
  styleUrls: ['./rg-disp-manage.component.css']
})
export class RgDispManageComponent implements OnInit {

  listLoading1: boolean = false;
  dataSet1: any = [];
  totalPages1: Number = 0;
  pageSize1:Number = 30;
  buttonId:any;
  updateData:any = [];
  tempSearchParam:any = {};
  updateVisible:boolean = false;
  modalTitle2:any
  deleteCon:any
  isDelete:boolean = true;
  constructor(private http: HttpUtilService,
              private nm:NzModalService,
              private nz:NzNotificationService,
              private cm:CommonService) { }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize1 });
  }
  /**
   * 查询
   * @param data
   */
  listSearch(data:any){
    data.page = data.page || 1;
    data.length =  this.pageSize1||data.length ;
    this.getList1(data);
  }
  /**
   * 获取列表
   * @param data
   */
  getList1(data: any): void {
    let url =RGDISPURL.getDriverManage;
    this.listLoading1 = true;
    this.tempSearchParam=data;
    console.log(this.tempSearchParam,data);
    this.http.post(url, data).then((res: any) => {
      this.listLoading1 = false;
      if (res.success) {
        console.log(res)
        this.dataSet1 = res.data.data && res.data.data.data ||[];
        this.totalPages1 = res.data.data && res.data.data.total;

      }
    })
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchParam.page=page;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.tempSearchParam.length = pageSize;
    this.listSearch(this.tempSearchParam);
  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data:any):void{
    this.updateData = data;
    console.log(data)
  }


  btnClick(data:any){
    this.buttonId = data.buttonId;
    switch (this.buttonId) {
      case 'clear':
        this.btnClear();
        break;
      case 'delete':
        this.btnDelete();
        break;
      case 'Dark':
        this.btnDark();
        break;
      case 'Cancle':
        this.btnCancle();
        break;
      default:
        break;
    }
  }

  btnDark(){
    if(this.updateData.length!=1){
      this.nz.error('提示信息','请勾选一条数据');
      return
    }
    if(this.cm.canOperate(this.updateData,"bk3",["cancellation"],"已拉黑数据无须重复拉黑")){
      return
    };
    this.block(this.updateData[0])
  }

  btnCancle(){

      if(this.updateData.length!=1){
        this.nz.error('提示信息','请勾选一条数据');
        return
      }
    if(this.cm.canOperate(this.updateData,"bk3",["",null,undefined],"未拉黑数据无须重复取消拉黑")){
      return
    };
      this.unblock(this.updateData[0])

  }

  btnDelete(){
    if(this.updateData.length!=1){
      this.nz.error('提示信息','请选择一条信息!')
      return;
    }
    this.updateVisible = true;
    this.modalTitle2 ='提示信息';
    this.deleteCon= '是否确定解绑车牌？'
    this.isDelete = false;
  }
  btnClear(){
    if(this.updateData.length!=1){
      this.nz.error('提示信息','请选择一条信息!')
      return;
    }
    this.updateVisible = true;
    this.modalTitle2 ='提示信息';
    this.deleteCon= '是否确定解绑设备号？'
    this.isDelete = true;
  }

  modalConfirmResult(data:any){
    if(this.isDelete){
      if(data.type == 'ok'){
        console.log(data)
        let url = RGDISPURL.clearDriver
        let param:any={};
        param.driverPhone = this.updateData[0].mobile;
        this.http.post(url,param).then(res=>{
          if(res.success){

            this.nz.success('提示信息',res.data.data)
            this.updateVisible = false
            this.listSearch(this.tempSearchParam)
          }

        })
      }else{
        this.updateVisible = false
      }
    }else{
      if(data.type == 'ok'){
        console.log(data)

        let url  = RGDISPURL.deleteDriver
        let param = this.updateData[0]
        this.http.post(url,param).then(res=>{
          this.nz.success('提示信息',res.data.data)
          this.updateVisible = false
          this.listSearch(this.tempSearchParam)
        })
      }else{
        this.updateVisible = false
      }
    }
  }
  block(data:any){
    let url  = RGDISPURL.blockDriver;
    data.bk3 = 'cancellation'
    this.http.post(url,data).then(res=>{
      if(res.success){
        this.nz.success('提示信息',res.data.data)
        this.listSearch(this.tempSearchParam)
      }
    })
  }
  unblock(data:any){
    let url  = RGDISPURL.blockDriver;
    data.bk3 = ''
    this.http.post(url,data).then(res=>{
      if(res.success){
        this.nz.success('提示信息',res.data.data)
        this.listSearch(this.tempSearchParam)
      }
    })
  }
}
