import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import { DISPURL } from '../../../../common/model/dispUrl';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-queuerule,nz-demo-select-scroll-load',
  templateUrl: './queuerule.component.html',
  styleUrls: ['./queuerule.component.css']
})


export class QueueruleComponent implements OnInit {
    subKindName:any;
    queueClass1:any;//"品种优先级设置"页面-排队优先级
    gateNames1:any;//"品种可入厂大门"页面-大门
    truckKind1:any;//车型

    status1:any;
    isShow1:boolean;//"品种优先级设置"-状态是否隐藏
    status2:any;
    isShow2:boolean;//"品种可入厂大门"-状态是否隐藏

    isTrue1:boolean;//"品种优先级设置"点击修改时,"分类名称"能否修改
    isTrue2:boolean;//"品种可入厂大门"点击修改时,"辅助分类"能否修改
    isTrue3:boolean;//"品种可入厂大门"点击修改时,"分类名称"能否修改

    isOkLoading:boolean =false;//加载

    carNum:number=0;//tab下标控制

    // 确认框
    modalTitle: string; // 弹出框标题
    deleteCon: string;
    deleteVisible = false; // 确认弹窗

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
    searchData: any;  //存储查询的数据

    // 数据弹出框
    modalValidateForm: FormGroup;//新增-弹窗(品种优先级设置)
    modalFormVisible = false; // 弹窗可视否
    modalValidateForm2: FormGroup;//新增-弹窗(品种可入厂大门)
    modalFormVisible2 = false; // 弹窗可视否
       
   // private rowId: number;
    private rowid: number;
    private status: string ;

    themArrData:any={};
    param: any = {};

    themArrData2:any={};
    param2: any = {};

  constructor(private http: HttpUtilService, private nm: NzModalService,private fb: FormBuilder,private msg: NzMessageService,private modalService: NzModalService,private info: UserinfoService) { }

  modalFormData: Array<any> = [
    
    {name: '分类名称', eName:'kindCode', type: 'select', validateCon: '请输入分类名称',require:true, 
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '排队优先级', eName:'queueClass1', type: 'select', validateCon: '请输入排队优先级',require:true, 
      validators:{
        require: true,
        pattern:false,
       
      }
    },
    {name: '状态', eName:'status1', type: 'select', validateCon: '请输入状态',require:true, 
      validators:{
        require: true,
        pattern:false,
       
      }
    }

];
modalFormData2: Array<any> = [
    
  {name: '分类名称', eName:'kindCode', type: 'select', validateCon: '请输入分类名称',require:true,
    validators:{
      require: true,
      pattern:false,
    }
  },
  
  {name: '可进厂大门名称', eName:'gateNames1', type: 'select', validateCon: '请输入可进厂大门名称',require:true,
    validators:{
      require: true,
      pattern:false,
    }
  },
  {name: '车型', eName:'truckKind1', type: 'select', validateCon: '请输入车型',require:true,
    validators:{
      require: true,
      pattern:false,
    }
  },
  {name: '状态', eName:'status2', type: 'select', validateCon: '请输入状态',require:true, 
      validators:{
        require: true,
        pattern:false,
       
      }
  }
    
];

onChange($event: string): void {
  console.log($event);
}

getListSearch(url: string, param: any): void { //获取列表
  this.listLoading = true;
  this.http.post(url, param).then((res: any) => {
    this.listLoading = false;
    if (res.success) {
      this.dataSet = res.data.data.data;
      this.totalPage = res.data.data.total;
    }
  })
}

  // 列表查询--"品种优先级设置"
  listSearch(data:any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.enterpriseId=this.info.APPINFO.USER.companyId;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(DISPURL.GETQUEUERULECLASSLIST, data);
  }
  // 列表查询--"品种可入厂大门"
  listSearch1(data:any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(DISPURL.GETQUEUERULEGATESLIST, data);
  }


  //当tab页改变时自动查询当前页面的数据
  selectChange(): void {
    if (this.carNum === 0) {
      this.listSearch({ page: 1, length: this.pageSize });// 列表查询--"品种优先级设置"
    } else if (this.carNum === 1) {
      this.listSearch1({ page: 1, length: this.pageSize });//列表查询--"品种可入厂大门"
    } 

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
  }


 

ngOnInit() {
  this.getallCodest();//小代码刷新显示
  this.listSearch({ page: 1, length: this.pageSize });

  //数据弹出框初始化
  this.modalValidateForm = this.fb.group({});
  this.modalValidateForm2 = this.fb.group({});

  this.modalFormData = this.modalFormData ? this.modalFormData : [];
  for (let i = 0; i < this.modalFormData.length; i++) {
    let validatorOrOpts: Array<any> = [];
    if (this.modalFormData[i].require)
      validatorOrOpts.push(Validators.required);
    this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
      '', validatorOrOpts
    ));
  }
  this.modalFormData2 = this.modalFormData2 ? this.modalFormData2 : [];
  for (let i = 0; i < this.modalFormData2.length; i++) {
    let validatorOrOpts: Array<any> = [];
    if (this.modalFormData2[i].require)
      validatorOrOpts.push(Validators.required);
    this.modalValidateForm2.addControl(this.modalFormData2[i].eName, new FormControl(
      '', validatorOrOpts
    ));
  }
}


//小代码选择
themeArrJ:Array<any>=[];//进场大门小代码下拉列表
themeArrZ:Array<any>=[];//状态小代码下拉列表
themeArrP:Array<any>=[];//排队优先级小代码下拉列表
themeArrC:Array<any>=[];//车型小代码下拉列表

kindList:Array<any> = [];//品种的下拉列表
secondList:Array<any> = [];//品种二级下拉列表
//树型结构
expandKeys = [ ];
nodes = [ 
  //{
  //   title   : 'parent 1',
  //   key     : '100',
  //   children: [ {
  //     title   : 'parent 1-0',
  //     key     : '1001',
  //     children: [
  //       { title: 'leaf 1-0-0', key: '10010', isLeaf: true },
  //       { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
  //     ]
  //   }, {
  //     title   : 'parent 1-1',
  //     key     : '1002',
  //     children: [
  //       { title: 'leaf 1-1-0', key: '10020', isLeaf: true }
  //     ]
  //   } ]
  // } 
];//存放一级菜单的容器


getallCodest(): void {
  //下拉框
  this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId}).then(
    (res: any) => {
      if (res.success) {
        console.dir(res.data.data)
        res.data.data.forEach(element => {

          //进场大门
          if (element.codesetCode == 'PZKRCDM') {
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.themeArrJ.push(item)
          }

           //数据状态
           if (element.codesetCode == 'disp.status') {
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.themeArrZ.push(item)
          }

           //优先级
           if (element.codesetCode == 'PZYXSZYXJ') {
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.themeArrP.push(item)
          }

           //车型
           if (element.codesetCode == 'PZKRCDMCX') {
            const item: any = {};
            item.itemCname = element.itemCname;
            item.itemCode = element.itemCode;
            this.themeArrC.push(item)
          }

          //树形--一级列表
          if (element.codesetCode == 'XXPZ') {
            this.kindList.push(element);
          }
        });
      
      }

      this.nodes = [];
      this.kindList.forEach(element => {//一级列表:kindList-->nodes[]
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
            isLeaf: true
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
  this.http.post(DISPURL.GETSECONDkIND, {enterpriseId:this.info.APPINFO.USER.companyId  }).then(
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
    }
  )
}



//添加按钮
themeArrF:Array<any>;
btnAdd(data1?:any) : void {
  //"品种优先级设置"页面
  if(this.carNum==0){
    this.modalFormVisible = true;
    this.modalTitle = `品种优先级设置 > 新增`;
    this.status = 'add';

    if(this.modalFormData.length>2){//"状态"新增时,隐藏
      this.modalFormData.pop();
      this.modalValidateForm.removeControl('status1');
    }

    this.isShow1=false;//新增"品种优先级设置"时,没有"状态"字段
    this.isTrue1=false;//新增"品种优先级设置"时,"分类名称"可填
   
    const params1 = {url: '', data: {}, method: 'POST'};
      params1.url = DISPURL.GETMATKIND;//点击新增时,下拉选框"分类名称"动态显示出来
      console.log(data1);
     if(data1 != undefined){
      data1.enterpriseId=this.info.APPINFO.USER.companyId;
     }

      params1.data =data1 || {enterpriseId:this.info.APPINFO.USER.companyId};
      this.http.request(params1).then(
        (res: any) => {
          if (res.success) { 
          this.themeArrF = res.data.data;
        } else {
        }
      }
    ) 
  }
  //"品种可入厂大门"页面
  if(this.carNum==1){
    this.modalFormVisible2 = true;
    this.modalTitle = `品种可入厂大门 > 新增`;
    this.status = 'add';

    if(this.modalFormData2.length>3){//"状态"新增时,隐藏
      this.modalFormData2.pop();
      this.modalValidateForm2.removeControl('status2');
    }

    this.isShow2=false;//新增"品种可入厂大门"时,没有"状态"字段
    this.isTrue2=true;//新增"品种可入厂大门"时,辅助分类不可填
    this.isTrue3=false;//新增"品种可入厂大门"时,"分类名称"可填

      const params2 = {url: '', data: {}, method: 'POST'};
      params2.url = DISPURL.GETMATKIND;//点击新增时,下拉选框"分类名称"动态显示出来
      if(data1 != undefined){
        data1.enterpriseId=this.info.APPINFO.USER.companyId;
       }
      params2.data =data1 || {enterpriseId:this.info.APPINFO.USER.companyId}; 
      this.http.request(params2).then(
      (res: any) => {
        if (res.success) {
          this.themeArrF = res.data.data;    
        } else {
        }
      }
    ) 
  }
}


//新增"品种优先级设置"接口方法
addData1(data?: any) {
  if(this.carNum==0){  
    const params1 = {url: '', data: {kindName:'',kindCode:'',queueClass1:'',ruleType:''}, method: 'POST'};

    this.modalValidateForm.value.enterpriseId =this.info.APPINFO.USER.companyId ;
    // this.modalValidateForm.value.revisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
    this.modalValidateForm.value.revisor=this.info.APPINFO.USER.name;
  
    data.ruleType = 0;//控制"品种优先级"页面查询
    data.queueClass = data.queueClass1;//只有"queueClass"字段
    
    params1.url = DISPURL.INSERTQUEUERULE;
    
    let element = this.themeArrF.filter((x:any)=> x.matKindCode == data.kindCode);//输入分类名称时,分类编码自动显示出来

    if(element.length > 0){
      data.kindName = element[0].matKindName;
    }

    //树
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

    params1.data = data;

    this.http.request(params1).then(
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
          this.listSearch(params1);        
        } else {
          this.isOkLoading = false;
        }
      }
    )  
  }
}

//新增"品种可入厂大门"接口方法
addData(data?: any) {
   if(this.carNum==1){
    const params2 = {url: '', data: {kindName:'',kindCode:'',gateNames1:'',truckKind1:'',ruleType:''}, method: 'POST'};

    this.modalValidateForm2.value.enterpriseId =this.info.APPINFO.USER.companyId ;
    // this.modalValidateForm2.value.revisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
    this.modalValidateForm2.value.revisor=this.info.APPINFO.USER.name;

    data.ruleType = 1;//控制"品种可入厂大门"页面查询
    //data.gateNames = data.gateNames1;
    this.themeArrJ.forEach(element => {
      if(element.itemCode===data.gateNames1){
        data.gateNames=element.itemCname;
        data.gateCodes=element.itemCode;
      }
    });
  
    data.truckKind = data.truckKind1;//只有"truckKind"字段

    params2.url = DISPURL.INSERTQUEUERULE;

    let k = this.themeArrF.filter((x:any)=> x.matKindCode == data.kindCode);//输入分类名称时,分类编码自动显示出来

    if(k.length > 0){
      data.kindName = k[0].matKindName;
    }
    params2.data = data;
    this.http.request(params2).then(
      (res: any) => {
        if (res.success) {
          this.modalFormVisible2 = false;

          //保存信息成功后弹窗
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增成功'
          }); 
          this.destroyTplModal();

          this.isOkLoading = false;

          //新增后查询
          this.listSearch1(params2);        
        } else {
          this.isOkLoading = false;
        }
      }
    ) 

  }
  
}


  //修改
 // 修改按钮
 btnUpdate(data:any): void {

    const params = {url: '', data: {}, method: 'POST'};
    params.url = DISPURL.GETMATKIND;//点击新增时,下拉选框"分类名称"动态显示出来
    if(data != undefined){
      data.enterpriseId=this.info.APPINFO.USER.companyId;
     }

    params.data =data || {enterpriseId:this.info.APPINFO.USER.companyId};

    this.http.request(params).then(
      (res: any) => {
        if (res.success) { 
        this.themeArrF = res.data.data;
      } else {
      }
    }
  ) 

   //"品种优先级设置"页面
  if(this.carNum==0){
      this.isShow1=true;//修改"品种优先级设置"时,有"状态"字段
      this.isTrue1=true;//新增"品种优先级设置"时,"分类名称"不可填

      if(data.data.length <1){
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请选中一条数据后进行修改!'
        });
        return;
      }
      this.modalFormVisible = true;
      this.modalTitle = '品种优先级设置 > 修改';
      this.status = 'update';

      if(this.modalFormData.length>2){
        this.modalFormData.pop();//"状态"修改时,显示
      }
      this.modalFormData.push(
        {name: '状态', eName:'status1', type: 'select', validateCon: '请输入状态',require:true,
          validators:{
            require: true,
            pattern:false,
          }
        },
      );
      //刷新
      for (let i = 0; i < this.modalFormData.length; i++) {
        let validatorOrOpts: Array<any> = [];
        if (this.modalFormData[i].require)
          validatorOrOpts.push(Validators.required);
        this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
          '',validatorOrOpts
        ));
      }

      //this.rowId = data.data[0].rowId;
      
      // console.log(this.status1,data.status,data.status1,data.data[0].status)//u,u,u,"作废"
      this.themeArrZ.forEach(element => {
        if(element.itemCname===data.data[0].statusName){
          //this.status1=element.itemCode;
          this.modalValidateForm.get('status1').setValue(element.itemCode);
          // console.log(this.status1,data.status,data.status1,data.data[0].status)//ST00,u,u,作废
        }
      })


      if(data.data.length>=1){
        this.param.rowid=data.data[0].rowid;
      }
      this.param.enterpriseId=this.info.APPINFO.USER.companyId;
      this.http.post(DISPURL.GETQUEUERULECLASSLIST, this.param).then(
        (res:any) => {
          if(res.success){
            this.themArrData = res.data.data.data;
          }
         // console.log(this.themArrData)
          this.rowid = data.data[0].rowid;
          this.modalValidateForm.patchValue(this.themArrData[0]);//将信息显示到弹出窗内
        }
      );

       //.modalValidateForm.patchValue(data.data[0]);

      //优先级
       let queueClass:string;
       this.themeArrP.forEach(element => {
        if(element.itemCname===data.data[0].queueClassName){
         queueClass=element.itemCode;
          console.log(data.data[0].queueClass)//QC02
        }
      })
       this.modalValidateForm.get('queueClass1').setValue(queueClass);
  }

  //"品种可入厂大门"页面
  if(this.carNum==1){

      this.isShow2=true;//修改"可入厂大门"时,有"状态"字段
      this.isTrue2=true;//修改"品种可入厂大门"时,辅助分类不可填
      this.isTrue3=true;//新增"品种可入厂大门"时,"分类名称"不可填

      if(data.data.length <1){
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '请选中一条数据后进行修改!'
        });
        return;
      }
      this.modalFormVisible2 = true;
      this.modalTitle = '品种可入厂大门 > 修改';
      this.status = 'update';

      if(this.modalFormData2.length>3){
        this.modalFormData2.pop();//"状态"修改时,显示
      }
      this.modalFormData2.push(
        {name: '状态', eName:'status2', type: 'select', validateCon: '请输入状态',require:true,
          validators:{
            require: true,
            pattern:false,
          }
        },
      );
      //刷新
      for (let i = 0; i < this.modalFormData2.length; i++) {
        let validatorOrOpts: Array<any> = [];
        if (this.modalFormData2[i].require)
          validatorOrOpts.push(Validators.required);
        this.modalValidateForm2.addControl(this.modalFormData2[i].eName, new FormControl(
          '',validatorOrOpts
        ));
      }


      //this.rowId = data.data[0].rowId;

      //this.status2 = data.data[0].status;
      this.themeArrZ.forEach(element => {
        if(element.itemCname===data.data[0].statusName){
          //this.status2=element.itemCode;
          this.modalValidateForm2.get('status2').setValue(element.itemCode);
        }
      })


      if(data.data.length>=1){
        this.param2.rowid=data.data[0].rowid;
      }
      this.http.post(DISPURL.GETQUEUERULEGATESLIST, this.param2).then(
        (res:any) => {
          if(res.success){
            this.themArrData2 = res.data.data.data;
          }
          this.rowid = data.data[0].rowid;
          this.modalValidateForm2.patchValue(this.themArrData2[0]);//将信息显示到弹出窗内
        }
      );
      //this.modalValidateForm2.patchValue(data.data[0]);

      //入厂大门
      let gateNames:string;
      console.log(data.data[0].gateNames)//新厂
       this.themeArrJ.forEach(element => {
        if(element.itemCname===data.data[0].gateNames){
          gateNames = element.itemCode;
        }
      })
       this.modalValidateForm2.get('gateNames1').setValue(gateNames);

       //车型
       let truckKind:string;
       this.themeArrC.forEach(element => {
        if(element.itemCname===data.data[0].truckKindName){
          truckKind=element.itemCode;
        }
      })
       this.modalValidateForm2.get('truckKind1').setValue(truckKind);
    }
 }


 
  //修改"品种优先级设置"接口方法
updateData1(data: any) {  

  if(this.carNum==0){

      const params = {url: '', data: {}, method: 'POST'};
      params.url = DISPURL.UPDATEQUEUERULE;

      data.enterpriseId =this.info.APPINFO.USER.companyId ;
      // data.revisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
      data.revisor=this.info.APPINFO.USER.name;

      data.rowid = this.rowid;  
      //data.status = this.status1;
      this.themeArrZ.forEach(element => {
        if(element.itemCode===data.status1){
          data.statusName=element.itemCname;
          data.status=element.itemCode;
        }
      });


      data.queueClass = data.queueClass1;
      params.data =data;

      console.log(params,data.queueClass1);

      this.http.request(params).then(
        (res: any) => {
          if (res.success) {
            this.modalFormVisible = false;

            //修改信息成功后弹窗
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '修改成功'
            }); 
            this.destroyTplModal();

            this.isOkLoading = false;

            // 查询
             this.listSearch(params);        
          } else {
            this.isOkLoading = false;
          }
        }
      ) 
    }
  }

  //修改"品种可入厂大门"接口方法
  updateData(data: any) { 
    if(this.carNum==1){
      const params = {url: '', data: {}, method: 'POST'};
      params.url = DISPURL.UPDATEQUEUERULE;

      data.enterpriseId =this.info.APPINFO.USER.companyId ;
      // data.revisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
      data.revisor=this.info.APPINFO.USER.name;
  
      data.rowid = this.rowid;
      //data.status = this.status2;
      this.themeArrZ.forEach(element => {
        if(element.itemCode===data.status2){
          data.statusName=element.itemCname;
          data.status=element.itemCode;
        }
      });

      data.truckKind = data.truckKind1;

      //data.gateNames = data.gateNames1;
      this.themeArrJ.forEach(element => {
        if(element.itemCode===data.gateNames1){
          data.gateNames=element.itemCname;
          data.gateCodes=element.itemCode;
        }
      });

      params.data =data;

      this.http.request(params).then(
        (res: any) => {
          if (res.success) {
            this.modalFormVisible2 = false;

            //修改信息成功后弹窗
            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '修改成功'
            }); 
            this.destroyTplModal();

            this.isOkLoading = false;

            // 查询
            this.listSearch1(params);        
          } else {
            this.isOkLoading = false;
          }
        }
      ) 
    }
  
  }



//作废
data1:any;
//作废时选中的id
updateDataResult(data:any):void {
  console.log(data);
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
      const url = DISPURL.DELETEQUEUERULE;//作废
      const params = { url: url, data: this.data1[0], method: 'POST' };

      this.data1[0].enterpriseId =this.info.APPINFO.USER.companyId ;
      // this.data1[0].revisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
      this.data1[0].revisor=this.info.APPINFO.USER.name;

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

            //查询
            if(this.carNum == 0){
              this.listSearch(params);
            }else if(this.carNum == 1){
              this.listSearch1(params);
            }
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
  if(this.carNum==0){
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


  if(this.carNum==1){
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

}


// 数据弹出框相关
handleOk(): void {
  //新增品种优先级设置
  console.log(this);
  for (const i in this.modalValidateForm.controls) {
    this.modalValidateForm.controls[ i ].markAsDirty();
  }
  if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
    this.isOkLoading = true;
    this.addData1(this.modalValidateForm.value);
  }

  //新增品种可入厂大门
  for (const i in this.modalValidateForm2.controls) {
    this.modalValidateForm2.controls[ i ].markAsDirty();
  }
  if ('VALID' === this.modalValidateForm2.status && 'add' === this.status) {
    this.isOkLoading = true;
    this.addData(this.modalValidateForm2.value);
  }

  //品种优先级设置修改
  for (const i in this.modalValidateForm.controls) {
    this.modalValidateForm.controls[ i ].updateValueAndValidity();
  }
  if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
    this.isOkLoading = true;
    this.updateData1(this.modalValidateForm.value);
  }
  //品种可入厂大门修改
  for (const i in this.modalValidateForm2.controls) {
    this.modalValidateForm2.controls[ i ].updateValueAndValidity();
  }
  if ('VALID' === this.modalValidateForm2.status && 'update' === this.status) {
    this.isOkLoading = true;
    this.updateData(this.modalValidateForm2.value);
  }
}


// 数据弹出框取消
handleCancel(): void {
  this.modalFormVisible = false;
  this.modalFormVisible2 = false;
}

// 数据弹出框取消
closeResult(): void{
  this.modalValidateForm.reset();
  this.modalValidateForm2.reset();

}

 //提示弹窗自动关闭
 destroyTplModal(): void {
  window.setTimeout(() => {
    this.tplModal.destroy();
  }, 1500);
};

}

















