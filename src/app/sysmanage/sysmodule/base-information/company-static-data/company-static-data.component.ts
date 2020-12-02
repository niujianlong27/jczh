import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpUtilService} from '@service/http-util.service';
import {NzMessageService, NzModalRef, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {environment} from '@env/environment';
import {UserinfoService} from '@service/userinfo-service.service';
import {urls} from '@model/url';

@Component({
  selector: 'app-company-static-data',
  templateUrl: './company-static-data.component.html',
  styleUrls: ['./company-static-data.component.css']
})
export class CompanyStaticDataComponent implements OnInit {
  inpValidate: any;
  radioArr: Array<any> = [];
  valueId: any;
  name: any = '';
  FormData: any;
  selectList: Array<any> = []; // 选择数据
  showExplainFlag: boolean = false;
  modalFormData: Array<any> = [
    {
      name: '值集ID', eName: 'valueId', type: 'text', validateCon: '请输入值集ID', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '值集代码', eName: 'valueSetCode', type: 'text', validateCon: '请输入值集代码', require: true,
      validators: {
        require: true,
        pattern: false,
        patternStr: '[a-zA-Z0-9]*',
        patternErr: '按钮ID格式不正确，只能填数字或字母'
      }
    },
    {
      name: '值集名称', eName: 'valueSetName', type: 'text', validateCon: '请输入值集名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '值集值', eName: 'value', type: 'text', validateCon: '请输入值集值', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '值集值名称', eName: 'name', type: 'text', validateCon: '请输入值集值名称', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '值集等级', eName: 'grade', type: 'number', validateCon: '请输入值集等级', require: true,
      validators: {
        require: true,
        pattern: false,
      }
    },
    {
      name: '值集父ID', eName: 'relatedCode', type: 'text', validateCon: '请输入值集父ID', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '值集父名称', eName: 'relatedName', type: 'text', validateCon: '请输入按钮名称', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '状态', eName: 'status', type: 'radio', validateCon: '请输入按钮名称', require: false, radioArr: this.radioArr,
      validators: {
        require: false,
        pattern: false,
      }
    },
    {
      name: '备注', eName: 'remark', type: 'text', validateCon: '请输入按钮名称', require: false,
      validators: {
        require: false,
        pattern: false,
      }
    },
  ];

  addModalFormData: Array<any> = [

    {
      name: '常用卸点', eName: 'valueId', type: 'popTwo', validateCon: '', require: true,
      findset: {
        formId: 'point_pop',
        name: '常用卸点',
        parameter: 'address', // 发送请求的参数
        parameterSend: 'locationId',
        url: 'point',

      },
      validate: {validateOpt: 'inpValue', validateCon: '请选择常用卸点'},
      validators: {
        require: true,
        pattern: false,
      }
    }

  ];

  addExcludeDatas: Array<any> = [
    {
      name: '品名', eName: 'name', type: 'text', validateCon: '请输入品名', require: true,
      validators: {
        require: true,
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

  // 表格
  // 页数控制
  pageSize: number = 30;//条数
  totalPage: number;//数据总条数
  listLoading: boolean = true;// 表单加载状态
  dataSet: Array<any> = []; // 表单数据
  selectedData: Array<any> = []; // 选中的数据
  validateForm: FormGroup;
  total: number; // 总数据条数
  tempSearchParam: any;

  private rowid: number;
  private status: string;

  companyData: any;

  permissions: boolean = this.info.get('USER').companyType === 'GSLX10' && this.info.get('USER').companyStatus === 'PTGS10';
  selectedCompany: any;
  private tplModal: NzModalRef; // 弹窗相关

  constructor(private httpUtilService: HttpUtilService, private fb: FormBuilder, private info: UserinfoService, private nm: NzModalService, private nn: NzNotificationService) {
  }

  ngOnInit() {
    if (!this.permissions) {
      this.listSearch({page: 1, length: this.pageSize});
    }
    this.modalValidateForm = this.fb.group({});
    // 数据弹出框初始化
    this.FormData = this.modalFormData ? this.modalFormData : [];
    this.validator();
    this.getStatic(this.radioArr, 'GSZJZT');
  }

  validator(){
    for (let i = 0; i < this.FormData.length; i++) {
      let validatorOrOpts: Array<any> = [];
      if (this.FormData[i].validators.require)
        validatorOrOpts.push(Validators.required);
      if (this.FormData[i].validators.pattern)
        validatorOrOpts.push(Validators.pattern(this.FormData[i].validators.patternStr));
      this.modalValidateForm.addControl(this.FormData[i].eName, new FormControl(
        '', validatorOrOpts
      ));
    }
  }


  // 列表查询数据获取
  getListSearch(data: any): void {
    this.selectList = [];
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}staticCompany/getStaticCompany`;
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

  selected(data) {
   this.selectList = data;
  }


  btnclick(data) {
    let buttonId = data.type.buttonId;
    switch (buttonId) {
      case 'AddCommon':
        this.Addcommon();
        break;
      case 'AddExclude':
        this.AddExclude();
        break;
    }
  }

  Addcommon() {
    this.FormData = this.addModalFormData;
   this.validator();
    this.modalFormVisible = true;
    this.modalTitle = '静态数据 > 新增常用卸点';
    this.status = 'addCommon';
  }

  AddExclude() {
    this.FormData = this.addExcludeDatas;
    this.validator();
    this.modalFormVisible = true;
    this.modalTitle = '静态数据 > 添加排除地磅';
    this.status = 'addExclude';
  }


  // 添加数据
  addData(data: any) {
    const params = {url: '', data: {agencyCompanyId: ''}, method: 'POST'};
    params.url = `${environment.baseUrl}staticCompany/insertStaticCompany`;
    params.data = data;
    if (this.permissions && this.selectedCompany) {
      params.data.agencyCompanyId = this.selectedCompany;
    } else {
      delete params.data.agencyCompanyId;
    }
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '添加成功！');
        }

      }
    );
  }

  // 删除数据
  deleteData() {
    const params = {url: '', data: {tStaticCompanyModels: []}, method: 'POST'};
    params.url = `${environment.baseUrl}staticCompany/deleteStaticCompany`;
    params.data.tStaticCompanyModels = this.selectedData;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.selectedData = [];
          this.listSearch(this.tempSearchParam);
          this.nn.success('提示消息', '删除成功！');
        }

      }
    );
  }

  // 修改数据
  updateData(data: any) {
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}staticCompany/updateStaticCompany`;
    data.rowid = this.rowid;
    params.data = data;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '修改成功！');
        }
      }
    );
  }

  // 添加
  btnAdd(): void {
    this.FormData = this.modalFormData;
    this.validator();

    this.modalFormVisible = true;
    this.modalTitle = '静态数据 > 新增';
    this.selectList.length > 0 && this.modalValidateForm.patchValue(this.selectList[0]);
    this.status = 'add';

  }

  // 修改
  btnUpdate(data: any): void {
    if (!data || data.data.length !== 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择一条数据进行修改！'
      });
      this.destroyTplModal();
      return;
    }

    this.FormData = this.modalFormData;
    this.validator();

    this.modalFormVisible = true;
    this.modalTitle = '静态数据 > 修改';
    this.status = 'update';
    this.rowid = data.data[0].rowid;
    this.modalValidateForm.patchValue(data.data[0]);
  }

  // 删除
  btnDelete(data: any): void {
    if (!data || data.data.length < 1) {
      this.tplModal = this.nm.warning({
        nzTitle: '提示信息',
        nzContent: '请选择数据后进行删除！'
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

  // 服务器返回确认信息处理
  serverReturnInformation(res: any) {
    if (!res.success) {
      this.modalErrorResult(res.msg);
    }
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
      this.addData(this.modalValidateForm.value);
    }
    if ('VALID' === this.modalValidateForm.status && 'update' === this.status) {
      this.updateData(this.modalValidateForm.value);
    }
    this.showExplainFlag = this.inpValidate !== 'VALID' ? true : false;
    if (this.inpValidate == 'VALID' && 'addCommon' === this.status) {
      this.addcommonData(this.modalValidateForm.value);
    }

    if ('VALID' === this.modalValidateForm.status && 'addExclude' === this.status) {
      this.addExcludeData(this.modalValidateForm.value);
    }
  }

  addcommonData(data) {
    let datas = {};
    const params = {url: '', data: {}, method: 'POST'};
    params.url = `${environment.baseUrl}staticCompany/insertCommonLocation`;
    datas['valueSetCode'] = 'CYZCD';
    datas['valueSetName'] = '常用装车点';
    datas['name'] = this.name;
    datas['valueId'] = this.valueId;
    params.data = datas;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '保存成功！');
        }
      }
    );
  }

  addExcludeData(data) {
    let datas = data;
    const params = {url: '', data: {}, method: 'POST'};
    params.url = urls.insertExcludeWeightMachine;
    datas['valueSetCode'] = 'PCDB';
    datas['valueSetName'] = '排除地磅信息';
    params.data = datas;
    this.httpUtilService.request(params).then(
      (res: any) => {
        if (res.success) {
          this.listSearch(this.tempSearchParam);
          this.modalFormVisible = false;
          this.nn.success('提示消息', '保存成功！');
        }
      }
    );
  }

  // 数据弹出框取消
  handleCancel(): void {
    this.modalFormVisible = false;
  }

  // 数据弹出框取消
  closeResult(): void {
    this.modalValidateForm.reset();
    this.name = '';
    this.valueId = '';
    this.inpValidate = '';
    this.showExplainFlag = false;
  }

  destroyTplModal(): void {
    window.setTimeout(() => {
      this.tplModal.destroy();
    }, 3000);
  };

  companyChange(): void {
    this.listSearch({page: 1, length: this.pageSize});
    this.companyData = JSON.parse(sessionStorage.getItem('companyData'));
  }


  getStatic(data: Array<any>, valueSetCode: string): void {
    this.httpUtilService.post(urls.static, {valueSetCode: valueSetCode}).then(
      (res: any) => {
        if (res.success) {
          Array.prototype.push.apply(data, res.data.data.data);
        }
      }
    );
  }


  /**
   * 公司设置值
   * @param data
   */
  inpEmitTwo(data: any) {
    this.inpValidate = data.inpValidate;
    this.name = data.inpName || '';
    this.valueId = data.inpValue || '';
    data.selData && data.selData[0] && this.modalValidateForm.get('valueId').setValue(data.selData[0].companyId);
  }

}
