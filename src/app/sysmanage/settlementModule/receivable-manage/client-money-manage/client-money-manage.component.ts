import { Component, OnInit } from '@angular/core';
import { urls} from '../../../../common/model/url';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import {delay} from 'rxjs/operators';
import {of} from 'rxjs';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'app-client-money-manage',
  templateUrl: './client-money-manage.component.html',
  styleUrls: ['./client-money-manage.component.css']
})
export class ClientMoneyManageComponent implements OnInit {
  collasped:boolean = false;
  collaspedHidden:boolean = false;
  data1:any[] = [];
  data2:any[] = [];
  loadding1:boolean = false;
  loadding2:boolean = false;
  selectData:any[] = [];
  selectChildData:Array<any>=[];
  currentData:any = {};
  private searchParam:any = {};
  private modalref: NzModalRef;

  // 页面grid
  gridOneHeight: string;
  gridTwoHeight: string;
  constructor(private http: HttpUtilService, private modal: NzModalService, private nz: NzNotificationService) { }

  ngOnInit() {
  }
  listSearch(param:any){
     this.searchParam = param;
     this.getList1(this.searchParam);
  }
  btnClick(type:any){
    if (this.selectChildData.length < 1) {
      this.nz.warning('提示消息','请选择数据后操作');
      return;
    }
    switch(type.buttonId){
       case 'refund':
         this.modalref = this.modal.create({
          nzTitle:'取消确认提示',
          nzContent:'<p class="f-b text-center m-re">是否对选中的数据进行申请退款?</p>',
          nzOnOk:()=>{
            this.refundFun();
            return false;
          }
        })
       break;
       default:
       break;
    }
  }
  selectDataFun(data:any[]){
     this.selectData = data;
     this.getList2(this.selectData)
  }

  selectDataChild(data: any) {
    this.selectChildData = data;
  }

  getList1(param = {}){
    this.loadding1 = true;
    this.collaspedHidden = false;
    this.collasped = false;
    this.data1 = [];
    this.data2 = [];
    this.http.post(urls.selectClientMoney,param).then( (res:any) =>{
      this.loadding1 = false;
      if(res.success){
         this.data1 = res.data.data && res.data.data.data || [];
      }
    })
  }
  getList2(data:any){
    // if(!(this.currentData.commissionClientId !== data.commissionClientId && this.collasped)){
    //   this.collaspedFun();
    // }
    this.currentData = data[0];
    // if(!this.collasped){
    //   this.data2=[];
    //    return;
    // }

    this.loadding2 = true;
    this.data2 = [];
    if (this.currentData) {
      let param = {commissionClientId:this.currentData.commissionClientId};
      this.http.post(urls.selectClientMoneyDetail,param).then( (res:any) =>{
        this.loadding2 = false;
        if(res.success){
          this.data2 = res.data.data || [];
        }
      })
    } else {
      this.loadding2 = false;
    }
  }
  refundFun(){

    let param = {tSettleRecModels:this.selectChildData};
    this.http.post(urls.batchRefund,param).then((res:any)=>{
      if(res.success){
        this.getList1(this.searchParam);
        this.modalref.destroy();
        this.nz.create('success','提示信息','申请退款成功',{nzDuration:3000});
      }
    })
  }
  collaspedFun(){
    this.collaspedHidden = false;
    this.collasped =!this.collasped;
    of(this.collasped).pipe(delay(500)).subscribe((x:boolean)=>{
      //  x && (this.collaspedHidden = true);
      this.collaspedHidden = x;
    })
  }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  /**
   * list点击事件
   * @param data
   */
  listClick(data):void{

    this.data1.forEach(item => {
      if (item.commissionClientId === data.commissionClientId) {
        item.checked = !item.checked;
      } else {
        item.checked = false;
      }
    });

    this.selectDataFun(this.data1.filter(item => item.checked));

  }

}
