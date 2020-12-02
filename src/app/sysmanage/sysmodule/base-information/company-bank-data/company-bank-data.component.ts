import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpUtilService} from '../../../../common/services/http-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {UserinfoService} from '../../../../common/services/userinfo-service.service';
import {urls} from '../../../../common/model/url';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-company-bank-data',
  templateUrl: './company-bank-data.component.html',
  styleUrls: ['./company-bank-data.component.css']
})
export class CompanyBankDataComponent implements OnInit {

  modalFormData: Array<any> = [
    {
      name: '公司ID',
      eName: 'plateCompanyId',
      type: 'text',
      validateCon: '请输入界面ID',
      require: true,
      disabled: true,
      hidden: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '公司名称',
      eName: 'plateCompanyName',
      type: 'modal',
      validateCon: '请输入公司名称',
      require: true,
      disabled: false,
      hidden: true,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '业务公司ID', eName: 'companyId', type: 'text', validateCon: '业务公司ID', require: true, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '业务公司名称', eName: 'companyName', type: 'company', validateCon: '请输入公司名称', require: true, disabled: false,
      validators: {
        require: false,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '账户类型', eName: 'accountType', type: 'accountType', validateCon: '请选择账户类型', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '收款单位', eName: 'recName', type: 'recName', validateCon: '请输入收款单位', require: true, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '银行账户', eName: 'account', type: 'text', validateCon: '请输入银行账户', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },


    {
      name: '银行名称', eName: 'bankName', type: 'bankName', validateCon: '请输入银行名称', require: true, disabled: false,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '银行支行名称', eName: 'bankSubbranchName', type: 'bankSubName', validateCon: '请输入银行支行名称', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },

    {
      name: '联行号', eName: 'accountJoint', type: 'text', validateCon: '请输入联行号', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '税号', eName: 'taxNo', type: 'text', validateCon: '请输入税号', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '每月付款限额', eName: 'monthlyLimit', type: 'number', validateCon: '请输入每月付款限额', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '地址', eName: 'address', type: 'text', validateCon: '请输入地址', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '电话', eName: 'tel', type: 'text', validateCon: '请输入电话', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },

    {
      name: '银行省份', eName: 'bankProvince', type: 'province', validateCon: '请选择银行省份', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '银行城市', eName: 'bankCity', type: 'city', validateCon: '请选择银行城市', require: false, disabled: true,
      validators: {
        require: false,
        pattern: false,
      }
    },

    {
      name: '默认结算账户', eName: 'isDef', type: 'radio', validateCon: '请输入联行号', require: false, disabled: false,
      radioArr: [
        {name: '是', value: 1},
        {name: '否', value: 0},
      ],
      validators: {
        require: false,
        pattern: false,
      }
    },
    // {
    //   name: '纳税人识别号', eName: 'taxNo', type: 'text', validateCon: '请输入按钮名称', require: true, disabled: false,
    //   validators: {
    //     require: true,
    //     pattern: false,
    //   }
    // },
    // {
    //   name: '银行简称', eName: 'bankSubname', type: 'text', validateCon: '请输入银行简称', require: false, disabled: false,
    //   validators: {
    //     require: false,
    //     pattern: false,
    //   }
    // },


    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入按钮名称', require: false, disabled: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];

  // 数据弹出框
  modalFormVisible = false; // 表单弹窗
  modalValidateForm: FormGroup;

  // 确认框
  modalTitle: string; // 弹出框标题
  deleteCon: string;
  deleteVisible = false; // 确认弹窗

  pageSize: number = 30; //条数
  dataSet: Array<any> = []; //列表数据
  totalPage: number = 0; //数据总数
  listLoading: boolean = true; //list加载
  searchData: any; // 搜索数据
  selectData: Array<any> = [];

  formIdFindset: any = {formId: 'company_pop', name: '公司名称', parameter: 'companyName', parameterSend: 'companyId'};// formId设置
  plateCompanyFindset: any = {
    formId: 'company_pop',
    name: '业务公司名称',
    parameter: 'companyName',
    parameterSend: 'companyId'
  };// formId设置
  bankFindset: any = {
    formId: 'company_pop_bank',
    name: '银行名称',
    parameter: 'bankName',
    parameterSend: 'bankName',
    url:'selectBankName'
  };
  inputModalModel: string; // 公司名字 输入
  borderRed: boolean = false; // 公司名字输入状态
  companyModel: string; // 业务公司名字 输入
  borderRed2: boolean = false; // 业务公司名字输入状态
  recNameModel: any; //收款单位名字
  recCompanyId: any; //收款单位ID
  borderRed3: boolean = false; // 收款名字输入状态
  companyData: any;
  inpData: any = {};
  bankNameModel:string;
  private rowid: number;
  status: string;
  isLoading = false;
  selectNum:number = 0
  private tplModal: NzModalRef; // 弹窗相关
  bankId:any
  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  selectedCompany: any;


  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  areaArr: Array<any> = [];
  townArr: Array<any> = [];
  bankArr: Array<any> = [];
  bankLoadArr: any[] = [];
  bankSubArr: Array<any> = [];
  bankSubLoadArr: any[] = [];
  accountTypeArr: Array<any> = [];


  constructor(private http: HttpUtilService,
              private nm: NzModalService,
              private fb: FormBuilder,
              private info: UserinfoService,
              private nn: NzNotificationService,
              private angularHttp: HttpClient,) {
  }

  ngOnInit() {
    console.log(this.info)
    this.listSearch({page: 1, length: this.pageSize});
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));

    // 数据弹出框初始化
    this.modalValidateForm = this.fb.group({});
    this.modalFormData = this.modalFormData ? this.modalFormData : [];
    for (let i = 0; i < this.modalFormData.length; i++) {

      let validatorOrOpts: Array<any> = [];
      if (this.modalFormData[i].validators.require) {
        validatorOrOpts.push(Validators.required);
      }
      if (this.modalFormData[i].validators.pattern) {
        validatorOrOpts.push(Validators.pattern(this.modalFormData[i].validators.patternStr));
      }

      this.modalValidateForm.addControl(this.modalFormData[i].eName, new FormControl(
        {value: '', disabled: this.modalFormData[i].disabled}, validatorOrOpts
      ));
      if (this.modalFormData[i].eName === 'companyName') {
        this.modalValidateForm.get('companyName').clearValidators();
      }
    }

    this.getAddressData({level: 'DZDJ10'});
    this.getBank({level:'YHDZ10'});
    this.getStatic(this.accountTypeArr, 'ZHLX');

  }
  bankOpen(flag:boolean){
   // if(!flag){
       this.bankLoadArr = [];
  //  }
    from(this.bankArr).pipe(
      take(30)
    ).subscribe(
       x =>{
         this.bankLoadArr = [...this.bankLoadArr,x];
       }
    )
  }
  /*bankLoadMore(){
     const arr = this.bankArr.slice(this.bankLoadArr.length);
     from(arr).pipe(
       take(30)
     ).subscribe(
       x => {
        this.bankLoadArr = [...this.bankLoadArr,x];
       }
     )
  }*/
  bankFilter(data:string){
    this.bankLoadArr = [];
     const bankLoadArr = this.bankArr.filter((x:any) => x.bankName!=undefined && x.bankName!=null && x.bankName.indexOf(data) != -1);
     from(bankLoadArr).pipe(
      take(30)
      ).subscribe(
        x => {
        this.bankLoadArr = [...this.bankLoadArr,x];
        }
      )
  }
  bankSubOpen(flag:boolean){
  //  // if(!flag){
  //     this.bankSubLoadArr = [];
  // // }
  //  from(this.bankSubArr).pipe(
  //    take(30)
  //  ).subscribe(
  //     x =>{
  //       this.bankSubLoadArr = [...this.bankSubLoadArr,x];
  //     }
  //  )
    this.selectNum = 1;
    if (flag) {
      this.bankSubLoadArr = this.bankSubArr.slice(0, 50);
    }
  }

  bankSubFilter(data:string){
    // this.bankSubLoadArr = [];
    // const bankLoadArr = this.bankSubArr.filter((x:any) => x.bankSubbranchName!=undefined && x.bankSubbranchName!=null && x.bankSubbranchName.indexOf(data) != -1);
    // from(bankLoadArr).pipe(
    //  take(30)
    //  ).subscribe(
    //    x => {
    //    this.bankSubLoadArr = [...this.bankSubLoadArr,x];
    //    }
    //  )
    this.getBank({level: 'YHDZ20', parentCode:this.bankId,bankSubbranchName:data});
  }
  // 列表查询
  listSearch(data: any) {
    this.listLoading = true; //list加载
    data.page = data.page || 1; //最好有
    data.length = data.length || this.pageSize; //最好有
    if (this.permissions && this.selectedCompany) {
      data.agencyCompanyId = this.selectedCompany;
    }
    this.searchData = data;
    this.getListSearch(data);
  }

  btnAdd(): void {
    this.modalFormVisible = true;
    this.modalTitle = '客户结算账户 > 新增';
    this.status = 'add';
    this.modalValidateForm.get('plateCompanyId').setValue(this.permissions && this.selectedCompany ? this.selectedCompany : this.info.get('USER').companyId);
    this.inputModalModel = this.permissions && this.selectedCompany ? this.companyData.companyName : this.info.get('USER').companyName;
    this.modalValidateForm.get('accountType').setValue('B');

  }

  btnUpdate(data: any): void {
    console.log(data)
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
    this.modalTitle = '客户结算账户 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.get('bankSubbranchName').reset({value:null, disabled: false});
    this.modalValidateForm.patchValue(data.data[0]);
    this.inputModalModel = data.data[0].plateCompanyName;
    this.modalValidateForm.get('taxNo').setValue(data.data[0].creditCode);
    this.modalValidateForm.get('address').setValue(data.data[0].companyAddress);
    this.modalValidateForm.get('tel').setValue(data.data[0].companyPhone);
    this.companyModel = data.data[0].companyName;
    this.recNameModel = data.data[0].recCompanyName;
    this.recCompanyId = data.data[0].recCompanyId;
    this.bankLoadArr = [{ bankName: data.data[0].bankName, bankId: data.data[0].bankId }];
    this.bankNameModel = data.data[0].bankName;
    this.getBank({level: 'YHDZ20',parentCode:this.bankArr.filter(x=>x.bankName==data.data[0].bankName)[0].bankId,bankSubbranchName:data.data[0].bankSubbranchName})
  }

  btnDelete(data: any): void {
    if (this.selectData.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选中后进行删除！'
      });
      this.destroyTplModal();
      return;
    }

    this.modalTitle = '提示信息';
    this.deleteVisible = true;
    this.deleteCon = '确定要删除当前记录?';
    this.status = 'delete';
    this.selectData =  data.data;

  }

  /**
   * 按钮点击
   * @param data
   */
  btnClick(data: any) {

    switch (data.type.buttonId) {
      case 'Export':{
        this.btnExport();
      }
        break;

    }
  }


  updateDataResult(data: any): void {
    this.selectData = data;
  }

  // 列表查询数据获取
  getListSearch(data: any): void {
    this.listLoading = true;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}companyBank/getCompnayBank`;
    params.data = data || {};
    this.http.request(params).then(
      (res: any) => {
        this.listLoading = false;
        if (res.success) {
          this.dataSet = res.data.data.data;
          this.totalPage = res.data.data.total;
        }
      }
    );
  }

  // 添加数据
  addData(data: any): void {
    data.recCompanyId = this.recCompanyId;
    let url = `${environment.baseUrl}companyBank/insertBank`;
    let param = data;
    if (this.permissions && this.selectedCompany) {
      param.agencyCompanyId = this.selectedCompany;
    }
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.modalFormVisible = false;
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '添加成功！');
        }
      }
    );
  }

  // 更新数据
  updateData(data: any): void {
    data.recCompanyId = this.recCompanyId;
    let url = `${environment.baseUrl}companyBank/updateBank`;
    let param = data;
    param.rowid = this.rowid;
    // if (this.permissions && this.selectedCompany) {
    //   param.agencyCompanyId = this.selectedCompany;
    // }
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.modalFormVisible = false;
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '修改成功！');
        }
      }
    );
  }

  // 删除数据
  deleteData(): void {
    let url = `${environment.baseUrl}companyBank/deleteCompanyBank`;
    let param: any = {tCompanyBanks: []};
    param.tCompanyBanks = this.selectData;
    // if (this.permissions && this.selectedCompany) {
    //   // param.agencyCompanyId = this.selectedCompany;
    // }
    this.http.post(url, param).then(
      (res: any) => {
        if (res.success) {
          this.modalFormVisible = false;
          this.listSearch(this.searchData);
          this.nn.success('提示消息', '删除成功！');
        }
      }
    );
  }

  // 数据弹出框相关
  handleOk(): void {
    for (const i in this.modalValidateForm.controls) {
      this.modalValidateForm.controls[i].markAsDirty();
      this.modalValidateForm.controls[i].updateValueAndValidity();
      this.borderRed2 = !this.companyModel;
      this.borderRed3 = !this.recNameModel;

    }
    if (this.borderRed2 && this.borderRed3) {
      return;
    }
    if (!this.modalValidateForm.getRawValue().companyId) {
      this.nn.warning('提示消息', '请选择正确业务公司!');
      return;
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
    this.modalValidateForm.get('bankCity').reset({value: null, disabled: true});
    this.companyModel = '';
    this.recCompanyId = '';
    this.recNameModel = '';
    // this.selectData = [];
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

  inpEmit(data: any) {
    this.inpData = data;
    this.modalValidateForm.get('plateCompanyId').setValue(data.inpValue);
  }

  plateCompanyEmit(data: any) {
    // this.inpData = data;
    this.modalValidateForm.get('companyId').setValue(data.inpValue);
    // this.modalValidateForm.get('recCompanyName').setValue(this.companyModel);
    this.recNameModel = data.inpName;
    this.recCompanyId = data.inpValue;
  }

  recNameEmit(data: any) {
    this.modalValidateForm.get('recName').setValue(data.inpName);
    this.recCompanyId = data.inpValue;
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

  addressChange(value, name): void {
    switch (name) {
      case 'DZDJ10': {
        if (value) {
          this.getAddressData({level: 'DZDJ20', parentCode: value});
          this.modalValidateForm.get('bankCity').reset({value: null, disabled: false});
        }
      }
        break;
      case 'DZDJ20': {
        if (value) {
        }
      }
        break;
      case 'DZDJ30': {
        if (value) {
        }
      }
        break;
      case 'DZDJ40': {
      }
        break;
    }
  }
  getAddressData(data): void {
    const param = {level: data.level, parentCode: data.parentCode || ''};
    this.http.post(urls.selectProvices, param).then(
      (res: any) => {
        if (res.success) {
          switch (data.level) {
            case 'DZDJ10': {
              this.provinceArr = res.data.data;
            }
              break;
            case 'DZDJ20': {
              this.cityArr = res.data.data;
            }
              break;
            case 'DZDJ30': {
              this.areaArr = res.data.data;
            }
              break;
            case 'DZDJ40': {
              this.townArr = res.data.data;
            }
              break;
          }
        }
      }
    );
  }

  bankChange(value,name) {
    switch (name) {
      case 'YHDZ10': {
        if (value) {
          for (var i =0;i<this.bankArr.length;i++){
            if (this.bankArr[i].bankName == value){
              this.getBank({level: 'YHDZ20', parentCode: this.bankArr[i].bankId});
              this.modalValidateForm.get('bankSubbranchName').reset({value: null, disabled: false});
              break;
            }
          }


        }

      }
        break;
      case 'YHDZ20': {
        if (value) {
          for (var i =0;i<this.bankSubArr.length;i++){
            if (this.bankSubArr[i].bankSubbranchName == value){
              this.modalValidateForm.get('accountJoint').setValue(this.bankSubArr[i].accountJoint);
              break;
            }
          }
        }
      }
        break;
    }
  };

  getBank(data) { //获取银行名称
    let url;
    let params = {};
    if (data.level === 'YHDZ10') { //获取银行
      url = urls.selectBankBase;
      // params['bankName'] = '中';
    }else if (data.level === 'YHDZ20') {  //获取支行
      url = urls.selectBank;
      params['bankId'] = data.parentCode;
      params['bankSubbranchName'] = data.bankSubbranchName?data.bankSubbranchName:undefined;
    }
    this.http.post(url, params).then(
      (res: any) => {
        if (res.success) {
          if (data.level === 'YHDZ10') {
            this.bankArr = res.data.data;
          }else if(data.level === 'YHDZ20'){
            this.bankSubArr = res.data.data;
            this.bankSubLoadArr = res.data.data.slice(0, 50);
          }

        }
      }
    );
  }
  /**
   * 客户基本信息导出
   */
  btnExport(): void {
    let url: string =urls.companyBankExportExcel;

    this.angularHttp.post(url, this.searchData, {responseType: 'blob'}).subscribe((res: any) => {
      const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.download = `客户结算账户.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    });
  }


  getStatic(data: Array<any>, valueSetCode: string): void {
    this.http.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }

  bankNameEmit(data:any){
    console.log(data);
    this.getBank({level: 'YHDZ20', parentCode: data.selData[0].bankId,bankSubbranchName:data.selData[0].bankSubbranchName});
    this.bankId = data.selData[0].bankId;
    this.modalValidateForm.get('bankSubbranchName').reset({value: null, disabled: false});
    this.modalValidateForm.get('bankSubbranchName').setValue(data.selData[0].bankSubbranchName);
    this.modalValidateForm.get('accountJoint').setValue(data.selData[0].accountJoint);
    console.log(this.modalValidateForm)
  }
  loadMore(){

    let num = 50 * (++this.selectNum);
    if (num > this.bankSubArr.length) {
      num = this.bankSubArr.length;
    }
    const userData = this.bankSubArr.slice(this.bankSubLoadArr.length, num);
    this.bankSubLoadArr = [...this.bankSubLoadArr, ...userData];

  }


}
