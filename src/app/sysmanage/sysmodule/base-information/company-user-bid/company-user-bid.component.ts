import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {environment} from '../../../../../environments/environment';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';


@Component({
  selector: 'app-company-user-bid',
  templateUrl: './company-user-bid.component.html',
  styleUrls: ['./company-user-bid.component.css']
})
export class CompanyUserBidComponent implements OnInit {

  modalFormData: Array<any> = [
    {name: '公司ID', eName:'companyId', type: 'hidden', validateCon: '请输入公司ID',require:true, disabled: true,
      validators:{
        require: false,
        pattern:false,
      }
    },{
      name: '公司名称', eName: 'companyName', type: 'modal', validateCon: '请输入按钮ID', require: true, disabled: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {name: '用户ID', eName:'userId', type: 'hidden', validateCon: '请输入用户ID',require:true, disabled: true, 
      validators:{
        require: true,
        pattern:false,
      }
    }, {name: '用户名称', eName:'name', type: 'text1', validateCon: '请输入用户姓名',require:true,
    validators:{
      require: true,
      pattern:false,
    }
  },
    {name: '是否为预招标人', eName:'pretenderFlag', type: 'radio', validateCon: '请选择',require:true,
      validators:{
        require: true,
        pattern:false,
      },
      radioArr:[{
        value:'YZSQ30',
        name:'可投标',
      },
      {value:'YZSQ20',
      name:'可查看',
      },
      {value:'YZSQ10',
        name:'拉黑',
      },
      {value:'YZSQ00',
      name:'否',
    },
    ]
    },
    {name: '是否为竞价人', eName:'tenderFlag', type: 'radio', validateCon: '请选择',require:true,
      validators:{
        require: true,
        pattern:false,
      },
      radioArr:[{
        value:'JJSQ30',
        name:'可竞价',
      },
      {value:'JJSQ20',
      name:'可查看',
      },
      {value:'JJSQ10',
      name:'拉黑',
      },
      {value:'JJSQ00',
      name:'否',
      },

    ]
    },
  ];
  
// 数据弹出框
modalFormVisible = false; // 表单弹窗
modalValidateForm: FormGroup;
// 确认框
modalTitle: string; // 弹出框标题
deleteCon: string;
deleteVisible = false; // 确认弹窗
datavalue:any
// 表格
// 页数控制
pageSize: number = 30;//条数
totalPage: number;//数据总条数
listLoading: boolean = true;// 表单加载状态
dataSet: Array<any> = []; // 表单数据

selectedData: Array<any> = []; // 选中的数据
total: number; // 总数据条数
tempSearchParam: any;

private rowid: number;
status: string;

radioArr:any=[ {value:'1',name:'是'}, {value:'0',name:'否'}]


//用户弹窗控制
isVisible = false; // 控制弹窗
selectedUser:Array<any>=[ {userID:'',name:''}];
 // 选择用户表格变量
 datatmp:Array<any> = [{userID:'',name:''}];
 data:Array<any> = [];
 dataHeader=[
   {eName:'userId',cName:'用户ID',type:'string'},
   {eName:'name',cName:'用户名',type:'string'}
 ];



formIdFindset: any = {url:'companyUserBid' ,formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
inputModalModel: string; // 公司名字 输入
borderRed: boolean = false; // 公司名字输入状态
companyData: any;

permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
inpData: any = {};

selectedCompany: any;
private tplModal: NzModalRef; // 弹窗相关
  constructor(private httpUtilService: HttpUtilService, private fb: FormBuilder, private info: UserinfoService, private nm: NzModalService, private nn: NzNotificationService) { }

  ngOnInit() {
    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require)
        validatorOrOpts.push(Validators.required);
      if (this.modalFormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));

      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        {value: '', disabled: this.modalFormData[i].disabled}, validatorOrOpts
      ));
      if (this.modalFormData[i].eName === 'companyName') {
        this.modalValidateForm.get('companyName').clearValidators();
      }

    }

  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}companyUserBid/getCompanyUserBid`;
    params.data = data;
    this.tempSearchParam = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  // 列表查询
  listSearch(data: any) {
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    if (this.permissions && this.selectedCompany) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.getListSearch(data);
  }

  // 添加数据
  addData(data: any) {
    if (this.permissions && this.selectedCompany) {
      data.agencyCompanyId = this.selectedCompany;
    }
    data.companyName = this.inputModalModel;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}companyUserBid/insertCompanyUserBid`;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        } else {
          this.nn.error('提示消息', "该信息已存在");
        }
      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tCompanyUserBidModels: []}, method: 'POST'};
    params.url = `${environment.baseUrl}companyUserBid/deleteCompanyUserBid`;
    params.data.tCompanyUserBidModels = this.selectedData;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '删除成功！');
        } else {
          this.nn.error('提示消息', '删除失败！');
        }
      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}companyUserBid/updateCompanyUserBid`;
    data.rowid = this.rowid;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        } else {
          this.nn.error('提示消息', '修改失败！');
        }
      }
    );
  }

  // 添加
  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '竞价人选择   > 新增';
    this.status = 'add';
    this.modalValidateForm.get('companyId').setValue(this.permissions && this.selectedCompany ? this.selectedCompany : this.info.get('USER').companyId);
    this.inputModalModel = this.permissions && this.selectedCompany ? this.companyData.companyName : this.info.get('USER').companyName;
  }

  // 修改
  btnUpdate(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后修改！'
      });
      this.destroyTplModal();
      return;
    }
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalFormVisible = true;
    this.modalTitle = '竞价人选择 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
    this.inputModalModel = this.companyData?this.companyData.companyName:this.info.get('USER').companyName;
  }

  // 删除
  btnDelete(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后删除！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除当前记录?';
    this.status = 'delete';
    this.selectedData = data.data;

  }


  // 异常弹出框
  modalErrorResult(data: any) {
    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = `${data}`;
  }

  // 确认框结果
  modalConfirmResult(data: any) {
    if ('ok' === data.type) {
      if ('delete' === this.status) {
        this.deleteData();
        this.status = '';
      }
    }
    this.deleteVisible = false;

  }

  // 数据弹出框相关
  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
    }
    if ('VALID' === this.modalValidateForm.status && 'add' === this.status) {
      this.addData(this.modalValidateForm.getRawValue());
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(this.modalValidateForm.getRawValue());
    }
  }

  // 数据弹出框取消
  handleCancel(): void {
    this.modalFormVisible = false;
  }

  // 数据弹出框取消
  closeResult(): void {
    this.modalValidateForm.reset();
    this.inputModalModel = '';
  }

  inpEmit(data: any) {
    this.inpData = data;
    this.modalValidateForm.get('companyId').setValue(data.inpValue);
    this.datavalue = data.inpValue
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 1500);
  };

  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));
  }

//用户弹窗
Icon() {
    this.isVisible = true;
    this.getCompanyUsers();
}
 // 获取所有用户数据
 getCompanyUsers():void {
  const params = {url: '', data: {}, method: 'POST'};
  params.url = `${environment.baseUrl}companyUserBid/selectUser`;
  params.data = this.companyData||{companyId:this.info.get('USER').companyId};
  params.data['companyId'] = this.datavalue
  console.log(params)


    this.httpUtilService.request(params).then(
    (res:any)=>{
      if (res.success) {
        console.log(res);
        this.data = res.data.data || [];
        this.datatmp = res.data.data || [];
      }
    }
  )
}

handleCancel1(): void {
  this.isVisible = false;
  this.selectedUser = [];
}
handleOk1(): void {
  this.modalValidateForm.get('name').setValue(this.selectedUser[0].name);
  this.modalValidateForm.get('userId').setValue(this.selectedUser[0].userId);
  this.isVisible = false;
}
// 查找
find(data) {
  this.data = this.datatmp.filter(
    value =>
      (value.name||"").split(data).length > 1
  )
}
refreshStatus(): void {
  this.selectedUser = this.data.filter(res=>res.checked)
}
}
