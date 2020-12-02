import { Component, OnInit } from '@angular/core';
import { DISPURL } from '../../../../common/model/dispUrl';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  carNum: number = 0;
  searchData: any;  //存储查询的数据
  listLoading: boolean = true;
  dataSet: any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  tplModal: NzModalRef;  // 提示弹框

  statusList:Array<any> = [];//状态的下拉列表
  vendorTypeList:Array<any> = [];//供应商类型下拉列表
  vendorNameList:Array<any> = [];//供应商名字下拉列表
  kindList:Array<any> = [];//品种的下拉列表
  secondList:Array<any> = [];//二级品种集合

  expandKeys = [ ];
  nodes = [ ];//(树形下拉集合)

  param: any = {};
  updateSet:any={};
  isOkLoading = false;
  modalFormVisible1 = false;//品种供应商关系新增和修改弹框提示
  modalFormVisible2 = false;//品种供应商关系新增和修改弹框提示
  modalTitle: string;//弹框的标题
  modalValidateForm1: FormGroup; //厂内车辆上限的表单
  modalValidateForm2: FormGroup; //厂内车辆上限的表单
  modalFormData: Array<any> = [];

  modalFormData1: Array<any> = [
   
    {name: '供应商名称', eName:'vendorName', type: 'text', validateCon: '请输入供应商名称',require:true,
      validators:{
        require: true,
        pattern:false,
       
      }
    },
     
    {name: '供应商类型',  eName: 'vendorType', type: 'select', validateCon: '请输入供应商类型', require: true,
        validators:{
        require: true,
        pattern:false,
       }
    },

    {name: '备注', eName:'remark', type: 'text1', require:false,
    validators:{
      require: true,
      pattern:false,
     
    }
  },

];

modalFormData2: Array<any> = [
   
  {name: '供应商名称', eName:'vendorCode', type: 'vendorSelect', validateCon: '请输入供应商名称',require:true,
    validators:{
      require: true,
      pattern:false,
     
    }
  },
   
  {name: '品种名称',  eName: 'kindCode', type: 'kindSelect', validateCon: '请输入品种名称', require: true,
      validators:{
      require: true,
      pattern:false,
     }
  },

  {
    name: '车辆最大数', eName: 'maxCount', type: 'num', validateCon: '请输入车辆最大数', require: true,
    validators: {
      require: true,
      pattern: true,
      patternStr:'[0-9]*[0-9][0-9]*$',
      patternErr:'请输入整数'
    }
  },

  {name: '备注', eName:'remark', type: 'text1', require:false,
  validators:{
    require: true,
    pattern:false,
   
  }
},

];
  private status: string;// add添加，update更新
  private rowid: number;//记录rowid;

  constructor(private fb: FormBuilder, private modal: NzModalService, private http: HttpUtilService, private info: UserinfoService) { }

  ngOnInit() {
    this.listSearch({ page: 1, length: this.pageSize });
    this.getCodeset();
    this.modalValidateForm1 = this.fb.group({});
    for (let i = 0; i < this.modalFormData1.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData1[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData1[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData1[i].validators.patternStr));
      this.modalValidateForm1.addControl(this.modalFormData1[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }

    this.modalValidateForm2 = this.fb.group({});
    for (let i = 0; i < this.modalFormData2.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData2[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData2[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData2[i].validators.patternStr));
      this.modalValidateForm2.addControl(this.modalFormData2[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
  }

  listSearch(data: any) { //查询供应商
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.enterpriseId = this.info.APPINFO.USER.companyId;//传入公司id
    //data.ruleType=1;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }
  listSearch1(data: any) { //查询供应商和品种的上限车辆数
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.enterpriseId = this.info.APPINFO.USER.companyId;//传入公司id
    //data.ruleType=2;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch1(data);
  }

  getListSearch( param: any): void { //获取列表
    this.listLoading = true;
    param.enterpriseId=this.info.APPINFO.USER.companyId;
    this.http.post(DISPURL.GETRECORDSVENDOR, param).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data.data;
        this.totalPage = res.data.data.total;
      }
    })
  }

  getListSearch1( param: any): void { //获取列表
    this.listLoading = true;
    param.enterpriseId=this.info.APPINFO.USER.companyId;
    this.http.post(DISPURL.GETRECORDSVENDORKIND, param).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data.data;
        this.totalPage = res.data.data.total;
      }
    })
  }

  onChange($event: string): void {
    //console.log($event);
  }

  //小代码
  getCodeset(): void {
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId    }).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            //debugger;
            if (element.codesetCode == 'disp.status') {
              this.statusList.push(element);
            }
            if (element.codesetCode == 'GYSLX') {
              this.vendorTypeList.push(element);
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
          //console.log(element);
        });
        this.getSecondKind();
       }
    )
  }

    //获取二级品种代码
  getSecondKind(): void {
    this.http.post(DISPURL.GETSECONDkIND, {enterpriseId:this.info.APPINFO.USER.companyId    }).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            this.secondList.push(element);
          });
        }
        //console.log(this.secondList);
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
        //console.log(this.nodes);
      }
    )
  }

  //获取原料供应商代码
  getVendorRecords(): void {
    this.http.post(DISPURL.GETVENDORRECORDS, {status:'ST01',vendorType:'YLGYS',enterpriseId:this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            this.vendorNameList.push(element);
          });
         // console.log(res.data.data);
        }
      }
    )
  }


  btnAdd(): void{
    if (this.carNum === 0) {
      if(this.modalFormData1.length>3){
        this.modalFormData1.pop();//为了去除更新的状态输入框
        this.modalValidateForm1.removeControl('status');
      }
      this.modalFormVisible1 = true;
      this.modalTitle = `供应商基础数据 > 新增`;
    } else if (this.carNum === 1) {
      if(this.modalFormData2.length>4){
        this.modalFormData2.pop();
        this.modalValidateForm2.removeControl('status');
      }
      this.modalFormVisible2 = true;
      this.modalTitle = `供应商品种车辆上限数 > 新增`;
    } 

    this.status = 'add';

  }

  delete(data : any){
    //作废前判断
    if (data.data.length < 1) {
      this.tplModal = this.modal.info({
        nzTitle: '提示信息',
        nzContent: '请选中一条数据后进行作废!'
      });
      this.destroyTplModal();
      return;
      
    }
    // console.log(data.data[0].rowid)
    // console.log(data.data[0].warehouseCode+"this is code")
    //作废方法
    if(this.carNum === 0){
      this.showVendor(data);
    }else if(this.carNum === 1){
      this.showVendorKind(data);
    }
    
  }

  cancellDate:any={};

  showVendor(data : any): void{
    // console.log("进入作废方法");
    // console.log("*"+this.data1[0].status)
    this.cancellDate={};
    if (data.data[0].status == "ST00") {
      this.tplModal = this.modal.info({
        nzTitle: '提示信息',
        nzContent: '此信息已作废,不可操作!'
      });
      this.destroyTplModal();
      return;
    }

    this.modal.confirm({
      nzTitle: '提示信息',
      nzContent: '确定要作废此条记录?',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk:()=>{
        const url = DISPURL.CANCELLATIONVENDOR;//作废
        const params = { url: url, data:{}, method: 'POST' };
        this.cancellDate.rowid = data.data[0].rowid
        this.cancellDate.vendorCode=data.data[0].vendorCode;
        this.cancellDate.recCreator=this.info.APPINFO.USER.name;
        this.cancellDate.enterpriseId=this.info.APPINFO.USER.companyId;

        //console.log(data.warehouseCode+"调用接口之前的code")
        console.log(data);
        params.data =this.cancellDate;
        console.log(params);
        this.http.request(params).then(
          (res: any) => {
            this.listLoading = false;
            if (res.success) {
              //修改信息成功后弹窗
              this.tplModal = this.modal.info({
                nzTitle: '提示信息',
                nzContent: '作废成功'          
              });
              this.destroyTplModal();
              //修改后查询
              this.listSearch({});
            }
          }
        );
      }
    });
  }

  showVendorKind(data : any): void{
    this.cancellDate={};
    if (data.data[0].status == "ST00") {
      this.tplModal = this.modal.info({
        nzTitle: '提示信息',
        nzContent: '此信息已作废,不可操作!'
      });
      this.destroyTplModal();
      return;
    }

    this.modal.confirm({
      nzTitle: '提示信息',
      nzContent: '确定要作废此条记录?',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk:()=>{
        const url = DISPURL.CANCELLATIONVENDORKIND;//作废
        const params = { url: url, data:{}, method: 'POST' };
        this.cancellDate.rowid = data.data[0].rowid
        this.cancellDate.recCreator=this.info.APPINFO.USER.name;
        this.cancellDate.enterpriseId=this.info.APPINFO.USER.companyId;
        //console.log(data.warehouseCode+"调用接口之前的code")
        console.log(data);
        params.data =this.cancellDate;
        console.log(params);
        this.http.request(params).then(
          (res: any) => {
            this.listLoading = false;
            if (res.success) {
              //修改信息成功后弹窗
              this.tplModal = this.modal.info({
                nzTitle: '提示信息',
                nzContent: '作废成功'          
              });
              this.destroyTplModal();
              //修改后查询
              this.listSearch1({});
            }
          }
        );
      }
    });
  }

  btnUpdate(data : any): void{
    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行操作！'
      });
      this.destroyTplModal();
      return;
    }
    if(data.data.length >=1){
      this.param.rowid=data.data[0].rowid;
    }
    this.param.enterpriseId=this.info.APPINFO.USER.companyId;
    if(this.carNum === 0){
      this.http.post(DISPURL.GETRECORDSVENDOR, this.param).then(
        (res: any) => {
          if (res.success) {
            this.updateSet = res.data.data.data;
          }
          //this.disable=true;
          if(this.modalFormData1.length>3){
            this.modalFormData1.pop();//为了防止每次修改按钮都加新元素所以在这里控制下
          }
          this.modalFormData1.push({//后面4个页面的status都要能修改所以为数组加入新元素
            name: '状态', eName: 'status', type: 'select1', validateCon: '请输入状态', require: true,
            validators: {
              require: true,
              pattern: false,
            }
          });
          this.modalTitle = `供应商基础数据 > 修改`;  
          this.modalFormVisible1 = true;
          this.status = 'update';
          this.rowid = data.data[0].rowid;
  
          for (let i = 0; i < this.modalFormData1.length; i++) {
            let validatorOrOpts: Array<any> = [];
            if (this.modalFormData1[i].require)
              validatorOrOpts.push(Validators.required);
            if (this.modalFormData1[i].validators.pattern)
              validatorOrOpts.push(Validators.pattern(this.modalFormData1[i].validators.patternStr));
            this.modalValidateForm1.addControl(this.modalFormData1[i].eName, new FormControl(
              '', validatorOrOpts
            ));
          }
          this.modalValidateForm1.patchValue(this.updateSet[0]);
        }
      )
    }else if(this.carNum === 1){
      this.http.post(DISPURL.GETRECORDSVENDORKIND, this.param).then(
        (res: any) => {
          if (res.success) {
            this.updateSet = res.data.data.data;
          } 
          //this.disable=true; 
          if(this.modalFormData2.length>4){
            this.modalFormData2.pop();//为了防止每次修改按钮都加新元素所以在这里控制下
          }
          this.modalFormData2.push({//后面4个页面的status都要能修改所以为数组加入新元素
            name: '状态', eName: 'status', type: 'select1', validateCon: '请输入状态', require: true,
            validators: {
              require: true,
              pattern: false,
            }
          });
          this.modalTitle = `供应商品种车辆上限数 > 修改`;  
          this.modalFormVisible2 = true;
          this.status = 'update';
          this.rowid = data.data[0].rowid;
    
          for (let i = 0; i < this.modalFormData2.length; i++) {
            let validatorOrOpts: Array<any> = [];
            if (this.modalFormData2[i].require)
              validatorOrOpts.push(Validators.required);
            if (this.modalFormData2[i].validators.pattern)
              validatorOrOpts.push(Validators.pattern(this.modalFormData2[i].validators.patternStr));
            this.modalValidateForm2.addControl(this.modalFormData2[i].eName, new FormControl(
              '', validatorOrOpts
            ));
          }
          this.modalValidateForm2.patchValue(this.updateSet[0]);
      }
        
      )
    }

    
  }

  //当tab页改变时自动查询当前页面的数据
  selectChange(): void {
    this.vendorNameList=[];
    //this.removeController();//先移除所有控制器
    if(this.carNum==0){
      //this.modalFormData = this.modalFormData1;
      this.listSearch({ page: 1, length: this.pageSize });
    }
    else if(this.carNum==1){
      this.getVendorRecords();
      //this.modalFormData = this.modalFormData2;
      this.listSearch1({ page: 1, length: this.pageSize });
    }
  }

  //移除所有控制器
  // removeController(): void {
  //   this.modalValidateForm.removeControl('vendorCode');
  //   this.modalValidateForm.removeControl('vendorName');
  //   this.modalValidateForm.removeControl('vendorType');
  //   this.modalValidateForm.removeControl('remark');
  //   this.modalValidateForm.removeControl('kindCode');
  //   this.modalValidateForm.removeControl('maxCount');
  //   this.modalValidateForm.removeControl('status');
  // }


  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex(page: any): void {
    this.getListSearch({ page: page, length: this.pageSize});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize(pageSize: any): void {
    this.pageSize = pageSize;
    this.getListSearch({ page: 1, length: this.pageSize });
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.getListSearch1({ page: page, length: this.pageSize });
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.pageSize = pageSize;
    this.getListSearch1({ page: 1, length: this.pageSize });
  }


  //弹框的确定按钮触发事件
  handleOk(): void {

    if(this.carNum===0){
      for (const i in this.modalValidateForm1.controls) {
        this.modalValidateForm1.controls[i].markAsDirty();
        this.modalValidateForm1.controls[i].updateValueAndValidity();
      }
      if ('VALID' === this.modalValidateForm1.status && 'add' === this.status) {
        this.isOkLoading=true;
        this.addData(this.modalValidateForm1.value);
      }
      if ('VALID' === this.modalValidateForm1.status && 'update' === this.status) {
        this.isOkLoading=true;
        this.updateData(this.modalValidateForm1.value);
      }
    }else if(this.carNum===1){
      for (const i in this.modalValidateForm2.controls) {
        this.modalValidateForm2.controls[i].markAsDirty();
        this.modalValidateForm2.controls[i].updateValueAndValidity();
      }
      if ('VALID' === this.modalValidateForm2.status && 'add' === this.status) {
        this.isOkLoading=true;
        this.addData(this.modalValidateForm2.value);
      }
      if ('VALID' === this.modalValidateForm2.status && 'update' === this.status) {
        this.isOkLoading=true;
        this.updateData(this.modalValidateForm2.value);
      }
    }

    
  }


  addData(data: any) {
    const params = { url: '', data: {}, method: 'POST' };
    if(this.carNum==0){
      params.url = DISPURL.INSERTVENDOR;
    }else if(this.carNum==1){
      this.vendorNameList.forEach(element => {
        if(element.vendorCode===data.vendorCode){
          data.vendorName=element.vendorName;
        }
      });
      this.kindList.forEach(element => {
        if(element.itemCode===data.kindCode){
          data.kindName=element.itemCname;
        }
      });
      this.secondList.forEach(element => {
        if(element.matKindCode===data.kindCode){//添加群发数据时把matKindName值也带过去
          data.kindName=element.matKindName;
        }
      });
      params.url = DISPURL.INSERTVENDORKIND;
    }
    data.enterpriseId = this.info.APPINFO.USER.companyId;//传入公司id
    data.revisor = this.info.APPINFO.USER.name;//传入操作用户
    data.bk1=this.info.APPINFO.USER.userId;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          if (this.carNum === 0) {//和更新的类似
            this.listSearch(this.searchData);
            this.modalFormVisible1 = false;
          } else if (this.carNum === 1) {
            this.listSearch1(this.searchData);
            this.modalFormVisible2 = false;
          } 
          this.isOkLoading=false;

          this.tplModal = this.modal.warning({
            nzTitle: '提示信息',
            nzContent: '新增成功!'
          });
          this.destroyTplModal();
        }
        this.isOkLoading=false;
      }
    )
  }

  // 修改
  updateData(data: any) {
    const params = { url: '', data: {}, method: 'POST' };
    if(this.carNum===0){
      params.url = DISPURL.UPDATEVENDOR;
      data.vendorCode=this.updateSet[0].vendorCode;
    }else if(this.carNum===1){
      this.vendorNameList.forEach(element => {
        if(element.vendorCode===data.vendorCode){
          data.vendorName=element.vendorName;
        }
      });
      this.kindList.forEach(element => {
        if(element.itemCode===data.kindCode){
          data.kindName=element.itemCname;
        }
      });
      this.secondList.forEach(element => {
        if(element.matKindCode===data.kindCode){//添加群发数据时把matKindName值也带过去
          data.kindName=element.matKindName;
        }
      });
      params.url = DISPURL.UPDATEVENDORKIND;
    }
    data.revisor =this.info.APPINFO.USER.name;//传入操作用户
    data.enterpriseId = this.info.APPINFO.USER.companyId;//传入公司id
    data.bk1=this.info.APPINFO.USER.userId;
    data.rowid = this.rowid;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          if (this.carNum === 0) {//更新成功后根据不同的tab页需要重新加载数据
            this.listSearch(this.searchData);
            this.modalFormVisible1 = false;
          } else if (this.carNum === 1) {
            this.listSearch1(this.searchData);
            this.modalFormVisible2 = false;
          } 
          this.isOkLoading=false;

          this.tplModal = this.modal.warning({
            nzTitle: '提示信息',
            nzContent: '修改成功!'
          });
          this.destroyTplModal();
        }
        this.isOkLoading=false;
      }
    )
  }

  closeResult(): void {
    this.modalValidateForm1.reset();
    this.modalValidateForm2.reset();
  }


  handleCancel(): void {//新增或修改的关闭
    this.modalFormVisible1 = false;
    this.modalFormVisible2 = false;
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  
}
