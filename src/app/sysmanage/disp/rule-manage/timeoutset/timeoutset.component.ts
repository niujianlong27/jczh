import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DISPURL } from '../../../../common/model/dispUrl';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import { Utils } from '../../../../common/util/utils';
import { Data } from '@angular/router';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
@Component({
  selector: 'app-timeoutset',
  templateUrl: './timeoutset.component.html',
  styleUrls: ['./timeoutset.component.css']
})
export class TimeoutsetComponent implements OnInit {
    isTrue:boolean;//点击修改时,能否修改
    isShow:boolean;//状态是否隐藏

    // 数据弹出框
    modalFormVisible = false; // 新增弹窗
    modalTitle: string; // 弹出框标题

    modalValidateForm: FormGroup;//新增代码集弹窗

    searchData: any;  //存储查询的数据
    tplModal: NzModalRef;//操作成功后弹窗属性

    // 页数控制
    pageSize:number = 30;//条数
    totalPage:number;//数据总条数

    listLoading:boolean = true;// 表单加载状态
    dataSet: Array<any> = []; // 表单数据
    selectedData:Array<any> = []; // 选中的数据
    validateForm: FormGroup;
    total:number; // 总数据条数
    tempSearchParam:any;

    private rowid: number;
    private status: string;
    extraTime:string;
    dealCount:string;

    status1:any;
    gateName1:any;
    dealType1:any;
    btnUpdateShow:boolean = false;
    isOkLoading:boolean =false;//加载

    themArrData:any={};
    param: any = {};

    secondList:Array<any> = [];//品种二级下拉列表
    expandKeys = ['100', '1001'];
    nodes = [
     
    ];
  constructor(private http: HttpUtilService, private nm: NzModalService,private fb: FormBuilder,private msg: NzMessageService,private modalService: NzModalService,private info: UserinfoService) { }

  modalFormData: Array<any> = [
      {name: '分类名称', eName:'kindCode', type: 'select',validateCon: '请输入分类名称',require:true, 
        validators:{
          require: true,
          pattern:false,
        
        }
     },

      {name: '进厂大门', eName:'gateName1', type: 'select', validateCon: '请输入进厂大门',require:true,
        validators:{
          require: true,
          pattern:false,
        
        }
      },

      {name: '超时时长(分)', eName:'timeout', type: 'num', validateCon: '请输入超时处理方式',require:true,
        validators:{
          require: true,
          pattern:false,
        
        }
      },
      // {name: '状态', eName:'status1', type: 'select', validateCon: '请输入状态',
      //   validators:{
      //     require: true,
      //     pattern:false,
      //   }
      // },
      {name: '超时处理方式', eName:'dealType1', type: 'select', validateCon: '请输入超时处理方式',require:true,
        validators:{
          require: true,
          pattern:false,
        
        }
      },

      {name: '顺延时长(分)', eName: 'extraTime', type: 'num', validateCon: '请输入顺延时长', require: true,
        validators:{
          require: true,
          pattern:false,
        }
      },

      {name: '顺延次数', eName: 'dealCount', type: 'num', validateCon: '顺延次数', require: true,
        validators:{
          require: true,
          pattern:false,
        }
      },


  ];

  modalFormData1: Array<any> = Utils.deepCopy(this.modalFormData);//把modalFormData复制给modalFormData1


//查询
// 列表查询数据获取
getListSearch(data: any):void {
  const params = { url: '', data: { }, method: 'POST' };
    params.url = DISPURL.GETTIMEOUTLIST;//查询集合或者对象 
    data.enterpriseId=this.info.APPINFO.USER.companyId;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          if(res.data.data){
            this.dataSet = res.data.data.data;
            this.totalPage = res.data.data.total;
          }else{
            this.dataSet = [];
          }
        }
      }
    ); 
}

    // 列表查询
  listSearch(data:any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }

  onChange($event: string): void {
    console.log($event);
  }


  ngOnInit() {
    this.getallCodest();//小代码刷新显示
    this.listSearch({ page: 1, length: this.pageSize });

    //数据弹出框初始化
    this.modalValidateForm = this.fb.group({});

    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    
    }
    
  }

  //下拉选择,"顺延时长"多弹出俩个字段;"取消排队"不弹
  modelChange(val:any){
    var arrayObj = new Array();
    arrayObj= Utils.deepCopy(this.modalFormData1);
    if(val=='TO02'){
      this.modalFormData= Utils.deepCopy(arrayObj);
      
      // this.modalFormData=this.modalFormData.slice(0,7);
      this.modalFormData=this.modalFormData.slice(0,6);

    }else if(val=='TO01'){
      this.modalFormData=arrayObj;

      // let deleArr = [...arrayObj.slice(5,7)]
      let deleArr = [...arrayObj.slice(4,6)]

      // this.modalFormData=this.modalFormData.slice(0,5);
      this.modalFormData=this.modalFormData.slice(0,4);
      deleArr.map( (data:any) => {
        this.modalValidateForm.setControl(data.eName,null);
      })
    }
    
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts:Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '',validatorOrOpts
      ));
    }
  
  }

  //小代码选择
  themeArrJ:Array<any>=[];//进场大门小代码下拉列表
  themeArrC:Array<any>=[];//超时处理方式小代码下拉列表
  themeArrZ:Array<any>=[];//状态小代码下拉列表
  kindList:Array<any>=[];//大品种小代码下拉列表

  getallCodest(): void {
    //下拉框
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId
    }).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {

            //进场大门
            if (element.codesetCode == 'PZKRCDM') {
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              this.themeArrJ.push(item)
            }

             //超时处理方式
             if (element.codesetCode == 'CSCL') {
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              this.themeArrC.push(item)
            }

             //数据状态
             if (element.codesetCode == 'disp.status') {
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              this.themeArrZ.push(item)
            }

            if (element.codesetCode == 'XXPZ') {
              this.kindList.push(element);
            }
          });
        }
        this.nodes = [];
        this.kindList.forEach(element => {
          if(element.remark==='YL'){
            this.nodes.push({
              title   : element.itemCname,
              key     : element.itemCode,
              children: [ ]
            });
          }
          if(element.remark==='CP'){
            this.nodes.push({
              title   : element.itemCname,
              key     : element.itemCode,
              isLeaf  : true
            });
          }
          //console.log(element);
        });

        this.getSecondKind();
      }   
    )
  }

  //获取二级品种代码
  getSecondKind(): void {
    this.http.post(DISPURL.GETSECONDkIND, {enterpriseId:this.info.APPINFO.USER.companyId
    }).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            this.secondList.push(element);
          });
        }
        console.log(this.nodes);
        this.nodes.forEach(element => {
          this.secondList.forEach(secondElement => {
            if(element.key===secondElement.kindCode){
              //debugger
              element.children.push(
                {
                  title   : secondElement.matKindName,
                  key     : secondElement.matKindCode,
                  isLeaf: true
                }
              );
            }

          });
          
        });
        
        this.nodes = [...this.nodes];
       // this.nodes.push({title: "废钢1", key: "FG", children:[]})
      }
    )
  }

  
  //新增
  //新增弹框
  themeArrF:Array<any>;//分类名称小代码下拉列表
  btnAdd(data?:any): void {
    this.modalFormVisible = true;
    this.modalTitle = '基本信息 > 新增';
    console.log(this.nodes);
    this.status = 'add';

    this.isShow=false;//不展示
    this.isTrue=false;//可填
    this.btnUpdateShow = false;
   
    // const params1 = {url: '', data: {}, method: 'POST'};
    // params1.url = DISPURL.GETMATKIND;//点击新增时,下拉选框"分类名称"动态显示出来
    // params1.data =data || {};

    // this.http.request(params1).then(
    //     (res: any) => {
    //       if (res.success) { 
    //       this.themeArrF = res.data.data;
    //     } 
    //   }
    // )
  }

  middle1:string;
  middle2:string;

  //新增方法
  addData(data?: any) {
    const params = {url: '', data: {kindName:'',kindCode:'',gateName1:'',timeout:'',dealType1:'',extraTime:'',dealCount:''}, method: 'POST'};

    this.modalValidateForm.value.enterpriseId =this.info.APPINFO.USER.companyId ;
    // this.modalValidateForm.value.recRevisor = this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
    this.modalValidateForm.value.recRevisor = this.info.APPINFO.USER.name;

    //data.gateName = this.gateName1;
    this.themeArrJ.forEach(element => {
      if(element.itemCode===data.gateName1){
        data.gateName=element.itemCname;
        data.gateCode=element.itemCode;
      }
    });

    //data.dealType = this.dealType1;
    data.dealType = data.dealType1;//只有"dealType"字段

    params.url = DISPURL.INSERTTIMEOUTLIST;//新增
    
    //let k = this.themeArrF.filter((x:any)=> x.matKindCode == data.kindCode);//输入分类名称时,分类编码自动显示出来

    // if(k.length > 0){
    //   data.kindName = k[0].matKindName;
    // }
    this.kindList.forEach(element => {
      if(element.itemCode===data.kindCode){//添加群发数据时把kindName值也带过去
        data.kindName=element.itemCname;
      }
    });
    this.secondList.forEach(element => {
      if(element.matKindCode===data.kindCode){//添加群发数据时把matKindName值也带过去
        data.kindName=element.matKindName;
      }
    });
    data.enterpriseId=this.info.APPINFO.USER.companyId;
    params.data = data;
    
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.modalFormVisible = false;

          //保存信息成功后弹窗
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增成功'
          }); 
          this.destroyTplModal();

          this.isOkLoading = false;
          //新增后查询
          this.listSearch(params);        
        } else {
          this.isOkLoading = false;//新增失败不加载
        }
      }
    ) 
  }



  //作废
  data1:any;
  //作废时选中的id
  updateDataResult(data:any):void {
    //console.log(data);
    this.data1 = data;
  }

  //作废
  showConfirm(): void {
    if (this.data1[0].statusName == "作废") {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '此信息已作废,不可操作!'
      });
      this.destroyTplModal();
      return;
    }

    this.modalService.confirm({
      nzTitle: '提示信息',
      nzContent: '确定要作废此条记录?',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk:()=>{          
        const params = { url: '', data: this.data1[0], method: 'POST' };
        
        this.data1[0].enterpriseId =this.info.APPINFO.USER.companyId ;
        // this.data1[0].recRevisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
        this.data1[0].recRevisor=this.info.APPINFO.USER.name;
        this.data1[0].enterpriseId=this.info.APPINFO.USER.companyId;
        params.url = DISPURL.DELETETIMEOUTLIST;//作废
        
        params.data =this.data1[0];
        console.log("params.data:"+params.data)

        this.http.request(params).then(
          (res: any) => {
            if (res.success) {
              this.listLoading = false;
              //修改信息成功后弹窗
              this.tplModal = this.nm.info({
                nzTitle: '提示信息',
                nzContent: '作废成功'          
              });
              this.destroyTplModal();

              //修改后查询
              this.listSearch(params);
            }else{
              this.listLoading = false;
            }
          }
        );
      }
    });
  }


  //作废
  delete(data: any) {
    //作废前判断
    if (data.data.length < 1) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请选中一条数据后进行作废!'
      });
      return;
    }
    //作废方法
    this.showConfirm();
  }


// 修改
btnUpdate(data:any): void {

//   const params1 = {url: '', data: {}, method: 'POST'};
//   params1.url = DISPURL.GETMATKIND;//点击新增时,下拉选框"分类名称"动态显示出来
//   params1.data =data || {};

//   this.http.request(params1).then(
//     (res: any) => {
//       if (res.success) { 
//       this.themeArrF = res.data.data;
//     } 
//   }
// )

  if(data.data.length <1){
    this.tplModal = this.nm.info({
      nzTitle: '提示信息',
      nzContent: '请选中一条数据后进行修改!'
    });
    return;
  }

  this.isShow=true;//显示
  this.isTrue=true;//不可填
  this.btnUpdateShow = true;
  this.modalFormVisible = true;
  this.modalTitle = '基本信息 > 修改';
  this.status = 'update';
  //this.rowid = data.data[0].rowid; 

  this.themeArrZ.forEach(element => {
    if(element.itemCname===data.data[0].statusName){
     this.status1=element.itemCode;
    // this.modalValidateForm.get('status1').setValue(element.itemCode);
    }
  })

    if(data.data.length>=1){
      this.param.rowid=data.data[0].rowid;
    }
    this.param.enterpriseId=this.info.APPINFO.USER.companyId;

    this.http.post(DISPURL.GETTIMEOUTLIST, this.param).then(
      (res:any) => {
        if(res.success){
          this.themArrData = res.data.data.data;
        }
        this.rowid = data.data[0].rowid;
        this.modalValidateForm.patchValue(this.themArrData[0]);//将信息显示到弹出窗内
      }
    );

    
  // this.modalValidateForm.patchValue(data.data[0]);//将信息显示到弹出窗内
   

  //入厂大门
  let gateName:string;
   this.themeArrJ.forEach(element => {
    if(element.itemCname===data.data[0].gateName){
      gateName = element.itemCode;
    }
  })
   this.modalValidateForm.get('gateName1').setValue(gateName);

   //超时处理方式
   let dealType:string;
   this.themeArrC.forEach(element => {
    if(element.itemCname===data.data[0].dealTypeName){
    //  dealType=element.itemCode;
      this.modalValidateForm.get('dealType1').setValue(element.itemCode);
    }
  })
  
}


  //修改
  //修改方法
   updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};

    data.enterpriseId =this.info.APPINFO.USER.companyId ;
    // data.recRevisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
    data.recRevisor=this.info.APPINFO.USER.name;

    console.log("dealType:"+data.dealType);

    params.url = DISPURL.UPDATETIMEOUTLIST;

    data.rowid = this.rowid;
    data.status = this.status1;
    // this.themeArrZ.forEach(element => {
    //   if(element.itemCode===data.status1){
    //     data.statusName=element.itemCname;
    //     data.status=element.itemCode;
    //     console.log(data.status,data.status1,data.statusName)//ST00  ST00  作废
    //   }
    // });

    //data.gateName = this.gateName1;
    this.themeArrJ.forEach(element => {
      if(element.itemCode===data.gateName1){
        data.gateName=element.itemCname;
        data.gateCode=element.itemCode;
      }
    });

    //data.dealType = this.dealType1;
    data.dealType = data.dealType1;
  
    data.extraTime = data.dealType == '取消排队'?null: data.extraTime;
    data.dealCount = data.dealType == '取消排队'?null: data.dealCount;

    console.log("data.extraTime:"+data.extraTime)
    console.log("data.dealCount:"+data.dealCount)
    data.enterpriseId=this.info.APPINFO.USER.companyId;
    params.data =data;

    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
         
          //修改信息成功后弹窗
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '修改成功'
          }); 
          this.destroyTplModal();

          this.isOkLoading = false;
          // //新增后查询
          // this.listSearch(params);        
        } else {
          this.isOkLoading = false;
        }
      }
    ) 
  }


  

  // 数据弹出框相关
  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[ i ].markAsDirty();
    }
    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.isOkLoading = true;
      for(let i=0;i<this.dataSet.length;i++){
        // console.log(this.modalValidateForm.value.kindCode)//填入的
        // console.log(this.dataSet[i].kindCode)//查询的
        // console.log(this.modalValidateForm.value.gateName1)//查询的
        // console.log(this.dataSet[i].gateCode)//查询的
        if((this.dataSet[i].kindCode == this.modalValidateForm.value.kindCode)&&(this.dataSet[i].gateCode == this.modalValidateForm.value.gateName1 )){
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增失败!"分类名称,进场大门配置"重复!'
          });
          this.isOkLoading = false;
        }
      }
    
      this.addData(this.modalValidateForm.value);
    }

    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[ i ].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.isOkLoading = true;
      // for(let i=0;i<this.dataSet.length;i++){
      //   if((this.dataSet[i].kindCode == this.modalValidateForm.value.kindCode)&&(this.dataSet[i].gateCode == this.modalValidateForm.value.gateName1 )){
      //     this.tplModal = this.nm.info({
      //       nzTitle: '提示信息',
      //       nzContent: '修改失败!"分类名称,进场大门配置"重复!'
      //     });           
      //     return;         
      //   }
      // }

      this.updateData(this.modalValidateForm.value);
    }
  }


  // 数据弹出框取消
  handleCancel(): void {
    this.modalFormVisible = false;
  }

  // 数据弹出框取消
  closeResult(): void{
    this.modalValidateForm.reset();
  }

  
  //提示弹窗自动关闭
  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

}
