import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { UserinfoService } from '../../common/services/userinfo-service.service';
import { GlobalService } from '../../common/services/global-service.service';
import { SimpleCacheService } from '../../common/services/simple-cache.service';
import { Utils } from '../../common/util/utils';
import { HttpUtilService } from '../../common/services/http-util.service';
import { urls } from '../../common/model/url';
import { TplButtonsService } from  '../tpl-buttons/tpl-buttons.service';

import { Subscription } from 'rxjs';
@Component({
  selector: 'app-searchform2',
  templateUrl: `./searchform2.component.html`,
  styleUrls: ['./searchform2.component.css']
})
export class Searchform2Component implements OnInit {
  isCollapse = true;
  findObj:any = {};//存放接收到的查询按钮数据 默认不展示
  selectArr: any = {};
  queryParameterList:any;//查询参数
  pageLength:boolean;//条数
  controlArray:Array<any> = [];//查询数据
  checkBoxVisible:boolean = true; // 选择是否显示

  private tplFindSub:Subscription;
  private tplResetSub:Subscription;
  private tplsearchSub:Subscription;
  private gloPageSub:Subscription;
  private checkBoxSub:Subscription;
  private findChangeSub:Subscription;

  @Input() formId:string;//优先级高
  @Input() searchDataHiden:any = {};//是个对象，根据设置对应的parameter属性值来进行隐藏
  @Output() search = new EventEmitter<any>();//查询

  @Input() suffixTemplate: TemplateRef<void>;

  @Output() searchDataReturn = new EventEmitter<any>()//查询区域数据返回
  constructor(private http: HttpUtilService, private info: UserinfoService, private glo: GlobalService, private tplBtnService: TplButtonsService, private simpleCache: SimpleCacheService ) {

   }

  ngOnInit() {
    this.listSearchGet();
    this.tplFindSub =  this.tplBtnService.btnFind.subscribe( (x:any) => {
              (x.formId == this.formId || !this.formId) && (this.findObj = Array.isArray(x.find) && x.find[0] || {})
              });
   this.tplResetSub = this.tplBtnService.formReset.subscribe( (x:any) => (x.formId == this.formId || !this.formId)  && this.resetForm());
   this.tplsearchSub = this.tplBtnService.formSearch.subscribe( (x:any)=> (x.formId == this.formId || !this.formId)  && this.listSearch());

    
   this.gloPageSub = this.glo.pageNumEmitter.subscribe((data:any) => { //条数和页码变动
      this.pageLength = data.length;//记录条数
      if(!data.search){ //如果是查询触发的不用在执行了
        this.search.emit({queryParameterList:this.queryParameterList,page:data.page,length:data.length});
      }

    });
  
    let userset = JSON.parse(localStorage.getItem('USERSET') || '{}');
    this.checkBoxVisible = userset.checkBoxVisible;

   this.checkBoxSub = this.glo.checkBoxEmitter.subscribe((data:any)=>{
      this.checkBoxVisible = data.checkBox;
    });



    // 高级搜索方案临时修改
  this.findChangeSub = this.glo.findChangeEmitter.subscribe((data:any) => {
      this.findChange(data);
    })
  }
  listSearch(): void { //列表查询
    let arr = [];
    this.queryParameterList = [];
    arr = this.checkBoxVisible && this.controlArray.filter((x:any)=> (x.value1 || x.value2)&&x.checkBox );
    arr = !this.checkBoxVisible && this.controlArray.filter((x:any)=> x.value1 || x.value2 ) ||  arr;


    this.queryParameterList = Utils.deepCopy(arr);

    this.queryParameterList.map((x:any)=>{
      x.apiParameter = x.apiParameter&&x.apiParameter.toString();
      if(x.queryBoxType == 'date'){ //对时间的处理
        x.value1 = x.value1 && Utils.dateFormat(x.value1,'yyyy-MM-dd HH:mm:ss');
        x.value2 = x.value2 && Utils.dateFormat(x.value2,'yyyy-MM-dd HH:mm:ss');
      };
        x.value1 = x.value1 && x.value1.trim();
        x.value2 = x.value2 && x.value2.trim();
    });
    this.queryParameterList = this.queryParameterList[0]?this.queryParameterList:undefined;

    this.search.emit({queryParameterList:this.queryParameterList,length:this.pageLength || 30,page:1}); //查询触发，查询是页码重置为1
    this.glo.pageNumEmitter.emit({length:this.pageLength,page:1,search:true})//查询的时候页码要重置为1，
   }
   resetForm(): void { //重置
    this.controlArray.map( (data,i)=> {
       this.controlArray[i].value1 = '';
       this.controlArray[i].value2 = '';
       this.controlArray[i].checkBox = false;
    })
   }
  selectedData(data:any,item:any):void{
    item.value1 = data.inpName;
   /* console.log(data);
    let temp = [];
    for(let d of data.data){
      temp.push(d.companyName);
    }
    if(temp.length>2){
      item.value1 = `已选择(${temp.length})`;
    }else{
      item.value1 = temp.join(',');
    }*/
  }
  //日期禁止
  disabledDate(data:any,flag:number):any{
     return (d:Date) => {
       if( (flag === 2) && data.value1 && (data.value1.getTime() > d.getTime())){
         return true;
       }
       if( (flag === 1) && data.value2 && (data.value2.getTime() < (d.getTime() - 86400000 ) )){
        return true;
      }
     }
  }

   //查询区域数据获取
   listSearchGet(): void{
     var _key = 'SEARCH_'+(this.formId || this.info.APPINFO.formId) + '_' + this.info.APPINFO.USER.userId;
     if (this.simpleCache.has(_key)) {
       // 如果有缓存，则直接处理
       this._processSearchGet(this.simpleCache.get(_key));
     } else {
        this.http.post(urls.finds,{formId: this.formId || this.info.APPINFO.formId,userId:this.info.APPINFO.USER.userId}).then(
          (res:any) => {
            if (res.success) {
              this.simpleCache.set(_key, res);
            }
            this._processSearchGet(res);
          }
        );
    }
   }
   _processSearchGet(res: any){
    if (res.success) {
      let temp = res.data.data[0] && res.data.data[0].findSet || '[]';
      this.controlArray = JSON.parse(temp);

      this.controlArray.map((x: any) => {
        if ('select' == x.queryBoxType) {
          x.apiParameter && this.getStaticFun(JSON.parse(x.apiParameter).valueSetCode, x.parameter);
        }
        if (x.queryBoxType == 'date') { //对时间的处理
          if (!x.value1) {
            let now = new Date().getTime();
            x.value1 = new Date(now - 7 * 24 * 3600 * 1000);
            x.checkBox = true;
          }
        }
      })

      this.searchDataReturn.emit(this);//数据返回

    } else {
      this.controlArray = [];

    }
  }
   //
   getStaticFun(valueSetCode:string,parameter:string): void {
     this.http.post(urls.static,{valueSetCode:valueSetCode}).then(
       (res:any) => {
          if(res.success){
            this.selectArr[parameter] = res.data.data.data;
          }
       }
     )
   }

  //input框值发生变化
  searchModelChange(val:any,data:any){
   /*  if(val){ //有值
        data.checkBox = true;
     }else{ //没值
        data.checkBox = false;
     }*/
     data.checkBox = val?true:false;
  }
  // 高级搜索后的设置
  findChange(data:any):void {
    this.controlArray = JSON.parse(data.findSet);

    for (let i = 0; i < this.controlArray.length; i++) {

      if('select' == this.controlArray[i].queryBoxType){
        this.controlArray[i].apiParameter && this.getStaticFun(JSON.parse(this.controlArray[i].apiParameter).valueSetCode,this.controlArray[i].parameter);
      }
    }
  }
  ngOnDestroy(){
    this.findChangeSub && this.findChangeSub.unsubscribe();
    this.tplFindSub && this.tplFindSub.unsubscribe();
    this.tplResetSub && this.tplResetSub.unsubscribe();
    this.tplsearchSub && this.tplsearchSub.unsubscribe();
    this.gloPageSub && this.gloPageSub.unsubscribe();
    this.checkBoxSub && this.checkBoxSub.unsubscribe();
  }
}
