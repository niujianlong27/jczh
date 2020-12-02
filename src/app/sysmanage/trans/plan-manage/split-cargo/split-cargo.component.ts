import {Component, OnInit, ViewChild} from '@angular/core';
import {Utils} from '../../../../common/util/utils';
import {FormBuilder,FormControl,FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TRANS_URLS} from '../../../../common/model/trans-urls';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {TplButtonsService} from '../../../../components/tpl-buttons/tpl-buttons.service';
import {HttpClient} from '@angular/common/http';

/**
 * Title: split-cargo.component.ts
 * Description:
 * Created: pengzitong 2019/2/22
 * Modified:
 */
@Component({
  selector: 'app-split-cargo',
  templateUrl: './split-cargo.component.html',
  styleUrls: ['./split-cargo.component.css']
})
export class SplitCargoComponent implements OnInit {
  lineName:any;
  lineArr:any = [];

  listLoading1: boolean = false;

  dataSet1: any = [];
  totalPages1: Number = 0;
  pageSize1:Number = 30;

  listLoading2: boolean = false;
  dataSet2: any = [];
  totalPages2: Number = 0;
  pageSize2:Number = 30;

  btnDis:any = {
    'Save':true
  };

  listLoading3: boolean = false;
  dataSet3: any = [];
  totalPages3: Number = 0;
  pageSize3:Number = 30;

  updateData:any = [];
  tempSearchParam:any;
  columnsArr:any;


  headerArr:any = [];
  headerArr2:any = [];
  isCheckBox2:boolean = false;

  updateData2:any = [];
  updateData3:any = [];
  tempSearchParam3:any = {};
  columnsArr2:any;

  tempParamSave:any = [];
  tempParamDetail:any = [];
  tempCity:any;

  gridOperateStatus:boolean = false;
  validateForm:FormGroup;
  buttonId:any;
  tplModal: NzModalRef;
  @ViewChild('tplTitle') tplTitle;
  @ViewChild('tplContent') tplContent;
  @ViewChild('tplFooter') tplFooter;
  modalTitle:any = '省内分货 > 详情';

  searchFormHidden:boolean = false;
  chooseTime:any;

  // 页面grid
  operate: any;
  gridOneHeight: string;
  gridTwoHeight: string;
  private searhData:any = {};
  constructor(
    private nm:NzModalService,
    private fb: FormBuilder,
    private http:HttpUtilService,
    private tplbtnService:TplButtonsService,
    private nz:NzNotificationService,
    private nzMess:NzMessageService,
    private anhttp: HttpClient,
  ) { }

  /**
   * 初始化
   */
  ngOnInit() {


    let url = TRANS_URLS.cargoTraceLine2;
    this.http.post(url,{}).then((res:any)=>{
      if(res.success){
        this.lineArr = res.data && res.data.data || [];
      }
    })

    // this.tplbtnService.formReset.subscribe((data:any)=>{
    //   this.validateForm.reset();
    //   this.lineName = undefined;
    // });
    //
    // this.tplbtnService.collaspedSearch.subscribe((data:any)=>{
    //   this.searchFormHidden = data.searchFormHidden;
    // });
  }
  gridHeight(data:any){
    this.gridOneHeight = `${data.one - 38}px`;
    this.gridTwoHeight = `${data.two}px`;
  }

  /**
   * 重置
   * @param data
   */
  reset(data:any){
    this.validateForm.reset();
    this.lineName = undefined;
  };

  /**
   * 是否显示查询条件
   * @param data
   */
  btnSearch(data:any){
    this.searchFormHidden = data;
  }

  /**
   * 查询
   * @param data
   */
  listSearch(data:any){
    let url = TRANS_URLS.cargoList;
    this.listLoading1 = true;
    this.dataSet2=[]
    console.log(data);
    this.tempSearchParam = data;
    this.dataSet1 = [];
    let allWeight:any;
    this.http.post(url,data).then((res:any)=>{
      this.listLoading1 = false;

      if(res.success){
        console.log(res);
        res.data.data.data.forEach((item:any)=>{
          item.deliveryNoticeModels.forEach((item1:any)=>{

            this.dataSet1.push(item1);

          })
        })
        this.dataSet1 = [...this.dataSet1]
        console.log(this.dataSet1)
        this.totalPages1  = this.dataSet1.length;
        // this.dataSet1 = res.data.data.data;
        // this.handelData(res.data.data.data||[]) && (this.totalPages1 = res.data.data.total || 0);
        this.btnDis = {};
        //this.getList2(data);
        // console.log(data);

        // console.log(this.tempSearchParam);
      }
      data.queryParameterList.forEach((item:any)=>{
        if(item.parameter == 'cargoDate'){
          this.chooseTime = item.value1.slice(0,10);

        }else if(item.parameter=='lineName'){
          this.lineName = item.value1;

        }else{
          return;
        }
      })
    });

  }

  /**
   * 解析数据
   * @param data
   */
  handelData(data):boolean{
    // this.headerArr = [];
    // this.dataSet1 = [];
    let dataArr:any=[];
    if(data.length<1){
      return false;
    }
    let prodName:any;
    let obj1:any = {};
    let largeCars:number= 0;
    let smallCars:number = 0;
    console.log(data)
    data.forEach((item:any)=>{
      //解析数据生成列表1表头和列表1数据
      let obj:any = {};
      item.fleetRations.forEach((data1:any)=>{
        prodName = data1.prodNamer;
        let tempArr:any = [];
        this.headerArr2.forEach(h=>{
          tempArr.push(h.colCname);
        });
        if(tempArr.indexOf(data1.prodName) < 0){
          this.headerArr2.push({
            colCname:data1.prodName,
            colEname:data1.prodName,
            visible:'XSBJ10'
          });
        }
        obj['城市'] = item.city;
        obj['车队id'] = data1.consigneeId
        obj['车队'] = data1.consignee;
        obj[data1.prodName] = data1.loadWeight;
        if(item.weightName=='标载'){
          obj['标载车数量'+data1.prodName] = data1.loadCars;
        }else{
          obj['大载车数量'+data1.prodName] = data1.loadCars;
        }
        if(obj.车队!=null){
          let flag = false;
          dataArr.forEach((item2:any)=>{
            if(obj.城市==item2.城市&&obj.车队==item2.车队){
                item2['大载车数量'+data1.prodName] = obj['大载车数量'+data1.prodName]
                item2['标载车数量'+data1.prodName]=obj['标载车数量'+data1.prodName];
                item2[String(data1.prodName)]=obj[data1.prodName];
                flag = true;
            }
          })
          if(!flag){
            dataArr.push(obj)
          }
        }
        obj={}
      })

    });

    //列表1表头排序
    let t:any;
    for(let i=0;i<this.headerArr2.length;i++){
      for(let j=i+1;j<this.headerArr2.length;j++){
        if(this.headerArr2[i].colEname > this.headerArr2[j].colEname){
          t=this.headerArr2[i];
          this.headerArr2[i]=this.headerArr2[j];
          this.headerArr2[j]=t;
        }
      }
    };

    let tempHeader:any = [];
    this.headerArr2.forEach(h1=>{
      tempHeader.push(h1);
      tempHeader.push({colCname:'大载',colEname:'大载车数量'+h1.colEname,visible:'XSBJ10',edit:'BJBJ10',type:'number',format:'0',intType:'true'},);
      tempHeader.push({colCname:'标载',colEname:'标载车数量'+h1.colEname,visible:'XSBJ10',edit:'BJBJ10',type:'number',format:'0',intType:'true'});
    });
    console.log(dataArr)
    let j:any;
    dataArr.forEach((ele:any)=>{
      for( j in ele){
        console.log(j.indexOf("大载车数量"));
        if(j.indexOf("大载车数量")>=0){
          largeCars += this.isNotANumber(Number(ele[j]));
        }else if(j.indexOf("标载车数量")>=0){
          smallCars+=this.isNotANumber(Number(ele[j]));
        }

      }
      ele.大载车数量=largeCars;
      ele.标载车数量=smallCars;
      largeCars=0;
      smallCars=0;
    })
    this.dataSet2 = [...dataArr,...this.dataSet2];
    this.headerArr2 = [
      {colCname:'城市',colEname:'城市',visible:'XSBJ10'},
      {colCname:'车队id',colEname:'车队id',visible:'XSBJ20'},
      {colCname:'车队',colEname:'车队',visible:'XSBJ10'},
      ...tempHeader,
      {colCname:'大载车总数',colEname:'大载车数量',visible:'XSBJ10'},
      {colCname:'标载车总数',colEname:'标载车数量',visible:'XSBJ10'},
    ];
    return true;

  }

  getList(data:any){

  }

  /**
   * 获取列表2 的数据
   * @param data
   */
  getList2(data:any){
    let url = TRANS_URLS.cargoList2;
    this.dataSet2 = [];
    this.listLoading2 = true;
    this.headerArr2 = [];
    this.gridOperateStatus = false;
    this.http.post(url,data).then((res:any)=>{
      if(res.success){
        console.log(res);
        // this.headerArr2 = [
        //   {
        //     "colEname":"city",
        //     "colCname":"城市",
        //     "visible":"XSBJ10",
        //     "edit":"BJBJ20"
        //   },
        //   {
        //     "colEname":"consignee",
        //     "colCname":"车队",
        //     "visible":"XSBJ10",
        //     "edit":"BJBJ20"
        //   },
        // ];
        this.handelData(res.data.data.data);
        // this.gridOperateStatus = true;
        // setTimeout(()=>{
        //   this.dataSet2 = res.data.data && res.data.data.data || [];
        //   this.totalPages2 = res.data.data && res.data.data.total || 0;
        //   this.tempParamSave = res.data.data && res.data.data.data || [];
        // });
        this.listLoading2 = false;
      }else{
        this.headerArr2 = [];
        this.listLoading2 = false;
      }
    })
  }

  /**
   * 获取弹窗列表数据
   * @param data
   */
  getList3(data:any){
    this.tempCity = data.city;
    this.dataSet3 = [];
    this.tempSearchParam3 = data;
    this.tempParamSave.forEach(item =>{
      if(item.city === data.city){
        item.detailList && (this.tempParamDetail = Utils.deepCopy(item.detailList));
        this.dataSet3 = this.tempParamDetail;
        this.totalPages3 = item.detailList && item.detailList.length || 0;
      }
    })
  }

  /**
   * 当前选中数据发生改变
   * @param data
   */
  updateDataResult(data:any):void{
    this.updateData = data;
  }

  /**
   * 保存表头
   * @param data
   */
  userColumnsEmit(data:any):void{
    this.columnsArr = data;
  }

  /**
   * 当前选中数据发生改变2
   * @param data
   */
  updateDataResult2(data:any):void{
    this.updateData2 = data;
    this.btnDis = this.updateData2.length > 0 ? {}:{
      'Save': true
    };
  }

  /**
   * 当前选中数据发生改变3
   * @param data
   */
  updateDataResult3(data:any):void{
    this.updateData3 = data;
  }

  /**
   * 保存表头2
   * @param data
   */
  userColumnsEmit2(data:any):void{
    this.headerArr2 = data;
  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data:any){
    this.buttonId = data.buttonId;
    console.log(this.buttonId);
    switch (this.buttonId) {
      case 'Save':
        this.btnSave();
        break;
      case 'SpitCargo':
        this.btnSpitCargo();
        break;
      case 'export':
        this.btnExport();
        break;
      case 'DetailExport':
        this.btnDetailExport();
        break;
      case'Create':
        this.btnCreate();
        break;
      default:
        break;
    }
  }

  btnCreate(){
    let url = TRANS_URLS.createOrder
    let param:any = {cargoDate:this.chooseTime,lineName:this.lineName}
    this.http.post(url,param).then((res:any)=>{
      if(res.success){
        console.log(res);
        this.nz.create('success', '提示信息', res.data.data.msg, {nzDuration: 3000});
      }
    })
  }

  /**
   * 明细导出
   */
  btnDetailExport(){
    this.searhData.forEach(element => {
      if(element.parameter==='lineName'){
        this.lineName=element.value1;
      }
      if(element.parameter==='cargoDate'){
        if(element.value1 instanceof Object){
          this.chooseTime=element.value1.toLocaleDateString();
        }else{
          this.chooseTime=element.value1;
        }     
      }
    });
    if(this.lineName===null||this.lineName===undefined){
      this.nzMess.error("请选择线路！");
      return
    }
    if(this.chooseTime===null||this.chooseTime===undefined){
      this.nzMess.error("请选择分货日期！");
      return
    }
    //this.chooseTime=new Date(this.chooseTime).format("");
    this.chooseTime=Utils.dateFormat(new Date(this.chooseTime),'yyyy-MM-dd');
    
    let url  = TRANS_URLS.STOCKEXPORT;
    let param:any={"cargoDate":this.chooseTime,"lineName":this.lineName}
    this.anhttp.post(url, param, {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `库存明细导出.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    console.log(param);
  }


  /*
  *
  */
  btnExport(){
    let url: any =TRANS_URLS.exportCargo;
    let param:any={};
    param.cargoDate =this.chooseTime;
    param.lineName = this.lineName
    this.anhttp.post(url,param , {responseType: 'blob'}).subscribe((res: any) => {
      var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
      var objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      let str = this.chooseTime.split('-');
      let time = str[0].concat(str[1],str[2])
      a.download = `调度分货_${this.lineName}_${time}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  /*
  *   分货按钮
  */
  btnSpitCargo(){
    if(this.isCanSendWeight()){
      return;
    }
    let param:any={}
    param = this.tempSearchParam
    param.mainList=this.dataSet1
    this.getList2(this.tempSearchParam);
  }

  /*
  *  判断是否填写可发量符合规则
  */
  isCanSendWeight(){
    let flag = false;
    let count:number=0
    if(this.dataSet1.length==0){
      flag = true;
      this.nz.error('提示信息','请先查询分货信息')
      return flag;
    }
    this.dataSet1.forEach(item=>{

      if(item.canSendWeight==''||item.canSendWeight==undefined){
        flag = true;
        count = 3
      }
      if(Number(item.canSendWeight)<0){
        flag = true;
        count = 1
        return;
      }
      if(Number(item.canSendWeight)>Number(item.allWeight)){
        flag = true;
        count = 2
        return;
      }
    })
    if(flag){
      if(count==3){
        this.nzMess.error("输入的可发量有空值，请输入！")
      }else
      if(count==1){
        this.nzMess.error("输入的可发量小于0，请重新输入！")
      }else if(count ==2){

        this.nzMess.error("可发量大于总重量，请重新输入！")
      }

    }
    return flag
  }


  /**
   * 保存
   */
  btnSave(){
    if(this.isCars()){
      return;
    }

    // for (const i in this.validateForm.controls) {
    //   this.validateForm.controls[ i ].markAsDirty();
    //   this.validateForm.controls[ i ].updateValueAndValidity();
    // }
    // console.log(this.validateForm);
    // if(this.validateForm.status === "INVALID"){
    //   return;
    // }\

    let arr:any=[{城市:"泰安市",车队:"万达兴",白卷:"68.685",大载车数量白卷:"1.0",大载车数量黑卷:"3.0",标载车数量黑卷:undefined,黑卷:"450"}]
    let url = TRANS_URLS.cargoSave;
    console.log(this.handelSaveData(this.dataSet2));
    let param:any={}
    param.mainList=this.dataSet1
    param.mainList.forEach((item:any)=>{
      item.cargoDate = this.chooseTime;
    })
    param.detailList=this.handelSaveData(this.dataSet2)
    this.http.post(url,param).then((res:any)=>{
      if(res.success){
        this.nz.create('success','提示信息','保存成功',{nzDuration:3000});
        this.listSearch(this.tempSearchParam);
      }
    })
  }
  /*
  *   判断是否修改的车数是否符合规则
  */
  isCars(){
    let flag = false;
    let i;

    this.dataSet2.forEach(item=>{

      for(i in item){
        if(i.indexOf("大载车数量")>=0||i.indexOf("标载车数量")>=0){
          if(Number(item[i])<0){
            flag = true;
            return;
          }
            if(item[i]!=undefined&&Math.round(Number(item[i]))!=Number(item[i])){
               flag = true;
              return
            }
        }
      }
    })
    if(flag){
      this.nzMess.error("填写的车数有误，请重新修改！")
    }
    return flag;
  }


  /*
  *    解析保存数据
  */

  handelSaveData(data:any){
    let arr:any = [];
    let obj:any ={};
    let keyArr:any=[]
    let keyArr1:any=[];
    let prodArr:any=[];
    data.forEach((item:any)=>{

      keyArr = this.getObjectKey(item);
      keyArr1 = this.arrayDelete(keyArr,['城市','车队id','车队','大载车数量','标载车数量']);
      keyArr1.forEach((item1:any)=>{
        if(item1.indexOf("大载车数量")<0&&item1.indexOf("标载车数量")<0){
          prodArr.push(item1);
        }
      })
      keyArr1=this.arrayDelete(keyArr1,prodArr);
      prodArr.forEach(item2=>{
        keyArr1.forEach(item3=>{
          if(item3.indexOf(String(item2))>=0){
            if(item3.indexOf("大载车数量")>=0&&item3.indexOf(String(item2))>=0){
              obj.vechileBigCount = item[item3];
            }
            if(item3.indexOf("标载车数量")>=0&&item3.indexOf(String(item2))>=0){
              obj.vechileStandardCount = item[item3];
            }
            if(obj.vechileBigCount!=null){
              obj.vechileStandardCount=null;
            }else{
              obj.vechileBigCount=null;
            }
          }
        })
        obj.city = item.城市;
        obj.carTeam = item.车队;
        obj.carTeamCompanyId = item.车队id;
        obj.varieties = item2;
        obj.loadRatio = item[item2];
        arr.push(obj);
        obj={};
        prodArr=[]
      })
    })
    return arr;
  }

  /*
  *    获取对象的属性名称
  */

  getObjectKey(data:any){
    let i;
    let arr:any = []
    for(i in data){
      arr.push(i);
    }
    return arr
  }

    /*
    *     删除数组中的数组
    */

  arrayDelete(data:any,data1:any){
      data1.forEach((item:any)=>{
      let index = data.indexOf(item);
      if(index>-1){
        data.splice(index,1);
      }
    })
    return data;
  }

  /**
   * 详情
   * @param data
   * @param index
   */
  showDetail(data:any,index:any){

    this.tplModal = this.nm.create({
      nzTitle: this.tplTitle,
      nzContent: this.tplContent,
      nzFooter: this.tplFooter,
      nzWidth: '30%',
      nzMaskClosable: false,
      nzClosable: true
    });

    this.getList3({page:1,length:this.pageSize3,city:data.city});

  }

  /**
   * 弹窗取消
   */
  handleCancel():void{
    this.tplModal.destroy();
    console.log(this.tempParamDetail);
  }

  /**
   * 导入弹窗确定
   */
  importConfirm():void{
    this.tplModal.destroy();
    this.tempParamSave.forEach(item =>{
      if(item.city === this.tempCity){
       item.detailList = this.tempParamDetail;
      }
    })

  }


  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.listSearch({ page: page, length: this.pageSize1 });
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize1 = pageSize;
    this.listSearch({ page: 1, length: this.pageSize1 });
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.getList2({ page: page, length: this.pageSize2 });
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.pageSize2 = pageSize;
    this.getList2({ page: 1, length: this.pageSize2 });
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex3(page: any): void {
    this.getList3({ page: page, length: this.pageSize3,city:this.tempSearchParam3.city });
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize3(pageSize: any): void {
    this.pageSize3 = pageSize;
    this.getList3({ page: 1, length: this.pageSize3,city:this.tempSearchParam3.city });
  }

  /*
  *   把NaN变为0
  */
  isNotANumber(data: any) {
    if (parseFloat(data).toString() == 'NaN') {
      return 0;
    } else {
      return data;
    }
  }
  /*
  *    改变车数同时改变总车数
  */
  modelChange(data:any){
    let i:any;
    let j:any;
    let arrKey:any=[]
    this.dataSet2.forEach(item=> {

      item.大载车数量=0;
      item.标载车数量=0;
      arrKey = this.getObjectKey(item);
      arrKey = this.arrayDelete(arrKey, ['大载车数量', '标载车数量']);
      arrKey.forEach(ele=>{
        if ( ele.indexOf("大载车数量") >= 0) {

          item.大载车数量+=Number(this.isNotANumber(item[ele]))

        }else if(ele.indexOf("标载车数量") >= 0 ){


          item.标载车数量+=Number(this.isNotANumber(item[ele]))

        }
      })

    })
    this.dataSet2=[...this.dataSet2];
  }
  searchDataReturn(data:any){
    let myData = new Date();
    console.log(1111)
    let b =data.filter(x=>x.parameter==='cargoDate')
    b[0].value1 = myData.toLocaleDateString();
    console.log(data);
    this.searhData = data;
  }
}
