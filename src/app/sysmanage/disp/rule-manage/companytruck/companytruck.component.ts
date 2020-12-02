import { Component, OnInit, ɵConsole } from '@angular/core';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DISPURL } from '../../../../common/model/dispUrl';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';


@Component({
  selector: 'app-companytruck',
  templateUrl: './companytruck.component.html',
  styleUrls: ['./companytruck.component.css']
})

export class CompanytruckComponent implements OnInit {

  constructor(private http: HttpUtilService, private nm: NzModalService,private fb: FormBuilder,private msg: NzMessageService,private modalService: NzModalService,private info: UserinfoService) { }

  modalFormData: Array<any> = [
    {name: '物流公司名称', eName:'companyName', type: 'text', validateCon: '请输入物流公司名称', require:true,
      validators:{
        require: true,
        pattern:false,
      
      }
    },

    {name: '车队名称', eName:'truckTeam', type: 'text', validateCon: '请输入车队名称',require:true,
        validators:{
          require: true,
          pattern:false,
        
        }
     },

    {name: '延迟时间(分)', eName:'delayTime', type: 'text', validateCon: '请输入延迟时间',require:true,
        validators:{
          require: true,
          pattern:false,
        
        }
     },

    {name: '备注', eName:'remark', type: 'text', },

    {name: '状态', eName:'status1', type: 'select', validateCon: '请输入状态',require:true,
      validators:{
        require: true,
        pattern:false,
       
      }
    },

];

modalValidateForm: FormGroup;//弹窗块
 // 数据弹出框
 modalFormVisible = false; // 弹窗可视化
 modalTitle: string; // 弹出框标题
 tplModal: NzModalRef;//操作成功后弹窗属性

listLoading:boolean = true;// 表单加载状态
dataSet: Array<any> = []; // 表单数据
searchData: any;  //存储查询的数据
tempSearchParam:any;

// 页数控制
pageSize:number = 30;//条数
totalPage:number;//数据总条数

private rowId: number;
private status: string ;

status1:any;

isOkLoading:boolean =false;//加载

themArrData:any={};
param: any = {};


ngOnInit() {

  console.dir(this)
  this.getallCodest();//小代码刷新显示
  this.listSearch({ page: 1, length: this.pageSize });

  //数据弹出框初始化
  this.modalValidateForm = this.fb.group({});

  this.modalFormData = this.modalFormData ? this.modalFormData : [];
  for (let i = 0; i < this.modalFormData.length; i++) {
    let validatorOrOpts: Array<any> = [];
    if (this.modalFormData[i].require)
      validatorOrOpts.push(Validators.required);
    
    if (this.modalFormData[i].validators && this.modalFormData[i].validators.pattern)
     validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
    this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
      '',validatorOrOpts
    ));
  }
}

  //小代码选择
  themeArrZ:Array<any>=[];//状态小代码下拉列表
   getallCodest(): void {
     //下拉框
     this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId     }).then(
       (res: any) => {
         if (res.success) {
           res.data.data.forEach(element => {
 
              //数据状态
              if (element.codesetCode == 'disp.status') {
               const item: any = {};
               item.itemCname = element.itemCname;
               item.itemCode = element.itemCode;
               this.themeArrZ.push(item)
             }
           });
         }
       }   
     )
   }
 
 

//查询
// 列表查询数据获取
getListSearch(data: any):void {
  const params = { url: '', data: {}, method: 'POST' };
    params.url = DISPURL.SELECTCOMPANYTRUCK;//查询公司-车队维护关系 
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
    console.log(this.dataSet);
}

    // 列表查询
  listSearch(data:any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.enterpriseId=this.info.APPINFO.USER.companyId;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }

  //新增
  //新增弹框
  btnAdd(data?:any): void {
      this.modalFormVisible = true;
      this.modalTitle = '车队和物流公司关系维护 > 新增';
      this.status = 'add'; 
    
      //"状态"新增时,隐藏
      if(this.modalFormData.length>4){
      this.modalFormData.pop();
      this.modalValidateForm.removeControl('status1');
    }
  }

  themeArr:Array<any>;
  //新增方法
  addData(data?: any) {

    const params = {url: '', data: {companyName:'',truckTeam:'',remark:'',}, method: 'POST'};

    this.modalValidateForm.value.enterpriseId =this.info.APPINFO.USER.companyId ;
    this.modalValidateForm.value.revisor=this.info.APPINFO.USER.name;

    params.url = DISPURL.INSERTCOMPANYTRUCK;//新增公司-车队维护关系
    
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
          this.listSearch(this.searchData);        
        } else {
          this.isOkLoading = false;

        }
      }
    ) 
  }

  //作废
  data1:any;
  //作废时选中的id
  updateDataResult(data:any):void {
    this.data1 = data;
    console.log("this.data1:"+this.data1);
  }

  //作废
  showConfirm(): void {
    if (this.data1[0].statusName == "作废" ) {
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
      
        this.data1[0].revisor=this.info.APPINFO.USER.name;
        console.log( this.data1[0].enterpriseId)
        params.url = DISPURL.DELETECOMPANYTRUCK;//作废公司-车队维护关系
        
        params.data =this.data1[0];

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
 
  if(data.data.length <1){
    this.tplModal = this.nm.info({
      nzTitle: '提示信息',
      nzContent: '请选中一条数据后进行修改!'
    });
    return;
  }

  this.modalFormVisible = true;
  this.modalTitle = '车队和物流公司关系维护 > 修改';
  this.status = 'update';

  //"状态"修改时,显示
  if(this.modalFormData.length>4){
    this.modalFormData.pop();
  }
  this.modalFormData.push(
    {name: '状态', eName:'status1', type: 'select', validateCon: '请输入状态',require:true,
      validators:{
        require: true,
        pattern:false,
       
      }
    },
  );
  
  //刷新(必须有)
  for (let i = 0; i < this.modalFormData.length; i++) {
    let validatorOrOpts: Array<any> = [];
    if (this.modalFormData[i].require)
      validatorOrOpts.push(Validators.required);
    
    if (this.modalFormData[i].validators && this.modalFormData[i].validators.pattern)
     validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
    this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
      '',validatorOrOpts
    ));

  }
  
  // this.status1 = data.data[0].status;

  // this.themeArrZ.forEach(element => {
  //   if(element.itemCname===data.data[0].statusName){
  //      this.status1=element.itemCode;
  //     //  this.status1=element.itemCname;
  //     console.log(this.status1+"显示状态")
  //   }
  // })


  this.themeArrZ.forEach(element => {
    if(element.itemCname===data.data[0].statusName){
      this.modalValidateForm.get('status1').setValue(element.itemCode);
    }
  })
  if(data.data.length>=1){
    this.param.rowId=data.data[0].rowId;
  }
  this.param.enterpriseId=this.info.APPINFO.USER.companyId;
  this.http.post(DISPURL.SELECTCOMPANYTRUCK, this.param).then(
    (res:any) => {
      if(res.success){
        this.themArrData = res.data.data.data;
        console.log(this.themArrData)
      }
      this.rowId = data.data[0].rowId;
      console.log(this.rowId)
      
      this.modalValidateForm.patchValue(this.themArrData[0]);//将信息显示到弹出窗内
    }
  );
      
}


  //修改
  //修改方法
   updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};

    data.revisor=this.info.APPINFO.USER.name;
    data.enterpriseId=this.info.APPINFO.USER.companyId;

    params.url = DISPURL.UPDATECOMPANYTRUCK;//修改公司-车队维护关系
   
    data.rowId = this.rowId;
    this.themeArrZ.forEach(element => {
      if(element.itemCode===data.status1){
        data.statusName=element.itemCname;
        data.status=element.itemCode;
      }
    });
    
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
        }else{
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
      this.addData(this.modalValidateForm.value);
    }
  
   
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[ i ].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.isOkLoading = true;//加载

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
