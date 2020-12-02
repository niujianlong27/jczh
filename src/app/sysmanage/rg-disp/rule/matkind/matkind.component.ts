import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RGDISPURL } from '../../../../common/model/rgDispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {urls} from '../../../../common/model/url';
import {CommonService} from '@service/common.service';

export interface TreeNodeInterface {
  matKindCode:any;
  matKindName:any;
  kindName:any;
  remark:any;
  status:any;
  revisor:any;
  reviseTime:any
  level: number;
  expand: boolean;
  parent:any
  check:boolean
  children?: TreeNodeInterface[];
}

@Component({
  selector: 'app-matkind',
  templateUrl: './matkind.component.html',
  styleUrls: ['./matkind.component.css']
})


export class MatkindComponent implements OnInit {
  tabs: Array<any> = [];
  searchData: any;  //存储查询的数据
  listLoading: boolean = false;
  dataSet: any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  tplModal: NzModalRef;//操作成功后弹窗属性
  InsertFormVisible = false; // 新增弹窗
  matKindCode:String;
  matKindName:String;
  editCache:{[key:string]:any} = {};//保存取消按钮
  modalValidateForm: FormGroup;//操作代码集弹窗
  remark:String;
  kindName:String;
  kindCode:String;
  modalType:number;
  subKindName:string;
  subKindCode:string;
  QueueArr:Array<any>=[];
  searchId:number;
  matkindcode:string;//设置辅助分类时的编码
  auxiliaryNameArr:Array<any>=[];
  InsertFormVisibleFZ:boolean=false;//新增辅助分类编码弹框
  modalTitleFZ:string;//辅助分类新增标题
  isOkLoading:boolean=false;//辅助分类loading
  Update:boolean = false
  @ViewChild('expandTable') expandTable:ElementRef;
  isAllDisplayDataChecked:boolean = false;
  isIndeterminate :boolean = false;
  ageInputTpl :any  = false
  updateDate:any=[]

  constructor(private fb: FormBuilder,private cm:CommonService,
              private nz:NzNotificationService,
              private modal: NzModalService, private http: HttpUtilService, private info: UserinfoService,private nm: NzModalService,) {

  }


  listOfMapData:any=[]
  kindNameArr:any=[]
  matArr:any=[]
  subArr:any=[]
  kindNameArr1:any = []
  statusArr:any=[]
  modalFormData: Array<any> = [
    {name: '物料分类名称', eName:'matKindName', type: 'input',validateCon: '',require:false,
      validators:{
        require: false,
        pattern:false,
      }
   },
    {name: '排队大类', eName:'kindName', type: 'input', validateCon: '',require:false,
      validators:{
        require: false,
        pattern:false,
      }
    },
    {name: '辅助分类名称', eName:'auxiliary', type: 'select', validateCon: '请输入辅助分类名称',require:false,
    validators:{
      require: true,
      pattern:false,
    }
  },
]

  mapOfExpandedData: { [matKindCode: string]: TreeNodeInterface[] } = {};
  ngOnInit() {
    this.listSearch({});
    // this.getStatic(this.kindNameArr1,'disp.matKind');
    this.getStatic(this.statusArr,'WLFL');
    this.getStatic(this.QueueArr,'disp.matKind');
    this.getArr();//获取辅助分类数组
    this.modalValidateForm = this.fb.group({});
    //this.modalFormData = this.modalFormData1;//初始化第一个tab页
    for (let i = 0; i < this.modalFormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].require)
        validatorOrOpts.push(Validators.required);
      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
    this.http.post(RGDISPURL.GETCODESET,{codesetCode:"disp.matKind"}).then(res=>{
      console.log(res)
      if(res.success){
        res.data.data.forEach(item=>{
          let data={name:'',value:''}
          data.name = item.itemCname
          data.value =item.itemCode;
          this.kindNameArr1 .push(data)
        })
      }
    })
  }

  listSearch(data){
    // data.page = data.page || 1; //最好有
    // data.length = data.length || this.pageSize; //最好有
    console.log(this.auxiliaryNameArr);
    this.getListSearch(data);
  }
  getListSearch(data){
    this.updateDate =[]
    this.Update = false
    this.isAllDisplayDataChecked = false
    this.isIndeterminate = false
    this.listOfMapData = []
    this.mapOfExpandedData = {}
    this.kindNameArr=[]
    this.matArr=[]
    this.subArr=[]
    this.listLoading=true;
    this.http.post(RGDISPURL.MATKINDGETRECORDS, data).then(
     (res: any) => {
       if (res.success) {
        // console.log(res)
         this.listLoading = false;
         this.updateEditCache(res.data.data.data);
         res.data.data.data.forEach(item=>{
           if(item.status =="WLFL10"){
             item.status = '物料启用'
           }else{
             item.status = '物料作废'
           }
            if(item.matKindCode.length==3){
              item.children=[]
              this.kindNameArr.push(item);
            }else
            if(item.matKindCode.length==5){
              item.children=[]
              this.matArr.push(item);
            }else{
              this.subArr.push(item);
            }
         })
         this.matArr.forEach(item=>{
           this.subArr.forEach(item1=>{
             if(item.matKindCode ==item1.matKindCode.substr(0,5)){
               item.children.push(item1)
             }
           })
         })
         this.kindNameArr.forEach(item=>{
           this.matArr.forEach(item1=>{
             if(item.matKindCode ==item1.matKindCode.substr(0,3)){
               item.children.push(item1)
             }
           })
         })
         this.listOfMapData = this.kindNameArr.length>0?this.kindNameArr:(this.matArr.length>0?this.matArr:this.subArr)
         this.listOfMapData.forEach(item => {
           item.parent = 0;
           this.mapOfExpandedData[item.matKindCode] = this.convertTreeToList(item);
         });
          console.log(this.mapOfExpandedData)
          console.log(this.listOfMapData)
         console.log(this.expandTable)
         this.listOfMapData.forEach(data=>{
           this.mapOfExpandedData[data.matKindCode].forEach(item=>{
             // console.log((item.parent && item.parent.expand) || !item.parent,data.matKindCode);
             //console.log(item.parent && item.parent.expand,1,data.matKindCode)
            // console.log(item.parent,data.matKindCode,2,data.matKindCode)
           })
         })
       }
     }
   )

  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.matKindCode === d.matKindCode)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }else{
      if(data.matKindCode.length==5){
        this.listOfMapData.forEach(ele=>{
          this.mapOfExpandedData[ele.matKindCode].forEach(item=>{
            if(item.matKindCode.length ==5){
              if(item.matKindCode!=data.matKindCode){
                item.expand = false;
              }
            }
          })
        })

      }
    }
  }

  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false ,check:false});

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node,check:false });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: any }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.matKindCode]) {
      hashMap[node.matKindCode] = true;
      array.push(node);
    }
  }

   //修改方法
   update(data:any){
    console.log(this.editCache[data])
    // if(this.editCache[data].data .status =='物料启用'){
    //   this.editCache[data].data .status = 'WLFL10'
    // }else{
    //   this.editCache[data].data .status = 'WLFL20'
    // }
    this.kindNameArr1.forEach(item=>{
      if(this.editCache[data].data.kindName ==item.name){
        this.editCache[data].data.kindName = item.value
      }
    })
     this.editCache[data].edit = true;
  }
    //新增子项
    addData(data){
      this.modalType=2;
      this.kindName=data.kindName;
      this.kindCode=data.kindCode;

      this.InsertFormVisible = true;
    }
    btnClick(data:any){
      switch(data.buttonId){
          case 'Add':
            this.adddata()
            break;
        case 'Update':
          this.addUpdate()
          break;
        case 'Save':
          this.addSave()
          break;
        case 'Set':
          this.addSet()
          break;
        case 'Delete':
          this.addDelete()
          break;
        default:
          break;
      }
    }
  updateDate1:any
  addUpdate(){
    if(this.updateDate.length!=1){
      this.nz.error('提示信息','请勾选一条数据');
      return
    }
    this.updateDate1 = this.updateDate[0]
    this.Update = true
    this.update(this.updateDate[0].matKindCode);
  }
  addSave(){
    if(this.updateDate.length!=1){
      this.nz.error('提示信息','请勾选一条数据');
      return
    }
    this.Update = false
    this.saveData1(this.updateDate1.matKindCode)
  }

  addSet(){
    if(this.updateDate.length!=1){
      this.nz.error('提示信息','请勾选一条数据');
      return
    }
   if(this.updateDate[0].matKindCode.length!=14){
     this.nz.error('提示信息','请勾选一条第三级数据');
     return
   }
   this.addFz(this.updateDate[0])
  }

  addDelete(){
    if(this.updateDate.length!=1){
      this.nz.error('提示信息','请勾选一条数据');
      return
    }
    if(this.cm.canOperate(this.updateDate,"status",["物料启用"],"该数据未作废，不能进行删除！")){
      return
    };
    this.deleteData(this.updateDate[0]);
  }

    //新增物料
    adddata(){
      // console.log('123456')
      this.modalType=1;
      this.InsertFormVisible = true;
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
    if(this.matKindName!=undefined&&this.matKindName!=""&& this.matKindName.length>64){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '输入的物料分类名称请不要超过64位!'
      });
      return ;
    }
    if((this.matKindCode!=undefined&&this.matKindCode!="")&&(!(this.matKindCode.length==3 || this.matKindCode.length>5))){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '输入的物料编码有误重新输入!'
      });
      return ;
    }
    // console.log(this.kindName);
    if(this.matKindName==undefined||this.matKindName==""||this.matKindCode==undefined||this.matKindCode==""){
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请把信息填写完整!'
      });
      return ;
    }
    const data1 : any ={
      matKindName:this.matKindName,
      matKindCode:this.matKindCode,
      remark:this.remark,
      kindCode:this.kindCode,
      enterpriseId:this.info.APPINFO.USER.companyId,
    }
        let test:any;
        this.QueueArr.forEach(item=>{
          if(item.value ==this.kindCode){
            test = item .name;
          }
        })
      data1.kindName = test;
    data1.enterpriseId =this.info.APPINFO.USER.companyId ;
    data1.revisor=this.info.APPINFO.USER.name;
    console.log(this.kindCode+"this is kindCode")
    console.log("11111"+data1.revisor)
    this.listLoading=true;
    const url =RGDISPURL.MATKINDINSERT;
    const params = { url: url, data: data1, method: 'POST' };
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          this.tplModal = this.nm.info({
            nzTitle: '提示信息',
            nzContent: '新增成功!'
          });
          this.listSearch({})
        this.listLoading=false;
        this.matKindName="";
        this.matKindCode="";
        this.kindName="";
        this.remark="";
        this.kindCode="";
        this.destroyTplModal();
        console.log("0000000")
           //查询
           this.InsertFormVisible = false;
          // this.listSearch();
        } else{
          this.listLoading=false;
        }
      }
    )

    }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };




  //取消保存
  cancle(data:any){
    if(this.editCache[data].data .status =='WLFL10'){
      this.editCache[data].data .status = '物料启用'
    }else{
      this.editCache[data].data .status = '物料作废'
    }
    this.kindNameArr1.forEach(item=>{
      if(this.editCache[data].data.kindName ==item.value){
        this.editCache[data].data.kindName = item.name
      }
    })
    this.editCache[data].edit = false;
    // const index = this.listOfMapData.findIndex(item => item.matKindCode === data);
    // this.editCache[data] = {
    //   data: { ...this.listOfMapData[index] },
    //   edit: false
    // };
    //this.listSearch({});
  }

  saveData1(data){
    this.editCache[data] .edit = true;
    let param :any = this.editCache[data].data
    param.kindCode  = this.editCache[data].data.kindName
    param.revisor = this.info.APPINFO.USER.name;
     // console.log(data);return;
     // data.kindCode=data.kindName;
          this.http.post(RGDISPURL.MATKINDUPDATE, param).then(
        (res: any) => {
          if (res.success) {

            this.tplModal = this.nm.info({
              nzTitle: '提示信息',
              nzContent: '修改成功'
            });
            this.listSearch({ });
          }
        }
      )
  }

  colName(data: any) {
    console.log(data)
  }


  updateEditCache(data:any): void {
    data.forEach(item => {
      this.editCache[item.matKindCode] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  // 获取静态数据
  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.data.forEach(item => {
            data.push(item)
          })
        }
      }
    );
  }

  getArr(){
    this.http.post(RGDISPURL.GETFZKIND, {}).then(
      (res: any) => {
        if (res.success) {
          console.log(res.data.data)
          res.data.data.forEach(item => {
            this.auxiliaryNameArr.push(item)
          })
        }
      }
    );
  }

  deleteData(data:any){
    console.log(data)
    let param:any={id:data.id}
    this.http.post(RGDISPURL.MATKINDDELETE,param).then(res=>{
      if(res.success){
        this.nz.success('提示信息',res.data.data)
        this.listSearch({});
      }
    })
  }

  //设置辅助分类弹框
  addFz(data:any){
    console.log(data)
    this.searchId=data.id;
    this.matkindcode=data.matKindCode;
    this.modalValidateForm.patchValue(data);
    this.InsertFormVisibleFZ=true;
  }
  closeResult(): void{
    this.modalValidateForm.reset();
  }
  // 数据弹出框取消
  handleCancel(): void {
    this.InsertFormVisibleFZ = false;
  }
  fzChange(data:any){
    this.subKindCode = data;
    this.subKindName = null;
    this.auxiliaryNameArr.forEach(element => {
      if(this.subKindCode == element.codesetCode){
        this.subKindName=element.codesetDesc
      }
    });
    console.log(this.subKindName+ '' +  this.subKindCode);
  }
  handleOk(){

    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if (this.modalValidateForm.status == 'INVALID') {
      return;
    }

  
    this.isOkLoading=true;
    let data:any={};
    data.id=this.searchId;
    data.matKindCode=this.matkindcode;
    data.auxiliary=this.subKindCode;
    data.auxiliaryName=this.subKindName;
    data.revisor=this.info.APPINFO.USER.name;
    this.http.post(RGDISPURL.MATKINDUPDATEFZ,data).then(res=>{
      if(res.success){
        this.tplModal = this.nm.info({
          nzTitle: '提示信息',
          nzContent: '设置辅助分类成功'
        });
        this.InsertFormVisibleFZ=false;
        this.listSearch({});
        this.destroyTplModal();
      }
      this.isOkLoading=false;
    })
  }
  checkAll(value:boolean){
    this.listOfMapData.forEach(data=>{
      this.mapOfExpandedData[data.matKindCode].forEach(item=>{
        item.check = value
        })
    })
    this.refreshStatus();
  }
  refreshStatus(){
    let count =0
    let sumCount  = 0
    let arr :any =[]
    this.listOfMapData.forEach(data=>{
      this.mapOfExpandedData[data.matKindCode].forEach(item=>{
        if(item.check){
          count ++
          arr.push(item)
        }
      })
      sumCount+=this.mapOfExpandedData[data.matKindCode].length
    })
    this.updateDate = arr
    if(count==0){
      this.isAllDisplayDataChecked = false;
      this.isIndeterminate = false;
      return
    }
    if(count<sumCount){
      this.isAllDisplayDataChecked = false;
      this.isIndeterminate = true;
    }else{
      this.isAllDisplayDataChecked = true;
      this.isIndeterminate = false;
    }

  }
}
