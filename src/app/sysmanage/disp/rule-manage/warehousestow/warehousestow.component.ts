import { Component, OnInit } from '@angular/core';
import { DISPURL } from '../../../../common/model/dispUrl';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-warehousestow',
  templateUrl: './warehousestow.component.html',
  styleUrls: ['./warehousestow.component.css']
})
export class WarehousestowComponent implements OnInit {

  carNum: number = 0;
  searchData: any;  //存储查询的数据
  listLoading: boolean = true;
  dataSet: any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  tplModal: NzModalRef;  // 提示弹框

  statusList:Array<any> = [];//状态的下拉列表
  warehouseTypeList:Array<any> = [];//供应商类型下拉列表
  warehouseNameList:Array<any> = [];//供应商名字下拉列表
  
  param: any = {};
  updateSet:any={};
  isOkLoading = false;
  modalFormVisible = false;//品种供应商关系新增和修改弹框提示
  modalTitle: string;//弹框的标题
  modalValidateForm: FormGroup; //厂内车辆上限的表单
  modalFormData: Array<any> = [];

  modalFormData1: Array<any> = [
   
    {name: '仓库名称', eName:'warehouseName', type: 'text', validateCon: '请输入仓库名称',require:true,
      validators:{
        require: true,
        pattern:false,
       
      }
    },
     
    {name: '仓库类型',  eName: 'kindName', type: 'warehouseTypeSelect', validateCon: '请输入仓库类型', require: true,
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
   
  {name: '仓库名称', eName:'warehouseCode', type: 'warehouseSelect', validateCon: '请输入仓库名称',require:true,
    validators:{
      require: true,
      pattern:false,
     
    }
  },
   
  {name: '装载位名称',  eName: 'stowName', type: 'StowText', validateCon: '请输入装载位名称', require: true,
      validators:{
      require: true,
      pattern:false,
     }
  },

  {
    name: '序号', eName: 'sortId', type: 'sortText', validateCon: '请输入序号', require: true,
    validators: {
      require: true,
      pattern: false,
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
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData1;//初始化第一个tab页
    
    for (let i = 0; i < this.modalFormData.length; i++) {
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

  listSearch(data: any) { //查询仓库
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    //data.ruleType=1;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }
  listSearch1(data: any) { //查询装载位
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    //data.ruleType=2;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch1(data);
  }

  getListSearch( param: any): void { //获取列表
    this.listLoading = true;
    param.enterpriseId=this.info.APPINFO.USER.companyId;
    this.http.post(DISPURL.GETWAREHOUSELIST, param).then((res: any) => {
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
    this.http.post(DISPURL.GETWAREHOUSESTOW, param).then((res: any) => {
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
            if (element.codesetCode == 'LX') {
              this.warehouseTypeList.push(element);
            }
          });
        }
       }
    )
  }

  //获取成品仓库代码
  getWarehouseRecords(): void {
    this.http.post(DISPURL.GETWAREHOUSE, {status:'ST01',kindName:'WT02',enterpriseId:this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            this.warehouseNameList.push(element);
          });
          console.log(res.data.data);
        }
      }
    )
  }


  btnAdd(): void{
    if (this.carNum === 0) {
      if(this.modalFormData.length>3){
        this.modalFormData.pop();//为了去除更新的状态输入框
        this.modalValidateForm.removeControl('status');
      }
      this.modalTitle = `仓库装载位关系维护 > 新增仓库`;
    } else if (this.carNum === 1) {
      if(this.modalFormData.length>4){
        this.modalFormData.pop();
        this.modalValidateForm.removeControl('status');
      }
      this.modalTitle = `仓库装载位关系维护 > 新增装载位`;
    } 
    this.modalFormVisible = true;
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
      this.showWarehouse(data);
    }else if(this.carNum === 1){
      this.showWarehouseStow(data);
    }
    
  }

  cancellDate:any={};

  showWarehouse(data : any): void{
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
        const url = DISPURL.DELETEWAREHOUSE;//作废
        const params = { url: url, data:{}, method: 'POST' };
        this.cancellDate.rowid = data.data[0].rowid
        this.cancellDate.warehouseCode=data.data[0].warehouseCode;
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

  showWarehouseStow(data : any): void{
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
        const url = DISPURL.DELETEWAREHOUSESTOW;//作废
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
      this.http.post(DISPURL.GETWAREHOUSELIST, this.param).then(
        (res: any) => {
          if (res.success) {
            this.updateSet = res.data.data.data;
          }
          //this.disable=true;
          if(this.modalFormData.length>3){
            this.modalFormData.pop();//为了防止每次修改按钮都加新元素所以在这里控制下
          }
          this.modalFormData.push({//后面4个页面的status都要能修改所以为数组加入新元素
            name: '状态', eName: 'status', type: 'select1', validateCon: '请输入状态', require: true,
            validators: {
              require: true,
              pattern: false,
            }
          });
          this.modalTitle = `仓库装载位关系维护 > 修改仓库`;  
          this.modalFormVisible = true;
          this.status = 'update';
          this.rowid = data.data[0].rowid;
  
          for (let i = 0; i < this.modalFormData.length; i++) {
            let validatorOrOpts: Array<any> = [];
            if (this.modalFormData[i].require)
              validatorOrOpts.push(Validators.required);
            if (this.modalFormData[i].validators.pattern)
              validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
            this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
              '', validatorOrOpts
            ));
          }
          this.modalValidateForm.patchValue(this.updateSet[0]);
        }
      )
    }else if(this.carNum === 1){
      this.http.post(DISPURL.GETWAREHOUSESTOW, this.param).then(
        (res: any) => {
          if (res.success) {
            this.updateSet = res.data.data.data;
          } 
          //this.disable=true; 
          if(this.modalFormData.length>4){
            this.modalFormData.pop();//为了防止每次修改按钮都加新元素所以在这里控制下
          }
          this.modalFormData.push({//后面4个页面的status都要能修改所以为数组加入新元素
            name: '状态', eName: 'status', type: 'select1', validateCon: '请输入状态', require: true,
            validators: {
              require: true,
              pattern: false,
            }
          });
          this.modalTitle = `仓库装载位关系维护 > 修改装载位`;  
          this.modalFormVisible = true;
          this.status = 'update';
          this.rowid = data.data[0].rowid;
    
          for (let i = 0; i < this.modalFormData.length; i++) {
            let validatorOrOpts: Array<any> = [];
            if (this.modalFormData[i].require)
              validatorOrOpts.push(Validators.required);
            if (this.modalFormData[i].validators.pattern)
              validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
            this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
              '', validatorOrOpts
            ));
          }
          this.modalValidateForm.patchValue(this.updateSet[0]);
      }
        
      )
    }

    
  }

  //当tab页改变时自动查询当前页面的数据
  selectChange(): void {
    this.warehouseNameList=[];
    this.removeController();//先移除所有控制器
    if(this.carNum==0){
      this.modalFormData = this.modalFormData1;
      this.listSearch({ page: 1, length: this.pageSize });
    }
    else if(this.carNum==1){
      this.getWarehouseRecords();
      this.modalFormData = this.modalFormData2;
      this.listSearch1({ page: 1, length: this.pageSize });
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

  //移除所有控制器
  removeController(): void {
    this.modalValidateForm.removeControl('warehouseName');
    this.modalValidateForm.removeControl('kindName');
    this.modalValidateForm.removeControl('warehouseCode');
    this.modalValidateForm.removeControl('remark');
    this.modalValidateForm.removeControl('stowName');
    this.modalValidateForm.removeControl('sortId');
    this.modalValidateForm.removeControl('status');
  }


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

    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.isOkLoading=true;
      this.addData(this.modalValidateForm.value);
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.isOkLoading=true;
      this.updateData(this.modalValidateForm.value);
    }
  }


  addData(data: any) {
    const params = { url: '', data: {enterpriseId:this.info.APPINFO.USER.companyId}, method: 'POST' };
    if(this.carNum==0){
      params.url = DISPURL.INSERTWAREHOUSE;
      data.recCreator = this.info.APPINFO.USER.name;//传入操作用户
    }else if(this.carNum==1){
      this.warehouseNameList.forEach(element => {
        if(element.warehouseCode===data.warehouseCode){
          data.warehouseName=element.warehouseName;
        }
      });
      params.url = DISPURL.INSERTWAREHOUSESTOW;
      data.recRevisor = this.info.APPINFO.USER.name;//传入操作用户
    }
    data.enterpriseId = this.info.APPINFO.USER.companyId;//传入公司id
    data.bk1=this.info.APPINFO.USER.userId;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          if (this.carNum === 0) {//和更新的类似
            this.listSearch(this.searchData);
          } else if (this.carNum === 1) {
            this.listSearch1(this.searchData);
          } 
          this.isOkLoading=false;
          this.modalFormVisible = false;
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
      params.url = DISPURL.UPDATEWAREHOUSE;
      data.recCreator = this.info.APPINFO.USER.name;//传入操作用户
      data.warehouseCode=this.updateSet[0].warehouseCode;
    }else if(this.carNum===1){
      this.warehouseNameList.forEach(element => {
        if(element.warehouseCode===data.warehouseCode){
          data.warehouseName=element.warehouseName;
        }
      });
      params.url = DISPURL.UPDATEWAREHOUSESTOW;
      data.recRevisor = this.info.APPINFO.USER.name;//传入操作用户
    }
    data.bk1=this.info.APPINFO.USER.userId;
    data.rowid = this.rowid;
    data.enterpriseId=this.info.APPINFO.USER.companyId;
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          if (this.carNum === 0) {//更新成功后根据不同的tab页需要重新加载数据
            this.listSearch(this.searchData);
          } else if (this.carNum === 1) {
            this.listSearch1(this.searchData);
          } 
          this.isOkLoading=false;
          this.modalFormVisible = false;
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
    this.modalValidateForm.reset();
  }


  handleCancel(): void {//新增或修改的关闭
    this.modalFormVisible = false;
  }

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  
}
