import { Component, OnInit } from '@angular/core';
import { DISPURL } from '../../../../common/model/dispUrl';
import { HttpUtilService } from '../../../../common/services/http-util.service';
import { NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-matkind',
  templateUrl: './matkind.component.html',
  styleUrls: ['./matkind.component.css']
})
export class MatkindComponent implements OnInit {

  modalFormData: Array<any> = [
    {name: '排队大队名称',  eName: 'kindCode', type: 'select', 
    validators:{
    require: true,
    pattern:false,
   }
    },
    {name: '父类名称',  eName: 'parentName', type: 'text', disable:true,
        validators:{
        require: true,
        pattern:false,
       }
    },
    {name: '子类名称',  eName: 'matKindName', type: 'text', validateCon: '请输入子类名称', require: true,disable:false,
        validators:{
        require: true,
        pattern:false,
       }
    },
    // {name: '物料分类编码',  eName: 'matKindCode', type: 'text', validateCon: '请输入物类分类编码', require: true,
    //     validators:{
    //     require: true,
    //     pattern:false,
    //    }
    // },
  
    {name: '备注',  eName: 'remark', type: 'textarea', validateCon: '请输入', require: false,
        validators:{
        require: true,
        pattern:false,
       }
    },
    {name: '父节点',  eName: 'parent', type: 'text1', validateCon: '', require: false,hidden:true,
        validators:{
        require: false,
        pattern:false,
       }
    }
  ]

  constructor(private fb: FormBuilder,private http: HttpUtilService,private nm: NzModalService,private modalService: NzModalService,private info: UserinfoService ) { console.dir(this) }
  pageSize: number = 30;
  searchData: any;  //存储查询的数据
  listLoading: boolean;
  tempSearchParam: any;
  dataSet: Array<any> = [];//表格里数据
  totalPage: number = 1;
  detail: any = {};
  matKindName:string;
  status:string;
  matKindCode:string;
  kindName:string;
  remark:string;
  isLoading:boolean;
  rowid:number;
  parent:string;
  revisor:string;
  themeArr:Array<any>=[];
  QueueArr:Array<any>=[];
  themeArr3:Array<any>=[];
  Arr:Array<any>;
  kindCode:string;
  enterpriseId:string;
  parentName:string;//父类名称
  tplModal: NzModalRef;//操作成功后弹窗属性
  // 数据弹出框
  InsertFormVisible = false; // 新增弹窗
  UpdateFormVisible = false; // 修改弹窗
  UpdateChildFormVisible = false; // 修改弹窗
  modalTitle: string;//删除弹窗标题
  newItemModaltitle:string;//新增子项标题
  modalFormVisible = false; //新增子项弹框
  modalValidateForm: FormGroup;

  ngOnInit() {
    
    this.listSearch({ page: 1, length: this.pageSize })
    this.getallCodest();
    this.modalValidateForm = this.fb.group({});
    this.modalFormData =  this.modalFormData?this.modalFormData:[];
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts:Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '',validatorOrOpts
      ));
    }
  }

  getallCodest(): void {
    //下拉框
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId    }).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {

            //排队大类名称
            if (element.codesetCode == 'XXPZ') {
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              this.QueueArr.push(item)
            }
             //数据状态
             if (element.codesetCode == 'disp.status') {
              const item: any = {};
              item.itemCname = element.itemCname;
              item.itemCode = element.itemCode;
              this.themeArr3.push(item)
            }

          });
        }
      }   
    )
  }

  //出现新增弹框
  addData(){
    this.InsertFormVisible = true;
    this.detail  = {};
    console.log(this.QueueArr+"this is arr")
  }
  //新增弹框时取消把数据清空
  quitData():void{
    this.matKindCode="";
    this.matKindName="";
    this.remark="";
    this.kindName="";
    this.kindCode="";
    this.InsertFormVisible=false;
  }
  //新增弹框时点击保存
  saveData() {
    
    console.log(this.kindCode+"this is kindcode")
   // console.log(this.QueueArr[0].itemCname+""+this.QueueArr[0].itemCode)
    // let k = this.QueueArr.filter((element:any)=> element.kindCode == this.kindCode);//输入分类名称时,分类编码自动显示出来
    // this.kindName = k[0].kindName;
    for(let i=0;i<this.QueueArr.length;i++){
      if(this.kindCode==this.QueueArr[i].itemCode){
          this.kindName=this.QueueArr[i].itemCname
      }
    }
    if(this.matKindName!=undefined&&this.matKindName!=""&& this.matKindName.length>64){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '输入的物料分类名称请不要超过64位!'
      });
      
      return ;
    }
    console.log(this.kindName);
    if(this.matKindName==undefined||this.matKindName==""||this.kindName==undefined||this.kindName==""){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请把信息填写完整!'
      });
      
      return ;
    }
    const data1 : any ={
      matKindName:this.matKindName,
      matKindCode:this.matKindCode,
      kindName:this.kindName,
      remark:this.remark,
      kindCode:this.kindCode,
      enterpriseId:this.info.APPINFO.USER.companyId,
    }
    data1.enterpriseId =this.info.APPINFO.USER.companyId ;
    data1.revisor=this.info.APPINFO.USER.name;
    console.log(this.kindCode+"this is kindCode")
    console.log("11111"+data1.revisor)
    this.isLoading=true;
    const url =DISPURL.INSERTKINDLIST;
    const params = { url: url, data: data1, method: 'POST' };
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增成功!'
          });
          
        this.isLoading=false;
        this.matKindName="";
        this.matKindCode="";
        this.kindName="";
        this.remark="";
        this.kindCode="";
        this.destroyTplModal();
        console.log("0000000")
           //查询
           this.InsertFormVisible = false;
          this.listSearch(this.searchData);
        } else{
          this.isLoading=false;
        }
      }
    )

  }
  //新增子项时点击取消
  closeResult(): void{
    this.modalValidateForm.reset();
  }

   //获取列表查询数据
   getListSearch(data: any): void {
    const params = { url: '', data: {}, method: 'POST' };
    params.url = DISPURL.GETMATKINDLIST;//查询集合或者对象
    data.enterpriseId=this.info.APPINFO.USER.companyId;
    params.data = data;
    this.tempSearchParam = data;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
         // console.log(res.data.data.data[0]+"this is dataset")
        }
      }
    );
  }
  handleCancel():void{
    this.modalFormVisible = false;
  }
    //新增子项
    btnClick(data: any){
      //this.modalTitle = `新增子项`;
      if (data.data.length < 1) {
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '请选中一条数据后进行新增子项!'
        });
        return;
      }
      this.tableData = data.data;
      this.detail = JSON.parse(JSON.stringify(data.data[0]));
      Object.assign(this.detail, data.data[0]);
      console.dir(this.detail)//将获取到的数据影射到控制台
      console.log(this.detail.isLeaf);
      this.tableData.kindCode=this.detail.kindCode;
      this.tableData.parentName=this.detail.matKindName;
      console.log(this.detail.kindCode+"kindcode")
      console.log(this.parent+"matkindname")
     
      if(this.detail.matKindCode.length>6){
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '当前数据不能新增子项!'
        });
        return;
      }
      if(this.detail.isLeaf=='1'){
        this.modalFormVisible = true;
        this.newItemModaltitle = "物料分类维护 > 新增子项";
        this.status = 'add';
        this.modalValidateForm.patchValue(this.tableData);
        console.log(this.detail+"this is detail")
        console.log(this.modalTitle);
      }else{
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '当前数据不能新增子项!'
          });
        }
    }
   // 列表查询
   listSearch(data: any) { //查询
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }
  tableData ;
  // 修改
  updateData(data: any){
    //修改前判断
    if (data.data.length < 1) {
      this.tplModal = this.nm.info({
        nzTitle: '提示信息',
        nzContent: '请选中一条数据后进行修改!'
      });
    }
    console.log(data.data[0]);
      //this.tableData = data.data;
      //this.detail = JSON.parse(JSON.stringify(data.data[0]));
      //Object.assign(this.detail, data.data[0]);
      //console.dir(this.detail)//将获取到的数据影射到控制台
      const params = { url: '', data: {}, method: 'POST' };
      params.url = DISPURL.GETMATKINDLIST;//查询集合或者对象
      this.detail.rowid=data.data[0].rowid;
      this.detail.enterpriseId=this.info.APPINFO.USER.companyId;
      params.data = this.detail;
      console.log(data.data[0]+"this is data")
      console.log(this.detail+"this is detail")
      this.http.request(params).then(
        (res: any) => {
          if (res.success) {
           this.kindName=res.data.data.data[0].kindName;
           this.kindCode=res.data.data.data[0].kindCode;
           this.status=res.data.data.data[0].status;
           this.remark=res.data.data.data[0].remark;
           this.parentName=res.data.data.data[0].bk3;
           this.rowid=res.data.data.data[0].rowid;
           this.matKindName=res.data.data.data[0].matKindName;
           this.parent=res.data.data.data[0].parent;
           console.log(this.parent)
           if(this.parent){this.UpdateChildFormVisible=true,
            console.log("更新子类")}
          else{this.UpdateFormVisible=true,
            console.log("更新父类")}
          }
        }
      );
      // this.rowid=this.detail.rowid;
      // this.matKindName=this.detail.matKindName;
      // console.log(this.detail.kindName+"name");
      // console.log(this.detail.kindCode+"code");
    }
    handleOk():void{
      
      for (const i in this.modalValidateForm.controls) {
        this.modalValidateForm.controls[ i ].markAsDirty();
        this.modalValidateForm.controls[ i ].updateValueAndValidity();
      }
      if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      for(let i=0;i<this.QueueArr.length;i++){
          if(this.detail.kindCode==this.QueueArr[i].itemCode){
              this.detail.kindName=this.QueueArr[i].itemCname
          }
      }
      this.modalValidateForm.value.parent=this.detail.matKindCode;
      this.modalValidateForm.value.enterpriseId =this.info.APPINFO.USER.companyId ;
      this.modalValidateForm.value.revisor=this.info.APPINFO.USER.name;
      this.modalValidateForm.value.kindName=this.detail.kindName;
      this.modalValidateForm.value.kindCode=this.detail.kindCode;
      console.log(this.detail.kindCode+"code")
      console.log(this.detail.kindName+"name")
      console.log(this.modalValidateForm.value.parent);
      if(this.modalValidateForm.value.remark!=undefined && this.modalValidateForm.value.remark!=''){
        if(this.modalValidateForm.value.remark.length>=20){
          this.tplModal = this.nm.warning({
            nzTitle: '提示信息',
            nzContent: '输入的备注过长'
          });
          
          return;
        }
      }
      this.isLoading=true;
      const params = {url: '', data: {}, method: 'POST'};
      params.url = DISPURL.INSERTKINDLIST;
      this.modalValidateForm.value.enterpriseId=this.info.APPINFO.USER.companyId;
      params.data=this.modalValidateForm.value;
      this.http.request(params).then(
      (res:any) => {
      if (res.success) {
        this.isLoading=false;
        this.listSearch(this.searchData);
        
        // this.listSearch(this.searchData);
        this.modalFormVisible = false;
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '新增成功'          
        });
        this.destroyTplModal();
        //新增后查询
        
      }else{
        this.isLoading=false;
      }
    
    }
  )
    }
  }
  quitEdit(){
    this.matKindCode="";
    this.matKindName="";
    this.remark="";
    this.kindName="";
    this.kindCode="";
    this.UpdateFormVisible=false;
    this.UpdateChildFormVisible=false;
  }
  update(){
    for(let i=0;i<this.QueueArr.length;i++){
      if(this.kindCode==this.QueueArr[i].itemCode){
          this.kindName=this.QueueArr[i].itemCname
      }
  }
  if(this.matKindName.length>64){
    this.tplModal = this.nm.warning({
      nzTitle: '提示信息',
      nzContent: '输入的物料分类名称请不要超过64位'          
    });
    return ;
  }
  if(this.kindName==''||this.matKindName==''||this.kindCode==''||this.status==undefined){
    this.tplModal = this.nm.warning({
      nzTitle: '提示信息',
      nzContent: '请把信息填写完整'          
    });
    return ;
  }
  
    const url = DISPURL.UPDATEKINDLIST;//修改
    const detail : any ={
      kindName:this.kindName,
      remark:this.remark,
      status:this.status,
      rowid:this.rowid,
      kindCode:this.kindCode,
      matKindName:this.matKindName,
      enterpriseId:this.info.APPINFO.USER.companyId,
    }
    console.log(this.kindName+"name");
    console.log(this.kindCode+"code");
    detail.revisor=this.info.APPINFO.USER.name;
    const params = { url: url, data: detail, method: 'POST' };
    console.log(params)
    if(this.remark!=null && this.remark!=''){
      if(this.remark.length>200){
        this.tplModal = this.nm.warning({
          nzTitle: '提示信息',
          nzContent: '输入的备注过长'          
        });
        this.isLoading=false;
        return ;
      }
    }
    this.isLoading=true;
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.UpdateFormVisible = false;
          this.UpdateChildFormVisible = false;
          //修改信息成功后弹窗
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '修改成功'          
          });
          this.destroyTplModal();
          this.isLoading=false;
          this.matKindCode="";
          this.matKindName="";
          this.remark="";
         this.kindName="";
            this.kindCode="";
          //修改后查询
          this.listSearch(this.searchData);
        }else{
          this.isLoading=false;
        }
      }
    );
    
    }
    destroyTplModal(): void {//提示弹窗自动关闭
      window.setTimeout(() => {
        this.tplModal.destroy();
      }, 1500);
    };
}
