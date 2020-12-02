import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { GlobalService } from '../../../../common/services/global-service.service';
import { Utils } from '../../../../common/util/utils';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { urls } from '../../../../common/model/url';
import { TplButtonsService } from '../../../../components/tpl-buttons/tpl-buttons.service';
import { SimpleCacheService } from '../../../../common/services/simple-cache.service';
import { Utils as SeaUtils } from '../utils';
import { parse } from 'date-fns';

import { Subscription } from 'rxjs';
import { CodesetService } from '../codeset.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-searchform',
  templateUrl: `./searchform.component.html`,
  styleUrls: ['./searchform.component.css']
})
export class SearchformComponent implements OnInit {
  isCollapse = true;
  findObj:any = {};//存放接收到的查询按钮数据 默认不展示
  selectArr: any = {};
  queryParameterList:any;//查询参数
  pageLength:boolean;//条数
  controlArray:Array<any> = [];//查询数据
  checkBoxVisible:boolean = true; // 选择是否显示
  searchFormHidden:boolean = false;
  searchOptionsArr:any[] = [
    {name:'包含',value:'包含'},
    {name:'不包含',value:'不包含'},
    {name:'等于',value:'等于'},
    {name:'不等于',value:'不等于'},
    {name:'小于',value:'小于'},
    {name:'小于或等于',value:'小于或等于'},
    {name:'大于',value:'大于'},
    {name:'大于或等于',value:'大于或等于'},
    {name:'介于',value:'介于'}
  ]

  private tplFindSub:Subscription;
  private tplResetSub:Subscription;
  private tplsearchSub:Subscription;
  private gloPageSub:Subscription;
  private checkBoxSub:Subscription;
  private findChangeSub:Subscription;
  private searchFormHiddenSub:Subscription;
  @Input() formId:string;//优先级高
  @Input() gridId:string;//
  @Input() searchDataHiden:any = {};//是个对象，根据设置对应的parameter属性值来进行隐藏
  @Input() btnHiden:any = {};
  @Output() search = new EventEmitter<any>();//查询
  @Output() reset = new EventEmitter<any>();//重置
  @Input() suffixTemplate: TemplateRef<void>;
  @Output() searchDataReturn = new EventEmitter<any>()//查询区域数据返回
  @Output() searchComponent = new EventEmitter<any>()//查询区域数据返回
  constructor(private http: HttpUtilService, private info: UserinfoService, private glo: GlobalService,private tplBtnService: TplButtonsService 
    , private simpleCache: SimpleCacheService, private codeset: CodesetService, private msg: NzMessageService) {

   }

  ngOnInit() {
    this.listSearchGet();
    this.tplFindSub =  this.tplBtnService.btnFind.subscribe( (x:any) => {
              (x.formId == this.formId || !this.formId) && (this.findObj = Array.isArray(x.find) && x.find[0] || {})
              });
   //this.tplResetSub = this.tplBtnService.formReset.subscribe( (x:any) => (x.formId == this.formId || !this.formId)  && this.resetForm());
   //this.tplsearchSub = this.tplBtnService.formSearch.subscribe( (x:any)=> (x.formId == this.formId || !this.formId)  && this.listSearch());
   this.searchFormHiddenSub = this.tplBtnService.collaspedSearch.subscribe( (x:any)=> (x.formId == this.formId || !this.formId) && (this.searchFormHidden = x.searchFormHidden))

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
        // x.value1 = x.value1 && Utils.dateFormat(x.value1,x.format || 'yyyy-MM-dd HH:mm:ss');
        // x.value2 = x.value2 && Utils.dateFormat(x.value2,x.format || 'yyyy-MM-dd HH:mm:ss');
        x.value1 = x.value1 && SeaUtils.dateformat2(x.value1, x.format);
        x.value2 = x.value2 && SeaUtils.dateformat2(x.value2, x.format);
      };
        x.value1 = x.value1 && x.value1.trim();
        x.value2 = x.value2 && x.value2.trim();
        console.log(x.format);
        if(x.format == 'yyyy-MM-dd'){
           const val = x.value1;
           switch(x.query){
              case '等于':
                 x.query = '介于';
                 x.value1 = `${val} 00:00:00`;
                 x.value2 = `${val} 23:59:59`;
                 break;
              case '不等于':
                x.value1 = `${val} 00:00:00`;
                x.value2 = `${val} 23:59:59`;
                break;
              case '小于':
               x.value1 = `${val} 00:00:00`;
              break;
              case '小于或等于':;
                x.value1 = `${val} 23:59:59`;
              break;
              case '大于':
               x.value1 = `${val} 23:59:59`
               break;
              case '大于或等于':
                x.value1 = `${val} 00:00:00`;
              break;
              case '介于':
                x.value1 = `${val} 00:00:00`;
                x.value2 = `${x.value2} 23:59:59`;
              default:
              break;

           }
        }
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
    this.reset.emit(this.controlArray);
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
       if( (flag === 2) && data.value1 && (parse(data.value1).getTime() > d.getTime())){
         return true;
       }
       if( (flag === 1) && data.value2 && (parse(data.value2).getTime() < (d.getTime() - 86400000 ) )){
        return true;
      }
     }
  }

   //查询区域数据获取
   listSearchGet(): void{
     var _key = 'SEARCH_' + (this.formId || this.info.APPINFO.formId) + '_' + this.info.APPINFO.USER.userId;
     if (this.simpleCache.has(_key)) {
       // 如果有缓存，则直接处理
       this._processSearchGet(this.simpleCache.get(_key));
     } else {
        this.http.post(urls.finds,{formId: this.formId || this.info.APPINFO.formId, gridId: this.gridId, userId:this.info.APPINFO.USER.userId}).then(
          (res:any) => {
            if (res.success) {
              this.simpleCache.set(_key, res);
            }
            this._processSearchGet(res);
          }
        );
      }
   }

  _processSearchGet(res: any) {
    if (res.success) {
      let temp = res.data.data[0] && res.data.data[0].findSet || '[]';

      this.controlArray = JSON.parse(temp);

      this.controlArray.map((x: any) => {
        x.parameter2 = `${x.parameter}_between_end`;
        if ('select' == x.queryBoxType) {
          if (typeof x.apiParameter === "string") {
            x.apiParameter = JSON.parse(x.apiParameter);
          }
          x.apiParameter.optionList = [];
          x.apiParameter && x.apiParameter.valueSetCode && this.getStaticFun(x.apiParameter.valueSetCode, x.apiParameter.optionList);
        }
        if('date' === x.queryBoxType){
          x.format = x.queryFormat || x.format || "yyyy-MM-dd HH:mm:ss";
          x.value1 = SeaUtils.computeDate(x.value1, x.compute1);
          x.value2 = SeaUtils.computeDate(x.value2, x.compute2);
          x.checkBox = !!x.value1 || !!x.value2;
        }
        if('radio' === x.queryBoxType){
          if (typeof x.apiParameter === "string") {
            x.apiParameter = JSON.parse(x.apiParameter);
          }
          x.apiParameter.optionList = [];
          x.apiParameter && x.apiParameter.url && this.getCustomOptions(x);
        }
      })

      this.searchDataReturn.emit(this.controlArray);//数据返回
      this.searchComponent.emit(this);
    } else {
      this.controlArray = [];

    }
   }
   //
   getStaticFun(valueSetCode:string,parameter:Array<any>): void {
     this.http.post(urls.static,{valueSetCode:valueSetCode}).then(
       (res:any) => {
          if(res.success){
            // this.selectArr[parameter] = res.data.data.data;
            Array.prototype.push.apply(parameter,res.data.data.data)

          }
       }
     )
   }

  /**
   * l自定义请求选择列表
   * @param apiParameter 
   */
  getCustomOptions(condition: any) {
    let apiParameter = condition.apiParameter;
    if ('local' === apiParameter.requestType) {
      if (apiParameter.url === 'bizScope') {
        this.codeset.reFetchSeaUserInfo().then(() => {
          const bizScope = this.info.APPINFO.USER.requestUserSegmentId || this.info.APPINFO.USER.seaUserBizScope;
          apiParameter.optionList = this.codeset.getItems('bizScope', bizScope);
          if(!apiParameter.optionList || apiParameter.optionList.length === 0){
            this.msg.warning("该用户或公司未配置业务范围，请联系运营人员，或者重新登录或刷新试一下。");
          }else if(apiParameter.optionList.length > 1){
            apiParameter.optionList = [{ label: '全部', value: '' }, ...apiParameter.optionList];
          }else{
            condition.value1 = apiParameter.optionList[0].value;
          }
        });
      }
    } else {
      this.http.post(urls[apiParameter.url], { ...apiParameter.parameter }).then(
        (res: any) => {
          if (res.success) {
            apiParameter.fieldKey = apiParameter.fieldKey ? JSON.parse(apiParameter.fieldKey) : this.defaultFieldKey;
            apiParameter.optionList = this.dataTransform(res.data.data, apiParameter.fieldKey);
          }
        }
      )
    }
  }

  defaultFieldKey: any = { text: 'label', value: 'value' };//下拉框的数据格式
  dataTransform(data: Array<any>, fieldKey: any) {
    let _data = [];
    for (let i = 0; i < data.length; i++) {
      _data[i] = {};
      _data[i].label = data[i][fieldKey.text];
      _data[i].value = data[i][fieldKey.value];
    }
    return _data;
  }

  //input框值发生变化
  searchModelChange(val:any,data:any){
   /*  if(val){ //有值
        data.checkBox = true;
     }else{ //没值
        data.checkBox = false;
     }*/
     data.checkBox = val?true:false;
     if('radio' === data.queryBoxType){
      data.value1 = val;
      this.listSearch();
     }
  }
  // 高级搜索后的设置
  findChange(data:any):void {
    this.controlArray = JSON.parse(data.findSet);

    for (let i = 0; i < this.controlArray.length; i++) {

      if('select' == this.controlArray[i].queryBoxType){
        this.controlArray[i].apiParameter = JSON.parse(this.controlArray[i].apiParameter);
        this.controlArray[i].apiParameter.optionList=[];
        this.controlArray[i].apiParameter && this.controlArray[i].apiParameter.valueSetCode && this.getStaticFun(this.controlArray[i].apiParameter.valueSetCode,this.controlArray[i].apiParameter.optionList);
      }
    }
    this.searchDataReturn.emit(this.controlArray);//数据返回
    this.searchComponent.emit(this);
  }
  ngOnDestroy(){
    this.findChangeSub && this.findChangeSub.unsubscribe();
    this.tplFindSub && this.tplFindSub.unsubscribe();
    this.tplResetSub && this.tplResetSub.unsubscribe();
    this.tplsearchSub && this.tplsearchSub.unsubscribe();
    this.gloPageSub && this.gloPageSub.unsubscribe();
    this.checkBoxSub && this.checkBoxSub.unsubscribe();
    this.searchFormHiddenSub && this.searchFormHiddenSub.unsubscribe();
  }
}
