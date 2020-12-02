import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GlobalService } from 'src/app/common/services/global-service.service';
@Component({
  selector: 'app-rulecars',
  templateUrl: './rulecars.component.html',
  styleUrls: ['./rulecars.component.css']
})
export class RulecarsComponent implements OnInit {
  tabs: Array<any> = [];
  searchData: any;  //存储查询的数据
  inqu: any = {};
  modalTitle:String;
  listLoading: boolean = false;
  formId:String;
  dataSet: any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  pageNUm:number;//当前页面序号
  //carNum: number = 0;
  kindNameArr: Array<any> = [];
  nodes:Array<any> = [];
  matArr:Array<any> = [];
  subArr:Array<any> = [];
  gateArr:Array<any> = [];
  warehouseArr:Array<any> = [];
 // hidden:{[key:number]:any} = {};//保存取消按钮
  isOkLoading:boolean=false;

  deleteVisible: boolean = false;//删除弹框
  deletemodaltitle: string;//弹框的标题
  finishCon: string;//弹窗文字内容
  deleteId:string;

  UpdateArr:Array<any>=[];
  saveFlag:boolean=true;
  buttonArr: any[] = [];
  tabsArr: any[] = [];

  ruleType:number;

  warehouseCode:String;
  warehouseName:String;
  modalFormData: Array<any> = [];
  tplModal: NzModalRef;//操作成功后弹窗属性
  modalValidateForm: FormGroup;//新增代码集弹窗
  InsertFormVisible:boolean=false;//新增弹框
  kindCode:String;
  kindName:String;
  queueArr: Array<any> = [];
  qeueClass:String;
  truckArr:Array<any> = [];
  subKindCode:String;
  subKindName:String;
  maxCount:number;
  truckKind:String;
  truckKindName:String;
  gateNames:String;
  gateCodes:String;
  modalFormData1: Array<any> = [
    {name: '品种名称', eName:'kindCode', type: 'select',validateCon: '请输入品种名称',require:true, 
      validators:{
        require: true,
        pattern:false,
      }
   },
    {name: '车辆最大数', eName:'maxCount', type: 'number', validateCon: '请输入车辆最大数',require:true,
      validators:{
        require: true,
        pattern:false,
      }
    }
];

modalFormData2: Array<any> = [
  {name: '进厂大门', eName:'gateCode', type: 'select',validateCon: '请输入进厂大门',require:true, 
    validators:{
      require: true,
      pattern:false,
    }
 },
  {name: '车辆最大数', eName:'maxCount', type: 'number', validateCon: '请输入车辆最大数',require:true,
    validators:{
      require: true,
      pattern:false,
    }
  }
];


modalFormData3: Array<any> = [
  {name: '进厂大门', eName:'gateCode', type: 'select',validateCon: '请输入进厂大门',require:true, 
    validators:{
      require: true,
      pattern:false,
    }
 },
 {name: '品种名称', eName:'kindCode', type: 'select',validateCon: '请输入品种名称',require:true, 
      validators:{
        require: true,
        pattern:false,
      }
   },
  {name: '车辆最大数', eName:'maxCount', type: 'number', validateCon: '请输入车辆最大数',require:true,
    validators:{
      require: true,
      pattern:false,
    }
  }
];


modalFormData4: Array<any> = [
  {name: '仓库名称', eName:'warehouseCode', type: 'select',validateCon: '请输入仓库名称',require:true, 
    validators:{
      require: true,
      pattern:false,
    }
 },
  {name: '车辆最大数', eName:'maxCount', type: 'number', validateCon: '请输入车辆最大数',require:true,
    validators:{
      require: true,
      pattern:false,
    }
  }
];
  

  constructor(private fb: FormBuilder, private modal: NzModalService, private http: HttpUtilService, private info: UserinfoService,private nm: NzModalService,private globalSer: GlobalService) { 
    
  }

  ngOnInit() {

    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData1;//初始化第一个tab页
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    
    }

    
    this.getallCodest();
    this.inqu.ruleType=this.tabs[0].ruleType;
    this.query();
    //console.log('123456')
    //this.listSearch({ page: 1, length: this.pageSize });
    // this.inqu.ruleType=this.tabs[0].ruleType;
    // this.query();
  }
  // query(){
    
  //    this.getListSearch();
  // }

//   pageSizeEmit(data:number){
//     console.log(data);
//     this.pageSize=data;
//  }
//  pageIndexEmit(data:number){
//    console.log(data);
//    this.pageNUm=data;
//    this.query();
//  }

pageSizeEmit(data:number){
  console.log(data);
  this.pageSize=data;
}
pageIndexEmit(data:number){
 console.log(data);
 this.pageNUm=data;
 this.inqu.page=this.pageNUm;
 this.inqu.length = this.pageSize;
 //this.inqu.page=this.
 this.getListSearch();
}

    // 获取表头
    getallCodest(): void {
      this.tabs.push({itemCname:'厂内车辆上限设置',itemCode:'FactoryCars',formId:'form_rgDisp_rulecars0',ruleType:1});
      this.tabs.push({itemCname:'厂内品种车辆上限设置',itemCode:'FactoryKind',formId:'form_rgDisp_rulecars1',ruleType:2});
      this.tabs.push({itemCname:'大门在途车辆上限设置',itemCode:'GateCars',formId:'form_rgDisp_rulecars2',ruleType:5});
      this.tabs.push({itemCname:'大门品种在途车辆上限设置',itemCode:'GateKind',formId:'form_rgDisp_rulecars3',ruleType:3});
      this.tabs.push({itemCname:'仓库同时卸车上限设置',itemCode:'WarehouseCars',formId:'form_rgDisp_rulecars4',ruleType:4});
      this.http.post(RGDISPURL.MATKINDGETALL,{}).then(
        (res: any) => {
          if (res.success) {
           console.log(res.data.data)
            res.data.data.forEach(element => {
              const ite: any = {};
              ite.itemCname = element.matKindName;
              ite.itemCode = element.matKindCode;
              this.kindNameArr.push(ite);
                //排队大类名称
                 if(element.matKindCode.length == 3){
                  this.nodes.push({
                    title   : element.matKindName,
                    key     : element.matKindCode,
                    children: [ ]
                  });
                 }else if(element.matKindCode.length == 5){
                   this.matArr.push(element);
                 }else{
                   this.subArr.push(element);
                 }
                
            });
            this.nodes.forEach(element => {
              this.matArr.forEach(secondElement => {
                if(secondElement.matKindCode.slice(0,3) === element.key){
                  element.children.push(
                    {
                      title   : secondElement.matKindName,
                      key     : secondElement.matKindCode,
                      children: [ ]
                    }
                  );
                }
              })
             })
          
             console.log(this.nodes)
             this.nodes.forEach(element => {
               element.children.forEach(ele =>{
                this.subArr.forEach(secondElement => {
                  if(secondElement.matKindCode.slice(0,5) == ele.key){
                    ele.children.push(
                      {
                        title   : secondElement.matKindName,
                        key     : secondElement.matKindCode,
                        isLeaf: true
                      }
                    );
                  }
                })
               })
             })
          }
        }   
      )


      
    this.http.post(RGDISPURL.GETCODESET,{'codesetCode':'disp.gate'}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
            //排队大类名称
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              this.gateArr.push(item);
              //console.log( this.queueArr)
          });
        }
      }   
    )

    this.http.post(RGDISPURL.GETWAREHOUSE,{}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(element => {
              const item: any = {};
              item.itemCname = element.label;
              item.itemCode = element.value;
              this.warehouseArr.push(item);
          });
        }
      }  
    )


  
    }

    query() { //查询厂内车辆上限
      this.saveFlag=true;
      this.UpdateArr=[];
      this.inqu.page = 1; //最好有
      this.pageNUm=1;
      this.inqu.length = this.pageSize || 30;//最好有
      this.globalSer.pageNumEmitter.emit({
        formId: this.formId,
        gridId: 'grid1',
        length: this.inqu.length,
        page: 1,
        search: true
      });
      // switch(this.carNum){
      //   case 0:
      //     this.inqu.ruleType=1;
      //     break;
      //     case 1:
      //       this.inqu.ruleType=2;
      //       break;
      //       case 2:
      //         this.inqu.ruleType=5;
      //         break;
      //         case 3:
      //           this.inqu.ruleType=3;
      //           break;
      //           case 4:
      //             this.inqu.ruleType=4;
      //             break;
      // }
     // console.log(this.carNum);
      this.getListSearch();
    }

    //修改方法
    saveData(data,flag=null){
      
     
      data.revisor =this.info.APPINFO.USER.name;
      if(data.status == '' || data.status == null || data.maxCount =='' || data.maxCount == null){
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请把信息填写完整'          
        });
       // this.query();
        return;
      }
    //  this.hidden[flag] = false;
      data.editstate = 0;
      if(data.status == '启用'){
        data.status = 'RCWH10'
      }else if(data.status == '启用'){
        data.status = 'RCWH20'
      }
       // data.status == '启用' ? data.status = 'RCWH10' : data.status = 'RCWH20';
        console.log(data.status);
        this.http.post(RGDISPURL.ENTRYRULEUPDATE, data).then(
          (res: any) => {
            if (res.success) {
              this.dataSet = res.data.data.data;
              this.totalPage = res.data.data.total;
              this.tplModal = this.nm.info({
                nzTitle: '提示信息',
                nzContent: '修改成功'          
              });
             this.query();
            }
          }
        )
    }

    
    //页面查询
    getListSearch(){
     // console.log({data});
     this.listLoading=true;
       this.http.post(RGDISPURL.ENTRYRULEGETRECORDS, this.inqu).then(
        (res: any) => {
          if (res.success) {
            this.listLoading=false;
            this.dataSet = res.data.data.data;
            this.totalPage = res.data.data.total;
            this.dataSet.map(x => x.editstate = 0);
            //10是启用  20作废
            this.dataSet.map(x => x.status == 'RCWH10'? x.status='启用': x.status='作废');
          }
        }
      )
      this.listLoading=false;
    }


    selectChange(data:any): void {
    this.inqu.gateCode=undefined;
    this.inqu.kindCode=undefined;
    this.inqu.warehouseCode=undefined;
    this.inqu.status=undefined;
    this.formId=data.formId;
    this.removeController();//先移除所有控制器
    if(data.itemCode==='FactoryKind'){
      this.modalFormData = this.modalFormData1;
    }
    else if(data.itemCode==='GateCars'){
      this.modalFormData = this.modalFormData2;
    }else if(data.itemCode==='GateKind'){
      this.modalFormData = this.modalFormData3;
    }else if(data.itemCode==='WarehouseCars'){
      this.modalFormData = this.modalFormData4;
    }
    // this.query();
    for (let i = 0; i < this.modalFormData.length; i++) {//重新再加入新控制器
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));

    }
      // this.listSearch({ page: 1, length: this.pageSize });
     this.inqu.ruleType=data.ruleType;
     this.query();


    }

            //移除所有控制器
  removeController(): void {
    this.modalValidateForm.removeControl('kindCode');
    this.modalValidateForm.removeControl('maxCount');
    this.modalValidateForm.removeControl('gateCode');
    this.modalValidateForm.removeControl('warehouseCode');
  }

  addData(){
      
     
    this.InsertFormVisible = true;

}

    // 数据弹出框取消
closeResult(): void{
  
    this.modalValidateForm.reset();
 
      
    }

     // 数据弹出框取消
handleCancel(): void {

    this.InsertFormVisible = false;
 
  }

  //新增方法确认
  handleOk(){
    // console.log(this.modalValidateForm.getRawValue())
    // console.log(this.kindCode);
    var data: any = {};
    data.kindCode=this.kindCode;
    data.kindName=this.kindName;
    data.gateCode=this.gateCodes;
    data.gateName=this.gateNames;
    data.maxCount=this.maxCount;
    data.warehouseCode=this.warehouseCode;
    data.warehouseName=this.warehouseName;
    data.revisor =this.info.APPINFO.USER.name;
    data.status='RCWH10';

    // for(let i=0;i< this.dataSet.length;i++){
    //   if(data.kindCode == this.dataSet[i].kindCode){
    //     this.tplModal = this.nm.warning({
    //       nzTitle: '提示信息',
    //       nzContent: '品种已存在，请确认后新增'          
    //     });
    //     return;
    //   }
    //   if(data.gateCode == this.dataSet[i].gateCode){
    //     this.tplModal = this.nm.warning({
    //       nzTitle: '提示信息',
    //       nzContent: '品种已存在，请确认后新增'          
    //     });
    //     return;
    //   }
    //   if(data.gateCode == this.dataSet[i].gateCode){
    //     this.tplModal = this.nm.warning({
    //       nzTitle: '提示信息',
    //       nzContent: '品种已存在，请确认后新增'          
    //     });
    //     return;
    //   }
   // }
    switch(this.inqu.ruleType){
      case 1:
        data.ruleType=1;
        break;
        case 2:
          data.ruleType=2;
          if(data.kindCode == '' || data.kindCode == undefined || data.maxCount =='' || data.maxCount ==undefined){
            this.tplModal = this.nm.warning({
              nzTitle: '提示信息',
              nzContent: '请把信息填写完整'          
            });
            return;
          }
         for(var i=0;i<this.dataSet.length;i++){
           if(this.dataSet[i].kindName == data.kindName){
            this.tplModal = this.nm.warning({
              nzTitle: '提示信息',
              nzContent: '品种已存在，请确认后再新增'          
            });
            return;
           }
         }
          break;
          case 5:
            data.ruleType=5;
            if(data.gateCode == '' || data.gateCode == undefined || data.maxCount =='' || data.maxCount ==undefined){
              this.tplModal = this.nm.warning({
                nzTitle: '提示信息',
                nzContent: '请把信息填写完整'          
              });
              return;
            }
            for(var i=0;i<this.dataSet.length;i++){
              if(this.dataSet[i].gateCode == data.gateCode){
               this.tplModal = this.nm.warning({
                 nzTitle: '提示信息',
                 nzContent: '此大门车辆数已存在，请确认后再新增'          
               });
               return;
              }
            }
            break;
            case 3:
              data.ruleType=3;
              console.log(data.gateCode+''+data.maxCount+''+data.kindCode)
              if(data.gateCode == '' || data.gateCode == undefined || data.maxCount =='' || data.maxCount ==undefined || data.kindCode == '' || data.kindCode == undefined){
                this.tplModal = this.nm.warning({
                  nzTitle: '提示信息',
                  nzContent: '请把信息填写完整'          
                });
                return;
              }
              for(var i=0;i<this.dataSet.length;i++){
                if(this.dataSet[i].gateCode == data.gateCode && this.dataSet[i].kindCode == data.kindCode){
                 this.tplModal = this.nm.warning({
                   nzTitle: '提示信息',
                   nzContent: '此大门对应的品种车辆数已存在，请确认后再新增'          
                 });
                 return;
                }
              }
              break;
              case 4:
                  if(data.warehouseCode == '' || data.warehouseCode == undefined || data.maxCount =='' || data.maxCount ==undefined){
                    this.tplModal = this.nm.warning({
                      nzTitle: '提示信息',
                      nzContent: '请把信息填写完整'          
                    });
                    return;
                  }
                  for(var i=0;i<this.dataSet.length;i++){
                    if(this.dataSet[i].warehouseCode == data.warehouseCode){
                     this.tplModal = this.nm.warning({
                       nzTitle: '提示信息',
                       nzContent: '此仓库已存在，请确认后再新增'          
                     });
                     return;
                    }
                  }
                data.ruleType=4;
                break;
    }
    this.http.post(RGDISPURL.ENTRYRULEINSERT, data).then(
      (res: any) => {
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增成功'          
          });
         this.query();
         
        }
      }
    )
    this.InsertFormVisible=false;
         this.destroyTplModal();
  }
  
  onChange(data): void {
    console.log(data);
    this.kindCode=data;
    this.kindNameArr.forEach(element => {
      if(this.kindCode == element.itemCode){
        this.kindName = element.itemCname
      }
    });
  }

  gateChange(data){
    console.log(data)
    this.gateCodes=data;
    this.gateArr.forEach(element => {
      if(this.gateCodes == element.itemCode){
        this.gateNames=element.itemCname
      }
    });
    console.log(this.gateNames)
  }

  warehouseChange(data){
    console.log(data)
    this.warehouseCode=data;
    this.warehouseArr.forEach(element => {
      if(this.warehouseCode == element.itemCode){
        this.warehouseName=element.itemCname
      }
    });
    console.log(this.gateNames)
  }

  countChange(data:any){
    this.maxCount=data;
  }


  destroyTplModal(){
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  }

  //修改方法
  update(data){
    if(this.UpdateArr.length==0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后修改'          
      });
      return;
    }
    this.saveFlag=false;
    //this.hidden[flag] = true;
       data.editstate = 1;
    if(this.inqu.ruleType != 1){
      if(data.status=='启用'){
        data.status='RCWH10'
      }else{
        data.status='RCWH20'
      }
    }
    
  }
   //取消保存
   cancle(data,flag=null){
   // this.hidden[flag] = false;
    data.editstate = 0;
    this.query();
  }


  //删除按钮
  deleteBtn(data) {
    if(this.UpdateArr.length==0){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据之后删除'          
      });
      return;
    }
    if(this.UpdateArr[0].status!='作废'){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '只能删除作废的数据'          
      });
      return;
    }
    this.deletemodaltitle = '提示信息';
    this.finishCon = '是否删除此数据';
    this.deleteId=data.id;
    this.deleteVisible = true;
  }
  //删除方法
  deleteData(data) {
    //console.log(data)
    if ('ok' == data.type) {
      this.http.post(RGDISPURL.ENTRYRULEDELETE, {id:this.deleteId}).then(
        (res: any) => {
          if (res.success) {
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '操作成功'
            });
            this.deleteVisible = false;
            this.query();
          }
        }
      )
    }else if('cancel' == data.type){
      console.log('取消')
      this.deleteVisible = false;
    }
  }

  btnClick(data) {
    console.log(data)
    switch (data.buttonId) {
      case 'Add':
        this.addData();
        break;
        case 'Update':
          this.update(this.UpdateArr[0]);
          break;
          case 'Save':
            this.saveData(this.dataSet.filter(x=>x.editstate==1)[0])
            break;
            case 'Delete':
              this.deleteBtn(this.UpdateArr[0]);
              break;
    }
  }

  updateDataResult(data:any){
    this.UpdateArr=data;
  }

  //根据按钮返回的数据决定那tab页面显示
	// btnDataReturn(data: any) {
	// 	console.log(data);
	// 	if (this.buttonArr.length < 1) {
	// 		this.buttonArr.push(data);
	// 		console.log(this.buttonArr);
	// 		for (var i = 0; i < this.tabs.length; i++) {
	// 			for (var j = 0; j < data.length; j++) {
	// 				if (this.tabs[i].itemCode === data[j].buttonId) {
	// 					this.tabsArr.push(this.tabs[i]);
	// 				}
	// 			}
	// 		}
  //     this.tabs = this.tabsArr;
  //     if(this.tabs[0]){
  //       this.inqu.ruleType=this.tabs[0].ruleType;
  //     this.query();
  //     }
	// 	}
	// }

}