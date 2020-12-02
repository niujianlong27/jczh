import { Component, OnInit,ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {environment} from '../../../../../environments/environment';
import { DISPURL } from '../../../../common/model/dispUrl';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';

@Component({
  selector: 'app-codeset',
  templateUrl: './codeset.component.html',
  styleUrls: ['./codeset.component.css']
})
export class CodesetComponent implements OnInit {

  constructor(private http: HttpUtilService, private nm: NzModalService,private fb: FormBuilder,private msg: NzMessageService,private modalService: NzModalService,private info: UserinfoService) { }
  // 代码集
  modalFormData: Array<any> = [
    
      {name: '代码集编码', eName:'codesetCode', type: 'text', validateCon: '请输入代码集编码',require:true,
        validators:{
          require: true,
          pattern:false,
        }
      },
      {name: '代码集名称', eName:'codesetDesc', type: 'text', validateCon: '请输入代码集名称',require:true,
        validators:{
          require: true,
          pattern:false,
         
        }
      },

  ];
  // 子项
  modalFormData2: Array<any> = [
    
    {name: '代码集名称', eName:'codesetCode', type: 'select', validateCon: '请输入代码集名称',require:true,
      validators:{
        require: true,
        pattern:false,
      }
    },
    {name: '代码编码', eName:'itemCode', type: 'text', validateCon: '请输入代码编码',require:true,
      validators:{
        require: true,
        pattern:false,
       
      }
    },
    {name: '代码名称', eName:'itemCname', type: 'text', validateCon: '请输入代码名称',require:true,
      validators:{
        require: true,
        pattern:false,
       
      }
    },

    {name: '序号', eName:'sortId', type: 'text', },

    {name: '备注', eName:'remark', type: 'text', },

    {name: '状态', eName:'status1', type: 'select', validateCon: '请输入状态',require:true,
      validators:{
        require: true,
        pattern:false,
       
      }
    },
    // {name: '状态', eName:'status', type: 'text', },

];

    isShow:boolean;//状态是否隐藏
    isTrue:boolean;//点击修改时,能否修改
    isTrue2:boolean;
    isShow2:boolean;
    isHidden:boolean;

    isOkLoading:boolean =false;//加载

    codesetDesc:any;
    codesetCode:any;
    itemCode:any;
    itemCname:any;
    sortId:any;
    remark:any;

    status1:any;
    codesetDesc1:any;

    searchData: any;  //存储查询的数据
    tplModal: NzModalRef;//操作成功后弹窗属性

    // 数据弹出框
    modalFormVisible = false; // 代码集弹窗
    modalFormVisible2 = false; // 子项弹窗

    modalValidateForm: FormGroup;//新增代码集弹窗
    modalValidateForm2: FormGroup;//新增子项弹窗

    // 确认框
    modalTitle: string; // 弹出框标题
    deleteCon: string;
    deleteVisible = false; // 确认弹窗

    // 表格
    // 页数控制
    pageSize:number = 30;//条数
    totalPage:number;//数据总条数
    listLoading:boolean = true;// 表单加载状态
    dataSet: Array<any> = []; // 表单数据
    selectedData:Array<any> = []; // 选中的数据
    validateForm: FormGroup;
    total:number; // 总数据条数
    tempSearchParam:any;

    private rowId: number;
    private status: string ;

    themArrData:any={};
    param: any = {};

// 列表查询数据获取
getListSearch(data: any):void {
  const params = { url: '', data: {}, method: 'POST' };
    params.url = DISPURL.GETCODESETLIST;//查询集合或者对象
    data.enterpriseId=this.info.APPINFO.USER.companyId;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        console.log(res)
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
        '',validatorOrOpts
      ));
    }

    
  }


  //小代码选择
  themeArrZ:Array<any>=[];//状态小代码下拉列表

  getallCodest(): void {
    //下拉框
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId
    }).then(
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

  
  // 添加代码集
  btnAdd(data?:any): void {
      this.modalFormVisible = true;
      this.modalTitle = '代码管理 > 新增代码集';
      this.status = 'add';
  }

  themeArr:Array<any>;
  // 添加子项
  addChild(data1){
   
    if(data1.type.buttonId === 'AddChild'){
      this.isShow=false;
      this.isTrue=false;
      
      this.isHidden=true;
      this.isTrue2=false;
      this.isShow2=false;
      this.modalFormVisible2 = true;
      this.modalTitle = '代码管理 > 新增子集';
      this.status = 'add2';

      if(this.modalFormData2.length>5){//"状态"新增时,隐藏
      this.modalFormData2.pop();
          this.modalValidateForm2.removeControl('status1');
      }
      data1.enterpriseId=this.info.APPINFO.USER.companyId;

      const params = {url: '', data: {}, method: 'POST'};
      params.url = DISPURL.GETCODESETDESCLIST;//添加种类编码后,在新增子项的下拉选框中动态显示出来
      params.data =data1;
    
      this.http.request(params).then(
        (res: any) => {
          if (res.success) {
            this.themeArr = res.data.data;
            console.log(this.themeArr);      
            //console.log("*"+res.data.data)
            //新增后查询
            //this.listSearch(params);        
          } else {
          }
        }
      ) 
    }  
  }


  

 //新增代码集
  addData(data?: any) {
    const params = {url: '', data: {}, method: 'POST'};

    this.modalValidateForm.value.enterpriseId =this.info.APPINFO.USER.companyId ;
    this.modalValidateForm.value.recCreator=this.info.APPINFO.USER.name;

    params.url = DISPURL.INSERTCODESETDESC;//添加种类编码
    params.data =data;
    
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.modalFormVisible = false;

          //保存信息成功后弹窗
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增代码集成功'
          }); 
          this.destroyTplModal();

          this.isOkLoading = false;

          //新增后查询
          this.listSearch(params);        
        } else {
          this.isOkLoading = false;//直接报错,不加载;
        }
      }
    ) 
   
  }

  //
  //新增子集
  addData2(data?: any) {
    this.isShow2=false;
    const params = {url: '', data: {codesetDesc:data.codesetDesc,codesetCode:data.codesetCode,itemCname:data.itemCname,itemCode:data.itemCode,remark:data.remark,sortId:data.sortId,enterpriseId:this.info.APPINFO.USER.companyId,recRevisor:this.info.APPINFO.USER.name}, method: 'POST'};

    // this.modalValidateForm.value.enterpriseId =this.info.APPINFO.USER.companyId ;
    // this.modalValidateForm.value.recRevisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
    // this.modalValidateForm.value.recRevisor=this.info.APPINFO.USER.name;
    // console.log(data.enterpriseId )
    // console.log(data.recCreator)

    params.url = DISPURL.INSERTCODESET;//添加种类编码

    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.modalFormVisible2 = false;
          //保存信息成功后弹窗
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增子集成功'
          }); 
          this.destroyTplModal();

          this.isOkLoading = false;
          //新增后查询
          this.listSearch(params);        
        } else {
          this.isOkLoading = false;
        }
      }
    ) 
    // this.modalFormVisible2 = true;
    //  data  = {};
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
    //console.log("*"+this.data1[0].status)
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

        params.url = DISPURL.DELETECODESET;//作废
        
        params.data =this.data1[0];
        console.log("params.data:"+params.data)

        this.http.request(params).then(
          (res: any) => {
            this.listLoading = false;

            if (res.success) {

              //修改信息成功后弹窗
              this.tplModal = this.nm.info({
                nzTitle: '提示信息',
                nzContent: '作废成功'          
              });
              this.destroyTplModal();

              //this.isOkLoading = false;

              //修改后查询
              this.listSearch(this.searchData);
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

    const params = {url: '', data: {enterpriseId:this.info.APPINFO.USER.companyId    }, method: 'POST'};
      params.url = DISPURL.GETCODESETDESCLIST;//添加种类编码后,在新增子项的下拉选框中动态显示出来
    
      this.http.request(params).then(
        (res: any) => {
          if (res.success) {
            this.themeArr = res.data.data;
            console.log(this.themeArr);         
          }
        }
      ) 

    console.log(data)
    if(data.data.length <1){
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请选中一条数据后进行修改!'
      });
      return;
    }

    this.isShow=true;
    this.isTrue=true;
    this.isTrue2=true;
    this.isShow2=true;
    this.isHidden=false;
    
    this.modalFormVisible2 = true;
    this.modalTitle = '代码管理 > 修改';
    this.status = 'update';

    if(this.modalFormData2.length>5){
      this.modalFormData2.pop();//"状态"修改时,显示
    }
    this.modalFormData2.push(
      {name: '状态', eName:'status1', type: 'select', validateCon: '请输入状态',require:true,
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
    this.status1 = data.data[0].status;
    this.codesetDesc1 =  data.data[0].codesetDesc;
    console.log("*"+data.data[0].codesetDesc)

    this.themeArrZ.forEach(element => {
      if(element.itemCname===data.data[0].statusName){
        this.status1=element.itemCode;
      }
    })
   
    if(data.data.length>=1){
      this.param.rowId=data.data[0].rowId;
    }
    this.param.enterpriseId=this.info.APPINFO.USER.companyId;

    this.http.post(DISPURL.GETCODESETLIST, this.param).then(
      (res:any) => {
        if(res.success){
          this.themArrData = res.data.data.data;
        }
        this.rowId = data.data[0].rowId;
        console.log(this.rowId)
        this.modalValidateForm2.patchValue(this.themArrData[0]);//将信息显示到弹出窗内
      }
    );

    //this.modalValidateForm2.patchValue(data.data[0]);
  }

  
  //修改
   // 修改数据
   updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};

    data.enterpriseId =this.info.APPINFO.USER.companyId ;
    // data.recRevisor=this.info.APPINFO.USER.userId+"-"+this.info.APPINFO.USER.name;
    data.recRevisor=this.info.APPINFO.USER.name;

    params.url = DISPURL.UPDATECODESET;//添加种类编码
    data.rowId = this.rowId;

    data.status = this.status1;
    data.codesetDesc = this.codesetDesc;
    params.data =data;
    console.log(params)
    
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible2 = false;

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
    //新增代码集
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[ i ].markAsDirty();
      this.modalValidateForm.controls[ i ].updateValueAndValidity();

    }
    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.isOkLoading = true;//加载
      this.addData(this.modalValidateForm.value);
    }

    //新增子集
    for (const i in this.modalValidateForm2.controls) {
      this.modalValidateForm2.controls[ i ].markAsDirty();
      this.modalValidateForm2.controls[ i ].updateValueAndValidity();

    }
    if ('VALID' === this.modalValidateForm2.status && 'add2' === this.status) {
      this.isOkLoading = true;//加载
      this.addData2(this.modalValidateForm2.value);
    }

    for (const i in this.modalValidateForm2.controls) {
      this.modalValidateForm2.controls[ i ].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm2.status && 'update' === this.status) {
      this.isOkLoading = true;//加载
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

  
