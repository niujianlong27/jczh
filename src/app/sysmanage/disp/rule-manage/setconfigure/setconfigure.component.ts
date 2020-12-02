import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,ReactiveFormsModule,} from "@angular/forms";
import {FormsModule} from '@angular/forms'
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { environment } from '../../../../../environments/environment';
import { urls } from '../../../../common/model/url';
import { DISPURL } from 'src/app/common/model/dispUrl';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'app-setconfigure',
  templateUrl: './setconfigure.component.html',
  styleUrls: ['./setconfigure.component.css']
})
export class SetconfigureComponent implements OnInit {
  dataSet: Array<any> = [
  ];//表格里数据
  dealType:string;
  sysSuppTel:string;
  entryQueueMaxTime:string;
  remindNum:string;
  remindTime:string;
  postTime:string;
  postNum:string;
  forecastTime:string;
  param:any ={};
  isLoading:boolean;
  validateForm:FormGroup;
  tplModal: NzModalRef;
  tempSearchParam: any;
  themeArr:Array<any>=[];//超时处理方式小代码下拉列表
  constructor(private http: HttpUtilService, private nm: NzModalService){
    
  }
  ngOnInit() {
    this.getCodest();
    this.getListSearch();
  }
  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  getCodest(): void {
    //下拉框
    this.http.post(DISPURL.GETAllCODESET, {}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {

            //超时处理方式
            if (element.codesetCode == 'CSCL') {
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              this.themeArr.push(item)
            }
          });
        }
      }   
    )
  }

   //获取列表查询数据
   getListSearch(): void {
    const params = { url: '', data: {}, method: 'POST' };
    params.url = DISPURL.GETCONFIGURE;//查询集合或者对象
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.dataSet=res.data;
          this.remindTime=res.data.data.remindTime;
          
          if( res.data.data.dealType=='dealType_cancel'){
            this.dealType='TO01'
          }else{
            this.dealType = res.data.data.dealType;
          }
          this.sysSuppTel=res.data.data.sysSuppTel;
          this.entryQueueMaxTime=res.data.data.entryQueueMaxTime;
          this.remindNum=res.data.data.remindNum;
          this.postTime=res.data.data.postTime;
          this.postNum=res.data.data.postNum;
          this.forecastTime=res.data.data.forecastTime;
         console.log(this.dealType)
         console.log(res.data.data.length)
       /*   if(res.data.data.dealType=="0"){
            this.dealType="取消排队";
          }else{
            this.dealType="顺时延长"
          }*/
          console.log(this.dealType)
        }
      }
    );
  }
 
  save():void{
    this.isLoading=true;
    console.log(this.dealType);
    const params = { url: '', data: {}, method: 'POST' };
    params.url = DISPURL.SETCONFIGURE;
    const data : any ={
      dealType:this.dealType,
      sysSuppTel:this.sysSuppTel,
      entryQueueMaxTime:this.entryQueueMaxTime,
      remindNum:this.remindNum,
      remindTime:this.remindTime,
      postTime:this.postTime,
      postNum:this.postNum,
      forecastTime:this.forecastTime,
    }
      
      if(data.sysSuppTel!=undefined&&data.sysSuppTel!=null){
      if(data.sysSuppTel.length>200){
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '输入的字数过多'
        });
        return;
      }
    }
   /*   if(data.dealType=="取消排队"){
        data.dealType="0";
      }else{
        data.dealType="1";
      }*/
     if(data.sysSuppTel==undefined||data.entryQueueMaxTime==undefined||data.remindNum==undefined||data.remindTime==undefined||data.sysSuppTel==""||data.entryQueueMaxTime==""||data.remindNum==""||data.remindTime==""||data.dealType==undefined||data.dealType==""||data.forecastTime==undefined||data.forecastTime==""){
      
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请把信息填写完整'
        });
        this.isLoading=false;
        return;
     }else if(data.dealType=='TO02'&&(data.postNum===undefined||data.postTime===undefined||data.postNum===""||data.postTime==="")){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请把信息填写完整'
      });
      this.isLoading=false;
      return;
     }else{
    this.http.post(params.url,data).then(
      (res: any) => {
        this.isLoading=false;
        if (res.success) {
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '保存成功'
          });
          this.destroyTplModal();
        }
      }
    )}
  }
  

}
