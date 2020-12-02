import { Component, OnInit } from '@angular/core';
import { HttpUtilService } from "../../../../common/services/http-util.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DISPURL } from '../../../../common/model/dispUrl';
import { UserinfoService } from '../../../../common/services/userinfo-service.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';

@Component({
  selector: 'app-rule-cars',
  templateUrl: './rule-cars.component.html',
  styleUrls: ['./rule-cars.component.css']
})
export class RuleCarsComponent implements OnInit {

  searchData: any;  //存储查询的数据
  listLoading: boolean = true;
  dataSet: any;
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数


  tplModal: NzModalRef;  // 提示弹框
  isOkLoading = false;
  disable:boolean = false; //为了控制更新时下拉列表不可更改
  kindList:Array<any> = [];//品种的下拉列表
  secondList:Array<any> = [];//品种二级下拉列表
  wareHouseList:Array<any> = [];//仓库的下拉列表
  statusList:Array<any> = [];//状态的下拉列表
  gateList:Array<any> = [];//大门的下拉列表
  carNum: number = 0;
  modalValidateForm1: FormGroup; //厂内车辆上限的表单
  modalValidateForm2: FormGroup; //厂内品种车辆上限的表单
  modalValidateForm3: FormGroup; //大门在途车辆上限的表单
  modalValidateForm4: FormGroup; //大门品种在途车辆上限的表单
  modalValidateForm5: FormGroup; //仓库同时卸车上限的表单
  modalFormVisible1 = false;//厂内车辆上限新增和修改弹框提示
  modalFormVisible2 = false;//厂内品种车辆上限新增和修改弹框提示
  modalFormVisible3 = false;//大门在途车辆上限新增和修改弹框提示
  modalFormVisible4 = false;//大门品种在途车辆上限新增和修改弹框提示
  modalFormVisible5 = false;//仓库同时卸车上限新增和修改弹框提示

  tempSearchData:any={}; // 保存查询条件

  modalTitle: string;//弹框的标题
  private status: string;// add添加，update更新
  private rowid: number;//记录rowid;
  param: any = {};
  updateSet:any={};

  modalFormData1: Array<any> = [//厂内车辆上限设置的弹框元素

    {
      name: '车辆最大数', eName: 'maxCount', type: 'num', validateCon: '请输入车辆最大数', require: true,
      validators: {
        require: true,
        pattern: true,
        patternStr:'[0-9]*[0-9][0-9]*$',
        patternErr:'请输入整数'
      }
    }

  ];
  modalFormData2: Array<any> = [//厂内品种车辆上限设置的弹框元素
    {
      name: '品种名称', eName: 'kindCode', type: 'select', validateCon: '请输入品种名称', require: true,
      validators: {
        require: true,
        pattern: false,
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
    }
  ];
  modalFormData3: Array<any> = [//大门在途车辆上限设置的弹框元素
    {
      name: '进厂大门', eName: 'gateCode', type: 'select1', validateCon: '请输入进厂大门', require: true,
      validators: {
        require: true,
        pattern: false,
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
    }
  ];
  modalFormData4: Array<any> = [//大门品种在途车辆上限设置弹框元素
    {
      name: '进厂大门', eName: 'gateCode', type: 'select1', validateCon: '请输入进厂大门', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '品种名称', eName: 'kindCode', type: 'select', validateCon: '请输入品种名称', require: true,
      validators: {
        require: true,
        pattern: false,
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
    }
  ];
  modalFormData5: Array<any> = [//仓库同时卸车上限设置弹框元素

    {
      name: '仓库名称', eName: 'warehouseCode', type: 'select2', validateCon: '请输入仓库名称', require: true,
      validators: {
        require: true,
        pattern: false,
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
    }
  ];

  expandKeys = [ ];

  nodes = [ ];

 
  constructor(private fb: FormBuilder, private modal: NzModalService, private http: HttpUtilService, private info: UserinfoService) { }

  onChange($event: string): void {
    //console.log($event);
  }

  ngOnInit() {
    //console.log(this.kindList);
    //console.log(this.secondList);
    this.listSearch({ page: 1, length: this.pageSize });
    this.getCodeset();
    this.getWarehouse();
    this.modalValidateForm1 = this.fb.group({});
    //this.modalFormData = this.modalFormData1;//初始化第一个tab页
    //this.modalFormData = this.modalFormData ? this.modalFormData : [];
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

    this.modalValidateForm3 = this.fb.group({});
    for (let i = 0; i < this.modalFormData3.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData3[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData3[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData3[i].validators.patternStr));
      this.modalValidateForm3.addControl(this.modalFormData3[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }

    this.modalValidateForm4 = this.fb.group({});
    for (let i = 0; i < this.modalFormData4.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData4[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData4[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData4[i].validators.patternStr));
      this.modalValidateForm4.addControl(this.modalFormData4[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }

    this.modalValidateForm5 = this.fb.group({});
    for (let i = 0; i < this.modalFormData5.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData5[i].require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData5[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData5[i].validators.patternStr));
      this.modalValidateForm5.addControl(this.modalFormData5[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
    
    console.log(this.nodes);
   
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex1(page: any): void {
    this.tempSearchData.page = page;
    this.tempSearchData.ruleType = 1;
    this.getListSearch(this.tempSearchData);
    // this.getListSearch({ page: page, length: this.pageSize ,ruleType:1});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize1(pageSize: any): void {
    this.tempSearchData.page = 1;
    this.tempSearchData.length = pageSize;
    this.tempSearchData.ruleType = 1;
    this.getListSearch(this.tempSearchData);
    // this.pageSize = pageSize;
    // this.getListSearch({ page: 1, length: this.pageSize ,ruleType:1});
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex2(page: any): void {
    this.tempSearchData.page = page;
    this.tempSearchData.ruleType = 2;
    this.getListSearch(this.tempSearchData);
    // this.getListSearch({ page: page, length: this.pageSize ,ruleType:2});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize2(pageSize: any): void {
    this.tempSearchData.page = 1;
    this.tempSearchData.length = pageSize;
    this.tempSearchData.ruleType = 2;
    this.getListSearch(this.tempSearchData);
    // this.pageSize = pageSize;
    // this.getListSearch({ page: 1, length: this.pageSize ,ruleType:2});
  }

/**
   * 当前页码变化
   * @param page
   */
  getPageIndex3(page: any): void {
    this.tempSearchData.page = page;
    this.tempSearchData.ruleType = 3;
    this.getListSearch(this.tempSearchData);
    //this.getListSearch({ page: page, length: this.pageSize ,ruleType:3});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize3(pageSize: any): void {
    this.tempSearchData.page = 1;
    this.tempSearchData.length = pageSize;
    this.tempSearchData.ruleType = 3;
    this.getListSearch(this.tempSearchData);
    // this.pageSize = pageSize;
    // this.getListSearch({ page: 1, length: this.pageSize ,ruleType:3});
  }

  /**
   * 当前页码变化
   * @param page
   */
  getPageIndex4(page: any): void {
    this.tempSearchData.page = page;
    this.tempSearchData.ruleType = 4;
    this.getListSearch(this.tempSearchData);
    // this.getListSearch({ page: page, length: this.pageSize ,ruleType:4});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize4(pageSize: any): void {
    this.tempSearchData.page = 1;
    this.tempSearchData.length = pageSize;
    this.tempSearchData.ruleType = 4;
    this.getListSearch(this.tempSearchData);
    // this.pageSize = pageSize;
    // this.getListSearch({ page: 1, length: this.pageSize ,ruleType:4});
  }

   /**
   * 当前页码变化
   * @param page
   */
  getPageIndex5(page: any): void {
    this.tempSearchData.page = page;
    this.tempSearchData.ruleType = 5;
    this.getListSearch(this.tempSearchData);
    // this.getListSearch({ page: page, length: this.pageSize ,ruleType:5});
  }

  /**
   * 每页展示条数变化
   * @param pageSize
   */
  getPageSize5(pageSize: any): void {
    this.tempSearchData.page = 1;
    this.tempSearchData.length = pageSize;
    this.tempSearchData.ruleType = 5;
    this.getListSearch(this.tempSearchData);
    // this.pageSize = pageSize;
    // this.getListSearch({ page: 1, length: this.pageSize ,ruleType:5});
  }

  listSearch(data: any) { //查询厂内车辆上限
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.ruleType=1;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }
  listSearch1(data: any) { //查询厂内品种车辆上限
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.ruleType=2;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }
  listSearch2(data: any) { //查询大门车辆在途上限
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.ruleType=3;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }
  listSearch3(data: any) { //查询大门品种在途车辆上限
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.ruleType=4;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }
  listSearch4(data: any) { //查询仓库同时卸车上限
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    data.ruleType=5;
    this.searchData = data;
    this.listLoading = true;
    this.getListSearch(data);
  }

  //小代码
  getCodeset(): void {
    this.http.post(DISPURL.GETAllCODESET, {enterpriseId:this.info.APPINFO.USER.companyId}).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            //debugger;
            if (element.codesetCode == 'disp.status') {
              this.statusList.push(element);
            }
            if (element.codesetCode == 'PZKRCDM') {
              this.gateList.push(element);
            }
            if (element.codesetCode == 'XXPZ') {
              this.kindList.push(element);
            }
          });
        }
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
    this.http.post(DISPURL.GETSECONDkIND, {enterpriseId:this.info.APPINFO.USER.companyId    }).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            this.secondList.push(element);
          });
        }
        
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

        console.log(this.nodes);
      }
    )
  }

  //获取仓库代码
  getWarehouse(): void {
    this.http.post(DISPURL.GETWAREHOUSE, {status:'ST01',enterpriseId:this.info.APPINFO.USER.companyId  }).then(
      (res: any) => {
        if (res.success) {
          res.data.data.forEach(element => {
            this.wareHouseList.push(element);
          });
        }
      }
    )
  }

  //添加
  btnAdd(): void {//tab页不同弹框内容也需要改变
    this.disable=false;
    if (this.carNum === 1) {
      if(this.modalFormData2.length>2){
        this.modalFormData2.pop();//为了去除更新的状态输入框
        this.modalValidateForm2.removeControl('status');
      }
      this.modalFormVisible2 = true;
      this.modalTitle = `厂内品种车辆上限 > 新增`;
    } else if (this.carNum === 2) {
      if(this.modalFormData3.length>2){
        this.modalFormData3.pop();
        this.modalValidateForm3.removeControl('status');
      }
      this.modalFormVisible3 = true;
      this.modalTitle = `大门在途车辆上限 > 新增`;
    } else if (this.carNum === 3) {
      if(this.modalFormData4.length>3){
        this.modalFormData4.pop();
        this.modalValidateForm4.removeControl('status');
      }
      this.modalFormVisible4 = true;
      this.modalTitle = `大门品种在途车辆上限 > 新增`;
    } else {
      if(this.modalFormData5.length>2){
        this.modalFormData5.pop();
        this.modalValidateForm5.removeControl('status');
      }
      this.modalFormVisible5 = true;
      this.modalTitle = `仓库同时卸车上限 > 新增`;
    }
    //console.log(this.modalFormData);
    
    this.status = 'add';
  }

  //当tab页改变时自动查询当前页面的数据
  selectChange(): void {
    //this.removeController();//先移除所有控制器
    if (this.carNum === 0) {
      //this.modalFormData = [...this.modalFormData1];
      this.listSearch({ page: 1, length: this.pageSize });
    } else if (this.carNum === 1) {
      //this.modalFormData = [...this.modalFormData2];
      this.listSearch1({ page: 1, length: this.pageSize });

    } else if (this.carNum === 2) {
      //this.modalFormData = [...this.modalFormData3];
      this.listSearch2({ page: 1, length: this.pageSize });
    } else if (this.carNum === 3) {
      //this.modalFormData = [...this.modalFormData4];
      this.listSearch3({ page: 1, length: this.pageSize });
    } else {
      //this.modalFormData = [...this.modalFormData5];
      this.listSearch4({ page: 1, length: this.pageSize });
    }

    
  }

  //移除所有控制器
  // removeController(): void {
  //   this.modalValidateForm.removeControl('maxCount');
  //   this.modalValidateForm.removeControl('kindCode');
  //   this.modalValidateForm.removeControl('gateCode');
  //   this.modalValidateForm.removeControl('warehouseCode');
  //   this.modalValidateForm.removeControl('status');
  // }


  //更新厂内车辆上限
  btnUpdate(data: any): void {

    if(data.data.length >=1){
      this.param.rowid=data.data[0].rowid;
    }
    this.param.enterpriseId=this.info.APPINFO.USER.companyId;

    this.http.post(DISPURL.SELECTCARLIMITURL, this.param).then(
      (res: any) => {
        if (res.success) {
          this.updateSet = res.data.data.data;
        }

        this.disable=true;
    if (data.data.length < 1) {
      this.tplModal = this.modal.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行操作！'
      });
      this.destroyTplModal();
      return;
    } else {
      if (this.carNum === 0) {
        this.modalValidateForm1.patchValue(this.updateSet[0]);
        this.modalTitle = `厂内车辆上限 > 修改`;
        this.modalFormVisible1 = true;
      } else if (this.carNum === 1) {
        if(this.modalFormData2.length>2){
          this.modalFormData2.pop();//为了防止每次修改按钮都加新元素所以在这里控制下
        }
        this.modalFormData2.push({//后面4个页面的status都要能修改所以为数组加入新元素
          name: '状态', eName: 'status', type: 'select3', validateCon: '请输入状态', require: true,
          validators: {
            require: true,
            pattern: false,
          }
        });
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
        this.modalTitle = `厂内品种车辆上限 > 修改`;  
        this.modalFormVisible2 = true;

      } else if (this.carNum === 2) {
        if(this.modalFormData3.length>2){
          this.modalFormData3.pop();
        }
        this.modalFormData3.push({
          name: '状态', eName: 'status', type: 'select3', validateCon: '请输入状态', require: true,
          validators: {
            require: true,
            pattern: false,
          }
        });
        for (let i = 0; i < this.modalFormData3.length; i++) {
          let validatorOrOpts: Array<any> = [];
          if (this.modalFormData3[i].require)
            validatorOrOpts.push(Validators.required);
          if (this.modalFormData3[i].validators.pattern)
            validatorOrOpts.push(Validators.pattern(this.modalFormData3[i].validators.patternStr));
          this.modalValidateForm3.addControl(this.modalFormData3[i].eName, new FormControl(
            '', validatorOrOpts
          ));
        }
        this.modalValidateForm3.patchValue(this.updateSet[0]);
        this.modalTitle = `大门在途车辆上限 > 修改`;
        this.modalFormVisible3 = true;
      } else if (this.carNum === 3) {
        if(this.modalFormData4.length>3){
          this.modalFormData4.pop();
        }
        this.modalFormData4.push({
          name: '状态', eName: 'status', type: 'select3', validateCon: '请输入状态', require: true,
          validators: {
            require: true,
            pattern: false,
          }
        });
        for (let i = 0; i < this.modalFormData4.length; i++) {
          let validatorOrOpts: Array<any> = [];
          if (this.modalFormData4[i].require)
            validatorOrOpts.push(Validators.required);
          if (this.modalFormData4[i].validators.pattern)
            validatorOrOpts.push(Validators.pattern(this.modalFormData4[i].validators.patternStr));
          this.modalValidateForm4.addControl(this.modalFormData4[i].eName, new FormControl(
            '', validatorOrOpts
          ));
        }
        this.modalValidateForm4.patchValue(this.updateSet[0]);
        this.modalTitle = `大门品种在途车辆上限 > 修改`;
        this.modalFormVisible4 = true;
      } else {
        if(this.modalFormData5.length>2){
          this.modalFormData5.pop();
        }
        this.modalFormData5.push({
          name: '状态', eName: 'status', type: 'select3', validateCon: '请输入状态', require: true,
          validators: {
            require: true,
            pattern: false,
          }
        });
        for (let i = 0; i < this.modalFormData5.length; i++) {
          let validatorOrOpts: Array<any> = [];
          if (this.modalFormData5[i].require)
            validatorOrOpts.push(Validators.required);
          if (this.modalFormData5[i].validators.pattern)
            validatorOrOpts.push(Validators.pattern(this.modalFormData5[i].validators.patternStr));
          this.modalValidateForm5.addControl(this.modalFormData5[i].eName, new FormControl(
            '', validatorOrOpts
          ));
        }
        this.modalValidateForm5.patchValue(this.updateSet[0]);
        this.modalTitle = `仓库同时卸车上限 > 修改`;
        this.modalFormVisible5 = true;
      }

      this.status = 'update';
      this.rowid = data.data[0].rowid;


    }
      }

    )
    
  }

  getListSearch( param: any): void { //获取列表
    this.listLoading = true;
    this.tempSearchData = param;
    param.enterpriseId=this.info.APPINFO.USER.companyId;
    this.http.post(DISPURL.SELECTCARLIMITURL, param).then((res: any) => {
      this.listLoading = false;
      if (res.success) {
        this.dataSet = res.data.data.data;
        this.totalPage = res.data.data.total;
      }
    })
  }

  handleCancel(): void {//新增或修改的关闭
    this.modalFormVisible1 = false;
    this.modalFormVisible2 = false;
    this.modalFormVisible3 = false;
    this.modalFormVisible4 = false;
    this.modalFormVisible5 = false;

  }

  // 修改厂内车辆上限
  updateData(data: any) {
    const params = { url: '', data: {}, method: 'POST' };
    params.url = DISPURL.UPDATECARLIMITURL;
    data.revisor =this.info.APPINFO.USER.name;//传入操作用户
    data.bk1=this.info.APPINFO.USER.userId;
    data.rowid = this.rowid;
    data.enterpriseId=this.info.APPINFO.USER.companyId;
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
          } else if (this.carNum === 2) {
            this.listSearch2(this.searchData);
            this.modalFormVisible3 = false;
          } else if (this.carNum === 3) {
            this.listSearch3(this.searchData);
            this.modalFormVisible4 = false;
          } else {
            this.listSearch4(this.searchData);
            this.modalFormVisible5 = false;
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
    }else if(this.carNum===2){
      for (const i in this.modalValidateForm3.controls) {
        this.modalValidateForm3.controls[i].markAsDirty();
        this.modalValidateForm3.controls[i].updateValueAndValidity();
      }
      if ('VALID' === this.modalValidateForm3.status && 'add' === this.status) {
        this.isOkLoading=true;
        this.addData(this.modalValidateForm3.value);
      }
      if ('VALID' === this.modalValidateForm3.status && 'update' === this.status) {
        this.isOkLoading=true;
        this.updateData(this.modalValidateForm3.value);
      }
    }else if(this.carNum===3){
      for (const i in this.modalValidateForm4.controls) {
        this.modalValidateForm4.controls[i].markAsDirty();
        this.modalValidateForm4.controls[i].updateValueAndValidity();
      }
      if ('VALID' === this.modalValidateForm4.status && 'add' === this.status) {
        this.isOkLoading=true;
        this.addData(this.modalValidateForm4.value);
      }
      if ('VALID' === this.modalValidateForm4.status && 'update' === this.status) {
        this.isOkLoading=true;
        this.updateData(this.modalValidateForm4.value);
      }
    }else if(this.carNum===4){
      for (const i in this.modalValidateForm5.controls) {
        this.modalValidateForm5.controls[i].markAsDirty();
        this.modalValidateForm5.controls[i].updateValueAndValidity();
      }
      if ('VALID' === this.modalValidateForm5.status && 'add' === this.status) {
        this.isOkLoading=true;
        this.addData(this.modalValidateForm5.value);
      }
      if ('VALID' === this.modalValidateForm5.status && 'update' === this.status) {
        this.isOkLoading=true;
        this.updateData(this.modalValidateForm5.value);
      }
    }

    
  }

  closeResult(): void {
    this.modalValidateForm1.reset();
    this.modalValidateForm2.reset();
    this.modalValidateForm3.reset();
    this.modalValidateForm4.reset();
    this.modalValidateForm5.reset();

  }

  addData(data: any) {
    const params = { url: '', data: {}, method: 'POST' };
    this.gateList.forEach(element => {
      if(element.itemCode===data.gateCode){//添加群发数据时把gatename值也带过去
        data.gateName=element.itemCname;
      }
    });
    this.wareHouseList.forEach(element => {
      if(element.warehouseCode===data.warehouseCode){//添加群发数据时把warehouseName值也带过去
        data.warehouseName=element.warehouseName;
      }
    });
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
    data.enterpriseId = this.info.APPINFO.USER.companyId;//传入公司id
    data.revisor = this.info.APPINFO.USER.name;//传入操作用户
    data.bk1=this.info.APPINFO.USER.userId;
    params.url = DISPURL.INSERTVARCARLIMITURL;
    if (this.carNum === 1) {//这里是为了区分加入的数据是什么规则类型
      data.gateCode=0;
      data.ruleType = 2;
    } else if (this.carNum === 2) {
      data.kindCode=0;
      data.ruleType = 3;
    } else if (this.carNum === 3) {
      data.ruleType = 4;
    } else if (this.carNum === 4) {
      data.ruleType = 5;
    }
    params.data = data;
    this.http.request(params).then(
      (res: any) => {
        if (res.success) {
          if (this.carNum === 1) {//和更新的类似
            this.modalFormVisible2 = false;
            this.listSearch1(this.searchData);
          } else if (this.carNum === 2) {
            this.modalFormVisible3 = false;
            this.listSearch2(this.searchData);
          } else if (this.carNum === 3) {
            this.modalFormVisible4 = false;
            this.listSearch3(this.searchData);
          } else if (this.carNum === 4){
            this.modalFormVisible5 = false;
            this.listSearch4(this.searchData);
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

  destroyTplModal(): void {//提示弹窗自动关闭
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };
}
